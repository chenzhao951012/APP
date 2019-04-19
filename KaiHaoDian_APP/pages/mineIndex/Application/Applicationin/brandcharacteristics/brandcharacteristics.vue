<template>
	<view class="content">
		<view class="enterBox">
			<view class="chooseImg">
				<view class="showImg">
					<view class="show" v-for="(item,idexs) in imgList" :key='idexs'>
						<img :src="item" alt="">
						<text  class="iconfont" @click="deleImg(idexs)">
							&#xe6a6;
						</text>
					</view>
					<view class="show" v-for="(item,idexs) in imgList2" :key='idexs'>
						<img :src="item" alt="">
						<text  class="iconfont" @click="deleImg(idexs)">
							&#xe6a6;
						</text>
					</view>
				<view class="addImg" @click="addImg" v-if="ishwos">
						<text class="iconfont">
							&#xe649;
						</text>
					</view>
				</view>
			
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgList2:[],
				types:'',
				imgList:[],
				ishwos:true,
			};
		},
		onLoad(option) {
			console.log(option.type)
			this.types=option.type
		},
		//完成按钮
		 onNavigationBarButtonTap() { 
			 console.log(2)
			 if(this.types==1){
				 uni.navigateTo({
				 	url:'../Applicationin?imgListed='+this.imgList
				 })	
			 }else if(this.types==2){
				  uni.navigateTo({
				 	url:'../Applicationin?imgListed2='+this.imgList2
				 })	
			 }			
						},
		methods:{
			// 图片删除
			deleImg(index){
				
				this.imgList.splice(index,1)
				this.ishwos=true
			},
			//图片上传
			addImg(){
				
				var that=this
				if(that.imgList.length<9){
						uni.chooseImage({
						count: 9,
						sourceType: ['album'],
						success: function (res) {
							uni.getImageInfo({
								src: res.tempFilePaths[0],
								success: function (image) {
									if(that.types==1){
										that.imgList.push(res.tempFilePaths[0]);
										uni.setStorage({
											key: 'imgList1',
											data: that.imgList,
											success: function () {
											console.log('success');
												
											}
									});
										if(that.imgList.length>8){
											that.ishwos=false
										}else{
											that.ishwos=true
										}
									}else if(that.types==2){
										that.imgList2.push(res.tempFilePaths[0]);
										console.log(that.imgList2)
											uni.setStorage({
												key: 'imgList2',
												data: that.imgList2,
												success: function () {
												console.log('success');
													
												}
										});
										if(that.imgList2.length>8){
											that.ishwos=false
										}else{
											that.ishwos=true
										}
									}
									
									
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
		},
	}
</script>

<style lang="scss">
@import 'brandcharacteristics.scss'
</style>
