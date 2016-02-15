/*
Library that abstracts Chrome TCP sockets.
For documentation of chrome.sockets.tcp see this page:
https://developer.chrome.com/apps/sockets_tcp

Author: Mikael Kindborg
*/

;(function(evothings)
{

evothings.sockets = evothings.sockets || {}
evothings.sockets.tcp = {}

evothings.sockets.tcp.ERROR_TCP_SOCKET_CREATE = 1
evothings.sockets.tcp.ERROR_TCP_SOCKET_CONNECT = 2
evothings.sockets.tcp.ERROR_TCP_SOCKET_RECEIVE = 3
evothings.sockets.tcp.ERROR_TCP_SOCKET_SEND = 4

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
	return String.fromCharCode.apply(null, new Uint8Array(buffer));

	/*
	// Alternative implementation.
	var string = ''
	var view = new Uint8Array(buffer)
	for (var i = 0; i < buffer.byteLength; ++i)
	{
		string += String.fromCharCode(view[i])
	}
	return string
	*/
}

evothings.sockets.tcp.connect = function(
	address,
	port,
	connectedCallback,
	receivedCallback,
	errorCallback)
{
	// Socket instance object, retured in the callbacks.
	var mSocket = {}

	// Instance methods.
	mSocket.send = function(
		dataBuffer,
		successCallback,
		errorCallback)
	{
		sendImpl(
			mSocket,
			dataBuffer,
			successCallback,
			errorCallback)
	}

	mSocket.close = function(callback)
	{
		closeImpl(mSocket, callback)
	}

	// Create TCP socket.
	function create()
	{
		try
		{
			chrome.sockets.tcp.create(
				{},
				function(createInfo)
				{
					mSocket.socketId = createInfo.socketId
					connect(mSocket.socketId)
				})
		}
		catch (error)
		{
			errorCallback(
				mSocket,
				evothings.sockets.tcp.ERROR_TCP_SOCKET_CREATE,
				'Failed to create TCP socket: ' + error)
		}
	}

	function connect(socketId)
	{
		chrome.sockets.tcp.connect(
			socketId,
			address,
			port,
			function(result)
			{
				// Result 0 means success, negative is error.
				if (result < 0)
				{
					errorCallback(
						mSocket,
						evothings.sockets.tcp.ERROR_TCP_SOCKET_CREATE,
						'Failed to connect TCP socket: ' + result)
				}
				else
				{
					// Set receive listener.
					chrome.sockets.tcp.onReceive.addListener(receive)
console.log('CONNECTED: ' + mSocket.socketId)
					// Socket connect success.
					connectedCallback(mSocket)
				}
			})
	}

	// Handle incoming data.
	function receive(receiveInfo)
	{
		if (receiveInfo.socketId !== mSocket.socketId)
		{
			// Not for us.
    		return
    	}

		try
		{
			// Data is in receiveInfo.data
			receivedCallback(mSocket, receiveInfo)
		}
		catch (error)
		{
			errorCallback(
				mSocket,
				evothings.sockets.tcp.ERROR_TCP_SOCKET_RECEIVE,
				'Receive error: ' + error)
		}
	}

	// Create socket.
	create()
}

// Send packet.
function sendImpl(
	socket,
	dataBuffer,
	successCallback,
	errorCallback)
{
	chrome.sockets.tcp.send(
		socket.socketId,
		dataBuffer,
		function(sendInfo)
		{
			if (sendInfo.resultCode < 0)
			{
				errorCallback(
					socket,
					evothings.sockets.tcp.ERROR_TCP_SOCKET_SEND,
					'Send error: ' + sendInfo.resultCode)
			}
			else
			{
				successCallback(socket, sendInfo)
			}
		})
}

// Close socket.
function closeImpl(socket, callback)
{
	chrome.sockets.tcp.disconnect(
		socket.socketId,
		function()
		{
			chrome.sockets.tcp.close(
				socket.socketId,
				function()
				{
					callback && callback(socket)
				})
		})
}

})(window.evothings || {})
