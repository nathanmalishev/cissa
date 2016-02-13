var express = require('express');
var auth = require('basic-auth');
var router = express.Router();

router.use(function Authentication(req, res,next){
  console.log('authentication');
  var credentials = auth(req);
  if( !credentials || credentials.name !== 'cissa' || credentials.pass !== 'cissasisters' ){
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="admin"');
    res.end('Access Denied')
  }
  next();
})


router.get('/', function(req,res){
  res.send('admin home page');
});

router.get('/scoreboard', function(req,res){
  res.send('admin scoreboard');
})

router.get('/:studentId',function(req,res){
  res.send('studnet id')
})


module.exports = router;


