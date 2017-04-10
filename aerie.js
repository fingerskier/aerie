const file_system = require('fs')
const touch = require('touch')

Main = {
	data(given_path, data='') {
		// valid data-path = direc.tory.file.line_num
		// data files must be named *.json 
		// ...but the .json doesn't go in the path
		// ...the file-ext is handled by the engine
		// const path = given_path.split('.')

		// const item = path.pop()
		// const filename = path.pop() + '.json'

		// const directory = path.join('\\')
		// const filepath = `.\\${directory}\\${filename}`
		const filepath = Main.path(given_path)

		touch(filepath)

		var contents = file_system.readFileSync(filepath)

		var doc = {}

		if (contents.length) doc = JSON.parse(contents.toString())

		if (data) {
			doc[Main._item] = data

			file_system.writeFileSync(filepath, JSON.stringify(doc))

			return data
		} else {
			return doc[Main._item]
		}
	}
	,
	dsl(tmpl, ...expr) {
		var result = ''

		for(var I in expr) {
			let oper = tmpl[I].split('_')
			let cmd = oper[0]
			let path = oper[1]

			result += Main[cmd](path,expr[I])
		}

		return result
	}
	,
	path(given_path) {
		Main._dotPath = given_path.split('.')

		Main._item = Main._dotPath.pop()
		Main._filename = Main._dotPath.pop() + '.json'
		Main._directory = Main._dotPath.join('\\')

		return `.\\${Main._directory}\\${Main._filename}`
	}
	,
	_directory : ''
	,
	_dotPath : ''
	,
	_filename : ''
	,
	_item : ''
	,
}

module.exports = Main