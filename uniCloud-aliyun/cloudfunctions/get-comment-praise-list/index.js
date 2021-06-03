'use strict';

const db = uniCloud.database();
const collection = db.collection('hot-comment-praise')
const dbCmd = db.command
const $ = dbCmd.aggregate
exports.main = async (event, context) => {

	const user_id = event.user_id

	// let result = await collection.where({
	// 	user_id
	// }).get()


	let result = await collection.aggregate().match({
					user_id
				})
				.lookup({
					from: 'hot-comment',
					// localField: 'user_id',
					// foreignField: '_id',
					let: {
						comment_id: '$comment_id'
					},
					pipeline: $.pipeline()
						.match(dbCmd.expr($.and([
							$.eq(['$_id', '$$comment_id'])
						])))
						.project({
							news_hotword: 1,
							comment_content: 1,
						})
						.done(),
					as: 'commentInfo',
				})
				.sort({
					'created_date': -1
				})
				.end()
	return {
		...result
	}
}
