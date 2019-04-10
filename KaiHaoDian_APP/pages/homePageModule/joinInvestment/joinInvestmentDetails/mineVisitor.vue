<template>
	<view class="content">
		<view class="_top_content">
			<view class="who_seen_mine" @click="switchStyle('1')">谁看过我<view :class="blockSeen ? '_border' : ''"></view></view>
			<view class="mine_seen_who" @click="switchStyle('2')">我看过谁<view :class="blockSeen ? '' : '_border'"></view></view>
		</view>
		<view class="_seen_visitor" v-for="(item,index) in visitorList" :key="index">
			<view class="_visitor_cell">
				<view class="_time">{{timeIncise(item.add_time)}}</view>
				<view class="_info_cell">
					<view class="_L">
						<image :src="item.portrait" mode=""></image>
						<view class="_center">
							<view class="_title">{{item.nickname}}</view>
							<view class="_describe">{{hoursIncise(item.add_time)}}</view>
						</view>
					</view>
					<view class="_R">
						<!-- 未关注 -->
						<!-- @click="clickGzState(user.attentionstate)"  v-if="user.attentionstate === '1' -->
						<view class="_contacts_gz_state icon_gz_state">
							&#xe6df;关注
						</view>
						<!-- 已关注 -->
						<!--  @click="clickGzState(user.attentionstate)" v-else-if="user.attentionstate === '2'  -->
						<!-- <view class="_contacts_gz_state _contacts_gz_state2">
							已关注
						</view> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic.js';
	export default{
		data (){
			return{
				// 测试数据
				blockSeen:true,
				visitorList:'', //访客列表
				paegsize:0,//触底加载更多
				index:10,
			}
		},
		onLoad() {
			this.getvisitorList();
		},
		// *******************存在问题,每当pagesize大于70以后就会报错( Cannot read property 'indexOf' of null)( Cannot read property 'height' of undefined)************//
		onReachBottom() {
			// console.log('onReach');
			this.getvisitorList('onReach');
		},
		methods:{
			// 获取访客列表
			getvisitorList(page = "0"){
				var _this = this;
				var oldVisitorList = _this.visitorList;
				if(page === 'onReach'){
					uni.request({
						url: shoppublic.getUrl() + 'projectJoin/qryIsAccrssByTokenInfo',
						data:{
							pages_url: 'kai_index/pages/nav/XMJM/XMJMDetails',
							page_id:495,
							days:0,
							ord:2,
							pagesize:_this.index
						},
						success: (res) => {
							// console.log(res.data.responseBody);
							_this.visitorList = res.data.responseBody;
							if(page === 'onReach' && res.data.responseBody){
								oldVisitorList = oldVisitorList.concat(res.data.responseBody);
								_this.index += 10;
							}else{
								oldVisitorList = res.data.responseBody;
							}
							_this.visitorList = oldVisitorList;
						}
					})
				}else{
					uni.request({
						url: shoppublic.getUrl() + 'projectJoin/qryIsAccrssByTokenInfo',
						data:{
							pages_url: 'kai_index/pages/nav/XMJM/XMJMDetails',
							page_id:495,
							days:0,
							ord:2,
							pagesize:_this.paegsize
						},
						success: (res) => {
							// console.log(res.data.responseBody);
							_this.visitorList = res.data.responseBody;
						}
					})
				}
			},
			// 日期切割
			timeIncise(tiem){
				var timeMothon = tiem.substring(4, 6);
				var timeDay = tiem.substring(6, 8);
				return timeMothon + '月' + timeDay + '日'
			},
			// 分秒切割
			hoursIncise(tiem){
				var timeMothon = tiem.substring(8, 10);
				var timeDay = tiem.substring(10, 12);
				return timeMothon + ':' + timeDay + '访问了您的主页'
			},
			// 关注按钮点击事件
			// clickGzState(state,index,num){
				// console.log(state,index,num);
				// if(state === "1"){
					// this.userInfo[index].cell[num].attentionstate = "2";
				// }
				// if(state === "2"){
					// this.userInfo[index].cell[num].attentionstate = "1";
				// }
				// console.log(this.userInfo.cell[index]);
			// },
			switchStyle(index){
				if(index === '1'){
					this.blockSeen = true;
				}else if( index === '2'){
					this.blockSeen = false;
				}
			}
		}
	}
</script>

<style lang="scss">
	@import './mineVisitor.scss'
</style>
