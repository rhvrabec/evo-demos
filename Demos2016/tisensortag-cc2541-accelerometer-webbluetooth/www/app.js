

;(function () {
	'use strict';

	// Application object that exposes global functions.

	window.app = {};

	// UUIDs
	var accelerometerServiceUUID = 'f000aa10-0451-4000-b000-000000000000';
	var accelerometerDataUUID = 'f000aa11-0451-4000-b000-000000000000';
	var accelerometerConfigUUID = 'f000aa12-0451-4000-b000-000000000000';
	var accelerometerPeriodUUID = 'f000aa13-0451-4000-b000-000000000000';

	// Variables.
	var gattServer;
	var accelerometerService;
	var accelerometer;

	function log(message) {
		console.log(message);
	}

	document.addEventListener('deviceready', function () {
		init();
	}, false);

	function init() {
		console.log('@@@ app.init');
	}

	function readAccelerometer(characteristic) {
		characteristic.readValue().then(function (data) {
			log('got accel data: ' + data);
			var accelerometer = getAccelerometerValues(data);
			log('x: ' + accelerometer.x);
			log('y: ' + accelerometer.y);
			log('z: ' + accelerometer.z);
		});
	}

	function getAccelerometerValues(data) {
		var divisors = { x: 16.0, y: -16.0, z: 16.0 };

		// Calculate accelerometer values.
		var ax = data.getInt8(0, true) / divisors.x;
		var ay = data.getInt8(1, true) / divisors.y;
		var az = data.getInt8(2, true) / divisors.z;

		return { x: ax, y: ay, z: az };
	}

	function onAccelerometerChanged(event) {
		var characteristic = event.target;
		console.log(JSON.stringify(getAccelerometerValues(characteristic.value)));
	}

	app.start = function () {
		showInfo('Scanning...');

		bleat.requestDevice({
			//filters:[{ services:[ '0xf000aa10' ] }]
			filters: [] // The SensorTag does not advertise services.
		}).then(function (device) {
			log('Found device: ' + device.name);
			return device.gatt.connect();
		}).then(function (server) {
			gattServer = server;
			log('SensorTag connected: ' + gattServer.connected);
			showInfo('Connected');
			return gattServer.getPrimaryService(accelerometerServiceUUID);
		}).then(function (service) {
			// Get accelerometer config characteristic.
			accelerometerService = service;
			return accelerometerService.getCharacteristic(accelerometerConfigUUID);
		}).then(function (characteristic) {
			// Turn accelerometer config to ON.
			return characteristic.writeValue(new Uint8Array([1]));
		}).then(function () {
			// Get period characteristic.
			return accelerometerService.getCharacteristic(accelerometerPeriodUUID);
		}).then(function (characteristic) {
			// Set update interval.
			var milliseconds = 100;
			return characteristic.writeValue(new Uint8Array([milliseconds / 10]));
		}).then(function () {
			// Get data characteristic.
			return accelerometerService.getCharacteristic(accelerometerDataUUID);
		}).then(function (characteristic) {
			// Start sensor notification.
			log('Start notficatons');
			characteristic.addEventListener('characteristicvaluechanged', onAccelerometerChanged);
			return characteristic.startNotifications();
		})
		/* Test of read
  .then(() => {
  	log('Value written')
  	return accelerometerService.getCharacteristic(accelerometerDataUUID);
  })
  .then(characteristic => {
  	log('Accelerometer data characteristic: ' + characteristic.uuid);
  	// Read accelerometer every second.
  	var timer = setInterval(() => { readAccelerometer(characteristic) }, 1000)
  	// Keep going for 10 seconds
  	setTimeout(() => {
  		clearInterval(timer)
  		gattServer.disconnect()
  		log('Gatt server connected: ' + gattServer.connected)
  		},
  		10000)
  })
  */
		.catch(function (error) {
			log(error);
		});
	};

	app.stop = function () {
		if (gattServer.connected) {
			gattServer.disconnect();
		}

		showInfo('Disconnected');
	};

	function showInfo(info) {
		document.getElementById('info').innerHTML = info;
		console.log(info);
	}
})();