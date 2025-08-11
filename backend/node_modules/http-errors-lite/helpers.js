
/**
 * Get the code class of a status code.
 * @private
 */

exports.codeClass = function codeClass (status) {
  return Number(String(status).charAt(0) + '00')
}

/**
 * Convert a string to an identifier
 */
exports.toIdentifier = function toIdentifier (str) {
  return str
    .split(' ')
    .map(function (token) {
      return token.slice(0, 1).toUpperCase() + token.slice(1)
    })
    .join('')
    .replace(/[^ _0-9a-z]/gi, '')
}
