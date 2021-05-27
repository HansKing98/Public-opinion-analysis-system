<template>
	<view class="content">
		<button @click="showDrawer" type="primary">右侧弹出 显示Drawer</button>
		<view class="card-bg drawer" :class="drawer?'drawer-open':''">
			<leo-list :show-icon="true" :show-arrow="true" :list="list"></leo-list>
			<skeleton :loading="loading" :avatarSize="skeleton1.avatarSize" :avatarShape="'square'" :row="skeleton1.row"
				:showTitle="skeleton1.showTitle" :animate="skeleton1.animate" v-for="(i,index) in 8" :key="index">
			</skeleton>
			<u-loadmore :status="status" @loadmore="getMore()" />
		</view>
		<uni-drawer ref="DrawerLeft" mode="left" width="400" @change="(e)=>changeDrawer(e)">
			<scroll-view scroll-y="true">
				<my />
			</scroll-view>
		</uni-drawer>
	</view>
</template>

<script>
	import my from '../my/my.vue'
	export default {
		components: {
			my
		},
		data() {
			return {
				title: 'Hello',
				list: [],
				status: 'loadmore',
				pageData: {
					page: 0,
					pageSize: 11,
				},
				loading: true,
				skeleton1: {
					avatarSize: '40px',
					row: 1,
					showTitle: true,
					animate: true
				},
				drawer: false
			}
		},
		mounted() {
			this.get()
			this.$refs.DrawerLeft.open()
		},
		onPullDownRefresh() {
			this.pageData.page = 0
			// console.log(this.pageData.page)
			this.get();
		},
		methods: {
			changeDrawer(e) {
				// console.log(e)
				if (e === false) {
					this.drawer = false
				}else{
					this.drawer = true
				}
			},
			showDrawer() {
				this.drawer = true
				this.$refs.DrawerLeft.open();
			},
			closeDrawer() {
				this.drawer = false
				this.$refs.DrawerLeft.close();
			},
			get() {
				uni.showLoading({
					title: '正在加载更多...'
				})

				uniCloud.callFunction({
					name: 'get-weibo-hot',
					data: this.pageData
				}).then((res) => {
					if (this.pageData.page == 0) {
						this.list = []
					}
					this.list.push.apply(this.list, res.result.data);
					// 是否读到最后一条
					// console.log(this.list.length)
					if (res.result.data.length == 0) {
						// 已经加载了全部数据
						this.status = "nomore"
					}
					this.loading = false;
					uni.hideLoading()
					// uni.showModal({
					// 	content: `查询成功，获取数据列表为：${JSON.stringify(res.result.data)}`,
					// 	showCancel: false
					// })
					// console.log(res)
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				}).finally(() => {
					uni.stopPullDownRefresh()
				})
			},
			getMore() {
				this.status = 'loading';
				this.pageData.page += 1
				this.get()
			}
		},
		// 触底事件
		onReachBottom() {
			this.getMore()
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

	.drawer {
		transition: all 0.2s ease-in-out;
	}

	.drawer-close {
		// transform: translateX(200px);
	}

	.drawer-open {
		// position: absolute;
		// left:100px ;
		transform: translateX(400px);
		// animation: ;
	}
</style>
