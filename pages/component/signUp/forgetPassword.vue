<!-- 忘记密码 -->
<template>
	<view class="forgetPassword loginRegister" :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<cu-custom bgColor="bj-white">
			<block slot="left">
				<uni-icons  type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
			</block>
		</cu-custom>
		<view class="loginRegister_content">
			<view class="titleText ds">
				忘记密码
			</view>
			<view class="from_ipt">
				<view class="cu-form-group border_btm">
					<uni-easyinput @input="nickNameInput" v-model="fromData.userName" placeholder="请输入用户名"></uni-easyinput>
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
			<button class="cu-btn submitBtn lg"  @click="submitForgetPassword" :class="submitClass"><text v-if="isLoading" class="cuIcon-loading2 cuIconfont-spin" style="margin-right: 10upx;"></text>{{isLoading ? '提交中...' : '提交'}}</button>
		</view>
		<verification ref="verification" @handleClose ="endVerification"/>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import verification from '../../common/verification.vue'
	export default {
		name: 'forgetPassword',
		data() {
			return {
				isLoading:false,
				passwordErrText:'',
				randomErrText:'',
				nickNameErrText:'',
				fromData: {
					userName: '',
					password: '',
					random: ''
				}
			}
		},
		components: {
			verification
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
				if(data.userName && data.password && data.random && this.passwordErrText == "" && this.randomErrText == "" && this.nickNameErrText == ""){
					return 'submit_bj'
				}
				return 'submitErr_bj'
			},
		},
		methods: {
			endVerification(data) {
				let query = Object.assign(data,this.fromData)
				this.$api.changePasswordaRetrievePassword(query).then((res) => {
					if (res && res.data.data) {
						uni.showToast({
						    title: '找回成功',
						    duration: 2000
						});
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/component/signUp/signIn',
							});
						},300)
					}else{
						uni.showToast({
							icon :"none",
						    title: res.data.msg,
						    duration: 2000
						});
					}
				})
			},
			nickNameInput(e){
				if(this.fromData.userName.length < 1){
					this.nickNameErrText = '用户名不能为空'
				}else if(this.fromData.userName.length < 6){
					this.nickNameErrText = '用户名长度最少6位'
				}else{
					this.nickNameErrText = ''
				}
			},
			passwordInput(e){
				this.fromData.random = ""
				this.randomErrText = ""
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
			submitForgetPassword() {
				if(this.submitClass !== 'submit_bj' || this.isLoading){
					this.nickNameInput()
					this.passwordInputVa()
					this.randomInput()
					return false
				}
				this.isLoading = true
				this.fromData.userName = this.fromData.userName.toLowerCase();
				const query = {
					username: this.fromData.userName
				}
				this.$api.changePasswordaAuthenticationSafe(query).then((res) => {
					if (res.data.data) {
						this.$refs.verification.userName = this.fromData.userName
						this.$refs.verification.modalStatus = true
						this.isLoading = false
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
		}
	}
</script>

<style lang="scss" scoped>
	.forgetPassword {}
</style>
