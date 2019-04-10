<template>
	<view class="content">
		<view class="_all_content">
			<view class="_money_number">¥88.80</view>
			<view class="_after_sales  _display_flex">
				<view class="left_toApplyFor" v-for="(item,index) in afterSalesList" :key="index">
					<view class="top_toApplyFor_text">{{item.title}}</view>
					<view class="bottom_toApplyFor_number">{{item.number}}</view>
				</view>
			</view>
			<view class="_toChange_button">转入零钱</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 测试数据
				afterSalesList:[
					{
						title:"售后申请（元）",
						number:"¥55.20"
					},
					{
						title:"退款中（元）",
						number:"¥55.20"
					},
					{
						title:"已退款（元）",
						number:"¥55.20"
					}
				]
			};
		}
	}
</script>

<style>
@import "MarginBalance.css";
</style>
