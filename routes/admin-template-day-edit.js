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

  app.post('/admin-template-day-edit', function (req, res) {
    var chairArray = [];
    //var chairObj = {}

    for(x in req.query) {
      // query strings are named, chair1, chair2, chair3 etc.
      // find the "chair", slice out the number, create a new object(key:value) and push it to an array for the db.
      if(x.slice(0,5) == "chair"){
        var object = {}
        var key = x.slice(5,15)
        //console.log(req.query["chair" + x.slice(5,15)])
        object[key] = req.query["chair" + x.slice(5,15)]
        chairArray.push(object)
      }
    }
    console.log(chairArray);

    var chairs = {'chairs': chairArray};
    console.log("The chairs of day are: " + chairs.chairs);

    // now get other query strings
    var id = req.query.id;
    var name = req.query.name;
    var description = req.query.description;

    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client
      dbClient.query('UPDATE day SET name=$1, description=$2, chairs=$3 where id=$4;',[name,description,chairs,id] , function (err, result) {
        if (err) {
          console.log("Error UPDATING data to table day." + err)
        }
        if(result) {
          console.log("UPDATED the day!")
          res.sendStatus(200)
        } 

      }) // dbClient
    }) // pool.connect
}) // GET
} // module.exports


