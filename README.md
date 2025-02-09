# aerie

An ultra-simple utility server to handle nested JSON files.


## Gist

Data is stored in the `data` directory.
GET data at `/data/...`.
POST data at `/data/...`.


## Examples

GET `http://localhost:3000/data/flarn/ghibbet` will return the value of `./data/flarn/ghibbet.json`.

GET `http://localhost:3000/data/flarn/1` a trailing integer with return the Nth element of that thing.

POST `http://localhost:3000/data/flarn/schlesly` will write the Body data to `./data/flarn/schlesly.json`.


## Dashboard

A rudimentary dashboard is available at `/dashboard`.
There you can GET and POST to the server.
