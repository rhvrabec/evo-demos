// JavaScript code for the Arduino Beacon example app.

// Application object.
var app = {}

app.beaconPages = {
	'BEACON1':'page-feet.html',
	'BEACON2':'page-shoulders.html',
	'BEACON3':'page-head.html'
}

// Signal strength of beacons.
app.beaconRSSI = {}

// Currently closest beacon.
app.currentBeacon = null

app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		app.onDeviceReady,
		false)
}

app.onDeviceReady = function()
{
	// Cordova plugins are initialised, BLE is available.
	app.startScan()
	app.monitorClosestBeacon()
}

// Start scanning for beacons.
app.startScan = function()
{
	evothings.ble.startScan(
		app.deviceFound,
		app.scanError)
}

// Called when a device is found.
// @param deviceInfo - Object with fields: address, rssi, name
app.deviceFound = function(deviceInfo)
{
	// Is this a beacon?
	var page = app.beaconPages[deviceInfo.name]
	if (page)
	{
		// Update signal strength for beacon.
		app.beaconRSSI[deviceInfo.name] = deviceInfo.rssi
	}
}

// Called on scan error.
// @param errorCode - String
app.scanError = function(errorCode)
{
	// Report error.
	alert('Beacon Scan Error: ' + errorCode);
}


// Called when a device is found.
app.monitorClosestBeacon = function()
{
	// Determine closest beacon.
	// Note that RSSI value ranges from approx -127 to 0.
	// http://stackoverflow.com/questions/13705647/finding-distance-from-rssi-value-of-bluetooth-low-energy-enable-device

	var closestBeacon = null
	for (var beaconName in app.beaconRSSI)
	{
		if (!closestBeacon)
		{
			// First beacon found.
			closestBeacon = beaconName
		}
		else if (app.beaconRSSI[beaconName] > app.beaconRSSI[strogestBeacon])
		{
			// Found stronger beacon.
			closestBeacon = beaconName
		}
	}

	// Are we closer to a new beacon now?
	if (app.currentBeacon != closestBeacon)
	{
		// Remember the current beacon.
		app.currentBeacon = closestBeacon

		// Get the page to display.
		var page = app.beaconPages[app.currentBeacon]
hyper.log('showing page: ' + page)
		// Show the page.
		window.frames[0].location.assign(page)
	}

	// Refresh RSSI table.
	app.beaconRSSI = {}

	// Monitor again after time interval.
	setTimeout(function() { app.monitorClosestBeacon() }, 2000)
}

// Set up the application.
app.initialize()

