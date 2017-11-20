exports.roster = function (data){
	// Verify POST Information
	var databaseStructure;
	var error_res = [];

	/* Course Number */
	if (!("students" in data) || (typeof data.students == 'undefined')){
		error_res.push("<students> needs to be present");
	}else{
		if (!Array.isArray(data.students)){
			error_res.push("<students> must be an array");
		}else{
			databaseStructure = data.students.map(function(student){

				var cleanStudent = {}
				var id = 0;
				if (!("id" in student) || (typeof student.id == 'undefined')){
					error_res.push("<student[]><id> needs to be present");
				}else{
					cleanStudent.id = parseInt(student.id)
				}

				if (!("first" in student) || (typeof student.first == 'undefined')){
					error_res.push("<student[" + cleanStudent.id + "]><first> needs to be present");
				}else{
					if (student.first.length < 2){
						error_res.push("<student[" + cleanStudent.id + "]><first> needs to be longer than 2 characters.");
					}else{
						cleanStudent.first = student.first.trim();
					}
				}

				if (!("last" in student) || (typeof student.last == 'undefined')){
					error_res.push("<student[" + cleanStudent.id + "]><last> needs to be present");
				}else{
					if (student.last.length < 2){
						error_res.push("<student[" + cleanStudent.id + "]><last> needs to be longer than 2 characters.");
					}else{
						cleanStudent.last = student.last.trim();
					}
				}

				if (!("username" in student) || (typeof student.username == 'undefined')){
					error_res.push("<student[" + cleanStudent.id + "]><username> needs to be present");
				}else{
					if (student.username.length < 1){
						error_res.push("<student[" + cleanStudent.id + "]><username> needs to be longer than 2 characters.");
					}else{
						cleanStudent.username = student.username.trim();
					}
				}
				return cleanStudent;
			});
		}
	}

	return {errors: error_res, data: databaseStructure};
}