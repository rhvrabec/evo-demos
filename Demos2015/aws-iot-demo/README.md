# Amazon AWS Lambda IoT demo

In this tutorial we will create mobile apps in JavaScript that communicate with BLE devices and interact with the AWS Lambda cloud. We will explore three example apps that read and write temperature sensor data using AWS Lambda. It is easy to get started!

<!--more-->

## Mobile apps for IoT and the Amazon cloud

There are many Internet of Things applications that have a need to collect and use sensor data. It is handy to store the sensor data using a cloud service such as AWS Lambda. A wide variety of sensor data can be handled, for instance, vehicle information, container and shipping data, motion tracking and health data.

In this tutorial we will explore IoT applications using Evothings Studio. The demo apps we will use read and write temperature data using the Amazon AWS Lambda cloud service.

If you have a TI SensorTag, there is an example app you can use to read sensor data from the tag and save it to AWS Lambda. And you can use another example app to view the data as it is updated.

By writing your own code, you can connect to other IoT sensors, such as Arduino, MediaTek boards, ARM mbed boards, and many more.

Importantly, you can try out the examples and get started with AWS Lambda without having any specific hardware - we have provided demos for the bare-bones cloud communication.

## Install Evothings Studio

The <a href="http://evothings.com/evothings-studio-starter-kit/">Evothings Studio Starter Kit</a> explains how to install and use Evothings Studio. For the quick version just <a href="http://evothings.com/download/">download the Studio package</a> and get Evothings Client from the app stores.

## Download the example app code

The <a href="https://github.com/divineprog/evo-demos/tree/master/Demos2015/aws-iot-demo">example code for this tutorial</a> is available on GitHub. The demo is called "AWS Lambda IoT Demo" and contains the code needed to run the example apps using Evothings Client and Evothings Workbench.

## Set up your AWS account

Please follow the <a href="http://docs.aws.amazon.com/lambda/latest/dg/setting-up.html"> instructions at the AWS website</a> to get up and running with AWS Lambda.

The files in folder <code>aws-resources</code> contains templates you can use to set up the AWS Lambda service.

## Enter your access keys

Open file <code>aws-config.js</code> and enter your keys and access code, and region id.

Here is an example (NOTE: These are NOT real working values!):

    evothings.aws.config = {
        accessKeyId: 'BKIAJJLEW6SOEIQMFAZQ',
        secretAccessKey: 'FkmcCfctEFwayUYIpYoxeMv+tbgG2E8zbzvW8BQl',
        region: 'eu-west-1'
        params: { FunctionName: 'KOE2015-IoTAPI-SGXAVI8Z1PHK' }
    }

## Overview of the example apps

There are three example apps included with this tutorial. There is also an index file that contains links to the examples, which makes the examples easier to run in Evothings Studio.

Here are the files:

* index.html - Contains links to the example apps, drag this into Evothings Workbench and click RUN to get going.
* aws-app-read-write.html - Example with buttons for writing randomly generated temperature values, and reading the most recent temperature value.
* aws-app-read.html - Example that monitors the most recent temperature value by reading the value from AWS Lambda every 5 seconds.
* aws-app-sensortag.html - Example that connects to the TI SensorTag CC2650 and writes temperature data read from the tag every 5 seconds. Check out the <a href="http://evothings.com/ti-sensortag-starter-kit/">TI SensorTag Starter Kit</a> to get up to speed with the SensorTag.

## Running the demo apps

To make things more interesting, run the apps on different phones. Then you can update the temperature from one phone, using the Read/Write app or the SensorTag app, and read the temperature from another phone using the Read app (or the Read/Write app - then you have to click the Read button for each reading).

The handy thing about using index.html as an entry point is that you can connect two or more phones to the same Evothings Workbench application and run different apps on different devices at the same time. Just press RUN in the Workbench and then navigate to different apps on the phones.

When you edit code and the apps auto-reload, the app you are currently running will be reloaded (not index.html). The trick of using a common index.html file is a handy way to run and edit different apps at the same time using the same Workbench.

Run the demo apps as follows:

<ul>
    <li>Launch Evothings Workbench</li>
    <li>Download the folder with the examples</li>
    <li>Drag file index.html to the Workbench project list window</li>
    <li>Start Evothings Client on your mobile device(s)</li>
    <li>Connect to the Workbench from Evothings Client -  Use the same WiFi network for the Workbench and the mobile and make sure that it allows client connections. Network client isolation must be disabled.</li>
    <li>Click the RUN button on "AWS Lambda IoT Demo" in the Workbench project list.</li>
    <li>On each mobile device, select the app you wish to run on the device by pressing the different buttons.</li>
    <li>Have fun by updating the temperature values from different mobile devices running different apps.</li>
</ul>

## Get started right away

<a href="http://evothings.com/download/">Download Evothings Studio</a> and get up and running within minutes!

Have fun!




