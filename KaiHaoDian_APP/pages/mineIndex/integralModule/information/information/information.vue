<template>
	<view>
		<view class="conenct">
			<view class="header">
				<view class="number">
					账号
				</view>
				<view class="">
					<input type="text" placeholder="请输入你要充值的账号" v-model="account">
				</view>
			</view>
			<view class="section">
				<view class="sectiontitle">提示</view>
				<view class="sectiontitlehint">
					信息提交成功后，我们工作人员将会在12小时内，给您充值到您的账户，请您耐心等待。(请您务必确保您的账号信息准确无误。)客服微信账号：heymaye
				</view>
			</view>
			<view class="submitBox">
				<button type="primary" @touchend=" clickSubmit(id)">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				token:14651,
				id:"",
				account:"",
			};
		},
		onLoad(ontion) {
			this.id=ontion.id
			console.log(this.id)
		},
		methods:{
			 clickSubmit() {
				let _this = this;
				uni.showModal({
				  title: '官方提示',
				  content: '请确认您的充值账号准确无误：' + _this.account,
				  success: res => {
					console.log(res);
					if (res.confirm) {
					  uni.request({
						url: shoppublic.getUrl() + 'integral/addintegral',
						data: {
						  token: _this.token,
						  gift_id:id,
						  exchange_account: _this.account
						},
						success: res => {
						  console.log(res);
						  if (res.data.msgCode === '200') {
							uni.showToast({
							  title: '兑换成功,12小时内到账',
							  icon: 'none',
							  duration: 2000
							})
							setTimeout(() => {
							  wx.navigateTo({
								url: '../../mineIndex',
							  })
							}, 2000)
						  }
						}
					  })
					  _this.setData({
						inputValue: '',
					  })
					}
				  }
				})
			  },
		}
	}
</script>

<style lang="scss">
@import 'information.scss'
</style>
