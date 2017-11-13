exports.notImplementedResponse = function(req, res){
    console.log('[INFO] Recieved request at ', req.url);
    res.status(501).send({"status code": 501, "status string": "501 Not Implemented", "message": req.url + " is not implemented."});
};

exports.onboarding = {};

exports.onboarding.welcome = function(req, res){
    console.log('[INFO] Recieved request at ', req.url);
    res.render('onboarding/welcome');
};

exports.onboarding.class = function(req, res){
    console.log('[INFO] Recieved request at ', req.url);
    res.render('onboarding/class');
};

exports.onboarding.roster = function(req, res){
    console.log('[INFO] Recieved request at ', req.url);
    res.render('onboarding/roster');
};

exports.onboarding.faces = function(req, res){
    console.log('[INFO] Recieved request at ', req.url);
    res.render('onboarding/faces');
};

exports.onboarding.finished = function(req, res){
    console.log('[INFO] Recieved request at ', req.url);
    res.render('onboarding/finished');
};