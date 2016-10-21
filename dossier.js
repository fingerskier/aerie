var fs = require('fs')
var dir = require('path')

module.exports (error, rootPath) => {
	var rootPath = dir.normalize(rootPath || '.')

	return {
		get: (path, cb) => {
			var path = path || '.'

			path = path.split('/')

			var line = path[path.length-1]

			var raw = fs.readFileSync(path)

			// TODO: pull out the ID or line-number
		}
		,
		set: (path, data) => {
			var path = dir.normalize(rootPath + (path || ''))


		}
	}
}
