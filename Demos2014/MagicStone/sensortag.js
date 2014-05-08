/*
Starting point for a JavaScript TI SensorTag library.
*/

var sensortag = (function()
{
	var sensortag = {}

	sensortag.device = null

	sensortag.rssiLimitForConnect = -60

	/**
	 * Internal, but possible to override.
	 */
	sensortag.deviceIsSensorTag = function(device)
	{
		return (device != null) &&
			(device.name != null) &&
			(device.name.indexOf('Sensor Tag') > -1 ||
				device.name.indexOf('SensorTag') > -1)
	}

	/**
	 * Connect to a nearby sensor tag.
	 * @param services - array with UUID strings for used services.
	 * @param win - success callback: win(device)
	 * @param fail - error callback: fail(errorCode)
	 */
	sensortag.connect = function(services, win, fail)
	{
		console.log('scanning')
		sensortag.disconnect()
		easyble.stopScan()
		easyble.reportDeviceOnce = false
		easyble.startScan(
			function(device)
			{
				console.log('device found: ' + device.name + ' rssi: ' + device.rssi)

				// Connect if we have found a sensor tag.
				if (sensortag.deviceIsSensorTag(device) &&
					device.rssi != 127 && // 127 is sometimes given as a value
					device.rssi > sensortag.rssiLimitForConnect)
				{
					console.log('SensorTag found')
					easyble.stopScan()
					sensortag.device = device
					device.connect(
						function(device)
						{
							device.readServices(
								services,
								win,
								fail)
						},
						function(errorCode)
						{
							fail(errorCode)
						})

				}
			},
			function(errorCode)
			{
				fail('Scan failed')
			})
	}

	/**
	 * Disconnect the sensor tag.
	 */
	sensortag.disconnect = function()
	{
		if (sensortag.device)
		{
			sensortag.device.close()
			sensortag.device = null
		}
	}

	/**
	 * Turn on accelerometer notification.
	 * @param updateInterval - accelerometer rate in milliseconds.
	 * @param services - array with UUID strings for used services.
	 * @param win - success callback called repeatedly: win(data)
	 * @param fail - error callback: fail(errorCode)
	 */
	sensortag.acceleromenterOn = function(updateInterval, win, fail)
	{
		// Set accelerometer configuration to ON.
		sensortag.device.writeCharacteristic(
			'f000aa12-0451-4000-b000-000000000000',
			new Uint8Array([1]),
			function() {},
			fail)

		// Set accelerometer update period.
		sensortag.device.writeCharacteristic(
			'f000aa13-0451-4000-b000-000000000000',
			new Uint8Array([updateInterval / 10]),
			function() {},
			fail)

		// Set accelerometer notification to ON.
		sensortag.device.writeDescriptor(
			'f000aa11-0451-4000-b000-000000000000', // Characteristic for accelerometer data
			'00002902-0000-1000-8000-00805f9b34fb', // Configuration descriptor
			new Uint8Array([1,0]),
			function() {},
			fail)

		// Start accelerometer notification.
		sensortag.device.enableNotification(
			'f000aa11-0451-4000-b000-000000000000',
			win,
			fail)
	}

	/**
	 * Turn on accelerometer notification.
	 * @param win - success callback: win()
	 * @param fail - error callback: fail(errorCode)
	 */
	sensortag.acceleromenterOff = function(win, fail)
	{
		// Stop accelerometer notification.
		sensortag.device.disableNotification(
			'f000aa11-0451-4000-b000-000000000000',
			win,
			fail)
	}

	return sensortag
})()
