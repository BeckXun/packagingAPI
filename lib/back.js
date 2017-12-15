'use strict';

/**
 * 返回信息包装处理类
 */
class Back {
	constructor () {}
	error(msg = '输入参数不合法') {
		return {
			status: 0,
			message: msg
		}
	}
	normal(data) {
		return {
			status: 1,
			data: data
		}
	}
 }

module.exports = Back;