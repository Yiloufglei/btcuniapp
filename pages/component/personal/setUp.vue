<!-- 设置页面 -->
<template>
	<view class="setup"  :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<view class="min_bj min_body">
			<cu-custom bgColor="bj-white">
				<block slot="left">
					<uni-icons  type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
				</block>
				<block slot="content">{{$t('setup.setup')}}</block>
			</cu-custom>
			<view class="li_list whiteColor min_bj">
				<view class="li_i border_btm">
					<view>{{$t('setup.Language')}}</view>
					<image @click="languageSelect('zh')" v-if="language == 'en'" src="../../../static/img/USA.jpg" mode=""></image>
					<image @click="languageSelect('en')" v-else src="../../../static/img/China.jpg" mode=""></image>
				</view>
				<view class="li_i border_btm"><view>{{$t('setup.ModeSwitching')}}</view><switch   class='orange radius black' @change="SwitchD" :class="switchD?'checked':''" :checked="switchD?true:false"></switch></view>
				<view class="li_i border_btm"><view>{{$t('setup.edition')}}</view><uni-icons   type="arrowright" size="30"></uni-icons></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'setup',
		data() {
			return {
				switchD:false
			}
		},
		computed: {
			...mapState({
				themeColor:(state) => state.themeColor,
				language:(state) => state.language,
			}),
		},
		onShow() {
			this.$nextTick(function() {
				this.$common.setNaviBarColor()
			})
		},
		onLoad() {
			this.switchD = uni.getStorageSync('colorTheme') == 'black' ? true : false
		},
		methods: {
			languageSelect(type){
				this.$i18n.locale = type;
				this.$common.setLanguage(type);
			},
			tabPath(){
				let index = this.$common.getCache('tabIndex')
				this.$store.commit('switchTabIndex',index)
				uni.navigateTo({
					url: '/pages/index/index',
				});
			},
			SwitchD(e) {
				this.switchD = e.detail.value
				let themeColor = e.detail.value ?  "black" : 'white';
				this.$common.setthemeColor(themeColor);
			},
		}
	}
</script>

<style lang="scss" scoped>
.setup{
	height: 100%;
	.min_body{
		min-height: 100%;
	}
}
</style>
