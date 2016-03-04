

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var bluetooth = navigator.bluetooth;
var gattServer;
var accelerometer;

function log(message) {
	console.log(message);
}

/*
// Only in SensorTag CC2541.
instance.ACCELEROMETER = {
    SERVICE: 'f000aa10-0451-4000-b000-000000000000',
    DATA: 'f000aa11-0451-4000-b000-000000000000',
    CONFIG: 'f000aa12-0451-4000-b000-000000000000',
    PERIOD: 'f000aa13-0451-4000-b000-000000000000',
}
*/

log('Requesting Bluetooth Devices...');
bluetooth.requestDevice({
	//filters:[{ services:[ '0xf000aa10' ] }]
	filters: []
}).then(function (device) {
	log('Found device: ' + device.name);
	log(device);
	//return device.connectGATT();
	return device.gatt.connect();
}).then(function (server) {
	gattServer = server;
	log('Gatt server connected: ' + gattServer.connected);
	return gattServer.getPrimaryService('f000aa10-0451-4000-b000-000000000000');
}).then(function (service) {
	log('Primary service: ' + service.uuid);
	return service.getCharacteristic('f000aa11-0451-4000-b000-000000000000');
}).then(function (characteristic) {
	log('Characteristic: ' + characteristic.uuid);
	accelerometer = characteristic;
	return accelerometer.getDescriptors();
}).then(function (descriptors) {
	descriptors.forEach(function (descriptor) {
		log('Descriptor: ' + descriptor.uuid);
	});

	return Array.apply(null, Array(10)).reduce(function (sequence) {
		return sequence.then(function () {
			return accelerometer.readValue();
		}).then(function (value) {
			log('typeof value: ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)));
			log(JSON.stringify(value));
			log(value);
			//var view = new DataView(value);
			//log('Value: ' + view.getUint16(0));
		});
	}, Promise.resolve());
}).then(function () {
	gattServer.disconnect();
	log('Gatt server connected: ' + gattServer.connected);
	process.exit();
}).catch(function (error) {
	log(error);
	process.exit();
});