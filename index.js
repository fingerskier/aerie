module.exports = function(root) {
	const defaultContents = {}

	async function findings(partial, includeNames=false) {
		const glob = require('glob-promise')

		const path = `${root}/${partial}.json`
		const files = await glob(path)

		if (includeNames) {
			return files.map(F=>{
				return {
					contents: require(F),
					filepath: F,
				}
			})
		} else {
			return files.map(F=>require(F))
		}
	}

  const self = {
    get: async function(strings, ...keys) {
      let search = ''
      for (let I in strings) {
        const thisKey = keys[I]
        const thisString = strings[I]
        search += thisString? thisString: ''
        search += thisKey? thisKey: ''
      }

      return await findings(search)
    },

		/** Update individual file properties */
    put: async function(strings, ...keys) {
			const fs = require('fs').promises
			const mkdirp = require('mkdirp')
			const touch = require('touch')

      let query = ''

			for (let I in strings) {
        const thisKey = keys[I]
        const thisString = strings[I]
        query += thisString? thisString: ''
        query += thisKey? thisKey: ''
      }

			const terms = query.split('=')
			const search = terms[0]

			let thing = keys[keys.length-1]
			if (!thing) {
				thing = terms[1]
			}

			const file = `./${root}/${search}.json`

			if (!file.length && !search.includes('*')) {
				const parts = search.split('/')
				const dir = `./${root}/` + parts.slice(0, parts.length - 1).join('/')
				await mkdirp(dir)
				await touch(file)
				await fs.writeFile(file, JSON.stringify(defaultContents))
				file = await findings(search, true)
			}

			let contents = thing
			if (typeof(f) === 'function') {
				contents = thing(filepath)
			}

			fs.writeFile(file, JSON.stringify(contents))
    },

		/** Update individual file properties */
    update: async function(strings, ...keys) {
			const fs = require('fs').promises
			const mkdirp = require('mkdirp')
			const touch = require('touch')

      let query = ''

			for (let I in strings) {
        const thisKey = keys[I]
        const thisString = strings[I]
        query += thisString? thisString: ''
        query += thisKey? thisKey: ''
      }

			const terms = query.split('.')
			const search = terms[0]
			const factors = terms[1].split('=')
			const property = factors[0]
			const value = factors[1]

      let files = await findings(search, true)

			if (!files.length && !search.includes('*')) {
				const parts = search.split('/')
				const file = `./${root}/${search}.json`
				const dir = `./${root}/` + parts.slice(0, parts.length - 1).join('/')
				await mkdirp(dir)
				await touch(file)
				await fs.writeFile(file, JSON.stringify(defaultContents))
				files = await findings(search, true)
			}

			files.forEach(F=>{
				const {contents, filepath} = F

				if (parseInt(property)) {
					if (typeof(f) === 'function') {
						contents[parseInt(property)] = value(contents[parseInt(property)], filepath)
					} else {
						contents[parseInt(property)] = value
					}
				} else {
					if (typeof(f) === 'function') {
						contents[property] = value(contents[parseInt(property)], filepath)
					} else {
						contents[property] = value
					}
				}

				fs.writeFile(filepath, JSON.stringify(contents))
			})
    },
  }

	return self
}