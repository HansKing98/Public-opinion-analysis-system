export const makeWordCloud = (li) => {
	console.log('name', li[0])
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
	console.log(li.categories)

	let _categories = li.categories.map((el, index) => {
		// 第一个保留日期 只显示四个时间
		if (index % 7 !== 0) {
			return ''
		} else {
			return el
		}

	})
	li.categories = _categories
	return li
}
