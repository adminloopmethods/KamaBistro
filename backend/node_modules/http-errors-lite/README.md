# http-errors-lite

[![npm version](https://badge.fury.io/js/http-errors-lite.svg)](https://badge.fury.io/js/http-errors-lite)
[![NPM Downloads][npm-downloads-image]][node-url]
[![Node.js Version][node-image]][node-url]
[![Build Status](https://travis-ci.org/nfp-projects/http-errors-lite.svg?branch=master)](https://travis-ci.org/nfp-projects/http-errors-lite)

Create HTTP errors for Express, Koa, Connect, etc. with ease. This is a drop-in replacement for the normal `http-errors` only with zero dependancies and 50% less memory usage (give or take).

## Install

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install http-errors-lite
```

## Example

```js
var createError = require('http-errors-lite')
var express = require('express')
var app = express()

app.use(function (req, res, next) {
  if (!req.user) return next(createError(401, 'Please login to view this page.'))
  next()
})
```

## API

This is the current API, currently extracted from Koa and subject to change.

### Error Properties

- `expose` - can be used to signal if `message` should be sent to the client,
  defaulting to `false` when `status` >= 500
- `headers` - can be an object of header names to values to be sent to the
  client, defaulting to `undefined`. When defined, the key names should all
  be lower-cased
- `message` - the traditional error message, which should be kept short and all
  single line
- `status` - the status code of the error, mirroring `statusCode` for general
  compatibility
- `statusCode` - the status code of the error, defaulting to `500`

### createError([status], [message], [properties])

Create a new error object with the given message `msg`.
The error object inherits from `createError.HttpError`.

<!-- eslint-disable no-undef, no-unused-vars -->

```js
var err = createError(404, 'This video does not exist!')
```

- `status: 500` - the status code as a number
- `message` - the message of the error, defaulting to node's text for that status code.
- `properties` - custom properties to attach to the object

### createError([status], [error], [properties])

Extend the given `error` object with `createError.HttpError`
properties. This will not alter the inheritance of the given
`error` object, and the modified `error` object is the
return value.

<!-- eslint-disable no-redeclare, no-undef, no-unused-vars -->

```js
fs.readFile('foo.txt', function (err, buf) {
  if (err) {
    if (err.code === 'ENOENT') {
      var httpError = createError(404, err, { expose: false })
    } else {
      var httpError = createError(500, err)
    }
  }
})
```

- `status` - the status code as a number
- `error` - the error object to extend
- `properties` - custom properties to attach to the object

## License

[MIT](LICENSE)

[node-image]: https://badgen.net/npm/node/http-errors-lite
[node-url]: https://nodejs.org/en/download
[npm-downloads-image]: https://badgen.net/npm/dm/http-errors-lite
[npm-url]: https://npmjs.org/package/http-errors-lite
[travis-image]: https://travis-ci.org/nfp-projects/http-errors-lite.svg?branch=master
[travis-url]: https://travis-ci.org/nfp-projects/http-errors-lite
