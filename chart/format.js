// Read Synchrously
var fs = require("fs");
var JSON = require("JSON");

//load output
var output = fs.readFileSync("output.json");
var output = JSON.parse(output)

//make function to filter output file
var filter = function(snapshot){
	var clean = []
	for (var i = snapshot.length - 1; i >= 0; i--) {
		var error = snapshot[i].engagement == undefined;
		if(error){
			//pass over error messages
		} else{
			clean.push(snapshot[i])
		}
	}
	return clean
}

//calculate avg engagement for a given snapshot
var calc = function(snapshot){
	var snapshot = filter(snapshot)

	var total_engagement = 0
	for (var i = snapshot.length - 1; i >= 0; i--) {
		total_engagement += snapshot[i].engagement
	}
	avg_engagement = total_engagement / snapshot.length
	return avg_engagement
}

//compile JSON file with avg engagements from each screenshot
var compile = function(output){
	var summary = [] ;
	var snap_list = output.attendance;

	for (var i = snap_list.length - 1; i >= 0; i--) {
		summary.push({
			date: i + 1,
			pct50: calc(output.attendance[i].attendance)
		});
	}
	return summary
}

var jsonData = JSON.stringify(compile(output));

//save as JSON file to be used by chart
fs.writeFile("test.json", jsonData, function(err) {
    if(err) {
        return console.log(err);
    }
});


