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

  app.get('/alias', function (req, res) {    
    if(req.session.user){
      return res.render('chat');
    } else {
      res.redirect('/');
    }
  })

  app.post('/alias', function (req, res) {
    // authenticate
    if(!req.session.user){return res.render('/')};
    // get data from the form
    var alias = req.body.alias;
    var email = req.session.user;

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

    if( !alias || !email ){
      res.render("chat", {message: "Error in chat.js line 45 ish"});
    }

    pool.connect(function (err, client, done) {
        if (err) console.log(err)
        myClient = client
        myClient.query('UPDATE youser SET alias = $1 WHERE email = $2', [alias, email], function(){
            if (err) {console.log(err)} else {console.log("Success chge db") };
          }
        )
        return res.redirect("/chat")
    })
  })
}
