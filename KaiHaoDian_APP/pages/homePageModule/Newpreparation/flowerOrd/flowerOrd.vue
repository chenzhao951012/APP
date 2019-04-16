<template>
	<view class="content">
		<Swiperdot :info="swiperList" :current="current" field="content" :mode="mode" :bottom="60">
				<swiper class="swiper-box" @change="change" :autoplay="true" :duration="1000" :circular="true">
		        <swiper-item v-for="(item,idx) in swiperList" :key='idx'>
		            <view class="swiper-item">
		                <img :src="imageUrl + item.url" alt="">
		            </view>
		        </swiper-item>
		    </swiper>
		</Swiperdot>
		<view class="Storeinformations">
			<view class="Storeinformation">
				<view class="Storeinformation-top">
					<view>本店所有鲜花免费配送,节假日当天9折优惠,团购优惠任你选</view>
					<view class="userInfo">
						<view class="SupplyBox-header">
							<view class="header-left">
								<img src="https://wx.qlogo.cn/mmopen/vi_32/L40wIVzbdwpSW1jFIEEqYQCeZG34gyU4OgEic0A35JKgW5ic7ANxKXL265ibAayArO0xooWqEwdvwhTMkf2fia9pqg/132" alt="">
							</view>
							<view class="header-right">
								<view class="subLeft">
									<view class="top">
										嘿哈嘿哈嘿哈
										<text  class="iconfont">&#xe61c;</text>
										<text  class="iconfont iconfont2">&#xe6bc;</text>
									</view>
									<view class="bottom">
										<view class="">
											<text class="iconfont aderss">&#xe694;</text>
										</view>
										<view class="">
											<text>陕西省西安市雁塔区群贤道28号陕西省西安市雁塔区群贤道</text>
										</view>
										
									</view>
								</view>
								<view  class="subright">
									
									<view class="collect">
										<text class="iconfont">&#xe6ea;</text>
									</view>
								</view>
							</view>
						</view>
						<view class="grade">
							<view class="grade-Left">
								<rate value="5" disabled="true" margin='5' size='18'></rate><text>5分</text>
							</view>
							<view class="grade-Right">
								早上9:00<text class="iconfont">&#xe689;</text>晚上9:00
							</view>
							
						</view>
						
					</view>
				</view>
				<!-- //商品展示 -->
				<view class="flowerList">
					<view class="flowerListInfo">
						<view class="Img">
							<img src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2768688045,3972097862&fm=58" alt="">
						</view>
						<view class="info">
							<view class="title">
								可自定义评分星星图标的大小、间隔、评分数
							</view>
							<view class="price">
								<view class="price-top">
									<text class="money"><text>¥</text>98.00</text>
									<text class="linsMoney">198</text>
								</view>
								<view class="price-bottom">
									<view>全城配送</view>
									<view>花材新鲜</view>
								</view>
							</view>
						</view>
					</view>
				<view class="flowerListInfo">
						<view class="Img">
							<img src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2768688045,3972097862&fm=58" alt="">
						</view>
						<view class="info">
							<view class="title">
								可自定义评分星星图标的大小、间隔、评分数
							</view>
							<view class="price">
								<view class="price-top">
									<text class="money"><text>¥</text>98.00</text>
									<text class="linsMoney">198</text>
								</view>
								<view class="price-bottom">
									<view>全城配送</view>
									<view>花材新鲜</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="commodity">
					查看所有商品<text class="iconfont">&#xe612;</text>
				</view>
			</view>
			<view class="Commentlines">
				
			</view>
			<view class="CommentBox2">
				<view class="CommentBox">
					<view class="top">
						<view>用户评价(50)</view>
						<view>查看所有评论></view>
					</view>
					<view class="body">
						<view>服务热情(20)</view>
						<view>包装精美(20)</view>
						<view>性价比高(20)</view>
						<view>好看(20)</view>
						<view>花材新鲜(20)</view>
						<view>配送及时(20)</view>
					</view>
					<view class="bottom">
						<view class="bottomconnent">
							<view class="imgBox">
								<img src="https://wx.qlogo.cn/mmopen/vi_32/L40wIVzbdwpSW1jFIEEqYQCeZG34gyU4OgEic0A35JKgW5ic7ANxKXL265ibAayArO0xooWqEwdvwhTMkf2fia9pqg/132" alt="">
							</view>
							<view class="connent">
								<view class="name">李柠<text>·</text>副总</view>
								<view class="data">
									<view>2月14日</view>
									<view><text class="grades">打分</text><rate value="5" disabled="true" margin='5' size='18'></rate></view>
								</view>
								<view class="contentBox">
									<view class="contenttitle">
										陕西省西安市雁塔区群贤道28号陕西省西安市雁塔区群贤道
									</view>
								</view>
								<view class="contentImgBox">
									<img :src="item.url" alt="" v-for='(item,idx) in imgLsit' :key='idx'>
								</view>
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class="bottomconnent">
							<view class="imgBox">
								<img src="https://wx.qlogo.cn/mmopen/vi_32/L40wIVzbdwpSW1jFIEEqYQCeZG34gyU4OgEic0A35JKgW5ic7ANxKXL265ibAayArO0xooWqEwdvwhTMkf2fia9pqg/132" alt="">
							</view>
							<view class="connent">
								<view class="name">李柠<text>·</text>副总</view>
								<view class="data">
									<view>2月14日</view>
									<view><text class="grades">打分</text><rate value="5" disabled="true" margin='5' size='18'></rate></view>
								</view>
								<view class="contentBox">
									<view class="contenttitle">
										陕西省西安市雁塔区群贤道28号陕西省西安市雁塔区群贤道
									</view>
								</view>
								<view class="contentImgBox">
									<img :src="item.url" alt="" v-for='(item,idx) in imgLsit' :key='idx'>
								</view>
							</view>
						</view>
					</view>
				</view>
				
			</view>
			<view class="Commentlines">
				
			</view>
				<view class="recommend" v-if="isShow">
				<view class="recommend-top">
					<view>周边推荐</view>
					
				</view>
				<view class="recommend-body" v-for="(item,idx) in SupplierInforList" :key='idx' @click="Flowerdetails(item.id)">
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
		</view>
		<!-- //底部导航 -->
		<view class="bottomBox">
			<view class="chat"><text  class="iconfont">&#xe620;</text>发消息</view>
			<view @touchend="PlayPhone"><text  class="iconfont">&#xe622;</text>电话联系</view>
		</view>
	</view>
</template>

<script>
	var imageUrl = shoppublic.getImageUrl();
	
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import Swiperdot from '@/components/swipers/uni-swiper-dot.vue';
	 import { obj2style } from '@/components/tabControl/wuc-tab.js';
	 import rate from '@/components/rate/uni-rate.vue'
	export default {
		data() {
			return {
				isShow:true,
				SupplierInforList:[],
				imgLsit:[
					{
						'url':'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2735633715,2749454924&fm=27&gp=0.jpg'
					},
					{
						'url':'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2445468140,2491956848&fm=27&gp=0.jpg'
					},
					{
						'url':'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=4286383241,1703605117&fm=27&gp=0.jpg'
					}
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
		components:{
			Swiperdot,
			rate
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
				uni.setNavigationBarTitle({
				title: '嘿哈'
			});
			this.getSupplierInfor()
		},
		methods:{
			//去往详情
			Flowerdetails(id){
				uni.navigateTo({
					url:'../Flowerdetails/Flowerdetails?id='+id
				})
			},
			//拨打电话
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
			//推荐
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
			  change(e) {
			    this.current = e.detail.current;
			}
		}
	}
</script>

<style lang="scss">

@import 'flowersOrd.scss'
</style>
