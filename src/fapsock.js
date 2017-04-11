import net from 'net'
import getEmitter from './emitter'

export default class Fapsock {
  constructor (options) {
    const {socketPort, hostname} = options

    const socket = new net.Socket().connect(socketPort, hostname)
    const emitter = getEmitter(socket, options)

    configClient(socket, emitter, options)

    return emitter
  }
}

function configClient (socket, emitter, options) {
  const {packageName, logger} = options

  socket.on('connect', () => {
    socketConnection(emitter, packageName)
  })

  socket.on('error', (err) => {
    handleError(err, logger)
  })
}

function socketConnection (emitter, packageName) {
  emitter.emit('connected', packageName)
}

function handleError (err, logger) {
  logger.error('error:', err.message)
}
