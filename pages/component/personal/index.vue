<template>
	<view class="personal frame_bj">
		<cu-custom bgColor="bj-white"> <block slot="content">个人中心</block> </cu-custom>
		<view class="header_box whiteColor mbt min_bj">
			<view class="cu-avatar round margin-left" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big81005.jpg);"></view>
			<view v-if="!judgeSignIn"><text @click="routerPath('/signUp/signIn')">登录</text><text class="centenr">|</text><text @click="routerPath('/signUp/register')">注册</text></view>
			<view v-else class="login_body">
				<view class="nickName ms">
					{{userInfo.nickName || ""}}
				</view>
				<view class="grade ds">
					安全等级：{{securityLevel}}
				</view>
				<view class="cu-progress round xs striped" :class="'bg-' + color">
					<view class="bg-green" :style="[{ width:stripedWidth}]"></view>
				</view>
				<view class="title sell">
					为了您的资产安全，请尽快绑定安全验证！
				</view>
			</view>
		</view>
		<view class="li_list whiteColor mbt min_bj">
			<view class="li_i border_btm"><view>手机</view>
				<view class="right">
					<text class="bindText" v-if="userInfo.phone">{{$common.substrHandle(userInfo.phone)}}</text>
					<text class="cs" @click="routerPath('/binding/phone','usual')" v-if="!userInfo.phone">绑定</text>
					<text class="cs" @click="routerPath('/binding/phone','usual')" v-if="userInfo.phone">重置</text>
					<uni-text class="lg text-gray cuIcon-titles" v-if="userInfo.phone"></uni-text>
					<text class="cs" v-if="userInfo.phone">关闭</text>
				</view>
			</view>
			<view class="li_i border_btm">
				<view>邮箱</view>
				<view class="right">
					<text class="bindText" v-if="userInfo.email">{{$common.substrHandle(userInfo.email)}}</text>
					<text class="cs" @click="routerPath('/binding/email','usual')" v-if="!userInfo.email">绑定</text>
					<text class="cs" @click="routerPath('/binding/email','usual')" v-if="userInfo.email">重置</text>
					<uni-text class="lg text-gray cuIcon-titles" v-if="userInfo.email"></uni-text>
					<text class="cs" v-if="userInfo.email">关闭</text>
				</view>
			</view>
			<view class="li_i border_btm">
				<view>谷歌验证码</view>
				<view class="right">
					<text class="cs" @click="routerPath('/binding/google','usual')" v-if="!userInfo.googleSecret">绑定</text>
					<text class="cs" @click="routerPath('/binding/google','usual')" v-if="userInfo.googleSecret">重置</text>
					<uni-text class="lg text-gray cuIcon-titles" v-if="userInfo.googleSecret"></uni-text>
					<text class="cs" v-if="userInfo.googleSecret">关闭</text>
				</view>
			</view>
		</view>
		<view class="li_list whiteColor mbt min_bj">
			<view class="li_i border_btm">
				<view>登录密码</view>
				<view class="right cs" v-if="userInfo.password" @click="routerPath('/binding/loginPassword','password')">重置</view>
				<view class="right cs" v-else @click="routerPath('/binding/loginPassword','password')">设置</view>
			</view>
			<view class="li_i border_btm">
				<view>交易密码</view>
				<view class="right">
					<text class="cs" @click="routerPath('/binding/tradePassword','password')" v-if="!userInfo.payPassword">设置</text>
					<text class="cs" @click="routerPath('/binding/tradePassword','password')" v-if="userInfo.payPassword">重置</text>
					<uni-text class="lg text-gray cuIcon-titles" v-if="userInfo.payPassword"></uni-text>
					<text class="cs" v-if="userInfo.payPassword">关闭</text>
				</view>
			</view>
			<view class="li_i border_btm">
				<view>身份认证</view>
				<view>未认证
					<uni-icons  class="is" type="arrowright" size="30" style="margin-left: 20upx;"   @click="routerPath('/binding/identity','usual')"></uni-icons>
				</view>
			</view>
		</view>
		<view class="li_list whiteColor min_bj">
			<view class="li_i border_btm" @click="routerPath('/personal/setUp')"><view>设置</view><view><uni-icons type="arrowright" size="30"  class="is"></uni-icons></view></view>
			<view class="li_i border_btm"><view>公告中心</view><view><uni-icons type="arrowright" size="30" class="is"></uni-icons></view></view>
			<view class="li_i border_btm"><view>联系与支持</view><view><uni-icons type="arrowright" size="30"  class="is"></uni-icons></view></view>
		</view>
		<view class="logout min_bj" v-if="judgeSignIn">
			<button class="cu-btn block bg-blue lg submitBtn" @click="logout">退出</button>
		</view>
		<view class="cu-modal " :class=" modalName ?'show':''">
			<view class="cu-dialog min_bj">
				<view class="cu-bar bg-white justify-end min_bj">
					<view class="content ms">提示</view>
				</view>
				<view class="padding-xl ">
					确认退出当前账号吗？
				</view>
				<view class="cu-bar bg-white min_bj">
					<view class="action margin-0 flex-sub text-green solid-left" @tap="modalName = false">取消</view>
					<view class="action margin-0 flex-sub  solid-left ds" @tap="hideModal">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name:'personal',
		data() {
			return {
				phoneChecked:false,
				modalName :false,
				color: "#D8D8D8",
			}
		},
		computed: {
			...mapState({
				themeColor:(state) => state.themeColor,
				userInfo: (state) => state.userInfo,
				security: (state) => state.security,
				judgeSignIn: (state) => state.judgeSignIn,
			}),
			stripedWidth(){
				let x = this.userInfo.securityLevel >3 ? 3 : this.userInfo.securityLevel
				return x * (100 / 3) + '%'
			},
			securityLevel(){
				let Level = this.userInfo.securityLevel
				switch (Level){
					case 1:
						return '较低'
						break;
					case 2:
						return '一般'
						break;
					case 3:
						return '较高'
						break;
					case 4:
						return '较高'
						break;
					default:
						return '较高'
						break;
				}
			}
		},
		methods: {
			SwitchB(){
				this.phoneChecked = !this.phoneChecked
			},
			hideModal(){
				this.$store.dispatch('loginOut', this);
				this.modalName = false
			},
			logout(){
				this.modalName = true
			},
			routerPath(data,type){
				if(type && !this.judgeSignIn){
					uni.showToast({
						icon: "none",
						title: "请先登录",
						duration: 2000
					});
					return false
				}
				if(type && !this.security){
					uni.showToast({
						icon: "none",
						title: "请先绑定一项验证",
						duration: 2000
					});
					return false
				}
				uni.navigateTo({
					url: '/pages/component' + data,
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.personal{
	height: calc(100% - calc(102upx + env(safe-area-inset-bottom) / 2));
	overflow: auto;
	.header_box{
		height: 240upx;
		display: flex;
		align-items: center;
		font-size: 36upx;
		.cu-avatar{
			width: 140upx;
			height: 140upx;
			margin-right: 30upx;
		}
		.centenr{
			margin: 0 10upx;
		}
		.login_body{
			font-size: 24upx;
			.nickName{
				font-size: 28upx;
				line-height: 28upx;
			}
			.cu-progress{
				width: 240upx;
			}
			.grade{
				line-height: 24upx;
				margin: 20upx 0 4upx 0;
			}
			.title{
				line-height: 24upx;
				margin-top: 16upx;
			}
		}
	}
	.mbt{
		margin-bottom: 20upx;
	}
	.logout{
		padding: 90upx 60upx;
	}
}
</style>
