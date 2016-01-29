;(function()
{
	// Application object.
	var app = {}

	// Dictionary of beacons.
	var mBeacons = {}

	// List of display objects.
	var mItems = []

	function initialize()
	{
		document.addEventListener(
			'deviceready',
			function() { evothings.scriptsLoaded(onDeviceReady) },
			false)
	};

	function onDeviceReady()
	{
		// Create sensor items.
		makeItems()

		// Initial layout.
		layoutItems()

		// Start tracking beacons!
		setTimeout(startScan, 1000)

		// Display refresh timer.
		setInterval(updateDisplay, 2000)

		// Layout timer.
		setInterval(layoutDisplay, 5000)
	}

	function startScan()
	{
		// Called continuously when ranging beacons.
		evothings.eddystone.startScan(
			function(beacon)
			{
				// Insert/update beacon table entry.
				mBeacons[beacon.address] = beacon
				beacon.timeStamp = Date.now()
				var accuracy = calculateAccuracy(beacon.txPower, beacon.rssi)
				if (accuracy)
				{
					beacon.distance = Math.round(accuracy / 10)
				}
				updateBeaconItem(beacon)
			},
			function(error)
			{
				console.log('Eddystone Scan error: ' + JSON.stringify(error))
			})
	}

	function updateBeaconItem(beacon)
	{
		if (beacon.displayItem)
		{
			if (beacon.distance)
			{
				beacon.displayItem.distance = beacon.distance
			}

			if (beacon.temperature && beacon.temperature != 0x8000)
			{
				beacon.displayItem.temperature = beacon.temperature
			}

			return
		}

		// Associate an item with the beacon.
		for (var i = 0; i < mItems.length; ++i)
		{
			var item = mItems[i]
			if (!item.hasBeacon)
			{
				item.hasBeacon = true
				beacon.displayItem = item
				beacon.displayItem.distance = beacon.distance
				return
			}
		}
	}

	function updateDisplay()
	{
		updateSensorData()
		displaySensorData()
	}

	function layoutDisplay()
	{
		sortItems()
		layoutItems()
	}

	function makeItems()
	{
		makeItem('id-item-carrots', 'Carrots', 'images/carrots.jpg')
		makeItem('id-item-lettuce', 'Lettuce', 'images/lettuce.jpg')
		makeItem('id-item-pumpkin', 'Pumpkin', 'images/pumpkin.jpg')
		makeItem('id-item-garlic', 'Garlic', 'images/garlic.jpg')
		makeItem('id-item-potatoes', 'Potatoes', 'images/potatoes.jpg')
		makeItem('id-item-paprika', 'Paprika', 'images/paprika.jpg')
	}

	function makeItem(id, title, image)
	{
		var element = $('#id-item-prototype').clone()
		element.attr('id', id)
		element.find('h2').html(title)
		element.find('img').attr('src', image)
		element.appendTo('.style-items')
		element.show()

		// Add element to list of items.
		mItems.push({
			element: element,
			hasBeacon: false,
			distance:  2000 * Math.random(),
			temperature: 0,
			humidity: 0,
			uvlight: 0
			})
	}

	function updateSensorData()
	{
		for (var i = 0; i < mItems.length; ++i)
		{
			var item = mItems[i]

			// Update simulated sensor data.
			item.humidity = 80 + Math.random() * 3
			item.uvlight = 5 + Math.random()

			// If item has no beacon use simulated distance.
			if (!item.hasBeacon)
			{
				item.distance = 2000 + Math.random() * 500
				item.temperature = 20 + Math.random() * 3
			}
		}
	}

	function displaySensorData()
	{
		for (var i = 0; i < mItems.length; ++i)
		{
			var item = mItems[i]

			setItemTemperature(item, item.temperature)
			setItemHumidity(item, item.humidity)
			setItemUVLight(item, item.uvlight)
			setItemDistance(item, item.distance)
		}
	}

	function layoutItems()
	{
		var x = 0
		var y = 0
		for (var i = 0; i < mItems.length; ++i)
		{
			var item = mItems[i]
			item.element.css('top', y)
			y += item.element.height() + 25
		}
	}

	function sortItems()
	{
		mItems.sort(function(item1, item2)
		{
			return (item1.distance > item2.distance) ? 1 : -1
		})
	}

	function setItemTemperature(item, value)
	{
		setItemSensorValue(item, '.style-temperature', value.toFixed(2), ' C')
	}

	function setItemHumidity(item, value)
	{
		setItemSensorValue(item, '.style-humidity', value.toFixed(2), ' &#37;')
	}

	function setItemUVLight(item, value)
	{
		setItemSensorValue(item, '.style-uvlight', value.toFixed(2))
	}

	function setItemDistance(item, value)
	{
		if (value >= 100)
		{
			setItemSensorValue(item, '.style-distance', Math.round(value / 100), ' m')
		}
		else
		{
			setItemSensorValue(item, '.style-distance', value, ' cm')
		}
	}

	function setItemSensorValue(item, sensorType, value, unit)
	{
		if (!value) { return }
		if (unit) { value += unit }
		item.element.find(sensorType).html(value)
	}

	// http://stackoverflow.com/questions/21338031/radius-networks-ibeacon-ranging-fluctuation
	// http://developer.radiusnetworks.com/2014/12/04/fundamentals-of-beacon-ranging.html
	function calculateAccuracy(txPower, rssi)
	{
		if (rssi >= 0 || !txPower)
		{
			return null
		}

		var ratio = rssi * 1.0 / txPower
		if (ratio < 1.0)
		{
			return Math.pow(ratio, 10)
		}
		else
		{
			var accuracy = (0.89976) * Math.pow(ratio, 7.7095) + 0.111
			return accuracy
		}
	}

	initialize()

	return app
})()
