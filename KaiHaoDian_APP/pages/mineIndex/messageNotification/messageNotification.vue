<template>
	<view class="content">
		<view class="massageBox">
			<view class="tab">
					<SwiperNav :modelData='modelData' @changed='changed'></SwiperNav>
			</view>
			<view class="massageList">
				
			</view>
		</view>
	</view>
</template>

<script>
	import SwiperNav from '@/components/SlidingNavigation.vue';
	export default {
		data() {
			return {
					modelData:[
					{
						id:0,
						lable:"消息通知"
						
					},
					{
						id:1,
						lable:"好友消息"
					}
				]
			};
		},
			components:{
			SwiperNav
		},
		methods:{
			changed(index){
				if(index==0){
					
				}else{
					
				}
			},
		}
	}
</script>

<style lang="scss">
@import 'massageBox.scss'
</style>
