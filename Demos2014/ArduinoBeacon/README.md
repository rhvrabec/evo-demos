<h1>DIY Arduino Beacons</h1>

This example is a mobile app for Android and iOS that uses an Arduino board as a beacon. This is like a Do-It-Yourself version of Apple's <a href="http://en.wikipedia.org/wiki/IBeacon">iBeacon</a> technology. Under the hood, an iBeacon is just a small BLE (Bluetooth Low Energy) device that advertises a specific UUID (Universally Unique Identifier). If we put an BLE shield on an Arduino, we have all that we need to do something similar. Arduino compatible boards with built in BLE also work fine, such as the <a href="http://redbearlab.com/">RedBearLab Blend Micro</a> board or the <a href="http://punchthrough.com/bean/">LightBlue Bean</a>.

<h2>The example app - Beacons for relaxation</h2>
The mobile app used in this tutorial is meant for use in a place where we want to give people time to relax and experience calm, for example a museum, an airport, a medical center, or a park.

When approaching a beacon, the app will display a page that suggests a method for relaxation. The beacon itself (the Arduino board) could be used just as it is, or be placed inside some object that signify the existence of a beacon, or be visually hidden.

Screenshot from the app:

<img style="width:150px;height:auto;margin-right:5px;" src="http://evomedia.evothings.com/2014/08/relaxing-places-screen1.png" alt="relaxing-places-screen1" />

There could be as many beacons as you would want, in this example we will use three beacons.

The reason we are using the Arduino for the beacons is that it can be easily programmed, and that it is a cool tinker-friendly piece of technology that you can evolve far beyond the limits of iBeacons.

<h2>How to make the Arduino work as a Beacon</h2>

When a beacon is sending out signals, it uses the BLE advertise mode. The device repeatedly sends out information about itself, including a name that you can set in your Arduino code. In addition, the signal strength is available (RSSI = Received Signal Strength Indicator), which can be used to determine which beacon is the closest one. When you walk around with your mobile phone in your hand, another beacon will eventually become the closest one, and the app will then show the information associated with that beacon. As you will see, it is remarkably simple to program this kind of mobile application using Evothings Studio.

The Arduino sketch will in essence do just one thing, set the name of the BLE shield. This name will be used for BLE advertisements. Note that you will have to load a sketch with a unique BLE name onto every Arduino board you intend to use as a beacon (if you would use the same name, there would be no way to tell the difference between the Arduinos).

Arduino code (file <a href="https://github.com/divineprog/evo-demos/blob/master/Demos2014/ArduinoBeacon/ArduinoBeacon/ArduinoBeacon.ino">ArduinoBeacon.ino</a>):
<pre>// Arduino code for example Arduino BLE Beacon.
// Evothings AB, 2014

// Include BLE files.
#include
#include
#include &lt;RBL_nRF8001.h&gt;
#include

// This function is called only once, at reset.
void setup()
{
    // Enable serial debug.
    Serial.begin(9600);
    Serial.println("Arduino Beacon example started");
    Serial.println("Serial rate set to 9600");

    // Set a custom BLE name for the beacon.
    // Note that each Arduino should be given a unique name!
    ble_set_name("BEACON1");

    // Initialize BLE library.
    ble_begin();

    Serial.println("Beacon activated");
}

// This function is called continuously, after setup() completes.
void loop()
{
    // Process BLE events.
    ble_do_events();
}
</pre>

<h2>How the mobile app works</h2>

The mobile app that monitors beacons is developed in HTML and JavaScript using Evothings Studio. The app will run in the Evothings Client app. As the final step, we will host the code on a web server, so that the visitors of the place where we have placed the beacons can easily run the app. (Note that <a href="http://evothings.com/doc/build/build-overview.html">you can also make a native app</a> and publish it on the app stores.)

The app continuously scans for advertising BLE devices, then determine which are our beacons, and shows the information page associated with the beacons that is closest. If no beacon is within range, a default info page will be shown. The range of BLE signals is about 10 to 30 meters.

The HTML content of the pages shown in the application's webview is found in <a href="https://github.com/divineprog/evo-demos/blob/master/Demos2014/ArduinoBeacon/index.html">index.html</a>. Each page is defined within a div tag.

Monitoring beacons and selecting which info page to show is done in JavaScript code, found in file <a href="https://github.com/divineprog/evo-demos/blob/master/Demos2014/ArduinoBeacon/app.js">app.js</a>.

Here is the dictionary definition for the beacon pages (in app.js):
<pre>// Mapping of beacon names to page ids.
app.beaconPages =
{
    'BEACON1':'page-feet',
    'BEACON2':'page-shoulders',
    'BEACON3':'page-face'
}
</pre>

Note that the names of your beacons must match the names used as keys in the above dictionary.

And here is the code that gets called each time a BLE device advertisement is received by the app (this happens continuously):
<pre>app.deviceFound = function(deviceInfo)
{
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
</pre>

Logic for selection the closest beacon is found in the timer function <strong>app.runSelectPageTimer</strong>, which gets called at regular intervals.

In total, the app has the following code files:

<ul>
	<li>index.html - main page, contains div tags for info pages</li>
	<li>app.js - the JavaScript code for the app, included in index.html</li>
	<li>page.css - style sheet definitions</li>
	<li>ArduinoBeacon - folder with the ArduinoBeacon.ino file</li>
</ul>

There are also image files used in the app. You will find <a href="https://github.com/divineprog/evo-demos/tree/master/Demos2014/ArduinoBeacon">all project files on GitHub</a>.

<h2>Running the app using Evothings Studio</h2>
<ul>
	<li>To run the app, first download Evothings Studio. </li>
	<li>Then install the Evothings Client app on your mobile device(s).</li>
	<li>Download the code for the app from GitHub into a folder on your computer.</li>
	<li>Drag the file index.html into Evothings Workbench.</li>
	<li>Connect from the Evothings Client app to the Workbench.</li>
	<li>Press RUN in the Workbench window.</li>
	<li>Remember to configure your Arduinos with the proper names for the app to work!</li>
</ul>

<h2>Running the app from a web server</h2>
To share the app with others, you can host it on a web server. Do as follows:
<ul>
	<li>Download the code for the app from GitHub and put it on a web server.</li>
	<li>Ask your users to install the Evothings Client app on their mobile devices.</li>
	<li>Connect from Evothings Client to the web server by entering the address to the server in the app and tap CONNECT. For example, if you put the files on a web server with the address <code>http://myserver.com/mybeaconapp</code> just enter that address in Evothings Client and connect.</li>
	<li>Remember to configure your Arduinos with the proper names for the app to work!</li>
</ul>

<h2>Use any BLE device as a beacon</h2>

You should be able to use almost any BLE device that does advertising as a beacon. Just enter the name of the device in the dictionary <strong>app.beaconPages</strong> as shown above.

You can use the app <strong>BLE Scan</strong> that comes as an example included with Evothings Studio to determine the name of your BLE devices.

The advantage of using an Arduino as a beacon is that you can change its name used for advertising.

You can also change the name of the <a href="http://punchthrough.com/bean/">LightBlue Bean</a> device, by connecting to a bean using the <a href="http://punchthrough.com/bean/getting-started/">Bean Loader App</a> and clicking on the name and edit it (no coding required to do this).

Other devices have other procedures for setting the name, and some devices you cannot change the name for.

An alternative to using the advertising name for determining the identity of the beacon is to use the device address. This does however work differently on Android and on iOS, as the device address will be different depending on the platform. What you could do is to check for both of the addresses reported on iOS and on Android.

Here is a code snippet you can use to find the name and address of your BLE devies. This code prints the device name and address to the debug console found under the TOOLS button in Evothings Workbench:

<pre>app.deviceFound = function(deviceInfo)
{
    hyper.log('Found device: ' + deviceInfo.name + '  ' + deviceInfo.address)
}
</pre>

<h2>Finding the documentation for the BLE plugin</h2>

It can be a bit confusing when you are new to Evothings Studio to understand where the Cordova JavaScript files are. Here is a short explanation.

The Cordova BLE plugin shipped with the Evothings Client app is documented in the <a href="https://github.com/evothings/cordova-ble/blob/master/ble.js">JavaScript file for the plugin</a>. This JavaScript file is built into the Evothings Client app, and needs not be part of your application if you run the app from Evothings Client.

Note that you never should include ble.js explicitly in your app code. It will be included automatically when you include cordova.js.

Also note that all the cordova.js files (including ble.js) are already in the Evothings Client app. That is why they are not present among the project files for the application.

<h2>Where to go from here</h2>

This tutorial was meant to introduce the concept of "Do-It-Yourself" beacons, which works differently from Apple's iBeacons. While both DIY beacons and iBeacons build on the same technology, there are some twists to iBeacons, covered in <a href="http://www.mutualmobile.com/posts/ibeacons-lessons-learned">this blogpost by Sean McMains at mutualmobile</a>.

Evothings Client includes a <a href="https://github.com/petermetz/cordova-plugin-ibeacon">Cordova iBeacon plugin</a>, that you can use to develop apps for Apple's iBeacon technology. See the <a href="http://evothings.com/doc/examples/ibeacon-scan.html">iBeacon Scan example app</a> that comes with Evothings Studio.

Please feel free to drop in on the <a href="http://forum.evothings.com/">Evothings Forum</a>, to discuss technology, applications, ask questions, and share experiences.

