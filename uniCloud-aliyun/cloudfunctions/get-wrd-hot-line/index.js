'use strict';

const {
	request
} = require('node-modules-common')

const {
	url_Hotline
} = require('url-common')

// 爬取对应词云图 已经成功
const host = url_Hotline
// console.log(host)
// const db = uniCloud.database();
// const collection = db.collection('weibo-hot')
// const dbCmd = db.command

exports.main = async (event, context) => {
	let hotword = event.hotword
	let headers = {
		'Host': 'm.wrd.cn',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
		'X-Requested-With': 'XMLHttpRequest',
		'content-type': 'application/x-www-form-urlencoded'
	}
	let data = {
		"date": "24",
		"searchKeyword1": hotword,
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
	let li = JSON.parse(resStr).data[0]
	return li
}
