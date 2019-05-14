<template>
	<view>
		<view class="" style="height:20upx;">
			
		</view>
		<view class="InvestmentTop">
			<view class="InvestmentTop1">
				<view class="InvestmentTop1_l">
					<view class="InvestmentOne">入驻项目：绿植花卉</view>
					<view class="InvestmentOne">入驻时间：2019-03-09</view>
					<view class="InvestmentOne">缴费金额：5000/年</view>
					<view class="">到期时间：2020-03-09</view>
				</view>
				<view class="InvestmentTop1_r">
					<img class="cImg" src='../../../static/bear.png' /> 
					<view class="extendTop_l_name" style="">李庚</view>
					<view class="A_information">认证信息</view>
				</view>
				
			</view>
		</view>
		
		<view class="line"></view>
		
		<view class="InvestmentCenter">
			<view class="InvestmentCenter_t">
				<view class="height_line" style="">|</view>
				<view class="" style="font-size: 32upx;">立即续费</view>
			</view>
			<view class="InvestmentCenter_c">
				<view class="year">
					1年
				</view>
				<view class="price">
					5000/年
				</view>
			</view>
			
			<view class="" style="height:80upx;"></view>
			
			<view class="InvestmentCenter_t">
				<view class="height_line" style="">|</view>
				<view class="" style="font-size: 32upx;">支付方式</view>
			</view>
			<view style="padding-left: 30upx;">
				<view class="Withdrawal">
					<view><text class="iconfont iconfont1">&#xe6ab;</text></view>
					<view><text class="iconfont" v-if="isCheck" @click="selectCheck(1)">&#xe685;</text><text class="iconfont" @click="selectCheck(1)" v-if="!isCheck" >&#xe968;</text></view>
					</view>
				<view class="Withdrawal">
					<view><text class="iconfont iconfont2">&#xe687;</text></view>
					<view><text class="iconfont" v-if="isCheck1" @click="selectCheck(2)">&#xe685;</text><text class="iconfont" @click="selectCheck(2)" v-if="!isCheck1" >&#xe968;</text></view>
				</view>
			</view>
		</view>
		
		<!-- 支付 -->
		<view class="payBox">
			确认支付
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isCheck:true,
				isCheck1:true,
			};
		},
		methods:{
			//提现选择
			selectCheck(idx){
				var that=this
					if(idx==1){
						that.isCheck=!that.isCheck
						that.isCheck1=true
						if(that.isCheck==false){
							that.state=1
						}else{
							that.state=0
							
						}
						console.log(that.state)
					}else if(idx==2){
						that.isCheck=true
							that.isCheck1=!that.isCheck1
							if(that.isCheck1==false){
								that.state=2
							}else{
								that.state=0
							}
							console.log(that.state)
					}
			},
		}
	}
</script>

<style lang="scss">
// 引入样式
	@import 'Investment.scss';
</style>
