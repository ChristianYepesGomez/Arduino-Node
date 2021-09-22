//Librarys
#include <DHT.h>
#include <DHT_U.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>

//Define every sensor-pin from the esp32 with a name
#define earth_humidity_sensor 33
#define water_flow 34
#define water_pump 15
#define humidity_sensor 19
#define photo_sensor 32

//Object for the temperature and humidity
DHT dht1(humidity_sensor, DHT22);

//Variables
float humidity_earth = 0;
float temperature = 0;
float humidity = 0;
float light = 0;
float l_minute = 0;
volatile int flow_frequency;

//Files
#include "config.h"
#include "ESP32_Utils.hpp"
#include "API.hpp"
#include "Server.hpp"

void setup()
{
  //Serial communication starts the data transmision with the rate
  Serial.begin(115200);
  //Starts the water pump, water flow and earth_humidity as Output/Input pin
  pinMode(water_pump, OUTPUT);
  pinMode(water_flow, INPUT);
  pinMode(earth_humidity_sensor, INPUT);
  //Enables or disable the voltage for the pins
  digitalWrite(water_pump, LOW);
  digitalWrite(water_flow, HIGH);
  //Useful function for never miss a pulse from the flow sensor
  attachInterrupt(digitalPinToInterrupt(water_flow), flow, RISING);
  //Start the dht sensor
  dht1.begin();
  //Connect to the network when all the sensor are ready
  ConnectWiFi_STA();
  sei(); // Enable interrupts
  //Starts the webserver
  InitServer();
}

void loop()
{
  //Loop to caught the information from the sensor every second, Serial.println are just informative and don't have any impact on the program
  delay(1000);
  //Read the data from the sensors
  temperature = dht1.readTemperature();
  humidity = dht1.readHumidity();
  light = analogRead(photo_sensor);
  humidity_earth = analogRead(earth_humidity_sensor);

  Serial.println("Temperatura");
  Serial.println(temperature);
  Serial.println("Humedad");
  Serial.println(humidity);
  Serial.println("Luz");
  Serial.println(light);
  Serial.println("Humedad de la tierra");
  Serial.println(humidity_earth);

  //only read the flow from water if have any
  if (flow_frequency != 0) {
    l_minute = (flow_frequency / 7.5);
    flow_frequency = 0; // Reset Counter
    Serial.print(l_minute, DEC); // Print litres/minute
    Serial.println("L/Minuto");
    Serial.println(l_minute);
  } else {
    l_minute = 0;
  }
}

void flow()
{
  flow_frequency++;
}
