/* MODEL: User */
var mongoose = require('mongoose')
  , uuid = require('uuid')
  , Schema = mongoose.Schema;

var userSchema = new Schema({
	_id: { type: String, default: uuid.v1 },
	created: { type: Date, default: Date.now },
    terms: { type: Date },
    login: { type: String, required: true },
        // Can be: local, facebook, google, etc.
        // What the user can log in with
    facebook: {
        id: String,
        token: String,
        email: String
    },
    twitter: {
        id: String,
        token: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String
    }
});

// Make available and Export
var User = mongoose.model('Users', userSchema);
module.exports = User;