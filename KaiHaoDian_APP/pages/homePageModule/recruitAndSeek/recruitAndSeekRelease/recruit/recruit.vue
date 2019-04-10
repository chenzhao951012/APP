<template>
	<view class="content">
		<!-- 求职 -->
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray">确定</mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		<!-- 标题 -->
		<view class="_title_parnters">
		 	<view class="_title_top" >标题</view>
		 	<textarea type="text" placeholder="请输入标题(含带招聘岗位)..." maxlength="28" v-model="title"/>
		 	<view class="_title_bottom">最多28字</view> 
		</view>
		<!-- 招聘类型 -->
		<view class="_infoFill">
			<view class="_left">招聘类型</view>
		 	<view class="_right" @click="showSinglePicker2" data-type="1">{{pickerText1}}</view>
		</view>
		<!-- 新姿待遇 -->
		<view class="_infoFill">
			<view class="_left" style="width: 200upx;">薪资待遇</view>
		 	<view class="_right" style="display:flex;margin-left: 150upx;position: absolute;right: -190upx;">
				<view class="Minmoney">
					<input type="text" value="" v-model="minprice"/>
				</view>-
				<view class="Maxmoney">
					<input type="text" value="" v-model="maxprice"/>
				</view>
				<text>元</text>
			</view>
		</view>
		<!-- 岗位要求 -->
		<view class="_title_instructions">
		 	<view class="_title_top" >岗位要求</view>
		 	<textarea type="text" placeholder="请输入岗位要求..." maxlength="200" v-model="jobRequirements"/>
		</view>
		<!-- 所在区域 -->
		<view class="_infoFill">
			<view class="_left">所在区域</view>
		 	<view class="_right" @click="showMulLinkageThreePicker" data-type="3">{{pickerText3}}</view>
		</view>
		<!-- 地址 -->
		<view class="_infoFill">
		 	<view class="_left">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址</view>
		 	<input class="_right" type="text" value="" placeholder="请输入详细地址" v-model="address"/>
		</view>
		<!-- 联系电话 -->
		<view class="_infoFill">
		 	<view class="_left">联&nbsp;&nbsp;系&nbsp;&nbsp;人</view>
		 	<input class="_right" type="text" placeholder="请输入姓名" v-model="linkman"/>
		</view>
		<!-- 联系电话 -->
		<view class="_infoFill">
		 	<view class="_left">联系电话</view>
		 	<input class="_right" type="number" placeholder="请输入联系电话" v-model="linkmanPhone"/>
		</view>
		<!-- 单选题 -->
		<view class="_confirm">
		 	<view class="_confirm_icon" @touchend="sishow">
					
					<image src="../../../../../static/dui.jpg" mode="" style="width: 20px;height: 20px;border-radius: 50%;" v-show="isImg"></image>
			
			</view>
		 	<view class="">本人承诺上述信息属实</view>
		</view>
		<!-- 发布按钮 -->
		<view class="_position_button">
		 	<view class="_left_button" @click="formSubmit1">发布</view>
		 	<view class="_right_button" @click="toJiaJiFaBu1">加急发布</view>
		</view>
	</view>
</template>
<script>
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import cityData from '@/common/city.data.js';
	// end
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import getLocation from '@/common/getLocation.js'; //获取地理位置
	export default {
			components: {
			mpvuePicker,
			mpvueCityPicker
		},
		data() {
			return {
				isImg:false,
				flag:true,
				token: shoppublic.gettoken(),
				mulLinkageTwoPicker: cityData,
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#007AFF', //主体颜色
				title:"",
				jobRequirements:"",
				address:"",
				linkman:"",
				linkmanPhone:"",
				type1:"",
				type2:"",
				mode: '', //组件类型
				province: "",
				city: "",
				county: "",
				provincevalue: "",
				cityvalue: "",
				countyvalue: "",
				deepLength: 1, //几级联动
				minprice:"",
				maxprice:"",
				pickerValueDefault: [0], //默认选中值
				pickerValueArray: [], //渲染数据
				shoppublic: shoppublic ,//服务器地址
				pickerText3: '请选择区域',
				pickerText2: '请选择',
				pickerText1: '请选择',
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
					  { value: "10",label: "教育" },
					  { value: "11", label: "酒店宾馆" },
					  { value: "12", label: "农业环保" },
					  { value: "13", label: "母婴" },
					  { value: "14", label: "网络服务" },
					  { value: "15", label: "其他" }
					],
			};
		},
		methods:{
			//是否选中
				sishow(){
				this.isImg=!this.isImg
				},
			// 发布
			 formSubmit1() {
				this.fabu(1)
		},
			//发布共用用函数
			fabu(e, urgent){
				var _this=this
				var tData=_this
				
				var warn=""
				if (tData.jobRequirements == "") {
						  warn = "请输入求职岗位 ！"
						  tData.flag = true;
						} else if (tData.type1 == "") {
						  warn = "请选择行业类别！"
						  tData.flag = true;
						} /*else if (tData.pricetext1 == "请选择") {
						  warn = "请选择期望薪资！"

						  flag = true;
						} */
						else if (tData.minprice == "" || tData.maxprice == "" ) {
						  warn = "请正确输入期望薪资！"

						  tData.flag = true;
						}else if (tData.linkmanPhone.length != 11) {
						  warn = "请正确输入手机号！"

						   tData.flag = true;
						} else if (tData.pickerText3 == "请选择") {
						  warn = "请选择所在区域 !"

						   tData.flag = true;
						} else if (tData.address == "") {
						  warn = "请正确填写详细地址！"

						  tData.flag = true;
						} else if (tData.title == "") {
						  warn = "请输入求职描述 ！"
						   tData.flag = true;
						} else if (e == 2 && urgent != true) {
						  warn = "您的积分不够，不能进行紧急发布！"
						  tData.flag = true
						}else{
							 tData.flag = false;
						}
				 var data = {
				token: _this.token,
				title: _this.title,
				phone: _this.linkmanPhone,
				type: _this.type1,
				typevalue: _this.pickerText1,
				salarymin: _this.minprice,
				salarymax: _this.maxprice,
				post: _this.jobRequirements,
				province: _this.province,
				city: _this.city,
				county: _this.county,
				provincevalue: _this.provincevalue,
				cityvalue: _this.cityvalue,
				countyvalue: _this.countyvalue,
				street: _this.address,
				urgent: 2,
				status: 2
				};	
					if( tData.flag ===false && tData.isImg===true){
						warn="发布成功"
							uni.request({
						url: shoppublic.getUrl() + '/storeRecruitment/addStoreRecruitment', //仅为示例，并非真实接口地址。
						data:data,
						header: {
							'content-type': 'application/json' //自定义请求头信息
						},
						success: (res) => {
							  if (res.data.msgCode == "1") {
									uni.showModal({
									  title: '提示',
									  content: '添加成功',
									  showCancel: false,
									  success(res) {
										uni.reLaunch({
										  url: './recruitAndSeek'
										})
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
			
				    uni.showModal({
              title: '提示',
              content: warn,
              showCancel: false,
              success(res) {
             
              }
            })
			},
			// 加急发布
			 toJiaJiFaBu1: function (e) {
					var that = this,
					  urgent,
					  integral;
					var warn = "";//弹框时提示的内容   
					wx.request({
					  url: shoppublic.getUrl() + '/common/checkPoints',
					  data: {
						token: token
					  },
					  success(res) {
						urgent = res.data.responseBody.flag;
						integral = res.data.responseBody.integral;
						uni.showModal({
						  title: '提示',
						  content: "紧急发布每次需扣除" + integral + "积分！",
						  success(res) {
							if (res.confirm) {
							  that.fabu(2, urgent);
							} else if (res.cancel) {

							}
						  }
						})

					  }
					})
				  },
			//三级联动
			 showMulLinkageThreePicker(e) {
				this.type = e.currentTarget.dataset.type
			    this.$refs.mpvueCityPicker.show()
			},
			//薪资待遇
			   showSinglePicker(e) {
				console.log(e.currentTarget.dataset.type);
				this.type = e.currentTarget.dataset.type
			    this.pickerValueArray = this.salarylist
			    this.mode = 'selector'
			    this.deepLength = 1
			    this.pickerValueDefault = [0]
			    this.$refs.mpvuePicker.show()
			},
			//招聘类型
			showSinglePicker2(e){
				console.log(e.currentTarget.dataset.type);
				this.type = e.currentTarget.dataset.type
				this.pickerValueArray = this.industrylist
				this.mode = 'selector'
				this.deepLength = 1
				this.pickerValueDefault = [0]
				this.$refs.mpvuePicker.show()
			},
			// 取消
			onCancel(e) {
				console.log(JSON.stringify(e.label));
			},
			// 确定
			onConfirm(e) {
				let _this = this;
				console.log(JSON.stringify(e.label));
				if(this.type == "3"){
					console.log(e)
					_this.pickerText3 = e.label;
					let location = e.label.split('-');
					_this.provincevalue = location[0];
					_this.cityvalue = location[1];
					_this.countyvalue = location[2];
					_this.city=e.cityCode.cityCode
					_this.county=e.cityCode.countyCode
					_this.province=e.cityCode.provinceCode
					console.log(_this.city,_this.county,_this.province);
				}else if(this.type == "2"){
					_this.pickerText2 = e.label;
					_this.type2=e.label
				}else if(this.type == "1"){
					_this.pickerText1 = e.label;
					_this.type1=e.value
				}
				
// 				let location = e.label.split('-');
// 				let city_name = location[location.length - 1];
// 				console.log(city_name);
				// _this.startcreatview(city_name);
			},
		},
// 		startcreatview(location) {
// 			console.info(location);
// 			const s = this;
// 			s.TitleTimer = setTimeout(function() {
// 				s.createView(location);
// 			}, 100); //具体缓迟时间可以按需设置
// 		},
// 		createView(location) {
// 			clearTimeout(this.TitleTimer);
// 			const s = this;
// 			const pages = getCurrentPages();
// 			const page = pages[pages.length - 1];
// 			const currentWebview = page.$getAppWebview();
// 			const nTitle = currentWebview.getTitleNView();
// 			nTitle.draw([
// 				{
// 					tag: 'font',
// 					id: 'indexTextTwo',
// 					text: location,
// 					position: {
// 						left: '38px',
// 						top: '8px',
// 						bottom: '6px'
// 					},
// 					textStyles: {
// 						size: '14px',
// 						fontSrc: '/static/uni.ttf',
// 						color: '#333',
// 						align: 'left'
// 					}
// 				}
// 			]);
// 			nTitle.addEventListener(
// 				'click',
// 				function(e) {
// 					console.log(JSON.stringify(e));
// 					s.showMulLinkageTwoPicker();
// 				},
// 				false
// 			);
// 		},
		// 求购按钮的点击事件
		onNavigationBarButtonTap(e) {
			console.log(e);
			if(e.index === 0){
				uni.navigateTo({
					url: '../candidate/candidate'
				});
			}
		}
	}
</script>

<style lang="scss">
@import './recruit.scss'
</style>
