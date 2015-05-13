var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var redis = require('redis'),
	client = redis.createClient(6379, 'redis');

app.listen(80, '0.0.0.0');

client.SUBSCRIBE('trnx');

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  client.on('message', function(channel, message) {
	socket.emit('trxn', message);
  })
});
