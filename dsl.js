// a DSL version of aerie that takes a template string containing the path and optional info
const aerie = require('./aerie')

module.exports = (tmpl, ...expr)=>{
	for(var I in expr) {
		aerie.data(tmpl[I], expr[I])
console.log(tmpl[I])
console.log(expr[I])
	}
}
