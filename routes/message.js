const express = require('express');
const router = express.Router({
	mergeParams: true
});
const {
	check,
	validationResult,
	oneOf,
} = require('express-validator/check');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const {
	protectedRoute
} = require('../middlewares')

// Require controller modules.
const message_controller = require('../controllers/message');

/// Middlewares
const messageValidation = [
	check('message', 'Please provide a message'),
];

const recipientValidation = oneOf(
	[
		check('to', 'Please provide a valid email or phone number').isMobilePhone(),
		check('to', 'Please provide a valid email or phone number').isEmail(),
	]
)

/// USER ROUTES ///

// Sending message
router.post('/', recipientValidation, messageValidation, protectedRoute, message_controller.send_message);

// Get/Read a specific message
router.get('/read/:message_id', protectedRoute, message_controller.get_message);

// Delete a specific message
router.delete('/delete/:message_id', protectedRoute, message_controller.delete_message);

// Get all messages
router.get('/all', protectedRoute, message_controller.all_messages);

// Get all received messages
router.get('/received', protectedRoute, message_controller.received_messages);

// Get all sent messages
router.get('/sent', protectedRoute, message_controller.sent_messages);

module.exports = router;