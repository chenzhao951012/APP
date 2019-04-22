<template>
	<view class="content">
		<view class="finalizePaymentBox">
			<view class="finalizePayment">
				<view class="box">
					<view class="iconfont">&#xe682;</view>
					<view class="title">恭喜你入驻完成~</view>
					<view class="title">我们将在3-5个工作内进行审核</view>
					<view class="title">请注意查收消息通知~</view>
				</view>
				
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data(){
			return{
				
			}
			},
			onNavigationBarButtonTap() {  
						uni.switchTab({
							url:'../../index/index',
						})
				},
				methods:{
						
				}
		}
</script>
<style>
	@import 'finalizePayment.css'
</style>