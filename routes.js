exports.notImplementedResponse = function(req, res){
    console.log('[INFO] Recieved request at ', req.url);
    res.status(501).send({"status code": 501, "status string": "501 Not Implemented", "message": req.url + " is not implemented."});
}
