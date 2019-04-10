<template>
	<view class="content">
		<!-- 列表项 -->
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray">确定</mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		<!-- 区域 -->
		<view class="_cell_items">
			<view class="_district">所在区域</view>
			<view class="_select_district" @click="showMulLinkageThreePicker" data-type="1">{{pickerText3}}</view>
		</view>
		<!-- 联系电话 -->
		<view class="_cell_items">
			<view class="_district">联系电话</view>
			<input class="_select_district phone" type="number" placeholder="请输入联系电话" maxlength="11" @blur="validating"/>
		</view> 
		<!-- 项目名称 -->     
		<view class="_cell_items">
			<view class="_district">项目名称</view>
			<input class="_select_district" type="text" placeholder="请输入项目名称" maxlength="11" />
		</view>
		<!-- 项目类型 -->
		<view class="_cell_items">
			<view class="_district">项目类型</view>
			<view class="_select_district" @click="showSinglePicker" data-type="2">{{pickerText1}}</view>
		</view>
		<!-- 项目进度 -->
		<view class="_cell_items">
			<view class="_district">项目进度</view>
			<view class="_select_district" @click="showSinglePicker2" data-type="3">{{pickerText2}}</view>
		</view>
		<!-- 寻找合伙人 -->
		<view class="_partners_find">
			<view class="_partners_title">寻找合伙人</view>
			<view class="_select_icon">
				<view class="_service_cell" :class="item.bool ? '_color3285ff' : ''" v-for="(item,index) in partnersList" :key="index" @click="switchStyle(index,item.bool)">
					<view class="iconfont">&#xe7f0;</view>
					<view>{{item.title}}</view>
				</view>
			</view>
		</view>
		<!-- 标题 -->
		<view class="_title_parnters">
			<view class="_top_caption">
				<view class="_title_caption">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题</view>
				<input type="text" placeholder="请输入标题" maxlength="28"/>
			</view>
			<!-- 合伙说明 -->
			<view class="_title_instructions">
				<view class="_title_top">合伙说明</view>
				<textarea type="text" placeholder="请输入项目描述" maxlength="200"/>
			</view>
			<!-- 添加图片 -->
			<view class="_add_photo">
				<view class="_photo_icon iconfont">&#xe6e7;</view>
				<view class="_photo_title">至少添加一张图片</view>
			</view>
		</view>
		
		
		<!-- 单选题 -->
		<view class="_confirm">
			<view class="_confirm_icon"></view>
			<view class="">本人承诺以上全部属实</view>
		</view>
		<!-- 发布按钮 -->
		<view class="_position_button">
			<view class="_left_button">发布</view>
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
				mulLinkageTwoPicker: cityData,
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#007AFF', //主体颜色
				pickerText3: '请选择区域',
				pickerText1: '请选择类型',
				pickerText2: '请选择',
				mode: '', //组件类型
				deepLength: 1, //几级联动
				pickerValueDefault: [0], //默认选中值
				pickerValueArray: [], //渲染数据
				shoppublic: shoppublic, //服务器地址
				partnersList:[
					{
						title:"技术人",
						bool:false
					},
					{
						title:"策划人",
						bool:false
					},
					{
						title:"管理人",
						bool:true
					},
					{
						title:"运营人",
						bool:false
					},
					{
						title:"营销人",
						bool:true
					},
					{
						title:"投资人",
						bool:false
					},
				],
				citySelect: 'false' ,//城市选择器状态
				location_city:'',//地址选择
				pickerSingleArray: [{
                        label: '休闲娱乐',
                        value: 1
                    },
                    {
                        label: '休闲',
                        value: 2
                    },
                    {
                        label: '娱乐',
                        value: 3
                    },
                    {
                        label: '服饰鞋包',
                        value: 4
                    },
                    {
                        label: '鞋包',
                        value: 5
                    },
                    {
                        label: '鞋',
                        value: 6
                    },
                    {
                        label: '包',
                        value: 7
                    }
                ],
				pickerSingleArray2:[
					{
						label: '考察',
						value: 1
					},
					{
						label: '装修中',
						value: 2
					},
					{
						label: '开业筹备',
						value: 3
					},
					{
						label: '考察',
						value: 4
					},
					{
						label: '装修中',
						value: 5
					},
					{
						label: '开业筹备',
						value: 6
					},
				],
				type:"",//点击选择列表的类型
			};
		},
		methods:{
			// 项目类型单列
            showSinglePicker(e) {
				console.log(e.currentTarget.dataset.type);
				this.type = e.currentTarget.dataset.type
                this.pickerValueArray = this.pickerSingleArray
                this.mode = 'selector'
                this.deepLength = 1
                this.pickerValueDefault = [0]
                this.$refs.mpvuePicker.show()
            },
			// 项目进度单列
			showSinglePicker2(e){
				console.log(e.currentTarget.dataset.type);
				this.type = e.currentTarget.dataset.type
				this.pickerValueArray = this.pickerSingleArray2
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
					_this.pickerText3 = e.label;
				}else if(this.type == "2"){
					_this.pickerText1 = e.label;
				}else if(this.type == "3"){
					_this.pickerText2 = e.label;
				}
				let location = e.label.split('-');
				let city_name = location[location.length - 1];
				console.log(city_name);
				_this.startcreatview(city_name);
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
			// 寻找合伙人样式的切换
			switchStyle(index,bool){
				console.log(index,bool);
				if(bool === false){
					this.partnersList[index].bool = !this.partnersList[index].bool;
				}else{
					this.partnersList[index].bool = !this.partnersList[index].bool;
				}
			}
			
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
@import './partnershipStoreRelease.scss';
</style>
