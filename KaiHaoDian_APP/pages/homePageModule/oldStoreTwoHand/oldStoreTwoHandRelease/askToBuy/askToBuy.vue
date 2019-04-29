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
				<view><textarea  placeholder="" maxlength="-1" v-model="description"/></view>
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
					<navigator url="Degree/Degree">
						{{oldtitle}}<text class="iconfont" v-if="!oldtitle">&#xe616;</text>
					</navigator>
					
				</view>
			</view>
			<view class="meansexchange">
				<view class="means">
					<view class="modes">
						交易方式
					</view>
					<view class="deals">
						<view v-for='(item,idx) in deal' :key='idx'  :class="item.isSelected ?'Active' : 'deal' " @click="changes(idx,item)">
					{{item.title}}
					<text class="iconfont">&#xe68e;</text>
						</view>
					</view>
				</view>
				
			</view>
			<view class="price">
				<view>
					价格
				</view>
				<view>
					<input type="text" placeholder="" v-model="price">
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
			mpvueCityPicker,
			
		},
		onLoad(option) {
			if(option.title){
				this.oldtitle=option.title
			}else{
				this.oldtitle=''
			}
		},
		data() {
			return {
				Degree:'',
				oldtitle:'',
				ImgList:[],
				changeed:-1,
				imgsrc:[],
				 pics: [],
				 width: "",
				 isShowaddImg:true,
				deal:[
					{
						title:'自提',
						isSelected:false
					},
					{
						title:'邮递',
						isSelected:false
					},
					{
						title:'同城交易',
						isSelected:false
					}
				],
				business:'',
				description:'',
				token:14651,
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
				imageUrl:shoppublic.getImageUrl(),
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
				sishow(){
			this.isImg=!this.isImg
			},
			// 发布
				 formSubmit1() {
					this.fabu(1)
			},
			changes(index,item){
				this.changeed=index
				 item.isSelected = !item.isSelected
			},
			//发布公用函数
			fabu(e,urgent){
				var warn=""
				var _this=this
				var tData=_this
				
				var data={			
				token: this.token,
				title: tData.title, //名称
				phone: tData.linkmanPhone,
				type: tData.type2,   //
				typevalue: tData.pickerText2,
				description: tData.description,
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
				urgent: 1,
				rentorsell: 1,
				rentorsellvalue: "出售",
				}
				
				if (tData.pickerText3 == "请选择") {
					  warn = "请正确选择区域！"
					
					} else if (tData.address.length < 1) {
					  warn = "请正确填写详细地址！"

					} else if (tData.oldtitle) {
					  warn = "请选择新旧度！"
					
					} else if (tData.business) {
					  warn = "请选择交易方式！"

					   
					} else if (tData.price == "") {
					  warn = "请填写价格！"

					   tData.flag = true
					} else if (tData.type2 == "") {
					  warn = "请选择物品类型！"

					  
					} else if (tData.description == "") {
					  warn = "请输入商品描述！"

					  
					} else if (tData.imgList == "") {
					  warn = "一定要添加图片呀！"

					 
					}else{
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
			this.fabu()
		}
	}
</script>

<style lang="scss">
	.Active{
	padding: 0upx 30upx;
	box-sizing: border-box;
	border-radius: 10upx;
    color: #333333;
    background:#fff2d7;
		position: relative;
		.iconfont{
			position: absolute;
			right: -4upx;
			top: -24upx;
			color: #ffbd38;
		}
  }
@import "./askToBuy.scss";
</style>
