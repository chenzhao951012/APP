<template>
	<view class="content">
		<!-- 招商按钮 -->
		<view class="position_button" @click="toPublishJoin">招商</view>
		<!-- 轮播图 -->
		<view class="banner">
		<!-- 	<swiper class="_swiper swiperBox" id="swiper" :autoplay="true" :duration="1000" :circular="true" @change="ChangeSwiper">
				<swiper-item class="_swiper _swipers" v-for="(item,index) in bannerList" :key="index" >
					<image class="_swiper" :src="imageUrl + item.imageurl"></image>
				</swiper-item>
			</swiper>
			<view class="swiperbutton">
				<view :class="{'balltas':true,'active':activeIndex==indexe}" v-for="(items,indexe) in bannerList" :key="indexe">
					
			</view>
			</view> -->
				<Swiperdot :info="bannerList" :current="current" field="content" :mode="mode">
					<swiper class="swiper-box" @change="change" :autoplay="true" :duration="1000" :circular="true">
			        <swiper-item v-for="(item,idx) in bannerList" :key='idx'>
			            <view class="swiper-item">
			                <img :src="imageUrl + item.imageurl" alt="">
			            </view>
			        </swiper-item>
			    </swiper>
			</Swiperdot>
		</view>
		<stzhangTab @changed="changed"></stzhangTab>
		<!-- //轮播图按钮 --> 
		
		<!-- 分类按钮 -->
		<!-- <view class="classifyAll">
			<view class="classify" v-for="(item,index) in classify" :key="index" @click="toJoinClassify(index,item.id)">
				<image :src="imageUrl + item.imageUrl" mode=""></image>
			</view>
		</view> -->
		<!-- 项目推荐 -->
		<view class="tj_projectList">
			<view class="tj_title">
				<view class="tj_title-L">供应商推荐</view>
				
			</view>
			<view class="project_cell" v-for="(item,index) in recommendation" :key="index" @click="toJoinInvestmentDetails(index,item.id)">
				<view class="cell_top">
					<image :src="item.logo" mode=""></image>
					<view class="cell_top_bottom">
						<view class="">{{item.brands}}</view>

					</view>
				</view>
				<view class="cell_bottom">
					<view class="_left">
						<view class="_name">
							<text><text class="tese">加盟特色:</text><text></text><text class="times">品牌年龄{{item.storeage}}年</text></text>
						</view>
						<view class="_name">
							<text><text class="tese">加盟费:</text><text></text><text class="times2">{{item.initialfee}}元</text></text>
						</view>
					</view>
					<view class="_lineCss">
						地址{{item.cityvalue}}
					</view>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import getLocation from '@/common/getLocation.js'; //获取地理位置
	import stzhangTab from '@/components/stzhang-tab/stzhang-tab.vue'
	import Swiperdot from '@/components/swipers/uni-swiper-dot.vue';
export default {
	components:{
		Swiperdot,
			stzhangTab:stzhangTab
		},
	data() {
		return {
			 current: 0,
			mode: 'long',
			activeIndex:0,
			swipers:[],
			SwiperColor:[
				{
					Color:"balltas"
				},
				{
					Color:"balltas"
				},
				{
					Color:"balltas"
				},
				{
					Color:"balltas"
				}
			],
			SwiperButton:[],
			activecolor:"#fdbd37",
			indicatorColor:"rgba(238, 238,238, 1)",
			 indicatorDots: true,
            autoplay: true,
            interval: 2000,
            duration: 500,
			imageUrl:shoppublic.getImageUrl(),//图片API
			token:shoppublic.gettoken(),
			classify: [{
				imageUrl:'/images/project_Join_1.png',
				id:0
			}, {
				imageUrl:'/images/project_Join_2.png',
				id:3
			}, {
				imageUrl:'/images/project_Join_3.png',
				id:4
			}, {
				imageUrl:'/images/project_Join_4.png',
				id:14
			}],
			bannerList:[],//banner列表
			recommendation:[] //推荐项目列表
		};
	},
	onLoad() {
		let _this = this;
		_this.getBannerList();
		_this.getRecommendation();
		
	},
	mounted() {
		
	},
	
	methods:{
		 change(e) {
		    this.current = e.detail.current;
		},
		getDeals(type){
			var _this=this
				uni.request({
				url: shoppublic.getUrl() + "/projectJoin/findProjectJoinList",
				data:{
					updatetime: '',
					city: 610100,
					county: '',
					user_id: '',
					mininitialfee: '',
					maxinitialfee: '',
					type:type
				},
				success: (res) => {
					console.log(res.data.responseBody);
					_this.recommendation = res.data.responseBody;
				}
			})
		},
		//导航数据获取
		changed(index){
				var _this=this
		if(index==1){
			_this.getDeals(0)
// 			uni.navigateTo({
// 				url:'./joinInvestmentClassify/joinInvestmentClassify?key=' + index + '&id=' + 3
// 			})
		}else if(index==0){
			uni.request({
				url: shoppublic.getUrl() + "/projectJoin/indexProjectJoin",
				data:{
					user_id: 6239
				},
				success: res => {
					console.log(res);
					_this.recommendation = res.data.responseBody;
					// console.log(JSON.stringify(res));
					// _this.bannerList = res.data.responseBody;
				}
			});
		}else if(index==2){
				_this.getDeals(3)
		}else if(index==3){
				_this.getDeals(4)
		}else if(index==4){
				_this.getDeals(14)
		}
		},
		//轮播图按钮切换
		ChangeSwiper(index){
			var index=index.detail.current
			
			this.activeIndex=index;
		},
		// 获取项目推荐列表
		getRecommendation(){
			let _this = this;
			console.log(_this.token);
			// 获取用户信息
// 			uni.login({
// 				provider: 'weixin',
// 				success: function (loginRes) {
// 					// 获取用户信息
// 					uni.getUserInfo({
// 						provider: 'weixin',
// 						success: function (infoRes) {
// 							console.log('用户id为：' + infoRes.userInfo.openId);
// 							_this.token = infoRes.userInfo.openId;
// 						}
// 					});
// 				}
// 			});
			uni.request({
				url: shoppublic.getUrl() + "/projectJoin/indexProjectJoin",
				data:{
					user_id: 6239
				},
				success: res => {
					console.log(res);
					_this.recommendation = res.data.responseBody;
					// console.log(JSON.stringify(res));
					// _this.bannerList = res.data.responseBody;
				}
			});
		},
		// 跳转分类
		toJoinClassify(index,id){
			uni.navigateTo({
				url:'./joinInvestmentClassify/joinInvestmentClassify?key=' + index + '&id=' + id
			})
		},
		// 跳转招商
		toPublishJoin(){
			uni.navigateTo({
				url:'./publishJoin/publishJoin'
			})
		},
		// 跳转项目详情
		toJoinInvestmentDetails(index,id){
			uni.navigateTo({
				url:'./joinInvestmentDetails/joinInvestmentDetails?key=' + index + '&id=' + id
			})
		},
		// 轮播图获取
		getBannerList() {
			let _this = this;
			uni.request({
				url: shoppublic.getUrl() + '/search/getBannerList',
				success: res => {
					_this.bannerList = res.data.responseBody.slice(0,4);
				}
			});
		},
	}
};
</script>

<style lang="scss">
	.balltas.active{
		width: 60upx;
		height: 20upx;
		background-color:#ffbd38;
		border-radius:20upx;
		 float: left;
		 margin-right: 20upx;
	}

@import './joinInvestment.scss';
</style>
