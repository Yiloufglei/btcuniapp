<!-- 交易密码绑定认证 -->
<template>
	<view class="tradePassword"  :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<view class="min_bj tradePassword_body">
			<cu-custom bgColor="bj-white">
				<block slot="left">
					<uni-icons  type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
				</block>
				<block slot="content">{{userInfo.payPassword ? '重置交易密码' : '设置交易密码'}}</block>
			</cu-custom>
			<view class="tradePassword_bind_content bind_content">
				<view class="sell title">{{userInfo.payPassword ? '注：重置交易密码后24小时不可提现。' : '注：为了您资产安全，请设置交易密码。'}}</view>
				<view class="from_ipt">
					<view class="from_title">{{userInfo.payPassword ? '设置新交易密码' : '设置交易密码'}}</view>
					<view class="cu-form-group border_btm">
						<uni-easyinput v-model="fromData.password" @input="passwordInput"  :maxlength="6" placeholder="请输入密码"></uni-easyinput>
						<text class="sell">{{passwordErrText}}</text>
					</view>
					<view class="from_title">确认交易密码</view>
					<view class="cu-form-group border_btm">
						<uni-easyinput v-model="fromData.random" @input="randomInput"  :maxlength="6" placeholder="请再次确认密码"></uni-easyinput>
						<text class="sell">{{randomErrText}}</text>
					</view>
					<button class="cu-btn lg submitBtn" :class="submitClass" @click="submit"><text v-if="isLoading" class="cuIcon-loading2 cuIconfont-spin"
						 style="margin-right: 10upx;"></text>{{isLoading ? '提交中...' : '提交'}}</button>
				</view>
			</view>
		</view>
		<verification ref="verification" @handleClose ="endVerification" :overtCovert="overtCovert"/>
	</view>
</template>
<script>
	import {
		mapState
	} from 'vuex'
	import verification from '../../common/verification.vue'
	export default {
		name: 'tradePassword',
		data() {
			return {
				isLoading: false,
				passwordErrText:'',
				randomErrText:'',
				fromData: {
					password: '',
					random:'',
				},
				overtCovert: {
					SMS:true,
					EMAIL:true,
					GOOGLE_AUTH:true,
				}
			}
		},
		computed: {
			...mapState({
				themeColor:(state) => state.themeColor,
				userInfo:(state) => state.userInfo,
			}),
			submitClass() {
				let data = this.fromData
				if (data.password && data.random && this.passwordErrText == "" && this.randomErrText == "") {
					return 'submit_bj'
				}
				return 'submitErr_bj'
			},
		},
		components:{
			verification
		},
		methods: {
			passwordInput(){
				this.fromData.random = ""
				this.randomErrText = ""
				if(this.fromData.password.length < 1 || this.fromData.password.length < 6){
					this.passwordErrText = '请输入长度6位的交易密码'
				}else{
					this.passwordErrText = ""
				}
			},
			randomInput(){
				if(this.fromData.random.length < 1){
					this.randomErrText = '请再输入交易密码'
				}else if(this.fromData.random !== this.fromData.password){
					this.randomErrText = '两次密码输入不一致'
				}else{
					this.randomErrText = ""
				}
			},
			submit(){
				this.overtCovert.SMS = this.userInfo.phoneAuthStatus == 1 ? true : false
				this.overtCovert.EMAIL = this.userInfo.emailAuthStatus == 1 ? true : false
				this.overtCovert.GOOGLE_AUTH = this.userInfo.googleAuthStatus == 1 ? true : false
				this.$refs.verification.modalStatus = true
			},
			endVerification(data){
				let query = Object.assign({}, data, this.fromData)
				this.$api.newSetPaymentPassword(query).then((res) => {
					if (res && res.data.data) {
						uni.showToast({
							title: "设置成功",
							duration: 2000
						});
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
				})
				this.$refs.GeneralDrawer.toggleTurn(false)
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
.tradePassword{
	height: 100%;
}
</style>
