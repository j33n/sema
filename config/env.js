require('dotenv').config();

const env = process.env.NODE_ENV || 'test';

const dev = {
	app: process.env.PORT || 3000,
	db: process.env.DB_NAME
};

const test = {
	port: process.env.PORT || 3000,
	db: `${process.env.DB_NAME}_test`,
};

const config = {
	dev,
	test
};

module.exports = config[env];
