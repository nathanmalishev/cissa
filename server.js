var express         = require('express');
var app             = express();
var path            = require('path');
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({extname:'.hbs'}));
app.set('view engine','.hbs');

var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({
  extended:true
}) )

var scoreboard = {};
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
app.use(express.static(__dirname+'/flappy-bird' ));

app.get('/scoreboard', (req, res)=>{
  res.render('scoreboard.hbs', leaders);
  
  console.log(scoreboard)
});


app.post('/result', (req, res)=>{
  var score = req.body.score || null;
  var name = req.body.name || null;
  var email = req.body.email || null;
  var studentId = req.body.studentId || null;

  
  addToDatabase = ()=>{
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
  console.log(studentId)
  if(scoreboard[req.body.studentId]){
    console.log('new score: '+score)
    console.log('old score: '+scoreboard[req.body.studentId].score)
    if(score > scoreboard[req.body.studentId].score){
      addToDatabase();
    }
  }else{
      addToDatabase();
    }
  }

)


app.listen(3000);
console.log('server started on port 3000')
