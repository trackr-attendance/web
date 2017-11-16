var express = require('express');
var app = express();

var config = require('./config.js')

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });

var AWS = require('aws-sdk');
AWS.config.region = config.region;

var uuid = require('node-uuid');
var fs = require('fs-extra');
var path = require('path');


app.use(express.static('public'));

var rekognition = new AWS.Rekognition({region: config.region});


	var bitmap = fs.readFileSync("me.jpg");

	rekognition.searchFacesByImage({
	 	"CollectionId": config.collectionName,
	 	"FaceMatchThreshold": 70,
	 	"Image": { 
	 		"Bytes": bitmap,
	 	},
	 	"MaxFaces": 1
	}, function(err, data) {
	 	if (err) {
	 		console.log(err);
	 	} else {
			if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Face)
			{
				console.log(data.FaceMatches[0].Face.ExternalImageId);	
			} else {
				console.log("Not recognized");
			}
		}
	});

