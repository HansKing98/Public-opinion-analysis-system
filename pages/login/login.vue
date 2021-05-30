<template>
	<view class="content">
		<view class="login-type">
			<view v-for="(item,index) in loginTypeList" :key="index" @click="loginType = index"
				:class="{act: loginType === index}" class="login-type-btn">{{item}}</view>
		</view>
		<view class="input-group" v-if="loginType === 1">
			<view class="input-row">
				<text class="title">手机：</text>
				<m-input class="m-input" type="text" clearable focus v-model="mobile" placeholder="请输入手机号码"></m-input>
			</view>
			<view class="input-row">
				<text class="title">验证码：</text>
				<m-input type="text" v-model="code" placeholder="请输入验证码"></m-input>
				<view class="send-code-btn" @click="sendSmsCode">{{codeDuration ? codeDuration + 's' : '发送验证码' }}</view>
			</view>
		</view>
		<view class="input-group" v-else>
			<view class="input-row">
				<text class="title">账号：</text>
				<m-input class="m-input" type="text" clearable focus v-model="username" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
			<view v-if="needCaptcha" class="input-row">
				<text class="title">验证码：</text>
				<m-input type="text" v-model="captchaText" placeholder="请输入验证码"></m-input>
				<view class="send-code-btn captcha-view" @click="captcha('refreshCaptcha')">
					<i v-if="captchaing" class="uni-icon_toast uni-loading"></i>
					<img v-if="!captchaing" :src="captchaBase64" width="100%" height="100%"></img>
				</view>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" :loading="loginBtnLoading" @tap="bindLogin">登录</button>
		</view>
		<view class="action-row">
			<navigator url="../login/reg">注册账号</navigator>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import mInput from '../../components/m-input.vue'
	import {
		univerifyLogin,
		univerifyErrorHandler
	} from '@/common/univerify.js'
	import {
		getDeviceUUID
	} from '@/common/utils.js'

	let weixinAuthService;
	const captchaOptions = {
		deviceId: getDeviceUUID(),
		scene: 'login'
	}

	export default {
		components: {
			mInput
		},
		data() {
			return {
				loginType: 0,
				loginTypeList: ['密码登录', '免密登录'],
				mobile: '',
				code: '',
				username: '',
				password: '',
				positionTop: 0,
				isDevtools: false,
				codeDuration: 0,
				loginBtnLoading: false,
				needCaptcha: uni.getStorageSync('uni-needCaptcha'),
				captchaing: false,
				captchaBase64: '',
				captchaText: ''
			}
		},
		computed: mapState(['forcedLogin', 'hasLogin', 'univerifyErrorMsg', 'hideUniverify']),
		onLoad() {
			if (this.needCaptcha) {
				this.captcha('createCaptcha')
			}
		},
		methods: {
			...mapMutations(['login']),
			navBack() {
				uni.navigateBack({
					delta: 1 //返回一层
				});
			},
			toMain(username) {
				console.log("toMain")
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				// uni.reLaunch({
				// 	url: '../my/my',
				// });

				// 无需强制登录，不登录不能进行相关操作即可
				this.navBack()
			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			sendSmsCode() {
				if (this.codeDuration) {
					// 距离上次验证码获取时间60s内
					this.$refs.uToast.show({
						title: `请在${this.codeDuration}秒后重试`,
						position: "top"
					})
					return
				}
				if (!/^1\d{10}$/.test(this.mobile)) {
					this.$refs.uToast.show({
						title: "手机号码填写错误",
						type: "error",
						position: "top"
					})
					return
				}
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'sendSmsCode',
						params: {
							mobile: this.mobile,
							type: 'login'
						}
					},
					success: (res) => {
						if (res.result.code == 0) {
							// code: 0, message: "验证码获取成功"
							uni.showModal({
								title: "提示",
								content: '验证码发送成功，请注意查收',
								showCancel: false
							})
							this.codeDuration = 60
							this.codeInterVal = setInterval(() => {
								this.codeDuration--
								if (this.codeDuration === 0) {
									if (this.codeInterVal) {
										clearInterval(this.codeInterVal)
										this.codeInterVal = null
									}
								}
							}, 1000)
						} else {
							uni.showModal({
								content: '验证码发送失败：' + res.result.msg,
								showCancel: false
							})
						}

					},
					fail(e) {
						uni.showModal({
							content: '验证码发送失败',
							showCancel: false
						})
					}
				})
			},
			async loginByPwd() {
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
				const data = {
					username: this.username,
					password: this.password,
					captcha: this.captchaText,
					...captchaOptions
				};
				this.loginBtnLoading = true
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'login',
						params: data
					},
					success: (res) => {
						console.log('登录成功：', res.result)
						if (res.result.code == 0) {
							// code:0,msg:"登录成功"
							this.needCaptcha = false;
							uni.setStorageSync('uni-needCaptcha', this.needCaptcha)
							uni.setStorageSync('uni_id_token', res.result.token) // 这条有用
							uni.setStorageSync('username', res.result.username)
							uni.setStorageSync('login_type', 'online')
							uni.setStorageSync('uni_id_has_pwd', true)
							// this.vuex_user.hasLogin = true
							// this.vuex_user.userName = this.username
							uni.showToast({
								title: res.result.msg
							});
							this.toMain(this.username);
						} else if (res.result.code == 10101) {
							// 
							this.$refs.uToast.show({
								title: res.result.msg,
								type: 'default',
							})
						} else {
							uni.showModal({
								title: '提示',
								content: res.result.message,
								showCancel: false
							})
							this.needCaptcha = res.result.needCaptcha;
							uni.setStorageSync('uni-needCaptcha', this.needCaptcha)
							if (this.needCaptcha) {
								this.captcha('createCaptcha')
							}
						}
					},
					fail: (e) => {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					},
					complete: () => {
						this.loginBtnLoading = false
					}
				})
			},
			loginBySms() {
				if (!/^1\d{10}$/.test(this.mobile)) {
					this.$refs.uToast.show({
						title: "手机号码填写错误",
						type: "error",
						position: "top"
					})
					return
				}
				if (!/^\d{6}$/.test(this.code)) {
					this.$refs.uToast.show({
						title: '验证码为6位纯数字',
						type: "primary",
						position: "top"
					})
					return;
				}

				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'loginBySms',
						params: {
							mobile: this.mobile,
							code: this.code
						}
					},
					success: (res) => {

						console.log('login success', res);

						if (res.result.code == 0) {
							// code:0,msg:"登录成功"
							const username = res.result.username || '手机用户'
							this.needCaptcha = false
							uni.setStorageSync('uni-needCaptcha', this.needCaptcha)
							uni.setStorageSync('uni_id_token', res.result.token)
							uni.setStorageSync('username', username)
							uni.setStorageSync('login_type', 'online')


							this.toMain(username);
							uni.showToast({
								title: res.result.msg
							});
						} else {
							// code 10002 message: "验证码不可为空"
							// code 50202 msg:"验证码错误或已失效"
							uni.showModal({
								content: res.result.msg,
								showCancel: false
							})

							console.log('登录失败', res);
						}

					},
					fail(e) {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					}
				})
			},
			bindLogin() {
				switch (this.loginType) {
					case 0:
						this.loginByPwd()
						break;
					case 1:
						this.loginBySms()
						break;
					default:
						break;
				}
			},
			loginLocal(nickName) {
				uni.setStorageSync('login_type', 'local')
				uni.setStorageSync('username', nickName)
				this.toMain(nickName);
			},
			async captcha(action, args) {
				if (this.captchaing) return;

				// 验证不loading
				this.captchaing = true;

				let {
					result: res
				} = await uniCloud.callFunction({
					name: 'user-center',
					data: {
						action,
						params: {
							...captchaOptions,
							...args
						}
					}
				})
				this.captchaing = false;
				if (res.code === 0) {
					this.captchaBase64 = res.captchaBase64
				} else {
					uni.showToast({
						icon: 'none',
						title: res.message,
						duration: 1000
					})
				}
				return res;
			},
			openAppleLoginDoc() {
				// #ifdef APP-PLUS
				plus.webview.open('https://ask.dcloud.net.cn/article/36651')
				// #endif
			}
		},
		onReady() {
			this.initPosition(); // 抬起键盘
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

	.uni-input {
		border: none !important;
		margin-top: 15px;
	}

	.login-type {
		display: flex;
		justify-content: center;
	}

	.login-type-btn {
		line-height: 30px;
		margin: 0px 15px;
	}

	.login-type-btn.act {
		color: #0FAEFF;
		border-bottom: solid 1px #0FAEFF;
	}

	.send-code-btn {
		width: 120px;
		text-align: center;
		background-color: #0FAEFF;
		color: #FFFFFF;
	}

	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.action-row navigator {
		color: #007aff;
		padding: 0 10px;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.oauth-image {
		position: relative;
		width: 50px;
		height: 50px;
		border: 1px solid #dddddd;
		border-radius: 50px;
		background-color: #ffffff;
	}

	.oauth-image image {
		width: 30px;
		height: 30px;
		margin: 10px;
	}

	.oauth-image button {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}

	.captcha-view {
		line-height: 0;
		justify-content: center;
		align-items: center;
		display: flex;
		position: relative;
		background-color: #f3f3f3;
	}
</style>
