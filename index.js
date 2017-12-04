var cookieParser = require('cookie-parser');
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require('body-parser')
var routes = require('./routes');
var frontendUpload = require('./frontendS3');
var HandlebarsIntl = require('handlebars-intl');
var trackrCookies = require('./trackrSessionConfig.json');

var app = express();

/* Set Up Templating Engine */
var hbs = exphbs.create({defaultLayout: 'main'});
app.engine(hbs.extname, hbs.engine);
app.set('view engine', hbs.extname);
HandlebarsIntl.registerWith(hbs.handlebars);

/* Set Up POST Body Parser */
app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true})); // to support URL-encoded bodies

/* Ser Up COOKIE Body Parser */
app.use(cookieParser());

/* Set Up Static Repository */
app.use('/static', express.static('public'));

/* Routing */
app.get('/', routes.home);

/* Middleware Routing */
app.use(function(req, res, next) {
	if (JSON.stringify(req.cookies) !== JSON.stringify(trackrCookies)){
		console.log('Missing Validation Cookie: Intercepted Request', req.cookies);
		routes.notImplementedResponse(req, res);
	}else{
		next();
	}
});

/* Admin */
app.post('/admin/S3/sign/', frontendUpload.signS3);
app.get('/admin/:class([\\d\\w]+\.\\d+\\w+)/:date(\\d{4}-\\d{2}-\\d{2})/', routes.admin.engagement);

/* On Boarding Workflow */
app.get('/onboarding/welcome/', routes.onboarding.welcome);
app.route('/onboarding/class/').get(routes.onboarding.class.get).post(routes.onboarding.class.post);
app.route('/onboarding/:class([\\d\\w]+\.\\d+\\w+)/roster/').get(routes.onboarding.roster.get).post(routes.onboarding.roster.post);
app.get('/onboarding/:class([\\d\\w]+\.\\d+\\w+)/faces/', routes.onboarding.faces);
app.get('/onboarding/:class([\\d\\w]+\.\\d+\\w+)/finished/', routes.onboarding.finished);

/* Dashboard Routes */
app.get('/classes/', routes.dashboard.home);
app.get('/classes/:class([\\d\\w]+\.\\d+\\w+)/', routes.dashboard.course);
app.get('/classes/:class([\\d\\w]+\.\\d+\\w+)/edit/', routes.notImplementedResponse);
app.get('/classes/:class([\\d\\w]+\.\\d+\\w+)/roster/', routes.notImplementedResponse);
app.get('/classes/:class([\\d\\w]+\.\\d+\\w+)/class/', routes.dashboard.classes);
app.get('/classes/:class([\\d\\w]+\.\\d+\\w+)/class/:date(\\d{4}-\\d{2}-\\d{2})/', routes.dashboard.class);

var port = 8080;
app.listen(port, function(){
    console.log('[INFO] Listening at: http://127.0.0.1:8080');
});