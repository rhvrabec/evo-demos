# Cordova Live Reload

Use [Evothings Workbench](http://evothings.com/doc/studio/workbench.html]) to get live reload and develop your Cordova app with a fast workflow.

## Use connect.html to quickly develop your Cordova app

This is a standard Cordova app generated with cordova create. Use it in place of Evothings Client to get live reload for your custom Cordova apps. This is useful if you for example want to use plugins not included in Evothings Client.

Two modifications have been made to the project:

* The file [www/connect.html](www/connect.html) file has been added. This file is completely self contained, there are no dependencies on external libraries or style sheets.

* The entry &lt;content src="connect.html"/&gt; has been added to [config.xml](config.xml).

You can just copy and add connect.html to your own Cordova project to make it easy to connect to Evothings Workbench. When ready to test/ship the app, just edit the Cordova config.xml to use &lt;content src="index.html"/&gt;

## How to connect to Evothings Workbench

Here are the steps to connect to Evothings Workbench and run the index.html file in this project:

* First download Evothings Workbench, it is included with the [Evothings Studio download](http://evothings.com/download/).

* Enter the Connect URL displayed Evothings Workbench in the address field in the app and tap the Connect button (you will find the Connect URL in the bottom panel of the Evothings Workbench project window).

* Drag index.html to the Workbench project list.

* Click RUN in the Workbench window. You now have live reload enabled, just save the code in your editor and the app reloads.

* Make sure your computer and phone/tablet are on a WiFi network that allows connections (client isolation must be off).

## How to build this app using Cordova

If you are new to Cordova, here is how to build this app:

* Install Cordova using the [Evothings Cordova step-by-step guides](http://evothings.com/doc/build/build-overview.html).

* Get the files for the app from GitHub.

* In a command window, go to the folder cordova-live-reload.

* To build for iOS:
<pre>cordova platform add ios
cordova build ios</pre>
The generated Xcode project is located in folder "platforms/ios".

* To build for Android:
<pre>cordova platform add android
cordova build android</pre>
The generated APK-file is located in folder "platforms/android/ant-build".

When using Evothings Workbench you don't need to rebuild using Cordova. When you want to rebuild the native app, do these steps:

* Edit config.xml to use: <pre>&lt;content src="index.html"/&gt;</pre>

* Rebuild the project using: <pre>cordova build ios
cordova build android</pre>

## Become an expert on Cordova IoT app development

To learn more read these articles and tutorials:

* [Setup Cordova for Evothings Workbench](http://evothings.com/doc/build/cordova-guide.html#SetupCordovaForEvothings)

* [Cordova IoT Starter Kit](http://evothings.com/cordova-starter-kit/)

* [Hybrid app development made fast](http://evothings.com/hybrid-app-development-made-fast/)

* [Evothings Studio Starter Kit](http://evothings.com/evothings-studio-starter-kit/)
