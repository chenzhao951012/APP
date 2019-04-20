<template>
	<view class="content">
		<view class="enterBox">
			<view class="apply">
				<view class="tab">
					<SwiperNav :modelData='modelData' :initIndex='initIndex' @changed='changed'></SwiperNav>
				</view>
			</view>
			<view v-if="showindustry">
					<view class="information">
					<view class="category category2">
						<view>选择入驻行业</view>
						<view @click="Chooseindustry">{{industry}}<text  class="iconfont">&#xe616;</text></view>
					</view>
					<view class="category">
						<view>店铺名称</view>
						<view><input type="text" v-model="shopname"></view>
					</view>
					<view class="category">
						<view>申请人姓名</view>
						<view><input type="text" v-model="username"></view>
					</view>
					<view class="category">
						<view>申请人手机号</view>
						<view><input type="text" v-model="phone"></view>
					</view>
				</view>
				<view class="lins">
					
				</view>
				<view class="information">
					
					<view class="category">
						<view>店铺地址</view>
						<view><input type="text" v-model="site"></view>
					</view>
					<view class="category3">
						<view class="title">
							<view>营业执照</view>
							
						</view>
							<!-- // 营业执照上传 -->
						<view class="ImgBox">
							<view class="license">
								<view class="" v-for="(item,idx) in imgList" :key='idx'>
									<img :src="item" alt="">
									<text  class="iconfont" @click="deleImg(idx)">
									&#xe6a6;
								</text>
								</view>
									<view class="addImg" @click="addImg" v-if="ishwos">
									<text class="iconfont">
										&#xe649;
									</text>
								</view>
							</view>
							
						
						</view>
					</view>
				</view>
			</view>
		
			<!-- //品牌入驻 -->
			<view class="" v-if="!showindustry">
				<view class="information">
					<view class="category">
						<view>品牌名称</view>
						<view><input type="text"  v-model="info.brandname"  maxlength="300"></view>
					</view>
					<view class="category">
						<view>品牌龄</view>
						<view><input type="text" v-model="info.brandage"></view>
					</view>
					<view class="category">
						<view>加盟费</view>
						<view><input type="text" v-model="info.franchisefee"></view>
					</view>
					<view class="category">
						<view>加盟特色</view>
						<view><input type="text" v-model="info.characteristics"></view>
					</view>
					<view class="category">
						<view>现有门店</view>
						<view><input type="text" v-model="info.Existingstores"></view>
					</view>
					<view class="category">
						<view>总部地址</view>
						<view><input type="text" v-model="info.headquarteraddress"></view>
					</view>
				</view>
				<view class="lins">
					
				</view>
					<view class="information">
					<view class="category category2">
						<view>品牌特色</view>
						<view @click="Bcharacteristics(1)">{{accomplish}}<text v-if="showRight" class="iconfont">&#xe616;</text></view>
					</view>
					<view class="category category2">
						<view>品牌形象</view>
						<view @click="Bcharacteristics(2)">{{accomplish2}}<text v-if="showRight2" class="iconfont">&#xe616;</text></view>
					</view>
					<view class="category category2">
						<view>品牌展示</view>
						<view @click="brandshow">{{accomplish3}}<text  class="iconfont"  v-if="showRight3">&#xe616;</text></view>
					</view>
				</view>
				<view class="lins">
					
				</view>
					<view class="information">
					
					<view class="category4">
						<view>公司介绍</view>
						<view>
							<textarea value="" placeholder="" v-model="info.companyintroduction"/>
						</view>
					</view>
						<view class="category4">
						<view>服务优势</view>
						<view>
							<textarea value="" placeholder="" v-model="info.advantageservice"/>
						</view>
					</view>
						<view class="category4">
						<view>运营优势</view>
						<view>
							<textarea value="" placeholder="" v-model="info.Operatingadvantages"/>
						</view>
					</view>
						<view class="category4">
						<view>售后服务</view>
						<view>
							<textarea value="" placeholder="" v-model="info.aftersalesservice"/>
						</view>
					</view>
						<view class="category4">
						<view>总部支持</view>
						<view>
							<textarea value="" placeholder="" v-model="info.support"/>
						</view>
					</view>
					<view class="category3">
						<view class="title">
							<view>企业证书</view>
							
						</view>
							<!-- // 营业执照上传 -->
						<view class="ImgBox">
							<view class="license">
								<view class="" v-for="(item,idx) in imgList" :key='idx'>
									<img :src="item" alt="">
									<text  class="iconfont" @click="deleImg(idx)">
									&#xe6a6;
								</text>
								</view>
								<view class="addImg" @click="addImg" v-if="ishwos">
									<text class="iconfont">
										&#xe649;
									</text>
								</view>
							</view>
							
						
						</view>
					</view>
			</view>
			
			</view>
		</view>
		<view class="next" @click="nextstep">
			下一步
		</view>
	</view>
</template>

<script>
	import getLocation from '@/common/getLocation.js';
	import shoppublic from '@/common/shoppublic';
	import SwiperNav from '@/components/SlidingNavigation.vue';
	export default {
		data() {
			return {
				info:{
					brandname:'',//品牌名称
					brandage:'',//品牌年龄
					franchisefee:'',//加盟费
					characteristics:'',//加盟特色
					Existingstores:'',//现有门店
					headquarteraddress:'',//总部地址
					companyintroduction:'',//公司介绍
					advantageservice:'',//服务优势
					Operatingadvantages:'',//运营优势
					aftersalesservice:'',//售后服务
					support:'',//总部支持
				},
				accomplish3:'',
				showRight:true,
				showRight2:true,
				showRight3:true,
				accomplish2:'',
				imgListed:[],
				imgListed2:[],
				initIndex:0,
				accomplish:'',
				state:1,
				
				showindustry:true,
				industry:'',
				ishwos:true,
				imgList:[],
				imgList1:[],
				imgList2:[],
				imgList3:[],
				site:'',
				shopname:'',
				phone:'',
				username:'',
				isShow:true,
				modelData:[
					{
						id:0,
						lable:"供应商入驻"
						
					},
					{
						id:1,
						lable:"品牌入驻"
					}
				]
			};
		},
		components:{
			SwiperNav
		},
		onBackPress(){
// 		
// 		try {
// 			uni.removeStorageSync('imgList1');
// 		} catch (e) {
// 			
// 		}
// 		try {
// 			uni.removeStorageSync('imgList2');
// 		} catch (e) {
// 			
// 		}
// 			try {
// 			uni.removeStorageSync('imgList3');
// 		} catch (e) {
// 			
// 		}
		},
		onLoad(option) {
			getLocation.getLocation(function(res_p, res_c) {
				// _this.setLocation(res_p, res_c);
				// console.log('省', JSON.stringify(res_p));
				// console.log('市', JSON.stringify(res_c));
// 				_this.location_city = res_c[0].id;
// 				console.log(res_p, res_c)
			});
			var that=this
			console.log(this.imgListed2)
			uni.getStorage({
			key: 'imgList1',
			success: function (res) {
				that.imgList1=res.data
				if(res.data.length>0){
					that.accomplish='已完成'
					that.initIndex=1
					that.showindustry=false
					that.showRight=false
					that.state=2
				}
			}
		});
			uni.getStorage({
			key: 'imgList2',
			success: function (res) {
				console.log(res.data)
				that.imgList2=res.data
				if(res.data.length>0){
					that.accomplish2='已完成'
					that.initIndex=1
					that.showindustry=false
					that.showRight2=false
					that.state=2
				}
			}
		});
		uni.getStorage({
			key: 'inputvalue',
			success: function (res) {
				console.log(res.data)
				that.info=res.data
			}
		});
		uni.getStorage({
			key: 'imgList3',
			success: function (res) {
				console.log(res.data)
				that.imgList3=res.data
				if(res.data.length>0){
					that.accomplish3='已完成'
					that.initIndex=1
					that.showindustry=false
					that.showRight3=false
					that.state=2
				}
			}
		});
			this.industry=option.title
			
		},
		methods:{
			nextstep(){
				uni.navigateTo({
					url:"../../../agreement/agreement"
				})
// 				if(this.state==2){
// 					this.pulbish()
// 				}else{
// 					console.log('hah ')
// 				}
			},
			//招商发布
			pulbish(){
				var warn;
				var that=this
// 					var data={
// 					logo: tData.logo,
// 					token: token,
// 					title: tData.title,
// 					brands: tData.brands,
// 					mainProduct: tData.brandss,
// 					phone: tData.phone,
// 					type: typeid,
// 					typevalue: tData.typevalue,
// 					storeage: tData.storeage,
// 					storecount: tData.storecount,
// 					initialfee: tData.initialfee,
// 					province: province_id,
// 					provincevalue: provinceName,
// 					affiliatearea: tData.quyu,
// 					city: city_id,
// 					cityvalue: cityName,
// 					county: county_id,
// 					countyvalue: countyName,
// 					street: tData.street,
// 					service: tData.allGoodsFilte,
// 					videoaddress: tData.videourl,
// 					src: tData.imgsrc,
// 					// src:'321321',
// 					introduction: tData.introduction,
// 					dataarea: tData.dataarea, //推广时长
// 					area: tData.area, //推广范围
// 				}
				if(that.info.brandname==''){
					warn='品牌名称不能为空'
				}else if(that.info.brandage==''){
					warn='品牌年龄不能为空'
				}else if(that.info.franchisefee==''){
					warn='品加盟费用不能为空'
				}else if(that.info.characteristics==''){
					warn='加盟特色不能为空'
				}else if(that.info.Existingstores==''){
					warn='现有门店不能为空'
				}else if(that.info.headquarteraddress==''){
					warn='总部地址不能为空'
				}
				else if(that.info.companyintroduction==''){
					warn='公司介绍不能为空'
				}
				else if(that.info.advantageservice==''){
					warn='服务优势不能为空'
				}
				else if(that.info.Operatingadvantages==''){
					warn='运营优势不能为空'
				}
				else if(that.info.support==''){
					warn='总部技术支持不能为空'
				}else if(that.info.imgList.length<1){
					warn='至少添加一张企业证书照'
				}
				else if(that.info.imgList1.length<1){
					warn='至少添加一张品牌特色照'
				}
				else if(that.info.imgList2.length<1){
					warn='至少添加一张品牌形象照'
				}
				else if(that.info.imgList3.length<1){
					warn='至少添加一张品牌展示照'
				}
				else{
					 uni.request({
									url: shoppublic.getUrl() + '/projectJoin/addProjectJoin',
									data: data,
									header: {
									  'content-type': 'application/json' // 默认值
									},
									success: (res) => {
									  if (res.data.responseBody == null || res.data.responseBody == '') {
										
										uni.showModal({
										  title: '提示',
										  icon:'none',
										  content: '网络繁忙,请稍后重试'
										})
										return;
									  } else {
										console.log(1234)
										_project_id = res.data.responseBody
										console.info('res_idddd', res.data.responseBody)
										console.log(res)
										if (flag == true) {
										  wx.showModal({
											title: '提示',
											content: warn
										  })
										  return;
										  
										}
										this.xiadan();
									  }
									},
									fail: function(res) {
									  console.log("qqq")
									}
					
					})
				}
				 
			  uni.showToast({
			  	title: warn,
			  	icon:"none",
			  	duration: 2000
			  });
					},
					//下单
					release() {
						console.info(1);
						var that = this;
						uni.request({
						  url: shoppublic.getUrl() + '/PayProjectJoin/pay',
						  method: 'POST',
						  header: {
							'content-type': 'application/x-www-form-urlencoded'
						  },
						  data: {
							token: token,
							projectId: _project_id
						  },
						  success: function(res) {
							console.info('下单', res.data);
							prepay_id = res.data.prepay_id;
							console.log("统一下单返回 prepay_id:" + prepay_id);
							that.sign(prepay_id);
						  }
						})
			  },
			// 去展示页
			brandshow(){
				uni.navigateTo({
					url:'./brandShow/brandShow'
				})
			},
				//将input里的值存到本地
			SetStorage(){
					var that=this
			
				var data={
						brandname:that.info.brandname,//品牌名称
						brandage:that.info.brandage,//品牌年龄
						franchisefee:that.info.franchisefee,//加盟费
						characteristics:that.info.characteristics,//加盟特色
						Existingstores:that.info.Existingstores,//现有门店
						headquarteraddress:that.info.headquarteraddress,//总部地址
						companyintroduction:that.info.companyintroduction,//公司介绍
						advantageservice:that.info.advantageservice,//服务优势
						Operatingadvantages:that.info.Operatingadvantages,//运营优势
						aftersalesservice:that.info.aftersalesservice,//售后服务
						support:that.info.aftersalesservice,//总部支持
						}
					uni.setStorage({
								key: 'inputvalue',
								data: data,
								success: function () {
								console.log('success');
									
								}
						});
			},
			// 品牌特色跳转
			Bcharacteristics(type){
						this.SetStorage()
						uni.navigateTo({
						url:'./brandcharacteristics/brandcharacteristics?type='+type
					})
				
				},
			// 行业选择
			Chooseindustry(){
				this.SetStorage()
				uni.navigateTo({
					url:'./Selectindustry/Selectindustry'
				})
			},
		// 图片删除
		deleImg(index){
			
			this.imgList.splice(index,1)
			this.ishwos=true
		},
			//图片上传
			addImg(){
				var that=this
				if(that.imgList.length<3){
							uni.chooseImage({
						count: 3,
						sourceType: ['album'],
						success: function (res) {
							uni.getImageInfo({
								src: res.tempFilePaths[0],
								success: function (image) {
									that.imgList.push(res.tempFilePaths[0]);
									if(that.imgList.length>2){
										that.ishwos=false
									}else{
										that.ishwos=true
									}
								}
							});
						}
					});
					
					
					}else{
					uni.showToast({
					title: '图片至多上传三张',
					icon:"none",
					duration: 2000
				});
				}
				
		
			},
	
				changed(index){
					if(index==0){
						this.showindustry=true
						this.state=1
					}else{
						this.showindustry=false
						this.state=2
					}
				},
				goauthentication(){
					uni.navigateTo({
						url:'Applicationin/Applicationin'
					})
				},
				//供应商入驻
				Supplierentry(){
					var that=this
					if(that.industry==''){
							uni.showToast({
							title: '入驻行业不能为空',
							icon:"none",
							duration: 2000
						});
					}else if(that.shopname==''){
							uni.showToast({
							title: '店铺名称不能为空',
							icon:"none",
							duration: 2000
						});
					}else if(that.username==''){
							uni.showToast({
							title: '申请人姓名不能为空',
							icon:"none",
							duration: 2000
						});
					}else if(that.phone==''){
							uni.showToast({
							title: '申请人手机号不能为空',
							icon:"none",
							duration: 2000
						});
					}else if(that.site==''){
							uni.showToast({
							title: '地址不能为空',
							icon:"none",
							duration: 2000
						});
					}else if(that.imgList.length<1){
							uni.showToast({
							title: '营业执照至少上传一张',
							icon:"none",
							duration: 2000
						});
					}else{
						uni.request({
							url: 'https://www.example.com/request', //仅为示例，并非真实接口地址。
							data: {
								text: 'uni.request'
							},
							header: {
								'custom-header': 'hello' //自定义请求头信息
							},
							success: (res) => {
								console.log(res.data);
								
								uni.showToast({
									title: '上传成功',
									icon:"none",
									duration: 2000
								});
							}
						});
						
					}
					
				},
				// 品牌入驻
				brands(){
					
				},
				//下一步
				submitInfo(){
					var that=this
					if(that.state==1){
						that.Supplierentry();
					}else if(that.state==2){
						console.log(12)
					}
				}
			},
		}
</script>

<style lang="scss">
@import 'Applicationin.scss'
</style>
