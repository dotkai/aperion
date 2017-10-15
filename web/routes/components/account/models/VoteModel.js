/* MODEL: Account */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var vote = new Schema({
	timestamp: { type: Date, default: Date.now },
	accountid: {type: String, required: true },
	pollid: {type: String, required: true },
	optionid: {type: String, required: true }
});

// Make available and Export
var Vote = mongoose.model('Votes', vote);
module.exports = Vote;