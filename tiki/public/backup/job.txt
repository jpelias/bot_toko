Parse.Cloud.job("myCloudJob", function(request, status){
    var countObjects;
    var objectsArray = [];
    var query = new Parse.Query("MyClass");

    query.limit(200);
    query.find().then(function(results){

    countObjects = results.length;
    objectsArray = results;

  }).then(function(){
      for(var i = 0; i < countObjects; i++){
          var promises = [];
          promises.push(Parse.Cloud.httpRequest({
            url: 'https://www.myApi.com/',
            params: {value: valueOne}
          })
          .then(function(httpResponse){
              //process your reponse here
              //for example if you want to insert some data to parse
              //here is how you would do it.
              var myObject2 = Parse.Object.extend("Object2");
              myObject2.set("Prop1",httpResponse.data.propertyName);
              return myObject2.save();
          }));
          return Parse.Promise.when(promises);
      }
  }).then(function(){
      status.success("Job completed");
  },function(){
      status.error("Error running Job");
  });
});