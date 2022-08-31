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
    pool.getConnection((err, connection)=>{
        if(err) throw err; // not connected
        console.log('Connected as ID '+ connection.threadId);

        //User the connection
        connection.query('SELECT * FROM users WHERE id = ?',[session.userid],(err, rows, field)=>{

            //when done with the connection,release it
            connection.release();
            if(!err && rows.length>0){
                res.render('admin', { loginPage: true , rows});
            }

        });
    });
}


// Display admin dash page
exports.userList = (req, res) => {
    session = req.session;
    // connect to DB
    pool.getConnection((err, connection)=>{
        if(err) throw err; // not connected
        console.log('Connected as ID '+ connection.threadId);

        //User the connection
        connection.query('SELECT * FROM users WHERE id = ?',[session.userid],(err, rows, field)=>{

            //when done with the connection,release it
            
            if(!err && rows.length>0){
                connection.query('SELECT * FROM users ORDER BY id',(err, usersRow, field)=>{
                    console.log(usersRow);
                    res.render('userlist', { loginPage: true, rows, usersRow});
                    
                });

                connection.release();
                
            }

        });
    });
}

exports.adduserform = (req, res) => {
    session = req.session;
    // connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected as ID ' + connection.threadId);

        //User the connection
        connection.query('SELECT * FROM users WHERE id = ?', [session.userid], (err, rows, field) => {

            //when done with the connection,release it
            connection.release();

            if (!err && rows.length > 0) {
                res.render('adduser', { loginPage: true, rows });
            }
        });
    });
}

exports.adduser = (req, res) => {
    const {firstname, lastname, email, role, password, cpassword} = req.body;
    console.log(firstname)
    // connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected as ID ' + connection.threadId);

        //User the connection
        connection.query('INSERT INTO users SET first_name = ?, last_name = ?, email = ?, password = ?, role = ?',[firstname, lastname, email, password, role], (err, rows) => {

            //when done with the connection,release it
            connection.release();

            if (!err) {
                res.render('adduser', { loginPage: true, alert:'User added succefully.' });
            }else{
                res.render('adduser', { loginPage: true, alert:'Check your details.' });
            }
        });
    });
}
