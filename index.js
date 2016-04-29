var app = require('./server/server');
var config = require('./server/config/config');

/* start server */
app.listen(config.port);
console.log('Server started on '+config.port)