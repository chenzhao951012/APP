<template>
	<view class="content">
		<!-- <view class="_tab_nav" :class="blockInputNav ? 'display_block' : 'display-none'">
			<view class="_arrow_nav iconfont" @click="backPreviousPage">&#xe859;</view>
			<view class="_nav_title _nav_inp"><text class="iconfont">&#xe63e;</text><input type="text" value="" placeholder="请搜索岗位"/></view>
		</view> -->
		<!-- 发布按钮 -->
		<view class="_release_button_right" @click="toLocationRelease">发布</view>
		<!-- 滚动至固定位置，贴顶 -->
		<view class="_position_top" :class="BlockPositionTop">
			<!-- 顶部选项卡 -->
			<view class="top_tab">
				<view class="_tab" @click="tabsChanges(0)">
					<view :class="{_activeColor:tabsState === 0 ? '_activeColor' : ''}">综合
					<text :class="totop2"></text>
					</view>
					
				</view>
				<view class="_tab" @click="tabsChanges(1)">
					<view :class="{_activeColor:tabsState === 1 ? '_activeColor' : ''}">地址
					<text :class="totop3"></text>
					</view>
					
				</view>
					<view class="_tab" @click="tabsChanges(2)">
					<view :class="{_activeColor:tabsState === 1 ? '_activeColor' : ''}">行业
					<text :class="totop3"></text>
					</view>
					
				</view>
					<view class="_tab" @click="tabsChanges(3)">
					<view :class="{_activeColor:tabsState === 1 ? '_activeColor' : ''}">类型
					<text :class="totop3"></text>
					</view>
					
				</view>
			
			</view>
			<!-- 选项卡遮罩 -->
			<view class="topMask" v-if="tabsMaskState === 'true'">
				<view class="_top">
					<swiper class="_swiper" :current="swiperIndex" @change="swiperChangs">
						<swiper-item class="_swiper_item">
							<scroll-view scroll-y class="_scroll">
								<view class="_scroll_cell" v-for="(item,indexs) in synthesize" :key="indexs" @click="clickScrollCell">{{item.value}}</view>
							</scroll-view>
						</swiper-item>
							<swiper-item class="_swiper_item">
							<scroll-view scroll-y class="_scroll">
								<view :class="{'_scroll_cell':true,'active':activeIndex==indexd}" v-for="(item,indexd) in cityList" :key="indexd" @click="selenav(item.id,indexd)">{{item.name}}<text :class="{'iconfont':true,'active':activeIndex==indexd }">&#xe721;</text></view>
							</scroll-view>
						</swiper-item>
							<swiper-item class="_swiper_item">
							<scroll-view scroll-y class="_scroll">
								<view :class="{'_scroll_cell':true,'active':activeIndex==indexd}" v-for="(item,indexd) in 15" :key="indexd" @click="leibie(item.id,indexd)">毛毛虫<text :class="{'iconfont':true,'active':activeIndex==indexd }">&#xe721;</text></view>
							</scroll-view>
						</swiper-item>
						<swiper-item class="_swiper_item">
							<scroll-view scroll-y class="_scroll">
								<view :class="{'_scroll_cell':true,'active':activeIndex==indexd}" v-for="(item,indexd) in paixu" :key="indexd" @click="leibie(item.id,indexd)">{{item.value}}<text :class="{'iconfont':true,'active':activeIndex==indexd }">&#xe721;</text></view>
							</scroll-view>
						</swiper-item>
					</swiper>
				</view>
				<view class="_mask" @click="closeTabsMask"></view>
			</view>
			<!-- #end -->
		</view>
			<!-- 招聘 -->
			<view class="JobBox" v-for="(item,index) in recruitList" :key="index" @click="toRecruitAndSeekDateils(item.id)">
				<view class="inviteox">
					<view class="subinviteox">
						<view class="inviteoxLeft">
							<view class="subinviteoxtitle">{{item.title}}</view>
							<view class="info">
							<text>{{ item.provincevalue }}-{{item.cityvalue}}-{{ item.countyvalue }}</text>
						
							<text>{{item.typevalue}}</text>
							</view>
							<view class="UserInfo">
								<view class="UserImg">
									<image :src="item.portrait" mode=""></image>
									</view>
								<view class="UserMagess">
									<view class="position">{{item.name}}</view>
									<view class="Comnpy" v-if="item.company">{{item.company}}<text class="iconfont iconfonts">&#xe730;</text></view>
								</view>
							</view>
						</view>
						<view class="inviteoxRight">
							<view class="title">
								{{item.salarymin/1000}}K-{{item.salarymax/1000}}K
							</view>
							<view class="examine">
								</text><text class="iconfont iconecodes">&#xe64c;</text>{{item.readnum}}</text>
							</view>
							<view class="data">
								{{item.addtime}}
							</view>
						</view>
					</view>
				</view>
				
			</view>
				 <view style="text-align:center;padding:30rpx 0; font-size: 14upx; color: #000;font-weight: 600;background-color: #fff;">{{no}}</view>
	</view>
</template>

<script>

	import shoppublic from '@/common/shoppublic'; //服务器地址
		var getLocation = require('../../../common/getLocation.js');
	var app = getApp();
	var appLocation = app.globalData.location;
		
	var imageUrl = shoppublic.getImageUrl();
	var imageUrl1 = shoppublic.getUpImgUrl();
	export default {
		data() {
			return {
				
				countyId:"",
				no:"加载更多数据",
				cityList:[],
				countryid:"",
				activeIndex:0,
				  type: "",
				 typevalue: "",
				genre:"",
				renzText: "类型",
				totop2:"totop",
				totop3:"tobott",
				// 测试数据
				tabsState:'',//选项卡状态
				tabsMaskState:'',//选项卡遮罩显示隐藏
				swiperIndex:'',
				blockJobWanted:true,//求职状态
				blockRecruit:false,//招聘状态
				BlockPositionTop:false,//固定顶部的遮罩显示
				recruitList:[],
				jobWantedList:[],
				top_scrollTop:'',
				blockInputNav:false,
				pagesize: 0,
				index:7,
				status:1,
				synthesize:[
					{
					id:0,
					value:'综合'
					},
					{
					id:1,
					value:'信用'
					},
					{
					id:0,
					value:'最新发布'
					},
				],
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
						  { id: "10", value: "教育" },
						  { id: "11", value: "酒店宾馆" },
						  { id: "12", value: "农业环保" },
						  { id: "13", value: "母婴" },
						  { id: "14", value: "网络服务" },
						  { id: "15", value: "其他" }
				],
			};
		},
		onPageScroll(e){
			// console.log(e.scrollTop);
			this.top_scrollTop = e.scrollTop;
			if(e.scrollTop >= 100){
				this.BlockPositionTop = true;
				this.blockInputNav = true;
			}else{
				this.BlockPositionTop = false;
				this.blockInputNav = false;
			}
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
			_this.getAderss(610100)
			_this.getPageInfo();
		},
		onReachBottom() {
			this.getPageInfo('onReach');
		},
		methods:{
			//区域排行
			selenav(id,index) {
			
				let that = this
				console.log(12)
				 
				  that.countyId=id,
				
				 that.activeIndex=index;
				that.getPageInfo();
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
					console.log(res)
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
			//类型
			 leibie(id,index){
					
						let that = this;
						 that.activeIndex=index;
						  that.genre=id
						 
						
						that.getPageInfo();
					  },
			// 获取招聘页面信息
			getPageInfo(page = '0'){
				var _this = this;
				var oldPartnerList = _this.recruitList;
				// *************当index等于28时会报错**************
				if(page === 'onReach'){
					uni.request({
						url: shoppublic.getUrl() + "/storeRecruitment/findStoreRecruitmentList",
						data:{
							index:_this.index,
							county:_this.countyId,
							city:610100,
							salarymin:'',
							salarymax:'',
							type:_this.genre,
							typevalue:_this.typevalue,
							status:_this.status
						},
						success: (res) => {
							if(res.data.responseBody!=null){
								_this.no="加载更多数据"
							}
							if(_this.status === 1){
								console.log(res.data.responseBody);
								if(page === 'onReach' && res.data.responseBody){
									oldPartnerList = oldPartnerList.concat(res.data.responseBody);
									_this.index += 5;
								}else{
									return false;
								}
								_this.recruitList = oldPartnerList;
							}else{
								console.log(res.data.responseBody);
								if(page === 'onReach' && res.data.responseBody){
									oldPartnerList = oldPartnerList.concat(res.data.responseBody);
									_this.index += 7;
								}else{
									return false;
								}
								_this.jobWantedList = oldPartnerList;
							}
							
						}
					})
				}else{
					uni.request({
						url:shoppublic.getUrl() + 'storeRecruitment/findStoreRecruitmentList',
						data:{
							index:_this.pagesize,
							county:_this.countyId,
							city:610100,
							salarymin:'',
							salarymax:'',
							type:_this.genre,
							typevalue:'',
							status:_this.status
						},
						success: (res) => {console.log(res)
							if(_this.status === 1){
								if(res.data.responseBody==null){
									_this.no="没有更多数据了"
								}
								_this.recruitList = res.data.responseBody;
								console.log(_this.recruitList);
							}else{
								console.log(res.data.responseBody);
								_this.jobWantedList = res.data.responseBody;
								console.log(_this.jobWantedList);
							}
							
						}
					})
				}
			},
			//类型排序
		
	
			// 返回上一页
			backPreviousPage(){
				// console.log(getCurrentPages());
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			// 区域/费用选择器按钮点击事件
			clickScrollCell(e){
				this.closeTabsMask();
			},
			// 顶部选项卡点击事件
			  tabsChanges(index) {
									   var that = this;
									  if(index==0){
											that.totop2="totop"
									  }else{
										  that.totop2="tobott"
									  }
									   if(index==1){
											that.totop3="totop"
									  }else{
											that.totop3="tobott"
									  }
								
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
			// 跳转发布详情
			toLocationRelease(){
				uni.navigateTo({
					url:"./recruitAndSeekRelease/recruit/recruit"
				})
			},
			//跳转搜索:0是主页跳转
			toSearch(e) {
				uni.navigateTo({
					url: '../../searchPage/searchPage?search_state=' + '0'
				});
			},
			// 切换样式
			switchStyle(index){
				// console.log(index);
				if(index === '1'){
					this.blockJobWanted = false;
					this.blockRecruit = true;
					this.status = 2;
					this.getPageInfo();
				}else if(index === '2'){
					this.blockJobWanted = true;
					this.blockRecruit = false;
					this.status = 1;
					this.getPageInfo();
				}
			},
			toRecruitAndSeekDateils(id){
			
					uni.navigateTo({
						url:'./recruitAndSeekDateils/recruitAndSeekDateils?id=' + id
					})
// 				}else if(e === '2'){
// 					console.log(2);
// 					uni.navigateTo({
// 						url:'./recruitAndSeekDateils/recruitAndSeekDateils?id=' + id
// 					})
// 				}
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
	@import './recruitAndSeek.scss';
</style>
