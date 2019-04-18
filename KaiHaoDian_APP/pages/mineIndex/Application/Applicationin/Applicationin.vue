<template>
	<view class="content">
		<view class="enterBox">
			<view class="apply">
				<view class="tab">
					<SwiperNav :modelData='modelData' @changed='changed'></SwiperNav>
				</view>
			</view>
			<view class="information">
				<view class="category category2">
					<view>选择入行业</view>
					<view><text class="iconfont">&#xe616;</text></view>
				</view>
				<view class="category">
					<view>店铺名称</view>
					<view><input type="text" v-model="shopname"></view>
				</view>
				<view class="category">
					<view>申请人姓名</view>
					<view><input type="text" v-model="username"></view>
				</view>
				<view class="category">
					<view>申请人手机号</view>
					<view><input type="text" v-model="phone"></view>
				</view>
			</view>
			<view class="lins">
				
			</view>
			<view class="information">
				
				<view class="category">
					<view>店铺地址</view>
					<view><input type="text" v-model="site"></view>
				</view>
				<view class="category3">
					<view class="title">
						<view>营业执照</view>
						
					</view>
						<!-- // 营业执照上传 -->
					<view class="ImgBox">
						<view class="license">
							<view class="license">
								<img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2735633715,2749454924&fm=27&gp=0.jpg" alt="">
							</view>
							<view class="">
								<img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2735633715,2749454924&fm=27&gp=0.jpg" alt="">
							</view>
							<view class="">
								<img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2735633715,2749454924&fm=27&gp=0.jpg" alt="">
								<text  class="iconfont">
									&#xe6a1;
								</text>
							</view>
						</view>
						
						<view></view>
					</view>
				</view>
			</view>
		</view>
		<view class="next">
			下一步
		</view>
	</view>
</template>

<script>
	import SwiperNav from '@/components/SlidingNavigation.vue';
	export default {
		data() {
			return {
				site:'',
				shopname:'',
				phone:'',
				username:'',
				isShow:true,
				modelData:[
					{
						id:0,
						lable:"工商入驻"
						
					},
					{
						id:1,
						lable:"品牌入驻"
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
						this.isShow=true
					}else{
						this.isShow=false
					}
				},
				goauthentication(){
					uni.navigateTo({
						url:'Applicationin/Applicationin'
					})
				}
		},
		}
</script>

<style lang="scss">
@import 'Applicationin.scss'
</style>
