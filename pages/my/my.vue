<template>
	<view>
		<view class="personal ripple" @click="toLogin()">
			<view class="personal-main">
				<u-avatar :src="avatar" mode="square" size="120" class="u-avatar"></u-avatar>
				<view class="personal-info" v-if="hasLogin">
					<view class="">{{userInfo.username}}</view>
					<view class="">{{userInfo._id}}</view>
				</view>
				<view class="personal-info" v-else>
					<view class="">点击头像登录</view>
				</view>
			</view>
			<u-icon name="arrow-right" size="30" class="p-right-icon"></u-icon>
		</view>
		<view class="n-p ripple" v-for="(item,index) in list" :key="index" hover-class="hover-class"
			@click="onClick(item)" v-if="item.type !== 'logout' || hasLogin">
			<!-- logout 选项，在登录后才显示 -->
			<view style="position: relative">
				<view class="p-left">
					<u-icon :name="item.icon" size="45" color="#949696"></u-icon>
				</view>
			</view>
			<view class="p-right">
				<view class="p-right-main">
					<view class="p-right-main-name">{{item.name}}</view>
				</view>

				<view class="lfet-a">
					<view style="position: relative">
					</view>
					<u-icon name="arrow-right" size="30" class="p-right-icon"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		computed: mapState(['hasLogin', 'userInfo']),
		data() {
			return {
				avatar: "/static/avatar/boy.png", //默认头像
				list: [{
					name: '消息',
					type: 'xiaoxi',
					icon: 'bell-fill',
					iconBackground: '#398c0c',
				}, {
					name: '收藏',
					type: 'favorites',
					icon: 'star-fill',
					iconBackground: '#398c0c',
				}, {
					name: '评论',
					type: 'photoAlbum',
					icon: 'more-circle-fill',
					iconBackground: '#5e2d88',
				}, {
					name: '点赞',
					type: 'cardPackage',
					icon: 'thumb-up-fill',
					iconBackground: '#33696c',
				}, {
					name: '设置',
					type: 'setUp',
					icon: 'setting-fill',
					iconBackground: '#3b2021',
				}, {
					name: '注销登录',
					type: 'logout',
					icon: 'zhuanfa',
					iconBackground: '#833456',
				}],
			}
		},
		methods: {
			...mapMutations(['setLogout']), // 注销登录
			onClick(item) {
				console.log('choose-', item.name)
				if (item.type === 'logout') this.handleLogout()
			},
			handleLogout() {
				this.setLogout()
				uni.removeStorageSync('uni-needCaptcha');
				uni.removeStorageSync('uni_id_token');
				uni.removeStorageSync('username');
				uni.removeStorageSync('login_type');
				uni.removeStorageSync('uni_id_has_pwd');
			},
			toLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f7f7f7;
		max-width: 100vw;
	}

	.personal {
		max-width: 100vw;
		/* #ifdef APP-PLUS */
		margin-top: var(--status-bar-height);
		/* #endif */
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0 40rpx 30rpx;
	}

	.personal-main {
		display: flex;
		align-items: center;
	}

	.personal-info {
		display: flex;
		flex-direction: column;
	}

	.u-avatar {
		margin-right: 30rpx;
	}

	.navbar-right {
		padding: 0 40rpx;
	}

	.navbar-right-icon {
		margin-left: 50rpx;
	}

	.hover-class {
		background-image: linear-gradient(to right, #eee, transparent);
		color: t;
		width: 99%;
	}

	.n-p {
		max-width: 100vw;
		display: flex;
		align-items: center;
		background-color: none;
		margin-bottom: 20rpx;
	}

	.p-right-icon {
		padding: 0 40rpx;
	}

	.p-left {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60rpx;
		height: 60rpx;
		padding: 10rpx;
		margin: 20rpx;
		color: #FFFFFF;
		border-radius: 20rpx;

	}

	.p-right {
		height: 90rpx;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.p-right-main {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.p-right-main-name {
		font-size: 36rpx;
		font-weight: 500;
	}

	.p-right-main-time {
		margin-right: 20rpx;
		font-size: 24rpx;
		color: #9d9d9d;
	}
</style>
