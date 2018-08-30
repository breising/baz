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

  app.post('/admin-template-seq', function (req, res) {
    // get query string
    var myBlocks = []

    for (x=0 ; x < 5 ; x++) {
      var block = "block" + x;
      // console.log(code);
      // console.log(req.query[code]);
      
      if(req.query[block]){
        myBlocks.push(req.query[block]);
      }
    }

    blocks = {'blocks': myBlocks};
    // now get other query strings
    var name = req.query.name;
    var description = req.query.description;

    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client
      dbClient.query('INSERT INTO sequence ("name","description","blocks") VALUES($1,$2,$3);',[name,description,blocks] , function (err, result) {
        if (err) {
          console.log("Error saving data to table sequence." + err)
        }
        if(result) {
          console.log("Did it The sequence!")
          res.sendStatus(200)
        } 

      }) // dbClient
    }) // pool.connect
}) // GET
} // module.exports


