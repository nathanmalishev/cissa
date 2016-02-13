var express    = require('express');
var app        = express();
var path       = require('path');
var MongoClient   = require('mongodb').MongoClient;
var assert = require('assert');
var exphbs     = require('express-handlebars');
var bodyParser = require('body-parser');
var adminRoutes = require('./adminRoutes');

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
var url = 'mongodb://localhost:27017/cissa';
MongoClient.connect(url, function(err, db){
  assert.equal(null,err);
  console.log('connected to the database');


  app.use('/admin', adminRoutes);
  app.get('/:studentId', (req,res)=>{
    db.collection('students').findOne({'studentId': req.params.studentId}, (err, doc)=>{
      res.send(doc)
    })
  })

  app.delete('/:studentId', (req,res)=>{
    if(req.params.studentId){
      db.collection('students').deleteOne({'studentId': req.params.studentId}, (err, doc)=>{
        if(err){
          res.send('studentId does not exist')
        }
        res.send('studentid was delted: '+req.params.studentId)
      })
    }
  })
  
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
        db.collection('students').insertOne(
          scoreboard[req.body.studentId]
        )
      }
    }else{
        dataBaseModel(req);
        db.collection('students').insertOne(
          scoreboard[req.body.studentId]
        )
      }
    }

  )


  app.listen(3000);
  console.log('server started on port 3000')

});
