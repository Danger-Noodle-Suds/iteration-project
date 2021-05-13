/* 
this script handles the CRUD functionality relating to mood history and check-in history
*/ 
const db = require('../models/userModels');

const historyController = {};

// gets the _id from res.locals.user[0]
// finds mood rows (with date) by user_id 
// sets the mood rows onto locals.moodHistory
// ultimately the route using this function returns the moodHistory in the res object
historyController.getMoodHistory = (req, res, next) => {
    const queryParams = [res.locals.user._id];
    const queryString = `SELECT mood, date FROM "public"."moods" where user_id = $1`;
    db.query(queryString, queryParams, (err, result) => {
      if (err) return next({ status: 500, message: 'Error in historyController.getMoodHistory.' });
      res.locals.moodHistory = result.rows;
      return next();
    });
  };

// updates the users list to set the lastLoginDate to today for the current user
// gets the current user based on the userId in locals
historyController.updateLastLoginDate = (req, res, next) => {    
    const queryParams = [res.locals.user._id];
    const queryString = `UPDATE users
                         SET lastLoginDate = current_date
                         WHERE _id = $1;`
    db.query(queryString, queryParams, (err, result) => {
      if (err) return next({ status: 500, message: 'Error in historyController.updateLastLoginDate.' });
      return next();
    });
};

// inserts a new value into the moods table
// this req will need an "email" and a "mood" attached to the body to function
historyController.saveMood = (req, res, next) => {
    const queryParams = [res.locals.mood, res.locals.user._id]
    const dbQuery = `INSERT INTO moods (mood, date, user_id)
                     VALUES ($1, current_date, $2);`;
    db.query(dbQuery, queryParams, (error, result) => {
        if (error) return next({ status: 500, message: 'Error in historyController.saveMood.' });
        return next();
    });
};

// ! not currently hooked up to anything
// tests recent mood to see if there were three consecutive 'unwell' days
// if so, sends a res that indicates the person is not doing well
historyController.checkMood = (req, res, next) => {
    const queryParams = [res.locals.user._id];
    const queryString = `SELECT mood, date FROM "public"."moods" where user_id = $1 and date > current_date - 3;`;
    db.query(queryString, queryParams, (error, result) => {
        if (error) return next({ status: 500, message: 'Error in historyController.checkMood.' });
        if (
            result.rows[0].mood === "unwell" 
            && result.rows[1].mood === "unwell" 
            && result.rows[2].mood === "unwell" ) {
                return res.status(400).json({ moodStatus: false, message: 'This person is NOT OK.' });
        }
        return next();
    });
};

module.exports = historyController;