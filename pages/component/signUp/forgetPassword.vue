<!-- 忘记密码 -->
<template>
	<div class="forgetPassword loginRegister" :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<cu-custom bgColor="bj-white">
			<block slot="left">
				<uni-icons  type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
			</block>
		</cu-custom>
		<div class="loginRegister_content">
			<view class="titleText ds">
				忘记密码
			</view>
			<view class="from_ipt">
				<view class="cu-form-group border_btm">
					<uni-easyinput @input="nickNameInput" v-model="fromData.nickName" placeholder="请输入用户名"></uni-easyinput>
					<text class="sell">{{nickNameErrText}}</text>
				</view>
				<view class="cu-form-group border_btm">
					<uni-easyinput @input="passwordInput" type="password" v-model="fromData.password" placeholder="请输入登录密码"></uni-easyinput>
					<text class="sell">{{passwordErrText}}</text>
				</view>
				<view class="cu-form-group border_btm">
					<uni-easyinput @input="randomInput" type="password" v-model="fromData.random"  placeholder="请确认登录密码"></uni-easyinput>
					<text class="sell">{{randomErrText}}</text>
				</view>
			</view>
			<button class="cu-btn submitBtn lg"  @click="submitForgetPassword" :class="submitClass"><text v-if="isLogin" class="cuIcon-loading2 cuIconfont-spin" style="margin-right: 10upx;"></text>{{isLogin ? '提交中...' : '提交'}}</button>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'forgetPassword',
		data() {
			return {
				isLogin:false,
				passwordErrText:'',
				randomErrText:'',
				nickNameErrText:'',
				fromData: {
					nickName: '',
					password: '',
					random: ''
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
				if(data.nickName && data.password && data.random && this.passwordErrText == "" && this.randomErrText == "" && this.nickNameErrText == ""){
					return 'submit_bj'
				}
				return 'submitErr_bj'
			},
		},
		methods: {
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
			submitForgetPassword() {
				if(this.submitClass !== 'submit_bj' || this.isLogin){
					this.nickNameInput()
					this.passwordInput()
					this.randomInput()
					return false
				}
				this.isLogin = true
				this.fromData.userName = this.fromData.nickName.toLowerCase();
				const query = {
					username: this.fromData.userName
				}
				this.$api.changePasswordaAuthenticationSafe(query).then((res) => {
					console.log(res.data,'11111111111')
					if (res.data.data) {
						this.isLogin = false
					}else{
						uni.showToast({
							icon :"none",
						    title: res.data.msg,
						    duration: 2000
						});
						this.isLogin = false
					}
				})
			},
			tabPath() {
				uni.navigateBack({
					delta: 1
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.forgetPassword {}
</style>
