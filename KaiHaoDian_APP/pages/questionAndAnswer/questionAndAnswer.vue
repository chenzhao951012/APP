<template>
	<view class="content">
		<!-- 顶部选项卡 -->
		<view class="top_tab">
			<view class="_tab" @click="tabChanges('0')">
				<view :class="{ _top: '_top' ,_topColor:topTabState === '0' ? '_topColor' : '' }">综合
				<text :class="totops"></text></view>
					
			</view>
			<view class="_tab" @click="tabChanges('1')">
				<view :class="{ _top: '_top' ,_topColor:topTabState === '1' ? '_topColor' : '' }">行业
				<text :class="totop2"></text></view>
					
			</view>
			
		</view>
			<!-- 选项卡遮罩 -->
		<view class="topMask" v-if="tabsMaskState === 'true'">
			<view class="_top">
				<swiper class="_swiper" :current="swiperIndex" @change="swiperChangs">
					<swiper-item class="_swiper_item" >
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==indexs}" v-for="(item,indexs) in Leixing" :key="indexs">{{item.value}}<text :class="{'iconfont':true,'active':activeIndex==indexs}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="_swiper_item">
						<scroll-view scroll-y class="_scroll">
							<view :class="{'_scroll_cell':true,'active':activeIndex==index}" v-for="(item,index) in paixu" :key="index" @click="classify(item.id,index)">{{item.value}}<text :class="{'iconfont':true,'active':activeIndex==index}">&#xe721;</text></view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
			<view class="_mask" @click="closeTabsMask"></view>
		</view>
		<!-- 开店知识 -->
		<view class="openStory">
			<view class="openStory_title"></view>
			<view class="openStory_cell" v-for="(item,index) in pageInfo" :key="index" @click="toQuestionAndAnswerDetails(item.id)" v-if="pageInfo">
				<view class="Line">
					
				</view>
				<view class="LineBOX">
					
				</view>
			<view class="openStory_cellBox">
			
				<view class="openStory_cell-title">
					{{item.questions}}
				</view>
				<!-- 项目类型 -->
				<view class="typestitle" v-if="item.typevalue[0]=='服务'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle" v-if="item.typevalue[0]=='教育'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle2" v-if="item.typevalue[0]=='美容'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle3" v-if="item.typevalue[0]=='服饰'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle4" v-if="item.typevalue[0]=='超市'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle5" v-if="item.typevalue[0]=='餐饮'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle6" v-if="item.typevalue[0]=='百货'">
					{{item.typevalue[0]}}
				</view>
				<view class="typestitle7" v-if="item.typevalue[0]=='娱乐'">
					{{item.typevalue[0]}}
				</view>
					<view class="typestitle" v-if="item.typevalue[0]=='汽修'">
					{{item.typevalue[0]}}
				</view>
				</view>
					<view class="typestitle6" v-if="item.typevalue[0]=='批发'">
					{{item.typevalue[0]}}
				</view>
					<view class="typestitle5" v-if="item.typevalue[0]=='酒店'">
					{{item.typevalue[0]}}
				</view>
				
				<!-- //项目图片 -->
				<view class="openStoryImg">
					<view class="">
						<scroll-view class="ImgBoxs" scroll-x  v-if="item.listimage">
								<img :src="items" alt="" v-for="(items,idx) in item.listimage" :key="idx" v-if="item.listimage">
						</scroll-view>
						
					</view>
				</view>
				<!-- //用户信息 -->
				<view class="userInfo" v-if="item.user">
					<view class="userInfoList">
						<view class="userInfoLeft">
							<img :src="item.user.portrait" alt="">
						</view>
						<view class="userInRight">
							<view class="userInTop">
								<text class="userName">{{item.user.name !=undefined ? item.user.name :"匿名用户"}} <text v-if="item.user.position">·</text> {{item.user.position}}</text><text class="usertime">{{item.addtime}}</text>
								
							</view>
							<view class="userInfoCompy" v-if="item.user.company">
								{{item.user.company}}<text class="iconfont usericonfont">&#xe61c;</text>
							</view>
							
						</view>
					</view>
				</view>
				<!-- //底部关注 -->
				<view class="infoBox">
					{{item.replycontent}}
				</view>
				<view class="informationBox">
					<view class="informatio">
						<view class="">
							<text class="iconfont iconfonts">&#xe6eb;</text> <text>{{item.attentioncount}}</text>
						</view>
						<view class="">
							<text class="iconfont iconfonts">&#xe60e;</text> <text>{{item.attentioncount}}</text>
						</view>
					</view>
					<view class="informatioLine">
						
					</view>
					
					
				</view>
			</view>
			</view>
		
		<!-- end -->
	</view>
</template>

<script>
import shoppublic from '@/common/shoppublic'; //服务器地址
export default {
	data() {
		return {
			activeIndex:0,
			Leixing: [
					   { id: "", value: "综合" },
					   { id: "1", value: "信用" },
					   { id: "2", value: "最新发布" }
				
			],
				paixu: [
					  { id: "", value: "不限" },      
					  { id: "0", value: "餐饮美食" },
					  { id: "1", value: "美容保健" },
					  { id: "2", value: "服饰鞋包" },
					  { id: "3", value: "休闲娱乐" },
					  { id: "4", value: "百货超市" },
					  { id: "5", value: "生活服务" },
					  { id: "6", value: "电器通讯" },
					  { id: "7", value: "汽修服务" },
					  { id: "8", value: "医疗器械" },
					  { id: "9", value: "家居建材" },
					  { id: "10", value: "教育" },
					  { id: "11", value: "酒店宾馆" },
					  { id: "12", value: "农业环保" },
					  { id: "13", value: "母婴" },
					  { id: "14", value: "网络服务" },
					  { id: "15", value: "其他" }
			],
			totops:"totop",
			totop2:"tobott",
			topTabState:'0',
			paegsize:1,//触底加载更多
			tabsState:'',//选项卡状态
			tabsMaskState:'',//选项卡遮罩显示隐藏
			swiperIndex:'',
			index:11,
			pageInfo:[]
		};
	},
	onLoad() {
		let _this = this;
		_this.getQuesition()
	},
	onReachBottom() {
		console.log('onReach');
		this.getQuesition('onReach');
	},
	methods: {
		swiperChangs(e){
			this.tabsState = e.detail.current;
			this.swiperIndex = e.detail.current;
		},
		//关闭遮罩层
				closeTabsMask(){
					this.tabsState = '';
					this.tabsMaskState = '';
					this.swiperIndex = '';
				},
		// 顶部选项卡点击事件
		   tabChanges(index) {
								   var that = this;
								  if(index==0){
										that.totops="totop"
								  }else{
									  that.totops="tobott"
								  }
								   if(index==1){
										that.totop2="totop"
								  }else{
										that.totop2="tobott"
								  }
								   
						
										that.tabsState = index;
										that.swiperIndex = index;
										that.tabsMaskState = 'true';
										
		},
		// 获取问答列表
		getQuesition(page='0'){
			var _this = this;
			var oldpageInfo = _this.pageInfo;
			if(page === 'onReach'){
				uni.request({
					url:shoppublic.getUrl() + 'questions/findQuestionsList',
					data:{
						token:6239,
						type:1,
						updatetime:'',
						pagesise:_this.index,
						province_id:610000,
						city_id:610100,
						questions:''
					},
					success:(res) => {
						if(page === 'onReach' && res.data.responseBody){
							oldpageInfo = oldpageInfo.concat(res.data.responseBody);
							_this.index += 7;
						}else{
							return false;
						}
						_this.pageInfo = oldpageInfo;
						console.log(_this.pageInfo);
					}
				})
				this.paegsize += 10;
			}else{
				uni.request({
					url:shoppublic.getUrl() + 'questions/findQuestionsList',
					data:{
						token:6239,
						type:1,
						updatetime:'',
						pagesise:_this.paegsize,
						province_id:610000,
						city_id:610100,
						questions:''
					},
					success:(res) => {
						_this.pageInfo= res.data.responseBody;
						console.log(_this.pageInfo);
					}
				})
			}
		},
		
		// 顶部选项卡切换
	
		//跳转搜索:1是问答跳转
		toSearch(e) {
			uni.navigateTo({
				url: '../searchPage/searchPage?search_state=' + '1'
			});
		},
		toQuestionAndAnswerDetails(id){
			uni.navigateTo({
				url: './questionAndAnswerDetails/questionAndAnswerDetails?id=' + id
			});
		}
	},
	// 原生按钮点击事件
	onNavigationBarButtonTap(e) {
		let _this = this;
		if(e.index === 0){//跳转问答发布
			
		}
		if (e.index === 1) {
			_this.toSearch();//跳转搜索
		}
	}
};
</script>

<style lang="scss">
		.topMask ._top ._swiper_item ._scroll ._scroll_cell.active{
		position: relative;
		color:#fed17c;
		
	}
	._scroll .iconfont{
		font-size: 32upx;
		color:transparent ;
		float: right;
		font-weight: 600;
		// display: none;
	}
	.topMask ._top ._swiper_item ._scroll ._scroll_cell .iconfont.active{
		color: #fbc237;
		font-weight: 600;
	}
@import 'questionAndAnswer.scss';
</style>
