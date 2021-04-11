'use strict';

const {
	request
} = require('node-modules-common')

const {
	url_EmotionTrends
} = require('url-common')

// 爬取情感趋势 已经成功
const host = url_EmotionTrends
// console.log(host)
// const db = uniCloud.database();
// const collection = db.collection('weibo-hot')
// const dbCmd = db.command

exports.main = async (event, context) => {
	let headers = {
		'Host': 'm.wrd.cn',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
		'X-Requested-With': 'XMLHttpRequest',
		'content-type': 'application/x-www-form-urlencoded'
	}
	let data = {
		"date": "24",
		"searchKeyword1": "幼儿园不得设学前班",
		"keyword1": "幼儿园不得设学前班",
		"filterKeyword1": "",
		// "startTime": "2021-04-08 20:47:46",
		// "endTime": "2021-04-09 20:47:46",
		"sid": "0"
	}

	let dataStr = ""
	Object.keys(data).forEach(key => {
		dataStr += `${key}=${data[key]}&`
	})
	dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'));
	// console.log("dataStr", dataStr)
	let res = request('POST', host, {
		headers,
		body: dataStr
	})

	let resStr = res.getBody('utf8')
	return JSON.parse(resStr)
}
