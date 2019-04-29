<template>
	<view class="content">
		<!-- //头部 -->
		<view class="release">
			<view class="releaseBox">
				<view>介绍标题</view>
				<view><input type="text" v-model="title"></view>
			</view>
		</view>
			<view class="release">
			<view class="releaseBox shows">
				<view>案列展示</view>
				<view><text class="iconfont" @click="CaseShow">&#xe616;</text></view>
			</view>
			<view class="releaseBox">
				<view>公司名称</view>
				<view><input type="text" v-model="companyname"></view>
			</view>
			<view class="releaseBox" style="border-bottom: 0;">
				<view>详细地址</view>
				<view><input type="text" v-model="detailedAddress"></view>
			</view>
		</view>
		<view class="release">
			<view class="releaseBox" style="border-bottom: 0;">
				<view>公司介绍</view>
			</view>
			<view class="companyIntroduction">
				<view class="Introduction">
						<textarea value="" placeholder="详细的介绍下你的公司情况~" maxlength="-1" v-model="introduction"/>
				</view>
			
			</view>
			<view class="releaseBox" style="border-bottom: 0;">
				<view>服务优势</view>
			</view>
			<view class="companyIntroduction">
				<view class="Introduction">
						<textarea value="" placeholder="详细的介绍下你的优势~" maxlength="-1" v-model="advantageservice"/>
				</view>
			</view>
			<view class="releaseBox" style="border-bottom: 0;">
				<view>主营业务</view>
			</view>
			<view class="companyIntroduction">
				<view class="Introduction">
						<textarea value="" placeholder="详细的介绍下你的主营业务~" maxlength="-1" v-model="primarybusiness"/>
				</view>
			</view>
			<view class="releaseBox" style="border-bottom: 0;">
				<view>售后服务</view>
			</view>
			<view class="companyIntroduction">
				<view class="Introduction">
						<textarea value="" placeholder="详细的介绍下你的售后服务~" maxlength="-1" v-model="aftersalesservice"/>
				</view>
			</view>
			<view class="releaseBox" style="border-bottom: 0;">
				<view>总部支持</view>
			</view>
			<view class="companyIntroduction">
				<view class="Introduction">
						<textarea value="" placeholder="详细的介绍下你的总部支持~" maxlength="-1" v-model="support"/>
				</view>
			</view>
			<!-- //图片展示 -->
				<view class=" newShoprental">
			<view class="picturepresentation">
				<view class="title">图片展示</view>
					<view class="ImgBox">
							<view class="ImgBox2" v-for="(item,idx) in imgsrc" :key='idx'>
							<img :src="imageUrl + item" alt="">
						<view class="iconfont" @click="deleImg(idx)">
							&#xe68e;
						</view>
						</view>
						<view class="addImg" @click="addImg" v-if="isShowaddImg">
							<text class="iconfont">&#xe649;</text>
						</view>
					</view>
			</view>
			</view>
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic'; //服务器地址
	export default {
		data() {
			return {
				massage:'',
				support:"",//总部支持
				aftersalesservice:"",//售后服务
				primarybusiness:'',//主营业务
				advantageservice:'',//服务优势
				introduction:'',//公司介绍
				detailedAddress:'',//详细地址
				companyname:'',//公司名称
				title:'',//介绍标题
				isShowaddImg:true,
				ImgList:[],
				changeed:-1,
				imgsrc:[],
				 pics: [],
				 width: "",
				 imageUrl:shoppublic.getImageUrl(),
			};
		},
		onLoad() {
			var that=this
			// 获取本地存储填写信息
			uni.getStorage({
			key:'Newpreparations',
			success: function (res) {
				if(res.data){
					that.massage=res.data
					that.support=res.data.support//总部支持
					that.aftersalesservice=res.data.aftersalesservice//售后服务
					that.primarybusiness=res.data.primarybusiness,//主营业务
					that.advantageservice=res.data.advantageservice,//服务优势
					that.introduction=res.data.introduction,//公司介绍
					that.detailedAddress=res.data.detailedAddress,//详细地址
					that.companyname=res.data.companyname,//公司名称
					that.title=res.data.title,//介绍标题
					that.imgsrc=res.data.imgsrc    
				}else{
					
					return
				}	              
			}
		});
		},
		methods:{
			//案例展示
			CaseShow(){
				console.log(12)
				var that=this
				var data={
					support:that.support,//总部支持
					aftersalesservice:that.aftersalesservice,//售后服务
					primarybusiness:that.primarybusiness,//主营业务
					advantageservice:that.advantageservice,//服务优势
					introduction:that.introduction,//公司介绍
					detailedAddress:that.detailedAddress,//详细地址
					companyname:that.companyname,//公司名称
					title:that.title,//介绍标题
					imgsrc:that.imgsrc                      
				}
				uni.setStorage({
					key: 'Newpreparations',
					data:data,
					success: function () {
						uni.navigateTo({
							url:'./showcase/showcase'
						})
					}
				});
			},
			//图片删除
				deleImg(index){
			if(this.ImgList.length<4){
					console.log(2)
					this.isShowaddImg=true
				}
				this.ImgList.splice(index,1)
				this.imgsrc.splice(index,1)
				console.log(this.imgsrc)
			},
				// 添加图片
			addImg(){
				var that=this
				 var pics = that.pics
				  var imgsrc = that.imgsrc;
				  
				uni.chooseImage({
				count:5,
				 sizeType: ['original', 'compressed'],
				sourceType: ['album','camera'],
				success: function (res) {
					uni.getImageInfo({
						src: res.tempFilePaths[0],
						success: function (image) {
						  var imgSrc = res.tempFilePaths
							 that.pics=imgSrc
							that.ImgList.push(res.tempFilePaths[0])
							if(that.ImgList.length>2){
								that.isShowaddImg=false
							}
							
							let width = that.width;
								for (var i = 0; i <= that.pics.length; i++) {
								width = 120 * that.pics.length + 200;
								}
								  that.width=width
								   for (var i = 0; i < imgSrc.length; i++) {
								  var j = {};
								  uni.uploadFile({
									url: shoppublic.getUrl() + '/uploadimage', //仅为示例，非真实的接口地址
									filePath: imgSrc[i],
									name: 'file',
									success: function(res) {
									  console.log(res);
									  j.url = JSON.parse(res.data).url;
									  console.log(j.url)
										that.imgsrc=that.imgsrc.concat(j.url)
									  console.log(that.imgsrc);
									}
								  })
								}
								}
					});
				}
			});
			},
		}
	}
</script>

<style lang="scss">
@import 'NewpreparationRelease.scss'
</style>
