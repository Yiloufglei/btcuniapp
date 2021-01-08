<template>
	<view class="option_view">
		option_view
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
		computed: {
			...mapState({
				typeView: (state) => state.typeView,
			}),
		},
		methods: {

		},
		components: {
		}
	}
</script>

<style lang="scss" scoped>

</style>
