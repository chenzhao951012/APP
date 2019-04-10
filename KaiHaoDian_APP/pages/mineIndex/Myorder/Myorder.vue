<template>
	<view class="content">
		
		<view class="header">
			<oderList :modelData="NavList"></oderList>
		</view>
		<view class="body">
			<view class="productDetails ">
				<view class="productDetailsTop">
					<view>
						<img src="../../../static/bear.png" alt=""><text>呜哈哈</text>
					</view>
					<view class="evaluate">
						已评价
					</view>
				</view>
				<view class="productDetailsCenter">
					<view class="CenterImgBox"><img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=234634259,4236876085&fm=27&gp=0.jpg" alt=""></view>
					<view class="CenterInfo">
						<view>数量:<text>x1</text></view>
						<view>总价:<text>¥&nbsp;98元</text></view>
					</view>
				</view>
				<view class="productDetailsBottom">
					<view>
						<view class="">
						创建时间:2019-03-09
						</view>
						<view class="">
						订单编号:153846565465416541654
						</view>
					</view>
					<view>
						<button type="primary" class="btns">去评价</button>
					</view>
				</view>
			</view>
		</view>
			<view class="body">
			<view class="productDetails ">
				<view class="productDetailsTop">
					<view>
						<img src="../../../static/bear.png" alt=""><text>呜哈哈</text>
					</view>
					<view class="evaluate">
						已评价
					</view>
				</view>
				<view class="productDetailsCenter">
					<view class="CenterImgBox"><img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=234634259,4236876085&fm=27&gp=0.jpg" alt=""></view>
					<view class="CenterInfo">
						<view>数量:<text>x1</text></view>
						<view>总价:<text>¥&nbsp;98元</text></view>
					</view>
				</view>
				<view class="productDetailsBottom">
					<view>
						<view class="">
						创建时间:2019-03-09
						</view>
						<view class="">
						订单编号:153846565465416541654
						</view>
					</view>
					<view>
						<button type="primary" class="btns" @click="goevaluate">去评价</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import oderList from '@/components/oderList.vue'
	import  '@/common/iconfont.js'
	export default {
		components:{
			oderList
		},
		data() {
			return {
				NavList:[
					{
						id:0,
						lable:"全部"
					},
					{
						id:1,
						lable:"待付款"
					},
					{
						id:2,
						lable:"待使用"
					},
					{
						id:3,
						lable:"待评价"
					},
					{
						id:4,
						lable:"售后"
					}
				]
			};
		},
		methods:{
			//去评价
			goevaluate(){
				uni.navigateTo({
					url:'./evaluate/evaluate'
				})
			}
		}
	}
</script>

<style lang="scss">
@import 'Myorder.scss'
</style>
