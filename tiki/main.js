


var express = require('express');
var app = express();

var oauth = require('cloud/oauth.js');
var sha = require('cloud/sha1.js');

tweets = {} ;
 count = 200 ;
 max_id = 0 ;





oauth_token =  '3231928873-';
tokenSecret = 'w6JYcQobzV7AEKtMvUkQqrWPwwKjDuWxvFVJ6Z7L2jI7q';
oauth_consumer_key = 'iAtYJ4HpUVfIUoNnif1DA';
consumerSecret = '172fOpzuZoYzNYaU3mMYvE8m8MEyLbztOdbrUolU';
screen_name = "allan_bunny" ;

//      _bigwig_
//oauth_token = '42634315-';
//tokenSecret = 'HkdcXaOgUWB8lGyS5NMdpSuJnSDFThAyqFYwrWMyhs2Tw';
//oauth_consumer_key = '3rJOl1ODzm9yZy63FACdg';
//consumerSecret = '5jPoQ5kQvMJFDYRNE8bQ4rHuds4xJqhvgNJM4awaE8';


app.use(express.urlencoded());
app.use(express.json());

app.get('/rojo', function(req, res) {

body = req.body;




res.send(200);

}); /// THE END ////



app.listen();
////////////////////////////////////////////////////////////////////////////////////////


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


// For deleting a particular tweet:

  Parse.Cloud.define("Delete", function(request, response) {
    var urlLink = 'https://api.twitter.com/1.1/statuses/destroy/'+request.params.id+'.json';
    
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
max_id = request.params.max_id;
//console.log('max_id1');
//console.log(max_id);

    var oauth_token =  request.params.oauth_token;
    var tokenSecret = request.params.tokenSecret;
    var oauth_consumer_key = request.params.oauth_consumer_key;
    var consumerSecret = request.params.consumerSecret;
    var screen_name = request.params.screen_name;

    var urlLink = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name='+screen_name+'&count=200&trim_user=t';

    if (max_id > 0) { urlLink = urlLink + "&max_id="+max_id };
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
      "method": "GET",
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
      method: 'GET',
      url: urlLink,
      headers: {
        "Authorization": 'OAuth oauth_consumer_key="'+oauth_consumer_key+'", oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token="'+oauth_token+'", oauth_version="1.0"'
      },
      body: {
      },
      success: function(httpResponse) {
        response.success(httpResponse.data);
      },
      error: function(httpResponse) {
        response.error('Request failed with response ' + httpResponse.status + ' , ' + httpResponse);
      }
    });
  });




// devuelve diferencia en dias con la fecha de twitter
// http://stackoverflow.com/questions/6549223/javascript-code-to-display-twitter-created-at-as-xxxx-ago
function parseTwitterDate(tdate) {
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
    system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
    var diff = Math.floor((user_date - system_date) / 1000);
    diff = Math.round(diff / 86400)
return diff
    }
//////////////////////////////////////////////////////////////////////////
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

////////////////////////////////////
function pausecomp(ms) {
ms += new Date().getTime();
while (new Date() < ms){}
}
////////////////////////////////////



Parse.Cloud.job("Listador", function(request, response) {
Parse.Cloud.useMasterKey();

Parse.Cloud.run('UserTimeline', { max_id : max_id ,

oauth_token :'3231928873-',
tokenSecret : 'w6JYcQobzV7AEKtMvUkQqrWPwwKjDuWxvFVJ6Z7L2jI7q',
oauth_consumer_key : 'iAtYJ4HpUVfIUoNnif1DA',
consumerSecret : '172fOpzuZoYzNYaU3mMYvE8m8MEyLbztOdbrUolU',
screen_name : "allan_bunny"

}, {

success: function (result) {

tweets = result;
max_id = tweets[tweets.length-1].id_str ;
console.log('1max');
console.log(max_id);
console.log(tweets.length);
//console.log(tweets[0]);
for(var i in tweets)


{
      id_str = (tweets[i].id_str) ;
      tdate = tweets[i].created_at ;

      var urlLink = 'https://script.google.com/macros/s/AKfycbw1REu.............../exec';
      //var urlLink = 'https://.runscope.net';
      
      Parse.Cloud.httpRequest({
      method: 'POST',
      url: urlLink,
      headers: {'Content-Type': 'application/json'},
      body: {

          id_str : id_str , tdate : tdate

          },
    success: function(httpResponse) {
      pausecomp(500);
        //          console.log(httpResponse.text);
        //          response.success(httpResponse.text);
            },
    error: function(httpResponse) {
            
    }
});




      //console.log(tdate);
      //console.log(parseTwitterDate(tdate));

}// next

                                                Parse.Cloud.run('UserTimeline', { max_id : max_id ,

                                                oauth_token :'3231928873-',
                                                tokenSecret : 'w6JYcQobzV7AEKtMvUkQqrWPwwKjDuWxvFVJ6Z7L2jI7q',
                                                oauth_consumer_key : 'iAtYJ4HpUVfIUoNnif1DA',
                                                consumerSecret : '172fOpzuZoYzNYaU3mMYvE8m8MEyLbztOdbrUolU',
                                                screen_name : "allan_bunny"}, {

                                                success: function (result) {

                                                tweets = result;
                                                max_id = tweets[tweets.length-1].id_str ;
                                                console.log('2max');
                                                console.log(max_id);
                                                console.log(tweets.length);
                                                //console.log(tweets[0]);

                                                for(var i in tweets)


                                                {
                                                id_str = (tweets[i].id_str) ;
                                                tdate = tweets[i].created_at ;

      var urlLink = 'https://script.google.com/macros/s/AKfycbw1REumB9SVf6Bdbe.......................ynj_eX1L/exec';
      //var urlLink = 'https://.runscope.net';
      
      Parse.Cloud.httpRequest({
      method: 'POST',
      url: urlLink,
      headers: {'Content-Type': 'application/json'},
      body: {

          id_str : id_str , tdate : tdate

          },
    success: function(httpResponse) {
      pausecomp(500);
        //          console.log(httpResponse.text);
        //          response.success(httpResponse.text);
            },
    error: function(httpResponse) {
        
        
    }// next




  });


                                                //console.log(tdate);
                                                //console.log(tdate);
                                                //console.log(parseTwitterDate(tdate));

                                                }// next

                                                },
                                                error: function (error) {
                                                console.log('error');
                                                console.log(error);

                                                }
                                                });

  },
  error: function (error) {
  console.log('error');
  console.log(error);

  }
});




});// Fin job

