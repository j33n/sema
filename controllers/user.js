const {
	validationResult
} = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require('../models/users');
const Message = require('../models/message');

const {
	BCRYPT_SALT_ROUNDS,
	TOKEN_EXPIRATION,
	SECRET,
} = process.env;

// Handles registering a user
exports.registration = function(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}

	bcrypt.hash(req.body.password, parseInt(BCRYPT_SALT_ROUNDS))
		.then(function(hash) {
			Users.find({
				$or: [{
						username: req.body.username
					},
					{
						phone: req.body.phone
					}
				]
			}, (error, user) => {
				if (error) {
					return res.status(400).json({
						errors: error.message
					})
				}
				if (user && user.length > 0) {
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
	// TODO: Save token and ensure it hasn't been used before
	// TODO: Use a more secure token algorithm like RS256
	// TODO: Save tokens, ensure once user is deleted token expires

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}

	Users.findOne({
		$or: [{
				username: req.body.username
			},
			{
				phone: req.body.username
			}
		]
	}, (error, user) => {
		if (!user) {
			return res.status(400).json({
				errors: 'User does not exist',
			})
		}

		bcrypt.compare(req.body.password, user.password, (err, passwordResponse) => {
			if (!passwordResponse) {
				return res.status(400).json({
					errors: 'Invalid user credentials'
				});
			}

			jwt.sign({
				user
			}, SECRET, {
				expiresIn: TOKEN_EXPIRATION,
			}, (err, token) => {
				if (err) {
					return res.status(400).json({
						errors: err.message
					});
				}
				return res.status(200).json({
					message: 'User authenticated successfully',
					token,
					user,
				});
			});
		});
	});
}

// Handles listing all users
exports.list_users = function(req, res) {
	Users.find({}, (error, user) => {
		if (user.length > 0) {
			return res.status(200).json({
				users: user,
				message: 'Users retrieved successfuly',
			})
		}
		return res.status(400).json({
			errors: 'No Users available at the moment',
		})
	})
};

// Delete a user account
exports.delete_user = (req, res) => {
	Users.findByIdAndDelete(req.params.user_id)
		.then((deletedUser) => {
			if (!deletedUser) {
				return res.status(422).json({
					errors: {
						plain: 'No Users available with that id',
					}
				});
			}
			Message.find({
				$or: [{
						from: deletedUser._id
					},
					{
						to: deletedUser._id
					}
				]
			}).then((deletedMessage) => {
				let message;
				if (deletedMessage.length === 0) message = 'User account deleted';
				if (deletedMessage.length === 1) message = 'User account and a message associated to it were deleted'
				if (deletedMessage.length > 1) message = `User account and ${deletedMessage.length} messages associated to it were deleted`
				return res.status(200).json({
					users: deletedUser,
					message,
				})
			});

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