/* 
this script handles the CRUD functionality relating to mood history and check-in history
*/ 
const db = require('../models/userModels');

const historyController = {

// updates the users list to set the lastLoginDate to today for the current user
// gets the current user based on the userId in locals
 updateLastLoginDateasync: async (req, res, next) => {
   try{
    const userId = [res.locals.user[0]._id];
    const updateLastLoginDateQuery = `UPDATE users
                                      SET lastLoginDate = current_date
                                      WHERE _id = $1;`
     res.locals.update = await db.query(updateLastLoginDateQuery, userId)
     return next();
    } catch (err) {
      console.log(err)
      return next({ status: 500, message: 'Error in historyController.updateLastLoginDate.' })
    }
  },
// gets the _id from res.locals.user[0]
// finds mood rows (with date) by user_id 
// sets the mood rows onto locals.moodHistory
// ultimately the route using this function returns the moodHistory in the res object
 getMoodHistory: async  (req, res, next) => {
    try{
      const queryParams = [res.locals.user[0]._id];
      const queryString = `SELECT mood, date FROM "public"."moods" where user_id = $1`;
      res.locals.moodHistory = await db.query(queryString, queryParams)
      return next();
    } catch (err) {
      console.log(err)
      return next({ status: 500, message: 'Error in historyController.getMoodHistory.' })
    }
  },

// updates the users list to set the lastLoginDate to today for the current user
// gets the current user based on the userId in locals
 updateLastLoginDate: async  (req, res, next) => { 
   
    try{
      const queryParams = [res.locals.user[0]._id];
      const queryString = `UPDATE users
                           SET lastLoginDate = current_date
                           WHERE _id = $1;`
      res.locals.update = await db.query(queryString, queryParams)
      return next();
    } catch (err) {
    console.log(err)
    return next({ status: 500, message: 'Error in historyController.updateLastLoginDate.' })
    }   
  },

// inserts a new value into the moods table
// this req will need an "email" and a "mood" attached to the body to function
  saveMood: async (req, res, next) => {
    try{
      const queryParams = [res.locals.mood, res.locals.user[0]._id]
      const dbQuery = `INSERT INTO moods (mood, date, user_id)
                       VALUES ($1, current_date, $2);`;
      db.query(dbQuery, queryParams, (error, result) => {
          if (error) return next({ status: 500, message: 'Error in historyController.saveMood.' });
          return next();
      });
    } catch (err) {
      console.log(err)
      return next({ status: 500, message: 'Error in historyController.updateLastLoginDate.' })
    }
    
  },



// ! not currently hooked up to anything
// tests recent mood to see if there were three consecutive 'unwell' days
// if so, sends a res that indicates the person is not doing well
  checkMood: async (req, res, next) => {
    const queryParams = [res.locals.user[0]._id];
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
  },

  getJournalHistory: async (req, res, next) => {
    try{
      const userId = [res.locals.user[0]._id];
      const journalHistoryQuery = `SELECT journal, date FROM "public"."journals" where user_id = $1`;
      result = db.query(journalHistoryQuery, userId)
      res.locals.userJournalHistory = result.rows;
      return next();
    } catch (err) {
      console.log(err)
      return next({ status: 500, message: 'Error in historyController.updateLastLoginDate.' })
    }
  },

// inserts a new value into the journals table
// based on the current routing and middleware, this request will need an "email" 
// and a "journal" attached to the body to function as expected
  saveJournal: async (req, res, next) => {
    // const date = new Date().toISOString().slice(0, 10); // should be '0001-01-01' format
    try{
      const queryParams = [res.locals.thisjournal, res.locals.user[0]._id]
      const dbQuery = `INSERT INTO journals (journal, date, user_id)
                            VALUES ($1, current_date, $2);`;
      res.locals.save = await db.query(dbQuery, queryParams)
      return next();
    } catch (err) {
      console.log(err)
      return next({ status: 500, message: 'Error in historyController.updateLastLoginDate.' })
    }
  }
};

module.exports = historyController;