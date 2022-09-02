// const session = require('express-session');
const mysql = require('mysql');


//connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,

});

// Display admin dash page
exports.adminDash = (req, res) => {
    session = req.session;
    //connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected as ID ' + connection.threadId);

        //User the connection
        connection.query('SELECT * FROM users WHERE id = ?', [session.userid], (err, logineduser, field) => {

            //when done with the connection,release it
            connection.release();
            if (!err && logineduser.length > 0) {
                res.render('admin', { loginPage: true, logineduser });
            }

        });
    });
}


// Display admin dash page
exports.userList = (req, res) => {
    session = req.session;
    // connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected as ID ' + connection.threadId);

        //User the connection
        connection.query('SELECT * FROM users WHERE id = ?', [session.userid], (err, logineduser, field) => {

            //when done with the connection,release it

            if (!err && logineduser.length > 0) {
                connection.query('SELECT * FROM users WHERE status = "active" ORDER BY id', (err, usersRow, field) => {
                    res.render('userlist', { loginPage: true, logineduser, usersRow });

                });

                connection.release();

            }

        });
    });
}

// Display adduser form
exports.adduserform = (req, res) => {
    session = req.session;
    // connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected as ID ' + connection.threadId);

        //User the connection
        connection.query('SELECT * FROM users WHERE id = ?', [session.userid], (err, logineduser, field) => {

            //when done with the connection,release it
            connection.release();

            if (!err && logineduser.length > 0) {
                res.render('adduser', { loginPage: true, logineduser });
            }
        });
    });
}

// Add user
exports.adduser = (req, res) => {
    session = req.session;
    const { firstname, lastname, email, role, password, cpassword } = req.body;
    if (password != cpassword) {
            loginedUser(session, function(logineduser){
                res.render('adduser', { loginPage: true, alertcolor : 'danger', alert: 'Password not matching', logineduser });
            });
    } else {
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected as ID ' + connection.threadId);

            //User the connection
            connection.query('INSERT INTO users SET first_name = ?, last_name = ?, email = ?, password = ?, role = ?', [firstname, lastname, email, password, role], (err, row) => {

                //when done with the connection,release it
                connection.release();
                loginedUser(session, function(logineduser){
                    if (!err) {
                        res.render('adduser', { loginPage: true, alertcolor: 'success', alert: 'User added succefully.', logineduser });
                    } else {
                        res.render('adduser', { loginPage: true, alertcolor: 'danger', alert: 'Check your details.', logineduser });
                    }
                });
            });
        });
    }
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
exports.updateuserform = (req, res) =>{
    session = req.session;
    loginedUser(session, function(logineduser){
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected as ID ' + connection.threadId);
            connection.query('SELECT * FROM users WHERE id = ?',[req.params.id], (err, rows, field) => {
                //when done with the connection,release it
                connection.release();
                if (!err && rows.length > 0) {
                    res.render('updateuser', { loginPage: true, logineduser, rows});
                }
            });
        });
    });
}

exports.updateuser = (req, res) => {
    session = req.session;
    const { firstname, lastname, email, role, password, cpassword } = req.body;
    loginedUser(session, function(logineduser){
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected as ID ' + connection.threadId);
            connection.query('UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ?, role = ? WHERE id = ?', [firstname, lastname, email, password, role, req.params.id], (err, rows) => {
                //when done with the connection,release it
                connection.release();
                if (!err) {
                    res.render('updateuser', { loginPage: true, logineduser, alertcolor: 'success', alert: 'User '+firstname+' Updated succefully.', closeform: true, logineduser});
                }else{
                    res.render('updateuser', { loginPage: true, logineduser, alertcolor: 'danger', alert: 'Check your details.', closeform: true, logineduser});
                }
            });
        });
    });
}

exports.viewuser = (req, res) =>{
    session = req.session;
    loginedUser(session, function(logineduser){
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected as ID ' + connection.threadId);
            connection.query('SELECT * FROM users WHERE id = ?',[req.params.id], (err, rows, field) => {
                //when done with the connection,release it
                connection.release();
                if (!err && rows.length > 0) {
                    res.render('viewuser', { loginPage: true, logineduser, rows});
                }
            });
        });
    });
}

exports.deleteuser = (req, res) =>{
    session = req.session;
    loginedUser(session, function(logineduser){
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected as ID ' + connection.threadId);
            connection.query('UPDATE users SET status =? WHERE id = ?',['inactive',req.params.id], (err, rows, field) => {
                //when done with the connection,release it
                connection.release();
                if (!err) {
                    res.render('userlist', { loginPage: true, logineduser, alertcolor: 'success', alert:'User Removed succefully.'});
                }
            });
        });
    });
}

// Display admin dash page
exports.templatelist = (req, res) => {
    session = req.session;
    loginedUser(session, function(logineduser){
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected as ID ' + connection.threadId);
            connection.query('SELECT * FROM template_main ORDER BY id', (err, templateRow, field) => {
                //when done with the connection,release it
                connection.release();
                if (!err) {
                    res.render('templatelist', { loginPage: true, logineduser, templateRow});
                }
            });
        });
    });
}