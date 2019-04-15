<template>
	<view class="content">
		
		<view class="SupplyDetails">
			<view class="SupplyBox">
				<!-- 详情头部 -->
				<view class="SupplyBox-header">
					<view class="header-left">
						<img :src="user.portrait" alt="">
					</view>
					<view class="header-right">
						<view class="subLeft">
							<view class="top">
								{{user.name}}
								<text  class="iconfont">&#xe61c;</text>
								<text  class="iconfont iconfont2">&#xe6bc;</text>
							</view>
							<view class="bottom">
								<view class="">
									<text class="iconfont aderss">&#xe6ed;</text>
								</view>
								<view class="">
									<text>{{user.companyarea}}{{user.companyaddress}}</text>
								</view>
								
							</view>
						</view>
						<view  class="subright">
							<view class="examine">
								<text class="iconfont">&#xe64c;</text><text>{{user.fanscount}}</text>
							</view>
							<view class="collect">
								<text class="iconfont">&#xe6ea;</text>
							</view>
						</view>
					</view>
				</view>
				<view class="SupplyBox-body">
					<view class="">
						{{user.mainbusiness}}
					</view>
				</view>
					<view class="SupplyBox-foot">
					<view class="visitor">
						<text>访客:</text>
					</view>
					<view class="userImg">
						<img :src="item.portrait" alt="" v-for='(item,idx) in imglist.slice(0,6)' :key='idx' >······
					</view>
				</view>
				<!-- 选项卡 -->
				<view class="tab">
					<SwiperNav :modelData='modelData' @changed='changed'></SwiperNav>
				</view>
				<!-- 案例展示 -->
				<view class="Case" v-for='(item,idx) in caseImgs' :key='idx'>
					<view class="CaseImg">
						<img :src="items" alt="" v-for='(items,idx) in item.src.slice(0,4)' :key='idx'>
					</view>
					<view class="CaseInfor">
						<view class="title">一草一木</view>
						<view>
							<text class="iconfont">&#xe64c;</text><text>2563</text>
							<text class="lins">|</text>
							<text class="iconfont">&#xe872;</text><text>19</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
		import shoppublic from '@/common/shoppublic';
		import SwiperNav from '@/components/SlidingNavigation.vue';
	export default {
		components:{
			SwiperNav
		},
		data() {
			return {
				caseImgs:[],
				imglist:[],
				user:"",
				modelData:[
					{
						id:0,
						lable:"案例展示"
						
					},
					{
						id:1,
						lable:"关于公司"
					},
					{
						id:2,
						lable:"用户评论"
						
					}
				]
			};
		},
		onLoad() {
			this.getsysuserdetail(2339)
			this.addCisitorCount()
			this.caseImg(2212)
			
		},
		methods:{
			//获取案例图片
			  caseImg(userid) {
						var _this = this;
						uni.request({
						  url: shoppublic.getUrl() + '/sysuserdetail/findlistProjectCases',
						  data: {
							token: 6239,
							uid: userid
						  },
						  success: function(res) {
							  console.log(res)
						_this.caseImgs=res.data.responseBody
						  },
						  fail: function(res) {}
						});
					  },
			changed(index){
				
			},
			  // 访客
			  addCisitorCount() {
				  var that=this
			    uni.request({
					url: shoppublic.getUrl() + '/sysuserdetail/findpersonaldetailssysuserrecommend',
					data: {
					  token: 2239
					},
					success(res) {
						console.log(res)
					  if (res.data.status == 1) {
						that.imglist = res.data.responseBody
					  } else {
						uni.showToast({
						  title: '请求失败',
						  icon: 'success',
						  duration: 2000
						})
					  }
					}
				  })
		
			  },
			//获取详情信息
			getsysuserdetail: function(userid) {
				var _this = this;
				wx.request({
				  url: shoppublic.getUrl() + '/sysuserdetail/getsysuserdetail',
				  data: {
					token: 6239,
					uid: userid
				  },
				  success: function(res) {
					  console.log(res)				
				  _this.user=res.data.responseBody
 					

				  },
				  fail: function(res) {}
				});
			  }
		}
	}
</script>

<style lang="scss">
@import 'SupplyDetails.scss'
</style>
