<template>
	<view class="content">
		
		<view class="SupplyDetails">
			<view class="SupplyBox">
				<!-- 详情头部 -->
				<view class="SupplyBox-header">
					<view class="header-left">
						<img :src="user.portrait" alt="">
					</view>
					<view class="header-right">
						<view class="subLeft">
							<view class="top">
								{{user.name}}
								<text  class="iconfont">&#xe61c;</text>
								<text  class="iconfont iconfont2">&#xe6bc;</text>
							</view>
							<view class="bottom">
								<view class="">
									<text class="iconfont aderss">&#xe6ed;</text>
								</view>
								<view class="">
									<text>{{user.companyarea}}{{user.companyaddress}}</text>
								</view>
								
							</view>
						</view>
						<view  class="subright">
							<view class="examine">
								<text class="iconfont">&#xe64c;</text><text>{{user.fanscount}}</text>
							</view>
							<view class="collect">
								<text class="iconfont">&#xe6ea;</text>
							</view>
						</view>
					</view>
				</view>
				<view class="SupplyBox-body">
					<view class="">
						{{user.mainbusiness}}
					</view>
				</view>
					<view class="SupplyBox-foot">
					<view class="visitor">
						<text>访客:</text>
					</view>
					<view class="userImg">
						<img :src="item.portrait" alt="" v-for='(item,idx) in imglist.slice(0,6)' :key='idx' >······
					</view>
				</view>
				<!-- 选项卡 -->
				<view class="tab">
					<SwiperNav :modelData='modelData' @changed='changed'></SwiperNav>
				</view>
				<!-- 案例展示 -->
				<view class="" v-if="caseed" style="margin-bottom: 100upx;">
					<view class="NoImg">
						<img src="../../../../static/ComentImg.png" alt="" v-if='isshows'>
					</view>
						<view class="Case" v-for='(item,idx) in caseImgs' :key='idx'>
						<view class="CaseImg">
							<img :src="items" alt="" v-for='(items,idxc) in item.src.slice(0,4)' :key='idxc' @click='previewImg(idx,idxc)'>
						</view>
						<view class="CaseInfor">
							<view class="title">一草一木</view>
							<view>
								<text class="iconfont">&#xe64c;</text><text>2563</text>
								<text class="lins">|</text>
								<text class="iconfont">&#xe872;</text><text>19</text>
							</view>
						</view>
					</view>
				</view>
				<!-- //关于公司 -->
				<view class="" v-if="AboutCompany">
						<view class="AboutCompany">
						<view class="AboutCompany2">
								<view class="title">
									公司介绍
								</view>
								<view class="connent">
									{{user.mainbusiness}}
								</view>
						</view>
							<view class="AboutCompany2">
								<view class="title">
									服务优势
								</view>
								<view class="connent">
									{{user.serviceadvantage}}
								</view>
						</view>
							<view class="AboutCompany2">
								<view class="title">
									主营业务
								</view>
								<view class="connent">
									{{user.mainbusiness}}
								</view>
						</view>
							<view class="AboutCompany2">
								<view class="title">
									售后服务
								</view>
								<view class="connent">
									
								</view>
						</view>
						<view class="AboutCompany2" style="border-bottom: 0;">
								<view class="title">
									总部支持
								</view>
								<view class="connent">
									
								</view>
						</view>
					</view>
					<view class="AboutCompany AboutCompany-two">
						<view class="AboutCompany2">
								<view class="title">
									企业证书
								</view>
								<view class="connent connent2">
									<img :src="imageUrl + user.businesslicense" alt="">
								</view>
						</view>
						
					</view>
				</view>
			
					
			</view>
		</view>
			<!-- 用户评论 -->
		<view class="commentBox" v-if="comnnent">
			<view class="commentList">
				<view class="NoImg">
					<img src="../../../../static/ComentImg.png" alt="" v-if='NoImg'>
				</view>
				<view class="introduction" v-for="(itemd,index) in commentList" :key='index' v-if="commentList" @click="subReply(user.id)">
					<view class="commentListTop">
						<view class="userImg">
							<img :src="itemd.sysuser.portrait" alt="" v-if="itemd.sysuser.portrait">
						</view>
						<view class="userMassage">
							<view class="position">
								{{itemd.sysuser.name}}<text v-if="itemd.sysuser.position">·</text>{{itemd.sysuser.position}}
							</view>
							<view class="company" v-if="itemd.sysuser.company">
							{{itemd.sysuser.company}}<text class="iconfont icons">&#xe730;</text>
							</view>
							<view class="commentContent">
								{{itemd.content}}
							</view>
						
						</view>
					</view>
				</view>
					
			</view> 
		</view>
		<!-- //评论按钮 -->
		<view class="bottonBottom">
			<view class="LIst">
				<view class="ComentInput">
					<input type="text" value="" placeholder="输入你的评论~" @focus="Onfocusn"  @blur="Onbuler" v-model="connect"/>
				</view>
			</view>
			<view class="ComentImgList" v-if="Show">
				<img src="../../../../static/talk.png" alt="" >
				<img src="../../../../static/playPhone.png" alt="" @touchend="PlayPhone">
			</view>
			<view class="ComentImgList2" v-if="isShow" @touchend="comment">
				<img src="../../../../static/conmented.png" alt="">
			</view>
		</view>
		<!-- 一件约谈 -->
		<view class="talkus">
			<img src="../../../../static/talkus.png" alt="">
		</view>
		<!-- //弹窗 -->
		<view class="tlkBox">
			<view class="masster">
				<view class="massterBox">
					<view class="massterBox-top">
						<view class="title">
							<view class="img"><img src="http://39.104.48.81:8088/shop_file/img/20190313/1552406435467095230.jpg" alt=""></view>
							<view class="position">王明<text>·</text>副总</view>
							<view class="comopy">西安开好店有限公司<text class="iconfont">&#xe61c;</text></view>
						</view>
						
					</view>
					<view class="massterBox-body">
						<view class="massterList">
							<view>地点:</view>
							<view><input type="text" value="" /></view>
						</view>
						<view class="massterList">
							<view>日期:</view>
							<view><input type="text" value="" /></view>
						</view>
						<view class="massterList">
							<view>时间</view>
							<view><input type="text" value="" /></view>
						</view>
						<view class="massterList">
							<view>备注</view>
							<view><input type="text" value="" /></view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var imageUrl = shoppublic.getImageUrl();
		import shoppublic from '@/common/shoppublic';
		import SwiperNav from '@/components/SlidingNavigation.vue';
	export default {
		components:{
			SwiperNav
		},
		data() {
			return {
				id:"",
				token:6239,
				phoneNumber:"",
				AboutCompany:false,
				comnnent:false,
				caseed:true,
				NoImg:false,
				commentList:[],
				connect:"",
				isShow:false,
				Show:true,
				imageUrl:imageUrl,
				isshows:false,
				caseImgs:[],
				imglist:[],
				user:"",
				modelData:[
					{
						id:0,
						lable:"案例展示"
						
					},
					{
						id:1,
						lable:"关于公司"
					},
					{
						id:2,
						lable:"用户评论"
						
					}
				]
			};
		},
		onLoad(option) {
			this.getsysuserdetail(option.id)
			console.log(option.id)
			this.addCisitorCount()
			this.caseImg(option.id)
			this.evaluate(option.id)
			this.id=option.id
		},
		methods:{
			
			comment: function(uidss,_comment_index) {
				  var _this = this;
							if (_this.connect == '') {
							  wx.showToast({
								title: '回复内容不能为空',
								icon: 'none',
								duration: 2000
							  })
							  return;
							}
						
							var commentlist = _this.commentlist;
						
							uni.request({
							    url: shoppublic.getUrl() + '/sysuserdetail/addReviews',
							  data: {
								token: _this.token,
								uid: _this.id,
								content:_this.connect,
							  },
							  success: function(res) {
								  if(res.data.msgCode==1){
									  var user=res.data.responseBody
									  _this.commentList.unshift(res.data.responseBody)
									  _this.NoImg=false
								  }else{
									  _this.NoImg=true
								  }
								
							  },
							  fail: function(res) {
								  console.log(res)
							  }
							});
						  },
			//评论详情
			subReply(id){
				uni.navigateTo({
						url: '../reply/reply?id='+id + '&token='+ this.token
					})
			},
				// 评论聚焦
			Onfocusn(){
				this.isShow=true
				this.Show=false
			},
			Onbuler(){
				this.isShow=false
				this.Show=true
				this.connect=""
			},
			//图片预览
			previewImg(indexs,index){
							var that = this;
							var current = that.caseImgs[indexs].src
							uni.previewImage({
							  current:current[index], // 当前显示图片的http链接  
							  urls:that.caseImgs[indexs].src // 需要预览的图片http链接列表  
							})
			},
			//获取案例图片
			  caseImg(userid) {
						var _this = this;
						uni.request({
						  url: shoppublic.getUrl() + '/sysuserdetail/findlistProjectCases',
						  data: {
							token: _this.token,
							uid: userid
						  },
						  success: function(res) {
							if(res.data.msgCode==2){
								_this.isshows=true
							}else{
									  console.log(res)
								_this.caseImgs=res.data.responseBody
							}
						
						  },
						  fail: function(res) {}
						});
					  },
			changed(index){
				var that=this
				if(index==0){
					that.AboutCompany=false
					that.comnnent=false
					that.caseed=true
				}else if(index==1){
					that.AboutCompany=true
					that.comnnent=false
					that.caseed=false
				}else if(index==2){
					that.AboutCompany=false
					that.comnnent=true
					that.caseed=false
				}
			},
			  // 评价列表
				  evaluate(userid) {
					let that = this
					uni.request({
					  url: shoppublic.getUrl() + '/sysuserdetail/findlistReviews',
					  data: {
						token: 6239,
						uid: userid
					  },
					  header: {
						'content-type': 'application/json' // 默认值
					  },
					  success: function(res) {
						  console.log(res)
						if (res.data.responseBody == null) {
								that.NoImg=true
						} else {
						that.NoImg=false
							that.commentList=res.data.responseBody
							
						}
					  }
					})
				  },
				  	//电话添加
				  PlayPhone(userid){
				  		var that=this
				  		 event.preventDefault();
				  		
				  		  uni.showActionSheet({
				  		    itemList: [that.phoneNumber, '呼叫'],
				  		    success: function (res) {
				  		    	if(res.tapIndex==1){
				  		    		uni.makePhoneCall({
				  		    		phoneNumber:that.user.phone//仅为示例
				  		    		});
				  		    	}			 
				  		    						
				  				}
				  			 })
				  	},
			
			  // 访客
			  addCisitorCount(id) {
				  var that=this
			    uni.request({
					url: shoppublic.getUrl() + '/sysuserdetail/findpersonaldetailssysuserrecommend',
					data: {
					  token: id
					},
					success(res) {
						console.log(res)
					  if (res.data.status == 1) {
						that.imglist = res.data.responseBody
					  } else {
						uni.showToast({
						  title: '请求失败',
						  icon: 'success',
						  duration: 2000
						})
					  }
					}
				  })
		
			  },
			//获取详情信息
			getsysuserdetail: function(userid) {
				var _this = this;
				wx.request({
				  url: shoppublic.getUrl() + '/sysuserdetail/getsysuserdetail',
				  data: {
					token: 6239,
					uid: userid
				  },
				  success: function(res) {
					  console.log(res)				
				  _this.user=res.data.responseBody
 					_this.phoneNumber= _this.user.phone.slice(0,3)+'-'+_this.user.phone.slice(3,7)+'-'+_this.user.phone.slice(7,11)

				  },
				  fail: function(res) {}
				});
			  }
		}
	}
</script>

<style lang="scss">
@import 'SupplyDetails.scss'
</style>
