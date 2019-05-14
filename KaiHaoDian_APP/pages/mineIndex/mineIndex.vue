<template>
	<view class="content">
			<view class="Bannerd">
				<view class="connent">
					<view class="connet">
						
					</view>
				<view class="_cut_off_rule">
					<view class="userBanner">
						
					</view>
					<view class="_header_card" @click="jumpToContacts">
						<!-- 用户信息图片 -->
						<image class="_card_left_image" :src="userInfo.portrait"></image>
						<view class="_card_right">
							<!-- 名字 . 公司 -->
							<view class="_card_info">{{userInfo.name? userInfo.name : (userInfo.nickname ? userInfo.nickname : '匿名用户')}}</view>
							<view class="_card_company">认证信息</view>
							<!-- 生成名片 -->
						</view>
					</view>
					<!-- 关注、提问、粉丝 -->
					<view class="_mine_menu">
						<view class="_menu_item"  @click="jumpToMenu(0)">
							
							<view class="_mine_focus">我的关注</view>
							<view class="_focus_number">{{attentionCount}}</view>
						</view>
						<view class="_menu_item"  @click="jumpToMenu(1)">
								<view class="_mine_focus">我的粉丝</view>
							<view class="_focus_number">{{fanscount}}</view>
						
						</view>
						<view class="_menu_item" @click="jumpToMenu(2)">
							
							<view class="_mine_focus">我的提问</view>
						<view class="_focus_number">{{questionCount}}</view>
						</view>
					</view>
					<!-- 分割线 -->
					<view class="authentication">
						<view>见习</view>
						<view class="schedule"><progressBar></progressBar></view>
						
						<view>正式</view>
					</view>
					</view>
					<!-- 我的钱包 -->
					<view class="massageBox">
						<view class="_mine_menu_center" @click="jumpToInfoPage(0)">
							<view class="_mine_menu_left">
								<text class="_arrow iconfont">&#xe674;</text>
								<text class="_mine_wallet">我的钱包</text>
							</view>
							<view class="_mine_menu_right">
								<text class="_mine_number">{{freeamount===0?"0.00":freeamount}}</text>
								<text class="_arrow iconfont">&#xe616;</text>
							</view>
						</view>
							<view class="_mine_menu_center" @click="jumpToInfoPage(2)">
							<view class="_mine_menu_left">
								<text class="_arrow iconfont">&#xe67b;</text>
								<text class="_mine_wallet">我的积分</text>
							</view>
							<view class="_mine_menu_right">
								<text class="_mine_number">{{userInfoes.integral}}</text>
								<text class="_arrow iconfont">&#xe616;</text>
							</view>
						</view>
						<view class="_mine_menu_center" @click="jumpToInfoPage(1)">
							<view class="_mine_menu_left">
								<text class="_arrow iconfont">&#xe675;</text>
								<text class="_mine_wallet">我的发布</text>
							</view>
							<view class="_mine_menu_right">
								<text class="_mine_number"></text>
								<text class="_arrow iconfont">&#xe616;</text>
							</view>
						</view>
							<view class="_mine_menu_center" @click="jumpToMenu(2)" style="border-bottom: 0;">
							<view class="_mine_menu_left">
								<text class="_arrow iconfont">&#xe678;</text>
								<text class="_mine_wallet">我的问答</text>
							</view>
							<view class="_mine_menu_right">
								<text class="_mine_number"></text>
								<text class="_arrow iconfont">&#xe616;</text>
							</view>
						</view>
						<view class="lines">
							
						</view>
						<view class="_mine_menu_center" @click="jumpToInfoPage(3)">
							<view class="_mine_menu_left">
								<text class="_arrow iconfont">&#xe679;</text>
								<text class="_mine_wallet">我的订单</text>
							</view>
							<view class="_mine_menu_right">
							<text class="_mine_number"></text>
								<text class="_arrow iconfont">&#xe616;</text>
							</view>
						</view>
						<view class="_mine_menu_center" @click="jumpToInfoPage(4)" style="border-bottom: 0;">
							<view class="_mine_menu_left">
								<text class="_arrow iconfont">&#xe620;</text>
								<text class="_mine_wallet">消息通知</text>
							</view>
							<view class="_mine_menu_right">
								<text class="_mine_number"></text>
								<text class="_arrow iconfont">&#xe616;</text>
							</view>
						</view>
						<view class="lines">
							
						</view>
						<view class="_mine_menu_center" @click="jumpToInfoPage(5)">
							<view class="_mine_menu_left">
								<text class="_arrow iconfont">&#xe623;</text>
								<text class="_mine_wallet">个人/企业认证</text>
							</view>
							<view class="_mine_menu_right">
								<text class="_mine_number"></text>
								<text class="_arrow iconfont">&#xe616;</text>
							</view>
						</view>
						<view class="_mine_menu_center" @click="jumpToInfoPage(4)">
							<view class="_mine_menu_left">
								<text class="_arrow iconfont">&#xe67a;</text>
								<text class="_mine_wallet">申请交换联系方式</text>
							</view>
							<view class="_mine_menu_right">
								<text class="_mine_number"></text>
								<text class="_arrow iconfont">&#xe616;</text>
							</view>
						</view>
						<view class="_mine_menu_center" @click="jumpToInfoPage(10)">
							<view class="_mine_menu_left">
								<text class="_arrow iconfont">&#xe67c;</text>
								<text class="_mine_wallet">招商管理</text>
							</view>
							<view class="_mine_menu_right">
								<text class="_mine_number"></text>
								<text class="_arrow iconfont">&#xe616;</text>
							</view>
						</view>
						<view class="_mine_menu_center" @click="jumpToInfoPage(6)"  style="border-bottom: 0;">
							<view class="_mine_menu_left">
								<text class="_arrow iconfont _arrows">&#xeb16;</text>
								<text class="_mine_wallet">认证入驻</text>
							</view>
							<view class="_mine_menu_right">
								<text class="_mine_number"></text>
								<text class="_arrow iconfont">&#xe616;</text>
							</view>
						</view>
						<view class="lines">
							
						</view>
						<view class="_mine_menu_center" @click="settingUp(userInfo.name,userInfo.portrait)" style="">
							<view class="_mine_menu_left">
								<text class="_arrow iconfont">&#xe719;</text>
								<text class="_mine_wallet">设置</text>
							</view>
							<view class="_mine_menu_right">
								<text class="_mine_number"></text>
								<text class="_arrow iconfont">&#xe616;</text>
							</view>
						</view>
						<view class="_mine_menu_center" @click="jumpToInfoPage(9)" style="border-bottom: 0;">
							<view class="_mine_menu_left">
								<text class="_arrow iconfont">&#xe703;</text>
								<text class="_mine_wallet">我的推广</text>
							</view>
							<view class="_mine_menu_right">
								<text class="_mine_number"></text>
								<text class="_arrow iconfont">&#xe616;</text>
							</view>
						</view>
					</view>
					
				</view>
			
			</view>
			<!-- 头部用户信息 -->
	
		<!-- </view> -->
		<!-- <text class="title">我的</text> -->
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic';
	import progressBar from '@/components/progressBar/cmd-progress.vue';
	export default {
		components: {
			progressBar
		},
		data() {
			return {
				id:"",
				questionCount: 0,
				user:"",
				fanscount:"",
				attentionCount:"",
				unauthorize:"renzheng",
				information:"未认证",
				token:17099,
				userInfo:"",
				myId:"",
				userInfoes:"",
				freeamount:0.00,
				// 测试数据
				menuList:[
					{
						count:1,
						title:"正在关注"
					},{
						count:1,
						title:"提问"
					},{
						count:2,
						title:"粉丝"
					}
				],
			};
		},
		onLoad(option) {
			var that=this
			that.getWallet();
			this.getUserInfo();
			setTimeout(()=>{
				if(!that.userInfo.type){
					that.information="未认证"
				}else if(that.userInfo.type==='2' || that.userInfo.type==='1'){
					that.information="已认证"
					that.unauthorize='renzheng2'
				}else if(that.userInfo.type === '4_1' || that.userInfo.type === '4_2'){
					that.information="认证中"
					that.unauthorize='_unauthorized'
					}
			},200)
			that.getShopList()
		},
		methods:{
			//获取积分
				// 获取礼品列表
			  getShopList(id) {
				  var that=this
				uni.request({
				  url: shoppublic.getUrl() + '/integral/gointegral',
				  data: {
					token:that.token
				  },
				  success: res => {
					  console.log(res)
							that.userInfoes=res.data.responseBody.sysuser
				  }
				})
			  },
			 //精度丢失
			  accMul: function(arg1, arg2) {
				var m = 0,
				  s1 = arg1.toString(),
				  s2 = arg2.toString();
				try {
				  m += s1.split(".")[1].length
				} catch (e) {}
				try {
				  m += s2.split(".")[1].length
				} catch (e) {}
				return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
			  },
			// 钱包获取
			 getWallet() {
				 var that=this
					uni.request({
					  url: shoppublic.getUrl() + '/wallet/getWallet',
					  data: {
						uid: that.token
					  },
					  success: (res) => {
						
						if (res.data.responseBody.length >= 1) {
						
							that.freeamount=this.accMul(res.data.responseBody[0].freeamount, 0.01)
						  
						}
					  }
					})
				  },
			//设置
			settingUp(){
				var that=this
				uni.navigateTo({
					url: 'settingUp/settingUp?id='+that.myId
				})
			},
			//用户信息
			getInfo(){//老接口
				
							let _this = this;
							uni.request({
							  url: shoppublic.getUrl() + '/personalcenter/personalcenter',
							  data: {
								token: _this.token
							  },
							  header: {
								'Content-Type': 'application/json'
							  },
							  success: res => {
								
								  _this.attentionCount=res.data.responseBody.attentioncount,
								  _this.fanscount=res.data.responseBody.fanscount,
								  _this.user=res.data.responseBody
								
							  }
							})
						 
			},
			getUserInfo(){//新接口
			
					let _this = this;
					uni.request({
					  url: shoppublic.getUrl() + '/mine/qryMineInfo',
					  header: {
						"Content-Type": "application/x-www-form-urlencoded"
					  },
					  method: 'post',
					  data: {
						id: _this.token
					  },
					  success: (res) => {
					console.log(res);
						if (res.data.msgCode === '200') {
							
							_this.userInfo=res.data.responseBody[0],
							_this.myId=res.data.responseBody[0].id
						
// 						  _this.getTips(res.data.responseBody[0].type);
						  _this.getInfo();
// 						  _this.getWallet();
// 						  _this.getWenTiLieBiao();
						}
					  },
					  fail: (res) => {}
					});

				
							},
			// 未认证跳转认证页面
			jumpToContacts(e){
				// 未认证
				uni.switchTab({
					url: 'certificationModule/certificationIndex',
					success: res => {
						console.log(res);
					},
					fail: () => {},
					complete: () => {}
				});
				// 已认证
				
			},
			// 跳转至关注、提问、粉丝
			jumpToMenu(index){
				var that=this
				if(index == "0"){
					uni.navigateTo({
						url: 'focusModule/mineAttention?id='+that.myId,
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(index == "1"){
					uni.navigateTo({
						url: 'FansModule/mineFans?id='+that.myId,
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(index == "2"){
					uni.navigateTo({
						url: 'askQuestionsModule/mineAskQuestions',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}
			},
			// 我的钱包、发布、积分跳转详情页
			jumpToInfoPage(index){
			var that=this
				if(index == "0"){
					//我的钱包页面跳转
					uni.navigateTo({
						url: 'walletModule/mineWallet',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(index == "1"){
					//我的发布页面跳转
					uni.navigateTo({
						url: 'releaseModule/mineRelease',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(index == "2"){
					//我的积分页面跳转
					uni.navigateTo({
						url: 'integralModule/minePoints?id='+that.token,
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(index == "3"){
					//我的订单
					uni.navigateTo({
						url: 'Myorder/Myorder',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(index == "4"){
					//申请交换联系
					uni.navigateTo({
						url: 'messageNotification/messageNotification',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(index == "5"){
					//个人/企业认证页面跳转
					uni.navigateTo({
						url: 'certificationModule/certificationIndex',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(index == "6"){
					//申请交换联系
					uni.navigateTo({
						url: 'Application/Application',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(index == "7"){
					//申请交换联系
					uni.navigateTo({
						url: 'service/service',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(index == "8"){
					//申请交换联系
					uni.navigateTo({
						url: 'AboutUs/AboutUs',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(index == "9"){
					//申请交换联系
					uni.navigateTo({
						url: 'mineExtend/mineExtend',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(index == "10"){
					//申请交换联系
					uni.navigateTo({
						url: 'Investment/Investment',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	// 引入样式
	@import 'mineIndex.scss';
</style>
