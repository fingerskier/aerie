module.exports = (given_path, data='')=>{
	const file_system = require('fs')
	const touch = require('touch')

	// valid data-path = direc.tory.file.line_num
	// data files must be named *.json (but the .json doesn't go in the path)
	const path = given_path.split('.')

	const item = path.pop()
	const filename = path.pop() + '.json'

	const directory = path.join('\\')
	const filepath = `.\\${directory}\\${filename}`

	file_system.readFile(filepath, (error, contents='')=>{
		if (error){
			if (error.errno = -4058) {
				file_system.mkdirSync(directory)
				touch(filepath)
			} else {
				throw error
			}
		}

		let doc = {}

		if (contents.length) doc = JSON.parse(contents.toString())

		if (data) {
			doc[item] = data

			file_system.writeFile(filepath, JSON.stringify(doc), (error)=>{
				if (error) throw error
			})

			return true
		} else {
			return doc[item]
		}
	})
}
