;(() =>
{
'use strict'

// Application object
window.app = {}

app.device = null

document.addEventListener(
	'deviceready',
	() => { evothings.scriptsLoaded(app.init) },
	false)

app.init = () =>
{
}

app.start = () =>
{
	app.showInfo('Scanning...')

	// Start scan.
	evothings.easyble.startScan(
		device =>
		{
			app.showInfo('BLE Found device: ' + device.name + ' ' +
				JSON.stringify(device.advertisementData))
			if (app.isSensorTag(device))
			{
				evothings.easyble.stopScan()
				app.device = device
				app.connectToDevice(device)
			}
		},
		app.onError)
}

app.stop = () =>
{
	evothings.easyble.stopScan()

	app.accelerometerTimer && clearInterval(app.accelerometerTimer)

	app.device && app.device.close()

	app.showInfo('Disconneted')
}

app.connectToDevice = (device) =>
{
	device.connect(
		app.readServices,
		app.onError)
}

app.readServices = (device) =>
{
	device.readServices(
		['f000aa10-0451-4000-b000-000000000000'],
		app.enableAccelerometer,
		app.onError)
}

/*
//
instance.ACCELEROMETER = {
	SERVICE: 'f000aa10-0451-4000-b000-000000000000',
	DATA: 'f000aa11-0451-4000-b000-000000000000',
	CONFIG: 'f000aa12-0451-4000-b000-000000000000',
	PERIOD: 'f000aa13-0451-4000-b000-000000000000',
}
*/

app.enableAccelerometer = (device) =>
{
	console.log(JSON.stringify(device, null, 2))

	// Turn on accelerometer.
	device.writeServiceCharacteristic(
		'f000aa10-0451-4000-b000-000000000000',
		'f000aa12-0451-4000-b000-000000000000',
		new Uint8Array([1]),
		() => {},
		app.onError)
/*
	// Set update interval.
	var milliseconds = 100
	device.writeServiceCharacteristic(
		'f000aa10-0451-4000-b000-000000000000',
		'f000aa13-0451-4000-b000-000000000000',
		new Uint8Array([milliseconds / 10]),
		() => {},
		app.onError)

	// Set notification to ON.
	device.writeServiceDescriptor(
		'f000aa10-0451-4000-b000-000000000000',
		'f000aa11-0451-4000-b000-000000000000',
		'00002902-0000-1000-8000-00805f9b34fb', // Notification descriptor
		new Uint8Array([1,0]),
		() => {},
		app.onError)

	// Start sensor notification.
	device.enableServiceNotification(
		'f000aa10-0451-4000-b000-000000000000',
		'f000aa11-0451-4000-b000-000000000000',
		app.onAccelerometerData,
		app.onError)
*/

	app.accelerometerTimer = setInterval(
		() => {
			device.readServiceCharacteristic(
				'f000aa10-0451-4000-b000-000000000000',
				'f000aa11-0451-4000-b000-000000000000',
				app.onAccelerometerData,
				app.onError)
		},
		1000)

}

app.onAccelerometerData = (data) =>
{
	data = new Uint8Array(data)
	var accelerometer = app.getAccelerometerValues(data)
	app.showInfo(
		'Accelerometer: ' +
		accelerometer.x + ' ' +
		accelerometer.y + ' ' +
		accelerometer.z + ' ')
}

app.onError = (error) =>
{
	app.showInfo('BLE error ' + error)
}

app.showInfo = (info) =>
{
	document.getElementById('info').innerHTML = info
	//console.log(info)
}

app.isSensorTag = (device) =>
{
	return 'SensorTag' == device.advertisementData.kCBAdvDataLocalName
}

app.getAccelerometerValues = (data) =>
{
	var divisors = {x: 16.0, y: -16.0, z: 16.0}

	// Calculate accelerometer values.
	var ax = evothings.util.littleEndianToInt8(data, 0) / divisors.x
	var ay = evothings.util.littleEndianToInt8(data, 1) / divisors.y
	var az = evothings.util.littleEndianToInt8(data, 2) / divisors.z

	return { x: ax, y: ay, z: az }
}
/*
app.getAccelerometerValues = (data) =>
{
	var ax = data[0]
	var ay = data[1]
	var az = data[2]

	return { x: ax, y: ay, z: az }
}
*/
})()
