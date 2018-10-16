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

  app.post('/template-save-title', function (req, res, next) {
    //let err = new Error(`${req.ip} tried to access /template-save`); // Sets error message, includes the requester's ip address!
    //err.statusCode = 403;
    //next(err);
    //get query strings
    var id = req.query.id;
    var ef = req.query.edit_flag;

    if(id == "" || id == null || id == undefined) {
      if(ef == "edit_flag") {
        // respond with error...
        //console.log("edit_flag is UP");
      }
    }

    //console.log("Server: template-save-title");

    var name = req.query.name;
    var description = req.query.description;
    var color = req.query.color;
    var active = true;

    //console.log("Color = " + color);

    var dbAction1 = function(client) {
      var dbClient = client;

      dbClient.query('UPDATE template SET name=$1, description=$2, color=$3 WHERE id = $4', [name,description,color,id], function (err, result) {
          if (err) {
            console.log("Error UPDATING the EDIT to template. " + err);
            res.end();
          }
          if(result) {
            console.log("Update succes I think: " + result);
            // Need to add a success response here.
            res.end();
          }
        });//..dbClient
    }

    var dbAction2 = function(client) {
      var dbClient = client;
      // First, Check if the name already exists
      dbClient.query('SELECT * from template WHERE name = $1', [name], function (err, result) {
        if (err) {
          console.log("Error checking template name. Name already exists " + err);
          //res.
        }
        if(result) {
          // If the name exists in the DB then send back an error.
          //console.log("The name is: " + JSON.stringify(result.rows));
          console.log("Name = " + result.rows.name);
          
          if(result.rows.name == name) {
            // Name already exists.
            res.write("NOT save because name already exists.");
            res.end();
          }
          // call the next dbAction
          dbAction3(client);
        }
      });
    };

    var dbAction3 = function(client) {
      var dbClient = client;

      dbClient.query('INSERT INTO template("name","description","active","color") VALUES($1,$2,$3,$4);',[name,description,active,color] , function (err, result) {
            if (err) {
              console.log("Error UPDATING data to table template. " + err)
            }
            if(result) {
              //console.log("template-save ran all the way.")
              dbAction4(client);
            }
          });
    };

    var refreshTemplates = "";

    var dbAction4 = function(client) {
      var dbClient = client;

      dbClient.query('SELECT * from template', function (err, result) {
        if (err) {
          console.log("Error getting new templats. " + err)
        }
        if(result) {
          // get the list of ALL template for refreshing the list
          refreshTemplates = result.rows;
        }
      });

    };

    var dbAction5 = function(client) {
      var dbClient = client;

      dbClient.query('SELECT * from template WHERE name = $1', [name], function (err, result) {
        if (err) {
          console.log("Error getting the just-saved template id from the db. " + err);
          //res.
        }
        if(result) {
          // result = the newly save template
          var template_ID = {"new_id": result.rows[0].id};
          refreshTemplates.unshift(template_ID);
          //console.log("The template ID is: " + JSON.stringify(template_ID) + " JSON: " + JSON.stringify(refreshTemplates));
          console.log("Saved new instead of update.");
          res.json(refreshTemplates);
        }
      });
    };


    
    pool.connect(function (err, client, done) {
      if (err) console.log(err)
      dbClient = client

      if(ef == "edit_flag"){

        dbAction1(client);
        // dbClient.query('UPDATE template SET name=$1, description=$2, color=$3 WHERE id = $4', [name,description,color,id], function (err, result) {
        //   if (err) {
        //     console.log("Error UPDATING the EDIT to template. " + err);
        //     res.end();
        //   }
        //   if(result) {
        //     console.log("Update succes I think: " + result);
        //     // Need to add a success response here.
        //     res.end();
        //   }
        // });//..dbClient
      } else { //... if

        dbAction2(client);

        // // First, Check if the name already exists
        // dbClient.query('SELECT * from template WHERE name = $1', [name], function (err, result) {
        //   if (err) {
        //     console.log("Error checking template name. Name already exists " + err);
        //     //res.
        //   }
        //   if(result) {
        //     // If the name exists in the DB then send back an error.
        //     //console.log("The name is: " + JSON.stringify(result.rows));
        //     if(result.rows.name == name) {
        //       // Name already exists.
        //       res.write("NOT save because name already exists.");
        //       res.end();
        //     }
        dbAction3(client);
          // dbClient.query('INSERT INTO template("name","description","active","color") VALUES($1,$2,$3,$4);',[name,description,active,color] , function (err, result) {
          //   if (err) {
          //     console.log("Error UPDATING data to table template. " + err)
          //   }
          //   if(result) {
          //     //console.log("template-save ran all the way.")
        dbAction4(client);
              // dbClient.query('SELECT * from template', function (err, result) {
              //   if (err) {
              //     console.log("Error getting new templats. " + err)
              //   }
              //   if(result) {
              //     // get the list of ALL template for refreshing the list
              //     var refreshTemplates = result.rows;
        dbAction5(client);
                  // Now, request the newly saved template so that we can get the ID of the template and send it back - so that we can reference the template_id when saving templated-Blocks.
                  // dbClient.query('SELECT * from template WHERE name = $1', [name], function (err, result) {
                  //         if (err) {
                  //           console.log("Error getting the just-saved template id from the db. " + err);
                  //           //res.
                  //         }
                  //         if(result) {
                  //           // result = the newly save template
                  //           var template_ID = {"new_id": result.rows[0].id};

                  //           refreshTemplates.unshift(template_ID);

                  //           //console.log("The template ID is: " + JSON.stringify(template_ID) + " JSON: " + JSON.stringify(refreshTemplates));
                  //           console.log("Saved new instead of update.");
                  //           res.json(refreshTemplates);
                  //         }
      //             }) //...dbClient 
      //           } 
      //         }) //...dbClient
      //       } 
      //     }) //...dbClient
      //   } //...if 1st
      // }) //...dbClient


      } //...if edit_flag


    }) //...pool.connect
  }) //...app.post

} // module.exports

