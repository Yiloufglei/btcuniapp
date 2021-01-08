<!-- 谷歌绑定认证 -->
<template>
	<view class="loginPassword" :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<view class="min_bj loginPassword_body">
			<cu-custom bgColor="bj-white">
				<block slot="left">
					<uni-icons type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
				</block>
				<block slot="content">谷歌绑定</block>
			</cu-custom>
			<view class="loginPassword_center">
				<view class="title">
					扫码绑定谷歌验证
				</view>
				<view class="qrcode_body f_cc">
					<canvas canvas-id="qrcode" :style="{width: `${canvasWidth}px`,height: `${canvasWidth}px`}" />
				</view>
				<view class="copy_body f_cc">
					<view class="left_text" ref="InvitationLink">{{googleSecret}}</view>
					<view class="copy cs" @click="copyText(googleSecret,'InvitationLink')">复制</view>
				</view>
				<view class="title_text">
					输入谷歌验证器中6位验证码
				</view>
				<view class="google_body">
					<uni-easyinput v-model="code" class="myIpt" placeholder="请输入谷歌验证码"></uni-easyinput>
				</view>
				<view class="btn_body">
					<button class="cu-btn submitBtn lg" @click="submit" :class="submitClass"><text v-if="isLoading" class="cuIcon-loading2 cuIconfont-spin"
						 style="margin-right: 10upx;"></text>{{isLoading ? '登录中...' : '登录'}}</button>
				</view>
			</view>
		</view>
		<verification ref="verification" @handleClose ="endVerification"  linkType="GOOGLE_AUTH"/>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex'
	import uQRCode from '@/js_sdk/Sansnn-uQRCode/uqrcode.js'
	import verification from '../../common/verification.vue'
	export default {
		name: 'loginPassword',
		data() {
			return {
				isLoading: false,
				code: '',
				googleSecret: null,
			}
		},
		components: {
			uQRCode,
			verification
		},
		computed: {
			...mapState({
				security: (state) => state.security,
				themeColor: (state) => state.themeColor,
				userInfo: (state) => state.userInfo,
			}),
			canvasWidth(){
				const { windowWidth } = uni.getSystemInfoSync();	
				return windowWidth * (65 / 100)
			},
			submitClass() {
				if (this.code) {
					return 'submit_bj'
				}
				return 'submitErr_bj'
			},
			googleQrCodeText() {
				return `otpauth://totp/${this.userInfo.nickName}?secret=${this.googleSecret}&issuer=BITC`
			},
		},
		mounted() {
			this.beginVerifyGoogle()
		},
		methods: {
			async make() {
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: this.googleQrCodeText,
					size: this.canvasWidth,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H,
					success: res => {
						// console.log(res)
					}
				})
			},
			copyText(val, text) {
				uni.setClipboardData({
					data: val,
					success: function() {
						uni.showToast({
							title: '复制成功',
							duration: 1000
						});
					},
					fail: function(err) {
						uni.showToast({
							title: '复制失败',
							duration: 1000,
							icon: 'none'
						});
					}
				});
			},
			beginVerifyGoogle() {
				this.$api.createGoogleSecret().then((res) => {
					if (res) {
						this.googleSecret = res.data.data
						this.make()
					}
				})
			},
			needToSafeVerify() {
				if (this.userInfo.phoneAuthStatus === 1 || this.userInfo.emailAuthStatus === 1 || this.userInfo.googleAuthStatus === 1) {
					return true
				}
				return false
			},
			endVerification(verificationCodeDTO = {}) {
				let query = Object.assign({}, verificationCodeDTO)
				query.type = 'GOOGLE_AUTH'
				query.value = this.googleSecret
				this.$api.authenticationSafe(query).then((res) => {
					if (res && res.data.data) {
						uni.showToast({
							title: "绑定成功",
							duration: 1000,
						});
						this.$store.dispatch("getUserDetail");
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/index/index',
							});
						},1000)
					}else{
						uni.showToast({
							title: res.data.msg,
							duration: 1000,
							icon: 'none'
						});
					}
				})
			},
			submit() {
				let query = {
					username: this.userInfo.username,
					type: 'GOOGLE_AUTH',
					code: this.code,
					value: this.googleSecret
				}
				this.$api.checkVerifyOnlyCode(query).then((res) => {
					if (res && res.data.data) {
						if (this.needToSafeVerify() && this.security) {
							this.$refs.verification.modalStatus = true
						} else {
							this.endVerification()
						}
					}else{
						uni.showToast({
							title: res.data.msg,
							duration: 1000,
							icon: 'none'
						});
					}
				})
			},
			tabPath() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.loginPassword {
		height: 100%;

		.loginPassword_center {
			text-align: center;

			.title {
				font-size: 38upx;
				line-height: 50upx;
				margin: 80upx 0 40upx 0;
			}
			.copy_body {
				font-size: 28upx;
				margin: 30upx 0 40upx;

				.left_text {
					max-width: 280upx;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					word-break: break-all;
				}
			}

			.title_text {
				font-size: 32upx;
			}

			.google_body {
				padding: 40upx 100upx;
			}

			.btn_body {
				padding: 0 60upx;
			}
		}
	}
</style>
