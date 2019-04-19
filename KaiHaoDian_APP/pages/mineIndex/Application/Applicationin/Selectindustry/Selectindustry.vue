<template>
	<view class="content">
		<view class="enterBox">
			<view class="apply">
				<view class="title" :class="{ title2:indzs == index}" v-for="(item,index) in industryList" :key='index' @click="changeCorlor(index,item.title,item.type)">
					{{item.title}}
				</view>
			</view>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				industryName:'',
				industrytype:'',
				indzs:-1,
				industryList:[
					{
						id:'0',
						title:'店铺装修',
						type:1
					},
					{
						id:'2',
						title:'软件电子',
						type:1
					},
					{
						id:'3',
						title:'桌椅货架',
						type:1
					},
					{
						id:'4',
						title:'图文印刷',
						type:1
					},
					{
						id:'5',
						title:'财税商标',
						type:1
					},
					{
						id:'6',
						title:'厨房设备',
						type:1
					},
					{
						id:'7',
						title:'营销庆典',
						type:1
					},
					{
						id:'8',
						title:'工服订制',
						type:1
					},
					{
						id:'9',
						title:'零售渠道供应商',
						type:2
					},
					{
						id:'10',
						title:'餐饮渠道供应商',
						type:2
					},
						{
						id:'11',
						title:'绿植花卉(该行业为电商发布模块,如需发布请先入驻认证)',
						type:1
					}
					
				]
			};
		},
		 onNavigationBarButtonTap() {  
					uni.navigateTo({
						url:'../Applicationin?title='+this.industryName +'&type='+this.industrytype
					})	
				},
		methods:{
			 changeCorlor(index,title,type){
            this.indzs = index;
			this.industryName=title
			this.industrytype=type
        }

		}
	}
</script>

<style lang="scss">
@import 'Selectindustry.scss'
</style>
