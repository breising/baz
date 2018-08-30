const express = require('express')
const app = express()
var pg = require('pg')
const bodyParser = require('body-parser')
var session = require('express-session');
var bcrypt = require('bcrypt');

module.exports = function(app) {

  

  var PGUSER = 'postgres'
  var PGDATABASE = 'baz'

  // check if email already exists in db
  var config = {
    user: PGUSER, // name of the user account
    database: PGDATABASE, // name of the database
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    password: 'bcr0072'
  }

  var pool = new pg.Pool(config)
  var myClient

  app.use(session({
      secret: '123',
      resave: true,
      saveUninitialized: true
  }));

  app.use(bodyParser.urlencoded({ extended: false }));


  app.get("/3D-test", function (req,res) {

    if(!req.session.user) {
      // this is just a testing area so disable the session security
      var message = "Please login."
      return res.render("3D-test", {message: message, login: "Login"})
    } else {
      return res.render("3D-test", {message: message, login: "Login"})
    }
  })

  app.post('/login', function (req, res) {

    var email = req.body.email;
    var password = req.body.password;

    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      myClient = client
      
      //myClient2 = client
      //check if email already exists
      myClient.query('SELECT * from youser WHERE email = $1', [email], 
        function (err, result) {
        if (err) {
          console.log(err)
        }
        if (result.rowCount > 0) {
            // found user
            // next check password
            // get hashed password from db;
            console.log(result.rows[0]);
            var hashed = result.rows[0].password;
            var userid = result.rows[0].id; 

            // First check if it's the admin's and bypass bcrypt if it is:
            if(email === "a@" || email === "b@"){
              if(hashed === "a" || hashed === "b"){
                // then success, create session etc.
                req.session.user = email;
                req.session.userid = userid;
                // give admin only a@
                if(email === "a@"){
                  req.session.admin = true;
                  var message = "Admin Login success"
                  var login = "Logout"
                  return res.redirect("/admin?message=" + message + "&login=" + login);
                } else { // if(email
                  var message = "Login success."
                  return res.redirect("/youserDash?message=" + message + "&login='Logout'");
                }
              } else { // if(hashed
                return res.render("login",{login:"Login", message: "Login failed: wrong password"})
              } 
            } // if(email)
            
            // IF NOT admin, then do the normal bcrypt check
            // check value of hashed password
            bcrypt.compare(password, hashed, function(err, result) {
                if(result){
                  // create session
                  req.session.patient = "12567";
                  req.session.user = email;
                  var message = "Login success"
                  var login = "Logout"
                  return res.redirect("/youserDash?message=" + message + "&login=" + login);
                } else {
                  // No soup for you !
                  return res.render('login', {login:"Login", message: "Login failed."})
                }
            });
        } else {
            // No soup for you !
            return res.render('login', {login: "Login", message:"Login failed."}) 
        }
      }
      )
    })  
})
}