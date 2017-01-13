let DB = {}

module.exports = new Proxy(DB, {
	has(target, prop) {

	}
	,
	get(target, property, receiver) {
		console.log(property)

		return target[property]
	}
	,
	set(target, property, value, receiver) {
		console.log(property)

		target[property] = value	// default behavior

		console.log(receiver)

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
