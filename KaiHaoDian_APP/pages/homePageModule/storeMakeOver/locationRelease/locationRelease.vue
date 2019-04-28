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
			<view class="publishNewshop">
				<view class="titleBox titleBox2">
					<view>介绍标题</view>
					<view>
						<input type="text" placeholder="给你店铺起个响亮的标题吧" placeholder-style='color:#666666;' maxlength="-1" v-model="title"/>
					</view>
				</view>
				
			</view>
				<view class="introduce">
				<view class="title">
					店铺介绍
				</view>
				<view class="introduceBox">
						<textarea placeholder="详细介绍下你的店铺,更加吸引选择方哦~" placeholder-style='color:#666666;' maxlength="-1" auto-height v-model='describe'/>
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
			<view class="publishNewshop">
				<view class="titleBox titleBox2" style="border-bottom: 0;">
					<view>详细地址</view>
					<view>
						<input type="text" placeholder="" placeholder-style='color:#666666;' maxlength="-1" v-model="detailedAddress"/>
					</view>
				</view>
				
			</view>
				<view class="publishNewshop">
				<view class="titleBox titleBox2" style="border-bottom: 0;">
					<view>联系电话</view>
					<view>
						<input type="text" placeholder="" placeholder-style='color:#666666;' maxlength="-1" v-model="ThePhone"/>
					</view>
				</view>
				
			</view>
	</view>
		<view class=" newShoprental">
			<view class="publishNewshop">
				<view class="titleBox titleBox2">
					<view>店铺面积</view>
					<view>
						<input type="text" placeholder="" placeholder-style='color:#666666;' maxlength="-1" v-model="Maxarea"/>
					</view>
				</view>
			</view>
			<view class="publishNewshop">
				<view class="titleBox titleBox2">
					<view>月营业额</view>
					<view>
						<input type="text" placeholder="" placeholder-style='color:#666666;' maxlength="-1" v-model="turnover"/>
					</view>
				</view>
			</view>
			<view class="publishNewshop">
				<view class="titleBox titleBox2">
					<view>月租金</view>
					<view>
						<input type="text" placeholder="" placeholder-style='color:#666666;' maxlength="-1" v-model="Maxrent"/>
					</view>
				</view>
				
			</view>
				<view class="publishNewshop" style="border-bottom: 0;">
				<view class="titleBox titleBox2">
					<view>转让费</view>
					<view>
						<input type="text" placeholder="" placeholder-style='color:#666666;' maxlength="-1" v-model="fees"/>
					</view>
				</view>
			</view>
	</view>
		<view class=" newShoprental">
			<view class="commodityinformation">
					<view class="type">
						<view>店铺类型</view>
						<view @click="xipuleixing" data-type="2">{{typevalue}}</view>
					</view>
					<view class="type">
						<view>转让类别</view>
						<view data-type="3" @click="categoryed">{{categorytext}}</view>
					</view>
					<view class="type" >
						<view>当前行业</view>
						<view data-type="4" @click="industry">{{industrytext}}</view>
					</view>
					<view class="type">
						<view>当前状态</view>
						<view @click="currentstatus" data-type="5">{{currentstatutext}}</view>
					</view>
			</view>
			</view>
			<!-- //图片展示 -->
					<view class=" newShoprental">
				<view class="picturepresentation">
					<view class="title">图片展示</view>
						<view class="ImgBox">
								<view class="ImgBox2" v-for="(item,idx) in imgsrc" :key='idx'>
								<img :src="imageUrl + item" alt="">
							<view class="iconfont" @click="deleImg(idx)">
								&#xe68e;
							</view>
							</view>
							<view class="addImg" @click="addImg" v-if="isShowaddImg">
								<text class="iconfont">&#xe649;</text>
							</view>
						</view>
				</view>
				</view>
					<!-- //合伙人需求 -->
				<view class="_assort_store" style="border-bottom: 2upx solid #eeeeee;margin-bottom: 40upx;">
		 	<view class="_assort_title">合伙人需求</view>
		 	<view class='peitao_r'>
		 	  <view class='faBuInPut padding0'>
		 	    <view class="choose">
		 	      <view class='nav '>
		 	        <view class='nav-list '>
		 			   <checkbox-group @change="serviceValChange">
		 			    <block v-for="(item , index) in allGoodsFilte" :key="index">
		 			      <view class='navigator'>
		 			        <label class="checkbox">
		 			          <view v-if="!item.checked">
		 			            <checkbox :value="item.value" hidden='false ' :checked="item.checked" />
		 			           <image :src="imageUrl + item.url"></image>
		 			            <view style='font-size:28rpx; color:#999;height:28rpx;'>{{item.name}}</view>
		 			          </view>
		 			          <view class="is_checked" v-if="item.checked">
		 			            <checkbox :value="item.value" hidden='false ' :checked="item.checked" />
		 			             <image :src="imageUrl + item.url1"></image>
		 			            <view style='font-size:28rpx; color:#2F86FF;height:28rpx;'>{{item.name}}</view>
		 			          </view>
		 			        </label>
		 			      </view>
		 			    </block>
		 			  </checkbox-group>
		 	        </view>
		 	      </view>
		 	    </view>
		 	  </view>
		 	
		</view>
				</view>
				<!-- /周边选址 -->
				<view class="_assort_store">
		 	<view class="_assort_title">周边状况</view>
		 	<view class='peitao_r'>
		 	  <view class='faBuInPut'> 
		 	    <view class="choose">
		 	      <view class='nav '>
		 	        <view class='nav-list'>
		 	          <checkbox-group @change="zhouBian1">
		 	            <block v-for="(item , index) in zhouBian" :key="index">
		 	              <view class='navigator'>
		 	                <label class="checkbox">
		 	                  <view v-if="!item.checked">
		 	                    <checkbox :value="item.value" hidden='false ' :checked="item.checked" />
		 	                   <image :src="imageUrl + item.url"></image>
		 	                    <view style='font-size:28rpx; color:#999;height:28rpx;'>{{item.name}}</view>
		 	                  </view>
		 	                  <view class="is_checked" v-if="item.checked">
		 	                    <checkbox :value="item.value" hidden='false ' :checked="item.checked" />
		 	                     <image :src="imageUrl + item.url1"></image>
		 	                    <view style='font-size:28rpx; color:#2F86FF;height:28rpx;'>{{item.name}}</view>
		 	                  </view>
		 	                </label>
		 	              </view>
		 	            </block>
		 	          </checkbox-group>
		 	        </view>
		 	      </view>
		 	    </view>
		 	  </view>
		 	</view>
		</view>
	</view>
</template>

<script>
		import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
		import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
		import cityData from '@/common/city.data.js';
		import sunsinUpimg  from'../../../components/sunsin-upimg/sunsin-upimg.vue'
	// end
		import ambitus from '@/common/ambitus.js';
	import Shopsituation from '@/common/partner.js';
		import shoppublic from '@/common/shoppublic'; //服务器地址
		// import getLocation from '@/common/getLocation.js'; //获取地理位置
	export default {
		components: {
			mpvuePicker,
			mpvueCityPicker
		},
		 onNavigationBarButtonTap() {  
						this.allrelease()
				},
		data() {
			return {
				fees:'',//转让费
				turnover:'',//营业额
				merchantsed:[{"value":"0","name":"餐饮美食","checked":false,"title":"cyms"},{"value":"1","name":"美容保健","checked":false,"title":"mrbj"},{"value":"2","name":"服饰鞋包","checked":false,"title":"fsxb"},{"value":"3","name":"休闲娱乐","checked":false,"title":"xxyl"},{"value":"4","name":"百货超市","checked":false,"title":"bhcs"},{"value":"5","name":"生活服务","checked":false,"title":"shfw"},{"value":"6","name":"电器通讯","checked":false,"title":"dqtx"},{"value":"7","name":"汽修服务","checked":false,"title":"qxfw"},{"value":"8","name":"医疗器械","checked":false,"title":"ylqx"},{"value":"9","name":"家居建材","checked":false,"title":"jjjc"},{"value":"10","name":"教育","checked":false,"title":"jy"},{"value":"11","name":"酒店宾馆","checked":false,"title":"jdbg"},{"value":"12","name":"农业环保","checked":false,"title":"nyhb"},{"value":"13","name":"母婴","checked":false,"title":"my"},{"value":"14","name":"网络服务","checked":false,"title":"wlfw"},{"value":"15","name":"其他","checked":false,"title":"qt"}],
				isShowaddImg:true,
				indexs:'',
				imgsrc:[],
				 pics: [],
				 width: "",
				chosseAdress:'请选择',
				flag:false,
				isCheck:false,
				peiTaocheckArr:[],
				zhouBiancheckArr:[],
		imageUrl:shoppublic.getImageUrl(),
			collaborate:"",//合作说明
			partner:true,//合伙人
			detailedAddress:"",
			ThePhone:"",
			type2:"",
			area:"",//面积
			Minarea:"",
			Maxarea:"",
			Minrent:"",
			Maxrent:"",
			token:14651,
			type4:"",
			title:'',
			typevalue:"请选择",
			imgListurl:[],//本地图片数组
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
					 { value: "0", label: "整转" },
					{ value: "1", label: "空转" },
				],
				current:[
					 { value: "0", label: "空置中" },
					{ value: "1", label: "经营中" },
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
			// 图片删除
			deleImg(index){
			if(this.ImgList.length<4){
					console.log(2)
					this.isShowaddImg=true
				}
				this.ImgList.splice(index,1)
				this.imgsrc.splice(index,1)
				console.log(this.imgsrc)
			},
				// 添加图片
			addImg(){
				var that=this
				 var pics = that.pics
				  var imgsrc = that.imgsrc;
				  
				uni.chooseImage({
				count:5,
				 sizeType: ['original', 'compressed'],
				sourceType: ['album','camera'],
				success: function (res) {
					uni.getImageInfo({
						src: res.tempFilePaths[0],
						success: function (image) {
						  var imgSrc = res.tempFilePaths
							 that.pics=imgSrc
							that.ImgList.push(res.tempFilePaths[0])
							if(that.ImgList.length>2){
								that.isShowaddImg=false
							}
							
							let width = that.width;
								for (var i = 0; i <= that.pics.length; i++) {
								width = 120 * that.pics.length + 200;
								}
								  that.width=width
								   for (var i = 0; i < imgSrc.length; i++) {
								  var j = {};
								  uni.uploadFile({
									url: shoppublic.getUrl() + '/uploadimage', //仅为示例，非真实的接口地址
									filePath: imgSrc[i],
									name: 'file',
									success: function(res) {
									  console.log(res);
									  j.url = JSON.parse(res.data).url;
									  console.log(j.url)
										that.imgsrc=that.imgsrc.concat(j.url)
									  console.log(that.imgsrc);
									}
								  })
								}
								}
					});
				}
			});
			},
				isshows(){
							this.isCheck=!this.isCheck
						},
						//加急发布
						 toJiaJiFaBu: function (e) {
							var that = this,
								urgent,
								integral;
							uni.request({
									  url: shoppublic.getUrl() + '/common/checkPoints',
									  data: {
										token: that.token
									  },
									  success(res) {
										urgent = res.data.responseBody.flag;
										integral = res.data.responseBody.integral;
										uni.showModal({
										  title: '提示',
										  content: "紧急发布每次需扣除" + integral + "积分！",
										  success(res) {
											if (res.confirm) {
											  that.allrelease(2, urgent);
											} else if (res.cancel) {
			
											}
			
										  },
			
										})
			
									  }
							})
			},
								//发布
						release(){
							this.allrelease(1)
						},
						//发布公用函数
						allrelease(){
						var warn=""
							var _this=this						
									var data={
										token: _this.token,
										title: _this.title,
										phone:  _this.ThePhone,
										area: _this.Maxarea,
										rent:_this.Maxrent,
										province: _this.provincecode,
										provincevalue: _this.provinceName,
										city: _this.cityCode,
										cityvalue: _this.cityName,
										county: _this.countycode,
										countyvalue:_this.countyName,
										street:_this.detailedAddress,
										supporting: JSON.stringify(_this.allGoodsFilte),
										around: JSON.stringify(_this.zhouBian),
										videoaddress: "",
										src: JSON.stringify(_this.imgsrc),
										reason: _this.describe,
										status: _this.currentstatutype,
										statusvalue: _this.currentstatutext,
										transfertype: _this.categorytype,
										transfertypevalue: _this.categorytext,
										industry: _this.industrytype,
										industryvalue: _this.industrytext,
										loadingfee: _this.fees,
										type: _this.type1,
										typevalue: _this.typevalue,
										urgent: 1,
												}
												if ( _this.title=='') {
												  warn = "请添加标题！"

												 
												} else if (_this.describe == "") {
												  warn = "请添加店铺介绍"
		 
												}
												else if(_this.provincecode == "") {
												  warn = "请正确选择区域！"

												 
												} else if (_this.detailedAddress == "" || _this.detailedAddress === "0") {
												  warn = "请正确填写详细地址！" 
												}
												else if (_this.ThePhone.length != 11 || _this.ThePhone.length=='') {
												  warn = "手机号格式 不正确！"
												}  else if (_this.Maxrent == "") {
												  warn = "请正确店铺面积" 
												}
												else if (_this.turnover == "") {
												  warn = "请填写营业额！"

												
												}
												 else if (_this.Maxrent == "") {
												  warn = "请正确填写最大店铺房租费！"
												  
												}else if (_this.fees == "") {
												  warn = "请转让费"
												  
												}
												
												else if (_this.type1 == "") {
												  warn = "请正确选择店铺铺类型！" 
												} else if (_this.categorytype == '') {
												  warn = "请选择转让类别！"
												}
												else if (_this.industrytype == '') {
												  warn = "请选择当前行业！"
												}
												else if (_this.currentstatutype == '') {
												  warn = "请选择当前状态！"
												}
												else if (_this.peiTaocheckArr == '') {
												  warn = "商铺配套至少选择1项 ！"
												} 
												else if (_this.zhouBiancheckArr == '') {
												  warn = "周边设施至少选择1项 ！"  
												} 
												else if (_this.imgsrc == "") {
												  warn = "请添加展示图片"

												 
												}
												else{
													
												uni.request({
													url: shoppublic.getUrl() + '/oldShopTransfer/addlistOldShopTransfer',
													data:data,
													method: "POST",
													header: { "Content-Type": "application/x-www-form-urlencoded" },
													success: (res) => {
													if (res.data.msgCode == "1") {
															uni.showModal({
															title: '提示',
															content: '添加成功',
															showCancel: false,
															success(res) {
															setTimeout(()=>{
															uni.switchTab({
															url: '../../../index/index'
																 })
																	},2000)
																																	
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
						  zhouBian1: function (e) {
								  var _this=this
			  var zhouBian = _this.zhouBian;
			  var checkArr = e.detail.value;
			    _this.zhouBiancheckArr=checkArr
			  for (var i = 0; i < zhouBian.length; i++) {
			    if (checkArr.indexOf(i + "") != -1) {
			      zhouBian[i].checked = true;
			    } else {
			      zhouBian[i].checked = false;
			    }
			  }
			
			    _this.zhouBian=zhouBian
				  console.log( _this.zhouBiancheckArr)
			
			},
			//新铺类型
			 xipuleixing: function (e) {
			
				  this.isShowChooseKaiShiTime=true,
				    // this.typevalue=this.dianpuleixing[0].value,
				  this.type= this.dianpuleixing[0].id,
				    this.deepLength = 1
					  this.pickerValueDefault = [0]
				  this.istextarea=true
				  this.$refs.mpvuePicker.show()
				  this.type = e.currentTarget.dataset.type
				  this.pickerValueArray = this.dianpuleixing
				  this.mode = 'selector'
					console.log(this.typevalue, this.type)
				},
				//转让类别
				 categoryed(e) {
				
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
					//当前行业
					//招商对象切换
					merchantsChange: function (e) {
						var merchants = this.merchantsed;
						var checkArr = e.value[0];
					
							this.merchantsed=checkArr
						
						for (var i = 0; i < merchants.length; i++) {
							if (checkArr.indexOf(i + "") != -1) {
								merchants[i].checked = true;

							} else {
								merchants[i].checked = false;
							}
						}
				
					this.merchantsed=merchants
						console.log(this.merchantsed)
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
										//当前值状态
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
					 serviceValChange: function (e) {
												  var _this=this
											var allGoodsFilte = _this.allGoodsFilte;
											var checkArr = e.detail.value;
								  _this.peiTaocheckArr=checkArr
								for (var i = 0; i < allGoodsFilte.length; i++) {
								  if (checkArr.indexOf(i + "") != -1) {
									allGoodsFilte[i].checked = true;
								  } else {
									allGoodsFilte[i].checked = false;
								  }
								}
				
								  _this.allGoodsFilte=allGoodsFilte
								
						
				},
	
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
					_this.merchantsChange(e)
				}
					else if(this.type == "5"){
					_this.currentstatutext = e.label;
					_this.currentstatutype=e.value
					console.log(_this.currentstatutext,	_this.currentstatutype)
					
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
@import "./locationRelease.scss";
</style>
