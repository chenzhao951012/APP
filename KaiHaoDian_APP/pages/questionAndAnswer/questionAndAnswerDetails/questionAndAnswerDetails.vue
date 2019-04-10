<template>
	<view class="content">
		
		<view v-for="(item,index) in recommendationsList.slice(0,1)" :key="index" class="questiondetailedness" v-if="recommendationsList">
			<view class="_top_question">{{item.questions.questions}}</view>
			<!-- <view class="questiontype">
				{{item.typevalue[0]}}
			</view> -->
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
				<view class="typestitle6" v-if="item.typevalue[0]=='批发'">
				{{item.typevalue[0]}}
			</view>
				<view class="typestitle5" v-if="item.typevalue[0]=='酒店'">
				{{item.typevalue[0]}}
			</view>
			<view class="_center_content">
				<!-- //展示图片 -->
					<view class="openStoryImg">
					<view class="">
						<scroll-view class="ImgBoxs" scroll-x  v-if="item.srcs">
								<image :src="n" mode="" v-for="(n,indexs) in item.srcs" :key="indexs" @click="asd(indexs)"></image>
						</scroll-view>
						
					</view>
				</view>
				<!-- 评论关注信息 -->
				<view class="questionInfo">
					<view class="questionInfo-left">
						总关注{{item.questions.attentioncount}}人
					</view>
					<view class="questionInfo-right">
						全部问答{{item.questions.replycount}}条<text>>></text>
					</view>
				</view>
			</view>
			<view class="_userInfo">
				<view class="_left">
					<image :src="item.sysuser.portrait" mode=""></image>
					<view class="_left_info">
						<view class="_left_name">{{item.sysuser.name}}</view>
						<view class="_company">
							<view>{{item.sysuser.company}}</view>
							<text class="iconfont" v-if="item.sysuser.company">&#xe730;</text>
						</view>
					</view>
				</view>
				<view class="_right">
					<!-- 未关注 -->
					<view class="_contacts_gz_state" @click="clickGzState('1')" v-if="isBlock == false"><text class="iconfont">&#xe6df;</text>关注</view>
					<!-- 已关注 -->
					<view class="_contacts_gz_state _contacts_gz_state2" @click="clickGzState('2')" v-else>已关注</view>
					
				</view>
			</view>
			<view class="_center_content">
				<view class="">
					{{item.questions.description}}
				</view>
				<view class="questionsListBox">
					<view class="questionsList-left">编辑于:<text>{{item.questions.addtime}}</text></view>
					<view class="questionsList-right">
						<view class="r-one"><img src="../../../static/show.png" alt=""><text>{{item.questions.attentioncount}}</text></view>
						<view class="line">
							|
						</view>
						<view class="r-two"><img src="../../../static/set.png" alt=""><text>{{item.questions.replycount}}</text></view>
					</view>
				</view>
			</view>
			<!-- 项目评论 -->
			<view class="commentParent" v-if="item.questions.replycount >= 1">
				
				<view class="conment_content">
					<!-- 一级评论 -->
					<view class="comment_title"></view>
					<view class="conment_one" v-for="(items, indexs) in commentList" :key="indexs" @click="goreply(items.id,indexs)">
						<view class="_title">
							<view class="_portrait"><image :src="items.user.portrait" mode=""></image></view>
							<view class="_userAndCompany">
								<view class="_name">{{items.user.name}}</view>
								<view class="_company">
									<view>{{items.user.company}}</view>
									<view class="iconfont" v-if="items.user.company">&#xe730;</view>
								</view>
							</view>
						</view>
					<!-- 	<button type="primary" @click="deleteReply(indexs,items.id)">删除</button> -->
						<view class="_content">{{items.content}}</view>
					
							<!-- 点赞 -->
						<view class="praise">
							<text class="iconfont"><text :class="(items.praisecount==1) ? iSclor='IsCorlor2' : iSclor='IsCorlor' " @click="clickZanImg(indexs,items.id)">&#xe872; {{items.praisecount}}</text></text>
							
						</view>
							<!-- <view class="subreply" v-if="items.comment_list.length!=0">
							{{items.comment_list.length}}条回复 >
						</view> -->
					</view>
				
				</view>
				
			</view>
			
			<!-- 评论框 -->
			
		</view>
			<view class="bottonBottom">
			<view class="LIst">
				<view class="ComentInput">
					<input type="text" value="" placeholder="输入你的评论~" v-model="connect"/>
				</view>
			</view>

			<view class="ComentImgList2"  @touchend="addReplyOfHuiFu">
				关注问题
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	import shoppublic from '@/common/shoppublic'; //服务器地址
	export default{
		data(){
			return{
				quesstionsid:"",
				questions: '',
				replayOneTime: 0,
				isShow:false,
				Show:true,
				connect:"",
				commentList:[],
				token:14651,
				commentList_two:0,
				isBlock:false,
				recommendationsList:[],
				correlationList:[],
			}
		},
		// 参数在props接收
		props:{
			
		},
		onLoad(option) {
			console.log(option.id);
			this.getPageInfo(option.id);
			this.quesstionsid=option.id
			console.log(getApp().globalData)
		},
		methods:{
			//回复详情
			goreply(id,index){
				  uni.navigateTo({
					url: '../reply/reply?xiangFaId=' + this.quesstionsid + "&huiFuId=" + id +"&index=" + index
    })
			},
			//删除
			 deleteReply: function(index,id) {
			
					var questions = this.commentList;
					// 点完赞之后的请求
					var _this = this;
					wx.request({
					  url: shoppublic.getUrl() + '/questions/deleteReply',
					  data: {
						token:_this.token,
						id: id
					  },
					  success: function(res) {
					
						wx.showModal({
						  title: '确认删除吗？',
						  content: '',
						  success: function(res) {
							if (res.confirm) {
							  _this.commentList.splice(index, 1);
							} else if (res.cancel) {}
							
						  }
						})
						
					  },
					  fail: function(res) {}
					});
				  },
			// 关注问题
				addReplyOfHuiFu: function() {
						var _this = this;
						if (_this.connect.length == 0) {
						  uni.showToast({
							title: '内容不能为空',
							icon:"none",
							duration: 2000
						  })
						  return false;
						}
						_this.replayOneTime++;
						if (_this.replayOneTime != 1) {
						  return false;
						}

					
						var questions = this.questions;
						var contenttext = _this.connect;

						uni.request({
						  url: shoppublic.getUrl() + '/questions/addReply',
						  data: {
							token: _this.token,
							qid: _this.quesstionsid,
							rid: 0,
							// content: _this.data.wenDaDetailHuiFu
							content: contenttext
						  },
						  success: function(res) {
							uni.showToast({
							  title: '积分加' + 1,
							  duration: 800
							})
							
							_this.connect = ""

							 _this.connect= _this.connect,
							  _this.replayOneTime=0,
							
							
							_this.getPageInfo(_this.quesstionsid);
						  },
						  fail: function(res) {}
						})

					  },
			///点赞
				clickZanImg(index,id) {
								var that=this
									var index = index;
									var id =id
									var commentlist = this.commentList;
									// 点完赞之后的请求
									console.log(commentlist)
									var _this = this;
									uni.request({
									  url: shoppublic.getUrl() + '/questions/addReplyPraise',//, //仅为示例，并非真实的接口地址
									  data: {
										rid: id,
										token: _this.token,
										 type_1: '1'
									  },
									  header: {
										'content-type': 'application/json' // 默认值
									  },
									  success: function(res) {
										  
										var flag = res.data.msgCode;
										if (flag == '1') {
											_this.isColor=true
											// that.changecolor="changecolored"
										  commentlist[index].praisestate = true;
										  _this.iSclor="icond2"
										  commentlist[index].praisecount = commentlist[index].praisecount + 1;
										} else {
											// that.changecolor="changecolore"
											_this.isColor=false
										  commentlist[index].praisestate = false;
										    _this.iSclor="icond3"
										  var praisecount = commentlist[index].praisecount - 1;
										  if (praisecount >= 0) {
											commentlist[index].praisecount = praisecount;
										  } else {
											commentlist[index].praisecount = 0;
										  }
										}
												
										  _this.commentList=commentlist
									
			
									  },
									  fail: function(res) {}
									})
			},
			getPageInfo(id){
				var _this = this;
				uni.request({
					url:shoppublic.getUrl() + 'questions/findQuestionsByid',
					data:{
						token:_this.token,
						id:id
					},
					success:(res) => {
						console.log(res)
						_this.recommendationsList.push(res.data.responseBody);
						_this.commentList=res.data.responseBody.replylist
					}
				})
				uni.request({
					url:shoppublic.getUrl() + 'questions/recommendedQuestion',
					data:{
						token:_this.token,
						id:id,
						city_id:''
					},
					success:(res) => {
						console.log(res.data.responseBody);
						_this.correlationList = res.data.responseBody;
					}
				})
			},
			// 图片预览
			asd(index){
				var that = this;
				var current = that.recommendationsList[0].srcs
				wx.previewImage({
					current: current[index], // 当前显示图片的http链接 
					urls: this.recommendationsList[0].srcs // 需要预览的图片http链接列表  
				})
			},
			// 关注按钮点击事件
			clickGzState(state){
				if(state === '1'){
					this.isBlock = !this.isBlock;
				}
				if(state === '2'){
					this.isBlock = !this.isBlock;
				}
			},
			addCommentList_two() {
				this.commentList_two += 1;
			},
			minusCommentList_two(){
				this.commentList_two -= 1;
			}
		}
	}
</script>

<style lang="scss">
	@import './questionAndAnswerDetails.scss';
</style>
