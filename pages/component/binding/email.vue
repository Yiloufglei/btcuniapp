<!-- 邮箱绑定认证 -->
<template>
	<view class="email_bind"  :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<cu-custom bgColor="bj-white">
			<block slot="left">
				<uni-icons type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
			</block>
			<block slot="content">{{userInfo.email ? '更换邮箱' : '邮箱绑定'}}</block>
		</cu-custom>
		<view class="email_bind_content bind_content">
			<view class="sell title">注：为了您的资产安全，请绑定邮箱账号。</view>
			<view class="from_ipt">
				<view class="from_title">邮箱地址</view>
				<view class="cu-form-group border_btm">
					<uni-easyinput v-model="fromData.value"  @input="emailInput" placeholder="请输入邮箱地址"></uni-easyinput>
					<text class="sell">{{emailErrText}}</text>
				</view>
				<view class="from_title">邮箱验证码</view>
				<view class="cu-form-group border_btm">
					<uni-easyinput v-model="fromData.emailCode"  placeholder="请输入邮箱验证码"></uni-easyinput>
					<button class='cu-btn shadow' :class="codeBtnClass"  @click="getCode">{{countStatus ? (counttime + 's') : '获取验证码'}}</button>
				</view>
				<button class="cu-btn lg submitBtn" :class="submitClass" @click="submit"><text v-if="isLoading" class="cuIcon-loading2 cuIconfont-spin"
					 style="margin-right: 10upx;"></text>{{isLoading ? '提交中...' : '提交'}}</button>
			</view>
		</view>
		<verification ref="verification" @handleClose ="endVerification" linkType="EMAIL"/>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex'
	import verification from '../../common/verification.vue'
	export default {
		name: 'email_bind',
		data() {
			return {
				countStatus:false,
				counttime: 60,
				counttimer: null,
				isLoading: false,
				emailErrText:"",
				fromData: {
					emailCode: '',
					type: 'EMAIL',
					username:'',
					value:''
				}
			}
		},
		components:{
			verification
		},
		beforeDestroy() {
			if(this.counttimer){
				clearInterval(this.counttimer);
			}
		},
		computed: {
			...mapState({
				themeColor:(state) => state.themeColor,
				userInfo: (state) => state.userInfo,
				security: (state) => state.security,
			}),
			codeBtnClass(){
				if (this.fromData.value && this.emailErrText == '') {
					return 'bg-green'
				}
				return 'submitErr_bj'
			},
			submitClass() {
				let data = this.fromData
				if (data.emailCode && data.value) {
					return 'submit_bj'
				}
				return 'submitErr_bj'
			},
		},
		methods: {
			emailInput(){
				const emailRegx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				if(this.fromData.value.length < 1){
					this.emailErrText = '请输入邮箱'
				}else if (!emailRegx.test(this.fromData.value)) {
					this.emailErrText = '请输入正确的邮箱'
				}else{
					this.emailErrText = ""
				}
			},
			needToSafeVerify() {
				if (this.userInfo.phoneAuthStatus === 1 || this.userInfo.emailAuthStatus === 1 || this.userInfo.googleAuthStatus === 1) {
					return true
				}
				return false
			},
			endVerification(data) {
				let query = Object.assign({}, data, this.fromData)
				query.code = this.fromData.emailCode
				this.$api.authenticationSafe(query).then(res => {
					if (res && res.data.data) {
						uni.showToast({
							title: this.userInfo.email ? '更换成功' : '绑定成功',
							duration: 2000
						});
						clearInterval(this.counttimer)
						this.$store.dispatch("getUserDetail");
						setTimeout(() => {
							this.tabPath()
						},1000)
					}else{
						uni.showToast({
							icon: "none",
							title: res.data.msg,
							duration: 2000
						});
					}
				}).catch(() => {});
			},
			submit() {
				if(this.isLoading || this.submitClass == 'submitErr_bj'){
					return false
				}
				this.isLoading = true;
				let query = Object.assign({}, this.fromData)
				query.username = this.userInfo.username
				query.code = this.fromData.emailCode
				this.$api.checkVerifyOnlyCode(query).then((res) => {
					if (res && res.data.data) {
						this.counttime = 60;
						this.countStatus = false;
						if(this.needToSafeVerify() && this.security) {
							this.$refs.verification.modalStatus = true
						} else {
							this.endVerification()
						}
					}
					this.isLoading = false;
				})
			},
			getCode() {
				this.fromData.username = this.userInfo.username
				this.$api.sendVerifyCode(this.fromData).then(res => {
					if (res && res.data.data) {
						this.fromData.code = null;
						this.countStatus = true
						uni.showToast({
							title: res.data.msg,
							duration: 2000
						});
						this.counttimer = setInterval(() => {
							this.counttime--;
							if (this.counttime <= 0) {
								this.counttime = 60;
								this.countStatus = false
								clearInterval(this.counttimer);
							}
						}, 1000);
					}else{
						uni.showToast({
							icon :"none",
							title: res.data.msg,
							duration: 2000
						});
						this.countStatus = false
					} 
				});
			},
			tabPath() {
				uni.navigateTo({
					url: '/pages/index/index',
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.email_bind{
	height: 100%;
}
</style>
