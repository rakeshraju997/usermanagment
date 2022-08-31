const mysql = require('mysql');

//connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER, 
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME,

});

// Display admin dash page
exports.tutorDash = (req, res) => {
    res.render('tutor', {loginPage: false} );
 }