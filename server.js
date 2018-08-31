const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
var bodyParser = require('body-parser');
let srv = app.listen(port, () => console.log(`Listening on port ${port}`));
app.use('/peerjs', require('peer').ExpressPeerServer(srv, {
	debug: true
}))
app.use( bodyParser.json() );
app.use(express.json());
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
