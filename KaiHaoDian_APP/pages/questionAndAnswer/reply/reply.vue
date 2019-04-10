<template>
	<view class="content">
	<view class="header">
		<view class="commentBox">
			<view class="commentLeft">
				<view class="userImg" v-if="userConent.user">
					<img :src="userConent.user.portrait" alt=""/>
				</view>
				
			</view>
			<view class="commentRight">
				<view class="commentRight-top">
					<view class="comoneyPople" v-if="userConent">
						{{userConent.user.name}}<text class="dian" v-if="userConent.user.position">·</text>{{userConent.user.position}}
					</view>
					<view class="giveMilke">
						<text class="iconfont icons" v-if="userConent.praisecount">&#xe872;<text>{{userConent.praisecount}}</text></text>
					</view>
				</view>
				<view class="comoney" v-if="userConent.user">
					{{userConent.user.company}}<text class="iconfont iconed">&#xe730;</text>
				</view>
				<view class="question" v-if="userConent.content">
					{{userConent.content}}
				</view>
			</view>
		</view>
		<view class="title">
			全部回复
		</view>
			<view class="commentBox subcommentBox" v-for="(item,index) in commentList" :key="index">
				
			<view class="commentLeft">
				<view class="userImg">
					<img :src="item.user.portrait" alt=""/>
				</view>
				
			</view>
			<view class="commentRight commentRight-two">
				<view class="commentRight-top">
					<view class="comoneyPople">
						{{item.user.name}}<text class="dian" v-if="item.user.position">·</text>{{item.user.position}}
					</view>
					<view class="giveMilke">
						<text class="iconfont icons" v-if="item.praisecount">&#xe872;<text >{{item.praisecount}}</text></text>
					</view>
				</view>
				<view class="comoney">
					{{item.user.company}}<text class="iconfont iconed">&#xe730;</text>
				</view>
				<view class="question">
					{{item.comment_level_context}}
				</view>
			</view>
		</view>
		
	</view>
		<view class="bottonBottom">
		<view class="LIst">
			<view class="ComentInput">
				<input type="text" value="" placeholder="输入你的评论~"  v-model="connect"/>
			</view>
		</view>
		<view class="ComentImgList2" @click="addReplyOfHuiFu(userConent.id,sysuser.id)">
			<img src="../../../static/conmented.png" alt="">
		</view>
	</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic.js';
	export default {
		data() {
			return {
				
				ideaId:"",
				replayOneTime: 0,
				topContent:"",
				idNuber:"",
				comment_list:[],
				sysuser:"",
				comoney:"",
				userConent:"",
				connect:"",
				index:"",
				id:"",
				commentList:[],
				token:6239,
			};
		},
		onLoad(option) {
			this.index=option.key
			this.id=option.huiFuId
			this.getPingLunDetail(option.key,option.id)
			this.ideaId=option.xiangFaId
		},
		methods:{
					//回复
					  addReplyOfHuiFu() {
						var _this = this;
						if (_this.connect.length == 0) {
						  uni.showToast({
							title: '内容不能为空',
							icon:"none",
							duration: 2000
						  })
						  return false;
						}
						this.replayOneTime++;

						
						// console.log(this.data.replayOneTime)
						if (this.replayOneTime != 1) {
						  return false;
						}
						
						var userConent = this.userConent;
						uni.request({
						  url: shoppublic.getUrl() + '/questions/addReply',
						  data: {
							token: _this.token,
							qid: _this.ideaId,
							rid: _this.id,
							content: _this.connect
						  },
						  success: function (res) {
							uni.showToast({
							  title: '积分加' + 1,
							  duration: 2000
							})
							_this.getPingLunDetail()
						  },
						  fail: function (res) {
						  }
						});
					  },
				
						//获取评论列表
				  getPingLunDetail: function () {
					var _this = this;
					wx.request({
					  url: shoppublic.getUrl() + '/questions/findQuestionsReplyByid',
					  data: {
						// 回复的ID
						token: _this.token,
						id: _this.id
					  },
					  success: function (res) {
						
							
						// console.info(res.data.responseBody);
						
						  _this.commentList=res.data.responseBody.replylist
						    _this.userConent=res.data.responseBody
						console.log( _this.commentList)
						// console.log(_this.data.topContent)

					  },
					  fail: function (res) {
					  }
					});
				  },
			}
	}
</script>

<style lang="scss">
@import 'reply.scss'
</style>
