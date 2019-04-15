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
		<view class="section" v-if="isShow">
			<view @click="Supplychannels(1)"><img src="../../../static/sectionLeft.jpg" alt=""></view>
			<view @click="Supplychannels(2)"><img src="../../../static/sectionRight.jpg" alt=""></view>
		</view>
		<!-- 商城消息 -->
		<view class="MallnewsConnent" v-if="isShow">
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
		<view class="recommend" v-if="isShow">
			<view class="recommend-top">
				<view>供应商推荐</view>
				<view  class="iconfont">更多推荐 &#xe616;</view>
			</view>
			<view class="recommend-body" v-for="(item,idx) in SupplierInforList" :key='idx' @click="SupplyChannels(item.id)">
				<view class="title">
					<text>{{item.mainbusiness}}</text>
				</view>
				<view class="connent">
					<view class="subconnent">
						<view class="aderss">
							<view class="aderss-top"><text class="iconfont">&#xe6ed;</text></view>
							<view class="aderss-body">
								<view>{{item.companyarea}}{{item.companyaddress}}</view>
								<view class="Pageview">
									<text  class="iconfont iconfont2">&#xe692; {{item.casessize}}</text>
								
									<text  class="iconfont iconfont3">&#xe655; {{item.commentSize}}</text>
								</view>
							</view>
							<view class="fitment">
								<view>{{item.industrytypevalue}}</view>
							</view>
						</view>
					</view>
					<view class="ImgBox">
						<img :src="imageUrl + item.slogo" alt="">
					</view>
				</view>
			</view>
		</view>
		<view class="recommend recommend2">
			<img src="../../../static/ComentImg.jpg" alt="" class='NoInfo' v-if='ImgInfor'>
			<view class="recommend-body" v-for="(item,idx) in companyList" :key='idx' @click="SupplyChannels(item.id)">
				<view class="title">
					<text>{{item.mainbusiness}}</text>
				</view>
				<view class="connent">
					<view class="subconnent">
						<view class="aderss">
							<view class="aderss-top"><text class="iconfont">&#xe6ed;</text></view>
							<view class="aderss-body">
								<view>{{item.companyarea}}{{item.companyaddress}}</view>
								<view class="Pageview">
									<text  class="iconfont iconfont2">&#xe692; {{item.casessize}}</text>
								
									<text  class="iconfont iconfont3">&#xe655; {{item.commentSize}}</text>
								</view>
							</view>
							<view class="fitment">
								<view>{{item.industrytypevalue}}</view>
							</view>
						</view>
					</view>
					<view class="ImgBox">
						<img :src="item.slogo" alt="">
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
	 var getLocation = require('../../../common/getLocation.js');
export default {
	components:{
		Swiperdot,
		tabControl
	},
    data() {
        return {
			Supplychannels2:"餐饮渠道供应商",
			Supplychannels1:"零售渠道供应商",
			ImgInfor:false,
			type:0,
			isShow:true,
			companyList:[],
			SupplierInforList:[],
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
                    { name: '首页',id:0},
                    { name: '店铺装修',id:1},
                    { name: '绿植花卉',id:2 },
                    { name: '桌椅货架',id:3 },
                    { name: '图文印刷',id:4 },
                    { name: '财税商标',id:5 },
                    { name: '厨房设备',id:6 },
                    { name: '营销庆典',id:7 },
					{ name: '工服定制',id:8 }
					
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
		onLoad() {
			this.getSupplierInfor();
		},
    methods: {
		// 去详情
		SupplyChannels(id){
			uni.navigateTo({
				url:'./SupplyDetails/SupplyDetails?id=' + id
			});
		},
		//去供应商
		Supplychannels(index){
			if(index==1){	
			uni.navigateTo({
				url: 'SupplyChannels/SupplyChannels?name='+this.Supplychannels1+'&index='+index
			})
			}else if(index==2){
				uni.navigateTo({
					url: 'SupplyChannels/SupplyChannels?name='+this.Supplychannels2 +'&index='+index
				})
			}
		},
        change(e) {
            this.current = e.detail.current;
        },
		  tabChange(index){
			  var that=this
                that.TabCur = index;
				if(index==0){
					that.isShow=true
					that.type=0
					 that.ImgInfor=false
				}else{
					that.isShow=false
				}
				if(index==1){
					that.type=1
				}else if(index==2){
					that.type=5
				}else if(index==3){
					that.type=2
				}else if(index==4){
					that.type=6
				}else if(index==5){
					that.type=7
				}else if(index==6){
					that.type=4
				}else if(index==7){
					that.type=8
				}else if(index==8){
					that.type=9
				}
				this.getSheBeiByType(that.type)
            },
		// 信息获取
		  getSupplierInfor:function(e){
			var _this = this;
			uni.request({
			  url: shoppublic.getUrl()+'/companySupplier/recommendNewShopRent',
			  data:{},
			  success:function(res){
				console.info('res',res)
				 _this.SupplierInforList=res.data.responseBody
				
			  },
			  fail: function (res) { }
			})
		  },
			 getSheBeiByType(typeNum) {
				var _this = this;
				wx.request({
				  url: shoppublic.getUrl() + '/companySupplier/findListCompanySupplier',
				  data: {
					// stype: text,
					sindustry: typeNum
				  },
				  success: function (res) {
				console.log(res)
					  _this.companyList=res.data.responseBody
					  if(_this.type==0){
						   _this.ImgInfor=false
					  }else{
						    if(res.data.msgCode=='2'){
						  			 _this.ImgInfor=true
						  }else{
						  			_this.ImgInfor=false
						  }
					  }
					
					  // isHaveCompanyList:true
					
// 					if (_this.data.companyList) {
// 					  _this.setData({
// 						isHaveCompanyList: true
// 
// 					  })
// 					}
// 					else {
// 					  _this.setData({
// 						isHaveCompanyList: false
// 
// 					  })
// 					}
					//console.log(_this.data.isHaveCompanyList);
				  },
				  fail: function (res) {
				  }
				});

			  }
    }
}
</script>

<style lang="scss">
	.swiper-box{
		height: 320upx;
	}

    
@import 'Newpreparation.scss'
</style>