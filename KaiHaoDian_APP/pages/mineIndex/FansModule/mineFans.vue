<template>
	<view class="content">
		<view class="lines">
			
		</view>
		<view class="_all_content" v-if="exhibition">
			<view class="_focus_on_info _display_flex" v-for="(item,index) in fansList" :key="index">
				<view class="left_focus _display_flex" @touchend="gouserInfo(item.uid)">
					<image class="_focus_image" :src="item.portrait"></image>
					<view class="_focus_message">
						<view class="_focus_name">{{item.name}}&nbsp;·&nbsp;{{item.position}}</view>
						<view class="" style="display: flex;">
						 <view class="_focus_contacts">{{item.company}}</view><text class="_arrow iconfont" style="color:#299efe;margin-top: 5upx;margin-left: 10upx;">&#xe730;</text>
						</view>
					</view>
				</view>
				<view :class="focusbutton" @touchend="guanzhu(index)"><text class="_arrow iconfont" v-if="item.state == `2` ">&#xe680;</text>{{FocusOn}}</view>
			</view>
		</view>
		<view class="emptyBox" v-if="exhibition2">
			<view class="">
				<img src="http://39.104.48.81:8088/shop_file/images/wu.png" alt="" style="width:300upx;height:290upx;">
				<view class="magssageBox">这里空空如也</view>
			</view>
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic';
	export default {
		data() {
			return {
				exhibition:true,
				exhibition2:false,
				focusbutton:'_focus_button',
				FocusOn:"+ 关注",
				fansList:[],
				token:14651,
				uid:"",
				// 测试数据
				focusList:[
					{
						name:"名字-职位",
						contacts:"认证公司",
					},
					{
						name:"名字-职位",
						contacts:"认证公司",
					},
					{
						name:"名字-职位",
						contacts:"认证公司",
					},
					{
						name:"名字-职位",
						contacts:"认证公司",
					}
				]
			};
		},
		onLoad(option) {
			var _this=this
			console.log(option.id)
			this.uid=option.id
			this. findFansList(option.id)
				setTimeout(()=>{
				if(_this.fansList==null){
					console.log(12)
					_this.exhibition=false
					_this.exhibition2=true
				}else{
					
					_this.exhibition=true
					_this.exhibition2=false
				}
			},300)
		},
		methods:{
			//去往详情
				gouserInfo(id){
				 uni.navigateTo({
					  url: '../../index/userDateils/userDateils?id='+id,
					})
				console.log(id)
			},
			//关注
			 guanzhu(index){
					event.preventDefault()
						var _this = this;
						var fansList = this.fansList;
						// 点完赞之后的请求
						wx.request({
						  url: shoppublic.getUrl() + '/attention/addAttention',
						  data: {
							pkid: this.fansList[index].uid,
							type: "1",
							token:_this.token
						  },
						  success: function (res) {
							  console.log(res)
							var flag = res.data.msgCode;
							if (flag == '1') {
							  fansList[index].state = "2";
							  _this.FocusOn="互相关注"
							  _this.focusbutton="_focus_button2"

							} else {
							  fansList[index].state = "1";
							  _this.FocusOn="+ 关注"
							   _this.focusbutton="_focus_button"
							}
							  _this.fansList=fansList
						  },
						  fail: function (res) {
						  }
						});

					  },
			//粉丝列表
			  findFansList(t) {
						var _this = this;
						var userid = _this.uid;

						wx.request({
						  url: shoppublic.getUrl() + '/common/findFansList',
						  data: {
							uid: t,
							token:_this.token
						  },
						  success: function (res) {
							 
							  console.log(res)
							var fansListAll = [];
							console.log(res.data.responseBody)
							var i = res.data.responseBody.length - 1;
							for ( i; i >= 0;i--){
							  fansListAll.push(res.data.responseBody[i]);
							   if(res.data.responseBody[i].state==1){
							  	_this.focusbutton="_focus_button"			  
							  }else{
								    _this.FocusOn="互相关注"
								   _this.focusbutton="_focus_button2"
							  }
							}
							if(i < 0){
								_this.fansList=fansListAll
							
							}
						  },
						  fail: function (res) {
						  }
						});
					  },
							}
	}
</script>

<style lang="scss">
	// 引入样式
	@import "mineFans.css";
</style>
