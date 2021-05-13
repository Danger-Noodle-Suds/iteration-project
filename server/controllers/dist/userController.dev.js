"use strict";

/* 
this script handles CRUD functionality for user schema for sign-up, login, authentication
*/
var db = require("../models/userModels");

var bcrypt = require("bcrypt");

var userController = {
  // finds a user by email and compares the password with bcrypt
  // user row is saved to res.locals.user
  verifyUser: function verifyUser(req, res, next) {
    var queryParams, queryString, values;
    return regeneratorRuntime.async(function verifyUser$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            queryParams = [req.body.email];
            queryString = "SELECT * FROM users\n                        WHERE email = $1;";
            _context.next = 4;
            return regeneratorRuntime.awrap(db.query(queryString, queryParams, function (err, result) {
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
            }));

          case 4:
            values = _context.sent;

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  // creates a user row with bcrypted password
  // TODO does not seem to have collision handling for an already created user?
  createUser: function createUser(req, res, next) {
    var SALT_FACTOR, hashedPassword, queryParams, queryString, result;
    return regeneratorRuntime.async(function createUser$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            SALT_FACTOR = 10;
            _context2.next = 4;
            return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, SALT_FACTOR));

          case 4:
            hashedPassword = _context2.sent;
            queryParams = [req.body.firstName, req.body.lastName, req.body.userNumber, req.body.email, hashedPassword, req.body.contactName, req.body.contactNumber];
            console.log('QUERY PARAMS', queryParams);
            queryString = "INSERT INTO users (firstName, lastName, userNumber, email, \n                          password, contactname, \n                          contactnumber)\n                          VALUES ($1, $2, $3, $4, $5, $6, $7);";
            _context2.next = 10;
            return regeneratorRuntime.awrap(db.query(queryString, queryParams));

          case 10:
            result = _context2.sent;
            console.log(result);
            return _context2.abrupt("return", next());

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            return _context2.abrupt("return", next({
              status: 500,
              message: 'Error in historyController.updateLastLoginDate.'
            }));

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 15]]);
  },
  // find a user by email
  // sets the user row onto res.locals.user
  getUser: function getUser(req, res, next) {
    var queryParams, queryString, result;
    return regeneratorRuntime.async(function getUser$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            console.log(req.body.email);
            queryParams = [req.body.email];
            queryString = "SELECT * FROM users\n                          WHERE email = $1;";
            _context3.next = 6;
            return regeneratorRuntime.awrap(db.query(queryString, queryParams));

          case 6:
            result = _context3.sent;
            res.locals.user = result.rows;
            res.locals.mood = req.body.mood;
            return _context3.abrupt("return", next());

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            return _context3.abrupt("return", next({
              status: 500,
              message: 'Error in historyController.updateLastLoginDate.'
            }));

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 12]]);
  },
  saveMood: function saveMood(req, res, next) {
    var moodAndUserID, saveMoodQuery;
    return regeneratorRuntime.async(function saveMood$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            moodAndUserID = [res.locals.thismood, res.locals.user[0].user_id];
            saveMoodQuery = "INSERT INTO moods (mood, user_id)\n        VALUES ($1, $2);";
            _context4.next = 5;
            return regeneratorRuntime.awrap(db.query(saveMoodQuery, moodAndUserID));

          case 5:
            res.locals.save = _context4.sent;
            return _context4.abrupt("return", next());

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            return _context4.abrupt("return", next({
              status: 500,
              message: 'Error in historyController.updateLastLoginDate.'
            }));

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 9]]);
  },
  checkMood: function checkMood(req, res, next) {
    var thisuserID, checkMoodQuery;
    return regeneratorRuntime.async(function checkMood$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            thisuserID = [res.locals.user[0].user_id];
            checkMoodQuery = "SELECT mood, date FROM \"public\".\"moods\" where user_id = $1 and date > current_date - 3;";
            _context5.next = 5;
            return regeneratorRuntime.awrap(db.query(checkMoodQuery, thisuserID));

          case 5:
            res.locals.check = _context5.sent;
            console.log(res.locals.check.rows);

            if (!error) {
              _context5.next = 9;
              break;
            }

            return _context5.abrupt("return", next({
              status: 500,
              message: "Error in userController.checkMood."
            }));

          case 9:
            if (!(res.locals.check.rows[0].mood === 1 && res.locals.check.rows[1].mood === 1 && res.locals.check.rows[2].mood === 1)) {
              _context5.next = 11;
              break;
            }

            return _context5.abrupt("return", res.status(400).json({
              moodStatus: false,
              message: "This person is NOT OK."
            }));

          case 11:
            return _context5.abrupt("return", next());

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](0);
            console.log(_context5.t0);
            return _context5.abrupt("return", next({
              status: 500,
              message: 'Error in historyController.updateLastLoginDate.'
            }));

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[0, 14]]);
  }
};
module.exports = userController;