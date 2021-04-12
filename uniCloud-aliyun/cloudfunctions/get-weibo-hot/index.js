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


	let res
	if (page * pageSize < count) {
		// console.log('count:', count, 'begin:', begin)
		res = await collection.orderBy('update_time', 'desc').skip(begin).limit(pageSize).get()
	} else {
		// console.log('到头啦')
		res = {
			"data": []
		}
	}

	return res
};
