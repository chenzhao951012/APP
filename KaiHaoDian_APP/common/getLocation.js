var shoppublic = require('./shoppublic.js');
var city_new = require('./city.js');
var cityData_new = city_new.data.RECORDS;
// 所有的 省市区 集合
var result_province = cityData_new.filter(
  function(value) {
    return (value.level_type == 1);
  }
);
var result_city = cityData_new.filter(
  function(value) {
    return (value.level_type == 2);
  }
);
var result_county = cityData_new.filter(
  function(value) {
    return (value.level_type == 3);
  }
);
var province_s = result_province
// 获取地理位置
function getLocation(callBack) {
  uni.getLocation({
    type: 'wgs84',
    success: function(res) {
	
      var longitude = res.longitude
      var latitude = res.latitude
      loadCity(longitude, latitude, callBack);
    },
    fail: function(res) {},
  })
}
// 调用百度接口传入坐标匹配位置
function loadCity(longitude, latitude, callBack) {
  uni.request({
    url: 'https://api.map.baidu.com/geocoder/v2/',
    method: "POST",
    data: {
      // ak: "nnhr8y9ed1BXm5G86mWqdYTz3B8Y1LWY",
      ak: "zX2qpFkgYQrN94OvxNS4na3YlusGDGXd",
      location: latitude + "," + longitude,
      output: 'json'
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
		
      var result_P = result_province.filter( //过滤省
        function(value) {
          return (value.name == res.data.result.addressComponent.province);
        }
      );
      var result_C = result_city.filter( //过滤市
        function(value) {
          return (value.name == res.data.result.addressComponent.city);
        }
      )
			console.log('省',JSON.stringify(result_P));
			console.log('市',JSON.stringify(result_C));
      callBack(result_P,result_C);
    },
    fail: function(res) {},
  })
}
// 各地区访问记录
// function geVisitRecord(city_id) {
//   wx.request({
//     url: shoppublic.getUrl() + '/ReadNum/updateReadNumByCityId',
//     data: {
//       city_id: city_id //市id
//     },
//     success: resT => {
//       console.log('访问次数+1');
//     }
//   })
// }
// 加载地理位置
// function onloadLocation() {
//   if (appLocation.province_id == '' || appLocation.province_name == '' || appLocation.city_id || appLocation.city_name == '') {
//     getLocation(function() {
//       geVisitRecord(appLocation.city_id);
//     });
//   } else {
//     geVisitRecord(appLocation.city_id);
//   }
// }
// 

module.exports = {
  getLocation: getLocation
  // geVisitRecord: geVisitRecord
  // onloadLocation: onloadLocation
}