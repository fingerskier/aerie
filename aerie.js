const file_system = require('fs')
const mkdirp = require('mkdirp')
const touch = require('touch')

module.exports = function(given_path, data=''){
	// valid data-path = direc.tory.file.line_num
	// data files must be named *.json (but the .json doesn't go in the path)
	let this_path = given_path.split('.')

	const item = this_path.pop()
	const filename = this_path.pop() + '.json'

	const directory = this_path.join('\\')
	const filepath = `.\\${directory}\\${filename}`

	mkdirp(directory, function(error){
		if (error) throw error

		touch(filepath)

		file_system.readFile(filepath, function(error, contents=''){
			if (error) throw error

			let doc = {}

			if (contents.length) doc = JSON.parse(contents.toString())

			if (data) {
				doc[item] = data

				file_system.writeFile(filepath, JSON.stringify(doc), (error)=>{
					if (error) throw error

					return true
				})
			} else {
				console.log(doc[item])
			}
		})
	})
}