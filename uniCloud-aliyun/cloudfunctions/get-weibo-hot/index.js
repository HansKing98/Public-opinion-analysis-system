'use strict';
const db = uniCloud.database()
/**
 * @event {pageNum: Number, pageSize: Number}
 * 
 */
exports.main = async (event, context) => {
	event.pageNum = 0
	event.pageSize = 5
	console.log(event)
	const collection = db.collection('weibo-hot')
	const res = await collection.skip(event.pageNum).limit(event.pageSize).orderBy("create_time", "desc").get()
	return res
};
