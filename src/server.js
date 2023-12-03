import net from 'node:net'
import { parseHttpReq, parseHttpRes } from './httpParser.js'

/**
 * Create default headers for HTTP response.
 * @returns {Object.<string, string>}
 */
const createDefaultHeaders = () => ({
  'Date': (new Date()).toUTCString(),
  'Server': 'CCPDEV.SERVER',
  'Content-Type': 'application/octet-stream',
  'Content-Length': '0',
})

const controllers = {
  'GET /health': (req) => ({
    request: req,
    statusCode: 200,
    statusMessage: 'OK',
    headers: createDefaultHeaders()
  })
}

/**
 * Default controller - will return 404.
 * @param {import('./httpParser.js').HttpRequest} req 
 * @returns {import('./httpParser.js').HttpResponse}
 */
const defaultController = (req) => ({
  request: req,
  statusCode: 404,
  statusMessage: 'Not Found',
  headers: createDefaultHeaders(),
})

const PORT = 3000
const serverOptions = {}

const connectionListener = (socket) => {
  console.log('server.connection event triggered')

  socket.on('data', (data) => {
    console.log('server.connection.data event triggered')
    
    const req = parseHttpReq(data)
    console.debug('req', req)

    const handler = controllers[`${req.method} ${req.resource}`] || defaultController
    const res = handler(req)
    console.debug('res', res)

    const rawRes = parseHttpRes(res)
    console.debug(rawRes)

    socket.write(rawRes, 'utf8', () => true)
    socket.end()
  })

  socket.on('end', () => {
    console.log('server.connection.end event triggered')
  })
}

const server = net.createServer(serverOptions, connectionListener)

server.on('close', () => {
  console.log('server.close event triggered')
})

server.on('error', (error) => {
  console.log('server.error event triggered')
  console.error(error)
})

server.on('listening', () => {
  console.log('server.listening event triggered')
})

server.on('drop', (data) => {
  console.log('server.drop event triggered')
  console.log(data)
})

server.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`)
})