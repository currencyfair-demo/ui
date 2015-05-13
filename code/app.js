var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var redis = require('redis'),
	client1 = redis.createClient(6379, 'redis');
	client2 = redis.createClient(6379, 'redis');

app.listen(80, '0.0.0.0');

client1.SUBSCRIBE('trnx');

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
  /**
   * Send the latest transactions to initialize the map
   */
  client2.lrange('transactions', 0, -1, function(err, values) {
	if(err) {
		return;
	}
	socket.emit('init', values);
  });

  client1.on('message', function(channel, message) {
	socket.emit('trxn', message);
  })
});
