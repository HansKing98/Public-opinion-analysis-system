'use strict';
const db = uniCloud.database()
const collection = db.collection('hot-comment')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let res = {}
	let data = {
		...event,
		praise_num: 0,
		is_praise: null,
		child_anwser_list: []
	}
	if (event['user_id'] && event['news_hotword']) {
		let add = await collection.add(data)
		res = {
			code: 0,
			'_id': add.id,
			msg: '评论成功'
		}
	} else if (event['user_id']) {
		res = {
			code: 1,
			msg: '评论失败，无法获取hotword，请重新进入文章'
		}
	} else if (event['news_hotword']) {
		res = {
			code: 2,
			msg: '评论失败，无法获取user_id，请重新登录'
		}
	} else {
		res = {
			code: 3,
			msg: '评论失败，请联系客服！'
		}
	}
	return res
};
