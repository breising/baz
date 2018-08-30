const express = require('express')
const app = express()
var session = require('express-session')
var pg = require('pg')
const bodyParser = require('body-parser')
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
  var dbClient

  app.use(session({
      secret: '123',
      resave: true,
      saveUninitialized: true
  }));

  app.use(bodyParser.urlencoded({ extended: false }));

  app.post('/message', function (req, res) {   
    var roomName = req.query.room 
    console.log("message handler says: room name: " + roomName)


      //get the message data
      var message = req.body.chat;
      // save to the db
      pool.connect(function (err, client, done) {
        if (err) console.log(err)
        dbClient = client

        if(req.session.user){
        // first we need to get the recipient and the author
          //get recipient from the room number
          // get author from session
          var user = req.session.user
          if(req.session.user === "a@") {
            dbClient.query('SELECT id from youser where email = $1', [user], function (err, result) {
                if (err) {
                  console.log("From chatMessage...Error saving message:" + err)
                }
                if(result) {
                  console.log("The result of SELECT is: " + result)
                  var author_id = req.session.user
                  var recipient_id = 2
                }
              }
            )
            var author_id = req.session.user
          } else {
            // var author_id = roomName
            // var recipient_id = req.session.user
          }
        }
        //check if email already exists
        dbClient.query('INSERT INTO message("recipient","author","content") VALUES($1,$2,$3);', [recipient, author, message], function (err, result) {
            if (err) {
              console.log("From chatMessage...Error saving message:" + err)
            }
          }
        )
      })
  })
} 
