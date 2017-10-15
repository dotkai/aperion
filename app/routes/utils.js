// Util functions and wrappers
var checkvalid = require('validator');

module.exports = {
	validPost: validPost,
	findWithAttr: findWithAttr,
	getLast: getLast,
	addDays: addDays
};

function validPost(data, callback, req, res){
	// If the request has all specified parameters, continue with the post
	var valid = true;
	if(data.params){
		// Check if all required params are defined in the request
		setIfInvalid(req.params, data.params, function(invalidKey){
			console.log('Params  Missing: ', invalidKey);
			valid = false;
		});
	}
	if(data.body){
		// Check if all required body values are defined in the request
		setIfInvalid(req.body, data.body, function(invalidKey){
			console.log('Body  Missing: ', invalidKey);
			valid = false;
		});
	}
	if(data.query){
		// Check if all required body values are defined in the request
		setIfInvalid(req.query, data.quey, function(invalidKey){
			console.log('Query Missing: ', invalidKey);
			valid = false;
		});
	}

	if(valid){
		callback();
	} else {
		return res.sendStatus(400);
	}
}

function setIfInvalid(valobj, matchobj, callback){
	for(var key in matchobj){
		if(!valobj || valobj[key] === undefined){ 
			// If the submitted request does not exist
			// Or the submitted request does not contain the required key
			return callback(key, false);
		} else if(typeof(matchobj[key])==="object" 
			&& !checkvalid.isIn(valobj[key], matchobj[key])){
			// If the key does not match the items in the list
			callback(key, false);
		}
	}
}

function findWithAttr(array, attr, value) {
	// Finds index of an object in an array of objects with key-value match
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

function getLast(array, key){
	return (array.length > 0)? array[array.length][key] : null;
}

function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}