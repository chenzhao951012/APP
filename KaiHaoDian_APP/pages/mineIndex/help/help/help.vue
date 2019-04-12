<template>
	<view>
		<view class="assistbox">
			<textarea class="assisttextarea" placeholder="请输入你的问题/意见或建议" v-model="suggest"></textarea>
		</view>
		<view class="buttons">
			<button type="primary" class="submient" @touchend="feedback">提交</button>
		</view>
	</view>
</template>

<script>
	import shoppublic from '@/common/shoppublic';
	export default {
		data() {
			return {
				token:14651,
				suggest:"",
				
			};
		},
		methods:{
			//提交按钮
			  feedback(){
					var _this = this;
					if (!_this.suggest){
					  uni.showToast({
						title: '内容为空',
						icon:`none`
					  })
					  return false;
					}

					uni.request({
					  url: shoppublic.getUrl() + '/news/findNewsList',
					  data: {
						token:_this.token,
					  },
					  success: function (res) {
							var ress=res
							console.log(res)
						uni.showModal({
						  title: '反馈成功',
						  content: '返回个人中心',
						  success: function (res) {
							if (ress.data.status == '1') {
							  uni.switchTab({
								url: '../../mineIndex',
							  })
							} else if (res.cancel) {
							  console.log('用户点击取消')
							}
						  }
						})
					  },
					  fail: function (res) {
					  }
					});
					
				  },
		}
	}
</script>

<style lang="scss">
@import 'help.css'
</style>
