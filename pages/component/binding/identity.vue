<!-- 身份绑定认证 -->
<template>
	<view class="identity"  :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<view class="min_bj identity_body">
			<cu-custom bgColor="bj-white">
				<block slot="left">
					<uni-icons type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
				</block>
				<block slot="content">身份绑定</block>
			</cu-custom>
			<view class="identity_center">
				
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'identity',
		data() {
			return {

			}
		},
		computed: {
			...mapState({
				themeColor:(state) => state.themeColor,
			}),
		},
		methods: {
			tabPath(){
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.identity{
	height: 100%;
	.identity_body{
		.identity_center{
			
		}
	}
}
</style>
