# How to use the TI SensorTag with JavaScript

Mikael Kindborg, Evothings AB

## Quickly develop apps for Internet of Things (IoT)

Evothings Studio is a set of development tools that makes it fun to develop IoT-apps for mobile phones and tablets. In this article, we will take a look at a high-level library for the TI SensorTag, a BLE (Bluetooth Low Energy) device that features all sorts of sensors. With this library, it is easy to write mobile apps in JavaScript and HTML for the SensorTag.

## The TI SensorTag

The [Texas Instruments TI SensorTag](http://www.ti.com/ww/en/wireless_connectivity/sensortag/) is a small device that features a range of sensors that can be used for various projects and applications.

Photo of the TI SensorTag:

![TI SensorTag](TISensorTag600x400.png)

## Demo app

The demo app showcases the TI SensorTag. Coded in JavaScript, the app runs on a mobile phone or tablet (Android or iOS). Input from the TI SensorTag is displayed on-screen in real time.

This is what the app looks like:

![TISensorTag screenshot](TISensorTagScreenshot600x340.jpg)

## Running the app using Evothings Studio

The TI SensorTag app has been developed using [**Evothings Studio**](http://evothings.com/download).

When developing apps with Evothings Studio, you run the Evothings Client app on your mobile device to execute the application, and you use Evothings Workbench on your laptop/desktop machine, running a live-reload server.

To run the app, do as follows:

* Install the **Evothings Client** app on your iOS or Android device (available in the AppStore and on Google Play)
* [Download Evothings Studio](http://evothings.com/download)
* Grab the [source code for the TI SensorTag app](https://github.com/divineprog/evo-demos/tree/master/Demos2014/TISensorTag) from GitHub
* Drag and drop index.html into the Evothings Workbench running on your computer
* Connect from Evothings Client to the Workbench
* Press Run in the Workbench
* Make sure the SensorTag is in announce mode
* Live sensor data is displayed on the screen

## Fun things to do

You can modify the app in various ways. Play around with the source code, find out how to use Evothings Studio to quickly see your changes on the mobile device.

## Using BLE from JavaScript

The TI SensorTag uses Bluetooth Low Energy (BLE) to communicate with your phone or tablet. To access BLE from JavaScript, the [Evothings BLE plugin for Apache Cordova](https://github.com/evothings/cordova-ble) is used.

Files of interest:

* [ble.js](https://github.com/evothings/cordova-ble/blob/master/ble.js) is the API for the BLE plugin. This file built into the Evothings Client app (which is built with Cordova), and is not included in the source code for the app.
* [easy-ble.js](https://github.com/divineprog/evo-demos/blob/master/Demos2014/TISensorTag/easy-ble.js) is a high-level abstraction of the API in ble.js.
* [ti-sensortag.js](https://github.com/divineprog/evo-demos/blob/master/Demos2014/TISensorTag/ti-sensortag.js) is a high-level library for the TI SensorTag.

The documentation for the UUIDs used by SensorTag services and characteristics is found here: [SensorTag_User_Guide](http://processors.wiki.ti.com/index.php/SensorTag_User_Guide),
[BLE_SensorTag_GATT_Server.pdf](http://processors.wiki.ti.com/index.php/File:BLE_SensorTag_GATT_Server.pdf).

## Building a native app

Any app you create using Evothings Studio can be packaged as a native Apache Cordova app, that can then be published on the app stores. The Evothings Client app itself is a Cordova app, and it was even developed using Evothings Workbench!

How to build a native app with Cordova is described in the [Evothings Build Documentation](http://evomedia.evothings.com/doc/app-build.html).

## Share your projects

Announce your apps and keep the discussion going on the [Evothings Forum](http://forum.evothings.com/).
