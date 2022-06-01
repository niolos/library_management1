var express = require('express');
var conn  = require('../lib/db');
var router = express.Router();

router.get('/', (req, res, next) =>{
    if(req.session.loggedin === true){

        let sql = "SELECT stud.f_name AS f_name, stud.l_name AS l_name, stud.id AS sID, b.id AS bID, b.title AS b_title, b.available AS avail, rent.id AS rent_id, rent.books_id AS rent_bookID, rent.students_id AS r_studID, rent.rental_date AS rent_date, rent.return_date AS return_date, rent.id AS rent_id FROM library_management.students stud, library_management.books b, library_management.rentals rent WHERE stud.id = rent.students_id AND b.id = rent.books_id";       
        // let timeDifference = Math.abs(returnD - rentD);
        
        conn.query(sql,(err,rows)=>{
            if(err) throw err

        rows.forEach(row => {
            
            row.timePass = new Date(row.rent_date).getTime()/ (1000 * 3600 * 24);
            row.returncheck = new Date(row.return_date).getTime()/ (1000 * 3600 * 24);
            row.checkDiff = row.returncheck - row.timePass;
        });

            res.render('admin',{
                info : rows,
                title : "Library Admin-Page",

            });
        }); 
    }
    else{
        res.redirect('/login')
    };   

});


// var today = new Date();
// var date = new Date();
// var duedate = new Date(date.setDate(today.getDate() + 14))
// var amount = duedate - today;



module.exports = router;