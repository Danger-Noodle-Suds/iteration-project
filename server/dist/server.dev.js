"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var path = require('path');

var keys = require('../api_keys');

var twilio = require('twilio')(keys.twilioAccountSid, keys.twilioAuthToken);

var db = require('./models/userModels');

var userController = require('./controllers/userController');

var historyController = require('./controllers/historyController');

var sessionController = require('./controllers/sessionController');

var journalController = require('./controllers/journalController');

var cookieParser = require('cookie-parser');

var app = express(); // static asset service and json parsing

app.use(express["static"]('../client/assets'));
app.use(express.json());
app.use(cookieParser()); // once we have DB figured out we can query the DB every minute.
// setInterval(() => {
//   console.log('set interval is working per minute');
// }, 60 * 1000);
// twilio.messages
//   .create({
//     body: 'Roland reported they were feeling down. Reach out!',
//     messagingServiceSid: 'MG7fb60d87d0007c008da8c8476ed45d95',
//     to: '+19088388678',s
//   })
//   .then((message) => console.log(message.sid))
//   .done();
// app.get('/', (req, res) => {
//   res.status(200).sendFile(path.join(__dirname, '../index.html'));
// });

var uriArr = ['/login', '/signup', 'user', '/'];
uriArr.map(function (e) {
  return app.get(e, function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  });
}); // serve from the build file 

app.use('/build', express["static"](path.join(__dirname, '../build'))); // logs in the user, retrieves their mood history and saves today's date as their last login
// responds with user details 

app.post('/login', userController.verifyUser, // ! comment out the line below
sessionController.deleteSession, sessionController.startSession, historyController.getMoodHistory, historyController.updateLastLoginDate, function (req, res) {
  var resObject = _objectSpread({}, res.locals.user, {
    userVerified: true,
    message: 'User Found',
    moodHistory: res.locals.moodHistory
  });

  return res.status(200).json(resObject);
}); // creates a new user and saves it to the database
// ! it would be nice if this went to the main page afterwards with a verified session and new mood history

app.post('/signup', userController.createUser, function (req, res) {
  return res.status(200).json({
    newUserCreated: true,
    message: 'New user successfully created.'
  });
}); // retrieves user info, saves mood input, retrieves mood history and returns it

app.post('/user', sessionController.verifySession, userController.getUser, historyController.saveMood, historyController.getMoodHistory, function (req, res) {
  return res.status(200).json({
    user: res.locals.user,
    moodHistory: res.locals.moodHistory
  });
});
app.get('*', function (req, res) {
  res.status(404).send('Nothing here');
}); // universal err handler

app.use(function (err, req, res, next) {
  var defaultErr = {
    status: 500,
    log: "Problem in some middleware. ".concat(err.message),
    message: 'Serverside problem.'
  };
  var errObject = Object.assign(defaultErr, err);
  console.log(errObject.log);
  res.status(errObject.status).send(errObject.message);
});
app.listen(3000);