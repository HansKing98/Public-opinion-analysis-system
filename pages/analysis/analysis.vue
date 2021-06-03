<template>
	<view class="content" @touchstart="start" @touchend="end">
		<!--
		极简调用示例，只需指定type及chartData即可。
		图表默认配置请修改js_sdk/u-charts/config-ucharts.js对应图表类型下配置 
		注：1、更新前请自行备份config-ucharts.js、config-echarts.js，以免被覆盖
		2、此方式调用组件chartData需自行按图表类型需求的数据格式拼接
		配置参数请用在线生成工具(http://demo.ucharts.cn/)生成
		3、class="charts-box"这个样式，指定了高度，如果你的父元素有固定高度，请修改为height:100%
		-->
		<!-- <view v-if="false"> -->

		<u-cell-item icon="heart-fill" title="舆情词云图" :arrow="false" hover-class="cell-hover-class"></u-cell-item>
		<view class="charts-box">
			<qiun-data-charts type="word" :chartData="chartDataWord" :loadingType="5" background="none"
				:errorMessage="errorMsgwordCloud" />
		</view>

		<u-cell-item icon="heart-fill" title="热度走势" :arrow="false" hover-class="cell-hover-class"></u-cell-item>
		<div class="text-center margin-10"><span class="color_blue">
				<u-icon name="integral-fill"></u-icon> 最高{{TrendExtend.max}}
			</span> <span class="color_green">
				<u-icon name="more-dot-fill"></u-icon> 均值{{TrendExtend.avgHot}}
			</span></div>
		<view class="charts-box-trend">
			<qiun-data-charts type="hotTrend" :chartData="chartHotTrend" background="none" :animation="true"
				:opts="chartHotTrendOpts" :errorMessage="errorMsgHotTrend" />
		</view>

		<u-cell-item icon="heart-fill" title="情绪占比" :arrow="false" hover-class="cell-hover-class"></u-cell-item>
		<view class="charts-box-emotion">
			<qiun-data-charts type="emotionProportion" :chartData="chartEmotionProportion" background="none"
				:animation="true" :errorMessage="errorMsgEmotion" />
		</view>

		<u-cell-item icon="heart-fill" title="敏感占比" :arrow="false" hover-class="cell-hover-class"></u-cell-item>
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
		<!-- </view> -->
		<five-mul-commentlist :commentList="commentList" @clickPraise="clickPraiseComment"
			@clickDelete="clickDeleteComment" @clickDeleteChild="clickDeleteCommentChild"
			@clickRecomment="clickRecomment" @clickRecommentChild="clickRecommentChild"></five-mul-commentlist>

		<view class="footer-bar">
			<view class="u-flex my-page-footer">
				<view class="footer-action" @click="goBack">
					<u-icon name="arrow-left" size="36"></u-icon>
				</view>
				<view class="u-flex-1">
					<u-search v-model="comment" placeholder="说两句..." search-icon="chat" :show-action="false"></u-search>
				</view>
				<view class="footer-action" @click="sendComment">
					<u-icon name="arrow-upward" size="36"></u-icon>
				</view>
				<view class="footer-action" @click="favo =!favo">
					<u-icon :name="!favo?'star':'star-fill'" :color="favo?'#f39c12':''" size="36"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import fiveMulCommentlist from '@/components/five-mul-commentlist/five-mul-commentlist.vue';
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

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			fiveMulCommentlist
		},
		computed: mapState(['hasLogin', 'userInfo']),
		data() {
			return {
				hotword: "",
				chartDataWord: {},
				chartDataRing: {},
				chartHotTrend: {},
				TrendExtend: {},
				chartHotTrendOpts: {},
				emotion1: {},
				emotion2: {},
				chartEmotionProportion: {},
				errorMsgEmotion: null,
				errorMsgwordCloud: null,
				errorMsgHotTrend: null,
				startData: {},
				comment: '',
				favo: false,
				pageData: {
					page: 0,
					pageSize: 30
				},
				// commentList: [{
				// 	"COMMENT_TIME": "2020/1/2 10:01",
				// 	"FIRSTNICKNAME": "nickname",
				// 	"IS_PRAISE": null,
				// 	"COMMENT": "xxx",
				// 	"PRAISE_NUM": 10,
				// 	"CANDELETE": 0,
				// 	"HEADIMGURL": "https://img-cdn-aliyun.dcloud.net.cn/stream/plugin_screens/52f83b00-8ac3-11ea-92e4-6962457f811b_0.jpg?v=1588238334",
				// 	"PARENTID": "",
				// 	"SECONDNICKNAME": null,
				// 	"CHILD_ANWSER_LIST": [{
				// 		"COMMENT_TIME": "2020/1/2 10:02",
				// 		"FIRSTNICKNAME": "nickname",
				// 		"IS_PRAISE": null,
				// 		"COMMENT": "xxxx",
				// 		"PRAISE_NUM": 0,
				// 		"CANDELETE": 0,
				// 		"HEADIMGURL": "",
				// 		"SECONDNICKNAME": ""
				// 	}]
				// }]
				commentList: []
			}
		},
		onLoad(option) {
			// console.log("hotword", option.hotword)
			if (!option.hotword) {
				uni.showToast({
					icon: 'none',
					title: "页面参数缺失，正在返回首页...",
					success: function(res) {
						setTimeout(function() {
							uni.navigateTo({
								url: '/pages/index/index'
							});
						}, 1000)
					}
				})
			} else {
				this.hotword = option.hotword
				uni.setNavigationBarTitle({
					title: option.hotword
				});
				this.getComment()
			}

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
				this.chartDataWord = {}
			}
		},
		onShow() {
			// 
			this.getUserInfo()
		},
		methods: {
			...mapMutations(['setUserInfo']),
			clickPraiseComment(e) {
				// console.log(e)
				let that = this
				uniCloud.callFunction({
					name: 'set-praise',
					data: {
						"comment_id": e._id,
						"user_id": that.userInfo._id,
						"type": e.IS_PRAISE ? "unlike" : "praise"
					},
					success(res) {
						console.log('res', res.result.msg)
						that.getComment() //刷新
					},
					complete(e) {

					}
				})


			},
			getUserInfo() {
				// 通过比对 token 检查用户登录信息
				let that = this
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'getUserInfo',
					},
					success(res) {
						if (res.result.code == 0) {
							that.setUserInfo({
								...res.result.userInfo
							})
						}
					}
				})
			},
			// 返回
			goBack() {
				uni.navigateBack();
			},
			getComment() {
				uniCloud.callFunction({
					name: 'get-comment',
					data: {
						'news_hotword': this['hotword'],
						page: this.pageData.page,
						pageSize: this.pageData.pageSize
					}
				}).then((res) => {
					// console.log('comment:', res.result.data)
					if (this.pageData.page == 0 && res.result.data.length == 0) {
						uni.showToast({
							title: '未发现评论',
							icon: "none"
						})
					} else {
						let conment_list = res.result.data.map((el, index) => {
							return {
								_id: el._id,
								news_hotword: el.news_hotword,
								"COMMENT_TIME": this.$options.filters['timefliter'](el.comment_date),
								"FIRSTNICKNAME": el.userInfo[0].nickname || el.userInfo[0].username,
								"IS_PRAISE": el.is_praise, // 是否赞
								"COMMENT": el.comment_content,
								"PRAISE_NUM": el.praise_num, // 赞数
								"CANDELETE": 0,
								"HEADIMGURL": el.userInfo[0].headimg,
								"PARENTID": "",
								"SECONDNICKNAME": 123,
								// "CHILD_ANWSER_LIST":el.child_anwser_list,
								"CHILD_ANWSER_LIST": []

							}
						})
						this.commentList = this.pageData.page == 0 ? conment_list : this.commentList.concat(
							conment_list);

						let temp_commentList = this.commentList
						this.commentList.forEach((el, idx) => {
							let praise_flag = false
							let that = this
							uniCloud.callFunction({
								name: 'get-comment-praise',
								data: {
									"comment_id": el._id
								}
							}).then((res) => {
								// console.log('get-comment-praise', res.result.data)
								res.result.data.forEach((element) => {
									if (element.user_id == that.userInfo._id) {
										praise_flag = true
										// console.log("praise_flag", praise_flag)
									} else {
										// console.log(element.user_id, that.userInfo._id)
										// console.log("praise_flag", praise_flag)
									}
								})
								temp_commentList[idx].IS_PRAISE = praise_flag
							})
						})
						this.commentList = temp_commentList
						// this.commentList = conment_list
						// console.log("this.commentList",this.commentList)
						console.log('conment_list', this.commentList)
					}
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				}).finally(() => {
					this.listLoading = false
				})
			},
			async sendComment() {

				if (!this.hasLogin) {
					let that = this
					uni.showModal({
						showCancel: false,
						content: '暂未登录，是否跳转到我的',
						showCancel: true,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
								uni.navigateTo({
									url: '/pages/login/login'
								});
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					})
				} else {
					if (!this.comment) {
						uni.showModal({
							showCancel: false,
							content: '在评论区说两句吧。'
						})
					} else {
						// console.log(this.comment)
						let that = this


						let data = {
							'user_id': that.userInfo._id,
							'news_hotword': that['hotword'],
							'comment_content': that.comment,
							'comment_date': new Date()
						}
						let self = that
						console.log('data', data)
						uniCloud.callFunction({
							name: 'send-comment',
							data,
							success(res) {
								console.log("res123", res)
								if (res.result.code == 0) {
									uni.showModal({
										showCancel: false,
										content: '评论成功'
									})
									self.comment = ''
									self.getComment()
								} else {
									uni.showModal({
										showCancel: false,
										content: res.result.msg
									})
								}
							},
							fail(e) {
								console.log("send-comment:faild", e)
							}
						})
					}
				}
			},
			start(e) {
				// console.log(e)
				this.startData.clientX = e.changedTouches[0].clientX;
				this.startData.clientY = e.changedTouches[0].clientY;
			},
			end(e) {
				// console.log(e)
				const subX = e.changedTouches[0].clientX - this.startData.clientX;
				const subY = e.changedTouches[0].clientY - this.startData.clientY;
				if (subY > 50 || subY < -50) {
					// console.log('上下滑')
				} else {
					if (subX > 100) {
						// console.log('右滑')
						uni.navigateBack()
					} else if (subX < -100) {
						// console.log('左滑')
					} else {
						// console.log('无效')
					}
				}
			},
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
					// console.log(123)
					// console.log(res.result)
					// let li = eval(res.result.data[0].li)
					// this.chartDataWord = makeWordCloud(li)
					// this.chartDataWord = res.result
					if (res.result.series[0]) {
						this.chartDataWord = res.result
					} else {
						this.errorMsgwordCloud = '数据为空'
					}
					// console.log("li", this.chartDataWord)
					uni.hideLoading()
				}).catch((err) => {

					this.errorMsgwordCloud = "请求超时，点击以重新加载"
					// uni.showModal({
					// 	content: `查询失败，错误信息为：${err.message}`,
					// 	showCancel: false
					// })
					console.error(err)
				})

				// 获取 热度趋势
				uniCloud.callFunction({
					name: 'get-wrd-hot-line',
					data
				}).then((res) => {

					// this.chartDataWord = res.result
					// console.log("data2",res.result.numberCustom)
					if (res.result.numberCustom) {
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
					} else {
						this.errorMsgHotTrend = '数据缺失'
					}

					this.TrendExtend = {
						avgHot: this.chartHotTrend.avgHot,
						max: this.chartHotTrend.max
					}
					// console.log("res.result", res.result)
				}).catch((err) => {
					this.errorMsgHotTrend = '请求超时，点击以重新加载'
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
					console.error(err)
				})

				// 获取 情绪占比
				uniCloud.callFunction({
					name: 'get-wrd-emotion',
					data
				}).then((res) => {
					if (res.result.series[0].data[0]) {
						this.chartEmotionProportion = res.result
					} else {
						this.errorMsgEmotion = '数据为空'
					}
					// console.log("res.result", res.result)

				}).catch((err) => {
					this.errorMsgEmotion = '请求超时，点击以重新加载'
					console.error(err)
				})
			},

		}
	}
</script>

<style>
	.content {
		/* #ifdef APP-PLUS */
		padding-top: var(--status-bar-height);
		/* #endif */
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.charts-box {
		width: 100%;
		height: 300px;
	}

	.charts-box-trend {
		width: 100%;
		height: 160px;
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
	.u-cell {
		padding-left: 70rpx;
	}

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


<style lang="scss" scoped>
	.footer-bar {
		position: fixed;
		bottom: 0px;
		// left: 0px;
		z-index: 10000;
		width: 750rpx;

		.my-page-footer {
			height: 48px;
			background-color: $uni-bg-color-grey;
			padding: 0 10rpx;

			.footer-action {
				padding: 0 20rpx;
			}
		}
	}
</style>
