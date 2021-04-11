<template>
	<view class="content">
		<view class="card-bg">
			<leo-list :show-icon="true" :show-arrow="true" :list="list"></leo-list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				list: [{
						name: "主标题",
						subTitle: "副标题显示内容",
						icon: "/static/icon2.png",
						path: "",
					}, {
						name: "主标题",
						subTitle: "副标题显示内容",
						icon: "/static/icon1.png",
						path: "",
					},
					{
						name: "主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题主标题",
						subTitle: "副标题显示内容副标题显示内容副标题显示内容副标题显示内容副标题显示内容副标题显示内容副标题显示内容副标题显示内容",
						icon: "/static/icon2.png",
						path: "",
					}, {
						name: "主标题",
						subTitle: "副标题显示内容",
						icon: "/static/icon1.png",
						path: "",
					},
					{
						name: "主标题",
						subTitle: "副标题显示内容",
						icon: "/static/icon2.png",
						path: "",
					}, {
						name: "主标题",
						subTitle: "副标题显示内容",
						icon: "/static/icon1.png",
						path: "",
					},
					{
						name: "主标题",
						subTitle: "副标题显示内容",
						icon: "/static/icon2.png",
						path: "",
					}, {
						name: "主标题",
						subTitle: "副标题显示内容",
						icon: "/static/icon1.png",
						path: "",
					},
					{
						name: "主标题",
						subTitle: "副标题显示内容",
						icon: "/static/icon2.png",
						path: "",
					}, {
						name: "主标题",
						subTitle: "副标题显示内容",
						icon: "/static/icon1.png",
						path: "",
					},
					{
						name: "主标题",
						subTitle: "副标题显示内容",
						icon: "/static/icon2.png",
						path: "",
					}, {
						name: "主标题",
						subTitle: "副标题显示内容",
						icon: "/static/icon2.png",
						path: "",
					}
				]
			}
		},
		onLoad() {
			this.get()
		},
		methods: {
			get() {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'get-weibo-hot',
					data: {
						name: 'DCloud',
						subType: 'uniCloud',
						createTime: Date.now()
					}
				}).then((res) => {
					console.log("res", res.result)
					uni.hideLoading()
					uni.showModal({
						content: `查询成功，获取数据列表为：${JSON.stringify(res.result.data)}`,
						showCancel: false
					})
					console.log(res)
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

<style lang="scss" scoped>
	page {
		background: #f5f7fa;
	}

	.content {
		/* #ifdef APP-PLUS */
		padding-top: var(--status-bar-height);
		/* #endif */
		/* #ifndef APP-PLUS */
		padding-top: 1rpx;
		/* #endif */
		padding-bottom: 1rpx;
		// min-height: calc(100vh - var(--status-bar-height));
		// background: linear-gradient(to, #3377ff,  #f5f7fa 564rpx);

		background: #f5f7fa;
	}

	.card-bg {
		margin: 24rpx 24rpx;
		padding: 24rpx 32rpx;
		background: #ffffff;
		border-radius: 20rpx;
		box-shadow: 0px 4rpx 20rpx 0rpx rgba(235, 241, 244, 0.35);
	}
</style>
