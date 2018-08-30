const express = require('express')
const app = express()
var session = require('express-session')
var pg = require('pg')
var http = require('http').Server(app);
var io = require('socket.io')(http);

module.exports = function(app) {

  app.use(session({
      secret: '123',
      resave: true,
      saveUninitialized: true
  }));


  app.get('/chat', function (req, res) {    
    if(req.session.user){
      //console.log(req.session.user);
      var room = req.session.user;
      //the chat-client.pug template will insert the room to create/connect to
      return res.render('chat',{login: "Logout", room: room});
    } else {
      res.redirect('/');
    }
  })
}
