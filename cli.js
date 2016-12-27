const data = process.argv[3]
const db = require('./db')
const this_path = process.argv[2]


if (data) {
	db(this_path, data)
} else {
	db(this_path)
}
