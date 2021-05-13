/* 
this script handles CRUD functionality for user schema for sign-up, login, authentication
*/

const db = require("../models/userModels");
const bcrypt = require("bcrypt");

const userController = {

// finds a user by email and compares the password with bcrypt
// user row is saved to res.locals.user
  verifyUser: async (req, res, next) => {
    const queryParams = [req.body.email];
    const queryString = `SELECT * FROM users
                        WHERE email = $1;`;
    const values = await db.query(queryString, queryParams, (err, result) => {
      if (err)
        return next({
          status: 500,
          message: "Error in userController.verifyUser.",
        });
      if (result.rows.length === 0) {
        return res
          .status(400)
          .json({
            userVerified: false,
            message: "User not found. Please check email.",
          });
      }
      bcrypt.compare(
        req.body.password,
        result.rows[0].password,
        (err, isMatched) => {
          if (isMatched === false) {
            return res
              .status(400)
              .json({ userVerified: false, message: "Password incorrect." });
          }
          res.locals.user = result.rows;
          return next();
        }
      );
    });
  },

  // creates a user row with bcrypted password
  // TODO does not seem to have collision handling for an already created user?
  createUser: async (req, res, next) => {
    try{
      const SALT_FACTOR = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, SALT_FACTOR);
      const queryParams = [
        req.body.firstName,
        req.body.lastName,
        req.body.userNumber,
        req.body.email,
        hashedPassword,
        req.body.contactName,
        req.body.contactNumber,
      ];
      console.log('QUERY PARAMS',queryParams)
      const queryString = `INSERT INTO users (firstName, lastName, userNumber, email, 
                          password, contactname, 
                          contactnumber)
                          VALUES ($1, $2, $3, $4, $5, $6, $7);`;
      const result = await db.query(queryString, queryParams)
        console.log(result)
        return next();
    } catch (err) {
      console.log(err)
      return next({ status: 500, message: 'Error in historyController.updateLastLoginDate.' })
    }
    
  },

  // find a user by email
  // sets the user row onto res.locals.user
  getUser: async  (req, res, next) => {
    try{
      console.log(req.body.email)
      const queryParams = [req.body.email];
      const queryString = `SELECT * FROM users
                          WHERE email = $1;`;
      const result = await db.query(queryString, queryParams)
        res.locals.user = result.rows;
        res.locals.mood = req.body.mood;
        return next();
    } catch (err) {
      console.log(err)
      return next({ status: 500, message: 'Error in historyController.updateLastLoginDate.' })
    }
    
  },

  saveMood: async (req, res, next) => {
    try{
      const moodAndUserID = [
        res.locals.thismood,
        res.locals.user[0].user_id,
      ];
      const saveMoodQuery = `INSERT INTO moods (mood, user_id)
        VALUES ($1, $2);`;
        res.locals.save = await db.query(saveMoodQuery, moodAndUserID)
        return next();
    } catch (err) {
      console.log(err)
      return next({ status: 500, message: 'Error in historyController.updateLastLoginDate.' })
    }
  },

  checkMood: async (req, res, next) => {
    try{
      const thisuserID = [res.locals.user[0].user_id];
      const checkMoodQuery = `SELECT mood, date FROM "public"."moods" where user_id = $1 and date > current_date - 3;`;
      res.locals.check = await db.query(checkMoodQuery, thisuserID)
      console.log(res.locals.check.rows);
      if (error)
        return next({
          status: 500,
          message: "Error in userController.checkMood.",
        });
      if (
        res.locals.check.rows[0].mood === 1 &&
        res.locals.check.rows[1].mood === 1 &&
        res.locals.check.rows[2].mood === 1
      ) {
        return res
          .status(400)
          .json({ moodStatus: false, message: "This person is NOT OK." });
      }
      return next();
    } catch (err) {
      console.log(err)
      return next({ status: 500, message: 'Error in historyController.updateLastLoginDate.' })
    }
  }
};

module.exports = userController;
