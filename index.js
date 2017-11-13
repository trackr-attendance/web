var express = require("express");
var routes = require('./routes');

var app = express();

/* Routing */
app.get('/', routes.notImplementedResponse);

var port = 8080;
app.listen(port, function(){
    console.log('[INFO] Listening at: http://127.0.0.1:8080');
});