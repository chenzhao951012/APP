
      !(function(){
        var uniAppViewReadyCallback = function(){
          setCssToHead(["@charset \x22UTF-8\x22;\n.",[1],"status_bar { height: var(--status-bar-height); width: 100%; }\n.",[1],"top_view { height: var(--status-bar-height); width: 100%; position: fixed; top: 0; }\n.",[1],"content { width: ",[0,750],"; }\n.",[1],"topMask .",[1],"_top .",[1],"_swiper_item .",[1],"_scroll .",[1],"_scroll_cell.",[1],"active { position: relative; color: #fed17c; }\n.",[1],"_scroll .",[1],"iconfont { font-size: ",[0,32],"; color: transparent; float: right; font-weight: 600; }\n.",[1],"topMask .",[1],"_top .",[1],"_swiper_item .",[1],"_scroll .",[1],"_scroll_cell .",[1],"iconfont.",[1],"active { color: #fbc237; font-weight: 600; }\n.",[1],"content, body { height: 100%; background: #f6f6f6; }\n.",[1],"top_tab { background: #fff; width: ",[0,750],"; height: ",[0,100],"; -webkit-box-sizing: border-box; box-sizing: border-box; z-index: 99; margin-top: ",[0,20],"; border-radius: ",[0,20]," ",[0,20]," 0 0; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; -webkit-box-shadow: 0 ",[0,2]," ",[0,4]," rgba(155, 155, 155, 0.2); box-shadow: 0 ",[0,2]," ",[0,4]," rgba(155, 155, 155, 0.2); border-bottom: ",[0,2]," solid #eeeeee; }\n.",[1],"top_tab .",[1],"_tab { display: inline-block; position: relative; width: 20%; text-align: center; }\n.",[1],"top_tab .",[1],"_tab \x3e wx-view:first-child { font-size: ",[0,30],"; color: #333; line-height: ",[0,100],"; }\n.",[1],"topMask { width: ",[0,750],"; height: calc(100% - ",[0,88],"); position: fixed; top: ",[0,100],"; left: 0; z-index: 98; }\n.",[1],"topMask .",[1],"_top { height: ",[0,500],"; background: #fff; }\n.",[1],"topMask .",[1],"_top .",[1],"_swiper, .",[1],"topMask .",[1],"_top .",[1],"_swiper_item, .",[1],"topMask .",[1],"_top .",[1],"_scroll { height: ",[0,500],"; }\n.",[1],"topMask .",[1],"_top .",[1],"_swiper_item { overflow: hidden; }\n.",[1],"topMask .",[1],"_top .",[1],"_swiper_item .",[1],"_scroll { padding: 0 ",[0,30],"; -webkit-box-sizing: border-box; box-sizing: border-box; }\n.",[1],"topMask .",[1],"_top .",[1],"_swiper_item .",[1],"_scroll .",[1],"_scroll_cell { -webkit-box-sizing: border-box; box-sizing: border-box; line-height: ",[0,80],"; font-size: ",[0,28],"; color: #000; font-weight: 600; border-bottom: ",[0,2]," solid #e5e5e5; }\n.",[1],"topMask .",[1],"_mask { width: ",[0,750],"; height: calc(100% - ",[0,500],"); background: rgba(35, 35, 35, 0.5); }\n.",[1],"_release_button_right { width: ",[0,90],"; height: ",[0,90],"; line-height: ",[0,90],"; background: #3285ff; border-radius: 50%; color: #fff; font-size: ",[0,28],"; text-align: center; position: fixed; bottom: ",[0,114],"; right: ",[0,30],"; z-index: 66; }\n.",[1],"totop:after { width: 0; height: 0; content: \x27\x27; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 5px solid #000; position: relative; top: ",[0,-26],"; left: ",[0,10],"; }\n.",[1],"tobott:after { width: 0px; height: 0px; content: \x27\x27; border-top: ",[0,10]," solid #000; border-left: ",[0,10]," solid transparent; border-bottom: ",[0,0]," solid transparent; border-right: ",[0,10]," solid transparent; position: relative; top: ",[0,24],"; left: ",[0,10],"; }\n.",[1],"transfer { background-color: #fff; }\n.",[1],"transfer .",[1],"transfer_list { -webkit-box-sizing: border-box; box-sizing: border-box; padding: ",[0,0]," ",[0,30],"; position: relative; border-bottom: ",[0,20]," solid #f3f3f3; padding-bottom: 0; }\n.",[1],"transfer .",[1],"title { font-weight: 600; font-size: ",[0,28],"; width: 100%; color: #000; }\n.",[1],"transfer .",[1],"transferInfo { width: 100%; height: ",[0,400],"; -webkit-box-sizing: border-box; box-sizing: border-box; padding: ",[0,30]," 0; }\n.",[1],"transfer .",[1],"transferInfo .",[1],"_img { width: 100%; height: 100%; border-radius: ",[0,20],"; }\n.",[1],"transferConnent { width: 100%; height: 100%; border: ",[0,2]," solid #eeeeee; border-radius: ",[0,20],"; padding: ",[0,40]," ",[0,0],"; padding-left: ",[0,30],"; -webkit-box-sizing: border-box; box-sizing: border-box; }\n.",[1],"MassageBox { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-pack: justify; -webkit-justify-content: space-between; -ms-flex-pack: justify; justify-content: space-between; }\n.",[1],"MassageBox .",[1],"massageImg { position: relative; }\n.",[1],"MassageBox .",[1],"massageImg .",[1],"_img { height: ",[0,224],"; width: ",[0,300],"; border-radius: ",[0,20],"; }\n.",[1],"MassageBox .",[1],"massageImg .",[1],"type { width: ",[0,46],"; position: absolute; white-space: wrap; font-size: ",[0,24],"; color: #333333; background-color: #f3f3f3; top: 0; right: 0; text-align: center; padding: ",[0,20]," 0; border-radius: 0 0 ",[0,20]," ",[0,20],"; }\n.",[1],"MassageBox .",[1],"title { margin-bottom: ",[0,100],"; font-size: ",[0,28],"; color: #333333; width: 95%; overflow: hidden; -o-text-overflow: ellipsis; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }\n.",[1],"MassageBox .",[1],"area { font-size: ",[0,24],"; font-weight: 600; color: #676767; }\n.",[1],"MassageBox .",[1],"area wx-text { padding-right: ",[0,10],"; }\n.",[1],"MassageBox .",[1],"area wx-text wx-text { padding-left: ",[0,10],"; color: #333333; }\n.",[1],"address { font-size: ",[0,24],"; }\n.",[1],"address wx-text { font-weight: 100; color: #9d9d9d; }\n.",[1],"address wx-text wx-text { color: #333333; font-weight: 600; padding-left: ",[0,12],"; letter-spacing: ",[0,5],"; }\n",],undefined,{path:"./pages/homePageModule/newStoreRental/newStoreRental.wxss"})();
document.dispatchEvent(new CustomEvent("generateFuncReady", { detail: { generateFunc: $gwx('./pages/homePageModule/newStoreRental/newStoreRental.wxml') } }));
        }
        if(window.__uniAppViewReady__){
          uniAppViewReadyCallback()
        }else{
          document.addEventListener('uniAppViewReady',uniAppViewReadyCallback)
        }
      })();
      