<template>
	<view>
		<!-- 发布按钮 -->
		<view class="_release_button_right" @click="toOldStoreTwoHandRelease">发布</view>
		<!-- 顶部选项卡 -->
		<view class="top_tab">
			<view class="_tab" @click="tabsChanges(0)">
				<view :class="{_activeColor:tabsState === 0 ? '_activeColor' : ''}">综合
					<text :class="totops"></text>
				</view>
			</view>
			<view class="_tab" @click="tabsChanges(1)">
				<view :class="{_activeColor:tabsState === 1 ? '_activeColor' : ''}">行业
					<text :class="totop2"></text>
				</view>
				
			</view>
			<view class="_tab" @click="tabsChanges(2)">
				<view :class="{_activeColor:tabsState === 2 ? '_activeColor' : ''}">地址
					<text :class="totop3"></text>
				</view>
			
			</view>
			<view class="_tab" @click="tabsChanges(3)">
				<view :class="{_activeColor:tabsState === 3 ? '_activeColor' : ''}">新进度
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
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,indexs) in Leixing" :key="indexs">{{item.value}}<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in paixu" :key="index" @click="classify(item.id,index)">{{item.value}}<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in cityList" :key="index" @click="selenav(item.id,index)">{{item.name}}<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll" >
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in NewOld" :key="index">{{item.value}}<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
			<view class="_mask" @click="closeTabsMask"></view>
		</view>
		<!-- #end -->
		<!-- 列表 -->
		<view class='cellParent'>
					  <view class='cell' v-for="(item, index) in partnerList" :key="index" @click="toOldStoreTwoHandDateils(item.id)">
						<view class='cellTop' v-if="item.portrait !== '' ? true : false ">
						  <image :src='item.src[0]' v-if="item.src[0]"></image>
						</view>
						<view class="MassageBox">
							<view class='cellTitle hidden'>{{item.description}}</view>
							
							<view class='cellLineCss'></view>
							<view class='cellUserInfo'>
							  <view class='cellUserInfoR'>
								  <view class="userBoxS">
								  		<view class='cellPrice hidden'>
								  	  <text><text class="Price">¥</text></text>{{ item.price != null ? item.price : 0 }}
								  	  </view>
								  	   <view class='cellUserInfo-Time hidden'><text class="iconfont iconfonts">&#xe64c;</text>253</view>
								  </view>
								<view class='cellUserInfo-locationOrTime'>
								  <view class='cellUserInfo-location'>
									<text>{{ item.cityvalue }}</text>
								  </view>
								
								</view>
							  </view>
							</view>
						</view>
					
					  </view>
					</view>
		<!-- #end -->
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic'; //服务器地址
	var getLocation = require('../../../common/getLocation.js');
	export default {
		data() {
			return {
				activeIndex:0,
				NewOld:[
					{
						id:"",
						value:"全部",
					},
					{
						id:"1",
						value:"9.9成新",
					},
						{
						id:"2",
						value:"9.5成新",
					},
						{
						id:"3",
						value:"9成新",
					},
						{
						id:"4",
						value:"8.5成新",
					},
						{
						id:"5",
						value:"8成新",
					},
						{
						id:"6",
						value:"7.5成新",
					},
						{
						id:"7",
						value:"7成新",
					}
					
				],
				adress:"区域",
				cityList:[],
				countryid:"",
				countyvalue:"",
				countyid:"",	
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
				area: [
						  { id: "", value: "全部" },
						  { id: "1", value: "出售" },
						  { id: "2", value: "求购" }
				
				],
				Leixing: [
							  { id: "", value: "综合" },
							  { id: "1", value: "信用" },
							  { id: "2", value: "最新发布" }
					
				],
				classifyid:"",
				feeText:"分类",
				areaText:"方式",
				modeid:"",
				totop2:"tobott",
				totop3:"tobott",
				totop4:"tobott",
				totops:"totop",
				tabsState:'',//选项卡状态
				tabsMaskState:'',//选项卡遮罩显示隐藏
				swiperIndex:'',
				pagesize: 0,
				index:7,
				partnerList:[]
			};
		},
		onLoad() {
			var that=this
			this.getPartnerList();
				getLocation.getLocation(function(res_p, res_c) {
					that.countryid=res_c[0].id
					
			});
				setTimeout(()=>{
				 that.getAderss(610100)
				},1000)
		},
		onReachBottom() {
			this.getPartnerList('onReach');
		},
		methods:{
			//区域排行
			  selenav(id,index) {
				  
				let that = this;
				that.activeIndex=index;
						that.countyvalue=id,
						console.log(index)
				that.getPartnerList(); 
			},
			//地址获取
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
						//分类排序
					classify(id,index){
						
						this.activeIndex=index;
						this.classifyid=id
						 this.getPartnerList();
					},
			//方式排序
			  subarea(id,value) {
				  console.log(id)
					  this.areaText=value
					  this.tabsMaskState =false
					  this.modeid=id
					  this.getPartnerList();
				  },
									
			// 获取老店二手列表
			getPartnerList(page = '0') {
				var _this = this;
				if(page === 'onReach'){
					uni.request({
						url:shoppublic.getUrl() + 'secondHandItem/findSecondHandItemList',
						data:{
							index:_this.index,
							city:610100,
							county:_this.countyvalue,
							 rentorsell:_this.modeid,
							 type:_this.classifyid	
						},
						success: (res) => {
							console.log(res);
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
						url:shoppublic.getUrl() + 'secondHandItem/findSecondHandItemList',
						data:{
							index:_this.pagesize,
							city:610100,
							county:_this.countyvalue,
							 rentorsell:_this.modeid,
							type:_this.classifyid
						},
						success: (res) => {
							console.log(res);
						if(res.data.responseBody==null){
							_this.no="没有更多了"
						}
							var value = res.data.responseBody
							// _this.moneyIncise(value);
							this.partnerList=res.data.responseBody
						}
					})
				}
			},
			// 钱切割
			moneyIncise(value){
				
				if(value){
					for (let i in value) {
						if (value[i].price >= 1000) {
							var money = value[i].price
							if (money.toString().indexOf('.') == -1) {
								value[i].price = value[i].price
							}else{
								value[i].price = (value[i].price).toFixed(1)
							}
						} else {
							value[i].price = '面议'
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
			// 跳转至二手转让发布页
			toOldStoreTwoHandRelease(){
				uni.navigateTo({
					url:"./oldStoreTwoHandRelease/askToBuy/askToBuy"
				})
			},
			// 跳转至二手物品详情
			toOldStoreTwoHandDateils(id){
				uni.navigateTo({
					url:"./oldStoreTwoHandDateils/oldStoreTwoHandDateils?id=" + id
				})
			},
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
@import './oldStoreTwoHand.scss';
</style>
