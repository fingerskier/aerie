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
I have two desires for add-ons:
1) Template literal tags which form an extensible JSON DSL
Desired syntax:
```
const aerie = require('aerie')

aerie`Pointless text _PUNC${some_val} and _END`
```
...or something like that.

2) A database object whose get/set are tied to file-system read/write

