'use strict';

// let request = require('sync-request')
// let cheerio = require('cheerio');
// let Entities = require('html-entities').XmlEntities;
// let entities = new Entities();
// 公共模块
const {
	url_hotTop,
	url_getIndex
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
	for (var i = 20; i >= 1; i--) {
		// 跳过第一条 不是热搜
		// 每分钟 抓取前二十条
		let hotword = list.eq(i).text()
		let href = list.eq(i).attr('href')
		let hotwordnum = hotwordnum_list.eq(i).text()

		// %23 为井号 #
		let huatiReg = /\%23[\s\S]*%23/g;
		let isHuati = huatiReg.test(href);
		// console.log("isHuati", isHuati)

		let rc_head_data
		let portrait

		// 获取话题的详情
		if (isHuati) {
			let data = {
				"containerid": `231522type=60&q=#${hotword}#&t=0`,
			}
			
			// await uniCloud.callFunction({
			//     name: "get-wrd-word-cloud",
			//     data: { hotword, "date": 24}
			// })
			
			let detailRes = request('GET', url_getIndex, {
				qs: data // 包含要附加到uri的querystring值的对象
			})
			let detailResStr = detailRes.getBody('utf8')
			let detailResJson = JSON.parse(detailResStr)

			// console.log('detailResJson',detailResJson.data.cardlistInfo.cardlist_head_cards)
			let cardlistInfo = detailResJson.data.cardlistInfo

			portrait = cardlistInfo.portrait

			rc_head_data = cardlistInfo.cardlist_head_cards[0].head_data
			rc_head_data ? (rc_head_data = rc_head_data.midtext) : (rc_head_data = "")
			// console.log("head_data", rc_head_data, hotword)


			// 查到热度值变大 更新数据
			let searched = await collection.where({
				hotword
			}).get()
			if (!!searched.data[0]) {
				if (parseInt(hotwordnum) > parseInt(searched.data[0].hotwordnum)) {


					collection.where({
						hotword
					}).update({
						isHuati,
						portrait: isHuati ? portrait : undefined,
						rc_head_data: isHuati ? rc_head_data : undefined,
						hotwordnum: parseInt(hotwordnum),
						'update_time': new Date()
					})
					// console.log(hotword, hotwordnum, searched.data[0].hotwordnum, )
					// console.log('update hotword：', hotword)
				} else {
					collection.where({
						hotword
					}).update({
						isHuati,
						portrait: isHuati ? portrait : undefined,
						rc_head_data: isHuati ? rc_head_data : undefined,
						// 指数没变大，不更新指数
						'update_time': new Date()
					})
					// console.log('update2 hotword：', hotword)
				}
			}
			
			// 查到不存在 插入数据
			let exist = await collection.where({
				hotword
			}).count()
			// console.log(searched.data[0].hotwordnum > hotwordnum, searched, !exist.total)
			if (!exist.total) {
				let hotItem = {
					hotword,
					isHuati,
					portrait: isHuati ? portrait : undefined,
					rc_head_data: isHuati ? rc_head_data : undefined,
					hotwordnum: parseInt(hotwordnum),
					'create_time': new Date(),
					'update_time': new Date()
				}
				// console.log('add hotword：', hotword)
				// console.log("hotwordnum", parseInt(hotwordnum) + 1)
				
				
				const addRes = await collection.add(hotItem)
			}
		}
	}
}
