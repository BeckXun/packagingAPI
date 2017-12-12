const nzd = require('node-zookeeper-dubbo');
const express = require('express');
const router = express.Router();
const opt = {
  application: {
    name: 'packagingInterface'
  },
  register: '192.168.2.15:2181', // 局域网的注册中心地址
  dubboVer: '2.5.7', // dubbo服务端版本号
  root: 'dubbo', // 注册到zk上的根节点，默认为dubbo
  dependencies: { // 依赖的服务列表
    Foo: {
      // group: 'isis', // 分组，可选
      interface: 'com.alibaba.dubbo.demo.DemoService', // 服务地址，必填
      timeout: 5000, // 超时时间，可选，默认6000
      methodSignature: { // 方法签名，可选
        // findById: (id) => [ {'$class': 'java.lang.Long', '$': id} ],
        sayHello : (name) => (java) => [ java.String(name) ],
      }
    },
  }
}
opt.java = require('js-to-java')

const Dubbo = new nzd(opt);

const errTips = function (msg = '输入参数不合法') {
  return {
    status: 0,
    message: msg
  }
}
router.get('/foo', (req, res, next) => {
  const query = req.query
  if (Object.keys(query).length) {
    Dubbo.Foo
      .sayHello(query.id)
      .then(data => res.send(data))
      .catch(err => res.send(err));
    // res.json({
    //   status: 1,
    //   message: 'JSON格式',
    //   data: {
    //     name: req.query.name
    //   }
    // })
  } else {
    res.json(errTips())
  }
  // Dubbo.Foo
  //   .sayHello('10000')
  //   .then(data => {
  //     // res.send(data))
  //     res.json({
  //       status: 200,
  //       message: 'JSON格式',
  //       data: data
  //     })
  //   })
  //   .catch(err => res.send(err))
});

module.exports = router;