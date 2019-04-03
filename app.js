const xml2js = require('xml2js');
const fs = require('fs');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
var request = require("request");
var base64 = require('base-64');

let rawData = fs.readFileSync("rawData.xml", "utf8");
var encodedData = base64.encode(rawData);

console.log(encodedData);

let xml_authentication_header = fs.readFileSync("ezlynx-soap-authentication.xml", "utf8");
let xml_soap_body_opens = fs.readFileSync("ezlynx-soap-body_open.xml", "utf8");
let xml_soap_body_close = fs.readFileSync("ezlynx-soap-body_close.xml", "utf8");

let xml_string = xml_authentication_header.concat(xml_soap_body_opens, encodedData, xml_soap_body_close);

console.log(xml_string);

var options = { method: 'POST',
  url: 'https://uat.webcetera.com/EzLynxWebService/EzLynxFileUpload.asmx',
  qs: { WSDL: '' },
  headers: 
   { 
     SOAPAction: 'http://tempuri.org/UploadFile',
    
     'Content-Type': 'text/xml' },
  body: xml_string };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
}); 
