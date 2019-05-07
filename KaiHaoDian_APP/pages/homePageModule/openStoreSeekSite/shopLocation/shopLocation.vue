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
									<view class="details" v-for="(itemed,i) in items.List" :key='i'>
										{{itemed.value}}
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="buttons">
						<button type="primary">重置</button><button type="primary">确认</button>
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
				</scroll-view>
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
	export default {
		components: {
			ChooseLits,
			commonalityHeader,
			rate
		},
		data() {
			return {
				location:'',
				location_city:'',
				list: ['综合', '面积', '租金','地址','筛选'],
				arr: [
					['综合', '信用', '最新发布'],
					['10~20㎡', '10~20㎡', '50~100㎡','100㎡+'],
					['0~1000元/月', '1000~2000元/月', '3000~4000元/月','4000~5000元/月','4000~5000元/月','5000~6000元/月','7000+元/月'],
					[]
],
				i2: [0, 0, 0],
				chooseType:[
										{
										type:0,
										title:'店铺类型',
										List:[
														{
													  id: "0",
															value: "餐饮美食"
														},
														{
															id: "1",
															value: "美容保健"
														},
														{
															id: "2",
															value: "服饰鞋包"
														},
														{
															id: "3",
															value: "休闲娱乐"
														},
														{
															id: "4",
															value: "百货超市"
														},
														{
															id: "5",
															value: "生活服务"
														},
														{
															id: "6",
															value: "电器通讯"
														},
														{
															id: "7",
															value: "汽修服务"
														},
														{
															id: "8",
															value: "医疗器械"
														},
														{
															id: "9",
															value: "家居建材"
														},
														{
															id: "10",
															value: "教育"
														},
														{
															id: "11",
															value: "酒店宾馆"
														},
														{
															id: "12",
															value: "农业环保"
														},
														{
															id: "13",
															value: "母婴"
														},
														{
															id: "14",
															value: "网络服务"
														},
														{
															id: "15",
															value: "其他"
														}
													],
									},
									{
									type:1,
									title:'配套设施',
									List:[
										{
										id: "0",
										value: "商业街"
									},
									{
										id: "1",
										value: "写字楼"
									},
									{
										id: "2",
										value: "社区周边"
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
										value: "购物中心"
									},
									{
										id: "6",
										value: "其他"
									},
									],
										
									},
										{
									type:2,
									title:'配套设施',
										List:[
												{
													id: '0',
													value: "货梯"
												},
												{
													id: '1',
													value: "客梯"
												},
												{
													id: '2',
													value: "扶梯"
												},
												{
													id: '3',
													value: "空调"
												},
												{
													id: '4',
													value: "停车"
												},
												{
													id: '5',
													value: "网络"
												},
												{
													id: '6',
													value: "天然气"
												},
												{
													id: '7',
													value: "暖气"
												},
												{
													id: '8',
													value: "上水"
												},
												{
													id: '9',
													value: "下水"
												},
												{
													id: '10',
													value: "排污"
												},
												{
													id: '11',
													value: "排烟"
												},
												{
													id: '12',
													value: "380V"
												},
												{
													id: '13',
													value: "餐煤"
												},
												{
													id: '14',
													value: "可明火"
												},
												{
													id: '15',
													value: "外摆区"
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
							// _this.setLocation(res_p, res_c);
							// console.log('省', JSON.stringify(res_p));
							// console.log('市', JSON.stringify(res_c));
							_this.location_city = res_c[0].name;
						});
					}
				}
			});
			this.getAderss(610100)
		},
		methods:{
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
				for(var i=0;i<res.data.responseBody.length;i++){
					that.arr[3].push(res.data.responseBody[i].name)
				}
				
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
			chooseLike(i1) {
				if (this.i2[i1[0]] != i1[1]) {
					this.i2[i1[0]] = i1[1];
				}
				console.log(i1)
			},
		}
	}
</script>

<style lang="scss">
@import 'shopLocation.Scss'
</style>
