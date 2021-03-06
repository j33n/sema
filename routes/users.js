const express = require('express');
const router = express.Router();
const {
	check,
	validationResult
} = require('express-validator/check');
const jwt = require('jsonwebtoken');

const {
	protectedRoute
} = require('../middlewares')

require('dotenv').config();

// Require controller modules.
const user_controller = require('../controllers/user');

const commonValidations = [
	// username can be an email or names ❤️
	check('username').isLength({
		min: 2
	}),
	// password must be at least 5 chars long
	check('password').isLength({
		min: 5
	}),
];

const userRegistrationDetailsValidator = [
	...commonValidations,
	check('phone').isMobilePhone(),
];

const userLoginDetailsValidator = commonValidations;

/// USER ROUTES ///

// User registration
router.post('/sign-up', userRegistrationDetailsValidator, user_controller.registration);

// User login
router.post('/log-in', userLoginDetailsValidator, user_controller.login);

// User listing
router.get('/get-users', protectedRoute, user_controller.list_users);

// Delete a user and his occurences
router.delete('/delete/:user_id', protectedRoute, user_controller.delete_user);

module.exports = router;