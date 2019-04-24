<template>
	<view class="left-message">
		<view class="avator-wrapper">
			<view class="avator">
				<img src="http://img1.3lian.com/gif/more/11/201212/04378257474004fcdd62f619d724db0c.jpg" class="img">
			</view>
		</view>
		<view class="bubble-wrapper">
			<div class="bubble">
				<rich-text :nodes="data" class="titles"></rich-text>
			</div>
			<view class="time">{{time}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'left-message',
		props: {
			data: String,//聊天内容
			time: String,//提取名称的一个字
		}
	}
</script>

<style lang="scss" scoped="true">
	.titles{
		font-size: 28upx;
	}
	.left-message{
		display:flex;
		padding-left: 20upx;
		margin-bottom: 30upx;
	}
	.avator-wrapper{
		
	}
	.bubble-wrapper{
		max-width: 73%;
		padding-left: 20upx;
		box-sizing: border-box;
		
		.bubble{
			
			padding: 20upx;
			background: #ffde9b;
			border-radius:0upx 10upx 10upx 20upx;
			position: relative;
			box-sizing: border-box;
// 			&::before{
// 				position:absolute;
// 				left: -20upx;
// 				top: 10upx;
// 				content: "";
// 				width: 0; 
// 				height: 0; 
// 				border-top: 20px solid transparent; 
// 				border-right: 20px solid #d5ebff; 
// 				border-bottom: 20px solid transparent; 
// 			}
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
		text-align: right;
	}
	
</style>