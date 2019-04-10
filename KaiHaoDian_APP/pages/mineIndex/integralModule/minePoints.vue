<template>
	<view class="content">
		<view class="all_content">
		<image src="http://39.104.48.81:8088/shop_file/images/signIn.png" mode="" class="viewBackground"></image>
			<view class="information">
				<view class="informationTop">
					<view class="informationt-left">
						<view class="ImgBox">
							<img :src="userInfo.portrait" alt="">
						
						</view>
						<text class="informationtText">{{userInfo.integral}} 积分</text>
					</view>
					<view class="informationt-right">
						<text class="informationtTexts" @touchend="record">兑换记录</text><text class="_arrow iconfont">&#xe616;</text>
					</view>
				</view>
			</view>
			<view class="sign" @click="clickSignIn">
				{{signIn}}
			</view>
			<view class="Youku">
				<img :src="Youku" alt="">
			</view>
			<view class="Tencent">
				<img :src="Tencent" alt="">
			</view>
			<view class="iQIYI">
				<img :src="iQIYI" mode=""></image>
			</view>
			<view class="mango">
				<img :src="mango" alt="">
			</view>
			<view class="box YoukuBox" @touchend="jumpToPointExchangeRecord(1)">
				
			</view>
			<view class="box TencentBox" @touchend="jumpToPointExchangeRecord(2)">
				
			</view>
			<view class="box iQIYIBox" @touchend="jumpToPointExchangeRecord(3)">
				
			</view>
			<view class="box mangoBox" @touchend="jumpToPointExchangeRecord(4)">
				
			</view>
			
			<view class="integral Youkuintegral">200 积分</view>
			<view class="integral Tencentintegral"> 200 积分</view>
			<view class="integral iQIYIintegral"> 200 积分</view>
			<view class="integral mangointegral"> 200 积分</view>
		</view>
			<view class="Filesonic">
				
			</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic';
	export default {
		data() {
			return {
				token:"",
				userInfo:"",
				signIn:"签到",
				 isSignState: '', //签到状态
				Youku:"http://image2.quanmama.com/QMMImg/2018/1/8/113556569.jpg",
				Tencent:"http://img.pconline.com.cn/images/upload/upc/tx/pc_best/1711/20/c29/67261096_1511161388844.png",
				iQIYI:"http://pic8.58cdn.com.cn/zhuanzh/n_v1bj3gzsbri27fqgyyv4tq_750_0.jpg",
				mango:"http://img0.imgtn.bdimg.com/it/u=3372548825,1275706203&fm=214&gp=0.jpg"
			};
		},
		onLoad(option) {
			this.getSignInState(option.id)
			this.getShopList(option.id)
			console.log(option.id)
		},
		methods:{
			//兑换记录
			record(){
				uni.navigateTo({
					url: 'pointExchangeRecord',
				})
			},
			//分享
	
			// 获取礼品列表
			  getShopList(id) {
				  var that=this
				wx.request({
				  url: shoppublic.getUrl() + '/integral/gointegral',
				  data: {
					token:id
				  },
				  success: res => {
					  console.log(res)
							that.userInfo=res.data.responseBody.sysuser
				  }
				})
			  },
			//获取签到状态
			 getSignInState(id) {
				   var that=this
					uni.request({
					  url: shoppublic.getUrl() + '/sign/isSign',
					  data: {
						uid:id
					  },
					  success: res => { //204已签到,//202未签到,
						console.log(res);
						if (res.data.msgCode==204) {
						
							  this.signIn="已签到"
						  
						}
					  }
					})
				  },
			//签到
			 clickSignIn(e) {
					let _this = this;
					uni.request({
					  url: shoppublic.getUrl() + '/sign/signByDay',
					  data: {
						uid: 14651
					  },
					  success: res => { //签到成功
						console.log(res);
						if (res.data.msgCode === '200') {
							_this.signIn="已签到"
							_this.isSignState='204'
						
						} else {
						  uni.showToast({
							title: '网络繁忙,请稍后重试',
							icon: 'none',
							duration: 2000
						  })
						}
					  }
					})
				  },
			// 跳转至积分兑换详情页面
			jumpToPointExchangeRecord(index){
				if(index==1){
					uni.navigateTo({
						url: 'Giftdetails/Giftdetails?id=3',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}
					if(index==2){
					uni.navigateTo({
						url: 'Giftdetails/Giftdetails?id=4',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}
					if(index==3){
					uni.navigateTo({
						url: 'Giftdetails/Giftdetails?id=5',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}
					if(index==4){
					uni.navigateTo({
						url: 'Giftdetails/Giftdetails?id=6',
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
	@import "minePoints.css";
</style>
