const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
	username: {
		type: String,
		required: true,
		max: 100
	},
	phone: {
		type: String,
		required: true,
		max: 100,
	},
	password: {
		type: String,
		required: true,
		max: 100,
	},
});

// Virtual for user username.
UsersSchema
	.virtual('name')
	.get(function() {
		return this.username;
	});

// Virtual for this user instance url
UsersSchema
	.virtual('url')
	.get(function() {
		return '/users/' + this._id
	});

// Export Users model.
module.exports = mongoose.model('Users', UsersSchema);
