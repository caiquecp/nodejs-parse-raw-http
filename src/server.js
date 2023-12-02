import net from 'node:net'
import { parseHttpReq, parseHttpRes } from './httpParser.js'

const PORT = 3000

const serverOptions = {}

const connectionListener = (socket) => {
  console.log('server.connection event triggered')

  socket.on('data', (data) => {
    console.log('server.connection.data event triggered')
    
    const req = parseHttpReq(data)

    socket.write(parseHttpRes(), 'utf8', () => true)
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