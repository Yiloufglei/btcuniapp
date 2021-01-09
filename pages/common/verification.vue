<template>
	<view class="verification ds">
		<view class="cu-modal bottom-modal" :class="modalStatus?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar min_bj">
					<view class="action text-green"></view>
					<view class="action ts">安全认证</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close"></text>
					</view>
				</view>
				<view class="verification_centent min_bj bind_content" v-if="judgeSignIn">
					<view class="from_ipt" v-if="userInfo.phoneAuthStatus && linkType !== 'SMS' && overtCovert.SMS">
						<view class="from_title ts">{{$common.substrHandle(userInfo.phone)}}</view>
						<view class="cu-form-group border_btm">
							<uni-easyinput v-model="fromData.smsCode" placeholder="请输入验证码"></uni-easyinput>
							<button class='cu-btn bg-green shadow' @click="getCode('SMS')">{{countStatus ? (counttime + 's') : '获取验证码'}}</button>
						</view>
					</view>
					<view class="from_ipt" v-if="userInfo.emailAuthStatus && linkType !== 'EMAIL' && overtCovert.EMAIL">
						<view class="from_title ts">{{$common.substrHandle(userInfo.email)}}</view>
						<view class="cu-form-group border_btm">
							<uni-easyinput v-model="fromData.emailCode" placeholder="请输入验证码"></uni-easyinput>
							<button class='cu-btn bg-green shadow' @click="getCode('EMAIL')">{{emailCountStatus ? (emailCounttime + 's') : '获取验证码'}}</button>
						</view>
					</view>
					<view class="from_ipt" v-if="userInfo.googleAuthStatus && linkType !== 'GOOGLE_AUTH' && overtCovert.GOOGLE_AUTH">
						<view class="from_title ts">谷歌认证码</view>
						<view class="cu-form-group border_btm">
							<uni-easyinput v-model="fromData.googleAuthCode" placeholder="请输入验证码"></uni-easyinput>
						</view>
					</view>
					<button class="cu-btn lg submitBtn" :class="submitClass" @click="Submit"><text v-if="isLoading" class="cuIcon-loading2 cuIconfont-spin"
						 style="margin-right: 10upx;"></text>{{isLoading ? '提交中...' : '提交'}}</button>
				</view>
				<view class="verification_centent min_bj bind_content" v-else>
					<view class="from_ipt">
						<view class="from_title ts">手机验证码</view>
						<view class="cu-form-group border_btm">
							<uni-easyinput v-model="fromData.smsCode" placeholder="请输入验证码"></uni-easyinput>
							<button class='cu-btn bg-green shadow' @click="getCode('SMS')">{{countStatus ? (counttime + 's') : '获取验证码'}}</button>
						</view>
					</view>
					<view class="from_ipt" v-if="userInfo.emailAuthStatus && linkType !== 'EMAIL' && overtCovert.EMAIL">
						<view class="from_title ts">邮箱验证码</view>
						<view class="cu-form-group border_btm">
							<uni-easyinput v-model="fromData.emailCode" placeholder="请输入验证码"></uni-easyinput>
							<button class='cu-btn bg-green shadow' @click="getCode('EMAIL')">{{emailCountStatus ? (emailCounttime + 's') : '获取验证码'}}</button>
						</view>
					</view>
					<view class="from_ipt">
						<view class="from_title ts">谷歌认证码</view>
						<view class="cu-form-group border_btm">
							<uni-easyinput v-model="fromData.googleAuthCode" class="" placeholder="请输入验证码"></uni-easyinput>
						</view>
					</view>
					<button class="cu-btn lg submitBtn" :class="submitClass" @click="Submit"><text v-if="isLoading" class="cuIcon-loading2 cuIconfont-spin"
						 style="margin-right: 10upx;"></text>{{isLoading ? '提交中...' : '提交'}}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: 'verification',
		props:{
			linkType:{
				type:String,
				default:''
			},
			overtCovert:{
				type:Object,
				default:()=>{
					return {
						SMS:true,
						EMAIL:true,
						GOOGLE_AUTH:true,
					}
				}
			},
		},
		data() {
			return {
				userName:'',
				
				counttime:60,
				emailCounttime:60,
				
				counttimer:null,
				emailCounttimer:null,
				
				countStatus:false,
				emailCountStatus:false,
				
				modalStatus:false,
				isLoading:false,
				fromData:{
					smsCode: '',
					emailCode: '',
					googleAuthCode: '',
					value:'',
					username:''
				}
			}
		},
		watch:{
			modalStatus:function(){
				this.fromData = {
					smsCode: '',
					emailCode: '',
					googleAuthCode: '',
					value:'',
					username:''
				}
			}
		},
		beforeDestroy() {
			this.clearInterval()
		},
		computed: {
			...mapState({
				userInfo: (state) => state.userInfo,
				judgeSignIn: (state) => state.judgeSignIn,
			}),
			submitClass() {
				let data = this.fromData
				let userInfo = this.userInfo
				let linkType = this.linkType
				let overtCovert = this.overtCovert
				let SMS = userInfo.phoneAuthStatus && linkType !== 'SMS' && overtCovert.SMS
				let EMAIL = userInfo.emailAuthStatus && linkType !== 'EMAIL' && overtCovert.EMAIL
				let GOOGLE_AUTH = userInfo.googleAuthStatus && linkType !== 'GOOGLE_AUTH' && overtCovert.GOOGLE_AUTH
				if ((SMS && !data.smsCode) ||  (EMAIL && !data.emailCode) || (GOOGLE_AUTH && !data.googleAuthCode)) {
					return 'submitErr_bj'
				}
				return 'submit_bj'
			},
		},
		methods: {
			clearInterval(){
				if(this.counttimer){
					clearInterval(this.counttimer);
				}
				if(this.emailCounttimer){
					clearInterval(this.emailCounttimer);
				}
			},
			Submit(){
				if(this.submitClass == 'submitErr_bj'){
					return false
				}
				this.counttime = 60;
				this.countStatus = false
				this.emailCounttime = 60;
				this.emailCountStatus = false
				this.clearInterval()
				this.$emit('handleClose', this.fromData)
			},
			getCode(type){
				if(type == 'SMS'){
					if(this.countStatus){
						return false
					}
					if(this.userName){
						this.fromData.value = null
					}else{
						this.fromData.value = `${this.userInfo.countryCode}-${this.userInfo.phone}`
					}
				}
				if(type == 'EMAIL'){
					if(this.emailCountStatus){
						return false
					}
					this.fromData.value = this.userInfo.email
				}
				this.fromData.type = type
				this.fromData.username = this.userName || this.userInfo.username
				this.$api.sendVerifyCode(this.fromData).then(res => {
					if (res && res.data.data) {
						uni.showToast({
							title: res.data.msg,
							duration: 2000
						});
						if(type == 'SMS'){
							this.countStatus = true
							this.counttimer = setInterval(() => {
								this.counttime--;
								if (this.counttime <= 0) {
									this.counttime = 60;
									this.countStatus = false
									clearInterval(this.counttimer);
								}
							}, 1000);
						}
						if(type == 'EMAIL'){
							this.emailCountStatus = true
							this.emailCounttimer = setInterval(() => {
								this.emailCounttime--;
								if (this.emailCounttime <= 0) {
									this.emailCounttime = 60;
									this.emailCountStatus = false
									clearInterval(this.emailCounttimer);
								}
							}, 1000);
						}
					}else {
						uni.showToast({
							icon: "none",
							title: res.data.msg,
							duration: 2000
						});
						if(type == 'SMS'){
							this.countStatus = false
						}
						if(type == 'EMAIL'){
							this.emailCountStatus = false
						}
					}
				});
			},
			hideModal(){
				this.modalStatus = false
				this.$emit('close')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.verification {
		.cu-modal{
			text-align: initial;
			.cu-bar{
				.action{
					font-size: 32upx;
				}
			}
			.verification_centent{
				.from_title{
					padding-top: 40upx;
					margin-top: 0;
				}
				.submitBtn{
					margin: 60upx 0;
				}
			}
		}
	}
</style>
