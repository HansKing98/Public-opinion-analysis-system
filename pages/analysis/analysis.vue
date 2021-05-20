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

		<u-cell-item icon="heart-fill" title="情绪占比" hover-class="cell-hover-class"></u-cell-item>
		<view class="charts-box-emotion">
			<qiun-data-charts type="emotionProportion" :chartData="chartEmotionProportion" background="none"
				:animation="true" />
		</view>

		<u-cell-item icon="heart-fill" title="敏感占比" hover-class="cell-hover-class"></u-cell-item>
		<div class="text-center margin-10"><span class="color_blue">
				<u-icon name="heart-fill"></u-icon> 非敏感
			</span> <span class="color_green">
				<u-icon name="heart-fill"></u-icon> 中性
			</span> <span class="color_yellow">
				<u-icon name="heart-fill"></u-icon> 敏感
			</span></div>
		<view class="charts-box2">

			<qiun-data-charts type="MinGanPRing" :chartData="emotion1" :loadingType="3" background="none"
				:animation="true" :opts="{title:{name:'男'}}" />
			<qiun-data-charts type="MinGanPRing" :chartData="emotion2" :loadingType="2" background="none"
				:animation="true" :opts="{title:{name:'女'}}" />
		</view>
		<u-cell-item icon="heart-fill" title="热度走势" hover-class="cell-hover-class"></u-cell-item>
		<view class="charts-box">
			<qiun-data-charts type="hotTrend" :chartData="chartHotTrend" background="none" :animation="true"
				:opts="chartHotTrendOpts" />
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
		chartHotTrend,
		chartEmotionProportion
	} from './chartsData.js'
	import {
		makeWordCloud,
		makeHotTrend,
		emotionSex2
	} from '@/utils/index.js'
	export default {
		data() {
			return {
				hotword: "",
				chartDataWord: {},
				chartDataRing: {},
				chartHotTrend: {},
				chartHotTrendOpts: {},
				emotion1: {},
				emotion2: {},
				chartEmotionProportion: {}
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
			if (this.hotword) {
				this.get({
					hotword: this.hotword
				})
			} else {
				this.chartDataWord = chartDataWord
			}


		},
		methods: {
			getServerData() {
				// console.log("2", chartDataWord)
				setTimeout(() => {
					//因部分数据格式一样，这里不同图表引用同一数据源的话，需要深拷贝一下构造不同的对象
					//开发者需要自行处理服务器返回的数据，应与标准数据格式一致，注意series的data数值应为数字格式
					// this.chartDataWord = chartDataWord
					this.chartDataRing = chartDataRing

					// }, 1000)
				})
			},
			get(data) {
				uni.showLoading({
					title: '正在加载更多...'
				})
				// 获取词云图
				uniCloud.callFunction({
					name: 'get-wrd-word-cloud',
					data
				}).then((res) => {
					// console.log(res.result)
					// let li = eval(res.result.data[0].li)
					// this.chartDataWord = makeWordCloud(li)
					this.chartDataWord = res.result

					// console.log("li", this.chartDataWord)
					uni.hideLoading()
				}).catch((err) => {
					uni.hideLoading()
					this.chartDataWord = chartDataWord
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})

				// 获取 热度趋势
				uniCloud.callFunction({
					name: 'get-wrd-hot-line',
					data
				}).then((res) => {

					// this.chartDataWord = res.result
					this.chartHotTrend = makeHotTrend(res.result)
					this.chartHotTrendOpts = {
						extra: {
							markLine: {
								data: [{
									value: this.chartHotTrend.avgHot
								}]
							}
						}
					}
					// console.log("res.result", res.result)
				}).catch((err) => {
					this.chartDataWord = chartDataWord
					console.error(err)
				})

				// 获取 分性别敏感占比
				uniCloud.callFunction({
					name: 'get-wrd-emotion-sex2',
					data
				}).then((res) => {
					[this.emotion1, this.emotion2] = emotionSex2(res.result)
					// console.log("res.result", res.result)
				}).catch((err) => {
					this.chartDataWord = chartDataWord
					console.error(err)
				})

				// 获取 情绪占比
				uniCloud.callFunction({
					name: 'get-wrd-emotion',
					data
				}).then((res) => {
					this.chartEmotionProportion = res.result
					// console.log("res.result", res.result)

				}).catch((err) => {
					this.chartDataWord = chartDataWord
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

	.charts-box-emotion {
		width: 100%;
		height: 200px;
	}

	.charts-box2 {
		// 一行两个
		display: flex;
		width: 100%;
		height: 200px;
	}

	/*每个页面公共css */
	.cell-hover-class {
		background-color: rgb(235, 237, 238);
	}
</style>


<style lang="scss" scoped>
	.text-center {
		text-align: center;

		.color_blue {
			color: #4FA5FF;
			margin: 10px;
		}

		.color_green {
			color: #91CB74;
			margin: 10px;
		}

		.color_yellow {
			color: #FAC858;
			margin: 10px;
		}

		.icon-square {
			width: 10rpx;
			height: 10rpx;
			background-color: red;
		}
	}
</style>
