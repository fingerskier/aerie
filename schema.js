var Schema = new Proxy({}, {
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
})


schema.transformation`command${data}operation${value}`()

handler`operation${url}operation${url}`(map)

/*
	The idea is:
		A) Object properties can be functions
		B) A fun-prop can change at run-time based on arguments
		C) A fun-prop can be malleable based on it's name
*/