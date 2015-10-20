// https://github.com/don/node-eddystone-beacon/network

var eddystoneBeacon = require('eddystone-beacon');

var options = {
  txPowerLevel: -22,  // override TX Power Level, default value is -21
  tlmCount: 2,       // 2 TLM frames
  tlmPeriod: 10      // every 10 advertisements
};

//var url = 'http://example.com';
//eddystoneBeacon.advertiseUrl(url, options);

eddystoneBeacon.advertiseUrl('http://www.google.com');
