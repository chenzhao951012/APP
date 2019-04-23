<template>
	<view class="content">
		<!-- //交换方式 -->
		<view class="exChane">
			<view class="changePhone">
				<view class="noinformation" v-if="exchangeMessage">
					<img src="../../../static/ComentImg.jpg" alt="">
				</view>
				<view class="userInfo" v-for="(item,idx) in phoneList" :key='idx'>
					<view class="userTop" v-if="item.map.sysuser">
						<view class="left"><img :src="item.map.sysuser.portrait" alt=""></view>
						<view class="right">
							<view>{{item.map.sysuser.name}}<text>·</text>{{item.map.sysuser.position}}</view>
							<view>{{item.map.sysuser.company}}<text class="iconfont">&#xe61c;</text></view>
						</view>
					</view>
					<view class="chooseBox">
						<view @click="neglect(item.nid)">忽略</view>
						<view @click="consent(item.nid)">同意</view>
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
				exchangeMessage:true,
				phoneList:[],
				token:14753
			};
		},
		onLoad() {
			this.getChangeList(132)
			console.log(this.phoneList)
			
		},
		methods:{
			//忽略
			  neglect(id) {
				let that = this
				token = shoppublic.gettoken()
				uni.request({
				  url: shoppublic.getUrl() + '/news/updatetElephoneexchangeIgnore',
				  data: {
					token:that.token,
					nid:id
				  },
				  success: function (res) {
					let str = ''
					that.getChangeList(str)
					if(that.phoneList.length<1){
						that.exchangeMessage=true
					}
				  }
				})
			  },
			//同意
			 consent(id){
				let that = this
	
				uni.request({
				  url: shoppublic.getUrl() + '/news/updatetElephoneexchangeAgree',
				  data: {
					token:that.token,
					nid: id
				  },
				  success: function (res) {
					let str = ''
					that.getChangeList(str)
					console.log(that.phoneList.length)
					if(that.phoneList.length<1){
						that.exchangeMessage=true
					}
				  }
				})
			  },
			 // */ 获取交换电话列表

		  getChangeList(userid){
			var _this = this
// 			token = shoppublic.gettoken()
// 			if (userid != undefined && userid!=""){
// 			  token = userid
// 			}
			uni.request({
			  url: shoppublic.getUrl() + '/news/findChangeList',
			  data: {
				token:14651
			  },
			  success: function (res) {
					  console.log(res)
					  let list = res.data.responseBody
					  let list1 = []
					  //用的是消息列表的接口，所以这里过滤一下，只显示申请交换手机的 type= 1
					  for (let i in list){
					    if (list[i].type == 1){
					  	list1.push(list[i])
						_this.exchangeMessage=false
					    }else{
							 _this.exchangeMessage=true
							 console.log(12)
						}
					  }
					  
					  _this.phoneList=list1
					  console.log(_this.phoneList)
				
				
			  },
			  fail: function (res) {
			  }
			})
		  }
		}
	}
</script>

<style lang="scss">
@import 'exchange.scss'
</style>
