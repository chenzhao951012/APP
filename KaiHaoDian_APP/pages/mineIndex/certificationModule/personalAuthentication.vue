<template>
	<view class="content">
		<view class="Line"></view>
		<view class="information">
			<view class="list-call">
				<text>姓名</text><input class="biaoti"  type="text" v-model="name"/>
			</view>
			<view class="list-call">
				<text>性别</text><input class="biaoti"  type="text"/>
			</view>
			<view class="list-call">
				<text>出生日期</text><input class="biaoti"  type="text"/>
			</view>
			<view class="list-call">
				<text>所在地区</text><input class="biaoti"  type="text"/>
			</view>
			<view class="list-call">
				<text>微信号</text><input class="biaoti" :password="!weChat"  type="text"  v-model="weChatNumber"/><img :src="weChat?'../../../static/op.png':'./../../static/c1.png' " @tap="display1" alt="">
			</view>
			<view class="list-call">
				<text>你已绑定手机号</text><input class="biaoti" v-model="phoneNumber"   type="text" :password="!showPassword"/>
				<img :src="showPassword?'../../../static/op.png':'./../../static/c1.png' " @tap="display" alt="">
			</view>
			<view class="list-call">
				<text>个人简介</text>
			</view>
			<view class="list-call2">
				<textarea type="text" value="" placeholder="请输入你的简介" v-model="introduced"/>
			</view>
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import getLocation from '@/common/getLocation.js'; //获取地理位置
	export default {
		onUnload() {
				
		},
		onLoad() {
			var _this=this
				uni.getStorage({
				key: 'location',
				success: res => {
					// console.log('getStorage', JSON.stringify(res));
					_this.location = {
						province_id: res.data.province_id,
						province_name: res.data.province_name,
						city_id: res.data.city_id,
						city_name: res.data.city_name
					};
					_this.location_city = JSON.parse(res.data.city_name);
					_this.location_privce=JSON.parse(res.data.province_name)
					_this.location_cityid=JSON.parse( res.data.city_id)
					_this.location_privceid=JSON.parse( res.data.province_id)
					// console.info('_location_city',_this.location_city);
				},
				fail: res => {
					
					if ((_this.location.province_name || _this.location.province_id || _this.location.city_id) == '') {
							getLocation.getLocation(function(res_p, res_c) {
							_this.location_city = res_c[0].name
							
							_this.location_privce=JSON.parse(res_p[0].name)
							_this.location_cityid=JSON.parse( res_c[0].id)
							_this.location_privceid=JSON.parse( res_p[0].id)
							_this.cityText=_this.location_privce+_this.location_city
						})
					
					}
				}
			})
		},
		components: {
			mpvuePicker,
		},
		data() {
			return {
				weChat:false,
				showPassword:false,
				cityText:"",
				location_city:"",
				location_cityid:"",
				location_privce:"",
				location_privceid:"",
				isshowImg:false,
				openid2:1,
				openid:1,
				flag:true,
				token:14651,
				pickerText3:"公开",
				pickerText2:"公开",
				type:"",
				deepLength: 1,
				mode: '', //组件类型
				themeColor: '#007AFF',
				pickerValueDefault: [0], //默认选中值
				pickerValueArray: [],
			  Magess:shoppublic.getUrl() + '/uploadimage',
				imgurl2:shoppublic.getUpImgUrl(),
				javacode:"",
				disabled:false,
				currentTime:120,
				name:"",
				CompanyName:"",
				position:"",
				phoneNumber:"",
				verificationCode:"",
				getverificationCodeS:"",
				getverificationCode:"获取验证码",
				privacy:"",
				weChatNumber:"",
				chatPrivacy:"",
				introduced:"",
				enterprisemailbox:"",
				businesscard:"",
				jobcertification:"",
				workers:"",
				
			};
		},
		 onNavigationBarButtonTap() {  
					console.log("导航事件")
			},  
		methods:{
			display1(){
				this.weChat = !this.weChat
				if(this.weChat==false){
					this.openid2=1
				}else if(this.weChat==true){
					this.openid2=2
				}
				console.log()
			},
			//
			display() {
			    this.showPassword = !this.showPassword
				if(this.weChat==false){
					this.openid=1
				}else if(this.weChat==true){
					this.openid=2
				}
				console.log(this.openid)
			},
			  // 提交
					  formSubmit: function(e) {
						// let appLocation = app.globalData.location;
						event.preventDefault()
						let that = this
						 //弹框时提示的内容   
						   var warn = ""
						if (that.name.length > 5 || that.name == "") {
						  warn = "正确填写姓名"
						  that.flag = true;
						}  else if (that.phoneNumber.length != 11) {
						  warn = "正确填写手机号"
						  that.flag = true;
						} else if (that.verificationCode == "") {
						  warn = "正确填写验证码"
						   that.flag = true;
						} else if (that.openid.length == 0) {
						  warn = "请选择是否公开您的手机"
						   that.flag = true;
						} else if (that.weChatNumber == "") {
						  warn = "正确填写微信账号"
						   that.flag = true;
						} 
						else if (that.introduced == "") {
						  warn = "请填写您的个人简介"
						   that.flag = true;
						} else {
							 that.flag =false;
						  }
						  if( that.flag ==false){
							  uni.request({
							  							
							  	url: shoppublic.getUrl() + '/personalcenter/updatepersonalAuthenticate',
							  	data: {
							  			token: that.token,
							  			name: that.name,
							  			company: that.CompanyName,
							  		    position: that.position,
							  			phone: that.phoneNumber,
							  		    wechatno: that.weChatNumber,
							  			password: that.verificationCode,
							  			companyarea: that.cityText,
							  			enterprisemailbox: that.enterprisemailbox,
							  			businesscard: that.data.businesscard,
							  			jobcertification: that.imgUrls,
							  			workers: that.data.workers,
							  			mainbusiness: that.introduced,
							  			hidephone: that.openid,
							  		    hidewechat: that.openid2,
							  			province_name:that.location_privce, //省名
							  			province_id: that.location_privceid, //省id
							  			city_name: that.location_city, //市名
							  			city_id: that.location_cityid //市id
							  							},
							  							success: function(res) {
							  							  wx.showModal({
							  								title: '认证提示',
							  								content: '提交成功',
							  								showCancel: false,
							  								success: function() {
							  								  uni.reLaunch({
							  									url: 'mineIndex/mineMenu'
							  								  })
							  								}
							  							  })
							  							}
							  
							  })
						  }
						  
						
						if (that.flag == true) {
						  wx.showModal({
							title: '提示',
							content: warn
						  })
// 						  wx.navigateTo({
// 							url: 'mineIndex/mineMenu'
// 						  })
						}
					  },
				//微信隐私
			 WeChatPicker(e) {
				this.type = e.currentTarget.dataset.type
			    this.pickerValueArray = this.pickerSingleArray
			    this.mode = 'selector'
			    this.deepLength = 1
			    this.pickerValueDefault = [0]
			    this.$refs.mpvuePicker.show()
			},
			//手机隐私
			  showSinglePicker(e) {
				this.type = e.currentTarget.dataset.type
			    this.pickerValueArray = this.pickerSingleArray
			    this.mode = 'selector'
			    this.deepLength = 1
			    this.pickerValueDefault = [0]
			    this.$refs.mpvuePicker.show()
			},
			//图片上传
			  enterprise(index){
					var that = this;
				
					uni.chooseImage({
					  count: 1, // 最多可以选择的图片张数，默认9
					  sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
					  sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
					  success: function(res) {
						var imgSrc = res.tempFilePaths;
						wx.uploadFile({
						  url:that.Magess, //仅为示例，非真实的接口地址
						  filePath: imgSrc[0],
						  name: 'file',
						  success: function(res) {
							  that.materialList[index].imgUrl=that.imgurl2+JSON.parse(res.data).url;
							   if(index==0){
							          that.enterprisemailbox= that.materialList[index].imgUrl
							 		 
							 }else if(index==1){
							 		   that.businesscard= that.materialList[index].imgUrl
							 		
							 }else if(index==2){
							 			that.jobcertification= that.materialList[index].imgUrl
							 		
							 }else if(index==3){
							 			that.workers= that.materialList[index].imgUrl
							 		
							 }
						
						  }
						})

					  },
					  fail: function() {
						// fail
					  },
					  complete: function() {
						// complete
					  }
					})
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
				  		_this.pickerText3 =e.label;
						_this.openid=e.value;
				  		
				  	}else if(this.type == "2"){
				  		_this.pickerText2 = e.label;
				  		_this.openid2=e.value
				  	}
				  	let location = e.label.split('-');
				  	let city_name = location[location.length - 1];
				  	
				  	
				  	// _this.startcreatview(city_name);
				  },
			  //验证码
		  getCode() {
			var that = this;
			event.preventDefault()
			var currentTime = that.currentTime;
			 if(that.disabled==false){
					 if (that.phoneNumber.length == 11) {
				   wx.request({
					 url: shoppublic.getUrl() + '/common/getVerificationCode',
					 data: {
					   phone: that.phoneNumber
					 },
					 success(res) {
						 console.log(res.data.responseBody)
						 that.disabled=true,
						 that.getverificationCode=currentTime + '秒',
						 that.javacode=res.data.responseBody
						 
					   var interval = setInterval(function() {
							 that.getverificationCode=(currentTime - 1) + '秒'
						 currentTime--;
						 if (currentTime <= 0) {
						   clearInterval(interval)
				
		             that.getverificationCode='重新获取',
		              that.currentTime=120,
		              that.disabled=false
		          
		         }
		       }, 1000)
		     }
		   })
		 } else {
		   wx.showModal({
		     title: '提示',
		     content: '请正确填写手机号',
		     showCancel: false,
		     success: function() {}
		   })
		 }
	 }


  },
		}
	}
</script>

<style lang="scss">
	// 引入样式
	@import "personalAuthentication.scss";
</style>
