<template>
	<view class="content">
			<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray">确定</mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		<!-- 所在区域 -->
		<view class="preference">
			<view class="productdescription">
				<view>商品描述</view>
				<view><textarea  placeholder="" maxlength="-1"/></view>
			</view>
			<view class="_infoFill">
				<view class="_left">所在区域</view>
				<!--@touchend="showMulLinkageThreePicker" {{pickerText3}}-->
			 	<view class="_right" data-type="3" @click="showMulLinkageThreePicker">{{pickerText3}}</view>
			</view>
			<view class="price">
				<view>
					价格
				</view>
				<view>
					<input type="text" placeholder="">
				</view>
			</view>
			<view class="price">
				<view>
					新旧度
				</view>
				<view style="text-align: right;flex: 1;">
					<text class="iconfont">&#xe616;</text>
				</view>
			</view>
			<view class="meansexchange">
				<view class="means">
					<view class="modes">
						交易方式
					</view>
					<view class="deals">
						<view v-for='(item,idx) in deal' :key='idx' class="deal">
							{{item.title}}
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
				deal:[
					{
						title:'自提',
					},
					{
						title:'邮递',
					},
					{
						title:'同城交易',
					}
				],
				isImg:false,
				flag:true,
				price:"",
				province: "",
				city: "",
				county: "",
				provincevalue: "",
				cityvalue: "",
				countyvalue: "",
				imgList:[],
				pickerValueDefault: [0], //默认选中值
				pickerValueArray: [], //渲染数据
				shoppublic: shoppublic ,//服务器地址
				deepLength: 1,
				mulLinkageTwoPicker: cityData,
				cityPickerValueDefault: [0, 0, 0],
				themeColor: '#007AFF', //主体颜色
				pickerText3: '请选择',
				pickerText2: '请选择',
				pickerText1: '请选择',
				mode: '',
				linkmanPhone:"",
				title:"",
				jobRequirements:"",
				address:"",
				type2:"",
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
				sishow(){
			this.isImg=!this.isImg
			},
			// 发布
				 formSubmit1() {
					this.fabu(1)
			},
			//加急发布
			 toJiaJiFaBu: function () {
					var that = this,
					  urgent,
					  integral,
					  warn = "";

					uni.request({
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

						  },
						})
					  }
					})
				  },
			//发布公用函数
			fabu(e,urgent){
				var warn=""
				var _this=this
				var tData=_this
				 if (e != 2) {
				  e = 1
				} else {
				  e = 2
				}
				var data={			
				token: 998,
				title: tData.title, //名称
				phone: tData.linkmanPhone,
				type: tData.type2,   //
				typevalue: tData.pickerText2,
				description: tData.jobRequirements,
				province: tData.province,
				city: tData.city,
				county: tData.county,
				provincevalue: tData.provincevalue,
				cityvalue: tData.cityvalue,
				countyvalue: tData.countyvalue,
				street: tData.address,
				price: tData.price,
				videoaddress: "",
				src: tData.imgList,
				urgent: e,
				rentorsell: 1,
				rentorsellvalue: "出售",
				}
				
				if (tData.pickerText3 == "请选择") {
					  warn = "请正确选择区域！"
					  tData.flag = true
					} else if (tData.address.length < 1) {
					  warn = "请正确填写详细地址！"

					  tData.flag = true
					} else if (tData.title.length > 27 || tData.title=="") {
					  warn = "正确填写标题！"
					  tData.flag = true
					} else if (tData.linkmanPhone.length!=11) {
					  warn = "请填写正确手机号！"

					   tData.flag = true
					} else if (tData.price == "") {
					  warn = "请填写价格！"

					   tData.flag = true
					} else if (tData.type2 == "") {
					  warn = "请选择物品类型！"

					   tData.flag = true
					} else if (tData.jobRequirements == "") {
					  warn = "请输入物品描述！"

					  tData.flag = true
					} else if (tData.imgList == "") {
					  warn = "一定要添加图片呀！"

					  tData.flag = true
					}else{
						 tData.flag = false
					}
					if(tData.flag ==false && isImg===true){
					uni.request({
								  url: shoppublic.getUrl() + '/secondHandItem/addSecondHandItem',
								data: data,
								header: {
									 'content-type': 'application/json' //自定义请求头信息
								},
								success: (res) => {
								warn="添加成功"
								},fall: function (res) {
								  warn="添加失败"
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
			// 三级l联动
			showMulLinkageThreePicker(e) {
				this.type = e.currentTarget.dataset.type
			    this.$refs.mpvueCityPicker.show()
			},
			//物品类型
			   showSinglePicker(e) {
				console.log(e.currentTarget.dataset.type);
				this.type = e.currentTarget.dataset.type
			    this.pickerValueArray = this.industrylist
			    this.mode = 'selector'
			    this.deepLength = 1
			    this.pickerValueDefault = [0]
			    this.$refs.mpvuePicker.show()
			},
			addImg(){
				var _this=this
				uni.chooseImage({
				count: 6, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: function (res) {
				_this.imgList=res.tempFilePaths
				console.log(_this.imgList)
				}
});
			},
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
								_this.type2=e.value
							}else if(this.type == "1"){
								_this.pickerText1 = e.label;
								_this.type1=e.value
							}
							
			// 				let location = e.label.split('-');
			// 				let city_name = location[location.length - 1];
			// 				console.log(city_name);
							// _this.startcreatview(city_name);
						}
					},
			
		// 求购按钮的点击事件
		onNavigationBarButtonTap(e) {
			console.log(e);
			if(e.index === 0){
				uni.navigateTo({
					url: '../sale/sale'
				});
			}
		}
	}
</script>

<style lang="scss">
@import "./askToBuy.scss";
</style>
