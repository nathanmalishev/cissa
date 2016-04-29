var express = require('express');
var auth = require('basic-auth');
var router = express.Router();
var config = require('../config/config');

module.exports = function (db) {

  //have password auth nice and hard coded lol
  router.use(function Authentication(req, res, next) {
    var credentials = auth(req);
    if (!credentials
        || credentials.name !== config.cred.username
        || credentials.pass !== config.cred.password) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="admin"');
    }

    next();
  });


  //home route on admin goes to Admin dashboard
  router.get('/', function (req, res) {
    db.collection('students').find().sort({ score: -1 }).limit(100).toArray((err, documents)=> {
      res.render('scoreboardAdmin', { documents });
    });
  });

  // see if a student exists
  router.get('/student/:id', (req, res)=> {
    db.collection('students')
      .findOne({ studentId: req.params.id }, (err, doc)=> {
        res.send(doc);
      });
  });

  //delete a student if they have a stupid name
  router.delete('/student/:id', (req, res)=> {
    if (req.params.id) {
      db.collection('students')
        .deleteOne({ studentId: req.params.id }, (err, doc)=> {
          if (err) {
            res.send('studentId does not exist');
          }

          res.send('studentid was delted: ' + req.params.id);
        });
    }
  });

  return router;
};

