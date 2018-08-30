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

  var message = ""

  app.get('/schedule', function (req, res) {
    if(req.session.user) {//&& (req.session.patientid) {
      //This is PATIENT SELF SCHEDULING
      // TITLE: Choose a day between these dates

      
      // Select a day or select an existing appointment

      // select a code

      // list existing appointments for the patient: click on an appointment from the list to cancel or edit.


      //

      return res.render('schedule.pug', {message: message, login: "Logout"} );
    } else {
      return res.render('schedule.pug', {message: message, login: "Login"} );
    }
  })
}
