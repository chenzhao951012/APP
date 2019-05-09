<template>
	<view>
	<view class="content">
		<commonalityHeader>
			<view class="header">
				<ChooseLits :list="list" :arr="arr" @chooseLike="chooseLike">
					<!-- 左侧栏// -->
					<view class="Box">
					<view class="storetype">
						<view class="" v-for="(items,idx) in chooseType" :key='idx'>
							<view class="store">
									<view class="storeHeader">
										<view>{{items.title}}</view>
										<view><text class="iconfont">&#xe74a;</text></view>
								</view>
								<view class="storeBody">
									<view class="details" v-for="(itemed,i) in items.List" :key='i' :class="{details2:itemed.isshow==1}" @click.stop="selectivetype(idx,i)">
										{{itemed.value}}
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="buttons">
						<button type="primary" @click.stop="replacement">重置</button><button type="primary" @click="confirms">确认</button>
					</view>
						</view>
				</ChooseLits>
				
			</view>
			<view class="excellent">
				<view class="title">
					优选地址
				</view>
				<scroll-view scroll-x class="imgBox">
					<view class="imgBox">
			<img src="https://ss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=3660968530,985748925&fm=191&app=48&size=h300&n=0&g=4n&f=JPEG?sec=1853310920&t=5e64af964be378c6c2a3b0acc65dfe24" alt="">
					<view class="titles">
						优质店铺
					</view>
					<view style="margin-left: -10upx;">
						<rate value="3.5" disabled="true" margin='5' size='18'></rate>
					</view>
			</view>
					<view class="imgBox">
			<img src="https://ss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=3660968530,985748925&fm=191&app=48&size=h300&n=0&g=4n&f=JPEG?sec=1853310920&t=5e64af964be378c6c2a3b0acc65dfe24" alt="">
					<view class="titles">
						优质店铺
					</view>
					<view style="margin-left: -10upx;">
						<rate value="3.5" disabled="true" margin='5' size='18'></rate>
					</view>
			</view>
						<view class="imgBox">
			<img src="https://ss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=3660968530,985748925&fm=191&app=48&size=h300&n=0&g=4n&f=JPEG?sec=1853310920&t=5e64af964be378c6c2a3b0acc65dfe24" alt="">
					<view class="titles">
						优质店铺
					</view>
					<view style="margin-left: -10upx;">
						<rate value="3.5" disabled="true" margin='5' size='18'></rate>
					</view>
			</view>
				</scroll-view>
			</view>
			<!-- 推荐地址-->
			<view class="recommend">
				<view class="recommendHeader">
					<view>推荐地址</view>
					<view>更多推荐<text class="iconfont">&#xe616;</text></view>
				</view>
				<view class="recommendBody" v-for="(items,idx) in information" :key='idx'  @click="particulars(idx,items.id)">
					<view class="recommendBox">
						<view class="Imgboxs">
							<img :src="items.src" alt="">
						</view>
						<view class="recommendBoxRight">
							<view class="" style="width: 62%;">
									<view class="titlese"><text class="iconfont">&#xe694;</text><text class="">{{items.cityvalue}}{{items.countyValue}}{{items.street}}</text></view>
									<view class="synthesize">
										<view class="area">
											<view><text class="iconfont">&#xe684;</text><text>{{items.rentMax}}元/月</text></view>
											<view><text class="iconfont">&#xe683;</text><text>{{items.areaMax}}㎡</text></view>
										</view>
										<view class="matched-degree">
											<view>匹配度</view>
											<view>{{items.proportion}}%</view>
										</view>
									</view>
								
								<view class="browse">
								该店配置齐全
								</view>
							</view>
						
						</view>
						
					</view>
				</view>
				
			</view>
		</commonalityHeader>
	</view>
	</view>
</template>
<script>
	 import rate from '@/components/rate/uni-rate.vue'
		import commonalityHeader from '@/components/commonalityHeader/commonalityHeader';
		import ChooseLits from '@/components/choose-Cade/choose-Cade.vue';
		import getLocation from '@/common/getLocation.js'; //获取地理位置
		import shoppublic from '@/common/shoppublic'; //服务器地址
		var _self, page = 1, timer = null;
	export default {
		components: {
			ChooseLits,
			commonalityHeader,
			rate,
		},
		data() {
			return {
				current:-1,
				information:'',
				location:'',
				location_city:'',
				list: ['综合', '面积', '租金','地址','筛选'],
				arr: [
					['综合', '信用', '最新发布'],
					['10~20㎡', '20~50㎡', '60~100㎡','100㎡+'],
					['0~1000元/月', '1000~2000元/月', '3000~4000元/月','4000~5000元/月','4000~5000元/月','5000~6000元/月','7000+元/月'],	
					[]
],
				i2: [0, 0, 0],
				areaMin:'',
				areaMax:'',
				rentMin:'',
				rentMax:'',
				adressLIst:[],
				province:610000,
				provinceValue:'陕西省',
				city:610100,
				cityValue:'西安市',
				typeValue:'',//商业街铺
				industryValue:'',//餐饮美食
				support:'',//类型
				typeValue2:'',//商业街铺
				industryValue2:'',//餐饮美食
				support2:'',//类型
				lastInx:0,
				lastI:0,
				lastInx1:1,
				lastI1:0,
				lastInx2:2,
				lastI2:0,
				chooseType:[
										{
										type:0,
										title:'店铺类型',
										List:[
														{
													  id: "0",
															value: "餐饮美食",
															isshow:0
														},
														{
															id: "1",
															value: "美容保健",
															isshow:0
														},
														{
															id: "2",
															value: "服饰鞋包",
															isshow:0
														},
														{
															id: "3",
															value: "休闲娱乐",
															isshow:0
														},
														{
															id: "4",
															value: "百货超市",
															isshow:0
														},
														{
															id: "5",
															value: "生活服务",
															isshow:0
														},
														{
															id: "6",
															value: "电器通讯",
															isshow:0
														},
														{
															id: "7",
															value: "汽修服务",
															isshow:0
														},
														{
															id: "8",
															value: "医疗器械",
															isshow:0
														},
														{
															id: "9",
															value: "家居建材",
															isshow:0
														},
														{
															id: "10",
															value: "教育",
															isshow:0
														},
														{
															id: "11",
															value: "酒店宾馆",
															isshow:0
														},
														{
															id: "12",
															value: "农业环保",
															isshow:0
														},
														{
															id: "13",
															value: "母婴",
															isshow:0
														},
														{
															id: "14",
															value: "网络服务",
															isshow:0
														},
														{
															id: "15",
															value: "其他",
															isshow:0
														}
													],
									},
									{
									type:1,
									title:'配套设施',
									List:[
										{
										id: "0",
										value: "商业街",
										isshow:0
									},
									{
										id: "1",
										value: "写字楼",
										isshow:0
									},
									{
										id: "2",
										value: "社区周边",
										isshow:0
									},
									{
										id: "3",
										value: "档口摊位",
										isshow:0
									},
									{
										id: "4",
										value: "临街门面",
										isshow:0
									},
									{
										id: "5",
										value: "购物中心",
										isshow:0
									},
									{
										id: "6",
										value: "其他",
										isshow:0
									},
									],
										
									},
										{
									type:2,
									title:'配套设施',
										List:[
												{
													id: '0',
													value: "货梯",
													isshow:0
												},
												{
													id: '1',
													value: "客梯",
													isshow:0
												},
												{
													id: '2',
													value: "扶梯",
													isshow:0
												},
												{
													id: '3',
													value: "空调",
													isshow:0
												},
												{
													id: '4',
													value: "停车",
													isshow:0
												},
												{
													id: '5',
													value: "网络",
													isshow:0
												},
												{
													id: '6',
													value: "天然气",
													isshow:0
												},
												{
													id: '7',
													value: "暖气",
													isshow:0
												},
												{
													id: '8',
													value: "上水",
													isshow:0
												},
												{
													id: '9',
													value: "下水",
													isshow:0
												},
												{
													id: '10',
													value: "排污",
													isshow:0
												},
												{
													id: '11',
													value: "排烟",
													isshow:0
												},
												{
													id: '12',
													value: "380V",
													isshow:0
												},
												{
													id: '13',
													value: "餐煤",
													isshow:0
												},
												{
													id: '14',
													value: "可明火",
													isshow:0
												},
												{
													id: '15',
													value: "外摆区",
													isshow:0
												}
													],
									}
									
				]
			};
			
		},	
		onLoad() {
			
			var _this=this
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
					_this.location_city = res.data.city_name;
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
							console.log(res_c[0].name,res_c[0].id)
							// _this.setLocation(res_p, res_c);
							// console.log('省', JSON.stringify(res_p));
							// console.log('市', JSON.stringify(res_c));
							_this.location_city = res_c[0].id;
						});
					}
				}
			});
			this.getAderss(610000)
			this.inquire();
		},
		methods:{
			//确定按钮
			confirms(){
				this.typeValue2=this.typeValue
				this.industryValue2=this.industryValue
				this.support2=this.support
				this.inquire()
			},
			//重置按钮
			replacement(){
				this.chooseType[this.lastInx].List[this.lastI]['isshow'] =  0
				this.chooseType[this.lastInx1].List[this.lastI1]['isshow'] = 0
				this.chooseType[this.lastInx2].List[this.lastI2]['isshow'] = 0
			},
		selectivetype(idx,i){
				if(idx == this.lastInx){
					this.chooseType[this.lastInx].List[this.lastI]['isshow'] = 0;
					this.chooseType[this.lastInx].List[i]['isshow'] = 1;
					this.lastI = i;
					this.industryValue=this.chooseType[idx].List[i].value
				}else if(idx == this.lastInx1){
					this.chooseType[this.lastInx1].List[this.lastI1]['isshow'] = 0;
					this.chooseType[this.lastInx1].List[i]['isshow'] = 1;
					this.lastI1 = i;
					this.typeValue=this.chooseType[idx].List[i].value
					console.log(idx)
				}else if(idx == this.lastInx2){
					this.chooseType[this.lastInx2].List[this.lastI2]['isshow'] = 0;
					this.chooseType[this.lastInx2].List[i]['isshow'] = 1;
					this.lastI2 = i;
					this.support=this.chooseType[idx].List[i].value + '|'
				
				}
				
			
				
			},
			// 查询
			 // 提交
				inquire() {
						var that = this;
						var data = {
							token:132,
							areaMin:that.areaMin,
							areaMax:that.areaMax,
							rentMin:that.rentMin,
							rentMax:that.rentMax,
							province:610000,
							provinceValue:'陕西省',
							city:that.city,
							cityValue:that.cityValue,
							County:'',
							countyvalue:'',
							support:that.support2,
							typeValue:that.typeValue2,
							industryValue:that.industryValue2
						};
								uni.request({
									url: shoppublic.getUrl() + '/KaiDian/searchAddress',
									data: data,
									method: "POST",
									header: {
										"Content-Type": "application/x-www-form-urlencoded"
									},
									success: function(res) {
										console.log(res)
										if(res.data.responseBody==null){
											console.log(12)
											uni.showToast({
												title:'暂无找到相关数据',
												icon:'none',
												duration:2000
											})
										that.city=610100
										that.cityValue='西安市'
										}
										
										if(res && res.data && res.data.responseBody && res.data.responseBody.shopAddressInfo){
											that.information=res.data.responseBody.shopAddressInfo
										}
									},
									fall: function(res) {
									
									}
								})
						

					},
					//详情跳转
					particulars(index,id){
						if(this.information[index].type=='1'){
								uni.navigateTo({
								url:'../../storeMakeOver/storeMakeOverDateils/storeMakeOverDateils?id='+id
							})
						}else{
								uni.navigateTo({
							url:'../../newStoreRental/newStoreRentalDateils/newStoreRentalDateils?id='+id
						})
					}
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
					that.adressLIst=res.data.responseBody
				for(var i=0;i<res.data.responseBody.length;i++){
					that.arr[3].push(res.data.responseBody[i].name)
				}
				var county = res.data.responseBody;
				var aa = {
				  name: "全部",
				  pid: "id",
				  id: ''
				};
			
				//county.reverse();
				//county.push(aa);
				//county.reverse();
			   
				 
			   
			  },
			  fail: function(res) {
			  }
			})
			},
			chooseLike(i1) {
			if(i1[0]==1){
				var that = this;
				var name=this.arr[1][i1[1]].replace(/^(\d+)~{0,1}(\d+){0,1}㎡\+?$/ , function(v , v1 , v2){
					if(v1){
							that.areaMin= v1;	
					}
					if(v2){
							that.areaMax= v2;	
					}else{
							that.areaMax= v1+100;
							that.areaMin= v1;	
					}
				})
				console.log(this.areaMin , this.areaMax)
			}else	if(i1[0]==2){
				var that = this;
				var name=this.arr[2][i1[1]].replace(/^(\d+)\+{0,1}~{0,1}(\d+){0,1}元\/月$/ , function(v , v1 , v2){
					if(v1){
							that.rentMin= v1;	
					}
					if(v2){
							that.rentMax= v2;	
					}else{
							that.rentMin= v1+100;
							that.rentMax= v1;	
					}
				})
					
			}else	if(i1[0]==3){
				var that = this;
				that.city=that.adressLIst[i1[1]].id
				that.cityValue=that.adressLIst[i1[1]].name+'市'
				console.log(that.city,that.cityValue)
			}
			this.inquire()
				}
		}
	}
</script>

<style lang="scss">
	.newslist{padding:10px; line-height:60px; font-size:28px;}
.loading{text-align:center; line-height:80px;}
@import 'shopLocation.Scss'
</style>
