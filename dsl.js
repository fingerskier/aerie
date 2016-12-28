// a DSL version of aerie that takes a template string containing the path and optional info
const file_system = require('fs')
const touch = require('touch')

/* TODO
	the template literal tag should return the proxy object which corresponds with a dynamic data-handler
*/

module.exports = (strings, ...keys)=>{
	let result = ''

	for (let I in strings){
		let stuff = strings[I].split(' ')

		let command = stuff[0]
		let path = stuff[1]
		let value = keys[I]

		if (command.length) result += DB[command](path, value)
	}

	return result
}

// adding capabilities is as "simple" as adding a function to this object
const DB = function(){
	
	return {
		get(given_path){
			return upsert(given_path)
		}
		,
		set(given_path, data){
			return upsert(given_path, data)
		}
	}
}

const Handler = {
	get(target, property, receiver){
		console.log(`getting ${property} from ${target}`)

		return target[property]
	}
	,
	set(target, property, value, receiver){
		// setting a property's value

		target[property] = value	// default behavior

		return true
	}
}

const Schema = new Proxy(DB, Handler)


upsert = (given_path, data)=>{
	const path = given_path.split('.')

	const item = path.pop()
	const filename = path.pop() + '.json'

	const directory = path.join('\\')
	const filepath = `.\\${directory}\\${filename}`

	file_system.readFile(filepath, (error, contents='')=>{
		if (error){
			if (error.errno = -4058) {
				file_system.mkdir(directory, ()=>{
					touch(filepath)
				})
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
