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
				<view class="verification_centent min_bj bind_content">
					<view class="from_ipt" v-if="userInfo.phoneAuthStatus && linkType !== 'SMS' && overtCovert.phone">
						<view class="from_title ts">{{$common.substrHandle(userInfo.phone)}}</view>
						<view class="cu-form-group border_btm">
							<uni-easyinput v-model="fromData.smsCode" class="" placeholder="请输入验证码"></uni-easyinput>
							<button class='cu-btn bg-green shadow' @click="getCode('SMS')">{{countStatus ? (counttime + 's') : '获取验证码'}}</button>
						</view>
					</view>
					<view class="from_ipt" v-if="userInfo.emailAuthStatus && linkType !== 'EMAIL' && overtCovert.email">
						<view class="from_title ts">{{$common.substrHandle(userInfo.email)}}</view>
						<view class="cu-form-group border_btm">
							<uni-easyinput v-model="fromData.emailCode" class="" placeholder="请输入验证码"></uni-easyinput>
							<button class='cu-btn bg-green shadow' @click="getCode('EMAIL')">{{emailCountStatus ? (emailCounttime + 's') : '获取验证码'}}</button>
						</view>
					</view>
					<view class="from_ipt" v-if="userInfo.googleAuthStatus && linkType !== 'GOOGLE_AUTH' && overtCovert.google">
						<view class="from_title ts">谷歌认证</view>
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
				default:{
					phone:true,
					email:true,
					google:true,
				}
			}
		},
		data() {
			return {
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
		beforeDestroy() {
			if(this.counttimer){
				clearInterval(this.counttimer);
			}
			if(this.emailCounttimer){
				clearInterval(this.emailCounttimer);
			}
		},
		computed: {
			...mapState({
				userInfo: (state) => state.userInfo,
			}),
			submitClass() {
				let data = this.fromData
				let userInfo = this.userInfo
				if ((userInfo.phoneAuthStatus && data.smsCode) ||  (userInfo.emailAuthStatus && data.emailCode) || (userInfo.googleAuthStatus && data.googleAuthCode)) {
					return 'submit_bj'
				}
				return 'submitErr_bj'
			},
		},
		methods: {
			Submit(){
				this.$emit('handleClose', this.fromData)
			},
			getCode(type){
				if(type == 'SMS'){
					if(this.countStatus){
						return false
					}
					this.fromData.value = `+86-${this.userInfo.phone}`
				}
				if(type == 'EMAIL'){
					if(this.emailCountStatus){
						return false
					}
					this.fromData.value = this.userInfo.email
				}
				this.fromData.type = type
				this.fromData.username = this.userInfo.username
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
