# aerie

An ultra-simple utility to handle nested JSON files.

### Current usage:
Setting
```
const aerie = require('aerie')

aerie('some.dir.file.item', 'value')
```
...which would result in ./some/dir/file.json being parsed, and having it's "item" property assigned "value".

Getting
```
const aerie = require('aerie')

aerie('some.dir.file.item')
```
...which will return "value" (per the previous example).

There is a CLI version of this included as `cli.js`


### TODO
Desired syntax:
```
const {query,mutate} = require('aerie')('data_directory')

query`machine/alpha.one`
```
The `/` implies that the preceeding name is a directory.
The '.' implies that the preceeding name is a file.
This call returns the given sub-value: 'one' of the object in the file machine/alpha.json

To grab an entire file:
```
query`machine/alpha`
```

To grab an entire directory:
```
query`machine`
```

Interesting side-effect that accessing `machine.alpha` and `machine/alpha` means that both the directory `machine` and the file `machine.json` exist side-by-side and are both accessible independently.  This could be a convenient way to store metadata.

The pupose of using template literals is to dynamic retrievals such as:
```
let machine_name = 'alpha'

aerie`machine/${machine_name}`
```

OR

```
const goo = (machine,prop)=>`${machine}.${prop}`

query`machine/${flarn('alpha','one')}`
```

Using a numeric property implies that the object is an array:

```
aerie`machine/alpha.stat.1`
```
Alpha is an object containing an array of which this query returned 1.

Using curly `{}` notation projects only certain propeties into the result:
```
query`machine/alpha{stat,data}`
```
...yields only the `stat` and `data` sub-objects from `alpha`.  

Failures to map such things fails silently by adding empty props to the result.
Mutating the same would create those empty properties.

Similarly, for arrays:
```
mutate`42|machine/alpha.stat{1}`
```
...the value `42` gets written (piped into) whatever endpoint is described by the subsequent query.

## Future
