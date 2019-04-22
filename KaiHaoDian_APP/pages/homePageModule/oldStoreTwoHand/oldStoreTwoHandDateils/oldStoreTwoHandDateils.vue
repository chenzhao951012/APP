<template>
	<view class="content">
				<view class="nav">
			<view class="navback" @click="ComeBack">
				<text class="iconfont">&#xe670;</text>
			</view>
			<view class="navtitle">
				二手详情
			</view>
			<view class="Navicon">
				<text class="iconfont">&#xe6ea;</text><text class="iconfont" @click="shareShow=!shareShow">&#xe6c3;</text>
				
			</view>
			<view class="ShareBox" v-if="shareShow">
				<view ><text class="iconfont">&#xe611;</text>举报</view>
				<view style="border-bottom: 0;" @click="shareFriends"><text class="iconfont">&#xe86e;</text>分享</view>
			</view>
		</view>
		<view v-for="(item,index) in pageInfo" :key="index">
			<!-- 顶部图片 -->
			<view class="section">
		
				<!-- 用户信息 -->
				<view class="Conment">
					<view class="UserBox">
						<view class="ImgBox">
							<img :src="item.sysuser.portrait" alt="">
							
					   </view>
						<view class="UserConment">
							<view class="name">
								{{item.sysuser.name}}
								<view class="RenBox">
									<img src="../../../../static/baozheng.png" alt="">
								</view>
							</view>
							<view class="time">
								发布时间:<text>{{item.secondHandItem.addtime}}</text>
							</view>
						</view>
						<view class="redom">
							<text class="iconfont Pl">&#xe64c;</text>{{item.secondHandItem.readnum}}
						</view>
					</view>
					<view class="introduce">
						<view class="title">
							{{item.secondHandItem.description}}
						</view> 
						<view class="introduceBottom">
							<text>¥<text>{{item.secondHandItem.price}}.00</text></text>
							<text>{{item.secondHandItem.cityvalue}}</text>
						</view>
					</view>
					<view class="Banner">
						<view class="BannerList" v-for="(items,idx) in item.srcs" :key="idx">
							<img :src="items" alt="">
						</view>
						
					</view>
					<!-- 商品评论 -->
					<view class="comment">
						<view class="commentTitle">
							商品评论
						</view>
							<view class="CommentImg" v-if="shows">
							<img src="../../../../static/ComentImg.png" alt="">
						</view>
							<view class="commentBox">
							<!-- 	<view>
									
									{{commentList[0].sysuser.portrait}}
									
								</view> -->
							<view class="commentList">
								<view class="introduction" v-for="(itemd,indexs) in commentList" :key='indexs'>
							
									<view class="commentListTop" v-if="itemd.sysuser">
										<view class="userImg">
											<img :src="itemd.sysuser.portrait" alt="">
										</view>
										<view class="userMassage" @click="subReply(indexs)">
											<view class="position">
												{{itemd.sysuser.name}}<text v-if="itemd.sysuser.position">·</text>{{itemd.sysuser.position}}
											</view>
											<view class="company" v-if="itemd.sysuser.company">
											{{itemd.sysuser.company}}<text class="iconfont icons">&#xe730;</text>
											</view>
											<view class="commentContent">
												{{itemd.content}}
											</view>
											<view class="" @touchend="clickZanImg(indexs,itemd.id)">
<!-- 												<text class="iconfont icond"><text :class="(itemd.praisecount==1) ? iSclor='icond2' : iSclor='icond3' ">&#xe872;</text><text class="commentNumber">{{itemd.praisecount}}</text></text> -->
												
											</view>
										<!-- 	<button @click="chanchu(indexs,itemd.id)">删除</button>	 -->										<view class="subreply" v-if="itemd.comment_list.length!=0">
												{{itemd.comment_list.length}}条回复 >
											</view>
										</view>
									</view>
								</view>
									
							</view>
						</view>
					</view>
				</view>
			</view>
		
		</view>
				<view class="bottonBottom">
			<view class="LIst">
				<view class="ComentInput">
					<input type="text" value="" placeholder="输入你的评论~" @focus="Onfocusn" @blur="Onbuler"  v-model="connect"/>
				</view>
			</view>
			<view class="ComentImgList" v-if="Show">
				<img src="../../../../static/talk.png" alt="" >
				<img src="../../../../static/playPhone.png" alt="" @touchend="PlayPhone">
			</view>
			<view class="ComentImgList2" v-if="isShow" @touchend="comment">
				<img src="../../../../static/conmented.png" alt="">
			</view>
		</view>
	</view>
</template>

<script>// 评论模块组件
	import commentModule from '@/components/commentModule/commentModule.vue';
	import shoppublic from '@/common/shoppublic.js';
	export default{
		components:{
			commentModule:commentModule
		},
		data(){
			return{
				iSclor:"icond3",
				connect:"",
				isShow:false,
				Show:true,
				shows:true,
				commentBox:false,
				shareShow:false,
				pktype2:8,
				TwohuiUrl:shoppublic.getUrl() + '/comment/addLevelComment',
				Twocomment:shoppublic.getUrl() + '/comment/addLevelComment',
				ZanUrl:shoppublic.getUrl() + '/comment/addCommentPraise',
				token:6239,
				id:"",
				url:shoppublic.getUrl() + '/comment/addComment',
				deleurl:shoppublic.getUrl() + '/comment/deleteComment',
				total:0,
				pktype:8,
				type: "s_001",
			 commentstate:0,
				commentList:"",
				thePhone:"",
				pageInfo:[],//页面详情
			}
		},
		onLoad(option) {
				var _this=this
			this.id=option.id
			console.log(option.id);
			this.getPageInfo(option.id);
// 				setTimeout(()=>{
// 						 _this.commentNum()
// 					
// 					},200)
		},
		methods:{
			// 评论详情
				subReply(index){
				var that=this
				uni.navigateTo({
					url:'../reply/reply?key=' + index + '&id=' + that.id
				})
			},
				 chanchu: function(index,id) {
												var _this = this
												
												var commentlist = _this.commentList
												
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
					comment(){
							var that = this
							let userToken = that.token
							if(userToken != ""){
								var content = that.connect
								if(content.length >= 1 && content != ""){
									that.shows=false
									that.commentstate=1	
									that.addReplyOfHuiFu(that.connect)
							
								}else{
								uni.showToast({
										title: '评论内容不能为空',
										icon:"none",
										duration: 2000
										});
									}
															
							}
							
							},
					// 评论共用函数
					 addReplyOfHuiFu: function(content) {
												var _this = this;
												//评论列表
												var commentlist = _this.commentList;
												wx.request({
												  url: shoppublic.getUrl() + '/comment/addComment',
												  data: {
													token: _this.token,
													pktype:8,
													pkid: _this.id,
													cid: 0,
													content: content
												  },
												  success: function(res) {
													 _this.shows=false
													  setTimeout(()=>{
													 			uni.navigateTo({
													 			url:"./oldStoreTwoHandDateils?id=" + _this.id
													 															 
																		})
													 },1000)
													  uni.showToast({
													 	title: '评论成功',
													 	icon: 'success',
													 	duration: 2000
													 })
													var reply = res.data.responseBody;
													if (commentlist != undefined && commentlist.length > 0) {
													  commentlist.reverse()
													  commentlist.push(reply)
													  commentlist.reverse()
														 _this.commentlist=commentlist,
														 _this.connect= ""
													  
													} else {
													  var commentlist2 = [];
													  commentlist2[0] = reply;
													
														 _this.commentlist=commentlist2,
														_this.connect= ""
														
													}
					
												  },
												  fail: function(res) {}
												});
											  },	
			// 点赞
				clickZanImg(index,id) {
				
								var that=this
									var index = index;
									var id =id
									var commentlist = this.commentList;
									// 点完赞之后的请求
									console.log(commentlist)
									var _this = this;
									uni.request({
									  url: shoppublic.getUrl() + '/comment/addCommentPraise', //, //仅为示例，并非真实的接口地址
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
			Onfocusn(){
				this.isShow=true
				this.Show=false
			},
			// 评论失焦
			Onbuler(){
				this.isShow=false
				this.Show=true
				this.connect=""
			},
			ComeBack(){
				uni.redirectTo({
						url:"../oldStoreTwoHand"
					});
			},
		
			getPageInfo(id){
				var _this = this;
				uni.request({
					   url: shoppublic.getUrl() + '/secondHandItem/findSecondHandItemByid',
					data:{
						token:6239,
						id:id
					},
					success: (res) => {
						console.log(res)
						
						// console.log(res)
						if(res.data.msgCode=="1"){
						
							_this.pageInfo.push(res.data.responseBody)
						_this.commentList=res.data.responseBody.commentlist
								if(_this.commentList==undefined){
								_this.shows=true
								
							}else{
								_this.shows=false
							}
						}
					
						
						
					}
				})
			},
			// 钱切割
			moneyIncise(value){
			
				if(value){
					if (value.secondHandItem.price >= 1000) {
						var money = value.secondHandItem.price
						if (money.toString().indexOf('.') == -1) {
							value.secondHandItem.price = value.secondHandItem.price
						}else{
							value.secondHandItem.price = (value.secondHandItem.price).toFixed(1)
						}
					} else {
						value.secondHandItem.price = '面议'
					}
				}
				this.pageInfo.push(value)
			},
		}
	}
</script>

<style lang="scss">
	@import './oldStoreTwoHandDateils.scss'
</style>
