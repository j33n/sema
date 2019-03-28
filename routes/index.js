var express = require('express');
var router = express.Router();

// Require controller modules.
var index_controller = require('../controllers/index');

/* GET home page. */
router.get('/', index_controller.homepage);

module.exports = router;
