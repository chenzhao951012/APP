<template>
	<view class="content">
			<Swiperdot :info="swiperList" :current="current" field="content" :mode="mode">
				<swiper class="swiper-box" @change="change" :autoplay="true" :duration="1000" :circular="true">
		        <swiper-item v-for="(item,idx) in swiperList" :key='idx'>
		            <view class="swiper-item">
		                <img :src="imageUrl + item.url" alt="">
		            </view>
		        </swiper-item>
		    </swiper>
		</Swiperdot>
	</view>
</template>

<script>
	var imageUrl = shoppublic.getImageUrl();
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import Swiperdot from '@/components/swipers/uni-swiper-dot.vue';
	export default {
			components:{
			Swiperdot,
			
		},
		data() {
			return {
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
			 change(e) {
			    this.current = e.detail.current;
			}
		}
	}
</script>

<style lang="scss">
@import 'Flowerdetails.scss'
</style>
