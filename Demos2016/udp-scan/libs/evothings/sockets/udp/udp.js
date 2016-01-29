/*
Library that performs UDP broadcast/scanning.
For documentation of chrome.sockets.udp see this page:
https://developer.chrome.com/apps/sockets_udp

Author: Mikael Kindborg
*/

;(function(evothings)
{

evothings.sockets = evothings.sockets || {}
evothings.sockets.udp = {}

evothings.sockets.udp.ERROR_UDP_SOCKET_CREATE = 1
evothings.sockets.udp.ERROR_UDP_SOCKET_BIND = 2
evothings.sockets.udp.ERROR_UDP_SOCKET_RECEIVE = 3
evothings.sockets.udp.ERROR_UDP_SOCKET_SEND = 4

// Helper function.
evothings.sockets.stringToBuffer = function(string)
{
	var buffer = new ArrayBuffer(string.length)
	var bufferView = new Uint8Array(buffer);
	for (var i = 0; i < string.length; ++i)
	{
		bufferView[i] = string.charCodeAt(i)
	}
	return buffer
}

// Helper function.
evothings.sockets.bufferToString = function(buffer)
{
	var string = ''
	var view = new Uint8Array(buffer)
	for (var i = 0; i < buffer.byteLength; ++i)
	{
		string += String.fromCharCode(view[i])
	}
	return string
}

evothings.sockets.udp.create = function(
	createdCallback,
	receivedCallback,
	errorCallback)
{
	// Create UDP socket.
	function create()
	{
		try
		{
			chrome.sockets.udp.create(
				{},
				function(createInfo)
				{
					bind(createInfo.socketId)
				})
		}
		catch (error)
		{
			errorCallback(
				evothings.sockets.udp.ERROR_UDP_SOCKET_CREATE,
				'Failed to create UDP socket: ' + error)
		}
	}

	// Bind UDP socket.
	function bind(socketId)
	{
		chrome.sockets.udp.bind(
			socketId,
			null,
			0,
			function(result)
			{
				// Result 0 means success, negative is error.
				if (result <= 0)
				{
					// Start receiving data.
					chrome.sockets.udp.onReceive.addListener(receive)

					// Socket create success.
					createdCallback(socketId)
				}
				else
				{
					errorCallback(
						evothings.sockets.udp.ERROR_UDP_SOCKET_CREATE,
						'Failed to bind UDP socket')
				}
			})
	}

	// Handle incoming UPD packet.
	function receive(receiveInfo)
	{
		try
		{
			receivedCallback(receiveInfo)

			// Add server info to list.
			//var ip = recvInfo.remoteAddress
			//var data = JSON.parse(bufferToString(recvInfo.data))
			//data.url = 'http://' + ip + ':' + data.port
			//data.ipAndPort = ip + ':' + data.port
		}
		catch (error)
		{
			errorCallback(
				evothings.sockets.udp.ERROR_UDP_SOCKET_RECEIVE,
				'Receive error: ' + error)
		}
	}

	// Create socket.
	create()
}

// Broadcast packet.
evothings.sockets.udp.broadcast = function(
	socketId,
	port,
	dataBuffer,
	successCallback,
	errorCallback)
{
	evothings.sockets.udp.send(
		socketId,
		'255.255.255.255',
		port,
		dataBuffer,
		successCallback,
		errorCallback)
}

// Send packet.
evothings.sockets.udp.send = function(
	socketId,
	address,
	port,
	dataBuffer,
	successCallback,
	errorCallback)
{
	chrome.sockets.udp.send(
		socketId,
		dataBuffer,
		address,
		port,
		function(sendInfo)
		{
			if (sendInfo.resultCode < 0)
			{
				errorCallback(
					evothings.sockets.udp.ERROR_UDP_SOCKET_SEND,
					'Send error: ' + sendInfo.resultCode)
			}
			else
			{
				successCallback(sendInfo.resultCode)
			}
		})
}

})(window.evothings || {})
