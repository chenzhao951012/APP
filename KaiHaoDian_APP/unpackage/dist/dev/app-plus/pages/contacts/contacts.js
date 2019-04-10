
      !(function(){
        var uniAppViewReadyCallback = function(){
          setCssToHead(["@charset \x22UTF-8\x22;\n.",[1],"status_bar { height: var(--status-bar-height); width: 100%; }\n.",[1],"top_view { height: var(--status-bar-height); width: 100%; position: fixed; top: 0; }\n.",[1],"content { width: ",[0,750],"; }\n.",[1],"content { text-align: center; padding-bottom: ",[0,100],"; }\n.",[1],"title { font-size: ",[0,30],"; color: #8F8F94; text-align: center; }\n",],undefined,{path:"./pages/contacts/contacts.wxss"})();
document.dispatchEvent(new CustomEvent("generateFuncReady", { detail: { generateFunc: $gwx('./pages/contacts/contacts.wxml') } }));
        }
        if(window.__uniAppViewReady__){
          uniAppViewReadyCallback()
        }else{
          document.addEventListener('uniAppViewReady',uniAppViewReadyCallback)
        }
      })();
      