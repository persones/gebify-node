const express = require('express');
const WebSocket = require('ws')
const http = require('http')

const app = express();
app.use(express.static('public'))
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const fs = require('fs');

app.get('/stl_ready', (req, res) => {
  console.log(req.query);
  wss.broadcast(req.query);
  res.send('ok')
});

wss.broadcast = function(data) {
  for (let ws of wss.clients) {
    ws.send(JSON.stringify(data));
  }
}
wss.on('connection', (ws) => {

  //connection is up, let's add a simple simple event
  ws.on('message', (message) => {
    console.log('received: %s', message);
    let data = JSON.parse(message);
    if (data.ready) {
      fs.readdir('public/stl', (err, files) => {
        var i = 0;
        var interval = setInterval(() => {
          wss.broadcast({
            stl: { 
              filename: files[i++]
            }
          });
          if (i == files.length) {
            clearInterval(interval);
          }
        }, 200);
      });
    }
  });
});

server.listen(3000);