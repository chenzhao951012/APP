<template>
	<view class="content">
		<!-- 发布按钮 -->
		<view class="_release_button_right" @click="toPartnershipStoreRelease">发布</view>
		<!-- 顶部选项卡 -->
		<view class="top_tab">
			<view class="_tab" @click="tabsChanges(0)">
				<view :class="{_activeColor:tabsState === 0 ? '_activeColor' : ''}">综合
				<text :class="totops"></text>
				</view>
			
			</view>
			<view class="_tab" @click="tabsChanges(1)">
				<view :class="{_activeColor:tabsState === 1 ? '_activeColor' : ''}">地址
				<text :class="totop2"></text>
				</view>
				
			</view>
			<view class="_tab" @click="tabsChanges(2)">
				<view :class="{_activeColor:tabsState === 2 ? '_activeColor' : ''}">岗位
				<text :class="totop3" style="left: 130upx;"></text>
				</view>
				
			</view>
			<view class="_tab" @click="tabsChanges(3)">
				<view :class="{_activeColor:tabsState === 3 ? '_activeColor' : ''}">行业
				<text :class="totop4"></text>
				</view>
				
			</view>
		</view>
		<!-- 选项卡遮罩 -->
		<view class="topMask" v-if="tabsMaskState === 'true'">
			<view class="_top">
				<swiper class="_swiper" :current="swiperIndex" @change="swiperChangs">
					<swiper-item class="_swiper_item" >
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in synthesize" :key="index" @click="clickScrollCell">{{item.value}}<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in cityList" :key="index" @click="selenav(item.id,index)">{{item.name}}<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in technology" :key="index" @click="postString(item.id,index)">{{item.value}}<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
						<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in paixu" :key="index" @click="xiangmubind(item.id,index)">{{item.value}}<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
			<view class="_mask" @click="closeTabsMask"></view>
		</view>
		<!-- #end -->
		<!-- 列表 -->
		 
		<view class="partner_List" @click="toPartnerOpenStoreDateils(item.id,item.readnum)" v-for="(item,idx) in partnerList" :key="idx">
			<view class="sectionBody">
				<view class="sectionBodt">
					{{item.title}}
				</view>
				<view class="sectionBodyBox">
					<view class="imageBox">
						<image :src="item.src" mode="" class="images"></image>
					</view>
					<view class="Coment">
						<view class="title">
							{{item.description}}
						</view>
						<view class="time">
							<text class="times1">{{item.addtime}}</text><text class="iconfont iconfonts">&#xe64c;</text><text class="times2">{{item.readnum}}</text>
						</view>
					</view>
					<view class="type">{{item.typevalue}}</view>
				</view>
			</view>
			</view>
			 <view style="text-align:center;margin:30rpx 0; font-size: 14upx; color: #000;font-weight: 600;">{{no}}</view>
		<!-- #end -->
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic'; //服务器地址
		var mta = require('../../../common/mta_analysis.js');
	// var app = getApp()
		var getLocation = require('../../../common/getLocation.js');
		var app = getApp();
		var appLocation = app.globalData.location;
	
		var imageUrl = shoppublic.getImageUrl();
		var imageUrl1 = shoppublic.getUpImgUrl();
		var index;
export default {
	
	data() {
		return {
			countyIds:"",
			countryid:"",
			xiangmuType:"",
			xiangmuId:"",
			no: "加载更多......",
			partnerList:[],
			activeIndex:0,
			typeid:"",
				 paixu: [
							 { id: "", value: "不限" },   
      
						  { id: "0", value: "餐饮美食" },
						  { id: "1", value: "美容保健" },
						  { id: "2", value: "服饰鞋包" },
						  { id: "3", value: "休闲娱乐" },
						  { id: "4", value: "百货超市" },
						  { id: "5", value: "生活服务" },
						  { id: "6", value: "电器通讯" },
						  { id: "7", value: "汽修服务" },
						  { id: "8", value: "医疗器械" },
						  { id: "9", value: "家居建材" },
						  
						  { id: "11", value: "酒店宾馆" },
						  { id: "12", value: "农业环保" },
						  { id: "14", value: "网络服务" },
						  { id: "10", value: "教育" },
						  { id: "13", value: "母婴" },
						  { id: "15", value: "其他" },
						],				
			technology:[
							{
								id: "0",
								value: "综合"
							},
							{
								id: "1",
								value: "技术"
							},
							{
								id: "2",
								value: "策划"
							},
							{
								id: "3",
								value: "管理"
							},
							{
								id: "4",
								value: "运营"
							},
							{
								id: "5",
								value: "营销"
							},
								{
								id: "6",
								value: "投资"
							}
							
						],
						cityList:[],
						index:7,
						location_cityId:"",
						totop2:"tobott",
						totop3:"tobott",
						totop4:"tobott",
						totop5:"tobott",
						totops:"totop",
						location_city:'',//地址选择  
						tabsState:'',//选项卡状态
						tabsMaskState:'',//选项卡遮罩显示隐藏
						swiperIndex:'',
						pagesize: 10,
							synthesize:[
							{
								id: "0",
								value: "综合"
							},
							{
								id: "1",
								value: "信用"
							},
							{
								id: "2",
								value: "最新发布"
							}
			],
		};
	},
	onReachBottom() {
		this.getPartnerList('onReach');
	},
	onLoad() {
		
		let _this = this;
		
			uni.getStorage({
			key: 'location',
			success: res => {
				console.log('getStorage', JSON.stringify(res));
				_this.location = {
					province_id: res.data.province_id,
					province_name: res.data.province_name,
					city_id: res.data.city_id,
					city_name: res.data.city_name
				};
				_this.countryid = res.data.city_id;
				// console.info('_location_city',_this.location_city);
			},
			fail: res => {
				if (
					(_this.location.province_name ||
						_this.location.province_id ||
						_this.location.city_name ||
						_this.location.city_id) == ''
				) {
					getLocation.getLocation(function(res_p, res_c) {
						// _this.setLocation(res_p, res_c);
						// console.log('省', JSON.stringify(res_p));
						// console.log('市', JSON.stringify(res_c));
						_this.countryid=res_c[0].id
					});
				}
			}
		});
				
				setTimeout(()=>{
					 _this.getAderss(610100)
					  _this.getPartnerList(610100)
					 	
				},500)
	
		},
		
	
	methods: {	
			//区域排序
		
			  selenav(id,index) {
				let that = this;
				
				  that.countyIds=id,
				that.getPartnerList(that.countyIds);
				 that.activeIndex=index;
			  },
		// 岗位排序
		  postString(id,index) {
				let that = this;
				  that.typeid=id
				   // this.activeIndex=index;
				that.getPartnerList();
			  },
		//行业
		 xiangmubind(id,index) {
			 this.activeIndex=index;
				let that = this;
				  // that.xiangmuId=id
				that.getPartnerList();
			  },
		//地址请求
					getAderss(id){
						var that=this
						   uni.request({
					  url: shoppublic.getUrl() + '/common/findRegionListByPid',
					  data: {
						id: id
					  },
					  header: {
						'content-type': 'application/json' // 默认值
					  },
					  success: function(res) {
					
						console.log(res.data.responseBody);
						var county = res.data.responseBody;
						var aa = {
						  name: "全部",
						  pid: "id",
						  id: ''
						};
						if (county != null) {
						
						  county.unshift(aa);
						}
						//county.reverse();
						//county.push(aa);
						//county.reverse();
					   
						  that.cityList=county
					   
					  },
					  fail: function(res) {
					
					  }
					})
					},
		   tabsChanges(index) {
						    var that = this;
						   if(index==0){
							   that.totops="totop"
						   }else{
							   that.totops="tobott"
						   }
						    if(index==1){
								that.totop2="totop"
						   }else{
								that.totop2="tobott"
						   }
						    if(index==2){
						   		that.totop3="totop"
						   }else{
						   		that.totop3="tobott"
						   }
						    if(index==3){
						   		that.totop4="totop"
						   }else{
						   		that.totop4="tobott"
						   }
						    
						   
								that.tabsState = index;
							 that.swiperIndex = index;
							 that.tabsMaskState = 'true';
						  },
		
			// 获取合伙人列表
			getPartnerList(page = '0') {
			var _this = this;
			var oldPartnerList = _this.partnerList;
			if(page === 'onReach'){
				uni.request({
					url: shoppublic.getUrl() + "/partnershipShop/findPartnershipShopList",
					data:{
						index:_this.index,
						city:610100,
						county:_this.countyIds,
						partner:_this.typeid,
						type:_this.xiangmuId
					},
					success: (res) => {
						console.log(res);
						if(page === 'onReach' && res.data.responseBody){
							oldPartnerList = oldPartnerList.concat(res.data.responseBody);
							_this.index += 7;
						}else{
							return false;
							
							// oldPartnerList = res.data.responseBody;
						}
						_this.partnerList = oldPartnerList;
					}
				})
			}else{
				uni.request({
					url: shoppublic.getUrl() + "/partnershipShop/findPartnershipShopList",
					data:{
						index:_this.pagesize,
						city:610100,
						county:_this.countyIds,
						partner:_this.typeid,
						type:_this.xiangmuId
					},
					success: (res) => {
						console.log(_this.countryid,_this.countyIds,_this.typeid,_this.xiangmuId)
						console.log(res)
						_this.partnerList = res.data.responseBody;
						if(_this.partnerList==null){
							_this.no="没有更多了"
						}
						
					}
				})
			}
		},
		// 区域/费用选择器按钮点击事件
		clickScrollCell(e){
			this.closeTabsMask();
		},
		// 顶部选项卡点击事件
// 		tabsChanges(state){
// 			this.tabsState = state;
// 			this.swiperIndex = state;
// 			this.tabsMaskState = 'true';
// 		},
		// 选项卡滑块切换
		swiperChangs(e){
			this.tabsState = e.detail.current;
			this.swiperIndex = e.detail.current;
			
		},
		// 关闭遮罩
		closeTabsMask(){
			this.tabsState = '';
			this.tabsMaskState = '';
			this.swiperIndex = '';
		},
		// 页面跳转至合伙开店发布详情页面
		toPartnershipStoreRelease() {
			uni.navigateTo({
				url: './partnershipStoreRelease/partnershipStoreRelease'
			});
		},
		// 页面跳转至合伙开店详情页面
		toPartnerOpenStoreDateils(id,readnum){
			uni.navigateTo({
				url: './partnerOpenStoreDateils/partnerOpenStoreDateils?id='+id +'&readnum=' + readnum,
				
			});
		}
	}
};
</script>

<style lang="scss">
		.tab-item{
			line-height: 100upx;
			padding: 20 0upx;
			min-width: 100upx;
			text-align: center;
			color:#3d3d3d;
			font-size: 28upx;
			font-weight: bold;
			letter-spacing:5upx;
			
		}
	.topMask ._top ._swiper_item ._scroll ._scroll_cell.active{
		position: relative;
		color:#fed17c;
		
	}
	._scroll .iconfont{
		font-size: 32upx;
		color:transparent ;
		float: right;
		font-weight: 600;
		// display: none;
	}
	.topMask ._top ._swiper_item ._scroll ._scroll_cell .iconfont.active{
		color: #fbc237;
		font-weight: 600;
	}
@import './partnerOpenStore.scss';
</style>
