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
				<button type="primary" class="Btns" @tap="getcode">{{yanzhengma}}</button>
			</view>
			<view class="list-call">
			
				<input class="biaoti" v-model="password" type="text" maxlength="32" placeholder="请填写4位数验证码" password="true" />
			</view>
			
		</view>
		
		<view class="dlbutton" hover-class="dlbutton-hover" @tap="bindLogin()">
			<text>登录</text>
		</view>
		
		<view class="xieyi">
			还没有账号,&nbsp;&nbsp;点击<navigator url="../register/register" open-type="navigate">注册>></navigator>
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
			yanzhengma(){
				if(this.second==0){
					return '获取验证码';
				}else{
					if(this.second<10){
						return '重新获取0'+this.second;
					}else{
						return '重新获取'+this.second;
					}
				}
			}
		},
		data() {
			return {
				second:0,
				phoneno:'',
				password:''
			};
		},
		onUnload(){
			clearInterval(js)
			this.second = 0;
		},
		methods: {
			getcode(){
// 				if(this.second>0){
// 					return;
// 				}
				var that=this
				this.second = 60;
				if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(that.phoneno)) || that.phoneno =="") {
					 uni.showToast({
						icon: 'none',
						title: '手机号格式不正确'
					});
				}else{
					uni.request({
					    url: shoppublic.getUrl() + '/common/getVerificationCode',
					    data: {
							 phone: that.phoneno
							},
						dataType:'json',
					    success: (res) => {
							console.log(res)
// 							if(res.data.code!=200){
// 								uni.showToast({title:res.data.msg,icon:'none'});
// 							}else{
// 								uni.showToast({title:res.data.msg});
// 								js = setInterval(function(){
// 									tha.second--;
// 									if(tha.second==0){
// 										clearInterval(js)
// 									}
// 								},1000)
// 							}
					    }
					});
				}
				
			},
			//微信登录
			WeChatLogin(){
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
					console.log(loginRes.authResult);
				  }
				});
			},
			...mapMutations(['login']),
		    bindLogin() {
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
					console.log(loginRes.authResult);
				  }
				});
				if (this.phoneno.length != 11) {
				     uni.showToast({
				        icon: 'none',
				        title: '手机号不正确'
				    });
				    return;
				}
		        if (this.password.length < 6) {
		            uni.showToast({
		                icon: 'none',
		                title: '密码不正确'
		            });
		            return;
		        }
				uni.request({
				    url: 'http://***/login.html',
				    data: {
						phoneno:this.phoneno,
						password:this.password
					},
					method: 'POST',
					dataType:'json',
				    success: (res) => {
						if(res.data.code!=200){
							uni.showToast({title:res.data.msg,icon:'none'});
						}else{
							uni.setStorageSync('user_data', JSON.stringify(res.data.data));
							this.login();
							uni.navigateBack();
						}
				    }
				});
				
		    }
		}
	}
</script>

<style lang="scss">
	@import 'Login.scss'
</style>
