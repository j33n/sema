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

// Export Users model.
module.exports = mongoose.model('Users', UsersSchema);