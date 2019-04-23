const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const messageRouter = require('./routes/message');

require('dotenv').config();
require('./config/db')

const app = express();

const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Documentation routing
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Routing
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/message', messageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // respond when we have error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;

//TODO: Change from displaying user details in Id form to their specific phone number or user email