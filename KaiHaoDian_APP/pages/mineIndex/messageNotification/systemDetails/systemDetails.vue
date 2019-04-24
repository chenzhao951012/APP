<template>
	<view class="content">
	<view class="systemBox">
		<view class="system">
				<view class="contentBox" v-for="(item,idx) in massage" :key='idx'>
					<view class="systemImg">
						<img :src="item.url" alt="">
					</view>
					<view class="systemcontent">
					{{item.title}}
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
					massage:[
						{
							url:'../../../../static/xitong.png',
							title:"身为原来的jquery，angular使用者。后面接触了react和vue。渐渐的喜欢上了vue。抱着学习的态度呀。看看源码。果然菜要付出代价。一步步单步调试。头好疼。看到哪里记到哪里。来一点点心得。错误的地方请帮我指出来。谢谢。最近看的是vue component部分"
						}
					]
			};
		}
	}
</script>

<style lang="scss">
@import 'systemDetails.scss'
</style>
