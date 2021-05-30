<template>
	<view class="container">
		<view v-if="loading">
			<skeleton :loading="loading" avatarSize="80px" :row="2">
			</skeleton>
			<skeleton :loading="loading" :showAvatar="false" avatarSize="60px" :avatarShape="'square'" :row="2"
				:showTitle="true" :animate="true" v-for="(i,index) in 4" :key="index">
			</skeleton>
		</view>
		<view class="ui-all" v-else>
			<view class="avatar" @tap="avatarChoose">
				<view class="imgAvatar">
					<view class="iavatar" :style="'background: url('+headimg+') no-repeat center/cover #eeeeee;'">
					</view>
				</view>
				<text v-if="!uploadProgress">修改头像</text>
				<text v-else>{{uploadProgress==100 ? "上传成功，请保存修改" : `已经上传${uploadProgress}%`}}</text>
			</view>
			<view class="ui-list">
				<text>用户名</text>
				<u-toast ref="unableTips" />
				<text v-if="username" @click="unableTips('用户名不可修改')">{{username}}</text>
				<input v-if="!username" type="text" :placeholder="username_placeholder" :value="username_temp"
					@input="binduserName" placeholder-class="place" />
			</view>
			<view class="ui-list">
				<text>昵称</text>
				<input type="text" :placeholder="value" :value="nickname" @input="bindnickname"
					placeholder-class="place" />
			</view>
			<view class="ui-list">
				<!-- 已绑定手机号 -->
				<u-row gutter="16" v-if="mobile">
					<u-col span="2">
						<text style="margin-left: -5px;">手机号</text>
					</u-col>
					<u-col span="6">
						{{mobile}}
					</u-col>
					<u-col span="4">
						<u-button v-if="mobile" @click="mobile=''">修改手机号</u-button>
					</u-col>
				</u-row>
				<!-- 未绑定手机号 -->
				<u-row gutter="16" v-else>
					<u-col span="2">
						<text style="margin-left: -5px;">手机号</text>
					</u-col>
					<u-col span="6">
					</u-col>
					<u-col span="4">
						<u-toast ref="uToast" />
						<u-button size="mini">绑定手机</u-button>
					</u-col>
				</u-row>


			</view>
			<view class="ui-list right">
				<text>性别</text>
				<picker @change="bindPickerChange" mode='selector' range-key="name" :value="gender" :range="sex">
					<view class="uni-input">{{sex[gender]}}</view>
					<!-- <view class="picker">
						{{gender==1?'男':'女'}}
					</view> -->
				</picker>
			</view>
			<view class="ui-list right" @click="show = true">
				<text>地区</text>
				<u-picker v-model="show" mode="region" :default-selector='[12, 1201, 12016]'
					@confirm="bindRegionChange">
				</u-picker>
				{{region[0].label? `${region[2].label} ${region[1].label} ${region[0].label}`:'请选择'}}
			</view>
			<view class="ui-list right">
				<text>生日</text>
				<picker mode="date" :value="date" @change="bindDateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
			<view class="ui-list">
				<text>签名</text>
				<textarea :placeholder="value" placeholder-class="place" :value="description"
					@input="binddescription"></textarea>
			</view>
			<button class="save" @tap="savaInfo">保 存 修 改</button>
		</view>

	</view>
</template>

<script>
	export default {

		data() {
			return {
				skeleton1: {
					avatarSize: '40px',
					row: 1,
					showTitle: true,
					animate: true
				},
				loading: true,
				value: '请填写',
				sex: ['男', '女'],
				gender: 0, // 0男 1女
				region: [{
					value: 12016,
					label: '滨海新区'
				}, {
					value: 1201,
					label: '市辖区'
				}, {
					value: 12,
					label: '天津市'
				}],
				date: '请填写',
				description: '',
				url: '',
				uni_id: '',
				username: '',
				username_temp: '',
				username_placeholder: '手机用户',
				nickname: '',
				mobile: '',
				headimg: '',
				uploadProgress: '',
				show: false,
				isBinding: false,
				seconds: 60, // 验证码60s 可重发
				tips: '',
			}

		},
		methods: {
			unableTips(text) {
				this.$refs.unableTips.show({
					title: text,
					type: 'primary',
					position: 'top'
				})
			},
			codeChange(text) {
				this.tips = text;
			},
			// bindMobile() {
			// 	if (!(/^1[3456789]\d{9}$/.test(this.mobile_temp))) {
			// 		this.$refs.uToast.show({
			// 			title: '请输入正确手机号',
			// 			type: 'error',
			// 			position: 'top'
			// 		})
			// 		return false;
			// 	}
			// },
			bindPickerChange(e) {
				this.gender = e.detail.value;
				console.log(this.gender)
			},
			bindRegionChange(e) {
				console.log(e)
				// 省级
				this.region[0] = e.area;
				// 市级
				this.region[1] = e.city;
				// 区级
				this.region[2] = e.province;
			},
			bindDateChange(e) {
				this.date = e.detail.value;
				console.log(this.date)
			},
			bindnickname(e) {
				this.nickname = e.detail.value;
			},
			binduserName(e) {
				this.username_temp = e.detail.value;
			},
			// bindmobile(e) {
			// 	this.mobile_temp = e.detail.value;
			// },
			binddescription(e) {
				this.description = e.detail.value;

			},
			avatarChoose() {
				// 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
				console.log('avatarChoose')
				this.$u.route({
					// 关于此路径，请见下方"注意事项"
					url: '/pages/setting/u-avatar-cropper',
					// 内部已设置以下默认参数值，可不传这些参数
					params: {
						// 输出图片宽度，高等于宽，单位px
						destWidth: 300,
						// 裁剪框宽度，高等于宽，单位px
						rectWidth: 200,
						// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
						fileType: 'jpg',
					}
				})
			},
			avatarChoose2() {
				let that = this;
				// uni.chooseImage({
				// 	count: 1,
				// 	sizeType: ['original', 'compressed'],
				// 	sourceType: ['album', 'camera'],
				// 	success(res) {
				// 		// console.log("that.nickname", that.nickname);
				// 		// console.log("success res", res);
				// 		if (res.tempFilePaths.length > 0) {
				// 			let filePath = res.tempFilePaths[0]
				// 			console.log("filePath", filePath)
				// 			//进行上传操作
				// 			// callback方式，与promise方式二选一即可
				// 			uniCloud.uploadFile({
				// 				filePath: filePath,
				// 				// 换成 uni-id
				// 				cloudPath: that.nickname + "_avatar.jpg",
				// 				onUploadProgress: function(progressEvent) {
				// 					var percentCompleted = Math.round(
				// 						(progressEvent.loaded * 100) / progressEvent
				// 						.total
				// 					);
				// 					console.log("上传中：已上传", percentCompleted);
				// 					that.uploadProgress = percentCompleted
				// 				},
				// 				success(res) {
				// 					console.log("res", res)
				// 					that.headimg = res.fileID
				// 				},
				// 				fail(e) {
				// 					console.log(e)
				// 				},
				// 				complete() {}
				// 			});

				// 		}
				// 	}
				// });

			},
			getphonenumber(e) {

				if (e.detail.iv) {
					console.log(e.detail.iv) //传后台解密换取手机号
					uni.showToast({
						title: '已授权',
						icon: 'none',
						duration: 2000
					})
				}

			},
			savaInfo() {
				let that = this;
				let username_temp = that.username_temp;
				let nickname = that.nickname;
				let headimg = that.headimg;
				let gender = that.gender;
				let mobile = that.mobile;
				let region = that.region;
				let birthday = that.date;
				let description = that.description;
				let updata = {};
				if (!nickname) {
					uni.showToast({
						title: '请填写昵称',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				updata.nickname = nickname;
				if (!headimg) {
					headimg = that.headimg;
				}
				updata.headimg = headimg;
				updata.gender = gender;
				updata.username = username_temp;

				if (region.length == 1) {
					uni.showToast({
						title: '请选择常住地',
						icon: 'none',
						duration: 2000
					});
					return;
				} else {
					updata.area = region;
				}
				if (birthday == "0000-00-00") {
					uni.showToast({
						title: '请选择生日',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				updata.birthday = birthday;
				updata.description = description;
				that.updata(updata);
			},
			isPoneAvailable(poneInput) {
				var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
				if (!myreg.test(poneInput)) {
					return false;
				} else {
					return true;
				}
			},
			async updata(datas) {
				//传后台
				console.log("datas", datas)
				let that = this
				let params = {
					area: datas.area,
					birthday: datas.birthday,
					description: datas.description,
					gender: datas.gender,
					headimg: datas.headimg,
					nickname: datas.nickname
				}
				// 无用户名的 才更新用户名
				if (!this.username) {
					params.username = datas.username
				}
				uniCloud.callFunction({
					name: 'user-info',
					data: {
						action: 'updateUser',
						params
					},
					success(res) {
						uni.showModal({
							showCancel: false,
							content: JSON.stringify(res.result)
						})
						that.getUserInfo()
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '请求云函数失败，请稍后再试'
						})
					}
				})
			},
			getUserInfo() {
				let that = this
				uniCloud.callFunction({
					name: 'user-info',
					data: {
						action: 'getUserInfo',
					},
					success(res) {
						if (res.result.code == 0) {
							if (res.result.userInfo) {
								let info = res.result.userInfo
								console.log(info)
								that.nickname = info.nickname
								that.uni_id = info._id
								that.area = info.area
								that.birthday = info.birthday
								that.date = info.birthday ? info.birthday : "请填写"
								that.description = info.description
								if (info.gender !== undefined) that.gender = info.gender || 0 //找不到则选择第一个
								that.headimg = info.headimg
								that.mobile = info.mobile
								that.username = info.username
							}
						} else {
							// 30204 非法token
							// 30203 token 已过期，请重新登录
							uni.showToast({
								icon: 'none',
								title: res.result.msg + "，正在返回首页...",
								success: function(res) {
									setTimeout(function() {
										uni.navigateTo({
											url: '/pages/index/index'
										});
									}, 500);
								}
							});
						}
					},
					fail(e) {
						console.error(e)
						uni.showModal({
							showCancel: false,
							content: '请求云函数失败，请稍后再试',
							success: function(res) {
								setTimeout(function() {
									uni.navigateTo({
										url: '/pages/index/index'
									});
								}, 1000);
							}
						})
					},
					complete() {
						that.loading = false
					}
				})
			}
		},
		onLoad() {},
		created() {
			this.getUserInfo()
			// 监听从裁剪页发布的事件，获得裁剪结果
			uni.$on('uAvatarCropper', path => {
				this.headimg = path;
				// 可以在此上传到服务端
				// uni.uploadFile({
				// 	url: 'http://www.example.com/upload',
				// 	filePath: path,
				// 	name: 'file',
				// 	complete: (res) => {
				// 		console.log(res);
				// 	}
				// });
				let that = this
				uniCloud.uploadFile({
					filePath: path,
					// 换成 uni_id
					cloudPath: that.uni_id + "_avatar.jpg",
					onUploadProgress: function(progressEvent) {
						var percentCompleted = Math.round(
							(progressEvent.loaded * 100) / progressEvent
							.total
						);
						console.log("上传中：已上传", percentCompleted);
						that.uploadProgress = percentCompleted
					},
					success(res) {
						console.log("res", res)
					},
					fail(e) {
						console.log(e)
					},
					complete() {}
				});
			})
		},

	}
</script>

<style scoped>
	.container {
		display: block;
		width: 100%;
		background-color: white;
	}
</style>
<style lang="scss">
	.ui-all {
		padding: 20rpx 40rpx;

		.avatar {
			width: 100%;
			text-align: left;
			padding: 20rpx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;

			.imgAvatar {
				width: 140rpx;
				height: 140rpx;
				border-radius: 50%;
				display: inline-block;
				vertical-align: middle;
				overflow: hidden;

				.iavatar {
					width: 100%;
					height: 100%;
					display: block;
				}
			}

			text {
				display: inline-block;
				vertical-align: middle;
				color: #8e8e93;
				font-size: 28rpx;
				margin-left: 40rpx;
			}

			&:after {
				content: ' ';
				width: 20rpx;
				height: 20rpx;
				border-top: solid 1px #030303;
				border-right: solid 1px #030303;
				transform: rotate(45deg);
				-ms-transform: rotate(45deg);
				/* IE 9 */
				-moz-transform: rotate(45deg);
				/* Firefox */
				-webkit-transform: rotate(45deg);
				/* Safari 和 Chrome */
				-o-transform: rotate(45deg);
				position: absolute;
				top: 85rpx;
				right: 0;
			}
		}

		.ui-list {
			width: 100%;
			text-align: left;
			padding: 20rpx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;

			text {
				color: #4a4a4a;
				font-size: 28rpx;
				display: inline-block;
				vertical-align: middle;
				min-width: 150rpx;
			}

			input {
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
			}

			// button {
			// 	color: #030303;
			// 	font-size: 30rpx;
			// 	display: inline-block;
			// 	vertical-align: middle;
			// 	background: none;
			// 	margin: 0;
			// 	padding: 0;

			// 	&::after {
			// 		display: none;
			// 	}
			// }

			picker {
				width: 90%;
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
				position: absolute;
				top: 30rpx;
				left: 150rpx;
			}

			textarea {
				color: #030303;
				font-size: 30rpx;
				vertical-align: middle;
				height: 150rpx;
				width: 100%;
				margin-top: 50rpx;
			}

			.place {
				color: #999999;
				font-size: 28rpx;
			}
		}

		.right:after {
			content: ' ';
			width: 20rpx;
			height: 20rpx;
			border-top: solid 1px #030303;
			border-right: solid 1px #030303;
			transform: rotate(45deg);
			-ms-transform: rotate(45deg);
			/* IE 9 */
			-moz-transform: rotate(45deg);
			/* Firefox */
			-webkit-transform: rotate(45deg);
			/* Safari 和 Chrome */
			-o-transform: rotate(45deg);
			position: absolute;
			top: 40rpx;
			right: 0;
		}

		.save {
			background: #030303;
			border: none;
			color: #ffffff;
			margin-top: 40rpx;
			font-size: 28rpx;
		}
	}
</style>
