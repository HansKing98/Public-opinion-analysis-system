'use strict';

let request = require('sync-request')
let cheerio = require('cheerio');
let Entities = require('html-entities').XmlEntities;
let entities = new Entities();

const host = 'https://s.weibo.com/top/summary'
const db = uniCloud.database();
const collection = db.collection('weibo-hot')
const dbCmd = db.command

exports.main = async (event, context) => {

	// 开始抓取首页链接
	let indexArr = []
	let html = request('GET', host).getBody().toString();
	let $ = cheerio.load(html);

	// 获取文章节点
	let list = $('tbody').find('a')
	let hotwordnum_list = $('tbody').find('span')
	console.log('list', list)
	for (var i = 1; i < list.length; i++) {
		// 跳过第一条 不是热搜
		let hotword = list.eq(i).text()
		let hotwordnum = hotwordnum_list.eq(i).text()

		let exist = await collection.where({
			'hotword': hotword
		}).count()
		console.log(exist.total, 'hotword：', hotword)
		if (!exist.total) {
			let hotItem = {
				hotword: hotword,
				hotwordnum: hotwordnum,
				'create_time': Date.now()
			}
			const addRes = await collection.add(hotItem)
		}
	}
}
