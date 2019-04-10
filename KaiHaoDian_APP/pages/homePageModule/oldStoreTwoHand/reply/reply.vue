<template>
	<view class="content">
	<view class="header">
		<view class="commentBox">
			<view class="commentLeft">
				<view class="userImg" v-if="sysuser.portrait">
					<img :src="sysuser.portrait" alt=""/>
				</view>
				
			</view>
			<view class="commentRight">
				<view class="commentRight-top">
					<view class="comoneyPople" v-if="userConent">
						{{userConent.sysuser.name}}<text class="dian" v-if="userConent.sysuser.position">·</text>{{userConent.sysuser.position}}
					</view>
					<view class="giveMilke">
						<text class="iconfont icons" v-if="userConent.praisecount">&#xe872;<text>{{userConent.praisecount}}</text></text>
					</view>
				</view>
				<view class="comoney" v-if="comoney">
					{{comoney}}<text class="iconfont iconed">&#xe730;</text>
				</view>
				<view class="question" v-if="userConent.content">
					{{userConent.content}}
				</view>
			</view>
		</view>
		<view class="title">
			全部回复
		</view>
			<view class="commentBox subcommentBox" v-for="(item,index) in comment_list" :key="index">
				
			<view class="commentLeft">
				<view class="userImg">
					<img :src="item.sysuser.portrait" alt=""/>
				</view>
				
			</view>
			<view class="commentRight commentRight-two">
				<view class="commentRight-top">
					<view class="comoneyPople">
						{{item.sysuser.name}}<text class="dian" v-if="item.sysuser.position">·</text>{{item.sysuser.position}}
					</view>
					<view class="giveMilke">
						<text class="iconfont icons" v-if="item.praisecount">&#xe872;<text >{{item.praisecount}}</text></text>
					</view>
				</view>
				<view class="comoney">
					{{item.sysuser.company}}<text class="iconfont iconed">&#xe730;</text>
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
		<view class="ComentImgList2" @click="addReplyOfHuiFu_Two(userConent.id,sysuser.id)">
			<img src="../../../../static/conmented.png" alt="">
		</view>
	</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic.js';
	export default {
		data() {
			return {
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
			this.id=option.id
			this.getPagesInfo(option.key,option.id)
		},
		methods:{
						//回复
				   //  添加二级回复
						addReplyOfHuiFu_Two: function(uidss,_comment_index) {
  							  var _this = this;
  										if (_this.connect == '') {
  										  wx.showToast({
  											title: '回复内容不能为空',
  											icon: 'none',
  											duration: 2000
  										  })
  										  return;
  										}
  									
  										var commentlist = _this.commentList;
  									
  										uni.request({
  										  url:shoppublic.getUrl() + '/comment/addLevelComment',
  										  data: {
  											rid: _this.token,
  											pktype: 8,
  											pkid: _this.id,//商品跳转I
  											comment_id:uidss,//用户id
  											uid:_comment_index,//商品id
  											comment_level_context: _this.connect,//评论内容
  											 comment_level: 2,
											type: "s_001",
  										  },
  										  success: function(res) {
  											uni.navigateTo({
  												url:'reply?key=' + _this.index + '&id=' + _this.id
  											})
  											
  										  },
  										  fail: function(res) {
  											  console.log(res)
  										  }
  										});
  									  },
						//获取评论列表
				getPagesInfo(index,id){
					console.log(id)
					var _this = this;
					// console.log(id);
					uni.request({
						  url: shoppublic.getUrl() + '/secondHandItem/findSecondHandItemByid',
						data:{
							id:id, // 当前页面的id
							token:_this.token, // 登陆用户的id
						},
						success:res => {
							_this.commentList = res.data.responseBody.commentlist;
							_this.userConent=_this.commentList[index]
							_this.comoney=_this.userConent.sysuser.company
							_this.sysuser=_this.userConent.sysuser
							_this.idNuber=	_this.userConent.id
							_this.comment_list=res.data.responseBody.commentlist[index].comment_list
							console.log(res)
						}
					})
				},
			}
	}
</script>

<style lang="scss">
@import 'reply.scss'
</style>
