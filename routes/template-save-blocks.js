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

  app.post('/template-save-blocks', function (req, res, next) {
    //let err = new Error(`${req.ip} tried to access /template-save`); // Sets error message, includes the requester's ip address!
    //err.statusCode = 403;
    //next(err);
    //get query strings
    // var name = req.query.name;
    // var description = req.query.description;
    var block = req.body;
    console.log("JSON from Client = " + JSON.stringify(block));// shows data

    var blockid = Number(block.block_id);
    var templateid = Number(block.template_id);
    var starttime = Number(block.start_time);
    var chair = Number(block.chair_id);
    var color = String(block.color);

    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client

      dbClient.query('INSERT INTO templateblock ("blockid","templateid","starttime","chair","color") VALUES($1,$2,$3,$4,$5);',[blockid,templateid,starttime,chair,color] , function (err, result) {
        if (err) {
          console.log("Error saving templateBlock " + err);
          //res.
        }
        if(result) {
          console.log("Success saving a templateBlock")
          res.sendStatus(200);
        } //...if 1st

      }) //...dbClient

    }) //...pool.connect
  }) //...app.post

// CREATE TABLE templateblock (
//   id SERIAL PRIMARY KEY,
//   blockid INTEGER REFERENCES block,
//   templateid INTEGER REFERENCES template,
//   startTime INTEGER,
//   chair INTEGER REFERENCES chair
// );
} // module.exports

