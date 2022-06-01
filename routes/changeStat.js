var express = require('express');
var conn  = require('../lib/db');
var router = express.Router();


router.get('/:rent_id', (req, res, next) =>{
    if(req.session.loggedin === true){

        let sql = `SELECT stud.f_name AS f_name, stud.l_name AS l_name, stud.id AS sID, b.id AS bID, b.book_cover AS book_cover, b.title AS b_title, b.available AS avail, rent.id AS rent_id, rent.books_id AS rent_bookID, rent.students_id AS r_studID, rent.rental_date AS rent_date, rent.return_date AS return_date, rent.id AS rent_id FROM library_management.students stud, library_management.books b, library_management.rentals rent WHERE stud.id = rent.students_id AND b.id = rent.books_id AND rent.id='${req.params.rent_id}'`;       
        conn.query(sql,(err,rows)=>{
        if(err) throw err
            res.render('changeStat',{
                info : rows[0],
                title : "Library Approve-Book-Page",
            });
    
        })   
    }
    else{
        res.redirect("/login")
    }
}) 

router.post('/update/:rental', (req, res)=>{
    var current_date = new Date(Date.now());
    if(req.session.loggedin === true){

        if(req.body.change_cat=="Returned"){
            let use_s_Table=`SELECT stud.f_name AS f_name, stud.l_name AS l_name, stud.id AS sID, b.id AS bID, b.book_cover AS book_cover, b.title AS b_title, b.available AS avail, rent.id AS rent_id, rent.books_id AS rent_bookID, rent.students_id AS r_studID, rent.rental_date AS rent_date, rent.return_date AS return_date, rent.id AS rent_id FROM library_management.students stud, library_management.books b, library_management.rentals rent WHERE stud.id = rent.students_id AND b.id = rent.books_id AND rent.id='${rental}'`;
            conn.query(use_s_Table,(err,results)=>{
                if(err) throw err;
            
                let sql=`UPDATE rentals SET return_date='${current_date}' WHERE rentals.id='${req.body.check}'`;
                conn.query(sql,(err,row)=>{
                    if(err) throw err;
                    
                    let update_students=`UPDATE students SET number_borrowed = number_borrowed - 1 WHERE students.id = '${req.body.sID}'`;
                    conn.query(update_students,(err,results)=>{
                        if(err) throw err;

                        let book_update=`UPDATE books SET available ="returned" WHERE id ='${req.body.bID}'`
                        conn.query(book_update,(err,row)=>{
                            if(err) throw err;
                            res.redirect('/admin');
                        })
                    })
                })
            })
        }
        else{
            let use_s_Table=`SELECT stud.f_name AS f_name, stud.l_name AS l_name, stud.id AS sID, b.id AS bID, b.book_cover AS book_cover, b.title AS b_title, b.available AS avail, rent.id AS rent_id, rent.books_id AS rent_bookID, rent.students_id AS r_studID, rent.rental_date AS rent_date, rent.return_date AS return_date, rent.id AS rent_id FROM library_management.students stud, library_management.books b, library_management.rentals rent WHERE stud.id = rent.students_id AND b.id = rent.books_id AND rent.id='${rental}'`;
            conn.query(use_s_Table,(err,results)=>{
                if(err) throw err;
        

                let book_update=`UPDATE books SET available ='${req.body.change_cat}' WHERE id ='${req.body.bID}'`
                conn.query(book_update,(err,row)=>{
                    if(err) throw err;
                    res.redirect('/admin');
                })
            })
        }
    }
    
})

module.exports = router;