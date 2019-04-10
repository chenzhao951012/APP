<template>
	<view class="content">
		<view class="nav">
			<view class="navback" @click="ComeBack">
				<text class="iconfont">&#xe670;</text>
			</view>
			<view class="navtitle">
				招聘求职详情
			</view>
			<view class="Navicon">
				<text class="iconfont">&#xe6ea;</text><text class="iconfont" @click="shareShow=!shareShow">&#xe6c3;</text>
				
			</view>
			<view class="ShareBox" v-if="shareShow">
				<view ><text class="iconfont">&#xe611;</text>举报</view>
				<view style="border-bottom: 0;" @click="shareFriends"><text class="iconfont">&#xe86e;</text>分享</view>
			</view>
		</view>
		<view class="UserBox">
			<view class="UseInfo">
				<view class="UserInfoBox">
					<view class="Userpostion" >{{storeRecruitment.title}}</view>
					<view class="salary">{{storeRecruitment.salarymin/1000}}K-{{storeRecruitment.salarymax/1000}}K</view>
				</view>
				<view class="UserAdress">
					<view class="UserAdress-left">
						<text class="iconfont iconfonted">&#xe6ed;<text>{{storeRecruitment.provincevalue}}-{{storeRecruitment.cityvalue}}-{{storeRecruitment.countyvalue}}</text></text><text>{{storeRecruitment.post}}</text>
					</view>
					<view class="UserAdress-Right">
						<!-- <text class="iconfont iconfonted">&#xe64c;258</text> -->
					</view>
				</view>
			</view>
		</view>
		<view class="UserBox" style="margin-top: 0;border-radius: 0;">
			<view class="UseInfo">
				<view class="UserInfoBox2">
					<view class="Userpostion UserpostionImg">
						<img :src="sysuser.portrait" alt="" class="">
					</view>
					<view class="UserInfoBox2-right" >
						<view>{{sysuser.name}}</view>
						<view v-if="sysuser.company">{{sysuser.company}}<text class="iconfont iconfonted">&#xe61c;</text></view>
					</view>
				</view>
				
			</view>
		</view>
			<view class="UserBox" style="margin-top: 0;border-radius: 0;margin-bottom: 200upx;">
			<view class="UseInfo UseInfo2">
				<view class="UseInfotitle">
					职位描述
				</view>
				<view class="UserConment">
					 {{storeRecruitment.jobrequirements}}
				</view>
			</view>
			<view class="UseInfo UseInfo2">
				<view class="UseInfotitle">
					技能要求
				</view>
				<view class="" style="margin-top: 40upx;margin-bottom: 0upx;">
						<text class="UserConment UserConment2">
						{{storeRecruitment.typevalue}}
					</text>
				</view>
			
			</view>
			<view class="UseInfo UseInfo2 UseInfo3">
				<view class="UseInfotitle">
					团队介绍
				</view>
				<view class="" style="margin-top: 20upx;display: flex;">
					<view class="distance">
						<text class="UserConment UserConment2">
								地铁周边
						</text>
					</view>
					<view class="distance">
						<text class="UserConment UserConment2">
							领导nice
						</text>
					</view>
						
				</view>
			
			</view>
				<view class="UseInfo UseInfo2 UseInfo3">
				<view class="UseInfotitle">
					更多匹配
				</view>
				<view class="" style="margin-top: 20upx;display: flex;">
				<!-- 	<view class="distance">
						<text class="UserConment UserConment2">
								地铁周边
						</text>
					</view>
					<view class="distance">
						<text class="UserConment UserConment2">
							领导nice
						</text>
					</view> -->
						
				</view>
			
			</view>
		</view>
		<!-- //评论框 -->
			<view class="bottonBottom">
			<view class="ComentImgList">
				<view class="ComentBox"><img src="../../../../static/talk.png" alt="" ><view>发消息</view></view>
				
			</view>
			<view class="ComentImgList" @touchend="PlayPhone">
				<view class="ComentBox"><img src="../../../../static/playPhone.png" alt="" @touchend="PlayPhone"><view>电话联系</view></view>
			</view>
		</view>
	</view>
</template>

<script>
	import commentModule from '@/components/commentModule/commentModule.vue';
	import shoppublic from '@/common/shoppublic'; //服务器地址
	export default{
		components:{
			commentModule:commentModule
		},
		data(){
			return{
				isShow:false,
				connect:"",
				Show:true,
				sysuser:"",
				storeRecruitment:'',
				shareShow:false,
				pktype2:8,
				TwohuiUrl:shoppublic.getUrl() + '/comment/addLevelComment',
				Twocomment:shoppublic.getUrl() + '/comment/addLevelComment',
				ZanUrl:shoppublic.getUrl() + '/comment/addCommentPraise',
				token:14651,
				id:"",
				url:shoppublic.getUrl() + '/comment/addComment',
				deleurl:shoppublic.getUrl() + '/comment/deleteComment',
				total:0,
				pktype:7,
				type: "r_001",
				isShowsubConment:true,
				isShowConment:true,
				PingLunList:"",
				thePhone:"",
				provinceName:'', // 选择省区 -名字
				cityName:'', // 选择市区 - 名字
				countyName:'', // 选择县区 -名字
				countycode:"",
				cityCode:"",
				title:"",
				provincecode:"",
				linkman:"",//联系人
				jobequirements:"",
				pickerValueArray: [],
				typevalue:"请选择",
				imgListurl:[],//本地图片数组
				// mulLinkageTwoPicker: cityData,
				cityPickerValueDefault: [0, 0, 1],
				themeColor: '#007AFF', //主体颜色
				pickerText1: '请选择',
				pickerText2: '请选择',
				mode: '', //组件类型
				deepLength: 1, //几级联动
				pickerValueDefault: [0], //默认选中值
				detailedAddress:"",
				pageInfo:[]
			}
		},
		onLoad(option) {
				var _this=this
			console.log(option.id);
			this.getPageInfo(option.id);
			
			this.id=option.id
// 				setTimeout(()=>{
// 						 _this.commentNum()
// 					
// 					},200)
		},
		methods:{
			Onfocusn(){
				this.isShow=true
				this.Show=false
			},
			// 评论失焦
			Onbuler(){
				this.isShow=false
				this.Show=true
				this.connect=""
			},
			// 拨打电话
				PlayPhone(){
				event.preventDefault()
				var that=this
				uni.showModal({
				title: '提示',
				content:'是否拨打'+that.storeRecruitment.phone,
				success: function (res) {
					if (res.confirm) {
						console.log('用户点击确定');
						uni.makePhoneCall({
								phoneNumber:that.storeRecruitment.phone //仅为示例
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
						uni.makePhoneCall({
							phoneNumber: that.storeRecruitment.phone //仅为示例
					});
			},
			// 分享
			shareFriends() {
				uni.share({
					provider: 'weixin',
					scene: 'WXSenceTimeline',
					type: 0,
					href: 'http://uniapp.dcloud.io/',
					title: 'uni-app分享',
					summary: '我正在使用开好店APP寻找加盟供应商~ 一起来使用吧',
					imageUrl: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png',
					success: function(res) {
						console.log('success:' + JSON.stringify(res));
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			},
			//返回按钮
			ComeBack(){
				uni.redirectTo({
					url:"../recruitAndSeek"
				})
			},
// 			//评论人数
// 				conmented(){
// 				var _this=this
// 				_this.isShowConment=true
// 				_this.isShowsubConment=false
// 			},
// 				commentNum() {
// 			var _this=this
// 			if(_this.PingLunList==undefined){
// 				_this.total=0
// 			}else{
// 					let [i, j, t] = [0, 0, 0, 0];
// 				for (i; i < _this.PingLunList.length; i++) {
// 				  for (j; j < _this.PingLunList[i].comment_list.length; j++) {
// 					t += j;
// 				  }
// 				}
// 				 _this.total=i + t
// 			}
// 						
// 			
// 				 
// 				console.log(_this.total)
// 			  },
			getPageInfo(id){
				var _this = this;
				uni.request({
					url: shoppublic.getUrl() + 'storeRecruitment/findStoreRecruitmentByid',
					data: {
						id:id,
						token:6239
					},
					success: res => {
						_this.sysuser=res.data.responseBody.sysuser
						_this.storeRecruitment=res.data.responseBody.storeRecruitment
						_this.PingLunList=res.data.responseBody.commentlist
							_this.thePhone=res.data.responseBody.storeRecruitment.phone
						_this.pageInfo.push(res.data.responseBody);
						console.log(_this.pageInfo[0])
					}
				});
			},
			// 金钱换算函数
	
		}
	}
</script>

<style lang="scss">
	@import './recruitAndSeekDateils.scss';
</style>
