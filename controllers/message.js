const {
	validationResult
} = require('express-validator/check');

const Users = require('../models/users');
const Message = require('../models/message');

// Send message
exports.send_message = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}

	Users.findOne({
			$or: [{
					username: req.body.to
				},
				{
					phone: req.body.to
				}
			]
		}).then((user) => {
			Message.create({
					from: req.userData.user._id,
					to: user._id,
					message: req.body.message,
					read: 0,
				})
				.then(user => res.status(201).json({
					user,
					message: 'Message sent!'
				}))
				.catch((err) => res.status(400).json({
					errors: {
						plain: 'Unable to save message',
						detailed: err.message,
					}
				}));

		})
		.catch(error => {
			res.status(400).json({
				errors: {
					plain: 'User not found',
					detailed: error.message
				},
			});
		});
}

// Read a specific message
exports.get_message = (req, res) => {
	Message.findById(req.params.message_id).then((message) => {
		if (!message) {
			return res.status(422).json({
				errors: {
					plain: 'Message not found',
				},
			});
		}
		return res.status(200).json(message);
	})
	.catch((error) => {
		return res.status(400).json({
			errors: {
				plain: 'Invalid request',
				detailed: error.message
			},
		});
	});
}