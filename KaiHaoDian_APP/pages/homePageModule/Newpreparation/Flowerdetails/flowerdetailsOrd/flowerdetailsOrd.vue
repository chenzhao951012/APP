<template>
	<view class="content">
		<view class="submitorder ">
			<view class="orderconnent">
				<!-- //选择配送方式 -->
				<view class="selectBox">
					<view :class="left" @click="ischeck(1)">快递配送</view>
					<view :class="right" @click="ischeck(2)">到店自提</view>
				</view>
				<view class="setmeal">
					<view class="setmealOrd">
						<view>玫瑰套餐A</view>
						<view>98元</view>
					</view>
					
					<view class="setmealOrd">
						<view>商品数量</view>
						<view>
							<text class="iconfont">&#xe6c8;</text>
							<view class="number">
								<text>{{number}}</text>
							</view>
							<text class="iconfont" @click="addNuber">&#xe69a;</text>
						</view>
					</view>
				
					
					<view class="setmealOrd">
						<view>小计</view>
						<view class="Timecolor">{{price}}元</view>
					</view>
			
					
					<view class="setmealOrd" style="border-bottom: 0;">
						<view>配送费</view>
						<view class="Timecolor">5元</view>
					
				</view>
				</view>
				<view class="lins">
					
				</view>
					<view class="setmeal">
					<view class="setmealOrd">
						<view>收货信息<input type="text" value="" placeholder="请输入地址信息"/></view>
						<view>></view>
					</view>
					
					<view class="setmealOrd">
						<view>你的电话<input type="text" value="" placeholder="请填写你的电话以备不时之需 " maxlength="11"/></view>
						<view></view>
					</view>
				
					
					<view class="setmealOrd">
						<view>送货时间</view>
						<view class="Timecolor">{{getNowFormatDate}}</view>
					</view>
				</view>
				<view class="lins">
					
				</view>
						<view class="setmeal">
					<view class="setmealOrd">
						<view>代写卡片<input type="text" value="" placeholder=""/></view>
						<view></view>
					</view>
						<view class="setmealOrd">
						<view><input type="text" value="" placeholder=""/></view>
						<view></view>
					</view>
					<view class="setmealOrd">
						<view>订单备注<input type="text" value="" placeholder="请输入地址信息"/></view>
						<view class="Timecolor"></view>
					</view>
						<view class="setmealOrd">
						<view>开发票</view>
						<view class="nonsupport">本店暂不支持开发票</view>
					</view>
					<view class="setmealOrd">
						<view>你绑定的手机号</view>
						<view class="Timecolor">{{phoneNumber}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 支付部分 -->
		
		<view class="payfor">
			<view>合计:<text>{{totalPricesed}}元</text></view>
			<view><button type="primary" class="btns">立即支付</button></view>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				price:98,
				number:1,
				totalPrices:'',
				left:'left',
				right:'right',
				
			};
		},
		computed:{
			getNowFormatDate() {//获取当前时间
			var date = new Date();
			var seperator1 = "-";
			var seperator2 = ":";
			var month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
			var strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
			var currentdate = date.getFullYear() + seperator1  + month  + seperator1  + strDate
					+ " "  +(date.getHours()+1)   + seperator2  + date.getMinutes()
					 console.log(date)
			return currentdate;
			},
			phoneNumber(){
				var phone='17611205736'
				var phons=phone.substring(0,3)+'****'+phone.substring(7,11)
				return phons
			},
			//总价计算
			totalPricesed(){
				var totalPrices= this.price*this.number
				return totalPrices
			}

		},
		methods:{
			//计算数量加减
			addNuber(){
				this.number++;
			},
			subtraction(){
				if(this.number<1){
					r
				}
				this.number--;
			},
			ischeck(index){
				if(index==1){
					this.left='left'
					this.right='right'
				}else{
					
					this.left='right'
					this.right='left'
				}
			}
		}
	}
</script>

<style lang="scss">
@import 'flowerdetails.scss'
</style>
