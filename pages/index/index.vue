<template>
	<view class="content" @touchstart="start" @touchend="end">
		<view @click="showDrawer" class="navbar-index drawer ripple" :class="drawer?'drawer-open':''">
			<u-avatar :src="avatar" size="100" mode="square" class="u-avatar">
			</u-avatar>
			<view class="user-name" v-if="hasLogin">{{userInfo.username}}</view>
		</view>

		<view class="card-bg drawer" :class="drawer?'drawer-open':''">
			<leo-list :show-icon="true" :show-arrow="true" :list="list"></leo-list>
			<skeleton :loading="loading" :avatarSize="skeleton1.avatarSize" :avatarShape="'square'" :row="skeleton1.row"
				:showTitle="skeleton1.showTitle" :animate="skeleton1.animate" v-for="(i,index) in 11" :key="index">
			</skeleton>
			<u-loadmore :status="status" @loadmore="getMore()" />
		</view>
		<uni-drawer ref="DrawerLeft" mode="left" :width="400" @change="(e)=>changeDrawer(e)">
			<my />
			<u-icon name="arrow-leftward" size="50" class="back-to-index" @click="closeDrawer"></u-icon>
		</uni-drawer>
		<u-back-top :scroll-top="scrollTop" bottom="120"></u-back-top>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import my from '../my/my.vue'
	export default {
		components: {
			my
		},
		computed: mapState(['hasLogin', 'userInfo']),
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
				drawer: false,
				startData: {},
				scrollTop: 0,
				avatar: "/static/avatar/boy.png" // 默认头像
			}
		},
		onLoad(option) {
			console.log("option", option)

		},
		mounted() {
			this.get()
			// this.$refs.DrawerLeft.open()
		},
		onShow() {
			console.log('show Index')
			// 如登录后重新获取用户数据
			this.getUserInfo()
		},
		onHide() {
			console.log('hide Index')
			// 跳到其他页面后
		},
		onPullDownRefresh() {
			if (!this.drawer) {
				this.pageData.page = 0
				// console.log(this.pageData.page)
				this.get();
			} else {
				uni.stopPullDownRefresh()

			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			...mapMutations(['setUserInfo']), // 验证登录 和 注销登录方法
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
					console.log('上下滑')
				} else {
					if (subX > 100) {
						console.log('右滑')
						this.showDrawer()
					} else if (subX < -100) {
						console.log('左滑')
						this.closeDrawer()
					} else {
						console.log('无效')
					}
				}
			},
			changeDrawer(e) {
				// console.log(e)
				if (e === false) {
					this.drawer = false
				} else {
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
				if (this.pageData.page === 0) {
					uni.showLoading({
						title: '正在加载数据...'
					})
				}
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
			getUserInfo() {
				// 通过比对 token 检查用户登录信息
				let that = this
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'getUserInfo',
					},
					success(res) {
						console.log("getUserInfo", res.result)
						if (res.result.code == 0) {
							that.setUserInfo({
								...res.result.userInfo
							})
						}
					}
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

	.back-to-index {
		position: absolute;
		font-size: 50px;
		right: 30px;
		bottom: 30px;
		width: 50px;
		height: 50px;
		color: #333;
		background-color: #eee;
		border-radius: 50%;
		display: flxx;
		justify-content: center;

		&:active {
			color: #666;
			background-color: #fff;
		}

	}

	.navbar-index {
		/* #ifdef APP-PLUS */
		padding-top: var(--status-bar-height);
		/* #endif */
		display: flex;
		align-items: center;
		background-image: linear-gradient(45deg, #4facfe, #00f2fe);

		&:active {
			.u-avatar {
				transform: scale(1.4);
			}
		}

		.u-avatar {
			padding: 20rpx;
			transition: all 0.1s ease;
		}

		.user-name {
			color: white;
		}
	}

	.content {
		/* #ifndef APP-PLUS */
		// padding-top: 1rpx;
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
		transition: all 0.3s ease;
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
