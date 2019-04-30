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
		methods:{
			ChangeCorlor(index){
			
				this.aiticeClassed=index
				console.log(this.aiticeClassed)
			}
		}
	}
</script>

<style lang="scss">
	
		

	
@import 'SelectIndustry.scss'
</style>
