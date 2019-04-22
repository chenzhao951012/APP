<template>
	<view class="content">
		        <mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		<!-- 内容区域 -->
		<view class="_all_content">
			<!-- 企业名称 -->
			<view class="_menu_list">
				<view class="_menu_name">公司</view>
				<input class="_menu_content comenpy" placeholder="请输入公司名称" maxlength=-1 placeholder-style="text-align:right;" v-model="CompanyName"/>
			</view>
			<!-- 行业类别 -->
			<view class="_menu_list">
				<view class="_menu_name">行业类别</view>
				<view class="_select_list" data-type="1" @touchend="showSinglePicker">{{category}}</view>
			</view>
			<!-- 企业座机 -->
			<view class="_menu_list">
				<view class="_menu_name">所在地区</view>
				<input class="_menu_content" placeholder="填写所在省市" maxlength=-1 placeholder-style="text-align:right;" v-model="provincecode"/>
			</view>
			<!-- 手机 -->
			<!-- 手机号 --> 
			<view class="_menu_list"> 
					<view class="_menu_name">详细地址</view>
					<input class="_menu_content" type="text" value="" maxlength="20" placeholder="公司所在区县地址" v-model="address"/>	
			</view>
			<!-- 验证码 -->
			<view class="_menu_list">
				<view class="_menu_name">公司座机</view>
				<input class="_menu_content" placeholder="请输入" maxlength=-1 placeholder-style="text-align:right;" v-model="verificationCode"/>
			</view>
			<!-- 微信账号 --> 
			<view class="_menu_list">
			 	<view class="_menu_name">注册资本</view>
			 	<input class="_menu_content" type="text" value="" maxlength="20" placeholder="请输入" v-model="weChatNumber"/>
			</view>
			<!-- 企业地址 -->
			<view class="_menu_list">
				<view class="_menu_name">注册时间</view>
				<input class="_menu_content" placeholder="请输入" maxlength=-1 placeholder-style="text-align:right;" v-model="registrationData"/>
			</view>
			<!-- 详细地址 -->
			<view class="_menu_list">
				<view class="_menu_name">法人代表</view>
				<input class="_menu_content" placeholder="请输入" maxlength=-1 placeholder-style="text-align:right;" v-model="representative"/>
			</view>
			<!-- 主营业务 -->
		<view class="_menu_list">
			<view class="_menu_name">法人电话</view>
			<input class="_menu_content" placeholder="请输入" maxlength=-1 placeholder-style="text-align:right;" v-model="LegalPhone"/>
		</view>
			</view>
			<!-- 服务优势 -->
			<view class="_menu_list">
				<view class="_main_business">营业执照</view>
				<view class="Upimg" v-if="ImgUrl!='' ">
					<img :src="ImgUrl" alt="">
				</view>
				<view class="UpimgList" @touchend="enterprise" v-if="ImgUrl=='' ">
					<img src="../../../static/upimg.png" alt="">
				</view>
			</view>
			<view class="_main_business_info">
				<view class="_main_business">公司简介</view>
				<textarea placeholder="请输入个人简介(将在名片中展示)" placeholder-style="font-size:28upx;" v-model="business"/>
				
			<!-- 上传营业执照 -->
		<!-- 	<view class="_material_selection">
				<view class="_title">请上传营业执照 证明你的身份</view>
				<view class="_material_cell" @touchend="enterprise" v-show="isShowImg">
					<view class="iconfont _cell_icon">&#xe7a2;</view>
					<view class="_cell_title">上传营业执照</view>
				</view>
				<view class="ImgBox" v-show="isShowImg2" @touchend="enterprise">
					<img :src="ImgUrl" alt="">
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import cityData from '@/common/city.data.js';
	export default {
		components: {
			mpvuePicker,
			mpvueCityPicker
		},
			onUnload() {
			if (this.$refs.mpvuePicker.showPicker) {
				this.$refs.mpvuePicker.pickerCancel();
			}
			if (this.$refs.mpvueCityPicker.showPicker) {
				this.$refs.mpvueCityPicker.pickerCancel();
			}
		},
		data() {
			return {
				LegalPhone:"",
				token:14651,
				provinceName:'', // 选择省区 -名字
				cityName:'', // 选择市区 - 名字
				countyName:'',
				countycode:"",
				cityCode:"",
				provincecode:"",
				flag:false,
				openid2:"",
				openid:"",
				mulLinkageTwoPicker: cityData,
				cityPickerValueDefault: [0, 0, 0],
				type:"",
				deepLength: 1,
				mode: '', //组件类型
				themeColor: '#007AFF',
				pickerValueDefault: [0], //默认选中值
				pickerValueArray: [],
				isShowImg:true,
				isShowImg2:false,
				imgurl2:shoppublic.getUpImgUrl(),
				ImgUrl:"",
				 Magess:shoppublic.getUrl() + '/uploadimage',
				CompanyName:"",
				category:"请选择",//行业列表
				specialPlane:"",//座机, 
				phOne:"",
				representative:"",//法人代表
				verificationCode:"",
				weChatNumber:"",
				Businessaddress:"请选择",
				address:"",//详细地址
				business:"",//主营业务
				advantage:"",//服务优势
				license:"",//营业执照
				registrationData:'',//注册时间
				disabled:false,
				//行业类别
				  industrylist: [
							  { value: "0", label: "餐饮美食" },
							  { value: "1", label: "美容保健" },
							  { value: "2", label: "服饰鞋包" },
							  { value: "3", label: "休闲娱乐" },
							  { value: "4", label: "百货超市" },
							  { value: "5", label: "生活服务" },
							  { value: "6", label: "电器通讯" },
							  { value: "7", label: "汽修服务" },
							  { value: "8", label: "医疗器械" },
							  { value: "9", label: "家居建材" },
							  { value: "10", label: "教育" },
							  { value: "11", label: "酒店宾馆" },
							  { value: "12", label: "农业环保" },
							  { value: "13", label: "母婴" },
							  { value: "14", label: "网络服务" },
							  { value: "15", label: "其他" }
							],
				menuList:[
					{
						title:"主营业务"
					},
					{
						title:"服务优势"
					}
				],
				javacode:"",
			};
		},
		methods:{
			//提交审核
			 formSubmit() {
				 event.preventDefault()
						let that = this,
						  warn = ""//弹框时提示的内容   
						 
						if (that.CompanyName == "") {
						  warn = "正确填写公司名称"
						  that.flag = false;
						} else if (that.openid == "") {
						  warn = "请选择行业类别"
						 that.flag = false;
						} else if (that.phOne.length != 11) {
						  warn = "正确填写手机号"
						   that.flag = false;
						} else if (that.specialPlane == "") {
						  warn = "正确填写公司座机"
						  that.flag = false;
						} 
						else if (that.verificationCode == "") {
						  warn = "请填入验证码"
						  that.flag = false;
						} 
						 else if (that.verificationCode != "" && that.verificationCode != that.javacode) {
						  warn = "正确填写验证码"
						   that.flag = false;
						}
						 else if (that.weChatNumber =="") {
						  warn = "正确填写微信账号"
						  that.flag = false;
						}
						/*else if (that.data.openid.length == 0) {
						  warn = "请选择是否公开您的联系方式"
						  flag = true;
						} */else if (that.provincecode == "") {
						  warn = "正确选择工作地区"
						  that.flag = false;
						} else if (that.address == "") {
						  warn = "正确填写详细地址"
						  that.flag = true;
						} else if (that.business == "") {
						  warn = "正确填写主营业务！"
						 that.flag = false;
						} else if (that.advantage == "") {
						  warn = "正确填写服务优势！"
						   that.flag = false;
						} else if (that.ImgUrl == "") {
						  warn = "请上传营业执照！"
						  that.flag = false;
						}else {
						   that.flag = true;
						  //console.log(111111)
						  wx.request({
							url: shoppublic.getUrl() + '/personalcenter/updateEnterpriseAuthenticate',
							data: {
							  token: that.token,
							  company: that.CompanyName,
							  phone: that.phOne,
							  wechatno: that.data.wechatno,
							  landline: that.weChatNumber,
							  verificationcode: that.verificationCode,
							  companyarea: that.Businessaddress,
							  companyaddress: that.address,
							  businesslicense: that.ImgUrl,
							  mainbusiness: that.business,
							  serviceadvantage: that.advantage,
							  industrytype: that.openid,
							  industrytypevalue: that.category,
							  hidephone:1,
							  hidewechat:1
							  //hidephone: that.data.openid

							},
							success: function (res) {
							  console.log(222222)
							  wx.showModal({
								title: '认证提示',
								content: '提交成功',
								showCancel: false,
								success: function () {
								  wx.reLaunch({
									url: 'mineIndex/mineMenu'
								  })
								}
							  })
							}

						  })
						}
						if (that.flag == false) {
						  uni.showModal({
							title: '提示',
							content: warn,
							showCancel: false
						  })

						}


					  },
			// 获取验证码
			  getCode(options) {
				var that = this;
				event.preventDefault()
				if(that.disabled==false){
						var currentTime = that.currentTime;
									if (that.phOne.length == 11) {
									  wx.request({
										url: shoppublic.getUrl() + '/common/getVerificationCode',
										data: {
										  phone: that.phOne
										},
										success(res) {
										 
											 that.disabled=true,
											 that.verification=currentTime + '秒',
											 that.verificationCode=res.data.responseBody
											 that.javacode=res.data.responseBody
										
										  var interval = setInterval(function () {
										
											 that.verification=(currentTime - 1) + '秒'
											
											currentTime--;
											if (currentTime <= 0) {
											  clearInterval(interval)
											
												that.verification='重新获取',
												that.currentTime=60
												that.disabled=false
											
											}
										  }, 1000)
										}
									  })
									} else {
									  uni.showModal({
										title: '提示',
										content: '请正确填写手机号',
										showCancel: false,
										success: function () {
										  console.log("tishi ")
										}
									  })
									}
					
					}
				},
			
			//三级联动
			 showMulLinkageThreePicker(e) {
				 event.preventDefault()
				this.type = e.currentTarget.dataset.type
			    this.$refs.mpvueCityPicker.show()
			},
					  	// 取消
			onCancel(e) {
				// console.log(JSON.stringify(e.label));
			},
			// 确定
			onConfirm(e) {
				let _this = this;
				console.log(JSON.stringify(e.label));
				if(this.type == "1"){
					_this.category =e.label;
					_this.openid=e.value;
					
				}else if(this.type == "2"){
					_this.Businessaddress = e.label;
					_this.openid2=e.value
					_this.countycode=e.cityCode.countycode
					_this.cityCode=e.cityCode.cityCode
					_this.provincecode=e.cityCode.countycode
					let locations = e.label.split('-');
					_this.cityName= locations[1]
					let city_name = locations[locations.length - 1];
					_this.cityName= locations[1]
					_this.provinceName=locations[0];
					_this.countyName=locations[2];
				}
				let location = e.label.split('-');
				let city_name = location[location.length - 1];
				
				
				// _this.startcreatview(city_name);
			},
			//行业类别
				  showSinglePicker(e) {
				this.type = e.currentTarget.dataset.type
			    this.pickerValueArray = this.industrylist
			    this.mode = 'selector'
			    this.deepLength = 1
			    this.pickerValueDefault = [0]
			    this.$refs.mpvuePicker.show()
			},
			//照片上传
			 enterprise(){
				 var that=this
							uni.chooseImage({
								count: 1,
								sourceType: ['album'],
								success: function (res) {
								uni.getImageInfo({
									src: res.tempFilePaths[0],
									success: function (image) {
										console.log(image.width);
										console.log(image.height);
										that.ImgUrl=res.tempFiles[0].path
									}
								});
							}
						});
					},
		}
	}
</script>

<style lang="scss">
	// 引入样式
	@import "enterpriseCertification.scss";
</style>
