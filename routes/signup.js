const bodyParser = require('body-parser')
var session = require('express-session')
var pg = require('pg')
var format = require('pg-format')
//bcrypt stuff below
var bcrypt = require('bcrypt');
const saltRounds = 10;
const someOtherPlaintextPassword = 'not_bacon';


module.exports = function(app) {

  app.use(session({
      secret: '123',
      resave: true,
      saveUninitialized: true
  }));

  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('/signup', function (req, res) {
    res.render('signup', {login: "Login"});
  })

  app.post('/signup', function (req, res) {
    // get data from the form
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var alias = "none";

    // setup/test the database connection
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


    if( !email || !password || !password2 ){
      res.render("signup", {message: "Please complete all fields."});
    }

    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      myClient = client
      //check if email already exists
      myClient.query('SELECT * from youser WHERE email = $1', [email], function (err, result) {
        if (err) {
          console.log(err)
        }
        if (result.rows[0] > 0) {
            // email already exists
            return res.render('signup', message="The user already exists.")
        } else if(password !== password2){
            return res.render('signup', message="Passwords must match.")
        } else {
            req.session.user = email;
            req.session.admin = true;
            }
        //bcrypt password before saving in db
        bcrypt.hash(password, saltRounds, function(err, hash) {
          // Store hash in your password DB. 
          console.log(hash)
          myClient.query('INSERT INTO youser("email","password","alias") VALUES($1,$2,$3);', [email, hash, alias]), 
            function (err, result) {
                if (err) {
                  console.log(err)
                }
                console.log(result)
            }
        });
        var message = "Welcome " + req.session.user;
        return res.redirect("/main", 302, {message: message, login: "Logout"});
        }
      )
    })
    })
}
