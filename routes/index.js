const express = require('express')
const router = express.Router()
const back = require('../lib/back.js')
const returnFmt = new back()

// 获取用户数据接口
router.get('/user', (req, res, next) => {
  // 解析参数
  const query = req.query
  if (Object.keys(query).length) {
    console.log(parseInt(query.uid))
    global.Dubbo.User
      .getUserInfo(parseInt(query.uid))
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


module.exports = router;