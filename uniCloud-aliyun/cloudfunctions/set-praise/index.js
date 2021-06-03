'use strict';
const db = uniCloud.database()
const dbCmd = db.command
const comment_collection = db.collection('hot-comment')
const praise_collection = db.collection('hot-comment-praise')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let res = {}
	const comment_id = event['comment_id']
	const user_id = event['user_id']
	if (user_id && comment_id) {
		// let exist = await praise_collection.where({
		// 	comment_id
		// }).count()

		if (true) { // 差不多数据：赞为0
			if (event['type'] === "praise") {
				let data = {
					user_id: event.user_id,
					comment_id: event.comment_id
				}
				// 添加一条数据
				let add = await praise_collection.add(data)
				
				await comment_collection.doc(comment_id).update({
					praise_num: dbCmd.inc(1) // 自增1
				});
				
				res = {
					code: 0,
					'_id': add.id,
					msg: '点赞成功'
				}
			} else if (event['type'] === "unlike") {
				// 删除这条数据
				praise_collection.where({
					user_id,
					comment_id
				}).remove()

				await comment_collection.doc(event.comment_id).update({
					praise_num: dbCmd.inc(-1) // 自减1
				});
				res = {
					code: 0,
					msg: '取消点赞成功'
				}
			}
		}

	} else if (user_id) {
		res = {
			code: 1,
			msg: '点赞失败，无法获取comment_id'
		}
	} else if (comment_id) {
		res = {
			code: 2,
			msg: '点赞失败，无法获取user_id，请重新登录'
		}
	} else {
		res = {
			code: 3,
			msg: '点赞失败，请联系客服！'
		}
	}
	return res
};
