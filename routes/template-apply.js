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

  app.get('/template-apply', function (req, res) {
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

              dbClient.query('SELECT * from day', function (err, result) {
                if (err) {
                  console.log("Error getting data from table day." + err)
                } // if(error)

                if(result) {
                  //call function to pass info into it
                  //console.log(result.rows[0]);
                  var days = result.rows;

                  return res.render('schedule-day.pug', {message: message, login: "Logout", blocks:blocks, chairs:chairs, days:days});

                } // if(result)  day
              }) // dbClient  day
            }
          })
        } // if(result)...block
      }) // dbClient (2)
    }) // pool.connect
  }) // GET
} // module.exports
