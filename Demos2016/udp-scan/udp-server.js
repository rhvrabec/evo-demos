/*
Node.js UDP server that listens for broadcasts with
data 'WhoIsThere' and responds with server info.

Usage:

    node udp-server.js

You can also paste the code into the Evothings Workbench Tools window,
select the code and click the "Node Eval" button. This will start the server.

Author: Mikael Kindborg
*/

var OS = require('os')
var DATAGRAM = require('dgram')

// If hyper.log is defined we are running inside Evothings Workbench,
// redirect console.log
if (global.hyper && hyper.log) { console.log = hyper.log }

// Returns UDP server object.
// To stop the server use server.close()
function startUDPServer(port)
{
	var server

	// Send info about this server back to the client.
	function sendServerInfo(info)
	{
		var serverData =
		{
			name: OS.hostname(),
			port: port
		}

		var message = new Buffer(JSON.stringify(serverData))

		server.send(
			message,
			0,
			message.length,
			info.port,
			info.address,
			function(error, bytes)
			{
				if (!error)
				{
					console.log('Sent bytes: ' + bytes)
				}
				else
				{
					console.log('Send error: ' + error)
				}
			}
		)
	}

	// Create server socket.
	function createServer()
	{
		server = DATAGRAM.createSocket('udp4')

		// Set handler for incoming messages.
		server.on('message', function(msg, info)
		{
			console.log('Got message: ' + msg)

			if (msg == 'WhoIsThere')
			{
				sendServerInfo(info)
			}
		})

		// Set handler for incoming messages.
		server.on('listening', function()
		{
			// Not used: var address = server.address()
			console.log('UDP server is listening')
		})

		// Bind server socket to port.
		server.bind(port)

		return server
	}

	return createServer()
}

// Start the server.
myServer = startUDPServer(4088)

// Stop the server.
//myServer.close()

