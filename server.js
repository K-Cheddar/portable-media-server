const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
let srv = app.listen(port, () => console.log(`Listening on port ${port}`));
app.use('/peerjs', require('peer').ExpressPeerServer(srv, {
	debug: true
}))
app.use( bodyParser.json() );
app.use(express.json());

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

let currentInfo = {}
// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/getReceiverId', (req, res) => {
  let obj = req.body;
  let user = obj.user;
  res.send({ serverID: peerServer[user] });
});

app.post('/api/currentInfo', (req, res) => {
  let obj = req.body
  let t = obj.words
  res.send({t})
});

let peerServer = {};
app.post('/api/setAsReceiver', (req, res) => {
  let obj = req.body
  peerServer[obj.user] = obj.id;
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
