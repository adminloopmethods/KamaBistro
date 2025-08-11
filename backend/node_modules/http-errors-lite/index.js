/*!
 * http-errors
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var util = require('util')
var statuses = require('./statuses')
var helper = require('./helpers')
var __cache = new Map()

/**
 * The base error class that all http errors will inherit from.
 * Allows for easy checking if error is HttpError
 */

function HttpError () {
  throw new TypeError('cannot construct abstract class')
}
util.inherits(HttpError, Error)

/**
 * Create the HttpError creator.
 *
 * @returns {Error}
 * @public
 */
function createError (orgStatus, orgMessage, orgProps) {
  // so much arity going on ~_~
  var err
  var status = orgStatus
  var msg = orgMessage
  var props = orgProps || {}

  // If not a number, shift to the right
  if (typeof status !== 'number') {
    props = msg
    msg = status
    status = 500
  }
  // If msg is an error, extract it
  if (msg instanceof Error) {
    err = msg
    msg = statuses[status]
    status = err.status || err.statusCode || status
  }
  // If status is in invalid range, force it to 500
  if (!statuses[status] && (status < 400 || status >= 600)) {
    status = 500
  }
  // Lastly, if we don't have a message (but props instead)
  // Move it over and grab the message from statuses
  if (typeof msg !== 'string') {
    props = msg
    msg = statuses[status]
  }

  // If status is a code not in statuses, we default to the
  // the class of the code (so 499 becomes 400 and etc.)
  var code = statuses[status] ? status : helper.codeClass(status)

  // If we don't have the error class cached, create it.
  if (!__cache.has(code)) {
    __cache.set(code, createErrorConstructor(helper.toIdentifier(statuses[code]), code))
  }

  // Grab our error class from cache
  var CreateHttpError = __cache.get(code)

  // If we were not passed an error class, we make our own
  // based on the code and capture the stacktrace.
  if (!err) {
    err = new CreateHttpError(msg)
    Error.captureStackTrace(err, createError)
  }

  // If we're dealing with an outside error, make sure it has
  // the common properties of status and expose.
  if (!(err instanceof HttpError) || err.status !== status) {
    // add properties to the generic error
    err.expose = status < 500
    err.status = err.statusCode = status
  }

  // Loop over props and add all the properties
  // to the current output error
  for (var key in props) {
    if (key !== 'status' && key !== 'statusCode') {
      err[key] = props[key]
    }
  }

  return err
}

/**
 * Create a constructor for an http error
 * @private
 */

function createErrorConstructor (name, code) {
  var className = name.match(/Error$/) ? name : name + 'Error'

  function ClientError (message) {
    // create the error object
    var msg = message != null ? message : statuses[code]
    var err = new Error(msg)

    // capture a stack trace to the construction point
    Error.captureStackTrace(err, ClientError)

    // adjust the [[Prototype]]
    Object.setPrototypeOf(err, ClientError.prototype)

    Object.defineProperty(err, 'message', {
      enumerable: true,
      configurable: true,
      value: msg,
      writable: true
    })

    // redefine the error name
    Object.defineProperty(err, 'name', {
      enumerable: false,
      configurable: true,
      value: className,
      writable: true
    })

    return err
  }

  util.inherits(ClientError, HttpError)

  // Override the name of the function
  var desc = Object.getOwnPropertyDescriptor(ClientError, 'name')
  if (desc && desc.configurable) {
    desc.value = className
    Object.defineProperty(ClientError, 'name', desc)
  }

  ClientError.prototype.status = code
  ClientError.prototype.statusCode = code

  if (code >= 500) {
    ClientError.prototype.expose = false
  } else {
    ClientError.prototype.expose = true
  }

  return ClientError
}

/**
 * Module exports.
 * @public
 */

module.exports = createError
module.exports.HttpError = HttpError
