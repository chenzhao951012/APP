
      !(function(){
        var uniAppViewReadyCallback = function(){
          setCssToHead(["@charset \x22UTF-8\x22;\n.",[1],"status_bar { height: var(--status-bar-height); width: 100%; }\n.",[1],"top_view { height: var(--status-bar-height); width: 100%; position: fixed; top: 0; }\n.",[1],"content { width: ",[0,750],"; }\n.",[1],"topMask .",[1],"_top .",[1],"_swiper_item .",[1],"_scroll .",[1],"_scroll_cell.",[1],"active { position: relative; color: #fed17c; }\n.",[1],"_scroll .",[1],"iconfont { font-size: ",[0,32],"; color: transparent; float: right; font-weight: 600; }\n.",[1],"topMask .",[1],"_top .",[1],"_swiper_item .",[1],"_scroll .",[1],"_scroll_cell .",[1],"iconfont.",[1],"active { color: #fbc237; font-weight: 600; }\n.",[1],"content, body { height: 100%; background: #f6f6f6; }\n.",[1],"top_tab { background: #fff; width: ",[0,750],"; height: ",[0,100],"; -webkit-box-sizing: border-box; box-sizing: border-box; padding: 0 ",[0,30],"; margin-top: ",[0,20],"; z-index: 99; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-pack: justify; -webkit-justify-content: space-between; -ms-flex-pack: justify; justify-content: space-between; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; -webkit-box-shadow: 0 ",[0,2]," ",[0,4]," rgba(155, 155, 155, 0.2); box-shadow: 0 ",[0,2]," ",[0,4]," rgba(155, 155, 155, 0.2); border-radius: ",[0,20]," ",[0,20]," 0 0; border-bottom: ",[0,2]," solid #eeeeee; }\n.",[1],"top_tab .",[1],"_tab { text-align: center; }\n.",[1],"top_tab .",[1],"_tab \x3e wx-view:first-child { font-size: ",[0,30],"; color: #333; line-height: ",[0,60],"; letter-spacing: ",[0,4],"; }\n.",[1],"topMask { width: ",[0,750],"; height: calc(100% - ",[0,88],"); position: fixed; top: ",[0,110],"; left: 0; z-index: 98; }\n.",[1],"topMask .",[1],"_top { margin-top: ",[0,88],"; width: ",[0,750],"; height: ",[0,500],"; background: #fff; }\n.",[1],"topMask .",[1],"_top .",[1],"_swiper, .",[1],"topMask .",[1],"_top .",[1],"_swiper_item, .",[1],"topMask .",[1],"_top .",[1],"_scroll { height: ",[0,500],"; }\n.",[1],"topMask .",[1],"_top .",[1],"_swiper_item { overflow: hidden; }\n.",[1],"topMask .",[1],"_top .",[1],"_swiper_item .",[1],"_scroll { padding: 0 ",[0,30],"; -webkit-box-sizing: border-box; box-sizing: border-box; }\n.",[1],"topMask .",[1],"_top .",[1],"_swiper_item .",[1],"_scroll .",[1],"_scroll_cell { border-bottom: 1px solid #eeeeee; -webkit-box-sizing: border-box; box-sizing: border-box; line-height: ",[0,80],"; font-size: ",[0,28],"; color: #666; }\n.",[1],"topMask .",[1],"_mask { width: ",[0,750],"; height: calc(100% - ",[0,500],"); background: rgba(35, 35, 35, 0.5); }\n.",[1],"partner_List { width: ",[0,750],"; padding: ",[0,80]," ",[0,30]," ",[0,30],"; -webkit-box-sizing: border-box; box-sizing: border-box; }\n.",[1],"partner_List .",[1],"_cell { width: ",[0,690],"; margin: ",[0,30]," auto 0; background: #fff; border-radius: ",[0,16],"; -webkit-box-shadow: 0 0 ",[0,20]," rgba(35, 35, 35, 0.1); box-shadow: 0 0 ",[0,20]," rgba(35, 35, 35, 0.1); }\n.",[1],"partner_List .",[1],"_cell .",[1],"_top, .",[1],"partner_List .",[1],"_cell .",[1],"_top \x3e wx-image { width: ",[0,690],"; height: ",[0,290],"; font-size: 0; border-radius: ",[0,16]," ",[0,16]," 0 0; background: lightsteelblue; }\n.",[1],"partner_List .",[1],"_cell .",[1],"_bottom .",[1],"_title { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-pack: justify; -webkit-justify-content: space-between; -ms-flex-pack: justify; justify-content: space-between; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; }\n.",[1],"partner_List .",[1],"_cell .",[1],"_bottom .",[1],"_title .",[1],"_title_left { -webkit-box-sizing: border-box; box-sizing: border-box; max-width: ",[0,550],"; overflow: hidden; -o-text-overflow: ellipsis; text-overflow: ellipsis; white-space: nowrap; font-size: ",[0,30],"; color: #333; line-height: ",[0,50],"; padding-left: ",[0,20],"; }\n.",[1],"partner_List .",[1],"_cell .",[1],"_bottom .",[1],"_title .",[1],"_title_right { width: ",[0,130],"; line-height: ",[0,50],"; color: #666; font-size: ",[0,24],"; text-align: right; overflow: hidden; -o-text-overflow: ellipsis; text-overflow: ellipsis; white-space: nowrap; }\n.",[1],"partner_List .",[1],"_cell .",[1],"_bottom .",[1],"_partner_class { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-pack: justify; -webkit-justify-content: space-between; -ms-flex-pack: justify; justify-content: space-between; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; }\n.",[1],"partner_List .",[1],"_cell .",[1],"_bottom .",[1],"_partner_class .",[1],"_class_left { width: ",[0,500],"; -webkit-box-sizing: border-box; box-sizing: border-box; padding-left: ",[0,20],"; }\n.",[1],"partner_List .",[1],"_cell .",[1],"_bottom .",[1],"_partner_class .",[1],"_class_left \x3e wx-text { display: inline-block; vertical-align: middle; line-height: ",[0,50],"; font-size: ",[0,28],"; color: #333; }\n.",[1],"partner_List .",[1],"_cell .",[1],"_bottom .",[1],"_partner_class .",[1],"_class_left \x3e wx-text:first-child { color: #FF8100; }\n.",[1],"partner_List .",[1],"_cell .",[1],"_bottom .",[1],"_partner_class .",[1],"_class_right { width: ",[0,190],"; color: #666; text-align: right; font-size: ",[0,26],"; line-height: ",[0,50],"; }\n.",[1],"_release_button_right { width: ",[0,90],"; height: ",[0,90],"; line-height: ",[0,90],"; background: #3285ff; border-radius: 50%; color: #fff; font-size: ",[0,26],"; text-align: center; position: fixed; bottom: ",[0,114],"; right: ",[0,30],"; z-index: 66; }\n.",[1],"totop:after { width: 0; height: 0; content: \x27\x27; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 5px solid black; position: relative; top: ",[0,-26],"; left: ",[0,10],"; }\n.",[1],"tobott:after { width: 0px; height: 0px; content: \x27\x27; border-top: ",[0,10]," solid black; border-left: ",[0,10]," solid transparent; border-bottom: ",[0,0]," solid transparent; border-right: ",[0,10]," solid transparent; position: relative; top: ",[0,24],"; left: ",[0,10],"; }\n.",[1],"cellParent { background-color: #fff; padding: 0 ",[0,15],"; width: 100%; -webkit-box-sizing: border-box; box-sizing: border-box; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-pack: justify; -webkit-justify-content: space-between; -ms-flex-pack: justify; justify-content: space-between; -webkit-flex-wrap: wrap; -ms-flex-wrap: wrap; flex-wrap: wrap; }\n.",[1],"cell { width: ",[0,354],"; padding: ",[0,14],"; -webkit-box-sizing: border-box; box-sizing: border-box; background: #fff; border-radius: ",[0,8],"; margin-top: ",[0,30],"; padding-bottom: 0; }\n.",[1],"cellTop, .",[1],"cellTop wx-image { width: ",[0,325],"; height: ",[0,400],"; font-size: 0; border-radius: ",[0,20]," ",[0,20]," 0 0; }\n.",[1],"cellTitle { height: ",[0,90],"; line-height: ",[0,50],"; font-size: ",[0,25],"; color: #333; word-break: break-all; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; padding: 0 ",[0,20],"; box-sizing: border-box; }\n.",[1],"cellPrice { height: ",[0,36],"; line-height: ",[0,36],"; font-size: ",[0,28],"; color: #ffbd38; font-weight: bold; }\n.",[1],"cellPrice wx-text { font-weight: normal; font-size: ",[0,24],"; }\n.",[1],"cellLineCss { width: ",[0,320],"; height: ",[0,2],"; background: #eee; margin: ",[0,8]," 0; }\n.",[1],"cellUserInfo { width: 100%; padding: 0 ",[0,20],"; -webkit-box-sizing: border-box; box-sizing: border-box; }\n.",[1],"cellUserInfoL, .",[1],"cellUserInfoR { display: inline-block; vertical-align: middle; }\n.",[1],"cellUserInfoL { margin-right: ",[0,4],"; }\n.",[1],"cellUserInfoL, .",[1],"cellUserInfoL wx-image { width: ",[0,48],"; height: ",[0,48],"; border-radius: 50%; font-size: 0; }\n.",[1],"cellUserInfoR, .",[1],"cellUserInfoR-name, .",[1],"cellUserInfo-locationOrTime { width: 100%; }\n.",[1],"cellUserInfoR-name { color: #666; font-size: ",[0,24],"; height: ",[0,32],"; line-height: ",[0,32],"; }\n.",[1],"cellUserInfo-locationOrTime { color: #999; padding: 0; }\n.",[1],"cellUserInfo-location, .",[1],"cellUserInfo-Time { display: inline-block; vertical-align: middle; }\n.",[1],"cellUserInfo-location { margin: ",[0,20]," 0; font-size: ",[0,24],"; }\n.",[1],"cellUserInfo-location wx-text { color: #ffbd38; padding: ",[0,5]," ",[0,20],"; border: ",[0,2]," solid #f1f1f1; border-radius: ",[0,50],"; }\n.",[1],"cellUserInfo-location wx-text { display: inline-block; vertical-align: middle; }\n.",[1],"cellUserInfo-locationLineCss { width: ",[0,4],"; height: ",[0,12],"; margin: 0 ",[0,4],"; background: #eeeeee; }\n.",[1],"cellUserInfo-Time { font-weight: 600; color: #686868; text-align: right; font-size: ",[0,24],"; }\n.",[1],"MassageBox { border: ",[0,2]," solid #eeeeee; width: ",[0,324],"; -webkit-box-sizing: border-box; box-sizing: border-box; border-top: 0; }\n.",[1],"MassageBox .",[1],"userBoxS { margin-top: ",[0,20],"; width: 100%; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-pack: justify; -webkit-justify-content: space-between; -ms-flex-pack: justify; justify-content: space-between; }\n.",[1],"MassageBox .",[1],"iconfonts { padding-right: ",[0,10],"; font-style: ",[0,28],"; font-weight: 600; color: #686868; }\n.",[1],"MassageBox .",[1],"Price { color: #676767; padding-right: ",[0,10],"; font-weight: 600; }\n",],undefined,{path:"./pages/homePageModule/oldStoreTwoHand/oldStoreTwoHand.wxss"})();
document.dispatchEvent(new CustomEvent("generateFuncReady", { detail: { generateFunc: $gwx('./pages/homePageModule/oldStoreTwoHand/oldStoreTwoHand.wxml') } }));
        }
        if(window.__uniAppViewReady__){
          uniAppViewReadyCallback()
        }else{
          document.addEventListener('uniAppViewReady',uniAppViewReadyCallback)
        }
      })();
      