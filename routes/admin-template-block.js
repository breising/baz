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

  app.post('/admin-template-block', function (req, res) {
    // get query string
    var codes = []

    // loop through all query properties
    for(x in req.query){
      // filter out on those containing 'code'
      if(x.slice(0,4) == "code"){
        // get the value of the req.query for that code and push it 
        codes.push(req.query["code" + x.slice(4,15)]);
      }
    }

    //console.log("The codes are: " + codes);

    proc_codes = {'codes': codes};
    // now get other query strings
    var name = req.query.name;
    var description = req.query.description;
    var end_time = req.query.end;
    var start_time = req.query.start;

    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client
      dbClient.query('INSERT INTO block("name","description","start_time","end_time","proc_codes") VALUES($1,$2,$3,$4,$5);',[name,description,start_time,end_time,proc_codes] , function (err, result) {
        if (err) {
          console.log("Error saving data to table block." + err)
        }
        if(result) {
          console.log("admin-template-block ran all the way.")
          res.sendStatus(200)
        } 

      }) // dbClient
    }) // pool.connect
}) // GET
} // module.exports


