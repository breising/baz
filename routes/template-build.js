const express = require('express')
const app = express()
var session = require('express-session')
var pg = require('pg')

// Scheduling basics:
/*
Store each event in an object protoype ScheduleEvent
  - has a 'start' and 'end' property.
  - has a scheduling code
  - has doctor time: 'start' and 'end'

*/

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

  app.get('/template-build', function (req, res) {


    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client
      // get the list of chairs from the db
      dbClient.query('SELECT * from chair;' , function (err, result) {
        if (err) {
          console.log("Error saving data to table block." + err)
        }
        if(result) {
          var chairs = []
          //copy results.rows to an array
          for(x in result.rows) {
            chairs.push(result.rows[x])
          }
          
          dbClient.query('SELECT * from block', function (err, result) {
              if (err) {
                console.log("Error getting data from table block." + err)
              } // if(error)

              if(result) {
                //call function to pass info into it
                //console.log(result.rows[0]);
                var blocks = result.rows; 
              } // if result

              dbClient.query('SELECT * from template', function (err, result) {
                if (err) {
                  console.log("Error getting data from table template." + err)
                } // if(error)
                if(result) {
                  //call function to pass info into it
                  //console.log("The templates are:" + result.rows[1].id);
                  var templates = result.rows;
                  //var id = result.rows[0].id;

                  return res.render('template-build.pug', {chairs: chairs, message: message, login: "Logout", blocks:blocks, templates:templates})
                } // if result
              }) //dbClient
          }) //dbClient
        }  // if result
      }) // dbClient
    }) // pool.connect
  })// app.get
}