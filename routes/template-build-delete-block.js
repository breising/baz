const express = require('express')
const app = express()
var session = require('express-session')
var pg = require('pg')
const bodyParser = require('body-parser')

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

  app.use(bodyParser.urlencoded({extended: false}));

  app.post('/template-build-delete-block', function (req, res, next) {

    var id = Number(req.query.id);

    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client
      dbClient.query('DELETE from templateblock WHERE id = $1',[id], function (err, result) {
        if (err) {
          console.log("Error Deleting templateBlock " + err);
          //res.
        }
        if(result) {
          res.end();
        }

      }) //...dbClient
    }) //...pool.connect
  }) //...app.post
}


