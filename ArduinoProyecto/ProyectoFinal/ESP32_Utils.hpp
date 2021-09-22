//Both functions make the connection with the network config from "config.h"
//This function its only useful if the user want to use static ip
void ConnectWiFi_STA(bool useStaticIP = true)
{
   Serial.println("");
   WiFi.mode(WIFI_STA);
   WiFi.begin(ssid, password);
   if(useStaticIP) WiFi.config(ip, gateway, subnet);
   //Loop trying the connection with the network
   while (WiFi.status() != WL_CONNECTED) 
   { 
     delay(100);  
     Serial.print('.'); 
   }
 
   Serial.println("");
   Serial.print("Iniciado STA:\t");
   Serial.println(ssid);
   Serial.print("IP address:\t");
   Serial.println(WiFi.localIP());
}

//This function its only useful when user don't need static ip on the esp32
void ConnectWiFi_AP(bool useStaticIP = false)
{ 
   Serial.println("");
   WiFi.mode(WIFI_AP);
   //Loop trying the connection with the network
   while(!WiFi.softAP(ssid, password))
   {
     Serial.println(".");
     delay(100);
   }
   if(useStaticIP) WiFi.softAPConfig(ip, gateway, subnet);

   Serial.println("");
   Serial.print("Iniciado AP:\t");
   Serial.println(ssid);
   Serial.print("IP address:\t");
   Serial.println(WiFi.softAPIP());
}
