<template>
	<view class="content">
		<NoComment :isShowsubConment="isShowsubConmentd"></NoComment>	
		<!-- 项目评论 -->
		<view class="commentParent" v-show="isShowConmentt">
			<view class="comment_title"> <view>项目评论</view> <view>已有{{total}}人评论</view> </view>
			<view class="conment_content">
				<!-- 一级评论 -->
				<view class="conment_one" v-for="(item, index) in commentlist" v-if="commentlist" :key="index">
					<view class="_title">
						<view class="_portrait"><image :src="item.sysuser.portrait" mode=""></image></view>
						<view class="_userAndCompany">
							<view class="_name">{{item.sysuser.name}}</view>
							<view class="_company" v-if="item.sysuser.company">
								<view>{{item.sysuser.company}}</view>
								<view class="iconfont">&#xe730;</view>
							</view>
						</view>
					</view>
					<view class="_content" style="margin-left: 108upx;">{{item.content}}</view>
					<view
						:class="{
							_operation: ' _operation, ',
							_operation_border: commentList_two > 0 ? '_operation_border' : ''
						}"
					>
						
						<view class="_time" style="margin-left: 108upx;">{{item.commenttime}}</view>
						
						<view class="commentAndPraise">
							<view class="_comment iconfont" @touchend="chanchu(index,item.id)"
								>&#xe7ed;&nbsp;删除</view
							>
							<view class="_comment iconfont" @touchend="clickZanImg(index,item.id)"
								><text :class="changecolor" ><text class="iconfont">&#xe872;</text></text>{{item.praisecount}}</view
							>
							<view class="praise iconfont" @touchend="replyTwo(item.id,item.sysuser.id,item.sysuser.nickname,item.sysuser.company,2)">&#xe667;&nbsp;</view>
						</view>
					</view>
					<!-- 二级评论 -->
					<view
						class="conment_two"
						v-for="(items, indexs) in item.comment_list"
						:key="indexs"
						
					>
						<view class="_title">
							<view class="_portrait"><image :src="items.sysuser.portrait" mode=""></image></view>
							<view class="_userAndCompany">
								<view class="_name">{{items.sysuser.name}}</view>
								<view class="_company" v-if="items.sysuser.company">
									<view>{{items.sysuser.company}}</view>
									<view class="iconfont">&#xe730;</view>
								</view>
							</view>
						</view>
						<view class="_content" style="margin-left: 70upx;">{{items.comment_level_context}}</view>
						<view class="_operation" style="margin-left: 60upx;">
							<view class="_time">{{items.comment_add_time}}</view>
							<view class="commentAndPraise">
								<view class="_comment iconfont" @click="minusCommentList_two">&#xe667;&nbsp;0</view>
								<view class="praise iconfont">&#xe872;&nbsp;0</view>
							</view>
						</view>
						<!-- 二级评论 -->
					</view>
				</view>
			</view>
		</view>
		<!-- 评论框 -->
		<view class="comment_box" style="height: 92upx;background-color:#FFFFFF;">
			<view class="" style="display: flex; background-color: #f5f5f5" v-show="InputBox" >
				<view class="InputBox">
					<input type="text" value="" placeholder="我来评论" v-model="wenDaDetailHuiFu" @blur="unfoued"/>
				</view>
				<view class="" style="margin-left: 30upx;margin-top: 10upx;">
					<button type="primary" style="height: 70upx;font-size: 14px;" @touchend="comment"> 评论</button>
					</view>
			</view>
			<view class="" style="display: flex; background-color: #f5f5f5" v-show="replyBox" >
				<view class="InputBox">
					<input type="text" value="" :placeholder=" '回复 :' + nickname" v-model="replymagess" ref="textinput" @blur="unfous"/>
				</view>
				<view class="" style="margin-left: 30upx;margin-top: 10upx;">
					<button type="primary" style="height: 70upx;font-size: 14px;" @touchend="addReplyOfHuiFu_Two">回复</button>
					</view>
			</view>
						<view class='callAndShare' v-show="coMentBox">
							 <view class='callAndShare_Left '  @touchend='clickShow'>
										<image src='http://39.104.48.81:8088/shop_file/images/Comment.png'></image>
									  </view>
									  <!-- 电话 -->
									 <view data-tall="list.phone" @click="dialPhone" class='callAndShare_Center'>
										<image src='http://39.104.48.81:8088/shop_file/images/Dcall.png'></image>
									  </view>
									  <!-- 分享 -->
									  <view class='callAndShare_Right'>
										<button open-type="share" bindsubmit="onShareAppMessage">
										  <image src='http://39.104.48.81:8088/shop_file/images/FXT.png'></image>
										</button>
									  </view>
									  <!--说说你对项目的看法 -->
									 
								</view>
		</view>
	</view>
</template>

<script>
	import NoComment from '@/components/noComment/noComment.vue'
	import shoppublic from '@/common/shoppublic.js';
	var imageUrl = shoppublic.getImageUrl();
	export default {
		components:{
			
			NoComment:NoComment
		},
		props:['pktype2','PingLunList','isShowConment','isShowsubConment','token','pktype','url','id',"deleurl",'total','conmented',"ZanUrl","TwohuiUrl","type",'thePhone','Twocomment'],
		data() {
			return {
				replymagess:"",
				replyBox:false,
				nickname: '',
				nickname1: '',
				uidss:"",
				comment_index:"",
				company1: null,
				changecolor:"changecolor",
				 commentstate:0,
				isShowsubConmentd:"",
				isShowConmentt:"",
				commentlist:[],
				coMentBox:true,
				wenDaDetailHuiFu:"",
				InputBox:false,
				focusT: true,
				suibian1: false,
				suibian2: true,
				commentList_two:0,
			};
		},
		// 参数在props接收
		created() {
			var _this=this
			this.commentlist=this.PingLunList
				setTimeout(()=>{
				
			if(_this.commentlist!=undefined){
				console.log(_this.commentlist.length)
				 _this.isShowConmentt=true
				 _this.isShowsubConmentd=false
			}else{
			_this.isShowConmentt=false
			 _this.isShowsubConmentd=true
			}
			
			},200)
			console.log(_this.commentlist)
		
		},
	
		methods:{
			//拨打电话
				//拨打电话
			dialPhone(){
				var _this=this
						uni.showModal({
						title: '提示',
						content: "亲,是否要拨打电话给 "+ _this.thePhone,
					success: function (res) {
						if (res.confirm) {
							uni.makePhoneCall({
							phoneNumber:_this.thePhone,
							  success: function(res) {
								console.log(res);
									},//仅为示例
						});
						} else if (res.cancel) {
			            console.log('用户点击取消');
						}
					}
			});
				},
			unfoued(){
				this.coMentBox=true
				this.InputBox=false
			},
			//二次回复
			  addReplyOfHuiFu_Two: function(content) {
							  var _this = this;
										if (_this.replymagess == '') {
										  wx.showToast({
											title: '回复内容不能为空',
											icon: 'none',
											duration: 2000
										  })
										  return;
										}
									
										var commentlist = _this.commentlist;
										
										var comment_level_context;
										if (_this.two === 2 && _this.company1) {
										  comment_level_context = "@" + _this.company1 + ': ' + _this.replymagess
										} else if (_this.two === 1 && _this.nickname) {
										  comment_level_context = "@" + _this.nickname + ': ' + _this.replymagess
										} else if (_this.two === 2) {
										  comment_level_context = _this.replymagess;
										}
										console.log(comment_level_context)
										uni.request({
										  url:_this.Twocomment,
										  data: {
											rid: _this.token,
											pktype: _this.pktype2,
											pkid: _this.id,
											comment_id:_this.uidss,
											uid:_this.comment_index,
											comment_level_context: comment_level_context,
											comment_level: 2,
											type: _this.type
										  },
										  success: function(res) {
											console.log(_this.id, _this.id,_this.uidss,_this.comment_index)
											console.log(res)
												_this.$emit('getPageInfo',_this.id)
												_this.replymagess= ""
												_this.reply=false
										  },
										  fail: function(res) {
											  console.log(res)
										  }
										});
									  },
			 replyTwo: function(id1,id,nickname,company,two) {
									let that = this;
									 this.coMentBox=false
									 this.replyBox=true		
										that.company1= company ? company : null,
										that.comment_index = id;
										that.uidss =id1
										that.nickname=nickname,
										that.nickname1=id,
										that.two=two										
								  },
			unfous(){
				this.coMentBox=true
				this.replyBox=false
			},
			//点赞
			clickZanImg: function(index,id) {
				
				var that=this
									var index = index;
									var id =id
									var commentlist = this.commentlist;
									// 点完赞之后的请求
									console.log(commentlist)
									var _this = this;
									uni.request({
									  url: _this.ZanUrl, //, //仅为示例，并非真实的接口地址
									  data: {
										cid: id,
										token: _this.token
									  },
									  header: {
										'content-type': 'application/json' // 默认值
									  },
									  success: function(res) {
										var flag = res.data.msgCode;
										if (flag == '1') {
											that.changecolor="changecolored"
										  commentlist[index].praisestate = true;
										  commentlist[index].praisecount = commentlist[index].praisecount + 1;
										} else {
											that.changecolor="changecolore"
										  commentlist[index].praisestate = false;
										  var praisecount = commentlist[index].praisecount - 1;
										  if (praisecount >= 0) {
											commentlist[index].praisecount = praisecount;
										  } else {
											commentlist[index].praisecount = 0;
										  }
										}
												
										  _this.commentlist=commentlist
									
			
									  },
									  fail: function(res) {}
									})
			},
			//删除
				 chanchu: function(index,id) {
									var _this = this
									
									var commentlist = _this.commentlist
									
									wx.request({
									  url:_this.deleurl,
									  data: {
										id: id
									  },
									  success: function(res) {
										commentlist.splice(index, 1);
										_this.commentlist=commentlist
									  }
									})
								  },
			//评论
						comment(){
							
							var that = this
							let userToken = that.token
							that.conmented
							that.isDele=true
							if(userToken != ""){
								var content = that.wenDaDetailHuiFu
								if(content.length >= 1 && content != ""){
										// that.commentNum()
									that.commentstate=1	
									that.addReplyOfHuiFu(content)
									that.isShowsubConmentd=false
									that.isShowConmentt=true
									// that.$emit('conmented')
// 									setTimeout(()=>{
// 										that.isDele=false
// 									},10000)
								}
								 
							}else{
									uni.showModal({
											title: '提示',
											content: "亲,评论内容不能为空",
											  showCancel: false,
										success: function (res) {
											if (res.confirm) {
										
											} else if (res.cancel) {
										   
											}
										}
								});
							}
							
							},
			// 评论共用函数
			 addReplyOfHuiFu: function(content) {
										var _this = this;
										//评论列表
										var commentlist = _this.PingLunList;
										wx.request({
										  url:_this.url,
										  data: {
											token: _this.token,
											pktype: _this.pktype,
											pkid: _this.id,
											cid: 0,
											content: content
										  },
										  success: function(res) {
											  console.log(res)
											var reply = res.data.responseBody;
											if (commentlist != undefined && commentlist.length > 0) {
											  commentlist.reverse()
											  commentlist.push(reply)
											  commentlist.reverse()
											 
												 _this.commentlist=commentlist,
												 _this.wenDaDetailHuiFu= ""
			// 									isPingLun: false,
			// 									faSongFlag: false
											 setTimeout(()=>{
												 uni.showToast({
												 	title: '评论成功',
												 	icon: 'success',
												 	duration: 2000
												 })
											 },300)
											  
											} else {
											  var commentlist2 = [];
											  commentlist2[0] = reply;
											
												 _this.commentlist=commentlist2,
												_this.wenDaDetailHuiFu= ""
												
											}
			
										  },
										  fail: function(res) {}
										});
									  },
				clickShow() {
				this.coMentBox=false
				this.InputBox=true
			  },
			addCommentList_two() {
				this.commentList_two += 1;
			},
			minusCommentList_two(){
				this.commentList_two -= 1;
			},
		}
	}
</script>

<style lang="scss">
@import './commentModule.scss'
</style>
