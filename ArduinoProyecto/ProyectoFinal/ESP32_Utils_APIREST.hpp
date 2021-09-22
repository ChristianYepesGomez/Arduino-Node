//Useful function to get body content
String GetBodyContent(uint8_t *data, size_t len)
{
  String content = "";
  for (size_t i = 0; i < len; i++) {
    content .concat((char)data[i]);
  }
  return content;
}
