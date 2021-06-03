<template>
	<view class="contanier">
		<skeleton :loading="loading" :showAvatar="false" avatarSize="80px" :row="1" v-for="i in 10"></skeleton>
		<view class="box" @click="onClick(item)" v-for="(item,index) in listData">
			<hm-sms-list-card :options="item"></hm-sms-list-card>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import HmSmsListCard from '@/components/hm-sms-list-card/index.vue'

	export default {
		computed: mapState(['hasLogin', 'userInfo']),
		components: {
			HmSmsListCard
		},
		data() {
			return {
				listData: [],
				loading: true
			}
		},
		methods: {
			onClick(item) {
				console.log('onClick', item.paybak);
				uni.navigateTo({
					url: '/pages/analysis/analysis?hotword=' + item.paybak
				});
			},
			getFavoList(user_id) {
				console.log('2user_id', this.userInfo._id)

				let that = this
				return new Promise((resolve, reject) => {

					uniCloud.callFunction({
						name: 'get-comment-praise-list',
						data: {
							user_id
						}
					}).then((res) => {
						console.log('ress', res.result.data)
						this.listData = res.result.data.map(el => {
							return {
								desc: `${this.$options.filters['timefliter'](el.created_date)} 赞了 ${el.commentInfo[0].comment_content} 这条评论`,
								paybak: el.commentInfo[0].news_hotword,
								txt: this.$options.filters['timefliter'](el.created_date)
							}
						})
						this.loading = false
					})
				})
			}
		},
		onShow() {
			console.log("_id", this.userInfo._id)
			console.log("hasLogin2", this.hasLogin)

			this.getFavoList(this.userInfo._id)
		},
	}
</script>

<style lang="scss" scoped>
	.box {
		background-color: #f9f9f9;
	}
</style>
