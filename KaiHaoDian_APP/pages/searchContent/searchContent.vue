<template>
	<view class="content">
		<commonalityHeader>
		<view class="tab">
			<SwiperNav :modelData='modelData' @changed='changed'></SwiperNav>
		</view>
		<view class="result">
			<view class="" v-if="isShow">
				<view class="userList" v-for="(item,idx) in userList" :key='idx+80'>
					<view class="user" v-if="item.authenticate !=3" @click="toUserDateils(item.id)">
						<view class="userImg">
						<img :src="item.portrait" alt="">
						</view>
						<view class="userRight">
							<view class="company">{{item.nickname}}<text class="iconfont" v-if="item.company">&#xe61c;</text></view>
							<view :class="item.attentionstate==1 ? 'attention' : 'attentio2' " @click="attention(item.id,idx)"><text class="iconfont" v-if="item.attentionstate==1">&#xe6df;</text>{{item.attentionstate==1 ? title='关注':title='已关注'}}</view>
						</view>
					</view>
					<view class="user" v-if="item.authenticate  ==3 && item.type == 1" @click="toUserDateils(item.id)">
						<view class="userImg">
						<img :src="item.portrait" alt="">
						</view>
						<view class="userRight">
							<view class="company">{{item.company}}<text class="iconfont">&#xe61c;</text></view>
							<view :class="item.attentionstate==1 ? 'attention' : 'attentio2' " @click="attention(item.id,idx)"><text class="iconfont" v-if="item.attentionstate==1">&#xe6df;</text>{{item.attentionstate==1 ? title='关注':title='已关注'}}</view>
						</view>
					</view>
						<view class="user" v-if="item.authenticate  ==3 && item.type == 2" @click="toUserDateils(item.id)">
						<view class="userImg">
						<img :src="item.portrait" alt="">
						</view>
						<view class="userRight">
							<view class="company">{{item.company}}<text class="iconfont">&#xe61c;</text></view>
							<view :class="item.attentionstate==1 ? 'attention' : 'attentio2' " @click="attention(item.id,idx)"><text class="iconfont" v-if="item.attentionstate==1">&#xe6df;</text>{{item.attentionstate==1 ? title='关注':title='已关注'}}</view>
						</view>
					</view>
				</view>
					<view class="Nomassage" v-if="!userList">
						<img src="../../static/ComentImg.jpg" alt=""/>
					</view>
			</view>
			
			<view class="answers">
					<!-- 开店知识 -->
				<view class="openStory">
					<view class="openStory_title"></view>
					<view class="openStory_cell" v-for="(item,indexs) in userList" :key="indexs+5" @click="toQuestionAndAnswerDetails(item.id)" v-if="item.user">
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
						<view class="typestitle" v-if="item.typevalue[0]=='医疗'">
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
						<view class="typestitle5" v-if="item.typevalue[0]=='咖啡'">
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
										<img :src="items" alt="" v-for="(items,idx) in item.listimage" :key="idx+100" v-if="item.listimage">
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
			</view>
		</view>
		
		</commonalityHeader>
	</view>
</template>

<script>
		import SwiperNav from '@/components/SlidingNavigation.vue';
		import commonalityHeader from '@/components/commonalityHeader/commonalityHeader.vue'
		import shoppublic from '@/common/shoppublic'; //服务器地址
export default {

	components:{
	commonalityHeader,
	SwiperNav
	},
	data() {
		return {
			isShow:true,
			title:'关注',
			types:2,
			value:'',
			userList:[],
			modelData:[
				{
					id:0,
					lable:"用户"
				},
				{
					id:1,
					lable:"问答"
				}
			],
		
		};
	},
	onLoad(options) {
		
		this.value=options.value
		this.getUserList(options.value,options.type)
	},
	methods: {
		//去往用户详情
		toUserDateils(id){
			uni.navigateTo({
				url:'../index/userDateils/userDateils?id=' + id
			})
		},
		//去往问答详情
		toQuestionAndAnswerDetails(id){
			uni.navigateTo({
				url: '../questionAndAnswer/questionAndAnswerDetails/questionAndAnswerDetails?id=' + id
			});
		},
		//关注
		 attention(id,idx) {
			
			var _this = this;
			 var LIst=_this.userList
			uni.request({
			  url: shoppublic.getUrl() + '/attention/addAttention',
			  data: {
				token: 17099,
				pkid:id,
			  },
			  success: function (res) {
				 
				  if(res.data.msgCode==1){
						console.log(res)
					  LIst[idx].attentionstate=2
	
				  }else{
					LIst[idx].attentionstate=1
				  }
				  _this.userList=LIst
				  
			  },
			  fail: function (res) {
			  }
			});
			
		  },
		  //获取问答列表
		  getAnswers(){
			  this.getUserList(this.value,this.types)
		  },
		//获取用户列表
		getUserList(search,type){
			var data={
				search:search,
				type:type,
				token:17099
			}
			var that=this
			 uni.request({
				  url: shoppublic.getUrl() + '/search/search',
				  data: data,
				  header: {
					'content-type': 'application/json' // 默认值
				  },
				  success: function (res) {
					if (res.data.msgCode == "99") {
						
					}else {
						
					  that.userList=res.data.responseBody
					}
				   
				  },
				  fail: function (res) {
				  
				   
				  }
    })
		},
		changed(index){
			if(index==0){
				this.getUserList(this.value,1)
				this.isShow=true
			}else{
				this.isShow=false
				this.getAnswers()
			}
		},
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
					pagesize:_this.pagesize
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
