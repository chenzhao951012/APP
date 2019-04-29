<template>
	<view class="content">
		<view class="Degree">
			<view class="NewBox" v-for="(item,index) in DegreeList" :key='index' @click="changed(index)">
				<view>{{item.title}}</view>
				<view class="iconfont" :class="{iconfont2:selectIndex==index}">&#xe67f;</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectIndex:-1,
				DegreeList:[
					{
						title:'9.9成新'
					},
					{
						title:'9.5成新'
					},
					{
						title:'9成新'
					},
					{
						title:'8.5成新'
					},
					{
						title:'8成新'
					},
					{
						title:'7.5成新'
					},
					{
						title:'7成新'
					},
				]
			};
		},
		methods:{
			changed(index){
					this.selectIndex=index;
					setTimeout(()=>{
						uni.redirectTo({
							url:'../askToBuy?title='+this.DegreeList[index].title
						})
					},500)
			}
		
		}
	}
</script>

<style lang="scss">
@import 'Degree.scss'
</style>
