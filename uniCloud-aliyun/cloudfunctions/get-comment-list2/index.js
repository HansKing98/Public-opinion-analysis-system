'use strict';

const db = uniCloud.database();
const collection = db.collection('hot-comment')
const dbCmd = db.command // 取指令
exports.main = async (event, context) => {

	const user_id = event.user_id

	let result = await collection.orderBy('comment_date', 'desc').where({
		user_id,
		praise_num: dbCmd.gt(0)
	}).get()

	return {
		...result
	}
}
