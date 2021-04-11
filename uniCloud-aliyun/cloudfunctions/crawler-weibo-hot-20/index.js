'use strict';

// let request = require('sync-request')
// let cheerio = require('cheerio');
// let Entities = require('html-entities').XmlEntities;
// let entities = new Entities();
// 公共模块
const {
	url_hotTop
} = require('url-common')
const {
	request,
	cheerio,
	Entities
} = require('node-modules-common')
let entities = new Entities();

const host = url_hotTop
const db = uniCloud.database();
const collection = db.collection('weibo-hot-20')
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
	for (var i = 1; i <= 20; i++) {
		// 跳过第一条 不是热搜
		// 每分钟 抓取前二十条
		let hotword = list.eq(i).text()
		let hotwordnum = hotwordnum_list.eq(i).text()
		// 查到热度值变大 更新数据
		let searched = await collection.where({
			hotword
		}).get()
		if (!!searched.data[0] && parseInt(hotwordnum) > parseInt(searched.data[0].hotwordnum)) {
			collection.where({
				hotword
			}).update({
				hotwordnum,
				'update_time': new Date()
			})
			// console.log(hotword, hotwordnum, searched.data[0].hotwordnum, )
		}

		// 查到存在 插入数据
		let exist = await collection.where({
			hotword
		}).count()
		// console.log(searched.data[0].hotwordnum > hotwordnum, searched, !exist.total)
		if (!exist.total) {
			let hotItem = {
				hotword,
				hotwordnum,
				'create_time': new Date(),
				'update_time': new Date()
			}
			// console.log('hotword：', hotword)
			// console.log("hotwordnum", parseInt(hotwordnum) + 1)
			const addRes = await collection.add(hotItem)
		}
	}
}
