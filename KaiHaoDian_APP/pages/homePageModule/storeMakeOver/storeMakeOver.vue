<template>
	<view>
		<!-- 发布按钮 -->
		<view class="_release_button_right" @click="toLocationRelease">发布</view>
		<!-- 顶部选项卡 -->
			<view class="top_tab">
			<view class="_tab" @click="tabsChanges(0)" >
				<view :class="{_activeColor:tabsState === 0 ? '_activeColor' : ''}">
					综合
					<text :class="totops"></text>
					</view>
			</view>
			<view class="_tab" @click="tabsChanges(1)">
				<view :class="{_activeColor:tabsState === 1 ? '_activeColor' : ''}">
					面积
					<text :class="totop2"></text>
					</view>
				
			</view>
			<view class="_tab" @click="tabsChanges(3)" style="">
				<view :class="{_activeColor:tabsState === 2 ? '_activeColor' : ''}">
				
				类型
					<text :class="totop3" style="left: 130upx;"></text>
					</view>
				
			</view>
			<view class="_tab" @click="tabsChanges(4)">
				<view :class="{_activeColor:tabsState === 3 ? '_activeColor' : ''}">
					地址
					<text :class="totop4"></text>
					</view>
				
			</view>
			<view class="_tab" @click="tabsChanges(2)">
				<view :class="{_activeColor:tabsState === 4 ? '_activeColor' : ''}">
				转让费
					<text :class="totop5"></text>
					</view>
				
			</view>
		</view>
		<!-- 选项卡遮罩 -->
		<view class="topMask" v-if="tabsMaskState === 'true'">
			<view class="_top">
				
				<swiper class="_swiper" :current="swiperIndex" @change="swiperChangs">
						<!-- <swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in synthesize" :key="index">
								{{item.value}}
							<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text>
							</view>
						</scroll-view> -->
					</swiper-item>
					<swiper-item class="_swiper_item" >
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in cityList" :key="index" @click="selenav(item.id,index)">{{item.name}}<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
								
						</scroll-view>
					</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in area" :key="index" @click="subarea(index)">{{item.minarea}}-{{item.maxarea }}  ㎡ <text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
							
						</scroll-view>
					</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in fee" :key="index" @click="feeFetching(index)">人民币{{item.minFee}}-{{item.maxFee}}
							<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in paixu" :key="index" @click="leibien(item.id,item.value)">{{item.value}}
							<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text>
							</view>
						</scroll-view>
					</swiper-item>
				
				</swiper>
			</view>
			<view class="_mask" @click="closeTabsMask"></view>
		</view>
		<!-- #end -->
		<!-- 旺铺转让列表 -->

		<view class='transfer'>
		  <view class='transfer_list' v-for="(item, index) in partnerList" :key="index" @click="toStoreMakeOverDateils(item.id)">
		   <view class="transfers">
		   	<view class="transfer-left">
		   	 <img src="https://wx.qlogo.cn/mmopen/vi_32/clsym6uibo36OHsmO9WmJDZue7QHa0cNiciajjcngAVQfc80RHmutzMwMkyg0ibwYpTRhOA9ZbyXuUh1EKJic7rRbFA/132" alt="">
		   	</view>
			 <view class="transfer-right">
				<view class="transferMagess">
					<view class="posted">
						王明·副总
					</view>
					<view class="see">{{item.addtime}}</view>
				</view>
				<view class="transferMagess">
					<view class="concopyMagsse">
						西安开好店网络科技有限公司
					</view>
					<view class="see"><text class="iconfont texts">&#xe64c;</text>{{item.readnum}}</view>
				</view>
			</view>
		   </view>
		   <view class="transferImg">
			   <img :src="item.src" mode=""></image>
		   </view>
		   <view class="Conent">
		   {{item.reason}}
		   </view>
		   <view class="transferBottom">
		   	<view class="Info">
				<view class="infoBox">
					<img src="../../../static/arear.png" alt="">
					<text>{{item.area}}㎡</text>
				</view><text class="line">|</text>
				<view class="infoBox infoBox2">
					<img src="../../../static/moneny.png" alt="">
					<text>{{item.loadingfee}}<text style="padding-left: 0;" v-if="item.loadingfee!='面议' ">万</text></text>
				</view>
			</view>
		   	<view class="shopInfo">
				<view class="shopInfotitle">
					{{item.typevalue}}
				</view>
				<view class="shopInfotitle">
					{{item.statusvalue}}
				</view>
			</view>
		   </view>
		   
		  </view>
		</view>
		<!-- #end -->
		  <view style="text-align:center;margin:30rpx 0;font-size: 14px;">{{no}}</view>
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
						activeIndex:0,
						countryid:"",
						countyvalue:"",
						countyid:"",	
						adress:"区域",
						totop2:"tobott",
						totop3:"tobott",
						totop4:"tobott",
						totop5:"tobott",
						totops:"totop",
						statuslist:'状态',
						type:"",
						renzText:"类型",
						no: "加载更多......",
						minarea: "", //面积排序
						maxarea: "",
						minloadingfee: '',
						maxloadingfee: '',
						feeText:"转让费",
						areaText:"面积",
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
						 paixu: [{
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
						 fee: [{
								minFee: -1,
								maxFee: 1
							  },
							  {
								minFee: '0',
								maxFee: '5万'
							  },
							  {
								minFee: '5万',
								maxFee: '10万'
							  },
							  {
								minFee: '10万',
								maxFee: '20万'
							  },
							  {
								minFee: '20万',
								maxFee: '35万'
							  },
							  {
								minFee: '35万', 
								maxFee: '50万'
							  },

							],
							area: [{
									minarea: 0,
									maxarea: 20
								  },
								  {
									minarea: 20,
									maxarea: 50
								  },
								  {
									minarea: 50,
									maxarea: 100
								  },
								  {
									minarea: 100,
									maxarea: 120
								  },
								  {
									minarea: 120,
									maxarea: 1500
								  }
						
							],
				tabsState:false,//选项卡状态
				tabsMaskState:'',//选项卡遮罩显示隐藏
				swiperIndex:'',
				pagesize: 0,//列表第一次请求数据
				index:7,//列表第二次请求数据
				partnerList:[],//列表详情
				cityList:[],
				
			};
		},
		
		created() {
			
		var that=this
		that.getPartnerList()
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
					 that.getAderss(that.countryid)
					},500)
					
					},
		onReachBottom() {
			this.getPartnerList('onReach');
		},
		onShow(){
		
		},
		methods:{
			//定位选择
			//区域排行
			  selenav(id,index) {
					let that = this;
					this.activeIndex=index;
							that.adress=value,
							that.countyid=id,
							that.countyvalue=id,
						
					this.getPartnerList(); 
						// that.tabsMaskState = 'false';
				},
// 			//地址请求
					getAderss(id){
						console.log(id)
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
						console.log(res.data.responseBody)
						
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
			leibien(id,value) {
				this.activeIndex=index;
				  this.type=id,
				  this.renzText=value     
				
					this.getPartnerList()
			  },
			//转让费排序
			feeFetching(index){
				this.activeIndex=index;
						let that = this
						// that.clickScrollCell();
						var feeText = that.fee[index].minFee + "-" + that.fee[index].maxFee
						if (that.fee[index].minFee == "-1") {
							that.feeText="全部",
							that.isshow=true,
							that.minloadingfee="",
							that.maxloadingfee=""
							that.tabsMaskState = 'true';
						} else {
							that.minloadingfee=that.fee[index].minFee,
							that.maxloadingfee=that.fee[index].maxFee,
							that.feeText=feeText
						}
					
						that.getPartnerList()

					  },
				//面积排序
				  subarea(index) {
					  this.activeIndex=index;
						let that = this
						// that.clickScrollCell();
						
						var areaText = that.area[index].minarea + "-" + that.area[index].maxarea

						
						   that.minarea=that.area[index].minarea,
						   that.maxarea=that.area[index].maxarea,
							 that.areaText=areaText,
						 // that.tabsMaskState = 'false';
							that.getPartnerList()
					  },
			   //三角形切换
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
				    if(index==2){
				   		that.totop5="totop"
				   }else{
				   		that.totop5="tobott"
				   }
				   
						that.tabsState = index;
					 that.swiperIndex = index;
					 that.tabsMaskState = 'true';
				  },
			// 获取旺铺转让列表
			
			getPartnerList(page = '0',t) {
				var _this = this;
				var that=this 
				if(page === 'onReach'){
					uni.request({
						url:shoppublic.getUrl() + 'oldShopTransfer/findlistOldShopTransfer',
						data:{
							index:_this.index,
							city:_this.countryid,
							county:'',
							partner:'',
							type:'',
							statuslist:'状态',// 经营状态
							minarea: '',
							maxarea: '',
							minloadingfee: '',
							maxloadingfee: '',
							
						},
						success: (res) => {
						
							if(page === 'onReach' && res.data.responseBody){
								_this.index += 7;
							}else{
								return false;
							}
							var value = res.data.responseBody
							_this.moneyIncise(value);
						}
					})
				}else{
					uni.request({
						url:shoppublic.getUrl() + 'oldShopTransfer/findlistOldShopTransfer',
						data:{
							index:_this.pagesize,
							city:610100,
							county:that.countyvalue,
							partner:'',
							type:'',
							statuslist:'状态',// 经营状态
							minarea:_this.minarea,
							maxarea: _this.maxarea,
							minloadingfee: _this.minloadingfee.indexOf('万') != -1 ? that.minloadingfee.substr(0, that.minloadingfee.indexOf('万'))*10000:that.minloadingfee,
							maxloadingfee: _this.maxloadingfee.indexOf('万') != -1 ? that.maxloadingfee.substr(0, that.maxloadingfee.indexOf('万')) * 10000 : that.maxloadingfee,
							statuslist:_this.statuslist,
							 type:_this.type,
						},
						success: (res) => {
					console.log(res.data.responseBody)
							var list=_this.partnerList
							   let listBody = res.data.responseBody
							if (listBody) {
							  for (let i in listBody) {
								if (listBody[i].loadingfee >= 1000) {
								  var money = listBody[i].loadingfee / 10000
								  if (money.toString().indexOf('.') == -1) {
									listBody[i].loadingfee = listBody[i].loadingfee / 10000
								  }else{
									listBody[i].loadingfee = (listBody[i].loadingfee / 10000).toFixed(1)
								  }
								} else {
								  listBody[i].loadingfee = '面议'
								}
							  }
							}
							if (res.data.msgCode == '1') {
							  if (list.length > 0) {
								if (t == 1) {
								  list = list.concat(listBody);
								} else {
								  list = listBody;
								}
							  } else {
								list = listBody;
							  };
							 
								_this.partnerList=list
							
							
							  if (list.length <= 7) {
								
								  _this.no="下拉查看更多"
								
							  }
							} else {
							  if (t == 1) {
								
								   _this.no="没有更多了",
								   _this.islast=true
								
							  } else {
								
								 _this.partnerList=""
								  _this.no="没有更多了"
								
							  }
							}
						
						}
					})
				}
			},
			// 钱切割
			moneyIncise(value){
				if(value){
					for (let i in value) {
						if (value[i].loadingfee >= 1000) {
							var money = value[i].loadingfee / 10000
							if (money.toString().indexOf('.') == -1) {
								value[i].loadingfee = value[i].loadingfee / 10000
							}else{
								value[i].loadingfee = (value[i].loadingfee / 10000).toFixed(1)
							}
						} else {
							value[i].loadingfee = '面议'
						}
					}
				}
				if(this.partnerList.length > 1){
					this.partnerList = this.partnerList.concat(value);
				}else{
					this.partnerList = value;
				}
			},
			// 区域/费用选择器按钮点击事件
			clickScrollCell(){
				this.closeTabsMask();
				
			},
			// 顶部选项卡点击事件
			tabsChangesd(state){
			
				this.tabsState = state;
				this.swiperIndex = state;
				this.tabsMaskState = 'true';
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
			// 跳转发布页
			toLocationRelease(){
				uni.navigateTo({
					url:"./locationRelease/locationRelease"
				})
			},
			// 页面跳转至旺铺转让详情页
			toStoreMakeOverDateils(id){
				uni.navigateTo({
					url:"./storeMakeOverDateils/storeMakeOverDateils?id=" + id
				})
			}
		}
	}
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
@import './storeMakeOver.scss'
	
</style>
