<template>
	<view class="right-message">
		<view class="bubble-wrapper">
			<div class="bubble">
				<rich-text :nodes="data" class="titles"></rich-text>
			</div>
			<view class="time">{{time}}</view>
		</view>
		<view class="avator-wrapper">
			<view class="avator">
				<img src="http://img1.3lian.com/gif/more/11/201212/04378257474004fcdd62f619d724db0c.jpg" class="img">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'right-message',
		props: {
			data: String,//聊天内容
			time: String,//提取名称的一个字
		}
	}
</script>

<style lang="scss" scoped="true">
	.titles{
		font-size: 28upx;
		color: #333333;
	}
	.right-message{
		display:flex;
		padding-right: 20upx;
		justify-content: flex-end;
		margin-bottom: 30upx;
	}
	.avator-wrapper{
		flex: 0 0 auto;
	}
	.bubble-wrapper{
		max-width: 70%;
		padding-right: 20upx;
		.bubble{
			padding: 20upx;
			background: #eeeeee;
			border-radius:15upx;
			position: relative;
			
		}
	}
	.avator{
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		overflow: hiideen;
		background: #f1f1f1;
		.img{
			width:100%;
			height: 100%;
			border-radius: 50%;
		}
	}
	.time{
		line-height: 50upx;
		color:#b7b7b7;
		font-size: 24upx;
	}
</style>