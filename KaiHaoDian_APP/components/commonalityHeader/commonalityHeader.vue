<template>
	<view class="content">
		<view class="commonalityHeader">
			<view class="commonality">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
</script>

<style scoped>
	.commonalityHeader{
		width: 750upx;
		background-color: #f3f3f3;
		padding-top: 20upx;
		box-sizing: border-box;
	}
	.commonality{
		background-color: #fff;
		border-radius: 10upx 10upx 0 0;
	}
</style>
