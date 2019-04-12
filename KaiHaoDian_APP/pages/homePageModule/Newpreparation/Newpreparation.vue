<template>
	<view class="content">
		<Swiperdot :info="info" :current="current" field="content" :mode="mode">
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
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import Swiperdot from '@/components/swipers/uni-swiper-dot.vue'
	var imageUrl = shoppublic.getImageUrl();
export default {
	components:{
		Swiperdot
	},
    data() {
        return {
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
			imageUrl:imageUrl,
            info: [
				{
                content: '内容 A'
				}, 
				{
                content: '内容 B'
				}, 
				{
                content: '内容 C'
				},
			
			],
            current: 0,
            mode: 'long',
			autoplay: true,
        }
    },
    methods: {
        change(e) {
            this.current = e.detail.current;
        },
		// 轮播图获取
    }
}
</script>

<style lang="scss">
	.swiper-box{
		height: 320upx;
	}
@import 'Newpreparation.scss'
</style>
