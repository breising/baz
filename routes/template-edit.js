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

  var message = ""

  app.get('/template-edit', function (req, res) {

    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client

      dbClient.query('SELECT * from day', function (err, result) {
        if (err) {
          console.log("Error getting data from table day." + err)
        } // if(error)

        if(result) {
          //call function to pass info into it
          //console.log(result.rows[0]);
          var days = result.rows;

          return res.render('template-edit.pug', {message: message, login: "Logout", days: days} );
          
        } // if(result)
      }) // dbClient 
    }) // pool.connect
  })// app.get
} // module.exports
