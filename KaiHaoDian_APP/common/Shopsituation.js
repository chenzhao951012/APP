function allGoodsFilte(){
	var allGoodsFilte=[
						{ value: '0', name: "货梯", url: "/images/sp/huoti_hui.png", url1: "/images/sp/huoti_lan.png", url2: "/images/sp/huoti_hei.png", checked: false, title: "ht" },
						{ value: '1', name: "客梯", url: "/images/sp/keti_hui.png", url1: "/images/sp/keti_lan.png", url2: "/images/sp/keti_hei.png", checked: false, title: "kt" },
						{ value: '2', name: "扶梯", url: "/images/sp/futi_hui.png", url1: "/images/sp/futi_lan.png", url2: "/images/sp/futi_hei.png", checked: false, title: "ft" },
						{ value: '3', name: "空调", url: "/images/sp/kongtiao_hui.png", url1: "/images/sp/kongtiao_lan.png", url2: "/images/sp/kongtiao_hei.png", checked: false, title: "kongt" },
					  { value: '4', name: "停车", url: "/images/sp/tingche_hui.png", url1: "/images/sp/tingche_lan.png", url2: "/images/sp/tingche_hei.png", checked: false, title: "tcw" },
					  { value: '5', name: "网络", url: "/images/sp/wangluo_hui.png", url1: "/images/sp/wangluo_lan.png", url2: "/images/sp/wangluo_hei.png", checked: false, title: "wl" },
					  { value: '6', name: "天然气", url: "/images/sp/tianranqi_hui.png", url1: "/images/sp/tianranqi_lan.png", url2: "/images/sp/tianranqi_hei.png", checked: false, title: "trq" },
					  { value: '7', name: "暖气", url: "/images/sp/nuanqi_hui.png", url1: "/images/sp/nuanqi_lan.png", url2: "/images/sp/nuanqi_hei.png", checked: false, title: "nq" },
					  { value: '8', name: "上水", url: "/images/sp/shangshui_hui.png", url1: "/images/sp/shangshui_lan.png", url2: "/images/sp/shangshui_hei.png", checked: false, title: "ss" },
					  { value: '9', name: "下水", url: "/images/sp/xiashui_hui.png", url1: "/images/sp/xiashui_lan.png", url2: "/images/sp/xiashui_hei.png", checked: false, title: "xs" },
					  { value: '10', name: "排污", url: "/images/sp/paiwu_hui.png", url1: "/images/sp/paiwu_lan.png", url2: "/images/sp/paiwu_hei.png", checked: false, title: "pw" },
					  { value: '11', name: "排烟", url: "/images/sp/paiyan_hui.png", url1: "/images/sp/paiyan_lan.png", url2: "/images/sp/paiyan_hei.png", checked: false, title: "pf" },
					  { value: '12', name: "380V", url: "/images/sp/380v_hui.png", url1: "/images/sp/380v_lan.png", url2: "/images/sp/380v_hei.png", checked: false, title: "380v" },
					  { value: '13', name: "餐煤", url: "/images/sp/canmei_hui.png", url1: "/images/sp/canmei_lan.png", url2: "/images/sp/canmei_hei.png", checked: false, title: "cm" },
					  { value: '14', name: "可明火", url: "/images/sp/keminghuo_hui.png", url1: "/images/sp/keminghuo_lan.png", url2: "/images/sp/keminghuo_hei.png", checked: false, title: "kmh" },
					  { value: '15', name: "外摆区", url: "/images/sp/waibaiqu_hui.png", url1: "/images/sp/waibaiqu_lan.png", url2: "/images/sp/waibaiqu_hei.png", checked: false, title: "wbq" }
					
					]
					
					return allGoodsFilte;
}

function zhouBian(){
	var zhouBian=[
	      { value: '0', name: "学校", url: "/images/zb/xuexiao_hui.png", url1: "/images/zb/xuexiao_lan.png", url2: "/images/zb/xuexiao_hei.png", checked: false, title: 'xx' },
	      { value: '1', name: "小区", url: "/images/zb/xiaoqu_hui.png", url1: "/images/zb/xiaoqu_lan.png", url2: "/images/zb/xiaoqu_hei.png", checked: false, title: 'xiaoq' },
	      { value: '2', name: "医院", url: "/images/zb/yiyuan_hui.png", url1: "/images/zb/yiyuan_lan.png", url2: "/images/zb/yiyuan_hei.png", checked: false, title: 'yiy' },
	      { value: '3', name: "商场", url: "/images/zb/shangchang_hui.png", url1: "/images/zb/shangchang_lan.png", url2: "/images/zb/shangchang_hei.png", checked: false, title: 'sc' },
	      { value: '4', name: "超市", url: "/images/zb/chaoshi_hui.png", url1: "/images/zb/chaoshi_lan.png", url2: "/images/zb/chaoshi_hei.png", checked: false, title: 'cs' },
	      { value: '5', name: "美食城", url: "/images/zb/meishicheng_hui.png", url1: "/images/zb/meishicheng_lan.png", url2: "/images/zb/meishicheng_hei.png", checked: false, title: 'msc' },
	      { value: '6', name: "健身房", url: "/images/zb/jianshenfang_hui.png", url1: "/images/zb/jianshenfang_lan.png", url2: "/images/zb/jianshenfang_hei.png", checked: false, title: 'jsf' },
	      { value: '7', name: "公交", url: "/images/zb/gongjiao_hui.png", url1: "/images/zb/gongjiao_lan.png", url2: "/images/zb/gongjiao_hei.png", checked: false, title: 'gj' },
	      { value: '8', name: "地铁", url: "/images/zb/ditie_hui.png", url1: "/images/zb/ditie_lan.png", url2: "/images/zb/ditie_hei.png", checked: false, title: 'dt' }
	    ]
		return zhouBian
}
module.exports={
		allGoodsFilte:allGoodsFilte,
		zhouBian:zhouBian
	}