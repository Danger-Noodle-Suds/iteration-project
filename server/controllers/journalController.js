/* 
controller for journal entries CRUD functionality
*/ 
const db = require('../models/userModels');

const journalController = {};

// gets and sends all journal entries in the response as well as saving to res.locals 
journalController.getJournals = (req, res, next) => {
    const queryParams = [req.body._id];
    const queryText = `SELECT * FROM journals WHERE user_id=$1`;
    db.query(queryText, queryParams, (err, results) => {
        if (err) return next(err);
        if (!results.rows.length) return next({message: 'no journal entries found'});
        res.locals.journalEntries = results.rows;
        return next();
    });
}

// find the user id by email and save a journal entry
journalController.saveJournal = (req, res, next) => {
    const queryParams = [req.body.entry, req.body.email];
    const queryText = `INSERT INTO journals (entry , user_id ) 
                       SELECT $1, _id
                       FROM users 
                       WHERE email=$2`;
    db.query(queryTest, queryParams, (err, results) => {
        if (err) return next(err); 
        console.log(results.rows);
        return next();
    });

}