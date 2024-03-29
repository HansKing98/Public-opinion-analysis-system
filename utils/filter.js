import Vue from 'vue'

// 首字母大写过滤器
Vue.filter('timefliter', function(time) {
	if (!time) return ''
	Date.prototype.format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" +
					o[k]).length)));
			}
		}
		return fmt;
	}
	time = new Date(time).format("yyyy-MM-dd hh:mm")
	var nowDay = new Date().format("yyyy-MM-dd")
	if (time.includes(nowDay)) {
		return new Date(time).format("hh:mm")
	} else {
		return new Date(time).format("yyyy-MM-dd hh:mm")
	}

})
