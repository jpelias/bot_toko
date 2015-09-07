var express = require('express');
var app = express();
////////////////////////////////////////////////////////////////
var Euros = Parse.Object.extend("Euros");
var euros = new Euros();

var Dolares = Parse.Object.extend("Dolares");
var dolares = new Dolares();

////////////////////////////////////////////////////////////////
var BotRojo = Parse.Object.extend("BotRojo");
var botrojo = new BotRojo();

TOKEN = '114843520:AAFXYbAkqk3wq7Eq6i0FALe1LrojpqXVuNA' 

 // ticker bot ROJO
////////////////////// Webhokk del BOT ROJO https://tiki.parseapp.com/rojo
//app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());  

app.post('/rojo', function(req, res) {

body = req.body;

var text = body.message.text;
chat_id = body.message.chat.id;
var reply_to_message_id = body.message.message_id;
var username = body.message.chat.username
var update_id = body.update_id

botrojo.save({

title : { update: update_id , chat_id : chat_id , text : text , user : username }


}, {
success: function() {
},
error: function(error) {
// The save failed.
}
});

switch (text) {
case "/eur":



                    Parse.Cloud.run('btc_euros', { },{
                      success: function(results) {
                                             
                      json = results[0].get('title');

                      //console.log(json);
                    //for(objetoAInspeccionar = mensaje; objetoAInspeccionar !== null; objetoAInspeccionar = Object.getPrototypeOf(objetoAInspeccionar)){
                    //      resultado = resultado.concat(Object.getOwnPropertyNames(objetoAInspeccionar)) + "\n";
                    //   } 

                    //var atributos = '';  
                    //  for(var aux in results[0])  
                    //    atributos += aux + ' ';  
                      
                      //console.log(json.btc_eur.last);
                      //console.log(json.btc_eur.vol);

                      mensaje = JSON.stringify(json);
                      
                      mensaje = mensaje.replace(/{/g , " ");
                      mensaje = mensaje.replace(/}/g , " ");
                      mensaje = mensaje.replace(/"/g , " ");
                      mensaje = mensaje.replace(/,/g , "\n");                           
                      mensaje = "EUR €:\n"     + mensaje;
                      res.send(body);
                      
                      

                                                              Parse.Cloud.httpRequest({
                                                              method: "GET",
                                                              url: "https://api.telegram.org/bot"+TOKEN+"/sendMessage?chat_id=" 

                                                                + chat_id
                                                                + '&text=' 
                                                                +  encodeURI(mensaje) ,
                                                              body: { } 
                                                              });
                                                              
                                                              },
                                                            error: function(error) {}

                                                              });

break;

case "/usd":




                    Parse.Cloud.run('btc_dolares', { },{
                      success: function(results) {                
                        
                      json = results[0].get('title');

                      //console.log(json);
                    //for(objetoAInspeccionar = mensaje; objetoAInspeccionar !== null; objetoAInspeccionar = Object.getPrototypeOf(objetoAInspeccionar)){
                    //      resultado = resultado.concat(Object.getOwnPropertyNames(objetoAInspeccionar)) + "\n";
                    //   } 

                    //var atributos = '';  
                    //  for(var aux in results[0])  
                    //    atributos += aux + ' ';  
                      
                      //console.log(json.btc_eur.last);
                      //console.log(json.btc_eur.vol);

                      mensaje = JSON.stringify(json);
                      
                      mensaje = mensaje.replace(/{/g , " ");
                      mensaje = mensaje.replace(/}/g , " ");
                      mensaje = mensaje.replace(/"/g , " ");
                      mensaje = mensaje.replace(/,/g , "\n");                      
                      mensaje = "USD $:\n"     + mensaje;
                      res.send(body);
                      //pausecomp(2000);

                                                              Parse.Cloud.httpRequest({
                                                              method: "GET",
                                                              url: "https://api.telegram.org/bot"+TOKEN+"/sendMessage?chat_id=" 

                                                                + chat_id
                                                                + '&text=' 
                                                                +  encodeURI(mensaje) ,
                                                              body: { } 
                                                              });
                                                              

                                                              },
                                                            error: function(error) {}

                                                              });

break;
////////////////////////////////////////////////////////////////////////////////////////
}

if (text != "/usd" & text != "/eur") {res.send(200)};

}); /// THE END ////

app.listen();

////////////////////////////////////////////////////////////////////////////////////////
Parse.Cloud.define("btc_euros", function(request, response) {
  
  var query = new Parse.Query("Euros");

  query.descending("createdAt");
  query.limit(1);
  query.find({
    success: function(results) {
    //console.log('Funcion:');    
    //console.log(results);
   
    response.success(results);
    
    },
    error: function() {
    response.error("lookup failed");
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////
Parse.Cloud.define("btc_dolares", function(request, response) {
  
  var query = new Parse.Query("Dolares");

  query.descending("createdAt");
  query.limit(1);
  query.find({
    success: function(results) {
    //console.log('Funcion:');    
    //console.log(results);
    
    response.success(results);
    
    },
    error: function() {
    response.error("lookup failed");
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////
Parse.Cloud.job("bitcoincharts", function(request, status) {
Parse.Cloud.useMasterKey();

                Parse.Cloud.httpRequest({ 

                  url: 'http://api.bitcoincharts.com/v1/markets.json' 

                                        }).then(function(response) {

                var json = JSON.parse(response.buffer);

              euros.save( { title: { 

                      "BTC_e" : (json[108].close).toFixed(2),                     
                      "Hitbtc" : (json[199].close).toFixed(2), 
                      "Kraken" : (json[147].close).toFixed(2), 
                      "ANX" : (json[51].close).toFixed(2) ,
                      "Bitcoin_de" : (json[182].close).toFixed(2), 
                      "ItBit" : (json[8].close).toFixed(2), 
                      "Local" : (json[178].close).toFixed(2), 
                      "Bitcurex" : (json[136].close).toFixed(2), 
                      "TheRock" : (json[130].close).toFixed(2), 

                    }} ,

                       { success: function(euros) {},error: function(euros,error) {} });
                   


              dolares.save( { title: { 

                      "BTC_e" : (json[37].close).toFixed(2),                     
                      "Hitbtc" : (json[200].close).toFixed(2), 
                      "Kraken" : (json[107].close).toFixed(2), 
                      "ANX" : (json[61].close).toFixed(2) ,
                      "Bitcoin_de" : (json[182].close).toFixed(2), 
                      "ItBit" : (json[6].close).toFixed(2), 
                      "Local" : (json[1].close).toFixed(2), 
                      //"Bitcurex" : (json[136].close).toFixed(2), 
                      "TheRock" : (json[129].close).toFixed(2), 

                    }} ,

                       { success: function(dolares) {},error: function(dolares,error) {} });
               
              return Parse.Object.saveAll(dolares); Parse.Object.saveAll(euros);



                                                              }).then(function() {
                                                              // Set the job's success status

                                                              status.success("Completed successfully.");
                                                              }, function(error) {
                                                              // Set the job's error status
                                                              status.error("Uh oh:" + error.message + error.code);
                                                              });

});// Fin ImportJSON
////////////////////////////////////////////////////////////////////////////////////////////////////
function pausecomp(ms) {
ms += new Date().getTime();
while (new Date() < ms){}
} 