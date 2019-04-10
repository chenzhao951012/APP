
      !(function(){
        var uniAppViewReadyCallback = function(){
          setCssToHead([".",[1],"content,.",[1],"title{text-align:center}\n.",[1],"title{font-size:",[0,30],";color:#8f8f94}\n",],undefined,{path:"./pages/publish/publish.wxss"})();
document.dispatchEvent(new CustomEvent("generateFuncReady", { detail: { generateFunc: $gwx('./pages/publish/publish.wxml') } }));
        }
        if(window.__uniAppViewReady__){
          uniAppViewReadyCallback()
        }else{
          document.addEventListener('uniAppViewReady',uniAppViewReadyCallback)
        }
      })();
      