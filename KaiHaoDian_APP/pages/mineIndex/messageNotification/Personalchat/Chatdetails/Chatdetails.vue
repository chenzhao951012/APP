<template>
  <view class="page">
    <view class="message-height">
      <view v-for="(it,i) in messageData" :key="i">
        <left-message v-if="it.type == -1" :data="it.message" time="14:00"></left-message>
        <right-message v-if="it.type == 1" :data="it.message" time="14:00"></right-message>
      </view>
    </view>
    <view class="footer">
      <sendMessage @send='send'></sendMessage>
    </view>
  </view>
 
</template>

<script>
		var socketOpen = false;
	var frameBuffer_Data, session, SocketTask;
	import shoppublic from '@/common/shoppublic'; //服务器地址
	var SocketTask;
var messageDate = require("@/common/js/message.js");
import leftMessage from "@/components/chat/left-message.vue";
import rightMessage from "@/components/chat/right-message.vue";
import sendMessage from "@/components/chat/send-message.vue";
export default {
  components: { leftMessage, rightMessage, sendMessage },
  data() {
    return {
      messageData: messageDate.messagelist,
      pageHeight: 0,
      windowHeight: 0
    };
  },
  onReady() {
    let _this = this;
    uni
      .createSelectorQuery()
      .selectAll(".page")
      .boundingClientRect(function(rects) {
        _this.pageHeight = rects[0].height;
        uni.pageScrollTo({
          scrollTop: rects[0].height - _this.windowHeight,
          duration: 0
        });
      })
      .exec();
  },
  onLoad() {
			uni.setNavigationBarTitle({
		title: '与'+'娃哈哈'+'沟通中'
		});
    let _this = this;
    uni.getSystemInfo({
      success: function(res) {
        _this.windowHeight = res.windowHeight;
      }
    });
    uni.onWindowResize(res => {
      uni.pageScrollTo({
        scrollTop: _this.pageHeight - res.size.windowHeight,
        duration: 300
      });
    });
  },
  methods: {
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
		 toBottom(){
		uni.pageScrollTo({
		  scrollTop: 100000,
		})
		},
		send(value){
			console.log(value)
		}
	}
};
</script>

<style lang="scss" scoped="true">
.page {
  box-sizing: border-box;
  width: 100%;
  background: #f3f3f3;
  overflow: hidden;
  padding-bottom: 100upx;
	padding-top:20upx;
}

  .message-height {
		background-color: #fff;
    padding: 30upx 0 130upx 0;
		box-sizing: border-box;
  }

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100upx;
}
</style>
