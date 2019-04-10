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
				<image class="img" src="/static/user.png"></image>
				<input class="biaoti" v-model="phoneno" type="number" maxlength="11" placeholder="请输入你的用户名" />
			</view>
			<view class="list-call">
				<image class="img" src="../../static/1.png"></image>
				<input class="biaoti" v-model="invitation" type="text" maxlength="12" placeholder="请填写你的手机号" />
			</view>
			<view class="list-call">
				<image class="img" src="../../static/2.png"></image>
				<input class="biaoti" v-model="password" type="text" maxlength="32" placeholder="请填写不少于六位数的密码" :password="!showPassword" />
				<image class="img" :src="showPassword?'../../static/op.png':'../../static/cl.png'" @tap="display"></image>
			</view>
				<view class="list-call">
				<image class="img" src="/static/affirm.png"></image>
				<input class="biaoti" v-model="invitation" type="text" maxlength="12" placeholder="请确认密码" />
			</view>
			<view class="list-call">
				<image class="img" src="/static/verification.png"></image>
				<input class="biaoti" v-model="code" type="number" maxlength="4" placeholder="验证码" />
				<view class="yzm" :class="{ yzms: second>0 }" @tap="getcode">{{yanzhengma}}</view>
			</view>
		
			
		</view>
		<view class="dlbutton" hover-class="dlbutton-hover" @tap="bindLogin">
			<text>注册</text>
		</view>
		<view class="xieyi">
		还没有账号,&nbsp;&nbsp;点击<navigator url="../Login/Login" open-type="navigate">登录>></navigator>
	</view>
		<!-- <view class="xieyi">
			<image @tap="xieyitong" :src="xieyi==true?'/static/shilu-login/ty1.png':'/static/shilu-login/ty0.png'"></image>
			<text @tap="xieyitong"> 同意</text>
			<navigator url="blog?id=1" open-type="navigate">《软件用户协议》</navigator>
		</view> -->
	</view>
</template>

<script>
	var tha,js;
	export default {
		onLoad(){
			tha = this;
			
		},
		onUnload(){
			clearInterval(js)
			this.second = 0;
		},
		data() {
			return {
				phoneno:'',
				password:'',
				code:'',
				invitation:'',
				xieyi:true,
				showPassword:false,
				second:0
			};
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
		methods: {
			display() {
			    this.showPassword = !this.showPassword
			},
			xieyitong(){
				this.xieyi = !this.xieyi;
			},
			getcode(){
				if(this.second>0){
					return;
				}
				this.second = 60;
				uni.request({
				    url: 'http://***/getcode.html', //仅为示例，并非真实接口地址。
				    data: {phoneno:this.phoneno,code_type:'reg'},
					method: 'POST',
					dataType:'json',
				    success: (res) => {
						if(res.data.code!=200){
							uni.showToast({title:res.data.msg,icon:'none'});
						}else{
							uni.showToast({title:res.data.msg});
							js = setInterval(function(){
								tha.second--;
								if(tha.second==0){
									clearInterval(js)
								}
							},1000)
						}
				    }
				});
			},
		    bindLogin() {
				if (this.xieyi == false) {
				    uni.showToast({
				        icon: 'none',
				        title: '请先阅读《软件用户协议》'
				    });
				    return;
				}
				if (this.phoneno.length !=11) {
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
				if (this.code.length != 4) {
				    uni.showToast({
				        icon: 'none',
				        title: '验证码不正确'
				    });
				    return;
				}
				uni.request({
				    url: 'http://***/reg.html',
				    data: {
						phoneno:this.phoneno,
						password:this.password,
						code:this.code,
						invitation:this.invitation
					},
					method: 'POST',
					dataType:'json',
				    success: (res) => {
						if(res.data.code!=200){
							uni.showToast({title:res.data.msg,icon:'none'});
						}else{
							uni.showToast({title:res.data.msg});
							setTimeout(function(){
								uni.navigateBack();
							},1500) 
						}
				    }
				});
				
		    }
		}
	}
</script>

<style lang="scss">
	@import 'register.scss'
</style>
