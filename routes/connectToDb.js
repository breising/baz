const express = require('express')
//const app = express()
var session = require('express-session')
var pg = require('pg')


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

pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client
})

exports.dbClient = dbClient

  