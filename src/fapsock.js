import net from 'net'
import DuplexEmitter from 'duplex-emitter'
import chalk from 'chalk'

export default class Fapsock {
  constructor (options) {
    const {socketPort, hostname} = options
    
    const s = new net.Socket()
    const socket = s.connect(socketPort, hostname)
    const emitter = DuplexEmitter(socket)
    
    configClient(options, socket, emitter)
    
    this.socket = socket
    this.emitter = emitter
  }
}

function configClient (options, socket, emitter) {
  const {packageName, logger} = options
  
  socket.on('connect', () => {
    emitter.emit('connected', packageName)
  })
  
  socket.on('error', (err) => {
    handleError(err, logger)
  })
  
  emitter.on('connected', (data) => {
    logger.info(`connected to ${chalk.bgBlack.green(data)}...`)
    socket.on('close', () => {
      handleClose(data, data)
    })    
  })
  
  emitter.on('error', (err) => {
    handleEmitterError(err, logger)
  })
  
  function handleEmitterError (err, logger) {
    logger.error('error:', err.message)
  }
  
  function handleClose (name) {
    logger.info(`connection to ${chalk.bgBlack.green(name)} closed...`)
  }
}

function handleError (err, logger) {
  logger.error("error:", err.message)
}
