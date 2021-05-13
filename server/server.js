const express = require('express');
const path = require('path');
const keys = require('./api_keys');
const twilio = require('twilio')(keys.twilioAccountSid, keys.twilioAuthToken);
const db = require('./models/userModels')
const userController = require('./controllers/userController');
const historyController = require('./controllers/historyController');
const sessionController = require('./controllers/sessionController');
const cookieParser = require('cookie-parser');

const app = express();

// static asset service and json parsing
app.use(express.static('../client/assets'));
app.use(express.json());
app.use(cookieParser());

// once we have DB figured out we can query the DB every minute.
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

const uriArr = ['/login', '/signup', 'user', '/'];
uriArr.map((e) =>
  app.get(e, (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../index.html'));
  })
);

// serve from the build file 
app.use('/build', express.static(path.join(__dirname, '../build')));

// logs in the user, retrieves their mood history and saves today's date as their last login
// responds with user details 
app.post(
  '/login',
  userController.verifyUser,
  // ! comment out the line below
  sessionController.deleteSession,
  sessionController.startSession, 
  historyController.getMoodHistory,
  historyController.updateLastLoginDate,
  (req, res) => {
    const resObject = {
      ...res.locals.user,
      userVerified: true,
      message: 'User Found',
    };
    return res.status(200).json(resObject);
  }
);

// creates a new user and saves it to the database
// ! it would be nice if this went to the main page afterwards with a verified session and new mood history
app.post('/signup', 
  userController.createUser, 
  (req, res) => {
    return res.status(200).json({newUserCreated: true, message: 'New user successfully created.'});
  }
);

// retrieves user info, saves mood input, retrieves mood history and returns it
app.post('/user',
  sessionController.verifySession,
  userController.getUser,
  historyController.saveMood,
  historyController.getMoodHistory,
  (req, res) => {
    return res.status(200).json({ 
        user: res.locals.user, 
        moodHistory: res.locals.moodHistory 
      });
  }
);

app.get('*', (req, res) => {
  res.status(404).send('Nothing here');
});

// universal err handler
app.use((err, req, res, next) => {
  const defaultErr = {
    status: 500,
    log: `Problem in some middleware. ${err.message}`,
    message: 'Serverside problem.',
  };
  const errObject = Object.assign(defaultErr, err);

  console.log(errObject.log);

  res.status(errObject.status).send(errObject.message);
});

app.listen(3000);
