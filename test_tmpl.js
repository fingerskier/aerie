function dsl(tmpl, ...expr) {for(var I in expr) {console.log(tmpl[I]); console.log(expr[I]) } }

console.log(dsl`asdf${0}`)