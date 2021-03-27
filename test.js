const {get, set} = require('./tag')('./data')


async function main() {
  /**
   * Every JSON element is a file
   * Every JSON element is an array
   */
  
  // start with retrieving a file
  const testFixed = await get`flarn/gey`
  console.log('test fixed path', testFixed)

  const testGlob = await get`flarn/*ey`
  console.log('test glob path', testGlob)

  const testMap = testGlob.map(X=>X[1].value)
  console.log('test map of glob result', testMap)

  const testGlobTwo = await get`sch*/**`
  console.log('test glob 2', testGlobTwo)
  console.log('test glob 2 map of values', testGlobTwo.map(X=>X.value))

  const testGlobSubDir = await get`sch*/*ib/*e*`
  console.log('test glob sub-dir', testGlobSubDir)


  /**
   / refers to a file-path
   . refers to an object key in the given file
   | refers to an array item at the given index
   */
  const path = 'flarn/ghibbet'
  const key = 'flarn/ghibbet'
  const val = 'amazing'
  const cond = function(el) {return el}
  
  set`${path}.${key} to ${val} if ${cond}`
}


main().then(console.log).catch(console.error)