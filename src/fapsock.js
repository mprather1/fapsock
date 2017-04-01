import net from 'net'
import JSONDuplexStream from 'json-duplex-stream'
import Gateway from './gateway'

export default function getSocketServer (options) {
  const {port, logger, environment} = options
  
  const server = net.createServer()
  
  server.on('connection', (socket) => {
    handleConnection(socket, logger)
  })  
  server.listen(port, () => {
    logger.info('Environment:', environment)
    logger.info('Listening to port:', port + '...')
  })
  return server
}

function handleConnection (socket, logger) {
  const remoteAddress = socket.remoteAddress + ':' + socket.remotePort
  logger.info('new client connection from %s', remoteAddress)
  
  const s = JSONDuplexStream()
  const gateway = Gateway()
  
  socket.
    pipe(s.in).
    pipe(gateway).
    pipe(s.out).
    pipe(socket)

  s.in.on('error', onProtocolError)
  s.out.on('error', onProtocolError)
  socket.on('data', onSocketData)
  socket.on('close', onSocketClose)
  socket.on('errror', onSocketError)
  
  function onProtocolError (err) {
    socket.end('protocol error: ' + err.message)
  }
  
  function onSocketData (d) {
    logger.info('connection data from', remoteAddress)
    socket.write(d)
  }
  
  function onSocketClose () {
    logger.warn('connection from', remoteAddress, 'closed')
  }
  
  function onSocketError (err) {
    logger.error('connection', remoteAddress, 'error:', err.message)
  }
}
