'use strict';

const {
	request
} = require('node-modules-common')

const {
	url_getIndex
} = require('url-common')

// 爬取对应词云图 已经成功
const host = url_getIndex
// console.log(host)
// const db = uniCloud.database();
// const collection = db.collection('weibo-hot')
// const dbCmd = db.command

const db = uniCloud.database();
const weiboHot20Db = db.collection('weibo-hot-20')
const weiboHotIndexDb = db.collection('weibo-hot-index')

exports.main = async (event, context) => {

	let data = {
		"containerid": "100103type=60&q=#韩美娟想复活回去看龚俊#&t=0",
		"title": "热门-#韩美娟想复活回去看龚俊#",
		"cardid": "weibo_page",
		"extparam": "title=热门&mid=&q=#韩美娟想复活回去看龚俊#",
		"luicode": "10000011",
		"lfid": "100103type=1&q=#韩美娟想复活回去看龚俊#",
		"page": "2"
	}

	let res = request('GET', url_getIndex, {
		qs: data // 包含要附加到uri的querystring值的对象
	})

	let resStr = res.getBody('utf8')
	let resJson = JSON.parse(resStr)
	let cards = resJson.data.cards
	// console.log("cards", cards)

	let hotIndex = cards.map(function(item, key, ary) {
		return {
			created_at: item.mblog.created_at,
			content: item.mblog.page_info ? item.mblog.page_info.content2 : "", //内容
			reposts_count: item.mblog.reposts_count, //转发
			comments_count: item.mblog.comments_count, //评论
			attitudes_count: item.mblog.attitudes_count, //点赞
			text: item.mblog.text,
			user: {
				screen_name: item.mblog.user.screen_name,
				avatar_hd: item.mblog.user.avatar_hd,
				followers_count: item.mblog.user.followers_count,
				verified_reason: item.mblog.user.verified_reason
			}
		}
	});

	console.log("hotIndex", hotIndex)
	// return JSON.parse(resStr).data
}
