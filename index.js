var express = require("express");
var exphbs = require("express-handlebars");
var routes = require('./routes');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/* Routing */
app.get('/', routes.notImplementedResponse);

/* On Boarding Workflow */
app.get('/onboarding/welcome/', routes.onboarding.welcome);
app.get('/onboarding/class/', routes.onboarding.class);
app.get('/onboarding/roster/', routes.onboarding.roster);
app.get('/onboarding/faces/', routes.onboarding.faces);
app.get('/onboarding/finished/', routes.onboarding.finished);

var port = 8080;
app.listen(port, function(){
    console.log('[INFO] Listening at: http://127.0.0.1:8080');
});