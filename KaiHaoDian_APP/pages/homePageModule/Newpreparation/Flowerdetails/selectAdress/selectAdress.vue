<template>
	<view class="content">
		<view class="selectAdress">
			<view class="adressList">
				<view class="surface" v-for='(item,index) in userList' :key='index'>
					<view class="adressInfo">
						<view>{{item.name}}({{silicePhoe}})</view>
						<view>{{item.adress}}</view>
					</view>
					<view class="compile">
						<text  class="iconfont" @click="gosaveAdress(item.id)">
							&#xe850;
						</text>
					</view>
				</view>
			</view>
		</view>
		<view class="increased" @click="gosaveAdress('compile')">
			新增收货地址
		</view>
	</view>
</template>

<script>
	export default {
	
		data() {
			return {
				userList:[
					{	
						id:1,
						name:'李清照',
						phone:'17611205736',
						adress:'西安市雁塔区群贤道9号'
					},
					{
						id:2,
						name:'李照他爸',
						phone:'17611205736',
						adress:'西安市雁塔区群贤道108号'
					}
				]
			};
		},
			computed:{
			//电话分割
			silicePhoe(){
				var number;
				for(var i in this.userList){
					number=this.userList[i].phone.substring(0,3)+'****'+this.userList[i].phone.substring(7,11)
				}
				return number
			}
		},
		methods:{
			gosaveAdress(id){
				uni.navigateTo({
			url: '../flowerdetailsOrd/shippingAddress/shippingAddress?id='+id
		});
			}
		}
	}
</script>

<style lang="scss">
@import 'selectAdress.scss'
</style>
