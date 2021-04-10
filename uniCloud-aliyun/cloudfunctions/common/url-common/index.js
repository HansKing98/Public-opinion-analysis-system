let url_wrd = "https://m.wrd.cn/"

module.exports = {
	secret: 'abcdefg',
	getVersion: function() {
		return '1.0.0'
	},
	url_hotTop: "https://s.weibo.com/top/summary",

	url_wrd,
	url_Wordcloud: url_wrd + "getWordcloud",
	url_Hotline: url_wrd + "getHotline"

}
