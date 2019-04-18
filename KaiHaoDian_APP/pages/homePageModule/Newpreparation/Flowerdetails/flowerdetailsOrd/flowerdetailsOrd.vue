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
							<text class="iconfont" @click="subtraction">&#xe6c8;</text>
							<view class="number">
								<text>{{number}}</text>
							</view>
							<text class="iconfont" @click="addNuber">&#xe69a;</text>
						</view>
					</view>
					<view class="setmealOrd">
						<view>小计</view>
						<view class="Timecolor"><text class="subtotal">x{{number}}</text>{{totalPricesed-money}}元</view>
					</view>
			
					
					<view class="setmealOrd" style="border-bottom: 0;" v-if="showList">
						<view>配送费</view>
						<view class="Timecolor">5元</view>
					
				</view>
				</view>
				<view class="lins">
				</view>
					<view class="setmeal">
					<view class="setmealOrd" v-if="showList">
						<view>收货地址</view>
						<view @click="goshippingAddress">></view>
					</view>
					
					<view class="setmealOrd" v-if="showList">
						<view>你的电话<input type="text" value="" placeholder="请填写你的电话以备不时之需 " maxlength="11"/></view>
						<view></view>
					</view>
				
					
					<view class="setmealOrd">
						<view>{{claimGods}}</view>
						<view class="Timecolor">
							  <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
										<text style="padding-right: 30upx;box-sizing: border-box;">
										{{date}}
										</text>				   
							</picker>
							 <picker mode="time" :value="time" start="09:01" end="21:01" @change="bindTimeChange">
							 <text>{{time}}</text>
							</picker>
							
						</view>
					</view>
				</view>
				<view class="lins" v-if="showList">
					
				</view>
						<view class="setmeal">
					<view class="setmealOrd" v-if="showList">
						<view>代写卡片<input type="text" value="" placeholder=""/></view>
						<view></view>
					</view>
						<view class="setmealOrd" v-if="showList">
						<view><input type="text" value="" placeholder=""/></view>
						<view></view>
					</view>
					<view class="setmealOrd" v-if="showList">
						<view>订单备注<input type="text" value="" placeholder="请输入地址信息"/></view>
						<view class="Timecolor"></view>
					</view>
						<view class="setmealOrd" v-if="showList">
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
			<view>合计:<text>{{type>0? totalPricesed-money:totalPricesed}}元</text></view>
			<view><button type="primary" class="btns">立即支付</button></view>
		</view>
		
	</view>
	
</template>

<script>
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	export default {
		
		data() {
			  const currentDate = this.getDate({
			      format: true
			  })
			return {
				type:0,
				showList:true,
				claimGods:"送货时间",
				money:5,
				showpicker2:false,
				time:'',
				date: currentDate,
				price:98,
				number:1,
				totalPrices:'',
				left:'left',
				right:'right',
				
			};
		},
		components: {
			mpvuePicker,
			
		},
		onLoad() {

			this.getNowFormatDate()
			console.log(12)
		},
		computed:{
		
			phoneNumber(){
				var phone='17611205736'
				var phons=phone.substring(0,3)+'****'+phone.substring(7,11)
				return phons
			},
			//总价计算
			totalPricesed(){
				var totalPrices= this.price*this.number+this.money
				return totalPrices
			},
			 startDate() {
            return this.getDate('start');
        },
        endDate() {
            return this.getDate('end');
        }
    

		},
		methods:{
			//去收货地址
			goshippingAddress(){
				uni.navigateTo({
					url:'../selectAdress/selectAdress'
				})
			},
			clicks(){
				this.showpicker2=true
			},
// 			bindPickerChange: function(e) {
//             console.log('picker发送选择改变，携带值为', e.target.value)
//             this.index = e.target.value
//         },
	getNowFormatDate() {//获取当前时间
			var date = new Date();
			var seperator1 = "-";
			var seperator2 = ":";
			var month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
			var strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
			var minutes=date.getMinutes()<10? "0" + date.getMinutes():date.getMinutes();
			var currentdate = date.getFullYear() + seperator1  + month    
					 console.log(date.getMinutes)
					
			this.date== date.getFullYear() + seperator1  + month  + seperator1+'' 
					
			this.time= '' + (date.getHours()+1) + seperator2  + minutes
			},
        bindDateChange: function(e) {
            this.date = e.target.value
        },
        bindTimeChange: function(e) {
            this.time = e.target.value
        },
        getDate(type) {
            const date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();

            if (type === 'start') {
                year = year - 60;
            } else if (type === 'end') {
                year = year + 60;
            }
            month = month > 9 ? month : '0' + month;;
            day = day > 9 ? day : '0' + day;
            return `${year}-${month}-${day}`;
        },
			//立即支付
			payment(){
				uni.request({
				url: 'https://www.example.com/request', //仅为示例，并非真实接口地址。
				data: {
					text: 'uni.request'
				},
				header: {
					'custom-header': 'hello' //自定义请求头信息
				},
				success: (res) => {
					
				}
			});
				
		},
			//计算数量加减
			addNuber(){
				this.number++;
			},
			subtraction(){
				if(this.number<2){
					return
				}else{
					this.number--;
				}
			},
			ischeck(index){
				if(index==1){
					this.left='left'
					this.right='right'
					this.claimGods='送货时间'
					this.showList=true
					this.type=0
				}else{
					this.left='right'
					this.right='left'
					this.claimGods='取货时间'
					this.showList=false
					
					this.type=1
				}
			}
		}
	}
</script>

<style lang="scss">
@import 'flowerdetails.scss'
</style>
