<template>
	<view class="content">
			<view class="lines">
			
		</view>
		<view class="Nav">
			<SlidingNavigation :modelData="modelData" @changed='changed'></SlidingNavigation>
		</view>
		
	<view class="openStory">
		<view class="openStory_title"></view>
		<view class="openStory_cell" v-for="(item,index) in questionsList" :key="index" @click="toWenTiDetail(item.id)">
			<view class="Line">
				
			</view>
			<view class="LineBOX">
				
			</view>
		<view class="openStory_cellBox">
		
			<view class="openStory_cell-title">
				{{item.questions}}
			</view>
			<!-- 项目类型 -->
			<view class="typestitle" v-if="item.typevalue[0]=='服务'">
				{{item.typevalue[0]}}
			</view>
			<view class="typestitle" v-if="item.typevalue[0]=='教育'">
				{{item.typevalue[0]}}
			</view>
			<view class="typestitle2" v-if="item.typevalue[0]=='美容'">
				{{item.typevalue[0]}}
			</view>
			<view class="typestitle3" v-if="item.typevalue[0]=='服饰'">
				{{item.typevalue[0]}}
			</view>
			<view class="typestitle4" v-if="item.typevalue[0]=='超市'">
				{{item.typevalue[0]}}
			</view>
			<view class="typestitle5" v-if="item.typevalue[0]=='餐饮'">
				{{item.typevalue[0]}}
			</view>
			<view class="typestitle6" v-if="item.typevalue[0]=='百货'">
				{{item.typevalue[0]}}
			</view>
			<view class="typestitle7" v-if="item.typevalue[0]=='娱乐'">
				{{item.typevalue[0]}}
			</view>
				<view class="typestitle" v-if="item.typevalue[0]=='汽修'">
				{{item.typevalue[0]}}
			</view>
			</view>
				<view class="typestitle6" v-if="item.typevalue[0]=='批发'">
				{{item.typevalue[0]}}
			</view>
				<view class="typestitle5" v-if="item.typevalue[0]=='酒店'">
				{{item.typevalue[0]}}
			</view>
			
			<!-- //项目图片 -->
			<view class="openStoryImg">
				<view class="">
					<scroll-view class="ImgBoxs" scroll-x  v-if="item.listimage">
							<img :src="items" alt="" v-for="(items,idx) in item.listimage" :key="idx" v-if="item.listimage">
					</scroll-view>
					
				</view>
			</view>
			<!-- //用户信息 -->
	<!-- 		<view class="userInfo" v-if="item.user">
				<view class="userInfoList">
					<view class="userInfoLeft">
						<img :src="item.user.portrait" alt="">
					</view>
					<view class="userInRight">
						<view class="userInTop">
							<text class="userName">{{item.user.name !=undefined ? item.user.name :"匿名用户"}} <text v-if="item.user.position">·</text> {{item.user.position}}</text>
							
						</view>
						<view class="userInfoCompy" v-if="item.user.company">
							{{item.user.company}}<text class="iconfont usericonfont">&#xe61c;</text>
						</view>
						
					</view>
				</view>
			</view> -->
			<!-- //底部关注 -->
			<view class="infoBox">
				{{item.replycontent}}
			</view>
			<view class="informationBox">
				<text class="usertime">{{item.addtime}}</text>
				<view class="informatio">
					
					<view class="">
						<text class="iconfont iconfonts">&#xe6eb;</text> <text>{{item.attentioncount}}</text>
					</view>
					<view class="">
						<text class="iconfont iconfonts">&#xe60e;</text> <text>{{item.attentioncount}}</text>
					</view>
				</view>
				<view class="informatioLine">
					
				</view>
				
				
			</view>
		</view>
		</view>

	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic';
	import SlidingNavigation from '@/components/SlidingNavigation.vue'
	export default {
		data() {
			return {
				modelData:[
					{
					lable:"问题"
					},
					{
					lable:"回答"
					},
				],
				// 测试数据
				questionsList:[],
			};
		},
		components:{
			SlidingNavigation
		},
		onLoad(){
			
			var _this=this
			_this.getWenTiLieBiao()
		},
		methods:{
			changed(index){
				console.log(index)
			},
			//调至问答首页
			  toWenTiDetail(id) {
					let _this = this
					uni.navigateTo({
					  url: '../../questionAndAnswer/questionAndAnswerDetails/questionAndAnswerDetails?id=' + id,
					})
				  },
			//删除
			 deleteWenTi(id) {
					let _this = this
					  var questionsList = _this.questionsList
				
					uni.request({
					  url: shoppublic.getUrl() + '/personalcenter/deleteQuestions',
					  data: {
						token: token,
						id:id
					  },
					  success: function (res) {
						questionsList.splice(index, 1)
						  _this.questionsList=questionsList
						
					  },
					  fail: function (res) {
					  }
					});
				  },
				getWenTiLieBiao: function () {
				var _this = this;
				wx.request({
				  url: shoppublic.getUrl() + '/personalcenter/findQuestionsList',
				  data: {
					token: 132
				  },
				  success: function (res) {
					_this.questionsList=res.data.responseBody
					console.log(_this.questionsList)
				  },
				  fail: function (res) {
				  }
				});
			  },
		
	},
}
</script>

<style lang="scss">
	// 引入样式
	@import "mineAskQuestions.scss";
</style>
