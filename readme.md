# fapsock

## Synopsis

Socket client will connect to a socket server running on the specified port.

## Installation

	npm install --save fapsock

## Usage

	import Fapsock from 'fapsock'
	
	# Accepts a JavaScript object as an argument:

	const options = {
	  socketPort: process.env.SOCKET_PORT,
	  logger: winston,
	  hostname: process.env.HOSTNAME,
	  packageName: pkg.name,
	}
	
	const fapsock = new Fapsock(options)
	
### Socket

	fapsock.socket.on('connect', () => {
		console.log('connected')
	}

### Emitter

	fapsock.emitter.on('connected', () => {
		console.log('connected')
	}
	
	fapsock.emitter.emit('hello', 'hello')
	
<div class="footer">
  readme v1.1.0
</div>