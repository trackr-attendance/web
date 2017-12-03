var AWS = require('aws-sdk');
var admin = require("firebase-admin");
var deepcopy = require("deepcopy");
var merge = require('deepmerge')
var parse = require('url-parse');
var validate = require("./datavalidation");

// AWS Configuration
AWS.config.loadFromPath('./awsConfig.json');

// Firebase Configuration
admin.initializeApp({
  credential: admin.credential.cert(require("./trackrAttendanceFirebaseConfig.json")),
  databaseURL: "https://trackr-attendance.firebaseio.com"
});

db = admin.database();

exports.notImplementedResponse = function(req, res){
	console.log('[INFO] Recieved GET request at ', req.url);
	res.status(501).send({"status code": 501, "status string": "501 Not Implemented", "message": req.url + " is not implemented."});
};

exports.home = function(req, res){
	console.log('[INFO] Recieved GET request at ', req.url);
	res.render('home', {layout: false});
}

exports.onboarding = {};

exports.onboarding.welcome = function(req, res){
	console.log('[INFO] Recieved GET request at ', req.url);
	res.redirect('../class/');
	// TODO: Implement Marketing Copy On This Page
	// res.render('onboarding/welcome');
};

exports.onboarding.class = {};

exports.onboarding.class.get = function(req, res){
	console.log('[INFO] Recieved GET request at ', req.url);
	res.render('onboarding/class');
};

exports.onboarding.class.post = function(req, res){
	console.log('[INFO] Recieved POST request at ', req.url);

	// Verify POST Information
	var databaseStructure = {};
	databaseStructure.classes = {};
	var error_res = [];

	/* Course Number */
	if (!("number" in req.body) || (typeof req.body.number == 'undefined')){
		error_res.push("<number> needs to be present");
	}else{
		var courseNumberRegEx = /[\d\w]+\.\d+\w+/i;
		if (!req.body.number.match(courseNumberRegEx)){
			error_res.push("<number> needs to include one period (.) e.g. SCM.260, 1.125, IDS.270");
		}else{
			databaseStructure.number = req.body.number;
		}
	}

	/* Course Name */
	if (!("name" in req.body) || (typeof req.body.name == 'undefined')){
		error_res.push("<name> needs to be present");
	}else{
		if (req.body.name.length < 3){
			error_res.push("<name> needs to be longer than 3 characters.");
		}else{
			databaseStructure.name = req.body.name;
		}
	}

	var cleanedDaysOfWeek = false;
	/* Days of Week */
	if (!("daysOfWeek" in req.body) || (typeof req.body.daysOfWeek == 'undefined')){
		error_res.push("<daysOfWeek> needs to be present");
	}else{
		if (!Array.isArray(req.body.daysOfWeek)){
			error_res.push("<daysOfWeek> must be an array");
		}else{
			req.body.daysOfWeek.filter(function(index){
				return (index >= 0 && index <=6);
			});
			databaseStructure.classes.daysOfWeek = req.body.daysOfWeek.map(Number);
			cleanedDaysOfWeek = true;
		}
	}

	/* Course Dates */
	if (!("startDate" in req.body) || (typeof req.body.startDate == 'undefined')){
		error_res.push("<startDate> needs to be present");
	}else{
		try {
			var startDate = new Date(req.body.startDate + " EST");
			databaseStructure.classes.startDate = startDate.toJSON();
		} catch(err){
			error_res.push("<startDate>" + err);
		}
	}

	if (!("endDate" in req.body) || (typeof req.body.endDate == 'undefined')){
		error_res.push("<endDate> needs to be present");
	}else{
		try {
			var endDate = new Date(req.body.endDate + " EST");
			databaseStructure.classes.endDate = endDate.toJSON();
		} catch(err){
			error_res.push("<endDate>" + err);
		}
	}
	
	if(startDate != null && endDate != null) {
		if (endDate <= startDate){
			error_res.push("<endDate> must be after <startDate>");
		}else {
			if(cleanedDaysOfWeek){
				databaseStructure.classes.dates = [];

				var currentDay = new Date(startDate);
				while (currentDay <= endDate){
					// Only Add Days Class Repeats On
					if (databaseStructure.classes.daysOfWeek.indexOf(currentDay.getDay()) > -1){
						databaseStructure.classes.dates.push(new Date(currentDay).toJSON());
					}

					currentDay.setDate(currentDay.getDate() + 1); 
				}

				databaseStructure.classes.total = databaseStructure.classes.dates.length;
			}
		}
	}

	if (error_res.length == 0){
		// Upload to Database
		var dbPost = {};
		var courseNumber = databaseStructure.number.replace('.','');
		dbPost[courseNumber] = {2017: databaseStructure};
		db.ref("courses/MIT").update(dbPost);

		res.redirect('../' + databaseStructure.number + '/roster/');
	}else{
		console.log(error_res);
		res.render('onboarding/class');
	}
};

exports.onboarding.roster = {}
exports.onboarding.roster.get = function(req, res){
	console.log('[INFO] Recieved GET request at ', req.url);
	res.render('onboarding/roster');
};

exports.onboarding.roster.post = function(req, res){
	console.log('[INFO] Recieved POST request at ', req.url);

	var bodyClean = validate.roster(req.body);

	if (bodyClean.errors.length == 0){
		var course = req.params.class.replace('.','');
		db.ref("courses/MIT/"+course+"/2017/").update({roster: {students:bodyClean.data, total: bodyClean.data.length}});

		res.redirect('../faces/');
	}else{
		res.render('onboarding/roster');
	}
};

exports.onboarding.faces = function(req, res){
	console.log('[INFO] Recieved GET request at ', req.url);
	var courseNumber = req.params.class.replace('.','');

	db.ref("courses/MIT/"+courseNumber+"/2017/roster/students").once('value').then(function(snapshot) {
		res.render('onboarding/faces', {students: snapshot.val(), number: courseNumber});
	});
};

exports.onboarding.finished = function(req, res){
	console.log('[INFO] Recieved GET request at ', req.url);
	var courseNumber = req.params.class.replace('.','');

	collection = 'MIT-' + req.params.class + '-2017';

	// Create Amazon AWS Collection
	var rekognition = new AWS.Rekognition();

	rekognition.createCollection( { "CollectionId": collection }).promise().then(function (data){
		console.log(data);
	}, function (error){
		if (error.code != 'ResourceAlreadyExistsException'){
			console.log(error);
		}
	});

	// Train Image Set
	db.ref("courses/MIT/"+courseNumber+"/2017/roster/students").once('value').then(function(snapshot) {
		faces = snapshot.val().map(function (face){
			photo = parse(face.photo, true);
			return {
				"CollectionId": collection,
				"DetectionAttributes": [ "ALL" ],
				"ExternalImageId": collection + ['', face.id, face.first.replace(/[^a-zA-Z0-9_.]/,''), face.last.replace(/[^a-zA-Z0-9_.]/,'')].join('-'),
				"Image": { 
					"S3Object": { 
						"Bucket": photo.hostname.substring(0, photo.hostname.indexOf(".")),
						"Name": photo.pathname.replace('\/', '')
					}
				}
			};
		});

		faces.forEach(function (face){
			rekognition.indexFaces(face).promise().catch(function (error){
				console.log(error);
			});
		});
	});

	res.redirect('/classes/');
	// TODO: Implement Marketing Copy On This Page
	// res.render('onboarding/finished');
};

exports.dashboard = {};

exports.dashboard.home = function(req, res){
	console.log('[INFO] Recieved GET request at ', req.url);

	db.ref("courses/MIT/").once('value').then(function(snapshot) {
		var data = snapshot.val();
		var body = [];
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				body.push(data[key][2017]);
			}
		}

		res.render('dashboard/home', {classes: body});
	});
}

exports.dashboard.course = function(req, res){
	console.log('[INFO] Recieved GET request at ', req.url);

	var course = req.params.class.replace('.','');
	db.ref("courses/MIT/"+course+"/2017/").once('value').then(function(snapshot) {
		res.render('dashboard/course', snapshot.val());
	});
}

exports.dashboard.classes = function(req, res){
	console.log('[INFO] Recieved GET request at ', req.url);

	var course = req.params.class.replace('.','');
	db.ref("courses/MIT/"+course+"/2017/").once('value').then(function(snapshot) {

		var data = snapshot.val();
		var classes = deepcopy(data.classes.dates);
		var today = new Date();
		// Revive Dates
		var newClasses = [];
		classes.forEach(function (date){
			var date = new Date(date);
			var dateURI = date.toISOString().slice(0,10);
			var dateKey = dateURI.replace(/-/g,'');
			var attendance = dateKey in data.attendance;

			newClasses.push({
				date: date,
				past: (date < today),
				attendance: attendance,
				students: attendance ? data.attendance[dateKey].filter(Number).length : 0,
				key: dateKey,
				uri: dateURI
			});
		});

		res.render('dashboard/classes', merge.all([data, {sessions: newClasses},req.params]));
	});
}

exports.dashboard.class = function(req, res){
	console.log('[INFO] Recieved GET request at ', req.url);

	var course = req.params.class.replace('.','');
	var date = req.params.date.split('-').join('');

	db.ref("courses/MIT/"+course+"/2017/").once('value').then(function(snapshot) {
		var data = snapshot.val()

		var attendance = deepcopy(data.roster.students);
		if ((date in data.attendance) || (typeof data.attendance[date] !== 'undefined')){
			// Attendance Records Exist
			attendance.map(function (student) {
				student.present = (data.attendance[date].includes(student.id));
				return student;
			})
		}

		req.params.date = new Date(req.params.date + " EST");
		res.render('dashboard/class', merge.all([snapshot.val(), {present: attendance}, req.params]));
	});
}

exports.admin = {};

exports.admin.engagement = function(req, res){
	console.log('[INFO] Recieved GET request at ', req.url);

	var course = req.params.class.replace('.','');
	var date = req.params.date.split('-').join('');

	db.ref("courses/MIT/"+course+"/2017/").once('value').then(function(snapshot) {
		var data = snapshot.val()

		if ((date in data.engagement) || (typeof data.engagement[date] !== 'undefined')){
			res.send(data.engagement[date]);		
		}else{
			res.status(404).send({"status code": 404, "status string": "404 Not Found"});
		}
	});
}