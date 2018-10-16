const express = require('express')
const app = express()
var session = require('express-session')
var pg = require('pg')
const bodyParser = require('body-parser')

module.exports = function(app) {

  app.use(session({
      secret: '123',
      resave: true,
      saveUninitialized: true
  }));

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
  var dbClient = ''

  app.use(bodyParser.urlencoded({extended: false}));

  app.post('/template-build-repaint-blocks', function (req, res, next) {

    var templateid = req.query.templateid;

    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client
      dbClient.query('SELECT * from templateblock WHERE templateid = $1',[templateid], function (err, result) {
        if (err) {
          console.log("Error saving templateBlock " + err);
          //res.
        }
        if(result) {
          var tempBlocks = {};
          tempBlocks.array = [];
          var blocksHolder = {};
          blocksHolder.array = [];

          for(x=0;x<result.rows.length;x++){
            var tblock = {
              id: result.rows[x].id,
              blockid: result.rows[x].blockid,
              color: result.rows[x].color,
              templateid: result.rows[x].templateid,
              starttime: result.rows[x].starttime,
              chair: result.rows[x].chair
              };

              tempBlocks.array.push(tblock);
              //console.log("Hey there: " + JSON.stringify(block));

            dbClient.query('SELECT * from block WHERE id = $1',[tblock.blockid], function (err, result2) {
              if (err) {
                console.log("Error saving templateBlock " + err);
              }
              if(result2) {
                // ****** DB actions are ASYNC and so this code is NOT executed until AFTER the "for loop" finishes
                var bObject = {};
                bObject.duration = result2.rows[0].duration;
                bObject.name = result2.rows[0].name;
                bObject.id = result2.rows[0].id;
                bObject.active = result2.rows[0].active;
                bObject.color = result2.rows[0].color;
                bObject.description = result2.rows[0].description
  
                blocksHolder.array.push(bObject);

                // console.log("THE whole block:" + JSON.stringify(tempBlocks));
                // console.log("X = " + x);
                // console.log("LENGTH = " + tempBlocks.array.length);
                //console.log("TempBlocks.length = " + tempBlocks.array.length);
                //console.log("blocksHolder.length = " + blocksHolder.array.length);
                // Can't use the x from the "for loop" 
                // The arrays must sync up so that you know for sure that all the async call backs to the db have completed
                if(tempBlocks.array.length == blocksHolder.array.length) {
                  tempBlocks.array2 = blocksHolder.array;
                  //console.log("Check this out:" + JSON.stringify(tempBlocks));
                  res.send(tempBlocks);
                }
              } //...if 
            }) //...dbClient
          }//...for loop
        } //...if 1st
      }) //...dbClient
    }) //...pool.connect
  }) //...app.post
}


