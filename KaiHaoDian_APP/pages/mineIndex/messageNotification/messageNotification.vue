<template>
	<view class="content">
		<view class="massageBox">
			<view class="tab">
					<SwiperNav :modelData='modelData' @changed='changed'></SwiperNav>
			</view>
			<!-- //系统消息 -->
	<view class="massageList" v-if="system">
	<view class="container">
  <view>
    <view class="list-item " v-for="(item,index) in list "  :class="scrollIndex == index+10 ? 'list-item active' : 'list-item' " :key='index+10'>
      <view class="list-box" @touchstart="touchStart($event)" @touchend="touchEnd(index+10,$event)" @click="skip">
        <img class="list-img" :src="item.imgUrl" alt="">
        <view class="list-content">
          <view class="title">{{item.title}}</view>
          <view class="tips">{{item.tips}}</view>
          <view class="time">{{item.time}}</view>
        </view>
		
      </view>
      <view class="delete" @click="deleteItem(index)">删除</div>
	  
    </view>
	<view class="info" style="z-index: 200;" @click="systemDetails(item.id)">
			查看详情>>
		</view>
  </view>
</view>
</view>
			</view>
		</view>
		<!-- //个人消息 -->
		<view class="message-list" v-if="personage">
		  <wkiwi-action :options="options" :messagesList="messages"></wkiwi-action>
		</view>
	</view>
</template>

<script>
	import wkiwiAction from "@/components/chat/wkiwi-action.vue";
	import SwiperNav from '@/components/SlidingNavigation.vue';
	export default {
		data() {
			return {
				system:true,
				personage:false,
					modelData:[
					{
						id:0,
						lable:"消息通知"
						
					},
					{
						id:1,
						lable:"好友消息"
					}
				],
				 userInfo: {},
     
				list : [
  {
	  id:0,
   title : 'Chrome更新了' ,
   imgUrl : '../../../static/xitong.png' ,
   tips : '不再支持Flash视频播放电影《红海行动》上映以来票房暴涨，很多国人表示对国产电影有了新的改观电影《红海行动》上映以来票房暴涨，很多国人表示对国产电影有了新的改观' ,
   time : '上午 8:30'
  },
  {
	  id:1,
   title : '电影新资讯' ,
   imgUrl : '../../../static/xitong.png' ,
   tips : '电影《红海行动》上映以来票房暴涨，很多国人表示对国产电影有了新的改观电影《红海行动》上映以来票房暴涨，很多国人表示对国产电影有了新的改观' ,
   time : '上午 12:00'
  },
        {
			id:2,
   title : '聚焦两会·共筑中国梦' ,
   imgUrl : '../../../static/xitong.png' ,
   tips : '习近平代表的两会故事电影《红海行动》上映以来票房暴涨，很多国人表示对国产电影有了新的改观电影《红海行动》上映以来票房暴涨，很多国人表示对国产电影有了新的改观' ,
   time : '下午 17:45'
        },
        {
			id:3,
   title : '微信团队' ,
   imgUrl : '../../../static/xitong.png',
   tips : '您的帐号有异常登录，如非本人操作，请及时修改密码电影《红海行动》上映以来票房暴涨，很多国人表示对国产电影有了新的改观电影《红海行动》上映以来票房暴涨，很多国人表示对国产电影有了新的改观' ,
   time : '昨天'
        }
  ],
    focus: false,
    isShowView: true,
    options: [
      {
        text: "置顶",
        style: {
          backgroundColor: "#C7C6CD"
        }
      },
      {
        text: "删除",
        style: {
          backgroundColor: "#dd524d"
        }
      }
    ],
    messages: [
      {
        title: "系统消息",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/0d1252b54be4f2d240b6b7fe4ed35054.jpg"
        ],
        message: "这是一条系统消息",
        time: "15:15",
        count: 5,
        stick: false, //是否为置顶状态
        disabled: false, //是否禁止滑动
        type: 1 //通知类型消息
      },
      {
        title: "消息任务",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/0d1252b54be4f2d240b6b7fe4ed35054.jpg"
        ],
        message: "这是一条消息任务",
        time: "15:15",
        count: 5,
        stick: false, //是否为置顶状态
        disabled: false, //是否禁止滑动
        type: 1 //通知类型消息
      },
      {
        title: "马云",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/0d1252b54be4f2d240b6b7fe4ed35054.jpg"
        ],
        message: "什么鬼，我有支付宝[禁止滑动]",
        time: "15:15",
        count: 5,
        stick: false, //是否为置顶状态
        disabled: true, //是否禁止滑动
        type: 2 //普通用户类型消息
      },
      {
        title: "扫黑除恶工作小组",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/cd1d745ed855bef27f47c8aff0786067.jpg",
          "http://img1.3lian.com/gif/more/11/201212/c011f2b2ab1a10d79fe931a786503d03.jpg",
          "http://img1.3lian.com/gif/more/11/201212/cf9d56d05c0cbc1edbf21cf64ad9c341.jpg",
          "http://img1.3lian.com/gif/more/11/201212/e10e8faa201671b5a2e8a6146f80d99e.jpg"
        ],
        message: "原地待命",
        time: "15:15",
        count: 22,
        stick: true,
        disabled: false, //是否禁止滑动
        type: 3 //群组消息
      },
      {
        title: "李彦宏",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/c011f2b2ab1a10d79fe931a786503d03.jpg"
        ],
        message: "抄袭我的吧，我早都做过了",
        time: "12:13",
        count: 1,
        stick: false,
        disabled: false, //是否禁止滑动
        type: 2 //普通用户类型消息
      },
      {
        title: "四菜一汤",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/cd1d745ed855bef27f47c8aff0786067.jpg",
          "http://img1.3lian.com/gif/more/11/201212/c011f2b2ab1a10d79fe931a786503d03.jpg",
          "http://img1.3lian.com/gif/more/11/201212/cf9d56d05c0cbc1edbf21cf64ad9c341.jpg",
          "http://img1.3lian.com/gif/more/11/201212/e10e8faa201671b5a2e8a6146f80d99e.jpg"
        ],
        message: "[语音]32秒",
        time: "15:15",
        count: 22,
        stick: true,
        disabled: false, //是否禁止滑动
        type: 3 //群组消息
      },
      {
        title: "雷军",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/cf9d56d05c0cbc1edbf21cf64ad9c341.jpg"
        ],
        message: "微信给你下线，看你还嘚瑟",
        time: "12:11",
        count: 0,
        stick: false,
        disabled: false, //是否禁止滑动
        type: 2 //普通用户类型消息
      },
      {
        title: "前端开发者",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/04b335ead07530a6188a27549fad1a68.jpg"
        ],
        message: "我们的春天来啦，哈哈哈",
        time: "11:35",
        count: 0,
        stick: false,
        disabled: false, //是否禁止滑动
        type: 2 //普通用户类型消息
      },
      {
        title: "微信小程序",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/e10e8faa201671b5a2e8a6146f80d99e.jpg"
        ],
        message: "谁有内测资格啊啊，300万买一个",
        time: "08:23",
        count: 0,
        stick: false,
        disabled: false, //是否禁止滑动
        type: 2 //普通用户类型消息
      },
      {
        title: "小程序",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/3fab6379b6ef53e7c17a1cc772eed0d6.jpg"
        ],
        message: "这个IDE方便都不要配置了",
        time: "03:21",
        count: 5,
        stick: false,
        disabled: false, //是否禁止滑动
        type: 2 //普通用户类型消息
      },
      {
        title: "微信应用号开发群",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/8f3762fb4d791410ec970baa2641344d.jpg"
        ],
        message: "开发的局限性太大了",
        time: "03:08",
        count: 99,
        stick: false,
        disabled: false, //是否禁止滑动
        type: 2 //普通用户类型消息
      },
      {
        title: "后台",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/411cffabcd6e4474b48f1ecac76e1b3f.jpg"
        ],
        message: "不看好小程序",
        time: "02:45",
        count: 0,
        stick: false,
        disabled: false, //是否禁止滑动
        type: 2 //普通用户类型消息
      },
      {
        title: "闯天下",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/04378257474004fcdd62f619d724db0c.jpg"
        ],
        message: "微信太强大了",
        time: "01:09",
        count: 0,
        stick: false,
        disabled: false, //是否禁止滑动
        type: 2 //普通用户类型消息
      },
      {
        title: "小程序",
        url: [
          "http://img1.3lian.com/gif/more/11/201212/58ec7c89b16c529fc9d0dc440a72e14d.jpg"
        ],
        message: "有快来看直播啦，学习开始啦",
        time: "00:24",
        count: 2,
        stick: false,
        disabled: false, //是否禁止滑动
        type: 2 //普通用户类型消息
      }
    ],
			scrollIndex:-1,
			startX : 0 ,
			endX : 0 ,
 
			}
		},
			components:{
			SwiperNav,
			wkiwiAction
			
		},
		 onNavigationBarButtonTap(e) {
		  if (e.index == 0) {
		    this.floatingMenuShow = !this.floatingMenuShow;
		  }
		},
		methods:{
			//进入消息详情
			systemDetails(id){
				uni.navigateTo({
					url:'./systemDetails/systemDetails?id='+id
				})
			},
			changed(index){
				if(index==0){
					this.system=true
					this.personage=false
				}else{
					this.system=false
					this.personage=true
				}
			},
					//点击全部恢复
		skip() {  
			this.scrollIndex = -1;
		},
		//复位滑动状态
		restSlide(){
			let listItems = document.querySelectorAll('.list-item');
                         // 复位
			for( let i = 0 ; i < listItems.length ; i++){
				listItems[i].dataset.type = 0;
			}
		},

		//滑动开始
		touchStart(e) { 
		console.log(e)   // 记录初始位置
			this.startX = e.touches[0].clientX; 
		},
		//滑动结束
		touchEnd(index,e) {
			console.log(1)
			var ev = e||event;
			// 记录结束位置
			this.endX = ev.changedTouches[0].clientX;
			// 左滑
			if( this.startX - this.endX > 30) {
			    //当前滑动DOM的下标等于scollIndex，则当前DOM判断成立（添加左滑class样式）
				this.scrollIndex = index;
			}
			// 右滑
			if( this.startX - this.endX < -30) {
			    //恢复
				this.scrollIndex = -1;
			}
			this.startX = 0;
			this.endX = 0;
		},


 //删除
 deleteItem(index){
	 console.log(index)
   // 当前索引
  // 复位
  this.restSlide();
  // 删除
  this.list.splice(index,1);
 }
 },
 created () {
    // 调用应用实例的方法获取全局数据
    // this.getUserInfo()
  }

		
	}
</script>

<style lang="scss">
.active{
	transform: translateX(-200upx);
}
ul{
padding-inline-start:0;
    margin-block-start:0;
}
@import 'massageBox.scss'
</style>
