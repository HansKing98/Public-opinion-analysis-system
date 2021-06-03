'use strict';

const db = uniCloud.database();
const collection = db.collection('hot-comment-praise')

exports.main = async (event, context) => {

	const user_id = event.user_id
	const comment_id = event.comment_id

	let result = await collection.where({
		comment_id
	}).get()

	return {
		...result
	}
}
