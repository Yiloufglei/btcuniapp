<!-- 登录 -->
<template>
	<div class="signIn loginRegister" :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<cu-custom bgColor="bj-white">
			<block slot="left">
				<uni-icons  type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
			</block>
		</cu-custom>
		<div class="loginRegister_content">
			<image  src="../../../static/img/logo.png" mode="" class="login"></image>
			<view class="title ds">
				欢迎回来！
			</view>
			<view class="from_ipt">
				<view class="cu-form-group border_btm">
					<uni-easyinput v-model="fromData.username" placeholder="请输入用户名"></uni-easyinput>
				</view>
				<view class="cu-form-group border_btm">
					<uni-easyinput type="password" v-model="fromData.password"  placeholder="请输入登录密码"></uni-easyinput>
				</view>
			</view>
			<button class="cu-btn submitBtn lg" @click="returnPreLoginResult" :class="submitClass"><text v-if="isLoading" class="cuIcon-loading2 cuIconfont-spin" style="margin-right: 10upx;"></text>{{isLoading ? '登录中...' : '登录'}}</button>
			<view class="forgetpad cs" @click="routerPath('/signUp/forgetPassword')">
				忘记密码？
			</view>
			<view class="goRegister">
				还没有账号？<text class="cs" @click="routerPath('/signUp/register')">马上注册</text>
			</view>
		</div>
	</div>
</template>

<script>
	import qs from "qs";
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'signIn',
		data() {
			return {
				isLoading:false,
				fromData: {
					username: '',
					password: '',
					grant_type:'password',
					scope:'server',
				}
			}
		},
		onShow() {
			this.$nextTick(function() {
				this.$common.setNaviBarColor()
			})
		},
		computed: {
			...mapState({
				themeColor: (state) => state.themeColor,
			}),
			submitClass(){
				let data = this.fromData
				if(data.username && data.password){
					return 'submit_bj'
				}
				return 'submitErr_bj'
			},
		},
		methods: {
			submitLogin() {
				let baseUrl = ''
				this.fromData.username = this.fromData.username.toLowerCase();
				uni.request({
					method: "POST",
					url: `${this.appurl}/auth/oauth/token?username=${this.fromData.username}`,
					data: qs.stringify(this.fromData),
					sslVerify:false,
					firstIpv4:true,
					header: {
						"content-type" : "application/x-www-form-urlencoded",
						"Authorization" : "Basic d2ViOndlYg=="
					},
					dataType: 'json',
				}).then((response) => {
					let data = response[1].data
					this.$common.setCache("token", data.access_token);
					this.$common.setCache("username", data.username);
					this.$store.dispatch("getUserDetail");
					uni.showToast({
					    title: '登录成功',
					    duration: 300
					});
					setTimeout(() => {
						uni.navigateTo({
							url: "/pages/index/index",
						});
						this.isLoading = false
					},300)
				}).catch(error => {
					this.isLoading = false
					console.log(error,'error')
				})
			},
			// 预登录
			returnPreLoginResult() {
				if(this.isLoading){
					return false
				}
				this.isLoading = true
				let username = this.fromData.username.toLowerCase();
				let password = this.fromData.password
				this.$api.preLogin({
					username,
					password
				}).then((res) => {
					if (!res.data.code) {
						let needVerifyList = res.data.data || {}
						if (JSON.stringify(needVerifyList) === '{}') {
							this.submitLogin()
						}
					}else{
						uni.showToast({
							icon :"none",
						    title: res.data.msg,
						    duration: 2000
						});
						this.isLoading = false
					}
				})
			},
			tabPath() {
				uni.navigateBack({
					delta: 1
				});
			},
			routerPath(type) {
				uni.navigateTo({
					url: '/pages/component' + type,
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.signIn {}
</style>
