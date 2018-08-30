const express = require('express')
const app = express()
var session = require('express-session')
var pg = require('pg')
var http = require('http').Server(app);
var io = require('socket.io')(http);


// bodyParser is required to get POST request data
const bodyParser = require('body-parser')

module.exports = function(app) {

  var http = require('http').Server(app);
  var io = require('socket.io')(http);

  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(session({
      secret: '123',
      resave: true,
      saveUninitialized: true
  }));



  app.get('/chat-admin-talk', function (req, res) {    
    if(req.session.user){
      var room = req.query.room;
      console.log("FROM chat-admin-talk-ROUTE: room = " + room)
      //the chat-client.pug template will insert the room to create/connect to
      return res.render('chat-admin-talk',{login: "Login", room: room});
    } else {
      res.redirect('/');
    }
  })

 

}
