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

  app.get('/admin', function (req, res) {
    // get query string
    if(req.query.message){
      var message = req.query.message
    }
    if(req.query.login){
      var login = req.query.login;
    }
    
    if(req.session.admin){
      var message = "Welcome"
      return res.render('admin', {message: message, login: "Logout"} );
    } else {
      var message = "Please login." 
      res.redirect('/login', 200, {message: message, login: "Login"} );
    }
  })
}
