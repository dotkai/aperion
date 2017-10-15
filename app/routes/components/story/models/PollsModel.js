/* MODEL: POLL */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var optionSchema = new Schema({
	active: { type: Boolean, default: true },
		// If this is false, "No voting this week"
	ptype: { type: String, default: 'vote', required: true },
		// vote = select one
		// survey = 
	path: { type: String, required: true, default: 'go' },
	chapter: { type: Number, required: true },
	part: { type: Number, required: true },
	start: {type: Date, required: true },
		// Day the poll starts
		// End = 5 days (Friday)
		// Results = 7 days (Monday)
	extend: Number,
		// Number of days to extend (default 7)
	chars: [String],
	text: String,
	options: [{
		text: String,
		vote: { type: Number, default: 0 },
		input: Schema.Types.Mixed
			// If multi, this uses custom poll type
	}]
});

// Make available and Export
var Polls = mongoose.model('Polls', optionSchema);
module.exports = Polls;