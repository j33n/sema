var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/user');

/// USER ROUTES ///

// User registration
router.post('/sign-in', user_controller.registration);

// User login
router.post('/log-in', user_controller.login);

// User listing
router.post('/log-in', user_controller.list_users);

module.exports = router;
