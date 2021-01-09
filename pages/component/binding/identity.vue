<!-- 身份绑定认证 -->
<template>
	<view class="identity" :class="themeColor == 'black' ? 'black_theme' : 'white_theme'">
		<view class="min_bj identity_body">
			<cu-custom bgColor="bj-white">
				<block slot="left">
					<uni-icons type="arrowleft" size="40" style="margin-left:30upx" @click="tabPath"></uni-icons>
				</block>
				<block slot="content">身份绑定</block>
			</cu-custom>
			<view class="identity_center">
				<view class="identity_top">
					<image :src="imgList.positive ? imgList.positive  : '../../../static/img/userZ.png'" mode="" @click="setPositiveBackImg(1)"></image>
					<image :src="imgList.back ? imgList.back  : '../../../static/img/userF.png'" mode="" @click="setPositiveBackImg(0)"></image>
				</view>
				<view class="identity_bind_content bind_content">
					<view class="from_ipt">
						<view class="from_title">姓名</view>
						<view class="cu-form-group border_btm">
							<uni-easyinput v-model="fromData.cardName" placeholder="请输入姓名"></uni-easyinput>
						</view>
						<view class="from_title">身份证号码</view>
						<view class="cu-form-group border_btm">
							<uni-easyinput v-model="fromData.cardNumber" type="number" placeholder="请输入身份证号码"></uni-easyinput>
						</view>
					</view>
				</view>
				<view class="title_text">
					<view class="text">身份证照片要求: </view>
					<view class="text">需要您<text class="cs">本人的</text>有效的二代身份证; </view>
					<view class="text">上传身份证时请确保身份证的<text class="cs">边框完整，字迹清晰,</text></view>
					<view class="text cs">亮度均匀，无水印，无遮挡;</view>
				</view>
				<view class="submitbtn">
					<button class="cu-btn lg submitBtn" :class="submitClass" @click="submit"><text v-if="isLoading" class="cuIcon-loading2 cuIconfont-spin"
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
		name: 'identity',
		data() {
			return {
				imgList: {
					positive: '',
					back: ''
				},
				isLoading: false,
				fromData: {
					cardName: '',
					cardNumber: '',
				}
			}
		},
		components: {},
		computed: {
			...mapState({
				themeColor: (state) => state.themeColor,
			}),
			submitClass() {
				let data = this.fromData
				if (data.cardName && data.cardNumber && this.imgList.positive && this.imgList.back) {
					return 'submit_bj'
				}
				return 'submitErr_bj'
			},
			tokenQuery (){
				const token = this.$common.getCache('token')
				return {
					Authorization: 'Bearer ' + token,
				}
			},
		},
		methods: {
			setPositiveBackImg(type) {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						if (type) {
							this.imgList.positive = res.tempFilePaths[0]
						} else {
							this.imgList.back = res.tempFilePaths[0]
						}
					}
				});
			},
			//上传身份证验证
			uploadModelAxios(type){
				return new Promise((resolve,rejects) => {
					const uploadTask = uni.uploadFile({
						url: `${this.appurl}/admin/user/uploadIdCard/${type}`,
						filePath: type == 1 ? this.imgList.positive : this.imgList.back,
						header:this.tokenQuery,
						name: 'file',
						formData: this.fromData,
						success: function(uploadFileRes) {
							resolve(1)
						},
						fail: function(err){
							rejects(0)
						}
					});
					// uploadTask.onProgressUpdate(function(res) {
					// 	console.log('上传进度' + res.progress);
					// 	console.log('已经上传的数据长度' + res.totalBytesSent);
					// 	console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
					// });
				})
			},
			async submit() {
				if(this.isLoading || this.submitClass !== 'submit_bj'){
					return false
				}
				this.isLoading = true
				let a = await this.uploadModelAxios(1)
				let b = await this.uploadModelAxios(2)
				if(a && b){
					this.isLoading = false
					this.$store.dispatch('getUserDetail')
					uni.showToast({
						title: "上传成功",
						duration: 300
					});
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/index/index',
						});
					},300)
				}else{
					uni.showToast({
						icon: "none",
						title: "上传失败",
						duration: 2000
					});
					this.isLoading = false
				}
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
	.identity {
		height: 100%;

		.identity_body {
			.identity_center {
				.identity_top {
					display: flex;
					justify-content: space-between;
					padding: 30upx 30upx 0;

					uni-image {
						width: 320upx;
						height: 270upx;
					}
				}

				.identity_bind_content {
					.from_title {
						margin-top: 30upx;
					}
				}

				.title_text {
					padding-left: 30upx;
					margin-top: 30upx;
					font-size: 24upx;

					.text {
						line-height: 42upx;
					}
				}

				.submitbtn {
					padding: 30upx 65upx;
				}
			}
		}
	}
</style>
