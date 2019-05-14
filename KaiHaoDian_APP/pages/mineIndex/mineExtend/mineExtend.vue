<template>
<view>
	<view class="" style="height:20upx;background-color:#f3f3f3;"></view>
  <view class='extendTop'>
    <view class="extendTop1">
      <view class='extendTop_l'>
        <img class="cImg" :src='avatar' /> 
        <view class="extendTop_l_name">{{name}}</view>
        <view class="A_information">认证信息</view>
      </view>
      <view class='extendTop_r'>
        <img class="Qr_code" :src='imgurls' v-if='imgurls'/> 
        <view class="pressSave">长按保存</view>
      </view>
    </view>
  </view>
  <!-- 标题 -->
  <view style='height:20upx;background-color:#f3f3f3;'></view>
  <view class='title'>
    <view class='titleone'>
      已推广用户
    </view>
    <view class='titleone'>
      用户缴费
    </view>
  </view>
  <view style='height:20upx;background-color:#f3f3f3;'></view>

  <!-- 有人关注 -->
  <view class='extendBottom' v-if="list.length!=0" v-for='(item,index) in userInfoList' :key="index">
    <view class='extendBottom1'>
      <!-- 左 -->
      <view class="extendBottom1_l">
        <img :src='item.portrait' class='cImg'> 
        <view style='margin-left: 20upx;'>
          <view class="namePosition">{{item.name}}{{item.position}}</view>
          <view class="company">{{item.company}}</view>
        </view> 
      </view>
      <!-- 右 -->
     <view class='admissionFee'>
        {{item.money/100}}
      </view>
    </view>
  </view>

  <!-- 没人关注 -->
  <view class="zanWuPingLunBox" v-if="list.length==0">
    <img src="../../../static/bear.png" class='zanWuPingLunImg' /> 
    <view class='zanWuPingLunText'>暂无更多</view>
  </view>  
</view>


</template>

<script>
	import shoppublic from '@/common/shoppublic.js';
	var imgUrl=shoppublic.getImageUrl();
	export default {
		data() {
			return {
				imgurls:'',
				  token:132,
				  userInfo: null,
				  imgUrl:imgUrl,
				  userInfoList:null,
				  userid: "",
				  sysuser: {},
				  money:'',
				  avatar:'',
				  name:'',
				  list:''
			};
		},
		methods:{
			popularize: function (id) {
				var _this = this;
				uni.request({
				  url:shoppublic.getUrl() + '/personalcenter/sharecode/'+17112,
				  success: function (res) {
						_this.imgurls= "data:image/jpeg;base64," + res.data.responseBody.img,
						_this.avatar =res.data.responseBody.avatar,
						_this.name =res.data.responseBody.name,
						_this.list=res.data.responseBody.list,
						_this.userInfoList=res.data.responseBody.list,
						// money: res.data.responseBody.list.money.toFixed(2),
					console.log(res.data.responseBody)
				  },
				  fail: function (res) {

				  }
				})
	
			},
		},
		/**
		* 生命周期函数--监听页面加载
	   */
	  onLoad: function (options) {
		this.popularize(options.id)
		console.log(options.id)
	  },
	}
</script>

<style lang="scss">
	// 引入样式
	@import 'mineExtend.scss';
</style>
