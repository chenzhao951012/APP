<template>
	<view class="content">
		<view class="showImg">
			<view class="title">
				<view class="name">
					案例标题
				</view>
				<view class="input">
					<input type="text" value="" v-model="title1"/>
				</view>
			</view>
			<view class="ImgBox">
				<view class="upImg" v-for="(items,idx) in imgsrc2" :key='idx+10'>
					<img :src="imageUrl + items" alt="" @click='preview2(idx)'>
					<view class="iconfont" @click="deleImg2(idx)">
						&#xe68e;
					</view>
				</view>
				<view class="addImg" @click="addImg2">
					<text class="iconfont">&#xe6ac;</text>
				</view>
			</view>
		</view>
				<view class="showImg">
			<view class="title">
				<view class="name">
					案例标题
				</view>
				<view class="input">
					<input type="text" value="" v-model="title2"/>
				</view>
			</view>
			<view class="ImgBox">
				<view class="upImg" v-for="(item,index) in imgsrc" :key='index'>
					<img :src="imageUrl+item" alt="" @click='preview(index)'>
					<view class="iconfont" @click="deleImg(index)">
						&#xe68e;
					</view>
				</view>
				<view class="addImg" @click="addImg">
					<text class="iconfont">&#xe6ac;</text>
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
				title1:'',
				title2:'',
				imageUrl:shoppublic.getImageUrl(),
				ImgList:[],
				imgsrc:[],
				 pics: [],
				 width:"",
				 ImgList2:[],
				 imgsrc2:[],
				  pics2: [],
				  width2:""
			};
		},
		 onNavigationBarButtonTap() {  
					this.cache()	
				},
		methods:{
			//本地缓存
			cache(){
				var that=this
				if(that.imgsrc && that.title2 && that.imgsrc2 && that.title1){
					var data={
							ImgList:that.imgsrc,
							title:that.title2,
							ImgList2:that.imgsrc2,
							title2:that.title1
						}
						uni.setStorage({
						key: 'showImg',
						data:data,
						success: function () {
							setTimeout(()=>{
								uni.reLaunch({
									url:'../NewpreparationRelease'
								},1000)
							})
							
						}
					});
				}else{
					uni.showToast({
						title:'信息上传错误,请重新上传',
						duration:2000,
						icon:'none'
					})
					return
				}
					
			},
				deleImg2(index){
					
				this.ImgList2.splice(index,1)
				this.imgsrc2.splice(index,1)
			},
				// 添加图片
				// 添加图片
			addImg2(){
				var that=this
				 var pics = that.pics2
				  var imgsrc = that.imgsrc2;
				  
				uni.chooseImage({
				count:5,
				 sizeType: ['original', 'compressed'],
				sourceType: ['album','camera'],
				success: function (res) {
					uni.getImageInfo({
						
						src: res.tempFilePaths[0],
						success: function (image) {
										  var imgSrc = res.tempFilePaths
							 that.pics2=imgSrc
							
							if(that.ImgList.length>4){
								uni.showToast({
									title:'至多添加5张图片',
									icon:'none',
									duration:2000
								})
								return
							}else{
								that.ImgList2.push(res.tempFilePaths[0])
							}
							
							let width = that.width;
								for (var i = 0; i <= that.pics2.length; i++) {
								width = 120 * that.pics2.length + 200;
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
										that.imgsrc2=that.imgsrc2.concat(j.url)
									  console.log(that.imgsrc2);
									}
								  })
								}
								}
					});
					
				}
			});
			},
			// 删除图片
				deleImg(index){
		
				this.ImgList.splice(index,1)
				this.imgsrc.splice(index,1)
				
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
							
							if(that.ImgList.length>4){
								uni.showToast({
									title:'至多添加5张图片',
									icon:'none',
									duration:2000
								})
								return
							}else{
								that.ImgList.push(res.tempFilePaths[0])
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
			//图片预览
			preview(index){
				var that=this
				var src=that.ImgList[index]
				 uni.previewImage({
					 current:that.ImgList[index],
					urls:that.ImgList
				});
			},
			preview2(indexs){
				var that=this
				
				 uni.previewImage({
					 current:that.ImgList2[indexs],
					urls:that.ImgList2
				});
			}
		},
		
		 
			
	}
</script>

<style lang="scss">
@import 'showcase.scss'
</style>
