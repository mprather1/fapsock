const io = require('socket.io')()

export default function getSocketServer (server) {
  io.serveClient(false)
  io.attach(server)
  
  io.on('connection', function (socket) {
    console.log('client connected...')
    const message = {
      data: "connected"
    }
    socket.emit('msg', message)
  })
  return io
}