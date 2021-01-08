<template>
	<view class="transaction">
		<cu-custom bgColor="bj-white">
			<block slot="left">
				<uni-icons type="arrowleft" size="30" style="margin-left:30upx" @click="tabPath"></uni-icons>
			</block>
			<block slot="content">
				<view class="my-btn" :class="{isSetProduct:typeView === 'option'}" @tap="setProduct('option')">期权</view>
				<view class="my-btn" :class="{isSetProduct:typeView === 'contract'}" @tap="setProduct('contract')">合约</view>
			</block>
			<block slot="right">
				<uni-icons type="home" size="30" style="margin-right:30upx"  @click="tabPath('home')"></uni-icons>
			</block>
		</cu-custom>
		<view class="echaer_box" :style="{height:styleHeight}">
			<view class="echaer_top">
				<view class="title">
					<view class="left">
						<uni-icons type="list" size="60"></uni-icons><text class="product">BTC</text>永续合约
					</view>
					<view class="right">
						<uni-icons type="star" size="40"></uni-icons>
					</view>
				</view>
				<view class="timeText">交易中<text>07-30</text>14:46:59</view>
				<view class="business businessTop">
					<text class="li">买价<text class="text up">1099.26</text></text>
					<text class="li">最低<text class="text">1099.26</text></text>
					<text class="li">涨跌幅<text class="text">-162.89(-1.46%)</text></text>
				</view>
				<view class="business businessBTm">
					<text class="li">卖价<text class="text dow">1099.26</text></text>
					<text class="li">最高<text class="text">1099.26</text></text>
					<text class="li" style="visibility:hidden">涨跌幅<text class="text">-162.89(-1.46%)</text></text>
				</view>
				<view class="line_bg"></view>
				<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
					<view class="cu-item" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in navList" :key="index" @tap="tabSelect"
					 :data-id="index">
						{{item.text}}
					</view>
				</scroll-view>
			</view>
			<contractChart />
		</view>
		<view class="echaer_btm">
			<view class="padding-xl bg-white">
				<button class="cu-btn bg-green">注册</button>
				<button class="cu-btn numIpt">10</button>
				<button class="cu-btn bg-red">登录</button>
			</view>
		</view>
	</view>
</template>
<script>
	import { mapState } from 'vuex'
	import contractChart from "../contractChart/index.vue"
	export default {
		name:'transaction',
		data() {
			return {
				CustomBar: this.CustomBar,
				StatusBar: this.StatusBar,
				TabCur: 0,
				scrollLeft: 0,
				navList: [{
						text: '1分钟',
						index: 0
					},
					{
						text: '5分钟',
						index: 1
					},
					{
						text: '15分钟',
						index: 2
					},
					{
						text: '日K',
						index: 3
					},
					{
						text: '周K',
						index: 4
					},
				],
			}
		},
		computed: {
			...mapState({
				typeView:(state) => state.typeView,
			}),
			styleHeight() {
				// #ifdef APP-PLUS
				let x = 280 + (this.CustomBar || 0)
				// #endif
				// #ifdef H5
				let x = 280
				// #endif
				let height = `calc(100% - ${x}upx)`
				return height
			}
		},
		mounted() {},
		methods: {
			setProduct(type){
				this.$store.commit('switchTypeView',type)
			},
			tabPath(type) {
				if(!type){
					let index = this.$common.getCache('tabIndex')
					this.$store.commit('switchTabIndex',index)
					return
				}
				this.$store.commit('switchTabIndex',type)
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
		},
		components: {
			contractChart
		}
	}
</script>


<style lang="scss" scoped>
	.transaction {
		height: 100%;
		background: #fff;
		.cu-custom{
			.cu-bar .content{
				.isSetProduct{
					color: #0066ED;
				}
				.my-btn{
					height: auto;
					padding: 13upx 38upx;
					border-radius: 0;
					border: 1px solid #E7EBEE;
					font-size: 28upx;
					background: #fff;
				}
			}
		}
		.contractChart{
			height: calc(100% - 300upx);
		}
		.echaer_box {
			overflow-y: auto;
			.echaer_top {
				width: 100%;
				height: 300upx;
				padding: 10upx 30upx 0;

				.title {
					font-size: 38upx;
					height: 78upx;
					display: flex;
					justify-content: space-between;

					.left,
					.right {
						display: flex;
						align-items: center;
						font-weight: bold;
					}

					.product {
						margin: 0 10upx;
					}
				}

				.timeText {
					font-size: 24upx;
					color: #0066ED;
					line-height: 33upx;

					uni-text {
						margin: 0 20upx;
					}
				}

				.businessTop {
					margin-top: 20upx;
				}

				.businessBTm {
					margin-bottom: 20upx;
				}

				.business {
					justify-content: space-between;
					display: flex;

					.li {
						font-size: 24upx;
						color: #8C9FAD;

						.text {
							margin-left: 30upx;
							color: #242830;
						}

						.up {
							color: #02AD8F;
						}

						.dow {
							color: #D14B63;
						}
					}
				}

				.line_bg {
					height: 10upx;
					margin-left: -30upx;
					margin-right: -30upx;
					background: #F7F7FA;
				}

				.nav {
					.uni-scroll-view {
						.uni-scroll-view-content {
							.cu-item {
								height: 67upx;
								line-height: 67upx;
								font-size: 28upx;
							}
						}
					}
				}
			}
		}

		.echaer_btm {
			width: 100%;
			height: 190upx;
			background: #fff;
			display: flex;
			justify-content: center;
			align-items: center;

			.padding-xl {
				width: 680upx;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 130upx;
				border-radius: 10px;
				box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.24);

				.cu-btn {
					width: 240upx;
					height: 80upx;
				}

				.numIpt {
					width: 100upx;
					height: 46upx;
					background: #E7EBEE;
					border-radius: 4px;
					margin: 0 20upx;
					color: #0066ED;
				}
			}
		}
	}
</style>
