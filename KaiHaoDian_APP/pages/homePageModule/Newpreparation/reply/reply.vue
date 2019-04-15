<template>
	<view class="content">
	<view class="header">
		<view class="commentBox" v-for="(item,index) in commentList" :key='index'>
			<view class="commentLeft">
				<view class="userImg" v-if="item.sysuser.portrait">
					<img :src="item.sysuser.portrait" alt=""/>
				</view>
				
			</view>
			<view class="commentRight">
				<view class="commentRight-top">
					<view class="comoneyPople" v-if="item.sysuser.name">
						{{item.sysuser.name}}<text class="dian" v-if="item.sysuser.position">·</text>{{item.sysuser.position}}
					</view>
					<view class="giveMilke">
						<text class="iconfont icons" v-if="item.praisecount">&#xe872;<text>{{item.praisecount}}</text></text>
					</view>
				</view>
				<view class="comoney" v-if="item.sysuser.company">
					{{item.sysuser.company}}<text class="iconfont iconed">&#xe730;</text>
				</view>
				<view class="question" v-if="item.content">
					{{item.content}}
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
		<view class="ComentImgList2" @click="addReply(userConent.id,sysuser.id)">
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
			console.log(option.id)
			this.getPagesInfo(option.id)
		},
		methods:{
						//回复   

						addReply: function(uidss,_comment_index) {
  							  var _this = this;
  										if (_this.connect == '') {
  										  wx.showToast({
  											title: '回复内容不能为空',
  											icon: 'none',
  											duration: 2000
  										  })
  										  return;
  										}
  									
  										var commentlist = _this.commentlist;
  									
  										uni.request({
  										    url: shoppublic.getUrl() + '/sysuserdetail/addReviews',
  										  data: {
  											token: _this.token,
											uid: _this.id,
											content:_this.connect,
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
				getPagesInfo(id){
					console.log(id)
					var that = this;
					// console.log(id);
				uni.request({
				  url: shoppublic.getUrl() + '/sysuserdetail/findlistReviews',
				  data: {
					token: 6239,
					uid: id
				  },
				  header: {
					'content-type': 'application/json' // 默认值
				  },
				  success: function(res) {
					  console.log(res)
					if (res.data.responseBody == null) {
					
					} else {
					
						that.commentList=res.data.responseBody
					
					}
				  }
				})
				},
			}
	}
</script>

<style lang="scss">
@import 'reply.scss'
</style>
