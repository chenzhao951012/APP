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
<!-- 选项卡 -->
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
		<!-- 供应商渠道 -->
		<view class="section">
			<view><img src="../../../static/sectionLeft.jpg" alt=""></view>
			<view><img src="../../../static/sectionRight.jpg" alt=""></view>
		</view>
		<!-- 商城消息 -->
		<view class="MallnewsConnent">
			<view class="MallnewsConnent">
				<view><text class="iconfont">&#xe693;</text></view>
				<view>
					 <swiper class="swiper"  circular='true' vertical='true' :autoplay="autoplay" :interval="interval" :duration="duration">
                        <swiper-item v-for="(item,index) in News" :key='index'> 
                            <view class="news">{{item}}</view>
                        </swiper-item>
                    
                    </swiper>
				</view>
			</view>
		</view>
		<!-- //供应商推荐 -->
		<view class="recommend">
			<view class="recommend-top">
				<view>供应商推荐</view>
				<view  class="iconfont">更多推荐 &#xe616;</view>
			</view>
			<view class="recommend-body">
				<view class="title">
					<text>所有花材新鲜,配送地直达</text>
				</view>
				<view class="connent">
					<view class="subconnent">
						<view class="aderss">
							<view class="aderss-top"><text class="iconfont">&#xe6ed;</text></view>
							<view class="aderss-body">
								<view>Iconfont-阿里巴巴矢量图标库Iconfont-阿里巴巴矢量图标库</view>
								<view class="Pageview">
									<text  class="iconfont iconfont2">&#xe692; 50</text>
								
									<text  class="iconfont iconfont3">&#xe655; 12</text>
								</view>
							</view>
							<view class="fitment">
								<view>店铺装修</view>
							</view>
						</view>
					</view>
					<view class="ImgBox">
						<img src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2259376396,2250852130&fm=27&gp=0.jpg" alt="">
					</view>
				</view>
			</view>
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
			News:['谁是傻子','他','她'],
            indicatorDots: true,
            autoplay: true,
            interval: 2000,
            duration: 500,
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
                    { name: '首页' },
                    { name: '店铺装修' },
                    { name: '绿植花卉' },
                    { name: '桌椅货架' },
                    { name: '图文印刷' },
                    { name: '财税商标' },
                    { name: '厨房设备' },
                    { name: '营销庆典' },
					{ name: '工服定制' },
					{ name: '绿植花卉' }
                ],
			TabCur:0,
            current: 0,
            mode: 'long',
		
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