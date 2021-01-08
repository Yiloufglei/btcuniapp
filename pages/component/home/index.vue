<template>
	<view class="homeView">
		<cu-custom bgColor="bj-white"> <block slot="content">首页</block> </cu-custom>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
			}
		},
		components: {
		},
		computed: {
			...mapState({}),
		},
		mounted() {
		},
		methods: {
		},
	}
</script>

<style lang="scss" scoped>

</style>
