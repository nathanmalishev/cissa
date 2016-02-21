var express     = require('express');
var app         = express();
var path        = require('path');
var MongoClient = require('mongodb').MongoClient;
var assert      = require('assert');
var exphbs      = require('express-handlebars');
var bodyParser  = require('body-parser');
var env         = process.env.NODE_ENV || 'dev';

var response_FALSE = {'success':'false'};
var response_TRUE = {'success':'true'};

var hbs = exphbs.create({
  helpers:{
    counter: function(index) {return index+1;}
  },
  defaultLayout: 'main'
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
if(env === 'dev'){
  var url = 'mongodb://localhost:27017/cissa';
}else{
  var url = process.env.MONGOLAB_URI ;
}


MongoClient.connect(url, function(err, db){
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
    var score                 = req.body.score ;
    var name                  = req.body.name || null;
    var email                 = req.body.email || null;
    var studentId             = req.body.studentId || null;
    var clicks                = req.body.clicks || null;
    var STUDENT_ID_MAX_LENGTH = 6;
    console.log(score);
    // field validation
    if( studentId === null || !isInt(studentId) || String(studentId).length != STUDENT_ID_MAX_LENGTH ) {
      return res.send(response_FALSE);
    }
    if( !isInt(score) || score === null){
      return res.send(response_FALSE); 
    }
    if(name === null){
      return res.send(response_FALSE);
    }
    if(email === null){
      return res.send(response_FALSE);
    }
    if(clicks === null || clicks.length === 0){
      return res.send(response_FALSE);
    }
   console.log(clicks); 
    //is the score legit validation
      var prev = clicks[0];
      if(prev.time > ((new Date).getTime()-600)){
        return res.send(response_FALSE);
      }
      clicks.forEach((elem)=>{
        if( elem.time < prev.time   ){
          return res.send(response_FALSE);
        }
        if( elem.time - prev.time > 1500 ){
          return res.send(response_FALSE);
        } 
        if(elem.score < prev.score){
          return res.send(response_FALSE);
        }
        if(elem.score > prev.score+1){
          return res.send(response_FALSE);
        }
        prev = elem;
      })
      if(clicks.length < score){
        return res.send(response_FALSE);
      }
      if(clicks[0].score != 0){
        return res.send(response_FALSE);
      }
      console.log('valid');
    

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

      return res.send(response_TRUE);
    }

  )


  app.listen( process.env.PORT || 3000);
  console.log('server started on port '+ process.env.PORT);

});


function isInt(value){
  
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}
