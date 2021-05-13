/* 
this script handles the CRUD functionality of sessions for login and authentication purposes
*/ 

require('dotenv').config(); 
const db = require('../models/userModels');
const jwt = require('json-web-token');

const sessionController = {};

// confirm the client has a jwt cookie and that the signature is valid
// if not, redirect them to the login page
sessionController.verifySession = (req, res, next) => {
  
};

/* 

SQL Session Table: 

CREATE TABLE sessions 
    (_id serial, 
    user_id INT, 
    jwt VARCHAR(1000), 
    timeCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (_id), 
    FOREIGN KEY (user_id) REFERENCES users(_id));
*/ 


// after client login, create and save a session to db
// create a cookie that has a signed jwt as its value;
sessionController.startSession = (req, res, next) => {
    // first, check to see if a session already exists for this user and is not expired
    
    const queryString = `SELECT * FROM sessions WHERE user_id=$1`;
    const queryParams = [res.locals.user._id]; 
    console.log("at startSession, query Params: ", queryParams);
    db.query(queryString, queryParams, (err, results) => {
        if (err) return next(err);
        console.log(results.rows);
        console.log(res.locals.user);
        return next(); 
    });
};

module.exports = sessionController;