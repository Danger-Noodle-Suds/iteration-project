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

app.post("/login", userController.verifyUser, userController.getMoodHistory, userController.updateLastLoginDate, // !userController.getJournalHistory
function (request, response) {
  var responseObject = {
    userVerified: true,
    message: "User Found.",
    firstName: response.locals.user[0].firstname,
    addiction: response.locals.user[0].addiction,
    emergencyContactName: response.locals.user[0].emergencycontactname,
    emergencyContactPhone: response.locals.user[0].emergencycontactphone,
    lastLoginDate: response.locals.user[0].lastlogindate,
    moodHistory: response.locals.userMoodHistory //!journalHistory: response.locals.userJournalHistory

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
app.post("/user", userController.getUserID, userController.saveMood, userController.getMoodHistory, function (request, response) {
  return response.status(200).json({});

  moodHistory: response.locals.userMoodHistory;
});
app.post("/user/journal" // !userController.saveJournal,
// !userController.getJournalHistory
);
app.get("*", function (request, response) {
  response.status(404).send("Nothing here");
}); // universal err handler

app.use(function (err, req, res, next) {
  var defaultErr = {
    status: 500,
    log: "Problem in some middleware.",
    message: "Serverside problem."
  };
  var errObject = Object.assign(defaultErr, err);
  console.log(errObject.log);
  res.status(errObject.status).send(errObject.message);
});
app.listen(3000);