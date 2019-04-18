<template>
<view class="content">
		<view class="paymentsuccess">
			<view class="paymentBox">
				<view class="title">
					<view class="">
						恭喜你购买成功
					</view>
					<view class="">
						玫瑰套餐A
					</view>
				</view>
				<!-- //订单编号 -->
				<view class="orderNumber">
					<view>订单卷序列号</view>
					<view>111112556351561689865598498</view>
				</view>
				<view class="QRcode">
					<img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=412142689,3306299431&fm=27&gp=0.jpg" alt="">
					<view class="figure">
						<img src="../../../../../../static/figure1.png" alt="">
					</view>
				</view>
				<view class="advicePayment">
					<img src="../../../../../../static/figure2.png" alt="">
					<view class="figure2">
						· 支付通知已下发至你的手机
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
				onNavigationBarButtonTap() {  
						uni.navigateTo({
							url:'../../../flowerOrd/flowerOrd?id='+123
						})
				},
	}
</script>

<style lang="scss">
@import 'completionPayment.scss'
</style>
