const express = require('express');
const exhbs = require('express-handlebars');
const bodyParser = require('body-parser');
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const mysql = require('mysql');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.urlencoded({ extended: false}));

app.use(bodyParser.json());

app.use(express.static('public'));

app.engine('hbs', exhbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

//connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER, 
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME,

});

pool.getConnection((err, connection) =>{
    if(err) throw err;
    console.log('Connected as ID '+ connection.threadId);
});

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;
//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: true
}));
// cookie parser middleware
app.use(cookieParser());



const adminroutes = require('./server/routes/admin');
app.use('/', adminroutes);

const tutorroutes = require('./server/routes/tutor');
app.use('/', tutorroutes);

const userroutes = require('./server/routes/user');
app.use('/', userroutes);

app.listen(port, () => console.log(`Listening on port ${port}`));