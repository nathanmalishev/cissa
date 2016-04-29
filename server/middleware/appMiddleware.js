var bodyParser  = require('body-parser');
var exphbs      = require('express-handlebars');
var path = require('path')

module.exports = function(app){
  //allow server to parse objects
  app.use( bodyParser.json() );

  /* Instiate handle bars */
  var hbs = exphbs.create({
    helpers:{
      counter: function(index) {return index+1;}
    },
    defaultLayout: path.join(path.dirname(__dirname),'/views/layouts/main')
  });
  //Set the engine to use handlebars to render pages
  app.engine('handlebars', hbs.engine);
  app.set('view engine','handlebars');
  app.set('views', path.join(path.dirname(__dirname),'/views'));
}