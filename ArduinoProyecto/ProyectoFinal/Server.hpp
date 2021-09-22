//Start the webserver so can make the API
AsyncWebServer server(80);

//Useful function for testing
void homeRequest(AsyncWebServerRequest *request) {
  request->send(200, "text/plain", "Hello, world");
}

//Function if something goes wrong with the webserver
void notFound(AsyncWebServerRequest *request) {
	request->send(404, "text/plain", "Not found");
}

//Starts the server
void InitServer()
{
  //Put the headers to avoid problems with auth
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Authorization");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  DefaultHeaders::Instance().addHeader("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  //Starts the API on every url from the webServer
  server.on("/temperature",HTTP_GET, getTemperature);
  server.on("/humidity", getHumidity);
  server.on("/light", getLight);
  server.on("/flow", getFlow);
  server.on("/earth_humidity", getEarthHumidity);
	server.on("/", HTTP_GET, homeRequest);
	server.on("/status", HTTP_GET, getRequest);
	server.on("/status", HTTP_POST, [](AsyncWebServerRequest * request){}, NULL, postRequest);

  //Function if the server don't work properly
  server.onNotFound([](AsyncWebServerRequest *request) {
  if (request->method() == HTTP_OPTIONS) {
    request->send(200);
  } else {
    request->send(404);
  }
});
  //Starts the webServer
	server.begin();
    Serial.println("HTTP server started");
}
