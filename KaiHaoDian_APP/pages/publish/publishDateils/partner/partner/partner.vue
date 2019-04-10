<template>
	<view>
		<image :src="imgUrl" style="width:100%;height:825px"></image>
		<image :src="imgUrl2" style="width:100%;height:920px"></image>
		<image :src="imgUrl3" style="width:100%;height:1106px"></image>
		<view class="botoomBox">
			<button type="primary" @touchend="Callphone">拨打电话,联系我们</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl:"http://39.104.48.81:8088/shop_file/images/zmxq-a.jpg",
				imgUrl2:"http://39.104.48.81:8088/shop_file/images/zmxq-b.jpg",
				imgUrl3:"http://39.104.48.81:8088/shop_file/images/zmxq-c.jpg",
			};
		},
				methods:{
			
			Callphone(e){
			 event.preventDefault();
			uni.showModal({
				title: '',
				content: '拨打029-8864-0759',
				success: function (res) {
					if (res.confirm) {
						uni.makePhoneCall({
						phoneNumber: '13080909122' //仅为示例
					});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
			
				
			}
		},
	}
</script>

<style lang="scss">
.botoomBox{
	padding:0 50upx;
	height: 200upx;
	button{
		margin-top: 50upx;
		}
}
</style>
