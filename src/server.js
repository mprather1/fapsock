const io = require('socket.io')()

export default function getSocketServer (options) {
  const {server, logger} = options
  
  io.serveClient(false)
  io.attach(server)
  
  io.on('connection', function (socket) {
    logger.info('client connected...')
    const message = {
      data: "connected"
    }
    socket.emit('msg', message)
    socket.on('disconnect', function () {
      logger.warn('client disconnected...')
    })
  })
  return io
}