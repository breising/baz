const express = require('express')
const app = express()
// bodyParser is required to get POST request data
const bodyParser = require('body-parser')
var pg = require('pg')
var format = require('pg-format')
var session = require('express-session');

var server = app.listen(3000, function () {
  console.log('Express server listening on port 3000!')
})
var io = require('socket.io').listen(server);
// attach an instance of io to the app so it can be used in the handlers
app.io = io

//***OLD ****Sockets io *****************************
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

var roomList = {}

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log("Socket connected: " + socket.id)

  socket.on('toast', function(message) {
    //console.log("Server responded to toast: " + message)
    io.emit('toastV2', message)
  })

  socket.on('subscribe', function(room) {
    console.log("The server app.js says: the room is: " + room)
    
    

    if(room !== "Reising_Orthodontics"){
      // send an event to alert admin if admin is already connected and admin screen needs updating.
      io.emit('newConnection', room)
      // use email address as the "room"... store it with the socket.id
      roomList[socket.id] = room
      // all non-admin-clients connect to a room named by their email
      socket.join(room)
    }
  });

  socket.on('chatToPat', function(data) {
      console.log(data);
      io.emit('chatToPat', data)
      // save message to the DB message ledger
  });

  socket.on('chatToAdmin', function(data) {
      console.log(data);
      io.emit('chatToAdmin', data)
      // save message to the DB message ledger
  });

  socket.on('getRoomList', function(data) {
      console.log("Server getting roomlist")
      socket.emit('roomList', roomList)
    })
  socket.on('updateRoom', function(room){
    socket.emit('broadcastRooms', roomList)
  })

  socket.on('disconnect', function() {
    console.log("Disconnecting:  " + socket.id)
    //console.log(roomList[socket.id])
    io.emit('noticeDisconnect', roomList[socket.id])
    delete roomList[socket.id]
  })
})
//*********OLD******************
// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });

// *************end sockets ****************

// setup/test the database connection
var PGUSER = 'postgres'
var PGDATABASE = 'baz'
var age = 732

// Must include all Handlers here
require('./routes/login')(app);
require('./routes/3D-test')(app);
require('./routes/signup')(app);
require('./routes/main')(app);
require('./routes/alias')(app);
require('./routes/chat')(app);
require('./routes/chat-admin')(app);
require('./routes/admin')(app);
require('./routes/chat-admin-talk')(app);
require('./routes/message')(app);
require('./routes/test')(app);
require('./routes/schedule')(app);
require('./routes/buyNow')(app);
require('./routes/youserDash')(app);
require('./routes/patientDash')(app);
require('./routes/template-build')(app);
require('./routes/template-edit')(app);
require('./routes/template-apply')(app);
require('./routes/admin-template')(app);
require('./routes/admin-template-react')(app);
require('./routes/admin-template-block')(app);
require('./routes/admin-template-block-edit')(app);
require('./routes/admin-template-seq')(app);
require('./routes/admin-template-seq-edit')(app);
require('./routes/admin-template-day')(app);
require('./routes/admin-template-day-edit')(app);


//config for the db connection
var config = {
  user: PGUSER, // name of the user account
  database: PGDATABASE, // name of the database
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  password: 'bcr0072'
}
//below is required to serve static files from public
app.use('/public/', express.static(__dirname + '/public/'));
//below sets up the html templating
app.set('views','./views')
app.set('view engine', 'pug')
//below sets up sessions
app.use(session({
    secret: '123',
    resave: true,
    saveUninitialized: true
}));

//auth tests whether a user cookie is found
var auth = function(req, res, next) {
  if (req.session && req.session.user === "n" && req.session.admin)
    return res.render('login', {text: 'logged IN'});
  else
    return res.render('login', {text: 'logged OUT'});
};
// Tell express to use the body-parser middleware and to not parse extended bodies
// bodyParser is required to get POST request data from "body"
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {
  if(!req.session.user) {
      return res.render("login", {login: "Login"})
    } else {
      if(req.session.user === "a@") {
        return res.redirect("/admin", {message: "Hello" + " " + req.session.user, login: "Logout"})
      } else {
      return res.render("main", {message: "Hello" + " " + req.session.user, login: "Logout"})
      }
    }
});

