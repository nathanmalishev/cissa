var express     = require('express');
var app         = express();
var path        = require('path');
var MongoClient = require('mongodb').MongoClient;
var assert      = require('assert');
var config      = require('./config/config');

//allows us to use the static game
app.use(express.static(__dirname + '/public'));
//use middleware
require('./middleware/appMiddleware')(app);


MongoClient.connect(config.db.url, function (err, db) {
  assert.equal(null, err);
  console.log('connected to the database');

  // Use admin routes
  var adminRoutes = require('./routes/adminRoutes')(db);
  app.use('/admin', adminRoutes);


  //Use public routes
  var publicroutes = require('./routes/publicRoutes')(db);
  app.use('/', publicroutes);
});




module.exports = app;
