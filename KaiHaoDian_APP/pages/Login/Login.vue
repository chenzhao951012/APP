<template>
	<view class="content">
		<view class="header">
			<view class="LogoBox">
				<img src="../../static/logo.png">
				<view>欢迎使用好好开店</view>
			</view>
			
		</view>
		
		<view class="list">
			<view class="list-call">
				<!-- <input type="number" maxlength="11"  placeholder="请填写你的手机号"/> -->
				<input class="biaoti" v-model="phoneno" type="number" maxlength="11" placeholder="请填写你的手机号" />
				<view  class="Btns" @click="getcode">{{yanzhengma}}</view>
			</view>
			<view class="list-call">
			
				<input class="biaoti" v-model="password" type="text" maxlength="32" placeholder="请填写4位数验证码"  />
			</view>
			
		</view>

		<view class="dlbutton" hover-class="dlbutton-hover" @click="bindLogin">
			<text>登录</text>
		</view>
		<!-- 第三方登录 -->
		<view class=" partyLogin">
			<view></view>
			<text>OR</text>
			<view></view>
		</view>
		<view class="ChatLogin">
			<view @touchend="WeChatLogin">微信登录</view>
			<view>支付宝登录</view>
		</view>
		<view class="agreement">
			·登录即表示你已同意《开好店用户协议》
		</view>
	</view>
</template>

<script>
import shoppublic from '@/common/shoppublic';
		var tha,js;
	import {mapMutations} from 'vuex';
	export default {
		onLoad(){
			tha = this;
		},
		computed:{
		
		},
		data() {
			return {
				second:0,
				phoneno:'',
				password:'',
				show: true,
				count: '',
				timer: null,
				yanzhengma:'获取验证码',
				verificationNumber:''
			};
		},
		methods: {
			//获取验证码
			getCodes(){
				var that=this
			 const TIME_COUNT = 60;
			 if (!that.timer) {
			   that.count = TIME_COUNT;
			   that.timer = setInterval(() => {
			   if (that.count > 0 && that.count <= TIME_COUNT) {
				 that.yanzhengma=(that.count--) + 's'
				} else {
				that.yanzhengma='重新获取'
				 clearInterval(that.timer);
				 that.timer = null;
				}
			   }, 1000)
			  }
		   } ,
			getcode(){
				if(this.second>0){
					return;
				}
				var that=this
				this.second = 60;
				if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(that.phoneno)) || that.phoneno =="") {
					 uni.showToast({
						icon: 'none',
						title: '手机号格式不正确'
					});
				}else{
					uni.request({
					    url: shoppublic.getUrl() + 'smslogin/sendcode',
					    data: {
							 phone:that.phoneno
							},
					    success: (res) => {
							console.log()
							if(res.data.status==0){
								
								uni.showToast({
									title:'验证码发送成功',
									icon:'none',
									duration:2000
								})
								that.getCodes()
							}else{
								uni.showToast({
									title:'验证码获取失败',
									icon:'none',
									duration:2000
								})
							}
					    }
					});
				}
				
			},
			//微信登录
			WeChatLogin(){
				uni.login({
			  provider: 'weixin',
			  success: function (loginRes) {
				console.log(loginRes.code);
				// 获取用户信息
				uni.getUserInfo({
				  provider: 'weixin',
				  success: function (infoRes) {
					console.log('用户昵称为：' + JSON.stringify(infoRes.userInfo));
				  }
				});
			  }
			});
			},
			// ...mapMutations(['login']),
		    bindLogin() {
				if (this.phoneno.length != 11) {
				     uni.showToast({
				        icon: 'none',
				        title: '手机号不正确'
				    });
				    return;
				}
		        else{
		          	uni.request({
		              url:shoppublic.getUrl() + 'smslogin/login',
		              data: {
		          		phone:this.phoneno,
		          		code:this.password
		          	},
		              success: (res) => {
						  if(res.data.msgCode==0){
							   uni.showLoading({
							      title: '登录成功,即将去往首页'
							  });
							 setTimeout(()=>{
								 uni.switchTab({
								 	url: '../index/index'
								 });
								 uni.hideLoading();
							 },2000)
						  }else{
							   uni.showToast({
							     icon: 'none',
							     title: '登录失败'
							 }); 
						  }
		          		 
		          		
		              }
		          });
		          
		        }
			
				
		    }
		}
	}
</script>

<style lang="scss">
	@import 'Login.scss'
</style>
