var express    = require('express');
var app        = express();
var path       = require('path');
var MongoClient   = require('mongodb').MongoClient;
var assert = require('assert');
var exphbs     = require('express-handlebars');
var bodyParser = require('body-parser');

var hbs = exphbs.create({
  helpers:{
    counter: function(index) {return index+1;}
  }
});
//Set the engine to use handlebars to render pages
app.engine('handlebars', hbs.engine);
app.set('view engine','handlebars');

//allows us to use the static game
app.use(express.static(__dirname+'/flappy-bird' ));
app.use(express.static(__dirname+'/views' ));


//allow server to recieve json objects on POST
app.use( bodyParser.json() );

//local storage on server
var scoreboard = {};
dataBaseModel = (req)=>{
  // this will have added database functionality eventually
  return (
  scoreboard[req.body.studentId] = {
    email: req.body.email,
    name: req.body.name,
    score: req.body.score,
    studentId: req.body.studentId
  }
  )
}

//database start
//everything is inside the database callback
var url = process.env.MONGOLAB_URI ||  'mongodb://cissa:cissaSISTERS@ds061375.mongolab.com:61375/heroku_8rd67kqq' ;


//below for any one interest is either the prod db url or localhost
//var prod_url = 'mongodb://heroku_gbcd3023:ks61vqg322is235c80e1red4bv@ds061385.mongolab.com:61385/heroku_gbcd3023';
//var local_url = 'mongodb://localhost:27017/cissa';


MongoClient.connect(url, function(err, db){
  assert.equal(null,err);
  console.log('connected to the database');

  // Use admin routes
  var adminRoutes = require('./routes/adminRoutes')(db);
  app.use('/admin', adminRoutes);


  //Use public routes
  var publicroutes = require('./routes/publicRoutes')(db, scoreboard);
  app.use('/', publicroutes);


  

  




  app.listen(3000);
  console.log('server started on port 3000')

});
