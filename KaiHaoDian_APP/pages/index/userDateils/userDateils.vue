<template>
	<view class="content">
		<!-- 顶部名片 -->
		<view class="TopBox">
			
		</view>
		<view class="_business_card">
			<view class="_card_top">
				<view class="_card_right">
					<image :src="user.portrait" mode="" v-if="user.portrait"></image>
					
					<!-- <view class="_add iconfont">&#xe61f;</view> -->
					<!-- <view class="follower">粉丝<text>{{user.fanscount}}</text></view> -->
				</view>
				<view class="_card_left">
					<view class="_place">{{user.name}}</view>
					<view class="_company" v-if="user.company">{{user.company}}<text class="iconfont">&#xe730;</text><img src="../../../static/renzheng.png" alt=""></view>
					<!-- <view class="_describe">{{user.mainbusiness}}</view> -->
				</view>
			
			</view>
				<!-- 公司信息 -->
			<view class="companyAderss">
				<view>
					<view>公司地址:<text>{{user.companyarea}}</text></view>
					<view>主营业务:<text>{{user.industrytypevalue}}</text></view>
					<view>公司规模:<text>0~20人</text></view>
					</view>
				<button type="primary" class="btn" @click="guanzhu(user.id)" v-if="user.attentionstate==1"><text class="iconfont">&#xe6df;</text>关注</button>
				<button type="primary" class="btn2" @click="guanzhu(user.id)" v-if="user.attentionstate==2"><text class="iconfont"></text>已关注</button>
			</view>
			<view class="_bottom_info">
								<view class="_contact_way iconfont" @touchend="Copychat(user.wechatno)">&#xe661;<text>{{weChat}}</text></view>
				<view class="_contact_way iconfont">&#xe61e;<text @touchend="userphone(user.id)">{{phone}}</text></view>

			</view>
			<view class="shares"><img src="../../../static/shares.png" alt=""></view>
		</view>
		<view class="attentionBox">
			<view class="attentionBox2">
				<view class="lines">
						<view>他的关注</view>
						<view>{{user.attentioncount}}</view>
					</view>
					<view  class="lines">
						<view>他的粉丝</view>
						<view>{{user.fanscount}}</view>
					</view>
					<view  class="lines">
						<view>他的收藏量</view>
						<view>0</view>
					</view>
				</view>
			</view>
			
		
		<!-- 相关用户 -->
	<!-- 
	 //-->
		<!-- 相关信息 -->
		<view class="_RI">
			<view class="_top_swiper">
				<view class="release_info" @click="switchStyle('1')">他的提问<view :class="blockRelease ? '_border' : ''"></view></view><text class="kinsd">|</text>
				<view class="release_info" @click="switchStyle('2')">他的回答<view :class="blockContacts ? '_border' : ''"></view></view><text class="kinsd">|</text>
				<view class="release_info" @click="switchStyle('3')">他的发布<view :class="blockMessage ? '_border' : ''"></view></view>
			</view>
			<view :class="blockRelease ? '_release_swiper' : 'display_none'">
			<!-- 	<view class="_info_cell">
						<view class="question">
							<view class="questionLift">
								box-shadow 属性向框添加一个或多个阴影
							</view>
							<view class="questionRight">
								服务
							</view>
						</view>
				</view>
					<view class="_info_cell">
						<view class="question">
							<view class="questionLift">
								box-shadow 属性向框添加一个或多个阴影
							</view>
							<view class="questionRight">
								服务
							</view>
						</view>
				</view> -->
					<view class="Noquestion">
						<img src="../../../static/ComentImg.png" alt="">
					</view>
			</view>
			<view :class="blockContacts ? '_connection_swiper' : 'display_none'">
			<view class="Noquestion">
				<img src="../../../static/ComentImg.png" alt="">
			</view>
				
			</view>
			<view :class="blockMessage ? '_message_swiper' : 'display_none'">
			
			</view>
		</view>
	</view>
</template>

<script>
		import shoppublic from '@/common/shoppublic'; //服务器地址
	export default{
	
		data(){
			return{
				phone:"",
				weChat:"",
				idea:"ideas",
				knowledge:"changeColor",
				partnerships:false,
				isfranchisee:false,
				ListBox:false,
				Newshop:false,
				 clickOneTime: 0,
				wenDaDetailHuiFu:"",
				userId:"",
				list2:"",
				commentlist:[],
				pinglunnull:true,
				token:14651,
				imglist:[],
				imageUrl:shoppublic.getImageUrl(),
				shareTitle:"",
				user:"",
				blockRelease:true,
				blockContacts:false,
				blockMessage:false,
				isshow:true,
				isshowBox:false,
				list1:[],
				count1:"",
				count2:"",
				list3:[],
				count3:"",
				list5:[],
				count5:"",
				list4:[],
				count4:"",
				StoreRecruitments:false,
				// 人脉映像测试数据
			}
		},
		onLoad(option) {
			
			var that=this
			setTimeout(()=>{
				if(that.commentlist.length>0){
					that.isshowBox=true
					that.isshow=false
				}else{
					that.isshowBox=false
					that.isshow=true
				}
			},300)
			
			that.userId=option.id
			console.log(option.id)
			  this.getsysuserdetail(option.id)
			that.getuserINfo(option.id)
			that.evaluate(option.id)
			that.oldStore()
			that.Newshops()
			that.StoreRecruitment();
			that.franchisee()
			that.partnership()
			that.getWenTiLieBiao();
		},
	
		methods:{
				//问题列表
				getWenTiLieBiao: function() {
					var _this = this;
					let that = this;
					var userid = that.userId;
					uni.request({
					  url: shoppublic.getUrl() + '/sysuserdetail/findQuestionsList',
					  data: {
						uid: userid,
						token: 6239
					  },
					  success: function(res) {
							console.log(res)
// 						_this.setData({
// 						  contentList: res.data.responseBody,
// 						  _num: 1
// 						})
					  },
					  fail: function(res) {}
					});
				  },
			  //头部关注
			
				  guanzhu(index,userid,sysuser){
					    var _this=this
							var that=this
					if ( _this.token == userid) {
					  uni.showModal({
						title: '提示',
						content: '您不可以关注自己',
					  })
					  return;
					}
					uni.request({
					  url: shoppublic.getUrl() + '/attention/addAttention',
					  data: {
						token:_this.token,
						pkid: index,
						type: 1
					  },
					  success: function(res) {
						  console.log(res)
						
						if (res.data.msgCode == 1) {
							that.user.attentionstate = 2
							that.user=that.user
					
						} else if (res.data.msgCode == 2) {
						  that.user.attentionstate = 1
						
							that.user=that.user
						  
						}


					  }
					})
				  },
			//分享
			share(){
					uni.share({
				    provider: "weixin",
				    scene: "WXSenceTimeline",
				    type: 0,
				    href: "http://uniapp.dcloud.io/",
				    title: "uni-app分享",
				    summary: "我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！",
				    imageUrl: "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png",
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			},
	
			//微信号拷贝
			Copychat(chat){
				uni.setClipboardData({
						data:chat,
						success: function () {
								uni.showToast({
								  title: '复制成功',
								  icon: 'success',
								  duration: 800
								})
						}
					});
			},
			//详情跳转
			goodsInfo(id,num){
				if(num==1){
					console.log(id)
					uni.navigateTo({
						url:'../../homePageModule/storeMakeOver/storeMakeOverDateils/storeMakeOverDateils?id='+id
						})
				}else if(num==2){
						uni.navigateTo({
						url:'../../homePageModule/newStoreRental/newStoreRentalDateils/newStoreRentalDateils?id='+id
						})
				}else if(num==3){
						uni.navigateTo({
						url:'../../homePageModule/joinInvestment/joinInvestmentDetails/joinInvestmentDetails?id='+id
						})
				}else if(num==4){
						uni.navigateTo({
						url:'../../homePageModule/partnerOpenStore/partnerOpenStoreDateils/partnerOpenStoreDateils?id='+id
						})
				}else if(num==5){
						uni.navigateTo({
						url:'../../homePageModule/recruitAndSeek/recruitAndSeekDateils/recruitAndSeekDateils?id='+id
						})
				}
				
			},
			changedColor(index){
				var that=this
				if(index==1){
					that.knowledge="changeColor"
					that.idea="ideas"
				}else if(index==2){
					that.idea="changeColor"
					that.knowledge="ideas"
				}
				
			},
			   // 合伙开店
			   partnershiped(){
				   this.partnerships=!this.partnerships
			   },
			   partnership(){
				   var that=this
				    uni.request({
				   			url: shoppublic.getUrl() + '/sysuserdetail/findlistPartnershipShop',
				   			data: {
				   			        token: that.token,
				   			        uid:  that.userId
				   					},
				   			header: {
				   					'content-type': 'application/json' // 默认值
				   					},
				   			success: function(res) {
				   						
				   						that.list4=res.data.responseBody,
				   						that.count4=res.data.msgCode === '2' ? '' : res.data.responseBody.length
				   						 
				   						},
				   })
			   },
					 
			//项目加盟
			franchiseed(){
				
				this.isfranchisee=!this.isfranchisee
			},
			franchisee(){
				var that=this
					  uni.request({
				  url: shoppublic.getUrl() + '/sysuserdetail/findlistProjectJoin',
				  data: {
				   token: that.token,
				   uid:  that.userId
				  },
				  header: {
				    'content-type': 'application/json' // 默认值
				  },
				  success: function(res) {
			
				       that.list3=res.data.responseBody,
				       that.count3=res.data.msgCode === '2' ? '' : res.data.responseBody.length
				   
				  },
				})
				},
		
			//
			showStoreRecruitment(){
				this.StoreRecruitments=!this.StoreRecruitments
			},
			//门店招聘
			StoreRecruitment(){
				var that=this
						   uni.request({
				  url: shoppublic.getUrl() + '/sysuserdetail/findlistStoreRecruitment',
				  data: {
				    token: that.token,
				    uid:  that.userId
				  },
				  header: {
				    'content-type': 'application/json' // 默认值
				  },
				  success: function(res) {
					
				       that.list5=res.data.responseBody,
				       that.count5=res.data.msgCode === '2' ? '' : res.data.responseBody.length
				   
				  },
				})
				},
			//门店招聘
	
			//新铺招租
					Newshops(){
						var that=this
							uni.request({
							url: shoppublic.getUrl() + '/sysuserdetail/findlistNewShopRent',
							data: {
							  token: that.token,
							  uid:  that.userId
							},
							header: {
							  'content-type': 'application/json' // 默认值
							},
							success: function(res) {
								
							
								that.list2=res.data.responseBody,
								that.count2=res.data.msgCode === '2' ? '' : res.data.responseBody.length
							 

							},
				  })
			},
			showBox(){
				this.ListBox=!this.ListBox
			},
			showBox1(){
				this.Newshop=!this.Newshop
			},
			//老店转让
			oldStore(){
				var that=this
					  uni.request({
					     url: shoppublic.getUrl() + '/sysuserdetail/findlistOldShopTransfer',
						   data: {
							token: that.token,
							uid: that.userId
								},
								header: {
									 'content-type': 'application/json' // 默认值
									},
								success: function(res) {
									console.log(res)
									that.list1=res.data.responseBody,
									that.count1=res.data.msgCode === '2' ? '' : res.data.responseBody.length
										
										}
				})
			},
						
				  //评论
					submitDetailHuiFu() {
					var content = this.wenDaDetailHuiFu;

					var that = this;
					that.isshowBox=true
					that.isshow=false
					if (content.length > 1) {
					  this.clickOneTime++;
					  if (this.clickOneTime != 1) {
						return false;
					  }
					  this.addReplyOfHuiFu(content)
					} else {}

				  },
					  addReplyOfHuiFu: function(content) {
						var _this = this;
						var aa = _this.commentlist;
// 						_this.setData({
// 						  isPingLun: true,
// 						  faSongFlag: true
// 						})
						uni.request({
						  url: shoppublic.getUrl() + '/sysuserdetail/addReviews',
						  data: {
							token:_this.token,
							uid: _this.userId,
							content: content
						  },
						  success: function(res) {
						
							  _this.clickOneTime=0
						
							var reply = res.data.responseBody;
							if (aa != undefined && aa.length > 0) {
							  aa.reverse();
							  aa.push(reply);
							  aa.reverse();
							  
								_this.commentlist=aa,
								_this.wenDaDetailHuiFu="",
								
							  _this.evaluate(_this.userid)
							} else {
							  var bb = [];
							  bb[0] = reply;
							
								 _this.commentlist=bb,
								_this.wenDaDetailHuiFu="",
// 								isPingLun: false,
// 								faSongFlag: false

							
							  _this.evaluate(_this.userid)
							}

						  },
						  fail: function(res) {}
						});
					  },
			//评价列表
			 evaluate(userid) {
							let that = this;
							uni.request({
							  url: shoppublic.getUrl() + '/sysuserdetail/findlistReviews',
							  data: {
								token: that.token,
								uid: userid
							  },
							  header: {
								'content-type': 'application/json' // 默认值
							  },
							  success: function(res) {
								  	
								if (res.data.responseBody == null) {
								 
									that.pinglunnull=true

								 
								} else {
									
									that.commentlist=res.data.responseBody
									that.pinglunnull=false
								 
								}
							  },

							})
						  },
			//电话添加
		userphone(userid){
				var that=this
				  event.preventDefault();
				    uni.request({
						url: shoppublic.getUrl() + '/sysuserdetail/addTelephoneExchange',
						data: {
						  token: 132,
						  uid: userid
						},
						success: function(res) {
						  if (res.data.status == 1) {
							 	uni.showActionSheet({
							 	itemList: ['呼叫', '添加联系人'],
							 	success: function (res) {
							 		if(res.tapIndex==0){
							 			uni.makePhoneCall({
							 				phoneNumber:that.user.phone //仅为示例
							 			});
							 				}else if(res.tapIndex==1){
							 					uni.addPhoneContact({
							 						nickName:that.user.name,
							 						lastName: '',
							 						firstName:'',
							 						remark: '',
							 						mobilePhoneNumber:that.user.phone ,
							 						weChatNumber: '',
							 						success: function () {
							 							console.log('success');
							 						},
							 						fail: function () {
							 							console.log('fail');
							 						}
							 					});
							 				}
							 	},
							 	fail: function (res) {
							 		console.log(res.errMsg);
							 	}
							 });
						  } else {
							//失败
							
							uni.showModal({
							  title: '提示',
							  content: '请完成用户认证，再申请交换',
							  success: function(res) {
								if (res.confirm) {
								  //点击确定
								  uni.navigateTo({
									url: '../../mineIndex/certificationModule/certificationIndex'
								  })
								} else if (res.cancel) {
								  //点击取消
								}
							  }
							})
						  }
						}
					  })
			
			},
			//用户关注	
					getuserINfo(id){
						var that=this
								uni.request({
											url: shoppublic.getUrl() + '/sysuserdetail/findpersonaldetailssysuserrecommend',
											data: {
											  token:id
											},
												success(res) {
											if (res.data.status == 1) {
													var imglist = res.data.responseBody
													that.imglist=imglist
																						
											} else {
												uni.showToast({
												 title: '请求失败',
												 icon: 'success',
												duration: 2000
												})
											}
																  
											}
						})
					},	
			//获取用户信息
			  getsysuserdetail: function(userid) {
				var _this = this;
				uni.request({
				  url: shoppublic.getUrl() + '/sysuserdetail/getsysuserdetail',
				  data: {
					token: 14651,
					uid: userid
				  },
				  success: function(res) {
					console.log(res)
					//生成转发的标题
					if (res.data.responseBody.type == "1") {
					  _this.shareTitle = res.data.responseBody.company + '·' + res.data.responseBody.position
					}
					if (res.data.responseBody.type == "2") {
					  _this.shareTitle = res.data.responseBody.company
					}

					_this.user=res.data.responseBody
					_this.weChat=res.data.responseBody.wechatno.substring(0,3)+'****'+res.data.responseBody.wechatno.substring(4,6)
					_this.phone=res.data.responseBody.phone.substring(0,3)+`-`+res.data.responseBody.phone.substring(5,8)+`-****`
				  },
				  fail: function(res) {}
				});
			  },
			switchStyle(index){
				console.log(index);
				console.log(this.blockContacts);
				if(index === '1'){
					this.blockRelease = true;
					this.blockContacts = false;
					this.blockMessage = false;
				}else if(index === '2'){
					this.blockRelease = false;
					this.blockContacts = true;
					this.blockMessage = false;
				}else if(index === '3'){
					this.blockRelease = false;
					this.blockContacts = false;
					this.blockMessage = true;
				}
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'menu') {// 来自页面内分享按钮
			  console.log(12)
			}
			return {
			  title: '名片',
			  path: '/pages/index/index'
			}
		  }
	}
</script>

<style lang="scss">
	@import './userDateils.scss'
</style>
