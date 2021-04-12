<template>
	<view class="leo-list">
		<template v-if="sycnList">
			<view class="uni-flex uni-row leo-align-items-center leo-space-between leo-list-item"
				v-for="(item, index) in list" :key="index" @click="check(item.hotword)">
				<view class="uni-flex uni-row leo-align-items-center">
					<view class="leo-align-items-center" v-if="item.isHuati" style="padding-right: 30rpx;">
						<image class="icon" :style="{'border-radius': + borderRadius + 'rpx'}" :src="item.portrait"
							mode="">
						</image>
					</view>
					<view class="">
						<view class="text-line-height-1 text-16 pingfangbold leo-ellipsis-1">
							{{ item.hotword || "暂无数据"}}
						</view>
						<view class="text-line-height-1 pingfangmedium text-12 leo-ellipsis-1"
							style="margin-top: 16rpx; color: rgba(156,164,169,1);">
							{{ item.rc_head_data || "暂无数据"}}
						</view>
					</view>
				</view>
				<view class="" v-if="showArrow">
					<uni-icons :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
				</view>
			</view>
		</template>
		<template v-else>
			<view class="" style="text-align: center;">
				暂无数据
			</view>
		</template>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				sycnList: []
			}
		},
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
			borderRadius: {
				type: [Number, String],
				default: 0
			},
			showArrow: {
				type: Boolean,
				default: true
			},
			showIcon: {
				type: Boolean,
				default: true
			}
		},

		watch: {
			list(n, o) { //n为新值,o为旧值;
				this.sycnList = n;
				this.loading = false
			}
		},

		methods: {
			check(hotword) {
				let params = {hotword}
				let url = '../../pages/analysis/analysis?hotword='
				this.pageTo(url, params)
				console.log("跳转到钻取页面", hotword);
			},
			pageTo(url, params) {
				const {
					hotword
				} = params
				//在起始页面跳转到test.vue页面并传递参数
				uni.navigateTo({
					url: url + hotword
				});
			}
		},
		mounted() {
			this.sycnList = this.list;
		}
	}
</script>

<style lang="scss" scoped>
	.leo-list {

		.leo-list-item {
			padding: 36rpx 0rpx;
			border-top: #e4e7ed 2rpx solid;

			&:first-child {
				border-top: #e4e7ed 0rpx solid;
			}

			.icon {
				display: block;
				width: 64rpx;
				height: 64rpx;
			}
		}
	}

	.uni-flex {
		display: flex;
		flex-direction: row;
	}

	.uni-flex-item {
		flex: 1;
	}

	.uni-row {
		flex-direction: row;
	}

	.uni-column {
		flex-direction: column;
	}

	.leo-align-items-center {
		align-items: center;
	}

	.leo-space-between {
		justify-content: space-between;
	}

	.text-line-height-1 {
		line-height: 1 !important;
	}

	.text-12 {
		font-size: 24rpx !important;
	}

	.leo-ellipsis-1 {
		display: -webkit-box;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
	}
</style>
