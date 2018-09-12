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

- to run the app: "node app.js"

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