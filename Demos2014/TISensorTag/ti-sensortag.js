/**
 * File: sensortag.js
 * Description: JavaScript library for the TI SensorTag.
 * Author: Miki
 */

var TISensorTag = (function()
{
	var sensortag = {}

	sensortag.IRTEMPERATURE_SERVICE = 'f000aa00-0451-4000-b000-000000000000'
	sensortag.IRTEMPERATURE_CONFIG = 'f000aa02-0451-4000-b000-000000000000'
	sensortag.IRTEMPERATURE_PERIOD = 'f000aa03-0451-4000-b000-000000000000'
	sensortag.IRTEMPERATURE_DATA = 'f000aa01-0451-4000-b000-000000000000'
	sensortag.IRTEMPERATURE_NOTIFICATION = '00002901-0000-1000-8000-00805f9b34fb'

	sensortag.ACCELEROMETER_SERVICE = 'f000aa10-0451-4000-b000-000000000000'
	sensortag.ACCELEROMETER_CONFIG = 'f000aa12-0451-4000-b000-000000000000'
	sensortag.ACCELEROMETER_PERIOD = 'f000aa13-0451-4000-b000-000000000000'
	sensortag.ACCELEROMETER_DATA = 'f000aa11-0451-4000-b000-000000000000'
	sensortag.ACCELEROMETER_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'

	sensortag.HUMIDITY_SERVICE = 'f000aa20-0451-4000-b000-000000000000'
	sensortag.HUMIDITY_CONFIG = 'f000aa22-0451-4000-b000-000000000000'
	sensortag.HUMIDITY_PERIOD = 'f000aa23-0451-4000-b000-000000000000'
	sensortag.HUMIDITY_DATA = 'f000aa21-0451-4000-b000-000000000000'
	sensortag.HUMIDITY_NOTIFICATION = '00002901-0000-1000-8000-00805f9b34fb'

	sensortag.MAGNETOMETER_SERVICE = 'f000aa30-0451-4000-b000-000000000000'
	sensortag.MAGNETOMETER_CONFIG = 'f000aa32-0451-4000-b000-000000000000'
	sensortag.MAGNETOMETER_PERIOD = 'f000aa33-0451-4000-b000-000000000000'
	sensortag.MAGNETOMETER_DATA = 'f000aa31-0451-4000-b000-000000000000'
	sensortag.MAGNETOMETER_NOTIFICATION = '00002902-0000-1000-8000-00805f9b34fb'


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
			instance.requiredServices.push(sensortag.ACCELEROMETER_SERVICE)

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
			instance.requiredServices.push(sensortag.MAGNETOMETER_SERVICE)

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
			instance.sensorOn(
				sensortag.ACCELEROMETER_CONFIG,
				sensortag.ACCELEROMETER_PERIOD,
				instance.accelerometerInterval,
				sensortag.ACCELEROMETER_DATA,
				instance.accelerometerFun)

			return instance
		}

		/**
		 * Turn off accelerometer notification.
		 */
		instance.accelerometerOff = function()
		{
			instance.sensorOff(sensortag.ACCELEROMETER_DATA)

			return instance
		}

		/**
		 * Turn on magnetometer notification.
		 */
		instance.magnetometerOn = function()
		{
			instance.sensorOn(
				sensortag.MAGNETOMETER_CONFIG,
				sensortag.MAGNETOMETER_PERIOD,
				instance.magnetometerInterval,
				sensortag.MAGNETOMETER_DATA,
				instance.magnetometerFun)

			return instance
		}

		/**
		 * Turn off magnetometer notification.
		 */
		instance.magnetometerOff = function()
		{
			instance.sensorOff(sensortag.MAGNETOMETER_DATA)

			return instance
		}

		// TODO: Add On/Off functions for other sensors.

		/**
		 * Helper function for turning on sensor notification.
		 */
		instance.sensorOn = function(
			configUUID,
			periodUUID,
			periodValue,
			dataUUID,
			notificationUUID,
			notificationFunction)
		{
			// Only start sensor if a notification function has been set.
			if (!notificationFunction) { return }

			// Set sensor configuration to ON.
			instance.device.writeCharacteristic(
				configUUID,
				new Uint8Array([1]),
				function() {},
				instance.errorFun)

			// Set sensor update period.
			instance.device.writeCharacteristic(
				periodUUID,
				new Uint8Array([periodValue / 10]),
				function() {},
				instance.errorFun)

			// Set sensor notification to ON.
			instance.device.writeDescriptor(
				dataUUID, // Characteristic for data
				notificationUUID, // Configuration descriptor
				new Uint8Array([1,0]),
				function() {},
				instance.errorFun)

			// Start sensor notification.
			instance.device.enableNotification(
				dataUUID,
				notificationFunction,
				instance.errorFun)

			return instance
		}

		/**
		 * Helper function for turning off sensor notification.
		 */
		instance.sensorOff = function(dataUUID)
		{
			instance.device.disableNotification(
				dataUUID,
				function() {},
				instance.errorFun)

			return instance
		}

		// Finally, return the SensorTag instance object.
		return instance
	}

	// Return the SensorTag 'class' object.
	return sensortag
})()
