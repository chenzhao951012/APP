<template>
	<view class="content">
		<view v-for="(item,index) in pageInfo" :key="index" class="userBox">
			<!-- 顶部图片 -->
			<view class="banner">
					<swiper class="_swiper"  :autoplay="true" :duration="1000" :circular="true"  indicator-active-color="#3285ff" @change="ChangeSwiper">
					<swiper-item class="_swiper" v-for="(srcs,key) in item.srcs" :key="key">
						<image class="_swiper" :src="srcs"></image>
					</swiper-item>
				</swiper>
					<view class="swiperbutton">
					<view :class="{'balltas':true,'active':activeIndex==indexe}" v-for="(items,indexe) in item.srcs" :key="indexe">
						
				</view>
				</view>
			</view>
			<!-- 用户信息 -->
			<view class="UserInfo">
				<view class="Massage-top">
					<view class="UserHeader">
						<view class="question">
							{{item.newShopRent.title}}
						</view>
						<view class="userMassage">
								<!-- 图像 -->
							<view class="userMassage-Left">
								<img :src="item.sysuser.portrait" alt="">
							</view>
							<!-- 信息 -->
							<view class="userMassage-Right">
								<view class="R-top">
									<view class="R-name">
										{{item.sysuser.name}}<text v-if="item.sysuser.position">·</text>{{item.sysuser.position}}
									</view>
									<view class="R-number">
										</text><text class="iconfont iconecodes">&#xe64c;</text>{{item.newShopRent.readnum}}</text>
									</view>
								</view>
								<view class="R-bottom">
									<view class="" style="display: flex;" v-if="item.sysuser.company">
										<view class="R-induce">{{item.sysuser.company}}</view><text class="iconfont iconed">&#xe730;</text>
									</view>
									<text class="iconfont iconfontes">&#xe6ea;</text>
								</view>
							</view>
						</view>
						<view class="shopInfo">
							<view class="infoList">
								<view class="infoTitle">面积</view>
								<view class="InfoNumber"><text>{{item.newShopRent.areamax}}</text>/㎡</view>
							</view>
							<view class="infoList">
								<view class="infoTitle">租金</view>
								<view class="InfoNumber" style="border-right: 0;"><text>{{item.newShopRent.rentmax}}</text>/月</view>
							</view>
						</view>
						<view class="industry">
							<view class="" style="display: flex;justify-content: space-between;padding-right: 10upx;">
									<view class="industryList">
									<view>当前行业:<text>{{item.newShopRent.typevalue}}</text></view>
									<view>转让类别:<text>整转</text></view>
								</view>
								<view class="industryList">
									<view>当前状态:<text>{{item.newShopRent.statusvalue}}</text></view>
									<view>店铺类型:<text>{{item.merchants[0]}}</text></view>
								</view>
							</view>
						
							<view>
								<view class="industryLiSt" style="padding-bottom: 0;">
									详细地址:<text>{{item.newShopRent.provincevalue}}&nbsp;{{item.newShopRent.cityvalue}}&nbsp;{{item.newShopRent.countyvalue}}&nbsp;{{item.newShopRent.street }}</text>
								</view>
							</view>
						</view>
							<view class="_caller">
							<view class="visitor" @touchend="toVisitor">
								<text>访   &nbsp;&nbsp;&nbsp;&nbsp; 客&nbsp;:</text>
							</view>
							<view class="_L">
								<image v-for="(item,indexd) in visitorList" :src="item.portrait" :key='indexd' v-if="indexd < 5"></image>
								<view class="_more iconfont">&#xe6c3;</view>
							</view>
							<view class="_R" @click="toVisitor">
								
							</view>
						</view>
					</view>
				</view>
				<!-- 店铺介绍 -->
				<view class="Massage-Bottom">
					<view class="B-induce">
						<view class="B-title">
							店铺介绍
						</view>
						<view class="B-info">
							{{item.newShopRent.introduction}}
						</view>
					</view>
						<view class="B-induce" style="padding-bottom: 0;">
						<view class="B-title">
							配套设施
						</view>
						<view class="_select_icon">
								<view class="_service_cell" v-for="(info,key) in supporting" :key="key" v-if="info.value.checked == true">
									<image :src="imageUrl + info.value.url1" ></image>
									<view v-if="info.value.checked == true">{{info.value.name}}</view>
								</view>
						</view>
					</view>
						<view class="B-induce" style="padding-bottom: 0;;border-bottom: 0">
						<view class="B-title">
							周边概况
						</view>
							<view class="_select_icon">
							<view class="_service_cell" v-for="(info,key) in around" :key="key" v-if="info.value.checked == true">
								<image :src="imageUrl + info.value.url1" ></image>
								<view>{{info.value.name}}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- //评论 -->
					<view class="commentBox" >
					<view class="commentList">
						<view class="commenttitle">项目评论</view>
						<view class="CommentImg" v-if="shows">
							<img src="../../../../static/ComentImg.png" alt="">
						</view>
						<view class="introduction" v-for="(itemd,indexs) in commentList" :key='indexs'>
							<view class="commentListTop">
								<view class="userImg">
									<img :src="itemd.sysuser.portrait" alt="" v-if="itemd.sysuser.portrait">
								</view>
								<view class="userMassage" @touchend="subReply(indexs)">
									
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
										<text class="iconfont icond"><text :class="(itemd.praisecount==1) ? iSclor='icond2' : iSclor='icond3' ">&#xe872;</text><text class="commentNumber">{{itemd.praisecount}}</text></text>
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
			<!-- 评论框 -->
				<view class="bottonBottom">
				<view class="LIst">
					<view class="ComentInput">
						<input type="text" value="" placeholder="输入你的评论~" @focus="Onfocusn" @blur="Onbuler" v-model="connect"/>
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
		
	</view>
</template>

<script>
	// 评论模块组件
	import NoComment from '@/components/noComment/noComment.vue'
	import commentModule from '@/components/commentModule/commentModule.vue';
	import shoppublic from '@/common/shoppublic.js';
	export default{
		components:{
			commentModule:commentModule,
			NoComment:NoComment
		},
		data(){
			return{
				shows:true,
				commentstate:0,
				connect:"",
				isShow:false,
				Show:true,
				visitorList:[], 
				activeIndex:0,
				pktype2:8,
				Twocomment:shoppublic.getUrl() + '/comment/addLevelComment',
				thePhone:"",
				type:"o_001",
				TwohuiUrl:shoppublic.getUrl() + '/comment/addLevelComment',
				ZanUrl:shoppublic.getUrl() + '/comment/addCommentPraise',
				total:0,
				deleurl:shoppublic.getUrl() + '/comment/deleteComment',
				id:"",
				url:shoppublic.getUrl() + '/comment/addComment',
				pktype:2,
				token:6239,
				isShowsubConment:true,
				isShowConment:true,
				commentList:"",
				imageUrl:shoppublic.getImageUrl(),
				pageInfo:[],//页面详情
				supporting:'',//店铺配套
				around:'',
				supportingChanges:[],// 商铺配套列表
				aroundChanges: [],// 周边概况列表
			}
		},
		
		onLoad(option) {
			var _this=this
			_this.getvisitor()
			_this.id=option.id
		
			this.getPageInfo(option.id);
			setTimeout(()=>{
				 _this.commentNum()
// 			if(_this.PingLunList!=undefined){
// 				console.log(_this.PingLunList.length)
// 				 _this.isShowConment=true
// 				 _this.isShowsubConment=false
// 			}else{
// 			_this.isShowConment=false
// 			 _this.isShowsubConment=true
// 			}
			
			},200)
		},
		methods:{
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
			// 测试删除
			 chanchu: function(index,id) {
						var _this = this
					var commentlist = _this.commentList
															
					uni.request({
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
					//拨打电话
			PlayPhone(){
				event.preventDefault()
				var that=this
				uni.showModal({
				title: '提示',
				content:'是否拨打'+that.thePhone,
				success: function (res) {
					if (res.confirm) {
						console.log('用户点击确定');
						uni.makePhoneCall({
								phoneNumber:that.thePhone //仅为示例
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
					
			},
			//发送评论
				subReply(index){
				var that=this
				uni.navigateTo({
					url:'../reply/reply?key=' + index + '&id=' + that.id
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
			//评论
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
											  
											 setTimeout(()=>{
														uni.navigateTo({
														url:"./newStoreRentalDateils?id=" + _this.id
																										 
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
											 
												 _this.commentList=commentlist
												 // _this.wenDaDetailHuiFu= ""
			// 									isPingLun: false,
			// 									faSongFlag: false
										
											  
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
			// 访客列表
			getvisitor(){
						
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
							// console.log(res)
							// console.log(res.data.responseBody);
							_this.visitorList = res.data.responseBody;
						}
					})
				
			},
		//轮播图按钮切换
			ChangeSwiper(index){
				var index=index.detail.current
				
				this.activeIndex=index;
			},
				conmented(){
					var _this=this
					_this.isShowConment=true
					_this.isShowsubConment=false
				},
				commentNum() {
					var _this=this
					if(_this.PingLunList==undefined){
						_this.total=0
					}else{
							let [i, j, t] = [0, 0, 0, 0];
						for (i; i < _this.PingLunList.length; i++) {
						  for (j; j < _this.PingLunList[i].comment_list.length; j++) {
							t += j;
						  }
						}
						 _this.total=i + t
					}
				
					
						 
						
					  },
			// 列表页请求数据
			getPageInfo(id){
				
				var _this = this;
				uni.request({
				 url: shoppublic.getUrl() + '/newShopRent/findNewShopRentByid',
					data:{
						token:_this.token,
						id:id
					},
					success: (res) => {
						console.log(res)
							_this.thePhone=res.data.responseBody.sysuser.phone
						_this.commentList=res.data.responseBody.commentlist
						if(_this.commentList!=undefined){
							_this.shows=false
						}
						// _this.pageInfo.push(res.data.responseBody);
						var supporting = JSON.parse(res.data.responseBody.newShopRent.supporting);
						// 钱转换为万的方法
						_this.moneyIncise(res.data.responseBody);
						_this.FuckMe(_this.supportingChanges, supporting);// 循环添加至商铺配套新数组
						var around = JSON.parse(res.data.responseBody.newShopRent.around);
						console.log(supporting)
						_this.FuckMe(_this.aroundChanges, around);// 循环添加至周边概况新数组
						// console.log(_this.supporting);
					}
				})
			},
			// 钱切割
			moneyIncise(value){
				var _this = this;
			
				if (value.newShopRent.loadingfee >= 1000) {
					var money = value.newShopRent.loadingfee / 10000
					if (money.toString().indexOf('.') == -1) {
						value.newShopRent.loadingfee = value.newShopRent.loadingfee / 10000
					}else{
						value.newShopRent.loadingfee = (value.newShopRent.loadingfee / 10000).toFixed(1)
					}
				} else {
					value.newShopRent.loadingfee = '面议'
				}
				_this.pageInfo.push(value);
			},
			 // 循环添加至数组进行排序 以下3个函数给商铺配套和周边排序
			FuckMe(data, dataList) {
				for (let i = 0; i < dataList.length; i++) {
					data.push({
						value: dataList[i],
						status: 2
					})
				}
				this.supporting = this.supportingList(this.supportingChanges);
				this.around = this.supportingList(this.aroundChanges);
			},
			// data:从后台拿到的所有商铺配套/周边概况列表
			supportingList(data) { 
				for (let i = 0; i < data.length; i++) {
					if (data[i].value.checked == true) {
						data[i].status = 1;
					}
				}
				return this.sortChanges(data);
			},
			// // 根据supportingChanges/aroundChanges的status状态进行升序排序(注:排序是为了将用户选中的合伙人类型放在数组最前头)
			sortChanges(arr) {
				for (let i = 0; i < arr.length - 1; i++) {
					for (let j = 0; j < arr.length - 1 - i; j++) {
						if (arr[j].status > arr[j + 1].status) {
							var temp = arr[j];
							arr[j] = arr[j + 1];
							arr[j + 1] = temp;
						}
					}
				}
				return arr;
			}
		}
	}
</script>

<style lang="scss"> 
.balltas{
	width: 60upx;
	height: 20upx;
	background-color:#eeeeee;
	border-radius:20upx;
	 float: left;
	 margin-right: 20upx;
	
}
	.balltas.active{
		width: 60upx;
		height: 20upx;
		background-color:#ffbd38;
		border-radius:20upx;
		 float: left;
		 margin-right: 20upx;
	}
	@import './newStoreRentalDateils.scss'
</style>
