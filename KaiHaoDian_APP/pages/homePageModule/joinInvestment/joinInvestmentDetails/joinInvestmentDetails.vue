<template>
	<view class="content">
		<!--  -->
		<view v-if="pagesInfo" v-for="(items,num) in pagesInfo" :key="num" class="pagesInfoBox">
			<!-- 封面 -->
			<view class="banner">
				<image :src="imageUrl + items.projectJoin.logo" mode=""></image>
				<!-- <view> <text class="iconfont">&#xe63c;</text> <text>已有{{items.projectJoin.read_num}}浏览</text> </view> -->
			</view>
			<!-- 企业信息 -->
			<view class="" style="position: relative;">
					<view class="companyInfo">
					<view class="_top">
						<view class="company_L"> <image :src="items.sysuser.portrait" mode=""></image></view>
						<view class="company_R">
							<view class="R_name">{{items.sysuser.company}}</view><text class="iconfont iconed">&#xe730;</text><text class="iconfont iconeds">&#xe65c;</text><text class="iconfont iconecodes">&#xe64c;{{items.projectJoin.read_num}}</text>
							<view class="R_intro">
								<text>{{items.projectJoin.title}}</text>
							</view>
							</text><text class="iconfont iconecoded">&#xe6ea;</text>
							<!-- <view class="R_rz">
								<view>
									<text class="iconfont">&#xe66b;</text> <text>质量服务保证金</text>
								</view>
								<view>
									<text class="iconfont">&#xe66b;</text> <text>营业执照认证</text>
								</view>
								<view>
									<text class="iconfont">&#xe66b;</text> <text>食品安全许可证</text>
								</view>
							</view> -->
						</view>
					</view>
				<view class="userInfo">
					<text class="userInfoNuber">门店数量:<text class="userInfoMsg">{{items.projectJoin.storecount}}家</text></text>
					<text class="userInfoNuber">品牌年龄:<text class="userInfoMsg">{{items.projectJoin.storeage}}年</text></text>
					<text class="userInfoNuber">加盟费:<text class="userInfoMsg">{{items.projectJoin.initialfee}}元</text></text>
					</view>
					<!-- //地址 -->
					<view class="address">
						<text class="userInfoNuber">总部地址:<text class="userInfoMsg">{{items.projectJoin.street}}</text></text>
					</view>
					<view class="_caller">
						<view class="visitor" @click="toVisitor">
							<text>访   &nbsp;&nbsp;&nbsp;&nbsp; 客&nbsp;:</text>
						</view>
						<view class="_L">
							<image v-for="(item,index) in visitorList" :src="item.portrait" :key='index' v-if="index < 5"></image>
							<view class="_more iconfont">&#xe6c3;</view>
						</view>
						<view class="_R" @click="toVisitor">
							
						</view>
					</view>
					<view class="brand">
						<SwiperNav :modelData="Magessage" @changed='changed'></SwiperNav>
					</view>
				</view>
			</view>
		
			<!-- 项目简介 -->
			<view class="projectDetail">
				<!-- //特色 -->
				<view class="features" v-if="features">
					<view class="featUresImgBox" v-for="(item,idx) in openNecessary" :key="idx">
						<img :src="item.slogo" alt="">
						<view class="featurestitle">
							{{item.company}}
						</view>
					</view>
				</view>
				<!-- 品牌形象 -->
				<view class="figurePeoplep" v-if="figurePeoplep">
					<view class="" v-for="(n,index) in items.srcs" :key="index">
						<img :src="n" alt=""  @click="asd(index)">
					</view>
				</view>
				<!-- 关于公司 -->
					<view class="Aboutcompany" v-if="Aboutcompany">
						<view class="introduction2">
							<view class="introduction">
								<view class="introductionTitle">
									公司介绍
								</view>
								<view class="introductionContent">
								 {{items.projectJoin.introduction}}
								</view>
							</view>
							<view class="introduction">
								<view class="introductionTitle">
									服务优势
								</view>
								<view class="introductionContent">
								 	<text v-for="(item,index) in JSON.parse(items.projectJoin.service)" :key="index">{{item.name}}</text>
								
								</view>
							</view>
							<view class="introduction">
								<view class="introductionTitle">
									运营优势
								</view>
								<view class="introductionContent">
								 {{items.projectJoin.introduction}}
								</view>
							</view>
							<view class="introduction">
								<view class="introductionTitle">
								售后服务
								</view>
								<view class="introductionContent">
								 {{items.projectJoin.introduction}}
								</view>
							</view>
								<view class="introduction" style="border: 0;">
								<view class="introductionTitle">
								总部支持
								</view>
								<view class="introductionContent">
								 {{items.projectJoin.introduction}}
								</view>
							</view>
						</view>
						
					</view>
					<!-- 用户评论 -->
					<view class="commentBox" v-if="commentBox" >
						<view class="commentList">
							<view class="introduction" v-for="(itemd,index) in commentList" :key='index' v-if="commentList" @click="subReply(index)">
								<view class="commentListTop">
									<view class="userImg">
										<img :src="itemd.sysuser.portrait" alt="" v-if="itemd.sysuser.portrait">
									</view>
									<view class="userMassage">
										<view class="position">
											{{itemd.sysuser.name}}<text v-if="itemd.sysuser.position">·</text>{{itemd.sysuser.position}}
										</view>
										<view class="company" v-if="itemd.sysuser.company">
										{{itemd.sysuser.company}}<text class="iconfont icons">&#xe730;</text>
										</view>
										<view class="commentContent">
											{{itemd.content}}
										</view>
										<view class="" @touchend="clickZanImg(index,itemd.id)">
											<text class="iconfont icond" >&#xe872;<text class="commentNumber">{{itemd.praisecount}}</text></text>
										</view>
										<view class="subreply" v-if="itemd.comment_list.length!=0">
											{{itemd.comment_list.length}}条回复 >
										</view>
									</view>
								</view>
							</view>
								
						</view> 
					</view>
			</view>
		
			
		</view>
		<!-- 开店必备 -->
	
		<!-- components/commentModule:项目评价(公共模块) -->
		<!-- <commentModule></commentModule> -->
		<view class="bottonBottom">
			<view class="LIst">
				<view class="ComentInput">
					<input type="text" value="" placeholder="输入你的评论~" @focus="Onfocusn"  v-model="connect"/>
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

<script>
	// 评论模块组件
	import commentModule from '@/components/commentModule/commentModule.vue';
	import shoppublic from '@/common/shoppublic.js';
	import SwiperNav from 'components/SwiperNav'
export default {
	onLoad (option) {
	
		var _this = this;
		_this.id=option.id
		console.log(option.id);
		_this.getPagesInfo(option.key,option.id);
		_this.getVisitorsList();
		_this.getAboutNewShop();
		// _this.getComment();
		
	},
	components:{
		commentModule:commentModule,
		SwiperNav:SwiperNav
	},
	data() {
		return {
			// ',
			lengthed:"",
			pktype:3,
			connect:"",
			isShow:false,
			Show:true,
			Phone:"",
			token:14651,
		    id:"",
			commentBox:false,
			Aboutcompany:false,
			figurePeoplep:false,
			features:true,
			 imgSrc:[],
			Magessage:[
				{
				title:"品牌特色"
				},
				{
				title:"品牌形象"
				},
				{
				title:"关于公司"
				},
				{
				title:"用户评论"
				},
			],
			
			imageUrl:shoppublic.getImageUrl(),
			commentList:[], //评论列表
			pagesInfo:[], //存储当前页面信息
			visitorList:[], //访客列表
			openNecessary:[], //开店必备
			 commentstate:0
		};
	},
	methods: {
		//子回复跳转
				subReply(index){
					var that=this
					uni.navigateTo({
						url:'../reply/reply?key=' + index + '&id=' + that.id
					})
				},
		//发送评论
		comment(){
								console.log(12)
								var that = this
								let userToken = that.token
								if(userToken != ""){
									var content = that.connect
									if(content.length >= 1 && content != ""){
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
		// 评论聚焦
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
		//拨打电话
		PlayPhone(){
			event.preventDefault()
			var that=this
			uni.showModal({
			title: '提示',
			content:'是否拨打'+that.Phone,
			success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定');
					uni.makePhoneCall({
							phoneNumber:that.Phone //仅为示例
					});
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
					uni.makePhoneCall({
						phoneNumber: that.Phone //仅为示例
				});
		},
		//点赞
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
											// that.changecolor="changecolored"
										  commentlist[index].praisestate = true;
										  commentlist[index].praisecount = commentlist[index].praisecount + 1;
										} else {
											// that.changecolor="changecolore"
										  commentlist[index].praisestate = false;
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
		//滑块切换
		changed(index){
			var that =this
			if(index==0){
				that.commentBox=false
				that.Aboutcompany=false
				that.figurePeoplep=false
				that.features=true
			}else if(index==1){
				that.commentBox=false
				that.Aboutcompany=false
				that.figurePeoplep=true
				that.features=false
			}else if(index==2){
				that.commentBox=false
				that.Aboutcompany=true
				that.figurePeoplep=false
				that.features=false
			}else if(index==3){
				that.commentBox=true
				that.Aboutcompany=false
				that.figurePeoplep=false
				that.features=false
			}
			},
		//图片全屏预览
		  preview(imgurl,index) {
			var that = this;
			console.log(imgurl,index)
			uni.previewImage({

			  current:imgurl, // 当前显示图片的http链接  

			  urls:that.imageUrl+that.pagesInfo[index].projectJoin.logo // 需要预览的图片http链接列表  
			})
		  },
		// 获取页面内容
		getPagesInfo(index,id){
			console.log(id)
			var _this = this;
			// console.log(id);
			uni.request({
				url: shoppublic.getUrl() + 'projectJoin/findProjectJoinByid',
				data:{
					id:id, // 当前页面的id
					token:_this.token, // 登陆用户的id
				},
				success:res => {
					console.log(res)
					_this.Phone=res.data.responseBody.projectJoin.phone
					_this.pagesInfo.push(res.data.responseBody);
					_this.commentList = res.data.responseBody.commentlist;
					for(var i=0;i<_this.commentList.length;i++){
						  for(var j=0;j<_this.commentList[i].comment_list.length; j++){
							  console.log(_this.commentList[i].comment_list.length)
							  
						  }
						}
					// console.log(_this.pagesInfo[0].projectJoin.logo);
				}
			})
		},
		// 图片预览
		asd(index){
			console.log(this.pagesInfo);
			var that = this;
			var current = that.pagesInfo[0].srcs
			uni.previewImage({
				current: current[index], // 当前显示图片的http链接 
				urls: that.pagesInfo[0].srcs // 需要预览的图片http链接列表  
			})
		},
		// visitorsList:访客列表
		getVisitorsList(id) {
			let _this = this;
			wx.request({
				url: shoppublic.getUrl() + '/projectJoin/accessProject',
				data: {
					// pages_url: 'kaiHaoDian_App/pages/homePageModule/joinInvestment/joinInvestmentDetails/joinInvestmentDetails', //当前页面路径
					pages_url:'kai_index/pages/nav/XMJM/XMJMDetails',//当前页面的路径 /******存在问题: 只能用小程序当前页面的路径,而当前页面的url只能获取一条数据,获取不到其他数据*****/
					page_id: 576, //当前项目id
					access_time: '1', //访问次数
					token: 6239, //访问者id
					pagesize: 0
				},
				success: res => {
					console.log(res)
					// console.log(res.data.responseBody);
					_this.visitorList = res.data.responseBody;
				}
			})
		},
		//开店必备
		getAboutNewShop() {
			var _this = this;
			uni.request({
				url: shoppublic.getUrl() + '/companySupplier/findListCompanySupplier',
				data: {
				stype: '2',
				sindustry: ''
				},
				success: function(res) {
					// console.log(res.data.responseBody);
					_this.openNecessary = res.data.responseBody.slice(0,6);
				}
			});
		},
		//项目评论公用函数
			 addReplyOfHuiFu: function(content) {
								var _this = this;
								//评论列表
								var commentlist = _this.commentList;
								wx.request({
								  url:shoppublic.getUrl() + '/comment/addComment',
								  data: {
									token: _this.token,
									pktype: _this.pktype,
									pkid:_this.id,
									cid: 0,
									content: content
								  },
								  success: function(res) {
									  console.log(_this.token,_this.id)
									  console.log(res)
									var reply = res.data.responseBody;
									if (commentlist != undefined && commentlist.length > 0) {
									  commentlist.reverse()
									  commentlist.push(reply)
									  commentlist.reverse()
									 
										 _this.commentList=commentlist,
										 // _this.wenDaDetailHuiFu= ""
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
		
		// 跳转访客页面
		toVisitor(){
			uni.navigateTo({
				url:"./mineVisitor"
			})
		},
		// 加载项目信息
		onloadProjectInfo() {
			let _this = this;
			uni.request({
				url:  '',
				data: {},
				success: res => {
					console.info(res);
				}
			});
		},
		// 跳转名片
		toCard() {
			uni.navigateTo({
				url: '' //需携带用户id
			});
		},
		toCaller() {
			uni.navigateTo({
				url: '' //需携带项目id
			});
		},
		shareFriends() {
			uni.share({
				provider: 'weixin',
				scene: 'WXSenceTimeline',
				type: 0,
				href: 'http://uniapp.dcloud.io/',
				title: 'uni-app分享',
				summary: '我正在使用开好店APP寻找加盟供应商~ 一起来使用吧',
				imageUrl: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png',
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
		}
	},
	// 原生按钮点击事件
	onNavigationBarButtonTap(e) {
		console.info(JSON.stringify(e));
		let _this = this;
		if (e.index === 0) {
			_this.shareFriends();
		}
	}
};
</script>

<style lang="scss">
	@import './joinInvestmentDetails.scss';
</style>
