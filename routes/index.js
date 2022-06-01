var express = require('express');
var conn  = require('../lib/db');
var router = express.Router();
router.get('/', (req, res, next) =>{
        let sql = "SELECT * FROM library_management.books WHERE available ='yes' ";       
        conn.query(sql,(err,rows)=>{
          if(err) throw err
            res.render('index',{
                books : rows,
                title : "Library Home-Page"
            });
        })    

})



router.post('/index/select', (req, res, next) =>{
    var cat = req.body.cat
    if(cat=="all"){
        let sql = "SELECT * FROM  library_management.books";
        conn.query(sql,(err,rows)=>{
          if(err) throw err
            res.render('index',{
                books : rows,
                title : "Library Home-Page"
            });
        })    
    }
    else{
        
    let sql = `SELECT * FROM  library_management.books WHERE category LIKE '%${cat}%'`;
    conn.query(sql,(err,rows)=>{
        if(err) throw err
            res.render('index',{
                books : rows,
                title : "Library Home-Page"
            });
        })

    }
})

router.post('/index/borrowed/:id',(req, res, next)=>{
    var today = new Date(Date.now());
    let data={
        students_id: req.body.sID,
        books_id: req.body.id,
        rental_date: today,
    }

    
    let studentCheck =`SELECT * FROM students WHERE id = '${req.body.sID}'`;
    conn.query(studentCheck, (err, results)=>{
        if(results[0].number_borrowed <2){


            let pendingCheck = `SELECT * FROM books WHERE id = '${req.body.id}'`
            conn.query(pendingCheck,(err, results)=>{
    
                if(results[0].available =='yes'){

                    let sqlQuery = "INSERT INTO rentals SET ?";
                    conn.query(sqlQuery, data, (err, results)=>{
                        if(err) throw err;

                        let updateBook = `UPDATE books SET available = 'pending' WHERE books.id = '${req.body.id}'`;
                        conn.query(updateBook, data, (err, results)=>{
                            if(err) throw err;

                            let updateBook = `UPDATE students SET number_borrowed = number_borrowed + 1 WHERE students.id = '${req.body.sID}'`;
                            conn.query(updateBook, data, (err, results)=>{
                                    if(err) throw err;
                                    res.redirect('/');
                            })    
                        })
                    }) 
                }
                else{
                    req.flash('error', 'The book you request to borrow is either being borrowed or has been requested');
                    res.redirect('/');
                }
            })
        }
        else{
            req.flash('error', 'Maximum number of rentals allowed reached');
            res.redirect('/');
        }
    
    })
})

router.get('/login', (req,res)=>{
    res.render('login');
});


module.exports = router;