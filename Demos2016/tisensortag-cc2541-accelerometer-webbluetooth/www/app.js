

;(function () {
	'use strict';

	// Application object that exposes global functions.

	window.app = {};

	// UUIDs
	var accelerometerServiceUUID = 'f000aa10-0451-4000-b000-000000000000';
	var accelerometerDataUUID = 'f000aa11-0451-4000-b000-000000000000';
	var accelerometerConfigUUID = 'f000aa12-0451-4000-b000-000000000000';
	var accelerometerPeriodUUID = 'f000aa13-0451-4000-b000-000000000000'; // Unused

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
			return gattServer.getPrimaryService(accelerometerServiceUUID);
		}).then(function (service) {
			log('Accelerometer service: ' + service.uuid);
			accelerometerService = service;
			return accelerometerService.getCharacteristic(accelerometerConfigUUID);
		}).then(function (characteristic) {
			log('Accelerometer config characteristic: ' + characteristic.uuid);
			return characteristic.writeValue(new Uint8Array([1]));
		}).catch(function (error) {
			log(error);
			process.exit();
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