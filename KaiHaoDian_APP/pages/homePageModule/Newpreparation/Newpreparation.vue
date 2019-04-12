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
	<view class="tabConter">
				<tabControl 
					:tab-list="tabList"
			        :tabCur.sync="TabCur"
			        :tab-style="CustomBar"
			        tab-class="text-center bg-white "
			        select-class="text-green"
			        @chags="tabChange">
			</tabControl>
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import Swiperdot from '@/components/swipers/uni-swiper-dot.vue';
	var imageUrl = shoppublic.getImageUrl();
	import	tabControl from '@/components/tabControl/wuc-tab.vue'
	 import { obj2style } from '@/components/tabControl/wuc-tab.js';
export default {
	components:{
		Swiperdot,
		tabControl
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
      
			  tabList: [
                    { name: '选项卡一' },
                    { name: '选项卡二' },
                    { name: '选项卡三' },
                    { name: '选项卡四' },
                    { name: '选项卡五' },
                    { name: '选项卡六' },
                    { name: '选项卡七' },
                    { name: '选项卡八' }
                ],
				TabCur:0,
            current: 0,
            mode: 'long',
			autoplay: true,
        }
    },
	   computed: {
            CustomBar() {
                let style = {};
                const systemInfo = uni.getSystemInfoSync();
                let CustomBar =
                    systemInfo.platform === 'android'
                        ? systemInfo.statusBarHeight + 50
                        : systemInfo.statusBarHeight + 45;
                style['top'] = CustomBar + 'px';
                return obj2style(style);
            }
        },
    methods: {
        change(e) {
            this.current = e.detail.current;
        },
		  tabChange(index) {
			  console.log(index)
                this.TabCur = index;
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