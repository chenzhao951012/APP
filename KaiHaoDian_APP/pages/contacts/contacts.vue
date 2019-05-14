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
					<view class="_company" v-if="user.company">{{user.company}}<text class="iconfont">&#xe730;</text><img src="../../static/renzheng.png" alt=""></view>
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
				
			</view>
			<view class="_bottom_info">
								<view class="_contact_way iconfont" @touchend="Copychat(user.wechatno)">&#xe661;<text>{{user.wechatno}}</text></view>
				<view class="_contact_way iconfont">&#xe61e;<text @touchend="userphone(user.id)">{{user.phone}}</text></view>

			</view>
			<view class="shares"><img style="width: 64upx;height: 64upx;" src="../../static/shares.jpg" alt=""></view>
		</view>
		<view class="attentionBox">
			<view class="attentionBox2">
				<view class="lines">
						<view>我的关注</view>
						<view>{{UserInfor.attentioncount}}</view>
					</view>
					<view  class="lines">
						<view>我的粉丝</view>
						<view>{{UserInfor.fanscount}}</view>
					</view>
					<view  class="lines">
						<view>我的收藏</view>
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
				<view class="release_info" @click="switchStyle('1')">我的人脉<view :class="blockRelease ? '_border' : ''"></view></view><text class="kinsd">|</text>
				<view class="release_info" @click="switchStyle('2')">本地人脉<view :class="blockContacts ? '_border' : ''"></view></view><text class="kinsd">|</text>
				<view class="release_info" @click="switchStyle('3')">全国人脉<view :class="blockMessage ? '_border' : ''"></view></view>
			</view>
			<view :class="blockRelease ? '_release_swiper' : 'display_none'">
				<view class="_info_cell" v-for="(items,index) in contactsInfoList" :key="index" @touchend="gotalk(items.tokenid,items.touid,items.portrait,items.name,items.type,user.portrait,token)">
						<view class="question">
							<view class="questionLift">
									<view class="questionUser">
										<img :src="items.portrait" alt="">
									</view>
									<view class="user_company">
										<view class="Username">
											{{items.name}}<text v-if="items.position || items.name">·</text>{{items.position}}
										</view>
										<view class="">
											<view class="_company" v-if="items.company">{{items.company}}<text class="iconfont">&#xe730;</text></view>
										</view>
									</view>
							</view>
							<view class="questionRight">
								已递交
							</view>
						</view>
				</view>
					<!-- <view class="Noquestion">
						<img src="../../static/ComentImg.png" alt="">
					</view> -->
			</view>
			<view :class="blockContacts ? '_connection_swiper' : 'display_none'">
		<!-- 	<view class="Noquestion">
				<img src="../../static/ComentImg.png" alt="">
			</view> -->
					<view class="_info_cell _release_swiper">
						<view class="question" v-for="(item,idx) in localContactsList" :key="idx">
							<view class="questionLift">
									<view class="questionUser">
										<img :src="item.portrait" alt="">
									</view>
									<view class="user_company">
										<view class="Username">
											{{item.name}}<text v-if="item.position || item.name">·</text>{{item.position}}
										</view>
										<view class="">
											<view class="_company" v-if="item.company">{{item.company}}<text class="iconfont">&#xe730;</text><img src="../../static/renzheng.png" alt=""></view>
										</view>
									</view>
							</view>
							<view class="questionRight" @click.stop="submitCrad(item.id,item.type,item.name,item.position,item.company,item.mainbusiness,item.portrait)" v-if="item.id != user.id && item.readstatus != '002' " >
								递交名片
							</view>
							<view class="questionRight" v-if="item.id != user.id && item.readstatus == '002' ">
								已递交
							</view>
						</view>
				</view>
				<view class="refresh"  @click="changeContacts">
					<img src="../../static/refresh.png" alt=""><text>换一批</text>
				</view>
			</view>
			<view :class="blockMessage ? '_message_swiper' : 'display_none'">
				<view class="_info_cell _release_swiper">
					<view class="question" v-for="(itemed,idx) in allContactsList" :key="idx">
						<view class="questionLift">
								<view class="questionUser">
									<img :src="itemed.portrait" alt="">
								</view>
								<view class="user_company">
									<view class="Username">
										{{itemed.name}}<text v-if="itemed.position || itemed.name">·</text>{{itemed.position}}
									</view>
									<view class="">
										<view class="_company" v-if="itemed.company">{{itemed.company}}<text class="iconfont">&#xe730;</text><img src="../../static/renzheng.png" alt=""></view>
									</view>
								</view>
						</view>
						<view class="questionRight" @click.stop="submitCrad(itemed.id,itemed.type,itemed.name,itemed.position,itemed.company,itemed.mainbusiness,itemed.portrait)" v-if="itemed.readstatus ==null ">
							递交名片
						</view>
						<view class="questionRight" v-if="itemed.readstatus == '002' ">
							已递交
						</view>
					</view>
			</view>
			<view class="refresh"  @click="nationwide">
				<img src="../../static/refresh.png" alt=""><text>换一批</text>
			</view>
			</view>
		</view>
	</view>
</template>

<script>
		import shoppublic from '@/common/shoppublic'; //服务器地址
		import getLocation from '@/common/getLocation.js'; //获取地理位置
	export default{
	
		data(){
			return{
					location_city:'',//地址选择
				allContactsList:"",
				contactsInfoList:"",//我的人脉
				localContactsList:"",
				UserInfor:"",
				 user: '', //用户信息
				userId: '', //用户id
				attestState: '', //认证状态
				visitorsNum: '0', //访客数量
				cardData: { //名片数据
				  attentioncount: '0', //关注数
				  fanscount: '0', //粉丝数
				  publishcount: '0', //发布数
				},
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
				phoneNumber:"",
				list2:"",
				commentlist:[],
				pinglunnull:true,
				token:17099,
				imglist:[],
				imageUrl:shoppublic.getImageUrl(),
				shareTitle:"",
			
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
		uni.getStorage({
			key: 'location',
			success: res => {
				console.log('getStorage', JSON.stringify(res));
				_this.location = {
					province_id: res.data.province_id,
					province_name: res.data.province_name,
					city_id: res.data.city_id,
					city_name: res.data.city_name
				};
				_this.location_city = res.data.city_name;
				// console.info('_location_city',_this.location_city);
			},
			fail: res => {
				if (
					(_this.location.province_name ||
						_this.location.province_id ||
						_this.location.city_name ||
						_this.location.city_id) == ''
				) {
					getLocation.getLocation(function(res_p, res_c) {
						// _this.setLocation(res_p, res_c);
						// console.log('省', JSON.stringify(res_p));
						// console.log('市', JSON.stringify(res_c));
						_this.location_city = res_c[0].name;
						console.log()
					});
				}
			}
		});
			var that=this
			 that.onloadUserInfo(17099) 
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

			that.getWenTiLieBiao();
			 that.getContactsInfoList()
			 that.getAllContacts();
		},
	
		methods:{
			// 去聊天界面
			gotalk(tokenid,touid,portrait,name,type,myportrait,mytoken){
				console.log(name)
					wx.navigateTo({
					  url: '../talk/talk?tokenid=' + tokenid + '&portrait=' + portrait + '&name=' + name+ '&touid=' + touid + '&myportrait=' + myportrait + '&type=' + type + '&mytoken=' + mytoken,
    })
			},
			//更新全国人脉
			nationwide(){
				 this.getAllContacts()
			},
			//获取全国人脉
					  getAllContacts() {
					let _this = this;
					uni.request({
					  url: shoppublic.getUrl() + 'mine/qryPeopleLocal',
					  data: {
						city_id: '',
						uid: 17099
					  },
					  success: res => {
						  console.log(res)
						  _this.allContactsList=res.data.responseBody //全国人脉获取
						
					  }
					})
		  },
			//获取我的人脉
			 getContactsInfoList() {
					let _this = this;
					uni.request({
					  url: shoppublic.getUrl() + '/chat/qryNeedHouse',
					  data: {
						uid: 17099
					  },
					  success: res => {
						  console.log(res)
						  _this.contactsInfoList=res.data.responseBody						
					  }
					})
				  },
			// 递交名片
			  submitCrad(id,type,name,position,company,mainbusiness,tokenid,portrait) {
				  var that=this
						let data = {
						  name: that.UserInfor.user.name,
						  position:that.UserInfor.user.position,
						  company:that.UserInfor.user.company,
						  mainbusiness:that.UserInfor.user.mainbusiness
						}
						if (that.UserInfor.user.type == 1 || that.UserInfor.user.type == 2) {
						  uni.request({
							url: shoppublic.getUrl() + '/chat/createHouse',
							data: {
							  uid: 17112, //自己id
							  touid: id, //对方id
							  tocradinfo: JSON.stringify(data) + '_cardInfo' //名片信息
							},
							success: res => {
								
							 console.log(res)
							  if (res.data.responseBody) {
								  var res=res.data.responseBody
								that.gotalk(res,id,portrait,name,type,that.user.portrait,that.token)
							  }
							}
						  })
						} else {
						  uni.showToast({
							title: '您还未认证哦~两秒后自动转到认证',
							icon: 'none',
							duration: 2000
						  })
						  setTimeout(() => {
							wx.navigateTo({
							url: '../mineIndex/certificationModule/certificationIndex',
							})
						  }, 2000)
						}
							
					  },
			// 换一批
			changeContacts(){
				this.getLocalContacts()
			},
			//获取本地人脉
			 getLocalContacts() {
				let _this = this;
				  uni.request({
					url: shoppublic.getUrl() + 'mine/qryPeopleLocal',
					data: {
					  city_id:610100,
					  uid: 1
					},
					success: res => {
					
						_this.localContactsList=res.data.responseBody
							console.log(_this.localContactsList)
					}
				  })
			  },
			//加载个人信息
			 onloadUserInfo(token) {
					let _this = this;
					let attestState;
					let user;
					let cardData = {
					  attentioncount: '0',
					  fanscount: '0',
					  publishcount: '0'
					}
					uni.request({
					  url: shoppublic.getUrl() + '/personalcenter/personalcenter',
					  header: {
						'Content-Type': 'application/json'
					  },
					  data: {
						token: token
					  },
					  success(res) {
						  console.log(res)
						  _this.UserInfor= res.data.responseBody
						let resBody = res.data.responseBody;
						let stateType = resBody.user.type; //认证状态
						
						// 名片数据
						resBody.attentioncount ? cardData.attentioncount = resBody.attentioncount : cardData.attentioncount = '0';
						resBody.fanscount ? cardData.fanscount = resBody.fanscount : cardData.fanscount = '0';
						resBody.publishcount ? cardData.publishcount = resBody.publishcount : cardData.publishcount = '0';
						// end
						if (stateType == '1' || stateType == '2') {
							
						
						} else if (stateType == '4_1' || stateType == '4_2') {
						  
						} else {
						
						    uni.showToast({
							title: '您还未认证哦~两秒后自动转到认证',
							icon: 'none',
							duration: 2000
						  })
						  setTimeout(() => {
							uni.navigateTo({
							  url: '../mineIndex/certificationModule/certificationIndex',
							})
						  }, 2000)
						};
						user = resBody.user;
						  _this.user=user,
						  _this.cardData=cardData,
						  _this.userId=user.id
							_this.phoneNumber= _this.user.phone.slice(0,3)+'-'+_this.user.phone.slice(3,7)+'-'+_this.user.phone.slice(7,11)
					
					  }
					})

				  },
				//问题列表
				getWenTiLieBiao: function() {
					var _this = this;
					let that = this;
					var userid = that.userId;
					uni.request({
					  url: shoppublic.getUrl() + '/sysuserdetail/findQuestionsList',
					  data: {
						uid: userid,
						token: 3605
					  },
					  success: function(res) {
							
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

		
			//
			showStoreRecruitment(){
				this.StoreRecruitments=!this.StoreRecruitments
			},
		
	
			showBox(){
				this.ListBox=!this.ListBox
			},
			showBox1(){
				this.Newshop=!this.Newshop
			},
	
	
						
			//电话添加
		userphone(userid){
				var that=this
				  event.preventDefault();
				
				     	uni.showActionSheet({
				    			itemList: [that.phoneNumber, '呼叫'],
				    				success: function (res) {
				    						if(res.tapIndex==1){
				    							 uni.makePhoneCall({
				    							 phoneNumber:that.user.phone//仅为示例
				    							 });
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
					this.getLocalContacts()
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
// 	.uni-actionsheet__cell::nth-child(1){
// 		color: red;
// 	}
	@import './contacts.scss'
</style>
