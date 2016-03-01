/*
This program displays accelerometer values for the TI SensorTag CC2541.
*/

var bluetooth = require('./index').webbluetooth;

// Variables.
var gattServer;
var accelerometerService;
var accelerometer;

// UUIDs
var accelerometerServiceUUID = 'f000aa10-0451-4000-b000-000000000000';
var accelerometerDataUUID    = 'f000aa11-0451-4000-b000-000000000000';
var accelerometerConfigUUID  = 'f000aa12-0451-4000-b000-000000000000';
var accelerometerPeriodUUID  = 'f000aa13-0451-4000-b000-000000000000'; // Unused

function log(message) {
	console.log(message);
}

function getAccelerometerValues(data) {
	var divisors = { x: 16.0, y: -16.0, z: 16.0 };

	// Calculate accelerometer values.
	var ax = data.getInt8(0, true) / divisors.x;
	var ay = data.getInt8(1, true) / divisors.y;
	var az = data.getInt8(2, true) / divisors.z;

	return { x: ax, y: ay, z: az };
}

function readAccelerometer(characteristic) {
	characteristic.readValue(new Uint8Array([1])).then(data => {
		var accelerometer = getAccelerometerValues(data);
		log('x: ' + accelerometer.x);
		log('y: ' + accelerometer.y);
		log('z: ' + accelerometer.z);
	})
}

function connect() {
	log('Requesting Bluetooth Devices...');
	bluetooth.requestDevice({
		//filters:[{ services:[ '0xf000aa10' ] }]
		filters:[] // The SensorTag does not advertise services.
	})
	.then(device => {
		log('Found device: ' + device.name);
		log(device);
		return device.gatt.connect();
	})
	.then(server => {
		gattServer = server;
		log('SensorTag connected: ' + gattServer.connected);
		return gattServer.getPrimaryService(accelerometerServiceUUID);
	})
	.then(service => {
		log('Accelerometer service: ' + service.uuid);
		accelerometerService = service
		return accelerometerService.getCharacteristic(accelerometerConfigUUID);
	})
	.then(characteristic => {
		log('Accelerometer config characteristic: ' + characteristic.uuid);
		return characteristic.writeValue(new Uint8Array([1]))
	})
	.then(() => {
		return accelerometerService.getCharacteristic(accelerometerDataUUID);
	})
	.then(characteristic => {
		log('Accelerometer data characteristic: ' + characteristic.uuid);
		// Read accelerometer every second.
		var timer = setInterval(() => { readAccelerometer(characteristic) }, 1000)
		// Keep going for 10 seconds
		setTimeout(() => {
			clearInterval(timer);
			gattServer.disconnect();
			log('Gatt server connected: ' + gattServer.connected);
			process.exit();
			},
			10000)
	})
	.catch(error => {
		log(error);
		process.exit();
	});
}

connect()
