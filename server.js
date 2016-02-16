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
app.use(express.static(__dirname+'/public' ));


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

//hydrates the first scoreboard from the db
function initialiseScoreboard(db){
  var board = {};
  db.collection('students').find().forEach(function(doc){
    if(doc === null){
      return board;
    }
    board[doc.studentId] = {
      name: doc.name,
      email: doc.email,
      studentId: doc.studentId,
      score: doc.score
    }
  })
  return board;
}

//database start
var local_url = 'mongodb://localhost:27017/cissa';
var url = process.env.MONGOLAB_URI ||  'mongodb://cissa:cissaSISTERS@ds061375.mongolab.com:61375/heroku_8rd67kqq' ;


MongoClient.connect(local_url, function(err, db){
  assert.equal(null,err);
  console.log('connected to the database');

  //construct a hash
  scoreboard = initialiseScoreboard(db);

  // Use admin routes
  var adminRoutes = require('./routes/adminRoutes')(db);
  app.use('/admin', adminRoutes);


  //Use public routes
  var publicroutes = require('./routes/publicRoutes')(db);
  app.use('/', publicroutes);
  

  //this handles dealing with the local scoreboard
  //and the students on the server
  app.post('/result', (req, res)=>{
    var score = req.body.score || null;
    var name = req.body.name || null;
    var email = req.body.email || null;
    var studentId = req.body.studentId || null;

    //is this already in the hash?
    if(scoreboard[req.body.studentId]){
      if(score > scoreboard[req.body.studentId].score){
        dataBaseModel(req);
        db.collection('students')
          .findOneAndUpdate(
            {'studentId': req.body.studentId},
            scoreboard[req.body.studentId],
            {upsert:true}
        )
      }
    }else{
        dataBaseModel(req);
        db.collection('students')
          .findOneAndUpdate(
            {'studentId': req.body.studentId},
            scoreboard[req.body.studentId],
            {upsert:true}
        )
      }
    }

  )


  app.listen( process.env.PORT || 3000);
  console.log('server started on port '+ process.env.PORT);

});
