/* @license
 *
 * BLE Abstraction Tool: Evothings BLE plugin adapter
 * Version: 0.0.1
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Rob Moran
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// https://github.com/umdjs/umd
;(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		// Not supported by Cordova.
		define(['bleat', 'bluetooth.helpers'], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS
		// Not supported by Cordova.
		module.exports = function(bleat) {
			return factory(bleat, require('./bluetooth.helpers'));
		};
	} else {
		// Browser globals with support for web workers (root is window)
		// Used with Cordova.
		factory(root.bleat, root.bleatHelpers);
	}
})(this, function(bleat, helpers) {
	"use strict";

	// Object that holds Bleat adapter functions.
	var adapter = {};

	var mDeviceHandles = {};

	// Add adapter object to Bleat. Adapter functions are defined below.
	bleat._addAdapter("evothings", adapter);

	// Begin scanning for devices
	adapter.startScan = function(
		serviceUUIDs,	// String[] serviceUUIDs		advertised service UUIDs to restrict results by
		foundFn,		// Function(Object deviceInfo)	function called with each discovered deviceInfo
		completeFn,		// Function()					function called when scanning completed
		errorFn			// Function(String errorMsg)	function called if error occurs
		)
	{
		evothings.ble.startScan(
			function(deviceInfo) {
				//if (!this.deviceHandles[deviceID]) this.deviceHandles[deviceID] = deviceInfo;
				if (foundFn) { foundFn(createBleatDeviceObject(deviceInfo)); }
			},
			function(error) {
				if (errorFn) { errorFn(error); }
			});
	};

	// Stop scanning for devices
	adapter.stopScan = function(
		errorFn			// Function(String errorMsg)	function called if error occurs
		)
	{
		evothings.ble.stopScan();
	};

	// Connect to a device
	adapter.connect = function(
		handle,			// String handle				device handle
		connectFn,		// Function()					function called when device connected
		disconnectFn,	// Function()					function called when device disconnected
		errorFn			// Function(String errorMsg)	function called if error occurs
		)
	{
		evothings.ble.connect(
			handle,
			function(connectInfo) {
				// Connected.
				if (2 == connectInfo.state && connectFn) {
					mDeviceHandles[handle] = connectInfo.deviceHandle;
					connectFn();
				}
				// Disconnected.
				else if (0 == connectInfo.state && connectFn) {
					if (mDeviceHandles[handle]) {
						 evothings.ble.close(mDeviceHandles[handle]);
						 delete mDeviceHandles[handle];
					}
					disconnectFn();
				}
			},
			function(error) {
				if (errorFn) { errorFn(error); }
			});
	};

	// Disconnect from a device
	adapter.disconnect = function(
		handle,			// String handle				device handle
		errorFn			// Function(String errorMsg)	function called if error occurs
		)
	{
		if (mDeviceHandles[handle]) {
			evothings.ble.close(mDeviceHandles[handle]);
			delete mDeviceHandles[handle];
		}
	};

	// Discover services on a device
	adapter.discoverServices = function(
		handle,			// String handle					device handle
		serviceUUIDs,	// String[] serviceUUIDs			service UUIDs to restrict results by
		completeFn,		// Function(Object[] serviceInfo)	function called when discovery completed
		errorFn			// Function(String errorMsg)		function called if error occurs
		)
	{
		console.log('@@ adapter.discoverServices ' + handle + ' : ' + serviceUUIDs + 'foo')

		if (!mDeviceHandles[handle]) {
			if (errorFn) { errorFn('Device does not exist'); }
			return;
		}

		evothings.ble.services(
			mDeviceHandles[handle],
			function(services) {
		console.log('@@ adapter.discoverServices callback ' + services.length)
				var discoveredServices = [];
				services.forEach(function(serviceInfo) {
					var includeService =
						!serviceUUIDs ||
						0 == serviceUUIDs.length ||
						serviceUUIDs.indexOf(serviceInfo.uuid) >= 0;
					if (includeService) {
						discoveredServices.push(
							{
								_handle: serviceInfo.handle,
								uuid: serviceInfo.uuid,
								primary: true
							});
					}
				});

				if (completeFn) {

		console.log('@@ adapter.discoverServices calling completefn' + JSON.stringify(discoveredServices))
					completeFn(discoveredServices);
				}
			},
			function(error) {
		console.log('@@ adapter.discoverServices error ' + error)
				if (errorFn) { errorFn(error); }
			});
	};

	// Discover included services on a service
	adapter.discoverIncludedServices = function(
		handle,			// String handle					service handle
		serviceUUIDs,	// String[] serviceUUIDs			service UUIDs to restrict results by
		completeFn,		// Function(Object[] serviceInfo)	function called when discovery completed
		errorFn			// Function(String errorMsg)		function called if error occurs
		)
	{
		console.log('@@ adapter.discoverIncludedServices ' + serviceUUIDs)

		// Not implemented in the BLE plugin.
        completeFn([]);
	};

	// Discover characteristics on a service
	adapter.discoverCharacteristics = function(
		handle,					// String handle							service handle
		characteristicUUIDs,	// String[] characteristicUUIDs				characteristic UUIDs to restrict results by
		completeFn,				// Function(Object[] characteristicInfo)	function called when discovery completed
		errorFn					// Function(String errorMsg)				function called if error occurs
		)
	{
		console.log('@@ adapter.discoverCharacteristics: ' + handle)
/*
		var deviceHandle = this.serviceHandles[service._handle];

        evothings.ble.characteristics(deviceHandle, service._handle, function(characteristics) {
                    characteristics.forEach(function(characteristicInfo) {

                        if (characteristicUUIDs.length === 0 || characteristicUUIDs.indexOf(characteristicInfo.uuid) >= 0) {
                            this.characteristicHandles[characteristicInfo.handle] = deviceHandle;
                            var properties = [];// [characteristicInfo.permission + characteristicInfo.property + characteristicInfo.writeType]
                            var characteristic = new bleat._Characteristic(characteristicInfo.handle, characteristicInfo.uuid, properties);
                            service.characteristics[characteristic.uuid] = characteristic;
                        }
            */

	};

	// Discover descriptors on a characteristic
	adapter.discoverDescriptors = function(
		handle,				// String handle						characteristic handle
		descriptorUUIDs,	// String[] descriptorUUIDs				descriptor UUIDs to restrict results by
		completeFn,			// Function(Object[] descriptorInfo)	function called when discovery completed
		errorFn				// Function(String errorMsg)			function called if error occurs
		)
	{
		console.log('@@ adapter.discoverDescriptors ' + descriptorUUIDs)
	};

	// Read a characteristic value
	adapter.readCharacteristic = function(
		handle,			// String handle				characteristic handle
		completeFn,		// Function(DataView value)		function called when read completes
		errorFn			// Function(String errorMsg)	function called if error occurs
		)
	{
	};

	// Write a characteristic value
	adapter.writeCharacteristic = function(
		handle,			// String handle				characteristic handle
		value,			// DataView value				value to write
		completeFn,		// Function(DataView value)		function called when write completes
		errorFn			// Function(String errorMsg)	function called if error occurs
		)
	{
	};

	// Enable value change notifications on a characteristic
	adapter.enableNotify = function(
		handle,			// String handle				characteristic handle
		notifyFn,		// Function(DataView value)		function called when value changes
		completeFn,		// Function()					function called when notifications enabled
		errorFn			// Function(String errorMsg)	function called if error occurs
		)
	{
	};

	// Disable value change notifications on a characteristic
	adapter.disableNotify = function(
		handle,			// String handle				characteristic handle
		completeFn,		// Function()					function called when notifications disabled
		errorFn			// Function(String errorMsg)	function called if error occurs
		)
	{
	};

	// Read a descriptor value
	adapter.readDescriptor = function(
		handle,			// String handle				descriptor handle
		completeFn,		// Function(DataView value)		function called when read completes
		errorFn			// Function(String errorMsg)	function called if error occurs
		)
	{
	};

	// Write a descriptor value
	adapter.writeDescriptor = function(
		handle,			// String handle				descriptor handle
		value,			// DataView value				value to write
		completeFn,		// Function()					function called when write completes
		errorFn			// Function(String errorMsg)	function called if error occurs
		)
	{
	};

	/**
	 * Create a Bleat deviceInfo object based on the device info from the BLE plugin.
	 * @param deviceInfo BLE plugin deviceInfo object (source).
	 * @return Bleat deviceInfo object.
	 */
	function createBleatDeviceObject(deviceInfo)
	{
		// Bleat device object.
		var device = {};

		// Device handle and id.
		device._handle = deviceInfo.address;
		device.id = deviceInfo.address;

		// Use the advertised name as default. Use name in
		// advertisement data if available (see below).
		device.name = deviceInfo.name;

		// Array or service UUIDs (populated below).
		device.uuids = [];

		// Object that holds advertisement data.
		device.adData = {};

		// RSSI value.
		device.adData.rssi = deviceInfo.rssi;

		// txPower not available.
		device.adData.txPower = null;

		// Service data (set below).
		device.adData.serviceData = {};

		// Manufacturer data (set below).
		device.adData.manufacturerData = null;

		if (deviceInfo.advertisementData) {
			parseiOSAdvertisementData(deviceInfo, device);
		}
		else if (deviceInfo.scanRecord) {
			parseScanRecordAdvertisementData(deviceInfo, device);
		}

		return device;
	}

	/**
	 * @param deviceInfo BLE plugin deviceInfo object (source).
	 * @param device Bleat deviceInfo object (destination).
	 */
	function parseiOSAdvertisementData(deviceInfo, device)
	{
		// On iOS advertisement data is available in predefined fields.
		if (deviceInfo.advertisementData) {

			// Device name.
			if (deviceInfo.advertisementData.kCBAdvDataLocalName) {
				device.name = deviceInfo.advertisementData.kCBAdvDataLocalName;
			}

			// txPower.
			if (deviceInfo.advertisementData.kCBAdvDataTxPowerLevel) {
				device.adData.txPower = deviceInfo.advertisementData.kCBAdvDataTxPowerLevel;
			}

			// Service UUIDs.
			if (deviceInfo.advertisementData.kCBAdvDataServiceUUIDs) {
				deviceInfo.advertisementData.kCBAdvDataServiceUUIDs.forEach(function(serviceUUID) {
					device.uuids.push(helpers.getCanonicalUUID(serviceUUID));
				});
			}

			// Service data.
			if (deviceInfo.advertisementData.kCBAdvDataServiceData) {
				for (var uuid in deviceInfo.advertisementData.kCBAdvDataServiceData) {
					var data = deviceInfo.advertisementData.kCBAdvDataServiceData[uuid];
					device.adData.serviceData[uuid] = bufferToDataView(base64DecToArr(data));
				}
			}

			// Manufacturer data.
			// TODO: Create map with company identifier (see Noble adapter).
			if (deviceInfo.advertisementData.kCBAdvDataManufacturerData) {
				// Save raw data as well.
				device.adData.manufacturerDataRaw = deviceInfo.advertisementData.kCBAdvDataManufacturerData;
			}
		}
	}

	/**
	 * Decode the scan record. Data is encoded using a length byte followed by data.
	 * @param deviceInfo BLE plugin deviceInfo object (source).
	 * @param device Bleat deviceInfo object (destination).
	 */
	function parseScanRecordAdvertisementData(deviceInfo, device)
	{
		var byteArray = base64DecToArr(deviceInfo.scanRecord);
		var pos = 0;
		while (pos < byteArray.length) {

			var length = byteArray[pos++];
			if (length === 0) break;
			length -= 1;
			var type = byteArray[pos++];
			var i;

			// Local Name.
			if (type == 0x08 || type == 0x09) {
				// Convert UTF8 encoded buffer and strip null characters from the resulting string.
				device.name = evothings.ble.fromUtf8(
					new Uint8Array(byteArray.buffer, pos, length)).replace('\0', '');
			}
			// TX Power Level.
			else if (type == 0x0a) {
				device.adData.txPower = littleEndianToInt8(byteArray, pos);
			}
			// 16-bit Service Class UUID.
			else if (type == 0x02 || type == 0x03) {
				for (i = 0; i < length; i += 2) {
					device.adData.serviceUUIDs.push(
						helpers.getCanonicalUUID(
							littleEndianToUint16(byteArray, pos + i).toString(16)));
				}
			}
			// 32-bit Service Class UUID.
			else if (type == 0x04 || type == 0x05) {
				for (i = 0; i < length; i += 4) {
					device.adData.serviceUUIDs.push(
						helpers.getCanonicalUUID(
							littleEndianToUint32(byteArray, pos + i).toString(16)));
				}
			}
			// 128-bit Service Class UUID.
			else if (type == 0x06 || type == 0x07) {
				for (i = 0; i < length; i += 16) {
					device.adData.serviceUUIDs.push(
						helpers.getCanonicalUUID(arrayToUUID(byteArray, pos + i)));
				}
			}

			pos += length;
		}
	}
/*
	function stringToArrayBuffer(string) {
		var buffer = new ArrayBuffer(string.length);
		var bufferView = new Uint8Array(buffer);
		for (var i = 0; i < string.length; ++i)
		{
			bufferView[i] = string.charCodeAt(i);
		}
		return buffer;
	}

	function arrayBufferToString(buffer) {
		return String.fromCharCode.apply(null, new Uint8Array(buffer));
	}
*/
	// Code from https://github.com/evothings/evothings-libraries/blob/master/libs/evothings/easyble/easyble.js
	// Should be encapsulated in the native Android implementation (see issue #62)

	function b64ToUint6(nChr) {
		return nChr > 64 && nChr < 91 ? nChr - 65
			: nChr > 96 && nChr < 123 ? nChr - 71
			: nChr > 47 && nChr < 58 ? nChr + 4
			: nChr === 43 ? 62
			: nChr === 47 ? 63
			: 0;
	}

	function base64DecToArr(sBase64, nBlocksSize) {
		var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, "");
		var nInLen = sB64Enc.length;
		var nOutLen = nBlocksSize ?
			Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize :
			nInLen * 3 + 1 >> 2;
		var taBytes = new Uint8Array(nOutLen);

		for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
			nMod4 = nInIdx & 3;
			nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
			if (nMod4 === 3 || nInLen - nInIdx === 1) {
				for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
					taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
				}
				nUint24 = 0;
			}
		}
		return taBytes;
	}

	/**
	 * Interpret byte buffer as little endian 8 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 */
	function littleEndianToInt8(data, offset) {
		var x = data[offset];
		if (x & 0x80) x = x - 256;
		return x;
	}

	function littleEndianToUint16(data, offset) {
		return (data[offset + 1] << 8) + data[offset];
	}

	function littleEndianToUint32(data, offset) {
		return (data[offset + 3] << 24) + (data[offset + 2] << 16) + (data[offset + 1] << 8) + data[offset];
	}

	function arrayToUUID(array, offset) {
		var uuid = "";
		for (var i = 0; i < 16; i++) {
			uuid += ("00" + array[offset + i].toString(16)).slice(-2);
		}
		return uuid;
	}

	function bufferToDataView(buffer) {
		// Buffer to ArrayBuffer
		var arrayBuffer = new Uint8Array(buffer).buffer;
		return new DataView(arrayBuffer);
	}
});
