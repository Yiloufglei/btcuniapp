<!-- 注册 -->
<template>
	<div class="register loginRegister" :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<cu-custom bgColor="bj-white">
			<block slot="left">
				<uni-icons  type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
			</block>
		</cu-custom>
		<div class="loginRegister_content">
			<view class="titleText ds">
				注册
			</view>
			<view class="from_ipt">
				<view class="cu-form-group border_btm">
					<uni-easyinput  @input="nickNameInput" v-model="fromData.nickName" placeholder="请输入用户名"></uni-easyinput>
					<text class="sell">{{nickNameErrText}}</text>
				</view>
				<view class="cu-form-group border_btm">
					<uni-easyinput @input="passwordInput" type="password" v-model="fromData.password" placeholder="请输入登录密码"></uni-easyinput>
					<text class="sell">{{passwordErrText}}</text>
				</view>
				<view class="cu-form-group border_btm">
					<uni-easyinput @input="randomInput" type="password" v-model="fromData.random" placeholder="请确认登录密码"></uni-easyinput>
					<text class="sell">{{randomErrText}}</text>
				</view>
				<view class="cu-form-group border_btm">
					<uni-easyinput  @input="invitationCodeInput" v-model="fromData.invitationCode" class="border_btm" placeholder="邀请码"></uni-easyinput>
					<text class="sell">{{invitationCodeErrText}}</text>
				</view>
			</view>
			<button class="cu-btn lg submitBtn" @click="submitRegister" :class="submitClass"><text v-if="isLoading" class="cuIcon-loading2 cuIconfont-spin" style="margin-right: 10upx;"></text>{{isLoading ? '注册中...' : '注册'}}</button>
			<view class="forgetpad cs f_cc">
				<label class="radio">
					<radio value="r1" :checked="checked" @click="radioChange"/></label>
				我已阅读并同意<text class="cs">《用户协议》</text>
			</view>
			<view class="goRegister">
				已有账号？<text class="cs" @click="routerPath('/signUp/signIn')">马上登录</text>
			</view>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'register',
		data() {
			return {
				isLoading:false,
				checked: false,
				passwordErrText:'',
				randomErrText:'',
				nickNameErrText:'',
				invitationCodeErrText:'',
				fromData:{
					status:1,
					username: '1',
					nickName:'',
					password:'',
					random:'',
					invitationCode:''
				},
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
				if(data.nickName && data.password && data.random && data.invitationCode && this.checked && this.passwordErrText == "" && this.randomErrText == "" && this.nickNameErrText == ""){
					return 'submit_bj'
				}
				return 'submitErr_bj'
			},
		},
		methods: {
			invitationCodeInput(){
				if(this.fromData.invitationCode.length < 1){
					this.invitationCodeErrText = '邀请码不能为空'
				}else{
					this.invitationCodeErrText = ''
				}
			},
			nickNameInput(e){
				if(this.fromData.nickName.length < 1){
					this.nickNameErrText = '用户名不能为空'
				}else if(this.fromData.nickName.length < 6){
					this.nickNameErrText = '用户名长度最少6位'
				}else{
					this.nickNameErrText = ''
				}
			},
			passwordInput(e){
				this.fromData.random = ""
				this.randomErrText = ""
				this.passwordInputVa()
			},
			passwordInputVa(){
				const passwordRegx = /^[^ ]{6,}$/;
				if(this.fromData.password.length < 1){
					this.passwordErrText = '请输入密码'
				}else if (!passwordRegx.test(this.fromData.password)) {
					this.passwordErrText = '密码长度大于等于6位'
				}else{
					this.passwordErrText = ""
				}
			},
			randomInput(e){
				if(this.fromData.random.length < 1){
					this.randomErrText = '请再次输入密码'
				}else if(this.fromData.random !== this.fromData.password){
					this.randomErrText = '两次密码输入不一致'
				}else{
					this.randomErrText = ""
				}
			},
			tabPath() {
				uni.navigateBack({
					delta: 1
				});
			},
			radioChange() {
				this.checked = !this.checked
			},
			routerPath(type) {
				uni.navigateTo({
					url: '/pages/component' + type,
				});
			},
			submitRegister() {
				if(this.isLoading){
					return false
				}
				if(this.submitClass !== 'submit_bj' || this.isLoading){
					this.nickNameInput()
					this.invitationCodeInput()
					this.passwordInputVa()
					this.randomInput()
					if(!this.checked){
						uni.showToast({
							icon :"none",
						    title: "请同意用户协议",
						    duration: 2000
						});
					}
					return false
				}
				this.isLoading = true
				this.fromData.username = this.fromData.nickName.toLowerCase();
				this.$api.userRegister(this.fromData).then(res => {
					console.log(res.data,'tres')
					if (res.data.code) {
						uni.showToast({
							icon :"none",
						    title: res.data.msg,
						    duration: 2000
						});
						this.isLoading = false
					}else{
						uni.showToast({
						    title: res.data.msg,
						    duration: 300
						});
						setTimeout(() => {
							this.isLoading = false
							this.routerPath('/signUp/signIn')
						},300)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.register {
		.from_ipt {
			.uni-input {
				margin-top: 50upx;
			}
		}
	}
</style>
