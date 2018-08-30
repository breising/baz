const express = require('express')
const app = express()
var session = require('express-session')
var pg = require('pg')


module.exports = function(app) {

  app.use(session({
      secret: '123',
      resave: true,
      saveUninitialized: true
  }));

  var PGUSER = 'postgres'
  var PGDATABASE = 'baz'

  var config = {
  user: PGUSER, // name of the user account
  database: PGDATABASE, // name of the database
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  password: 'bcr0072'
  }

  var pool = new pg.Pool(config)
  var dbClient = ''

  app.get('/admin-template-react', function (req, res) {
    // get query string
    if(req.query.message){
      var message = req.query.message
    }
    if(req.query.login){
      var login = req.query.login;
    }

    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client
      dbClient.query('SELECT * from code', function (err, result) {
        if (err) {
          console.log("Error getting chairs." + err)
        }
        if(result) {
          var codes = result.rows;
          if(true) {//req.session.admin){
            var message = ""
            


            dbClient.query('SELECT * from block', function (err, result) {
              if (err) {
                console.log("Error getting data from table block." + err)
              } // if(error)

              if(result) {
                //call function to pass info into it
                //console.log(result.rows[0]);
                var blocks = result.rows;

                

                dbClient.query('SELECT * from chair', function (err, result) {
                  if (err) {
                    console.log("Error getting data from table block." + err)
                  } // if(error)

                  if(result) {
                    //call function to pass info into it
                    //console.log(result.rows[0]);
                    var chairs = result.rows;



                    dbClient.query('SELECT * from sequence', function (err, result) {
                      if (err) {
                        console.log("Error getting data from table block." + err)
                      } // if(error)

                      if(result) {
                        //call function to pass info into it
                        //console.log(result.rows[0]);
                        var sequence = result.rows;





                        dbClient.query('SELECT * from day', function (err, result) {
                          if (err) {
                            console.log("Error getting data from table day." + err)
                          } // if(error)

                          if(result) {
                            //call function to pass info into it
                            //console.log(result.rows[0]);
                            var days = result.rows;

                            return res.render('admin-template-react.pug', {message: message, login: "Logout", codes: codes, blocks: blocks, blocks2: JSON.stringify(blocks), chairs: chairs, sequence: sequence, sequences2: JSON.stringify(sequence), days: days, days2: JSON.stringify(days)} );
                            
                          } // if(result)
                        }) // dbClient (5)







                        
                      } // if(result)
                    }) // dbClient (4)



                    
                  } // if(result)
                }) // dbClient (3)



              } // if(result)
            }) // dbClient (2)




          } else {
            var message = "Please login." 
            res.redirect('/login', 200, {message: message, login: "Login"} );
          } // else

        } // if(reult)


      }) // dbClient (1)
    }) // pool.connect
}) // GET
} // module.exports
