<template>
	<view class="content">
		<view class="Incharge">
			<view class="chargeBox">
				<view class="title">
					入驻费用
				</view>
				<view class="price">
					<text>50000</text>.00
				</view>
			</view>
		</view>
			<view class="Incharge">
			<view class="chargeBox">
				<view class="title">
					支付方式
				</view>
				<!-- 支付方式 -->
				<view class="patternpayment">
					<view class="paymentBox">
						<view class="wallet">
							
							<view class="walletLeft">
								<text class="iconfont">&#xe6aa;</text>
							</view>
							<view class="walletRight">
								<text class="iconfont" @click="wallet" v-if="isCheck">&#xe72f;</text><text class="iconfont"  @click="wallet" v-if="!isCheck">&#xe968;</text>
							</view>
						</view>
						<view class="wechat">
						<view class="wechatLeft">
							<text class="iconfont">&#xe687;</text>
						</view>
								<view class="wechatRight">
								<text class="iconfont" v-if="isChecked" @click="wechatPay">&#xe72f;</text><text class="iconfont"  @click="wechatPay"  v-if="!isChecked">&#xe968;</text>
							</view>
						</view>
						</view>
					</view>
				</view>
			</view>
			<view class="payBox" @click="confirmpayment">
				确认支付
			</view>
		</view>
	
	
</template>

<script>
	export default {
		data() {
			return {
				seate:0,
				isChecked:true,
				isCheck:true
			};
		},
		methods:{
			//钱包
			wallet(){
				this.isCheck=!this.isCheck
				this.isChecked=true
				this.seate=1
			},
			//微信支付
			wechatPay(){
				this.isCheck=true
				this.isChecked=!this.isChecked
				this.seate=2
			},
			// 确认支付
			confirmpayment(){
				console.log(12)
				uni.navigateTo({
					url:'./finalizePayment/finalizePayment'
				})
// 				if(this.seate==0){
// 					uni.showToast({
// 						title:'请选择支付方式',
// 						duration:2000,
// 						icon:'none'
// 					})
// 				}else if(this.seate==1){
// 				uni.getProvider({
// 					service: 'oauth',
// 					success: function (res) {
// 						console.log(res.provider)
// 						if (~res.provider.indexOf('weixin')) {
// 							uni.login({
// 								provider: 'weixin',
// 								success: function (loginRes) {
// 								uni.requestPayment({
// 								provider: 'wxpay',
// 								orderInfo: {
// 							"dealId": "470193086",
// 							"appKey": "MMMabc",
// 							"totalAmount": "1",
// 							"tpOrderId": "3028903626",
// 							"dealTitle": "智能小程序Demo支付测试",
// 							"rsaSign": '',
// 							"bizInfo": ''
// 						}, //微信、支付宝订单数据
// 								success: function (res) {
// 									  uni.showToast({
//                                         title:"支付成功",
//                                         icon:"success",
//                                         duration:2000})
// 								},
// 								fail: function (err) {
// 		
// 									uni.showToast({
// 										title:"支付失败",
// 										icon:"success",
// 										 duration:2000
// 									})
// 								}
// 							});
// 								}
// 							});
// 						}
// 					}
// 				});
// 				}
			}
		}
	}
</script>

<style lang="scss">
@import 'Incharge.scss'
</style>
