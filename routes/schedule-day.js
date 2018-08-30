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

  app.get('./routes/schedule-day', function (req, res) {

    var monthsArray = ["Jan","Feb","Mar","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];

    var year = req.params.year
    var month = req.params.month
    var day = req.params.day

    month = monthsArray[month];

    console.log(year + " " + month + " " + day)

    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client
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
          
          return res.render('schedule-day.pug', {chairs: chairs, message: message, login: "Logout",year: year,month:month,day:day})
        } 
      }) // dbClient
    }) // pool.connect

    //
    })
}