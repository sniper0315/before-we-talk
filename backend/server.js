const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path')
// const passport = require("passport");
const cors = require("cors");
const dotenv = require('dotenv');
const http = require('http');
var https = require('https');
const CronJob = require("node-cron");
var fs = require('fs');
var privateKey  = fs.readFileSync('./cert/chatapp.key', 'utf8');
var certificate = fs.readFileSync('./cert/chatapp.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
dotenv.config();

const messages = require("./routes/api/messages");
const auth = require("./routes/api/auth");
const flows = require("./routes/api/flows");
const steps = require("./routes/api/steps");
const rooms = require("./routes/api/rooms");
const tempsteps = require("./routes/api/tempsteps");

const app = express();

const {
  ADD_MESSAGE,
  UPDATE_MESSAGE,
  UNREAD_MESSAGE,
  UPDATE_ROOM_USERS,
  GET_ROOMS,
  GET_ROOM_USERS,
  FILTER_ROOM_USERS,
  CREATE_MESSAGE_CONTENT
} = require('./actions/socketio');


// Port that the webserver listens to
const port = process.env.PORT || 5000;

// const server = app.listen(port, () =>
//   console.log(`Server running on port ${port}`)
// );

// const server = http.createServer(app);
const server = https.createServer(credentials, app);

const io = require('socket.io')(server, {
  origins: [process.env.APP_BASE_URL, 'https://localhost:3002', 'https://127.0.0.1:3002']
});

// Body Parser middleware to parse request bodies
app.use(function (req, res, next) {
  console.log('tracked')
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// CORS middleware
app.use(cors());
app.use('/media_files', express.static(path.join(__dirname, './media_files')));
app.use('/media_files_temp', express.static(path.join(__dirname, './media_files_temp')));
// Database configuration
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Successfully Connected"))
  .catch((err) => console.log(err));

// // Passport middleware
// app.use(passport.initialize());
// // Passport config
// require("./config/passport")(passport);

// Assign socket object to every request
// app.use(function (req, res, next) {
//   req.io = io;
//   next();
// });

// Routes
app.use("/messages", messages);
app.use("/auth", auth);
app.use("/flows", flows);
app.use("/steps", steps);
app.use("/rooms", rooms);
app.use("/tempstep", tempsteps);
// app.set('io', io);

io.on('connection', socket => {
  console.log(`User Connected, ${socket.id}`)

  socket.on('JoinRoom', async data => {
    socket.join(data.room._id)

    io.emit('UserJoined', data);
  });
  socket.on('newMessage', async data => {
    await ADD_MESSAGE(data);
    console.log('data', data)
    if (data.rooms) {
      io.to(data.room._id).emit('sendMessage', data);
    } else {
      socket.emit('sendMessage', data);
    }
  });
  socket.on('broadMessage', async data => {
    await ADD_MESSAGE(data);
    console.log('finish')
    if (data.rooms) {
      io.to(data.room._id).emit('sendMessage', data);
    } else {
      socket.emit('sendMessage', data);
    }
  });
  socket.on('messageStatus', async data => {
    await UPDATE_MESSAGE(data)
  })
  socket.on('flow', async data => {
    socket.emit('flow', data)
  })
});

const scheduledJobFunction = CronJob.schedule("0 0 */1 * * *", () => {
  console.log('cron job executed.')
  UNREAD_MESSAGE()
});

scheduledJobFunction.start();

server.listen(port, err => {
  if (err) {
    console.log("Server err", err)
  }
  console.log("Server running on the Port:", port)
})

//forever -c "nodemon --exitcrash" app.js