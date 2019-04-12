<template>
	<view class="content">
		<view class="connent">
			<view class="linse">
				
			</view>
			<view class="" style="margin-bottom: 200upx;">
				<view class="body" v-for="(item,idx) in allContentList" :key='idx'>
					<view class="userChat" v-if="item.uid == touid ">
							<view class="userInfo">
								<img :src="friendImg" alt="">
							</view>
							<view class="userConnent">
								<view class="talkList">
									<text>{{item.message}}</text>
								</view>
								<view class="talkImg">
									
								</view>
							</view>
					</view>
					<view class="oneself" v-if="item.uid == id">
						<view class="oneselfConnent">
							<view class="oneselftalkList">
								<text>{{item.message}}</text>
							</view>
						</view>
						<view class="oneselfInfo">
							<img :src="myImg" alt="">
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="send">
				<view class="talkInput">
					<input type="text" maxlength='200' v-model="talk">
				</view>
				<view class="sendtalk" @click="sendMsg">
					发送
				</view>
		</view>
	</view>
</template>

<script>
	
	var socketOpen = false;
	var frameBuffer_Data, session, SocketTask;
	import shoppublic from '@/common/shoppublic'; //服务器地址
	var SocketTask;
	export default {
		components: {
		},
		data() {
			return {
				talk:'',
				friendImg:'',
				myImg:'',
				id:'',
				touid:'',
				tokenid:'05d376ee177144d4873e35f3527d536a',
				allContentList:'',
				token:14651
			};
		},
		onUnload() {
			uni.closeSocket()
		  },
		onLoad(option) {
			var _this=this
			console.log(option)
			uni.setNavigationBarTitle({
			title: '与'+option.name+'沟通中'
			});
			let allOne = new Promise((resolve) => {
			this.myImg=option.myportrait
			this.friendImg=option.portrait
			this.id=option.mytoken
			this.touid=option.touid.toString()
			// this.tokenid=option.tokenid
			});
			let allTow = new Promise((resolve) => {
			  _this.getChatInfo();
			})
		 Promise.all([allOne, allTow]).then((res) => {
			console.log('加载成功');
			})
		},
		// 监听页面显示
		  onShow() {
			if (!socketOpen) {
			  this.webSocket();
			  this.thatMsg();
			}
			this.toBottom();
		  },
		  updated() {
		  	this.toBottom();
		  },
		methods:{
			//页面滚动
			  toBottom(){
				uni.pageScrollTo({
				  scrollTop: 100000,
				})
			  },
			   // 发送消息
			  sendMsg() {
				let _this = this;
				console.log('socketOpen:', socketOpen);
				// 如果打开了socket就发送数据给服务器
				if (socketOpen) {
				  if (_this.talk!=''){
					_this.sendSocketMessage(_this.talk);
					_this.allContentList.push({
					  uid: _this.id,
					  message: _this.talk
					});
					  _this.allContentList=_this.allContentList,
					  _this.talk=''
					console.log(_this.allContentList);
				  }else{
					uni.showToast({
					  title: '发送内容不能为空',
					  icon:'none',
					  duration:2000
					})
				  }
				} else {
				  uni.showToast({
					title: '发送失败,请联系客服反映情况',
					icon: 'none',
					duration: 2000
				  })
				}
			  },
			// 发送WebSocket
			  // 通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
				  sendSocketMessage(msg) {
					var _this = this;
					SocketTask.send({
					  data: JSON.stringify({
						'message': msg,
						'role': _this.touid,
						'socketId': _this.tokenid
					  }),
					  success: res => {
						_this.toBottom();
						console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
					  },
					  fail: res => {
						console.info('发送失败');
					  }
					})
				  },
			// 创建websorct
			 webSocket: function() {
				let _this = this;
				// 创建Socket
				SocketTask = uni.connectSocket({
				  url: shoppublic.getWabsocketUrl() + '/ws/' + _this.id + ',' + _this.tokenid,
				  // url: shoppublic.getWabsocketUrl() + '/ws/' + _this.data.myId  + '1',
				  data: {
					// myId: _this.data.myId ,
					// tokenid:'1'
				  },
				  header: {
					'content-type': 'application/json'
				  },
				  method: 'post',
				  success: (res) => {
				
				  },
				  fail: function(err) {
					uni.showToast({
					  title: '网络异常！',
					})
				  },
				})
			  },
			  
			    // 监听通话连接
			thatMsg() {
					let _this = this;
					SocketTask.onOpen(res => {
					  socketOpen = true;
					  console.log('监听 WebSocket 连接打开事件。', res)
					})
					SocketTask.onClose(onClose => {
					  console.log('监听 WebSocket 连接关闭事件。', onClose)
					  socketOpen = false;
					  // _this.webSocket();
					  // _this.thatMsg();
					})
					SocketTask.onError(onError => {
					  console.log('监听 WebSocket 错误。错误信息', onError)
					  socketOpen = false
					})
					SocketTask.onMessage(onMessage => {
					  // var onMessage_data = onMessage.data.substring(3, onMessage.data.length);
					  console.log('接受服务器消息:', onMessage.data);
					  _this.allContentList.push({
						uid: _this.touid,
						message: onMessage.data
					  });
						 
						  console.log( _this.allContentList)
					 
					  
					})
				  },
						  // 获取聊天信息
			getChatInfo() {
				let _this = this;
				uni.request({
				  url: shoppublic.getUrl() + '/chat/qryHistoryMessage',
				  data: {
					uid:_this.token,
					touid:_this.touid,
					tokenid: '05d376ee177144d4873e35f3527d536a'
				  },
				  success: res => {
					console.log(res);
					  _this.allContentList=res.data.responseBody
					
				  }
				})
			  },
		}
	}
</script>

<style lang="scss">
@import 'talk.scss'
</style>
