const express = require('express');
const router = express.Router();
const {
	check,
	validationResult
} = require('express-validator/check');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// Require controller modules.
const user_controller = require('../controllers/user');

const protectedRoute = (req, res, next) => {
	const token = req.headers['x-access-token'];
	if (!token) return res.status(401).json({
		auth: false,
		errors: 'No token provided.',
	});
	// TODO: Research on whether Authorization: Bearer {token} is better than above 👆
	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if (err) return res.status(500).json({
			auth: false,
			errors: 'Failed to authenticate token.'
		});
		req.userData = decoded;
		next();
	});
}

const commonValidations = [
	// username must be an email
	check('username').isEmail(),
	// password must be at least 5 chars long
	check('password').isLength({
		min: 5
	}),
];

const userRegistrationDetailsValidator = [
	...commonValidations,
	check('phone').isInt().isLength({
		min: 5
	}),
];

const userLoginDetailsValidator = commonValidations;

/// USER ROUTES ///

// User registration
router.post('/sign-up', userRegistrationDetailsValidator, user_controller.registration);

// User login
router.post('/log-in', userLoginDetailsValidator, user_controller.login);

// User listing
router.get('/get-users', protectedRoute, user_controller.list_users);

module.exports = router;