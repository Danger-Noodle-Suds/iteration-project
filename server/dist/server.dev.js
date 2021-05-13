"use strict";

var express = require('express');

var path = require('path');

var keys = require('./api_keys');

var twilio = require('twilio')(keys.twilioAccountSid, keys.twilioAuthToken);

var db = require('./models/userModels');

var userController = require('./controllers/userController');

var historyController = require('./controllers/historyController');

var app = express(); // static asset service and json parsing

app.use(express["static"]("../client/assets"));
app.use(express.json()); // once we have DB figured out we can query the DB every minute.

setInterval(function () {
  console.log("set interval is working per minute");
}, 60 * 1000); // twilio.messages
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

var uriArr = ["/login", "/signup", "user", "/"];
uriArr.map(function (e) {
  return app.get(e, function (req, res) {
    return res.status(200).sendFile(path.join(__dirname, "../index.html"));
  });
}); // serve from the build file

app.use("/build", express["static"](path.join(__dirname, "../build"))); // logs in the user, retrieves their mood history and saves today's date as their last login
// responds with user details

app.post("/login", userController.verifyUser, historyController.getMoodHistory, historyController.updateLastLoginDate, historyController.getJournalHistory, function (req, res) {
  var resObject = {
    userVerified: true,
    message: "User Found.",
    firstName: res.locals.user[0].firstname,
    addiction: res.locals.user[0].addiction,
    contactName: res.locals.user[0].contactname,
    contactPhone: res.locals.user[0].contactphone,
    lastLoginDate: res.locals.user[0].lastlogindate,
    moodHistory: res.locals.userMoodHistory,
    journalHistory: res.locals.userJournalHistory
  };
  return res.status(200).json(resObject);
}); // creates a new user and saves it to the database
// ! it would be nice if this went to the main page afterwards with a verified session and new mood history

app.post("/signup", userController.createUser, function (req, res) {
  return res.status(200).json({
    newUserCreated: true,
    message: "New user successfully created."
  });
});
app.post("/user", userController.getUser, userController.saveMood, historyController.getMoodHistory, function (req, res) {
  return res.status(200).json({});

  moodHistory: res.locals.userMoodHistory;
});
app.post("/user/journal", userController.getUser, historyController.saveJournal, historyController.getJournalHistory);
app.get("*", function (req, res) {
  res.status(404).send("Nothing here");
}); // universal err handler

app.use(function (err, req, res, next) {
  console.log(err);
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