'use strict';

const {
	request
} = require('node-modules-common')

const {
	url_Wordcloud
} = require('url-common')

const {
	makeWordCloud
} = require('./makeWordCloud.js')

// 爬取对应词云图 已经成功
const host = url_Wordcloud

const db = uniCloud.database();
const collection = db.collection('weibo-word-cloud')

exports.main = async (event, context) => {
	let hotword = event.hotword
	let date = event.date || 24 //默认获取24小时

	// 查到不存在 插入数据
	let exist = await collection.where({
		hotword
	}).count()

	if (!exist.total) {

		let headers = {
			'Host': 'm.wrd.cn',
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
			'X-Requested-With': 'XMLHttpRequest',
			'content-type': 'application/x-www-form-urlencoded'
		}
		let data = {
			"date": date, // 24,72 可选
			"searchKeyword1": hotword,
			// "keyword1": "幼儿园不得设学前班",
			// "filterKeyword1": "",
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

		let li = JSON.parse(resStr)
		let lii = eval(li.data[0].li)

		let wordCloudObj = makeWordCloud(lii)
		wordCloudObj.hotword = hotword

		// 插入数据
		console.log("插入数据")
		const addRes = await collection.add(wordCloudObj)
		return wordCloudObj
	} else {
		console.log("查询数据")
		// 存在则 查出来
		// 查到热度值变大 更新数据
		let searched = await collection.where({
			hotword
		}).get()
		return searched.data[0]
	}
}
