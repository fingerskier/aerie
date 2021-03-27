module.exports = function(root) {
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

    set: async function(strings, ...keys) {
			const fs = require('fs').promises

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

      const files = await findings(search, true)

			files.forEach(F=>{
				const {contents, filepath} = F

				if (parseInt(property)) {
					if (typeof(f) === 'function') {
						contents[parseInt(property)] = value(contents[parseInt(property)])
					} else {
						contents[parseInt(property)] = value
					}
				} else {
					if (typeof(f) === 'function') {
						contents[property] = value(contents[parseInt(property)])
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