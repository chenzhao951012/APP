<template>
	<view class="Severice">
			<view class="LogoBox">
			<view class="Imgbox">
					<img src="../../../static/logo.png" alt="">
					<view class="titles">
						欢迎使用开好店
					</view>
			</view>
		</view>
		<view class="connent" @tap="playPhone">
			<view>客服电话</view>
			<view class="versions">029-88640757</view>
		</view>
		<view class="connent">
			<view>官方网站</view>
			<view class="versions">www.kaohaodianapp.com</view>
		</view>
		<view class="connent">
			<view>招商广告</view>
			<view class="versions">2277341118@qq.com</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serviceImgs:"http://39.104.48.81:8088/shop_file/images/onLine_service.png",
				phoneImgs:"http://39.104.48.81:8088/shop_file/images/phone_service.png"
			};
		},
		methods:{
			playPhone(){
				
			uni.showModal({
				title: '提示',
				content: '打电话给 029-8864-0759',
				success: function (res) {
					if (res.confirm) {
						uni.makePhoneCall({
								phoneNumber: '02988640759' //仅为示例
							});
				} else if (res.cancel) {
					
					uni.showToast({
						title: '取消成功',
						duration: 2000
					});
				}
			}
		});
			}
		}
	}
</script>

<style lang="scss">
@import 'service.css'
</style>
