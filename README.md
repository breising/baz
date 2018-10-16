##baz

Architecture of baz

Development environment:

Vagrant --> Virtual Box Ubuntu-trusty-64

To access the vagrant environment:
- from command line, navigate to the root folder of the project
- vagrant up
-vagrant ssh to log into the Linux box
- you'll be in the ~ (home) dir
- cd /
- then "cd vagrant" to access the mirrored project folder

### to run the app: 
- "node app.js"
- open a browser window and nav to: 127.0.0.1:3000

- to logout of the vagrant environement -->  ctrl-d
- vagrant ssh to get back in and then you must cd / then,
- cd vagrant ... now your back




--to run these sql statements, nav to the root dir of project and type
--"psql -f deletedb.sql baz"

--to get into psql you must first change the linux user from "vagrant" to "postgres" via :  "$ sudo su postgres"

-- then "psql"  --> viola

-- then connect to the database via: $ \c baz

-- now you see: baz=#

-- start entering sql statements

-- baz=# selct * from blocks;


###Git:
to do a commit:
"git add -A" to add all changed files to the staging area
"git status" to view the stage area.
"git commit" to commit to the repo.
"git push origin master" to push your changes to git hub.


###User authentication system:
- Model: server-side 
- Use npm module 'connect-pg-simple' to leverage the Postgres database as the datastore for express-sessions.
- User passwords hashed, protected by bcrypt or newer version
















