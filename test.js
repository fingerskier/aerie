module.exports = function(strs, ...keys){
	this.valueOf = function(){ return strs.join('|') + '!' + keys.join('|') }

	this.str = function(str_val){
		if (str_val && str_val.length) this.str_val = str_val

		return this.str_val
	}

	return this
}
