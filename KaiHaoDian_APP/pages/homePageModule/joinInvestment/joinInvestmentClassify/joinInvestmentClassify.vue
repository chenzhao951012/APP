<template>
	<view class="content">
		<!-- 顶部选项卡 -->
		<view class="top_tab">
			<view class="_tab" @click="tabsChanges('0')">
				<view :class="{_activeColor:tabsState === '0' ? '_activeColor' : ''}">区域</view>
				<view :class="{_lineCss:tabsState === '0' ? '_lineCss' : ''}"></view>
			</view>
			<view class="_tab" @click="tabsChanges('1')">
				<view :class="{_activeColor:tabsState === '1' ? '_activeColor' : ''}">费用</view>
				<view :class="{_lineCss:tabsState === '1' ? '_lineCss' : ''}"></view>
			</view>
		</view>
		<!-- 选项卡遮罩 -->
		<view class="topMask" v-if="tabsMaskState === 'true'">
			<view class="_top">
				<swiper class="_swiper" :current="tabsState === '0' ? 0 : 1" @change="swiperChangs">
					<swiper-item class="_swiper_item" >
						<scroll-view scroll-y class="_scroll">
							<view class="_scroll_cell" v-for="(item,index) in 15" :key="index" @click="clickScrollCell">毛毛虫</view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view class="_scroll_cell" v-for="(item,index) in 15" :key="index" @click="clickScrollCell">大锤子</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
			<view class="_mask" @click="closeTabsMask"></view>
		</view>
		<!-- 项目分类 -->
		<view class="tj_projectList" v-for="(item,index) in pageInfo" :key="index">
			<view class="project_cell" @click="toJoinInvestmentDetails(index,item.id)">
				<view class="cell_top">
					<image :src="item.logo" mode=""></image>
					<view class="cell_top_bottom">
						<view>{{item.CountList}}人关注</view>
						<view>
							<text class="iconfont">&#xe63c;</text>
							<text>已有{{item.read_num}}人预览</text>
						</view>
					</view>
				</view>
				<view class="cell_bottom">
					<view class="_left">
						<view class="_name">{{item.brands}}</view>
						<view class="_age">
							<text>品牌年龄{{item.storeage}}年</text>
							<text>现有门店{{item.storecount}}家</text>
						</view>
					</view>
					<view class="_lineCss"></view>
					<view class="_priceParent">
						<view class="_priceTop">加盟费用</view>
						<view class="_price">¥&nbsp;{{item.initialfee}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="addMore">{{addMoreText}}</view>
	</view>
</template>
<script>
	import shoppublic from '@/common/shoppublic.js';
	export default {
		data (){
			return {
				tabsState:'',//选项卡状态
				tabsMaskState:'',//选项卡遮罩显示隐藏
				addMoreText:'上拉加载更多',//加载更多
				pagesize:10,//控制触底加载
				pageInfo:[],//获取页面信息
			}
		},
		onLoad(option) {
			console.log(option.id);
			this.getPageInfo(option.id);
		},
		onReachBottom() {
			this.getProjectClassify('onReach');
		},
		methods:{
			getPageInfo(type){
				var _this = this;
				uni.request({
					url: shoppublic.getUrl() + "/projectJoin/findProjectJoinList",
					data:{
						updatetime: '',
						city: 610100,
						county: '',
						user_id: '',
						mininitialfee: '',
						maxinitialfee: '',
						type: type
					},
					success: (res) => {
						console.log(res.data.responseBody);
						_this.pageInfo = res.data.responseBody;
					}
				})
			},
			// 分类项目获取
			getProjectClassify(page='noReach'){
				if(page === 'onReach'){
					this.pagesize += 10;
				}
			},
			// 区域/费用选择器按钮点击事件
			clickScrollCell(e){
				this.closeTabsMask();
			},
			// 顶部选项卡点击事件
			tabsChanges(state){
				this.tabsState = state;
				this.tabsMaskState = 'true';
			},
			// 选项卡滑块切换
			swiperChangs(e){
				e.detail.current === 0 ? this.tabsState = '0' : this.tabsState = '1';
			},
			// 关闭遮罩
			closeTabsMask(){
				this.tabsState = '';
				this.tabsMaskState = '';
			},
			// 跳转项目详情
			toJoinInvestmentDetails(index,project_id,user_id){
				let _this = this;
				// 跳转项目详情需要携带的值:项目id,用户id
				uni.navigateTo({
					url:'../joinInvestmentDetails/joinInvestmentDetails?key='+index+'&id='+project_id
				})
			}
		}
	}
</script>

<style lang="scss">
@import './joinInvestmentClassify.scss'
</style>
