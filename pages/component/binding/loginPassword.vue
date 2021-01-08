<!-- 登录密码绑定认证 -->
<template>
	<view class="loginPassword"  :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<view class="min_bj loginPassword_body">
			<cu-custom bgColor="bj-white">
				<block slot="left">
					<uni-icons type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
				</block>
				<block slot="content">{{userInfo.password ? '重置登录密码' : '设置登录密码'}}</block>
			</cu-custom>
			<view class="loginPassword_bind_content bind_content">
				<view class="sell title">{{userInfo.password ? '注：重置登陆密码后24小时不可提现。' : '注：为了您的资产安全，请设置登陆密码。'}}</view>
				<view class="from_ipt">
					<view class="from_title">{{userInfo.password ? '设置新登录密码' : '设置登录密码'}}</view>
					<view class="cu-form-group border_btm">
						<uni-easyinput v-model="fromData.password" type="password" @input="passwordInput"  placeholder="请输入密码"></uni-easyinput>
						<text class="sell">{{passwordErrText}}</text>
					</view>
					<view class="from_title">确认登录密码</view>
					<view class="cu-form-group border_btm">
						<uni-easyinput v-model="fromData.random" type="password" @input="randomInput"  placeholder="请再次确认密码"></uni-easyinput>
						<text class="sell">{{randomErrText}}</text>
					</view>
					<button class="cu-btn lg submitBtn" :class="submitClass" @click="submit"><text v-if="isLoading" class="cuIcon-loading2 cuIconfont-spin"
						 style="margin-right: 10upx;"></text>{{isLoading ? '提交中...' : '提交'}}</button>
				</view>
			</view>
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
		name: 'loginPassword',
		data() {
			return {
				isLoading: false,
				passwordErrText:'',
				randomErrText:'',
				fromData: {
					password: '',
					random:'',
					sendTerminal: 1
				}
			}
		},
		components:{
			verification
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
		beforeDestroy() {
			if(this.counttimer){
				clearInterval(this.counttimer);
			}
		},
		methods: {
			passwordInput(){
				this.fromData.random = ""
				this.randomErrText = ""
				let passwordRegx = /^[^ ]{6,}$/;
				if(this.fromData.password.length < 1){
					this.passwordErrText = '请输入密码'
				}else if (!passwordRegx.test(this.fromData.password)) {
					this.passwordErrText = '密码长度大于等于6位'
				}else{
					this.passwordErrText = ""
				}
			},
			randomInput(){
				if(this.fromData.random.length < 1){
					this.randomErrText = '请再次输入密码'
				}else if(this.fromData.random !== this.fromData.password){
					this.randomErrText = '两次密码输入不一致'
				}else{
					this.randomErrText = ""
				}
			},
			submit(){
				this.$refs.verification.modalStatus = true
			},
			endVerification(data){
				let query = Object.assign({}, data, this.fromData)
				query.newPassword = this.fromData.password
				this.$api.newChangePassword(query).then((res) => {
					if (res && res.data.data) {
						uni.showToast({
							title: "设置成功",
							duration: 2000
						});
						setTimeout(() => {
							this.$common.nextlogin()
							uni.navigateTo({
								url: '/pages/component/signUp/signIn',
							});
						},1000)
					}else{
						uni.showToast({
							icon: "none",
							title: res.data.msg,
							duration: 2000
						});
					}
				})
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
.loginPassword{
	height: 100%;
}
</style>

