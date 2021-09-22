//Information about your network
const char* ssid = "ONOE4CD"; //Network SSID
const char* password = "Hc040915";  //Network password
const char* hostname = "ESP32_1"; //The hostname can be any

//This information its only useful if u need to use static ip otherwise u don't need this
IPAddress ip(192, 168, 1, 200);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
