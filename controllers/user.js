const {
	body,
	validationResult,
} = require('express-validator/check');
const {
	sanitizeBody
} = require('express-validator/filter');

// Handles registering a user
exports.registration = function(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}

	// User.create({
	// 	username: req.body.username,
	// 	password: req.body.password
	// }).then(user => res.json(user));

	res.json({
		username: req.body.username,
		password: req.body.password
	})
}

// Handles logging in a user
exports.login = function(req, res) {
	res.send('NOT Implemented')
}

// Handles listing all users
exports.list_users = function(req, res) {
	res.send('NOT IMPLEMENTED: Author list');
};