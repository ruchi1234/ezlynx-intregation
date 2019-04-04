const xml2js = require('xml2js');
const fs = require('fs');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
var request = require("request");
var base64 = require('base-64');
var jsonxml = require('json2xml');
var format = require('xml-formatter');


let rawData = fs.readFileSync("rawData.json", "utf8");
var data = jsonxml(JSON.parse(rawData)) ;


let xml_head = '<?xml version="1.0" encoding="utf-8"?> <EZHOME xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.ezlynx.com/XMLSchema/Home/V200">' ;
let xml_body = xml_head.concat(data, "</EZHOME>")

var encodedData = base64.encode(xml_body);
console.log(format(xml_body));


let xml_authentication_header = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope  xmlns:soap="http://www.w3.org/2003/05/soap-envelope"  xmlns:tem="http://tempuri.org/"  xmlns:v100="http://www.ezlynx.com/XMLSchema/EZLynxUpload/V100">  <soap:Header>   <tem:AuthenticationHeaderAcct> <tem:Username>xi_uploadUAT</tem:Username>  <tem:Password>Cojoanin93</tem:Password>  <tem:AccountUsername>xi_userUAT</tem:AccountUsername>  </tem:AuthenticationHeaderAcct> </soap:Header>';
let xml_soap_body_opens = '<soap:Body> <tem:UploadFile> <v100:EZLynxUploadRequest>  <v100:UploadRequest RefID="test123" XrefKey="DHO6" DataUploadFlags="4"><v100:FileData Name="EZHome" MimeType="text/xml">';
let xml_soap_body_close = "</v100:FileData> </v100:UploadRequest> </v100:EZLynxUploadRequest> </tem:UploadFile> </soap:Body></soap:Envelope>";
let xml_string = xml_authentication_header.concat(xml_soap_body_opens, encodedData, xml_soap_body_close);


console.log(format(xml_body));

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

  console.log(format(body));
}); 
