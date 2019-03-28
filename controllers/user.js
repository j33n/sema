const {
	body,
	validationResult,
} = require('express-validator/check');
const {
	sanitizeBody
} = require('express-validator/filter');

// Handles registering a user
exports.registration = function(req, res) {
	res.send('NOT IMPLEMENTED: Author list');
}

// Handles logging in a user
exports.login = function(req, res) {
	res.send('NOT Implemented')
}

// Handles listing all users
exports.list_users = function(req, res) {
	res.send('NOT IMPLEMENTED: Author list');
};
