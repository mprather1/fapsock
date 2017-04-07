import net from 'net'
import DuplexEmitter from 'duplex-emitter'
import winston from 'winston-color'
import chalk from 'chalk'
import pkg from '../package.json'

export default function getSocketClient (options) {
  
  const {socketPort, hostname, packageName, logger} = options
  
  const s = new net.Socket()
  
  const socket = s.connect(socketPort, hostname)
  
  const emitter = DuplexEmitter(socket)

  socket.on('connect', () => {
    emitter.emit('connected', packageName)
  })
  
  emitter.on('connected', (data) => {
    logger.info(`connected to ${chalk.bgBlack.green(data)}...`)
    socket.on('close', () => {
      handleClose(data, data)
    })    
  })
  
  function handleClose (name) {
    logger.info(`connection to ${chalk.bgBlack.green(name)} closed...`)
  }
  
  options.socket = socket
  options.emitter = emitter
  
  return options
}

const options = {
  socketPort: process.env.SOCKET_PORT,
  environment: process.env.NODE_ENV || 'development',
  logger: winston,
  hostname: process.env.HOSTNAME,
  packageName: pkg.name,
}
