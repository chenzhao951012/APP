<template>
	<view class="content">
		<!-- 轮播图 -->
		<swiper class="_swiper_" :indicator-dots="true" :autoplay="true" :duration="500" :circular="true" indicator-active-color="#3285ff">
			<swiper-item class="_swiper_" v-for="(item,index) in bannerList" :key="index" v-if="index < 2">
				<image class="_swiper_" :src="item.url" @click="Goinfo(index)"></image>
			</swiper-item>
		</swiper>
		<!-- 9个版块 -->
		<view class="_moduleParent">
			<view class="_moduleChilds" v-for="(item,index) in moduleList" :key="index" @click="jumpToInfo(index)">
				<image :src="item.image" mode=""></image>
				<view class="_moduleText">{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic'; //服务器地址
	export default {
		data() {
			return {
				imageUrl:shoppublic.getImageUrl(),
				bannerList:[
					{
						url:"http://img5.imgtn.bdimg.com/it/u=4060543606,3642835235&fm=26&gp=0.jpg"
					},
					{
						url:"http://img0.imgtn.bdimg.com/it/u=2445468140,2491956848&fm=26&gp=0.jpg",
					}
					
				],//轮播图
				moduleList: [
					{
						title:'招商加盟',
						image:'../../static/issue1.jpg'
					},{
						title:'合伙开店',
						image:'../../static/issue2.jpg'
					},{
						title:'旺铺转让',
						image:'../../static/issue3.jpg'
					},{
						title:'新铺租售',
						image:'../../static/issue4.jpg'
					},{
						title:'招聘求职',
						image:'../../static/issue5.jpg'
					},{
						title:'老店二手',
						image:'../../static/issue6.jpg'
					},{
						title:'开店寻址',
						image:'../../static/issue7.jpg'
					},{
						title:'新店筹备',
						image:'../../static/issue8.jpg'
					}
					
				]
			};
		},
		onLoad() {
			let _this = this;
			console.log(_this);
			
		},
		methods:{
			//
			Goinfo(index){
				if(index==0){
						uni.navigateTo({
								url: 'publishDateils/partner/partner/partner'
					});
				}else if(index==1){
						uni.navigateTo({
								url: 'publishDateils/informationpublish/information/information'
					});
				}
			},
			// 轮播图获取
			// 9大模块的点击事件
			jumpToInfo(index){
				let url = '';
				if(index === 0){//招商加盟
					url = '../homePageModule/joinInvestment/publishJoin/publishJoin'
				}
				if(index === 1){//合伙开店
					url = '../homePageModule/partnerOpenStore/partnershipStoreRelease/partnershipStoreRelease'
				}
				if(index === 2){//旺铺转让
					url = '../homePageModule/storeMakeOver/locationRelease/locationRelease'
				}
				if(index === 3){//新铺租售
					url = '../homePageModule/newStoreRental/newShopRentalRelease/newShopRentalRelease'
				}
				if(index === 4){//招聘求职
					url = '../homePageModule/recruitAndSeek/recruitAndSeekRelease/recruit/recruit'
				}
				if(index === 5){//老店二手
					url = '../homePageModule/oldStoreTwoHand/oldStoreTwoHandRelease/askToBuy/askToBuy'
				}
				if(index === 6){//开店寻址
					url = '../homePageModule/openStoreSeekSite/openStoreSeekSite'
				}
				if(index === 7 || index === 8){
					uni.showToast({
						title:'暂未开放,敬请期待',
						icon:'none',
						duration:2000
					})
				}
				if(url){
					uni.navigateTo({
						url:url
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	// 引入样式
	@import 'publish.scss';  
</style>
