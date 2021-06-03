'use strict';

const db = uniCloud.database();
const collection = db.collection('hot-favo')

exports.main = async (event, context) => {

	const user_id = event.user_id
	const hotword = event.hotword

	let result = await collection.where({
		user_id,
		hotword
	}).get()

	return {
		...result
	}
}
