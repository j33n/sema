const express = require('express');
const router = express.Router();
const {
	check,
	validationResult
} = require('express-validator/check');

// Require controller modules.
const user_controller = require('../controllers/user');

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
router.post('/log-in', user_controller.list_users);

module.exports = router;