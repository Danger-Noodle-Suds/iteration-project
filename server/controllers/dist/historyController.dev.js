"use strict";

/* 
this script handles the CRUD functionality relating to mood history and check-in history
*/
var db = require('../models/userModels');

var historyController = {
  // updates the users list to set the lastLoginDate to today for the current user
  // gets the current user based on the userId in locals
  updateLastLoginDateasync: function updateLastLoginDateasync(req, res, next) {
    var userId, updateLastLoginDateQuery;
    return regeneratorRuntime.async(function updateLastLoginDateasync$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            userId = [res.locals.user[0]._id];
            updateLastLoginDateQuery = "UPDATE users\n                                      SET lastLoginDate = current_date\n                                      WHERE _id = $1;";
            _context.next = 5;
            return regeneratorRuntime.awrap(db.query(updateLastLoginDateQuery, userId));

          case 5:
            res.locals.update = _context.sent;
            return _context.abrupt("return", next());

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            return _context.abrupt("return", next({
              status: 500,
              message: 'Error in historyController.updateLastLoginDate.'
            }));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 9]]);
  },
  // gets the _id from res.locals.user[0]
  // finds mood rows (with date) by user_id 
  // sets the mood rows onto locals.moodHistory
  // ultimately the route using this function returns the moodHistory in the res object
  getMoodHistory: function getMoodHistory(req, res, next) {
    var queryParams, queryString;
    return regeneratorRuntime.async(function getMoodHistory$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            queryParams = [res.locals.user[0]._id];
            queryString = "SELECT mood, date FROM \"public\".\"moods\" where user_id = $1";
            _context2.next = 5;
            return regeneratorRuntime.awrap(db.query(queryString, queryParams));

          case 5:
            res.locals.moodHistory = _context2.sent;
            return _context2.abrupt("return", next());

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);
            return _context2.abrupt("return", next({
              status: 500,
              message: 'Error in historyController.getMoodHistory.'
            }));

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 9]]);
  },
  // updates the users list to set the lastLoginDate to today for the current user
  // gets the current user based on the userId in locals
  updateLastLoginDate: function updateLastLoginDate(req, res, next) {
    var queryParams, queryString;
    return regeneratorRuntime.async(function updateLastLoginDate$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            queryParams = [res.locals.user[0]._id];
            queryString = "UPDATE users\n                           SET lastLoginDate = current_date\n                           WHERE _id = $1;";
            _context3.next = 5;
            return regeneratorRuntime.awrap(db.query(queryString, queryParams));

          case 5:
            res.locals.update = _context3.sent;
            return _context3.abrupt("return", next());

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0);
            return _context3.abrupt("return", next({
              status: 500,
              message: 'Error in historyController.updateLastLoginDate.'
            }));

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 9]]);
  },
  // inserts a new value into the moods table
  // this req will need an "email" and a "mood" attached to the body to function
  saveMood: function saveMood(req, res, next) {
    var queryParams, dbQuery;
    return regeneratorRuntime.async(function saveMood$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            queryParams = [res.locals.mood, res.locals.user[0]._id];
            dbQuery = "INSERT INTO moods (mood, date, user_id)\n                       VALUES ($1, current_date, $2);";
            db.query(dbQuery, queryParams, function (error, result) {
              if (error) return next({
                status: 500,
                message: 'Error in historyController.saveMood.'
              });
              return next();
            });
            _context4.next = 10;
            break;

          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](0);
            console.log(_context4.t0);
            return _context4.abrupt("return", next({
              status: 500,
              message: 'Error in historyController.updateLastLoginDate.'
            }));

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 6]]);
  },
  // ! not currently hooked up to anything
  // tests recent mood to see if there were three consecutive 'unwell' days
  // if so, sends a res that indicates the person is not doing well
  checkMood: function checkMood(req, res, next) {
    var queryParams, queryString;
    return regeneratorRuntime.async(function checkMood$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            queryParams = [res.locals.user[0]._id];
            queryString = "SELECT mood, date FROM \"public\".\"moods\" where user_id = $1 and date > current_date - 3;";
            db.query(queryString, queryParams, function (error, result) {
              if (error) return next({
                status: 500,
                message: 'Error in historyController.checkMood.'
              });

              if (result.rows[0].mood === "unwell" && result.rows[1].mood === "unwell" && result.rows[2].mood === "unwell") {
                return res.status(400).json({
                  moodStatus: false,
                  message: 'This person is NOT OK.'
                });
              }

              return next();
            });

          case 3:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  getJournalHistory: function getJournalHistory(req, res, next) {
    var userId, journalHistoryQuery;
    return regeneratorRuntime.async(function getJournalHistory$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            userId = [res.locals.user[0]._id];
            journalHistoryQuery = "SELECT journal, date FROM \"public\".\"journals\" where user_id = $1";
            result = db.query(journalHistoryQuery, userId);
            res.locals.userJournalHistory = result.rows;
            return _context6.abrupt("return", next());

          case 8:
            _context6.prev = 8;
            _context6.t0 = _context6["catch"](0);
            console.log(_context6.t0);
            return _context6.abrupt("return", next({
              status: 500,
              message: 'Error in historyController.updateLastLoginDate.'
            }));

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[0, 8]]);
  },
  // inserts a new value into the journals table
  // based on the current routing and middleware, this request will need an "email" 
  // and a "journal" attached to the body to function as expected
  saveJournal: function saveJournal(req, res, next) {
    var queryParams, dbQuery;
    return regeneratorRuntime.async(function saveJournal$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            queryParams = [res.locals.thisjournal, res.locals.user[0]._id];
            dbQuery = "INSERT INTO journals (journal, date, user_id)\n                            VALUES ($1, current_date, $2);";
            _context7.next = 5;
            return regeneratorRuntime.awrap(db.query(dbQuery, queryParams));

          case 5:
            res.locals.save = _context7.sent;
            return _context7.abrupt("return", next());

          case 9:
            _context7.prev = 9;
            _context7.t0 = _context7["catch"](0);
            console.log(_context7.t0);
            return _context7.abrupt("return", next({
              status: 500,
              message: 'Error in historyController.updateLastLoginDate.'
            }));

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    }, null, null, [[0, 9]]);
  }
};
module.exports = historyController;