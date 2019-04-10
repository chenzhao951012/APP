<template>
	
	<view class="content">
		<view class="evaluate"> 
				<view class="evaluateList">
					<view class="evaluatecontent">
						<view class="evaluatecontentTop">
								<view>
								<img src="../../../../static/bear.png" alt=""><text>呜哈哈</text>
							</view>
						</view>
						<!-- //评价模块 -->
						<view class="evaluatecontentCenter">
							<view class="CenterImg"><image src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1476692208,2742622493&fm=5" mode=""></image></view>
							<view class="CenterImg2"><img src="../../../../static/evaluate.png" alt=""><text>好评</text></view>
							<view class="CenterImg2"><img src="../../../../static/evaluate.png" alt=""><text>中评</text></view>
							<view class="CenterImg2"><img src="../../../../static/evaluate.png" alt=""><text>差评</text></view>
						</view>
						<!-- 评价选择 -->
						<view class="evaluatecontentList">
							<view class="title" v-for="(item,idx) in ServiceList" :key="idx">
								{{item.value}}
							</view>
						</view>
						<!-- //评论框 -->
						<view class="CommentBox">
							<view class="Comment">
								<textarea value="" placeholder="请输入评论" maxlength="200"/>
							</view>
							<view class="CommentImg" @touchend="upImg">
								<text class="iconfont">&#xe649;</text>
							</view>
						</view>
						<!-- 评论图片 -->
						<view class="CommentImgBOx" v-if="imgList.length>0">
							<view v-for="(item,idx) in imgList" :key='idx'>
								<img :src="item" alt="">
							</view>
							
						</view>
						<!-- //星星评论 -->
						<view class="rate">
							<view class="rateList"><text>描述相符</text><rate margin='10' is-fill='false' color='#ffc855' size='20'></rate></view>
							<view class="rateList"><text>花材质量</text><rate margin='10' is-fill='false' color='#ffc855' size='20'></rate></view>
							<view class="rateList"><text>服务态度</text><rate margin='10' is-fill='false' color='#ffc855' size='20'></rate></view>
							<view class="rateList" style="margin-bottom: 0;"><text>配送服务</text><rate margin='10' is-fill='false' color='#ffc855' size='20'></rate></view>
						</view>
					</view>
					<!-- 是否匿名 -->
					<view class="anonymity">
						<view class="anonymitytitle">
							<view class="around">
								<text class="_arrow iconfont" v-if="checked" @click="Changeradio">&#xe72f;</text>
								<text class="_arrow iconfont" v-if="!checked" @click="Changeradio">&#xe61c;</text>
								<view class="titles">匿名</view>
							</view>
						</view>
						<view class="you">十分感谢你的评价~</view>
					</view>
				</view>
		</view>
	</view>
</template>

<script>
	import rate from '@/components/rate/uni-rate.vue'
	export default {
		components:{
			rate
		},
		data() {
			return {
				checked:true,
				imgList:[],
				ServiceList:[
					{
						id:0,
						value:'服务热情'
					},
					{
						id:1,
						value:'包装精美'
					},
					{
						id:2,
						value:'性价比高'
					},
					{
						id:3,
						value:'好看'
					},
					{
						id:4,
						value:'花菜新鲜'
					},
					{
						id:5,
						value:'配送及时'
					},
					{
						id:6,
						value:'店面精致'
					},
				],
				 radioItems: [{
                    name: 'USA',
                    value: '美国'
                },
                {
                    name: 'CHN',
                    value: '中国',
                    checked: 'true'
                }
            ],
            hidden: false
			};
		},
			onNavigationBarButtonTap() {  
						if(this.checked==true){
							console.log(11)
							return
						}else{
							console.log(12)
						}
					},
		methods:{
			//判断单选
			     Changeradio(){
						this.checked=!this.checked
						
						},
			//图片上传
			upImg(){
				var that=this
				uni.chooseImage({
					count: 3,
					sourceType: ['album'],
					success: function (res) {
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: function (image) {
								console.log(res.tempFilePaths[0]);
								if(that.imgList.length>2){
									uni.showModal({
										title: '提示',
										showCancel:false,
										content: '图片数量至多三张',
										success: function (res) {
											if (res.confirm) {
												console.log('用户点击确定');
											} else if (res.cancel) {
												console.log('用户点击取消');
											}
										}
									});
									return
								}else{
									that.imgList.push(res.tempFilePaths[0])
									console.log(that.imgList.length)
								}
							}
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
@import 'evaluate.scss'
</style>
