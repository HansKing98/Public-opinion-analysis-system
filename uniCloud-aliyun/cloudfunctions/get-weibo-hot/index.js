'use strict';
const db = uniCloud.database()
/**
 * @event {pageNum: Number, pageSize: Number}
 * 
 */
exports.main = async (event, context) => {
	let page = parseInt(event.page)
	let pageSize = parseInt(event.pageSize) || 5
	// console.log(event)
	const collection = db.collection('weibo-hot-20')

	console.log('page:', page, 'size:', pageSize)

	let count = await collection.count()
	count = count.total
	let begin = page * pageSize

	console.log('count:', count, 'begin:', begin)

	let res
	if (page * pageSize < count) {
		res = await collection.orderBy("update_time", "asc").skip(begin).limit(pageSize).get()
	} else {
		res = await collection.orderBy("update_time", "asc").skip(page * pageSize).get()
	}

	return res
};
