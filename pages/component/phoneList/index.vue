<template>
	<view class="phoneList"  :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<cu-custom bgColor="bj-white">
			<block slot="left">
				<uni-icons type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
			</block>
			<block slot="content">选择手机区号</block>
		</cu-custom>
		<view class="cu-bar bg-white search fixed min_bj" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form">
				<uni-easyinput v-model="val" placeholder="输入搜索的关键词"></uni-easyinput>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-green shadow-blur" @click="search">搜索</button>
			</view>
		</view>
		<scroll-view scroll-y class="indexes" scroll-into-view="indexes" :style="[{height:'calc(100vh - '+ CustomBar + 'px - 50px)'}]"
		 :scroll-with-animation="true" :enable-back-to-top="true">
			<block v-for="(item,index) in mobileAreaList" :key="index">
				<view class="indexItem min_bj bb" :data-index="item.name" @click="listClick(item)">
					<view class="itemBody">
						<view class="content">
							<view class="ts">{{item.countriesCn}}</view>
							<view class="ds">{{item.countriesEn}}</view>
						</view>
						<view class="cs round">+{{item.countriesCode}}</view>
					</view>
				</view>
			</block>
		</scroll-view>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex'
	import mobileAreaList from "@/pages/common/mobileArea.js";
	export default {
		data() {
			return {
				val:'',
				mobileAreaList:mobileAreaList,
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
			};
		},
		computed: {
			...mapState({
				themeColor: (state) => state.themeColor,
				userInfo: (state) => state.userInfo,
				security: (state) => state.security,
			}),
		},
		onReady() {
			
		},
		methods: {
			listClick(item){
				this.$common.setCache('mobileArea',item)
				uni.navigateBack({
					delta:1
				})
			},
			tabPath() {
				uni.navigateBack({
					delta:1
				})
			},
			search(){
				let list = []
				let data = mobileAreaList
				if(this.val){
					let _search = this.val.toLowerCase();
					let newListData = []; // 用于存放搜索出来数据的新数组
					if (_search) {
						data.filter(item => {
							if (
								item.countriesCn.indexOf(_search) !== -1 ||
								item.countriesEn.toLowerCase().indexOf(_search) !== -1 ||
								item.countriesCode.indexOf(_search) !== -1
							) {
								newListData.push(item);
							}
						}) 
					}
					list = newListData
				}else{
					list = mobileAreaList
				}
				this.mobileAreaList = list
			}
		}
	}
</script>

<style lang="scss" scoped>
page{
	padding-top: 100upx;
	.cu-avatar{
		font-size: initial;
	}
	.indexItem{
		padding: 10upx 20upx;
		.itemBody{
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
}
</style>
