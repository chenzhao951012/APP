<template>
	<view class="content">
	
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray">确定
		 </mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm">
		 </mpvue-city-picker>
		<!-- 所在区域 -->
		
		<view class=" newShoprental">
			<view class="publishNewshop publishNewshop2">
				<view class="apply">
					<view class="tab">
						<SwiperNav :modelData='modelData' :initIndex='initIndex' @changed='changed'></SwiperNav>
					</view>
				</view>
				<view v-if="isSHow">
						<view class="titleBox titleBox2">
									<view>发布职位</view>
									<view>
										<input type="text" placeholder="填写招聘职位名称" placeholder-style='color:#b7b7b7;' maxlength="-1" v-model="title"/>
									</view>
								</view>
								<view class="titleBox titleBox2 titleBox3">
									<view>所属行业</view>
									<view>
										<view style="font-size: 28upx;color: #666666;" @click="industry" data-type="4">
											{{industrytext}}
										</view>
									</view>
								</view>
								<view class="titleBox titleBox2">
									<view>工作地点</view>
									<view>
										<input type="text" placeholder="填写招聘职位名称" placeholder-style='color:#b7b7b7;' maxlength="-1" v-model="detailedAddress"/>
									</view>
								</view>
								<view class="titleBox titleBox2">
									<view>联系电话</view>
									<view>
										<input type="text" placeholder="填写招聘职位名称" placeholder-style='color:#b7b7b7;' maxlength="-1" v-model="ThePhone"/>
									</view>
								</view>
							</view>
								
								<view class="publishNewshop" v-if="isSHow">
								<view class="titleBox titleBox2 titleBox3" style="border-bottom: 0;">
									<view>区域选择</view>
									<view style="font-size: 28upx;color: #666666;" @click="showMulLinkageThreePicker" data-type="1">
										{{pickerText1}}
									</view>
								</view>
								
							</view>
					</view>
						<view class=" newShoprental" v-if="isSHow">
							<view class="commodityinformation">
									<view class="type">
										<view>经验要求</view>
										<view @click="workingYear" data-type="2">{{typevalue}}</view>
									</view>
									<view class="type">
										<view>学历要求</view>
										<view data-type="3" @click="education">{{categorytext}}</view>
									</view>
									<view class="type" >
										<view>月薪期间</view>
										<view data-type="5" @click="currentstatus">{{currentstatutext}}</view>
									</view>
									
							</view>
							<view class="introduce">
								<view class="title">
									职位描述
								</view>
								<view class="introduceBox">
										<textarea placeholder="详细介绍下填写知职位需求~" placeholder-style='color:#666666;' maxlength="-1" auto-height v-model='describe'/>
								</view>
							</view>
							<view class="publishNewshop">
								<view class="titleBox titleBox2">
									<view>技能要求</view>
									<view>
										<input type="text" placeholder="" placeholder-style='color:#b7b7b7;' maxlength="-1" v-model="Skillsrequired"/>
									</view>
								</view>
								
							</view>
								<view class="introduce">
								<view class="title">
									团队介绍
								</view>
								<view class="introduceBox">
										<textarea placeholder="详细介绍下你的店铺,更加吸引选择方哦~" placeholder-style='color:#666666;' maxlength="-1" auto-height v-model='teamIntroduction'/>
								</view>
							</view>
							</view>
				</view>
			<!-- //求职 -->
				<view class="" v-if="isSHow2">
					<view class=" newShoprental" style="padding-top: 0;">
						<view class="publishNewshop publishNewshop2" style="border-radius: 0;">
							<view>
									<view class="titleBox titleBox2">
												<view>求职岗位</view>
												<view>
													<input type="text" placeholder="填写招聘职位名称" placeholder-style='color:#b7b7b7;' maxlength="-1" v-model="title"/>
												</view>
											</view>
											<view class="titleBox titleBox2 titleBox3">
												<view>所属行业</view>
												<view>
													<view style="font-size: 28upx;color: #666666;" @click="industry" data-type="4">
														{{industrytext}}
													</view>
												</view>
											</view>
											<view class="titleBox titleBox2">
												<view>居住地点</view>
												<view>
													<input type="text" placeholder="填写招聘职位名称" placeholder-style='color:#b7b7b7;' maxlength="-1" v-model="detailedAddress"/>
												</view>
											</view>
											<view class="titleBox titleBox2">
												<view>联系电话</view>
												<view>
													<input type="text" placeholder="填写招聘职位名称" placeholder-style='color:#b7b7b7;' maxlength="-1" v-model="ThePhone"/>
												</view>
											</view>
										</view>
											
											<view class="publishNewshop">
											<view class="titleBox titleBox2 titleBox3" style="border-bottom: 0;">
												<view>区域选择</view>
												<view style="font-size: 28upx;color: #666666;" @click="showMulLinkageThreePicker" data-type="1">
													{{pickerText1}}
												</view>
											</view>
											
										</view>
								</view>
									<view class=" newShoprental">
										<view class="commodityinformation">
												<view class="type">
													<view>行业经验</view>
													<view @click="workingYear" data-type="2">{{typevalue}}</view>
												</view>
												<view class="type">
													<view>我的学历</view>
													<view data-type="3" @click="education">{{categorytext}}</view>
												</view>
												<view class="type" >
													<view>期望薪资</view>
													<view data-type="5" @click="currentstatus">{{currentstatutext}}</view>
												</view>
												
										</view>
										<view class="introduce">
											<view class="title">
												自我描述
											</view>
											<view class="introduceBox">
													<textarea placeholder="详细介绍下自己特长以及爱好~" placeholder-style='color:#666666;' maxlength="-1" auto-height v-model='selfintroduction'/>
											</view>
										</view>
							
										
										</view>
							</view>
				</view>
	</view>
</template>

<script>
	
	import SwiperNav from '@/components/SlidingNavigation.vue';
		import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
		import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
		import cityData from '@/common/city.data.js';
	// end
		import ambitus from '@/common/ambitus.js';
	import Shopsituation from '@/common/partner.js';
		import shoppublic from '@/common/shoppublic'; //服务器地址
		// import getLocation from '@/common/getLocation.js'; //获取地理位置
	export default {
		components: {
			mpvuePicker,
			mpvueCityPicker,
			SwiperNav
		},
		 onNavigationBarButtonTap() {  
					this.issue()
				},
		data() {
			return {
				selfintroduction:'',
				isSHow:true,
				isSHow2:false,
				teamIntroduction:'',
				initIndex:0,
				indexs:'',
					modelData:[
					{
						id:0,
						lable:"招聘"
						
					},
					{
						id:1,
						lable:"求职"
					}
				],
			
				
				chosseAdress:'请选择',
		
				peiTaocheckArr:[],
				zhouBiancheckArr:[],
			imageUrl:shoppublic.getImageUrl(),
			collaborate:"",//合作说明
			partner:true,//合伙人
			detailedAddress:"",
			ThePhone:"",
			type2:"",
			area:"",//面积
			token:14651,
			type4:"",
			title:'',
			typevalue:"请选择",
			mulLinkageTwoPicker: cityData,
			cityPickerValueDefault: [0, 0, 0],
			themeColor: '#ffbd38', //主体颜色
			pickerText1: '请选择',
			pickerText2: '请选择',
			mode: '', //组件类型
			deepLength: 1, //几级联动
			pickerValueDefault: [0], //默认选中值
			pickerValueArray: [], //渲染数据
			shoppublic: shoppublic, //服务器地址
			 provinceName:'', // 选择省区 -名字
			 cityName:'', // 选择市区 - 名字
			 countyName:'', // 选择县区 -名字
			headline:"",
			choosePeople:[],
			 countycode:"",
			cityCode:"",
			provincecode:"",
			describe:"",
			ImgList:[],
			merchantList:[],
			Skillsrequired:'',
			status:1,
			merchants: [
			  { value: '0', label: "餐饮美食", checked: false, title: "cyms" },
			  { value: '1', label: "美容保健", checked: false, title: "mrbj" },
			  { value: '2', label: "服饰鞋包", checked: false, title: "fsxb" },
			  { value: '3', label: "休闲娱乐", checked: false, title: "xxyl" },
			  { value: '4', label: "百货超市", checked: false, title: "bhcs" },
			  { value: '5', label: "生活服务", checked: false, title: "shfw" },
			  { value: '6', label: "电器通讯", checked: false, title: "dqtx" },
			  { value: '7', label: "汽修服务", checked: false, title: "qxfw" },
			  { value: '8', label: "医疗器械", checked: false, title: "ylqx" },
			  { value: '9', label: "家居建材", checked: false, title: "jjjc" },
			  { value: '10', label: "教育", checked: false, title: "jy" },
			  { value: '11', label: "酒店宾馆", checked: false, title: "jdbg" },
			  { value: '12', label: "农业环保", checked: false, title: "nyhb" },
			  { value: '13', label: "母婴", checked: false, title: "my" },
			  { value: '14', label: "网络服务", checked: false, title: "wlfw" },
			  { value: '15', label: "其他", checked: false, title: "qt" }
			],
				categorytext:'请选择',
			categorytype:'',
			categorys:'',
			workingYears:[
				 { value: "0", label: "1-3年" },
				 { value: "1", label: "3-5年" },
				 { value: "2", label: "5年以上" }

			],
			minprice:'',
			maxprice:'',
			  dianpuleixing: [
				  { value: "0", label: "商业街商铺" },
				  { value: "1", label: "写字楼配套" },
				  { value: "2", label: "社区底商铺" },
				  { value: "3", label: "档口摊位" },
				  { value: "4", label: "临街门面" },
				  { value: "5", label: "购物中心" },
				  { value: "6", label: "其他" },
				],
				category:[
					 { value: "0", label: "不限" },
					{ value: "1", label: "大专" },
					{ value: "1", label: "本科" },
				],
				current:[
					 { value: "0", label: "1k~3k" },
					{ value: "1", label: "3k~6k" },
					{ value: "2", label: "4k~8k" },
					{ value: "3", label: "8k~12k" },
					{ value: "4", label: "12k~15k"},
					{ value: "5", label: "15k~20k"}
				],			
			allGoodsFilte:Shopsituation,
			zhouBian:ambitus,

				istextarea: false,
				  isShowChooseKaiShiTime: false,
					//行业类别
					industryed:'',
					industrytext:'请选择',
					industrytype:'',
					// 当前状态
					currentstatutext:'请选择',
					currentstatutype:'',
			
			};
		},
		onLoad() {
			
		},
		onBackPress() {
			
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel();
				return true;
			}
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
				return true;
			}
		},
		// 监听页面卸载
		onUnload() {
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel();
			}
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
			}
		},
		methods:{
			changed(index){
				if(index==0){
					
					this.status=1
					this.isSHow=true,
					this.isSHow2=false
					console.log(index)
				}else{
					this.isSHow=false,
					this.isSHow2=true
					this.status=2
					console.log(this.status)
				}
			},
			issue(){
				if(this.status==1){
					this.allrelease()
				}else if(this.status==2){
					this.allrelease2()
				}
			},
			allrelease2(){
						var warn=""
						var _this=this
						var data={
						token:_this.token,
						title: _this.title,
						phone: _this.ThePhone,
						type: _this.industrytype,
						typevalue: _this.industrytext,
						salarymin: _this.minprice,
						salarymax: _this.maxprice,
						post:_this.selfintroduction,
						province: _this.provincecode,
						provincevalue: _this.provinceName,
						city: _this.cityCode,
						cityvalue: _this.cityName,
						county: _this.countycode,
						countyvalue:_this.countyName,
						street: _this.detailedAddress,
						jobrequirements:_this.selfintroduction,
						urgent: 1,
						status:2		
				}
						if ( _this.title=='') {
							  warn = "正确填写职位！"
							} else if(_this.provincecode == "") {
							  warn = "请正确选择区域！"
							 
							} else if (_this.detailedAddress == "" || _this.detailedAddress === "0") {
							  warn = "请正确填写详细地址！"

							 
							} else if (_this.ThePhone.length != 11) {
							  warn = "手机号不能为空！"

							
							}
							else if (_this.industrytype == "") {
							  warn = "请正确选择新铺类型！"
							
							 
							}
							else if (_this.minprice == "") {
							  warn = "请选择薪资！"
							}
							else if (_this.selfintroduction == "") {
								warn = "请正确个人介绍！"
									}
								else{
								uni.request({
									url: shoppublic.getUrl() + '/storeRecruitment/addStoreRecruitment',
									data:data,
									 header: { "Content-Type": "application/x-www-form-urlencoded" },
									success: (res) => {
							if (res.data.msgCode == "1") {
								uni.showModal({
								 title: '提示',
								 content: '发布成功',
								 showCancel: false,
								 success(res) {
// 									setTimeout(()=>{
			// 						uni.navigateTo({
			// 						url: '../newStoreRental'
			// 								})
			// 							},2000)																													
												}
											})
																																					  } 		else {
												uni.showModal({
													  title: '提示',
													  content: '添加失败',
													  showCancel: false,
													  success(res) {
											 
									}
											})
																																										  }
													}
														});
															}
													uni.showToast({
														title:warn,
														duration:2000,
														icon:'none'
												})
																		
										},
						//发布公用函数
					allrelease(){
						var warn=""
							var _this=this
							var data={
							token:_this.token,
							title: _this.title,
							phone: _this.ThePhone,
							type: _this.industrytype,
							typevalue: _this.industrytext,
							salarymin: _this.minprice,
							salarymax: _this.maxprice,
							post:'',
							province: _this.provincecode,
							provincevalue: _this.provinceName,
							city: _this.cityCode,
							cityvalue: _this.cityName,
							county: _this.countycode,
							countyvalue:_this.countyName,
							street: _this.detailedAddress,
							jobrequirements: _this.describe,
							urgent: 1,
							status:2		
								}
							if ( _this.title=='') {
								  warn = "正确填写职位！"
								} else if(_this.provincecode == "") {
								  warn = "请正确选择区域！"
								 
								} else if (_this.detailedAddress == "" || _this.detailedAddress === "0") {
								  warn = "请正确填写详细地址！"

								 
								} else if (_this.ThePhone.length != 11) {
								  warn = "手机号不能为空！"

								
								} else if (_this.Maxrent == "") {
								  warn = "请正确填写最大店铺房租费！"
								  

								}
								else if (_this.type1 == "") {
								  warn = "请正确选择新铺类型！"
								
								 
								}
								else if (_this.minprice == "") {
								  warn = "请选择薪资！"
								} else if (_this.Skillsrequired == '') {
								  warn = "请填写技能要求 ！"
								 
								}
								else if (_this.teamIntroduction == "") {
									warn = "请正确填写团队介绍！"
																  
								teamIntroduction
																}
							else{
						
						uni.request({
							url: shoppublic.getUrl() + '/storeRecruitment/addStoreRecruitment',
							data:data,
							 header: { "Content-Type": "application/x-www-form-urlencoded" },
							success: (res) => {
								
							
								if (res.data.msgCode == "1") {
									uni.showModal({
									 title: '提示',
									 content: '发布成功',
									 showCancel: false,
									 success(res) {
// 									setTimeout(()=>{
// 									uni.navigateTo({
// 										url: '../newStoreRental'
// 													})
// 												},2000)																													
																																								  }
																																								})
																																							  } else {
																																								uni.showModal({
																																								  title: '提示',
																																								  content: '添加失败',
																																								  showCancel: false,
																																								  success(res) {
																												 
											}
																																								})
																																							  }
										}
											});
												}
										uni.showToast({
											title:warn,
											duration:2000,
											icon:'none'
									})
															
							},
							
			//新铺类型
			 workingYear(e) {
			
				  this.isShowChooseKaiShiTime=true,
				    // this.typevalue=this.dianpuleixing[0].value,
				  this.type= this.dianpuleixing[0].id,
				    this.deepLength = 1
					  this.pickerValueDefault = [0]
				  this.istextarea=true
				  this.$refs.mpvuePicker.show()
				  this.type = e.currentTarget.dataset.type
				  this.pickerValueArray = this.workingYears
				  this.mode = 'selector'
					console.log(this.typevalue, this.type)
				},
				//学历要求
				 education(e) {
				
					  this.isShowChooseKaiShiTime=true,
					    // this.categorys=this.dianpuleixing[0].value,
					  this.categorytype= this.dianpuleixing[0].id,
					    this.deepLength = 1
						  this.pickerValueDefault = [0]
					  this.istextarea=true
					  this.$refs.mpvuePicker.show()
					  this.type = e.currentTarget.dataset.type
					  this.pickerValueArray = this.category
					  this.mode = 'selector'
						console.log(this.typevalue, this.type)
					},
					 industry(e) {
							this.isShowChooseKaiShiTime=true,
							  // this.industryed=this.dianpuleixing[0].value,
							this.industrytype= this.dianpuleixing[0].id,
							 this.deepLength = 1
							this.pickerValueDefault = [0]
							this.istextarea=true
							this.$refs.mpvuePicker.show()
							this.type = e.currentTarget.dataset.type
							this.pickerValueArray = this.merchants
							this.mode = 'selector'	
							},
										//薪资期间
							currentstatus(e){
							 this.isShowChooseKaiShiTime=true,
								// this.currentstatutext=this.dianpuleixing[0].value,
							this.currentstatutype= this.dianpuleixing[0].id,
							  this.deepLength = 1
							  this.pickerValueDefault = [0]
							this.istextarea=true
							this.$refs.mpvuePicker.show()
							this.type = e.currentTarget.dataset.type
							this.pickerValueArray = this.current
							this.mode = 'selector'
							
										},
				//商品配套
				
	
				//三级联动
			  showMulLinkageThreePicker(e) {
				this.type = e.currentTarget.dataset.type
			    this.$refs.mpvueCityPicker.show()
			},
			//取消
			onCancel(e) {
				console.log(JSON.stringify(e.label));
			},
			//确定
			onConfirm(e) {
				let _this = this;
				console.log(JSON.stringify(e.label));
				if(this.type == "1"){
					console.log(	_this.pickerText1)
					_this.pickerText1 = e.label;
					_this.countycode=e.cityCode.countyCode
					_this.cityCode=e.cityCode.cityCode+'00'
					_this.provincecode=e.cityCode.provinceCode+'0000'
					let locations = e.label.split('-');
					_this.cityName= locations[1]
					let city_name = locations[locations.length - 1];
					_this.cityName= locations[1]
					_this.provinceName=locations[0];
					_this.countyName=locations[2];
					console.log(_this.provinceName,_this.cityName,_this.countyName,_this.provincecode,_this.cityCode,_this.countycode)
				}else if(this.type == "2"){
					_this.typevalue = e.label;
					this.type1=e.value
					console.log(_this.typevalue,e.value)
					
				}
				else if(this.type == "3"){
					_this.categorytext = e.label;
					_this.categorytype=e.value
					console.log(_this.categorytext,	_this.categorytype)
				}
				else if(this.type == "4"){
					_this.industrytext = e.label;
					_this.industrytype=e.value
					_this.merchantList.push(e.label)
					console.log(e)
					
				}
					else if(this.type == "5"){
					_this.currentstatutext = e.label;
					_this.currentstatutype=e.value
					_this.minprice=_this.currentstatutext.split('~')[0].split('k')[0]+'000'
					_this.maxprice=_this.currentstatutext.split('~')[1].split('k')[0]+'000'
					console.log(_this.minprice,_this.maxprice)
				}
				let location = e.label.split('-');
				let city_name = location[location.length - 1];
				console.log(city_name);
				// _this.startcreatview(city_name);
			},
			chooseIcon(tab){
				
				tab.bool = !tab.bool;//改变当前点击的元素的样式
			},
			assortStore(index,bool){
				this.assortList[index].bool = !this.assortList[index].bool;
			},
			periphery(index,bool){
				this.ambitusList[index].bool = !this.ambitusList[index].bool;
			}
		}
	}
</script>

<style lang="scss">
@import "./recruit.scss";
</style>
