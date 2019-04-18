<template>
	<view class="content">
		<view class="enterBox">
			<view class="apply">
				<view class="tab">
					<SwiperNav :modelData='modelData' @changed='changed'></SwiperNav>
				</view>
				<!-- //入驻流程 -->
				<view class="flow" v-if="isShow">
					<view class="flowBox">
						<view><text class="iconfont">&#xe69c;</text> 线上详目提交</view>
						<view><text class="iconfont">&#xe69d;</text> 用户签订入驻协议</view>
						<view><text class="iconfont">&#xe69e;</text> 项目提交入驻成功</view>
					</view>
					
				</view>
				<!-- //入驻条件 -->
				<view class="flow" v-if="!isShow">
					<view class="flowBox flowBox2">
						<view class="contentOne">
							<view>1.项目方企业资质齐全</view>
							<view>2.具有持续的产品研发能力和商品更新能力</view>
							<view>3.有完善的管理团队和加盟后的技术支持</view>
							<view>4.项目人群定位清晰</view>
							<view>5.具有成熟的供应链体系</view>
						</view>
						<view class="contenTwo">
						<view class="remark">
							备注
						</view>
						<view class="subconnent">
							<view>1.招商加盟项目方具备产品商标、版权等品牌所以权</view>
							<view>2.招商加盟当地直营店并且已有加盟店铺营业时间满半年</view>
							<view>3.投资费用合理,回报周期明确</view>
							
						</view>
					</view>
					</view>
					</view>
				</view>
			</view>
		
		<view class="submitBox" @touchend="goauthentication">
			申请入驻
		</view>
	
	</view>
</template>

<script>
		import SwiperNav from '@/components/SlidingNavigation.vue';
	export default {
		data() {
			return {
				isShow:true,
				modelData:[
					{
						id:0,
						lable:"入驻流程"
						
					},
					{
						id:1,
						lable:"入驻条件"
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
		}
	}
</script>

<style lang="scss">
@import 'Application.scss'
</style>
