<template>
	<view class="contract_view">
		<web-view src="/hybrid/html/local.html"></web-view>
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
		onTabItemTap(e){
			// uni.hideTabBar()
		},
		mounted() {
			// #ifdef APP-PLUS || H5
			var height = 0; //定义动态的高度变量，如高度为定值，可以直接写
			uni.getSystemInfo({
				//成功获取的回调函数，返回值为系统信息
				success: (sysinfo) => {
					height = sysinfo.windowHeight - 68; //自行修改，自己需要的高度
				},
				complete: () => {},
			});
				// #ifdef APP-PLUS
					var pages = getCurrentPages();
					var page = pages[pages.length - 1];
					var currentWebview = page.$getAppWebview();
					var wv = currentWebview.children()[0];
					wv.setStyle({ //设置web-view距离顶部的距离以及自己的高度，单位为px
						top: 68,
						height: height
					})
				// #endif
			// #endif
		},
		computed: {
			...mapState({
				typeView: (state) => state.typeView,
			}),
		},
		components: {
		}
	}
</script>

<style lang="scss">
	.contract_view {}
</style>
