/**
 * @typedef 
 */

/**
 * Parse a raw HTTP request into a HTTP request object.
 * @param {Buffer} buffer 
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

  return {
    method,
    resource,
    httpVersion,
    headers
  }
}

const parseHttpRes = (res) => {
  return `
  HTTP/1.1 200 OK
  Server: Node.js
  Content-Type: text/html; charset=iso-8859-1
  Content-Length: 0
  `
}

export {
  parseHttpReq,
  parseHttpRes,
}