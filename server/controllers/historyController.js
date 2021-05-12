/* 
this script handles the CRUD functionality relating to mood history and check-in history
*/ 
const database = require('../models/userModels');

const historyController = {};

// gets the _id from res.locals.user[0]
// finds mood row (with date) by user_id 
// sets the mood rows onto locals.userMoodHistory
// ultimately this route returns the userMoodHistory in the response object
historyController.getMoodHistory = (request, response, next) => {
    const userId = [response.locals.user[0]._id];
    const moodHistoryQuery = `SELECT mood, date FROM "public"."moods" where user_id = $1`;
    database.query(moodHistoryQuery, userId, (error, result) => {
      if (error) return next({ status: 500, message: 'Error in historyController.getMoodHistory.' });
      response.locals.userMoodHistory = result.rows;
      return next();
    });
  };

// updates the users list to set the lastLoginDate to today for the current user
// gets the current user based on the userId in locals
historyController.updateLastLoginDate = (request, response, next) => {    
    const userId = [response.locals.user[0]._id];
    const updateLastLoginDateQuery = `UPDATE users
                                      SET lastLoginDate = current_date
                                      WHERE _id = $1;`
    database.query(updateLastLoginDateQuery, userId, (error, result) => {
      if (error) return next({ status: 500, message: 'Error in historyController.updateLastLoginDate.' });
      return next();
    });
};

// inserts a new value into the moods table
// based on the current routing and middleware, this request will need an "email" 
// and a "mood" attached to the body to function as expected
historyController.saveMood = (request, response, next) => {
    // const date = new Date().toISOString().slice(0, 10); // should be '0001-01-01' format
    const queryParams = [response.locals.thismood, response.locals.user[0]._id]
    const dbQuery = `INSERT INTO moods (mood, date, user_id)
                            VALUES ($1, current_date, $2);`;
    database.query(dbQuery, queryParams, (error, result) => {
        if (error) return next({ status: 500, message: 'Error in historyController.saveMood.' });
        return next();
    });
};

// ! not currently hooked up to anything
// looks at the last three moods based on date 
// it tests the resulting rows to see if there were three consecutive 'unwell' days
// it sends a response that indicates the person is not doing well
historyController.checkMood = (request, response, next) => {
    const thisuserID = [response.locals.user[0]._id];
    const checkMoodQuery = `SELECT mood, date FROM "public"."moods" where user_id = $1 and date > current_date - 3;`;
    database.query(checkMoodQuery, thisuserID, (error, result) => {
        console.log(result.rows);
        if (error) return next({ status: 500, message: 'Error in historyController.checkMood.' });
        if (
            result.rows[0].mood === "unwell" 
            && result.rows[1].mood === "unwell" 
            && result.rows[2].mood === "unwell" ) {
                return response.status(400).json({ moodStatus: false, message: 'This person is NOT OK.' });
        }
        return next();
    });
};

module.exports = historyController;