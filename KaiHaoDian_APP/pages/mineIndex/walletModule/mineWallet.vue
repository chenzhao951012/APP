<template>
	<view class="content">
		<view class="_all_content">
			<view class="wallet">
				<view class="_money_number">{{ userList? freeamount : userbBlance}}</view>
				<view class="_money_number _money_numbers">(账户余额/元)</view>
			</view>
			<view class="btnBox">
				<button type="primary" class="btns1"  @touchend="jumpToMineWithdrawal">提现</button>
				
			</view>
			
		<!-- 	<view class="_bottom_content _display_flex" @click="jumpToMarginBalance">
				<view class="_left_content">
					<view class="_money_symbol iconfont">&#xe607;</view>
					<view class="_margin_balance">保证金余额</view>
				</view>
				<view class="_arrow iconfont">&#xe618;</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic';
	export default {
		data() {
			return {
				token:132,
				freeamount:"",
				userbBlance: 0, //页面加载初始余额
				userList: '', // 用户信息
				money: "", // 提现金额
				id:"",
			};
		},
		// 监听页面加载
		onLoad(){
			console.log(this);
			this.onloadDom()
		},
		// 账单按钮的点击事件
		onNavigationBarButtonTap(e) {
			console.log(e);
			if(e.index === 0){
				uni.navigateTo({
					url: 'mineBill'
				});
			}
		},
		methods:{
			//精度计算
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
			// 去认证页面
			authentication(){
					uni.navigateTo({
					url: '../certificationModule/certificationIndex'
				});
				},
			//判断是否认正
			 onloadDom() {
					let _this = this;
					wx.request({
					  url: shoppublic.getUrl() + '/wallet/getWallet',
					  data: {
						uid: _this.token
					  },
					  success(res) {
						console.log(res);
						if (res.data.msgCode === "233") {
						  uni.showToast({
							title: '请先前去认证',
							icon: 'none',
							duration: 1000
						  })
						  setTimeout(function() {
						_this.authentication();
						  }, 2000)
						}
						if (res.data.responseBody.length >= 1) {
							  _this.userList=res.data.responseBody[0],
							  _this.freeamount=_this.accMul(res.data.responseBody[0].freeamount, 0.01)
							  _this.id=res.data.responseBody[0].uid
						}
						// console.log(userList);
					  }
					})
				  },
			// 保证金余额页面跳转事件
			jumpToMarginBalance(){
				uni.navigateTo({
					url: 'MarginBalance'
				});
			},
			// 提现页面跳转事件
			jumpToMineWithdrawal(){
				var _this=this
				uni.navigateTo({
					url: 'mineWithdrawal?id='+_this.id
				});
			}
		}
	}
</script>

<style>
@import "mineWallet.css";
</style>
