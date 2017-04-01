import net from 'net'

export default function getSocketServer (options) {
  const {logger} = options
  
  const server = net.createServer(function (socket) {
    socket.name = socket.remoteAddress + ':' + socket.remotePort
    
    socket.on('end', () => {
      logger.info('disconnected')
    })
    
    socket.on('connection', () => {
      logger.info('connected', socket)  
    })
  })
  
  server.listen(8001, () => {
    console.log("listening")
  })
  return server
}