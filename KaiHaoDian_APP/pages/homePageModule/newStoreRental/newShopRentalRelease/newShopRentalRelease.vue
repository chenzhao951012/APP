<template>
	<view class="content">
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray">确定
		 </mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm">
		 </mpvue-city-picker>
		<!-- 所在区域 -->
		<view class="_infoFill">
			<view class="_left">所在区域</view>
			<!-- @click="showMulLinkageThreePicker" {{pickerText3}}-->
		 	<view class="_right" data-type="1" @click="showMulLinkageThreePicker">{{pickerText1}}</view>
		</view>
		<!-- 地址 -->
		<view class="_infoFill">
		 	<view class="_left">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址</view>
		 	<input class="_right" type="text" value="" maxlength="20" placeholder="请输入详细地址" v-model="detailedAddress"/>
		</view>
		<!-- 联系电话 -->
		<view class="_infoFill">
		 	<view class="_left">联系电话</view>
		 	<input class="_right" type="text" value="" maxlength="20" placeholder="请输入" v-model="ThePhone"/>
		</view>
		<!-- 招商对象 -->
		<view class="_infoFill">
			<view class="_left">招商对象</view>
		 	<view class="_right _multiple_selection">可多选</view>
		</view>
		<!-- 项目详情 -->
		<view class="_infoType">
			
      <view class='peitao_r' style=''>
        <view class='faBuInPut padding0'>
          <view class="choose">
            <view class='nav'>
              <view class='nav-list1'>
                <checkbox-group @change="merchantsChange">
                  <block v-for="(item,index) in merchants" :key="index">
                    <view class='navigator'>
                      <label class="checkbox22">
                        <view class='color' v-if="!item.checked">
                          <checkbox :value="item.value" hidden='false ' :checked="item.checked" />
                          <view style='font-size:28rpx;height:28rpx;'>{{item.name}}</view>
                        </view>
                        <view class="is_checked22" v-if="item.checked">
                          <checkbox :value="item.value" hidden='false ' :checked="item.checked" />

                          <view style='font-size:28rpx;height:28rpx;'>{{item.name}}</view>
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
		<!-- 面积 -->
		<view class="_infoFill">
			<view class="_left">面&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;积</view>
			<!-- @click="showMulLinkageThreePicker" {{pickerText3}}-->
		 	<view class="_right" style="display: flex;margin-left:120upx;">
				<view class="" style="border: 1px solid #d9d9d9;height: 60upx; border-radius: 10upx;margin-top: 20upx;width: 30%;">
					<input type="text" value=""  placeholder="最小面积" style=" width: 100%;" v-model="Minarea"/>
				</view>
				<text class="_square" style="margin:0 20upx;">㎡-</text>
				<view class="" style="border: 1px solid #d9d9d9;height: 60upx; border-radius: 10upx;margin-top: 10upx;width: 30%;margin-top: 20upx;">
					<input type="text" value=""  placeholder="最大面积" style=" width: 100%;" v-model="Maxarea"/>
					</view>
				
				
				<text class="_square"  style="margin:0 20upx;">㎡</text>
			</view>
		</view>
		<!-- 房租费 -->
		<view class="_infoFill">
			<view class="_left">房&nbsp;&nbsp;租&nbsp;&nbsp;费</view>
			<!-- @click="showMulLinkageThreePicker" {{pickerText3}}-->
		 	<view class="_right" style="display: flex;margin-left:40upx;">
					<view class="" style="border: 1px solid #d9d9d9;height: 60upx; border-radius: 10upx;margin-top: 10upx;width: 26%;margin-top: 20upx;">
					<input type="text" value=""  placeholder="最小租金" style=" width: 100%;" v-model="Minrent"/>
					</view>
				<text class="_square" style="font-size: 20upx;margin:0 20upx;">元/月-</text>
					<view class="" style="border: 1px solid #d9d9d9;height: 60upx; border-radius: 10upx;margin-top: 10upx;width: 26%;margin-top: 20upx;">
					<input type="text" value=""  placeholder="最大租金" style=" width: 100%;" v-model="Maxrent"/>
					</view>
				<text class="_square" style="font-size: 20upx;margin:0 10upx;">元/月</text>
			</view>
		</view>
		<!-- 新铺类型 -->
		<view class="_infoFill">
			<view class="_left">新铺类型</view>
			<!-- @click="showMulLinkageThreePicker" {{pickerText3}}-->
		 	<view class="_right" data-type="2" @click="xipuleixing">{{typevalue}}</view>
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
				<view class="_title_top">新铺简介</view>
				<textarea type="text" placeholder="请输入简介" maxlength="200" v-model="describe"/>
			</view>
			<!-- 添加图片 -->
			<view class="_add_photo">
				<view class="ImgBox" v-for="(item,index) in imgListurl" v-if="imgListurl" :key="index">
					<image :src="item" mode=""></image>
				</view>
				<view class="_photo_icon iconfont" @click="addImg">&#xe6e7;</view>
				<view class="_photo_title">至少添加一张图片</view>
			</view>
		</view>
		
		
		<!-- 单选题 -->
		<view class="_confirm">
			<view class="_confirm_icon" @click="isshows">
				<image src="../../../../static/dui.jpg" mode="" style="width: 20px;height: 20px;border-radius: 50%;"  v-if="isCheck"></image>
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
		import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
		import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
		import cityData from '@/common/city.data.js';
		import sunsinUpimg  from'../../../components/sunsin-upimg/sunsin-upimg.vue'
	// end
		import shoppublic from '@/common/shoppublic'; //服务器地址
		// import getLocation from '@/common/getLocation.js'; //获取地理位置
	export default {
		components: {
			mpvuePicker,
			mpvueCityPicker
		},
		data() {
			return {
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
			typevalue:"请选择",
			imgListurl:[],//本地图片数组
			mulLinkageTwoPicker: cityData,
			cityPickerValueDefault: [0, 0, 1],
			themeColor: '#007AFF', //主体颜色
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
			 wenTiType: [],
			 countycode:"",
			cityCode:"",
			provincecode:"",
			describe:"",
			merchants: [
			  { value: '0', name: "餐饮美食", checked: false, title: "cyms" },
			  { value: '1', name: "美容保健", checked: false, title: "mrbj" },
			  { value: '2', name: "服饰鞋包", checked: false, title: "fsxb" },
			  { value: '3', name: "休闲娱乐", checked: false, title: "xxyl" },
			  { value: '4', name: "百货超市", checked: false, title: "bhcs" },
			  { value: '5', name: "生活服务", checked: false, title: "shfw" },
			  { value: '6', name: "电器通讯", checked: false, title: "dqtx" },
			  { value: '7', name: "汽修服务", checked: false, title: "qxfw" },
			  { value: '8', name: "医疗器械", checked: false, title: "ylqx" },
			  { value: '9', name: "家居建材", checked: false, title: "jjjc" },
			  { value: '10', name: "教育", checked: false, title: "jy" },
			  { value: '11', name: "酒店宾馆", checked: false, title: "jdbg" },
			  { value: '12', name: "农业环保", checked: false, title: "nyhb" },
			  { value: '13', name: "母婴", checked: false, title: "my" },
			  { value: '14', name: "网络服务", checked: false, title: "wlfw" },
			  { value: '15', name: "其他", checked: false, title: "qt" }
			],
			  dianpuleixing: [
				  { value: "0", label: "商业街商铺" },
				  { value: "1", label: "写字楼配套" },
				  { value: "2", label: "社区底商铺" },
				  { value: "3", label: "档口摊位" },
				  { value: "4", label: "临街门面" },
				  { value: "5", label: "购物百货中心" },
				  { value: "6", label: "其他" },
								],
								
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

				istextarea: false,
				  isShowChooseKaiShiTime: false
			
			};
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
						allrelease(e, urgent){
						var warn=""
							var _this=this
								var flag=_this.flag
							var that=""  
									var data={
										token: _this.token,
										title: _this.headline,
										phone:  _this.ThePhone,
										areamin: _this.Minarea,
										areamax: _this.Maxarea,
										rentmin: _this.Minrent,
										rentmax: _this.Maxrent,
										province: _this.provincecode,
										provincevalue: _this.provinceName,
										ccity: _this.cityCode,
										cityvalue: _this.cityName,
										county: _this.cityCode,
										countyvalue:_this.countyName,
										street:_this.detailedAddress,
										supporting: JSON.stringify(_this.allGoodsFilte),
										around: JSON.stringify(_this.zhouBian),
										videoaddress: "",
										src: JSON.stringify(_this.imgListurl),
										introduction: _this.describe,
										merchants: JSON.stringify(_this.merchants),
										type: _this.type1,
										typevalue: _this.typevalue,
										urgent: e
													
												}
												if ( _this.headline > 27) {
												  that = "正确填写标题！"

												  flag = false;
												} else if(_this.provincecode == "") {
												  warn = "请正确选择区域！"

												 flag = false;
												} else if (_this.detailedAddress == "" || _this.detailedAddress === "0") {
												  that = "请正确填写详细地址！"

												  flag = false;
												} else if (_this.ThePhone.length != 11) {
												  that = "手机号不能为空！"

												 flag = false;
												} else if (_this.Minarea == "" || _this.Minarea === "0") {
												  that = "请正确填写最小店铺面积！"

												 flag = false;
												} else if (_this.Maxarea == "" || _this.Maxarea === "0") {
												  that = "请正确填写最大店铺面积！"

												 flag = false;
												} else if (parseFloat(_this.Minarea) > parseFloat(_this.Minarea)) {

												  that = "最小面积不能大于最大面积！"

												  flag = false;
												} else if (_this.Minrent == "" || _this.Minrent === "0") {
												  that = "请正确填写最小店铺房租费！"

												  flag = false;

												} else if (_this.Maxrent == "" || _this.Maxrent === "0") {
												  that = "请正确填写最大店铺房租费！"

												   flag = false;

												} else if (parseFloat(_this.Minrent) > parseFloat(_this.Maxrent)) {
												  that = "最小租金不能大于最大租金！"

												  flag = false;
												}
												else if (_this.type1 == "") {
												  that = "请正确选择新铺类型！"

												   flag = false;
												} else if (_this.zhaoShangcheckArr == '') {
												  that = "招商对象至少选择1项 ！"

												  flag = false;
												}else if (_this.peiTaocheckArr == '') {
												  that = "商铺配套至少选择1项 ！"

												  flag = false;
												} else if (_this.zhouBiancheckArr == '') {
												  that = "周边设施至少选择1项 ！"

												   flag = false;
												} else if (_this.introduction == "") {
												  that = "请正确填写店铺描述！"

												  flag = false;
												} 
												else if (_this.imgListurl == "") {
												  that = "一定要添加图片呀！"

												  flag = false;
												} else if(_this.isCheck==false){
													 flag = false;
												}else{
													 flag = true;
												}
												
												if(flag==true && _this.isCheck==true){
													
													
														uni.request({
																	url: shoppublic.getUrl() + '/newShopRent/addNewShopRent',
																	data:data,
																	 method: "POST",
																	 header: { "Content-Type": "application/x-www-form-urlencoded" },
																	
																	success: (res) => {
																		console.log(res)
																		if (res.data.msgCode == "1") {
																			uni.showModal({
																			  title: '提示',
																			  content: '添加成功',
																			  showCancel: false,
																			  success(res) {
																				 uni.reLaunch({
																				   url: '../newStoreRental'
																				 })
// 																				 
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
														
														}else{
															that="请填写信息"
														}
												
															uni.showModal({
															title: '提示',
															content: that,
															  showCancel: false,
														success: function (res) {
															if (res.confirm) {
														   // _this.isCheck=true
														   
															} else if (res.cancel) {
												           // _this.isCheck=false
															}
														}
												});
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
							that.imgListurl=(res.tempFilePaths)
							console.log(JSON.stringify(res.tempFilePaths))
				},
					
			});
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
				    this.typevalue=this.dianpuleixing[0].value,
				  this.type= this.dianpuleixing[0].id,
				    this.deepLength = 1
					  this.pickerValueDefault = [0]
				  this.istextarea=true
				  this.$refs.mpvuePicker.show()
				  this.type = e.currentTarget.dataset.type
				  this.pickerValueArray = this.dianpuleixing
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
			 // 招商业态
			 merchantsChange: function (e) {
				 var _this=this
					var merchants = this.merchants;
					var checkArr = e.detail.value;
					
					  _this.zhaoShangcheckArr=checkArr
				
					for (var i = 0; i < merchants.length; i++) {
					  if (checkArr.indexOf(i + "") != -1) {
						merchants[i].checked = true;

					  } else {
						merchants[i].checked = false;
					  }
					}
				
					  _this.merchants=merchants
				
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
					_this.typevalue = e.label;
					this.type1=e.value
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
@import "./newShopRentalRelease.scss";
</style>
