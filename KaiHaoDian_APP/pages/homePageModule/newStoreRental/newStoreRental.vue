<template>
	<view>
		<!-- 发布按钮 -->
		<view class="_release_button_right" @click="toLocationRelease">发布</view>
		<!-- 顶部选项卡 -->
		<view class="top_tab">
			<view class="_tab" @click="tabsChanges(0)">
				<view :class="{_activeColor:tabsState === 0 ? '_activeColor' : ''}">综合
					<text :class="totops"></text>
				</view>
			</view>
			<view class="_tab" @click="tabsChanges(1)">
				<view :class="{_activeColor:tabsState === 1 ? '_activeColor' : ''}">面积
					<text :class="totop1"></text>
				</view>
			</view>
			<view class="_tab" @click="tabsChanges(2)">
				<view :class="{_activeColor:tabsState === 2 ? '_activeColor' : ''}">类型
					<text :class="totop2"></text>
				</view>
				
			</view>
			<view class="_tab" @click="tabsChanges(3)">
				<view :class="{_activeColor:tabsState === 3 ? '_activeColor' : ''}">地址
					<text :class="totop3"></text>
				</view>
			
			</view>
			<view class="_tab" @click="tabsChanges(4)">
				<view :class="{_activeColor:tabsState === 4 ? '_activeColor' : ''}">房租
				<text :class="totop4"></text>
				</view>
		
			</view>
		</view>
		<!-- 选项卡遮罩 -->
		<view class="topMask" v-if="tabsMaskState === 'true'">
			<view class="_top">
				<swiper class="_swiper"  :current="swiperIndex" @change="swiperChangs">
						<swiper-item class="_swiper_item" >
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==indexs}" v-for="(item,indexs) in synthesize" :key="indexs" @click="synthesizes(indexs)">{{item.value}} <text :class="{'iconfont':true,'active':activeIndex==indexs}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
						<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==indexd}" v-for="(item,indexd) in area" :key="indexd" @click="subarea(item.minarea,item.maxarea,indexd)">&nbsp;&nbsp;{{item.minarea}}&nbsp;-&nbsp;{{item.maxarea}}&nbsp;㎡<text :class="{'iconfont':true,'active':activeIndex==indexd}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==indexe}" v-for="(item,indexe) in paixu" :key="indexe" @click="leibie(item.id,indexe)">{{item.value}}<text :class="{'iconfont':true,'active':activeIndex==indexe}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
				<swiper-item class="_swiper_item" >
					<scroll-view scroll-y class="_scroll">
						<view :class="{'_scroll_cell':true,'active':activeIndex==indexs}" v-for="(item,indexs) in cityList" :key="indexs" @click="selenav(item.id,indexs)">{{item.name}}<text :class="{'iconfont':true,'active':activeIndex==indexs}">&#xe721;</text></view>
					</scroll-view>
				</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==indexn}" v-for="(item,indexn) in fee" :key="indexn" @click="feeFetching(item.minFee,item.maxFee,indexn)">&nbsp;&nbsp;{{item.minFee}}&nbsp;-&nbsp;{{item.maxFee}}&nbsp;元/月<text :class="{'iconfont':true,'active':activeIndex==indexn}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
						
				</swiper>
			</view>
			<view class="_mask" @click="closeTabsMask"></view>
		</view>
		<!-- #end -->
		<!-- 列表 -->
		<view class='transfer'>
	  <view class='transfer_list' v-for="(item, index) in pageInfo" :key="index" @click="toNewStoreRentalDateils(item.id)">
			<view class="transferInfo">
				<view class="transferConnent">
					<view class="MassageBox">
						<view>
							<view class="title">
								{{item.introduction}}
							</view>
							<view class="area">
								<text class="iconfont">&#xe683;<text>{{item.areamax}}㎡</text></text> <text class="iconfont">&#xe684;<text>{{item.rentmax}}/月</text></text>    
							</view>
						</view>
						<view class="massageImg">
							<img :src="item.src" alt="">
							<view class="type">
								{{item.merchants[0]}}
							</view>
						</view>
					</view>
					<view class="address">
						<text class="iconfont">&#xe6ed;<text>{{item.provincevalue}}{{item.cityvalue}}{{item.countyvalue}}</text></text>
					</view>
				</view>
			</view>
	</view>
			 <view style="text-align:center;margin:30rpx 0; font-size: 14upx; color: #000;font-weight: 600;height: 80upx;line-height: 80upx;">{{no}}</view>
	</view>
	</view>
</template>

<script>
	var getLocation = require('../../../common/getLocation.js');
	import shoppublic from '@/common/shoppublic'; //服务器地址
	export default {
		data() {
						return {
								order:0,
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
							no: "加载更多......",
							countryid:"",
							countyvalue:"",
							countyid:"",	
							adress:"区域",
							type:"",
							minarea:"",
							maxarea:"",
							area: [
									  { minarea: 0, maxarea: 20 },
									  { minarea: 20, maxarea: 50 },
									  { minarea: 50, maxarea: 100 },
									  { minarea: 100, maxarea: 120 },
									  { minarea: 120, maxarea: 150000 }

								],
								paixu: [
									     {
										   id: "0",
											value: "商业街商"
										  },
										  {
											id: "1",
											value: "写字楼配套"
										  },
										  {
											id: "2",
											value: "社区底商"
										  },
										  {
											id: "3",
											value: "档口摊位"
										  },
										  {
											id: "4",
											value: "临街门面"
										  },
										  {
											id: "5",
											value: "购物百货中心"
										  },
										  {
											id: "6",
											value: "其他"
										  },
										],
						fee: [
									  { minFee: 0, maxFee: 1000 },
									  { minFee: 1000, maxFee: 2000 },
									  { minFee: 2000, maxFee: 3000 },
									  { minFee: 3000, maxFee: 5000 },
									  { minFee: 5000, maxFee: 8000 },
									  { minFee: 8000, maxFee: 10000 },
							],
						minloadingfee:"",
						maxloadingfee:"",
						feeText:"房租",
						areaText:"面积",
						renzText:"类型",
						totop2:"tobott",
						totop3:"tobott",
						totop4:"tobott",
						totop1:"tobott",
						totops:"totop",
						tabsState:'',//选项卡状态
						tabsMaskState:'',//选项卡遮罩显示隐藏
						swiperIndex:'',
						pagesize: 0,
						index: 7,
						pageInfo:[],
						activeIndex:0,
						cityList:[],
						countyIds:"",
						
			};
		},
		onLoad() {
				var that=this
				uni.getStorage({
				key: 'location',
				success: res => {
				
					_this.location = {
						province_id: res.data.province_id,
						province_name: res.data.province_name,
						city_id: res.data.city_id,
						city_name: res.data.city_name
					};
					that.countryid = res.data.city_id;
				;
				},
				fail: res => {
					if (
						(that.location.province_name ||
							that.location.province_id ||
							that.location.city_name ||
							that.location.city_id) == ''
							
					) {
						getLocation.getLocation(function(res_p, res_c) {
							that.countryid=res_c[0].id
							console.log(that.countryid)
						});
					}
				}
			});		
			setTimeout(()=>{
				that.getAderss(that.countryid)
				that.getPartnerList()
			},1000)
					 
		},
		onReachBottom() {
			this.getPartnerList('onReach');
		},
		methods:{
			//综合排序
			synthesizes(index){
					console.log(index)
				this.activeIndex=index;
				this.order=index
				this.getPartnerList(); 
				},
				tabsChangesd(state){
			this.activeIndex=index;
				this.tabsState = state;
				this.swiperIndex = state;
				this.tabsMaskState = 'true';
			},
				// 地址排序
				  selenav(id,index) {
					  console.log(id,index)
								let that = this;
								
								  that.countyIds=id,
								that.getPartnerList(that.countyIds);
								 that.activeIndex=index;
				},
// 			//地址请求
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
					  pid: "610100",
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
			//排序排序
			leibie(id,index) {
						
					let that = this;
					that.activeIndex=index;
					  that.type=id,
					that.getPartnerList();


				  },
					feeFetching(min,max,index) {
					let that = this
			that.activeIndex=index;
						that.minloadingfee=min
						that.maxloadingfee=max
						
					that.getPartnerList();

				  },
			//面积排序
			 subarea: function (minarea,maxarea,index) {
				let that = this
				that.activeIndex=index;
					that.minarea=minarea
					that.maxarea=maxarea
					
					that.getPartnerList();
			  },
			// 获取新铺租售列表
			getPartnerList(page = '0') {
				var _this = this;
				var oldVisitorList = _this.pageInfo;
				if(page === 'onReach'){
					uni.request({
						url:shoppublic.getUrl() + 'newShopRent/findlistnewShopRent',
						data:{
							index:_this.index,
							// city:_this.countryid,
							city:610100,
							county:_this.countyIds,
							type:_this.type,
							minarea:_this.minarea,
							maxarea: _this.maxarea,
							minloadingfee:_this.minloadingfee,
							maxloadingfee: _this.maxloadingfee,
							
						},
						success: (res) => {
								console.log(_this.minarea,_this.maxarea)
							if(page === 'onReach' && res.data.responseBody){
								oldVisitorList = oldVisitorList.concat(res.data.responseBody)
								_this.index += 7;
							}else{
								return false;
							}
							_this.pageInfo = oldVisitorList
						}
					})
				}else{
					uni.request({
						url:shoppublic.getUrl() + 'newShopRent/findlistnewShopRent',
						data:{
							index:_this.pagesize,
							// city:_this.countryid,
							city:610100,
							county:_this.countyIds,
							type:_this.type,
							minarea:_this.minarea,
							maxarea: _this.maxarea,
							minloadingfee:_this.minloadingfee,
							maxloadingfee: _this.maxloadingfee,
						},
						success: (res) => {
							console.log(res);
							_this.pageInfo = res.data.responseBody;
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
			   tabsChanges(index) {
						   var that = this;
						  if(index==0){
								that.totops="totop"
						  }else{
							  that.totops="tobott"
						  }
						   if(index==1){
								that.totop1="totop"
						  }else{
								that.totop1="tobott"
						  }
						   if(index==2){
								that.totop2="totop"
						  }else{
								that.totop2="tobott"
						  }
						   if(index==3){
								that.totop3="totop"
						  }else{
								that.totop3="tobott"
						  }
						    if(index==4){
						  		that.totop4="totop"
						  }else{
						  		that.totop4="tobott"
						  }
						  console.log(index)
					
								that.tabsState = index;
								that.swiperIndex = index;
								that.tabsMaskState = 'true';
			 },
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
			// 页面跳转至新铺招租发布页
			toLocationRelease(){
				uni.navigateTo({
					url:"./newShopRentalRelease/newShopRentalRelease"
				})
			},
			// 页面跳转至新铺招租详情页
		toNewStoreRentalDateils(id){
			uni.navigateTo({
				url:"./newStoreRentalDateils/newStoreRentalDateils?id=" + id
			})
		}
		}
	}
</script>

<style lang="scss">
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
@import './newStoreRental.scss';
</style>
