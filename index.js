module.exports = function(root) {
  return {
    get: async function(strings, ...keys) {
      const fs = require('fs').promises
      const glob = require('glob-promise')

      let query = ''
      for (let I in strings) {
        const thisKey = keys[I]
        const thisString = strings[I]
        query += thisString? thisString: ''
        query += thisKey? thisKey: ''
      }

      const path = `${root}/${query}.json`
      const files = await glob(path)

      const result = files.map(F=>require(F))

      return result
    },

    set: async function(strings, ...keys) {
      const fs = require('fs').promises
    },
  }
}