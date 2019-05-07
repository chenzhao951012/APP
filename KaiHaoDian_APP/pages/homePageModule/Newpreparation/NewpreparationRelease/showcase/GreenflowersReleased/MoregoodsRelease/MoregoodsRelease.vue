<template>
	<view>
		<commonalityHeader>
			<view class="Aboutshop">
				<view>商铺名称</view>
				<view class="inputBox"><input type="text" v-model="productname"></view>
			</view>
			<view class="Aboutshop">
				<view>商铺简介</view>
				<view class="inputBox"><input type="text" v-model="Productintroduction"></view>
			</view>
			<view class="selectLabel">
				<view class="LabelLeft">
					选择标签
				</view>
				<view class="chosseLable">
					<view class="title" v-for="(items,idx) in LabelList" :key='idx' :class="items.isSelected ?'title2' : 'title' " @click="changes(idx,items)">
						{{items.name}}
					</view>
				</view>
			</view>
		</commonalityHeader>
			<commonalityHeader>
			<view class="Aboutshop">
				<view>商品原价</view>
				<view class="inputBox"><input type="number" v-model="originalCost0"></view>
			</view>
			<view class="Aboutshop">
				<view>商品现价</view>
				<view class="inputBox"><input type="number" v-model="currentprice"></view>
			</view>
		<view class="Aboutshop">
			<view>配送费</view>
			<view class="inputBox"><input type="number" v-model="deliveryCost"></view>
		</view>
		</commonalityHeader>
			<!-- //图片展示 -->
			<commonalityHeader>
				
		<view class=" newShoprental">
				<view class="titles">
				商品展示
			</view>
				<view class="Aboutshop">
				<view>套餐名称</view>
				<view class="inputBox"><input type="number" v-model="originalCost"></view>
			</view>
			<view class="Aboutshop">
				<view>搭配介绍</view>
				<view class="inputBox"><input type="number" v-model="introduced"></view>
			</view>
			<view class="picturepresentation">
					<view class="ImgBox">
							<view class="ImgBox2" v-for="(item,idx) in imgsrc" :key='idx' @click="preview(idx)">
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
		</commonalityHeader>
	
	<commonalityHeader>
		<view class=" newShoprental">
				<view class="Aboutshop">
				<view>套餐名称</view>
				<view class="inputBox"><input type="number" v-model="originalCost1"></view>
			</view>
			<view class="Aboutshop">
				<view>搭配介绍</view>
				<view class="inputBox"><input type="number" v-model="introduced1"></view>
			</view>
			<view class="picturepresentation">
					<view class="ImgBox">
							<view class="ImgBox2" v-for="(item,idx) in imgsrc1" :key='idx' @click="preview1(idx)">
							<img :src="imageUrl + item" alt="">
						<view class="iconfont" @click="deleImg(idx)">
							&#xe68e;
						</view>
						</view>
						<view class="addImg" @click="addImg2" v-if="isShowaddImg1" >
							<text class="iconfont">&#xe649;</text>
						</view>
					</view>
				</view>
				</view>
		</commonalityHeader>
			<commonalityHeader>
			<view class=" newShoprental">
					<view class="Aboutshop">
					<view>套餐名称</view>
					<view class="inputBox"><input type="number" v-model="originalCost2"></view>
				</view>
				<view class="Aboutshop">
					<view>搭配介绍</view>
					<view class="inputBox"><input type="number" v-model="originalCost2"></view>
				</view>
				<view class="picturepresentation">
						<view class="ImgBox">
								<view class="ImgBox2" v-for="(item,idx) in imgsrc2" :key='idx'  @click="preview2(idx)">
								<img :src="imageUrl + item" alt="">
							<view class="iconfont" @click="deleImg(idx)">
								&#xe68e;
							</view>
							</view>
							<view class="addImg" @click="addImg3" v-if="isShowaddImg">
								<text class="iconfont">&#xe649;</text>
							</view>
						</view>
					</view>
					</view>
			</commonalityHeader>
	</view>
</template>
<script>
	
	import shoppublic from '@/common/shoppublic'; //服务器地址
	import commonalityHeader from '@/components/commonalityHeader/commonalityHeader';
	export default {
		components:{
			commonalityHeader
		},
		data() {
			return {
				originalCost0:'',
				introduced:'',
				originalCost:'',
				introduced1:'',
				originalCost1:'',
				introduced2:'',
				originalCost2:'',
				productname:'',
				Productintroduction:'',
				deliveryCost:'',
				currentprice:'',
				imageUrl:shoppublic.getImageUrl(),
				ImgList:[],
				changeed:-1,
				imgsrc:[],
				 pics: [],
				 width: "",
				 ImgList1:[],
				 imgsrc1:[],
				  pics1: [],
				  width1: "",
				  ImgList2:[],
				  imgsrc2:[],
				   pics2: [],
				   width2: "",
				 isShowaddImg:true,
				  isShowaddImg1:true,
				 valueList:[],
				LabelList:[
					{
						id:0,
						name:'全城配送',
						isSelected:false
					},
					{
						id:1,
						name:'花材新鲜',
						isSelected:false
					},
					{
						id:2,
						name:'包你满意',
						isSelected:false
					},
					{
						id:3,
						name:'包装精美',
						isSelected:false
					},
					{
						id:4,
						name:'送小礼物',
						isSelected:false
					},
					{
						id:5,
						name:'免费配送',
						isSelected:false
					}
				]
			};
		},
	 onNavigationBarButtonTap() {
		 var that=this
		 if(that.originalCost=='' || that.originalCost0==''|| that.introduced==''|| that.productname==''|| that.Productintroduction=='' || that.deliveryCost=='' || that.currentprice=='' || that.imgsrc=='' || that.valueList==''){
			uni.showModal({
				title:'提示',
				content: '信息填写不完整,是否提交',
				cancelColor:'#febe3a',
				confirmColor:'#febe3a',
			success: function (res) {
				if (res.confirm) {
					that.savedata()
				} else if (res.cancel) {
				}
			}
		});
		 }else{
			 that.savedata()
		 }
			},									
		methods:{
			// 图片预览
			preview(index){
				var current_temp=this.ImgList[index]
				uni.previewImage({
				current:current_temp,
				urls:this.ImgList
			});
		},
			// 图片预览
			preview1(index){
				var current_temp=this.ImgList1[index]
				uni.previewImage({
				current:current_temp,
				urls:this.ImgList1
			});
		},
			// 图片预览
			preview2(index){
				var current_temp=this.ImgList2[index]
				uni.previewImage({
				current:current_temp,
				urls:this.ImgList2
			});
		},
			savedata(){
				var that=this
				var data={	
							originalCost0:that.originalCost,
							originalCost:that.originalCost,
							introduced:that.introduced,
							originalCost1:that.originalCost1,
							introduced1:that.introduced1,
							originalCost2:that.originalCost2,
							introduced2:that.introduced2,
							productname:that.productname,
							Productintroduction:that.Productintroduction,
							deliveryCost:that.deliveryCost,
							currentprice:that.currentprice,
							imgsrc:that.imgsrc,
							imgsrc1:that.imgsrc1,
							imgsrc2:that.imgsrc2,
							value:that.valueList
							}
							uni.setStorage({
								key:'MoregoodsRelease',
								data:data,
								success: function () {
									
								setTimeout(()=>{
									uni.redirectTo({
										url:'../GreenflowersReleased'
									})
								},500)
									
								}
							})
					},
			
			changes(index,item){
				this.changeed=index
				 item.isSelected = !item.isSelected
				
				  this.valueList.push(item.name)
			},
				// 图片删除
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
			addImg2(){
				var that=this
				 var pics = that.pics
				  var imgsrc = that.imgsrc1;
				  
				uni.chooseImage({
				count:5,
				 sizeType: ['original', 'compressed'],
				sourceType: ['album','camera'],
				success: function (res) {
					uni.getImageInfo({
						src: res.tempFilePaths[0],
						success: function (image) {
						  var imgSrc = res.tempFilePaths
							 that.pics1=imgSrc
							that.ImgList1.push(res.tempFilePaths[0])
							if(that.ImgList1.length>2){
								that.isShowaddImg1=false
							}
							
							let width = that.width1;
								for (var i = 0; i <= that.pics1.length; i++) {
								width = 120 * that.pics1.length + 200;
								}
								  that.width1=width
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
										that.imgsrc1=that.imgsrc1.concat(j.url)
									  console.log(that.imgsrc1);
									}
								  })
								}
								}
					});
				}
			});
			},
			addImg3(){
				var that=this
				 var pics = that.pic2
				  var imgsrc = that.imgsrc2;
				  
				uni.chooseImage({
				count:3,
				 sizeType: ['original', 'compressed'],
				sourceType: ['album','camera'],
				success: function (res) {
					uni.getImageInfo({
						src: res.tempFilePaths[0],
						success: function (image) {
						  var imgSrc = res.tempFilePaths
							 that.pics2=imgSrc
							that.ImgList2.push(res.tempFilePaths[0])
							if(that.ImgList2.length>2){
								that.isShowaddImg1=false
							}
							
							let width = that.width2;
								for (var i = 0; i <= that.pics2.length; i++) {
								width = 120 * that.pics2.length + 200;
								}
								  that.width1=width
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
		}
	}
</script>

<style lang="scss">
@import 'MoregoodsRelease.Scss'
</style>
