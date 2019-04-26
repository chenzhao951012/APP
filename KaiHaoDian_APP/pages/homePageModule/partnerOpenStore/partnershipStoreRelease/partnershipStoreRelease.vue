<template>
	<view class="content">
		<!-- 列表项 -->
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray">确定</mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		<!-- 区域 -->
		<view class="setShop">
			<!-- //头部 -->
			<view class="partnership-top">
				<view class="title">
					<view><text>介绍标题</text></view>
					<view class="inputBox"><input type="text" maxlength="100" placeholder="给你的店铺七个响亮的标题吧~" v-model="Introducetitl"  placeholder-style="color:#b4b4b4"></view>
				</view>
					<view class="title title2">
					<view><text>店铺名称</text></view>
					<view class="inputBox inputBox3"><input type="text" maxlength="100" placeholder="" v-model="shopname"  placeholder-style="color:#333333"></view>
				</view>
				<view class="title">
					<view><text>项目类型</text></view>
					<view class="inputBox inputBox2" data-type="3" @click="projectobject">{{pickerText3}}</view>
				</view>
			</view>
		</view>
		<view class="setShop">
			<!-- //头部 -->
			<view class="partnership-top">
				<view class="title">
					<view><text>项目进度</text></view>
					<view class="inputBox inputBox2" data-type="2" @click="showSinglePicker">{{pickerText2}}</view>
				</view>
					<view class="title">
					<view><text>详细地址</text></view>
					<view class="inputBox inputBox2" data-type="1" @click="showMulLinkageThreePicker">{{pickerText1}}</view>
				</view>
				<view class="title" style="border-bottom: 0;">
					<view><text>联系方式</text></view>
					<view class="inputBox"><input type="text" maxlength="100" placeholder="" v-model="phoneNumber"  placeholder-style="color:#b4b4b4"></view>
				</view>
			</view>
			
		</view>
			<view class="setShop">
			<!-- //头部 -->
			<view class="partnership-top ">
				<view class="title" style="border-bottom: 0;">
					<view><text>图片展示</text></view>
				</view>
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
			<view class="partnership-top ">
				<view class="title" style="border-bottom: 0;">
					<view><text>项目介绍</text></view>
				</view>
					<view class="demand">
						<textarea value="" placeholder="" maxlength="1000" v-model="projectintroduction"/>
					</view>
			</view>
				<view class="partnership-top ">
				<view class="title" style="border-bottom: 0;">
					<view><text>合伙人需求</text></view>
				</view>
					 <view class='peitao_r'>
          <view class='faBuInPut padding0'>
            <view class="choose">
              <view class='nav '>
                <view class='nav-list '>
                  <checkbox-group @change="serviceValChange">
                    <block v-for="(item,index) in allGoodsFilte" :key='index'>
                      <view class='navigator'>
                        <label class="checkbox">
                          <view v-if="!item.checked" >
                            <checkbox :value="item.value" hidden='false' :checked="item.checked" />
                            <image :src="imageUrl + item.url"></image>
                            <view style='font-size:28upx; color:#6b6b6b;height:28upx;'>{{item.name}}</view>
                          </view>
                          <view class="is_checked" v-if="item.checked" >
                            <checkbox value="item.value" hidden='false ' :checked="item.checked" />
                           <image :src="imageUrl + item.url1"></image>
                            <view style='font-size:28upx; color:#2F86FF;height:28upx;'>{{item.name}}</view>
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
		
	</view>
</template>

<script>
	// 城市选择器
	var imageUrl = shoppublic.getImageUrl();
	import cityData from '@/common/city.data.js';
	// end
	
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import getLocation from '@/common/getLocation.js'; //获取地理位置
	export default {
		components: {
				mpvuePicker,
			mpvueCityPicker
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
		data() {
			return {
				wenTiTypeId: [],
				pickerText3:'请选择',
				type1:'',
				type2:'',
				countycode:"",
				cityCode:"",
				provincecode:"",
				mulLinkageTwoPicker: cityData,
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#ffbd38', //主体颜色
				pickerText1: '请选择',
				pickerText2: '请选择',
				mode: '', //组件类型
				deepLength: 1, //几级联动
				pickerValueDefault: [0], //默认选中值
				pickerValueArray: [], //渲染数据
				 provinceName:'', // 选择省区 -名字
				 cityName:'', // 选择市区 - 名字
				 countyName:'', // 选择县区 -名字
				videourl:'',
				imgsrc:[],
				 pics: [],
				 width: "",
				Introducetitl:'',//介绍标题
				shopname:'',//店铺名称
				projectprogress:'', //项目进度
				 adressdetailed:'',//详细地址
				 phoneNumber:'',//联系电话
				 projectintroduction:'',//项目介绍
				  checkArr: [], //判断合活人
				imageUrl:shoppublic.getImageUrl(),
				isShowaddImg:true,
				ImgList:[],
				shoppublic: shoppublic, //服务器地址
				stagelist: [{
					value: "0",
					label: "考察"
				  },
				  {
					value: "1",
					label: "装修中"
				  },
				  {
					value: "2",
					label: "开业筹备"
				  },
				  {
					value: "3",
					label: "在营业"
				  }
				],
				typelist: [{
						value: "0",
						label: "餐饮美食"
					  },
					  {
						value: "1",
						label: "美容保健"
					  },
					  {
						value: "2",
						label: "服饰鞋包"
					  },
					  {
						value: "3",
						label: "休闲娱乐"
					  },
					  {
						value: "4",
						label: "百货超市"
					  },
					  {
						value: "5",
						label: "生活服务"
					  },
					  {
						value: "6",
						label: "电器通讯"
					  },
					  {
						value: "7",
						label: "汽修服务"
					  },
					  {
						value: "8",
						label: "医疗器械"
					  },
					  {
						value: "9",
						label: "家居建材"
					  },
					  {
						value: "10",
						label: "教育"
					  },
					  {
						value: "11",
						label: "酒店宾馆"
					  },
					  {
						value: "12",
						label: "农业环保"
					  },

					  {
						value: "13",
						label: "母婴"
					  },
					  {
						value: "14",
						label: "网络服务"
					  },
					  {
						value: "15",
						label: "其他"
					  }
					],
			
				allGoodsFilte: [
						{
							value: '0',
							name: "技术",
							url: "/images/jsr_hui.png",
							url1:"/images/jsr_lan.png",
							url2:"/images/jsr_hei.png",
							checked: false,
							title: "jsr"
				  },
						  {
							value: '1',
							name:"策划",
							url:"/images/chr_hui.png",
							url1:"/images/chr_lan.png",
							url2:"/images/chr_hei.png",
							checked: false,
							title: "chr"
						  },
						  {
							value: '2',
							name: "管理",
							url: "/images/glr_hui.png",
							url1: "/images/glr_lan.png",
							url2: "/images/glr_hei.png",
							checked: false,
							title: "glr"
						  },
						  {
							value: '3',
							name: "运营",
							url: "/images/yyr_hui.png",
							url1: "/images/yyr_lan.png",
							url2: "/images/yyr_hei.png",
							checked: false,
							title: "yyr"
						  },
						  {
							value: '4',
							name: "营销",
							url: "/images/yxr_hui.png",
							url1: "/images/yxr_lan.png",
							url2: "/images/yxr_hei.png",
							checked: false,
							title: "yxr"
						  },
						  {
							value: '5',
							name: "投资",
							url: "/images/tzr_hui.png",
							url1: "/images/tzr_lan.png",
							url2: "/images/tzr_hei.png",
							checked: false,
							title: "tzr"
						  }
			],
				citySelect: 'false' ,//城市选择器状态
				location_city:'',//地址选择
				}
		},

		methods:{
			//项目进度
			showSinglePicker(e) {
				this.type = e.currentTarget.dataset.type
			    this.pickerValueArray = this.stagelist
			    this.mode = 'selector'
			    this.deepLength = 1
			    this.pickerValueDefault = [0]
			    this.$refs.mpvuePicker.show()
			},
				//项目类型
			projectobject(e) {
				this.type = e.currentTarget.dataset.type
			    this.pickerValueArray = this.typelist
			    this.mode = 'selector'
			    this.deepLength = 1
			    this.pickerValueDefault = [0]
			    this.$refs.mpvuePicker.show()
			},
			onCancel(e) {
				console.log(JSON.stringify(e.label));
			},
			//确定
			onConfirm(e) {
				let _this = this;
				
				if(this.type == "1"){
					console.log(e)
					_this.pickerText1 = e.label;
					_this.countycode=e.cityCode.countyCode
					_this.cityCode=e.cityCode.cityCode
					_this.provincecode=e.cityCode.provinceCode
					let locations = e.label.split('-');
					_this.cityName= locations[1]
					let city_name = locations[locations.length - 1];
					_this.cityName= locations[1]
					_this.provinceName=locations[0];
					_this.countyName=locations[2];
				}else if(this.type == "2"){
					// _this.typevalue = e.label;
					this.type1=e.value
					this.pickerText2=e.label
					console.log(e)
					
				}else if(this.type == "3"){
					// _this.typevalue = e.label;
					this.type2=e.value
					this.pickerText3=e.label
					console.log(e)
				}
				let location = e.label.split('-');
				let city_name = location[location.length - 1];
				console.log(city_name);
				// _this.startcreatview(city_name);
			},
				//三级联动
			  showMulLinkageThreePicker(e) {
				this.type = e.currentTarget.dataset.type
			    this.$refs.mpvueCityPicker.show()
			},
			//项目上传
			Projectsubmitted(){
				
				var that=this
				var warn;
					var data={
						city:that.cityCode+'00',
						cityvalue:that.cityName,
						county:that.countycode,
						countyvalue:that.countyName,
						description:that.projectintroduction,
						phone:that.phoneNumber,
						province:that.provincecode+'0000',
						provincevalue:that.provinceName, 
						src:JSON.stringify(that.imgsrc),
						stage:that.type1,
						stagevalue:that.pickerText2,
						storename:that.shopname,
						street:that.pickerText1,
						title:that.Introducetitl,
						token:14651,
						type:that.type2,
						typevalue:that.pickerText3,
						urgent:1,
						value:JSON.stringify(that.allGoodsFilte),
						videoaddress:that.videourl
					}
// 					setTimeout(()=>{
// 						console.log(data)
// 					},5000)
				if(that.Introducetitl==''){
					warn='请输入介绍标题'
				}else if(that.shopname==''){
					warn='请输入商铺名称'
				}else if(that.projectprogress==''){
					warn='请输入项目进度'
				}else if(that.adressdetailed==''){
					warn='请输入详细地址'
				}else if(that.phoneNumber=='' || !(/^1(3|4|5|7|8)\d{9}$/.test(that.phoneNumber))){
					warn='联系方式格式不对'
				}else if(that.ImgList==''){
					warn='最少上传一张图片展示'
				}else if(that.projectintroduction==''){
					warn='请输入项目介绍'
				}else if(that.checkArr==''){
					warn='最少选择一项合伙人'
				}else if(thta.pickerText1=='请选择'){
					warn='请选择开店地址'
				}else if(thta.pickerText2=='请选择'){
					warn='请选择项目进度'
				}else if(thta.pickerText3=='请选择'){
					warn='请选择项目类型'
				}else{
					uni.request({
							 				url: shoppublic.getUrl() + '/partnershipShop/addPartnershipShop',
											data:data,
											header: {
											'content-type': 'application/json' // 默认值
							        },
					  success: function(res) {
					    console.log(res)
					    if (res.data.msgCode == "1") {
					      
					      uni.showModal({
					        title: '添加成功',
					        content: '即将返回首页',
					        showCancel: false,
					        success(res) {
					          setTimeout(()=>{
										
									},3000)
					      
					        }
					      })
					    } else {
					     warn='添加失败'
					    }
					
					
					  },
					  fall: function(res) {
					
					  }
					})
				}
				
				
				 uni.showToast({
				 	title:warn,
					duration:2000,
					icon:'none'
				 })
			},
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
				// 寻找合伙人样式的切换
			serviceValChange: function(e) {
					console.log(e.detail.value)
					var allGoodsFilte = this.allGoodsFilte;
					var checkArr = e.detail.value;
					  this.checkArr=checkArr
					for (var i = 0; i < allGoodsFilte.length; i++) {
					  if (checkArr.indexOf(i + "") != -1) {
						allGoodsFilte[i].checked = true;
					  } else {
						allGoodsFilte[i].checked = false;
					  }
					};
					  this.allGoodsFilte=allGoodsFilte
					
					console.log(allGoodsFilte)
				  },
		

			// end
			// 验证输入的手机号格式
			validating(e){
				console.log(e.mp.detail.value);
				var val = e.mp.detail.value;
				var inp = document.querySelector(".phone");				
			},
			// 寻找合伙人样式的切换
			
		},
		// 原生按钮点击事件
		onNavigationBarButtonTap(e) {
				this.Projectsubmitted()
		}
	}
</script>

<style lang="scss">
@import './partnershipStoreRelease.scss';
</style>
