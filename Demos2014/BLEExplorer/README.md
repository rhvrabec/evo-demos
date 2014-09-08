# BLE Explorer

Example program that connects to a BLE device and lists services, characteristics and descriptors.

The purpose is to provide some basic code as a starting point for learning, tinkering and experimenting.

This is not a ready to use app, rather it is meant to be run in Evothings Workbench, inspect the output log in the "Tools" Window.

## BLE Crash Course

The structure of a BLE device is like this:

	device
	  services
	    characteristics
	      descriptors

Key points:

* Services group functionality.
* Characteristics represent data that you can read, write, or subscribe to using notifications.
* Descriptors contain "meta-data" for characteristics, they are not used that often in my experience.

To connect to a BLE device, you first scan for BLE devices, then connect to the device you wish to use. Here is an outline:

1. Scan for devices.
2. In the scan callback function, identify the device by name (most common method currently, but not perfect).
3. When the device you want is found, connect to it.
4. When connected scan for services, characteristics, descriptors.
5. Write and/or read the characteristics you wish to use. Enable any notifications you will use.

The example app "BLE Scan" in Evothings Studio is a good starting point for learning how to scan for devices. There is currently a bug in this example that causes problems on Android - the function app.stopScan in file app.js should be like this:

	// Stop scanning for devices.
	app.stopScan = function()
	{
	    evothings.ble.stopScan();
	};

## Running the BLE Explorer app using Evothings Studio

The BLE Explorer app is meant to be run using [**Evothings Studio**](http://evothings.com/download). It should be noted that it is just a Cordova app runnint inside the Evothings Client container app. You can build a native BLE Explorer app using Cordova.

When developing apps with Evothings Studio, you run the Evothings Client app on your mobile device to execute the application, and you use Evothings Workbench on your laptop/desktop machine, running a live-reload server.

To run the app, do as follows:

* Install the **Evothings Client** app on your iOS or Android device (available in the AppStore and on Google Play).
* [Download Evothings Studio](http://evothings.com/download).
* Grab the [source code for the BLE Explorer app](https://github.com/divineprog/evo-demos/tree/master/Demos2014/BLEExplorer) from GitHub.
* Drag and drop index.html into the Evothings Workbench running on your computer.
* Open the Tools window in the Workbench by pressing "Tools" (this is where console output will display).
* Activate a BLE device to scan for.
* Connect from Evothings Client to the Workbench.
* Press Run in the Workbench project list.
* Inspect the result in the Tools window, name of active BLE devices should appear, if you see none, press Run again.
* Open file index.html in a text editor and update the line **var myDeviceName = 'StickNfind'** to have the name of the BLE device you want to connect to, then save the file (app reloads automatically when you save the code).
* Inspect the result in the Tools window, if successful you should now connect to a device and see its data.

## Using BLE from JavaScript

To access BLE from JavaScript, the [Evothings BLE plugin for Apache Cordova](https://github.com/evothings/cordova-ble) is used.

Files of interest:

* [ble.js](https://github.com/evothings/cordova-ble/blob/master/ble.js) is the API for the BLE plugin. This file is shipped with the Evothings Client app (which is built with Cordova), and is not included in the source code for the BLE Explorer app.
* [easy-ble.js](https://github.com/divineprog/evo-demos/blob/master/Demos2014/MagicStone/easy-ble.js) is a high-level abstraction of the API in ble.js.

Good luck, have fun!

Welcome to ask questions at the [Evothings Forum](http://forum.evothings.com/).

