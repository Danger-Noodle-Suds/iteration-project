const express = require('express');
const path = require('path');
const keys = require('../api_keys');
const twilio = require('twilio')(keys.twilioAccountSid, keys.twilioAuthToken);

const app = express();

const userController = require("./controllers/userController");
const historyController = require('./controllers/historyController');

app.use(express.static('../client/assets'));
app.use(express.json());

// once we have DB figured out we can query the DB every minute.
setInterval(() => {
  console.log('set interval is working per minute');
}, 60 * 1000);

// twilio.messages
//   .create({
//     body: 'Roland reported they were feeling down. Reach out!',
//     messagingServiceSid: 'MG7fb60d87d0007c008da8c8476ed45d95',
//     to: '+19088388678',
//   })
//   .then((message) => console.log(message.sid))
//   .done();

// app.get("/", (request, response) => {
//   response.status(200).sendFile(path.join(__dirname, "../index.html"));
// });
const uriArr = ['/login', '/signup', 'user', '/'];
uriArr.map((e) =>
  app.get(e, (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  })
);

app.use('/build', express.static(path.join(__dirname, '../build')));

// logs in the user, retrieves their mood history and saves today's date as their last login
// responds with user details 
app.post(
  '/login',
  userController.verifyUser,
  historyController.getMoodHistory,
  historyController.updateLastLoginDate,
  (request, response) => {
    const responseObject = {
      userVerified: true,
      message: 'User Found.',
      firstName: response.locals.user[0].firstname,
      addiction: response.locals.user[0].addiction,
      emergencyContactName: response.locals.user[0].emergencycontactname,
      emergencyContactPhone: response.locals.user[0].emergencycontactphone,
      lastLoginDate: response.locals.user[0].lastlogindate,
      moodHistory: response.locals.userMoodHistory,
    };
    return response.status(200).json(responseObject);
  }
);

// creates a new user and saves it to the database
// ! it would be nice if this went to the main page afterwards with a verified session and new mood history
app.post("/signup", 
  userController.createUser, 
  (request, response) => {
    return response.status(200).json({newUserCreated: true, message: "New user successfully created."});
  }
);

// retrieves user info, saves mood input, retrieves mood history and returns it
app.post("/user",
  userController.getUserID,
  historyController.saveMood,
  historyController.getMoodHistory,
  (req, res) => {
    return res.status(200).json({ 
        user: res.locals.user, 
        moodHistory: res.locals.userMoodHistory 
      });
  }
);

app.get('*', (request, response) => {
  response.status(404).send('Nothing here');
});

// universal error handler
app.use((error, request, response, next) => {
  const defaultError = {
    status: 500,
    log: 'Problem in some middleware.',
    message: 'Serverside problem.',
  };
  const ourError = Object.assign(defaultError, error);

  console.log(ourError.log);

  response.status(ourError.status).send(ourError.message);
});

app.listen(3000);
