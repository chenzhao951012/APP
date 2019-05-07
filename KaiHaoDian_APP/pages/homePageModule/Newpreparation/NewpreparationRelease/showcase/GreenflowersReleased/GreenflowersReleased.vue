<template>
<view class="content">
		<view class="ramage">
			<view class="ramageType">
				<view class="introduce">
					<view class="shopName">
						店铺名称
					</view>
					<view class="shopTitle">
						<input type="text" value="" />
					</view>
				</view>
			</view>
			<view class="ramageType">
				<view class="introduce">
					<view class="shopName">
						店铺地址
					</view>
					<view class="shopTitle">
						<input type="text" value="" />
					</view>
				</view>
			</view>
			<view class="ramageType" style="border-bottom: 0;">
				<view class="introduce">
					<view class="shopName">
						店铺logo
					</view>
					<view class="shopTitle shopTitle2">
						<img :src="imageUrl + iten" alt="" v-if="!isImg" v-for='(iten,idx) in imgsrc' :key='idx' @click='preview(idx)'>
						<text class="iconfont" @click="addImg" v-if="isImg">&#xe6ac;</text>
					</view>
				</view>
			</view>
			<view>	
			</view>
		</view>
			<view class="ramage">
			<view class="ramageType">
				<view class="introduce">
					<view class="shopName">
						店铺介绍
					</view>
					<view class="shopTitle">
						
						<input type="text" value="" />
					</view>
				</view>
			</view>
			<view class="ramageType" style="border-bottom:0;">
				<view class="introduce">
					<view class="shopName">
					营业时间
					</view>
					<view class="shopTitle">
						<input type="text" value="" />
					</view>
				</view>
			</view>
			
			<view>	
			</view>
		</view>
		<view class="ramage">
			<view class="ramageType">
				<view class="introduce">
					<view class="shopName">
					单个商品上传
					</view>
					<view class="shopTitle shopTitle2">
							<navigator url="particularCommodity/particularCommodity"><text v-if="list2">{{accomplish}}</text><text class="iconfont" v-if="!list2">&#xe616;</text></navigator>
					</view>
				</view>
			</view>
			<view class="ramageType">
				<view class="introduce">
					<view class="shopName">
						套餐商品上传
					</view>
					<view class="shopTitle shopTitle2">
							<navigator url="MoregoodsRelease/MoregoodsRelease"><text v-if="list1">{{accomplish2}}</text><text class="iconfont" v-if="!list1">&#xe616;</text></navigator>
					</view>
				</view>
			</view>
			
			<view>	
			</view>
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic'; //服务器地址
	export default {
		data() {
			return {
				list1:'',
				list2:'',
				accomplish:'完成',
				accomplish2:'完成',
				isImg:true,
				ImgList:[],
				imgsrc:[],
				 pics: [],
				 width: "",
				 imageUrl:shoppublic.getImageUrl()
			};
		},
		onLoad() {
			var that=this
			uni.getStorage({
				key:'MoregoodsRelease',
				success(res) {
					that.list1=res.data
				}
			}),
				uni.getStorage({
				key:'particularCommodity',
				success(res) {
					that.list2=res.data
				}
			})
		},
		methods:{
			//提交
			submit(){
					
				},
			// 图片预览
			preview(index){
				var current_temp=this.ImgList[index]
				uni.previewImage({
				current:current_temp,
				urls:this.ImgList
			});
		},
			// 企业logo
			addImg(){
				var that=this
				 var pics = that.pics
				  var imgsrc = that.imgsrc;
				  
				uni.chooseImage({
				count:1,
				 sizeType: ['original', 'compressed'],
				sourceType: ['album','camera'],
				success: function (res) {
					uni.getImageInfo({
						src: res.tempFilePaths[0],
						success: function (image) {
							that.isImg=false
						  var imgSrc = res.tempFilePaths
							 that.pics=imgSrc
							that.ImgList.push(res.tempFilePaths[0])
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
@import 'GreenflowersReleased.scss'
</style>
