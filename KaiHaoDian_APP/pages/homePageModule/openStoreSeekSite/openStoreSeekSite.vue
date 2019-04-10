<template>
	<view class="content">
		<view class="" v-if="isHidden">
				<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray">确定</mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		<!-- 开店业态 -->
		<view class="_infoFill">
			<view class="_left">开店业态</view>
		 	<view class="_right" data-type="1" @click="openingStatS">{{pickerText1}}</view>
		</view>
		<!-- 面积要求 -->
		<view class="_infoFill">
		 	<view class="_left" style="width: 200upx;">面积要求</view>
		 		<view class="_right" style="display:flex;margin-left: 150upx;position: absolute;right: -8upx;">
		 		<view class="Minmoney">
		 			<input type="text" value="" v-model="Minarea" placeholder="最小面积"/>
		 		</view>-
		 		<view class="Maxmoney">
		 			<input type="text" value="" v-model="Maxarea" placeholder="最大面积"/>
		 		</view>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		 		<text style="margin-left: 6upx;">㎡</text>
		 	</view>
		</view>
		<!-- 租金要求 -->
		<view class="_infoFill">
		 	<view class="_left"  style="width: 200upx;">租金要求</view>
		 	<view class="_right" style="display:flex;margin-left: 340upx;position: absolute;right: -8upx;">
		 		<view class="Minmoney"  style="background: #f7f7f7;">
		 			<input type="text" value="" v-model="Minmoney" placeholder="最低租金" />
		 		</view>-
		 		<view class="Maxmoney" style="background: #f7f7f7;">
		 			<input type="text" value="" v-model="Maxmoney" placeholder="最高租金" />
		 		</view>
		 		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		 		<text style="margin-left: 6upx;">元</text>
		 	</view>
		</view>
		<!-- 店铺类型 -->
		<view class="_infoFill">
			<view class="_left">店铺类型</view>
		 	<view class="_right" data-type="2" @touchend="OpenType">{{pickerText2}}</view>
		</view>
		<!-- 门面区域 -->
		<view class="_infoFill">
			<view class="_left">门面区域</view>
		 	<view class="_right" data-type="3" @click="showMulLinkageThreePicker">{{pickerText3}}</view>
		</view>
		<!-- 配套设施 -->
		<view class="_assort_store">
		 	<view class="_assort_title">配套设施</view>
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
		 		            <view style='font-size:28upx; color:#999;height:28upx;'>{{item.name}}</view>
		 		          </view>
		 		          <view class="is_checked" v-if="item.checked">
		 		            <checkbox :value="item.value" hidden='false ' :checked="item.checked" />
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
		<view class="intelligent_matching" @touchend="matching">智能匹配</view>
		</view>
		<view class='transfer'>
		  <view class='transfer_list' v-for="(item,index) in shopAddressInfo"  :key="index">
		    <navigator class='transfer_list_nav' @touchend='listID(index)'>
		      <view class='_list_Z'>
		        <image class='list-img' :src='item.src' mode='aspectFill'></image>
		      </view>
		      <view class='_list_Y'>
		        <text class='_list_Y_text'>{{item.title}}</text>
		        <text style="color:#999;font-size:24upx;height:50upx;float:right;line-height:50upx;display:inline-block;">{{item.addtime}}</text>
		        <view class='_list_Y_M' style='font-size:28upx; color:#666;' v-if='item.areaMin !=item.areaMax'> {{item.areaMin}}㎡-{{item.areaMax}}㎡ {{item.countyValue}}</view>
		        <view class='_list_Y_M' style='font-size:28upx; color:#666;'  v-else-if='item.areaMin ==item.areaMax'> {{item.areaMax}}㎡ {{item.countyValue}}</view>
		        <view style='color:#FF662C;font-size:32upx;' v-if='item.rentMin != item.rentMax'>{{item.rentMin}}-{{item.rentMax}}元/月</view>
		        <view style='color:#FF662C;font-size:32upx;'   v-else-if='item.rentMin == item.rentMax'>{{item.rentMax}}元/月</view>
		        <view style=' width:360upx;height:35upx;'>
		        <view style='color:#FF662C;font-size:32upx;'>匹配度：{{item.proportion}}%</view>            
		        </view>
		      </view>
		
		    </navigator>
		
		  </view>
		
		</view>
	</view>
	 
</template>

<script>
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import cityData from '@/common/city.data.js';
	// end
	import shoppublic from '@/common/shoppublic'; //服务器地址 //获取地理位置
	import matingtype from '@/common/matingtype.js'
	export default {
				components: {
				mpvuePicker,
				mpvueCityPicker
		},
		data() {
			return {
				token:14651,
				shopAddressInfo:null,
				subpickerText1:"",
				subpickerText2:"",
				isHidden:true,
				Maxarea:"",
				Minmoney:"",
				Maxmoney:"",
				Minarea:"",
				imageUrl:shoppublic.getImageUrl(),
				allGoodsFilte:matingtype,
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
				 peiTaocheckArr:[],
				 dianpuleixing: [{
							value: "0",
							label: "商业街商铺"
						  },
						  {
							value: "1",
							label: "写字楼配套"
						  },
						  {
							value: "2",
							label: "社区底商铺"
						  },
						  {
							value: "3",
							label: "档口摊位"
						  },
						  {
							value: "4",
							label: "临街门面"
						  },
						  {
							value: "5",
							label: "购物百货中心"
						  },
						  {
							value: "6",
							label: "其他"
						  },
						],
				rentorslist: [{
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
			};
		},
	
		methods:{
				//页面跳转详情
				listID(index) {
					var that = this
					// var idx = event.currentTarget.dataset.index;
					var listid = this.shopAddressInfo[0].type
					console.log(that.shopAddressInfo[0].type)
					if (listid == "1") {
					  uni.navigateTo({
						url: '../oldStoreTwoHand/oldStoreTwoHandDateils/oldStoreTwoHandDateils?id=' + this.shopAddressInfo[index].id
					  })
					} else {
					  uni.navigateTo({
						url:  '../newStoreRental/newStoreRentalDateils/newStoreRentalDateils?id=' + this.shopAddressInfo[index].id
					  })
					}

				  },
		
			//智能匹配
		
				 matching() {
						var that = this;
						   uni.showLoading({
						  title: '正在匹配中···',
						  mask:false,
						})
						
						var allGoodsFilte = this.allGoodsFilte;
						var peitao = "";
						for (var i = 0; i < this.peiTaocheckArr.length;i++){
						  peitao = peitao + allGoodsFilte[this.peiTaocheckArr[i]].name+'|'
						}
						var shopAddressInfo = "";
						  
						var data = {
						  token: that.token,
						  areaMin: this.Minarea == undefined ? "" : this.Minarea,
						  areaMax: this.Minarea == undefined ? "" : this.Minarea,
						  rentMin: this.Minarea == undefined ? "" : this.Minarea,
						  rentMax: this.Minarea == undefined ? "" : this.Minarea,
						  province:this.province,
						  provinceValue:this.provincevalue,
						  city:this.city,
						  cityValue:this.cityvalue,
						  County:this.county,
						  countyvalue:  this.countyvalue,
						  support: peitao,
						  typeValue: this.subpickerText2,
						  industryValue:this.subpickerText1
						};
							console.log(data)

        uni.request({
          url: shoppublic.getUrl() + '/KaiDian/searchAddress',
          data: data,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function(res) {
			  console.log(res)
            if (res.data.responseBody == null) {
              uni.showModal({
                title: '提示',
                content: '暂无匹配选项,请更改匹配条件',
                showCancel:false,
              })
            }
           
              that.shopAddressInfo=res.data.responseBody == null ? '' : res.data.responseBody.shopAddressInfo,
              // disabled:true
              that.isHidden=!that.isHidden
          console.log()
            setTimeout(function () {
              uni.hideLoading();
             
               
            })
          },
          fall: function(res) {
         
            setTimeout(function () {
              uni.hideLoading()
            })
          }
        })
    

  },
				
				//商铺配套
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
			//开业状态
		
			    openingStatS(e) {
				console.log(e.currentTarget.dataset.type);
				this.type = e.currentTarget.dataset.type
			    this.pickerValueArray = this.rentorslist
			    this.mode = 'selector'
			    this.deepLength = 1
			    this.pickerValueDefault = [0]
			    this.$refs.mpvuePicker.show()
			},
			//开店类型
			 OpenType(e) {
				console.log(e.currentTarget.dataset.type);
				this.type = e.currentTarget.dataset.type
			    this.pickerValueArray = this.dianpuleixing
			    this.mode = 'selector'
			    this.deepLength = 1
			    this.pickerValueDefault = [0]
			    this.$refs.mpvuePicker.show()
			},
			//三级联动
				showMulLinkageThreePicker(e) {
				this.type = e.currentTarget.dataset.type
			    this.$refs.mpvueCityPicker.show()
			},
			onCancel(e) {
							console.log(JSON.stringify(e.label));
						},
						// 确定
						onConfirm(e) {
							let _this = this;
							console.log(JSON.stringify(e.label));
							if(this.type == "3"){
								 
								_this.pickerText3 = e.label;
								let location = e.label.split('-');
								_this.provincevalue = location[0];
								_this.cityvalue = location[1];
								_this.countyvalue = location[2];
								_this.city=e.cityCode.cityCode
								_this.county=e.cityCode.countyCode
								_this.province=e.cityCode.provinceCode
								
							console.log(e)
							}else if(this.type == "2"){
								_this.pickerText2 = e.label;
								_this.type2=e.value
								_this.subpickerText2=e.label
							}else if(this.type == "1"){
								_this.pickerText1 = e.label;
								_this.type1=e.value
								_this.subpickerText1=e.label
							}
							
			// 				let location = e.label.split('-');
			// 				let city_name = location[location.length - 1];
			// 				console.log(city_name);
							// _this.startcreatview(city_name);
						},
			assortStore(index,bool){
				this.assortList[index].bool = !this.assortList[index].bool;
			},
		}
	}
</script>

<style lang="scss">
@import './openStoreSeekSite.scss';
</style>
