// Parse.initialize("VfzfvOBzbgOaubo1xDicIW8ndyrfox2p8kRVYf5l", "8QShxWtUxvcKK5k07Dj0huDyMEib89k7M6q2PbH2");
var express = require('express');
var app = express();

var oauth = require('cloud/oauth.js');
var sha = require('cloud/sha1.js');

//oauth_token =  '3231928873-yfQhuU8nXFdMN6geBOQiAjAmnGodZbjjAM9lqQb';
//tokenSecret = 'w6JYcQobzV7AEKtMvUkQqrWPwwKjDuWxvFVJ6Z7L2jI7q';
//oauth_consumer_key = 'iAtYJ4HpUVfIUoNnif1DA';
//consumerSecret = '172fOpzuZoYzNYaU3mMYvE8m8MEyLbztOdbrUolU';

oauth_token = '42634315-RtEYW9WlSuE5x2S2O3HGZCeUbB7cA6OCJjcpvnnMe';
tokenSecret = 'HkdcXaOgUWB8lGyS5NMdpSuJnSDFThAyqFYwrWMyhs2Tw';
oauth_consumer_key = '3rJOl1ODzm9yZy63FACdg';
consumerSecret = '5jPoQ5kQvMJFDYRNE8bQ4rHuds4xJqhvgNJM4awaE8';




screen_name = '_bigwig_' ;
count = 1 ;


var Tiempoline = Parse.Object.extend("Tiempoline");
var tiempoline = new Tiempoline();





app.use(express.urlencoded());
app.use(express.json());  

app.get('/rojo', function(req, res) {

body = req.body;


Parse.Cloud.run('UserTimeline',
 { },
 { success: function() 
 {
    // ratings should be 4.5
  },
  error: function(error) {
  }
});





res.send(200);

}); /// THE END ////









app.listen();
////////////////////////////////////////////////////////////////////////////////////////


Parse.Cloud.define("Twitter", function(request, response) {
    var urlLink = 'https://api.twitter.com/1.1/statuses/update.json';
  
    var postSummary = request.params.status;
    var status = oauth.percentEncode(postSummary);
    
  
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
    console.log("Normalized Parameters: " + normPar);
    var baseString = oauth.SignatureMethod.getBaseString(message);
    console.log("BaseString: " + baseString);
    var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
    console.log("Non-Encode Signature: " + sig);
    var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
    console.log("Encoded Signature: " + encodedSig);
  
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
  
  
// For deleting a particular tweet:

  Parse.Cloud.define("Delete", function(request, response) {
    var urlLink = 'https://api.twitter.com/1.1/statuses/destroy/'+request.params.id+'.json';
  
      
    var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();
  
    var accessor = {
      "consumerSecret": consumerSecret,
      "tokenSecret": tokenSecret
    };
    
    
    var params = {
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
    console.log("Normalized Parameters: " + normPar);
    var baseString = oauth.SignatureMethod.getBaseString(message);
    console.log("BaseString: " + baseString);
    var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
    console.log("Non-Encode Signature: " + sig);
    var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
    console.log("Encoded Signature: " + encodedSig);
  
    Parse.Cloud.httpRequest({
      method: 'POST',
      url: urlLink,
      headers: {
        "Authorization": 'OAuth oauth_consumer_key="'+oauth_consumer_key+'", oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token="'+oauth_token+'", oauth_version="1.0"'
      },
      body: {
      },
      success: function(httpResponse) {
        response.success(httpResponse.text);
      },
      error: function(httpResponse) {
        response.error('Request failed with response ' + httpResponse.status + ' , ' + httpResponse);
      }
    });
  });




Parse.Cloud.define("UserTimeline", function(request, response) {


    var urlLink = 'https://api.twitter.com/1.1/statuses/user_timeline.json'+'?screen_name='+screen_name+'&count='+count;

    var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();

    
  
    var accessor = {
      "consumerSecret": consumerSecret,
      "tokenSecret": tokenSecret
    };
    
    
    var params = {
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
    console.log("Normalized Parameters: " + normPar);
    var baseString = oauth.SignatureMethod.getBaseString(message);
    console.log("BaseString: " + baseString);
    var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
    console.log("Non-Encode Signature: " + sig);
    var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
    console.log("Encoded Signature: " + encodedSig);
  
    Parse.Cloud.httpRequest({
      method: 'GET',
      url: urlLink,
      headers: {
        "Authorization": 'OAuth oauth_consumer_key="'+oauth_consumer_key+'", oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token="'+oauth_token+'", oauth_version="1.0"'
      },
      body: {
      },
      success: function(httpResponse) {
        console.log(httpResponse);
        response.success(httpResponse.text);
      },
      error: function(httpResponse) {
        response.error('Request failed with response ' + httpResponse.status + ' , ' + httpResponse);
      }
    });
  });
  