 const port = process.env.PORT || 8080;

var express = require('express');
var path = require('path');

var createError = require('http-errors');

var flash = require('express-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var mysql = require('mysql');


var conn  = require('./lib/db');
//routes
var homeRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var adminRouter = require('./routes/admin');
var changeStatRouter = require ('./routes/changeStat')

var app = express();


// Setup the Views Templating Engine
 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'ejs');
 

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(express.static('public'));
 app.use('/css', express.static(__dirname + 'public/css'));

 //Session Settings
 app.use(cookieParser());
 app.use(session({ 
     secret: 'secREt$#code$%3245',
     resave: false,
     saveUninitialized: true,
     cookie: { maxAge: 100000 }
 }))
 

 app.use(flash());
 
 app.use('/login', loginRouter);
 app.use('/admin', adminRouter);
 app.use('/changeStat', changeStatRouter)
 app.use('/', homeRouter);


 app.listen(port, () => console.log(`Listening on port ${port}..`));

 module.exports = app;