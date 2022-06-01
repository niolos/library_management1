var express = require('express');
var conn  = require('../lib/db');
var router = express.Router();


router.get('/', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('login', {
        title: 'Login',
        email: '',
        password: ''    
    })
})

router.post('/checkLogin', function(req, res, next) { 

        conn.query(`SELECT * FROM librarians WHERE username = "${req.body.user}" AND BINARY password = "${req.body.pass}"`, function(err, rows, fields) {
        console.log(rows.length);
        if (rows.length <= 0) {
            req.flash('error', 'Invalid credentials Please try again!')
            res.redirect('/login')
        }
        else {              
            req.session.loggedin = true;
            req.session.f_name = rows[0].f_name;
            req.session.l_name = rows[0].l_name;
            req.session.user = rows[0].username;
            req.session.password = rows[0].password;
            res.redirect('/admin');

        }            
    })
  
})

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
  });
module.exports = router;