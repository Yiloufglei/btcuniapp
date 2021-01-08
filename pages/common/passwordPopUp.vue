<template>
	<view class="passwordPopUp">
		<view class="cu-modal" :class="'show'">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">交易密码</view>
					<view class="action" @tap="$emit('close')">
						<text class="cuIcon-close text-red"></text>	
					</view>
				</view>
				<view class="padding-xl">
					<vcode-input ref="VcodeInput" @vcodeInput="vcodeInput"></vcode-input>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import VcodeInput from '@/components/vcode-input/vcode-input'
	export default {
		name: 'passwordPopUp',
		data() {
			return {
			}
		},
		components: {	
			VcodeInput
		},
		computed: {
			...mapState({}),
		},
		methods: {
			// 用户输入的值
			vcodeInput(val) {
				this.$emit('submit',val)
			},
			// 控制组件获取焦点
			setFocus() {
				this.$refs.VcodeInput.setFocus();
			},
			// 控制组件失去焦点
			setBlur() {
				this.$refs.VcodeInput.setBlur();
			},
			// 清除已输入
			clearValue() {
				this.$refs.VcodeInput.clearValue();
			}
		}
	}
</script>

<style lang="scss" scoped>
.passwordPopUp{
	
}
</style>
