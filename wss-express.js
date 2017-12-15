'use strict'

var fs = require('fs');
var https = require('https');

var server = https.createServer({
	'key': fs.readFileSync('ssl.key'),
	'cert': fs.readFileSync('ssl.crt'),
	'passphrase': 'ffxffx'
});
var url = require('url');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
	server: server
});
var express = require('express');
var app = express();
var port = 9001;

app.use(function (req, res) {
	res.send({
		msg: "hello"
	});
});

wss.on('connection', function connection(ws, req) {
	const location = url.parse(req.url, true)
	// you might use location.query.access_token to authenticate or share sessions
	// or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
	ws.send(JSON.stringify(ws))
	ws.on('message', function incoming(msg) {
		console.log('received: %s', msg)
		// ws.send(msg)
		// this.wss.broadcast(msg, roomid)
	})

	// 识别成功，把user绑定到该WebSocket对象:
    // ws.user = user;
    // 绑定WebSocketServer对象:
    ws.wss = wss
});
// 广播方法
wss.broadcast = function (msg) {
    wss.clients.forEach(client => {
		console.log(client)
        client.send(msg)
    });
};

server.on('request', app);
server.listen(port, function () {
	console.log('Listening on ' + server.address().port)
});