let aerie = require('./aerie')
let DB = {}
let fs = require('fs')

module.exports = new Proxy(DB, {
	has(target, prop) {

	}
	,
	get(target, property, receiver) {
		if (!target[property]) {
			target[property] = aerie(property)
		}

		return target[property]
	}
	,
	set(target, property, value, receiver) {
		target[property] = value	// default behavior

		aerie(property, value)

		return true
	}
})


nodePath = (given_path)=>{
	const path = given_path.split('.')

	const item = path.pop()
	const filename = path.pop() + '.json'

	const directory = path.join('\\')

	return `.\\${directory}\\${filename}`
}
