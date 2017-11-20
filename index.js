var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require('body-parser')
var routes = require('./routes');
var frontendUpload = require('./frontendS3')

var app = express();

/* Set Up Templating Engine */
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/* Set Up POST Body Parser */
app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true})); // to support URL-encoded bodies

/* Set Up Static Repository */
app.use('/static', express.static('public'));

/* Routing */
app.get('/', routes.notImplementedResponse);
app.post('/admin/S3/sign/', frontendUpload.signS3);

/* On Boarding Workflow */
app.get('/onboarding/welcome/', routes.onboarding.welcome);
app.route('/onboarding/class/').get(routes.onboarding.class.get).post(routes.onboarding.class.post);
app.route('/onboarding/:class([\\d\\w]+\.\\d+\\w+)/roster/').get(routes.onboarding.roster.get).post(routes.onboarding.roster.post);
app.get('/onboarding/:class([\\d\\w]+\.\\d+\\w+)/faces/', routes.onboarding.faces);
app.get('/onboarding/:class([\\d\\w]+\.\\d+\\w+)/finished/', routes.onboarding.finished);

var port = 8080;
app.listen(port, function(){
    console.log('[INFO] Listening at: http://127.0.0.1:8080');
});