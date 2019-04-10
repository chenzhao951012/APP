<template>
	<view class="content">
        <mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
         @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray"></mpvue-picker>
        <mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
         @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		<!-- banner -->
		<view class="index_swiper">
			<!-- 浏览量 -->
			<!-- <view class="browse">
				<text class="iconfont">&#xe63c;</text>
				<text class="browse_num">999.1万</text>
			</view> -->
			<!-- 地区 -->
			<view class="location" @click="showMulLinkageTwoPicker">
				<text class="iconfont">&#xe651;</text>
				<text>{{location_city}}</text>
			</view>
			<!-- 搜索框 -->
			<view class="search" @click="toSearch">
				
				<text>搜索你想要的功能~</text>
				<text class="iconfont">丨 &#xe63e;</text>
			</view>
			<swiper class="_swiper" :indicator-dots="indicatorDots" :indicator-color="indicatorColor" :indicator-active-color="activecolor"  :autoplay="true" :duration="1000" :circular="true" >
				<swiper-item class="_swiper" v-for="(item,index) in bannerList" :key="index" >
					<image class="_swiper" :src="imageUrl + item.imageurl"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 8个版块 -->
		<view class="moduleParent">
			<view class="moduleChilds" v-for="(item,index) in moduleList" :key="index" @click="toModuleList(index)">
				<img :src="item.image" mode="">
				<view class="">{{item.title}}</view>
			</view>
		</view>
		<!-- 推荐人脉 -->
		<view class="contactsParent">
			<view class="_contacts_title">
				<view class="_contacts_titleL">你可能感兴趣的人</view>
				<view class="_contacts_titleR">
					<text>更多人脉</text>
					<text class="_iconRight">&#xe793;</text>
				</view>
			</view>
			<view >
				<scroll-view class="_contactsCell" scroll-x>
					<view class="_contacts" v-for="(item,index) in contactsList" :key="index">
						<view @click="toUserDateils(item.id)">
							<image :src="item.portrait" mode=""></image>
							<view class="_contacts_name textHidden">{{item.name}}</view>
							<view class="_contacts_company textHidden">{{item.company}}</view>
							<view class="_contacts_ps textHidden">
								<text>{{item.position}}</text>
								<text class="iconfont">&#xe61c;</text>
							</view>
						</view>
						<!-- 未关注 -->
						<view class="_contacts_gz_state icon_gz_state" @click="clickGzState(item.attentionstate,index)"  v-if="item.attentionstate === '1'">
							&#xe6df;好友
						</view>
						<!-- 已关注 -->
						<view class="_contacts_gz_state _contacts_gz_state2" @click="clickGzState(item.attentionstate,index)" v-else-if="item.attentionstate === '2'">
							已添加
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 开店知识 -->
		<view class="openStory">
			<view class="openStory_title">开店知识</view>
			<view class="openStory_cell" v-for="(item,index) in magessageList" :key="index" @click="toListInfoPage(item.id)" v-if="magessageList">
			<view class="openStory_cellBox">
				<view class="openStory_cell-title">
					{{item.questions}}
				</view>
				<!-- 项目类型 -->
				<view :class="typeColor" v-if="item.typevalue[0]=='服务'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle2" v-if="item.typevalue[0]=='美容'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle3" v-if="item.typevalue[0]=='服饰'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle4" v-if="item.typevalue[0]=='超市'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle5" v-if="item.typevalue[0]=='餐饮'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle6" v-if="item.typevalue[0]=='百货'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle7" v-if="item.typevalue[0]=='娱乐'">
					{{item.typevalue[0]}}
				</view>
					<view class="typestitle" v-if="item.typevalue[0]=='汽修'">
					{{item.typevalue[0]}}
				</view>
				</view>
					<view class="typestitle6" v-if="item.typevalue[0]=='批发'">
					{{item.typevalue[0]}}
				</view>
				<!-- //项目图片 -->
				<view class="openStoryImg">
					<view class="">
						<scroll-view class="ImgBoxs" scroll-x  v-if="item.listimage">
								<img :src="items" alt="" v-for="(items,idx) in item.listimage" :key="idx" v-if="item.listimage">
						</scroll-view>
						
					</view>
				</view>
				<!-- //用户信息 -->
				<view class="userInfo" v-if="item.user">
					<view class="userInfoList">
						<view class="userInfoLeft">
							<img :src="item.user.portrait" alt="">
						</view>
						<view class="userInRight">
							<view class="userInTop">
								<text class="userName">{{item.user.name !=undefined ? item.user.name :"匿名用户"}} · {{item.user.position}}</text><text class="usertime">{{item.addtime}}</text>
								
							</view>
							<view class="userInfoCompy" v-if="item.user.company">
								{{item.user.company}}<text class="iconfont usericonfont">&#xe61c;</text>
							</view>
							
						</view>
					</view>
				</view>
				<!-- //底部关注 -->
				<view class="infoBox">
					{{item.replycontent}}
				</view>
				<view class="informationBox">
					<view class="informatio">
						<view class="">
							<text class="iconfont iconfonts">&#xe6eb;</text> <text>{{item.attentioncount}}</text>
						</view>
						<view class="">
							<text class="iconfont iconfonts">&#xe60e;</text> <text>{{item.attentioncount}}</text>
						</view>
					</view>
					<view class="informatioLine">
						
					</view>
					
					
				</view>
			</view>
			</view>
		</view>
		<!-- end -->
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
			activecolor:"#fdbd37",
			indicatorColor:"rgba(238, 238,238, 1)",
			 indicatorDots: true,
			typeColor:"typestitle",
			imageUrl:shoppublic.getImageUrl(),
			mulLinkageTwoPicker: cityData,
			cityPickerValueDefault: [0, 0, 1],
			themeColor: '#007AFF', //主体颜色
			mode: '', //组件类型
			deepLength: 1, //几级联动
			pickerValueDefault: [0], //默认选中值
			pickerValueArray: [], //渲染数据
			shoppublic: shoppublic, //服务器地址
			bannerList: [], //轮播图列表
			magessageList:[],
			moduleList: [
				{
					title:'招商加盟',
					image:'../../static/investment.jpg'
				},{
					title:'合伙开店',
					image:'../../static/partnership.jpg'
				},{
					title:'旺铺转让',
					image:'../../static/prosperous.jpg'
				},{
					title:'新铺租售',
					image:'../../static/newshop.jpg'
				},{
					title:'招聘求职',
					image:'../../static/invite.jpg'
				},{
					title:'老店二手',
					image:'../../static/oldshop.jpg'
				},{
					title:'开店寻址',
					image:'../../static/selection.jpg'
				},{
					title:'新店筹备',
					image:'../../static/preparation.jpg'
				}
			],
			contactsList: [], //推荐人脉测试数据
			citySelect: 'false' ,//城市选择器状态
			location_city:'',//地址选择
			openStoreLoreList:[],//推荐开店知识
		};
	},
	// 监听页面加载
	created() {
		
		let _this = this;
		_this.getBannerList();
		_this.onloadContactsList();
		setTimeout(()=>{
			_this.getOpenStoreLore();
		},200)
		
		uni.getStorage({
			key: 'location',
			success: res => {
				console.log('getStorage', JSON.stringify(res));
				_this.location = {
					province_id: res.data.province_id,
					province_name: res.data.province_name,
					city_id: res.data.city_id,
					city_name: res.data.city_name
				};
				_this.location_city = res.data.city_name;
				// console.info('_location_city',_this.location_city);
			},
			fail: res => {
				if (
					(_this.location.province_name ||
						_this.location.province_id ||
						_this.location.city_name ||
						_this.location.city_id) == ''
				) {
					getLocation.getLocation(function(res_p, res_c) {
						// _this.setLocation(res_p, res_c);
						// console.log('省', JSON.stringify(res_p));
						// console.log('市', JSON.stringify(res_c));
						_this.location_city = res_c[0].name;
					});
				}
			}
		});
		// 先获取本地存的地理位置,获取失败就调用获取地理位置,成功进行存储
	},
	// 下拉刷新监听
	onPullDownRefresh() {
		let _this = this;
		_this.getBannerList();
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	watch:{
		//监听data里的值
		contactsList(a,b){
			// console.log('改变前',a);
			// console.log('改变后',b);
		}
	},
	methods: {
		toListInfoPage(id){
			
			console.log(id);
			uni.navigateTo({
				url:'../questionAndAnswer/questionAndAnswerDetails/questionAndAnswerDetails?id=' + id
			})
		},
		// 用户详情页面跳转
		toUserDateils(id){
			uni.navigateTo({
				url:'./userDateils/userDateils?id=' + id
			})
		},
		// 关注按钮点击事件
		clickGzState(state,index){
			// console.log(state,index);
			if(state === '1'){
				this.contactsList[index].attentionstate = '2';
			}
			if(state === '2'){
				this.contactsList[index].attentionstate = '1';
			}
			// console.log(this.contactsList[index]);
		},
		// 获取开店知识列表
		getOpenStoreLore(){
			let _this = this;
			uni.request({
						url:shoppublic.getUrl() + '/questions/findRecommendQuestionsList',
			})
			.then(data => {//data为一个数组，数组第一项为错误信息，第二项为返回数据
          // _this.openStoreLoreList=res.data.responseBody
				var [errr,res]=data
				if(res.data.msgCode==1){
					_this.magessageList=res.data.responseBody
					setTimeout(()=>{
						
						_this.magessageList.forEach((item)=>{
							if(item.typevalue[0]=="美容"){
								console.log(1)
								_this.typeColor="typestitle2"
							}else if(item.typevalue[0]=="服饰"){
								console.log(2)
								_this.typeColor="typestitle3"
							}else if(item.typevalue[0]===" 超市"){
								_this.typeColor="typestitle4"
							}else if(item.typevalue[0]==" 餐饮"){
								_this.typeColor="typestitle5"
							}else if(item.typevalue[0]==" 百货"){
								_this.typeColor="typestitle6"
							}else if(item.typevalue[0]==" 娱乐"){
								_this.typeColor="typestitle7"
							}
						})
					})
					
					console.log(_this.magessageList)
				}else{
					_this.magessageList=""
				}
			   
			
    })
		},
		// 跳转至模块8个模块列表
		toModuleList(index){
			let url = '';
			if(index === 0){//招商加盟
				url = '../homePageModule/joinInvestment/joinInvestment'
			}
			if(index === 1){//合伙开店
				url = '../homePageModule/partnerOpenStore/partnerOpenStore'
			}
			if(index === 2){//旺铺转让
				url = '../homePageModule/storeMakeOver/storeMakeOver'
			}
			if(index === 3){//新铺租售
				url = '../homePageModule/newStoreRental/newStoreRental'
			}
			if(index === 4){//招聘求职
				url = '../homePageModule/recruitAndSeek/recruitAndSeek?id=1'
			}
			if(index === 5){//老店二手
				url = '../homePageModule/oldStoreTwoHand/oldStoreTwoHand'
			}
			if(index === 6){//开店寻址
				url = '../homePageModule/openStoreSeekSite/openStoreSeekSite'
			}
			if(index === 7){
				uni.showToast({
					title:'暂未开放,敬请期待',
					icon:'none',
					duration:2000
				})
			}
			if(url){
				uni.navigateTo({
					url:url
				})
			}
		},
		// 二级联动选择
		showMulLinkageTwoPicker() {
			// console.info('显示二级联动');
			this.pickerValueArray = this.mulLinkageTwoPicker;
			this.mode = 'multiLinkageSelector';
			this.deepLength = 2;
			this.pickerValueDefault = [0, 0];
			this.$refs.mpvuePicker.show();
			// console.info('状态更新完毕');
		},
		// 取消
		onCancel(e) {
			// console.log(JSON.stringify(e.label));
		},
		// 确定
		onConfirm(e) {
			let _this = this;
			// console.log(JSON.stringify(e));
			let location = e.label.split('-');
			let province_name = location[0];
			let province_id = e.value[0];
			let city_name = location[1];
			let city_id = e.value[1];
			_this.location_city = city_name;
			_this.location = {
				province_id: province_id,
				province_name: province_name,
				city_id: city_id,
				city_name:city_name
			};
			// console.log(JSON.stringify(_this.location));
		},
		// 获取推荐人脉
		onloadContactsList() {
			uni.request({
				url: shoppublic.getUrl() + '/questions/findRecommendUserList',
				data:{
					token:6239,
					type:1,
					province_id:610000,
					city_id:610100
				},
				success: res => { 
					// console.log(res);
					this.contactsList = res.data.responseBody;
				}
			});
		},
		// 轮播图获取
		getBannerList() {
			// console.log('banner');
			let _this = this;
			uni.request({
				url: shoppublic.getUrl() + '/search/getBannerList',
				success: res => {
					_this.bannerList = res.data.responseBody;
				}
			});
		},
		// 获取浏览量
		getReadNum (){
			uni.request({
				url:shoppublic.getUrl + '/ReadNum/qryReadNum',
				success:res=>{
					// console.log(res);
				}
			})
		},
		//跳转搜索:0是主页跳转
		toSearch(e) {
			uni.navigateTo({
				url: '../searchPage/searchPage?search_state=' + '0'
			});
		},
	},
	// 原生按钮点击事件
	onNavigationBarButtonTap(e) {
		let _this = this;
	}
};
</script>

<style lang="scss" >

// 引入样式
@import 'index.scss';
</style>
