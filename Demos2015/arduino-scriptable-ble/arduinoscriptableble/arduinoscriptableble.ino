/*
Arduino BLE Script Server

Created February 5, 2015
Mikael Kindborg, Evothings AB

BLE socket server that accept commands for basic scripting
of the Arduino board.

The API consists of the requests listed below.

The response is a 2-byte value ranging from 0 to FFFF.

Possible response values:

1 - HIGH (result from digital read)
0 - LOW (result from digital read)
0 to 1023 - Analog value (result from analog read)

Set pin mode to OUTPUT for pin n: On
Response: None
Example: O5
Note: O is upper case letter o.

Set pin mode to INPUT for pin n: In
Response: None
Example: I5

Write LOW to pin n: Ln
Response: None
Example: L5

Write HIGH to pin n: Hn
Response: None
Example: H5

READ pin n: Rn
Response: "H" (HIGH) or "L" (LOW)
Example: R5 -> H

ANALOG read pin n: An
Response: int value as string (range "0" to "1023")
Example: A5 -> 42

Protocol data format:
header - 1 byte (MAGIC_HEADER_BYTE)
numbytes - 1 byte (payload size)
payload - numbyte bytes
*/

// Include BLE files.
#include <SPI.h>
#include <boards.h>
#include <RBL_nRF8001.h>
#include <services.h>

#define MAGIC_HEADER_BYTE 42

int  readIndex = 0;
int  bytesToRead = 0;
char commandBuffer[16];
bool digitalPinMonitors[16];
int  digitalPinValues[16];
bool analogPinMonitors[8];
int  analogPinValues[8];

// This function is called only once, at reset.
void setup()
{
	// Enable serial debug.
	Serial.begin(9600);
	Serial.println("Scriptable BLE server started");
	Serial.println("Serial rate set to 9600");

	// Default pins set to 9 and 8 for REQN and RDYN
	// Set your REQN and RDYN here before ble_begin() if you need
	//ble_set_pins(3, 2);

	// Initialize BLE library.
	ble_begin();

	// Set a custom BLE name.
	ble_set_name("ArduinoBLE");

	Serial.println("ble_begin done!");

	memset(digitalPinMonitors, 0, sizeof(digitalPinMonitors));
	memset(analogPinMonitors, 0, sizeof(analogPinMonitors));
}

void sendResult(unsigned char command, int pin, unsigned int value)
{
	unsigned char buffer[16];

        buffer[0] = MAGIC_HEADER_BYTE;
        buffer[1] = 4; // We always send 4 byte payload for now.
	buffer[2] = command;
	buffer[3] = pin;
	buffer[4] = value & 0x00FF;
	buffer[5] = value >> 8;

	ble_write_bytes(buffer, 6);
}

int readCommand()
{
	while (ble_available())
	{
		// Read one byte.
		int c = ble_read();

		// Check that if this is the header byte.
		if (0 == bytesToRead && MAGIC_HEADER_BYTE == c)
		{
			break;
		}

		// If we are not reading, this is the number of bytes.
		if (0 == bytesToRead)
		{
			bytesToRead = c;
			break;
		}

		// Append byte to buffer.
		commandBuffer[readIndex] = c;
		++ readIndex;

		// Have we got all bytes?
		if (readIndex == bytesToRead)
		{
                        readIndex = 0;
                        bytesToRead = 0;
			return true;
		}
	}
	return false;
}

int executeCommand()
{
	int command = commandBuffer[0]; // Command letter
	int param1 = commandBuffer[1];  // Pin
	int param2 = commandBuffer[2];  // Monitoring on/off flag

        Serial.print("Execute: ");
        Serial.print(command);
        Serial.print(" ");
        Serial.println(param1);

	if ('O' == command)
	{
		pinMode(param1, OUTPUT);
	}
	else if ('I' == command)
	{
		pinMode(param1, INPUT);
	}
	else if ('L' == command)
	{
		digitalWrite(param1, LOW);
	}
	else if ('H' == command)
	{
		digitalWrite(param1, HIGH);
	}
	else if ('R' == command)
	{
		// Turn of/off monitoring of the pin given by param1.
		// param2 is 1 or 0 (on/off).
		digitalPinMonitors[param1] = param2;
		if (param2)
		{
			// Save and send initial reading.
			digitalPinValues[param1] = digitalRead(param1);
			sendResult('R', param1, digitalPinValues[param1]);
		}
	}
	else if ('A' == command)
	{
		// Turn of/off monitoring of the pin given by param1.
		// param2 is 1 or 0 (on/off).
		analogPinMonitors[param1] = param2;
		if (param2)
		{
			// Save and send initial reading.
			analogPinValues[param1] = analogRead(param1);
			sendResult('A', param1, analogPinValues[param1]);
		}
	}
}

int checkMonitoredPins()
{
	// For all digital pins.
	for (int i = 0; i < sizeof(digitalPinMonitors); ++i)
	{
		// Is this pin monitored?
		if (digitalPinMonitors[i])
		{
			// Has value changed?
			int currentValue = digitalRead(i);
			if (digitalPinValues[i] != currentValue)
			{
				// Save current value and send result.
				digitalPinValues[i] = currentValue;
				sendResult('R', i, digitalPinValues[i]);
			}
		}
	}

	// For all analog pins.
	for (int i = 0; i < sizeof(analogPinMonitors); ++i)
	{
		// Is this pin monitored?
		if (analogPinMonitors[i])
		{
			// Has value changed?
			int currentValue = analogRead(i);
			if (analogPinValues[i] != currentValue)
			{
				// Save current value and send result.
				analogPinValues[i] = currentValue;
				sendResult('A', i, analogPinValues[i]);
			}
		}
	}
}

// This function is called continuously, after setup() completes.
void loop()
{
	// Read and execute commands.
	if (readCommand())
	{
		executeCommand();
	}

	// Read monitored input values.
	checkMonitoredPins();

	// Process BLE events.
	ble_do_events();
}
