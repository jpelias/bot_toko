// Aplicacion que es un bot en Telegram y a la vez en Twitter, con la cotizacion de bitcoin
// en tweeter es @btcticka y en Telegram @TickerBTC_bot
// ticker bot ROJO
////////////////////// Webhokk del BOT ROJO https://toko.parseapp.com/rojo

var express = require('express');
var app = express();

var oauth = require('cloud/oauth.js');
var sha = require('cloud/sha1.js');
////////////////////////////////////////////////////////////////
var Euros = Parse.Object.extend("Euros");
var euros = new Euros();

var Dolares = Parse.Object.extend("Dolares");
var dolares = new Dolares();

////////////////////////////////////////////////////////////////
var BotRojo = Parse.Object.extend("BotRojo");
var botrojo = new BotRojo();

TOKEN = '114843520:AAFXYbAkqk3wq7Eq6i0FALe1LrojpqXVuNA'


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

                var j_euros = {

                      "BTC_e" : (json[108].close).toFixed(2),
                      "Hitbtc" : (json[199].close).toFixed(2),
                      "Kraken" : (json[147].close).toFixed(2),
                      "ANX" : (json[51].close).toFixed(2) ,
                      "Bitcoin_de" : (json[182].close).toFixed(2),
                      "ItBit" : (json[8].close).toFixed(2),
                      "Local" : (json[178].close).toFixed(2),
                      "Bitcurex" : (json[136].close).toFixed(2),
                      "TheRock" : (json[130].close).toFixed(2),

                    }

                      var mensaje = JSON.stringify(j_euros);
                      mensaje = mensaje.replace(/{/g , "");
                      mensaje = mensaje.replace(/}/g , "");
                      mensaje = mensaje.replace(/"/g , "");
                      mensaje = mensaje.replace(/,/g , " ");
                      mensaje = "EUR €:\n"     + mensaje;

                        ///////////////////////////////////////////////////////////////////
                        Parse.Cloud.run('Twitter', {
                        status : mensaje,
                        oauth_token :'3339344283-FWJq0UR758qYctdgCzVVS6cAH2Xr92inacoESmm',
                        tokenSecret : 'RnP4x2yLfz7SKTVxSWk9XPKnUVAE56iqenBxmCu6tPLmp',
                        oauth_consumer_key : 'iAtYJ4HpUVfIUoNnif1DA',
                        consumerSecret : '172fOpzuZoYzNYaU3mMYvE8m8MEyLbztOdbrUolU'  ,
                        screen_name : "btcticka"
                        }, {
                          success: function(results) {


                             },
                          error: function(error) {

                          }
                        });
                        ///////////////////////////////////////////////////////////////////





              euros.save( { title: j_euros } ,

                       { success: function(euros) {},error: function(euros,error) {} });


                    var j_dolares = {

                      "BTC_e" : (json[37].close).toFixed(2),
                      "Hitbtc" : (json[200].close).toFixed(2),
                      "Kraken" : (json[107].close).toFixed(2),
                      "ANX" : (json[61].close).toFixed(2) ,
                      "Bitcoin_de" : (json[182].close).toFixed(2),
                      "ItBit" : (json[6].close).toFixed(2),
                      "Local" : (json[1].close).toFixed(2),
                      //"Bitcurex" : (json[136].close).toFixed(2),
                      "TheRock" : (json[129].close).toFixed(2),
                                }


                      var mensaje = JSON.stringify(j_dolares);
                      mensaje = mensaje.replace(/{/g , "");
                      mensaje = mensaje.replace(/}/g , "");
                      mensaje = mensaje.replace(/"/g , "");
                      mensaje = mensaje.replace(/,/g , " ");
                      mensaje = "USD $:\n"     + mensaje;

                      ///////////////////////////////////////////////////////////////////
                        Parse.Cloud.run('Twitter', {
                            status : mensaje,
                            oauth_token :'3339344283-FWJq0UR758qYctdgCzVVS6cAH2Xr92inacoESmm',
                            tokenSecret : 'RnP4x2yLfz7SKTVxSWk9XPKnUVAE56iqenBxmCu6tPLmp',
                            oauth_consumer_key : 'iAtYJ4HpUVfIUoNnif1DA',
                            consumerSecret : '172fOpzuZoYzNYaU3mMYvE8m8MEyLbztOdbrUolU'  ,
                            screen_name : "btcticka"
                            }, {
                              success: function(results) {


                                 },
                              error: function(error) {

                              }
                            });
                        ///////////////////////////////////////////////////////////////////



              dolares.save( { title: j_dolares } ,

                       { success: function(dolares) {},error: function(dolares,error) {} });

              return Parse.Object.saveAll(dolares); Parse.Object.saveAll(euros);



                                                              }).then(function() {
                                                              // Set the job's success status

                                                              status.success("Completed successfully.");
                                                              // Si tiene exito en leer los datos nuevos, borra los viejos.
                                                              Parse.Cloud.run('borradolar');
                                                              Parse.Cloud.run('borraeuro');

                                                              }, function(error) {
                                                              // Set the job's error status
                                                              status.error("Uh oh:" + error.message + error.code);
                                                              });

});// Fin ImportJSON
////////////////////////////////////////////////////////////////////////////////////////////////////
Parse.Cloud.define("borradolar", function(request, response) {

  var query = new Parse.Query("Dolares");
  query.ascending("createdAt");
  query.limit(1);
  query.find({
    success: function(results) {
    //console.log('Funcion:');
    //console.log(results);
    results[0].destroy({});
    response.success(results);
    },
    error: function() {
    response.error("lookup failed");
    }
  });

});
////////////////////////////////////////////////////////////////////////////////////////////////////
Parse.Cloud.define("borraeuro", function(request, response) {

  var query = new Parse.Query("Euros");
  query.ascending("createdAt");
  query.limit(1);
  query.find({
    success: function(results) {
    //console.log('Funcion:');
    //console.log(results);
    results[0].destroy({});
    response.success(results);
    },
    error: function() {
    response.error("lookup failed");
    }
  });

});
////////////////////////////////////////////////////////////////////////////////////////////////////

function pausecomp(ms) {
ms += new Date().getTime();
while (new Date() < ms){}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Funcion que envia un tweet con el contenido en status request.params.status;
//necesita ......... var oauth = require('cloud/oauth.js');
//                   var sha = require('cloud/sha1.js');


Parse.Cloud.define("Twitter", function(request, response) {
    var urlLink = 'https://api.twitter.com/1.1/statuses/update.json';

    var postSummary = request.params.status;

//console.log("< mensaje >");
//console.log(postSummary);

    var status = oauth.percentEncode(postSummary);
    var oauth_token =  request.params.oauth_token;
    var tokenSecret = request.params.tokenSecret;
    var oauth_consumer_key = request.params.oauth_consumer_key;
    var consumerSecret = request.params.consumerSecret;
    var screen_name = request.params.screen_name;


    var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();

    var accessor = {
      "consumerSecret": consumerSecret,
      "tokenSecret": tokenSecret
    };


    var params = {
      "status": postSummary,
      "oauth_version": "1.0",
      "oauth_consumer_key": oauth_consumer_key,
      "oauth_token": oauth_token,
      "oauth_timestamp": timestamp,
      "oauth_nonce": nonce,
      "oauth_signature_method": "HMAC-SHA1"
    };
    var message = {
      "method": "POST",
      "action": urlLink,
      "parameters": params
    };


    //lets create signature
    oauth.SignatureMethod.sign(message, accessor);
    var normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
    //console.log("Normalized Parameters: " + normPar);
    var baseString = oauth.SignatureMethod.getBaseString(message);
    //console.log("BaseString: " + baseString);
    var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
    //console.log("Non-Encode Signature: " + sig);
    var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
    //console.log("Encoded Signature: " + encodedSig);

    Parse.Cloud.httpRequest({
      method: 'POST',
      url: urlLink,
      headers: {
        "Authorization": 'OAuth oauth_consumer_key="'+oauth_consumer_key+'", oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token="'+oauth_token+'", oauth_version="1.0"'
      },
      body: "status=" + status,
      success: function(httpResponse) {
        response.success(httpResponse.text);
      },
      error: function(httpResponse) {
        response.error('Request failed with response ' + httpResponse.status + ' , ' + httpResponse);
      }
    });
  });

