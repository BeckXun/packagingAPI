const express = require('express')
const router = express.Router()
// const Event = require('events')
// const myEmitter = new Event()
const socket_io = require('socket.io')
const io = socket_io.listen(global.expressServer)
const moment = require('moment')
const back = require('../lib/back.js')
const returnFmt = new back()


// 拉取聊天记录
router.get('/', (req, res, next) => {
  // 解析参数
  const query = req.query
  if (Object.keys(query).length) {
    global.Dubbo.Chat
      .getNewMsg(parseInt(query.type))
      .then(data => {
        data = JSON.parse(data)
        // 数据的过滤与组合
        data.data.forEach(x => {
          if (x.uptime && typeof x.uptime === 'string') {
            x.uptime = moment(new Date(x.uptime)).format('YYYY-MM-DD HH:mm:ss')
          }
        })
        // 返回所需数据
        res.json(returnFmt.normal(data.data))
      })
      .catch(err => {        
        res.json(returnFmt.error(err))
      });
  } else {
    returnFmt.error()
  }
});

// 发送聊天消息
router.get('/sendMsg', (req, res, next) => {
  // 解析参数
  const query = req.query
  if (Object.keys(query).length) {
    let { uid, msg, roomId } = query
    let ip = req.connection.remoteAddress,
      groupId = 0,
      toUid = 0;
    roomId = 1
    console.log(ip)
    global.Dubbo.Chat
      .addMessage(uid, msg, ip, parseInt(roomId), groupId, toUid)
      .then(data => {
        // 数据的过滤与组合
        // 返回所需数据
        res.json(returnFmt.normal(JSON.parse(data)))
      })
      .catch(err => {        
        res.json(returnFmt.error(err))
      });
  } else {
    returnFmt.error()
  }
});

// room page
router.get('/room', (req, res) => {
  const roomId = req.query.roomId
  // 渲染页面数据(见views/room.hbs)
  res.render('room', {
    roomID: roomID
  })
})

module.exports = router