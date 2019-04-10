<template>
	<view class="content">
		<view class="top_tab" v-if="top_tabState === '0'">
			<view class="tab_child" hover-class="tab_child_hover" @click="top_tabStateChange('0')">用户</view>
			<view class="lineCss"></view>
			<view class="tab_child" hover-class="tab_child_hover" @click="top_tabStateChange('1')">问答</view>
		</view>
		<!-- 用户列表 -->
		<view class="userList" v-if="top_tabState_childs === '0' ">
			<view class="user_cell" v-for="(item,index) in 5" :key="index">
				<view class="userCell_L">
					<image src="" mode=""></image>
				</view>
				<view class="userCell_C">
					<view class="userCell_C_title">王大锤·CEO</view>
					<view class="userCell_C_company">
						<text class="user_company">青青草原狼肉直销你妈妈啥肯德基卡回复撒</text>
						<text class="iconfont user_company_rz">&#xe65c;</text>
					</view>
				</view>
				<view class="userCell_R">
					<view class="userCell_R_gz">关注</view>
				</view>
			</view>
		</view>
		<!-- 问答列表:由于英文太长,取首字母 -->
		<view class="QA_list" v-if="top_tabState_childs === '1' ">
			<view class="QA_cell">
				问答:暂无
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pagesize: 0, //分页加载需要的变量,每次加10
			top_tabState: '0',
			top_tabState_childs: '0' //0是用户,1是问答
		};
	},
	onLoad(options) {
		let _this = this;
		console.info('search_content:', options.search_state);
		/*
			top_tabState:0是主页搜索进来,1是问答搜索进来
			top_tabState_childs:0是默认搜索用户,1是默认搜索问答
		*/
		options.search_state === '0'
			? (() => {
					_this.top_tabState = '0';
					_this.top_tabState_childs = '0';
			  })()
			: (() => {
					_this.top_tabState = '1';
					_this.top_tabState_childs = '1';
			  })();
	},
	methods: {
		// top_tab切换
		top_tabStateChange(state) {
			this.top_tabState_childs = state;
		},
		// 分页加载
		onloadUserList(onReach) {
			let _this = this;
			if (onReach === 'onReach') {
				_this.pagesize += 10; //触底叠加
			}
			uni.request({
				url: '',
				data: {
					pagesize: _this.pagesize
				},
				success: res => {
					console.log(res);
				}
			});
		}
	}
};
</script>

<style lang="scss" >
@import './searchContent.scss';
</style>
