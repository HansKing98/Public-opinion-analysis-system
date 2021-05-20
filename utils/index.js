export const makeWordCloud = (li) => {
	// console.log('name', li[0])
	// li = li.slice(0, 10)
	let res = li.map((el, index) => {
		let {
			name,
			label,
			value
		} = el
		let textSize
		if (index < 1) {
			textSize = 60
		} else if (index <= 3) {
			textSize = 40
		} else if (index <= 6) {
			textSize = 30
		} else if (index <= 20) {
			textSize = 15
		} else if (index <= 30) {
			textSize = 10
		} else {
			textSize = 5
		}
		return {
			name,
			label,
			value,
			textSize
		}
	})
	return {
		"series": res
	}
}

// 简化日期
export const makeHotTrend = (li) => {
	// console.log(li.categories)
	let result = {}
	result.avgHot = li.avgHot
	result.max = Math.max(...li.jsonLine)
	result.categories = li.dates
	result.series = [{
		"name": "热度",
		"data": li.jsonLine
	}]
	// console.log('result', result)
	return result
}

// 分性别敏感占比
export const emotionSex2 = (li) => {
	// console.log("li", li)
	let male = {
		"series": [{
			"data": [{
					"name": "非敏感",
					"value": li.zm[0]
				},
				{
					"name": "中性",
					"value": li.zx[0]
				},
				{
					"name": "敏感",
					"value": li.fm[0]
				}
			]
		}],
	}
	let famale = {
		"series": [{
			"data": [{
					"name": "非敏感",
					"value": li.zm[1]
				},
				{
					"name": "中性",
					"value": li.zx[1]
				},
				{
					"name": "敏感",
					"value": li.fm[1]
				}
			]
		}],
	}
	let result = [male, famale]

	return result
}
