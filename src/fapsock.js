import net from 'net'
import reconnect from 'reconnect-net'
import DuplexEmitter from 'duplex-emitter'
import chalk from 'chalk'

export default class Fapsock {
  constructor (options) {
  const {socketPort, hostname} = options
  
  const socket = reconnect().connect(socketPort, hostname)
  const emitter = DuplexEmitter(socket._connection)
  
  configClient(options, socket, emitter)
  
  this.socket = socket
  this.emitter = emitter
  }
}

function configClient (options, socket, emitter) {
  const {packageName, logger} = options
  
  let serverName
  
  socket.once('connect', () => {
    handleConnection(socket, logger)
  })

  emitter.once('connected', (name) => {
    logger.info(`connected to ${chalk.bgBlack.green(name)}...`)

    serverName = name
    
    socket.once('disconnect', () => {
      handleClose(socket, name)
    })
  })
  
  socket.on('error', (err) => {
    handleError(err, logger)
  })
  
  emitter.on('error', (err) => {
    handleEmitterError(err, logger)
  })
  
  function handleConnection (socket, logger) {
    socket.on('reconnect', () => {
      logger.error(`connection to ${chalk.bgBlack.green(serverName)} lost; attempting to reconnect...`)
      handleReconnection(socket, logger)
    })
    emitter.emit('connected', packageName)    
  }
  
  function handleReconnection (socket, logger) {
    socket.once('connect', () => {
      logger.info(`successfully reconnected to ${chalk.bgBlack.green(serverName)}...`)
    })    
  }

  function handleClose (socket, name) {
    logger.warn(`disconnected from ${chalk.bgBlack.green(name)}...`)
  }
  
  function handleEmitterError (err, logger) {
    logger.error('error:', err.message)
  }
}

function handleError (err, logger) {
  logger.error("error:", err.message)
}
