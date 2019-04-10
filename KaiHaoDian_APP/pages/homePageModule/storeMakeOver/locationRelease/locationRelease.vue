<template>
	<view class="content">
		<!-- 选择联动 -->
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		@onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray">确定</mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		@onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		<!-- 所在区域 -->
		<view class="_infoFill">
			<view class="_left">所在区域</view>
			<!-- @click="showMulLinkageThreePicker" {{pickerText3}}-->
		 	<view class="_right" data-type="1"  @click="showMulLinkageThreePicker">{{pickerText1}}</view>
		</view>
		<!-- 地址 -->
		<view class="_infoFill">
		 	<view class="_left">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址</view>
		 	<input class="_right" type="text" value="" maxlength="20" placeholder="请输入详细地址" v-model="detailedAddress"/>
		</view>
		<view class="_infoFill">
		 	<view class="_left">联系电话</view>
		 	<input class="_right" type="text" value="" maxlength="20" placeholder="请输入联系电话" v-model="ThePhone"/>
		</view>
		<!-- 项目类型 -->
		<view class="_infoFill">
		 	<view class="_left">当前行业</view>
			<!-- @click="showSinglePicker" {{pickerText1}} -->
		 	<view class="_right" @click="showSinglePicker" data-type="2">{{pickerText2}}</view>
		</view>
		<!-- 项目进度 -->
		<view class="_infoFill">
		 	<view class="_left">转让类别</view>
			<!-- @click="showSinglePicker2"  {{pickerText2}}-->
		 	<view class="_right"  @click="showSinglePicker2" data-type="3">{{pickerText3}}</view>
		</view>
		<!-- 面积 -->
		<view class="_infoFill">
		 	<view class="_left">面&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;积</view>
			<view class="_right">
				<input type="text" value="" maxlength="20" placeholder="请输入" v-model="area"/>
				<text>㎡</text>
			</view>
		 	
		</view>
		<!-- 转让费 -->
		<view class="_infoFill">
		 	<view class="_left">转&nbsp;&nbsp;让&nbsp;&nbsp;费</view>
			<view class="_right">
				<input type="text" value="" maxlength="20" placeholder="请输入" v-model="transferFee"/>
				<text>元</text>
			</view>
		 	
		</view>
		<!-- 当前营业额 -->
		<view class="_infoFill">
		 	<view class="_left">当前营业额</view>
			<view class="_right">
				<input type="text" value="" maxlength="20" placeholder="请输入" v-model="turnover"/>
				<text>元/天</text>
			</view>
		</view>
		<!-- 租金 -->
		<view class="_infoFill">
		 	<view class="_left">租金</view>
			<view class="_right">
				<input type="text" value="" maxlength="20" placeholder="请输入" v-model="rent"/>
				<text>元/月</text>
			</view>
		</view>
		<!-- 当前状态 -->
		<view class="_infoFill">
		 	<view class="_left">当前状态</view>
			<!-- @click="showSinglePicker2"  {{pickerText2}}-->
		 	<view class="_right" @click="showState" data-type="4">{{pickerText4}}</view>
		</view>
		<!-- 店铺类型 -->
		<view class="_infoFill">
		 	<view class="_left">店铺类型</view>
			<!--@click="showSinglePicker2"  {{pickerText2}}-->
		 	<view class="_right" @click="showStoreType"  data-type="5">{{pickerText5}}</view>
		</view>
		<!-- 店铺配套 -->
		<view class="_assort_store">
		 	<view class="_assort_title">店铺配套</view>
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
		<!-- 周边状况 -->
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
		<!-- 标题 -->
		<view class="_title_parnters">
			<view class="_top_caption">
				<view class="_title_caption">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题</view>
				<input type="text" placeholder="请输入标题" maxlength="28" v-model="headline"/>
			</view>
			<!-- 合伙说明 -->
			<view class="_title_instructions">
				<view class="_title_top">合伙说明</view>
				<textarea type="text" placeholder="请输入项目描述" maxlength="200" v-model="describe"/>
			</view>
			<!-- 添加图片 -->
			<view class="_add_photo">
				<view class="ImgBox" v-for="(item,index) in imgListurl" v-if="imgListurl" :key="index">
					<image :src="item[0]" mode=""></image>
				</view>
				<view class="_photo_icon iconfont " @click="addImg">&#xe6e7;</view>
				<view class="_photo_title">至少添加一张图片</view>
			</view>
		</view>
		<!-- 单选题 -->
		<view class="_confirm">
			<view class="_confirm_icon" @click="isshows">
				<image src="../../../../static/dui.jpg" mode="" style="width: 20px;height: 20px;border-radius: 50%;" v-show="isImg" v-if="isCheck"></image>
			</view>
			<view class="">本人承诺以上全部属实</view>
		</view>
		<!-- 发布按钮 -->
		<view class="_position_button">
			<view class="_left_button" @click="release">发布</view>
			<view class="_right_button">加急发布</view>
		</view>
	</view>
</template>

<script>
	// 城市选择器
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import cityData from '@/common/city.data.js';
	// end
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import getLocation from '@/common/getLocation.js'; //获取地理位置
	export default {
		onLoad() {
			this.disabled=true
		},
		// 监听页面返回
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
		components: {
			mpvuePicker,
			mpvueCityPicker
		},
		data() {
			return {
				/**
				 * detailedAddress地址
				 * ThePhone电话
				 * area面积
				 * turnover转让费
				 * transferFee当前营业额
				 * provinceName:'', // 选择省区 -名字
				 * 	cityName:'', // 选择市区 - 名字
				 * countyName:'', // 选择县区 -名字
				 * countycode区码
				 * cityCode市码
				 * provincecode省码
				 * headline标题
				 * describe转让描述
				 * imgListurl本地图片添加列表
				 */
				disabled:false,
				imageUrl:shoppublic.getImageUrl(),
				allGoodsFilte: [
					{ value: '0', name: "货梯", url: "/images/sp/huoti_hui.png", url1: "/images/sp/huoti_lan.png", url2: "/images/sp/huoti_hei.png", checked: false, title: "ht" },
					{ value: '1', name: "客梯", url: "/images/sp/keti_hui.png", url1: "/images/sp/keti_lan.png", url2: "/images/sp/keti_hei.png", checked: false, title: "kt" },
					{ value: '2', name: "扶梯", url: "/images/sp/futi_hui.png", url1: "/images/sp/futi_lan.png", url2: "/images/sp/futi_hei.png", checked: false, title: "ft" },
					{ value: '3', name: "空调", url: "/images/sp/kongtiao_hui.png", url1: "/images/sp/kongtiao_lan.png", url2: "/images/sp/kongtiao_hei.png", checked: false, title: "kongt" },
				  { value: '4', name: "停车", url: "/images/sp/tingche_hui.png", url1: "/images/sp/tingche_lan.png", url2: "/images/sp/tingche_hei.png", checked: false, title: "tcw" },
				  { value: '5', name: "网络", url: "/images/sp/wangluo_hui.png", url1: "/images/sp/wangluo_lan.png", url2: "/images/sp/wangluo_hei.png", checked: false, title: "wl" },
				  { value: '6', name: "天然气", url: "/images/sp/tianranqi_hui.png", url1: "/images/sp/tianranqi_lan.png", url2: "/images/sp/tianranqi_hei.png", checked: false, title: "trq" },
				  { value: '7', name: "暖气", url: "/images/sp/nuanqi_hui.png", url1: "/images/sp/nuanqi_lan.png", url2: "/images/sp/nuanqi_hei.png", checked: false, title: "nq" },
				  { value: '8', name: "上水", url: "/images/sp/shangshui_hui.png", url1: "/images/sp/shangshui_lan.png", url2: "/images/sp/shangshui_hei.png", checked: false, title: "ss" },
				  { value: '9', name: "下水", url: "/images/sp/xiashui_hui.png", url1: "/images/sp/xiashui_lan.png", url2: "/images/sp/xiashui_hei.png", checked: false, title: "xs" },
				  { value: '10', name: "排污", url: "/images/sp/paiwu_hui.png", url1: "/images/sp/paiwu_lan.png", url2: "/images/sp/paiwu_hei.png", checked: false, title: "pw" },
				  { value: '11', name: "排烟", url: "/images/sp/paiyan_hui.png", url1: "/images/sp/paiyan_lan.png", url2: "/images/sp/paiyan_hei.png", checked: false, title: "pf" },
				  { value: '12', name: "380V", url: "/images/sp/380v_hui.png", url1: "/images/sp/380v_lan.png", url2: "/images/sp/380v_hei.png", checked: false, title: "380v" },
				  { value: '13', name: "餐煤", url: "/images/sp/canmei_hui.png", url1: "/images/sp/canmei_lan.png", url2: "/images/sp/canmei_hei.png", checked: false, title: "cm" },
				  { value: '14', name: "可明火", url: "/images/sp/keminghuo_hui.png", url1: "/images/sp/keminghuo_lan.png", url2: "/images/sp/keminghuo_hei.png", checked: false, title: "kmh" },
				  { value: '15', name: "外摆区", url: "/images/sp/waibaiqu_hui.png", url1: "/images/sp/waibaiqu_lan.png", url2: "/images/sp/waibaiqu_hei.png", checked: false, title: "wbq" }
				
				],
				    zhouBian: [
      { value: '0', name: "学校", url: "/images/zb/xuexiao_hui.png", url1: "/images/zb/xuexiao_lan.png", url2: "/images/zb/xuexiao_hei.png", checked: false, title: 'xx' },
      { value: '1', name: "小区", url: "/images/zb/xiaoqu_hui.png", url1: "/images/zb/xiaoqu_lan.png", url2: "/images/zb/xiaoqu_hei.png", checked: false, title: 'xiaoq' },
      { value: '2', name: "医院", url: "/images/zb/yiyuan_hui.png", url1: "/images/zb/yiyuan_lan.png", url2: "/images/zb/yiyuan_hei.png", checked: false, title: 'yiy' },
      { value: '3', name: "商场", url: "/images/zb/shangchang_hui.png", url1: "/images/zb/shangchang_lan.png", url2: "/images/zb/shangchang_hei.png", checked: false, title: 'sc' },
      { value: '4', name: "超市", url: "/images/zb/chaoshi_hui.png", url1: "/images/zb/chaoshi_lan.png", url2: "/images/zb/chaoshi_hei.png", checked: false, title: 'cs' },
      { value: '5', name: "美食城", url: "/images/zb/meishicheng_hui.png", url1: "/images/zb/meishicheng_lan.png", url2: "/images/zb/meishicheng_hei.png", checked: false, title: 'msc' },
      { value: '6', name: "健身房", url: "/images/zb/jianshenfang_hui.png", url1: "/images/zb/jianshenfang_lan.png", url2: "/images/zb/jianshenfang_hei.png", checked: false, title: 'jsf' },
      { value: '7', name: "公交", url: "/images/zb/gongjiao_hui.png", url1: "/images/zb/gongjiao_lan.png", url2: "/images/zb/gongjiao_hei.png", checked: false, title: 'gj' },
      { value: '8', name: "地铁", url: "/images/zb/ditie_hui.png", url1: "/images/zb/ditie_lan.png", url2: "/images/zb/ditie_hei.png", checked: false, title: 'dt' }
    ],
				detailedAddress:"",
				ThePhone:"",
				isCheck:false,
				area:"",
				 turnover:"",
				transferFee:"",
				rent:"",
				provinceName:'', 
				cityName:'',
				countycode:"",
				cityCode:"",
				provincecode:"",
				countyName:'',
				headline:"",
				describe:"",
			
				token:14651,
				imgListurl:[],				
				mulLinkageTwoPicker: cityData,
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#007AFF', //主体颜色
				pickerText3: '请选择',
				pickerText2: '请选择',
				pickerText1: '选择地区',
				pickerText4: '请选择',
				pickerText5:'请选择',
				type:"",
				isImg:true,
				mode: '', //组件类型
				deepLength: 1, //几级联动
				pickerValueDefault: [0], //默认选中值
				pickerValueArray: [], //渲染数据
				shoppublic: shoppublic, //服务器地址
				peiTaocheckArr:[],
				zhouBiancheckArr:[],
				type1:"",
				type2:"",
				type3:"",
				type4:"",
				pickerSingleArray: [
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
								transfertypelist: [
								{ value: "0", label: "整转" },
								{ value: "1", label: "空转" }
								],
								//当前状态
								statuslist: [
								  { value: "0", label: '空置中' },
								  { value: '1', label: "经营中" }
								],
								//店铺类型
								 typelist: [
								  { value: "0", label: "商业街商" },
								  { value: "1", label: "写字楼配套" },
								  { value: "2", label: "社区底商" },
								  { value: "3", label: "档口摊位" },
								  { value: "4", label: "临街门面" },
								  { value: "5", label: "购物百货中心" },
								  { value: "6", label: "其他" },
								],
			
			};
				  
		},
		methods:{
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
							wx.showModal({
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
			allrelease(e, urgent){
				var _this=this
				var that=""  
							
									 if(_this.pickerText1=="选择地区" && _this.ThePhone=="" && _this.detailedAddress=="" && _this.pickerText2=="请选择" 
									&& _this.pickerText3=="请选择" && _this.pickerText4=="请选择" && _this.pickerText5=="请选择" && _this.area=="" && _this.area==""
									&& _this.transferFee==""  && _this.imgListurl.length<1 && _this.turnover=="" && _this.peiTaocheckArr == '' && _this.zhouBiancheckArr == ''
									){
										that="请完善信息"
										}
										else if(_this.pickerText1=="选择地区"){
											that="请选择区域"
										}else if(_this.ThePhone==""){
											that="请输入正确的电话号码"
										}else if(_this.detailedAddress==""){
											that="请输入正确地址"
										}else if(_this.pickerText2=="请选择"){
											that="请选择当前行业"
										}else if(_this.pickerText3=="请选择"){
											that="请选择转让类别"
										}else if(_this.pickerText4=="请选择"){
											that="请选择当前状态"
										}else if(_this.pickerText5=="请选择"){
											that="请选择店铺类型"
										}else if(_this.area==""){
											that="请输入面积"
										}else if(_this.transferFee==""){
											that="请输入当期营业额"
										}else if(_this.imgListurl.length<1){
											that="请添加图片"
										}else if(_this.turnover==""){
											that="请输入转让费"
										}else if(_this.headline==""){
											that="请输入标题"
										}else if (_this.peiTaocheckArr == '') {
										  that = "商铺配套至少选择1项 ！"
										} else if (_this.zhouBiancheckArr == '') {
										  that = "周边设施至少选择1项 ！"
										}else if(_this.isCheck==false){
											that="请确认是否同意以上信息"
										}
										
										var data={
											    token: _this.token,
												title: _this.headline,
												area: _this.area,
												phone: _this.ThePhone,
												loadingfee: _this.turnover,
												type: _this.type1,
												typevalue: _this.pickerText5,
												rent: _this.rent,
												industry: _this.type1,
												industryvalue: _this.pickerText2,
												province: _this.provincecode,
												provincevalue: _this.provinceName,
												transfertype: _this.type2,
												transfertypevalue: _this.pickerText5,
												status: _this.type3,
												statusvalue: _this.pickerText4,
												city: _this.cityCode,
												cityvalue: _this.cityName,
												county: _this.cityCode,
												countyvalue:_this.countyName,
												street: _this.detailedAddress,
												videoaddress: "",
												src: JSON.stringify(_this.imgListurl),
												supporting: JSON.stringify(_this.allGoodsFilte),
												around: JSON.stringify(_this.zhouBian),
												reason: _this.describe,
												turnover: _this.transferFee,
												urgent: e
											
										}
										if(_this.isCheck==true){
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
															 			//直接跳转列表页面
															 			uni.reLaunch({
															 			  url: '../storeMakeOver'
															 			})
															 			// wx.navigateBack({
															 			//   delta: 1
															 			// })
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
										
										})
							}
							
							uni.showModal({
							  title: '提示',
							  content: that,
							  showCancel: false,
							 
							})
						},
			//添加图片	
			addImg(e){
				let that=this
				let imgur=''
				uni.chooseImage({
				count: 3, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: function (res) {
						that.imgListurl.push(res.tempFilePaths)
		console.log(that.imgListurl)
			},
			 
				
		});
			},
			
			//商铺配套
// 		shopIsSshow(i,arr){
// 				arr[i].checked=!arr[i].checked
// 				},
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
			//周边情况变色
		
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
			// 当前行业
		    showSinglePicker(e) {
				this.type = e.currentTarget.dataset.type
		        this.pickerValueArray = this.pickerSingleArray
		        this.mode = 'selector'
		        this.deepLength = 1
		        this.pickerValueDefault = [0]
		        this.$refs.mpvuePicker.show()
		    },
			// 转让让类型
			showSinglePicker2(e){
				// console.log(e.currentTarget.dataset.type);
				this.type = e.currentTarget.dataset.type
				this.pickerValueArray = this.transfertypelist
				this.mode = 'selector'
				this.deepLength = 1
				this.pickerValueDefault = [0]
				this.$refs.mpvuePicker.show()
			},
			//当前状态
			showState(e){
					this.type = e.currentTarget.dataset.type
				this.pickerValueArray = this.statuslist
				this.mode = 'selector'
				this.deepLength = 1
				this.pickerValueDefault = [0]
				this.$refs.mpvuePicker.show()
			} ,
			//店铺类型
			showStoreType(e){
					this.type = e.currentTarget.dataset.type
				this.pickerValueArray = this.typelist
				this.mode = 'selector'
				this.deepLength = 1
				this.pickerValueDefault = [0]
				this.$refs.mpvuePicker.show()
			},
			// 三级联动选择
		    showMulLinkageThreePicker(e) {
				this.type = e.currentTarget.dataset.type
		        this.$refs.mpvueCityPicker.show()
		    },
			// 取消
			onCancel(e) {
				console.log(JSON.stringify(e.label));
			},
			// 确定
			onConfirm(e) {
				let _this = this;
				console.log(JSON.stringify(e.label));
				if(this.type == "1"){
					_this.pickerText1 = e.label;
					_this.countycode=e.cityCode.countycode
					_this.cityCode=e.cityCode.cityCode
					_this.provincecode=e.cityCode.countycode
					let locations = e.label.split('-');
					_this.cityName= locations[1]
					let city_name = locations[locations.length - 1];
					_this.cityName= locations[1]
					_this.provinceName=locations[0];
					_this.countyName=locations[2];
				}else if(this.type == "2"){
					_this.pickerText2 = e.label;
					this.type1=e.value
				}else if(this.type == "3"){
					_this.pickerText3 = e.label;
					this.type2=e.value
				}else if(this.type == "4"){
					_this.pickerText4 = e.label;
					this.type3=e.value
				}else if(this.type == "5"){
					_this.pickerText5 = e.label;
					this.type3=e.value
				}
				let location = e.label.split('-');
				let city_name = location[location.length - 1];
				console.log(city_name);
				// _this.startcreatview(city_name);
			},
			// 测试请求
			onloadContactsList() {
				uni.request({
					url: 'http://jsonplaceholder.typicode.com/users',
					success: res => {
						console.log(res);
						this.contactsList = res.data;
					}
				});
			},
			// 绘制地理位置
			startcreatview(location) {
				console.info(location);
				const s = this;
				s.TitleTimer = setTimeout(function() {
					s.createView(location);
				}, 100); //具体缓迟时间可以按需设置
			},
			createView(location) {
				clearTimeout(this.TitleTimer);
				const s = this;
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				const nTitle = currentWebview.getTitleNView();
				nTitle.draw([
					{
						tag: 'font',
						id: 'indexTextTwo',
						text: location,
						position: {
							left: '38px',
							top: '8px',
							bottom: '6px'
						},
						textStyles: {
							size: '14px',
							fontSrc: '/static/uni.ttf',
							color: '#333',
							align: 'left'
						}
					}
				]);
				nTitle.addEventListener(
					'click',
					function(e) {
						console.log(JSON.stringify(e));
						s.showMulLinkageTwoPicker();
					},
					false
				);
			},
			// end
			// 验证输入的手机号格式
			validating(e){
				console.log(e.mp.detail.value);
				var val = e.mp.detail.value;
				var inp = document.querySelector(".phone");				
			},
// 			assortStore(index,bool){
// 				if(bool === false){
// 					this.assortList[index].bool = !this.assortList[index].bool;
// 				}else{
// 					this.assortList[index].bool = !this.assortList[index].bool;
// 				}
// 			},
// 			periphery(index,bool){
// 				if(bool === false){
// 					this.ambitusList[index].bool = !this.ambitusList[index].bool;
// 				}else{
// 					this.ambitusList[index].bool = !this.ambitusList[index].bool;
// 				}
// 			}
		},
		// 原生按钮点击事件
		onNavigationBarButtonTap(e) {
			let _this = this;
			if (e.index === 0) {
				console.info('地理位置');
				_this.showMulLinkageTwoPicker();
			}
			if (e.index === 1) {
				_this.toSearch();
			}
		}
	}
</script>

<style lang="scss">
	@import './locationRelease.scss';
</style>
