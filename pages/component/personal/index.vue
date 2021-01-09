<template>
	<view class="personal frame_bj">
		<cu-custom bgColor="bj-white">
			<block slot="content">个人中心</block>
		</cu-custom>
		<view class="header_box whiteColor mbt min_bj">
			<image v-if="userInfo.avatar" @click="setuserImg" :src="backgroundImage" mode=""></image>
			<image v-else src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg" mode=""></image>
			<view v-if="!judgeSignIn"><text @click="routerPath('/signUp/signIn')">登录</text><text class="centenr">|</text><text
				 @click="routerPath('/signUp/register')">注册</text></view>
			<view v-else class="login_body">
				<view class="nickName ms">
					{{userInfo.nickName || ""}}
				</view>
				<view class="grade ds">
					安全等级：{{securityLevel}}
				</view>
				<view class="cu-progress round xs striped" :class="'bg-' + stripedColor">
					<view class="bg-green" :style="[{ width:stripedWidth}]"></view>
				</view>
				<view class="title sell">
					为了您的资产安全，请尽快绑定安全验证！
				</view>
			</view>
		</view>
		<view class="li_list whiteColor mbt min_bj">
			<view class="li_i border_btm">
				<view>手机</view>
				<view class="right">
					<text class="bindText" v-if="userInfo.phone">{{$common.substrHandle(userInfo.phone)}}</text>
					<text class="cs" @click="routerPath('/binding/phone','usual')" v-if="!userInfo.phone">绑定</text>
					<text class="cs" @click="routerPath('/binding/phone','usual')" v-if="userInfo.phone">重置</text>
					<uni-text class="lg text-gray cuIcon-titles" v-if="userInfo.phone"></uni-text>
					<text class="cs" v-if="userInfo.phone" @click="openClose('SMS',userInfo.phoneAuthStatus)">{{userInfo.phoneAuthStatus == 1 ? '关闭' : '开启'}}</text>
				</view>
			</view>
			<view class="li_i border_btm">
				<view>邮箱</view>
				<view class="right">
					<text class="bindText" v-if="userInfo.email">{{$common.substrHandle(userInfo.email)}}</text>
					<text class="cs" @click="routerPath('/binding/email','usual')" v-if="!userInfo.email">绑定</text>
					<text class="cs" @click="routerPath('/binding/email','usual')" v-if="userInfo.email">重置</text>
					<uni-text class="lg text-gray cuIcon-titles" v-if="userInfo.email"></uni-text>
					<text class="cs" v-if="userInfo.email" @click="openClose('EMAIL',userInfo.emailAuthStatus)">{{userInfo.emailAuthStatus == 1 ? '关闭' : '开启'}}</text>
				</view>
			</view>
			<view class="li_i border_btm">
				<view>谷歌验证码</view>
				<view class="right">
					<text class="cs" @click="routerPath('/binding/google','usual')" v-if="!userInfo.googleSecret">绑定</text>
					<text class="cs" @click="routerPath('/binding/google','usual')" v-if="userInfo.googleSecret">重置</text>
					<uni-text class="lg text-gray cuIcon-titles" v-if="userInfo.googleSecret"></uni-text>
					<text class="cs" v-if="userInfo.googleSecret" @click="openClose('GOOGLE_AUTH',userInfo.googleAuthStatus)">{{userInfo.googleAuthStatus == 1 ? '关闭' : '开启'}}</text>
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
					<text class="cs" v-if="userInfo.payPassword" @click="passwordPopUp">{{userInfo.paymentSwitch == 0 ? '关闭' : '开启'}}</text>
				</view>
			</view>
			<view class="li_i border_btm">
				<view>身份认证</view>
				<!-- userInfo.cardAuthStatus === 1 -->
				<view>{{cardAuthStatus[userInfo.cardAuthStatus]}}
					<uni-icons v-if="userInfo.cardAuthStatus === 0 || userInfo.cardAuthStatus === 3" class="is" type="arrowright" size="30"
					 style="margin-left: 20upx;" @click="routerPath('/binding/identity','usual')"></uni-icons>
				</view>
			</view>
		</view>
		<view class="li_list whiteColor min_bj">
			<view class="li_i border_btm" @click="routerPath('/personal/setUp')">
				<view>设置</view>
				<view>
					<uni-icons type="arrowright" size="30" class="is"></uni-icons>
				</view>
			</view>
			<view class="li_i border_btm">
				<view>公告中心</view>
				<view>
					<uni-icons type="arrowright" size="30" class="is"></uni-icons>
				</view>
			</view>
			<view class="li_i border_btm">
				<view>联系与支持</view>
				<view>
					<uni-icons type="arrowright" size="30" class="is"></uni-icons>
				</view>
			</view>
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
		<verification ref="verification" @handleClose="endVerification" @close="close" :overtCovert="overtCovert" />
		<passwordPopUp ref="passwordPopUp" v-if="passwordPopUpStatus" @close="passwordPopUpStatus = false" @submit="passwordPopUpSubmit" />
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex'
	import verification from '../../common/verification.vue'
	import passwordPopUp from '../../common/passwordPopUp.vue'
	export default {
		name: 'personal',
		data() {
			return {
				userImg: '/admin/sys-file/lengleng/0a488aedcace4bb1b5761ee15d937340.png',
				cardAuthStatus: ['认证', '审核中', '已认证', '认证失败，请重新上传'],
				passwordPopUpStatus: false,
				modalName: false,
				closeVerifyType: false,
				closeVerifyData: '',
				overtCovert: {
					SMS: false,
					EMAIL: false,
					GOOGLE_AUTH: false,
				}
			}
		},
		components: {
			verification,
			passwordPopUp
		},
		computed: {
			...mapState({
				themeColor: (state) => state.themeColor,
				userInfo: (state) => state.userInfo,
				security: (state) => state.security,
				judgeSignIn: (state) => state.judgeSignIn,
			}),
			backgroundImage() {
				return this.getImgUrl(this.userInfo.avatar)
			},
			stripedWidth() {
				let x = this.userInfo.securityLevel > 3 ? 3 : this.userInfo.securityLevel
				return x * (100 / 3) + '%'
			},
			stripedColor() {
				let Level = this.userInfo.securityLevel
				if (Level == 1) {
					return 'red'
				} else if (Level == 2) {
					return 'yellow'
				} else if (Level >= 3) {
					return 'green'
				} else {
					return 'red'
				}
			},
			tokenQuery() {
				const token = this.$common.getCache('token')
				return {
					Authorization: 'Bearer ' + token,
				}
			},
			securityLevel() {
				let Level = this.userInfo.securityLevel
				switch (Level) {
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
			setuserImg() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						//压缩图片
						let path = res.tempFilePaths[0];
						let pathDst = path.substring(0, path.lastIndexOf("."));
						// #ifdef APP-PLUS
						console.log(1)
						plus.zip.compressImage({
								src: path, //原路径
								dst: pathDst, //缩略图路径
								overwrite: true, //是否生成新图片
								quality: 20, //1-100,1图片最小，100图片最大
								width: 'auto', //缩略固定宽
								height: 'auto' //缩略固定高
							},
							(result) => {
								let imgPathUrl = result.target;
								uni.uploadFile({
									url: `${this.appurl}/admin/sys-file/upload`,
									filePath: imgPathUrl,
									header: this.tokenQuery,
									name: 'file',
									success: (res) => {
										this.userImg = JSON.parse(res.data).data.url
										let query = {
											avatar: this.userImg,
											username: this.userInfo.username
										}
										this.$api.userEdit(query).then((res) => {
											if (!res.data.code) {
												uni.showToast({
													title: '更换成功',
													duration: 2000
												});
												this.$store.dispatch('getUserDetail')
											} else {
												uni.showToast({
													icon: "none",
													title: '更换失败',
													duration: 2000
												});
											}
										})
									},
									fail: function(err) {
										uni.showToast({
											icon: "none",
											title: '上传失败',
											duration: 2000
										});
									}
								});
							}
						)
						// #endif
						// #ifndef APP-PLUS
						console.log(2)
						uni.uploadFile({
							url: `${this.appurl}/admin/sys-file/upload`,
							filePath: path,
							header: this.tokenQuery,
							name: 'file',
							success: (res) => {
								this.userImg = JSON.parse(res.data).data.url
								let query = {
									avatar: this.userImg,
									username: this.userInfo.username
								}
								this.$api.userEdit(query).then((res) => {
									if (!res.data.code) {
										uni.showToast({
											title: '更换成功',
											duration: 2000
										});
										this.$store.dispatch('getUserDetail')
									} else {
										uni.showToast({
											icon: "none",
											title: '更换失败',
											duration: 2000
										});
									}
								})
							},
							fail: function(err) {
								uni.showToast({
									icon: "none",
									title: '上传失败',
									duration: 2000
								});
							}
						});
						// #endif
					},
				});
			},
			passwordPopUpSubmit(val) {
				this.$api.paymentPasswordVerification(val).then((res) => {
					if (res && res.data.data) {
						this.passwordPopUpStatus = false
						this.paymentSwitch()
					} else {
						uni.showToast({
							icon: "none",
							title: res.data.msg,
							duration: 2000
						});
					}
				})
			},
			paymentSwitch() {
				let query = this.userInfo.paymentSwitch == 0 ? 1 : 0
				this.$api.switchPaymentPasswordSwitchModification(query).then((res) => {
					if (res && res.data.data) {
						uni.showToast({
							title: '设置成功',
							duration: 2000
						});
						this.$store.dispatch('getUserDetail')
					}
				})
			},
			passwordPopUp() {
				if (this.userInfo.paymentSwitch == 0) {
					this.passwordPopUpStatus = true
				} else {
					this.paymentSwitch()
				}
			},
			endVerification(data) {
				if (this.closeVerifyType == 1) {
					this.closeVerifyAjax(data)
				} else {
					this.openVerify(data)
				}
			},
			close() {
				this.overtCovert = {
					SMS: false,
					EMAIL: false,
					GOOGLE_AUTH: false,
				}
			},
			openClose(type, data) {
				if (data == 1) { //关闭
					if (this.security <= 1) {
						uni.showToast({
							icon: "none",
							title: "至少开启一项验证",
							duration: 2000
						});
						return false
					}
					this.overtCovert = {
						SMS: this.userInfo.phoneAuthStatus == 1,
						EMAIL: this.userInfo.emailAuthStatus == 1,
						GOOGLE_AUTH: this.userInfo.googleAuthStatus == 1,
					}
				} else { //开启
					this.overtCovert[type] = true
				}
				this.closeVerifyData = type
				this.closeVerifyType = data
				this.$refs.verification.modalStatus = true
			},
			openVerify(data) {
				let query = Object.assign({}, data)
				query.type = this.closeVerifyData
				this.$api.openAuthentication(query).then((res) => {
					if (res && res.data.data) {
						uni.showToast({
							title: this.closeVerifyType == 1 ? '关闭成功' : '开启成功',
							duration: 2000
						});
						this.$refs.verification.modalStatus = false
						this.$store.dispatch("getUserDetail")
					} else {
						uni.showToast({
							icon: "none",
							title: res.data.msg,
							duration: 2000
						});
					}
				})
			},
			closeVerifyAjax(data) {
				let query = Object.assign({}, data)
				query.type = this.closeVerifyData
				this.$api.closeAuthentication(query).then((res) => {
					if (res && res.data.data) {
						uni.showToast({
							title: this.closeVerifyType == 1 ? '关闭成功' : '开启成功',
							duration: 2000
						});
						this.$refs.verification.modalStatus = false
						this.$store.dispatch("getUserDetail")
					} else {
						uni.showToast({
							icon: "none",
							title: res.data.msg,
							duration: 2000
						});
					}
				})
			},
			hideModal() {
				this.$store.dispatch('loginOut');
				this.modalName = false
			},
			logout() {
				this.modalName = true
			},
			routerPath(data, type) {
				if (type && !this.judgeSignIn) {
					uni.showToast({
						icon: "none",
						title: "请先登录",
						duration: 2000
					});
					return false
				}
				if (type == "password" && this.security < 1) {
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
	.personal {
		height: calc(100% - calc(102upx + env(safe-area-inset-bottom) / 2));
		overflow: auto;

		.header_box {
			height: 240upx;
			display: flex;
			align-items: center;
			font-size: 36upx;

			uni-image {
				width: 140upx;
				height: 140upx;
				margin: 0 30upx;
				border-radius: 50%;
			}

			.centenr {
				margin: 0 10upx;
			}

			.login_body {
				font-size: 24upx;

				.nickName {
					font-size: 28upx;
					line-height: 28upx;
				}

				.cu-progress {
					width: 240upx;
				}

				.grade {
					line-height: 24upx;
					margin: 20upx 0 4upx 0;
				}

				.title {
					line-height: 24upx;
					margin-top: 16upx;
				}
			}
		}

		.mbt {
			margin-bottom: 20upx;
		}

		.logout {
			padding: 90upx 60upx;
		}
	}
</style>
