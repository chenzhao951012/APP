<template>
	<view class="content">
		<view class="LinBox">
			
		</view>
		<view class="allContent">
			<view class="_every_queue" >
				<view class="_bill_specific_time">2019年3月<text class="iconfont">&#xe74a;</text></view>
				<view class="particulars" v-for="(item,idx) in TheDetailList" :key="idx">
					<view class="particularsLeft">
						<view class="niknanme">{{item.MerchantName}}</view>
						<view><text class="time">{{item.month}}月{{item.day}}号</text><text class="time"></text></view>
					</view>
					<view class="particularsRight">
						<text>-{{item.money}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic';
	export default {
		
		data() {
			return {
				TheDetailList:[],
				token:132,
			};
		},
		onLoad() {
			this.getPacket()
		},
		methods:{
			  //精度丢失
			  accMul: function (arg1, arg2) {
				var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
				try { m += s1.split(".")[1].length } catch (e) { }
				try { m += s2.split(".")[1].length } catch (e) { }
				return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
			  },
			getPacket(){
				var that=this
					 uni.request({
								  url: shoppublic.getUrl() + '/redpackage/qryRedPackageByUid', //仅为示例，并非真实的接口地址
								  data: {
									claim_uid:that.token
								  },
								  header: {
									'content-type': 'application/json' // 默认值
								  },
								  success (res) {
									  console.log(res)
									let resT = res.data.responseBody;
									let detailList = [];
									let [years, month, day, money] = ['', '', '','']; // 年 // 月 // 日 // 金额
									let i = 0;
									for (i; i < resT.length; i++) {
									  years = resT[i].update_time.substring(0,4);
									  month = resT[i].update_time.substring(5,7);
									  day = resT[i].update_time.substring(6,8);
									  money = that.accMul(resT[i].claim_amount , 0.01);
									  detailList.push({
										MerchantName: resT[i].brands, // 商户名称
										money: money, // 抢到红包金额
										years: years,// 抢红包的时间
										month:month,
										day:day,
									  })
									}
								
									 that.TheDetailList=detailList
									console.log(that.TheDetailList)
									
				      },
				      fail (res) {
				        uni.showToast({
				          title: '请求失败',
				          icon: 'loading',
				          duration: 2000
				        })
				      }
				    })
			}
		
		}
	}
</script>

<style>
@import "mineBill.css";
</style>
