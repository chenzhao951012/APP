<template>
	<view class="content">
		<view class="showImg">
			<view class="title">
				<view class="name">
					案例标题
				</view>
				<view class="input">
					<input type="text" value="" />
				</view>
			</view>
			<view class="ImgBox">
				<view class="upImg">
					<img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2243247529,1764122779&fm=27&gp=0.jpg" alt="">
				</view>
								<view class="upImg">
					<img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2243247529,1764122779&fm=27&gp=0.jpg" alt="">
				</view>
								<view class="upImg">
					<img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2243247529,1764122779&fm=27&gp=0.jpg" alt="">
				</view>
								<view class="upImg">
					<img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2243247529,1764122779&fm=27&gp=0.jpg" alt="">
				</view>
								<view class="upImg">
					<img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2243247529,1764122779&fm=27&gp=0.jpg" alt="">
				</view>
				<view class="addImg">
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
					<input type="text" value="" />
				</view>
			</view>
			<view class="ImgBox">
				<view class="upImg" v-for="(item,index) in imgsrc" :key='index'>
					<img :src="imageUrl+item" alt="">
					<view class="iconfont" @click="deleImg(idx)">
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
				imageUrl:shoppublic.getImageUrl(),
				ImgList:[],
				changeed:-1,
				imgsrc:[],
				 pics: [],
				 width:""
			};
		},
		methods:{
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
							console.log(res)
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
		}
	}
</script>

<style lang="scss">
@import 'showcase.scss'
</style>
