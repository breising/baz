const express = require('express')
const app = express()
var session = require('express-session')
var pg = require('pg')
var pool = require('../routes/connectToDb')
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

  app.get('/main', function (req, res) {
    console.log(req.session.patient);
    if(req.session.patient){
      console.log(req.session.patient)
    }
    // get query string
    if(req.query.message){
      var message = req.query.message
    }
    if(req.query.login){
      var login = req.query.login;
    }
    var message = "Welcome " + req.session.user;

    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      if(req.session.user){
        // get inventory data from server db
        client.query('SELECT * from item;', function (err, result) {
            if (err) {
              console.log("Error from client getting inventory from server db" + err)
            }
            if(result){
              //console.log(result.rows)
              var inventory = result.rows

              if(Array.isArray(inventory)){
                return res.render('main', {message: message, login: "Logout",inventory: inventory})
              } else {
                console.log("Inventory is not an array: Error reading DB.")
              }
            }
        })

        //return res.render('main', {message: message, login: "Logout"} );
      } else {
        var message = "Please login."
        res.render('main', {message: message, login: "Login"} );
      }
          
    }) // pool
    
  }) // GET

  //app.use(bodyParser.urlencoded({ extended: false }));

  app.post('/main', function (req, res) {
    console.log("POST on server working:...")

    var quantity = req.query.quantity
    var id = 1
     
    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      if(req.session.user){
        var id = 1
        // get inventory data from server db
        client.query('UPDATE item SET quantity = quantity - 1 WHERE id = $1;', [id] ,function (err, result) {
            if (err) {
              console.log("Error updating item.quantity:" + err)
            }
            if(result){
              //var inventory = ['asdfaf','asdfadsf']
              //return inventory
              //res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
              //return res.end('It worked!');
            }
        }) // client.query

        client.query('SELECT * from item;', function (err, result) {
            if (err) {
              console.log("Error from client getting inventory from server db" + err)
            }
            if(result){
              console.log(result.rows)
              //return the array of objects as JSON
              return res.json(result.rows)
            }
        }) // client.query

        //return res.render('main', {message: message, login: "Logout"} );
      } else {
        var message = "Please login."
        var inventory = []
        return res.render('main', {message: message, login: "Login", inventory: inventory} );
      }
          
    }) // pool
   
  })

} //module-exports
