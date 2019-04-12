const {
	validationResult
} = require('express-validator/check');

const Message = require('../models/message');

// Send message
exports.send_message = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}
	
	Message.create({
		from: req.body.from,
		to: req.body.to,
		message: req.body.message,
		read: 0,
	})
	.then(user => res.status(201).json(user))
	.catch((err) => res.status(400).json({ errors: err.message}));
}

// Get a specific message
exports.get_message = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}
	res.status(201).json(
		{message: 'created'}
	)
	
}
