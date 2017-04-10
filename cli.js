const data = process.argv[3]
const this_path = process.argv[2]

const aerie = require('./aerie')

var result = aerie.data(this_path, data);

console.log(result)
