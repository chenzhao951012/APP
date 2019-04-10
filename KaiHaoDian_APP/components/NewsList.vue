<template>
	<view>
		<!-- <view class="listItem" v-for="(item,index) in list" :key="index" :click="tap(item.id)">
			<view class="listItem-img">
				<image class="img" :src="item.img"></image>
			</view>
			<view class="listItem-content">
				<view class="title" v-text="item.title"></view>
				<view class="info" v-text="item.info"></view>
				<view class="another" v-text="item.another"></view>
			</view>
		</view> -->
			<view class="openStory" @click="toQuestionAndAnswerDetails(item.id)" v-for="(item,index) in list" :key="index">
				<view class="openStory_cell">
					<view class="osCell_title" v-if="item.user!=undefined">
						<view class="osCell_title_left"> <image :src="item.user.portrait" mode=""></image> </view>
						<view class="osCell_title_right">
							<view class="_name">
								<text>{{item.user.name}}</text> <text v-if="item.user.position"> &nbsp;·&nbsp;</text> <text>{{item.user.position}}</text>
							</view>
							<view class="_company">
								<text class="_L textHidden">{{item.user.company}}</text>
								<text class="iconfont">&#xe730;</text>
							</view>
						</view>
					</view>
					<view class="osCell_content"
						>{{item.questions}}</view
					>
					<view class="osCell_text">{{item.replycontent}}</view>
					<!-- 没有回答(中间只放图片) -->
					<!-- <view class="osCell_ImgAll" v-if="index % 2 === 0">
						<image src="" mode=""></image>
					</view> -->
					<!-- 有回答(左侧图片,右边文字) -->
					<!-- <view class="osCell_ImgOrText" v-if="index % 2 !== 0">
						<image class="_logo" src="" mode=""></image>
						<view class="_text">叶公子高好龙，钩以写龙，凿以写龙，屋室雕文以写龙。于是天龙闻而下之，窥头于牖，施尾于堂。叶公见之，弃而还走，失其魂魄，五色无主。是叶公非好龙也，好夫似龙而非龙者也。</view>
					</view> -->
					<view class="osCell_bottom">
						<view class="osCell_bottom_left">{{item.addtime}}</view>
						<view class="osCell_bottom_center">已有{{item.attentioncount}}人关注</view>
						<view class="osCell_bottom_right"
							><text class="icon_comment">&#xe60f;</text><text>&nbsp;{{item.replycount}}</text></view
						>
					</view>
				</view>
			</view>
			<!-- end -->
		</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'Newslist',
	props:{
		list:Array,
		urls: String
	},
	data() {
		return {
			goUrl: this.urls
		};
	},
	methods: {
		tap(o) {
			let _this = this;
			if (_this.goUrl != '') {
				uni.navigateTo({
					url: _this.goUrl + o
				});
			}
		}
	}
};
</script>

<style lang="scss">

.openStory {
	padding: {
		top: 78upx;
	}
	background: #fff;
	.openStory_cell {
		width: 750upx;
		box-sizing: border-box;
		padding: 30upx 30upx 0;
		border-bottom: 4upx solid #eee;
	}
}

.osCell_title {
	width: 690upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	> .osCell_title_left,
	.osCell_title_left image {
		width: 80upx;
		height: 80upx;
		font-size: 0;
		background: #3285ff;
		border-radius: 50%;
	}
	> .osCell_title_right {
		width: 590upx;
		> ._name {
			font-size: 0;
			> text {
				display: inline-block;
				font-size: 34upx;
				color: #333;
				font-weight: bold;
			}
			> text:first-child {
				font-weight: normal;
			}
			> text:last-child {
				font-size: 28upx;
				color: #999;
				font-weight: normal;
			}
		}
		> ._company {
			font-size: 0;
			> text {
				font-size: 26upx;
				color: #666;
				display: inline-block;
				vertical-align: middle;
			}
			> ._L {
				max-width: 550upx;
				margin-right: 10upx;
			}
			> .iconfont {
				color: #fbbf13;
				font-size: 28upx;
			}
		}
	}
}

.osCell_content {
	font-size: 30upx;
	color: #333;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
	letter-spacing: 2upx;
	padding-bottom: 10upx;
	line-height: 44upx;
}
.osCell_text{
	font-size:30upx;
	color:#2f2f2f;
	width:690upx;
	max-height:348upx;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 8;
	overflow: hidden;
}
.osCell_ImgAll,
.osCell_ImgAll image {
	width: 690upx;
	height: 280upx;
	font-size: 0;
	background: #eee9e9;
	border-radius: 4upx;
}
.osCell_ImgOrText {
	width: 690upx;
	height: 130upx;
	background: #f3f3f3;
	font-size: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 4upx;
	> ._logo {
		width: 220upx;
		height: 130upx;
		border-radius: 4upx;
		background: lightblue;
	}
	> ._text {
		width: 460upx;
		height: 130upx;
		color: #666;
		line-height: 42upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		font-size: 26upx;
		letter-spacing: 2upx;
	}
}

.osCell_bottom {
	width: 690upx;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	font-size: 0;
	> view {
		font-size: 24upx;
		color: #999;
		line-height: 80upx;
	}
	> .osCell_bottom_left {
		width: 200upx;
	}
	> .osCell_bottom_center {
		width: 300upx;
	}
	> .osCell_bottom_right {
		width: 190upx;
		text-align: right;
		> text {
			display: inline-block;
			vertical-align: middle;
		}
	}
}
</style>
