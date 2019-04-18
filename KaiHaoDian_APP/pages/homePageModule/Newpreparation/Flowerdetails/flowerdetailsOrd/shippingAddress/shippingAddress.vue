<template>
	<view class="content">
		<view class="shippingaddress">
			<view class="address">
			
				<view class="profile">
					<view>收货地址</view>
					<view><input type="text" placeholder="请填写详细信息" v-model="adderssMassage"></view>
				</view>
				<view class="profile">
					<view>联系人</view>
					<view><input type="text" placeholder="联系人姓名" v-model="username"></view>
				</view>
				<view class="profile" style="border-bottom: 0;display: flex;justify-content: flex-end;">
					<view></view>
					<view style="border-bottom: 2upx solid #eeeeee;width: 85%;">
						<radio-group @change="radioChange" style="display: flex;">
                <label class="uni-list-cell uni-list-cell-pd checkbox" v-for="(item, index) in items" :key="item.value">
                    <view>
                        <radio :value="item.value" :checked="index === current" color='#ffbd38'/>
                    </view>
                    <view style="margin-left: 20upx;">{{item.name}}</view>
                </label>
            </radio-group>
					</view>
				</view>
				<view class="profile">
					<view>手机号</view>
					<view><input type="text" placeholder="请填写收货手机号" v-model="ipone"></view>
				</view>
			</view>
		</view>
		<view class="saveBox" @click="Save">
			保存地址
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			
				checkValue:'男',
				ipone:'',
				username:'',
				adderssMassage:'',
				items: [
					{
					value:'男',
					id:0,
                    name: '男'
                },
                {
					 id:1,
					 value:'女',
                    name: '女',
                    checked: 'true'
                }
               
            ],
            current: 0
        }
	
		},
			onLoad(option) {
					if(option.id=='compile'){
							this.ipone=''
							this.username=''
							this.adderssMassage=''
					}else{
						console.log(30)
					}
			},
		methods:{
			 radioChange: function(e) {
				 console.log(e)
		    for (let i = 0; i < this.items.length; i++) {
		        if (this.items[i].value === e.target.value) {
		            this.current = i;
					this.checkValue=this.items[i].value
					console.log(this.checkValue)
		            break;
		        }
		    }
		},
			Save(){
			if(this.adderssMassage==''){
				uni.showToast({
					title: '详细地址不能为空',
					icon:'none',
					duration: 2000
				});
			}else if(this.username==''){
				uni.showToast({
					title: '联系人不能为空',
					icon:'none',
					duration: 2000
				});
			}else if(this.ipone==''){
				uni.showToast({
					title: '手机号不能为空',
						icon:'none',
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
									uni.showToast({
									title: '保存成功',
										icon:'none',
									duration: 2000
								});
							}
				});
			}
			
		}
		}
		// 保存地址
	
	}
</script>

<style lang="scss">
@import 'shippingaddress.scss'
</style>
