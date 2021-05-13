"use strict";

/* 
this script handles CRUD functionality for user schema for sign-up, login, authentication
*/
var db = require("../models/userModels");

var bcrypt = require("bcrypt");

var userController = {}; // finds a user by email and compares the password with bcrypt
// user row is saved to res.locals.user

userController.verifyUser = function (req, res, next) {
  var queryParams = [req.body.email];
  var queryString = "SELECT * FROM users WHERE email = $1;";
  db.query(queryString, queryParams, function (err, result) {
    if (err) return next({
      status: 500,
      message: "Error in userController.verifyUser."
    });

    if (result.rows.length === 0) {
      return res.status(400).json({
        userVerified: false,
        message: "User not found. Please check email."
      });
    }

    bcrypt.compare(req.body.password, result.rows[0].password, function (err, isMatched) {
      if (isMatched === false) {
        return res.status(400).json({
          userVerified: false,
          message: "Password incorrect."
        });
      }

      res.locals.user = result.rows;
      return next();
    });
  });
}; // creates a user row with bcrypted password
// TODO does not seem to have collision handling for an already created user?


userController.createUser = function _callee(req, res, next) {
  var SALT_FACTOR, hashedPassword, queryParams, queryString;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          SALT_FACTOR = 10;
          console.log('REQ BODY', req.body);
          _context.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, SALT_FACTOR));

        case 4:
          hashedPassword = _context.sent;
          queryParams = [req.body.firstName, req.body.lastName, req.body.userNumber, req.body.email, hashedPassword, req.body.contactName, req.body.contactNumber];
          console.log('QUERY PARAMS', queryParams);
          queryString = "INSERT INTO users (firstName, lastName, userNumber, email,, contactname, contactnumber) VALUES ($1, $2, $3, $4, $5, $6, $7);";
          db.query(queryString, queryParams, function (err, result) {
            console.log(result);
            if (err) return next({
              message: err.message
            });
            return next();
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}; // find a user by email
// sets the user row onto res.locals.user


userController.getUser = function (req, res, next) {
  var queryParams = [req.body.email];
  var queryString = "SELECT * FROM users WHERE email = $1;";
  db.query(queryString, queryParams, function (err, result) {
    console.log('QUERY RESULT', result)
    if (err) return next({
      status: 500,
      message: "Error in userController.getUser."
    });
    res.locals.user = result.rows;
    res.locals.mood = req.body.mood;
    return next();
  });
};

userController.saveMood = function (request, response, next) {
  var moodAndUserID = [response.locals.thismood, response.locals.user[0].user_id];
  console.log('MOOD AND USER ID', response.locals)
  var saveMoodQuery = "INSERT INTO moods (mood, user_id)\n    VALUES ($1, $2);";
  database.query(saveMoodQuery, moodAndUserID, function (error, result) {
    if (error) return next({
      status: 500,
      message: "Error in userController.saveMood."
    });
    return next();
  });
};

userController.checkMood = function (request, response, next) {
  var thisuserID = [response.locals.user[0].user_id];
  var checkMoodQuery = "SELECT mood, date FROM \"public\".\"moods\" where user_id = $1 and date > current_date - 3;";
  database.query(checkMoodQuery, thisuserID, function (error, result) {
    console.log(result.rows);
    if (error) return next({
      status: 500,
      message: "Error in userController.checkMood."
    });

    if (result.rows[0].mood === "unwell" && result.rows[1].mood === "unwell" && result.rows[2].mood === "unwell") {
      return response.status(400).json({
        moodStatus: false,
        message: "This person is NOT OK."
      });
    }

    return next();
  });
};

module.exports = userController;