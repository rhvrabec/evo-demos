# Magic Stone - Make mobile apps for the TI SensorTag in JavaScript

Mikael Kindborg, Evothings AB

## Impressing your friends with some magical IoT trickery

Evothings Studio is a set of development tools that make it fun to develop IoT-apps for mobile phones and tablets. While at an Evothings hackathon earlier this Spring, we played around with a TI SensorTag, using the accelerometer to move around an object on the screen.

Here is a [video of the original demo](http://www.youtube.com/watch?v=lO9Ys4uOjdY) done at the Evothings hackathon (March 26, 2014).

Several whacky ideas come up from this experiment. For example, moving a picture of a glass of water, making the glass drop off the screen at the edges, or moving a picture of a really heavy object like a rock.

Starting to play around with these ideas, I decided to to a Magic Stone, hiding the SensorTag in the hand while moving it. Taking a photo of a stone I found in my garden, I set off and built the app. Here follows a description of the whole thing.

## TI SensorTag

The [Texas Instruments TI SensorTag](http://www.ti.com/ww/en/wireless_connectivity/sensortag/) is a small device that features a range of sensors that can be used for various projects and applications.

Photo of the TI SensorTag:

![TI SensorTag](TISensorTag600x400.png)

## Magic Stone demo app

Magic Stone is a demo app that showcases the TI SensorTag. Coded in JavaScript, the app runs on a mobile phone or tablet (Android or iOS), reading accelerometer input from the TI SensorTag to control an onscreen object - a scanned image of a stone.

This is what the app looks like:

![Magic Stone screenshot](MagicStoneScreenshot600x340.jpg)

[Watch a video of the app in action](http://www.youtube.com/watch?v=Cxd0OS1FNsc) - revealing the hidden TI SensorTag ;)

## Running the app using Evothings Studio

The Magic Stone app has been developed using [**Evothings Studio**](http://evothings.com/download).

When developing apps with Evothings Studio, you run the Evothings Client app on your mobile device to execute the application, and you use Evothings Workbench on your laptop/desktop machine, running a live-reload server.

To run the Magic Stone app, do as follows:

* Install the **Evothings Client** app on your iOS or Android device (available in the AppStore and on Google Play)
* [Download Evothings Studio](http://evothings.com/download)
* Grab the [source code for the Magic Stone app](https://github.com/divineprog/evo-demos/tree/master/Demos2014/MagicStone) from GitHub
* Drag and drop index.html into the Evothings Workbench running on your computer
* Connect from Evothings Client to the Workbench
* Press Run in the Workbench
* Make sure the SensorTag is in announce mode
* Use the SensorTag to control the movements of the stone (the accelerometer is used for this)

## Using BLE from JavaScript

The TI SensorTag uses Bluetooth Low Energy (BLE) to communicate with your phone or tablet. To access BLE from JavaScript, the [Evothings BLE plugin for Apache Cordova](https://github.com/evothings/cordova-ble) is used.

Files of interest:

* [ble.js](https://github.com/evothings/cordova-ble/blob/master/ble.js) is the API for the BLE plugin. This file is shipped with the Evothings Client app (which is built with Cordova), and is not included in the source code for the Magic Stone app.
* [easy-ble.js](https://github.com/divineprog/evo-demos/blob/master/Demos2014/MagicStone/easy-ble.js) is a high-level abstraction of the API in ble.js.
* [sensortag.js](https://github.com/divineprog/evo-demos/blob/master/Demos2014/MagicStone/sensortag.js) is a high-level library for the TI SensorTag. The only sensor implemented at the moment is the accelerometer. It is easy to add more sensors, and this is something I am planning to do.

The documentation for the UUIDs used by SensorTag services and characteristics is found here: [SensorTag_User_Guide](http://processors.wiki.ti.com/index.php/SensorTag_User_Guide),
[BLE_SensorTag_GATT_Server.pdf](http://processors.wiki.ti.com/index.php/File:BLE_SensorTag_GATT_Server.pdf).

## Building a native app

Any app you create using Evothings Studio can be packaged as a native Apache Cordova app, that can then be published on the app stores. Actually, the Evothings Client app itself is a Cordova app, and it was even developed using Evothings Workbench!

Building a native Android app with Apache Cordova:

* Install the Android SDK.
* Install Apache Cordova and create a template app by following the
[instructions in the Cordova tutorial](http://cordova.apache.org/docs/en/3.4.0/guide_cli_index.md.html#The%20Command-Line%20Interface)
* The above step can take some time and effort to complete!
* Put your HTML, CSS, JavaScript and media files in the www folder in
the Cordova project.
* Build and test your app. You get
and apk-file you can install on your device in folder: platforms/android/ant-build/
* Note that it works perfectly fine to develop the Cordova app in
Evothings Studio. Just drag and drop index.html in project list in the
Workbench window. Then run the app using Evothings Client, or...
* ...enter the connect url in place of index.html in config.xml. When you
start the app it will connect to the Workbench, just click Run in the Workbench to
launch your app.
* You can now build your app and deploy it to Google Play.

Building a native iOS app with Apache Cordova:

* You need a Mac with Xcode and an Apple developer
 membership to install apps on devices.
* Install Apache Cordova and create a template app by following the
[instructions in the Cordova tutorial](http://cordova.apache.org/docs/en/3.4.0/guide_cli_index.md.html#The%20Command-Line%20Interface)
* The above step can take some time and effort to complete!
* Put your HTML, CSS, JavaScript and media files in the www folder in
the Cordova project.
* Build and test your app. You get an Xcode project you can open and run in folder: platforms/ios/
* Note that it works perfectly fine to develop the Cordova app in
Evothings Studio. Just drag and drop index.html in project list in the
Workbench window. Then run the app using Evothings Client, or...
* ...enter the connect url in place of index.html in config.xml. When you
start the app it will connect to the Workbench, just click Run in the Workbench to
launch your app.
* You can now build your app and deploy it to the AppStore.

## Share your projects

Feel free to announce your apps on the [Evothings Forum](http://forum.evothings.com/). We would love to hear about your work!
