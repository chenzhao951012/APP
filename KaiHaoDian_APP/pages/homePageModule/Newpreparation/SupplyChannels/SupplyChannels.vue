<template>
	<view class="content">
		
		<view class="supplier">
				<view class="recommend recommend2">
				<img src="../../../../static/ComentImg.jpg" alt="" class='NoInfo' v-if='ImgInfor'>
				<view class="recommend-body" v-for="(item,idx) in companyList" :key='idx'>
					<view class="title">
						<text>{{item.mainbusiness}}</text>
					</view>
					<view class="connent">
						<view class="subconnent">
							<view class="aderss">
								<view class="aderss-top"><text class="iconfont">&#xe6ed;</text></view>
								<view class="aderss-body">
									<view>{{item.companyarea}}{{item.companyaddress}}</view>
									<view class="Pageview">
										<text  class="iconfont iconfont2">&#xe692; {{item.casessize}}</text>
									
										<text  class="iconfont iconfont3">&#xe655; {{item.commentSize}}</text>
									</view>
								</view>
								<view class="fitment">
									<view>{{item.industrytypevalue}}</view>
								</view>
							</view>
						</view>
						<view class="ImgBox">
							<img :src="item.slogo" alt="">
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic'; //服务器地址
	export default {
		data() {
			return {
				companyList:[],
				ImgInfor:false,
				
			};
		},
		onLoad(option) {
			console.log(option.index)
			uni.setNavigationBarTitle({
			title:option.name
			});
			if(option.index==1){
				this.getSheBeiByType('stype_1')
			}else{
				this.getSheBeiByType('stype_2')
			}
			
		},
		methods:{
				 getSheBeiByType(typeNum) {
							var _this = this;
							wx.request({
							  url: shoppublic.getUrl() + '/companySupplier/findListCompanySupplier',
							  data: {
								// stype: text,
								sindustry: typeNum
							  },
							  success: function (res) {
							console.log(res)
								  _this.companyList=res.data.responseBody
								  if(_this.type==0){
									   _this.ImgInfor=false
								  }else{
									    if(res.data.msgCode=='2'){
									  			 _this.ImgInfor=true
									  }else{
									  			_this.ImgInfor=false
									  }
								  }
							  },
							  fail: function (res) {
							  }
							});
			
						  }
		}
	}
</script>

<style lang="scss">
@import 'SupplyChannels.Scss'
</style>
