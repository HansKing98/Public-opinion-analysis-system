'use strict';

const db = uniCloud.database();
const collection = db.collection('hot-favo')

exports.main = async (event, context) => {

	const user_id = event.user_id

	let result = await collection.orderBy('created_date', 'desc').where({
		user_id
	}).get()

	return {
		...result
	}
}
