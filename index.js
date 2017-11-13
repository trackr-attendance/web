var express = require("express");
var routes = require('./routes');

var app = express();

/* Routing */
app.get('/', routes.notImplementedResponse);

/* On Boarding Workflow */
app.get('/onboarding/welcome/', routes.notImplementedResponse);
app.get('/onboarding/class/', routes.notImplementedResponse);
app.get('/onboarding/roster/', routes.notImplementedResponse);
app.get('/onboarding/faces/', routes.notImplementedResponse);
app.get('/onboarding/finished/', routes.notImplementedResponse);

var port = 8080;
app.listen(port, function(){
    console.log('[INFO] Listening at: http://127.0.0.1:8080');
});