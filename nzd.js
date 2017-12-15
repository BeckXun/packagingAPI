const nzd = require('node-zookeeper-dubbo');
const opt = {
  application: {
    name: 'user-provider'
  },
  register: '360che.com:2181', // 局域网的注册中心地址
  dubboVer: '2.5.7', // dubbo服务端版本号
  root: 'dubbo', // 注册到zk上的根节点，默认为dubbo
  dependencies: { // 依赖的服务列表
    User: {
      // group: 'isis', // 分组，可选
      // timeout: 5000, // 超时时间，可选，默认6000
      interface: 'com.che360.service.userService', // 服务地址，必填
      methodSignature: { // 方法签名，可选
        getUserInfo : (uid) => (java) => [ java.int(uid) ], // 获取用户信息
      }
    },
    Chat: {
      interface: 'com.che360.chat.service.chatService',
      methodSignature: {
        getNewMsg : (type) => (java) => [ java.int(type) ], // 获取消息
        addMessage: (uid, msg, ip, roomId, groupId, toUid) => (java) => [// 发送消息
          java.int(uid),
          java.String(msg),
          java.String(ip),
          java.int(roomId),
          java.int(groupId),
          java.int(toUid)
        ],
      }
    }
  }
}
opt.java = require('js-to-java')

const Dubbo = new nzd(opt)

module.exports =  Dubbo