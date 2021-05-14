/* 
this script handles the CRUD functionality of sessions for login and authentication purposes
*/ 

require('dotenv').config(); 
const db = require('../models/userModels');
const jwt = require('jsonwebtoken');

const sessionController = {};

// confirm the client has a jwt cookie and that the signature is valid
// if not, redirect them to the login page
sessionController.verifySession = (req, res, next) => {
  if (!Object.keys(req.cookies).includes('jwt')) {
      console.log('redirecting?');
      return res.redirect('/');
  }
  jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, returnedJWT) => {
      if (err) return next(err); 
      if (returnedJWT.exp < Date.now()) {
          return res.redirect('/');
      }
      res.locals.verified = true;
      return next(); 
  })
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
sessionController.deleteSession = (req, res, next) => {
    // first, check to see if a session already exists for this user and is not expired
    
    const queryString = `DELETE FROM sessions WHERE user_id=$1`;
    const queryParams = [res.locals.user._id]; 
    console.log("at startSession, query Params: ", queryParams);
    db.query(queryString, queryParams, (err, results) => {
        if (err) return next(err);
        console.log('result.rows = ', results.rows); // the returned session, if one was returned
        // console.log('time created: ', results.rows[0].timecreated);
        // console.log('date now: ', new Date());
        // console.log('time difference in hours: ', (new Date().getTime() - results.rows[0].timecreated.getTime()) / (1000 * 60 * 60));
        return next(); 
    });
};

// creates a jwt signature, saves it to the database as a session, and also adds it to cookies
sessionController.startSession = (req, res, next) => {
    const payload = {
        'ssid': res.locals.user._id,
        'email': res.locals.user.email,
        'iat': Date.now() // 'initiated at' 
    };
    // ! JWT expires after 10 seconds for testing purposes
    const signature = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 10000});
    console.log(signature);
    const queryString = `INSERT INTO sessions (user_id, jwt) VALUES ($1, $2)`; 
    const queryParams = [res.locals.user._id, signature];
    res.cookie('jwt', signature, {httpOnly: true});
    db.query(queryString, queryParams, (err, results) => {
        if (err) return next(err);
        return next();
    });
}

module.exports = sessionController;