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
var url = 'mongodb://localhost:27017/cissa';
MongoClient.connect(url, function(err, db){
  assert.equal(null,err);
  console.log('connected to the server');





  var leaders = [];
  leaders[0] = {
    name: 'nathan',
    score:1
  }

  leaders[1] = {
    name: 'jim',
    score:5
  }
  console.log(leaders);

  //allows us to use the static game
  app.use(express.static(__dirname+'/flappy-bird' ));
  app.use(express.static(__dirname+'/views' ));

  app.get('/scoreboard', (req, res)=>{
    db.collection('students').find().sort({'score':-1}).limit(10).toArray((err,documents)=>{
      console.log(documents);
      res.render('scoreboard', {documents});
    })
  });


  app.post('/result', (req, res)=>{
    var score = req.body.score || null;
    var name = req.body.name || null;
    var email = req.body.email || null;
    var studentId = req.body.studentId || null;

    
    if(scoreboard[req.body.studentId]){
      if(score > scoreboard[req.body.studentId].score){
        dataBaseModel(req);
    console.log(scoreboard[req.body.studentId])
        db.collection('students').insertOne(
          scoreboard[req.body.studentId]
        )
      }
    }else{
        dataBaseModel(req);
    console.log(scoreboard[req.body.studentId])
        db.collection('students').insertOne(
          scoreboard[req.body.studentId]
        )
      }
    }

  )


  app.listen(3000);
  console.log('server started on port 3000')

});
