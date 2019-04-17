const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const MessageSchema = new Schema({
	from: {
		type: String,
		required: true,
		max: 100
	},
	to: {
		type: String,
		required: true,
		max: 100,
	},
	message: {
		type: String,
		required: true,
		max: 100,
	},
	read: {
		type: Boolean,
		required: true,
		max: 5,
	},
});

// Virtual for message sent.
MessageSchema
	.virtual('messageSent')
	.get(function() {
		return this.message;
	});

// Virtual for this author instance URL.
MessageSchema
	.virtual('url')
	.get(function() {
		return '/message/' + this._id
	});

// Export Message model.
module.exports = mongoose.model('Message', MessageSchema);
