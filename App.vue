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
			// if (uniIdToken) {
			// 	this.login(uni.getStorageSync('username'))
			// }
			this.getUserInfo()
			checkUpdate() //更新升级
		},
		onShow: function() {

		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations(['login', 'logout', 'setUserInfo']), // 验证登录 和 注销登录方法
			getUserInfo() {
				// 通过比对 token 检查用户登录信息
				let that = this
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'getUserInfo',
					},
					success(res) {
						// token 比对成功返回用户信息
						console.log("getUserInfo", res.result)
						if (res.result.code == 0) {
							console.log("有效登录")
							// 存储 Vuex 
							// let name = uni.getStorageSync('userInfo')
							that.setUserInfo({
								...res.result.userInfo
							})
						} else {
							that.logout();
							console.log("登录失效或未登录")
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
