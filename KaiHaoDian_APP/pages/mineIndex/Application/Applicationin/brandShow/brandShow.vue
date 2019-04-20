<template>
	<view class="content">
		<view class="enterBox">
			<view class="addImgBox">
				<view class="imgBox" v-if="imgList3.length<1">
					<text class="iconfont">
					&#xe649;
					</text>
				</view>
				<view class="imgBox" v-for="(item,idxs) in imgList3" :key='idxs'>
					<img :src="item" alt="">
					
				</view>
					<view class="addition">
					<text class="iconfont" @click="addImg">
						&#xe6a5;
					</text>
				</view>
			</view>
		
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgList3:[
					
				]
			};
		},
		 onNavigationBarButtonTap() {  
					uni.navigateTo({
						url:'../Applicationin'
					})
				},
		methods:{
				//图片上传
			addImg(){
				var that=this
				if(that.imgList3.length<3){
							uni.chooseImage({
						count: 3,
						sourceType: ['album'],
						success: function (res) {
							uni.getImageInfo({
								src: res.tempFilePaths[0],
								success: function (image) {
									that.imgList3.push(res.tempFilePaths[0]);
										uni.setStorage({
											key: 'imgList3',
											data: that.imgList3,
											success: function () {
											console.log('success');
												
											}
									});
								
								}
							});
						}
					});
					
					
					}else{
					uni.showToast({
					title: '图片至多上传三张',
					icon:"none",
					duration: 2000
				});
				}
				
		
			},
		}
	}
</script>

<style lang="scss">
@import 'brandShow.scss'

</style>
