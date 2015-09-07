var express = require('express');
var app = express();


// Global app configuration section.
app.use(express.bodyParser());




app.post('/hello', function(req, res, next) {

var body = req.body;

var value1 = body.value1;
var value2 = body.value2;
var value3 = body.value3;

var evento = body.evento;

res.send(body);



Parse.Cloud.httpRequest({
  method: "POST",
  url: 'https://maker.ifttt.com/trigger/'+ evento +'/with/key/bZrp68OaJ5RIodflLh9c26',
  body: { "value1" : value1, "value2" : value2, "value3" : value3 } 
});



});








app.listen();




