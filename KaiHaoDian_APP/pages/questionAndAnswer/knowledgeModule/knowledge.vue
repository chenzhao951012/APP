<template>
	<view class="content">
		<view class="_all_content">
			<view class="tag_type">请选择问答标签类型</view>
			<view class="_all_tag_type">
				<view class="tag_type_content" v-for="(item,index) in typeList" :key="index">{{item}}</view>
			</view>
			<view class="tag_type">请输入你想知道的回答</view>
			<textarea placeholder="例：我想开一家店但是自己没有过请问需要办什么手续？" placeholder-style="font-size:24upx;text-align:left;" />
			<view class="tag_type">请详细描述</view>
			<textarea placeholder="例：我手头资金30万 想开一个餐饮方面的店 路段好点的肯定是最好了..." placeholder-style="font-size:24upx;text-align:left;" />
			<view class="upload_photos _display_flex">
				<view class="icon_camera">&#xe60a;</view>
				<view class="upload_photos_range">最多1个视频/6张照片</view>
			</view>
			<view class="_anonymous">
				<checkbox checked="true" />匿名发表
			</view>
			<view class="_submit_button">提交</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 测试数据
				typeList:[
					"餐饮",
					"批发",
					"咖啡",
					"教育",
					"医疗",
					"美容",
					"娱乐",
					"超市",
					"通讯",
					"汽修",
					"服务",
					"酒店",
				]
			};
		}
	}
</script>

<style>
@import "knowledge.css";
</style>
