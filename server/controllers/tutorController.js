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
    loginedUser(session, function(logineduser){
        logineduser[0].activeTab = 1;
        res.render('tutor', { loginPage: true, logineduser });
    });
 }


 function loginedUser(session, callback){
    // connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected as ID ' + connection.threadId);
        //User the connection
        connection.query('SELECT * FROM users WHERE id = ?',[session.userid], (err, rows, field) => {
            //when done with the connection,release it
            connection.release();
            if (!err && rows.length > 0) {
                callback(rows);
            }
        });
    });
}