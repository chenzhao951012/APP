<template>
	<view class="send-message">
		<view class="input-wrapper"><input type="text" cursor-spacing ="0" adjust-position="true" v-model="value"></view>
		
		<view class="iconfont ic_open" @click="sendMassage(value)">发送</view>
	</view>
</template>

<script>
	export default {
		name: 'send-message',
		props: {
			data: String,//聊天内容
			time: String,//提取名称的一个字
		},
		data(){
			return{
				value:'',
			}
		},
		methods:{
			sendMassage(){
				this.$emit('send',this.value)
			}
		}
	}
</script>

<style lang="scss" scoped="true">
	.send-message{
		box-sizing: border-box;
		padding: 0 15upx;
		height: 100upx;
		width: 100%;
		background:#ffbd38;
		line-height: 100upx;
		display: flex;
		flex-wrap: nowrap;
		.iconfont{
			width: 80upx;
			text-align: center;
			line-height: 100upx;
			flex: 0 0 auto;
			color: #fff;
			font-size: 28upx;
		}
		.input-wrapper{
			flex:1;
			padding: 10upx;
			input{
				box-sizing: border-box;
				padding: 0 15upx;
				width: 100%;
				height: 100%;
				border-radius: 50upx;
				background: #fff;
				font-size: 28upx;
			}
		}
	}
</style>