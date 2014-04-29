// EvoSensorTagServer.js

evo = {}

evo.SocketIo = require('socket.io')
evo.SensorTag = require('sensortag')

// Calls the function fun when the SensorTag is connected and enabled.
evo.connectToSensorTagThenCall = function(fun)
{
    evo.SensorTag.discover(function(sensor)
    {
        console.log('SensorTag discovered')
        sensor.connect(function()
        {
            console.log('SensorTag connected')
            sensor.discoverServicesAndCharacteristics(function()
            {
                console.log('Services discovered')
                evo.sensor = sensor
                evo.enableSensors(fun)
            })
        })
    })
}

evo.enableSensors = function(fun)
{
    evo.sensor.enableIrTemperature(function()
    {
	    fun()
    })
}

evo.startServer = function()
{
	evo.IO = evo.SocketIo.listen(6277)

	evo.IO.set('log level', 1)

	evo.IO.sockets.on('connection', function(socket) 
	{
		console.log('SensorDemo client connected')
		
		socket.on('disconnect', function ()
		{
			//evo.sensor.disconnect(function() { console.log('SensorTag disconnected') })
			console.log('SensorDemo client disconnected')
	    })

	    socket.on('sensorTag.request', function(data)
		{
	        console.log('Sensor request: ' + data.service)
	        
			if ('readIrTemperature' == data.service)
			{
				evo.sensor.readIrTemperature(function(objectTemperature, ambientTemperature)
		        {
		            console.log('Temp: ' + objectTemperature + ' ' + ambientTemperature)
					evo.IO.sockets.emit('sensorTag.response', 
					{
						callbackId: data.callbackId,
						params: [objectTemperature, ambientTemperature]
					})
		        })
			}
	    })
	})
}

// This connects to the sensor tag and starts the server.
evo.connectToSensorTagThenCall(evo.startServer)
