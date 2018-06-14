// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var q = require('q');
var  oauthserver = require('oauth2-server');
// var loadash = require('loadash');

// configuration ===============================================================
mongoose.connect("mongodb://ranjoy.ghosh88:Ranjoy123@@@ds255930.mlab.com:55930/storedata"); 	// Connect to remote MongoDB instance.

app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

app.oauth =  oauthserver({
  model:  require('./appServer/utilities/authModel.js'),
  grants: ['client_credentials', 'password'],
  debug: true
});

app.all('/oauth/token', app.oauth.grant());

app.use(app.oauth.errorHandler());
// routes ======================================================================

require('./appServer/apis/customerAuth.js')(app);
require('./appServer/apis/customerDetails.js')(app);
// require('./appServer/apis/customerFeedback.js')(app);
require('./appServer/apis/fileProcesses.js')(app);

app.route('/*').get(function(req, res) {
    return res.sendFile(__dirname + '/public/index.html');
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
