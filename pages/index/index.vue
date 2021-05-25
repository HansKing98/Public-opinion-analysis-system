<template>
	<div>
		<vue-drawer-layout ref="drawer" :drawer-width="300" :enable="true" :animatable="true" :z-index="0"
			:drawable-distance="Math.floor(800/3)" :content-drawable="true" :backdrop="true"
			:backdrop-opacity-range="[0,0.4]">

			<div class="drawer-content" slot="drawer">
				<!-- drawer-content -->
				<my />
			</div>
			<div slot="content">
				<!-- main-content -->
				<div>
					<hot ref="hot"></hot>
				</div>
			</div>
		</vue-drawer-layout>
	</div>
</template>

<script>
	import hot from './hot.vue'
	import my from '../my/my.vue'
	export default {
		components: {
			hot,
			my
		},
		onReachBottom() {
			console.log(12)
		},
		onPullDownRefresh() {
			this.$refs['hot'].refresh()
		},
	}
</script>

<style scoped>

</style>
