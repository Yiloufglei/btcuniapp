<script>
	import Vue from 'vue'
	import { mapState } from 'vuex'
	export default {
		computed: {
			...mapState({
				themeColor:(state) => state.themeColor,
				language:(state) => state.language,
			}),
		},
		watch:{
			themeColor:function(e){
				this.$common.setNaviBarColor()
			}
		},
		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
		
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		
		
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})
		
			let themeColor = uni.getStorageSync('colorTheme') || "black";
			let language = uni.getStorageSync('language') || "zh";
			let token = uni.getStorageSync('token');
			this.$common.setthemeColor(themeColor);
			this.$common.setLanguage(language);
			console.log(token,'token')
			if(token){
				this.$store.dispatch("getUserDetail");
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
<style lang="scss">
@import "@/static/css/index.scss";

</style>
