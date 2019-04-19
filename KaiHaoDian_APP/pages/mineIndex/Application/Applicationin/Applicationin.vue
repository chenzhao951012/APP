<template>
	<view class="content">
		<view class="enterBox">
			<view class="apply">
				<view class="tab">
					<SwiperNav :modelData='modelData' :initIndex='initIndex' @changed='changed'></SwiperNav>
				</view>
			</view>
			<view v-if="showindustry">
					<view class="information">
					<view class="category category2">
						<view>选择入驻行业</view>
						<view @click="Chooseindustry">{{industry}}<text  class="iconfont">&#xe616;</text></view>
					</view>
					<view class="category">
						<view>店铺名称</view>
						<view><input type="text" v-model="shopname"></view>
					</view>
					<view class="category">
						<view>申请人姓名</view>
						<view><input type="text" v-model="username"></view>
					</view>
					<view class="category">
						<view>申请人手机号</view>
						<view><input type="text" v-model="phone"></view>
					</view>
				</view>
				<view class="lins">
					
				</view>
				<view class="information">
					
					<view class="category">
						<view>店铺地址</view>
						<view><input type="text" v-model="site"></view>
					</view>
					<view class="category3">
						<view class="title">
							<view>营业执照</view>
							
						</view>
							<!-- // 营业执照上传 -->
						<view class="ImgBox">
							<view class="license">
								<view class="" v-for="(item,idx) in imgList" :key='idx'>
									<img :src="item" alt="">
									<text  class="iconfont" @click="deleImg(idx)">
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
			</view>
		
			<!-- //品牌入驻 -->
			<view class="" v-if="!showindustry">
				<view class="information">
					<view class="category">
						<view>品牌名称</view>
						<view><input type="text" v-model="brandname" maxlength="300"></view>
					</view>
					<view class="category">
						<view>品牌龄</view>
						<view><input type="text" v-model="brandage"></view>
					</view>
					<view class="category">
						<view>加盟费</view>
						<view><input type="text" v-model="franchisefee"></view>
					</view>
					<view class="category">
						<view>加盟特色</view>
						<view><input type="text" v-model="characteristics"></view>
					</view>
					<view class="category">
						<view>现有门店</view>
						<view><input type="text" v-model="Existingstores"></view>
					</view>
					<view class="category">
						<view>总部地址</view>
						<view><input type="text" v-model="headquarteraddress"></view>
					</view>
				</view>
				<view class="lins">
					
				</view>
					<view class="information">
					<view class="category category2">
						<view>品牌特色</view>
						<view @click="Bcharacteristics(1)">{{accomplish}}<text v-if="showRight" class="iconfont">&#xe616;</text></view>
					</view>
					<view class="category category2">
						<view>品牌形象</view>
						<view @click="Bcharacteristics(2)">{{accomplish2}}<text v-if="showRight2" class="iconfont">&#xe616;</text></view>
					</view>
					<view class="category category2">
						<view>品牌展示</view>
						<view><text  class="iconfont">&#xe616;</text></view>
					</view>
				</view>
				<view class="lins">
					
				</view>
					<view class="information">
					
					<view class="category4">
						<view>公司介绍</view>
						<view>
							<textarea value="" placeholder="" v-model="companyintroduction"/>
						</view>
					</view>
						<view class="category4">
						<view>服务优势</view>
						<view>
							<textarea value="" placeholder="" v-model="advantageservice"/>
						</view>
					</view>
						<view class="category4">
						<view>运营优势</view>
						<view>
							<textarea value="" placeholder="" v-model="Operatingadvantages"/>
						</view>
					</view>
						<view class="category4">
						<view>售后服务</view>
						<view>
							<textarea value="" placeholder="" v-model="aftersalesservice"/>
						</view>
					</view>
						<view class="category4">
						<view>总部支持</view>
						<view>
							<textarea value="" placeholder="" v-model="support"/>
						</view>
					</view>
					<view class="category3">
						<view class="title">
							<view>企业证书</view>
							
						</view>
							<!-- // 营业执照上传 -->
						<view class="ImgBox">
							<view class="license">
								<view class="" v-for="(item,idx) in imgList" :key='idx'>
									<img :src="item" alt="">
									<text  class="iconfont" @click="deleImg(idx)">
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
			
			</view>
		</view>
		<view class="next" @click="submitInfo">
			下一步
		</view>
	</view>
</template>

<script>
	import SwiperNav from '@/components/SlidingNavigation.vue';
	export default {
		data() {
			return {
				showRight:true,
				showRight2:true,
				accomplish2:'',
				imgListed:[],
				imgListed2:[],
				initIndex:0,
				accomplish:'',
				state:1,
				brandname:'',//品牌名称
				 brandage:'',//品牌年龄
				 franchisefee:'',//加盟费
				 characteristics:'',//加盟特色
				 Existingstores:'',//现有门店
				 headquarteraddress:'',//总部地址
				 companyintroduction:'',//公司介绍
				 advantageservice:'',//服务优势
				 Operatingadvantages:'',//运营优势
				 aftersalesservice:'',//售后服务
				 support:'',//总部支持
				showindustry:true,
				industry:'',
				ishwos:true,
				imgList:[],
				site:'',
				shopname:'',
				phone:'',
				username:'',
				isShow:true,
				modelData:[
					{
						id:0,
						lable:"供应商入驻"
						
					},
					{
						id:1,
						lable:"品牌入驻"
					}
				]
			};
		},
		components:{
			SwiperNav
		},
		onBackPress(){
		
		try {
			uni.removeStorageSync('imgList1');
		} catch (e) {
			
		}
		try {
			uni.removeStorageSync('imgList2');
		} catch (e) {
			
		}
		},
		onLoad(option) {
			var that=this
			console.log(this.imgListed2)
			uni.getStorage({
			key: 'imgList1',
			success: function (res) {
				if(res.data.length>0){
					that.accomplish='已完成'
					that.initIndex=1
					that.showindustry=false
					that.showRight=false
				}
			}
		});
			uni.getStorage({
			key: 'imgList2',
			success: function (res) {
				console.log(res.data)
				if(res.data.length>0){
					that.accomplish2='已完成'
					that.initIndex=1
					that.showindustry=false
					that.showRight2=false
				}
			}
		});
			this.industry=option.title
			
		},
		methods:{
			// 品牌特色跳转
			Bcharacteristics(type){
						uni.navigateTo({
						url:'./brandcharacteristics/brandcharacteristics?type='+type
					})
				
				},
			// 行业选择
			Chooseindustry(){
				uni.navigateTo({
					url:'./Selectindustry/Selectindustry'
				})
			},
		// 图片删除
		deleImg(index){
			
			this.imgList.splice(index,1)
			this.ishwos=true
		},
			//图片上传
			addImg(){
				var that=this
				if(that.imgList.length<3){
							uni.chooseImage({
						count: 3,
						sourceType: ['album'],
						success: function (res) {
							uni.getImageInfo({
								src: res.tempFilePaths[0],
								success: function (image) {
									that.imgList.push(res.tempFilePaths[0]);
									if(that.imgList.length>2){
										that.ishwos=false
									}else{
										that.ishwos=true
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
	
				changed(index){
					if(index==0){
						this.showindustry=true
						this.state=1
					}else{
						this.showindustry=false
						this.state=2
					}
				},
				goauthentication(){
					uni.navigateTo({
						url:'Applicationin/Applicationin'
					})
				},
				//供应商入驻
				Supplierentry(){
					var that=this
					if(that.industry==''){
							uni.showToast({
							title: '入驻行业不能为空',
							icon:"none",
							duration: 2000
						});
					}else if(that.shopname==''){
							uni.showToast({
							title: '店铺名称不能为空',
							icon:"none",
							duration: 2000
						});
					}else if(that.username==''){
							uni.showToast({
							title: '申请人姓名不能为空',
							icon:"none",
							duration: 2000
						});
					}else if(that.phone==''){
							uni.showToast({
							title: '申请人手机号不能为空',
							icon:"none",
							duration: 2000
						});
					}else if(that.site==''){
							uni.showToast({
							title: '地址不能为空',
							icon:"none",
							duration: 2000
						});
					}else if(that.imgList.length<1){
							uni.showToast({
							title: '营业执照至少上传一张',
							icon:"none",
							duration: 2000
						});
					}else{
						uni.request({
							url: 'https://www.example.com/request', //仅为示例，并非真实接口地址。
							data: {
								text: 'uni.request'
							},
							header: {
								'custom-header': 'hello' //自定义请求头信息
							},
							success: (res) => {
								console.log(res.data);
								
								uni.showToast({
									title: '上传成功',
									icon:"none",
									duration: 2000
								});
							}
						});
						
					}
					
				},
				// 品牌入驻
				brands(){
					
				},
				//下一步
				submitInfo(){
					var that=this
					if(that.state==1){
						that.Supplierentry();
					}else if(that.state==2){
						console.log(12)
					}
				}
			},
		}
</script>

<style lang="scss">
@import 'Applicationin.scss'
</style>
