/* a DSL version of aerie that takes a template string containing the path and optional info
	e.g.
		aerie`how many _mark.favorite.food can we afford?`
*/

const aerie = require('./aerie')

module.exports = function main(strings, ...keys){
	let result = ''


	for (let I in strings) {
		let data = keys[I]
		let path = strings[I]

		let path_pos = path.indexOf('_')


		if (path_pos < 0) path_pos = 0

		path = path.slice(path_pos)

		if (data) {
			aerie(path, data)
			main[path] = data	// this needs to be nested objects...?
		} else {
			data = aerie(path)
			main[path] = data
		}

		result += strings[I] + data

		main[path] = data
	}


	main.prototype.valueOf = function parsedValue(){
		return 123
	}

	main.prototype.toString = function parsedString(){
		return 'abc'
	}


	return result
}