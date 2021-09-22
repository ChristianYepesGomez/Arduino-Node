//This file contains all the function to read the data and bring it to the API as JSON

//Useful librarys/Files
#include "ESP32_Utils_APIREST.hpp"
#include <ArduinoJson.h>

const char* PARAM_FILTER = "filter";
StaticJsonDocument<250> jsonDocument;
char buffer[250];

//Function to make easier the creation of the json
void create_json(char *tag, float value, char *unit) {
  jsonDocument.clear();
  jsonDocument["type"] = tag;
  jsonDocument["value"] = value;
  jsonDocument["unit"] = unit;
  serializeJson(jsonDocument, buffer);
}

//Function to get the value of the temperature and return it to the API
void getTemperature(AsyncWebServerRequest *request) {
  //Create the json with the information from the sensor
  create_json("temperature", temperature, "Cº");
  //Send it back as response
  request->send(200, "application/json", buffer);
}


//Function to get the value of the earth humidity and return it to the API
void getEarthHumidity(AsyncWebServerRequest *request) {
  create_json("earth_Humidity", humidity_earth, "%");
  request->send(200, "application/json", buffer);
}

//Function to get the value of the Ambiental Humidity and return it to the API
void getHumidity(AsyncWebServerRequest *request) {
  create_json("humidity", humidity, "%");
  request->send(200, "application/json", buffer);
}

//Function to get the value of the Light and return it to the API
void getLight(AsyncWebServerRequest *request) {
  create_json("light", light, "Ohms");
  request->send(200, "application/json", buffer);
}

//Function to get the value of the Flow of water and return it to the API
void getFlow(AsyncWebServerRequest *request) {
  create_json("flow", l_minute, "L/Minute");
  request->send(200, "application/json", buffer);
}

//Function to return the state of the pump water - True/False
void getRequest(AsyncWebServerRequest *request) {
  bool statusPump = digitalRead(water_pump);
  create_json("status", statusPump, "");
  request->send(200, "application/json", buffer);
}

//Function to turn On/Off the pump water
void postRequest(AsyncWebServerRequest * request, uint8_t *data, size_t len, size_t index, size_t total)
{
  String bodyContent = GetBodyContent(data, len);

  //Read the json from the postRequest
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, bodyContent);
  if (error) {
    request->send(400);
    return;
  }
  //Save it on variables
  String message;
  String id = doc["id"];
  bool relayStatus = doc["status"];

  //If status its true then turn pump ON else OFF
  if (relayStatus) {
    message = "turn on";
    digitalWrite(water_pump, HIGH);
  } else {
    message = "turn off";
    digitalWrite(water_pump, LOW);
  }

  //Send the information
  request->send(200, "text/plain", message);
}
