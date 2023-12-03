/**
 * HTTP request object.
 * @typedef {Object} HttpRequest
 * @property {string} httpVersion
 * @property {string} method
 * @property {string} resource
 * @property {Object.<string, string>} headers - The HTTP headers as key-value pairs.
 * @property {string?} body
 */

/**
 * HTTP response object.
 * @typedef {Object} HttpResponse
 * @property {HttpRequest} request
 * @property {number} statusCode
 * @property {string} statusMessage
 * @property {Object.<string, string>} headers - The HTTP headers as key-value pairs.
 * @property {string?} body - Note: the body will be ignored depending on the method.
 */

/**
 * Parse a raw HTTP request into a HTTP request object.
 * @param {Buffer} buffer
 * @returns {HttpRequest} the HTTP request as an object. 
 */
const parseHttpReq = (buffer) => {
  const rawHttpReqLines = buffer.toString().split('\r\n')

  // first line is method, resource and HTTP version
  const [method, resource, httpVersion] = rawHttpReqLines[0].split(' ')

  // then we get headers
  const headers = {}
  rawHttpReqLines.slice(1).forEach((line) => {
    const separatorIndex = line.indexOf(':')
    const header = line.substring(0, separatorIndex).trim()
    const headerValue = line.substring(separatorIndex + 1).trim()
    if (header !== '') {
      headers[header] = headerValue
    }
  })

  // last but not least, we check the body (depending on the method)
  const body = null;

  return {
    httpVersion,
    method,
    resource,
    headers,
    body
  }
}

/**
 * Parse a HTTP response object into a raw HTTP response.
 * @param {HttpResponse} res
 * @returns {string} the raw HTTP response. 
 */
const parseHttpRes = (res) => {
  const rawHttpResLines = []

  rawHttpResLines.push(`${res.request.httpVersion} ${res.statusCode} ${res.statusMessage}`)
  Object.entries(res.headers).forEach(([key, value]) => rawHttpResLines.push(`${key}: ${value}`))

  // ending empty lines
  rawHttpResLines.push('', '')

  return rawHttpResLines.join('\r\n')
}

export {
  parseHttpReq,
  parseHttpRes,
}