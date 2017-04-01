import net from 'net'

export default function getSocketServer (options) {
  const {port, logger, environment} = options
  
  const server = net.createServer()
  
  server.on('connection', (data) => {
    handleConnection(data, logger)
  })  
  server.listen(port, function () {
    logger.info('Environment:', environment)
    logger.info('Listening to port:', port + '...')
  })
  return server
}

function handleConnection (socket, logger) {
  const remoteAddress = socket.remoteAddress + ':' + socket.remotePort
  logger.info('new client connection from %s', remoteAddress)
  
  socket.setEncoding('utf8')
  
  socket.on('data', onSocketData)
  socket.on('close', onSocketClose)
  socket.on('errror', onSocketError)
  
  function onSocketData (d) {
    logger.info('connection data from', remoteAddress, d)
    socket.write(d.toUpperCase())
  }
  
  function onSocketClose () {
    logger.warn('connection from', remoteAddress, 'closed')
  }
  
  function onSocketError (err) {
    logger.error('connection', remoteAddress, 'error:', err.message)
  }
}

