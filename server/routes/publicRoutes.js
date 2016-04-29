var express = require('express');
var router = express.Router();
var assert = require('assert');
var path  = require('path');
var isInt = require('../helper/helpers').isInt;
var response_FALSE = require('../config/config').response_FALSE;
var response_TRUE = require('../config/config').response_TRUE;

module.exports = function (db) {
  //construct a hash
  scoreboard = initialiseScoreboard(db);

  //local storage on server
  var scoreboard = {};
  dataBaseModel = (req)=> {
    // this will have added database functionality eventually
    return (
    scoreboard[req.body.studentId] = {
      email: req.body.email,
      name: req.body.name,
      score: req.body.score,
      studentId: req.body.studentId,
    }
    );
  };

  //hydrates the first scoreboard from the db
  function initialiseScoreboard(db) {
    var board = {};
    db.collection('students').find().forEach(function (doc) {
      if (doc === null) {
        return board;
      }

      board[doc.studentId] = {
        name: doc.name,
        email: doc.email,
        studentId: doc.studentId,
        score: doc.score,
      };
    });

    return board;
  }

  router.get('/', (req, res)=> {
    res.sendFile(path.normalize(__dirname + '/../index.html'));
  });

  router.get('/scoreboard', (req, res)=> {
    db.collection('students')
      .find()
      .sort({ score: -1 })
      .limit(10)
      .toArray((err, documents)=> {
        assert.equal(err, null);
        res.render('scoreboardPublic', { documents });
      });
  });

  router.post('/student', (req, res)=> {
    console.log(req.body);
    res.send(req.body);
  });

  //this handles dealing with the local scoreboard
  //and the students on the server
  router.post('/result', (req, res)=> {
      var score                 = req.body.score;
      var name                  = req.body.name || null;
      var email                 = req.body.email || null;
      var studentId             = req.body.studentId || null;
      var clicks                = req.body.clicks || null;
      var STUDENT_ID_MAX_LENGTH = 6;

      //validate fields
      if (!fieldValidation(studentId, score, name, email, clicks)) {
        res.send(response_FALSE);
      }

      //validate if the score could be real with clicks
      if (!scoreValidation(clicks)) {
        res.send(response_FALSE);
      }

      //is this already in the hash might not need to update
      if (scoreboard[req.body.studentId]) {
        //is the score greater
        if (score > scoreboard[req.body.studentId].score) {
          dataBaseModel(req);
          db.collection('students')
            .findOneAndUpdate(
              { studentId: req.body.studentId },
              scoreboard[req.body.studentId],
              { upsert: true }
            );
        }
      }else {
        dataBaseModel(req);
        db.collection('students')
          .findOneAndUpdate(
            { studentId: req.body.studentId },
            scoreboard[req.body.studentId],
            { upsert: true }
        );
      }
      return res.send(response_TRUE);
    }
  );

  return router;
};

