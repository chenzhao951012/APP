<template>
	<view class="content">
		<!-- 问题 -->
		<view class="_Cell_title_ _display_flex">
			<view class="_Cell_title_left_">你们是怎么把店铺快速转让出去的呢?</view>
			<view class="_cell_focus_on_">关注</view>
		</view>
		<view class="have_a_chat">聊聊</view>
		<!-- 发布时间及评论 -->
		<view class="_time_focus _display_flex">
			<view class="_specific_time">时间</view>
			<view class="_number_add icon_comment">999+&nbsp;&#xe667;</view>
		</view>
		<!-- 具体用户评论信息 -->
		<view class="_describe_content"  v-for="(item,index) in userInformation" :key="index">
			<view class="_top_information _display_flex">
				<image class="_user_image_info"></image>
				<view class="right_user_information">
					<text class="_user_name_info">{{item.name}}</text>
					<text class="_user_company_info">{{item.company}}</text>
				</view>
			</view>
			<!--  maxlength=1 @blur="bindTextAreaBlur" placeholder="" placeholder-style="color:#101010;font-size:28upx;" -->
			<view class="_textarea">双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 双击编辑文本 。</view>
			<view class="_bottom_information _display_flex">
				<view class="left_specific_time">{{item.time}}</view>
				<view class="right_Review_praise">
					<text class="_left_comments">{{item.comments}}&nbsp;<text class="icon_give_like">&#xe667;</text>&nbsp;&nbsp;</text>
					<text class="_right_give_like icon_give_like">{{item.giveLike}}&nbsp;<text class="icon_give_like">&#xe871;</text></text>
				</view>
			</view>
		</view>
		<!-- 相关推荐 -->
		<view class="_recommend_title">相关推荐</view>
		<view class="_related_recommend">
			<view class="_recommend_question">开店和开公司有区别吗?</view>
			<view class="_recommend_answer">有区别啊 有区别啊 有区别啊 有区别啊 有区别啊 有区别啊 有区别啊 有区别啊 有区别啊 有区别啊</view>
			<view class="_bottom_comments _display_flex">
				<view class="_comments_number"><text class="icon_comment">&#xe667;</text>&nbsp;222</view>
				<view class="_comments_time">2018-1-14</view>
			</view>
		</view>
		<!-- 发表评论 -->
		<view class="_comment_related _display_flex">
			<input class="_comment_box"/>
			<view class="_published_button" @click="jumpToMineComments">发表</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 测试数据
				userInformation:[
					{
						name:"名称",
						company:"西安好嗨哟有限公司",
						time:"2019-1-14",
						comments:0,
						giveLike:0
					},{
						name:"名称",
						company:"西安好嗨哟有限公司",
						time:"2019-1-14",
						comments:0,
						giveLike:0
					}
				]
			};
		},
		methods: {
			bindTextAreaBlur: function (e) {
				console.log(e.detail.value)
			},
			// 页面跳转至我的评论
			jumpToMineComments(){
				uni.navigateTo({
					url: 'mineComments',
					success: res => {
						console.log(res);
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>
@import "viewAllComments.css";
</style>
