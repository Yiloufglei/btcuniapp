<template>
	<!-- 中心处理文件 -->
	<view class="app_index" :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<!-- 首页 -->
		<home v-if="tabIndex=='home'"></home>
		<!-- 资产 -->
		<assets v-if="tabIndex=='assets'"></assets>
		<!-- 团队 -->
		<team v-if="tabIndex=='team'"></team>
		<!-- 我的 -->
		<personal v-if="tabIndex=='personal'"></personal>
		<!-- 交易 -->
		<transaction v-if="tabIndex=='transaction'"></transaction>
		<view class="cu-bar tabbar  bg-white foot shadow min_bj ds" v-if="tabIndex != 'transaction'">
			<view class="action" @click="NavChange"  data-cur="home">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/img/home' + [tabIndex=='home'?'HL':''] + '.png'"></image>
				</view>
				<view :class="tabIndex == 'home' ? 'cs' : ''">首页</view>
			</view>
			<view class="action" @click="NavChange"  data-cur="assets">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/img/assets' + [tabIndex=='assets'?'HL':''] + '.png'"></image>
				</view>
				<view :class="tabIndex == 'assets' ? 'cs' : ''">资产</view>
			</view>
			<view class="action" @click="NavChange"  data-cur="transaction">
				<view class="action text-gray add-action">
					<view class='cuIcon-cu-image'>
						<image :src="'/static/img/transaction' + [tabIndex=='transaction'?'HL':''] + '.png'"></image>
					</view>
				</view>
				<view>交易</view>
			</view>
			<view class="action" @click="NavChange"  data-cur="team">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/img/team' + [tabIndex=='team'?'HL':''] + '.png'"></image>
				</view>
				<view :class="tabIndex == 'team' ? 'cs' : ''">团队</view>
			</view>
			<view class="action" @click="NavChange"  data-cur="personal">
				<view class='cuIcon-cu-image'>
					<image :src="'/static/img/personal' + [tabIndex=='personal'?'HL':''] + '.png'"></image>
				</view>
				<view :class="tabIndex == 'personal' ? 'cs' : ''">我的</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import home from "@/pages/component/home/index.vue"
	import assets from "@/pages/component/assets/index.vue"
	import team from "@/pages/component/team/index.vue"
	import personal from "@/pages/component/personal/index.vue"
	import transaction from "@/pages/component/transaction/index.vue"
	export default {
		name:'app_index',
		data() {
			return {}
		},
		computed: {
			...mapState({
				tabIndex:(state) => state.tabIndex,
				themeColor:(state) => state.themeColor,
			}),
		},
		onShow() {
			this.$nextTick(function() {
				this.$common.setNaviBarColor()
			})
		},
		mounted() {
			let tabIndex = this.$common.getCache('tabIndex') || 'home'
			this.$common.setCache('tabIndex',tabIndex)
			this.$store.commit('switchTabIndex',tabIndex)
		},
		methods: {
			NavChange: function(e) {
				if(e.currentTarget.dataset.cur !== 'transaction'){
					this.$common.setCache('tabIndex',e.currentTarget.dataset.cur)
				}
				this.$common.setCache('tabIndex',e.currentTarget.dataset.cur)
				this.$store.commit('switchTabIndex',e.currentTarget.dataset.cur)
			}
		},
		components:{
			home,
			assets,
			team,
			personal,
			transaction
		}
	}
</script>

<style lang="scss" scoped>
.app_index{
    height: 100%;
}
</style>
