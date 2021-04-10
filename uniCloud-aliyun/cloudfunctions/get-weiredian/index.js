'use strict';

const {
	request
} = require('node-modules-common')

const host = 'https://www.wrd.cn/view/home/hotEvent/getHotClassList.action'
// const db = uniCloud.database();
// const collection = db.collection('weibo-hot')
// const dbCmd = db.command

exports.main = async (event, context) => {
	let headers = {
		'Host': 'www.wrd.cn',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
		'X-Requested-With': 'XMLHttpRequest',
		'Cookie': "username = "
	}
	let res = request('POST', host, {
		headers,
		json: {
			"timeType": "1",
			"sort": "7",
			"labels": "1010",
			"page": "1",
			"pageSize": "20",
		}
	})
	// var html = JSON.parse(res.getBody('utf8'));
	// console.log(html).getBody('utf8')
	return res.getBody('utf8')
}
