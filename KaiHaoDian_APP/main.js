import Vue from 'vue'
import App from './App'
import pageHead from './components/pageHead.vue'
Vue.component('page-head', pageHead);
Vue.config.productionTip = false
App.mpType = 'app'

// 地理位置
Vue.prototype.location = {
	province_id: '',
	province_name: '',
	city_id: '',
	city_name: ''
}
// 页面加载获取地理位置并存储本地
Vue.prototype.setLocation = function(res_p,res_c) {
	uni.setStorage({
		key:'location',
		data:{
			province_name: res_p[0].name,
			province_id: res_p[0].id,
			city_name: res_c[0].name,
			city_id: res_c[0].id
		},
		success:res=>{
			console.log('存储成功');
		}
	})
}













const app = new Vue({
	...App
})
app.$mount()
