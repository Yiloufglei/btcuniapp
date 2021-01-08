<!-- 手机绑定认证 -->
<template>
	<view class="phone_bind" :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<cu-custom bgColor="bj-white">
			<block slot="left">
				<uni-icons type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
			</block>
			<block slot="content">{{userInfo.phone ? '更换手机' : '手机绑定'}}</block>
		</cu-custom>
		<view class="phone_bind_content bind_content">
			<view class="sell title">{{userInfo.phone ? '注：更换绑定手机后24小时禁止提现。' : '注：为了您的资产安全，请绑定手机号。'}}</view>
			<view class="from_ipt">
				<view class="from_title">手机号</view>
				<view class="cu-form-group border_btm">
					<uni-easyinput v-model="fromData.phone" type="number" placeholder="请输入手机号"></uni-easyinput>
				</view>
				<view class="from_title">手机验证码</view>
				<view class="cu-form-group border_btm">
					<uni-easyinput v-model="fromData.smsCode" type="number" placeholder="请输入验证码"></uni-easyinput>
					<button class='cu-btn  shadow' :class="codeBtnClass" @click="getCode">{{countStatus ? counttime : '获取验证码'}}</button>
				</view>
				<button class="cu-btn lg submitBtn" :class="submitClass" @click="submit"><text v-if="isLoading" class="cuIcon-loading2 cuIconfont-spin"
					 style="margin-right: 10upx;"></text>{{isLoading ? '提交中...' : '提交'}}</button>
			</view>
		</view>
		<verification ref="verification" @handleClose ="endVerification" linkType="SMS"/>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex'
	import verification from '../../common/verification.vue'
	export default {
		name: 'phone_bind',
		data() {
			return {
				countStatus: false,
				counttime: 60,
				counttimer: null,
				isLoading: false,
				fromData: {
					phone: '',
					smsCode: '',
					type: 'SMS',
					username: '',
					value: '',
				}
			}
		},
		components: {
			verification
		},
		beforeDestroy() {
			if (this.counttimer) {
				clearInterval(this.counttimer);
			}
		},
		computed: {
			...mapState({
				themeColor: (state) => state.themeColor,
				userInfo: (state) => state.userInfo,
				security: (state) => state.security,
			}),
			codeBtnClass(){
				if (this.fromData.phone) {
					return 'bg-green'
				}
				return 'submitErr_bj'
			},
			submitClass() {
				let data = this.fromData
				if (data.phone && data.smsCode) {
					return 'submit_bj'
				}
				return 'submitErr_bj'
			},
		},
		methods: {
			needToSafeVerify() {
				if (this.userInfo.phoneAuthStatus === 1 || this.userInfo.emailAuthStatus === 1 || this.userInfo.googleAuthStatus === 1) {
					return true
				}
				return false
			},
			endVerification(data) {
				let query = data ? Object.assign(data,this.fromData) : this.fromData
				query.value = `+86-${this.fromData.phone}`
				this.$api.authenticationSafe(query).then(res => {
					if (res && res.data.data) {
						uni.showToast({
							title: this.userInfo.phone ? '更换成功' : '绑定成功',
							duration: 300
						});
						clearInterval(this.counttimer)
						this.$store.dispatch("getUserDetail");
						setTimeout(() => {
							this.tabPath()
						},300)
					}
				}).catch(() => {});
			},
			submit() {
				if(this.isLoading || this.submitClass == 'submitErr_bj'){
					return false
				}
				this.fromData.value = `+86-${this.fromData.phone}`
				this.fromData.username = this.userInfo.username
				this.fromData.code = this.fromData.smsCode
				this.isLoading = true;
				this.$api.checkVerifyOnlyCode(this.fromData).then(res => {
					if (res && res.data.data) {
						this.counttime = 60;
						this.countStatus = false;
						if (this.needToSafeVerify() && this.security >= 1) {
							this.$refs.verification.modalStatus = true
						} else {
							this.endVerification({})
						}
					} else {
						uni.showToast({
							icon: "none",
							title: res.data.msg,
							duration: 2000
						});
					}
					this.isLoading = false
				})
			},
			getCode() {
				this.fromData.value = `+86-${this.fromData.phone}`
				this.fromData.username = this.userInfo.username
				this.$api.sendVerifyCode(this.fromData).then(res => {
					if (res && res.data.data) {
						this.fromData.code = null;
						uni.showToast({
							title: res.data.msg,
							duration: 300
						});
						this.countStatus = true
						this.counttimer = setInterval(() => {
							this.counttime--;
							if (this.counttime <= 0) {
								this.counttime = 60;
								this.countStatus = false
								clearInterval(this.counttimer);
							}
						}, 1000);
					}else {
						uni.showToast({
							icon: "none",
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
	.phone_bind {
		height: 100%;
	}
</style>
