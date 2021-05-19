let url_wrd = "https://m.wrd.cn/"

module.exports = {
	secret: 'abcdefg',
	getVersion: function() {
		return '1.0.0'
	},
	url_hotTop: "https://s.weibo.com/top/summary",
	url_getIndex: "https://m.weibo.cn/api/container/getIndex",

	// 微热点
	url_wrd,
	url_Wordcloud: url_wrd + "getWordcloud",
	url_Hotline: url_wrd + "getHotline",
	url_Emotion: url_wrd + "getEmotionProportion",
	url_EmotionSex: url_wrd + "getEmotionSex",
	url_EmotionSex2: url_wrd + "getEmotionSex2",
	url_EmotionTrends: url_wrd + "getContentTrends"


}
