<template>
	<view class="content">
		<!--
		极简调用示例，只需指定type及chartData即可。
		图表默认配置请修改js_sdk/u-charts/config-ucharts.js对应图表类型下配置 
		注：1、更新前请自行备份config-ucharts.js、config-echarts.js，以免被覆盖
		2、此方式调用组件chartData需自行按图表类型需求的数据格式拼接
		配置参数请用在线生成工具(http://demo.ucharts.cn/)生成
		3、class="charts-box"这个样式，指定了高度，如果你的父元素有固定高度，请修改为height:100%
		-->
		<u-cell-item icon="heart-fill" title="舆情词云图" arrow hover-class="cell-hover-class"></u-cell-item>
		<view class="charts-box">
			<qiun-data-charts type="word" :chartData="chartDataWord" :loadingType="5" background="none" />
		</view>

		<u-cell-item icon="heart-fill" title="敏感占比" hover-class="cell-hover-class"></u-cell-item>
		<view class="charts-box">
			<qiun-data-charts type="MinGanPRing" :chartData="chartDataRing" :loadingType="3" background="none"
				:animation="true" />
		</view>
		<u-cell-item icon="heart-fill" title="热度走势" hover-class="cell-hover-class"></u-cell-item>
		<view class="charts-box">
			<qiun-data-charts type="mix" :chartData="chartDataMix" background="none" :animation="true" />
		</view>
	</view>
</template>

<script>
	//下面是演示数据，您的项目不需要引用，数据需要您从服务器自行获取
	import demodata from '@/mockdata/demodata.json';
	import mapdata from '@/mockdata/mapdata.json'
	import {
		chartDataWord,
		chartDataRing,
		chartDataMix
	} from './chartsData.js'
	import {
		makeWordCloud
	} from '@/utils/index.js'
	export default {
		data() {
			return {
				hotword: "",
				chartDataWord: {},
				chartDataRing: {},
				chartDataMix: {}
			}
		},
		onLoad(option) {
			// console.log("hotword", option.hotword)
			this.hotword = option.hotword
			uni.setNavigationBarTitle({
				title: option.hotword
			});
		},
		onReady() {
			//模拟从服务器获取数据
			// console.log("2")
			// 静态数据
			this.getServerData()
			// 云数据库数据
			this.get({
				hotword: this.hotword
			})

		},
		methods: {
			getServerData() {
				// console.log("2", chartDataWord)
				setTimeout(() => {
					//因部分数据格式一样，这里不同图表引用同一数据源的话，需要深拷贝一下构造不同的对象
					//开发者需要自行处理服务器返回的数据，应与标准数据格式一致，注意series的data数值应为数字格式
					// this.chartDataWord = chartDataWord
					this.chartDataRing = chartDataRing
					this.chartDataMix = chartDataMix

				// }, 1000)
				})
			},
			get(data) {
				uni.showLoading({
					title: '正在加载更多...'
				})
				uniCloud.callFunction({
					name: 'get-wrd-word-cloud',
					data
				}).then((res) => {
					// console.log(res.result.data)
					let li = eval(res.result.data[0].li)
					this.chartDataWord = makeWordCloud(li)
					console.log("li", this.chartDataWord)
					uni.hideLoading()
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			},

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.charts-box {
		width: 100%;
		height: 300px;
	}

	/*每个页面公共css */
	.cell-hover-class {
		background-color: rgb(235, 237, 238);
	}
</style>
