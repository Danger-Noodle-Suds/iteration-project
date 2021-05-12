/* 
this script handles CRUD functionality for user schema for sign-up, login, authentication
*/ 

const database = require('../models/userModels');
const bcrypt = require('bcrypt');

const userController = {};

// finds a user by email and compares the password with bcrypt
// user row is saved to res.locals.user
userController.verifyUser = (request, response, next) => {
  const body = request.body;
  const email = [body.email];
  const findUserQuery = `SELECT * FROM users
                         WHERE email = $1;`;
  database.query(findUserQuery, email, (error, result) => {
    if (error) return next({ status: 500, message: 'Error in userController.verifyUser.' });
    if (result.rows.length === 0) {
      return response.status(400).json({ userVerified: false, message: 'User not found. Please check email.' });
    }
    bcrypt.compare(body.password, result.rows[0].password, (error, isMatched) => {
      if (isMatched === false) {
        return response.status(400).json({ userVerified: false, message: 'Password incorrect.' });
      }
      response.locals.user = result.rows;
      console.log(result.rows);
      return next();
    });
  });
};

// creates a user row with bcrypted password
// TODO does not seem to have collision handling for an already created user?
userController.createUser = async (request, response, next) => {
  const body = request.body;
  console.log('body in createUser', body);
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(body.password, saltRounds);
  console.log('hashedPassword in createUser', hashedPassword);
  const userInformation = [
    body.firstName,
    body.age,
    body.email,
    hashedPassword,
    body.addiction,
    body.emergencyContactName,
    body.emergencyContactPhone
  ];
  const createUserQuery = `INSERT INTO users (firstName, age, email, 
                           password, addiction, emergencyContactName, 
                           emergencyContactPhone)
                           VALUES ($1, $2, $3, $4, $5, $6, $7);`;
  console.log('userInfo', userInformation);
  database.query(createUserQuery, userInformation, (error, result) => {
    if (error) return next({ message: error.message });
    return next();
  });
};

// find a user by email
// sets the user row onto res.locals.user
userController.getUserID = (request, response, next) => {
  const body = request.body;
  const email = [body.email];
  console.log(email);
  const getUserIDQuery = `SELECT * FROM users
                          WHERE email = $1;`;
  database.query(getUserIDQuery, email, (error, result) => {
    if (error) return next({ status: 500, message: 'Error in userController.getUserID.' });
    response.locals.user = result.rows;
    response.locals.thismood = body.mood;
    return next();
  });
}

module.exports = userController;