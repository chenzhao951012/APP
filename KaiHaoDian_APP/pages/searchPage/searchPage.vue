<template>
	<view class="content">
		<view class="placeholder"></view>
		<view class="search">
			<!-- 搜索框 -->
			<view class="searchBox">
				<input
					confirm-type="search"
					@confirm="SeachConent"
					placeholder="输入你想要的内容~"
					v-model="Content"
				/>
				<view class="searciconfont" @click="SeachConent">
					<text class="iconfont">&#xe63e;</text>
				</view>
			</view>
			<view class="cancel" @touchend="cancel">取消</view>
		</view>
		<!-- 搜索内容 -->
		<view class="seekContent">
			搜索内容:
			<text>全部</text>
		</view>
		<view class="history">
			<view class="history_title">
				<text>历史记录</text>
				<text class="iconfont" @click="oldDelete">&#xe7ed;</text>
			</view>
			<view class="history_content" v-if="oldKeywordList.length !== 0">
				<view
					class="history_cell textHidden"
					v-for="(item, index) in oldKeywordList"
					:key="index"
					hover-class="history_cell_active"
					@click="saveKeyword(item, optionsType)"
				>
					{{ item }}
				</view>
			</view>
			<view class="history_null" v-if="oldKeywordList.length === 0">
				<img src="../../static/ComentImg.jpg" alt="" />
			</view>
		</view>
	</view>
</template>

<script>
import shoppublic from '@/common/shoppublic'; //服务器地址
export default {
	data() {
		return {
			oldKeywordList: [],
			Content: '',
			search_state: '', //需要携带至搜索详情的参数
			searchInfo: '',
			optionsType: 1
		};
	},
	onLoad(options) {
		console.log(options.search_state);
		let _this = this;
		_this.search_state = options.search_state;
		// _this.loadOldKeyword();
	},
	onShow() {
		this.Gethistory();
	},
	methods: {
		//获取历史记录
		Gethistory() {
			//历史记录
			let that = this;
			uni.request({
				url: shoppublic.getUrl() + '/search/findHistoricalSearch',
				data: {
					token: 17099
				},
				header: {
					'content-type': 'application/json' // 默认值
				},
				success: function(res) {
					that.oldKeywordList = res.data.responseBody;
				}
			});
		},
		//删除历史记录
		oldDelete() {
			uni.showModal({
				content: '确定清除历史搜索记录？',
				success: res => {
					if (res.confirm) {
						let that = this;
						uni.request({
							url: shoppublic.getUrl() + '/search/deleteHistoricalSearch',
							data: {
								token: 17099
							},
							header: {
								'content-type': 'application/json' // 默认值
							},
							success: function(res) {
								that.oldKeywordList = [];
							}
						});
						this.oldKeywordList = [];
					} else if (res.cancel) {
					}
				}
			});
		},
		// 搜索
		SeachConent() {
			var that = this;
			that.saveKeyword(that.Content, that.optionsType);
			setTimeout(() => {
				that.Content = '';
			}, 200);
		},
		//保存到历史记录

		saveKeyword(keyword, optionsType) {
			if (keyword == '') {
				uni.showToast({
					title: '请输入相应字段',
					icon: 'none',
					duration: 2000
				});
			} else {
				setTimeout(() => {
					uni.navigateTo({
						url:
							'../searchContent/searchContent?value=' +
							keyword +
							'&type=' +
							optionsType
					});
				}, 200);
			}
		},

		//取消按钮
		cancel() {
			uni.reLaunch({
				url: '../index/index'
			});
		},

		// 跳转搜索详情
		toSearchDetails() {
			let _this = this;

			uni.navigateTo({
				url: '../searchContent/searchContent?search_state=' + _this.search_state
			});
		},
		// 点击历史记录
		clickHistory(info) {
			console.log(info);
			this.searchInfo = info;
		},
		// 删除历史记录
		removeHistory() {
			this.historyList = [];
		}
		// 绘制搜索框

		// end
	}
	// 原生按钮点击事件
};
</script>

<style lang="scss">
.history_cell_active {
	background: #999;
}
@import './searchPage.scss';
</style>
