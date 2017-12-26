'use strict';

const request = require('request')
const Token = require('./token')
const token = new Token()
/**
 * 消息模板类
 * 用来确保获取合法token
 */

const APPID = 'wx86cbe3dab13bb610'
const APPSECRET = '4b1c373d24be53f377c1e2330b66427e'

class Token {
	constructor () {
		this.appid = APPID
		this.secret = APPSECRET
		this.timeStamp = 0 // 上次有效时间点的时间戳
		this.cycle = 0 // token有效期
	}
	// 检查token合法性
	inspectToken () {
		const now = +new Date()
		if ( now - this.timeStamp > this.cycle) {
			return false
		} else {
			return true
		}
	}
	// 更新token
	updateToken () {
		const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appid}&secret=${this.secret}`
		return new Promise((resolve, reject) => {
			request(url, function (err, res, body) {
				if (!err && res.statusCode === 200) {
					const { access_token, expires_in } = res.body
					this.token = access_token
					// 消除误差 缩短确认周期200s
					this.cycle = ( expires_in - 200 ) * 1000
					this.timeStamp = +new Date()
					resolve()
				} else {
					reject(err)
				}
			})
		})
	}
	// 获取token
	getToken () {
		return new Promise((resolve, reject) => {
			token
			.getToken()
			.then(token => resolve(token))
			.catch(err => {})
		})
	}
	
 }

module.exports = Token;