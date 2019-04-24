/*************************** 
 ** Initialize our database *
 ***************************/

//Import the mongoose module
const mongoose = require('mongoose');
const envConfig = require('../config/env');
const Users = require('../models/users');
const Message = require('../models/message');

//Set up default mongoose connection

const mongoDB = envConfig.db;

console.log('mongoDB :---------------------------------', mongoDB);

mongoose.connect(mongoDB, {
	useNewUrlParser: true,
	connectTimeoutMS: 10000,
	socketTimeoutMS: 45000,
	reconnectInterval: 500,
	poolSize: 10,
});

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
	// we're connected!
	if (process.env.NODE_ENV === 'test') {
		function clearDB(done) {
			const promises = [
				Users.deleteMany().exec(),
				Message.deleteMany().exec(),
			];

			Promise.all(promises)
				.then(function() {
					done();
				})
		}

		before(function(done) {
			return clearDB(done);
		});

		after(function(done) {
			return clearDB(done);
		});
	}
	console.log("Database connected!!")
});