const mysql = require('mysql');

//connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER, 
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME,

});

  // Display login page
  exports.index = (req, res) => {
    session = req.session;
    if(session.userid && session.role != ''){
      res.redirect('/'+session.role);
    }else{
      res.render('login', {loginPage: false} );
    }

 }

 exports.loginValidate = (req, res) => {
    const {email, password} = req.body;
    session = req.session;
    let store = {};
    //connect to DB
    pool.getConnection((err, connection)=>{
        if(err) throw err; // not connected
        console.log('Connected as ID '+ connection.threadId);

        //User the connection
        connection.query('SELECT * FROM users WHERE email = ? AND password = ?',[email, password],(err, rows, field)=>{

            //when done with the connection,release it
            connection.release();
            if (email === '') {
                res.send({ 'success': false, 'message': 'email required' });
              } else if (password === '') {
                res.send({ 'success': false, 'message': 'password required' });
              } else if (rows.length > 0) {
                 //fetch client session
                session.userid = rows[0].id;//set userid in client session
                session.role = rows[0].role;
                session.first_tname = rows[0].first_name;    
                session.last_name = rows[0].last_name;    
                connection.query("SELECT role FROM users WHERE email=? ", [email], function (err, row, field) {
                  if (rows[0].role == 'admin') {
                    res.redirect('/admin');
                    //console.log({ 'success': true, 'role': row[0].role, 'user': rows[0].id});
                  } else if (rows[0].role == 'tutor') {
                    res.redirect('/tutor');
                    //console.log({ 'success': true, 'role': row[0].role, 'user': rows[0].id});
                  } else if (rows[0].role == 'candidate') {
                    res.redirect('/candidate');
                    //console.log({ 'success': true, 'role': row[0].role, 'user': rows[0].id});
                  }
                }); 
              }else{
                    res.render('login', {userNotFound : 'Check your Credintials.'});
              }
        });
    });
 }

 // Display login page
exports.candidateDash = (req, res) => {
    res.render('candidate', {loginPage: false} );
}

  // Display login page
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}