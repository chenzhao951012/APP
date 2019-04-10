<template>
	<view class="content">
		<view class="all_content">
			<!-- 提现信息 -->
			<view class="withdrawBox">
				<view class="title">
						提现金额
				</view>
				<view class="Connent">
				<view class="Connenttext">
					<text class="iconfont iconfonts">&#xe684;</text>
				</view>
				<view class="Connentinput">
					<input type="text" value=""  v-model="money"/>
				</view>
				</view>
				<view class="">
					<view class="title">
						提现到
					</view>
					<view>
						<view class="Withdrawal">
							<view><text class="iconfont iconfont1">&#xe686;</text></view>
							<view><text class="iconfont" v-if="isCheck" @click="selectCheck(1)">&#xe685;</text><text class="iconfont" @click="selectCheck(1)" v-if="!isCheck" >&#xe968;</text></view>
							</view>
						<view class="Withdrawal">
							<view><text class="iconfont iconfont2">&#xe687;</text></view>
							<view><text class="iconfont" v-if="isCheck1" @click="selectCheck(2)">&#xe685;</text><text class="iconfont" @click="selectCheck(2)" v-if="!isCheck1" >&#xe968;</text></view>
						</view>
					</view>
				</view>
			</view>
			<view class="_withDrawal_button" @click="withdrawal">提现</view>
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic';
	export default {
		data() {
			return {
				freeamount:0,
				userbBlance: 0, //页面加载初始余额
				userList: '', // 用户信息
				money: "", // 提现金额
				id:"",
				inpValue:'',
				user:"",
				isCheck:true,
					isCheck1:true,
				checked:false,
				checked1:false,
				state:0
			};
		},
		onLoad(option) {
			var _this=this
			_this. getsysuserdetail(option.id)
		},
		methods:{
			//提现选择
			selectCheck(idx){
				var that=this
					if(idx==1){
						that.isCheck=!that.isCheck
						that.isCheck1=true
						if(that.isCheck==false){
							that.state=1
						}else{
							that.state=0
							
						}
						console.log(that.state)
					}else if(idx==2){
						that.isCheck=true
							that.isCheck1=!that.isCheck1
							if(that.isCheck1==false){
								that.state=2
							}else{
								that.state=0
								
							}
							console.log(that.state)
					}
				},
					  accMul(arg1, arg2) {
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
			  regBanana(money) {
									var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
									if (reg.test(money)) {
									  return '正确'
									} else {
									  return '错误'
									};
								  },
			//微信提现
		withdrawal(){
			var that=this
			if(that.state==0){
					uni.showToast({
				  title: '请选择提现类型',
				  icon: 'none',
				  duration: 2000
				})
			}else if(that.state==1){
						uni.showToast({
				  title: '支付宝接口还未实现',
				  icon: 'none',
				  duration: 2000
				})
			}else if(that.state==2){
				that.weChatwithdrawal()
			}
		
		},
			  weChatwithdrawal() {
						let _this = this.data;
						let that = this;
						if (that.money!= '') {
						  if (this.regBanana(that.money) === '正确') {
							if (Number(that.money) >= 0) {
							  if (Number(that.money) >= 0.3) {
								if (Number(that.money) <= Number(that.freeamount)) {
								  // console.log(_this.money,'+', _this.userList.freeamount)
								  uni.showLoading({
									title: '加载中',
									mask: true
								  })
								  uni.request({
									url: shoppublic.getUrl() + '/wallet/getAllMoney',
									data: {
									  getAmount: that.money * 100,
									  wallet_id: that.userList.wallet_id,
									  uid: that.userList.uid
									},
									success(res) {
									  // console.log(res);
									  if (res.data.msgCode == "200") {
										
										  that.money=0
										
										// uni.hideLoading();
										that.onloadDom(that);
										uni.showToast({
										  title: '提现成功',
										  icon: 'success',
										  duration: 2000
										})
									  } else if (res.data.msgCode == "233") {
										 that.money=0
										uni.hideLoading();
										uni.showToast({
										  title: '提现失败,请前去认证',
										  icon: 'none',
										  duration: 2000
										})
										setTimeout(function() {
										  that.authentication();
										}, 2000)
									  } else if (res.data.msgCode == "220") {
										uni.hideLoading();
										uni.showToast({
										  title: '认证中,请耐心等待认证通过',
										  icon: 'none',
										  duration: 2000
										})
									  } else if (res.data.msgCode == '230') {
									 that.money=0
										// uni.hideLoading();
										uni.showToast({
										  title: '提现失败,请先进行微信实名',
										  icon: 'none',
										  duration: 2000
										})
									  }
// 									  setTimeout(function() {
// 										wx.hideLoading();
// 									  }, 2000)
									}

								  })
								} else {
								  uni.showToast({
									title: '余额不足',
									icon: 'none',
									duration: 2000
								  })
								}
							  } else {
								uni.showToast({
								  title: '提现金额不能小于0.3',
								  icon: 'none',
								  duration: 2000
								})
							  }
							} else {
							  uni.showToast({
								title: '请输入正确提现金额',
								icon: 'none',
								duration: 2000
							  })
							}
						  } else {
							uni.showToast({
							  title: '请输入正确提现金额',
							  icon: 'none',
							  duration: 2000
							})
						  }
						} else {
						  uni.showToast({
							title: '请输入正确提现金额',
							icon: 'none',
							duration: 2000
						  })
						}
					  },
					  //认证
					  authentication(){
					  		uni.navigateTo({
					  		url: '../certificationModule/certificationIndex'
					  	});
					  	},
			//金额判断
			
				
			//现金额度
					 onloadDom() {
								let _this = this;
								wx.request({
								  url: shoppublic.getUrl() + '/wallet/getWallet',
								  data: {
									uid: 14651
								  },
								  success(res) {
									if (res.data.responseBody.length >= 1) {
										  _this.userList=res.data.responseBody[0],
										  _this.money=_this.accMul(res.data.responseBody[0].freeamount, 0.01)
										  _this.userList=res.data.responseBody[0]
									}
									// console.log(userList);
								  }
								})
							  },
			//用户获取
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
									_this.user=res.data.responseBody
								  },
								  fail: function(res) {}
								});
				},
			// 提现按钮的点击事件
// 			withdrawal(e){
// 				this.inpValue = this.money;
// 			}
		}
	}
</script>

<style>
@import "mineWithdrawal.css";
</style>
