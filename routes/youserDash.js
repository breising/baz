const express = require('express')
const app = express()
var session = require('express-session')
var pg = require('pg')
const bodyParser = require('body-parser')


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

  app.use(session({
      secret: '123',
      resave: true,
      saveUninitialized: true
  }));

  app.get('/youserDash', function (req, res) {
    var patientList = []
    var email = req.session.user
    // get the patient list to display on the Dash1 page
    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      if(req.session.user){
        var id = 1
        // get inventory data from server db
        client.query('SELECT * from parent where youserId = $1;', [req.session.userid],function (err, result) {
            if (err) {
              console.log("Error updating item.quantity:" + err)
            }
            if(result){
              // console.log(result.rows)  == the array of patients
              var parentList = result.rows
              //console.log("Parent List: " + parentList)
              parentList.forEach(function(object, index){
                //query db using the patient id
                //console.log("Object: " + object + "Index: " + index)
                client.query('SELECT * from patient where id = $1;', [object.patientid],function (err, result) {
                  if (err) {
                    console.log("Error updating item.quantity:" + err)
                  }
                  if(result){
                    for(x in result.rows[0]) {
                      console.log("FOR: " + x)
                    }
                    //console.log("PatientList: " + result.rows[0].id)
                    patientList.push(result.rows[0])
                    if(index == (parentList.length - 1)) {
                      console.log("Final patientList: " + patientList)
                      return res.render('youserDash', {patientList: patientList,login: "Logout",username: email})
                    }
                  }
                }) // client.query
              }) // parentList.forEach
            }
        }) // client.query
      } // if(req.session.user)
    }) // pool.connect
    //return res.render('youserDash')  
  }) // GET

  app.post('/youserDash', function (req, res) {

  })
}