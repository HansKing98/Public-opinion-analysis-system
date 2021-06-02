'use strict';
const db = uniCloud.database()
const dbCmd = db.command
const $ = dbCmd.aggregate
exports.main = async (event, context) => {
	const collection = db.collection('hot-comment')
	let pageSize = event.pageSize
	let page = event.page
	let news_hotword = event['news_hotword']

	// console.log('page:', page, 'size:', pageSize)

	let count = await collection.count()
	count = count.total
	let begin = page * pageSize

	// console.log('news_id', news_id, 'count: ', count, 'begin: ', begin)

	let res
	if (news_hotword) {

		if (page * pageSize < count) {
			res = await collection.aggregate().match({
					news_hotword
				})
				.lookup({
					from: 'uni-id-users',
					// localField: 'user_id',
					// foreignField: '_id',
					let: {
						user_id: '$user_id'
					},
					pipeline: $.pipeline()
						.match(dbCmd.expr($.and([
							$.eq(['$_id', '$$user_id'])
						])))
						.project({
							username: 1,
							nickname: 1,
							headimg: 1,
							province: $.arrayElemAt(['$area', 2])
						})
						.done(),
					as: 'userInfo',
				})
				.sort({
					'comment_date': -1
				})
				.skip(begin).limit(pageSize)
				.end()
		} else {
			// console.log('到头啦')
			res = await collection.aggregate().match({
					news_hotword
				})
				.sort({
					'comment_date': -1
				})
				.skip(page * pageSize)
				.end()
		}
	}
	return res
};
