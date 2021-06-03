'use strict';

const db = uniCloud.database();
const collection = db.collection('hot-comment')

exports.main = async (event, context) => {

	const user_id = event.user_id

	let result = await collection.orderBy('comment_date', 'desc').where({
		user_id
	}).get()

	return {
		...result
	}
}
