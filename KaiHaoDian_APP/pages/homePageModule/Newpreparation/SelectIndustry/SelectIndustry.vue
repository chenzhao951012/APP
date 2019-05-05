<template>
	<view class="content">
		<view class="Select">
			<view class="Industry">
				<view class="top">
					<view class="title" v-for="(item,index) in industryList"  :class="{aiticeClass:aiticeClassed==index}" @click="ChangeCorlor(index)" :key='index'>
						{{item.name}}<text v-if="item.title">({{item.title}})</text>
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
				aiticeClassed:-1,
				industryList:[
					{
						name:'店铺装修'
					},
					{
						name:'软件电子'
					},
					{
						name:'桌椅货架'
					},
					{
						name:'图文印刷'
					},
					{
						name:'财税商标'
					},
					{
						name:'厨房设备'
					},
					{
						name:'营销庆典'
					},
					{
						name:'工服订制'
					},
					{
						name:'零售渠道供应商'
					},
					{
						name:'餐饮渠道供应商'
					},
					{
						name:'绿植花卉',
						title:'该行业为电商发布模块,如需发布请先入驻认证'
					}
				],
				
			};
		},
		onLoad() {
			
		},
		methods:{
			ChangeCorlor(index){
				var that=this
				this.aiticeClassed=index
				console.log(this.aiticeClassed)
				if(index==10){
					that.chouBeiZhiFu()
				}
			},
			//新店筹备认证
			chouBeiZhiFu() {
				
			let that = this;
			wx.request({
			  url: shoppublic.getUrl() + '/personalcenter/personalcenter',
			  data: {
			  token: 132,
			  },
			  header: {
				'Content-Type': 'application/json'
			  },
			  success: function (res) {
				  console.log(res)
				let sysUser = res.data.responseBody.user
// 				console.log(res)
// 				//未认证用户
				if (sysUser.authenticate!=3){
				
				  uni.showModal({
					title: '提示',
					content: '请先完成企业认证',
					success: function (res) {
					  if (res.confirm) {
						//点击确定
							uni.navigateTo({
							  url: '../../../mineIndex/certificationModule/certificationIndex'
// 							   animationType: 'slide-in-right',
// 								animationDuration: 200
							})
					
						
					  } else if (res.cancel) {
						//点击取消
					  }
					}
				  })
				}else{
					  uni.navigateTo({
						url: '../NewpreparationRelease/showcase/GreenflowersReleased/GreenflowersReleased'
				})
// 				  //个人认证用户
// 				  if (sysUser.type == 1){
// 					wx.showModal({
// 					  title: '提示',
// 					  content: '请先完成企业认证',
// 					  success: function (res) {
// 						if (res.confirm) {
// 						  //点击确定
// 						  wx.navigateTo({
// 							url: '../../../mineIndex/certificationModule/certificationIndex'
// 						  })
// 						} else if (res.cancel) {
// 						  //点击取消
// 						}
// 					  }
// 					})
// 				  }else{
// 					// if (sysUser.suppliertype = 1){
// 					//   //未支付 跳转支付页面
// 					//   wx.navigateTo({
// 					//     // url: '../../../pages/xinDianChouBei/chouBeiZhiFu',
// 					//   })
// 					// }else{
// 					  //已支付 跳转供应商编辑页面
// 					  uni.navigateTo({
// 						url: '../../../pages/xinDianChouBei/gongYingShangBianJi?types=' + sysUser.suppliertype,
// 					  })
// 						} 
// 				  }
				}
			  }
			})
		  }
		}
	}
</script>

<style lang="scss">
	
		

	
@import 'SelectIndustry.scss'
</style>
