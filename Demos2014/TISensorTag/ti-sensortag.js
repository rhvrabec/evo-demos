/**
 * File: sensortag.js
 * Description: JavaScript library for the TI SensorTag.
 * Author: Miki
 */

var TISensorTag = (function()
{
	var sensortag = {}

	sensortag.ACCELEROMETER_UUID = 'f000aa10-0451-4000-b000-000000000000'
	sensortag.MAGNETOMETER_UUID = 'f000aa30-0451-4000-b000-000000000000'

	// TODO: Add UUIDs for other sensor services. Documentation:
	// http://processors.wiki.ti.com/index.php/SensorTag_User_Guide
	// http://processors.wiki.ti.com/index.php/File:BLE_SensorTag_GATT_Server.pdf

	/**
	 * Internal. Override if needed.
	 */
	sensortag.deviceIsSensorTag = function(device)
	{
		return (device != null) &&
			(device.name != null) &&
			(device.name.indexOf('Sensor Tag') > -1 ||
				device.name.indexOf('SensorTag') > -1)
	}

	/**
	 * Public. Create tag instance.
	 */
	sensortag.createInstance = function()
	{
		/**
		 * Internal. Variable holding the sensor tag instance object.
		 */
		var instance = {}

		/**
		 * Internal. Services used by the application.
		 */
		instance.requiredServices = []

		/**
		 * Internal. Default error handler function.
		 */
		instance.errorFun = function(error)
		{
			console.log('SensorTag error: ' + error)
		}

		/**
		 * Public. Set the accelerometer notification callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - accelerometer rate in milliseconds.
		 */
		instance.accelerometerCallback = function(fun, interval)
		{
			instance.accelerometerFun = fun
			instance.accelerometerInterval = interval
			instance.requiredServices.push(sensortag.ACCELEROMETER_UUID)

			return instance
		}

		/**
		 * Public. Set the magnetometer notification callback.
		 * @param fun - success callback called repeatedly: fun(data)
		 * @param interval - accelerometer rate in milliseconds.
		 */
		instance.magnetometerCallback = function(fun, interval)
		{
			instance.magnetometerFun = fun
			instance.magnetometerInterval = interval
			instance.requiredServices.push(sensortag.MAGNETOMETER_UUID)

			return instance
		}

		/**
		 * Public. Set the error handler function.
		 * @param fun - error callback: fun(error)
		 */
		instance.errorCallback = function(fun)
		{
			instance.errorFun = fun

			return instance
		}

		/**
		 * Public. Connect to the closest physical SensorTag device.
		 */
		instance.connectToClosestDevice = function()
		{
			console.log('Scanning...')
			instance.disconnectDevice()
			easyble.stopScan()
			easyble.reportDeviceOnce = false
			var stopScanTime = Date.now() + 2000
			var closestDevice = null
			var strongestRSSI = -1000
			easyble.startScan(
				function(device)
				{
					console.log('Device found: ' + device.name + ' rssi: ' + device.rssi)

					// Connect if we have found a sensor tag.
					if (sensortag.deviceIsSensorTag(device)
						&& device.rssi != 127 // Invalid RSSI value
						)
					{
						console.log('SensorTag found')

						if (device.rssi > strongestRSSI)
						{
							closestDevice = device
							strongestRSSI = device.rssi
						}

						if (Date.now() >= stopScanTime)
						{
							console.log('Closest SensorTag found')
							easyble.stopScan()
							instance.device = closestDevice
							instance.connectToDevice()
						}
					}
				},
				function(errorCode)
				{
					instance.errorFun('Scan failed')
				})

			return instance
		}

		/**
		 * Internal.
		 */
		instance.connectToDevice = function()
		{
			instance.device.connect(
				function(device)
				{
					device.readServices(
						instance.requiredServices,
						instance.activateSensors,
						instance.errorFun)
				},
				instance.errorFun)
		}

		/**
		 * Public/Internal. Disconnect from the physical device.
		 */
		instance.disconnectDevice = function()
		{
			if (instance.device)
			{
				instance.device.close()
				instance.device = null
			}

			return instance
		}

		/**
		 * Internal.
		 */
		instance.activateSensors = function()
		{
			instance.accelerometerOn()
			instance.magnetometerOn()
			// TODO: Turn off more sensors as they are added.
		}

		/**
		 * Turn on accelerometer notification.
		 */
		instance.accelerometerOn = function()
		{
			if (!instance.accelerometerFun) { return }

			// Set accelerometer configuration to ON.
			instance.device.writeCharacteristic(
				'f000aa12-0451-4000-b000-000000000000',
				new Uint8Array([1]),
				function() {},
				instance.errorFun)

			// Set accelerometer update period.
			instance.device.writeCharacteristic(
				'f000aa13-0451-4000-b000-000000000000',
				new Uint8Array([instance.accelerometerInterval / 10]),
				function() {},
				instance.errorFun)

			// Set accelerometer notification to ON.
			instance.device.writeDescriptor(
				'f000aa11-0451-4000-b000-000000000000', // Characteristic for accelerometer data
				'00002902-0000-1000-8000-00805f9b34fb', // Configuration descriptor
				new Uint8Array([1,0]),
				function() {},
				instance.errorFun)

			// Start accelerometer notification.
			instance.device.enableNotification(
				'f000aa11-0451-4000-b000-000000000000',
				instance.accelerometerFun,
				instance.errorFun)

			return instance
		}

		/**
		 * Turn off accelerometer notification.
		 */
		instance.accelerometerOff = function()
		{
			instance.device.disableNotification(
				'f000aa11-0451-4000-b000-000000000000',
				function() {},
				instance.errorFun)

			return instance
		}

		/**
		 * Turn on magnetometer notification.
		 */
		instance.magnetometerOn = function()
		{
			if (!instance.magnetometerFun) { return }

			// Set magnetometer configuration to ON.
			instance.device.writeCharacteristic(
				'f000aa32-0451-4000-b000-000000000000',
				new Uint8Array([1]),
				function() {},
				instance.errorFun)

			// Set magnetometer update period.
			instance.device.writeCharacteristic(
				'f000aa33-0451-4000-b000-000000000000',
				new Uint8Array([instance.magnetometerInterval / 10]),
				function() {},
				instance.errorFun)

			// Set magnetometer notification to ON.
			instance.device.writeDescriptor(
				'f000aa31-0451-4000-b000-000000000000', // Characteristic for magnetometer data
				'00002902-0000-1000-8000-00805f9b34fb', // Configuration descriptor
				new Uint8Array([1,0]),
				function() {},
				instance.errorFun)

			// Start magnetometer notification.
			instance.device.enableNotification(
				'f000aa31-0451-4000-b000-000000000000',
				instance.magnetometerFun,
				instance.errorFun)

			return instance
		}

		/**
		 * Turn off magnetometer notification.
		 */
		instance.magnetometerOff = function()
		{
			instance.device.disableNotification(
				'f000aa11-0451-4000-b000-000000000000',
				function() {},
				instance.errorFun)

			return instance
		}

		// TODO: Add On/Off functions for other sensors.

		return instance
	}

	return sensortag
})()
