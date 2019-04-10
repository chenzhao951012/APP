<template>
	<view class=""  style="margin-bottom: 150upx;" v-if="isShowsubConment">
		<view class="">
		<view class="commentImg">
			<img src="http://39.104.48.81:8088/shop_file/images/pinglun.png" alt="">
		</view>
		<view class="commentText">
			<text>暂无评论</text>
		</view>
	</view>
	</view>

</template>

<script>
	export default{
		props:['isShowsubConment'],
	}
</script>

<style lang="scss">
	.commentImg{
			width: 100%;
			display: flex;
			align-items: center;
	
		img{
			margin:21px auto 8px;
			width: 140upx;
			height: 132upx;
		}	
		}
		.commentBox{
			margin-bottom: 120upx;
			
		}
		.commentText{
			text-align: center;
			font-size: 12px;
			color:#999999;
		}
</style>
