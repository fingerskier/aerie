# aerie

An ultra-simple utility to handle nested JSON files.


## Gist

Basically returns an array of JSON files in any path below the given root.
The intention is that the returned array can be map/reduced into w/e needs be is.

Check out `test.js` for examples.


## Usage

First, these are `async` functions; so, utilize inside an `async()` or use `.then` & `.catch()`
Next, these are template string tags ~ they act like function where the arguments are the stuff in a string.