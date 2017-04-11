import DuplexEmitter from 'duplex-emitter'
import chalk from 'chalk'

export default function getEmitter (socket, options) {
  const {logger} = options

  const emitter = DuplexEmitter(socket)

  emitter.once('connected', (remote) => {
    emitterConnection(socket, logger, remote)
  })

  emitter.on('error', (err) => {
    handleEmitterError(err, logger)
  })

  function handleEmitterError (err, logger) {
    logger.error('error:', err.message)
  }

  return emitter
}

function emitterConnection (socket, logger, remote) {
  logger.info(`connected to ${chalk.bgBlack.green(remote)}...`)

  socket.on('close', () => {
    handleClose(remote, logger)
  })
}

function handleClose (remote, logger) {
  logger.warn(`disconnected from ${chalk.bgBlack.green(remote)}...`)
}
