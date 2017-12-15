function socketHandler(io) {
	global.roomInfo = {}
	// 房间用户名单
	var roomInfo = global.roomInfo;
	io.on('connection', function (socket) {
		// 获取请求建立socket连接的url
		// 如: http://localhost:9000/chat/room/room_1, roomID为room_1
		let url = socket.request.headers.referer
		console.log('url: ' + url)
		let splited = url.split('/')
		let roomID = splited[splited.length - 1] // 获取房间ID
		let user = ''
		let thisRoom = roomInfo[roomID]

		socket.on('join', function (userName) {
			user = userName
			// 将用户昵称加入房间名单中
			if (thisRoom) {
				thisRoom.add(user)
			} else {
				thisRoom = new Set()
			}
			socket.join(roomID) // 加入房间
			// 通知房间内人员
			io.to(roomID).emit('sys', user + '加入了房间', thisRoom)
			console.log(user + '加入了' + roomID)
		})

		socket.on('leave', function () {
			socket.emit('disconnect')
		})

		socket.on('disconnect', function () {
			// 从房间名单中移除
			thisRoom.delete(user)
			socket.leave(roomID) // 退出房间
			io.to(roomID).emit('sys', user + '退出了房间', thisRoom)
			console.log(user + '退出了' + roomID)
		})

		// 接收用户消息,发送相应的房间
		socket.on('message', function (msg) {
			console.log(msg)
			io.to(roomID).emit('msg', user, msg)
		})
	})
}

module.exports = socketHandler