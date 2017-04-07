# fapsock

## Synopsis

Socket client will connect to a socket server running on the specified port.

## Installation

	npm install --save fapsock

## Usage

Accepts a JavaScript object as an argument:

	const options = {
	  socketPort: process.env.SOCKET_PORT,
	  logger: winston,
	  hostname: process.env.HOSTNAME,
	  packageName: pkg.name,
	}
	
<div class="footer">
  readme v1.0.1
</div>