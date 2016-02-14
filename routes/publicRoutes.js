var express = require('express');
var router = express.Router();
var assert = require('assert');

module.exports = function (db, scoreboard){

  router.get('/scoreboard', (req, res)=>{
    db.collection('students')
      .find()
      .sort({'score':-1})
      .limit(10)
      .toArray((err, documents)=>{
        assert.equal(err,null);
        res.render('scoreboardPublic', {documents})
    })
  });


  
  router.post('/result', (req, res)=>{
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
  
  
 return router; 
}






