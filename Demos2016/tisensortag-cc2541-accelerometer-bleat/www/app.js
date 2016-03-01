

;(function () {
	'use strict';

	// Application object

	window.app = {};

	app.device = null;

	document.addEventListener('deviceready', function () {
		app.init();
	}, false);

	app.init = function () {
		console.log('@@@ app.init');
	};

	app.start = function () {
		app.showInfo('Scanning...');

		// Start scan.
		bleat.startScan(function (device) {
			app.showInfo('BLE Found device: ' + device.name + ' ' + JSON.stringify(device.adData));
			if (app.isSensorTag(device)) {
				bleat.stopScan();
				app.device = device;
				app.connectToDevice();
			}
		}, app.onError);
	};

	app.stop = function () {
		bleat.stopScan();

		if (app.accelerometerTimer) {
			clearInterval(app.accelerometerTimer);
			app.accelerometerTimer = null;
		}

		if (app.device && app.device.connected) {
			app.device.disconnect();
			app.device = null;
		}

		app.showInfo('Disconnected');
	};

	app.connectToDevice = function () {
		app.device.connect(app.readServices, app.onError, false);
	};

	app.readServices = function () {
		app.showInfo('Connected');
		/*device.readServices(
  	['f000aa10-0451-4000-b000-000000000000'],
  	app.enableAccelerometer,
  	app.onError)
  	*/
	};

	app.showInfo = function (info) {
		document.getElementById('info').innerHTML = info;
		console.log(info);
	};

	app.isSensorTag = function (device) {
		return 'SensorTag' == device.name;
	};

	app.getAccelerometerValues = function (data) {
		var divisors = { x: 16.0, y: -16.0, z: 16.0 };

		// Calculate accelerometer values.
		var ax = evothings.util.littleEndianToInt8(data, 0) / divisors.x;
		var ay = evothings.util.littleEndianToInt8(data, 1) / divisors.y;
		var az = evothings.util.littleEndianToInt8(data, 2) / divisors.z;

		return { x: ax, y: ay, z: az };
	};
})();