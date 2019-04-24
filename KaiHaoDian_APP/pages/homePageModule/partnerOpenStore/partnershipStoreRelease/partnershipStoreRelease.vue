<template>
	<view class="content">
		<!-- 列表项 -->
		<!-- <mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="pickerValueArray">确定</mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker> -->
		<!-- 区域 -->
		<view class="setShop">
			<!-- //头部 -->
			<view class="partnership-top">
				<view class="title">
					<view><text>介绍标题</text></view>
					<view class="inputBox"><input type="text" maxlength="100" placeholder="给你的店铺七个响亮的标题吧~"  placeholder-style="color:#b4b4b4"></view>
				</view>
					<view class="title title2">
					<view><text>店铺名称</text></view>
					<view class="inputBox"><input type="text" maxlength="100" placeholder=""  placeholder-style="color:#333333"></view>
				</view>
			</view>
		</view>
		<view class="setShop">
			<!-- //头部 -->
			<view class="partnership-top">
				<view class="title">
					<view><text>项目进度</text></view>
					<view class="inputBox"><input type="text" maxlength="100" placeholder="给你的店铺七个响亮的标题吧~"  placeholder-style="color:#b4b4b4"></view>
				</view>
					<view class="title">
					<view><text>详细地址</text></view>
					<view class="inputBox"><input type="text" maxlength="100" placeholder=""  placeholder-style="color:#b4b4b4"></view>
				</view>
				<view class="title" style="border-bottom: 0;">
					<view><text>联系方式</text></view>
					<view class="inputBox"><input type="text" maxlength="100" placeholder=""  placeholder-style="color:#b4b4b4"></view>
				</view>
			</view>
			
		</view>
			<view class="setShop">
			<!-- //头部 -->
			<view class="partnership-top">
				<view class="title">
					<view><text>项目进度</text></view>
					<view class="inputBox"><input type="text" maxlength="100" placeholder="给你的店铺七个响亮的标题吧~"  placeholder-style="color:#b4b4b4"></view>
				</view>
					<view class="title">
					<view><text>详细地址</text></view>
					<view class="inputBox"><input type="text" maxlength="100" placeholder=""  placeholder-style="color:#b4b4b4"></view>
				</view>
				<view class="title" style="border-bottom: 0;">
					<view><text>联系方式</text></view>
					<view class="inputBox"><input type="text" maxlength="100" placeholder=""  placeholder-style="color:#b4b4b4"></view>
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
							<view class="ImgBox2" v-for="(item,idx) in ImgList" :key='idx'>
							<img :src="item" alt="">
						<view class="iconfont" @click="deleImg(idx)">
							&#xe68e;
						</view>
						</view>
						<view class="addImg" @click="addImg">
							<text class="iconfont">&#xe649;</text>
						</view>
					</view>
					
			</view>
			
		</view>
	</view>
</template>

<script>
	// 城市选择器
	
	import cityData from '@/common/city.data.js';
	// end
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import getLocation from '@/common/getLocation.js'; //获取地理位置
	export default {
		components: {
			
		},
		onLoad() {
			 uni.request({
			  url:'localhost:192.168.0.104/khd/personalcenter/sharecode',
			  data: {
				userid: 14651
			  },
				header: {
					'content-type': 'application/x-www-form-urlencoded',
				},
			  success: function(res) {
					console.log(res)
			   
			  },
			  fail: function(res) {
			
			  }
			})
		},
		data() {
			return {
			
				ImgList:[],
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
				}
		},
		methods:{
			// 图片删除
			deleImg(index){
				this.ImgList.splice(index,1)
			},
			// 添加图片
			addImg(){
				var that=this
				uni.chooseImage({
				count: 3,
				sourceType: ['album'],
				success: function (res) {
					uni.getImageInfo({
						src: res.tempFilePaths[0],
						success: function (image) {
							if(that.ImgList.length>2){
								uni.showToast({
									title:'至多添加三张图片',
									duration:2000,
									icon:'none'
								})
								return;
							}else{
								that.ImgList.push(res.tempFilePaths[0])
							}
							
						}
					});
				}
			});
			},
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
