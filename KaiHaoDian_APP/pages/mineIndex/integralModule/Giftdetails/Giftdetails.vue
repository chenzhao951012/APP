<template>
	<view class="giftTop">
	<view class="giftSwiper">
		<view class="uni-padding-wrap">
            <view class="page-section swiper">
                <view class="page-section-spacing">
                    <swiper class="swiper"  :autoplay="autoplay" :interval="interval" :duration="duration">
                        	<swiper-item>
                           <img :src="giftList.image" alt="">
                        </swiper-item>
                    </swiper>
                </view>
            </view>
		</view>
	</view>
	<view class="giftInfointegral">
	 <view>
		<view class="giftInfotitle">{{giftList.titel}}</view>
	<view class="giftInfotitles">需要<text class="toptitle1 toptitlenumber">{{giftList.integral}}</text><text class="toptitle1">积分</text><text class="toptitle2">¥{{giftList.price}}</text></view>
	 </view>
	
	</view>
	<view class="giftInfo">
		<view><view class="introduction">商品简介</view></view>
		<view class="subtitle">如有疑问请加客服小姐姐微信：（heymaye)</view>
		<text class="massageInfo">{{textT}}</text>
	</view>
	<view class="bottomNav">
		<view class="need">
			<view>需要<text class="needttext">{{giftList.integral}}积分</text></view>
			<view>拥有<text class="possess">{{userIntegral}}</text>积分</view>
		</view>
		<view>
			<button  type="primary" class="conversion" @touchend="clickConversion(giftList.id)">我要兑换</button>
		</view>
	</view>
	</view>
</template>

<script>
import shoppublic from '@/common/shoppublic';
	export default {
		data() {
			return {    
						e_id:"",
						id:"",
					    userIntegral:"",
				        textT:"",
				 		token:14651,
						background: ['color1', 'color2', 'color3'],
						indicatorDots: true,
						autoplay: true,
						interval: 2000,
						duration: 500,
						giftList:[],
				
			};
		},
		onLoad(option){
			this.onloadShopInfo(option.id)
			this.e_id=option.id
		},
		methods:{
			//兑换
			clickConversion(id) {
				var that=this
					if (this.userIntegral >= this.giftList.integral) {
					wx.navigateTo({
						url: '../information/information/information/information?id=' + that.e_id,
					})
					} else {
					uni.showModal({
						title: '官方提示',
						content: '积分不足,赶快去分享赚积分吧',
						success: res => {
						console.log(res.confirm);
						if (res.confirm === true) {
							wx.navigateTo({
							url: '../minePoints?id='+that.id,
							})
						}
						}
					})
					}

				},
			changeIndicatorDots(e) {
            this.indicatorDots = !this.indicatorDots
				},
			//获取礼物信息
			  onloadShopInfo(id) {
				  var that=this
					uni.request({
					url: shoppublic.getUrl() + 'integral/gointegral',
					data: {
						token: that.token,
						id: id
					},
					success: res => {
						console.log(res)
						that.giftList=res.data.responseBody.list[0];
						var str = res.data.responseBody.list[0].context.split('\\n').join('\n');
						that.userIntegral=res.data.responseBody.sysuser.integral
						that.textT=str
						that.id=res.data.responseBody.sysuser.id
						
					}
					})
				},
      
		}
	}
</script>

<style lang="scss">
@import './Giftdetails.scss'
</style>
