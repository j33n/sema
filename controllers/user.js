const {
	body,
	validationResult,
} = require('express-validator/check');
const {
	sanitizeBody
} = require('express-validator/filter');
const bcrypt = require('bcrypt');

const Users = require('../models/users');

// Handles registering a user
exports.registration = function(req, res) {
	const errors = validationResult(req);
	const saltRounds = process.env.BCRYPT_SALT_ROUNDS;
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}

	bcrypt.hash(req.body.password, parseInt(saltRounds))
		.then(function(hash) {
			Users.find({ username: req.body.username }, (error, user) => {
				if (error) {
					return res.status(400).json({
						errors: error.message
					})
				}
				if (user.length > 0) {
					return res.status(400).json({
						errors: "User account already exists"
					})
				}
				Users.create({
					username: req.body.username,
					phone: req.body.phone,
					password: hash,
				}).then(user => res.status(201).json(user));
			});
			
		}).catch(function(error) {
			return res.status(400).json({
				errors: error.message
			})
		});
}

// Handles logging in a user
exports.login = function(req, res) {
	res.send('NOT Implemented')
}

// Handles listing all users
exports.list_users = function(req, res) {
	res.send('NOT IMPLEMENTED: Author list');
};