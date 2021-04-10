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

	// 目标时区，东8区
	let targetTimezone = -8
	// 当前时区与中时区时差，以min为维度
	let _dif = new Date().getTimezoneOffset()
	// 本地时区时间 + 时差  = 中时区时间
	// 目标时区时间 + 时差 = 中时区时间
	// 目标时区时间 = 本地时区时间 + 本地时区时差 - 目标时区时差
	// 东8区时间
	let east8time = new Date().getTime() + _dif * 60 * 1000 - (targetTimezone * 60 * 60 * 1000)
	let date = new Date(east8time)
	console.log("time", date)

	for (var i = 1; i <= 20; i++) {
		// 跳过第一条 不是热搜
		// 每分钟 抓取前二十条
		let hotword = list.eq(i).text()
		let hotwordnum = hotwordnum_list.eq(i).text()

		let exist = await collection.where({
			'hotword': hotword
		}).count()

		console.log(exist.total)
		if (!exist.total) {
			let hotItem = {
				hotword: hotword,
				hotwordnum: hotwordnum,
				'create_time': new Date()
			}
			// console.log('hotword：', hotword)
			// console.log("hotwordnum", parseInt(hotwordnum) + 1)
			const addRes = await collection.add(hotItem)
		}
	}
}
