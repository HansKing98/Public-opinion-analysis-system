<template>
	<view class="contanier">
		<view @click="onClick(item)" v-for="(item,index) in listData" >
			<hm-sms-list-card :options="item" ></hm-sms-list-card>
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
			}
		},
		methods: {
			onClick(item) {
				console.log('onClick', item.paybak);
				uni.navigateTo({
					url: '/pages/analysis/analysis?hotword='+item.paybak
				});
			},
			getFavoList(user_id) {
				console.log('2user_id', this.userInfo._id)

				let that = this
				return new Promise((resolve, reject) => {

					uniCloud.callFunction({
						name: 'get-comment-list',
						data: {
							user_id
						}
					}).then((res) => {
						console.log('ress', res.result.data)
						this.listData = res.result.data.map(el => {
							return {
								desc: `${this.$options.filters['timefliter'](el.comment_date)} 发表了评论 ${el.comment_content}`,
								paybak: el.news_hotword,
								txt: this.$options.filters['timefliter'](el.comment_date)
							}
						})
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
	page {
		background-color: #f3f3f3;
	}
</style>
