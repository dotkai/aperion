/* MODEL: Account */
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Chapter = new Schema({
	path: { type: String, required: true },
	chapter: { type: Number, required: true, default: 1 }
});

var account = new Schema({
	userid: {type: String, required: true, unique: true },
	chapters: [Chapter],
	characters: Schema.Types.Mixed
});


// Make available and Export
var Account = mongoose.model('Accounts', account);
module.exports = Account;