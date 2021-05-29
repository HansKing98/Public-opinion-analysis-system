<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input type="text" focus clearable v-model="username" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
			<view class="input-row">
				<text class="title">确认密码：</text>
				<m-input type="password" displayable v-model="confirmPassword" placeholder="请确认密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="register">注册并登录</button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import mInput from '../../components/m-input.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			mInput,
		},
		data() {
			return {
				username: '',
				password: '',
				confirmPassword: ''
			}
		},
		methods: {
			...mapMutations(['login']),
			toMain(username) {
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				console.log('toMain:', username)
				uni.reLaunch({
					url: '../my/my',
				});
			},
			async register() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				if (this.username.length < 3) {
					uni.showToast({
						icon: 'none',
						title: '账号最短为 3 个字符'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				if (this.password !== this.confirmPassword) {
					uni.showToast({
						icon: 'none',
						title: '两次密码输入不一致'
					});
					return;
				}

				const data = {
					username: this.username,
					password: this.password
				}
				let that = this
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'register',
						params: data
					},
					success(res) {
						// console.log("注册", res);

						if (res.result.code === 0) {
							// code 0 注册成功
							uni.showToast({
								title: res.result.msg
							});
							uni.setStorageSync('uni-needCaptcha', false) // 不需要验证登录状态
							uni.setStorageSync('uni_id_token', res.result.token)
							uni.setStorageSync('username', res.result.username)
							uni.setStorageSync('login_type', 'online')
							uni.setStorageSync('uni_id_has_pwd', true)

						} else if (res.result.code == 20102) {
							// code: 20102,message: "用户名已存在"

							that.$refs.uToast.show({
								title: res.result.msg,
								type: 'default',
							})
						} else {
							uni.showModal({
								content: JSON.stringify(res.result),
								showCancel: false
							})
						}
					},
					fail(e) {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		font-size: 12px;
		display: flex;
		flex: 1;
		flex-direction: column;
		background-color: #efeff4;
		padding: 10px;
	}
</style>
