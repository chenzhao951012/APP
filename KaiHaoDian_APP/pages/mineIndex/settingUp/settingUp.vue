<template>
	<view class="content">
		<view class="UserBox">
			<view class="lins">
				
			</view>
			<!-- 用户信息 -->
			<view class="connent">
				<view class="user">
					<view class="usertop">
						<view>头像</view>
						<view><image :src="userInfo.portrait" mode=""></image></view>
					</view>
				</view>
				<view class="user">
					<view class="usertop">
						<view>昵称</view>
						<view>{{userInfo.name}}</view>
					</view>
				</view>
				<view class="user user2">
					<view class="usertop usertop2">
						<view>系统消息</view>
						<view>    <switch checked @change="switch1Change"  color="#ffbd38" class="switchs"/>  <view>
            </view></view>
					</view>
				</view>
					<view class="user user2">
						<view class="usertop usertop2">
							<view>微信显示</view>
							<view>    <switch checked @change="switch1Change"  color="#ffbd38" class="switchs"/>  <view>
				</view></view>
						</view>
					</view>
						<view class="user user2">
							<view class="usertop usertop2">
								<view>电话显示</view>
								<view>    <switch checked @change="switch1Change"  color="#ffbd38" class="switchs"/>  <view>
					</view></view>
							</view>
						</view>
			</view>
			<view class="lins">
				
			</view>
			<view class="connent">
				<view class="user">
					<navigator  class="usertop"  url="../help/help/help" open-type="navigate">
						<view>帮助反馈</view>
						<view><text class="_arrow iconfont">&#xe616;</text></view>
					</navigator >
				</view>
				<view class="user">
					<navigator class="usertop" url="../service/service" open-type="navigate">
						<view>联系我们</view>
						<view><text class="_arrow iconfont">&#xe616;</text></view>
					</navigator>
				</view>
				<view class="user user2">
					<navigator class="usertop usertop2" url="../AboutUs/AboutUs" open-type="navigate">
						<view>关于我们</view>
						<view><text class="_arrow iconfont">&#xe616;</text><view>
						</view></view>
					</navigator>
				</view>
					<view class="user user2">
						<view class="usertop usertop2">
							<view>鼓励一下</view>
							<view><text class="_arrow iconfont">&#xe616;</text><view>
				</view></view>
						</view>
					</view>
					
			</view>
			<view class="lins">
				
			</view>
			<view class="bottom">
				<button type="primary">退出登录</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic';
	export default {
		data() {
			return {
				userInfo:""
			};
		},
		onLoad(option) {
			this.getUserInfo(option.id)
// 			uni.login({
// 					  provider: 'weixin',
// 					  success: function (loginRes) {
// 						console.log(loginRes.authResult);
// 						// 获取用户信息
// 						uni.getUserInfo({
// 						  provider: 'weixin',
// 						  success: function (infoRes) {
// 							console.log('用户昵称为：' + infoRes.userInfo.nickName);
// 						  }
// 						});
//   }
// });
		},
		methods:{
			switch1Change: function (e) {
						console.log('switch1 发生 change 事件，携带值为', e.target.value)
					},
					switch2Change: function (e) {
						console.log('switch2 发生 change 事件，携带值为', e.target.value)
					},
				getUserInfo(id){//新接口
						
								let _this = this;
								uni.request({
								  url: shoppublic.getUrl() + '/mine/qryMineInfo',
								  header: {
									"Content-Type": "application/x-www-form-urlencoded"
								  },
								  method: 'post',
								  data: {
									id:id
								  },
								  success: (res) => {
								console.log(res);
									if (res.data.msgCode === '200') {
										_this.userInfo=res.data.responseBody[0]
									}
								  },
								  fail: (res) => {}
								});
			
							
										}
		}
	}
</script>

<style lang="scss">
		input[type = "radio"] {
	display: none;
	}
	.switchs uni-switch .uni-switch-wrapper{
		border-right: 0 !important;
		
	}
@import 'settingUp.scss'
</style>
