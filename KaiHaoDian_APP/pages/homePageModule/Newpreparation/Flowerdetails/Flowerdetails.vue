<template>
	<view class="content">
			<Swiperdot :info="swiperList" :current="current" field="content" :mode="mode">
				<swiper class="swiper-box" @change="change" :autoplay="true" :duration="1000" :circular="true">
		        <swiper-item v-for="(item,index) in swiperList" :key='index'>
		            <view class="swiper-item">
		                <img :src="imageUrl + item.url" alt="">
		            </view>
		        </swiper-item>
		    </swiper>
		</Swiperdot>
		<!-- //介绍/ -->
		<view class="content">
			<view class="contenttitle">
				
				<view class="">
					<view class="name">MELSSA</view>
					<view class="conents">弹弹堂,弹弹堂官方网站-无需下载的Q版射击竞技游戏...-4399网页游戏</view>
				</view>
				<view class="price">
					<view class="">
						¥<text class="Nowprice">98.00</text><text class="pastprice">198</text>
					</view>
					<view class="btns">
						<button type="primary" class="btn" @click="purchase">立即抢购</button>
					</view>
				</view>
			</view>
			<!-- 套餐 -->
			<view class="setmeal">
				<view class="subsetmeal" v-for="(item,idx) in combo" :key='idx'>
					<view class="title">
						<text class="lins"></text>{{item.title1}}
					</view>
					<view class="introduce">
						<view class="introduced">
							{{item.title2}}
						</view>
							<Swiperdot :info="swiperList" :current="current" field="content" :mode="mode">
								<swiper class="swiper-box" @change="change" :duration="1000" :circular="true">
						        <swiper-item v-for="(items,idxw) in item.imglist" :key='idxw'>
						            <view class="swiper-item">
						                <img :src="items.url" alt="">
						            </view>
						        </swiper-item>
						    </swiper>
						</Swiperdot>
					</view>
				</view>
			</view>
		</view>
		<view class="bottomBox">
			<view class="chat"><text  class="iconfont">&#xe620;</text>发消息</view>
			<view @touchend="PlayPhone"><text  class="iconfont">&#xe622;</text>电话联系</view>
		</view>
		
		<!-- 底部弹窗 -->
		<view class="massage" v-if="tost" @click="layer">
			
			<view class="tost">
				<view class="chosseBox">
					<view class="lins"></view>
					<view class="chose">请选择你的套餐</view>
				</view>
				<tost :labelList='labelList' @chengd='chengd'></tost>
			</view>
			
		</view>
	</view>
	
</template>

<script>
	import tost from '@/components/wl-radio.vue'
	var imageUrl = shoppublic.getImageUrl();
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import Swiperdot from '@/components/swipers/uni-swiper-dot.vue';
	export default {
			components:{
			Swiperdot,
			tost
		},
			data() {
			return {
				tost:false,
					labelList:[
				{
					name:'玫瑰套餐A',
					checked:false
				},
				{
					checked:false,
					name:'玫瑰套餐B'
				},
				{
					name:'玫瑰套餐C',
					checked:false
				}
			],
				combo:[
					{
						title1:"玫瑰套餐一",
						title2:'19朵大红色玫瑰,搭配尤加利叶和满天星',
						imglist:[
							{
								url:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2445468140,2491956848&fm=27&gp=0.jpg'
							},
							{
								url:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2735633715,2749454924&fm=27&gp=0.jpg'
							},
							{
								url:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4060543606,3642835235&fm=27&gp=0.jpg'
							}
						]
					},
						{
						title1:"玫瑰套餐二",
						title2:'19朵大红色玫瑰,搭配尤加利叶和满天星',
						imglist:[
							{
								url:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1047242243,1517477585&fm=58'
							},
							{
								url:'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2442351418,3200634334&fm=58'
							},
							{
								url:'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=3631857086,3970668987&fm=58'
							}
						]
					},
						{
						title1:"玫瑰套餐三",
						title2:'19朵大红色玫瑰,搭配尤加利叶和满天星',
						imglist:[
							{
								url:'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1977853033,770167096&fm=58'
							},
							{
								url:'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2099095987,1413833515&fm=58'
							},
							{
								url:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4060543606,3642835235&fm=27&gp=0.jpg'
							}
						]
					},
				],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				imageUrl:imageUrl,
				TabCur:0,
				current: 0,
				mode: 'long',
				
					swiperList:[//轮播图列表
					{
						url:'/images/Ban_zhaoshang2.jpeg'
					},
					{
						url:'/images/Ban_zhaoshang1.jpeg'
					},
					{
						url:'/images/Bro-gsb.jpg'
					},
				],
			};
		},
		methods:{
			layer(){
				this.tost=false
			},
			//立即抢购
			purchase(){
				this.tost=true
			},
			// 底部弹窗
		chengd(name,idx){
			console.log(name,idx)
			setTimeout(()=>{
				uni.navigateTo({
					url:'flowerdetailsOrd/flowerdetailsOrd?id='+1
				})
			},200)
		},
			//打电话
				  PlayPhone(userid){
								var that=this
								 event.preventDefault();
								
								  uni.showActionSheet({
								    itemList: ['176-1120-5736', '呼叫'],
								    success: function (res) {
								    	if(res.tapIndex==1){
								    		uni.makePhoneCall({
								    		phoneNumber:17611205736//仅为示例
								    		});
								    	}			 
								    						
										}
									 })
							},
			 change(e) {
			    this.current = e.detail.current;
			}
		}
	}
</script>

<style lang="scss">
@import 'Flowerdetails.scss'
</style>
