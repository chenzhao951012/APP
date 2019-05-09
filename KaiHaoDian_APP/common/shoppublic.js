//var HOST = "https://www.soeasyit.com/shop_api";
function getUrl() {
  //  // 线上
  // var HOST = "https://www.kaidianapp.com/shop_api/";
  // // 测试服务器
   // var HOST = "https://www.kaidianapp.net/shop_api/";
  var HOST = "http://192.168.0.117/shop_api/";
  // var HOST = 'http://192.168.0.111:8080/Kaihaodian_api_war/';
  //  //本地2
  //  var HOST = "http://localhost:8080/";  
  return HOST;
}

function getWabsocketUrl() {
  var HOST = 'wss://www.kaidianapp.com/shop_api'; //线上
  // var HOST = 'wss://syncworld.mynatapp.cc/Kaihaodian_api_war_exploded/';//测试
  // var HOST = 'wss://192.168.0.111:8080/Kaihaodian_api_war/';//测试
  return HOST;
}

function getQrCodeUrl() {
  // 线上
  var HOST = "https://www.kaidianapp.com/";
  // // 测试服务器
  //  var HOST = "https://www.kaidianapp.net/";
  // var HOST = "http://192.168.0.109:8080/"; 
  //本地 
  //  var HOST = "http://localhost:8080/";  
  return HOST;
}

function getUpImgUrl() {
  // 线上
  var HOST = "http://39.104.48.81:8088/shop_file";
  //  测试服务器  
  //  var HOST = "http://47.94.220.1:8088/shop_file"
  //  var HOST = "http://www.kaidianapp.net/shop_file";//测试

  // 测试
  //var HOST = "http://localhost:8080/shop_file";
  return HOST;
}

function getImageUrl() {
  var HOST = "http://39.104.48.81:8088/shop_file";
  //  var HOST = "https://www.kaidianapp.com/shop_file" //线上
  //  var HOST = "http://www.kaidianapp.net/shop_file";//测试
  //var HOST = "http://47.94.220.1:8088/shop_file";
  return HOST;
}

function checkLogin() {
  try {
    var value = uni.getStorageSync('islogin')
    //console.info(value);
    if (value) {
      return true;
    }
  } catch (e) {
		
	}
  return false;
}

function gettoken() {
  var token = uni.getStorageSync('token');
  return token;
}
module.exports = {
  getWabsocketUrl: getWabsocketUrl,
  getUrl: getUrl,
  getImageUrl: getImageUrl,
  getUpImgUrl: getUpImgUrl,
  checkLogin: checkLogin,
  gettoken: gettoken,
  getQrCodeUrl: getQrCodeUrl
}