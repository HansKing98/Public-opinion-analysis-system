exports.makeEmotionProportion = (li) => {
	console.log('Emotion', li)
	// li = li.slice(0, 10)

	let res = new Array(6)
	li.data.forEach(el => {
		console.log()
		let flag = {
			name: el.name,
			value: el.value
		}
		// res.push(flag)
		// "#8c96a6", //中性
		// "#5046d0", //恐惧
		// "#3aa872", //惊奇
		// "#c22d17", //愤怒
		// "#1168b3", //悲伤
		// "#ec7907" //喜悦
		switch (el.name) {
			case "中性":
				res[0] = flag
				break;
			case "恐惧":
				res[1] = flag
				break;
			case "惊奇":
				res[2] = flag
				break;
			case "愤怒":
				res[3] = flag
				break;
			case "悲伤":
				res[4] = flag
				break;
			case "喜悦":
				res[5] = flag
				break;
			default:
				// res[2] = flag
				break;
		}
	})
	return {
		series: [{
			data: res
		}]
	}
}
