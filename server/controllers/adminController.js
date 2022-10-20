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
    loginedUser(session, function(logineduser){
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected as ID ' + connection.threadId);
            connection.query('SELECT A.user_id,A.template_id,B.first_name,B.last_name,C.template FROM assigned_list A INNER JOIN users B ON A.user_id = B.id JOIN template_main C ON A.template_id = C.id WHERE FROM_UNIXTIME(date,"%Y-%m-%d") = CURDATE();', (err, todayUsers, field) => {
            //     //when done with the connection,release it
                
                connection.query('SELECT A.user_id,A.template_id,B.first_name,B.last_name,C.template FROM assigned_list A INNER JOIN users B ON A.user_id = B.id JOIN template_main C ON A.template_id = C.id WHERE date >= UNIX_TIMESTAMP(CURDATE() + INTERVAL 1 DAY);', (err, upcomingUsers, field) => {
                connection.release();
                logineduser[0].activeTab = 1;
                if (!err) {
                    res.render('admin', { loginPage: true, logineduser, todayUsers, upcomingUsers});
                }
                });
            });
        });
    });
}


// Display admin dash page
exports.userList = (req, res) => {
    session = req.session;
    if(req.query.assigned == 1){ //For assigned succfull msg in userlist page
        alertcolor = 'success';
        alert = 'Assigned succefully.';
    }else{
        alertcolor = '';
        alert = '';
    }
    // connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected as ID ' + connection.threadId);

        //User the connection
        connection.query('SELECT * FROM users WHERE id = ?', [session.userid], (err, logineduser, field) => {

            //when done with the connection,release it

            if (!err && logineduser.length > 0) {
                connection.query('SELECT * FROM users WHERE status = "active" ORDER BY id', (err, usersRow, field) => {
                    let assignedlist = new Array;
                    // console.log(assigned)
                    listSkills(function(skilllist){ //for displaying skill list in the assign popup
                        //for displaying assigned skillset in userlist
                        usersRow.forEach(element => {   
                            assigned = element.template_assigned.toString().split('/');
                            assigned.forEach(assignedskills =>{
                                if(assignedskills != ''){
                                    assignedlist.push(skilllist[assignedskills-1].template);
                                }
                            })
                            element.template_assigned = assignedlist;
                            assignedlist = [];
                        });
                        logineduser[0].activeTab = 2;
                        //for displaying assigned skillset in userlist
                        res.render('userlist', { loginPage: true, logineduser, alertcolor, alert, skilllist, usersRow});
                    }) 
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
            connection.query('SELECT * FROM users WHERE id = ?',[req.params.id], (err, usersRow, field) => {
                //when done with the connection,release it
                connection.release();
                let assignedlist = new Array;
                if (!err && usersRow.length > 0) {
                //for displaying assigned skillset in viewuser
                listSkills(function(skilllist){ //for selecting assigned skillset
                    usersRow.forEach(element => {   
                        assigned = element.template_assigned.toString().split('/');
                        assigned.forEach(assignedskills =>{
                            if(assignedskills != ''){
                                assignedlist.push(skilllist[assignedskills-1].template);
                            }
                        })
                        element.template_assigned = assignedlist;
                        assignedlist = [];
                    });
                    res.render('viewuser', { loginPage: true, logineduser, usersRow});
                })
                    
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
                logineduser[0].activeTab = 2;
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
                logineduser[0].activeTab = 3;
                if (!err) {
                    res.render('templatelist', { loginPage: true, logineduser, templateRow});
                }
            });
        });
    });
}

// Display admin dash page
exports.addtemplate = (req, res) => {
    session = req.session;
    const {template} =req.body;
    loginedUser(session, function (logineduser) {
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            console.log('Connected as ID ' + connection.threadId);
            connection.query('INSERT INTO template_main SET template = ?',[template], (err, result, field) => {
                //when done with the connection,release it
                connection.release();
                if (!err) {
                    res.render('addtemplate', { loginPage: true, logineduser, templateID: result.insertId});
                }else{
                    console.log(err);
                }
            });
        });
        
    });
}
// Display admin dash page
exports.addtemplatedisplay = (req, res) => {
    session = req.session;
    loginedUser(session, function (logineduser) {
        res.render('addtemplate', { loginPage: true, logineduser});     
        
    });
}
//add skill set
exports.addskills = (req, res) =>{      //need to fix empty data entry
    session = req.session;
    const { templateID } = req.body ; //fetch skill id
    delete req.body.templateID ; //remove skill id
    //create query from re.body
    req.body = JSON.parse(JSON.stringify(req.body));
    let query = 'INSERT INTO `template_lists` (`id`,`list_items`,`description`,`template_id`) VALUES'; 
    for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          let value = req.body[key];
          value = value.toString().split(',');
          value = value[0]+"','"+value[1];
          query+="(NULL,'"+value+"',"+templateID+"),"
          
        }
    }
    query = query.slice(0, -1); // remove `,` at the end of the string
    loginedUser(session, function (logineduser) {
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            connection.query(query, (err, result, field) => {
                //when done with the connection,release it
                connection.release();
                if (!err) {
                    res.render('addtemplate', { loginPage: true, logineduser, alertcolor: 'success', alert:'Skill Added succefully.'});
                }else{
                    console.log(err);
                }
            });
        });        
    });
}

exports.viewskills = (req, res) =>{
    session = req.session;
    loginedUser(session, function (logineduser) {

        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            connection.query('SELECT * FROM template_main WHERE id = ?',[req.params.id], (err, main, field) => {

                if (!err) {
                    connection.query('SELECT * FROM template_lists WHERE template_id = ?',[req.params.id], (err, list, field) => {
                    //when done with the connection,release it
                    connection.release();
                        res.render('viewskills', { loginPage: true, logineduser, main, list });
                    });  
                }else{
                    console.log(err);
                }
            });
        });       
        
    });
}


//add skill set
exports.updateskillsform = (req, res) =>{      //need to fix empty data entry
    session = req.session;
    loginedUser(session, function (logineduser) {
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            connection.query('SELECT * FROM template_main WHERE id = ?',[req.params.id], (err, main, field) => {
                if (!err) {
                    connection.query('SELECT * FROM template_lists WHERE template_id = ?',[req.params.id], (err, list, field) => {
                    //when done with the connection,release it
                    connection.release();
                        res.render('updateskills', { loginPage: true, logineduser, main, list, templateID : req.params.id });
                    });  
                }else{
                    console.log(err);
                }
            });
        });       
        
    });
}

//add skill set
exports.updateskills = (req, res) =>{      //need to fix empty data entry
    session = req.session;
    let templateID  = req.params.id ;
    req.body = JSON.parse(JSON.stringify(req.body));
    let query = 'INSERT INTO `template_lists` (`id`,`list_items`,`description`,`template_id`) VALUES'; 
    for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          let value = req.body[key];
          value = value.toString().split(',');
          if(value[0] == ''){
            value[0] = 'NULL';
          }
          value = value[0]+",'"+value[1]+"','"+value[2];
          query+="("+value+"',"+templateID+"),"
          
        }
    }
    query = query.slice(0, -1)+"ON DUPLICATE KEY UPDATE id = VALUES(id), list_items = VALUES(list_items), description = VALUES(description), template_id = VALUES(template_id)";
    loginedUser(session, function (logineduser) {
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            connection.query(query, (err, field) => {
                if(!err){
                    connection.query('SELECT * FROM template_main WHERE id = ?',[req.params.id], (err, main, field) => {

                        if (!err) {
                            connection.query('SELECT * FROM template_lists WHERE template_id = ?',[req.params.id], (err, list, field) => {
                            //when done with the connection,release it
                            connection.release();
                                res.render('viewskills', { loginPage: true, logineduser, main, list, alertcolor: 'success', alert:'Skills updated succefully.'});
                            });  
                        }else{
                            console.log(err);
                        }
                    });
                }else{
                    res.render('viewskills', { loginPage: true, logineduser, alertcolor: 'danger', alert:'Update Failed!'});
                }
                
            });
        });       
    });
}

//fetch main skillset list
function listSkills(callback){
    // connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected
        console.log('Connected as ID ' + connection.threadId);
        //User the connection
        connection.query('SELECT * FROM template_main WHERE status = "active"', (err, rows, field) => {
            //when done with the connection,release it
            connection.release();
            if (!err && rows.length > 0) {
                callback(rows);
            }
        });
    });
}

exports.assignskill = (req, res) =>{
    session = req.session;
    loginedUser(session, function (logineduser) {
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected
            connection.query('SELECT template_assigned FROM users WHERE id = ?',[req.params.id], (err, assigned, field) => {
                assigned = assigned[0].template_assigned.toString().split('/');
                let assignedlist='',alreadyassigned;
                assigned.forEach(element => {
                    assignedlist+= element+'/';
                    if(element == req.body.skill){
                        alreadyassigned = true;
                    }
                });
                if(!alreadyassigned){
                    assignedlist+= req.body.skill;
                }else{
                    assignedlist = assignedlist.slice(0, -1)
                }
                connection.query('UPDATE users SET template_assigned = ? WHERE id = ?',[assignedlist,req.params.id], (err, main, field) => {
                    connection.query('INSERT INTO assigned_list SET user_id = ?, template_id = ?, date = ?',[req.params.id,req.body.skill,req.body.date], (err, main, field) => {
                    });

                    if (!err) {
                        //when done with the connection,release it
                        connection.release();
                        res.redirect('/admin/userlist/?assigned=1');
                    }else{
                        res.redirect('/admin/userlist/?assigned=0');
                    }
                });
            });
        });       
        
    });
}

exports.skillaction = (req, res) =>{
    session = req.session;

    loginedUser(session, function (logineduser) {

        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            connection.query('SELECT * FROM template_main WHERE template = ?',[req.params.skillset], (err, main, field) => {

                if (!err) {
                    connection.query('SELECT * FROM template_lists WHERE template_id = ?',[main[0].id], (err, list, field) => {
                    //when done with the connection,release it
                    connection.release();
                        res.render('skillsactionview', { loginPage: true, logineduser, main, list, userid : req.params.id });
                    });  
                }else{
                    console.log(err);
                }
            });
        });       
        
    });
}

exports.skillactioninsert = (req, res) => {
    session = req.session;
    const { list } = req.body;
    loginedUser(session, function (logineduser) {

        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            connection.query('SELECT * FROM skill_action WHERE user_id = ?', [req.params.id], (err, currenttry, field) => {
                if (!err) {
                    i = 1;
                    while (i <= currenttry[0].try_count) {  // update try_count
                        try_ = 'try_' + i;
                        i++;
                        
                        if (currenttry[0][try_].includes(req.params.skillset + '-')) {
                            couloumn_new = 'try_' + i;
                        } else {
                            couloumn_new = try_;break;
                        }
                    }

                    try_count = couloumn_new.replace('try_','');
                    if(try_count > currenttry[0].try_count){
                        subquery = ", try_count = "+ try_count;
                    }else{
                        subquery = '';
                    }

                    let query_insert = "UPDATE skill_action SET " + couloumn_new + " = concat(" + couloumn_new + ", '/" + req.params.skillset + "-" + list + "') "+ subquery + " WHERE user_id = " + req.params.id;
                    query_add_coloumn = '';
 
                    if (!(couloumn_new in currenttry[0])) {
                        query_add_coloumn = "ALTER TABLE skill_action ADD " + couloumn_new + " varchar(255) DEFAULT '' AFTER try_"+(i-1);
                        connection.query(query_add_coloumn, (err, list, field) => {
                        });

                    }

                    connection.query(query_insert, (err, list, field) => {
                        //when done with the connection,release it
                        connection.release();
                        res.render('skillsactionview', { loginPage: true, logineduser});
                    });
                } else {
                    console.log(err);
                }
            });
        });

    });
}

exports.resultview = (req, res) =>{
    session = req.session;

    loginedUser(session, function (logineduser) {

        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            // connection.query('SELECT * FROM template_main WHERE template = ?',[req.params.skillset], (err, main, field) => {
                
            //     if (!err) {
            //         connection.query('SELECT * FROM template_lists WHERE template_id = ?',[main[0].id], (err, list, field) => {
            //         //when done with the connection,release it
            //         connection.release();
                        res.render('resultview', { loginPage: true, logineduser });
            //         });  
            //     }else{
            //         console.log(err);
            //     }
            // });
        });       
        
    });
}

exports.selectedsessions = (req, res) =>{
        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            connection.query('SELECT A.user_id,A.template_id,B.first_name,B.last_name,C.template FROM assigned_list A INNER JOIN users B ON A.user_id = B.id JOIN template_main C ON A.template_id = C.id WHERE FROM_UNIXTIME(date ,"%Y-%m-%d") = FROM_UNIXTIME(? ,"%Y-%m-%d");',[req.body.date], (err, main, field) => {
                if (err) {
                    res.json({
                        msg: 'error'
                    });
                } else {
                    res.json({
                        msg: 'success',
                        date: req.body.date,
                        date: main
                    });
                }
            });
        });       
}

exports.calendarview = (req, res) =>{
    session = req.session;

    loginedUser(session, function (logineduser) {

        // connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err; // not connected

            // connection.query('SELECT * FROM template_main WHERE template = ?',[req.params.skillset], (err, main, field) => {
                
            //     if (!err) {
            //         connection.query('SELECT * FROM template_lists WHERE template_id = ?',[main[0].id], (err, list, field) => {
            //         //when done with the connection,release it
            //         connection.release();
                        res.render('calendar', { loginPage: true, logineduser });
            //         });  
            //     }else{
            //         console.log(err);
            //     }
            // });
        });       
        
    });
}
