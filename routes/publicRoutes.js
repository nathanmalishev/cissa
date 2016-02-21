var express = require('express');
var router = express.Router();
var assert = require('assert');
var path  = require('path');

module.exports = function (db){

  router.get('/', (req,res)=>{
    res.sendFile(path.normalize(__dirname+'/../index.html'));
  });


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

  router.post('/student', (req,res)=>{
    console.log(req.body);
    res.send(req.body);
  })


 return router; 
}






