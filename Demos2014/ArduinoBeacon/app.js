// JavaScript code for the Arduino Beacon example app.

// Application object.
var app = {}

// Mapping of beacon names to page ids.
app.beaconPages =
{
	'BEACON1':'page-feet',
	'BEACON2':'page-shoulders',
	'BEACON3':'page-face'
}

// Signal strength of beacons.
app.beaconRSSI = {}

// Currently closest beacon.
app.currentBeacon = null

// Currently displayed page.
app.currentPage = 'page-default'

app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		app.onDeviceReady,
		false)
	app.gotoPage(app.currentPage)
}

app.onDeviceReady = function()
{
	// Cordova plugins are initialised, BLE is available.
	app.runClearBeaconTimer()
	app.startScan()
	app.runSelectPageTimer()
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
	// Note that RSSI value ranges from approx -127 to 0.
	// http://stackoverflow.com/questions/13705647/finding-distance-from-rssi-value-of-bluetooth-low-energy-enable-device
	// Sometimes the RSSI is 127, which is a buggy value
	// that we filter this out below.

	// Have we found one of our beacons?
	if (app.beaconPages[deviceInfo.name] && deviceInfo.rssi < 0)
	{
		// Update signal strength for beacon.
		app.beaconRSSI[deviceInfo.name] =
		{
			rssi: deviceInfo.rssi,
			timestamp: Date.now()
		}
	}
}

// Called on scan error.
// @param errorCode - String
app.scanError = function(errorCode)
{
	// Report error.
	alert('Beacon Scan Error: ' + errorCode)
}

// Monitor beacons and display the page for the closest beacon.
app.runSelectPageTimer = function()
{
	// Find the closest beacon.
	var closestBeacon = null
	for (var beaconName in app.beaconRSSI)
	{
		if (!closestBeacon)
		{
			// First beacon found.
			closestBeacon = beaconName
		}
		else
		{
			var rssiBeacon = app.beaconRSSI[beaconName].rssi
			var rssiClosest = app.beaconRSSI[closestBeacon].rssi
			if (rssiBeacon > rssiClosest)
			{
				// Stronger beacon found.
				closestBeacon = beaconName
			}
		}
	}

	// Are we closer to a new beacon?
	if (app.currentBeacon != closestBeacon)
	{
		// Remember the current beacon.
		app.currentBeacon = closestBeacon

		// Get the page to display.
		var page = app.beaconPages[app.currentBeacon]
		if (!page) { page = 'page-default' }

		// Display the page.
		app.gotoPage(page)
	}

	// Clear again after a time interval.
	setTimeout(function() { app.runSelectPageTimer() }, 500)
}

// Clear old beacon readings. This is done at a time interval
// to clear old beacon readings that may now be out of range.
app.runClearBeaconTimer = function()
{
	for (var beaconName in app.beaconRSSI)
	{
		var beaconInfo = app.beaconRSSI[beaconName]
		if (Date.now() - 10000 > beaconInfo.timestamp)
		{
			delete app.beaconRSSI[beaconName]
		}
	}

	// Clear again after a time interval.
	setTimeout(function() { app.runClearBeaconTimer() }, 1000)
}

app.gotoPage = function(pageId)
{
	app.hidePage(app.currentPage)
	app.showPage(pageId)
	app.currentPage = pageId
}

app.showPage = function(pageId)
{
	document.getElementById(pageId).style.display = 'block'
}

app.hidePage = function(pageId)
{
	document.getElementById(pageId).style.display = 'none'
}

// Set up the application.
app.initialize()
