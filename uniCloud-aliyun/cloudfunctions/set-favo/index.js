'use strict';
const db = uniCloud.database()
const dbCmd = db.command
const hot_collection = db.collection('weibo-hot-20')
const favo_collection = db.collection('hot-favo')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let res = {}
	const hotword = event['hotword']
	const user_id = event['user_id']
	if (user_id && hotword) {
		// let exist = await praise_collection.where({
		// 	hotword
		// }).count()

		if (true) {
			if (event['type'] === "favo") {
				let data = {
					user_id,
					hotword,
					created_date: new Date()
				}
				// 添加一条数据
				let add = await favo_collection.add(data)

				// await comment_collection.doc(hotword).update({
				// 	praise_num: dbCmd.inc(1) // 自增1
				// });

				res = {
					code: 0,
					'_id': add.id,
					msg: '收藏成功'
				}
			} else if (event['type'] === "unfavo") {
				// 删除这条数据
				await favo_collection.where({
					user_id,
					hotword
				}).remove()

				// await comment_collection.doc(event.hotword).update({
				// 	praise_num: dbCmd.inc(-1) // 自减1
				// });
				res = {
					code: 0,
					msg: '取消收藏成功'
				}
			}
		}

	} else if (user_id) {
		res = {
			code: 1,
			msg: '收藏失败，无法获取hotword'
		}
	} else if (hotword) {
		res = {
			code: 2,
			msg: '收藏失败，无法获取user_id，请重新登录'
		}
	} else {
		res = {
			code: 3,
			msg: '收藏失败，请联系客服！'
		}
	}
	return res
};
