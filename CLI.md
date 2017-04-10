# Command-Line Interface

## **WIP**

Gambit:
```
dsl = require('./dsl')
```

The CLI mimcs the `aerie` internals thus:
```
dsl`data_db.flarn.one${1}`
```
...equivalent to `aerie.data('db.flarn.one', 1)`
...will set the value of `db.flarn.one` to `1`.
...other exposed functions are available similarly

You can also provide a DB path and it's value will be used as the command:
```
dsl`data_db.cmd.one${'data'}`

dsl`db.cmd.one_db.flarn.one${2}`
```
...first, we set `db.cmd.one` to the value `data`
...then, we pull in that value as command and apply it to the address `db.flarn.one` with the value `2`
...so, `db.flarn.one` ends up with the value 2

This seems a convolution but, in theory, should allow for a basic level of self-programming (i.e. impositions) with an appropriate set of fundamental commands baked-in.
