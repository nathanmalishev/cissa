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
app.use(express.static(path.join(__dirname,'/public' )));


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
//var local_url = 'mongodb://localhost:27017/cissa';
var url = process.env.MONGOLAB_URI ||  'mongodb://cissa:cissaSISTERS@ds061375.mongolab.com:61375/heroku_8rd67kqq' ;


MongoClient.connect(url, function(err, db){
  assert.equal(null,err);
  console.log('connected to the database');

  // Use admin routes
  var adminRoutes = require('./routes/adminRoutes')(db);
  app.use('/admin', adminRoutes);


  //Use public routes
  var publicroutes = require('./routes/publicRoutes')(db, scoreboard);
  app.use('/', publicroutes);

  app.listen( process.env.PORT || 3000);
  console.log('server started on port '+ process.env.PORT);

});
