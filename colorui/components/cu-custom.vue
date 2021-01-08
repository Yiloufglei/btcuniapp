<template>
	<view>
		<view class="cu-custom" :style="[{height:(CustomBar * 2) + 'upx'}]">
			<view class="cu-bar fixed min_bj border_btm" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
                <slot name="left"></slot>
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="content" :style="[{top:(StatusBar * 2) + 'upx'}]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${(CustomBar * 2)}upx;padding-top:${(StatusBar * 2)}upx;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
		},
		methods: {
			BackPage() {
				// uni.navigateBack({
				// 	delta: 1
				// });
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
