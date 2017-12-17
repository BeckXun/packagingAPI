'use strict'

var fs = require('fs');
var https = require('https');

var server = https.createServer({
	'key': fs.readFileSync('ssl.key'),
	'cert': fs.readFileSync('ssl.crt'),
	'passphrase': 'ffxffx'
});
var url = require('url');
var WebSocket = require('ws');
var wss = new WebSocket.Server({
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
// 上传聊天记录
wss.uploadMsg = function (msg) {
	const { uid, roomId, ip } = this
    let groupId = 0,
    	toUid = 0;
    global.Dubbo.Chat
      .addMessage(uid, msg, ip, parseInt(roomId), groupId, toUid)
      .then(data => {
		// res.json(returnFmt.normal(JSON.parse(data)))
		console.log(`uid:${uid}的消息上传成功`)
      })
      .catch(err => {
		console.log(`uid: ${uid}的消息上传失败，原因: ${err}`)
        // res.json(returnFmt.error(err))
      });
}
// 获取房间历史记录
wss.getHistory = function (ws, type) {
	global.Dubbo.Chat
		.getNewMsg(parseInt(type))
		.then(data => {
			data = JSON.parse(data)
			// 数据的过滤与组合
			data.data.forEach(x => {
				if (x.uptime && typeof x.uptime === 'string') {
				x.uptime = moment(new Date(x.uptime)).format('YYYY-MM-DD HH:mm:ss')
				}
			})
			// 返回所需数据
			ws.send(JSON.stringify({
				state: 1,
				data: data.data
			}))
		})
		.catch(err => {
			// res.json(returnFmt.error(err))
			ws.send(JSON.stringify({state: 0}))
		});
}
wss.on('connection', function connection(ws, req) {
	const ip = req.connection.remoteAddress
	// const ip = req.headers['x-forwarded-for'] // 使用NGINX时候获取ip方法
	const query = url.parse(req.url, true).query // 解析地址 获取uid roomId等
	let { roomId, uid } = query

	// 绑定WebSocketServer对象(包含各种数据)
	Object.assign(wss, { roomId, uid, ip })
	ws.wss = wss

	// 获取历史记录
	ws.wss.getHistory(ws, 1)

	// 监听聊天
	ws.on('message', function incoming(msg) {
		console.log('received: %s', msg)
		this.wss.broadcast(msg, roomId)
		this.wss.uploadMsg(msg)
	})
})
// 广播方法
wss.broadcast = function (msg, roomId) {
    wss.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN && client.roomId === roomId) {
			client.send(msg)
			console.log(`room: ${roomId}广播消息 ${msg}`)
		}
    })
}

server.on('request', app);
server.listen(port, function () {
	console.log('Listening on ' + server.address().port)
})