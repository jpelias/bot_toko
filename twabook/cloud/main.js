////////////////////////////////////////////////////////////////
var express = require('express');
var app = express();

var oauth = require('cloud/oauth.js');
var sha = require('cloud/sha1.js');

////////////////////////////////////////////////////////////////
oauth_token =  '3231928873-';
tokenSecret = 'w6JYcQobzV7AEKtMvUkQqrWPwwKjDuWxvFVJ6Z7L2jI7q';
oauth_consumer_key = 'iAtYJ4HpUVfIUoNnif1DA';
consumerSecret = '172fOpzuZoYzNYaU3mMYvE8m8MEyLbztOdbrUolU';
screen_name = "allan_bunny" ;


////////////////////////////////////////////////////////////////




var Texto = Parse.Object.extend("Texto");
var texto = new Texto();

var Entrada = Parse.Object.extend("Entrada");
var entrada = new Entrada();


app.use(express.urlencoded());
app.use(express.json());

app.post('/entrada', function(req, res) {

var body = req.body;
//body = JSON.stringify(body);
console.log(body);
//console.log(typeof(body));


entrada.save( { title: body} ,

{
success: function() {
},
error: function(error) {
// The save failed.
}
});



res.send(200);

}); /// THE END ////





app.get('/watership', function (req, res) {

Parse.Cloud.run('watership', { }, {
  success: function(results) {

      },
  error: function(error) {

  }
});


res.send(200);
}); /// THE END ////



app.get('/cosmos', function (req, res) {

Parse.Cloud.run('cosmos', { }, {
  success: function(results) {
console.log(results);
     },
  error: function(error) {

  }
});


res.send(200);
}); /// THE END ////


app.get('/tg', function (req, res) {

Parse.Cloud.run('telegram', { }, {
  success: function(results) {

texto = results

//console.log(texto[5][0]);

var i = 0;
var objeto = [];

for (var property in texto) {

 linea = JSON.stringify(texto[i]);
 objeto = JSON.parse(linea);

  nombre = "<" + objeto.title.a;
  linea = "> " + objeto.title.b;


  res.write(nombre+linea,encoding='utf8');
  res.write("\r\n");
  res.write("\r\n");

  i = i+1;
}

res.send(200);

     },
  error: function(error) {

  }
});



}); /// THE END ////











app.listen();

////////////////////////////////////////////////////////////////////////////////////////
Parse.Cloud.define("telegram", function(request, response) {

  var query = new Parse.Query("Texto");

  query.descending("createdAt");
  query.limit(25);
  query.find({
    success: function(results) {
    var mensajes = {};
    mensajes = results
    //console.log('Funcion:');
    //console.log(results);

    response.success(mensajes);

    },
    error: function() {
    response.error("lookup failed");
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////

Parse.Cloud.define("watership", function(request, status){

    //var myId = '0000000001';

    var myId = Math.floor((Math.random() * 8401) + 0);

    myId = pad(myId, 10);

    //console.log(myId);

    var query = new Parse.Query("watership");

    query.get(myId).then(function(results){
      //  console.log(results);
          //console.log(results.get('title'));

///////////////////////////////////////////////////////////////////
Parse.Cloud.run('Twitter', {

status : results.get('title'),
oauth_token :'3231928873-',
tokenSecret : 'w6JYcQobzV7AEKtMvUkQqrWPwwKjDuWxvFVJ6Z7L2jI7q',
oauth_consumer_key : 'iAtYJ4HpUVfIUoNnif1DA',
consumerSecret : '172fOpzuZoYzNYaU3mMYvE8m8MEyLbztOdbrUolU',
screen_name : "allan_bunny"
}, {
  success: function(results) {

     },
  error: function(error) {

  }
});
///////////////////////////////////////////////////////////////////

    }).then(function(){
  }).then(function(){


      status.success("Job completed");
  },function(){
      status.error("Error running Job");
  });
});
///////////////////////////////////////////////////////////////////////////////////////
Parse.Cloud.define("cosmos", function(request, status){

    //var myId = '0000000001';

    var myId = Math.floor((Math.random() * 1742) + 0);

    myId = pad(myId, 10);

    //console.log(myId);

    var query = new Parse.Query("cosmos");

    query.get(myId).then(function(results){

        //console.log(results);
        //console.log(results.get('title'));

///////////////////////////////////////////////////////////////////
Parse.Cloud.run('Twitter', {

status : results.get('title'),
oauth_token :'3287388914-',
tokenSecret : 'SEGLFBYPGmRRRG5gSRXcZlt01sx9BgrtQ9RwPQdemvbEx',
oauth_consumer_key : 'iAtYJ4HpUVfIUoNnif1DA',
consumerSecret : '172fOpzuZoYzNYaU3mMYvE8m8MEyLbztOdbrUolU',
screen_name : "cosmos_cs"
}, {
  success: function(Response) {

    console.log('run twitter');
        response.success(Response.text);
      },
      error: function(Response) {
        response.error('Request failed with response ' + Response.status + ' , ' + Response);
      }
    });
///////////////////////////////////////////////////////////////////
    }).then(function(){
  }).then(function(){

      status.success("Job completed");
  },function(){
      status.error("Error running Job");
  });
});
//////////////////////////////////////////////////////////////////////////
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

////////////////////////////////////////////////////////////////////////////////////////

function pausecomp(ms) {
ms += new Date().getTime();
while (new Date() < ms){}
}
////////////////////////////////////

Parse.Cloud.define("Twitter", function(request, response) {
    var urlLink = 'https://api.twitter.com/1.1/statuses/update.json';

    var postSummary = request.params.status;
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

/////////////////////////////////////////////////
function printObject(o) {
 var out = '';
for (var property in o) {
  out += property + ': ' + o[property]+'; ';
}
console.log(out);
}




