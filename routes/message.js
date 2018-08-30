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
    // get the chat room name from the query string
    var roomName = req.query.room 
    console.log("message handler says: room name: " + roomName)

    for(var x in req.body) {
      var message = x
    }
    console.log("GOT IT NOW: " + message)
    //get the message data to save in db
    // var message = req.body.chat;
    // console.log("The message is: " + message);

    // var content = req.query.chat;
    // console.log("The content is: " + content)

      
    // save to the db
    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client
      // authenticate
      if(req.session.user){
      // first we need to get the recipient and the author
        //get recipient from the room number
        // author is ALWAYS the session user
        // create objects to IDs to prevent scope access issues.
        if(req.session.user === "a@"){
          var author = req.session.user
          var recipient = roomName
        } else {
          var author = roomName
          var recipient = req.session.user
        }
        //Parameters are the results of the two DB queries below
        var curry1 = function(author) {
          console.log("CurryFirst" + author)
          return function(recipient) {
            console.log("CurrySecond!!" + recipient)
            dbClient.query('INSERT INTO message("recipient","author","content") VALUES($1,$2,$3);', [recipient, author, message], function (err, result) {
              if (err) {
                console.log("From chatMessage...Error saving message:" + err)
              }
              if(result){
                console.log(message)
                console.log(result.rows[0])
              }
            }
            )
          }
        }
        // get the IDs of the author and the recipient
        //First DB query ***********************************
        dbClient.query('SELECT id from youser where email = $1', [author], function (err, result) {
            if (err) {
              console.log("From chatMessage...Error saving message:" + err)
            }
            if(result) {
              // above returns   {id: 1}
              var curry2 = curry1(result.rows[0].id)
              console.log("Message handler says, the author_id is: " + result.rows[0].id)
              //Second DB query ****************************************
              dbClient.query('SELECT id from youser where email = $1', [recipient], function (err, result) {
                  if (err) {
                    console.log("From chatMessage...Error saving message:" + err)
                  }
                  if(result) {
                    try {
                    console.log(result.rows[0].id);
                    curry2(result.rows[0].id)
                    console.log("Recipient id is: " + result.rows[0].id)
                    }
                    catch(err) {
                      console.log(err);
                      // above returns   {id: 1}
                    }
                  } // if(result)
                } // DB Second callback
              )//End Second DB
            } // if(result)
          } // DB First callback
        )// End First DB
      } // if(req.session.user)
    }) // pool.connect
  }) // End app.post
} // module.exports
