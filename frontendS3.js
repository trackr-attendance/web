var config = require('./awsConfig.json'),
  policy = require('s3-policy'),
  uuidv4 = require('uuid/v4');

// PRIVATE METHODS
function _getExtension(filename) {
  var i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i);
}

// PUBLIC METHODS
exports.signS3 = function signS3(req, res) {
  var fileExtension = _getExtension(req.body.name),
    filename = uuidv4() + fileExtension,
    p = policy({
      acl: 'public-read',
      secret: config.secretAccessKey,
      length: 5000000, // in bytes?
      bucket: 'trackr-attendance',
      key: filename,
      expires: new Date(Date.now() + 60000),
    }),
    result = {
      'AWSAccessKeyId': config.accessKeyId,
      'key': filename,
      'policy': p.policy,
      'signature': p.signature
    };
  res.write(JSON.stringify(result));
  res.end();
};