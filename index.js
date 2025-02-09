const express = require('express')
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')

const app = express()
app.use(express.json())

// Morgan logs basic request info to console
app.use(morgan('tiny'))

const DATA_DIR = path.join(__dirname, 'data')
const LOG_FILE = path.join(__dirname, 'transactions.log')

// Serve static dashboard from dashboard/ folder
app.use(express.static('dashboard'))

// improved transaction logging
function logTransaction(req, result, extra) {
  if (extra && extra.error)
    console.error(`[${new Date().toISOString()}]`, 'Error:', extra.error, 'Path:', extra.fullPath)

  let entry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    route: req.originalUrl,
    ip: req.ip,
    query: req.query,
    params: req.params,
    userAgent: req.headers['user-agent'] || '',
    result
  }
  if (extra) Object.assign(entry, extra)

  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n', 'utf8')
  } catch (logErr) {
    console.error('Failed to write transaction log:', logErr)
  }
}

/**
 * getValueByPath interprets any segment that parses as an integer (e.g. '3')
 * as an array index if the current node is an array, else as a string key
 * if the current node is an object.
 */
function getValueByPath(obj, segments) {
  let current = obj

  for (let segment of segments) {
    // attempt to interpret segment as integer
    let idx = parseInt(segment, 10)

    // if not NaN => treat as array index if current is an array,
    // otherwise treat as object key
    if (!Number.isNaN(idx)) {
      if (Array.isArray(current)) {
        if (idx < 0 || idx >= current.length) return undefined
        current = current[idx]
      } else if (current && typeof current === 'object') {
        current = current[segment] // use the string form as a key
      } else {
        return undefined
      }
    } else {
      // normal string property access
      if (current && typeof current === 'object') {
        current = current[segment]
      } else {
        return undefined
      }
    }

    if (current === undefined) return undefined
  }

  return current
}

/**
 * setValueByPath interprets any segment that parses as an integer as an array index
 * if the current node is an array (or we create an array), else treats it as an object key.
 */
function setValueByPath(obj, segments, value) {
  if (!segments || !segments.length) return

  let current = obj

  for (let i = 0; i < segments.length - 1; i++) {
    let seg = segments[i]
    let nextSeg = segments[i + 1]

    let idx = parseInt(seg, 10)

    if (!Number.isNaN(idx)) {
      // numeric segment
      if (Array.isArray(current)) {
        // ensure index is valid, fill with empty if needed
        if (idx < 0) return
        while (current.length <= idx) {
          current.push(null)
        }
        if (current[idx] === null || current[idx] === undefined) {
          // decide if next is an array index or not
          let n = parseInt(nextSeg, 10)
          if (!Number.isNaN(n)) {
            current[idx] = []
          } else {
            current[idx] = {}
          }
        }
        current = current[idx]
      } else {
        // if not array, interpret as object key (string form)
        if (!current || typeof current !== 'object') return
        if (!current[seg]) {
          // decide if next segment is integer => create array, else object
          let n = parseInt(nextSeg, 10)
          if (!Number.isNaN(n)) {
            current[seg] = []
          } else {
            current[seg] = {}
          }
        }
        current = current[seg]
      }
    } else {
      // normal string property
      if (!current[seg]) {
        // decide if next is integer => array or object
        let n = parseInt(nextSeg, 10)
        if (!Number.isNaN(n)) {
          current[seg] = []
        } else {
          current[seg] = {}
        }
      }
      current = current[seg]
    }

    if (!current || typeof current !== 'object') return
  }

  // final segment
  let finalSeg = segments[segments.length - 1]
  let finalIdx = parseInt(finalSeg, 10)

  if (!Number.isNaN(finalIdx)) {
    // numeric key => array index if current is array, else object property
    if (Array.isArray(current)) {
      if (finalIdx < 0) return
      while (current.length <= finalIdx) {
        current.push(null)
      }
      current[finalIdx] = value
    } else {
      current[finalSeg] = value // store under string "3"
    }
  } else {
    // normal property
    current[finalSeg] = value
  }
}

function applyQueryFilters(data, query) {
  if (!query.where) return data
  let [field, val] = query.where.split(',')

  if (Array.isArray(data)) {
    return data.filter(item => item && item[field] == val)
  }
  if (data && data[field] == val) {
    return data
  }
  return null
}

// GET route for reading data, creating file if it doesn't exist
app.get('/data/*', (req, res) => {
  let parts = req.params[0].split('/')
  let fileIndex = parts.findIndex(x => x.endsWith('.json'))
  let fileName

  // figure out which part of the route is the file name
  if (fileIndex < 0) {
    fileName = parts.pop() + '.json'
    fileIndex = parts.length
  } else {
    fileName = parts[fileIndex]
    if (!fileName.endsWith('.json')) fileName += '.json'
  }

  let subDirs = parts.slice(0, fileIndex)
  let leftover = parts.slice(fileIndex + 1)

  // ensure directories exist
  let dirPath = path.join(DATA_DIR, ...subDirs)
  fs.mkdirSync(dirPath, { recursive: true })

  let fullPath = path.join(dirPath, fileName)

  // if the file doesn't exist, create it
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, '{}', 'utf8')
  }

  let data
  try {
    let raw = fs.readFileSync(fullPath, 'utf8')
    data = JSON.parse(raw)
  } catch (readErr) {
    logTransaction(req, null, { error: 'unable to read or parse file', fullPath })
    return res.status(500).json({ error: 'Unable to read or parse JSON file' })
  }

  let result = getValueByPath(data, leftover)
  let filtered = applyQueryFilters(result, req.query)

  logTransaction(req, filtered, { fullPath, leftover })

  if (filtered === undefined) {
    return res.status(404).json({ error: 'Path not found' })
  }

  res.json(filtered)
})

// POST route for creating or updating data
app.post('/data/*', (req, res) => {
  let parts = req.params[0].split('/')
  let fileIndex = parts.findIndex(x => x.endsWith('.json'))
  let fileName

  if (fileIndex < 0) {
    fileName = parts.pop() + '.json'
    fileIndex = parts.length
  } else {
    fileName = parts[fileIndex]
    if (!fileName.endsWith('.json')) fileName += '.json'
  }

  let subDirs = parts.slice(0, fileIndex)
  let leftover = parts.slice(fileIndex + 1)

  let dirPath = path.join(DATA_DIR, ...subDirs)
  fs.mkdirSync(dirPath, { recursive: true })

  let fullPath = path.join(dirPath, fileName)
  let data = {}

  // if file exists, read it; otherwise create
  if (fs.existsSync(fullPath)) {
    try {
      data = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
    } catch (_) {
      logTransaction(req, null, { error: 'invalid json', fullPath })
      return res.status(500).json({ error: 'Invalid JSON in existing file' })
    }
  } else {
    fs.writeFileSync(fullPath, '{}', 'utf8')
  }

  if (!leftover.length) {
    // no leftover path => overwrite entire file
    data = req.body
  } else {
    setValueByPath(data, leftover, req.body)
  }

  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8')

  logTransaction(req, data, { fullPath, leftover })
  res.json({ success: true, message: 'Data updated', filePath: fullPath })
})

let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('server running on port ' + port)
})
