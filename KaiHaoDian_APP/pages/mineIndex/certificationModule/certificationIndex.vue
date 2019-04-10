<template>
	<view class="contents">
		<view class="Choose">
			请选择你的认证信息
		</view>
		<view class="_contacts">
			
			<view class="_contacts_personal_enterprise" v-for="(item,index) in contactsList" :key="index" @touchend="jumpToEnterpriseCertification" :data-key="index">
				
				<view class=""><image class="_contacts_image" :src="item.img"></image></view>
				<view class="_contacts_personal">{{item.text}}</view>
				<view class="BottomImg">
					<img src="../../../static/bootms.jpg" alt="">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 测试数据
				contactsList:[
					{
						img:"../../../static/personage.jpg",
						text:"个人认证"
					},
					{
						img:"../../../static/company.jpg",
						text:"企业认证"
					}
				]
			};
		},
		methods:{
			jumpToEnterpriseCertification(e){
				// console.log(e.currentTarget.dataset.key);
				if(e.currentTarget.dataset.key == "0"){
					uni.navigateTo({
						url: 'personalAuthentication',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}else if(e.currentTarget.dataset.key == "1"){
					uni.navigateTo({
						url: 'enterpriseCertification',
						success: res => {
							console.log(res);
						},
						fail: () => {},
						complete: () => {}
					});
				}
			}
		}
		
	}
</script>

<style lang="scss">
	// 引入样式
	@import 'certificationIndex.scss';
</style>
