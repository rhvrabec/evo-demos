// Arduino code for example Arduino BLE Beacon.
// Evothings AB, 2014

// Include BLE files.
#include <SPI.h>
#include <boards.h>
#include <RBL_nRF8001.h>
#include <services.h>

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
