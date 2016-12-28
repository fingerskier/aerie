#aerie

An ultra-simple utility to handle nested JSON files.

Current usage:

####Setting
```
const aerie = require('aerie')

aerie('some.dir.file.item', 'value')
```
...which would result in ./some/dir/file.json being parsed, and having it's "item" property assigned "value".

####Getting
```
const aerie = require('aerie')

aerie('some.dir.file.item')
```
...which will return "value" (per the previous example).

There is a CLI version of this included as `cli.js`


##TODO
The ultimate desire is to incorporate these calls into template literal tags to create a JSON DSL.

Desired syntax:
```
aerie.transform`command${data}operation${value}`()

aerie.transform`command${data}command${data}`.data()
```
...or something like that.

- A proxy on aerie could mutate the parser based on context, if desired.
- The template tag could return a value, object, or function as needed.

**Why?**

