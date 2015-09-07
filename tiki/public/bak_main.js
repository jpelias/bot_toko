var express = require('express');
var app = express();
// Global app configuration section.
app.use(express.bodyParser());



app.listen();



var Pilla = Parse.Object.extend("Pilla");
var pilla = new Pilla();


////////////////////////////////////////////////////////////////
var BotRojo = Parse.Object.extend("BotRojo");
var botrojo = new BotRojo();

//////////////////////////////////////////// Webhokk del BOT ROJO https://tiki.parseapp.com/rojo
app.post('/rojo', function(req, res) {

var body = req.body;


//console.log(body);


botrojo.save({
title: body
}, {
success: function() {
// The object was saved successfully.
},
error: function(error) {
// The save failed.
}
});


// Mandamos el mensaje JSON s el BOT ROJO en body

Parse.Cloud.httpRequest({
  method: "POST",
  url: 'https://safebot-tiki2.rhcloud.com/xxx',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },

  body: body 

});

res.send(body);

							});

////////////////////////////////////////////////////////////////


var BotVerde = Parse.Object.extend("BotVerde");
var botverde = new BotVerde();

/////////////////////////////////////////// Webhokk del BOT VERDE https://tiki.parseapp.com/verde

app.post('/verde', function(req, res) {

var body = req.body;



//console.log(body);


botverde.save({
title: body
}, {
success: function(blogPost) {

},
error: function(blogPost, error) {

}
});


// Mandamos el mensaje JSON s el BOT VERDE

Parse.Cloud.httpRequest({
  method: "POST",
  url: 'https://bot-tiki2.rhcloud.com/109206957',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },

  body: body 

});

res.send(body);

							});

//////////////////////////////////////////////////// JOBS //////////////////////////////////////////////////////

Parse.Cloud.job("importCourseJSON", function(request, status) {



  Parse.Cloud.useMasterKey();
    Parse.Cloud.httpRequest({ url: 'https://blockchain.info/es/ticker'}).then(function(response) {
    var json = JSON.parse(response.buffer);
    console.log(json.length);
    console.log(json);
    

    pilla.save({ title: json }, { success: function(pilla) {},
                                   error: function(pilla,error) {}
                                  });



    return Parse.Object.saveAll(pilla); 
}).then(function() {
    // Set the job's success status
    status.success("Migration completed successfully.");
}, function(error) {
    // Set the job's error status
    status.error("Uh oh:" + error.message + error.code);
});


});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////



