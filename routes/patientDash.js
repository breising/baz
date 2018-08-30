const express = require('express')
const app = express()
var session = require('express-session')
var pg = require('pg')
const bodyParser = require('body-parser')


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

module.exports = function(app) {

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

  app.use(session({
      secret: '123',
      resave: true,
      saveUninitialized: true
  }));

  app.get('/patientDash', function (req, res) {
    req.session.firstname = req.query.firstname
    req.session.lastname = req.query.lastname
    req.session.dob = req.query.dob
    req.session.patientid = req.query.id

    var title = req.session.firstname + " " + req.session.lastname + " " + req.session.dob;

    return res.render('patientDash', {login: "Logout", title: title, username: req.session.user})
  }) // GET

  app.post('/patientDash', function (req, res) {

  }) // POST
}