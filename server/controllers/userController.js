/* 
this script handles CRUD functionality for user schema for sign-up, login, authentication
*/

const db = require("../models/userModels");
const bcrypt = require("bcrypt");

const userController = {};

// finds a user by email and compares the password with bcrypt
// user row is saved to res.locals.user
userController.verifyUser = (req, res, next) => {
  const queryParams = [req.body.email];
  const queryString = `SELECT * FROM users
                       WHERE email = $1;`;
  db.query(queryString, queryParams, (err, result) => {
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
};

// creates a user row with bcrypted password
// TODO does not seem to have collision handling for an already created user?
userController.createUser = async (req, res, next) => {
  const SALT_FACTOR = 10;
  console.log('REQ BODY', req.body)
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
  db.query(queryString, queryParams, (err, result) => {
    console.log(result)
    if (err) return next({ message: err.message });
    return next();
  });
};

// find a user by email
// sets the user row onto res.locals.user
userController.getUser = (req, res, next) => {
  console.log(req.body.email)
  const queryParams = [req.body.email];
  const queryString = `SELECT * FROM users
                       WHERE email = $1;`;
  db.query(queryString, queryParams, (err, result) => {
    if (err)
      return next({ status: 500, message: "Error in userController.getUser." });
    res.locals.user = result.rows;
    console.log(res.locals.user)
    res.locals.mood = req.body.mood;
    return next();
  });
};

userController.saveMood = (request, response, next) => {
  const moodAndUserID = [
    response.locals.thismood,
    response.locals.user[0].user_id,
  ];
  const saveMoodQuery = `INSERT INTO moods (mood, user_id)
    VALUES ($1, $2);`;
  database.query(saveMoodQuery, moodAndUserID, (error, result) => {
    if (error)
      return next({
        status: 500,
        message: "Error in userController.saveMood.",
      });
    return next();
  });
};

userController.checkMood = (request, response, next) => {
  const thisuserID = [response.locals.user[0].user_id];
  const checkMoodQuery = `SELECT mood, date FROM "public"."moods" where user_id = $1 and date > current_date - 3;`;
  database.query(checkMoodQuery, thisuserID, (error, result) => {
    console.log(result.rows);
    if (error)
      return next({
        status: 500,
        message: "Error in userController.checkMood.",
      });
    if (
      result.rows[0].mood === "unwell" &&
      result.rows[1].mood === "unwell" &&
      result.rows[2].mood === "unwell"
    ) {
      return response
        .status(400)
        .json({ moodStatus: false, message: "This person is NOT OK." });
    }
    return next();
  });
};

module.exports = userController;
