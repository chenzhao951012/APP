<template>
	<view class="content">
		<view class="lines">
			
		</view>
			<view class="top_tab">
			<view class="_tab" @click="tabsChanges(0)">
				<view :class="{_activeColor:tabsState === 0 ? '_activeColor' : ''}">综合
				<text :class="totops"></text>
				</view>
			</view>
			<view class="_tab" @click="tabsChanges(1)">
				<view :class="{_activeColor:tabsState === 1 ? '_activeColor' : ''}">类型
				<text :class="totop2"></text>
				</view>
			</view>
	</view>
			<view class="topMask" v-if="tabsMaskState === 'true'">
			<view class="_top">
				<swiper class="_swiper" :current="swiperIndex" @change="swiperChangs">
					<swiper-item class="_swiper_item" >
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in releaseListed" :key="index" @click="clickScrollCell">{{item.value}}<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in releaseType" :key="index" @click="selenav(item.id,index)">{{item.value}}<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
			<view class="_mask" @click="closeTabsMask"></view>
		</view>
		<!-- 招商加盟 -->
					<view class="project_cell" v-for="(item,index) in list3" @click="toJoinInvestmentDetails(index,item.id)">
						<text class="iconfont iconfonted6" v-if="isShow" @click.stop="removeJoin">&#xe68e;</text>
			<view class="cell_top">
				<image :src="item.logo" mode=""></image>
				<view class="cell_top_bottom">
					<view class="">{{item.brands}}</view>
		
				</view>
			</view>
			<view class="cell_bottom">
				<view class="_left">
					<view class="_name">
						<text><text class="tese">加盟特色:</text><text></text><text class="times">品牌年龄{{item.storeage}}年</text></text>
					</view>
					<view class="_name">
						<text><text class="tese">加盟费:</text><text></text><text class="times2">{{item.initialfee}}元</text></text>
					</view>
				</view>
				<view class="_lineCss">
					地址{{item.cityvalue}}
				</view>
				
			</view>
		</view>
		<!-- 合伙开店列表 -->
			<view class="partner_List" @click="toPartnerOpenStoreDateils(item.id,item.readnum)" v-for="(item,idx) in list4" :key="idx" v-if="sort2">
			<text class="iconfont iconfonted" v-if="isShow" @click.stop="removeProject(idx,item.id,item.projectType)">&#xe68e;</text>
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
			<!-- 旺铺转让 -->
			<view class="" style="margin-top: 40upx;" v-if="sort3">
					<view class='transfer'>
				  <view class='transfer_listd' v-for="(item, index) in list1" :key="index" @click="toStoreMakeOverDateils(item.id)">
						<text class="iconfont iconfonted iconfonted2" v-if="isShow" @click.stop="removeProject(index,item.id,item.projectType)">&#xe68e;</text>
						<view class="">
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
				</view>
			</view>
			<!-- 新铺租售 -->
				<view class='transfer' v-if="sort4">
			  <view class='transfer_list' v-for="(item, index) in list2" :key="index" @click="toNewStoreRentalDateils(item.id)">
						<text class="iconfont iconfonted3" v-if="isShow" @click.stop="removeProject(index,item.id,item.projectType)">&#xe68e;</text>
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
										{{item.typevalue[0]}}
									</view>
								</view>
							</view>
							<view class="address">
								<text class="iconfont">&#xe6ed;<text>{{item.provincevalue}}{{item.cityvalue}}{{item.countyvalue}}</text></text>
							</view>
						</view>
					</view>
			</view>
					 
			</view>
			<!-- 招聘 -->
			<view class="JobBox" v-for="(item,index) in list5"  @click="toRecruitAndSeekDateils(item.id)" v-if="sort5">
				<text class="iconfont iconfonted4" v-if="isShow" @click.stop="removeProject(index,item.id,item.projectType)">&#xe68e;</text>
				<view class="inviteox">
					<view class="subinviteox">
						<view class="inviteoxLeft">
							<view class="subinviteoxtitle">{{item.title}}</view>
							<view class="info">
							<text>{{ item.provincevalue }}-{{item.cityvalue}}-{{ item.countyvalue }}</text>
						
							<text>{{item.typevalue}}</text>
							</view>
						<!-- 	<view class="UserInfo">
								<view class="UserImg">
									<image :src="item.portrait" mode=""></image>
									</view>
								<view class="UserMagess">
									<view class="position">{{item.name}}</view>
									<view class="Comnpy" v-if="item.company">{{item.company}}<text class="iconfont iconfonts">&#xe730;</text></view>
								</view>
							</view> -->
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
			<!-- 老店二手 -->
					<view class='cellParent'>
							  <view class='cell' v-for="(item, index) in list6" :key="index" @click="toOldStoreTwoHandDateils(item.id)" v-if="sort6">
									<text class="iconfont iconfonted4" v-if="isShow" @click.stop="removeProject(index,item.id,item.projectType)">&#xe68e;</text>
								<view class='cellTop' v-if="item.portrait !== '' ? true : false ">
								 <image src='http://39.104.48.81:8088/shop_file/img/20190212/1549952068215040398.png' ></image>
								</view>
								<view class="MassageBoxs">
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
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic';
	var list = [];
	export default {
		data() {
			return {
				isShow:false,
				sort1:true,
				sort2:true,
				sort3:true,
				sort4:true,
				sort5:true,
				sort6:true,
				sort7:true,
				putaway:"上架",
				activeIndex:0,
				token:306,
				releaseTypes:"",
				totop2:"tobott",
				totop3:"tobott",
				totop4:"tobott",
				totop5:"tobott",
				totops:"totop",
				location_city:'',//地址选择  
				tabsState:'',//选项卡状态
				tabsMaskState:'',//选项卡遮罩显示隐藏
				// --------------------------------------------------------测试数据
				releaseListed:[
					{
						id:0,
						value:"综合"
					},
						{
						id:1,
						value:"热度"
					},
						{
						id:2,
						value:"按时间从近到远"
					},
				],
				    list: [], //全部发布
					list1: [], //旺铺转让
					list2: [], //新铺招租
					list3: [], //项目加盟
					list4: [], //合伙开店
					list5: [], //招聘求职
					list6: [], //老店二手
				releaseType:[
						{
						id:0,
						value:"全部"
						},
						{
						id:1,
						value:"招商加盟"
						},
						{
						id:2,
						value:"合伙开店"
						},
						{
						id:3,
						value:"旺铺转让"
						},
						{
						id:4,
						value:"新铺租售"
						},
						{
						id:5,
						value:"求职招聘"
						},
						{
						id:6,
						value:"老店二手"
						},
						{
						id:7,
						value:"开店寻址"
						}
						
						
		
					],//项目类型
				isMaskBlock:false,//显示遮罩层
				isNone:true,//显示下拉菜单控件
				isFontSize:true,//控制字体大小
			};
		},
		onLoad() {
			var _this=this
			_this.getList2()
			_this.getList6()
			 	_this.getList4()
					_this.getList1()
			_this.getList5()
			_this.getList3()
		},
		//原生导航事件 // 编辑
	 onNavigationBarButtonTap() {  
					this.isShow=!this.isShow
				},
		methods:{
				//招商加盟删除
				removeJoin(index,id){
					alert(12)
// 					var that=this
// 						  uni.showModal({
// 					title: '',
// 					content: '确认删除这条发布',
// 					confirmColor:"#ffc140",
// 						success: res => {
// 						  if (res.confirm == true) {
// 							uni.request({
// 							  url: shoppublic.getUrl() + '/personalcenter/deleteProjectJoin',
// 							  data: {
// 								id: id,
// 								token:that.token
// 							  },
// 							  success: (res) => {
// 								list.splice(index, 1)
// 								  _this.list=list
// 							  }
// 							})
// 						  }
// 							}
// 					  })
					},
					
					//类型选择
					selenav(id,index){
						var that=this
						this.activeIndex=index
						if(index==0){
							that.sort2=true
							that.sort3=true
							that.sort4=true
							that.sort5=true
							that.sort6=true
							that.sort7=true
						
						}else if(index==1){
							console.log(12)
							
						}else if(index==2){
							that.sort2=true
							that.sort3=false
							that.sort4=false
							that.sort5=false
							that.sort6=false
							that.sort7=false
			
						}else if(index==3){
								that.sort2=false
							that.sort3=true
							that.sort4=false
							that.sort5=false
							that.sort6=false
							that.sort7=false
						}else if(index==4){
								that.sort2=false
							that.sort3=false
							that.sort4=true
							that.sort5=false
							that.sort6=false
							that.sort7=false
						}else if(that.index==5){
							that.sort3=false
							that.sort4=false
							that.sort5=true
							that.sort6=false
							that.sort7=false
							
						}else if(index==6){
							that.sort2=false
							that.sort3=false
							that.sort4=false
							that.sort5=false
							that.sort6=true
							that.sort7=false
						}else if(index==7){
							
						}
					},
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
			// 上架下架
			 projectStateChang(id,state,index,e_projectType) {
						let _this = this
						if (state == 1) {
						  list[index].state = 2;
						  state = 2;
						} else if (state == 2) {
						  list[index].state = 1;
						  state = 1;
						}
						
						  _this.list=list
						
						if (e_projectType === '1') { //旺铺转让
						  uni.request({
							url: shoppublic.getUrl() + '/personalcenter/findlistOldShopTransfer',
							data: {
							  id: id,
							  state: state
							},
							header: {
							  'content-type': 'application/json'
							},
							success: function(res) {
								_this.putaway="下架"
							}
						  })
						} else if (e_projectType === '2') { //新铺租售
						  uni.request({
							url: shoppublic.getUrl() + '/personalcenter/updateNewShopRentState',
							data: {
							  id: id,
							  state: state
							},
							header: {
							  'content-type': 'application/json'
							},
							success: function(res) {
								_this.putaway="下架"
							}
						  })
						} else if (e_projectType === '3') { //项目加盟
						  uni.request({
							url: shoppublic.getUrl() + '/personalcenter/updateProjectJoinState',
							data: {
							  id: id,
							  state: state
							},
							header: {
							  'content-type': 'application/json'
							},
							success: function(res) {
								_this.putaway="下架"
							}
						  })
						} else if (e_projectType === '4') { // 合伙开店
						  uni.request({
							url: shoppublic.getUrl() + '/personalcenter/updatePartnershipShopState',
							data: {
							  id: id,
							  state: state
							},
							header: {
							  'content-type': 'application/json'
							},
							success: function(res) {
								_this.putaway="下架"
							}
						  })
						} else if (e_projectType === '5') { // 招聘求职

						  uni.request({
							url: shoppublic.getUrl() + '/personalcenter/updateStoreRecruitmentState',
							data: {
							  id: id,
							  state: state
							},
							header: {
							  'content-type': 'application/json'
							},
							success: function(res) {
								_this.putaway="下架"
							}
						  })
						} else if (e_projectType === '6') { //老店二手
						  uni.request({
							url: shoppublic.getUrl() + '/personalcenter/updateStoreRecruitmentState',
							data: {
							  id: id,
							  state: state
							},
							header: {
							  'content-type': 'application/json'
							},
							success: function(res) {
								_this.putaway="下架"
							}
						  })
						}
					  },
			//删除
			 removeProject(index,id,e_projectType) {
				 event.preventDefault()
						var _this=this
						var that=this
							if (e_projectType === '1') { //旺铺转让删除
								
						  uni.showModal({
								title: '',
								content: '确认删除这条发布',
								confirmColor:"#ffc140",
								success: res => {
								  console.log(res);
								  if (res.confirm == true) {
									uni.request({
									  url: shoppublic.getUrl() + '/personalcenter/deleteOldShopTransfer',
									  data: {
										id: id,
										token:that.token
									  },
									  success: (res) => {
										list.splice(index, 1)
										
										  _this.list=list
										
									  }
									})
								  }
								}
							  })
							} else if (e_projectType === '2') { //新铺租售删除
						  uni.showModal({
							title: '',
							content: '确认删除这条发布',
							confirmColor:"#ffc140",
								success: res => {
								  if (res.confirm == true) {
									uni.request({
									  url: shoppublic.getUrl() + '/personalcenter/deleteNewShopRent',
									  data: {
										id: id,
										token:that.token
									  },
									  success: (res) => {
										list.splice(index, 1)
										  _this.list=list
									  }
									})
								  }
								}
							  })
							} else if (e_projectType === '3') { //项目加盟删除
					
							} else if (e_projectType === '4') { //合伙开店删除
							  uni.showModal({
								title: '',
								content: '确认删除这条发布',
								confirmColor:"#ffc140",
								success: res => {
								  if (res.confirm == true) {
									uni.request({
									  url: shoppublic.getUrl() + '/personalcenter/deletePartnershipShop',
									  data: {
										id: id,
										token:that.token
									  },
									  success: (res) => {
										list4.splice(index, 1)
										  _this.list4=list
									  }
									})
								  }
								}
							  })
							} else if (e_projectType === '5') { //招聘求职删除
						  uni.showModal({
							title: '',
							content: '确认删除这条发布',
							confirmColor:"#ffc140",
								success: res => {
								  if (res.confirm == true) {
									uni.request({
									  url: shoppublic.getUrl() + '/personalcenter/deleteStoreRecruitment',
									  data: {
										id: id,
										token:that.token
									  },
									  success: (res) => {
										list.splice(index, 1)
										  _this.list=_this.list
									  }
									})
								  }
								}
							  })
							} else if (e_projectType === '6') { //老店二手删除
							  uni.showModal({
								title: '',
								content: '确认删除这条发布',
								confirmColor:"#ffc140",
								success: res => {
								  if (res.confirm == true) {
									uni.request({
									  url: shoppublic.getUrl() + '/personalcenter/deleteSecondHandItem',
									  data: {
										id: id,
										token:that.token
									  },
									  success: (res) => {
										list.splice(index, 1)
										  _this.list=list
									  }
									})
								  }
								}
							  })
							}
						  },
			//旺铺转让
			  getList1() {
					let that = this;
					uni.request({
					  url: shoppublic.getUrl() + '/personalcenter/findlistOldShopTransfer',
					  data: {
						token:that.token
					  },
					  header: {
						'content-type': 'application/json' // 默认值
					  },
					  success: function(res) {
						   
						let resBody = res.data.responseBody;
						if (resBody) {
						  for (let i = 0; i < resBody.length; i++) {
							resBody[i].projectType = '1';
						  }
						   list = list.concat(resBody);
						}
						
							  that.list1=resBody
							  that.list=list
					  },
					})
				  },
					// 页面跳转至旺铺转让详情页
					toStoreMakeOverDateils(id){
						uni.navigateTo({
							url:"../../homePageModule/storeMakeOver/storeMakeOverDateils/storeMakeOverDateils?id=" + id
						})
					},
				   // 新铺租售
				  				  getList2() {
				  					let that = this;
				  					uni.request({
				  					  url: shoppublic.getUrl() + '/personalcenter/findlistNewShopRent',
				  					  data: {
				  						token:that.token
				  					  },
				  					  header: {
				  						'content-type': 'application/json' // 默认值
				  					  },
				  					  success: function(res) {
				  						   console.log(res)
				  						let resBody = res.data.responseBody;
				  						if (resBody) {
				  						  for (let i = 0; i < resBody.length; i++) {
				  							resBody[i].projectType = '2';
				  						  }
				  						  list = list.concat(resBody);
				  						}
				  					  that.list2=resBody
				  						that.list=list
				  					  },
				  					})
				  				  },
											// 页面跳转至新铺招租详情页
										toNewStoreRentalDateils(id){
											uni.navigateTo({
												url:"../../homePageModule/newStoreRental/newStoreRentalDateils/newStoreRentalDateils?id=" + id
											})
										},
					// 项目加盟
					 getList3() {
								let that = this;
								uni.request({
									url: shoppublic.getUrl() + '/personalcenter/findlistProjectJoin',
									data: {
										token: 13067
									},
									header: {
										'content-type': 'application/json' // 默认值
									},
									success: function(res) {
										console.log(res)
									
											that.list3=res.data.responseBody								
									},
								})
							},
									// 跳转项目详情
										toJoinInvestmentDetails(index,id){
												uni.navigateTo({
														url:'../../homePageModule/joinInvestment/joinInvestmentDetails/joinInvestmentDetails?key=' + index + '&id=' + id
													})
												},
			//合伙开店
			  getList4() {
						let that = this;
						uni.request({
						  url: shoppublic.getUrl() + '/personalcenter/findlistPartnershipShop',
						  data: {
							token:that.token
						  },
						  header: {
							'content-type': 'application/json' // 默认值
						  },
						  success: function(res) {
								   
							console.log(res)
							let resBody = res.data.responseBody;
					
							if (resBody) {
							  for (let i = 0; i < resBody.length; i++) {
								resBody[i].projectType = '4';
							  }
							  list = list.concat(resBody);
							}
							that.list4=resBody
							
						// 
							  
							  that.list=list
						
						  },
						})
					  },
						// 页面跳转至合伙开店详情页面
						toPartnerOpenStoreDateils(id,readnum){
							uni.navigateTo({
								url: '../../homePageModule/partnerOpenStore/partnerOpenStoreDateils/partnerOpenStoreDateils?id='+id +'&readnum=' + readnum,
								
							});
						},
					    // 招聘求职
					  getList5() {
						let that = this;
						uni.request({
						  url: shoppublic.getUrl() + '/personalcenter/findlistStoreRecruitment',
						  data: {
							token: that.token
						  },
						  header: {
							'content-type': 'application/json' // 默认值
						  },
						  success: function(res) {
							  console.log(res)
							let resBody = res.data.responseBody;
							if (resBody) {
							  for (let i = 0; i < resBody.length; i++) {
								resBody[i].projectType = '5';
							  }
							  list = list.concat(resBody);
							}
							  that.list5=resBody
							  that.list=list
						  },
						})
					  },
						//招聘详情
							toRecruitAndSeekDateils(id){
									
											uni.navigateTo({
												url:'../../homePageModule/recruitAndSeek/recruitAndSeekDateils/recruitAndSeekDateils?id=' + id
											})
						// 				}else if(e === '2'){
						// 					console.log(2);
						// 					uni.navigateTo({
						// 						url:'./recruitAndSeekDateils/recruitAndSeekDateils?id=' + id
						// 					})
						// 				}
									},
					  //老店二手
					    getList6() {
							let that = this;
							uni.request({
							  url: shoppublic.getUrl() + '/personalcenter/findlistSecondHandItem',
							  data: {
								token: that.token
							  },
							  header: {
								'content-type': 'application/json' // 默认值
							  },
							  success: function(res) {
								  console.log(res)
								let resBody = res.data.responseBody;
								if (resBody) {
								  for (let i = 0; i < resBody.length; i++) {
									resBody[i].projectType = '6';
								  }
								  list = list.concat(resBody);
								}
									that.list6=resBody
									that.list=list
							  },
							})
						  },
								// 跳转至二手物品详情
							toOldStoreTwoHandDateils(id){
								uni.navigateTo({
									url:"../../homePageModule/oldStoreTwoHand/oldStoreTwoHandDateils/oldStoreTwoHandDateils?id=" + id
								})
							},
				
			// 项目类型的点击事件
			maskBlock(e){
				var _this=this
				console.log(e.currentTarget.dataset.type);
				let count = 1;
				count++;
				if(e.currentTarget.dataset.type == "1"){
					if(count % 2 == 0){
						_this.releaseTypes=_this.releaseListed
						this.isMaskBlock = !this.isMaskBlock;
						this.isFontSize = !this.isFontSize;
					}
				}else if(e.currentTarget.dataset.type == "2"){
					if(count % 2 == 0){
						this.isNone = !this.isNone;
						this.isMaskBlock = !this.isMaskBlock;
						_this.releaseTypes=_this.releaseType
					}
				}else if(e.currentTarget.dataset.type == "3"){
					if(count % 2 == 0){
						this.isMaskBlock = !this.isMaskBlock;
					}
				}
				
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
	// 引入样式
	@import "mineRelease.scss";
</style>
