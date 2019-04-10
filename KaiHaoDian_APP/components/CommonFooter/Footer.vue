<template>
			<view class='callAndShare' >
			  <!--说说你对项目的看法 -->
			  <view class='callAndShare_Left ' bindtap='clickShow'>
				<image src=' imageUrl +  /images/Comment.png'></image>
			  </view>
			  <!-- 电话 -->
	<!-- 		  <view data-tall="{{list.phone}}" bindtap="calling" class='callAndShare_Center'> -->
				<image src='imageUrl + /images/Dcall.png'></image>
			  </view>
			  <!-- 分享 -->
			  <view class='callAndShare_Right'>
			<!-- 	<button open-type="share" bindsubmit="onShareAppMessage"> -->
				  <image src='imageUrl + /images/FXT.png'></image>
				</button>
			  </view>
			</view>
	
</template>

<script>
</script>

<style>
	@import './Footer.scss';
</style>
