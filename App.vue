<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	@import "./style.scss";
</style>

<script>
	import {
		mapMutations
	} from 'vuex'
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 获取本地token
			let uniIdToken = uni.getStorageSync('uni_id_token')
			// 本地 token 与 数据库 token比对
			if (uniIdToken) {
				this.login(uni.getStorageSync('username'))
			}
			this.getUserInfo()
			checkUpdate() //更新升级
		},
		onShow: function() {
			// 调试使用 屏幕常亮
			// 已开启 WAKE_LOCK 权限
			// plus.device.setWakelock(true)
			// uni.setKeepScreenOn({
			// 	keepScreenOn: true,
			// 	success: (res) => {
			// 		console.log(res)
			// 		uni.showToast({
			// 			title: '已设置屏幕常亮'
			// 		})
			// 	},
			// 	fail: (error) => {
			// 		console.error(error)
			// 	}
			// })
			// plus.device.setWakelock();
			// plus.device.isWakelock();
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations(['login', 'logout']), // 验证登录 和 注销登录方法
			getUserInfo() {
				let that = this
				uniCloud.callFunction({
					name: 'uni-id-test',
					data: {
						action: 'getUserInfo',
					},
					success(res) {
						if (res.result.code == 0) {
							console.log("有效登录")
						} else {
							that.logout();
						}
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '请求云函数失败，请稍后再试'
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>
