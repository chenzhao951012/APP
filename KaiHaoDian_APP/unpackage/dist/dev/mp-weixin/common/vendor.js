(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ "./node_modules/@dcloudio/uni-mp-weixin/dist/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const _toString = Object.prototype.toString;
const hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn (fn) {
  return typeof fn === 'function'
}

function isStr (str) {
  return typeof str === 'string'
}

function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

const SYNC_API_RE = /hideKeyboard|upx2px|canIUse|^create|Sync$|Manager$/;

const CONTEXT_API_RE = /^create|Manager$/;

const CALLBACK_API_RE = /^on/;

function isContextApi (name) {
  return CONTEXT_API_RE.test(name)
}
function isSyncApi (name) {
  return SYNC_API_RE.test(name)
}

function isCallbackApi (name) {
  return CALLBACK_API_RE.test(name)
}

function handlePromise (promise) {
  return promise.then(data => {
    return [null, data]
  })
    .catch(err => [err])
}

function shouldPromise (name) {
  if (isSyncApi(name)) {
    return false
  }
  if (isCallbackApi(name)) {
    return false
  }
  return true
}

function promisify (name, api) {
  if (!shouldPromise(name)) {
    return api
  }
  return function promiseApi (options = {}, ...params) {
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return api(options, ...params)
    }
    return handlePromise(new Promise((resolve, reject) => {
      api(Object.assign({}, options, {
        success: resolve,
        fail: reject
      }), ...params);
      /* eslint-disable no-extend-native */
      Promise.prototype.finally = function (callback) {
        const promise = this.constructor;
        return this.then(
          value => promise.resolve(callback()).then(() => value),
          reason => promise.resolve(callback()).then(() => {
            throw reason
          })
        )
      };
    }))
  }
}

const EPS = 1e-4;
const BASE_DEVICE_WIDTH = 750;
let isIOS = false;
let deviceWidth = 0;
let deviceDPR = 0;

function checkDeviceWidth () {
  const {
    platform,
    pixelRatio,
    windowWidth
  } = wx.getSystemInfoSync(); // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px (number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0
  }
  let result = (number / BASE_DEVICE_WIDTH) * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1
    } else {
      return 0.5
    }
  }
  return number < 0 ? -result : result
}

var protocols = {};

const CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback (methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue))
  }
}

function processArgs (methodName, fromArgs, argsOption = {}, returnValue = {}, keepFromArgs = false) {
  if (isPlainObject(fromArgs)) { // 一般 api 的参数解析
    const toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (let key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        let keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) { // 不支持的参数
          console.warn(`微信小程序 ${methodName}暂不支持${key}`);
        } else if (isStr(keyOption)) { // 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) { // {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.includes(key)) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs
}

function processReturnValue (methodName, res, returnValue, keepReturnValue = false) {
  if (isFn(protocols.returnValue)) { // 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue)
}

function wrapper (methodName, method) {
  if (hasOwn(protocols, methodName)) {
    const protocol = protocols[methodName];
    if (!protocol) { // 暂不支持的 api
      return function () {
        console.error(`微信小程序 暂不支持${methodName}`);
      }
    }
    return function (arg1, arg2) { // 目前 api 最多两个参数
      let options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      const returnValue = wx[options.name || methodName](arg1, arg2);
      if (isSyncApi(methodName)) { // 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName))
      }
      return returnValue
    }
  }
  return method
}

const todoApis = Object.create(null);

const TODOS = [
  'subscribePush',
  'unsubscribePush',
  'onPush',
  'offPush',
  'share'
];

function createTodoApi (name) {
  return function todoApi ({
    fail,
    complete
  }) {
    const res = {
      errMsg: `${name}:fail:暂不支持 ${name} 方法`
    };
    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  }
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin']
};

function getProvider ({
  service,
  success,
  fail,
  complete
}) {
  let res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service,
      provider: providers[service]
    };
    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在'
    };
    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  getProvider: getProvider
});



var api = /*#__PURE__*/Object.freeze({

});

let uni = {};

if (typeof Proxy !== 'undefined') {
  uni = new Proxy({}, {
    get (target, name) {
      if (name === 'upx2px') {
        return upx2px
      }
      if (api[name]) {
        return promisify(name, api[name])
      }
      if (extraApi[name]) {
        return promisify(name, extraApi[name])
      }
      if (todoApis[name]) {
        return promisify(name, todoApis[name])
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return
      }
      return promisify(name, wrapper(name, wx[name]))
    }
  });
} else {
  uni.upx2px = upx2px;

  Object.keys(todoApis).forEach(name => {
    uni[name] = promisify(name, todoApis[name]);
  });

  Object.keys(extraApi).forEach(name => {
    uni[name] = promisify(name, todoApis[name]);
  });

  Object.keys(api).forEach(name => {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(name => {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

var uni$1 = uni;

/* harmony default export */ __webpack_exports__["default"] = (uni$1);


/***/ }),

/***/ "./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue-page-factory/index.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue-page-factory/index.js ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue/index.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);


function callHook$1(vm, hook, params) {
  var handlers = vm.$options[hook];
  if (hook === 'onError' && handlers) {
    handlers = [handlers];
  }
  if(typeof handlers === 'function'){
    handlers = [handlers]
  }

  var ret;
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
//      try {
        ret = handlers[i].call(vm, params);
//       } catch (e) {//fixed by xxxxxx
//         handleError(e, vm, (hook + " hook"));
//       }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }

  // for child
  if (vm.$children.length) {
    vm.$children.forEach(function (v) {
      return callHook$1(v, hook, params);
    });
  }

  return ret
}

function getRootVueVm(page) {
  return page.$vm.$root;
}

/* harmony default export */ __webpack_exports__["default"] = (function (App) {
  return {
    // 页面的初始数据
    data: {
      $root: {}
    },

    // mp lifecycle for vue
    // 生命周期函数--监听页面加载
    onLoad:function onLoad(query) {
      //页面加载的时候
      var app = new vue__WEBPACK_IMPORTED_MODULE_0___default.a(App);
      // 挂载Vue对象到page上
      this.$vm = app;
      var rootVueVM = app.$root;
      rootVueVM.__wxWebviewId__ = this.__wxWebviewId__//fixed by xxxxxx(createIntersectionObserver)
      
      //初始化mp对象
      if (!rootVueVM.$mp) {
        rootVueVM.$mp = {};
      }
      var mp = rootVueVM.$mp;
      mp.mpType = 'page';
      mp.page = this;
      mp.query = query;
      mp.status = 'load';
      //mount 要在 mp.status = 'load';赋值之后，不然mount方法会重复添加微信Page
      //具体原因参考mpvue核心库源码，_initMP方法
      app.$mount();
    },

    handleProxy: function handleProxy(e) {
      var rootVueVM = getRootVueVm(this);
      return rootVueVM.$handleProxyWithVue(e)
    },

    // 生命周期函数--监听页面显示
    onShow:function onShow() {
      var rootVueVM = getRootVueVm(this);
      var mp = rootVueVM.$mp;
      mp.status = 'show';
      callHook$1(rootVueVM, 'onShow');
      //   // 只有页面需要 setData
      rootVueVM.$nextTick(function () {
        rootVueVM._initDataToMP();
      });
    },

    // 生命周期函数--监听页面初次渲染完成
    onReady:function onReady() {
      var rootVueVM = getRootVueVm(this);
      var mp = rootVueVM.$mp;
      mp.status = 'ready';
      callHook$1(rootVueVM, 'onReady');
    },

    // 生命周期函数--监听页面隐藏
    onHide: function onHide() {
      var rootVueVM = getRootVueVm(this);
      var mp = rootVueVM.$mp;
      mp.status = 'hide';
      callHook$1(rootVueVM, 'onHide');
    },

    // 生命周期函数--监听页面卸载
    onUnload: function onUnload() {
      var rootVueVM = getRootVueVm(this);
      callHook$1(rootVueVM, 'onUnload');
      rootVueVM.$destroy();
    },

    // 页面相关事件处理函数--监听用户下拉动作
    onPullDownRefresh: function onPullDownRefresh() {
      var rootVueVM = getRootVueVm(this);
      callHook$1(rootVueVM, 'onPullDownRefresh');
    },

    // 页面上拉触底事件的处理函数
    onReachBottom: function onReachBottom() {
      var rootVueVM = getRootVueVm(this);
      callHook$1(rootVueVM, 'onReachBottom');
    },

    // Do something when page scroll
    onPageScroll: function onPageScroll(options) {
      var rootVueVM = getRootVueVm(this);
      callHook$1(rootVueVM, 'onPageScroll', options);
    },

    // 当前是 tab 页时，点击 tab 时触发
    onTabItemTap: function onTabItemTap(options) {
      var rootVueVM = getRootVueVm(this);
      callHook$1(rootVueVM, 'onTabItemTap', options);
    },
		
    // // 用户点击右上角分享
    onShareAppMessage: App.onShareAppMessage ?
      function (options) {
        var rootVueVM = getRootVueVm(this);
        return callHook$1(rootVueVM, 'onShareAppMessage', options);
      } : null,

    //fixed by xxxxxx
    onNavigationBarButtonTap: function onNavigationBarButtonTap(options) {
        var rootVueVM = getRootVueVm(this);
    		callHook$1(rootVueVM, "onNavigationBarButtonTap", options)
    },
    onNavigationBarSearchInputChanged: function onNavigationBarSearchInputChanged(options) {
        var rootVueVM = getRootVueVm(this);
    		callHook$1(rootVueVM, "onNavigationBarSearchInputChanged", options)
    },
    onNavigationBarSearchInputConfirmed: function onNavigationBarSearchInputConfirmed(options) {
        var rootVueVM = getRootVueVm(this);
    		callHook$1(rootVueVM, "onNavigationBarSearchInputConfirmed", options)
    },
    onNavigationBarSearchInputClicked: function onNavigationBarSearchInputClicked(options) {
        var rootVueVM = getRootVueVm(this);
    		callHook$1(rootVueVM, "onNavigationBarSearchInputClicked", options)
    },
    onBackPress: function onBackPress(options) {
        var rootVueVM = getRootVueVm(this);
    		return callHook$1(rootVueVM, "onBackPress",options)
    },
		$getAppWebview:function (e) {
				return plus.webview.getWebviewById('' + this.__wxWebviewId__)
		}
  };
});


/***/ }),

/***/ "./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue/index.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue/index.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// fix env
try {
    if (!global) global = {}
    global.process = global.process || {}
    global.process.env = global.process.env || {}
    global.App = global.App || App
    global.Page = global.Page || Page
    global.Component = global.Component || Component
    global.getApp = global.getApp || getApp
} catch (e) {}

;(function(global, factory) {
     true
        ? (module.exports = factory())
        : undefined
})(this, function() {
    "use strict"

    //fixed by xxxxxx
    function calcDiff(holder, key, newObj, oldObj) {
        if (newObj === oldObj || newObj === undefined) {
            return
        }

        if (newObj == null || oldObj == null || typeof newObj !== typeof oldObj) {
            holder[key] = newObj
        } else if (Array.isArray(newObj) && Array.isArray(oldObj)) {
            if (newObj.length === oldObj.length) {
                for (var i = 0, len = newObj.length; i < len; ++i) {
                    calcDiff(holder, key + "[" + i + "]", newObj[i], oldObj[i])
                }
            } else {
                holder[key] = newObj
            }
        } else if (typeof newObj === "object" && typeof oldObj === "object") {
            var newKeys = Object.keys(newObj)
            var oldKeys = Object.keys(oldObj)

            if (newKeys.length !== oldKeys.length) {
                holder[key] = newObj
            } else {
                var allKeysSet = Object.create(null)
                for (var i = 0, len = newKeys.length; i < len; ++i) {
                    allKeysSet[newKeys[i]] = true
                    allKeysSet[oldKeys[i]] = true
                }
                if (Object.keys(allKeysSet).length !== newKeys.length) {
                    holder[key] = newObj
                } else {
                    for (var i = 0, len = newKeys.length; i < len; ++i) {
                        var k = newKeys[i]
                        calcDiff(holder, key + "." + k, newObj[k], oldObj[k])
                    }
                }
            }
        } else if (newObj !== oldObj) {
            holder[key] = newObj
        }
    }

    function diff(newObj, oldObj) {
        var keys = Object.keys(newObj)
        var diffResult = {}
        for (var i = 0, len = keys.length; i < len; ++i) {
            var k = keys[i]
            var oldKeyPath = k.split(".")
            var oldValue = oldObj[oldKeyPath[0]]
            for (var j = 1, jlen = oldKeyPath.length; j < jlen && oldValue !== undefined; ++j) {
                oldValue = oldValue[oldKeyPath[j]]
            }
            calcDiff(diffResult, k, newObj[k], oldValue)
        }
        return diffResult
    }

    /*  */

    // these helpers produces better vm code in JS engines due to their
    // explicitness and function inlining
    function isUndef(v) {
        return v === undefined || v === null
    }

    function isDef(v) {
        return v !== undefined && v !== null
    }

    function isTrue(v) {
        return v === true
    }

    function isFalse(v) {
        return v === false
    }

    /**
     * Check if value is primitive
     */
    function isPrimitive(value) {
        return typeof value === "string" || typeof value === "number"
    }

    /**
     * Quick object check - this is primarily used to tell
     * Objects from primitive values when we know the value
     * is a JSON-compliant type.
     */
    function isObject(obj) {
        return obj !== null && typeof obj === "object"
    }

    var _toString = Object.prototype.toString

    /**
     * Strict object type check. Only returns true
     * for plain JavaScript objects.
     */
    function isPlainObject(obj) {
        return _toString.call(obj) === "[object Object]"
    }

    function isRegExp(v) {
        return _toString.call(v) === "[object RegExp]"
    }

    /**
     * Check if val is a valid array index.
     */
    function isValidArrayIndex(val) {
        var n = parseFloat(val)
        return n >= 0 && Math.floor(n) === n && isFinite(val)
    }

    /**
     * Convert a value to a string that is actually rendered.
     */
    function toString(val) {
        return val == null
            ? ""
            : typeof val === "object"
                ? JSON.stringify(val, null, 2)
                : String(val)
    }

    /**
     * Convert a input value to a number for persistence.
     * If the conversion fails, return original string.
     */
    function toNumber(val) {
        var n = parseFloat(val)
        return isNaN(n) ? val : n
    }

    /**
     * Make a map and return a function for checking if a key
     * is in that map.
     */
    function makeMap(str, expectsLowerCase) {
        var map = Object.create(null)
        var list = str.split(",")
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true
        }
        return expectsLowerCase
            ? function(val) {
                  return map[val.toLowerCase()]
              }
            : function(val) {
                  return map[val]
              }
    }

    /**
     * Check if a tag is a built-in tag.
     */
    var isBuiltInTag = makeMap("slot,component", true)

    /**
     * Check if a attribute is a reserved attribute.
     */
    var isReservedAttribute = makeMap("key,ref,slot,is")

    /**
     * Remove an item from an array
     */
    function remove(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item)
            if (index > -1) {
                return arr.splice(index, 1)
            }
        }
    }

    /**
     * Check whether the object has the property.
     */
    var hasOwnProperty = Object.prototype.hasOwnProperty

    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key)
    }

    /**
     * Create a cached version of a pure function.
     */
    function cached(fn) {
        var cache = Object.create(null)
        return function cachedFn(str) {
            var hit = cache[str]
            return hit || (cache[str] = fn(str))
        }
    }

    /**
     * Camelize a hyphen-delimited string.
     */
    var camelizeRE = /-(\w)/g
    var camelize = cached(function(str) {
        return str.replace(camelizeRE, function(_, c) {
            return c ? c.toUpperCase() : ""
        })
    })

    /**
     * Capitalize a string.
     */
    var capitalize = cached(function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    })

    /**
     * Hyphenate a camelCase string.
     */
    var hyphenateRE = /([^-])([A-Z])/g
    var hyphenate = cached(function(str) {
        return str
            .replace(hyphenateRE, "$1-$2")
            .replace(hyphenateRE, "$1-$2")
            .toLowerCase()
    })

    /**
     * Simple bind, faster than native
     */
    function bind(fn, ctx) {
        function boundFn(a) {
            var l = arguments.length
            return l ? (l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a)) : fn.call(ctx)
        }
        // record original fn length
        boundFn._length = fn.length
        return boundFn
    }

    /**
     * Convert an Array-like object to a real Array.
     */
    function toArray(list, start) {
        start = start || 0
        var i = list.length - start
        var ret = new Array(i)
        while (i--) {
            ret[i] = list[i + start]
        }
        return ret
    }

    /**
     * Mix properties into target object.
     */
    function extend(to, _from) {
        for (var key in _from) {
            to[key] = _from[key]
        }
        return to
    }

    /**
     * Merge an Array of Objects into a single Object.
     */
    function toObject(arr) {
        var res = {}
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                extend(res, arr[i])
            }
        }
        return res
    }

    /**
     * Perform no operation.
     * Stubbing args to make Flow happy without leaving useless transpiled code
     * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
     */
    function noop(a, b, c) {}

    /**
     * Always return false.
     */
    var no = function(a, b, c) {
        return false
    }

    /**
     * Return same value
     */
    var identity = function(_) {
        return _
    }

    /**
     * Generate a static keys string from compiler modules.
     */

    /**
     * Check if two values are loosely equal - that is,
     * if they are plain objects, do they have the same shape?
     */
    function looseEqual(a, b) {
        var isObjectA = isObject(a)
        var isObjectB = isObject(b)
        if (isObjectA && isObjectB) {
            try {
                return JSON.stringify(a) === JSON.stringify(b)
            } catch (e) {
                // possible circular reference
                return a === b
            }
        } else if (!isObjectA && !isObjectB) {
            return String(a) === String(b)
        } else {
            return false
        }
    }

    function looseIndexOf(arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (looseEqual(arr[i], val)) {
                return i
            }
        }
        return -1
    }

    /**
     * Ensure a function is called only once.
     */
    function once(fn) {
        var called = false
        return function() {
            if (!called) {
                called = true
                fn.apply(this, arguments)
            }
        }
    }

    var SSR_ATTR = "data-server-rendered"

    var ASSET_TYPES = ["component", "directive", "filter"]

    var LIFECYCLE_HOOKS = [
        "beforeCreate",
        "created",
        "beforeMount",
        "mounted",
        "beforeUpdate",
        "updated",
        "beforeDestroy",
        "destroyed",
        "activated",
        "deactivated",
        "onLaunch",
        "onLoad",
        "onShow",
        "onReady",
        "onHide",
        "onUnload",
        "onPullDownRefresh",
        "onReachBottom",
        "onShareAppMessage",
        "onPageScroll",
        "onTabItemTap",
        "attached",
        "ready",
        "moved",
        "detached",
        "onUniNViewMessage", //fixed by xxxxxx
        "onNavigationBarButtonTap", //fixed by xxxxxx
        "onBackPress",//fixed by xxxxxx
    ]

    /*  */

    var config = {
        /**
         * Option merge strategies (used in core/util/options)
         */
        optionMergeStrategies: Object.create(null),

        /**
         * Whether to suppress warnings.
         */
        silent: false,

        /**
         * Show production mode tip message on boot?
         */
        productionTip: "production" !== "production",

        /**
         * Whether to enable devtools
         */
        devtools: "production" !== "production",

        /**
         * Whether to record perf
         */
        performance: false,

        /**
         * Error handler for watcher errors
         */
        errorHandler: null,

        /**
         * Warn handler for watcher warns
         */
        warnHandler: null,

        /**
         * Ignore certain custom elements
         */
        ignoredElements: [],

        /**
         * Custom user key aliases for v-on
         */
        keyCodes: Object.create(null),

        /**
         * Check if a tag is reserved so that it cannot be registered as a
         * component. This is platform-dependent and may be overwritten.
         */
        isReservedTag: no,

        /**
         * Check if an attribute is reserved so that it cannot be used as a component
         * prop. This is platform-dependent and may be overwritten.
         */
        isReservedAttr: no,

        /**
         * Check if a tag is an unknown element.
         * Platform-dependent.
         */
        isUnknownElement: no,

        /**
         * Get the namespace of an element
         */
        getTagNamespace: noop,

        /**
         * Parse the real tag name for the specific platform.
         */
        parsePlatformTagName: identity,

        /**
         * Check if an attribute must be bound using property, e.g. value
         * Platform-dependent.
         */
        mustUseProp: no,

        /**
         * Exposed for legacy reasons
         */
        _lifecycleHooks: LIFECYCLE_HOOKS
    }

    /*  */

    var emptyObject = Object.freeze({})

    /**
     * Check if a string starts with $ or _
     */
    function isReserved(str) {
        var c = (str + "").charCodeAt(0)
        return c === 0x24 || c === 0x5f
    }

    /**
     * Define a property.
     */
    function def(obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        })
    }

    /**
     * Parse simple path.
     */
    var bailRE = /[^\w.$]/

    function parsePath(path) {
        if (bailRE.test(path)) {
            return
        }
        var segments = path.split(".")
        return function(obj) {
            for (var i = 0; i < segments.length; i++) {
                if (!obj) {
                    return
                }
                obj = obj[segments[i]]
            }
            return obj
        }
    }

    /*  */

    var warn = noop

    var formatComponentName = null // work around flow check

    /*  */

    function handleError(err, vm, info) {
        if (config.errorHandler) {
            config.errorHandler.call(null, err, vm, info)
        } else {
            if (inBrowser && typeof console !== "undefined") {
                console.error(err)
            } else {
                throw err
            }
        }
    }

    /*  */

    // can we use __proto__?
    var hasProto = "__proto__" in {}

    // Browser environment sniffing
    var inBrowser = typeof window !== "undefined"
    var UA = ["mpvue-runtime"].join()
    var isIE = UA && /msie|trident/.test(UA)
    var isIE9 = UA && UA.indexOf("msie 9.0") > 0
    var isEdge = UA && UA.indexOf("edge/") > 0
    var isAndroid = UA && UA.indexOf("android") > 0
    var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)
    var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge

    // Firefix has a "watch" function on Object.prototype...
    var nativeWatch = {}.watch

    var supportsPassive = false
    if (inBrowser) {
        try {
            var opts = {}
            Object.defineProperty(opts, "passive", {
                get: function get() {
                    /* istanbul ignore next */
                    supportsPassive = true
                }
            }) // https://github.com/facebook/flow/issues/285
            window.addEventListener("test-passive", null, opts)
        } catch (e) {}
    }

    // this needs to be lazy-evaled because vue may be required before
    // vue-server-renderer can set VUE_ENV
    var _isServer
    var isServerRendering = function() {
        if (_isServer === undefined) {
            /* istanbul ignore if */
            if (!inBrowser && typeof global !== "undefined") {
                // detect presence of vue-server-renderer and avoid
                // Webpack shimming the process
                _isServer = global["process"].env.VUE_ENV === "server"
            } else {
                _isServer = false
            }
        }
        return _isServer
    }

    // detect devtools
    var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__

    /* istanbul ignore next */
    function isNative(Ctor) {
        return typeof Ctor === "function" && /native code/.test(Ctor.toString())
    }

    var hasSymbol =
        typeof Symbol !== "undefined" &&
        isNative(Symbol) &&
        typeof Reflect !== "undefined" &&
        isNative(Reflect.ownKeys)

    /**
     * Defer a task to execute it asynchronously.
     */
    var nextTick = (function() {
        var callbacks = []
        var pending = false
        var timerFunc

        function nextTickHandler() {
            pending = false
            var copies = callbacks.slice(0)
            callbacks.length = 0
            for (var i = 0; i < copies.length; i++) {
                copies[i]()
            }
        }

        // the nextTick behavior leverages the microtask queue, which can be accessed
        // via either native Promise.then or MutationObserver.
        // MutationObserver has wider support, however it is seriously bugged in
        // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
        // completely stops working after triggering a few times... so, if native
        // Promise is available, we will use it:
        /* istanbul ignore if */
        if (typeof Promise !== "undefined" && isNative(Promise)) {
            var p = Promise.resolve()
            var logError = function(err) {
                console.error(err)
            }
            timerFunc = function() {
                p.then(nextTickHandler).catch(logError)
                // in problematic UIWebViews, Promise.then doesn't completely break, but
                // it can get stuck in a weird state where callbacks are pushed into the
                // microtask queue but the queue isn't being flushed, until the browser
                // needs to do some other work, e.g. handle a timer. Therefore we can
                // "force" the microtask queue to be flushed by adding an empty timer.
                if (isIOS) {
                    setTimeout(noop)
                }
            }
            // } else if (typeof MutationObserver !== 'undefined' && (
            //   isNative(MutationObserver) ||
            //   // PhantomJS and iOS 7.x
            //   MutationObserver.toString() === '[object MutationObserverConstructor]'
            // )) {
            //   // use MutationObserver where native Promise is not available,
            //   // e.g. PhantomJS IE11, iOS7, Android 4.4
            //   var counter = 1
            //   var observer = new MutationObserver(nextTickHandler)
            //   var textNode = document.createTextNode(String(counter))
            //   observer.observe(textNode, {
            //     characterData: true
            //   })
            //   timerFunc = () => {
            //     counter = (counter + 1) % 2
            //     textNode.data = String(counter)
            //   }
        } else {
            // fallback to setTimeout
            /* istanbul ignore next */
            timerFunc = function() {
                setTimeout(nextTickHandler, 0)
            }
        }

        return function queueNextTick(cb, ctx) {
            var _resolve
            callbacks.push(function() {
                if (cb) {
                    try {
                        cb.call(ctx)
                    } catch (e) {
                        handleError(e, ctx, "nextTick")
                    }
                } else if (_resolve) {
                    _resolve(ctx)
                }
            })
            if (!pending) {
                pending = true
                timerFunc()
            }
            if (!cb && typeof Promise !== "undefined") {
                return new Promise(function(resolve, reject) {
                    _resolve = resolve
                })
            }
        }
    })()

    var _Set
    /* istanbul ignore if */
    if (typeof Set !== "undefined" && isNative(Set)) {
        // use native Set when available.
        _Set = Set
    } else {
        // a non-standard Set polyfill that only works with primitive keys.
        _Set = (function() {
            function Set() {
                this.set = Object.create(null)
            }
            Set.prototype.has = function has(key) {
                return this.set[key] === true
            }
            Set.prototype.add = function add(key) {
                this.set[key] = true
            }
            Set.prototype.clear = function clear() {
                this.set = Object.create(null)
            }

            return Set
        })()
    }

    /*  */

    var uid$1 = 0

    /**
     * A dep is an observable that can have multiple
     * directives subscribing to it.
     */
    var Dep = function Dep() {
        this.id = uid$1++
        this.subs = []
    }

    Dep.prototype.addSub = function addSub(sub) {
        this.subs.push(sub)
    }

    Dep.prototype.removeSub = function removeSub(sub) {
        remove(this.subs, sub)
    }

    Dep.prototype.depend = function depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    Dep.prototype.notify = function notify() {
        // stabilize the subscriber list first
        var subs = this.subs.slice()
        for (var i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }

    // the current target watcher being evaluated.
    // this is globally unique because there could be only one
    // watcher being evaluated at any time.
    Dep.target = null
    var targetStack = []

    function pushTarget(_target) {
        if (Dep.target) {
            targetStack.push(Dep.target)
        }
        Dep.target = _target
    }

    function popTarget() {
        Dep.target = targetStack.pop()
    }

    /*
     * not type checking this file because flow doesn't play well with
     * dynamically accessing methods on Array prototype
     */

    var arrayProto = Array.prototype
    var arrayMethods = Object.create(arrayProto)
    ;["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(function(method) {
        // cache original method
        var original = arrayProto[method]
        def(arrayMethods, method, function mutator() {
            var args = [],
                len = arguments.length
            while (len--) args[len] = arguments[len]

            var result = original.apply(this, args)
            var ob = this.__ob__
            var inserted
            switch (method) {
                case "push":
                case "unshift":
                    inserted = args
                    break
                case "splice":
                    inserted = args.slice(2)
                    break
            }
            if (inserted) {
                ob.observeArray(inserted)
            }
            // notify change
            ob.dep.notify()
            return result
        })
    })

    /*  */

    var arrayKeys = Object.getOwnPropertyNames(arrayMethods)

    /**
     * By default, when a reactive property is set, the new value is
     * also converted to become reactive. However when passing down props,
     * we don't want to force conversion because the value may be a nested value
     * under a frozen data structure. Converting it would defeat the optimization.
     */
    var observerState = {
        shouldConvert: true
    }

    /**
     * Observer class that are attached to each observed
     * object. Once attached, the observer converts target
     * object's property keys into getter/setters that
     * collect dependencies and dispatches updates.
     */
    var Observer = function Observer(value) {
        this.value = value
        this.dep = new Dep()
        this.vmCount = 0
        def(value, "__ob__", this)
        if (Array.isArray(value)) {
            var augment = hasProto ? protoAugment : copyAugment
            augment(value, arrayMethods, arrayKeys)
            this.observeArray(value)
        } else {
            this.walk(value)
        }
    }

    /**
     * Walk through each property and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    Observer.prototype.walk = function walk(obj) {
        var keys = Object.keys(obj)
        for (var i = 0; i < keys.length; i++) {
            defineReactive$$1(obj, keys[i], obj[keys[i]])
        }
    }

    /**
     * Observe a list of Array items.
     */
    Observer.prototype.observeArray = function observeArray(items) {
        for (var i = 0, l = items.length; i < l; i++) {
            observe(items[i])
        }
    }

    // helpers

    /**
     * Augment an target Object or Array by intercepting
     * the prototype chain using __proto__
     */
    function protoAugment(target, src, keys) {
        /* eslint-disable no-proto */
        target.__proto__ = src
        /* eslint-enable no-proto */
    }

    /**
     * Augment an target Object or Array by defining
     * hidden properties.
     */
    /* istanbul ignore next */
    function copyAugment(target, src, keys) {
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i]
            def(target, key, src[key])
        }
    }

    /**
     * Attempt to create an observer instance for a value,
     * returns the new observer if successfully observed,
     * or the existing observer if the value already has one.
     */
    function observe(value, asRootData) {
        if (!isObject(value)) {
            return
        }
        var ob
        if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
            ob = value.__ob__
        } else if (
            observerState.shouldConvert &&
            !isServerRendering() &&
            (Array.isArray(value) || isPlainObject(value)) &&
            Object.isExtensible(value) &&
            !value._isVue
        ) {
            ob = new Observer(value)
        }
        if (asRootData && ob) {
            ob.vmCount++
        }
        return ob
    }

    /**
     * Define a reactive property on an Object.
     */
    function defineReactive$$1(obj, key, val, customSetter, shallow) {
        var dep = new Dep()

        var property = Object.getOwnPropertyDescriptor(obj, key)
        if (property && property.configurable === false) {
            return
        }

        // cater for pre-defined getter/setters
        var getter = property && property.get
        var setter = property && property.set

        var childOb = !shallow && observe(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {
                var value = getter ? getter.call(obj) : val
                if (Dep.target) {
                    dep.depend()
                    if (childOb) {
                        childOb.dep.depend()
                    }
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
                return value
            },
            set: function reactiveSetter(newVal) {
                var value = getter ? getter.call(obj) : val
                /* eslint-disable no-self-compare */
                if (newVal === value || (newVal !== newVal && value !== value)) {
                    return
                }
                /* eslint-enable no-self-compare */
                if (false) {}
                if (setter) {
                    setter.call(obj, newVal)
                } else {
                    val = newVal
                }
                childOb = !shallow && observe(newVal)
                dep.notify()
            }
        })
    }

    /**
     * Set a property on an object. Adds the new property and
     * triggers change notification if the property doesn't
     * already exist.
     */
    function set(target, key, val) {
        if (Array.isArray(target) && isValidArrayIndex(key)) {
            target.length = Math.max(target.length, key)
            target.splice(key, 1, val)
            return val
        }
        if (hasOwn(target, key)) {
            target[key] = val
            return val
        }
        var ob = target.__ob__
        if (target._isVue || (ob && ob.vmCount)) {
             false &&
                false
            return val
        }
        if (!ob) {
            target[key] = val
            return val
        }
        defineReactive$$1(ob.value, key, val)
        ob.dep.notify()
        return val
    }

    /**
     * Delete a property and trigger change if necessary.
     */
    function del(target, key) {
        if (Array.isArray(target) && isValidArrayIndex(key)) {
            target.splice(key, 1)
            return
        }
        var ob = target.__ob__
        if (target._isVue || (ob && ob.vmCount)) {
             false &&
                false
            return
        }
        if (!hasOwn(target, key)) {
            return
        }
        delete target[key]
        if (!ob) {
            return
        }
        ob.dep.notify()
    }

    /**
     * Collect dependencies on array elements when the array is touched, since
     * we cannot intercept array element access like property getters.
     */
    function dependArray(value) {
        for (var e = void 0, i = 0, l = value.length; i < l; i++) {
            e = value[i]
            e && e.__ob__ && e.__ob__.dep.depend()
            if (Array.isArray(e)) {
                dependArray(e)
            }
        }
    }

    /*  */

    /**
     * Option overwriting strategies are functions that handle
     * how to merge a parent option value and a child option
     * value into the final value.
     */
    var strats = config.optionMergeStrategies

    /**
     * Options with restrictions
     */
    /**
     * Helper that recursively merges two data objects together.
     */
    function mergeData(to, from) {
        if (!from) {
            return to
        }
        var key, toVal, fromVal
        var keys = Object.keys(from)
        for (var i = 0; i < keys.length; i++) {
            key = keys[i]
            toVal = to[key]
            fromVal = from[key]
            if (!hasOwn(to, key)) {
                set(to, key, fromVal)
            } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
                mergeData(toVal, fromVal)
            }
        }
        return to
    }

    /**
     * Data
     */
    function mergeDataOrFn(parentVal, childVal, vm) {
        if (!vm) {
            // in a Vue.extend merge, both should be functions
            if (!childVal) {
                return parentVal
            }
            if (!parentVal) {
                return childVal
            }
            // when parentVal & childVal are both present,
            // we need to return a function that returns the
            // merged result of both functions... no need to
            // check if parentVal is a function here because
            // it has to be a function to pass previous merges.
            return function mergedDataFn() {
                return mergeData(
                    typeof childVal === "function" ? childVal.call(this) : childVal,
                    parentVal.call(this)
                )
            }
        } else if (parentVal || childVal) {
            return function mergedInstanceDataFn() {
                // instance merge
                var instanceData = typeof childVal === "function" ? childVal.call(vm) : childVal
                var defaultData = typeof parentVal === "function" ? parentVal.call(vm) : undefined
                if (instanceData) {
                    return mergeData(instanceData, defaultData)
                } else {
                    return defaultData
                }
            }
        }
    }

    strats.data = function(parentVal, childVal, vm) {
        if (!vm) {
            if (childVal && typeof childVal !== "function") {
                 false &&
                    false

                return parentVal
            }
            return mergeDataOrFn.call(this, parentVal, childVal)
        }

        return mergeDataOrFn(parentVal, childVal, vm)
    }

    /**
     * Hooks and props are merged as arrays.
     */
    function mergeHook(parentVal, childVal) {
        return childVal
            ? parentVal
                ? parentVal.concat(childVal)
                : Array.isArray(childVal)
                    ? childVal
                    : [childVal]
            : parentVal
    }

    LIFECYCLE_HOOKS.forEach(function(hook) {
        strats[hook] = mergeHook
    })

    /**
     * Assets
     *
     * When a vm is present (instance creation), we need to do
     * a three-way merge between constructor options, instance
     * options and parent options.
     */
    function mergeAssets(parentVal, childVal) {
        var res = Object.create(parentVal || null)
        return childVal ? extend(res, childVal) : res
    }

    ASSET_TYPES.forEach(function(type) {
        strats[type + "s"] = mergeAssets
    })

    /**
     * Watchers.
     *
     * Watchers hashes should not overwrite one
     * another, so we merge them as arrays.
     */
    strats.watch = function(parentVal, childVal) {
        // work around Firefox's Object.prototype.watch...
        if (parentVal === nativeWatch) {
            parentVal = undefined
        }
        if (childVal === nativeWatch) {
            childVal = undefined
        }
        /* istanbul ignore if */
        if (!childVal) {
            return Object.create(parentVal || null)
        }
        if (!parentVal) {
            return childVal
        }
        var ret = {}
        extend(ret, parentVal)
        for (var key in childVal) {
            var parent = ret[key]
            var child = childVal[key]
            if (parent && !Array.isArray(parent)) {
                parent = [parent]
            }
            ret[key] = parent ? parent.concat(child) : Array.isArray(child) ? child : [child]
        }
        return ret
    }

    /**
     * Other object hashes.
     */
    strats.props = strats.methods = strats.inject = strats.computed = function(
        parentVal,
        childVal
    ) {
        if (!childVal) {
            return Object.create(parentVal || null)
        }
        if (!parentVal) {
            return childVal
        }
        var ret = Object.create(null)
        extend(ret, parentVal)
        extend(ret, childVal)
        return ret
    }
    strats.provide = mergeDataOrFn

    /**
     * Default strategy.
     */
    var defaultStrat = function(parentVal, childVal) {
        return childVal === undefined ? parentVal : childVal
    }

    /**
     * Ensure all props option syntax are normalized into the
     * Object-based format.
     */
    function normalizeProps(options) {
        var props = options.props
        if (!props) {
            return
        }
        var res = {}
        var i, val, name
        if (Array.isArray(props)) {
            i = props.length
            while (i--) {
                val = props[i]
                if (typeof val === "string") {
                    name = camelize(val)
                    res[name] = {
                        type: null
                    }
                } else {
                }
            }
        } else if (isPlainObject(props)) {
            for (var key in props) {
                val = props[key]
                name = camelize(key)
                res[name] = isPlainObject(val)
                    ? val
                    : {
                          type: val
                      }
            }
        }
        options.props = res
    }

    /**
     * Normalize all injections into Object-based format
     */
    function normalizeInject(options) {
        var inject = options.inject
        if (Array.isArray(inject)) {
            var normalized = (options.inject = {})
            for (var i = 0; i < inject.length; i++) {
                normalized[inject[i]] = inject[i]
            }
        }
    }

    /**
     * Normalize raw function directives into object format.
     */
    function normalizeDirectives(options) {
        var dirs = options.directives
        if (dirs) {
            for (var key in dirs) {
                var def = dirs[key]
                if (typeof def === "function") {
                    dirs[key] = {
                        bind: def,
                        update: def
                    }
                }
            }
        }
    }

    /**
     * Merge two option objects into a new one.
     * Core utility used in both instantiation and inheritance.
     */
    function mergeOptions(parent, child, vm) {
        if (typeof child === "function") {
            child = child.options
        }

        normalizeProps(child)
        normalizeInject(child)
        normalizeDirectives(child)
        var extendsFrom = child.extends
        if (extendsFrom) {
            parent = mergeOptions(parent, extendsFrom, vm)
        }
        if (child.mixins) {
            for (var i = 0, l = child.mixins.length; i < l; i++) {
                parent = mergeOptions(parent, child.mixins[i], vm)
            }
        }
        var options = {}
        var key
        for (key in parent) {
            mergeField(key)
        }
        for (key in child) {
            if (!hasOwn(parent, key)) {
                mergeField(key)
            }
        }

        function mergeField(key) {
            var strat = strats[key] || defaultStrat
            options[key] = strat(parent[key], child[key], vm, key)
        }
        return options
    }

    /**
     * Resolve an asset.
     * This function is used because child instances need access
     * to assets defined in its ancestor chain.
     */
    function resolveAsset(options, type, id, warnMissing) {
        /* istanbul ignore if */
        if (typeof id !== "string") {
            return
        }
        var assets = options[type]
        // check local registration variations first
        if (hasOwn(assets, id)) {
            return assets[id]
        }
        var camelizedId = camelize(id)
        if (hasOwn(assets, camelizedId)) {
            return assets[camelizedId]
        }
        var PascalCaseId = capitalize(camelizedId)
        if (hasOwn(assets, PascalCaseId)) {
            return assets[PascalCaseId]
        }
        // fallback to prototype chain
        var res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
        if (false) {}
        return res
    }

    /*  */

    function validateProp(key, propOptions, propsData, vm) {
        var prop = propOptions[key]
        var absent = !hasOwn(propsData, key)
        var value = propsData[key]
        // handle boolean props
        if (isType(Boolean, prop.type)) {
            if (absent && !hasOwn(prop, "default")) {
                value = false
            } else if (!isType(String, prop.type) && (value === "" || value === hyphenate(key))) {
                value = true
            }
        }
        // check default value
        if (value === undefined) {
            value = getPropDefaultValue(vm, prop, key)
            // since the default value is a fresh copy,
            // make sure to observe it.
            var prevShouldConvert = observerState.shouldConvert
            observerState.shouldConvert = true
            observe(value)
            observerState.shouldConvert = prevShouldConvert
        }
        return value
    }

    /**
     * Get the default value of a prop.
     */
    function getPropDefaultValue(vm, prop, key) {
        // no default, return undefined
        if (!hasOwn(prop, "default")) {
            return undefined
        }
        var def = prop.default
        // warn against non-factory defaults for Object & Array
        if (false) {}
        // the raw prop value was also undefined from previous render,
        // return previous default value to avoid unnecessary watcher trigger
        if (
            vm &&
            vm.$options.propsData &&
            vm.$options.propsData[key] === undefined &&
            vm._props[key] !== undefined
        ) {
            return vm._props[key]
        }
        // call factory function for non-Function types
        // a value is Function if its prototype is function even across different execution context
        return typeof def === "function" && getType(prop.type) !== "Function" ? def.call(vm) : def
    }

    /**
     * Use function string name to check built-in types,
     * because a simple equality check will fail when running
     * across different vms / iframes.
     */
    function getType(fn) {
        var match = fn && fn.toString().match(/^\s*function (\w+)/)
        return match ? match[1] : ""
    }

    function isType(type, fn) {
        if (!Array.isArray(fn)) {
            return getType(fn) === getType(type)
        }
        for (var i = 0, len = fn.length; i < len; i++) {
            if (getType(fn[i]) === getType(type)) {
                return true
            }
        }
        /* istanbul ignore next */
        return false
    }

    /*  */

    /* not type checking this file because flow doesn't play well with Proxy */

    var mark
    var measure

    /*  */

    var VNode = function VNode(
        tag,
        data,
        children,
        text,
        elm,
        context,
        componentOptions,
        asyncFactory
    ) {
        this.tag = tag
        this.data = data
        this.children = children
        this.text = text
        this.elm = elm
        this.ns = undefined
        this.context = context
        this.functionalContext = undefined
        this.key = data && data.key
        this.componentOptions = componentOptions
        this.componentInstance = undefined
        this.parent = undefined
        this.raw = false
        this.isStatic = false
        this.isRootInsert = true
        this.isComment = false
        this.isCloned = false
        this.isOnce = false
        this.asyncFactory = asyncFactory
        this.asyncMeta = undefined
        this.isAsyncPlaceholder = false
    }

    var prototypeAccessors = {
        child: {}
    }

    // DEPRECATED: alias for componentInstance for backwards compat.
    /* istanbul ignore next */
    prototypeAccessors.child.get = function() {
        return this.componentInstance
    }

    Object.defineProperties(VNode.prototype, prototypeAccessors)

    var createEmptyVNode = function(text) {
        if (text === void 0) text = ""

        var node = new VNode()
        node.text = text
        node.isComment = true
        return node
    }

    function createTextVNode(val) {
        return new VNode(undefined, undefined, undefined, String(val))
    }

    // optimized shallow clone
    // used for static nodes and slot nodes because they may be reused across
    // multiple renders, cloning them avoids errors when DOM manipulations rely
    // on their elm reference.
    function cloneVNode(vnode) {
        var cloned = new VNode(
            vnode.tag,
            vnode.data,
            vnode.children,
            vnode.text,
            vnode.elm,
            vnode.context,
            vnode.componentOptions,
            vnode.asyncFactory
        )
        cloned.ns = vnode.ns
        cloned.isStatic = vnode.isStatic
        cloned.key = vnode.key
        cloned.isComment = vnode.isComment
        cloned.isCloned = true
        return cloned
    }

    function cloneVNodes(vnodes) {
        var len = vnodes.length
        var res = new Array(len)
        for (var i = 0; i < len; i++) {
            res[i] = cloneVNode(vnodes[i])
        }
        return res
    }

    /*  */

    var normalizeEvent = cached(function(name) {
        var passive = name.charAt(0) === "&"
        name = passive ? name.slice(1) : name
        var once$$1 = name.charAt(0) === "~" // Prefixed last, checked first
        name = once$$1 ? name.slice(1) : name
        var capture = name.charAt(0) === "!"
        name = capture ? name.slice(1) : name
        return {
            name: name,
            once: once$$1,
            capture: capture,
            passive: passive
        }
    })

    function createFnInvoker(fns) {
        function invoker() {
            var arguments$1 = arguments

            var fns = invoker.fns
            if (Array.isArray(fns)) {
                var cloned = fns.slice()
                for (var i = 0; i < cloned.length; i++) {
                    cloned[i].apply(null, arguments$1)
                }
            } else {
                // return handler return value for single handlers
                return fns.apply(null, arguments)
            }
        }
        invoker.fns = fns
        return invoker
    }

    function updateListeners(on, oldOn, add, remove$$1, vm) {
        var name, cur, old, event
        for (name in on) {
            cur = on[name]
            old = oldOn[name]
            event = normalizeEvent(name)
            if (isUndef(cur)) {
                 false &&
                    false
            } else if (isUndef(old)) {
                if (isUndef(cur.fns)) {
                    cur = on[name] = createFnInvoker(cur)
                }
                add(event.name, cur, event.once, event.capture, event.passive)
            } else if (cur !== old) {
                old.fns = cur
                on[name] = old
            }
        }
        for (name in oldOn) {
            if (isUndef(on[name])) {
                event = normalizeEvent(name)
                remove$$1(event.name, oldOn[name], event.capture)
            }
        }
    }

    /*  */

    /*  */

    function extractPropsFromVNodeData(data, Ctor, tag) {
        // we are only extracting raw values here.
        // validation and default values are handled in the child
        // component itself.
        var propOptions = Ctor.options.props
        if (isUndef(propOptions)) {
            return
        }
        var res = {}
        var attrs = data.attrs
        var props = data.props
        if (isDef(attrs) || isDef(props)) {
            for (var key in propOptions) {
                var altKey = hyphenate(key)
                checkProp(res, props, key, altKey, true) ||
                    checkProp(res, attrs, key, altKey, false)
            }
        }
        return res
    }

    function checkProp(res, hash, key, altKey, preserve) {
        if (isDef(hash)) {
            if (hasOwn(hash, key)) {
                res[key] = hash[key]
                if (!preserve) {
                    delete hash[key]
                }
                return true
            } else if (hasOwn(hash, altKey)) {
                res[key] = hash[altKey]
                if (!preserve) {
                    delete hash[altKey]
                }
                return true
            }
        }
        return false
    }

    /*  */

    // The template compiler attempts to minimize the need for normalization by
    // statically analyzing the template at compile time.
    //
    // For plain HTML markup, normalization can be completely skipped because the
    // generated render function is guaranteed to return Array<VNode>. There are
    // two cases where extra normalization is needed:

    // 1. When the children contains components - because a functional component
    // may return an Array instead of a single root. In this case, just a simple
    // normalization is needed - if any child is an Array, we flatten the whole
    // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
    // because functional components already normalize their own children.
    function simpleNormalizeChildren(children) {
        for (var i = 0; i < children.length; i++) {
            if (Array.isArray(children[i])) {
                return Array.prototype.concat.apply([], children)
            }
        }
        return children
    }

    // 2. When the children contains constructs that always generated nested Arrays,
    // e.g. <template>, <slot>, v-for, or when the children is provided by user
    // with hand-written render functions / JSX. In such cases a full normalization
    // is needed to cater to all possible types of children values.
    function normalizeChildren(children) {
        return isPrimitive(children)
            ? [createTextVNode(children)]
            : Array.isArray(children)
                ? normalizeArrayChildren(children)
                : undefined
    }

    function isTextNode(node) {
        return isDef(node) && isDef(node.text) && isFalse(node.isComment)
    }

    function normalizeArrayChildren(children, nestedIndex) {
        var res = []
        var i, c, last
        for (i = 0; i < children.length; i++) {
            c = children[i]
            if (isUndef(c) || typeof c === "boolean") {
                continue
            }
            last = res[res.length - 1]
            //  nested
            if (Array.isArray(c)) {
                res.push.apply(res, normalizeArrayChildren(c, (nestedIndex || "") + "_" + i))
            } else if (isPrimitive(c)) {
                if (isTextNode(last)) {
                    // merge adjacent text nodes
                    // this is necessary for SSR hydration because text nodes are
                    // essentially merged when rendered to HTML strings
                    last.text += String(c)
                } else if (c !== "") {
                    // convert primitive to vnode
                    res.push(createTextVNode(c))
                }
            } else {
                if (isTextNode(c) && isTextNode(last)) {
                    // merge adjacent text nodes
                    res[res.length - 1] = createTextVNode(last.text + c.text)
                } else {
                    // default key for nested array children (likely generated by v-for)
                    if (
                        isTrue(children._isVList) &&
                        isDef(c.tag) &&
                        isUndef(c.key) &&
                        isDef(nestedIndex)
                    ) {
                        c.key = "__vlist" + nestedIndex + "_" + i + "__"
                    }
                    res.push(c)
                }
            }
        }
        return res
    }

    /*  */

    function ensureCtor(comp, base) {
        if (comp.__esModule && comp.default) {
            comp = comp.default
        }
        return isObject(comp) ? base.extend(comp) : comp
    }

    function createAsyncPlaceholder(factory, data, context, children, tag) {
        var node = createEmptyVNode()
        node.asyncFactory = factory
        node.asyncMeta = {
            data: data,
            context: context,
            children: children,
            tag: tag
        }
        return node
    }

    function resolveAsyncComponent(factory, baseCtor, context) {
        if (isTrue(factory.error) && isDef(factory.errorComp)) {
            return factory.errorComp
        }

        if (isDef(factory.resolved)) {
            return factory.resolved
        }

        if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
            return factory.loadingComp
        }

        if (isDef(factory.contexts)) {
            // already pending
            factory.contexts.push(context)
        } else {
            var contexts = (factory.contexts = [context])
            var sync = true

            var forceRender = function() {
                for (var i = 0, l = contexts.length; i < l; i++) {
                    contexts[i].$forceUpdate()
                }
            }

            var resolve = once(function(res) {
                // cache resolved
                factory.resolved = ensureCtor(res, baseCtor)
                // invoke callbacks only if this is not a synchronous resolve
                // (async resolves are shimmed as synchronous during SSR)
                if (!sync) {
                    forceRender()
                }
            })

            var reject = once(function(reason) {
                 false &&
                    false
                if (isDef(factory.errorComp)) {
                    factory.error = true
                    forceRender()
                }
            })

            var res = factory(resolve, reject)

            if (isObject(res)) {
                if (typeof res.then === "function") {
                    // () => Promise
                    if (isUndef(factory.resolved)) {
                        res.then(resolve, reject)
                    }
                } else if (isDef(res.component) && typeof res.component.then === "function") {
                    res.component.then(resolve, reject)

                    if (isDef(res.error)) {
                        factory.errorComp = ensureCtor(res.error, baseCtor)
                    }

                    if (isDef(res.loading)) {
                        factory.loadingComp = ensureCtor(res.loading, baseCtor)
                        if (res.delay === 0) {
                            factory.loading = true
                        } else {
                            setTimeout(function() {
                                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                                    factory.loading = true
                                    forceRender()
                                }
                            }, res.delay || 200)
                        }
                    }

                    if (isDef(res.timeout)) {
                        setTimeout(function() {
                            if (isUndef(factory.resolved)) {
                                reject(null)
                            }
                        }, res.timeout)
                    }
                }
            }

            sync = false
            // return in case resolved synchronously
            return factory.loading ? factory.loadingComp : factory.resolved
        }
    }

    /*  */

    function getFirstComponentChild(children) {
        if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                var c = children[i]
                if (isDef(c) && isDef(c.componentOptions)) {
                    return c
                }
            }
        }
    }

    /*  */

    /*  */

    function initEvents(vm) {
        vm._events = Object.create(null)
        vm._hasHookEvent = false
        // init parent attached events
        var listeners = vm.$options._parentListeners
        if (listeners) {
            updateComponentListeners(vm, listeners)
        }
    }

    var target

    function add(event, fn, once$$1) {
        if (once$$1) {
            target.$once(event, fn)
        } else {
            target.$on(event, fn)
        }
    }

    function remove$1(event, fn) {
        target.$off(event, fn)
    }

    function updateComponentListeners(vm, listeners, oldListeners) {
        target = vm
        updateListeners(listeners, oldListeners || {}, add, remove$1, vm)
    }

    function eventsMixin(Vue) {
        var hookRE = /^hook:/
        Vue.prototype.$on = function(event, fn) {
            var this$1 = this

            var vm = this
            if (Array.isArray(event)) {
                for (var i = 0, l = event.length; i < l; i++) {
                    this$1.$on(event[i], fn)
                }
            } else {
                ;(vm._events[event] || (vm._events[event] = [])).push(fn)
                // optimize hook:event cost by using a boolean flag marked at registration
                // instead of a hash lookup
                if (hookRE.test(event)) {
                    vm._hasHookEvent = true
                }
            }
            return vm
        }

        Vue.prototype.$once = function(event, fn) {
            var vm = this

            function on() {
                vm.$off(event, on)
                fn.apply(vm, arguments)
            }
            on.fn = fn
            vm.$on(event, on)
            return vm
        }

        Vue.prototype.$off = function(event, fn) {
            var this$1 = this

            var vm = this
            // all
            if (!arguments.length) {
                vm._events = Object.create(null)
                return vm
            }
            // array of events
            if (Array.isArray(event)) {
                for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
                    this$1.$off(event[i$1], fn)
                }
                return vm
            }
            // specific event
            var cbs = vm._events[event]
            if (!cbs) {
                return vm
            }
            if (arguments.length === 1) {
                vm._events[event] = null
                return vm
            }
            // specific handler
            var cb
            var i = cbs.length
            while (i--) {
                cb = cbs[i]
                if (cb === fn || cb.fn === fn) {
                    cbs.splice(i, 1)
                    break
                }
            }
            return vm
        }

        Vue.prototype.$emit = function(event) {
            var vm = this
            var cbs = vm._events[event]
            if (cbs) {
                cbs = cbs.length > 1 ? toArray(cbs) : cbs
                var args = toArray(arguments, 1)
                for (var i = 0, l = cbs.length; i < l; i++) {
                    try {
                        cbs[i].apply(vm, args)
                    } catch (e) {
                        handleError(e, vm, 'event handler for "' + event + '"')
                    }
                }
            }
            return vm
        }
    }

    /*  */

    /**
     * Runtime helper for resolving raw children VNodes into a slot object.
     */
    function resolveSlots(children, context) {
        var slots = {}
        if (!children) {
            return slots
        }
        var defaultSlot = []
        for (var i = 0, l = children.length; i < l; i++) {
            var child = children[i]
            // named slots should only be respected if the vnode was rendered in the
            // same context.
            if (
                (child.context === context || child.functionalContext === context) &&
                child.data &&
                child.data.slot != null
            ) {
                var name = child.data.slot
                var slot = slots[name] || (slots[name] = [])
                if (child.tag === "template") {
                    slot.push.apply(slot, child.children)
                } else {
                    slot.push(child)
                }
            } else {
                defaultSlot.push(child)
            }
        }
        // ignore whitespace
        if (!defaultSlot.every(isWhitespace)) {
            slots.default = defaultSlot
        }
        return slots
    }

    function isWhitespace(node) {
        return node.isComment || node.text === " "
    }

    function resolveScopedSlots(
        fns, // see flow/vnode
        res
    ) {
        res = res || {}
        for (var i = 0; i < fns.length; i++) {
            if (Array.isArray(fns[i])) {
                resolveScopedSlots(fns[i], res)
            } else {
                res[fns[i].key] = fns[i].fn
            }
        }
        return res
    }

    /*  */

    var activeInstance = null

    function initLifecycle(vm) {
        var options = vm.$options

        // locate first non-abstract parent
        var parent = options.parent
        if (parent && !options.abstract) {
            while (parent.$options.abstract && parent.$parent) {
                parent = parent.$parent
            }
            parent.$children.push(vm)
        }

        vm.$parent = parent
        vm.$root = parent ? parent.$root : vm

        vm.$children = []
        vm.$refs = {}

        vm._watcher = null
        vm._inactive = null
        vm._directInactive = false
        vm._isMounted = false
        vm._isDestroyed = false
        vm._isBeingDestroyed = false
    }

    function lifecycleMixin(Vue) {
        Vue.prototype._update = function(vnode, hydrating) {
            var vm = this
            if (vm._isMounted) {
                callHook(vm, "beforeUpdate")
            }
            var prevEl = vm.$el
            var prevVnode = vm._vnode
            var prevActiveInstance = activeInstance
            activeInstance = vm
            vm._vnode = vnode
            // Vue.prototype.__patch__ is injected in entry points
            // based on the rendering backend used.
            if (!prevVnode) {
                // initial render
                vm.$el = vm.__patch__(
                    vm.$el,
                    vnode,
                    hydrating,
                    false /* removeOnly */,
                    vm.$options._parentElm,
                    vm.$options._refElm
                )
                // no need for the ref nodes after initial patch
                // this prevents keeping a detached DOM tree in memory (#5851)
                vm.$options._parentElm = vm.$options._refElm = null
            } else {
                // updates
                vm.$el = vm.__patch__(prevVnode, vnode)
            }
            activeInstance = prevActiveInstance
            // update __vue__ reference
            if (prevEl) {
                prevEl.__vue__ = null
            }
            if (vm.$el) {
                vm.$el.__vue__ = vm
            }
            // if parent is an HOC, update its $el as well
            if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
                vm.$parent.$el = vm.$el
            }
            // updated hook is called by the scheduler to ensure that children are
            // updated in a parent's updated hook.
        }

        Vue.prototype.$forceUpdate = function() {
            var vm = this
            if (vm._watcher) {
                vm._watcher.update()
            }
        }

        Vue.prototype.$destroy = function() {
            var vm = this
            if (vm._isBeingDestroyed) {
                return
            }
            callHook(vm, "beforeDestroy")
            vm._isBeingDestroyed = true
            // remove self from parent
            var parent = vm.$parent
            if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
                remove(parent.$children, vm)
            }
            // teardown watchers
            if (vm._watcher) {
                vm._watcher.teardown()
            }
            var i = vm._watchers.length
            while (i--) {
                vm._watchers[i].teardown()
            }
            // remove reference from data ob
            // frozen object may not have observer.
            if (vm._data.__ob__) {
                vm._data.__ob__.vmCount--
            }
            // call the last hook...
            vm._isDestroyed = true
            // invoke destroy hooks on current rendered tree
            vm.__patch__(vm._vnode, null)
            // fire destroyed hook
            callHook(vm, "destroyed")
            // turn off all instance listeners.
            vm.$off()
            // remove __vue__ reference
            if (vm.$el) {
                vm.$el.__vue__ = null
            }
        }
    }

    function mountComponent(vm, el, hydrating) {
        vm.$el = el
        if (!vm.$options.render) {
            vm.$options.render = createEmptyVNode
        }
        callHook(vm, "beforeMount")

        var updateComponent
        /* istanbul ignore if */
        if (false) {} else {
            updateComponent = function() {
                vm._update(vm._render(), hydrating)
            }
        }

        vm._watcher = new Watcher(vm, updateComponent, noop)
        hydrating = false

        // manually mounted instance, call mounted on self
        // mounted is called for render-created child components in its inserted hook
        if (vm.$vnode == null) {
            vm._isMounted = true
            callHook(vm, "mounted")
        }
        return vm
    }

    function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
        var hasChildren = !!(
            renderChildren || // has new static slots
            vm.$options._renderChildren || // has old static slots
            parentVnode.data.scopedSlots || // has new scoped slots
            vm.$scopedSlots !== emptyObject
        ) // has old scoped slots

        vm.$options._parentVnode = parentVnode
        vm.$vnode = parentVnode // update vm's placeholder node without re-render

        if (vm._vnode) {
            // update child tree's parent
            vm._vnode.parent = parentVnode
        }
        vm.$options._renderChildren = renderChildren

        // update $attrs and $listensers hash
        // these are also reactive so they may trigger child update if the child
        // used them during render
        vm.$attrs = parentVnode.data && parentVnode.data.attrs
        vm.$listeners = listeners

        // update props
        if (propsData && vm.$options.props) {
            observerState.shouldConvert = false
            var props = vm._props
            var propKeys = vm.$options._propKeys || []
            for (var i = 0; i < propKeys.length; i++) {
                var key = propKeys[i]
                props[key] = validateProp(key, vm.$options.props, propsData, vm)
            }
            observerState.shouldConvert = true
            // keep a copy of raw propsData
            vm.$options.propsData = propsData
        }

        // update listeners
        if (listeners) {
            var oldListeners = vm.$options._parentListeners
            vm.$options._parentListeners = listeners
            updateComponentListeners(vm, listeners, oldListeners)
        }
        // resolve slots + force update if has children
        if (hasChildren) {
            vm.$slots = resolveSlots(renderChildren, parentVnode.context)
            vm.$forceUpdate()
        }
    }

    function isInInactiveTree(vm) {
        while (vm && (vm = vm.$parent)) {
            if (vm._inactive) {
                return true
            }
        }
        return false
    }

    function activateChildComponent(vm, direct) {
        if (direct) {
            vm._directInactive = false
            if (isInInactiveTree(vm)) {
                return
            }
        } else if (vm._directInactive) {
            return
        }
        if (vm._inactive || vm._inactive === null) {
            vm._inactive = false
            for (var i = 0; i < vm.$children.length; i++) {
                activateChildComponent(vm.$children[i])
            }
            callHook(vm, "activated")
        }
    }

    function deactivateChildComponent(vm, direct) {
        if (direct) {
            vm._directInactive = true
            if (isInInactiveTree(vm)) {
                return
            }
        }
        if (!vm._inactive) {
            vm._inactive = true
            for (var i = 0; i < vm.$children.length; i++) {
                deactivateChildComponent(vm.$children[i])
            }
            callHook(vm, "deactivated")
        }
    }

    function callHook(vm, hook) {
        var handlers = vm.$options[hook]
        if (handlers) {
            for (var i = 0, j = handlers.length; i < j; i++) {
                try {
                    handlers[i].call(vm)
                } catch (e) {
                    handleError(e, vm, hook + " hook")
                }
            }
        }
        if (vm._hasHookEvent) {
            vm.$emit("hook:" + hook)
        }
    }

    /*  */

    var MAX_UPDATE_COUNT = 100

    var queue = []
    var activatedChildren = []
    var has = {}
    var circular = {}
    var waiting = false
    var flushing = false
    var index = 0

    /**
     * Reset the scheduler's state.
     */
    function resetSchedulerState() {
        index = queue.length = activatedChildren.length = 0
        has = {}
        waiting = flushing = false
    }

    /**
     * Flush both queues and run the watchers.
     */
    function flushSchedulerQueue() {
        flushing = true
        var watcher, id

        // Sort queue before flush.
        // This ensures that:
        // 1. Components are updated from parent to child. (because parent is always
        //    created before the child)
        // 2. A component's user watchers are run before its render watcher (because
        //    user watchers are created before the render watcher)
        // 3. If a component is destroyed during a parent component's watcher run,
        //    its watchers can be skipped.
        queue.sort(function(a, b) {
            return a.id - b.id
        })

        // do not cache length because more watchers might be pushed
        // as we run existing watchers
        for (index = 0; index < queue.length; index++) {
            watcher = queue[index]
            id = watcher.id
            has[id] = null
            watcher.run()
            // in dev build, check and stop circular updates.
            if (false) {}
        }

        // keep copies of post queues before resetting state
        var activatedQueue = activatedChildren.slice()
        var updatedQueue = queue.slice()

        resetSchedulerState()

        // call component updated and activated hooks
        callActivatedHooks(activatedQueue)
        callUpdatedHooks(updatedQueue)

        // devtool hook
        /* istanbul ignore if */
        if (devtools && config.devtools) {
            devtools.emit("flush")
        }
    }

    function callUpdatedHooks(queue) {
        var i = queue.length
        while (i--) {
            var watcher = queue[i]
            var vm = watcher.vm
            if (vm._watcher === watcher && vm._isMounted) {
                callHook(vm, "updated")
            }
        }
    }

    /**
     * Queue a kept-alive component that was activated during patch.
     * The queue will be processed after the entire tree has been patched.
     */
    function queueActivatedComponent(vm) {
        // setting _inactive to false here so that a render function can
        // rely on checking whether it's in an inactive tree (e.g. router-view)
        vm._inactive = false
        activatedChildren.push(vm)
    }

    function callActivatedHooks(queue) {
        for (var i = 0; i < queue.length; i++) {
            queue[i]._inactive = true
            activateChildComponent(queue[i], true /* true */)
        }
    }

    /**
     * Push a watcher into the watcher queue.
     * Jobs with duplicate IDs will be skipped unless it's
     * pushed when the queue is being flushed.
     */
    function queueWatcher(watcher) {
        var id = watcher.id
        if (has[id] == null) {
            has[id] = true
            if (!flushing) {
                queue.push(watcher)
            } else {
                // if already flushing, splice the watcher based on its id
                // if already past its id, it will be run next immediately.
                var i = queue.length - 1
                while (i > index && queue[i].id > watcher.id) {
                    i--
                }
                queue.splice(i + 1, 0, watcher)
            }
            // queue the flush
            if (!waiting) {
                waiting = true
                nextTick(flushSchedulerQueue)
            }
        }
    }

    /*  */

    var uid$2 = 0

    /**
     * A watcher parses an expression, collects dependencies,
     * and fires callback when the expression value changes.
     * This is used for both the $watch() api and directives.
     */
    var Watcher = function Watcher(vm, expOrFn, cb, options) {
        this.vm = vm
        vm._watchers.push(this)
        // options
        if (options) {
            this.deep = !!options.deep
            this.user = !!options.user
            this.lazy = !!options.lazy
            this.sync = !!options.sync
        } else {
            this.deep = this.user = this.lazy = this.sync = false
        }
        this.cb = cb
        this.id = ++uid$2 // uid for batching
        this.active = true
        this.dirty = this.lazy // for lazy watchers
        this.deps = []
        this.newDeps = []
        this.depIds = new _Set()
        this.newDepIds = new _Set()
        this.expression = ""
        // parse expression for getter
        if (typeof expOrFn === "function") {
            this.getter = expOrFn
        } else {
            this.getter = parsePath(expOrFn)
            if (!this.getter) {
                this.getter = function() {}
                 false &&
                    false
            }
        }
        this.value = this.lazy ? undefined : this.get()
    }

    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    Watcher.prototype.get = function get() {
        pushTarget(this)
        var value
        var vm = this.vm
        try {
            value = this.getter.call(vm, vm)
        } catch (e) {
            if (this.user) {
                handleError(e, vm, 'getter for watcher "' + this.expression + '"')
            } else {
                throw e
            }
        } finally {
            // "touch" every property so they are all tracked as
            // dependencies for deep watching
            if (this.deep) {
                traverse(value)
            }
            popTarget()
            this.cleanupDeps()
        }
        return value
    }

    /**
     * Add a dependency to this directive.
     */
    Watcher.prototype.addDep = function addDep(dep) {
        var id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }

    /**
     * Clean up for dependency collection.
     */
    Watcher.prototype.cleanupDeps = function cleanupDeps() {
        var this$1 = this

        var i = this.deps.length
        while (i--) {
            var dep = this$1.deps[i]
            if (!this$1.newDepIds.has(dep.id)) {
                dep.removeSub(this$1)
            }
        }
        var tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }

    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    Watcher.prototype.update = function update() {
        /* istanbul ignore else */
        if (this.lazy) {
            this.dirty = true
        } else if (this.sync) {
            this.run()
        } else {
            queueWatcher(this)
        }
    }

    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    Watcher.prototype.run = function run() {
        if (this.active) {
            var value = this.get()
            if (
                value !== this.value ||
                // Deep watchers and watchers on Object/Arrays should fire even
                // when the value is the same, because the value may
                // have mutated.
                isObject(value) ||
                this.deep
            ) {
                // set new value
                var oldValue = this.value
                this.value = value
                if (this.user) {
                    try {
                        this.cb.call(this.vm, value, oldValue)
                    } catch (e) {
                        handleError(e, this.vm, 'callback for watcher "' + this.expression + '"')
                    }
                } else {
                    this.cb.call(this.vm, value, oldValue)
                }
            }
        }
    }

    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    Watcher.prototype.evaluate = function evaluate() {
        this.value = this.get()
        this.dirty = false
    }

    /**
     * Depend on all deps collected by this watcher.
     */
    Watcher.prototype.depend = function depend() {
        var this$1 = this

        var i = this.deps.length
        while (i--) {
            this$1.deps[i].depend()
        }
    }

    /**
     * Remove self from all dependencies' subscriber list.
     */
    Watcher.prototype.teardown = function teardown() {
        var this$1 = this

        if (this.active) {
            // remove self from vm's watcher list
            // this is a somewhat expensive operation so we skip it
            // if the vm is being destroyed.
            if (!this.vm._isBeingDestroyed) {
                remove(this.vm._watchers, this)
            }
            var i = this.deps.length
            while (i--) {
                this$1.deps[i].removeSub(this$1)
            }
            this.active = false
        }
    }

    /**
     * Recursively traverse an object to evoke all converted
     * getters, so that every nested property inside the object
     * is collected as a "deep" dependency.
     */
    var seenObjects = new _Set()

    function traverse(val) {
        seenObjects.clear()
        _traverse(val, seenObjects)
    }

    function _traverse(val, seen) {
        var i, keys
        var isA = Array.isArray(val)
        if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
            return
        }
        if (val.__ob__) {
            var depId = val.__ob__.dep.id
            if (seen.has(depId)) {
                return
            }
            seen.add(depId)
        }
        if (isA) {
            i = val.length
            while (i--) {
                _traverse(val[i], seen)
            }
        } else {
            keys = Object.keys(val)
            i = keys.length
            while (i--) {
                _traverse(val[keys[i]], seen)
            }
        }
    }

    /*  */

    var sharedPropertyDefinition = {
        enumerable: true,
        configurable: true,
        get: noop,
        set: noop
    }

    function proxy(target, sourceKey, key) {
        sharedPropertyDefinition.get = function proxyGetter() {
            return this[sourceKey][key]
        }
        sharedPropertyDefinition.set = function proxySetter(val) {
            this[sourceKey][key] = val
        }
        Object.defineProperty(target, key, sharedPropertyDefinition)
    }

    function initState(vm) {
        vm._watchers = []
        var opts = vm.$options
        if (opts.props) {
            initProps(vm, opts.props)
        }
        if (opts.methods) {
            initMethods(vm, opts.methods)
        }
        if (opts.data) {
            initData(vm)
        } else {
            observe((vm._data = {}), true /* asRootData */)
        }
        if (opts.computed) {
            initComputed(vm, opts.computed)
        }
        if (opts.watch && opts.watch !== nativeWatch) {
            initWatch(vm, opts.watch)
        }
    }

    function checkOptionType(vm, name) {
        var option = vm.$options[name]
        if (!isPlainObject(option)) {
            warn('component option "' + name + '" should be an object.', vm)
        }
    }

    function initProps(vm, propsOptions) {
        var propsData = vm.$options.propsData || {}
        var props = (vm._props = {})
        // cache prop keys so that future props updates can iterate using Array
        // instead of dynamic object key enumeration.
        var keys = (vm.$options._propKeys = [])
        var isRoot = !vm.$parent
        // root instance props should be converted
        observerState.shouldConvert = isRoot
        var loop = function(key) {
            keys.push(key)
            var value = validateProp(key, propsOptions, propsData, vm)
            /* istanbul ignore else */
            {
                defineReactive$$1(props, key, value)
            }
            // static props are already proxied on the component's prototype
            // during Vue.extend(). We only need to proxy props defined at
            // instantiation here.
            if (!(key in vm)) {
                proxy(vm, "_props", key)
            }
        }

        for (var key in propsOptions) loop(key)
        observerState.shouldConvert = true
    }

    function initData(vm) {
        var data = vm.$options.data
        data = vm._data = typeof data === "function" ? getData(data, vm) : data || {}
        if (!isPlainObject(data)) {
            data = {}
             false &&
                false
        }
        // proxy data on instance
        var keys = Object.keys(data)
        var props = vm.$options.props
        var methods = vm.$options.methods
        var i = keys.length
        while (i--) {
            var key = keys[i]
            if (props && hasOwn(props, key)) {
                 false &&
                    false
            } else if (!isReserved(key)) {
                proxy(vm, "_data", key)
            }
        }
        // observe data
        observe(data, true /* asRootData */)
    }

    function getData(data, vm) {
        try {
            return data.call(vm)
        } catch (e) {
            handleError(e, vm, "data()")
            return {}
        }
    }

    var computedWatcherOptions = {
        lazy: true
    }

    function initComputed(vm, computed) {
         false && false
        var watchers = (vm._computedWatchers = Object.create(null))

        for (var key in computed) {
            var userDef = computed[key]
            var getter = typeof userDef === "function" ? userDef : userDef.get
            watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions)

            // component-defined computed properties are already defined on the
            // component prototype. We only need to define computed properties defined
            // at instantiation here.
            if (!(key in vm)) {
                defineComputed(vm, key, userDef)
            } else {
            }
        }
    }

    function defineComputed(target, key, userDef) {
        if (typeof userDef === "function") {
            sharedPropertyDefinition.get = createComputedGetter(key)
            sharedPropertyDefinition.set = noop
        } else {
            sharedPropertyDefinition.get = userDef.get
                ? userDef.cache !== false
                    ? createComputedGetter(key)
                    : userDef.get
                : noop
            sharedPropertyDefinition.set = userDef.set ? userDef.set : noop
        }
        Object.defineProperty(target, key, sharedPropertyDefinition)
    }

    function createComputedGetter(key) {
        return function computedGetter() {
            var watcher = this._computedWatchers && this._computedWatchers[key]
            if (watcher) {
                if (watcher.dirty) {
                    watcher.evaluate()
                }
                if (Dep.target) {
                    watcher.depend()
                }
                return watcher.value
            }
        }
    }

    function initMethods(vm, methods) {
         false && false
        var props = vm.$options.props
        for (var key in methods) {
            vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
        }
    }

    function initWatch(vm, watch) {
         false && false
        for (var key in watch) {
            var handler = watch[key]
            if (Array.isArray(handler)) {
                for (var i = 0; i < handler.length; i++) {
                    createWatcher(vm, key, handler[i])
                }
            } else {
                createWatcher(vm, key, handler)
            }
        }
    }

    function createWatcher(vm, keyOrFn, handler, options) {
        if (isPlainObject(handler)) {
            options = handler
            handler = handler.handler
        }
        if (typeof handler === "string") {
            handler = vm[handler]
        }
        return vm.$watch(keyOrFn, handler, options)
    }

    function stateMixin(Vue) {
        // flow somehow has problems with directly declared definition object
        // when using Object.defineProperty, so we have to procedurally build up
        // the object here.
        var dataDef = {}
        dataDef.get = function() {
            return this._data
        }
        var propsDef = {}
        propsDef.get = function() {
            return this._props
        }
        Object.defineProperty(Vue.prototype, "$data", dataDef)
        Object.defineProperty(Vue.prototype, "$props", propsDef)

        Vue.prototype.$set = set
        Vue.prototype.$delete = del

        Vue.prototype.$watch = function(expOrFn, cb, options) {
            var vm = this
            if (isPlainObject(cb)) {
                return createWatcher(vm, expOrFn, cb, options)
            }
            options = options || {}
            options.user = true
            var watcher = new Watcher(vm, expOrFn, cb, options)
            if (options.immediate) {
                cb.call(vm, watcher.value)
            }
            return function unwatchFn() {
                watcher.teardown()
            }
        }
    }

    /*  */

    function initProvide(vm) {
        var provide = vm.$options.provide
        if (provide) {
            vm._provided = typeof provide === "function" ? provide.call(vm) : provide
        }
    }

    function initInjections(vm) {
        var result = resolveInject(vm.$options.inject, vm)
        if (result) {
            observerState.shouldConvert = false
            Object.keys(result).forEach(function(key) {
                /* istanbul ignore else */
                {
                    defineReactive$$1(vm, key, result[key])
                }
            })
            observerState.shouldConvert = true
        }
    }

    function resolveInject(inject, vm) {
        if (inject) {
            // inject is :any because flow is not smart enough to figure out cached
            var result = Object.create(null)
            var keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject)

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i]
                var provideKey = inject[key]
                var source = vm
                while (source) {
                    if (source._provided && provideKey in source._provided) {
                        result[key] = source._provided[provideKey]
                        break
                    }
                    source = source.$parent
                }
                if (false) {}
            }
            return result
        }
    }

    /*  */

    function createFunctionalComponent(Ctor, propsData, data, context, children) {
        var props = {}
        var propOptions = Ctor.options.props
        if (isDef(propOptions)) {
            for (var key in propOptions) {
                props[key] = validateProp(key, propOptions, propsData || {})
            }
        } else {
            if (isDef(data.attrs)) {
                mergeProps(props, data.attrs)
            }
            if (isDef(data.props)) {
                mergeProps(props, data.props)
            }
        }
        // ensure the createElement function in functional components
        // gets a unique context - this is necessary for correct named slot check
        var _context = Object.create(context)
        var h = function(a, b, c, d) {
            return createElement(_context, a, b, c, d, true)
        }
        var vnode = Ctor.options.render.call(null, h, {
            data: data,
            props: props,
            children: children,
            parent: context,
            listeners: data.on || {},
            injections: resolveInject(Ctor.options.inject, context),
            slots: function() {
                return resolveSlots(children, context)
            }
        })
        if (vnode instanceof VNode) {
            vnode.functionalContext = context
            vnode.functionalOptions = Ctor.options
            if (data.slot) {
                ;(vnode.data || (vnode.data = {})).slot = data.slot
            }
        }
        return vnode
    }

    function mergeProps(to, from) {
        for (var key in from) {
            to[camelize(key)] = from[key]
        }
    }

    /*  */

    // hooks to be invoked on component VNodes during patch
    var componentVNodeHooks = {
        init: function init(vnode, hydrating, parentElm, refElm) {
            if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
                var child = (vnode.componentInstance = createComponentInstanceForVnode(
                    vnode,
                    activeInstance,
                    parentElm,
                    refElm
                ))
                child.$mount(hydrating ? vnode.elm : undefined, hydrating)
            } else if (vnode.data.keepAlive) {
                // kept-alive components, treat as a patch
                var mountedNode = vnode // work around flow
                componentVNodeHooks.prepatch(mountedNode, mountedNode)
            }
        },

        prepatch: function prepatch(oldVnode, vnode) {
            var options = vnode.componentOptions
            var child = (vnode.componentInstance = oldVnode.componentInstance)
            updateChildComponent(
                child,
                options.propsData, // updated props
                options.listeners, // updated listeners
                vnode, // new parent vnode
                options.children // new children
            )
        },

        insert: function insert(vnode) {
            var context = vnode.context
            var componentInstance = vnode.componentInstance

            if (!componentInstance._isMounted) {
                componentInstance._isMounted = true
                callHook(componentInstance, "mounted")
            }
            if (vnode.data.keepAlive) {
                if (context._isMounted) {
                    // vue-router#1212
                    // During updates, a kept-alive component's child components may
                    // change, so directly walking the tree here may call activated hooks
                    // on incorrect children. Instead we push them into a queue which will
                    // be processed after the whole patch process ended.
                    queueActivatedComponent(componentInstance)
                } else {
                    activateChildComponent(componentInstance, true /* direct */)
                }
            }
        },

        destroy: function destroy(vnode) {
            var componentInstance = vnode.componentInstance
            if (!componentInstance._isDestroyed) {
                if (!vnode.data.keepAlive) {
                    componentInstance.$destroy()
                } else {
                    deactivateChildComponent(componentInstance, true /* direct */)
                }
            }
        }
    }

    var hooksToMerge = Object.keys(componentVNodeHooks)

    function createComponent(Ctor, data, context, children, tag) {
        if (isUndef(Ctor)) {
            return
        }

        var baseCtor = context.$options._base

        // plain options object: turn it into a constructor
        if (isObject(Ctor)) {
            Ctor = baseCtor.extend(Ctor)
        }

        // if at this stage it's not a constructor or an async component factory,
        // reject.
        if (typeof Ctor !== "function") {
            return
        }

        // async component
        var asyncFactory
        if (isUndef(Ctor.cid)) {
            asyncFactory = Ctor
            Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
            if (Ctor === undefined) {
                // return a placeholder node for async component, which is rendered
                // as a comment node but preserves all the raw information for the node.
                // the information will be used for async server-rendering and hydration.
                return createAsyncPlaceholder(asyncFactory, data, context, children, tag)
            }
        }

        data = data || {}

        // resolve constructor options in case global mixins are applied after
        // component constructor creation
        resolveConstructorOptions(Ctor)

        // transform component v-model data into props & events
        if (isDef(data.model)) {
            transformModel(Ctor.options, data)
        }

        // extract props
        var propsData = extractPropsFromVNodeData(data, Ctor, tag)

        // functional component
        if (isTrue(Ctor.options.functional)) {
            return createFunctionalComponent(Ctor, propsData, data, context, children)
        }

        // keep listeners
        var listeners = data.on

        if (isTrue(Ctor.options.abstract)) {
            // abstract components do not keep anything
            // other than props & listeners & slot

            // work around flow
            var slot = data.slot
            data = {}
            if (slot) {
                data.slot = slot
            }
        }

        // merge component management hooks onto the placeholder node
        mergeHooks(data)

        // return a placeholder vnode
        var name = Ctor.options.name || tag
        var vnode = new VNode(
            "vue-component-" + Ctor.cid + (name ? "-" + name : ""),
            data,
            undefined,
            undefined,
            undefined,
            context,
            {
                Ctor: Ctor,
                propsData: propsData,
                listeners: listeners,
                tag: tag,
                children: children
            },
            asyncFactory
        )
        return vnode
    }

    function createComponentInstanceForVnode(
        vnode, // we know it's MountedComponentVNode but flow doesn't
        parent, // activeInstance in lifecycle state
        parentElm,
        refElm
    ) {
        var vnodeComponentOptions = vnode.componentOptions
        var options = {
            _isComponent: true,
            parent: parent,
            propsData: vnodeComponentOptions.propsData,
            _componentTag: vnodeComponentOptions.tag,
            _parentVnode: vnode,
            _parentListeners: vnodeComponentOptions.listeners,
            _renderChildren: vnodeComponentOptions.children,
            _parentElm: parentElm || null,
            _refElm: refElm || null
        }
        // check inline-template render functions
        var inlineTemplate = vnode.data.inlineTemplate
        if (isDef(inlineTemplate)) {
            options.render = inlineTemplate.render
            options.staticRenderFns = inlineTemplate.staticRenderFns
        }
        return new vnodeComponentOptions.Ctor(options)
    }

    function mergeHooks(data) {
        if (!data.hook) {
            data.hook = {}
        }
        for (var i = 0; i < hooksToMerge.length; i++) {
            var key = hooksToMerge[i]
            var fromParent = data.hook[key]
            var ours = componentVNodeHooks[key]
            data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours
        }
    }

    function mergeHook$1(one, two) {
        return function(a, b, c, d) {
            one(a, b, c, d)
            two(a, b, c, d)
        }
    }

    // transform component v-model info (value and callback) into
    // prop and event handler respectively.
    function transformModel(options, data) {
        var prop = (options.model && options.model.prop) || "value"
        var event = (options.model && options.model.event) || "input"
        ;(data.props || (data.props = {}))[prop] = data.model.value
        var on = data.on || (data.on = {})
        if (isDef(on[event])) {
            on[event] = [data.model.callback].concat(on[event])
        } else {
            on[event] = data.model.callback
        }
    }

    /*  */

    var SIMPLE_NORMALIZE = 1
    var ALWAYS_NORMALIZE = 2

    // wrapper function for providing a more flexible interface
    // without getting yelled at by flow
    function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
        if (Array.isArray(data) || isPrimitive(data)) {
            normalizationType = children
            children = data
            data = undefined
        }
        if (isTrue(alwaysNormalize)) {
            normalizationType = ALWAYS_NORMALIZE
        }
        return _createElement(context, tag, data, children, normalizationType)
    }

    function _createElement(context, tag, data, children, normalizationType) {
        if (isDef(data) && isDef(data.__ob__)) {
             false &&
                false
            return createEmptyVNode()
        }
        // object syntax in v-bind
        if (isDef(data) && isDef(data.is)) {
            tag = data.is
        }
        if (!tag) {
            // in case of component :is set to falsy value
            return createEmptyVNode()
        }
        // warn against non-primitive key
        if (
            false
        ) {}
        // support single function children as default scoped slot
        if (Array.isArray(children) && typeof children[0] === "function") {
            data = data || {}
            data.scopedSlots = {
                default: children[0]
            }
            children.length = 0
        }
        if (normalizationType === ALWAYS_NORMALIZE) {
            children = normalizeChildren(children)
        } else if (normalizationType === SIMPLE_NORMALIZE) {
            children = simpleNormalizeChildren(children)
        }
        var vnode, ns
        if (typeof tag === "string") {
            var Ctor
            ns = config.getTagNamespace(tag)
            if (config.isReservedTag(tag)) {
                // platform built-in elements
                vnode = new VNode(
                    config.parsePlatformTagName(tag),
                    data,
                    children,
                    undefined,
                    undefined,
                    context
                )
            } else if (isDef((Ctor = resolveAsset(context.$options, "components", tag)))) {
                // component
                vnode = createComponent(Ctor, data, context, children, tag)
            } else {
                // unknown or unlisted namespaced elements
                // check at runtime because it may get assigned a namespace when its
                // parent normalizes children
                vnode = new VNode(tag, data, children, undefined, undefined, context)
            }
        } else {
            // direct component options / constructor
            vnode = createComponent(tag, data, context, children)
        }
        if (isDef(vnode)) {
            if (ns) {
                applyNS(vnode, ns)
            }
            return vnode
        } else {
            return createEmptyVNode()
        }
    }

    function applyNS(vnode, ns) {
        vnode.ns = ns
        if (vnode.tag === "foreignObject") {
            // use default namespace inside foreignObject
            return
        }
        if (isDef(vnode.children)) {
            for (var i = 0, l = vnode.children.length; i < l; i++) {
                var child = vnode.children[i]
                if (isDef(child.tag) && isUndef(child.ns)) {
                    applyNS(child, ns)
                }
            }
        }
    }

    /*  */

    /**
     * Runtime helper for rendering v-for lists.
     */
    function renderList(val, render) {
        var ret, i, l, keys, key
        if (Array.isArray(val) || typeof val === "string") {
            ret = new Array(val.length)
            for (i = 0, l = val.length; i < l; i++) {
                ret[i] = render(val[i], i)
            }
        } else if (typeof val === "number") {
            ret = new Array(val)
            for (i = 0; i < val; i++) {
                ret[i] = render(i + 1, i)
            }
        } else if (isObject(val)) {
            keys = Object.keys(val)
            ret = new Array(keys.length)
            for (i = 0, l = keys.length; i < l; i++) {
                key = keys[i]
                ret[i] = render(val[key], key, i)
            }
        }
        if (isDef(ret)) {
            ret._isVList = true
        }
        return ret
    }

    /*  */

    /**
     * Runtime helper for rendering <slot>
     */
    function renderSlot(name, fallback, props, bindObject) {
        var scopedSlotFn = this.$scopedSlots[name]
        if (scopedSlotFn) {
            // scoped slot
            props = props || {}
            if (bindObject) {
                props = extend(extend({}, bindObject), props)
            }
            return scopedSlotFn(props) || fallback
        } else {
            var slotNodes = this.$slots[name]
            // warn duplicate slot usage
            if (slotNodes && "production" !== "production") {
                slotNodes._rendered &&
                    warn(
                        'Duplicate presence of slot "' +
                            name +
                            '" found in the same render tree ' +
                            "- this will likely cause render errors.",
                        this
                    )
                slotNodes._rendered = true
            }
            return slotNodes || fallback
        }
    }

    /*  */

    /**
     * Runtime helper for resolving filters
     */
    function resolveFilter(id) {
        return resolveAsset(this.$options, "filters", id, true) || identity
    }

    /*  */

    /**
     * Runtime helper for checking keyCodes from config.
     */
    function checkKeyCodes(eventKeyCode, key, builtInAlias) {
        var keyCodes = config.keyCodes[key] || builtInAlias
        if (Array.isArray(keyCodes)) {
            return keyCodes.indexOf(eventKeyCode) === -1
        } else {
            return keyCodes !== eventKeyCode
        }
    }

    /*  */

    /**
     * Runtime helper for merging v-bind="object" into a VNode's data.
     */
    function bindObjectProps(data, tag, value, asProp, isSync) {
        if (value) {
            if (!isObject(value)) {
                 false &&
                    false
            } else {
                if (Array.isArray(value)) {
                    value = toObject(value)
                }
                var hash
                var loop = function(key) {
                    if (key === "class" || key === "style" || isReservedAttribute(key)) {
                        hash = data
                    } else {
                        var type = data.attrs && data.attrs.type
                        hash =
                            asProp || config.mustUseProp(tag, type, key)
                                ? data.domProps || (data.domProps = {})
                                : data.attrs || (data.attrs = {})
                    }
                    if (!(key in hash)) {
                        hash[key] = value[key]

                        if (isSync) {
                            var on = data.on || (data.on = {})
                            on["update:" + key] = function($event) {
                                value[key] = $event
                            }
                        }
                    }
                }

                for (var key in value) loop(key)
            }
        }
        return data
    }

    /*  */

    /**
     * Runtime helper for rendering static trees.
     */
    function renderStatic(index, isInFor) {
        var tree = this._staticTrees[index]
        // if has already-rendered static tree and not inside v-for,
        // we can reuse the same tree by doing a shallow clone.
        if (tree && !isInFor) {
            return Array.isArray(tree) ? cloneVNodes(tree) : cloneVNode(tree)
        }
        // otherwise, render a fresh tree.
        tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(
            this._renderProxy
        )
        markStatic(tree, "__static__" + index, false)
        return tree
    }

    /**
     * Runtime helper for v-once.
     * Effectively it means marking the node as static with a unique key.
     */
    function markOnce(tree, index, key) {
        markStatic(tree, "__once__" + index + (key ? "_" + key : ""), true)
        return tree
    }

    function markStatic(tree, key, isOnce) {
        if (Array.isArray(tree)) {
            for (var i = 0; i < tree.length; i++) {
                if (tree[i] && typeof tree[i] !== "string") {
                    markStaticNode(tree[i], key + "_" + i, isOnce)
                }
            }
        } else {
            markStaticNode(tree, key, isOnce)
        }
    }

    function markStaticNode(node, key, isOnce) {
        node.isStatic = true
        node.key = key
        node.isOnce = isOnce
    }

    /*  */

    function bindObjectListeners(data, value) {
        if (value) {
            if (!isPlainObject(value)) {
                 false &&
                    false
            } else {
                var on = (data.on = data.on ? extend({}, data.on) : {})
                for (var key in value) {
                    var existing = on[key]
                    var ours = value[key]
                    on[key] = existing ? [].concat(ours, existing) : ours
                }
            }
        }
        return data
    }

    /*  */

    function initRender(vm) {
        vm._vnode = null // the root of the child tree
        vm._staticTrees = null
        var parentVnode = (vm.$vnode = vm.$options._parentVnode) // the placeholder node in parent tree
        var renderContext = parentVnode && parentVnode.context
        vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext)
        vm.$scopedSlots = emptyObject
        // bind the createElement fn to this instance
        // so that we get proper render context inside it.
        // args order: tag, data, children, normalizationType, alwaysNormalize
        // internal version is used by render functions compiled from templates
        vm._c = function(a, b, c, d) {
            return createElement(vm, a, b, c, d, false)
        }
        // normalization is always applied for the public version, used in
        // user-written render functions.
        vm.$createElement = function(a, b, c, d) {
            return createElement(vm, a, b, c, d, true)
        }

        // $attrs & $listeners are exposed for easier HOC creation.
        // they need to be reactive so that HOCs using them are always updated
        var parentData = parentVnode && parentVnode.data
        /* istanbul ignore else */
        {
            defineReactive$$1(vm, "$attrs", parentData && parentData.attrs, null, true)
            defineReactive$$1(vm, "$listeners", parentData && parentData.on, null, true)
        }
    }

    function renderMixin(Vue) {
        Vue.prototype.$nextTick = function(fn) {
            return nextTick(fn, this)
        }

        Vue.prototype._render = function() {
            var vm = this
            var ref = vm.$options
            var render = ref.render
            var staticRenderFns = ref.staticRenderFns
            var _parentVnode = ref._parentVnode

            if (vm._isMounted) {
                // clone slot nodes on re-renders
                for (var key in vm.$slots) {
                    vm.$slots[key] = cloneVNodes(vm.$slots[key])
                }
            }

            vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject

            if (staticRenderFns && !vm._staticTrees) {
                vm._staticTrees = []
            }
            // set parent vnode. this allows render functions to have access
            // to the data on the placeholder node.
            vm.$vnode = _parentVnode
            // render self
            var vnode
            try {
                vnode = render.call(vm._renderProxy, vm.$createElement)
            } catch (e) {
                handleError(e, vm, "render function")
                // return error render result,
                // or previous vnode to prevent render error causing blank component
                /* istanbul ignore else */
                {
                    vnode = vm._vnode
                }
            }
            // return empty vnode in case the render function errored out
            if (!(vnode instanceof VNode)) {
                if (false) {}
                vnode = createEmptyVNode()
            }
            // set parent
            vnode.parent = _parentVnode
            return vnode
        }

        // internal render helpers.
        // these are exposed on the instance prototype to reduce generated render
        // code size.
        Vue.prototype._o = markOnce
        Vue.prototype._n = toNumber
        Vue.prototype._s = toString
        Vue.prototype._l = renderList
        Vue.prototype._t = renderSlot
        Vue.prototype._q = looseEqual
        Vue.prototype._i = looseIndexOf
        Vue.prototype._m = renderStatic
        Vue.prototype._f = resolveFilter
        Vue.prototype._k = checkKeyCodes
        Vue.prototype._b = bindObjectProps
        Vue.prototype._v = createTextVNode
        Vue.prototype._e = createEmptyVNode
        Vue.prototype._u = resolveScopedSlots
        Vue.prototype._g = bindObjectListeners
    }

    /*  */

    var uid = 0

    function initMixin(Vue) {
        Vue.prototype._init = function(options) {
            var vm = this
            // a uid
            vm._uid = uid++

            var startTag, endTag
            /* istanbul ignore if */
            if (false) {}

            // a flag to avoid this being observed
            vm._isVue = true
            // merge options
            if (options && options._isComponent) {
                // optimize internal component instantiation
                // since dynamic options merging is pretty slow, and none of the
                // internal component options needs special treatment.
                initInternalComponent(vm, options)
            } else {
                vm.$options = mergeOptions(
                    resolveConstructorOptions(vm.constructor),
                    options || {},
                    vm
                )
            }
            /* istanbul ignore else */
            {
                vm._renderProxy = vm
            }
            // expose real self
            vm._self = vm
            initLifecycle(vm)
            initEvents(vm)
            initRender(vm)
            callHook(vm, "beforeCreate")
            initInjections(vm) // resolve injections before data/props
            initState(vm)
            initProvide(vm) // resolve provide after data/props
            callHook(vm, "created")

            /* istanbul ignore if */
            if (false) {}

            if (vm.$options.el) {
                vm.$mount(vm.$options.el)
            }
        }
    }

    function initInternalComponent(vm, options) {
        var opts = (vm.$options = Object.create(vm.constructor.options))
        // doing this because it's faster than dynamic enumeration.
        opts.parent = options.parent
        opts.propsData = options.propsData
        opts._parentVnode = options._parentVnode
        opts._parentListeners = options._parentListeners
        opts._renderChildren = options._renderChildren
        opts._componentTag = options._componentTag
        opts._parentElm = options._parentElm
        opts._refElm = options._refElm
        if (options.render) {
            opts.render = options.render
            opts.staticRenderFns = options.staticRenderFns
        }
    }

    function resolveConstructorOptions(Ctor) {
        var options = Ctor.options
        if (Ctor.super) {
            var superOptions = resolveConstructorOptions(Ctor.super)
            var cachedSuperOptions = Ctor.superOptions
            if (superOptions !== cachedSuperOptions) {
                // super option changed,
                // need to resolve new options.
                Ctor.superOptions = superOptions
                // check if there are any late-modified/attached options (#4976)
                var modifiedOptions = resolveModifiedOptions(Ctor)
                // update base extend options
                if (modifiedOptions) {
                    extend(Ctor.extendOptions, modifiedOptions)
                }
                options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
                if (options.name) {
                    options.components[options.name] = Ctor
                }
            }
        }
        return options
    }

    function resolveModifiedOptions(Ctor) {
        var modified
        var latest = Ctor.options
        var extended = Ctor.extendOptions
        var sealed = Ctor.sealedOptions
        for (var key in latest) {
            if (latest[key] !== sealed[key]) {
                if (!modified) {
                    modified = {}
                }
                modified[key] = dedupe(latest[key], extended[key], sealed[key])
            }
        }
        return modified
    }

    function dedupe(latest, extended, sealed) {
        // compare latest and sealed to ensure lifecycle hooks won't be duplicated
        // between merges
        if (Array.isArray(latest)) {
            var res = []
            sealed = Array.isArray(sealed) ? sealed : [sealed]
            extended = Array.isArray(extended) ? extended : [extended]
            for (var i = 0; i < latest.length; i++) {
                // push original options and not sealed options to exclude duplicated options
                if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
                    res.push(latest[i])
                }
            }
            return res
        } else {
            return latest
        }
    }

    function Vue$3(options) {
        if (false) {}
        this._init(options)
    }

    initMixin(Vue$3)
    stateMixin(Vue$3)
    eventsMixin(Vue$3)
    lifecycleMixin(Vue$3)
    renderMixin(Vue$3)

    /*  */

    function initUse(Vue) {
        Vue.use = function(plugin) {
            var installedPlugins = this._installedPlugins || (this._installedPlugins = [])
            if (installedPlugins.indexOf(plugin) > -1) {
                return this
            }

            // additional parameters
            var args = toArray(arguments, 1)
            args.unshift(this)
            if (typeof plugin.install === "function") {
                plugin.install.apply(plugin, args)
            } else if (typeof plugin === "function") {
                plugin.apply(null, args)
            }
            installedPlugins.push(plugin)
            return this
        }
    }

    /*  */

    function initMixin$1(Vue) {
        Vue.mixin = function(mixin) {
            this.options = mergeOptions(this.options, mixin)
            return this
        }
    }

    /*  */

    function initExtend(Vue) {
        /**
         * Each instance constructor, including Vue, has a unique
         * cid. This enables us to create wrapped "child
         * constructors" for prototypal inheritance and cache them.
         */
        Vue.cid = 0
        var cid = 1

        /**
         * Class inheritance
         */
        Vue.extend = function(extendOptions) {
            extendOptions = extendOptions || {}
            var Super = this
            var SuperId = Super.cid
            var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
            if (cachedCtors[SuperId]) {
                return cachedCtors[SuperId]
            }

            var name = extendOptions.name || Super.options.name
            var Sub = function VueComponent(options) {
                this._init(options)
            }
            Sub.prototype = Object.create(Super.prototype)
            Sub.prototype.constructor = Sub
            Sub.cid = cid++
            Sub.options = mergeOptions(Super.options, extendOptions)
            Sub["super"] = Super

            // For props and computed properties, we define the proxy getters on
            // the Vue instances at extension time, on the extended prototype. This
            // avoids Object.defineProperty calls for each instance created.
            if (Sub.options.props) {
                initProps$1(Sub)
            }
            if (Sub.options.computed) {
                initComputed$1(Sub)
            }

            // allow further extension/mixin/plugin usage
            Sub.extend = Super.extend
            Sub.mixin = Super.mixin
            Sub.use = Super.use

            // create asset registers, so extended classes
            // can have their private assets too.
            ASSET_TYPES.forEach(function(type) {
                Sub[type] = Super[type]
            })
            // enable recursive self-lookup
            if (name) {
                Sub.options.components[name] = Sub
            }

            // keep a reference to the super options at extension time.
            // later at instantiation we can check if Super's options have
            // been updated.
            Sub.superOptions = Super.options
            Sub.extendOptions = extendOptions
            Sub.sealedOptions = extend({}, Sub.options)

            // cache constructor
            cachedCtors[SuperId] = Sub
            return Sub
        }
    }

    function initProps$1(Comp) {
        var props = Comp.options.props
        for (var key in props) {
            proxy(Comp.prototype, "_props", key)
        }
    }

    function initComputed$1(Comp) {
        var computed = Comp.options.computed
        for (var key in computed) {
            defineComputed(Comp.prototype, key, computed[key])
        }
    }

    /*  */

    function initAssetRegisters(Vue) {
        /**
         * Create asset registration methods.
         */
        ASSET_TYPES.forEach(function(type) {
            Vue[type] = function(id, definition) {
                if (!definition) {
                    return this.options[type + "s"][id]
                } else {
                    /* istanbul ignore if */
                    if (type === "component" && isPlainObject(definition)) {
                        definition.name = definition.name || id
                        definition = this.options._base.extend(definition)
                    }
                    if (type === "directive" && typeof definition === "function") {
                        definition = {
                            bind: definition,
                            update: definition
                        }
                    }
                    this.options[type + "s"][id] = definition
                    return definition
                }
            }
        })
    }

    /*  */

    var patternTypes = [String, RegExp, Array]

    function getComponentName(opts) {
        return opts && (opts.Ctor.options.name || opts.tag)
    }

    function matches(pattern, name) {
        if (Array.isArray(pattern)) {
            return pattern.indexOf(name) > -1
        } else if (typeof pattern === "string") {
            return pattern.split(",").indexOf(name) > -1
        } else if (isRegExp(pattern)) {
            return pattern.test(name)
        }
        /* istanbul ignore next */
        return false
    }

    function pruneCache(cache, current, filter) {
        for (var key in cache) {
            var cachedNode = cache[key]
            if (cachedNode) {
                var name = getComponentName(cachedNode.componentOptions)
                if (name && !filter(name)) {
                    if (cachedNode !== current) {
                        pruneCacheEntry(cachedNode)
                    }
                    cache[key] = null
                }
            }
        }
    }

    function pruneCacheEntry(vnode) {
        if (vnode) {
            vnode.componentInstance.$destroy()
        }
    }

    var KeepAlive = {
        name: "keep-alive",
        abstract: true,

        props: {
            include: patternTypes,
            exclude: patternTypes
        },

        created: function created() {
            this.cache = Object.create(null)
        },

        destroyed: function destroyed() {
            var this$1 = this

            for (var key in this$1.cache) {
                pruneCacheEntry(this$1.cache[key])
            }
        },

        watch: {
            include: function include(val) {
                pruneCache(this.cache, this._vnode, function(name) {
                    return matches(val, name)
                })
            },
            exclude: function exclude(val) {
                pruneCache(this.cache, this._vnode, function(name) {
                    return !matches(val, name)
                })
            }
        },

        render: function render() {
            var vnode = getFirstComponentChild(this.$slots.default)
            var componentOptions = vnode && vnode.componentOptions
            if (componentOptions) {
                // check pattern
                var name = getComponentName(componentOptions)
                if (
                    name &&
                    ((this.include && !matches(this.include, name)) ||
                        (this.exclude && matches(this.exclude, name)))
                ) {
                    return vnode
                }
                var key =
                    vnode.key == null
                        ? // same constructor may get registered as different local components
                          // so cid alone is not enough (#3269)
                          componentOptions.Ctor.cid +
                          (componentOptions.tag ? "::" + componentOptions.tag : "")
                        : vnode.key
                if (this.cache[key]) {
                    vnode.componentInstance = this.cache[key].componentInstance
                } else {
                    this.cache[key] = vnode
                }
                vnode.data.keepAlive = true
            }
            return vnode
        }
    }

    var builtInComponents = {
        KeepAlive: KeepAlive
    }

    /*  */

    function initGlobalAPI(Vue) {
        // config
        var configDef = {}
        configDef.get = function() {
            return config
        }
        Object.defineProperty(Vue, "config", configDef)

        // exposed util methods.
        // NOTE: these are not considered part of the public API - avoid relying on
        // them unless you are aware of the risk.
        Vue.util = {
            warn: warn,
            extend: extend,
            mergeOptions: mergeOptions,
            defineReactive: defineReactive$$1
        }

        Vue.set = set
        Vue.delete = del
        Vue.nextTick = nextTick

        Vue.options = Object.create(null)
        ASSET_TYPES.forEach(function(type) {
            Vue.options[type + "s"] = Object.create(null)
        })

        // this is used to identify the "base" constructor to extend all plain-object
        // components with in Weex's multi-instance scenarios.
        Vue.options._base = Vue

        extend(Vue.options.components, builtInComponents)

        initUse(Vue)
        initMixin$1(Vue)
        initExtend(Vue)
        initAssetRegisters(Vue)
    }

    initGlobalAPI(Vue$3)

    Object.defineProperty(Vue$3.prototype, "$isServer", {
        get: isServerRendering
    })

    Object.defineProperty(Vue$3.prototype, "$ssrContext", {
        get: function get() {
            /* istanbul ignore next */
            return this.$vnode && this.$vnode.ssrContext
        }
    })

    Vue$3.version = "2.4.1"
    Vue$3.mpvueVersion = "1.0.12"

    /* globals renderer */

    var isReservedTag = makeMap(
        "template,script,style,element,content,slot,link,meta,svg,view," +
            "a,div,img,image,text,span,richtext,input,switch,textarea,spinner,select," +
            "slider,slider-neighbor,indicator,trisition,trisition-group,canvas," +
            "list,cell,header,loading,loading-indicator,refresh,scrollable,scroller," +
            "video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown",
        true
    )

    // these are reserved for web because they are directly compiled away
    // during template compilation
    var isReservedAttr = makeMap("style,class")

    // Elements that you can, intentionally, leave open (and which close themselves)
    // more flexable than web
    var canBeLeftOpenTag = makeMap(
        "web,spinner,switch,video,textarea,canvas," + "indicator,marquee,countdown",
        true
    )

    var isUnaryTag = makeMap("embed,img,image,input,link,meta", true)

    function mustUseProp() {
        /* console.log('mustUseProp') */
    }

    function getTagNamespace() {
        /* console.log('getTagNamespace') */
    }

    function isUnknownElement() {
        /* console.log('isUnknownElement') */
    }

    function getComKey(vm) {
        return vm && vm.$attrs ? vm.$attrs["mpcomid"] : "0"
    }

    // 用于小程序的 event type 到 web 的 event
    var eventTypeMap = {
        tap: ["tap", "click"],
        touchstart: ["touchstart"],
        touchmove: ["touchmove"],
        touchcancel: ["touchcancel"],
        touchend: ["touchend"],
        longtap: ["longtap"],
        input: ["input"],
        blur: ["change", "blur"],
        submit: ["submit"],
        focus: ["focus"],
        scrolltoupper: ["scrolltoupper"],
        scrolltolower: ["scrolltolower"],
        scroll: ["scroll"]
    }

    /*  */

    // import { namespaceMap } from 'mp/util/index'

    var obj = {}

    function createElement$1(tagName, vnode) {
        return obj
    }

    function createElementNS(namespace, tagName) {
        return obj
    }

    function createTextNode(text) {
        return obj
    }

    function createComment(text) {
        return obj
    }

    function insertBefore(parentNode, newNode, referenceNode) {}

    function removeChild(node, child) {}

    function appendChild(node, child) {}

    function parentNode(node) {
        return obj
    }

    function nextSibling(node) {
        return obj
    }

    function tagName(node) {
        return "div"
    }

    function setTextContent(node, text) {
        return obj
    }

    function setAttribute(node, key, val) {
        return obj
    }

    var nodeOps = Object.freeze({
        createElement: createElement$1,
        createElementNS: createElementNS,
        createTextNode: createTextNode,
        createComment: createComment,
        insertBefore: insertBefore,
        removeChild: removeChild,
        appendChild: appendChild,
        parentNode: parentNode,
        nextSibling: nextSibling,
        tagName: tagName,
        setTextContent: setTextContent,
        setAttribute: setAttribute
    })

    /*  */

    var ref = {
        create: function create(_, vnode) {
            registerRef(vnode)
        },
        update: function update(oldVnode, vnode) {
            if (oldVnode.data.ref !== vnode.data.ref) {
                registerRef(oldVnode, true)
                registerRef(vnode)
            }
        },
        destroy: function destroy(vnode) {
            registerRef(vnode, true)
        }
    }

    function registerRef(vnode, isRemoval) {
        var key = vnode.data.ref
        if (!key) {
            return
        }

        var vm = vnode.context
        var ref = vnode.componentInstance || vnode.elm
        var refs = vm.$refs
        if (isRemoval) {
            if (Array.isArray(refs[key])) {
                remove(refs[key], ref)
            } else if (refs[key] === ref) {
                refs[key] = undefined
            }
        } else {
            if (vnode.data.refInFor) {
                if (!Array.isArray(refs[key])) {
                    refs[key] = [ref]
                } else if (refs[key].indexOf(ref) < 0) {
                    // $flow-disable-line
                    refs[key].push(ref)
                }
            } else {
                refs[key] = ref
            }
        }
    }

    /**
     * Virtual DOM patching algorithm based on Snabbdom by
     * Simon Friis Vindum (@paldepind)
     * Licensed under the MIT License
     * https://github.com/paldepind/snabbdom/blob/master/LICENSE
     *
     * modified by Evan You (@yyx990803)
     *

    /*
     * Not type-checking this because this file is perf-critical and the cost
     * of making flow understand it is not worth it.
     */

    var emptyNode = new VNode("", {}, [])

    var hooks = ["create", "activate", "update", "remove", "destroy"]

    function sameVnode(a, b) {
        return (
            a.key === b.key &&
            ((a.tag === b.tag &&
                a.isComment === b.isComment &&
                isDef(a.data) === isDef(b.data) &&
                sameInputType(a, b)) ||
                (isTrue(a.isAsyncPlaceholder) &&
                    a.asyncFactory === b.asyncFactory &&
                    isUndef(b.asyncFactory.error)))
        )
    }

    // Some browsers do not support dynamically changing type for <input>
    // so they need to be treated as different nodes
    function sameInputType(a, b) {
        if (a.tag !== "input") {
            return true
        }
        var i
        var typeA = isDef((i = a.data)) && isDef((i = i.attrs)) && i.type
        var typeB = isDef((i = b.data)) && isDef((i = i.attrs)) && i.type
        return typeA === typeB
    }

    function createKeyToOldIdx(children, beginIdx, endIdx) {
        var i, key
        var map = {}
        for (i = beginIdx; i <= endIdx; ++i) {
            key = children[i].key
            if (isDef(key)) {
                map[key] = i
            }
        }
        return map
    }

    function createPatchFunction(backend) {
        var i, j
        var cbs = {}

        var modules = backend.modules
        var nodeOps = backend.nodeOps

        for (i = 0; i < hooks.length; ++i) {
            cbs[hooks[i]] = []
            for (j = 0; j < modules.length; ++j) {
                if (isDef(modules[j][hooks[i]])) {
                    cbs[hooks[i]].push(modules[j][hooks[i]])
                }
            }
        }

        function emptyNodeAt(elm) {
            return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
        }

        function createRmCb(childElm, listeners) {
            function remove$$1() {
                if (--remove$$1.listeners === 0) {
                    removeNode(childElm)
                }
            }
            remove$$1.listeners = listeners
            return remove$$1
        }

        function removeNode(el) {
            var parent = nodeOps.parentNode(el)
            // element may have already been removed due to v-html / v-text
            if (isDef(parent)) {
                nodeOps.removeChild(parent, el)
            }
        }

        var inPre = 0

        function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested) {
            vnode.isRootInsert = !nested // for transition enter check
            if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
                return
            }

            var data = vnode.data
            var children = vnode.children
            var tag = vnode.tag
            if (isDef(tag)) {
                vnode.elm = vnode.ns
                    ? nodeOps.createElementNS(vnode.ns, tag)
                    : nodeOps.createElement(tag, vnode)
                setScope(vnode)

                /* istanbul ignore if */
                {
                    createChildren(vnode, children, insertedVnodeQueue)
                    if (isDef(data)) {
                        invokeCreateHooks(vnode, insertedVnodeQueue)
                    }
                    insert(parentElm, vnode.elm, refElm)
                }

                if (false) {}
            } else if (isTrue(vnode.isComment)) {
                vnode.elm = nodeOps.createComment(vnode.text)
                insert(parentElm, vnode.elm, refElm)
            } else {
                vnode.elm = nodeOps.createTextNode(vnode.text)
                insert(parentElm, vnode.elm, refElm)
            }
        }

        function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
            var i = vnode.data
            if (isDef(i)) {
                var isReactivated = isDef(vnode.componentInstance) && i.keepAlive
                if (isDef((i = i.hook)) && isDef((i = i.init))) {
                    i(vnode, false /* hydrating */, parentElm, refElm)
                }
                // after calling the init hook, if the vnode is a child component
                // it should've created a child instance and mounted it. the child
                // component also has set the placeholder vnode's elm.
                // in that case we can just return the element and be done.
                if (isDef(vnode.componentInstance)) {
                    initComponent(vnode, insertedVnodeQueue)
                    if (isTrue(isReactivated)) {
                        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
                    }
                    return true
                }
            }
        }

        function initComponent(vnode, insertedVnodeQueue) {
            if (isDef(vnode.data.pendingInsert)) {
                insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert)
                vnode.data.pendingInsert = null
            }
            vnode.elm = vnode.componentInstance.$el
            if (isPatchable(vnode)) {
                invokeCreateHooks(vnode, insertedVnodeQueue)
                setScope(vnode)
            } else {
                // empty component root.
                // skip all element-related modules except for ref (#3455)
                registerRef(vnode)
                // make sure to invoke the insert hook
                insertedVnodeQueue.push(vnode)
            }
        }

        function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
            var i
            // hack for #4339: a reactivated component with inner transition
            // does not trigger because the inner node's created hooks are not called
            // again. It's not ideal to involve module-specific logic in here but
            // there doesn't seem to be a better way to do it.
            var innerNode = vnode
            while (innerNode.componentInstance) {
                innerNode = innerNode.componentInstance._vnode
                if (isDef((i = innerNode.data)) && isDef((i = i.transition))) {
                    for (i = 0; i < cbs.activate.length; ++i) {
                        cbs.activate[i](emptyNode, innerNode)
                    }
                    insertedVnodeQueue.push(innerNode)
                    break
                }
            }
            // unlike a newly created component,
            // a reactivated keep-alive component doesn't insert itself
            insert(parentElm, vnode.elm, refElm)
        }

        function insert(parent, elm, ref$$1) {
            if (isDef(parent)) {
                if (isDef(ref$$1)) {
                    if (ref$$1.parentNode === parent) {
                        nodeOps.insertBefore(parent, elm, ref$$1)
                    }
                } else {
                    nodeOps.appendChild(parent, elm)
                }
            }
        }

        function createChildren(vnode, children, insertedVnodeQueue) {
            if (Array.isArray(children)) {
                for (var i = 0; i < children.length; ++i) {
                    createElm(children[i], insertedVnodeQueue, vnode.elm, null, true)
                }
            } else if (isPrimitive(vnode.text)) {
                nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text))
            }
        }

        function isPatchable(vnode) {
            while (vnode.componentInstance) {
                vnode = vnode.componentInstance._vnode
            }
            return isDef(vnode.tag)
        }

        function invokeCreateHooks(vnode, insertedVnodeQueue) {
            for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, vnode)
            }
            i = vnode.data.hook // Reuse variable
            if (isDef(i)) {
                if (isDef(i.create)) {
                    i.create(emptyNode, vnode)
                }
                if (isDef(i.insert)) {
                    insertedVnodeQueue.push(vnode)
                }
            }
        }

        // set scope id attribute for scoped CSS.
        // this is implemented as a special case to avoid the overhead
        // of going through the normal attribute patching process.
        function setScope(vnode) {
            var i
            var ancestor = vnode
            while (ancestor) {
                if (isDef((i = ancestor.context)) && isDef((i = i.$options._scopeId))) {
                    nodeOps.setAttribute(vnode.elm, i, "")
                }
                ancestor = ancestor.parent
            }
            // for slot content they should also get the scopeId from the host instance.
            if (
                isDef((i = activeInstance)) &&
                i !== vnode.context &&
                isDef((i = i.$options._scopeId))
            ) {
                nodeOps.setAttribute(vnode.elm, i, "")
            }
        }

        function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
            for (; startIdx <= endIdx; ++startIdx) {
                createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm)
            }
        }

        function invokeDestroyHook(vnode) {
            var i, j
            var data = vnode.data
            if (isDef(data)) {
                if (isDef((i = data.hook)) && isDef((i = i.destroy))) {
                    i(vnode)
                }
                for (i = 0; i < cbs.destroy.length; ++i) {
                    cbs.destroy[i](vnode)
                }
            }
            if (isDef((i = vnode.children))) {
                for (j = 0; j < vnode.children.length; ++j) {
                    invokeDestroyHook(vnode.children[j])
                }
            }
        }

        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var ch = vnodes[startIdx]
                if (isDef(ch)) {
                    if (isDef(ch.tag)) {
                        removeAndInvokeRemoveHook(ch)
                        invokeDestroyHook(ch)
                    } else {
                        // Text node
                        removeNode(ch.elm)
                    }
                }
            }
        }

        function removeAndInvokeRemoveHook(vnode, rm) {
            if (isDef(rm) || isDef(vnode.data)) {
                var i
                var listeners = cbs.remove.length + 1
                if (isDef(rm)) {
                    // we have a recursively passed down rm callback
                    // increase the listeners count
                    rm.listeners += listeners
                } else {
                    // directly removing
                    rm = createRmCb(vnode.elm, listeners)
                }
                // recursively invoke hooks on child component root node
                if (
                    isDef((i = vnode.componentInstance)) &&
                    isDef((i = i._vnode)) &&
                    isDef(i.data)
                ) {
                    removeAndInvokeRemoveHook(i, rm)
                }
                for (i = 0; i < cbs.remove.length; ++i) {
                    cbs.remove[i](vnode, rm)
                }
                if (isDef((i = vnode.data.hook)) && isDef((i = i.remove))) {
                    i(vnode, rm)
                } else {
                    rm()
                }
            } else {
                removeNode(vnode.elm)
            }
        }

        function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
            var oldStartIdx = 0
            var newStartIdx = 0
            var oldEndIdx = oldCh.length - 1
            var oldStartVnode = oldCh[0]
            var oldEndVnode = oldCh[oldEndIdx]
            var newEndIdx = newCh.length - 1
            var newStartVnode = newCh[0]
            var newEndVnode = newCh[newEndIdx]
            var oldKeyToIdx, idxInOld, elmToMove, refElm

            // removeOnly is a special flag used only by <transition-group>
            // to ensure removed elements stay in correct relative positions
            // during leaving transitions
            var canMove = !removeOnly

            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (isUndef(oldStartVnode)) {
                    oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
                } else if (isUndef(oldEndVnode)) {
                    oldEndVnode = oldCh[--oldEndIdx]
                } else if (sameVnode(oldStartVnode, newStartVnode)) {
                    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
                    oldStartVnode = oldCh[++oldStartIdx]
                    newStartVnode = newCh[++newStartIdx]
                } else if (sameVnode(oldEndVnode, newEndVnode)) {
                    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
                    oldEndVnode = oldCh[--oldEndIdx]
                    newEndVnode = newCh[--newEndIdx]
                } else if (sameVnode(oldStartVnode, newEndVnode)) {
                    // Vnode moved right
                    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
                    canMove &&
                        nodeOps.insertBefore(
                            parentElm,
                            oldStartVnode.elm,
                            nodeOps.nextSibling(oldEndVnode.elm)
                        )
                    oldStartVnode = oldCh[++oldStartIdx]
                    newEndVnode = newCh[--newEndIdx]
                } else if (sameVnode(oldEndVnode, newStartVnode)) {
                    // Vnode moved left
                    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
                    canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
                    oldEndVnode = oldCh[--oldEndIdx]
                    newStartVnode = newCh[++newStartIdx]
                } else {
                    if (isUndef(oldKeyToIdx)) {
                        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
                    }
                    idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null
                    if (isUndef(idxInOld)) {
                        // New element
                        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
                        newStartVnode = newCh[++newStartIdx]
                    } else {
                        elmToMove = oldCh[idxInOld]
                        /* istanbul ignore if */
                        if (false) {}
                        if (sameVnode(elmToMove, newStartVnode)) {
                            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
                            oldCh[idxInOld] = undefined
                            canMove &&
                                nodeOps.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm)
                            newStartVnode = newCh[++newStartIdx]
                        } else {
                            // same key but different element. treat as new element
                            createElm(
                                newStartVnode,
                                insertedVnodeQueue,
                                parentElm,
                                oldStartVnode.elm
                            )
                            newStartVnode = newCh[++newStartIdx]
                        }
                    }
                }
            }
            if (oldStartIdx > oldEndIdx) {
                refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
                addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
            } else if (newStartIdx > newEndIdx) {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
            }
        }

        function patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly) {
            if (oldVnode === vnode) {
                return
            }

            var elm = (vnode.elm = oldVnode.elm)

            if (isTrue(oldVnode.isAsyncPlaceholder)) {
                if (isDef(vnode.asyncFactory.resolved)) {
                    hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
                } else {
                    vnode.isAsyncPlaceholder = true
                }
                return
            }

            // reuse element for static trees.
            // note we only do this if the vnode is cloned -
            // if the new node is not cloned it means the render functions have been
            // reset by the hot-reload-api and we need to do a proper re-render.
            if (
                isTrue(vnode.isStatic) &&
                isTrue(oldVnode.isStatic) &&
                vnode.key === oldVnode.key &&
                (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
            ) {
                vnode.componentInstance = oldVnode.componentInstance
                return
            }

            var i
            var data = vnode.data
            if (isDef(data) && isDef((i = data.hook)) && isDef((i = i.prepatch))) {
                i(oldVnode, vnode)
            }

            var oldCh = oldVnode.children
            var ch = vnode.children
            if (isDef(data) && isPatchable(vnode)) {
                for (i = 0; i < cbs.update.length; ++i) {
                    cbs.update[i](oldVnode, vnode)
                }
                if (isDef((i = data.hook)) && isDef((i = i.update))) {
                    i(oldVnode, vnode)
                }
            }
            if (isUndef(vnode.text)) {
                if (isDef(oldCh) && isDef(ch)) {
                    if (oldCh !== ch) {
                        updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
                    }
                } else if (isDef(ch)) {
                    if (isDef(oldVnode.text)) {
                        nodeOps.setTextContent(elm, "")
                    }
                    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
                } else if (isDef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1)
                } else if (isDef(oldVnode.text)) {
                    nodeOps.setTextContent(elm, "")
                }
            } else if (oldVnode.text !== vnode.text) {
                nodeOps.setTextContent(elm, vnode.text)
            }
            if (isDef(data)) {
                if (isDef((i = data.hook)) && isDef((i = i.postpatch))) {
                    i(oldVnode, vnode)
                }
            }
        }

        function invokeInsertHook(vnode, queue, initial) {
            // delay insert hooks for component root nodes, invoke them after the
            // element is really inserted
            if (isTrue(initial) && isDef(vnode.parent)) {
                vnode.parent.data.pendingInsert = queue
            } else {
                for (var i = 0; i < queue.length; ++i) {
                    queue[i].data.hook.insert(queue[i])
                }
            }
        }

        var bailed = false
        // list of modules that can skip create hook during hydration because they
        // are already rendered on the client or has no need for initialization
        var isRenderedModule = makeMap("attrs,style,class,staticClass,staticStyle,key")

        // Note: this is a browser-only function so we can assume elms are DOM nodes.
        function hydrate(elm, vnode, insertedVnodeQueue) {
            if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
                vnode.elm = elm
                vnode.isAsyncPlaceholder = true
                return true
            }
            vnode.elm = elm
            var tag = vnode.tag
            var data = vnode.data
            var children = vnode.children
            if (isDef(data)) {
                if (isDef((i = data.hook)) && isDef((i = i.init))) {
                    i(vnode, true /* hydrating */)
                }
                if (isDef((i = vnode.componentInstance))) {
                    // child component. it should have hydrated its own tree.
                    initComponent(vnode, insertedVnodeQueue)
                    return true
                }
            }
            if (isDef(tag)) {
                if (isDef(children)) {
                    // empty element, allow client to pick up and populate children
                    if (!elm.hasChildNodes()) {
                        createChildren(vnode, children, insertedVnodeQueue)
                    } else {
                        var childrenMatch = true
                        var childNode = elm.firstChild
                        for (var i$1 = 0; i$1 < children.length; i$1++) {
                            if (
                                !childNode ||
                                !hydrate(childNode, children[i$1], insertedVnodeQueue)
                            ) {
                                childrenMatch = false
                                break
                            }
                            childNode = childNode.nextSibling
                        }
                        // if childNode is not null, it means the actual childNodes list is
                        // longer than the virtual children list.
                        if (!childrenMatch || childNode) {
                            if (
                                false
                            ) {}
                            return false
                        }
                    }
                }
                if (isDef(data)) {
                    for (var key in data) {
                        if (!isRenderedModule(key)) {
                            invokeCreateHooks(vnode, insertedVnodeQueue)
                            break
                        }
                    }
                }
            } else if (elm.data !== vnode.text) {
                elm.data = vnode.text
            }
            return true
        }

        return function patch(oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
            if (isUndef(vnode)) {
                if (isDef(oldVnode)) {
                    invokeDestroyHook(oldVnode)
                }
                return
            }

            var isInitialPatch = false
            var insertedVnodeQueue = []

            if (isUndef(oldVnode)) {
                // empty mount (likely as component), create new root element
                isInitialPatch = true
                createElm(vnode, insertedVnodeQueue, parentElm, refElm)
            } else {
                var isRealElement = isDef(oldVnode.nodeType)
                if (!isRealElement && sameVnode(oldVnode, vnode)) {
                    // patch existing root node
                    patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
                } else {
                    if (isRealElement) {
                        // mounting to a real element
                        // check if this is server-rendered content and if we can perform
                        // a successful hydration.
                        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                            oldVnode.removeAttribute(SSR_ATTR)
                            hydrating = true
                        }
                        if (isTrue(hydrating)) {
                            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                                invokeInsertHook(vnode, insertedVnodeQueue, true)
                                return oldVnode
                            } else {
                            }
                        }
                        // either not server-rendered, or hydration failed.
                        // create an empty node and replace it
                        oldVnode = emptyNodeAt(oldVnode)
                    }
                    // replacing existing element
                    var oldElm = oldVnode.elm
                    var parentElm$1 = nodeOps.parentNode(oldElm)
                    createElm(
                        vnode,
                        insertedVnodeQueue,
                        // extremely rare edge case: do not insert if old element is in a
                        // leaving transition. Only happens when combining transition +
                        // keep-alive + HOCs. (#4590)
                        oldElm._leaveCb ? null : parentElm$1,
                        nodeOps.nextSibling(oldElm)
                    )

                    if (isDef(vnode.parent)) {
                        // component root element replaced.
                        // update parent placeholder node element, recursively
                        var ancestor = vnode.parent
                        while (ancestor) {
                            ancestor.elm = vnode.elm
                            ancestor = ancestor.parent
                        }
                        if (isPatchable(vnode)) {
                            for (var i = 0; i < cbs.create.length; ++i) {
                                cbs.create[i](emptyNode, vnode.parent)
                            }
                        }
                    }

                    if (isDef(parentElm$1)) {
                        removeVnodes(parentElm$1, [oldVnode], 0, 0)
                    } else if (isDef(oldVnode.tag)) {
                        invokeDestroyHook(oldVnode)
                    }
                }
            }

            invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
            return vnode.elm
        }
    }

    /*  */

    // import baseModules from 'core/vdom/modules/index'
    // const platformModules = []
    // import platformModules from 'web/runtime/modules/index'

    // the directive module should be applied last, after all
    // built-in modules have been applied.
    // const modules = platformModules.concat(baseModules)
    var modules = [ref]

    var corePatch = createPatchFunction({
        nodeOps: nodeOps,
        modules: modules
    })

    function patch() {
        corePatch.apply(this, arguments)
        this.$updateDataToMP()
    }

    function callHook$1(vm, hook, params) {
        var handlers = vm.$options[hook]
        if (hook === "onError" && handlers) {
            handlers = [handlers]
        }

        var ret
        if (handlers) {
            for (var i = 0, j = handlers.length; i < j; i++) {
                try {
                    ret = handlers[i].call(vm, params)
                } catch (e) {
                    handleError(e, vm, hook + " hook")
                }
            }
        }
        if (vm._hasHookEvent) {
            vm.$emit("hook:" + hook)
        }

        // for child
        if (vm.$children.length) {
            vm.$children.forEach(function(v) {
                return callHook$1(v, hook, params)
            })
        }

        return ret
    }

    // mpType 小程序实例的类型，可能的值是 'app', 'page'
    // rootVueVM 是 vue 的根组件实例，子组件中访问 this.$root 可得
    function getGlobalData(app, rootVueVM) {
        var mp = rootVueVM.$mp
        if (app && app.globalData) {
            mp.appOptions = app.globalData.appOptions
        }
    }

    // 格式化 properties 属性，并给每个属性加上 observer 方法

    // properties 的 一些类型 https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html
    // properties: {
    //   paramA: Number,
    //   myProperty: { // 属性名
    //     type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    //     value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
    //     observer: function(newVal, oldVal, changedPath) {
    //        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    //        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
    //     }
    //   },
    // }

    // props 的一些类型 https://cn.vuejs.org/v2/guide/components-props.html#ad
    // props: {
    //   // 基础的类型检查 (`null` 匹配任何类型)
    //   propA: Number,
    //   // 多个可能的类型
    //   propB: [String, Number],
    //   // 必填的字符串
    //   propC: {
    //     type: String,
    //     required: true
    //   },
    //   // 带有默认值的数字
    //   propD: {
    //     type: Number,
    //     default: 100
    //   },
    //   // 带有默认值的对象
    //   propE: {
    //     type: Object,
    //     // 对象或数组且一定会从一个工厂函数返回默认值
    //     default: function () {
    //       return { message: 'hello' }
    //     }
    //   },
    //   // 自定义验证函数
    //   propF: {
    //     validator: function (value) {
    //       // 这个值必须匹配下列字符串中的一个
    //       return ['success', 'warning', 'danger'].indexOf(value) !== -1
    //     }
    //   }
    // }

    // core/util/options
    function normalizeProps$1(props, res, vm) {
        if (!props) {
            return
        }
        var i, val, name
        if (Array.isArray(props)) {
            i = props.length
            while (i--) {
                val = props[i]
                if (typeof val === "string") {
                    name = camelize(val)
                    res[name] = {
                        type: null
                    }
                } else {
                }
            }
        } else if (isPlainObject(props)) {
            for (var key in props) {
                val = props[key]
                name = camelize(key)
                res[name] = isPlainObject(val)
                    ? val
                    : {
                          type: val
                      }
            }
        }

        // fix vueProps to properties
        for (var key$1 in res) {
            if (res.hasOwnProperty(key$1)) {
                var item = res[key$1]
                if (item.default) {
                    item.value = item.default
                }
                var oldObserver = item.observer
                item.observer = function(newVal, oldVal) {
                    vm[name] = newVal
                    // 先修改值再触发原始的 observer，跟 watch 行为保持一致
                    if (typeof oldObserver === "function") {
                        oldObserver.call(vm, newVal, oldVal)
                    }
                }
            }
        }

        return res
    }

    function normalizeProperties(vm) {
        var properties = vm.$options.properties
        var vueProps = vm.$options.props
        var res = {}

        normalizeProps$1(properties, res, vm)
        normalizeProps$1(vueProps, res, vm)

        return res
    }

    /**
     * 把 properties 中的属性 proxy 到 vm 上
     */
    function initMpProps(vm) {
        var mpProps = (vm._mpProps = {})
        var keys = Object.keys(vm.$options.properties || {})
        keys.forEach(function(key) {
            if (!(key in vm)) {
                proxy(vm, "_mpProps", key)
                mpProps[key] = undefined // for observe
            }
        })
        observe(mpProps, true)
    }

    function initMP(mpType, next) {
        var rootVueVM = this.$root
        if (!rootVueVM.$mp) {
            rootVueVM.$mp = {}
        }

        var mp = rootVueVM.$mp

        // Please do not register multiple Pages
        // if (mp.registered) {
        if (mp.status) {
            // 处理子组件的小程序生命周期
            if (mpType === "app") {
                callHook$1(this, "onLaunch", mp.appOptions)
            } else {
                callHook$1(this, "onLoad", mp.query)
                // callHook$1(this, "onReady") // 避免 onReady触发两次
            }
            return next()
        }
        // mp.registered = true

        mp.mpType = mpType
        mp.status = "register"

        if (mpType === "app") {
            global.App({
                // 页面的初始数据
                globalData: {
                    appOptions: {}
                },

                handleProxy: function handleProxy(e) {
                    return rootVueVM.$handleProxyWithVue(e)
                },

                // Do something initial when launch.
                onLaunch: function onLaunch(options) {
                    if (options === void 0) options = {}

                    mp.app = this
                    mp.status = "launch"
                    this.globalData.appOptions = mp.appOptions = options
                    callHook$1(rootVueVM, "onLaunch", options)
                    next()
                },

                // Do something when app show.
                onShow: function onShow(options) {
                    if (options === void 0) options = {}

                    mp.status = "show"
                    this.globalData.appOptions = mp.appOptions = options
                    callHook$1(rootVueVM, "onShow", options)
                },

                // Do something when app hide.
                onHide: function onHide() {
                    mp.status = "hide"
                    callHook$1(rootVueVM, "onHide")
                },

                onError: function onError(err) {
                    callHook$1(rootVueVM, "onError", err)
                },
                //fixed by xxxxxx
                onUniNViewMessage: function onUniNViewMessage(e) {
                    callHook$1(rootVueVM, "onUniNViewMessage", e)
                }
            })
        } else if (mpType === "component") {
            initMpProps(rootVueVM)

            global.Component({
                // 小程序原生的组件属性
                properties: normalizeProperties(rootVueVM),
                // 页面的初始数据
                data: {
                    $root: {}
                },
                methods: {
                    handleProxy: function handleProxy(e) {
                        return rootVueVM.$handleProxyWithVue(e)
                    }
                },
                // mp lifecycle for vue
                // 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用 setData
                created: function created() {
                    mp.status = "created"
                    mp.page = this
                },
                // 组件生命周期函数，在组件实例进入页面节点树时执行
                attached: function attached() {
                    mp.status = "attached"
                    callHook$1(rootVueVM, "attached")
                },
                // 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用 SelectorQuery ）
                ready: function ready() {
                    mp.status = "ready"

                    callHook$1(rootVueVM, "ready")
                    next()

                    // 只有页面需要 setData
                    rootVueVM.$nextTick(function() {
                        rootVueVM._initDataToMP()
                    })
                },
                // 组件生命周期函数，在组件实例被移动到节点树另一个位置时执行
                moved: function moved() {
                    callHook$1(rootVueVM, "moved")
                },
                // 组件生命周期函数，在组件实例被从页面节点树移除时执行
                detached: function detached() {
                    mp.status = "detached"
                    callHook$1(rootVueVM, "detached")
                }
            })
        } else {
            var app = global.getApp()
    
            
            global.Page({
                // 页面的初始数据
                data: {
                    $root: {}
                },

                handleProxy: function handleProxy(e) {
                    return rootVueVM.$handleProxyWithVue(e)
                },

                // mp lifecycle for vue
                // 生命周期函数--监听页面加载
                onLoad: function onLoad(query) {
                    rootVueVM.__wxWebviewId__ = this.__wxWebviewId__//fixed by xxxxxx(createIntersectionObserver)
                    mp.page = this
                    mp.query = query
                    mp.status = "load"
                    getGlobalData(app, rootVueVM)
                    //仅load时重置数据
                    if (rootVueVM.$options && typeof rootVueVM.$options.data === "function") {
                    		Object.assign(rootVueVM.$data, rootVueVM.$options.data())
                    }
                    callHook$1(rootVueVM, "onLoad", query)
                },

                // 生命周期函数--监听页面显示
                onShow: function onShow() {
                    rootVueVM.__wxWebviewId__ = this.__wxWebviewId__//fixed by xxxxxx(createIntersectionObserver)
                    mp.page = this
                    mp.status = "show"
                
                    callHook$1(rootVueVM, "onShow")
                    
                    //   // 只有页面需要 setData
                    rootVueVM.$nextTick(function () {
                    	rootVueVM._initDataToMP();
                    });
                },

                // 生命周期函数--监听页面初次渲染完成
                onReady: function onReady() {
                    mp.status = "ready"

                    callHook$1(rootVueVM, "onReady")
                    next()
                },

                // 生命周期函数--监听页面隐藏
                onHide: function onHide() {
                    mp.status = "hide"
                    callHook$1(rootVueVM, "onHide")
                },

                // 生命周期函数--监听页面卸载
                onUnload: function onUnload() {
                    mp.status = "unload"
                    callHook$1(rootVueVM, "onUnload")
                    mp.page = null
                },

                // 页面相关事件处理函数--监听用户下拉动作
                onPullDownRefresh: function onPullDownRefresh() {
                    callHook$1(rootVueVM, "onPullDownRefresh")
                },

                // 页面上拉触底事件的处理函数
                onReachBottom: function onReachBottom() {
                    callHook$1(rootVueVM, "onReachBottom")
                },

                // 用户点击右上角分享
                onShareAppMessage: rootVueVM.$options.onShareAppMessage
                    ? function(options) {
                          return callHook$1(rootVueVM, "onShareAppMessage", options)
                      }
                    : null,

                // Do something when page scroll
                onPageScroll: function onPageScroll(options) {
                    callHook$1(rootVueVM, "onPageScroll", options)
                },

                // 当前是 tab 页时，点击 tab 时触发
                onTabItemTap: function onTabItemTap(options) {
                    callHook$1(rootVueVM, "onTabItemTap", options)
                }
            })
        }
    }

    // 节流方法，性能优化
    // 全局的命名约定，为了节省编译的包大小一律采取形象的缩写，说明如下。
    // $c === $child
    // $k === $comKey

    // 新型的被拍平的数据结构
    // {
    //   $root: {
    //     '1-1'{
    //       // ... data
    //     },
    //     '1.2-1': {
    //       // ... data1
    //     },
    //     '1.2-2': {
    //       // ... data2
    //     }
    //   }
    // }

    function getVmData(vm) {
        // 确保当前 vm 所有数据被同步
        var dataKeys = [].concat(
            Object.keys(vm._data || {}),
            Object.keys(vm._props || {}),
            Object.keys(vm._mpProps || {}),
            Object.keys(vm._computedWatchers || {})
        )
        return dataKeys.reduce(function(res, key) {
            res[key] = vm[key]
            return res
        }, {})
    }

    function getParentComKey(vm, res) {
        if (res === void 0) res = []

        var ref = vm || {}
        var $parent = ref.$parent
        if (!$parent) {
            return res
        }
        res.unshift(getComKey($parent))
        if ($parent.$parent) {
            return getParentComKey($parent, res)
        }
        return res
    }

    function formatVmData(vm) {
        var $p = getParentComKey(vm).join(",")
        var $k = $p + ($p ? "," : "") + getComKey(vm)

        // getVmData 这儿获取当前组件内的所有数据，包含 props、computed 的数据
        // 改动 vue.runtime 所获的的核心能力
        var data = Object.assign(getVmData(vm), {
            $k: $k,
            $kk: $k + ",",
            $p: $p
        })
        var key = "$root." + $k
        var res = {}
        res[key] = data
        return res
    }

    function collectVmData(vm, res) {
        if (res === void 0) res = {}

        var vms = vm.$children
        if (vms && vms.length) {
            vms.forEach(function(v) {
                return collectVmData(v, res)
            })
        }
        return Object.assign(res, formatVmData(vm))
    }

    /**
     * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
     * 自动合并 data
     *
     * @param  {function}   func      传入函数
     * @param  {number}     wait      表示时间窗口的间隔
     * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
     *                                如果想忽略结尾边界上的调用，传入{trailing: false}
     * @return {function}             返回客户调用函数
     */
    function throttle(func, wait, options) {
        var context, args, result
        var timeout = null
        // 上次执行时间点
        var previous = 0
        if (!options) {
            options = {}
        }
        // 延迟执行函数
        function later() {
            // 若设定了开始边界不执行选项，上次执行时间始终为0
            previous = options.leading === false ? 0 : Date.now()
            timeout = null
            result = func.apply(context, args)
            if (!timeout) {
                context = args = null
            }
        }
        return function(handle, data) {
            var now = Date.now()
            // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
            if (!previous && options.leading === false) {
                previous = now
            }
            // 延迟执行时间间隔
            var remaining = wait - (now - previous)
            context = this
            args = args ? [handle, Object.assign(args[1], data)] : [handle, data]
            // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
            // remaining大于时间窗口wait，表示客户端系统时间被调整过
            if (remaining <= 0 || remaining > wait) {
                clearTimeout(timeout)
                timeout = null
                previous = now
                result = func.apply(context, args)
                if (!timeout) {
                    context = args = null
                }
                // 如果延迟执行不存在，且没有设定结尾边界不执行选项
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining)
            }
            return result
        }
    }

    // 优化频繁的 setData: https://mp.weixin.qq.com/debug/wxadoc/dev/framework/performance/tips.html
    var throttleSetData = throttle(function(handle, data) {
        handle(data)
    }, 50)

    function getPage(vm) {
        var rootVueVM = vm.$root
        var ref = rootVueVM.$mp || {}
        var mpType = ref.mpType
        if (mpType === void 0) mpType = ""
        var page = ref.page

        // 优化后台态页面进行 setData: https://mp.weixin.qq.com/debug/wxadoc/dev/framework/performance/tips.html
        if (mpType === "app" || !page || typeof page.setData !== "function") {
            return
        }
        return page
    }

    // 优化每次 setData 都传递大量新数据
    function updateDataToMP() {
        var page = getPage(this)
        if (!page) {
            return
        }

        var data = JSON.parse(JSON.stringify(formatVmData(this)))
        //fixed by xxxxxx
        throttleSetData(page.setData.bind(page), diff(data, page.data))
    }

    function initDataToMP() {
        var page = getPage(this)
        if (!page) {
            return
        }

        var data = collectVmData(this.$root)
        //fixed by xxxxxx
        page.setData(JSON.parse(JSON.stringify(data)))
    }

    function getVM(vm, comkeys) {
        if (comkeys === void 0) comkeys = []

        var keys = comkeys.slice(1)
        if (!keys.length) {
            return vm
        }

        return keys.reduce(function(res, key) {
            var len = res.$children.length
            for (var i = 0; i < len; i++) {
                var v = res.$children[i]
                var k = getComKey(v)
                if (k === key) {
                    res = v
                    return res
                }
            }
            return res
        }, vm)
    }

    function getHandle(vnode, eventid, eventTypes) {
        if (eventTypes === void 0) eventTypes = []

        var res = []
        if (!vnode || !vnode.tag) {
            return res
        }

        var ref = vnode || {}
        var data = ref.data
        if (data === void 0) data = {}
        var children = ref.children
        if (children === void 0) children = []
        var componentInstance = ref.componentInstance
        if (componentInstance) {
            // 增加 slot 情况的处理
            // Object.values 会多增加几行编译后的代码
            Object.keys(componentInstance.$slots).forEach(function(slotKey) {
                var slot = componentInstance.$slots[slotKey]
                var slots = Array.isArray(slot) ? slot : [slot]
                slots.forEach(function(node) {
                    res = res.concat(getHandle(node, eventid, eventTypes))
                })
            })
        } else {
            // 避免遍历超出当前组件的 vm
            children.forEach(function(node) {
                res = res.concat(getHandle(node, eventid, eventTypes))
            })
        }

        var attrs = data.attrs
        var on = data.on
        if (attrs && on && attrs["eventid"] === eventid) {
            eventTypes.forEach(function(et) {
                var h = on[et]
                if (typeof h === "function") {
                    res.push(h)
                } else if (Array.isArray(h)) {
                    res = res.concat(h)
                }
            })
            return res
        }

        return res
    }

    function getWebEventByMP(e) {
        var type = e.type
        var timeStamp = e.timeStamp
        var touches = e.touches
        var detail = e.detail
        if (detail === void 0) detail = {}
        var target = e.target
        if (target === void 0) target = {}
        var currentTarget = e.currentTarget
        if (currentTarget === void 0) currentTarget = {}
        var x = detail.x
        var y = detail.y
        var event = {
            mp: e,
            type: type,
            timeStamp: timeStamp,
            x: x,
            y: y,
            target: Object.assign({}, target, detail),
            detail: detail, //fixed by xxxxxx
            currentTarget: currentTarget,
            stopPropagation: noop,
            preventDefault: noop
        }

        if (touches && touches.length) {
            Object.assign(event, touches[0])
            event.touches = touches
        }
        return event
    }

    function handleProxyWithVue(e) {
        var rootVueVM = this.$root
        var type = e.type
        var target = e.target
        if (target === void 0) target = {}
        var currentTarget = e.currentTarget
        var ref = currentTarget || target
        var dataset = ref.dataset
        if (dataset === void 0) dataset = {}
        var comkey = dataset.comkey
        if (comkey === void 0) comkey = ""
        var eventid = dataset.eventid
        var vm = getVM(rootVueVM, comkey.split(","))

        if (!vm) {
            return
        }

        var webEventTypes = eventTypeMap[type] || [type]
        var handles = getHandle(vm._vnode, eventid, webEventTypes)

        // TODO, enevt 还需要处理更多
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Event
        if (handles.length) {
            var event = getWebEventByMP(e)
            if (handles.length === 1) {
                var result = handles[0](event)
                return result
            }
            handles.forEach(function(h) {
                return h(event)
            })
        }
    }

    // for platforms
    // import config from 'core/config'
    // install platform specific utils
    Vue$3.config.mustUseProp = mustUseProp
    Vue$3.config.isReservedTag = isReservedTag
    Vue$3.config.isReservedAttr = isReservedAttr
    Vue$3.config.getTagNamespace = getTagNamespace
    Vue$3.config.isUnknownElement = isUnknownElement

    // install platform patch function
    Vue$3.prototype.__patch__ = patch

    // public mount method
    Vue$3.prototype.$mount = function(el, hydrating) {
        var this$1 = this

        // el = el && inBrowser ? query(el) : undefined
        // return mountComponent(this, el, hydrating)

        // 初始化小程序生命周期相关
        var options = this.$options

        if (options && (options.render || options.mpType)) {
            var mpType = options.mpType
            if (mpType === void 0) mpType = "page"
            return this._initMP(mpType, function() {
                return mountComponent(this$1, undefined, undefined)
            })
        } else {
            return mountComponent(this, undefined, undefined)
        }
    }

    // for mp
    Vue$3.prototype._initMP = initMP

    Vue$3.prototype.$updateDataToMP = updateDataToMP
    Vue$3.prototype._initDataToMP = initDataToMP

    Vue$3.prototype.$handleProxyWithVue = handleProxyWithVue

    /*  */

    return Vue$3
})

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/commentModule/commentModule.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;



































































var _shoppublic = _interopRequireDefault(__webpack_require__(/*! @/common/shoppublic.js */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\common\\shoppublic.js"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default =
{
  data: function data() {
    return {
      commentList_two: 0 };

  },
  // 参数在props接收
  props: {},


  methods: {
    addCommentList_two: function addCommentList_two() {
      this.commentList_two += 1;
    },
    minusCommentList_two: function minusCommentList_two() {
      this.commentList_two -= 1;
    } } };exports.default = _default;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-citypicker/mpvueCityPicker.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
























var _province = _interopRequireDefault(__webpack_require__(/*! ./city-data/province.js */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\city-data\\province.js"));
var _city = _interopRequireDefault(__webpack_require__(/*! ./city-data/city.js */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\city-data\\city.js"));
var _area = _interopRequireDefault(__webpack_require__(/*! ./city-data/area.js */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\city-data\\area.js"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var _default2 =
{
  data: function data() {
    return {
      pickerValue: [0, 0, 0],
      provinceDataList: [],
      cityDataList: [],
      areaDataList: [],
      /* 是否显示控件 */
      showPicker: false };

  },
  created: function created() {
    this.init();
  },
  props: {
    /* 默认值 */
    pickerValueDefault: {
      type: Array,
      default: function _default() {
        return [0, 0, 0];
      } },

    /* 主题色 */
    themeColor: String },

  watch: {
    pickerValueDefault: function pickerValueDefault() {
      this.init();
    } },

  methods: {
    init: function init() {
      this.handPickValueDefault(); // 对 pickerValueDefault 做兼容处理
      this.provinceDataList = _province.default;
      // console.log(this.provinceDataList.cityData)
      this.cityDataList = _city.default[this.pickerValueDefault[0]];
      this.areaDataList = _area.default[this.pickerValueDefault[0]][this.pickerValueDefault[1]];
      this.pickerValue = this.pickerValueDefault;
    },
    show: function show() {var _this = this;
      setTimeout(function () {
        _this.showPicker = true;
      }, 0);
    },
    maskClick: function maskClick() {
      this.pickerCancel();
    },
    pickerCancel: function pickerCancel() {
      this.showPicker = false;
      this._$emit('onCancel');
    },
    pickerConfirm: function pickerConfirm(e) {
      this.showPicker = false;
      this._$emit('onConfirm');
    },
    showPickerView: function showPickerView() {
      this.showPicker = true;
    },
    handPickValueDefault: function handPickValueDefault() {
      if (this.pickerValueDefault !== [0, 0, 0]) {
        if (this.pickerValueDefault[0] > _province.default.length - 1) {
          this.pickerValueDefault[0] = _province.default.length - 1;
        }
        if (this.pickerValueDefault[1] > _city.default[this.pickerValueDefault[0]].length - 1) {
          this.pickerValueDefault[1] = _city.default[this.pickerValueDefault[0]].length - 1;
        }
        if (this.pickerValueDefault[2] > _area.default[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1) {
          this.pickerValueDefault[2] = _area.default[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1;
        }
      }
    },
    pickerChange: function pickerChange(e) {
      var changePickerValue = e.mp.detail.value;
      if (this.pickerValue[0] !== changePickerValue[0]) {
        // 第一级发生滚动
        this.cityDataList = _city.default[changePickerValue[0]];
        this.areaDataList = _area.default[changePickerValue[0]][0];
        changePickerValue[1] = 0;
        changePickerValue[2] = 0;
      } else if (this.pickerValue[1] !== changePickerValue[1]) {
        // 第二级滚动
        this.areaDataList =
        _area.default[changePickerValue[0]][changePickerValue[1]];
        changePickerValue[2] = 0;
      }
      this.pickerValue = changePickerValue;
      this._$emit('onChange');
    },
    _$emit: function _$emit(emitName) {
      var pickObj = {
        label: this._getLabel(),
        value: this.pickerValue,
        cityCode: this._getCityCode() };

      this.$emit(emitName, pickObj);
    },
    _getLabel: function _getLabel() {
      var pcikerLabel =
      this.provinceDataList[this.pickerValue[0]].label +
      '-' +
      this.cityDataList[this.pickerValue[1]].label +
      '-' +
      this.areaDataList[this.pickerValue[2]].label;
      return pcikerLabel;
    },
    _getCityCode: function _getCityCode() {
      return this.areaDataList[this.pickerValue[2]].value;
    } } };exports.default = _default2;

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-picker/mpvuePicker.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}var _default2 =
































































{
  data: function data() {
    return {
      pickerChangeValue: [],
      pickerValue: [],
      pickerValueArrayChange: true,
      modeChange: false,
      pickerValueSingleArray: [],
      pickerValueHour: [],
      pickerValueMinute: [],
      pickerValueMulArray: [],
      pickerValueMulTwoOne: [],
      pickerValueMulTwoTwo: [],
      pickerValueMulThreeOne: [],
      pickerValueMulThreeTwo: [],
      pickerValueMulThreeThree: [],
      /* 是否显示控件 */
      showPicker: false };

  },
  props: {
    /* mode */
    mode: {
      type: String,
      default: 'selector' },

    /* picker 数值 */
    pickerValueArray: {
      type: Array,
      default: function _default() {
        return [];
      } },

    /* 默认值 */
    pickerValueDefault: {
      type: Array,
      default: function _default() {
        return [];
      } },

    /* 几级联动 */
    deepLength: {
      type: Number,
      default: 2 },

    /* 主题色 */
    themeColor: String },

  watch: _defineProperty({
    pickerValueArray: function pickerValueArray(oldVal, newVal) {
      this.pickerValueArrayChange = true;
    },
    mode: function mode(oldVal, newVal) {
      this.modeChange = true;
    } }, "pickerValueArray", function pickerValueArray(
  val) {
    this.initPicker(val);
  }),

  methods: {
    initPicker: function initPicker(valueArray) {
      var pickerValueArray = valueArray;
      this.pickerValue = this.pickerValueDefault;
      // 初始化多级联动
      if (this.mode === 'selector') {
        this.pickerValueSingleArray = valueArray;
      } else if (this.mode === 'timeSelector') {
        this.modeChange = false;
        var hourArray = [];
        var minuteArray = [];
        for (var i = 0; i < 24; i++) {
          hourArray.push({
            value: i,
            label: i > 9 ? "".concat(i, " \u65F6") : "0".concat(i, " \u65F6") });

        }
        for (var _i = 0; _i < 60; _i++) {
          minuteArray.push({
            value: _i,
            label: _i > 9 ? "".concat(_i, " \u5206") : "0".concat(_i, " \u5206") });

        }
        this.pickerValueHour = hourArray;
        this.pickerValueMinute = minuteArray;
      } else if (this.mode === 'multiSelector') {
        this.pickerValueMulArray = valueArray;
      } else if (this.mode === 'multiLinkageSelector' && this.deepLength === 2) {
        // 两级联动
        var pickerValueMulTwoOne = [];
        var pickerValueMulTwoTwo = [];
        // 第一列
        for (var _i2 = 0, length = pickerValueArray.length; _i2 < length; _i2++) {
          pickerValueMulTwoOne.push(pickerValueArray[_i2]);
        }
        // 渲染第二列
        // 如果有设定的默认值
        if (this.pickerValueDefault.length === 2) {
          var num = this.pickerValueDefault[0];
          for (
          var _i3 = 0, _length = pickerValueArray[num].children.length; _i3 < _length; _i3++)
          {
            pickerValueMulTwoTwo.push(pickerValueArray[num].children[_i3]);
          }
        } else {
          for (
          var _i4 = 0, _length2 = pickerValueArray[0].children.length; _i4 < _length2; _i4++)
          {
            pickerValueMulTwoTwo.push(pickerValueArray[0].children[_i4]);
          }
        }
        this.pickerValueMulTwoOne = pickerValueMulTwoOne;
        this.pickerValueMulTwoTwo = pickerValueMulTwoTwo;
      } else if (
      this.mode === 'multiLinkageSelector' &&
      this.deepLength === 3)
      {
        var pickerValueMulThreeOne = [];
        var pickerValueMulThreeTwo = [];
        var pickerValueMulThreeThree = [];
        // 第一列
        for (var _i5 = 0, _length3 = pickerValueArray.length; _i5 < _length3; _i5++) {
          pickerValueMulThreeOne.push(pickerValueArray[_i5]);
        }
        // 渲染第二列
        this.pickerValueDefault =
        this.pickerValueDefault.length === 3 ?
        this.pickerValueDefault :
        [0, 0, 0];
        if (this.pickerValueDefault.length === 3) {
          var _num = this.pickerValueDefault[0];
          for (
          var _i6 = 0, _length4 = pickerValueArray[_num].children.length; _i6 < _length4; _i6++)
          {
            pickerValueMulThreeTwo.push(pickerValueArray[_num].children[_i6]);
          }
          // 第三列
          var numSecond = this.pickerValueDefault[1];
          for (var _i7 = 0, _length5 = pickerValueArray[_num].children[numSecond].children.length; _i7 < _length5; _i7++) {
            pickerValueMulThreeThree.push(
            pickerValueArray[_num].children[numSecond].children[_i7]);

          }
        }
        this.pickerValueMulThreeOne = pickerValueMulThreeOne;
        this.pickerValueMulThreeTwo = pickerValueMulThreeTwo;
        this.pickerValueMulThreeThree = pickerValueMulThreeThree;
      }
    },
    show: function show() {var _this = this;
      setTimeout(function () {
        if (_this.pickerValueArrayChange || _this.modeChange) {
          _this.initPicker(_this.pickerValueArray);
          _this.showPicker = true;
          _this.pickerValueArrayChange = false;
          _this.modeChange = false;
        } else {
          _this.showPicker = true;
        }
      }, 0);
    },
    maskClick: function maskClick() {
      this.pickerCancel();
    },
    pickerCancel: function pickerCancel() {
      this.showPicker = false;
      this._initPickerVale();
      var pickObj = {
        index: this.pickerValue,
        value: this._getPickerLabelAndValue(this.pickerValue, this.mode).value,
        label: this._getPickerLabelAndValue(this.pickerValue, this.mode).label };

      this.$emit('onCancel', pickObj);
    },
    pickerConfirm: function pickerConfirm(e) {
      this.showPicker = false;
      this._initPickerVale();
      var pickObj = {
        index: this.pickerValue,
        value: this._getPickerLabelAndValue(this.pickerValue, this.mode).value,
        label: this._getPickerLabelAndValue(this.pickerValue, this.mode).label };

      this.$emit('onConfirm', pickObj);
    },
    showPickerView: function showPickerView() {
      this.showPicker = true;
    },
    pickerChange: function pickerChange(e) {
      this.pickerValue = e.mp.detail.value;
      var pickObj = {
        index: this.pickerValue,
        value: this._getPickerLabelAndValue(this.pickerValue, this.mode).value,
        label: this._getPickerLabelAndValue(this.pickerValue, this.mode).label };

      this.$emit('onChange', pickObj);
    },
    pickerChangeMul: function pickerChangeMul(e) {
      if (this.deepLength === 2) {
        var pickerValueArray = this.pickerValueArray;
        var changeValue = e.mp.detail.value;
        // 处理第一列滚动
        if (changeValue[0] !== this.pickerValue[0]) {
          var pickerValueMulTwoTwo = [];
          // 第一列滚动第二列数据更新
          for (var i = 0, length = pickerValueArray[changeValue[0]].children.length; i < length; i++) {
            pickerValueMulTwoTwo.push(pickerValueArray[changeValue[0]].children[i]);
          }
          this.pickerValueMulTwoTwo = pickerValueMulTwoTwo;
          // 第二列初始化为 0
          changeValue[1] = 0;
        }
        this.pickerValue = changeValue;
      } else if (this.deepLength === 3) {
        var _pickerValueArray = this.pickerValueArray;
        var _changeValue = e.mp.detail.value;
        var pickerValueMulThreeTwo = [];
        var pickerValueMulThreeThree = [];
        // 重新渲染第二列
        // 如果是第一列滚动
        if (_changeValue[0] !== this.pickerValue[0]) {
          this.pickerValueMulThreeTwo = [];
          for (var _i8 = 0, _length6 = _pickerValueArray[_changeValue[0]].children.length; _i8 < _length6; _i8++) {
            pickerValueMulThreeTwo.push(_pickerValueArray[_changeValue[0]].children[_i8]);
          }
          // 重新渲染第三列
          for (var _i9 = 0, _length7 = _pickerValueArray[_changeValue[0]].children[0].children.length; _i9 <
          _length7; _i9++) {
            pickerValueMulThreeThree.push(_pickerValueArray[_changeValue[0]].children[0].children[_i9]);
          }
          _changeValue[1] = 0;
          _changeValue[2] = 0;
          this.pickerValueMulThreeTwo = pickerValueMulThreeTwo;
          this.pickerValueMulThreeThree = pickerValueMulThreeThree;
        } else if (_changeValue[1] !== this.pickerValue[1]) {
          // 第二列滚动
          // 重新渲染第三列
          this.pickerValueMulThreeThree = [];
          pickerValueMulThreeTwo = this.pickerValueMulThreeTwo;
          for (var _i10 = 0, _length8 = _pickerValueArray[_changeValue[0]].children[_changeValue[1]].children.length; _i10 <
          _length8; _i10++) {
            pickerValueMulThreeThree.push(_pickerValueArray[_changeValue[0]].children[_changeValue[1]].children[
            _i10]);
          }
          _changeValue[2] = 0;
          this.pickerValueMulThreeThree = pickerValueMulThreeThree;
        }
        this.pickerValue = _changeValue;
      }
      var pickObj = {
        index: this.pickerValue,
        value: this._getPickerLabelAndValue(this.pickerValue, this.mode).value,
        label: this._getPickerLabelAndValue(this.pickerValue, this.mode).label };

      this.$emit('onChange', pickObj);
    },
    // 获取 pxikerLabel
    _getPickerLabelAndValue: function _getPickerLabelAndValue(value, mode) {
      var pickerLable;
      var pickerGetValue = [];
      // selector
      if (mode === 'selector') {
        pickerLable = this.pickerValueSingleArray[value].label;
        pickerGetValue.push(this.pickerValueSingleArray[value].value);
      } else if (mode === 'timeSelector') {
        pickerLable = "".concat(this.pickerValueHour[value[0]].label, "-").concat(this.pickerValueMinute[value[1]].label);
        pickerGetValue.push(this.pickerValueHour[value[0]].value);
        pickerGetValue.push(this.pickerValueHour[value[1]].value);
      } else if (mode === 'multiSelector') {
        for (var i = 0; i < value.length; i++) {
          if (i > 0) {
            pickerLable += this.pickerValueMulArray[i][value[i]].label + (i === value.length - 1 ? '' :
            '-');
          } else {
            pickerLable = this.pickerValueMulArray[i][value[i]].label + '-';
          }
          pickerGetValue.push(this.pickerValueMulArray[i][value[i]].value);
        }
      } else if (mode === 'multiLinkageSelector') {
        /* eslint-disable indent */
        pickerLable =
        this.deepLength === 2 ? "".concat(
        this.pickerValueMulTwoOne[value[0]].label, "-").concat(this.pickerValueMulTwoTwo[value[1]].label) : "".concat(
        this.pickerValueMulThreeOne[value[0]].label, "-").concat(this.pickerValueMulThreeTwo[value[1]].label, "-").concat(this.pickerValueMulThreeThree[value[2]].label);
        if (this.deepLength === 2) {
          pickerGetValue.push(this.pickerValueMulTwoOne[value[0]].value);
          pickerGetValue.push(this.pickerValueMulTwoTwo[value[1]].value);
        } else {
          pickerGetValue.push(this.pickerValueMulThreeOne[value[0]].value);
          pickerGetValue.push(this.pickerValueMulThreeTwo[value[1]].value);
          pickerGetValue.push(this.pickerValueMulThreeThree[value[2]].value);
        }
        /* eslint-enable indent */
      }
      return {
        label: pickerLable,
        value: pickerGetValue };

    },
    // 初始化 pickerValue 默认值
    _initPickerVale: function _initPickerVale() {
      if (this.pickerValue.length === 0) {
        if (this.mode === 'selector') {
          this.pickerValue = [0];
        } else if (this.mode === 'multiSelector') {
          this.pickerValue = new Int8Array(this.pickerValueArray.length);
        } else if (
        this.mode === 'multiLinkageSelector' &&
        this.deepLength === 2)
        {
          this.pickerValue = [0, 0];
        } else if (
        this.mode === 'multiLinkageSelector' &&
        this.deepLength === 3)
        {
          this.pickerValue = [0, 0, 0];
        }
      }
    } } };exports.default = _default2;

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue?vue&type=style&index=0&lang=scss&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-1!./node_modules/css-loader??ref--8-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-4!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/commentModule/commentModule.vue?vue&type=style&index=0&lang=scss& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue?vue&type=style&index=0&lang=css&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-1!./node_modules/css-loader??ref--6-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-citypicker/mpvueCityPicker.vue?vue&type=style&index=0&lang=css& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue?vue&type=style&index=0&lang=css&":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-1!./node_modules/css-loader??ref--6-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-picker/mpvuePicker.vue?vue&type=style&index=0&lang=css& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue?vue&type=template&id=57c99424&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/commentModule/commentModule.vue?vue&type=template&id=57c99424& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("view", { staticClass: "content" }, [
    _c("view", { staticClass: "commentParent" }, [
      _vm._m(0),
      _c(
        "view",
        { staticClass: "conment_content" },
        _vm._l(2, function(item, index) {
          return _c(
            "view",
            { key: index, staticClass: "conment_one" },
            [
              _vm._m(1, true),
              _c("view", { staticClass: "_content" }, [
                _vm._v("花间墅,田间农,望人忙,你可知我对你的思念多几许?")
              ]),
              _c(
                "view",
                {
                  class: {
                    _operation: " _operation, ",
                    _operation_border:
                      _vm.commentList_two > 0 ? "_operation_border" : ""
                  }
                },
                [
                  _c("view", { staticClass: "_time" }, [_vm._v("2019-01-21")]),
                  _c("view", { staticClass: "commentAndPraise" }, [
                    _c(
                      "view",
                      {
                        staticClass: "_comment iconfont",
                        attrs: { eventid: "a93bad46-0-" + index },
                        on: { click: _vm.addCommentList_two }
                      },
                      [_vm._v(" 666")]
                    ),
                    _c("view", { staticClass: "praise iconfont" }, [
                      _vm._v(" 999")
                    ])
                  ])
                ]
              ),
              _vm._l(_vm.commentList_two, function(item, indexs) {
                return _c("view", { key: indexs, staticClass: "conment_two" }, [
                  _vm._m(2, true),
                  _c("view", { staticClass: "_content" }, [
                    _vm._v(
                      "@花间小王子:花非花雾非雾~ 再见时,你我也只是物是人非"
                    )
                  ]),
                  _c("view", { staticClass: "_operation" }, [
                    _c("view", { staticClass: "_time" }, [
                      _vm._v("2019-05-29")
                    ]),
                    _c("view", { staticClass: "commentAndPraise" }, [
                      _c(
                        "view",
                        {
                          staticClass: "_comment iconfont",
                          attrs: {
                            eventid: "a93bad46-1-" + index + "-" + indexs
                          },
                          on: { click: _vm.minusCommentList_two }
                        },
                        [_vm._v(" 666")]
                      ),
                      _c("view", { staticClass: "praise iconfont" }, [
                        _vm._v(" 999")
                      ])
                    ])
                  ])
                ])
              })
            ],
            2
          )
        })
      )
    ]),
    _c("view", { staticClass: "comment_box" })
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("view", { staticClass: "comment_title" }, [
      _c("view", [_vm._v("项目评论")]),
      _c("view", [_vm._v("已有2评论")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("view", { staticClass: "_title" }, [
      _c("view", { staticClass: "_portrait" }, [
        _c("image", { attrs: { src: "", mode: "" } })
      ]),
      _c("view", { staticClass: "_userAndCompany" }, [
        _c("view", { staticClass: "_name" }, [_vm._v("花间小王子")]),
        _c("view", { staticClass: "_company" }, [
          _c("view", [_vm._v("华夏之章礼仪之邦")]),
          _c("view", { staticClass: "iconfont" }, [_vm._v("")])
        ])
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("view", { staticClass: "_title" }, [
      _c("view", { staticClass: "_portrait" }, [
        _c("image", { attrs: { src: "", mode: "" } })
      ]),
      _c("view", { staticClass: "_userAndCompany" }, [
        _c("view", { staticClass: "_name" }, [_vm._v("浪里小白龙")]),
        _c("view", { staticClass: "_company" }, [
          _c("view", [_vm._v("君临天下俯仰河山")]),
          _c("view", { staticClass: "iconfont" }, [_vm._v("")])
        ])
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue?vue&type=template&id=758146e3&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-citypicker/mpvueCityPicker.vue?vue&type=template&id=758146e3& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "mpvue-picker" }, [
    _c("div", {
      class: { pickerMask: _vm.showPicker },
      attrs: { catchtouchmove: "true", eventid: "2d116acc-0" },
      on: { click: _vm.maskClick }
    }),
    _c(
      "div",
      {
        staticClass: "mpvue-picker-content ",
        class: { "mpvue-picker-view-show": _vm.showPicker }
      },
      [
        _c(
          "div",
          {
            staticClass: "mpvue-picker__hd",
            attrs: { catchtouchmove: "true" }
          },
          [
            _c(
              "div",
              {
                staticClass: "mpvue-picker__action",
                attrs: { eventid: "2d116acc-1" },
                on: { click: _vm.pickerCancel }
              },
              [_vm._v("取消")]
            ),
            _c(
              "div",
              {
                staticClass: "mpvue-picker__action",
                style: { color: _vm.themeColor },
                attrs: { eventid: "2d116acc-2" },
                on: { click: _vm.pickerConfirm }
              },
              [_vm._v("确定")]
            )
          ]
        ),
        _c(
          "picker-view",
          {
            staticClass: "mpvue-picker-view",
            attrs: {
              "indicator-style": "height: 40px;",
              value: _vm.pickerValue,
              eventid: "2d116acc-3"
            },
            on: { change: _vm.pickerChange }
          },
          [
            _c(
              "block",
              [
                _c(
                  "picker-view-column",
                  { attrs: { mpcomid: "2d116acc-0" } },
                  _vm._l(_vm.provinceDataList, function(item, index) {
                    return _c(
                      "div",
                      { key: index, staticClass: "picker-item" },
                      [_vm._v(_vm._s(item.label))]
                    )
                  })
                ),
                _c(
                  "picker-view-column",
                  { attrs: { mpcomid: "2d116acc-1" } },
                  _vm._l(_vm.cityDataList, function(item, index) {
                    return _c(
                      "div",
                      { key: index, staticClass: "picker-item" },
                      [_vm._v(_vm._s(item.label))]
                    )
                  })
                ),
                _c(
                  "picker-view-column",
                  { attrs: { mpcomid: "2d116acc-2" } },
                  _vm._l(_vm.areaDataList, function(item, index) {
                    return _c(
                      "div",
                      { key: index, staticClass: "picker-item" },
                      [_vm._v(_vm._s(item.label))]
                    )
                  })
                )
              ],
              1
            )
          ],
          1
        )
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue?vue&type=template&id=40da1126&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-picker/mpvuePicker.vue?vue&type=template&id=40da1126& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("view", { staticClass: "mpvue-picker" }, [
    _c("view", {
      class: { pickerMask: _vm.showPicker },
      attrs: { catchtouchmove: "true", eventid: "73ec0f24-0" },
      on: { click: _vm.maskClick }
    }),
    _c(
      "view",
      {
        staticClass: "mpvue-picker-content ",
        class: { "mpvue-picker-view-show": _vm.showPicker }
      },
      [
        _c(
          "view",
          {
            staticClass: "mpvue-picker__hd",
            attrs: { catchtouchmove: "true" }
          },
          [
            _c(
              "view",
              {
                staticClass: "mpvue-picker__action",
                attrs: { eventid: "73ec0f24-1" },
                on: { click: _vm.pickerCancel }
              },
              [_vm._v("取消")]
            ),
            _c(
              "view",
              {
                staticClass: "mpvue-picker__action",
                style: { color: _vm.themeColor },
                attrs: { eventid: "73ec0f24-2" },
                on: { click: _vm.pickerConfirm }
              },
              [_vm._v("确定")]
            )
          ]
        ),
        _vm.mode === "selector" && _vm.pickerValueSingleArray.length > 0
          ? _c(
              "picker-view",
              {
                staticClass: "mpvue-picker-view",
                attrs: {
                  "indicator-style": "height: 40px;",
                  value: _vm.pickerValue,
                  eventid: "73ec0f24-3"
                },
                on: { change: _vm.pickerChange }
              },
              [
                _c(
                  "block",
                  [
                    _c(
                      "picker-view-column",
                      { attrs: { mpcomid: "73ec0f24-0" } },
                      _vm._l(_vm.pickerValueSingleArray, function(item, index) {
                        return _c(
                          "view",
                          { key: index, staticClass: "picker-item" },
                          [_vm._v(_vm._s(item.label))]
                        )
                      })
                    )
                  ],
                  1
                )
              ],
              1
            )
          : _vm._e(),
        _vm.mode === "timeSelector"
          ? _c(
              "picker-view",
              {
                staticClass: "mpvue-picker-view",
                attrs: {
                  "indicator-style": "height: 40px;",
                  value: _vm.pickerValue,
                  eventid: "73ec0f24-4"
                },
                on: { change: _vm.pickerChange }
              },
              [
                _c(
                  "block",
                  [
                    _c(
                      "picker-view-column",
                      { attrs: { mpcomid: "73ec0f24-1" } },
                      _vm._l(_vm.pickerValueHour, function(item, index) {
                        return _c(
                          "view",
                          { key: index, staticClass: "picker-item" },
                          [_vm._v(_vm._s(item.label))]
                        )
                      })
                    ),
                    _c(
                      "picker-view-column",
                      { attrs: { mpcomid: "73ec0f24-2" } },
                      _vm._l(_vm.pickerValueMinute, function(item, index) {
                        return _c(
                          "view",
                          { key: index, staticClass: "picker-item" },
                          [_vm._v(_vm._s(item.label))]
                        )
                      })
                    )
                  ],
                  1
                )
              ],
              1
            )
          : _vm._e(),
        _vm.mode === "multiSelector"
          ? _c(
              "picker-view",
              {
                staticClass: "mpvue-picker-view",
                attrs: {
                  "indicator-style": "height: 40px;",
                  value: _vm.pickerValue,
                  eventid: "73ec0f24-5"
                },
                on: { change: _vm.pickerChange }
              },
              _vm._l(_vm.pickerValueMulArray.length, function(n, index) {
                return _c(
                  "block",
                  { key: index },
                  [
                    _c(
                      "picker-view-column",
                      { attrs: { mpcomid: "73ec0f24-3-" + index } },
                      _vm._l(_vm.pickerValueMulArray[n], function(
                        item,
                        index1
                      ) {
                        return _c(
                          "view",
                          { key: index1, staticClass: "picker-item" },
                          [_vm._v(_vm._s(item.label))]
                        )
                      })
                    )
                  ],
                  1
                )
              })
            )
          : _vm._e(),
        _vm.mode === "multiLinkageSelector" && _vm.deepLength === 2
          ? _c(
              "picker-view",
              {
                staticClass: "mpvue-picker-view",
                attrs: {
                  "indicator-style": "height: 40px;",
                  value: _vm.pickerValue,
                  eventid: "73ec0f24-6"
                },
                on: { change: _vm.pickerChangeMul }
              },
              [
                _c(
                  "block",
                  [
                    _c(
                      "picker-view-column",
                      { attrs: { mpcomid: "73ec0f24-4" } },
                      _vm._l(_vm.pickerValueMulTwoOne, function(item, index) {
                        return _c(
                          "view",
                          { key: index, staticClass: "picker-item" },
                          [_vm._v(_vm._s(item.label))]
                        )
                      })
                    ),
                    _c(
                      "picker-view-column",
                      { attrs: { mpcomid: "73ec0f24-5" } },
                      _vm._l(_vm.pickerValueMulTwoTwo, function(item, index) {
                        return _c(
                          "view",
                          { key: index, staticClass: "picker-item" },
                          [_vm._v(_vm._s(item.label))]
                        )
                      })
                    )
                  ],
                  1
                )
              ],
              1
            )
          : _vm._e(),
        _vm.mode === "multiLinkageSelector" && _vm.deepLength === 3
          ? _c(
              "picker-view",
              {
                staticClass: "mpvue-picker-view",
                attrs: {
                  "indicator-style": "height: 40px;",
                  value: _vm.pickerValue,
                  eventid: "73ec0f24-7"
                },
                on: { change: _vm.pickerChangeMul }
              },
              [
                _c(
                  "block",
                  [
                    _c(
                      "picker-view-column",
                      { attrs: { mpcomid: "73ec0f24-6" } },
                      _vm._l(_vm.pickerValueMulThreeOne, function(item, index) {
                        return _c(
                          "view",
                          { key: index, staticClass: "picker-item" },
                          [_vm._v(_vm._s(item.label))]
                        )
                      })
                    ),
                    _c(
                      "picker-view-column",
                      { attrs: { mpcomid: "73ec0f24-7" } },
                      _vm._l(_vm.pickerValueMulThreeTwo, function(item, index) {
                        return _c(
                          "view",
                          { key: index, staticClass: "picker-item" },
                          [_vm._v(_vm._s(item.label))]
                        )
                      })
                    ),
                    _c(
                      "picker-view-column",
                      { attrs: { mpcomid: "73ec0f24-8" } },
                      _vm._l(_vm.pickerValueMulThreeThree, function(
                        item,
                        index
                      ) {
                        return _c(
                          "view",
                          { key: index, staticClass: "picker-item" },
                          [_vm._v(_vm._s(item.label))]
                        )
                      })
                    )
                  ],
                  1
                )
              ],
              1
            )
          : _vm._e()
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\common\\city.data.js":
/*!****************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/common/city.data.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = [{ "value": 110000, "label": "北京市", "children": [{ "value": 110101, "label": "东城区" }, { "value": 110102, "label": "西城区" }, { "value": 110105, "label": "朝阳区" }, { "value": 110106, "label": "丰台区" }, { "value": 110107, "label": "石景山区" }, { "value": 110108, "label": "海淀区" }, { "value": 110109, "label": "门头沟区" }, { "value": 110111, "label": "房山区" }, { "value": 110112, "label": "通州区" }, { "value": 110113, "label": "顺义区" }, { "value": 110114, "label": "昌平区" }, { "value": 110115, "label": "大兴区" }, { "value": 110116, "label": "怀柔区" }, { "value": 110117, "label": "平谷区" }, { "value": 110118, "label": "密云区" }, { "value": 110119, "label": "延庆区" }] }, { "value": 120000, "label": "天津市", "children": [{ "value": 120101, "label": "和平区" }, { "value": 120102, "label": "河东区" }, { "value": 120103, "label": "河西区" }, { "value": 120104, "label": "南开区" }, { "value": 120105, "label": "河北区" }, { "value": 120106, "label": "红桥区" }, { "value": 120110, "label": "东丽区" }, { "value": 120111, "label": "西青区" }, { "value": 120112, "label": "津南区" }, { "value": 120113, "label": "北辰区" }, { "value": 120114, "label": "武清区" }, { "value": 120115, "label": "宝坻区" }, { "value": 120116, "label": "滨海新区" }, { "value": 120117, "label": "宁河区" }, { "value": 120118, "label": "静海区" }, { "value": 120119, "label": "蓟州区" }] }, { "value": 130000, "label": "河北省", "children": [{ "value": 130100, "label": "石家庄市" }, { "value": 130200, "label": "唐山市" }, { "value": 130300, "label": "秦皇岛市" }, { "value": 130400, "label": "邯郸市" }, { "value": 130500, "label": "邢台市" }, { "value": 130600, "label": "保定市" }, { "value": 130700, "label": "张家口市" }, { "value": 130800, "label": "承德市" }, { "value": 130900, "label": "沧州市" }, { "value": 131000, "label": "廊坊市" }, { "value": 131100, "label": "衡水市" }, { "value": 139000, "label": "省直辖县级行政区划" }] }, { "value": 140000, "label": "山西省", "children": [{ "value": 140100, "label": "太原市" }, { "value": 140200, "label": "大同市" }, { "value": 140300, "label": "阳泉市" }, { "value": 140400, "label": "长治市" }, { "value": 140500, "label": "晋城市" }, { "value": 140600, "label": "朔州市" }, { "value": 140700, "label": "晋中市" }, { "value": 140800, "label": "运城市" }, { "value": 140900, "label": "忻州市" }, { "value": 141000, "label": "临汾市" }, { "value": 141100, "label": "吕梁市" }] }, { "value": 150000, "label": "内蒙古自治区", "children": [{ "value": 150100, "label": "呼和浩特市" }, { "value": 150200, "label": "包头市" }, { "value": 150300, "label": "乌海市" }, { "value": 150400, "label": "赤峰市" }, { "value": 150500, "label": "通辽市" }, { "value": 150600, "label": "鄂尔多斯市" }, { "value": 150700, "label": "呼伦贝尔市" }, { "value": 150800, "label": "巴彦淖尔市" }, { "value": 150900, "label": "乌兰察布市" }, { "value": 152200, "label": "兴安盟" }, { "value": 152500, "label": "锡林郭勒盟" }, { "value": 152900, "label": "阿拉善盟" }] }, { "value": 210000, "label": "辽宁省", "children": [{ "value": 210100, "label": "沈阳市" }, { "value": 210200, "label": "大连市" }, { "value": 210300, "label": "鞍山市" }, { "value": 210400, "label": "抚顺市" }, { "value": 210500, "label": "本溪市" }, { "value": 210600, "label": "丹东市" }, { "value": 210700, "label": "锦州市" }, { "value": 210800, "label": "营口市" }, { "value": 210900, "label": "阜新市" }, { "value": 211000, "label": "辽阳市" }, { "value": 211100, "label": "盘锦市" }, { "value": 211200, "label": "铁岭市" }, { "value": 211300, "label": "朝阳市" }, { "value": 211400, "label": "葫芦岛市" }] }, { "value": 220000, "label": "吉林省", "children": [{ "value": 220100, "label": "长春市" }, { "value": 220200, "label": "吉林市" }, { "value": 220300, "label": "四平市" }, { "value": 220400, "label": "辽源市" }, { "value": 220500, "label": "通化市" }, { "value": 220600, "label": "白山市" }, { "value": 220700, "label": "松原市" }, { "value": 220800, "label": "白城市" }, { "value": 222400, "label": "延边朝鲜族自治州" }] }, { "value": 230000, "label": "黑龙江省", "children": [{ "value": 230100, "label": "哈尔滨市" }, { "value": 230200, "label": "齐齐哈尔市" }, { "value": 230300, "label": "鸡西市" }, { "value": 230400, "label": "鹤岗市" }, { "value": 230500, "label": "双鸭山市" }, { "value": 230600, "label": "大庆市" }, { "value": 230700, "label": "伊春市" }, { "value": 230800, "label": "佳木斯市" }, { "value": 230900, "label": "七台河市" }, { "value": 231000, "label": "牡丹江市" }, { "value": 231100, "label": "黑河市" }, { "value": 231200, "label": "绥化市" }, { "value": 232700, "label": "大兴安岭地区" }] }, { "value": 310000, "label": "上海市", "children": [{ "value": 310101, "label": "黄浦区" }, { "value": 310104, "label": "徐汇区" }, { "value": 310105, "label": "长宁区" }, { "value": 310106, "label": "静安区" }, { "value": 310107, "label": "普陀区" }, { "value": 310109, "label": "虹口区" }, { "value": 310110, "label": "杨浦区" }, { "value": 310112, "label": "闵行区" }, { "value": 310113, "label": "宝山区" }, { "value": 310114, "label": "嘉定区" }, { "value": 310115, "label": "浦东新区" }, { "value": 310116, "label": "金山区" }, { "value": 310117, "label": "松江区" }, { "value": 310118, "label": "青浦区" }, { "value": 310120, "label": "奉贤区" }, { "value": 310151, "label": "崇明区" }] }, { "value": 320000, "label": "江苏省", "children": [{ "value": 320100, "label": "南京市" }, { "value": 320200, "label": "无锡市" }, { "value": 320300, "label": "徐州市" }, { "value": 320400, "label": "常州市" }, { "value": 320500, "label": "苏州市" }, { "value": 320600, "label": "南通市" }, { "value": 320700, "label": "连云港市" }, { "value": 320800, "label": "淮安市" }, { "value": 320900, "label": "盐城市" }, { "value": 321000, "label": "扬州市" }, { "value": 321100, "label": "镇江市" }, { "value": 321200, "label": "泰州市" }, { "value": 321300, "label": "宿迁市" }] }, { "value": 330000, "label": "浙江省", "children": [{ "value": 330100, "label": "杭州市" }, { "value": 330200, "label": "宁波市" }, { "value": 330300, "label": "温州市" }, { "value": 330400, "label": "嘉兴市" }, { "value": 330500, "label": "湖州市" }, { "value": 330600, "label": "绍兴市" }, { "value": 330700, "label": "金华市" }, { "value": 330800, "label": "衢州市" }, { "value": 330900, "label": "舟山市" }, { "value": 331000, "label": "台州市" }, { "value": 331100, "label": "丽水市" }] }, { "value": 340000, "label": "安徽省", "children": [{ "value": 340100, "label": "合肥市" }, { "value": 340200, "label": "芜湖市" }, { "value": 340300, "label": "蚌埠市" }, { "value": 340400, "label": "淮南市" }, { "value": 340500, "label": "马鞍山市" }, { "value": 340600, "label": "淮北市" }, { "value": 340700, "label": "铜陵市" }, { "value": 340800, "label": "安庆市" }, { "value": 341000, "label": "黄山市" }, { "value": 341100, "label": "滁州市" }, { "value": 341200, "label": "阜阳市" }, { "value": 341300, "label": "宿州市" }, { "value": 341500, "label": "六安市" }, { "value": 341600, "label": "亳州市" }, { "value": 341700, "label": "池州市" }, { "value": 341800, "label": "宣城市" }] }, { "value": 350000, "label": "福建省", "children": [{ "value": 350100, "label": "福州市" }, { "value": 350200, "label": "厦门市" }, { "value": 350300, "label": "莆田市" }, { "value": 350400, "label": "三明市" }, { "value": 350500, "label": "泉州市" }, { "value": 350600, "label": "漳州市" }, { "value": 350700, "label": "南平市" }, { "value": 350800, "label": "龙岩市" }, { "value": 350900, "label": "宁德市" }] }, { "value": 360000, "label": "江西省", "children": [{ "value": 360100, "label": "南昌市" }, { "value": 360200, "label": "景德镇市" }, { "value": 360300, "label": "萍乡市" }, { "value": 360400, "label": "九江市" }, { "value": 360500, "label": "新余市" }, { "value": 360600, "label": "鹰潭市" }, { "value": 360700, "label": "赣州市" }, { "value": 360800, "label": "吉安市" }, { "value": 360900, "label": "宜春市" }, { "value": 361000, "label": "抚州市" }, { "value": 361100, "label": "上饶市" }] }, { "value": 370000, "label": "山东省", "children": [{ "value": 370100, "label": "济南市" }, { "value": 370200, "label": "青岛市" }, { "value": 370300, "label": "淄博市" }, { "value": 370400, "label": "枣庄市" }, { "value": 370500, "label": "东营市" }, { "value": 370600, "label": "烟台市" }, { "value": 370700, "label": "潍坊市" }, { "value": 370800, "label": "济宁市" }, { "value": 370900, "label": "泰安市" }, { "value": 371000, "label": "威海市" }, { "value": 371100, "label": "日照市" }, { "value": 371200, "label": "莱芜市" }, { "value": 371300, "label": "临沂市" }, { "value": 371400, "label": "德州市" }, { "value": 371500, "label": "聊城市" }, { "value": 371600, "label": "滨州市" }, { "value": 371700, "label": "菏泽市" }] }, { "value": 410000, "label": "河南省", "children": [{ "value": 410100, "label": "郑州市" }, { "value": 410200, "label": "开封市" }, { "value": 410300, "label": "洛阳市" }, { "value": 410400, "label": "平顶山市" }, { "value": 410500, "label": "安阳市" }, { "value": 410600, "label": "鹤壁市" }, { "value": 410700, "label": "新乡市" }, { "value": 410800, "label": "焦作市" }, { "value": 410900, "label": "濮阳市" }, { "value": 411000, "label": "许昌市" }, { "value": 411100, "label": "漯河市" }, { "value": 411200, "label": "三门峡市" }, { "value": 411300, "label": "南阳市" }, { "value": 411400, "label": "商丘市" }, { "value": 411500, "label": "信阳市" }, { "value": 411600, "label": "周口市" }, { "value": 411700, "label": "驻马店市" }, { "value": 419000, "label": "省直辖县级行政区划" }] }, { "value": 420000, "label": "湖北省", "children": [{ "value": 420100, "label": "武汉市" }, { "value": 420200, "label": "黄石市" }, { "value": 420300, "label": "十堰市" }, { "value": 420500, "label": "宜昌市" }, { "value": 420600, "label": "襄阳市" }, { "value": 420700, "label": "鄂州市" }, { "value": 420800, "label": "荆门市" }, { "value": 420900, "label": "孝感市" }, { "value": 421000, "label": "荆州市" }, { "value": 421100, "label": "黄冈市" }, { "value": 421200, "label": "咸宁市" }, { "value": 421300, "label": "随州市" }, { "value": 422800, "label": "恩施土家族苗族自治州" }, { "value": 429000, "label": "省直辖县级行政区划" }] }, { "value": 430000, "label": "湖南省", "children": [{ "value": 430100, "label": "长沙市" }, { "value": 430200, "label": "株洲市" }, { "value": 430300, "label": "湘潭市" }, { "value": 430400, "label": "衡阳市" }, { "value": 430500, "label": "邵阳市" }, { "value": 430600, "label": "岳阳市" }, { "value": 430700, "label": "常德市" }, { "value": 430800, "label": "张家界市" }, { "value": 430900, "label": "益阳市" }, { "value": 431000, "label": "郴州市" }, { "value": 431100, "label": "永州市" }, { "value": 431200, "label": "怀化市" }, { "value": 431300, "label": "娄底市" }, { "value": 433100, "label": "湘西土家族苗族自治州" }] }, { "value": 440000, "label": "广东省", "children": [{ "value": 440100, "label": "广州市" }, { "value": 440200, "label": "韶关市" }, { "value": 440300, "label": "深圳市" }, { "value": 440400, "label": "珠海市" }, { "value": 440500, "label": "汕头市" }, { "value": 440600, "label": "佛山市" }, { "value": 440700, "label": "江门市" }, { "value": 440800, "label": "湛江市" }, { "value": 440900, "label": "茂名市" }, { "value": 441200, "label": "肇庆市" }, { "value": 441300, "label": "惠州市" }, { "value": 441400, "label": "梅州市" }, { "value": 441500, "label": "汕尾市" }, { "value": 441600, "label": "河源市" }, { "value": 441700, "label": "阳江市" }, { "value": 441800, "label": "清远市" }, { "value": 441900, "label": "东莞市" }, { "value": 442000, "label": "中山市" }, { "value": 445100, "label": "潮州市" }, { "value": 445200, "label": "揭阳市" }, { "value": 445300, "label": "云浮市" }] }, { "value": 450000, "label": "广西壮族自治区", "children": [{ "value": 450100, "label": "南宁市" }, { "value": 450200, "label": "柳州市" }, { "value": 450300, "label": "桂林市" }, { "value": 450400, "label": "梧州市" }, { "value": 450500, "label": "北海市" }, { "value": 450600, "label": "防城港市" }, { "value": 450700, "label": "钦州市" }, { "value": 450800, "label": "贵港市" }, { "value": 450900, "label": "玉林市" }, { "value": 451000, "label": "百色市" }, { "value": 451100, "label": "贺州市" }, { "value": 451200, "label": "河池市" }, { "value": 451300, "label": "来宾市" }, { "value": 451400, "label": "崇左市" }] }, { "value": 460000, "label": "海南省", "children": [{ "value": 460100, "label": "海口市" }, { "value": 460200, "label": "三亚市" }, { "value": 460300, "label": "三沙市" }, { "value": 460400, "label": "儋州市" }, { "value": 469000, "label": "省直辖县级行政区划" }] }, { "value": 500000, "label": "重庆市", "children": [{ "value": 500101, "label": "万州区" }, { "value": 500102, "label": "涪陵区" }, { "value": 500103, "label": "渝中区" }, { "value": 500104, "label": "大渡口区" }, { "value": 500105, "label": "江北区" }, { "value": 500106, "label": "沙坪坝区" }, { "value": 500107, "label": "九龙坡区" }, { "value": 500108, "label": "南岸区" }, { "value": 500109, "label": "北碚区" }, { "value": 500110, "label": "綦江区" }, { "value": 500111, "label": "大足区" }, { "value": 500112, "label": "渝北区" }, { "value": 500113, "label": "巴南区" }, { "value": 500114, "label": "黔江区" }, { "value": 500115, "label": "长寿区" }, { "value": 500116, "label": "江津区" }, { "value": 500117, "label": "合川区" }, { "value": 500118, "label": "永川区" }, { "value": 500119, "label": "南川区" }, { "value": 500120, "label": "璧山区" }, { "value": 500151, "label": "铜梁区" }, { "value": 500152, "label": "潼南区" }, { "value": 500153, "label": "荣昌区" }, { "value": 500154, "label": "开州区" }] }, { "value": 510000, "label": "四川省", "children": [{ "value": 510100, "label": "成都市" }, { "value": 510300, "label": "自贡市" }, { "value": 510400, "label": "攀枝花市" }, { "value": 510500, "label": "泸州市" }, { "value": 510600, "label": "德阳市" }, { "value": 510700, "label": "绵阳市" }, { "value": 510800, "label": "广元市" }, { "value": 510900, "label": "遂宁市" }, { "value": 511000, "label": "内江市" }, { "value": 511100, "label": "乐山市" }, { "value": 511300, "label": "南充市" }, { "value": 511400, "label": "眉山市" }, { "value": 511500, "label": "宜宾市" }, { "value": 511600, "label": "广安市" }, { "value": 511700, "label": "达州市" }, { "value": 511800, "label": "雅安市" }, { "value": 511900, "label": "巴中市" }, { "value": 512000, "label": "资阳市" }, { "value": 513200, "label": "阿坝藏族羌族自治州" }, { "value": 513300, "label": "甘孜藏族自治州" }, { "value": 513400, "label": "凉山彝族自治州" }] }, { "value": 520000, "label": "贵州省", "children": [{ "value": 520100, "label": "贵阳市" }, { "value": 520200, "label": "六盘水市" }, { "value": 520300, "label": "遵义市" }, { "value": 520400, "label": "安顺市" }, { "value": 520500, "label": "毕节市" }, { "value": 520600, "label": "铜仁市" }, { "value": 522300, "label": "黔西南布依族苗族自治州" }, { "value": 522600, "label": "黔东南苗族侗族自治州" }, { "value": 522700, "label": "黔南布依族苗族自治州" }] }, { "value": 530000, "label": "云南省", "children": [{ "value": 530100, "label": "昆明市" }, { "value": 530300, "label": "曲靖市" }, { "value": 530400, "label": "玉溪市" }, { "value": 530500, "label": "保山市" }, { "value": 530600, "label": "昭通市" }, { "value": 530700, "label": "丽江市" }, { "value": 530800, "label": "普洱市" }, { "value": 530900, "label": "临沧市" }, { "value": 532300, "label": "楚雄彝族自治州" }, { "value": 532500, "label": "红河哈尼族彝族自治州" }, { "value": 532600, "label": "文山壮族苗族自治州" }, { "value": 532800, "label": "西双版纳傣族自治州" }, { "value": 532900, "label": "大理白族自治州" }, { "value": 533100, "label": "德宏傣族景颇族自治州" }, { "value": 533300, "label": "怒江傈僳族自治州" }, { "value": 533400, "label": "迪庆藏族自治州" }] }, { "value": 540000, "label": "西藏自治区", "children": [{ "value": 540100, "label": "拉萨市" }, { "value": 540200, "label": "日喀则市" }, { "value": 540300, "label": "昌都市" }, { "value": 540400, "label": "林芝市" }, { "value": 540500, "label": "山南市" }, { "value": 542400, "label": "那曲地区" }, { "value": 542500, "label": "阿里地区" }] }, { "value": 610000, "label": "陕西省", "children": [{ "value": 610100, "label": "西安市" }, { "value": 610200, "label": "铜川市" }, { "value": 610300, "label": "宝鸡市" }, { "value": 610400, "label": "咸阳市" }, { "value": 610500, "label": "渭南市" }, { "value": 610600, "label": "延安市" }, { "value": 610700, "label": "汉中市" }, { "value": 610800, "label": "榆林市" }, { "value": 610900, "label": "安康市" }, { "value": 611000, "label": "商洛市" }] }, { "value": 620000, "label": "甘肃省", "children": [{ "value": 620100, "label": "兰州市" }, { "value": 620200, "label": "嘉峪关市" }, { "value": 620300, "label": "金昌市" }, { "value": 620400, "label": "白银市" }, { "value": 620500, "label": "天水市" }, { "value": 620600, "label": "武威市" }, { "value": 620700, "label": "张掖市" }, { "value": 620800, "label": "平凉市" }, { "value": 620900, "label": "酒泉市" }, { "value": 621000, "label": "庆阳市" }, { "value": 621100, "label": "定西市" }, { "value": 621200, "label": "陇南市" }, { "value": 622900, "label": "临夏回族自治州" }, { "value": 623000, "label": "甘南藏族自治州" }] }, { "value": 630000, "label": "青海省", "children": [{ "value": 630100, "label": "西宁市" }, { "value": 630200, "label": "海东市" }, { "value": 632200, "label": "海北藏族自治州" }, { "value": 632300, "label": "黄南藏族自治州" }, { "value": 632500, "label": "海南藏族自治州" }, { "value": 632600, "label": "果洛藏族自治州" }, { "value": 632700, "label": "玉树藏族自治州" }, { "value": 632800, "label": "海西蒙古族藏族自治州" }] }, { "value": 640000, "label": "宁夏回族自治区", "children": [{ "value": 640100, "label": "银川市" }, { "value": 640200, "label": "石嘴山市" }, { "value": 640300, "label": "吴忠市" }, { "value": 640400, "label": "固原市" }, { "value": 640500, "label": "中卫市" }] }, { "value": 650000, "label": "新疆维吾尔自治区", "children": [{ "value": 650100, "label": "乌鲁木齐市" }, { "value": 650200, "label": "克拉玛依市" }, { "value": 650400, "label": "吐鲁番市" }, { "value": 650500, "label": "哈密市" }, { "value": 652300, "label": "昌吉回族自治州" }, { "value": 652700, "label": "博尔塔拉蒙古自治州" }, { "value": 652800, "label": "巴音郭楞蒙古自治州" }, { "value": 652900, "label": "阿克苏地区" }, { "value": 653000, "label": "克孜勒苏柯尔克孜自治州" }, { "value": 653100, "label": "喀什地区" }, { "value": 653200, "label": "和田地区" }, { "value": 654000, "label": "伊犁哈萨克自治州" }, { "value": 654200, "label": "塔城地区" }, { "value": 654300, "label": "阿勒泰地区" }, { "value": 659000, "label": "自治区直辖县级行政区划" }] }, { "value": 710000, "label": "台湾省", "children": [{ "value": "710100", "label": "台北市" }, { "value": "710200", "label": "高雄市" }, { "value": "710300", "label": "台南市" }, { "value": "710400", "label": "台中市" }, { "value": "710500", "label": "金门县" }, { "value": "710600", "label": "南投县" }, { "value": "710700", "label": "基隆市" }, { "value": "710800", "label": "新竹市" }, { "value": "710900", "label": "嘉义市" }, { "value": "711100", "label": "新北市" }, { "value": "711200", "label": "宜兰县" }, { "value": "711300", "label": "新竹县" }, { "value": "711400", "label": "桃园县" }, { "value": "711500", "label": "苗栗县" }, { "value": "711700", "label": "彰化县" }, { "value": "711900", "label": "嘉义县" }, { "value": "712100", "label": "云林县" }, { "value": "712400", "label": "屏东县" }, { "value": "712500", "label": "台东县" }, { "value": "712600", "label": "花莲县" }, { "value": "712700", "label": "澎湖县" }] }, { "value": 810000, "label": "香港特别行政区", "children": [{ "value": "810100", "label": "香港岛" }, { "value": "810200", "label": "九龙" }, { "value": "810300", "label": "新界" }] }, { "value": 820000, "label": "澳门特别行政区", "children": [{ "value": "820100", "label": "澳门半岛" }, { "value": "820200", "label": "氹仔岛" }, { "value": "820300", "label": "路环岛" }] }];exports.default = _default;

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\common\\city.js":
/*!***********************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/common/city.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var cityData =
{
  "RECORDS": [
  {
    "id": "110000",
    "name": "北京市",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "110100",
    "name": "北京市",
    "parent_id": "110000",
    "level_type": "2" },

  {
    "id": "110101",
    "name": "东城区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110102",
    "name": "西城区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110105",
    "name": "朝阳区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110106",
    "name": "丰台区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110107",
    "name": "石景山区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110108",
    "name": "海淀区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110109",
    "name": "门头沟区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110111",
    "name": "房山区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110112",
    "name": "通州区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110113",
    "name": "顺义区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110114",
    "name": "昌平区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110115",
    "name": "大兴区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110116",
    "name": "怀柔区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110117",
    "name": "平谷区",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110228",
    "name": "密云县",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "110229",
    "name": "延庆县",
    "parent_id": "110100",
    "level_type": "3" },

  {
    "id": "120000",
    "name": "天津市",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "120100",
    "name": "天津市",
    "parent_id": "120000",
    "level_type": "2" },

  {
    "id": "120101",
    "name": "和平区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120102",
    "name": "河东区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120103",
    "name": "河西区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120104",
    "name": "南开区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120105",
    "name": "河北区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120106",
    "name": "红桥区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120110",
    "name": "东丽区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120111",
    "name": "西青区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120112",
    "name": "津南区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120113",
    "name": "北辰区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120114",
    "name": "武清区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120115",
    "name": "宝坻区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120116",
    "name": "滨海新区",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120221",
    "name": "宁河县",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120223",
    "name": "静海县",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "120225",
    "name": "蓟县",
    "parent_id": "120100",
    "level_type": "3" },

  {
    "id": "130000",
    "name": "河北省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "130100",
    "name": "石家庄市",
    "parent_id": "130000",
    "level_type": "2" },

  {
    "id": "130102",
    "name": "长安区",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130104",
    "name": "桥西区",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130105",
    "name": "新华区",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130107",
    "name": "井陉矿区",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130108",
    "name": "裕华区",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130109",
    "name": "藁城区",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130110",
    "name": "鹿泉区",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130111",
    "name": "栾城区",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130121",
    "name": "井陉县",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130123",
    "name": "正定县",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130125",
    "name": "行唐县",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130126",
    "name": "灵寿县",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130127",
    "name": "高邑县",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130128",
    "name": "深泽县",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130129",
    "name": "赞皇县",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130130",
    "name": "无极县",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130131",
    "name": "平山县",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130132",
    "name": "元氏县",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130133",
    "name": "赵县",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130181",
    "name": "辛集市",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130183",
    "name": "晋州市",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130184",
    "name": "新乐市",
    "parent_id": "130100",
    "level_type": "3" },

  {
    "id": "130200",
    "name": "唐山市",
    "parent_id": "130000",
    "level_type": "2" },

  {
    "id": "130202",
    "name": "路南区",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130203",
    "name": "路北区",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130204",
    "name": "古冶区",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130205",
    "name": "开平区",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130207",
    "name": "丰南区",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130208",
    "name": "丰润区",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130209",
    "name": "曹妃甸区",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130223",
    "name": "滦县",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130224",
    "name": "滦南县",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130225",
    "name": "乐亭县",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130227",
    "name": "迁西县",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130229",
    "name": "玉田县",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130281",
    "name": "遵化市",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130283",
    "name": "迁安市",
    "parent_id": "130200",
    "level_type": "3" },

  {
    "id": "130300",
    "name": "秦皇岛市",
    "parent_id": "130000",
    "level_type": "2" },

  {
    "id": "130302",
    "name": "海港区",
    "parent_id": "130300",
    "level_type": "3" },

  {
    "id": "130303",
    "name": "山海关区",
    "parent_id": "130300",
    "level_type": "3" },

  {
    "id": "130304",
    "name": "北戴河区",
    "parent_id": "130300",
    "level_type": "3" },

  {
    "id": "130321",
    "name": "青龙满族自治县",
    "parent_id": "130300",
    "level_type": "3" },

  {
    "id": "130322",
    "name": "昌黎县",
    "parent_id": "130300",
    "level_type": "3" },

  {
    "id": "130323",
    "name": "抚宁县",
    "parent_id": "130300",
    "level_type": "3" },

  {
    "id": "130324",
    "name": "卢龙县",
    "parent_id": "130300",
    "level_type": "3" },

  {
    "id": "130400",
    "name": "邯郸市",
    "parent_id": "130000",
    "level_type": "2" },

  {
    "id": "130402",
    "name": "邯山区",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130403",
    "name": "丛台区",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130404",
    "name": "复兴区",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130406",
    "name": "峰峰矿区",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130421",
    "name": "邯郸县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130423",
    "name": "临漳县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130424",
    "name": "成安县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130425",
    "name": "大名县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130426",
    "name": "涉县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130427",
    "name": "磁县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130428",
    "name": "肥乡县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130429",
    "name": "永年县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130430",
    "name": "邱县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130431",
    "name": "鸡泽县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130432",
    "name": "广平县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130433",
    "name": "馆陶县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130434",
    "name": "魏县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130435",
    "name": "曲周县",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130481",
    "name": "武安市",
    "parent_id": "130400",
    "level_type": "3" },

  {
    "id": "130500",
    "name": "邢台市",
    "parent_id": "130000",
    "level_type": "2" },

  {
    "id": "130502",
    "name": "桥东区",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130503",
    "name": "桥西区",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130521",
    "name": "邢台县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130522",
    "name": "临城县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130523",
    "name": "内丘县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130524",
    "name": "柏乡县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130525",
    "name": "隆尧县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130526",
    "name": "任县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130527",
    "name": "南和县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130528",
    "name": "宁晋县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130529",
    "name": "巨鹿县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130530",
    "name": "新河县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130531",
    "name": "广宗县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130532",
    "name": "平乡县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130533",
    "name": "威县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130534",
    "name": "清河县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130535",
    "name": "临西县",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130581",
    "name": "南宫市",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130582",
    "name": "沙河市",
    "parent_id": "130500",
    "level_type": "3" },

  {
    "id": "130600",
    "name": "保定市",
    "parent_id": "130000",
    "level_type": "2" },

  {
    "id": "130602",
    "name": "新市区",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130603",
    "name": "北市区",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130604",
    "name": "南市区",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130621",
    "name": "满城县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130622",
    "name": "清苑县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130623",
    "name": "涞水县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130624",
    "name": "阜平县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130625",
    "name": "徐水县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130626",
    "name": "定兴县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130627",
    "name": "唐县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130628",
    "name": "高阳县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130629",
    "name": "容城县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130630",
    "name": "涞源县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130631",
    "name": "望都县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130632",
    "name": "安新县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130633",
    "name": "易县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130634",
    "name": "曲阳县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130635",
    "name": "蠡县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130636",
    "name": "顺平县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130637",
    "name": "博野县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130638",
    "name": "雄县",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130681",
    "name": "涿州市",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130682",
    "name": "定州市",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130683",
    "name": "安国市",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130684",
    "name": "高碑店市",
    "parent_id": "130600",
    "level_type": "3" },

  {
    "id": "130700",
    "name": "张家口市",
    "parent_id": "130000",
    "level_type": "2" },

  {
    "id": "130702",
    "name": "桥东区",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130703",
    "name": "桥西区",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130705",
    "name": "宣化区",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130706",
    "name": "下花园区",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130721",
    "name": "宣化县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130722",
    "name": "张北县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130723",
    "name": "康保县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130724",
    "name": "沽源县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130725",
    "name": "尚义县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130726",
    "name": "蔚县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130727",
    "name": "阳原县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130728",
    "name": "怀安县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130729",
    "name": "万全县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130730",
    "name": "怀来县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130731",
    "name": "涿鹿县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130732",
    "name": "赤城县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130733",
    "name": "崇礼县",
    "parent_id": "130700",
    "level_type": "3" },

  {
    "id": "130800",
    "name": "承德市",
    "parent_id": "130000",
    "level_type": "2" },

  {
    "id": "130802",
    "name": "双桥区",
    "parent_id": "130800",
    "level_type": "3" },

  {
    "id": "130803",
    "name": "双滦区",
    "parent_id": "130800",
    "level_type": "3" },

  {
    "id": "130804",
    "name": "鹰手营子矿区",
    "parent_id": "130800",
    "level_type": "3" },

  {
    "id": "130821",
    "name": "承德县",
    "parent_id": "130800",
    "level_type": "3" },

  {
    "id": "130822",
    "name": "兴隆县",
    "parent_id": "130800",
    "level_type": "3" },

  {
    "id": "130823",
    "name": "平泉县",
    "parent_id": "130800",
    "level_type": "3" },

  {
    "id": "130824",
    "name": "滦平县",
    "parent_id": "130800",
    "level_type": "3" },

  {
    "id": "130825",
    "name": "隆化县",
    "parent_id": "130800",
    "level_type": "3" },

  {
    "id": "130826",
    "name": "丰宁满族自治县",
    "parent_id": "130800",
    "level_type": "3" },

  {
    "id": "130827",
    "name": "宽城满族自治县",
    "parent_id": "130800",
    "level_type": "3" },

  {
    "id": "130828",
    "name": "围场满族蒙古族自治县",
    "parent_id": "130800",
    "level_type": "3" },

  {
    "id": "130900",
    "name": "沧州市",
    "parent_id": "130000",
    "level_type": "2" },

  {
    "id": "130902",
    "name": "新华区",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130903",
    "name": "运河区",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130921",
    "name": "沧县",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130922",
    "name": "青县",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130923",
    "name": "东光县",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130924",
    "name": "海兴县",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130925",
    "name": "盐山县",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130926",
    "name": "肃宁县",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130927",
    "name": "南皮县",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130928",
    "name": "吴桥县",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130929",
    "name": "献县",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130930",
    "name": "孟村回族自治县",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130981",
    "name": "泊头市",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130982",
    "name": "任丘市",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130983",
    "name": "黄骅市",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "130984",
    "name": "河间市",
    "parent_id": "130900",
    "level_type": "3" },

  {
    "id": "131000",
    "name": "廊坊市",
    "parent_id": "130000",
    "level_type": "2" },

  {
    "id": "131002",
    "name": "安次区",
    "parent_id": "131000",
    "level_type": "3" },

  {
    "id": "131003",
    "name": "广阳区",
    "parent_id": "131000",
    "level_type": "3" },

  {
    "id": "131022",
    "name": "固安县",
    "parent_id": "131000",
    "level_type": "3" },

  {
    "id": "131023",
    "name": "永清县",
    "parent_id": "131000",
    "level_type": "3" },

  {
    "id": "131024",
    "name": "香河县",
    "parent_id": "131000",
    "level_type": "3" },

  {
    "id": "131025",
    "name": "大城县",
    "parent_id": "131000",
    "level_type": "3" },

  {
    "id": "131026",
    "name": "文安县",
    "parent_id": "131000",
    "level_type": "3" },

  {
    "id": "131028",
    "name": "大厂回族自治县",
    "parent_id": "131000",
    "level_type": "3" },

  {
    "id": "131081",
    "name": "霸州市",
    "parent_id": "131000",
    "level_type": "3" },

  {
    "id": "131082",
    "name": "三河市",
    "parent_id": "131000",
    "level_type": "3" },

  {
    "id": "131100",
    "name": "衡水市",
    "parent_id": "130000",
    "level_type": "2" },

  {
    "id": "131102",
    "name": "桃城区",
    "parent_id": "131100",
    "level_type": "3" },

  {
    "id": "131121",
    "name": "枣强县",
    "parent_id": "131100",
    "level_type": "3" },

  {
    "id": "131122",
    "name": "武邑县",
    "parent_id": "131100",
    "level_type": "3" },

  {
    "id": "131123",
    "name": "武强县",
    "parent_id": "131100",
    "level_type": "3" },

  {
    "id": "131124",
    "name": "饶阳县",
    "parent_id": "131100",
    "level_type": "3" },

  {
    "id": "131125",
    "name": "安平县",
    "parent_id": "131100",
    "level_type": "3" },

  {
    "id": "131126",
    "name": "故城县",
    "parent_id": "131100",
    "level_type": "3" },

  {
    "id": "131127",
    "name": "景县",
    "parent_id": "131100",
    "level_type": "3" },

  {
    "id": "131128",
    "name": "阜城县",
    "parent_id": "131100",
    "level_type": "3" },

  {
    "id": "131181",
    "name": "冀州市",
    "parent_id": "131100",
    "level_type": "3" },

  {
    "id": "131182",
    "name": "深州市",
    "parent_id": "131100",
    "level_type": "3" },

  {
    "id": "140000",
    "name": "山西省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "140100",
    "name": "太原市",
    "parent_id": "140000",
    "level_type": "2" },

  {
    "id": "140105",
    "name": "小店区",
    "parent_id": "140100",
    "level_type": "3" },

  {
    "id": "140106",
    "name": "迎泽区",
    "parent_id": "140100",
    "level_type": "3" },

  {
    "id": "140107",
    "name": "杏花岭区",
    "parent_id": "140100",
    "level_type": "3" },

  {
    "id": "140108",
    "name": "尖草坪区",
    "parent_id": "140100",
    "level_type": "3" },

  {
    "id": "140109",
    "name": "万柏林区",
    "parent_id": "140100",
    "level_type": "3" },

  {
    "id": "140110",
    "name": "晋源区",
    "parent_id": "140100",
    "level_type": "3" },

  {
    "id": "140121",
    "name": "清徐县",
    "parent_id": "140100",
    "level_type": "3" },

  {
    "id": "140122",
    "name": "阳曲县",
    "parent_id": "140100",
    "level_type": "3" },

  {
    "id": "140123",
    "name": "娄烦县",
    "parent_id": "140100",
    "level_type": "3" },

  {
    "id": "140181",
    "name": "古交市",
    "parent_id": "140100",
    "level_type": "3" },

  {
    "id": "140200",
    "name": "大同市",
    "parent_id": "140000",
    "level_type": "2" },

  {
    "id": "140202",
    "name": "城区",
    "parent_id": "140200",
    "level_type": "3" },

  {
    "id": "140203",
    "name": "矿区",
    "parent_id": "140200",
    "level_type": "3" },

  {
    "id": "140211",
    "name": "南郊区",
    "parent_id": "140200",
    "level_type": "3" },

  {
    "id": "140212",
    "name": "新荣区",
    "parent_id": "140200",
    "level_type": "3" },

  {
    "id": "140221",
    "name": "阳高县",
    "parent_id": "140200",
    "level_type": "3" },

  {
    "id": "140222",
    "name": "天镇县",
    "parent_id": "140200",
    "level_type": "3" },

  {
    "id": "140223",
    "name": "广灵县",
    "parent_id": "140200",
    "level_type": "3" },

  {
    "id": "140224",
    "name": "灵丘县",
    "parent_id": "140200",
    "level_type": "3" },

  {
    "id": "140225",
    "name": "浑源县",
    "parent_id": "140200",
    "level_type": "3" },

  {
    "id": "140226",
    "name": "左云县",
    "parent_id": "140200",
    "level_type": "3" },

  {
    "id": "140227",
    "name": "大同县",
    "parent_id": "140200",
    "level_type": "3" },

  {
    "id": "140300",
    "name": "阳泉市",
    "parent_id": "140000",
    "level_type": "2" },

  {
    "id": "140302",
    "name": "城区",
    "parent_id": "140300",
    "level_type": "3" },

  {
    "id": "140303",
    "name": "矿区",
    "parent_id": "140300",
    "level_type": "3" },

  {
    "id": "140311",
    "name": "郊区",
    "parent_id": "140300",
    "level_type": "3" },

  {
    "id": "140321",
    "name": "平定县",
    "parent_id": "140300",
    "level_type": "3" },

  {
    "id": "140322",
    "name": "盂县",
    "parent_id": "140300",
    "level_type": "3" },

  {
    "id": "140400",
    "name": "长治市",
    "parent_id": "140000",
    "level_type": "2" },

  {
    "id": "140402",
    "name": "城区",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140411",
    "name": "郊区",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140421",
    "name": "长治县",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140423",
    "name": "襄垣县",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140424",
    "name": "屯留县",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140425",
    "name": "平顺县",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140426",
    "name": "黎城县",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140427",
    "name": "壶关县",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140428",
    "name": "长子县",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140429",
    "name": "武乡县",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140430",
    "name": "沁县",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140431",
    "name": "沁源县",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140481",
    "name": "潞城市",
    "parent_id": "140400",
    "level_type": "3" },

  {
    "id": "140500",
    "name": "晋城市",
    "parent_id": "140000",
    "level_type": "2" },

  {
    "id": "140502",
    "name": "城区",
    "parent_id": "140500",
    "level_type": "3" },

  {
    "id": "140521",
    "name": "沁水县",
    "parent_id": "140500",
    "level_type": "3" },

  {
    "id": "140522",
    "name": "阳城县",
    "parent_id": "140500",
    "level_type": "3" },

  {
    "id": "140524",
    "name": "陵川县",
    "parent_id": "140500",
    "level_type": "3" },

  {
    "id": "140525",
    "name": "泽州县",
    "parent_id": "140500",
    "level_type": "3" },

  {
    "id": "140581",
    "name": "高平市",
    "parent_id": "140500",
    "level_type": "3" },

  {
    "id": "140600",
    "name": "朔州市",
    "parent_id": "140000",
    "level_type": "2" },

  {
    "id": "140602",
    "name": "朔城区",
    "parent_id": "140600",
    "level_type": "3" },

  {
    "id": "140603",
    "name": "平鲁区",
    "parent_id": "140600",
    "level_type": "3" },

  {
    "id": "140621",
    "name": "山阴县",
    "parent_id": "140600",
    "level_type": "3" },

  {
    "id": "140622",
    "name": "应县",
    "parent_id": "140600",
    "level_type": "3" },

  {
    "id": "140623",
    "name": "右玉县",
    "parent_id": "140600",
    "level_type": "3" },

  {
    "id": "140624",
    "name": "怀仁县",
    "parent_id": "140600",
    "level_type": "3" },

  {
    "id": "140700",
    "name": "晋中市",
    "parent_id": "140000",
    "level_type": "2" },

  {
    "id": "140702",
    "name": "榆次区",
    "parent_id": "140700",
    "level_type": "3" },

  {
    "id": "140721",
    "name": "榆社县",
    "parent_id": "140700",
    "level_type": "3" },

  {
    "id": "140722",
    "name": "左权县",
    "parent_id": "140700",
    "level_type": "3" },

  {
    "id": "140723",
    "name": "和顺县",
    "parent_id": "140700",
    "level_type": "3" },

  {
    "id": "140724",
    "name": "昔阳县",
    "parent_id": "140700",
    "level_type": "3" },

  {
    "id": "140725",
    "name": "寿阳县",
    "parent_id": "140700",
    "level_type": "3" },

  {
    "id": "140726",
    "name": "太谷县",
    "parent_id": "140700",
    "level_type": "3" },

  {
    "id": "140727",
    "name": "祁县",
    "parent_id": "140700",
    "level_type": "3" },

  {
    "id": "140728",
    "name": "平遥县",
    "parent_id": "140700",
    "level_type": "3" },

  {
    "id": "140729",
    "name": "灵石县",
    "parent_id": "140700",
    "level_type": "3" },

  {
    "id": "140781",
    "name": "介休市",
    "parent_id": "140700",
    "level_type": "3" },

  {
    "id": "140800",
    "name": "运城市",
    "parent_id": "140000",
    "level_type": "2" },

  {
    "id": "140802",
    "name": "盐湖区",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140821",
    "name": "临猗县",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140822",
    "name": "万荣县",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140823",
    "name": "闻喜县",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140824",
    "name": "稷山县",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140825",
    "name": "新绛县",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140826",
    "name": "绛县",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140827",
    "name": "垣曲县",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140828",
    "name": "夏县",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140829",
    "name": "平陆县",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140830",
    "name": "芮城县",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140881",
    "name": "永济市",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140882",
    "name": "河津市",
    "parent_id": "140800",
    "level_type": "3" },

  {
    "id": "140900",
    "name": "忻州市",
    "parent_id": "140000",
    "level_type": "2" },

  {
    "id": "140902",
    "name": "忻府区",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140921",
    "name": "定襄县",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140922",
    "name": "五台县",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140923",
    "name": "代县",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140924",
    "name": "繁峙县",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140925",
    "name": "宁武县",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140926",
    "name": "静乐县",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140927",
    "name": "神池县",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140928",
    "name": "五寨县",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140929",
    "name": "岢岚县",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140930",
    "name": "河曲县",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140931",
    "name": "保德县",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140932",
    "name": "偏关县",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "140981",
    "name": "原平市",
    "parent_id": "140900",
    "level_type": "3" },

  {
    "id": "141000",
    "name": "临汾市",
    "parent_id": "140000",
    "level_type": "2" },

  {
    "id": "141002",
    "name": "尧都区",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141021",
    "name": "曲沃县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141022",
    "name": "翼城县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141023",
    "name": "襄汾县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141024",
    "name": "洪洞县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141025",
    "name": "古县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141026",
    "name": "安泽县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141027",
    "name": "浮山县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141028",
    "name": "吉县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141029",
    "name": "乡宁县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141030",
    "name": "大宁县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141031",
    "name": "隰县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141032",
    "name": "永和县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141033",
    "name": "蒲县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141034",
    "name": "汾西县",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141081",
    "name": "侯马市",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141082",
    "name": "霍州市",
    "parent_id": "141000",
    "level_type": "3" },

  {
    "id": "141100",
    "name": "吕梁市",
    "parent_id": "140000",
    "level_type": "2" },

  {
    "id": "141102",
    "name": "离石区",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "141121",
    "name": "文水县",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "141122",
    "name": "交城县",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "141123",
    "name": "兴县",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "141124",
    "name": "临县",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "141125",
    "name": "柳林县",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "141126",
    "name": "石楼县",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "141127",
    "name": "岚县",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "141128",
    "name": "方山县",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "141129",
    "name": "中阳县",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "141130",
    "name": "交口县",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "141181",
    "name": "孝义市",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "141182",
    "name": "汾阳市",
    "parent_id": "141100",
    "level_type": "3" },

  {
    "id": "150000",
    "name": "内蒙古自治区",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "150100",
    "name": "呼和浩特市",
    "parent_id": "150000",
    "level_type": "2" },

  {
    "id": "150102",
    "name": "新城区",
    "parent_id": "150100",
    "level_type": "3" },

  {
    "id": "150103",
    "name": "回民区",
    "parent_id": "150100",
    "level_type": "3" },

  {
    "id": "150104",
    "name": "玉泉区",
    "parent_id": "150100",
    "level_type": "3" },

  {
    "id": "150105",
    "name": "赛罕区",
    "parent_id": "150100",
    "level_type": "3" },

  {
    "id": "150121",
    "name": "土默特左旗",
    "parent_id": "150100",
    "level_type": "3" },

  {
    "id": "150122",
    "name": "托克托县",
    "parent_id": "150100",
    "level_type": "3" },

  {
    "id": "150123",
    "name": "和林格尔县",
    "parent_id": "150100",
    "level_type": "3" },

  {
    "id": "150124",
    "name": "清水河县",
    "parent_id": "150100",
    "level_type": "3" },

  {
    "id": "150125",
    "name": "武川县",
    "parent_id": "150100",
    "level_type": "3" },

  {
    "id": "150200",
    "name": "包头市",
    "parent_id": "150000",
    "level_type": "2" },

  {
    "id": "150202",
    "name": "东河区",
    "parent_id": "150200",
    "level_type": "3" },

  {
    "id": "150203",
    "name": "昆都仑区",
    "parent_id": "150200",
    "level_type": "3" },

  {
    "id": "150204",
    "name": "青山区",
    "parent_id": "150200",
    "level_type": "3" },

  {
    "id": "150205",
    "name": "石拐区",
    "parent_id": "150200",
    "level_type": "3" },

  {
    "id": "150206",
    "name": "白云鄂博矿区",
    "parent_id": "150200",
    "level_type": "3" },

  {
    "id": "150207",
    "name": "九原区",
    "parent_id": "150200",
    "level_type": "3" },

  {
    "id": "150221",
    "name": "土默特右旗",
    "parent_id": "150200",
    "level_type": "3" },

  {
    "id": "150222",
    "name": "固阳县",
    "parent_id": "150200",
    "level_type": "3" },

  {
    "id": "150223",
    "name": "达尔罕茂明安联合旗",
    "parent_id": "150200",
    "level_type": "3" },

  {
    "id": "150300",
    "name": "乌海市",
    "parent_id": "150000",
    "level_type": "2" },

  {
    "id": "150302",
    "name": "海勃湾区",
    "parent_id": "150300",
    "level_type": "3" },

  {
    "id": "150303",
    "name": "海南区",
    "parent_id": "150300",
    "level_type": "3" },

  {
    "id": "150304",
    "name": "乌达区",
    "parent_id": "150300",
    "level_type": "3" },

  {
    "id": "150400",
    "name": "赤峰市",
    "parent_id": "150000",
    "level_type": "2" },

  {
    "id": "150402",
    "name": "红山区",
    "parent_id": "150400",
    "level_type": "3" },

  {
    "id": "150403",
    "name": "元宝山区",
    "parent_id": "150400",
    "level_type": "3" },

  {
    "id": "150404",
    "name": "松山区",
    "parent_id": "150400",
    "level_type": "3" },

  {
    "id": "150421",
    "name": "阿鲁科尔沁旗",
    "parent_id": "150400",
    "level_type": "3" },

  {
    "id": "150422",
    "name": "巴林左旗",
    "parent_id": "150400",
    "level_type": "3" },

  {
    "id": "150423",
    "name": "巴林右旗",
    "parent_id": "150400",
    "level_type": "3" },

  {
    "id": "150424",
    "name": "林西县",
    "parent_id": "150400",
    "level_type": "3" },

  {
    "id": "150425",
    "name": "克什克腾旗",
    "parent_id": "150400",
    "level_type": "3" },

  {
    "id": "150426",
    "name": "翁牛特旗",
    "parent_id": "150400",
    "level_type": "3" },

  {
    "id": "150428",
    "name": "喀喇沁旗",
    "parent_id": "150400",
    "level_type": "3" },

  {
    "id": "150429",
    "name": "宁城县",
    "parent_id": "150400",
    "level_type": "3" },

  {
    "id": "150430",
    "name": "敖汉旗",
    "parent_id": "150400",
    "level_type": "3" },

  {
    "id": "150500",
    "name": "通辽市",
    "parent_id": "150000",
    "level_type": "2" },

  {
    "id": "150502",
    "name": "科尔沁区",
    "parent_id": "150500",
    "level_type": "3" },

  {
    "id": "150521",
    "name": "科尔沁左翼中旗",
    "parent_id": "150500",
    "level_type": "3" },

  {
    "id": "150522",
    "name": "科尔沁左翼后旗",
    "parent_id": "150500",
    "level_type": "3" },

  {
    "id": "150523",
    "name": "开鲁县",
    "parent_id": "150500",
    "level_type": "3" },

  {
    "id": "150524",
    "name": "库伦旗",
    "parent_id": "150500",
    "level_type": "3" },

  {
    "id": "150525",
    "name": "奈曼旗",
    "parent_id": "150500",
    "level_type": "3" },

  {
    "id": "150526",
    "name": "扎鲁特旗",
    "parent_id": "150500",
    "level_type": "3" },

  {
    "id": "150581",
    "name": "霍林郭勒市",
    "parent_id": "150500",
    "level_type": "3" },

  {
    "id": "150600",
    "name": "鄂尔多斯市",
    "parent_id": "150000",
    "level_type": "2" },

  {
    "id": "150602",
    "name": "东胜区",
    "parent_id": "150600",
    "level_type": "3" },

  {
    "id": "150621",
    "name": "达拉特旗",
    "parent_id": "150600",
    "level_type": "3" },

  {
    "id": "150622",
    "name": "准格尔旗",
    "parent_id": "150600",
    "level_type": "3" },

  {
    "id": "150623",
    "name": "鄂托克前旗",
    "parent_id": "150600",
    "level_type": "3" },

  {
    "id": "150624",
    "name": "鄂托克旗",
    "parent_id": "150600",
    "level_type": "3" },

  {
    "id": "150625",
    "name": "杭锦旗",
    "parent_id": "150600",
    "level_type": "3" },

  {
    "id": "150626",
    "name": "乌审旗",
    "parent_id": "150600",
    "level_type": "3" },

  {
    "id": "150627",
    "name": "伊金霍洛旗",
    "parent_id": "150600",
    "level_type": "3" },

  {
    "id": "150700",
    "name": "呼伦贝尔市",
    "parent_id": "150000",
    "level_type": "2" },

  {
    "id": "150702",
    "name": "海拉尔区",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150703",
    "name": "扎赉诺尔区",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150721",
    "name": "阿荣旗",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150722",
    "name": "莫力达瓦达斡尔族自治旗",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150723",
    "name": "鄂伦春自治旗",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150724",
    "name": "鄂温克族自治旗",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150725",
    "name": "陈巴尔虎旗",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150726",
    "name": "新巴尔虎左旗",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150727",
    "name": "新巴尔虎右旗",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150781",
    "name": "满洲里市",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150782",
    "name": "牙克石市",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150783",
    "name": "扎兰屯市",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150784",
    "name": "额尔古纳市",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150785",
    "name": "根河市",
    "parent_id": "150700",
    "level_type": "3" },

  {
    "id": "150800",
    "name": "巴彦淖尔市",
    "parent_id": "150000",
    "level_type": "2" },

  {
    "id": "150802",
    "name": "临河区",
    "parent_id": "150800",
    "level_type": "3" },

  {
    "id": "150821",
    "name": "五原县",
    "parent_id": "150800",
    "level_type": "3" },

  {
    "id": "150822",
    "name": "磴口县",
    "parent_id": "150800",
    "level_type": "3" },

  {
    "id": "150823",
    "name": "乌拉特前旗",
    "parent_id": "150800",
    "level_type": "3" },

  {
    "id": "150824",
    "name": "乌拉特中旗",
    "parent_id": "150800",
    "level_type": "3" },

  {
    "id": "150825",
    "name": "乌拉特后旗",
    "parent_id": "150800",
    "level_type": "3" },

  {
    "id": "150826",
    "name": "杭锦后旗",
    "parent_id": "150800",
    "level_type": "3" },

  {
    "id": "150900",
    "name": "乌兰察布市",
    "parent_id": "150000",
    "level_type": "2" },

  {
    "id": "150902",
    "name": "集宁区",
    "parent_id": "150900",
    "level_type": "3" },

  {
    "id": "150921",
    "name": "卓资县",
    "parent_id": "150900",
    "level_type": "3" },

  {
    "id": "150922",
    "name": "化德县",
    "parent_id": "150900",
    "level_type": "3" },

  {
    "id": "150923",
    "name": "商都县",
    "parent_id": "150900",
    "level_type": "3" },

  {
    "id": "150924",
    "name": "兴和县",
    "parent_id": "150900",
    "level_type": "3" },

  {
    "id": "150925",
    "name": "凉城县",
    "parent_id": "150900",
    "level_type": "3" },

  {
    "id": "150926",
    "name": "察哈尔右翼前旗",
    "parent_id": "150900",
    "level_type": "3" },

  {
    "id": "150927",
    "name": "察哈尔右翼中旗",
    "parent_id": "150900",
    "level_type": "3" },

  {
    "id": "150928",
    "name": "察哈尔右翼后旗",
    "parent_id": "150900",
    "level_type": "3" },

  {
    "id": "150929",
    "name": "四子王旗",
    "parent_id": "150900",
    "level_type": "3" },

  {
    "id": "150981",
    "name": "丰镇市",
    "parent_id": "150900",
    "level_type": "3" },

  {
    "id": "152200",
    "name": "兴安盟",
    "parent_id": "150000",
    "level_type": "2" },

  {
    "id": "152201",
    "name": "乌兰浩特市",
    "parent_id": "152200",
    "level_type": "3" },

  {
    "id": "152202",
    "name": "阿尔山市",
    "parent_id": "152200",
    "level_type": "3" },

  {
    "id": "152221",
    "name": "科尔沁右翼前旗",
    "parent_id": "152200",
    "level_type": "3" },

  {
    "id": "152222",
    "name": "科尔沁右翼中旗",
    "parent_id": "152200",
    "level_type": "3" },

  {
    "id": "152223",
    "name": "扎赉特旗",
    "parent_id": "152200",
    "level_type": "3" },

  {
    "id": "152224",
    "name": "突泉县",
    "parent_id": "152200",
    "level_type": "3" },

  {
    "id": "152500",
    "name": "锡林郭勒盟",
    "parent_id": "150000",
    "level_type": "2" },

  {
    "id": "152501",
    "name": "二连浩特市",
    "parent_id": "152500",
    "level_type": "3" },

  {
    "id": "152502",
    "name": "锡林浩特市",
    "parent_id": "152500",
    "level_type": "3" },

  {
    "id": "152522",
    "name": "阿巴嘎旗",
    "parent_id": "152500",
    "level_type": "3" },

  {
    "id": "152523",
    "name": "苏尼特左旗",
    "parent_id": "152500",
    "level_type": "3" },

  {
    "id": "152524",
    "name": "苏尼特右旗",
    "parent_id": "152500",
    "level_type": "3" },

  {
    "id": "152525",
    "name": "东乌珠穆沁旗",
    "parent_id": "152500",
    "level_type": "3" },

  {
    "id": "152526",
    "name": "西乌珠穆沁旗",
    "parent_id": "152500",
    "level_type": "3" },

  {
    "id": "152527",
    "name": "太仆寺旗",
    "parent_id": "152500",
    "level_type": "3" },

  {
    "id": "152528",
    "name": "镶黄旗",
    "parent_id": "152500",
    "level_type": "3" },

  {
    "id": "152529",
    "name": "正镶白旗",
    "parent_id": "152500",
    "level_type": "3" },

  {
    "id": "152530",
    "name": "正蓝旗",
    "parent_id": "152500",
    "level_type": "3" },

  {
    "id": "152531",
    "name": "多伦县",
    "parent_id": "152500",
    "level_type": "3" },

  {
    "id": "152900",
    "name": "阿拉善盟",
    "parent_id": "150000",
    "level_type": "2" },

  {
    "id": "152921",
    "name": "阿拉善左旗",
    "parent_id": "152900",
    "level_type": "3" },

  {
    "id": "152922",
    "name": "阿拉善右旗",
    "parent_id": "152900",
    "level_type": "3" },

  {
    "id": "152923",
    "name": "额济纳旗",
    "parent_id": "152900",
    "level_type": "3" },

  {
    "id": "210000",
    "name": "辽宁省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "210100",
    "name": "沈阳市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "210102",
    "name": "和平区",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210103",
    "name": "沈河区",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210104",
    "name": "大东区",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210105",
    "name": "皇姑区",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210106",
    "name": "铁西区",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210111",
    "name": "苏家屯区",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210112",
    "name": "浑南区",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210113",
    "name": "沈北新区",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210114",
    "name": "于洪区",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210122",
    "name": "辽中县",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210123",
    "name": "康平县",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210124",
    "name": "法库县",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210181",
    "name": "新民市",
    "parent_id": "210100",
    "level_type": "3" },

  {
    "id": "210200",
    "name": "大连市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "210202",
    "name": "中山区",
    "parent_id": "210200",
    "level_type": "3" },

  {
    "id": "210203",
    "name": "西岗区",
    "parent_id": "210200",
    "level_type": "3" },

  {
    "id": "210204",
    "name": "沙河口区",
    "parent_id": "210200",
    "level_type": "3" },

  {
    "id": "210211",
    "name": "甘井子区",
    "parent_id": "210200",
    "level_type": "3" },

  {
    "id": "210212",
    "name": "旅顺口区",
    "parent_id": "210200",
    "level_type": "3" },

  {
    "id": "210213",
    "name": "金州区",
    "parent_id": "210200",
    "level_type": "3" },

  {
    "id": "210224",
    "name": "长海县",
    "parent_id": "210200",
    "level_type": "3" },

  {
    "id": "210281",
    "name": "瓦房店市",
    "parent_id": "210200",
    "level_type": "3" },

  {
    "id": "210282",
    "name": "普兰店市",
    "parent_id": "210200",
    "level_type": "3" },

  {
    "id": "210283",
    "name": "庄河市",
    "parent_id": "210200",
    "level_type": "3" },

  {
    "id": "210300",
    "name": "鞍山市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "210302",
    "name": "铁东区",
    "parent_id": "210300",
    "level_type": "3" },

  {
    "id": "210303",
    "name": "铁西区",
    "parent_id": "210300",
    "level_type": "3" },

  {
    "id": "210304",
    "name": "立山区",
    "parent_id": "210300",
    "level_type": "3" },

  {
    "id": "210311",
    "name": "千山区",
    "parent_id": "210300",
    "level_type": "3" },

  {
    "id": "210321",
    "name": "台安县",
    "parent_id": "210300",
    "level_type": "3" },

  {
    "id": "210323",
    "name": "岫岩满族自治县",
    "parent_id": "210300",
    "level_type": "3" },

  {
    "id": "210381",
    "name": "海城市",
    "parent_id": "210300",
    "level_type": "3" },

  {
    "id": "210400",
    "name": "抚顺市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "210402",
    "name": "新抚区",
    "parent_id": "210400",
    "level_type": "3" },

  {
    "id": "210403",
    "name": "东洲区",
    "parent_id": "210400",
    "level_type": "3" },

  {
    "id": "210404",
    "name": "望花区",
    "parent_id": "210400",
    "level_type": "3" },

  {
    "id": "210411",
    "name": "顺城区",
    "parent_id": "210400",
    "level_type": "3" },

  {
    "id": "210421",
    "name": "抚顺县",
    "parent_id": "210400",
    "level_type": "3" },

  {
    "id": "210422",
    "name": "新宾满族自治县",
    "parent_id": "210400",
    "level_type": "3" },

  {
    "id": "210423",
    "name": "清原满族自治县",
    "parent_id": "210400",
    "level_type": "3" },

  {
    "id": "210500",
    "name": "本溪市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "210502",
    "name": "平山区",
    "parent_id": "210500",
    "level_type": "3" },

  {
    "id": "210503",
    "name": "溪湖区",
    "parent_id": "210500",
    "level_type": "3" },

  {
    "id": "210504",
    "name": "明山区",
    "parent_id": "210500",
    "level_type": "3" },

  {
    "id": "210505",
    "name": "南芬区",
    "parent_id": "210500",
    "level_type": "3" },

  {
    "id": "210521",
    "name": "本溪满族自治县",
    "parent_id": "210500",
    "level_type": "3" },

  {
    "id": "210522",
    "name": "桓仁满族自治县",
    "parent_id": "210500",
    "level_type": "3" },

  {
    "id": "210600",
    "name": "丹东市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "210602",
    "name": "元宝区",
    "parent_id": "210600",
    "level_type": "3" },

  {
    "id": "210603",
    "name": "振兴区",
    "parent_id": "210600",
    "level_type": "3" },

  {
    "id": "210604",
    "name": "振安区",
    "parent_id": "210600",
    "level_type": "3" },

  {
    "id": "210624",
    "name": "宽甸满族自治县",
    "parent_id": "210600",
    "level_type": "3" },

  {
    "id": "210681",
    "name": "东港市",
    "parent_id": "210600",
    "level_type": "3" },

  {
    "id": "210682",
    "name": "凤城市",
    "parent_id": "210600",
    "level_type": "3" },

  {
    "id": "210700",
    "name": "锦州市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "210702",
    "name": "古塔区",
    "parent_id": "210700",
    "level_type": "3" },

  {
    "id": "210703",
    "name": "凌河区",
    "parent_id": "210700",
    "level_type": "3" },

  {
    "id": "210711",
    "name": "太和区",
    "parent_id": "210700",
    "level_type": "3" },

  {
    "id": "210726",
    "name": "黑山县",
    "parent_id": "210700",
    "level_type": "3" },

  {
    "id": "210727",
    "name": "义县",
    "parent_id": "210700",
    "level_type": "3" },

  {
    "id": "210781",
    "name": "凌海市",
    "parent_id": "210700",
    "level_type": "3" },

  {
    "id": "210782",
    "name": "北镇市",
    "parent_id": "210700",
    "level_type": "3" },

  {
    "id": "210800",
    "name": "营口市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "210802",
    "name": "站前区",
    "parent_id": "210800",
    "level_type": "3" },

  {
    "id": "210803",
    "name": "西市区",
    "parent_id": "210800",
    "level_type": "3" },

  {
    "id": "210804",
    "name": "鲅鱼圈区",
    "parent_id": "210800",
    "level_type": "3" },

  {
    "id": "210811",
    "name": "老边区",
    "parent_id": "210800",
    "level_type": "3" },

  {
    "id": "210881",
    "name": "盖州市",
    "parent_id": "210800",
    "level_type": "3" },

  {
    "id": "210882",
    "name": "大石桥市",
    "parent_id": "210800",
    "level_type": "3" },

  {
    "id": "210900",
    "name": "阜新市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "210902",
    "name": "海州区",
    "parent_id": "210900",
    "level_type": "3" },

  {
    "id": "210903",
    "name": "新邱区",
    "parent_id": "210900",
    "level_type": "3" },

  {
    "id": "210904",
    "name": "太平区",
    "parent_id": "210900",
    "level_type": "3" },

  {
    "id": "210905",
    "name": "清河门区",
    "parent_id": "210900",
    "level_type": "3" },

  {
    "id": "210911",
    "name": "细河区",
    "parent_id": "210900",
    "level_type": "3" },

  {
    "id": "210921",
    "name": "阜新蒙古族自治县",
    "parent_id": "210900",
    "level_type": "3" },

  {
    "id": "210922",
    "name": "彰武县",
    "parent_id": "210900",
    "level_type": "3" },

  {
    "id": "211000",
    "name": "辽阳市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "211002",
    "name": "白塔区",
    "parent_id": "211000",
    "level_type": "3" },

  {
    "id": "211003",
    "name": "文圣区",
    "parent_id": "211000",
    "level_type": "3" },

  {
    "id": "211004",
    "name": "宏伟区",
    "parent_id": "211000",
    "level_type": "3" },

  {
    "id": "211005",
    "name": "弓长岭区",
    "parent_id": "211000",
    "level_type": "3" },

  {
    "id": "211011",
    "name": "太子河区",
    "parent_id": "211000",
    "level_type": "3" },

  {
    "id": "211021",
    "name": "辽阳县",
    "parent_id": "211000",
    "level_type": "3" },

  {
    "id": "211081",
    "name": "灯塔市",
    "parent_id": "211000",
    "level_type": "3" },

  {
    "id": "211100",
    "name": "盘锦市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "211102",
    "name": "双台子区",
    "parent_id": "211100",
    "level_type": "3" },

  {
    "id": "211103",
    "name": "兴隆台区",
    "parent_id": "211100",
    "level_type": "3" },

  {
    "id": "211121",
    "name": "大洼县",
    "parent_id": "211100",
    "level_type": "3" },

  {
    "id": "211122",
    "name": "盘山县",
    "parent_id": "211100",
    "level_type": "3" },

  {
    "id": "211200",
    "name": "铁岭市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "211202",
    "name": "银州区",
    "parent_id": "211200",
    "level_type": "3" },

  {
    "id": "211204",
    "name": "清河区",
    "parent_id": "211200",
    "level_type": "3" },

  {
    "id": "211221",
    "name": "铁岭县",
    "parent_id": "211200",
    "level_type": "3" },

  {
    "id": "211223",
    "name": "西丰县",
    "parent_id": "211200",
    "level_type": "3" },

  {
    "id": "211224",
    "name": "昌图县",
    "parent_id": "211200",
    "level_type": "3" },

  {
    "id": "211281",
    "name": "调兵山市",
    "parent_id": "211200",
    "level_type": "3" },

  {
    "id": "211282",
    "name": "开原市",
    "parent_id": "211200",
    "level_type": "3" },

  {
    "id": "211300",
    "name": "朝阳市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "211302",
    "name": "双塔区",
    "parent_id": "211300",
    "level_type": "3" },

  {
    "id": "211303",
    "name": "龙城区",
    "parent_id": "211300",
    "level_type": "3" },

  {
    "id": "211321",
    "name": "朝阳县",
    "parent_id": "211300",
    "level_type": "3" },

  {
    "id": "211322",
    "name": "建平县",
    "parent_id": "211300",
    "level_type": "3" },

  {
    "id": "211324",
    "name": "喀喇沁左翼蒙古族自治县",
    "parent_id": "211300",
    "level_type": "3" },

  {
    "id": "211381",
    "name": "北票市",
    "parent_id": "211300",
    "level_type": "3" },

  {
    "id": "211382",
    "name": "凌源市",
    "parent_id": "211300",
    "level_type": "3" },

  {
    "id": "211400",
    "name": "葫芦岛市",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "211402",
    "name": "连山区",
    "parent_id": "211400",
    "level_type": "3" },

  {
    "id": "211403",
    "name": "龙港区",
    "parent_id": "211400",
    "level_type": "3" },

  {
    "id": "211404",
    "name": "南票区",
    "parent_id": "211400",
    "level_type": "3" },

  {
    "id": "211421",
    "name": "绥中县",
    "parent_id": "211400",
    "level_type": "3" },

  {
    "id": "211422",
    "name": "建昌县",
    "parent_id": "211400",
    "level_type": "3" },

  {
    "id": "211481",
    "name": "兴城市",
    "parent_id": "211400",
    "level_type": "3" },

  {
    "id": "211500",
    "name": "金普新区",
    "parent_id": "210000",
    "level_type": "2" },

  {
    "id": "211501",
    "name": "金州新区",
    "parent_id": "211500",
    "level_type": "3" },

  {
    "id": "211502",
    "name": "普湾新区",
    "parent_id": "211500",
    "level_type": "3" },

  {
    "id": "211503",
    "name": "保税区",
    "parent_id": "211500",
    "level_type": "3" },

  {
    "id": "220000",
    "name": "吉林省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "220100",
    "name": "长春市",
    "parent_id": "220000",
    "level_type": "2" },

  {
    "id": "220102",
    "name": "南关区",
    "parent_id": "220100",
    "level_type": "3" },

  {
    "id": "220103",
    "name": "宽城区",
    "parent_id": "220100",
    "level_type": "3" },

  {
    "id": "220104",
    "name": "朝阳区",
    "parent_id": "220100",
    "level_type": "3" },

  {
    "id": "220105",
    "name": "二道区",
    "parent_id": "220100",
    "level_type": "3" },

  {
    "id": "220106",
    "name": "绿园区",
    "parent_id": "220100",
    "level_type": "3" },

  {
    "id": "220112",
    "name": "双阳区",
    "parent_id": "220100",
    "level_type": "3" },

  {
    "id": "220113",
    "name": "九台区",
    "parent_id": "220100",
    "level_type": "3" },

  {
    "id": "220122",
    "name": "农安县",
    "parent_id": "220100",
    "level_type": "3" },

  {
    "id": "220182",
    "name": "榆树市",
    "parent_id": "220100",
    "level_type": "3" },

  {
    "id": "220183",
    "name": "德惠市",
    "parent_id": "220100",
    "level_type": "3" },

  {
    "id": "220200",
    "name": "吉林市",
    "parent_id": "220000",
    "level_type": "2" },

  {
    "id": "220202",
    "name": "昌邑区",
    "parent_id": "220200",
    "level_type": "3" },

  {
    "id": "220203",
    "name": "龙潭区",
    "parent_id": "220200",
    "level_type": "3" },

  {
    "id": "220204",
    "name": "船营区",
    "parent_id": "220200",
    "level_type": "3" },

  {
    "id": "220211",
    "name": "丰满区",
    "parent_id": "220200",
    "level_type": "3" },

  {
    "id": "220221",
    "name": "永吉县",
    "parent_id": "220200",
    "level_type": "3" },

  {
    "id": "220281",
    "name": "蛟河市",
    "parent_id": "220200",
    "level_type": "3" },

  {
    "id": "220282",
    "name": "桦甸市",
    "parent_id": "220200",
    "level_type": "3" },

  {
    "id": "220283",
    "name": "舒兰市",
    "parent_id": "220200",
    "level_type": "3" },

  {
    "id": "220284",
    "name": "磐石市",
    "parent_id": "220200",
    "level_type": "3" },

  {
    "id": "220300",
    "name": "四平市",
    "parent_id": "220000",
    "level_type": "2" },

  {
    "id": "220302",
    "name": "铁西区",
    "parent_id": "220300",
    "level_type": "3" },

  {
    "id": "220303",
    "name": "铁东区",
    "parent_id": "220300",
    "level_type": "3" },

  {
    "id": "220322",
    "name": "梨树县",
    "parent_id": "220300",
    "level_type": "3" },

  {
    "id": "220323",
    "name": "伊通满族自治县",
    "parent_id": "220300",
    "level_type": "3" },

  {
    "id": "220381",
    "name": "公主岭市",
    "parent_id": "220300",
    "level_type": "3" },

  {
    "id": "220382",
    "name": "双辽市",
    "parent_id": "220300",
    "level_type": "3" },

  {
    "id": "220400",
    "name": "辽源市",
    "parent_id": "220000",
    "level_type": "2" },

  {
    "id": "220402",
    "name": "龙山区",
    "parent_id": "220400",
    "level_type": "3" },

  {
    "id": "220403",
    "name": "西安区",
    "parent_id": "220400",
    "level_type": "3" },

  {
    "id": "220421",
    "name": "东丰县",
    "parent_id": "220400",
    "level_type": "3" },

  {
    "id": "220422",
    "name": "东辽县",
    "parent_id": "220400",
    "level_type": "3" },

  {
    "id": "220500",
    "name": "通化市",
    "parent_id": "220000",
    "level_type": "2" },

  {
    "id": "220502",
    "name": "东昌区",
    "parent_id": "220500",
    "level_type": "3" },

  {
    "id": "220503",
    "name": "二道江区",
    "parent_id": "220500",
    "level_type": "3" },

  {
    "id": "220521",
    "name": "通化县",
    "parent_id": "220500",
    "level_type": "3" },

  {
    "id": "220523",
    "name": "辉南县",
    "parent_id": "220500",
    "level_type": "3" },

  {
    "id": "220524",
    "name": "柳河县",
    "parent_id": "220500",
    "level_type": "3" },

  {
    "id": "220581",
    "name": "梅河口市",
    "parent_id": "220500",
    "level_type": "3" },

  {
    "id": "220582",
    "name": "集安市",
    "parent_id": "220500",
    "level_type": "3" },

  {
    "id": "220600",
    "name": "白山市",
    "parent_id": "220000",
    "level_type": "2" },

  {
    "id": "220602",
    "name": "浑江区",
    "parent_id": "220600",
    "level_type": "3" },

  {
    "id": "220605",
    "name": "江源区",
    "parent_id": "220600",
    "level_type": "3" },

  {
    "id": "220621",
    "name": "抚松县",
    "parent_id": "220600",
    "level_type": "3" },

  {
    "id": "220622",
    "name": "靖宇县",
    "parent_id": "220600",
    "level_type": "3" },

  {
    "id": "220623",
    "name": "长白朝鲜族自治县",
    "parent_id": "220600",
    "level_type": "3" },

  {
    "id": "220681",
    "name": "临江市",
    "parent_id": "220600",
    "level_type": "3" },

  {
    "id": "220700",
    "name": "松原市",
    "parent_id": "220000",
    "level_type": "2" },

  {
    "id": "220702",
    "name": "宁江区",
    "parent_id": "220700",
    "level_type": "3" },

  {
    "id": "220721",
    "name": "前郭尔罗斯蒙古族自治县",
    "parent_id": "220700",
    "level_type": "3" },

  {
    "id": "220722",
    "name": "长岭县",
    "parent_id": "220700",
    "level_type": "3" },

  {
    "id": "220723",
    "name": "乾安县",
    "parent_id": "220700",
    "level_type": "3" },

  {
    "id": "220781",
    "name": "扶余市",
    "parent_id": "220700",
    "level_type": "3" },

  {
    "id": "220800",
    "name": "白城市",
    "parent_id": "220000",
    "level_type": "2" },

  {
    "id": "220802",
    "name": "洮北区",
    "parent_id": "220800",
    "level_type": "3" },

  {
    "id": "220821",
    "name": "镇赉县",
    "parent_id": "220800",
    "level_type": "3" },

  {
    "id": "220822",
    "name": "通榆县",
    "parent_id": "220800",
    "level_type": "3" },

  {
    "id": "220881",
    "name": "洮南市",
    "parent_id": "220800",
    "level_type": "3" },

  {
    "id": "220882",
    "name": "大安市",
    "parent_id": "220800",
    "level_type": "3" },

  {
    "id": "222400",
    "name": "延边朝鲜族自治州",
    "parent_id": "220000",
    "level_type": "2" },

  {
    "id": "222401",
    "name": "延吉市",
    "parent_id": "222400",
    "level_type": "3" },

  {
    "id": "222402",
    "name": "图们市",
    "parent_id": "222400",
    "level_type": "3" },

  {
    "id": "222403",
    "name": "敦化市",
    "parent_id": "222400",
    "level_type": "3" },

  {
    "id": "222404",
    "name": "珲春市",
    "parent_id": "222400",
    "level_type": "3" },

  {
    "id": "222405",
    "name": "龙井市",
    "parent_id": "222400",
    "level_type": "3" },

  {
    "id": "222406",
    "name": "和龙市",
    "parent_id": "222400",
    "level_type": "3" },

  {
    "id": "222424",
    "name": "汪清县",
    "parent_id": "222400",
    "level_type": "3" },

  {
    "id": "222426",
    "name": "安图县",
    "parent_id": "222400",
    "level_type": "3" },

  {
    "id": "230000",
    "name": "黑龙江省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "230100",
    "name": "哈尔滨市",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "230102",
    "name": "道里区",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230103",
    "name": "南岗区",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230104",
    "name": "道外区",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230108",
    "name": "平房区",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230109",
    "name": "松北区",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230110",
    "name": "香坊区",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230111",
    "name": "呼兰区",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230112",
    "name": "阿城区",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230113",
    "name": "双城区",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230123",
    "name": "依兰县",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230124",
    "name": "方正县",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230125",
    "name": "宾县",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230126",
    "name": "巴彦县",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230127",
    "name": "木兰县",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230128",
    "name": "通河县",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230129",
    "name": "延寿县",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230183",
    "name": "尚志市",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230184",
    "name": "五常市",
    "parent_id": "230100",
    "level_type": "3" },

  {
    "id": "230200",
    "name": "齐齐哈尔市",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "230202",
    "name": "龙沙区",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230203",
    "name": "建华区",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230204",
    "name": "铁锋区",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230205",
    "name": "昂昂溪区",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230206",
    "name": "富拉尔基区",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230207",
    "name": "碾子山区",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230208",
    "name": "梅里斯达斡尔族区",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230221",
    "name": "龙江县",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230223",
    "name": "依安县",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230224",
    "name": "泰来县",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230225",
    "name": "甘南县",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230227",
    "name": "富裕县",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230229",
    "name": "克山县",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230230",
    "name": "克东县",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230231",
    "name": "拜泉县",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230281",
    "name": "讷河市",
    "parent_id": "230200",
    "level_type": "3" },

  {
    "id": "230300",
    "name": "鸡西市",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "230302",
    "name": "鸡冠区",
    "parent_id": "230300",
    "level_type": "3" },

  {
    "id": "230303",
    "name": "恒山区",
    "parent_id": "230300",
    "level_type": "3" },

  {
    "id": "230304",
    "name": "滴道区",
    "parent_id": "230300",
    "level_type": "3" },

  {
    "id": "230305",
    "name": "梨树区",
    "parent_id": "230300",
    "level_type": "3" },

  {
    "id": "230306",
    "name": "城子河区",
    "parent_id": "230300",
    "level_type": "3" },

  {
    "id": "230307",
    "name": "麻山区",
    "parent_id": "230300",
    "level_type": "3" },

  {
    "id": "230321",
    "name": "鸡东县",
    "parent_id": "230300",
    "level_type": "3" },

  {
    "id": "230381",
    "name": "虎林市",
    "parent_id": "230300",
    "level_type": "3" },

  {
    "id": "230382",
    "name": "密山市",
    "parent_id": "230300",
    "level_type": "3" },

  {
    "id": "230400",
    "name": "鹤岗市",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "230402",
    "name": "向阳区",
    "parent_id": "230400",
    "level_type": "3" },

  {
    "id": "230403",
    "name": "工农区",
    "parent_id": "230400",
    "level_type": "3" },

  {
    "id": "230404",
    "name": "南山区",
    "parent_id": "230400",
    "level_type": "3" },

  {
    "id": "230405",
    "name": "兴安区",
    "parent_id": "230400",
    "level_type": "3" },

  {
    "id": "230406",
    "name": "东山区",
    "parent_id": "230400",
    "level_type": "3" },

  {
    "id": "230407",
    "name": "兴山区",
    "parent_id": "230400",
    "level_type": "3" },

  {
    "id": "230421",
    "name": "萝北县",
    "parent_id": "230400",
    "level_type": "3" },

  {
    "id": "230422",
    "name": "绥滨县",
    "parent_id": "230400",
    "level_type": "3" },

  {
    "id": "230500",
    "name": "双鸭山市",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "230502",
    "name": "尖山区",
    "parent_id": "230500",
    "level_type": "3" },

  {
    "id": "230503",
    "name": "岭东区",
    "parent_id": "230500",
    "level_type": "3" },

  {
    "id": "230505",
    "name": "四方台区",
    "parent_id": "230500",
    "level_type": "3" },

  {
    "id": "230506",
    "name": "宝山区",
    "parent_id": "230500",
    "level_type": "3" },

  {
    "id": "230521",
    "name": "集贤县",
    "parent_id": "230500",
    "level_type": "3" },

  {
    "id": "230522",
    "name": "友谊县",
    "parent_id": "230500",
    "level_type": "3" },

  {
    "id": "230523",
    "name": "宝清县",
    "parent_id": "230500",
    "level_type": "3" },

  {
    "id": "230524",
    "name": "饶河县",
    "parent_id": "230500",
    "level_type": "3" },

  {
    "id": "230600",
    "name": "大庆市",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "230602",
    "name": "萨尔图区",
    "parent_id": "230600",
    "level_type": "3" },

  {
    "id": "230603",
    "name": "龙凤区",
    "parent_id": "230600",
    "level_type": "3" },

  {
    "id": "230604",
    "name": "让胡路区",
    "parent_id": "230600",
    "level_type": "3" },

  {
    "id": "230605",
    "name": "红岗区",
    "parent_id": "230600",
    "level_type": "3" },

  {
    "id": "230606",
    "name": "大同区",
    "parent_id": "230600",
    "level_type": "3" },

  {
    "id": "230621",
    "name": "肇州县",
    "parent_id": "230600",
    "level_type": "3" },

  {
    "id": "230622",
    "name": "肇源县",
    "parent_id": "230600",
    "level_type": "3" },

  {
    "id": "230623",
    "name": "林甸县",
    "parent_id": "230600",
    "level_type": "3" },

  {
    "id": "230624",
    "name": "杜尔伯特蒙古族自治县",
    "parent_id": "230600",
    "level_type": "3" },

  {
    "id": "230700",
    "name": "伊春市",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "230702",
    "name": "伊春区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230703",
    "name": "南岔区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230704",
    "name": "友好区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230705",
    "name": "西林区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230706",
    "name": "翠峦区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230707",
    "name": "新青区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230708",
    "name": "美溪区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230709",
    "name": "金山屯区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230710",
    "name": "五营区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230711",
    "name": "乌马河区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230712",
    "name": "汤旺河区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230713",
    "name": "带岭区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230714",
    "name": "乌伊岭区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230715",
    "name": "红星区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230716",
    "name": "上甘岭区",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230722",
    "name": "嘉荫县",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230781",
    "name": "铁力市",
    "parent_id": "230700",
    "level_type": "3" },

  {
    "id": "230800",
    "name": "佳木斯市",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "230803",
    "name": "向阳区",
    "parent_id": "230800",
    "level_type": "3" },

  {
    "id": "230804",
    "name": "前进区",
    "parent_id": "230800",
    "level_type": "3" },

  {
    "id": "230805",
    "name": "东风区",
    "parent_id": "230800",
    "level_type": "3" },

  {
    "id": "230811",
    "name": "郊区",
    "parent_id": "230800",
    "level_type": "3" },

  {
    "id": "230822",
    "name": "桦南县",
    "parent_id": "230800",
    "level_type": "3" },

  {
    "id": "230826",
    "name": "桦川县",
    "parent_id": "230800",
    "level_type": "3" },

  {
    "id": "230828",
    "name": "汤原县",
    "parent_id": "230800",
    "level_type": "3" },

  {
    "id": "230833",
    "name": "抚远县",
    "parent_id": "230800",
    "level_type": "3" },

  {
    "id": "230881",
    "name": "同江市",
    "parent_id": "230800",
    "level_type": "3" },

  {
    "id": "230882",
    "name": "富锦市",
    "parent_id": "230800",
    "level_type": "3" },

  {
    "id": "230900",
    "name": "七台河市",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "230902",
    "name": "新兴区",
    "parent_id": "230900",
    "level_type": "3" },

  {
    "id": "230903",
    "name": "桃山区",
    "parent_id": "230900",
    "level_type": "3" },

  {
    "id": "230904",
    "name": "茄子河区",
    "parent_id": "230900",
    "level_type": "3" },

  {
    "id": "230921",
    "name": "勃利县",
    "parent_id": "230900",
    "level_type": "3" },

  {
    "id": "231000",
    "name": "牡丹江市",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "231002",
    "name": "东安区",
    "parent_id": "231000",
    "level_type": "3" },

  {
    "id": "231003",
    "name": "阳明区",
    "parent_id": "231000",
    "level_type": "3" },

  {
    "id": "231004",
    "name": "爱民区",
    "parent_id": "231000",
    "level_type": "3" },

  {
    "id": "231005",
    "name": "西安区",
    "parent_id": "231000",
    "level_type": "3" },

  {
    "id": "231024",
    "name": "东宁县",
    "parent_id": "231000",
    "level_type": "3" },

  {
    "id": "231025",
    "name": "林口县",
    "parent_id": "231000",
    "level_type": "3" },

  {
    "id": "231081",
    "name": "绥芬河市",
    "parent_id": "231000",
    "level_type": "3" },

  {
    "id": "231083",
    "name": "海林市",
    "parent_id": "231000",
    "level_type": "3" },

  {
    "id": "231084",
    "name": "宁安市",
    "parent_id": "231000",
    "level_type": "3" },

  {
    "id": "231085",
    "name": "穆棱市",
    "parent_id": "231000",
    "level_type": "3" },

  {
    "id": "231100",
    "name": "黑河市",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "231102",
    "name": "爱辉区",
    "parent_id": "231100",
    "level_type": "3" },

  {
    "id": "231121",
    "name": "嫩江县",
    "parent_id": "231100",
    "level_type": "3" },

  {
    "id": "231123",
    "name": "逊克县",
    "parent_id": "231100",
    "level_type": "3" },

  {
    "id": "231124",
    "name": "孙吴县",
    "parent_id": "231100",
    "level_type": "3" },

  {
    "id": "231181",
    "name": "北安市",
    "parent_id": "231100",
    "level_type": "3" },

  {
    "id": "231182",
    "name": "五大连池市",
    "parent_id": "231100",
    "level_type": "3" },

  {
    "id": "231200",
    "name": "绥化市",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "231202",
    "name": "北林区",
    "parent_id": "231200",
    "level_type": "3" },

  {
    "id": "231221",
    "name": "望奎县",
    "parent_id": "231200",
    "level_type": "3" },

  {
    "id": "231222",
    "name": "兰西县",
    "parent_id": "231200",
    "level_type": "3" },

  {
    "id": "231223",
    "name": "青冈县",
    "parent_id": "231200",
    "level_type": "3" },

  {
    "id": "231224",
    "name": "庆安县",
    "parent_id": "231200",
    "level_type": "3" },

  {
    "id": "231225",
    "name": "明水县",
    "parent_id": "231200",
    "level_type": "3" },

  {
    "id": "231226",
    "name": "绥棱县",
    "parent_id": "231200",
    "level_type": "3" },

  {
    "id": "231281",
    "name": "安达市",
    "parent_id": "231200",
    "level_type": "3" },

  {
    "id": "231282",
    "name": "肇东市",
    "parent_id": "231200",
    "level_type": "3" },

  {
    "id": "231283",
    "name": "海伦市",
    "parent_id": "231200",
    "level_type": "3" },

  {
    "id": "232700",
    "name": "大兴安岭地区",
    "parent_id": "230000",
    "level_type": "2" },

  {
    "id": "232701",
    "name": "加格达奇区",
    "parent_id": "232700",
    "level_type": "3" },

  {
    "id": "232702",
    "name": "新林区",
    "parent_id": "232700",
    "level_type": "3" },

  {
    "id": "232703",
    "name": "松岭区",
    "parent_id": "232700",
    "level_type": "3" },

  {
    "id": "232704",
    "name": "呼中区",
    "parent_id": "232700",
    "level_type": "3" },

  {
    "id": "232721",
    "name": "呼玛县",
    "parent_id": "232700",
    "level_type": "3" },

  {
    "id": "232722",
    "name": "塔河县",
    "parent_id": "232700",
    "level_type": "3" },

  {
    "id": "232723",
    "name": "漠河县",
    "parent_id": "232700",
    "level_type": "3" },

  {
    "id": "310000",
    "name": "上海",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "310100",
    "name": "上海市",
    "parent_id": "310000",
    "level_type": "2" },

  {
    "id": "310101",
    "name": "黄浦区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310104",
    "name": "徐汇区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310105",
    "name": "长宁区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310106",
    "name": "静安区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310107",
    "name": "普陀区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310108",
    "name": "闸北区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310109",
    "name": "虹口区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310110",
    "name": "杨浦区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310112",
    "name": "闵行区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310113",
    "name": "宝山区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310114",
    "name": "嘉定区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310115",
    "name": "浦东新区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310116",
    "name": "金山区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310117",
    "name": "松江区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310118",
    "name": "青浦区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310120",
    "name": "奉贤区",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "310230",
    "name": "崇明县",
    "parent_id": "310100",
    "level_type": "3" },

  {
    "id": "320000",
    "name": "江苏省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "320100",
    "name": "南京市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "320102",
    "name": "玄武区",
    "parent_id": "320100",
    "level_type": "3" },

  {
    "id": "320104",
    "name": "秦淮区",
    "parent_id": "320100",
    "level_type": "3" },

  {
    "id": "320105",
    "name": "建邺区",
    "parent_id": "320100",
    "level_type": "3" },

  {
    "id": "320106",
    "name": "鼓楼区",
    "parent_id": "320100",
    "level_type": "3" },

  {
    "id": "320111",
    "name": "浦口区",
    "parent_id": "320100",
    "level_type": "3" },

  {
    "id": "320113",
    "name": "栖霞区",
    "parent_id": "320100",
    "level_type": "3" },

  {
    "id": "320114",
    "name": "雨花台区",
    "parent_id": "320100",
    "level_type": "3" },

  {
    "id": "320115",
    "name": "江宁区",
    "parent_id": "320100",
    "level_type": "3" },

  {
    "id": "320116",
    "name": "六合区",
    "parent_id": "320100",
    "level_type": "3" },

  {
    "id": "320117",
    "name": "溧水区",
    "parent_id": "320100",
    "level_type": "3" },

  {
    "id": "320118",
    "name": "高淳区",
    "parent_id": "320100",
    "level_type": "3" },

  {
    "id": "320200",
    "name": "无锡市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "320202",
    "name": "崇安区",
    "parent_id": "320200",
    "level_type": "3" },

  {
    "id": "320203",
    "name": "南长区",
    "parent_id": "320200",
    "level_type": "3" },

  {
    "id": "320204",
    "name": "北塘区",
    "parent_id": "320200",
    "level_type": "3" },

  {
    "id": "320205",
    "name": "锡山区",
    "parent_id": "320200",
    "level_type": "3" },

  {
    "id": "320206",
    "name": "惠山区",
    "parent_id": "320200",
    "level_type": "3" },

  {
    "id": "320211",
    "name": "滨湖区",
    "parent_id": "320200",
    "level_type": "3" },

  {
    "id": "320281",
    "name": "江阴市",
    "parent_id": "320200",
    "level_type": "3" },

  {
    "id": "320282",
    "name": "宜兴市",
    "parent_id": "320200",
    "level_type": "3" },

  {
    "id": "320300",
    "name": "徐州市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "320302",
    "name": "鼓楼区",
    "parent_id": "320300",
    "level_type": "3" },

  {
    "id": "320303",
    "name": "云龙区",
    "parent_id": "320300",
    "level_type": "3" },

  {
    "id": "320305",
    "name": "贾汪区",
    "parent_id": "320300",
    "level_type": "3" },

  {
    "id": "320311",
    "name": "泉山区",
    "parent_id": "320300",
    "level_type": "3" },

  {
    "id": "320312",
    "name": "铜山区",
    "parent_id": "320300",
    "level_type": "3" },

  {
    "id": "320321",
    "name": "丰县",
    "parent_id": "320300",
    "level_type": "3" },

  {
    "id": "320322",
    "name": "沛县",
    "parent_id": "320300",
    "level_type": "3" },

  {
    "id": "320324",
    "name": "睢宁县",
    "parent_id": "320300",
    "level_type": "3" },

  {
    "id": "320381",
    "name": "新沂市",
    "parent_id": "320300",
    "level_type": "3" },

  {
    "id": "320382",
    "name": "邳州市",
    "parent_id": "320300",
    "level_type": "3" },

  {
    "id": "320400",
    "name": "常州市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "320402",
    "name": "天宁区",
    "parent_id": "320400",
    "level_type": "3" },

  {
    "id": "320404",
    "name": "钟楼区",
    "parent_id": "320400",
    "level_type": "3" },

  {
    "id": "320405",
    "name": "戚墅堰区",
    "parent_id": "320400",
    "level_type": "3" },

  {
    "id": "320411",
    "name": "新北区",
    "parent_id": "320400",
    "level_type": "3" },

  {
    "id": "320412",
    "name": "武进区",
    "parent_id": "320400",
    "level_type": "3" },

  {
    "id": "320481",
    "name": "溧阳市",
    "parent_id": "320400",
    "level_type": "3" },

  {
    "id": "320482",
    "name": "金坛市",
    "parent_id": "320400",
    "level_type": "3" },

  {
    "id": "320500",
    "name": "苏州市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "320505",
    "name": "虎丘区",
    "parent_id": "320500",
    "level_type": "3" },

  {
    "id": "320506",
    "name": "吴中区",
    "parent_id": "320500",
    "level_type": "3" },

  {
    "id": "320507",
    "name": "相城区",
    "parent_id": "320500",
    "level_type": "3" },

  {
    "id": "320508",
    "name": "姑苏区",
    "parent_id": "320500",
    "level_type": "3" },

  {
    "id": "320509",
    "name": "吴江区",
    "parent_id": "320500",
    "level_type": "3" },

  {
    "id": "320581",
    "name": "常熟市",
    "parent_id": "320500",
    "level_type": "3" },

  {
    "id": "320582",
    "name": "张家港市",
    "parent_id": "320500",
    "level_type": "3" },

  {
    "id": "320583",
    "name": "昆山市",
    "parent_id": "320500",
    "level_type": "3" },

  {
    "id": "320585",
    "name": "太仓市",
    "parent_id": "320500",
    "level_type": "3" },

  {
    "id": "320600",
    "name": "南通市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "320602",
    "name": "崇川区",
    "parent_id": "320600",
    "level_type": "3" },

  {
    "id": "320611",
    "name": "港闸区",
    "parent_id": "320600",
    "level_type": "3" },

  {
    "id": "320612",
    "name": "通州区",
    "parent_id": "320600",
    "level_type": "3" },

  {
    "id": "320621",
    "name": "海安县",
    "parent_id": "320600",
    "level_type": "3" },

  {
    "id": "320623",
    "name": "如东县",
    "parent_id": "320600",
    "level_type": "3" },

  {
    "id": "320681",
    "name": "启东市",
    "parent_id": "320600",
    "level_type": "3" },

  {
    "id": "320682",
    "name": "如皋市",
    "parent_id": "320600",
    "level_type": "3" },

  {
    "id": "320684",
    "name": "海门市",
    "parent_id": "320600",
    "level_type": "3" },

  {
    "id": "320700",
    "name": "连云港市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "320703",
    "name": "连云区",
    "parent_id": "320700",
    "level_type": "3" },

  {
    "id": "320706",
    "name": "海州区",
    "parent_id": "320700",
    "level_type": "3" },

  {
    "id": "320707",
    "name": "赣榆区",
    "parent_id": "320700",
    "level_type": "3" },

  {
    "id": "320722",
    "name": "东海县",
    "parent_id": "320700",
    "level_type": "3" },

  {
    "id": "320723",
    "name": "灌云县",
    "parent_id": "320700",
    "level_type": "3" },

  {
    "id": "320724",
    "name": "灌南县",
    "parent_id": "320700",
    "level_type": "3" },

  {
    "id": "320800",
    "name": "淮安市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "320802",
    "name": "清河区",
    "parent_id": "320800",
    "level_type": "3" },

  {
    "id": "320803",
    "name": "淮安区",
    "parent_id": "320800",
    "level_type": "3" },

  {
    "id": "320804",
    "name": "淮阴区",
    "parent_id": "320800",
    "level_type": "3" },

  {
    "id": "320811",
    "name": "清浦区",
    "parent_id": "320800",
    "level_type": "3" },

  {
    "id": "320826",
    "name": "涟水县",
    "parent_id": "320800",
    "level_type": "3" },

  {
    "id": "320829",
    "name": "洪泽县",
    "parent_id": "320800",
    "level_type": "3" },

  {
    "id": "320830",
    "name": "盱眙县",
    "parent_id": "320800",
    "level_type": "3" },

  {
    "id": "320831",
    "name": "金湖县",
    "parent_id": "320800",
    "level_type": "3" },

  {
    "id": "320900",
    "name": "盐城市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "320902",
    "name": "亭湖区",
    "parent_id": "320900",
    "level_type": "3" },

  {
    "id": "320903",
    "name": "盐都区",
    "parent_id": "320900",
    "level_type": "3" },

  {
    "id": "320921",
    "name": "响水县",
    "parent_id": "320900",
    "level_type": "3" },

  {
    "id": "320922",
    "name": "滨海县",
    "parent_id": "320900",
    "level_type": "3" },

  {
    "id": "320923",
    "name": "阜宁县",
    "parent_id": "320900",
    "level_type": "3" },

  {
    "id": "320924",
    "name": "射阳县",
    "parent_id": "320900",
    "level_type": "3" },

  {
    "id": "320925",
    "name": "建湖县",
    "parent_id": "320900",
    "level_type": "3" },

  {
    "id": "320981",
    "name": "东台市",
    "parent_id": "320900",
    "level_type": "3" },

  {
    "id": "320982",
    "name": "大丰市",
    "parent_id": "320900",
    "level_type": "3" },

  {
    "id": "321000",
    "name": "扬州市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "321002",
    "name": "广陵区",
    "parent_id": "321000",
    "level_type": "3" },

  {
    "id": "321003",
    "name": "邗江区",
    "parent_id": "321000",
    "level_type": "3" },

  {
    "id": "321012",
    "name": "江都区",
    "parent_id": "321000",
    "level_type": "3" },

  {
    "id": "321023",
    "name": "宝应县",
    "parent_id": "321000",
    "level_type": "3" },

  {
    "id": "321081",
    "name": "仪征市",
    "parent_id": "321000",
    "level_type": "3" },

  {
    "id": "321084",
    "name": "高邮市",
    "parent_id": "321000",
    "level_type": "3" },

  {
    "id": "321100",
    "name": "镇江市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "321102",
    "name": "京口区",
    "parent_id": "321100",
    "level_type": "3" },

  {
    "id": "321111",
    "name": "润州区",
    "parent_id": "321100",
    "level_type": "3" },

  {
    "id": "321112",
    "name": "丹徒区",
    "parent_id": "321100",
    "level_type": "3" },

  {
    "id": "321181",
    "name": "丹阳市",
    "parent_id": "321100",
    "level_type": "3" },

  {
    "id": "321182",
    "name": "扬中市",
    "parent_id": "321100",
    "level_type": "3" },

  {
    "id": "321183",
    "name": "句容市",
    "parent_id": "321100",
    "level_type": "3" },

  {
    "id": "321200",
    "name": "泰州市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "321202",
    "name": "海陵区",
    "parent_id": "321200",
    "level_type": "3" },

  {
    "id": "321203",
    "name": "高港区",
    "parent_id": "321200",
    "level_type": "3" },

  {
    "id": "321204",
    "name": "姜堰区",
    "parent_id": "321200",
    "level_type": "3" },

  {
    "id": "321281",
    "name": "兴化市",
    "parent_id": "321200",
    "level_type": "3" },

  {
    "id": "321282",
    "name": "靖江市",
    "parent_id": "321200",
    "level_type": "3" },

  {
    "id": "321283",
    "name": "泰兴市",
    "parent_id": "321200",
    "level_type": "3" },

  {
    "id": "321300",
    "name": "宿迁市",
    "parent_id": "320000",
    "level_type": "2" },

  {
    "id": "321302",
    "name": "宿城区",
    "parent_id": "321300",
    "level_type": "3" },

  {
    "id": "321311",
    "name": "宿豫区",
    "parent_id": "321300",
    "level_type": "3" },

  {
    "id": "321322",
    "name": "沭阳县",
    "parent_id": "321300",
    "level_type": "3" },

  {
    "id": "321323",
    "name": "泗阳县",
    "parent_id": "321300",
    "level_type": "3" },

  {
    "id": "321324",
    "name": "泗洪县",
    "parent_id": "321300",
    "level_type": "3" },

  {
    "id": "330000",
    "name": "浙江省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "330100",
    "name": "杭州市",
    "parent_id": "330000",
    "level_type": "2" },

  {
    "id": "330102",
    "name": "上城区",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330103",
    "name": "下城区",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330104",
    "name": "江干区",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330105",
    "name": "拱墅区",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330106",
    "name": "西湖区",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330108",
    "name": "滨江区",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330109",
    "name": "萧山区",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330110",
    "name": "余杭区",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330122",
    "name": "桐庐县",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330127",
    "name": "淳安县",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330182",
    "name": "建德市",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330183",
    "name": "富阳区",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330185",
    "name": "临安市",
    "parent_id": "330100",
    "level_type": "3" },

  {
    "id": "330200",
    "name": "宁波市",
    "parent_id": "330000",
    "level_type": "2" },

  {
    "id": "330203",
    "name": "海曙区",
    "parent_id": "330200",
    "level_type": "3" },

  {
    "id": "330204",
    "name": "江东区",
    "parent_id": "330200",
    "level_type": "3" },

  {
    "id": "330205",
    "name": "江北区",
    "parent_id": "330200",
    "level_type": "3" },

  {
    "id": "330206",
    "name": "北仑区",
    "parent_id": "330200",
    "level_type": "3" },

  {
    "id": "330211",
    "name": "镇海区",
    "parent_id": "330200",
    "level_type": "3" },

  {
    "id": "330212",
    "name": "鄞州区",
    "parent_id": "330200",
    "level_type": "3" },

  {
    "id": "330225",
    "name": "象山县",
    "parent_id": "330200",
    "level_type": "3" },

  {
    "id": "330226",
    "name": "宁海县",
    "parent_id": "330200",
    "level_type": "3" },

  {
    "id": "330281",
    "name": "余姚市",
    "parent_id": "330200",
    "level_type": "3" },

  {
    "id": "330282",
    "name": "慈溪市",
    "parent_id": "330200",
    "level_type": "3" },

  {
    "id": "330283",
    "name": "奉化市",
    "parent_id": "330200",
    "level_type": "3" },

  {
    "id": "330300",
    "name": "温州市",
    "parent_id": "330000",
    "level_type": "2" },

  {
    "id": "330302",
    "name": "鹿城区",
    "parent_id": "330300",
    "level_type": "3" },

  {
    "id": "330303",
    "name": "龙湾区",
    "parent_id": "330300",
    "level_type": "3" },

  {
    "id": "330304",
    "name": "瓯海区",
    "parent_id": "330300",
    "level_type": "3" },

  {
    "id": "330322",
    "name": "洞头县",
    "parent_id": "330300",
    "level_type": "3" },

  {
    "id": "330324",
    "name": "永嘉县",
    "parent_id": "330300",
    "level_type": "3" },

  {
    "id": "330326",
    "name": "平阳县",
    "parent_id": "330300",
    "level_type": "3" },

  {
    "id": "330327",
    "name": "苍南县",
    "parent_id": "330300",
    "level_type": "3" },

  {
    "id": "330328",
    "name": "文成县",
    "parent_id": "330300",
    "level_type": "3" },

  {
    "id": "330329",
    "name": "泰顺县",
    "parent_id": "330300",
    "level_type": "3" },

  {
    "id": "330381",
    "name": "瑞安市",
    "parent_id": "330300",
    "level_type": "3" },

  {
    "id": "330382",
    "name": "乐清市",
    "parent_id": "330300",
    "level_type": "3" },

  {
    "id": "330400",
    "name": "嘉兴市",
    "parent_id": "330000",
    "level_type": "2" },

  {
    "id": "330402",
    "name": "南湖区",
    "parent_id": "330400",
    "level_type": "3" },

  {
    "id": "330411",
    "name": "秀洲区",
    "parent_id": "330400",
    "level_type": "3" },

  {
    "id": "330421",
    "name": "嘉善县",
    "parent_id": "330400",
    "level_type": "3" },

  {
    "id": "330424",
    "name": "海盐县",
    "parent_id": "330400",
    "level_type": "3" },

  {
    "id": "330481",
    "name": "海宁市",
    "parent_id": "330400",
    "level_type": "3" },

  {
    "id": "330482",
    "name": "平湖市",
    "parent_id": "330400",
    "level_type": "3" },

  {
    "id": "330483",
    "name": "桐乡市",
    "parent_id": "330400",
    "level_type": "3" },

  {
    "id": "330500",
    "name": "湖州市",
    "parent_id": "330000",
    "level_type": "2" },

  {
    "id": "330502",
    "name": "吴兴区",
    "parent_id": "330500",
    "level_type": "3" },

  {
    "id": "330503",
    "name": "南浔区",
    "parent_id": "330500",
    "level_type": "3" },

  {
    "id": "330521",
    "name": "德清县",
    "parent_id": "330500",
    "level_type": "3" },

  {
    "id": "330522",
    "name": "长兴县",
    "parent_id": "330500",
    "level_type": "3" },

  {
    "id": "330523",
    "name": "安吉县",
    "parent_id": "330500",
    "level_type": "3" },

  {
    "id": "330600",
    "name": "绍兴市",
    "parent_id": "330000",
    "level_type": "2" },

  {
    "id": "330602",
    "name": "越城区",
    "parent_id": "330600",
    "level_type": "3" },

  {
    "id": "330603",
    "name": "柯桥区",
    "parent_id": "330600",
    "level_type": "3" },

  {
    "id": "330604",
    "name": "上虞区",
    "parent_id": "330600",
    "level_type": "3" },

  {
    "id": "330624",
    "name": "新昌县",
    "parent_id": "330600",
    "level_type": "3" },

  {
    "id": "330681",
    "name": "诸暨市",
    "parent_id": "330600",
    "level_type": "3" },

  {
    "id": "330683",
    "name": "嵊州市",
    "parent_id": "330600",
    "level_type": "3" },

  {
    "id": "330700",
    "name": "金华市",
    "parent_id": "330000",
    "level_type": "2" },

  {
    "id": "330702",
    "name": "婺城区",
    "parent_id": "330700",
    "level_type": "3" },

  {
    "id": "330703",
    "name": "金东区",
    "parent_id": "330700",
    "level_type": "3" },

  {
    "id": "330723",
    "name": "武义县",
    "parent_id": "330700",
    "level_type": "3" },

  {
    "id": "330726",
    "name": "浦江县",
    "parent_id": "330700",
    "level_type": "3" },

  {
    "id": "330727",
    "name": "磐安县",
    "parent_id": "330700",
    "level_type": "3" },

  {
    "id": "330781",
    "name": "兰溪市",
    "parent_id": "330700",
    "level_type": "3" },

  {
    "id": "330782",
    "name": "义乌市",
    "parent_id": "330700",
    "level_type": "3" },

  {
    "id": "330783",
    "name": "东阳市",
    "parent_id": "330700",
    "level_type": "3" },

  {
    "id": "330784",
    "name": "永康市",
    "parent_id": "330700",
    "level_type": "3" },

  {
    "id": "330800",
    "name": "衢州市",
    "parent_id": "330000",
    "level_type": "2" },

  {
    "id": "330802",
    "name": "柯城区",
    "parent_id": "330800",
    "level_type": "3" },

  {
    "id": "330803",
    "name": "衢江区",
    "parent_id": "330800",
    "level_type": "3" },

  {
    "id": "330822",
    "name": "常山县",
    "parent_id": "330800",
    "level_type": "3" },

  {
    "id": "330824",
    "name": "开化县",
    "parent_id": "330800",
    "level_type": "3" },

  {
    "id": "330825",
    "name": "龙游县",
    "parent_id": "330800",
    "level_type": "3" },

  {
    "id": "330881",
    "name": "江山市",
    "parent_id": "330800",
    "level_type": "3" },

  {
    "id": "330900",
    "name": "舟山市",
    "parent_id": "330000",
    "level_type": "2" },

  {
    "id": "330902",
    "name": "定海区",
    "parent_id": "330900",
    "level_type": "3" },

  {
    "id": "330903",
    "name": "普陀区",
    "parent_id": "330900",
    "level_type": "3" },

  {
    "id": "330921",
    "name": "岱山县",
    "parent_id": "330900",
    "level_type": "3" },

  {
    "id": "330922",
    "name": "嵊泗县",
    "parent_id": "330900",
    "level_type": "3" },

  {
    "id": "331000",
    "name": "台州市",
    "parent_id": "330000",
    "level_type": "2" },

  {
    "id": "331002",
    "name": "椒江区",
    "parent_id": "331000",
    "level_type": "3" },

  {
    "id": "331003",
    "name": "黄岩区",
    "parent_id": "331000",
    "level_type": "3" },

  {
    "id": "331004",
    "name": "路桥区",
    "parent_id": "331000",
    "level_type": "3" },

  {
    "id": "331021",
    "name": "玉环县",
    "parent_id": "331000",
    "level_type": "3" },

  {
    "id": "331022",
    "name": "三门县",
    "parent_id": "331000",
    "level_type": "3" },

  {
    "id": "331023",
    "name": "天台县",
    "parent_id": "331000",
    "level_type": "3" },

  {
    "id": "331024",
    "name": "仙居县",
    "parent_id": "331000",
    "level_type": "3" },

  {
    "id": "331081",
    "name": "温岭市",
    "parent_id": "331000",
    "level_type": "3" },

  {
    "id": "331082",
    "name": "临海市",
    "parent_id": "331000",
    "level_type": "3" },

  {
    "id": "331100",
    "name": "丽水市",
    "parent_id": "330000",
    "level_type": "2" },

  {
    "id": "331102",
    "name": "莲都区",
    "parent_id": "331100",
    "level_type": "3" },

  {
    "id": "331121",
    "name": "青田县",
    "parent_id": "331100",
    "level_type": "3" },

  {
    "id": "331122",
    "name": "缙云县",
    "parent_id": "331100",
    "level_type": "3" },

  {
    "id": "331123",
    "name": "遂昌县",
    "parent_id": "331100",
    "level_type": "3" },

  {
    "id": "331124",
    "name": "松阳县",
    "parent_id": "331100",
    "level_type": "3" },

  {
    "id": "331125",
    "name": "云和县",
    "parent_id": "331100",
    "level_type": "3" },

  {
    "id": "331126",
    "name": "庆元县",
    "parent_id": "331100",
    "level_type": "3" },

  {
    "id": "331127",
    "name": "景宁畲族自治县",
    "parent_id": "331100",
    "level_type": "3" },

  {
    "id": "331181",
    "name": "龙泉市",
    "parent_id": "331100",
    "level_type": "3" },

  {
    "id": "331200",
    "name": "舟山群岛新区",
    "parent_id": "330000",
    "level_type": "2" },

  {
    "id": "331201",
    "name": "金塘岛",
    "parent_id": "331200",
    "level_type": "3" },

  {
    "id": "331202",
    "name": "六横岛",
    "parent_id": "331200",
    "level_type": "3" },

  {
    "id": "331203",
    "name": "衢山岛",
    "parent_id": "331200",
    "level_type": "3" },

  {
    "id": "331204",
    "name": "舟山本岛西北部",
    "parent_id": "331200",
    "level_type": "3" },

  {
    "id": "331205",
    "name": "岱山岛西南部",
    "parent_id": "331200",
    "level_type": "3" },

  {
    "id": "331206",
    "name": "泗礁岛",
    "parent_id": "331200",
    "level_type": "3" },

  {
    "id": "331207",
    "name": "朱家尖岛",
    "parent_id": "331200",
    "level_type": "3" },

  {
    "id": "331208",
    "name": "洋山岛",
    "parent_id": "331200",
    "level_type": "3" },

  {
    "id": "331209",
    "name": "长涂岛",
    "parent_id": "331200",
    "level_type": "3" },

  {
    "id": "331210",
    "name": "虾峙岛",
    "parent_id": "331200",
    "level_type": "3" },

  {
    "id": "340000",
    "name": "安徽省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "340100",
    "name": "合肥市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "340102",
    "name": "瑶海区",
    "parent_id": "340100",
    "level_type": "3" },

  {
    "id": "340103",
    "name": "庐阳区",
    "parent_id": "340100",
    "level_type": "3" },

  {
    "id": "340104",
    "name": "蜀山区",
    "parent_id": "340100",
    "level_type": "3" },

  {
    "id": "340111",
    "name": "包河区",
    "parent_id": "340100",
    "level_type": "3" },

  {
    "id": "340121",
    "name": "长丰县",
    "parent_id": "340100",
    "level_type": "3" },

  {
    "id": "340122",
    "name": "肥东县",
    "parent_id": "340100",
    "level_type": "3" },

  {
    "id": "340123",
    "name": "肥西县",
    "parent_id": "340100",
    "level_type": "3" },

  {
    "id": "340124",
    "name": "庐江县",
    "parent_id": "340100",
    "level_type": "3" },

  {
    "id": "340181",
    "name": "巢湖市",
    "parent_id": "340100",
    "level_type": "3" },

  {
    "id": "340200",
    "name": "芜湖市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "340202",
    "name": "镜湖区",
    "parent_id": "340200",
    "level_type": "3" },

  {
    "id": "340203",
    "name": "弋江区",
    "parent_id": "340200",
    "level_type": "3" },

  {
    "id": "340207",
    "name": "鸠江区",
    "parent_id": "340200",
    "level_type": "3" },

  {
    "id": "340208",
    "name": "三山区",
    "parent_id": "340200",
    "level_type": "3" },

  {
    "id": "340221",
    "name": "芜湖县",
    "parent_id": "340200",
    "level_type": "3" },

  {
    "id": "340222",
    "name": "繁昌县",
    "parent_id": "340200",
    "level_type": "3" },

  {
    "id": "340223",
    "name": "南陵县",
    "parent_id": "340200",
    "level_type": "3" },

  {
    "id": "340225",
    "name": "无为县",
    "parent_id": "340200",
    "level_type": "3" },

  {
    "id": "340300",
    "name": "蚌埠市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "340302",
    "name": "龙子湖区",
    "parent_id": "340300",
    "level_type": "3" },

  {
    "id": "340303",
    "name": "蚌山区",
    "parent_id": "340300",
    "level_type": "3" },

  {
    "id": "340304",
    "name": "禹会区",
    "parent_id": "340300",
    "level_type": "3" },

  {
    "id": "340311",
    "name": "淮上区",
    "parent_id": "340300",
    "level_type": "3" },

  {
    "id": "340321",
    "name": "怀远县",
    "parent_id": "340300",
    "level_type": "3" },

  {
    "id": "340322",
    "name": "五河县",
    "parent_id": "340300",
    "level_type": "3" },

  {
    "id": "340323",
    "name": "固镇县",
    "parent_id": "340300",
    "level_type": "3" },

  {
    "id": "340400",
    "name": "淮南市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "340402",
    "name": "大通区",
    "parent_id": "340400",
    "level_type": "3" },

  {
    "id": "340403",
    "name": "田家庵区",
    "parent_id": "340400",
    "level_type": "3" },

  {
    "id": "340404",
    "name": "谢家集区",
    "parent_id": "340400",
    "level_type": "3" },

  {
    "id": "340405",
    "name": "八公山区",
    "parent_id": "340400",
    "level_type": "3" },

  {
    "id": "340406",
    "name": "潘集区",
    "parent_id": "340400",
    "level_type": "3" },

  {
    "id": "340421",
    "name": "凤台县",
    "parent_id": "340400",
    "level_type": "3" },

  {
    "id": "340500",
    "name": "马鞍山市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "340503",
    "name": "花山区",
    "parent_id": "340500",
    "level_type": "3" },

  {
    "id": "340504",
    "name": "雨山区",
    "parent_id": "340500",
    "level_type": "3" },

  {
    "id": "340506",
    "name": "博望区",
    "parent_id": "340500",
    "level_type": "3" },

  {
    "id": "340521",
    "name": "当涂县",
    "parent_id": "340500",
    "level_type": "3" },

  {
    "id": "340522",
    "name": "含山县",
    "parent_id": "340500",
    "level_type": "3" },

  {
    "id": "340523",
    "name": "和县",
    "parent_id": "340500",
    "level_type": "3" },

  {
    "id": "340600",
    "name": "淮北市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "340602",
    "name": "杜集区",
    "parent_id": "340600",
    "level_type": "3" },

  {
    "id": "340603",
    "name": "相山区",
    "parent_id": "340600",
    "level_type": "3" },

  {
    "id": "340604",
    "name": "烈山区",
    "parent_id": "340600",
    "level_type": "3" },

  {
    "id": "340621",
    "name": "濉溪县",
    "parent_id": "340600",
    "level_type": "3" },

  {
    "id": "340700",
    "name": "铜陵市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "340702",
    "name": "铜官山区",
    "parent_id": "340700",
    "level_type": "3" },

  {
    "id": "340703",
    "name": "狮子山区",
    "parent_id": "340700",
    "level_type": "3" },

  {
    "id": "340711",
    "name": "郊区",
    "parent_id": "340700",
    "level_type": "3" },

  {
    "id": "340721",
    "name": "铜陵县",
    "parent_id": "340700",
    "level_type": "3" },

  {
    "id": "340800",
    "name": "安庆市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "340802",
    "name": "迎江区",
    "parent_id": "340800",
    "level_type": "3" },

  {
    "id": "340803",
    "name": "大观区",
    "parent_id": "340800",
    "level_type": "3" },

  {
    "id": "340811",
    "name": "宜秀区",
    "parent_id": "340800",
    "level_type": "3" },

  {
    "id": "340822",
    "name": "怀宁县",
    "parent_id": "340800",
    "level_type": "3" },

  {
    "id": "340823",
    "name": "枞阳县",
    "parent_id": "340800",
    "level_type": "3" },

  {
    "id": "340824",
    "name": "潜山县",
    "parent_id": "340800",
    "level_type": "3" },

  {
    "id": "340825",
    "name": "太湖县",
    "parent_id": "340800",
    "level_type": "3" },

  {
    "id": "340826",
    "name": "宿松县",
    "parent_id": "340800",
    "level_type": "3" },

  {
    "id": "340827",
    "name": "望江县",
    "parent_id": "340800",
    "level_type": "3" },

  {
    "id": "340828",
    "name": "岳西县",
    "parent_id": "340800",
    "level_type": "3" },

  {
    "id": "340881",
    "name": "桐城市",
    "parent_id": "340800",
    "level_type": "3" },

  {
    "id": "341000",
    "name": "黄山市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "341002",
    "name": "屯溪区",
    "parent_id": "341000",
    "level_type": "3" },

  {
    "id": "341003",
    "name": "黄山区",
    "parent_id": "341000",
    "level_type": "3" },

  {
    "id": "341004",
    "name": "徽州区",
    "parent_id": "341000",
    "level_type": "3" },

  {
    "id": "341021",
    "name": "歙县",
    "parent_id": "341000",
    "level_type": "3" },

  {
    "id": "341022",
    "name": "休宁县",
    "parent_id": "341000",
    "level_type": "3" },

  {
    "id": "341023",
    "name": "黟县",
    "parent_id": "341000",
    "level_type": "3" },

  {
    "id": "341024",
    "name": "祁门县",
    "parent_id": "341000",
    "level_type": "3" },

  {
    "id": "341100",
    "name": "滁州市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "341102",
    "name": "琅琊区",
    "parent_id": "341100",
    "level_type": "3" },

  {
    "id": "341103",
    "name": "南谯区",
    "parent_id": "341100",
    "level_type": "3" },

  {
    "id": "341122",
    "name": "来安县",
    "parent_id": "341100",
    "level_type": "3" },

  {
    "id": "341124",
    "name": "全椒县",
    "parent_id": "341100",
    "level_type": "3" },

  {
    "id": "341125",
    "name": "定远县",
    "parent_id": "341100",
    "level_type": "3" },

  {
    "id": "341126",
    "name": "凤阳县",
    "parent_id": "341100",
    "level_type": "3" },

  {
    "id": "341181",
    "name": "天长市",
    "parent_id": "341100",
    "level_type": "3" },

  {
    "id": "341182",
    "name": "明光市",
    "parent_id": "341100",
    "level_type": "3" },

  {
    "id": "341200",
    "name": "阜阳市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "341202",
    "name": "颍州区",
    "parent_id": "341200",
    "level_type": "3" },

  {
    "id": "341203",
    "name": "颍东区",
    "parent_id": "341200",
    "level_type": "3" },

  {
    "id": "341204",
    "name": "颍泉区",
    "parent_id": "341200",
    "level_type": "3" },

  {
    "id": "341221",
    "name": "临泉县",
    "parent_id": "341200",
    "level_type": "3" },

  {
    "id": "341222",
    "name": "太和县",
    "parent_id": "341200",
    "level_type": "3" },

  {
    "id": "341225",
    "name": "阜南县",
    "parent_id": "341200",
    "level_type": "3" },

  {
    "id": "341226",
    "name": "颍上县",
    "parent_id": "341200",
    "level_type": "3" },

  {
    "id": "341282",
    "name": "界首市",
    "parent_id": "341200",
    "level_type": "3" },

  {
    "id": "341300",
    "name": "宿州市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "341302",
    "name": "埇桥区",
    "parent_id": "341300",
    "level_type": "3" },

  {
    "id": "341321",
    "name": "砀山县",
    "parent_id": "341300",
    "level_type": "3" },

  {
    "id": "341322",
    "name": "萧县",
    "parent_id": "341300",
    "level_type": "3" },

  {
    "id": "341323",
    "name": "灵璧县",
    "parent_id": "341300",
    "level_type": "3" },

  {
    "id": "341324",
    "name": "泗县",
    "parent_id": "341300",
    "level_type": "3" },

  {
    "id": "341500",
    "name": "六安市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "341502",
    "name": "金安区",
    "parent_id": "341500",
    "level_type": "3" },

  {
    "id": "341503",
    "name": "裕安区",
    "parent_id": "341500",
    "level_type": "3" },

  {
    "id": "341521",
    "name": "寿县",
    "parent_id": "341500",
    "level_type": "3" },

  {
    "id": "341522",
    "name": "霍邱县",
    "parent_id": "341500",
    "level_type": "3" },

  {
    "id": "341523",
    "name": "舒城县",
    "parent_id": "341500",
    "level_type": "3" },

  {
    "id": "341524",
    "name": "金寨县",
    "parent_id": "341500",
    "level_type": "3" },

  {
    "id": "341525",
    "name": "霍山县",
    "parent_id": "341500",
    "level_type": "3" },

  {
    "id": "341600",
    "name": "亳州市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "341602",
    "name": "谯城区",
    "parent_id": "341600",
    "level_type": "3" },

  {
    "id": "341621",
    "name": "涡阳县",
    "parent_id": "341600",
    "level_type": "3" },

  {
    "id": "341622",
    "name": "蒙城县",
    "parent_id": "341600",
    "level_type": "3" },

  {
    "id": "341623",
    "name": "利辛县",
    "parent_id": "341600",
    "level_type": "3" },

  {
    "id": "341700",
    "name": "池州市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "341702",
    "name": "贵池区",
    "parent_id": "341700",
    "level_type": "3" },

  {
    "id": "341721",
    "name": "东至县",
    "parent_id": "341700",
    "level_type": "3" },

  {
    "id": "341722",
    "name": "石台县",
    "parent_id": "341700",
    "level_type": "3" },

  {
    "id": "341723",
    "name": "青阳县",
    "parent_id": "341700",
    "level_type": "3" },

  {
    "id": "341800",
    "name": "宣城市",
    "parent_id": "340000",
    "level_type": "2" },

  {
    "id": "341802",
    "name": "宣州区",
    "parent_id": "341800",
    "level_type": "3" },

  {
    "id": "341821",
    "name": "郎溪县",
    "parent_id": "341800",
    "level_type": "3" },

  {
    "id": "341822",
    "name": "广德县",
    "parent_id": "341800",
    "level_type": "3" },

  {
    "id": "341823",
    "name": "泾县",
    "parent_id": "341800",
    "level_type": "3" },

  {
    "id": "341824",
    "name": "绩溪县",
    "parent_id": "341800",
    "level_type": "3" },

  {
    "id": "341825",
    "name": "旌德县",
    "parent_id": "341800",
    "level_type": "3" },

  {
    "id": "341881",
    "name": "宁国市",
    "parent_id": "341800",
    "level_type": "3" },

  {
    "id": "350000",
    "name": "福建省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "350100",
    "name": "福州市",
    "parent_id": "350000",
    "level_type": "2" },

  {
    "id": "350102",
    "name": "鼓楼区",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350103",
    "name": "台江区",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350104",
    "name": "仓山区",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350105",
    "name": "马尾区",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350111",
    "name": "晋安区",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350121",
    "name": "闽侯县",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350122",
    "name": "连江县",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350123",
    "name": "罗源县",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350124",
    "name": "闽清县",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350125",
    "name": "永泰县",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350128",
    "name": "平潭县",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350181",
    "name": "福清市",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350182",
    "name": "长乐市",
    "parent_id": "350100",
    "level_type": "3" },

  {
    "id": "350200",
    "name": "厦门市",
    "parent_id": "350000",
    "level_type": "2" },

  {
    "id": "350203",
    "name": "思明区",
    "parent_id": "350200",
    "level_type": "3" },

  {
    "id": "350205",
    "name": "海沧区",
    "parent_id": "350200",
    "level_type": "3" },

  {
    "id": "350206",
    "name": "湖里区",
    "parent_id": "350200",
    "level_type": "3" },

  {
    "id": "350211",
    "name": "集美区",
    "parent_id": "350200",
    "level_type": "3" },

  {
    "id": "350212",
    "name": "同安区",
    "parent_id": "350200",
    "level_type": "3" },

  {
    "id": "350213",
    "name": "翔安区",
    "parent_id": "350200",
    "level_type": "3" },

  {
    "id": "350300",
    "name": "莆田市",
    "parent_id": "350000",
    "level_type": "2" },

  {
    "id": "350302",
    "name": "城厢区",
    "parent_id": "350300",
    "level_type": "3" },

  {
    "id": "350303",
    "name": "涵江区",
    "parent_id": "350300",
    "level_type": "3" },

  {
    "id": "350304",
    "name": "荔城区",
    "parent_id": "350300",
    "level_type": "3" },

  {
    "id": "350305",
    "name": "秀屿区",
    "parent_id": "350300",
    "level_type": "3" },

  {
    "id": "350322",
    "name": "仙游县",
    "parent_id": "350300",
    "level_type": "3" },

  {
    "id": "350400",
    "name": "三明市",
    "parent_id": "350000",
    "level_type": "2" },

  {
    "id": "350402",
    "name": "梅列区",
    "parent_id": "350400",
    "level_type": "3" },

  {
    "id": "350403",
    "name": "三元区",
    "parent_id": "350400",
    "level_type": "3" },

  {
    "id": "350421",
    "name": "明溪县",
    "parent_id": "350400",
    "level_type": "3" },

  {
    "id": "350423",
    "name": "清流县",
    "parent_id": "350400",
    "level_type": "3" },

  {
    "id": "350424",
    "name": "宁化县",
    "parent_id": "350400",
    "level_type": "3" },

  {
    "id": "350425",
    "name": "大田县",
    "parent_id": "350400",
    "level_type": "3" },

  {
    "id": "350426",
    "name": "尤溪县",
    "parent_id": "350400",
    "level_type": "3" },

  {
    "id": "350427",
    "name": "沙县",
    "parent_id": "350400",
    "level_type": "3" },

  {
    "id": "350428",
    "name": "将乐县",
    "parent_id": "350400",
    "level_type": "3" },

  {
    "id": "350429",
    "name": "泰宁县",
    "parent_id": "350400",
    "level_type": "3" },

  {
    "id": "350430",
    "name": "建宁县",
    "parent_id": "350400",
    "level_type": "3" },

  {
    "id": "350481",
    "name": "永安市",
    "parent_id": "350400",
    "level_type": "3" },

  {
    "id": "350500",
    "name": "泉州市",
    "parent_id": "350000",
    "level_type": "2" },

  {
    "id": "350502",
    "name": "鲤城区",
    "parent_id": "350500",
    "level_type": "3" },

  {
    "id": "350503",
    "name": "丰泽区",
    "parent_id": "350500",
    "level_type": "3" },

  {
    "id": "350504",
    "name": "洛江区",
    "parent_id": "350500",
    "level_type": "3" },

  {
    "id": "350505",
    "name": "泉港区",
    "parent_id": "350500",
    "level_type": "3" },

  {
    "id": "350521",
    "name": "惠安县",
    "parent_id": "350500",
    "level_type": "3" },

  {
    "id": "350524",
    "name": "安溪县",
    "parent_id": "350500",
    "level_type": "3" },

  {
    "id": "350525",
    "name": "永春县",
    "parent_id": "350500",
    "level_type": "3" },

  {
    "id": "350526",
    "name": "德化县",
    "parent_id": "350500",
    "level_type": "3" },

  {
    "id": "350527",
    "name": "金门县",
    "parent_id": "350500",
    "level_type": "3" },

  {
    "id": "350581",
    "name": "石狮市",
    "parent_id": "350500",
    "level_type": "3" },

  {
    "id": "350582",
    "name": "晋江市",
    "parent_id": "350500",
    "level_type": "3" },

  {
    "id": "350583",
    "name": "南安市",
    "parent_id": "350500",
    "level_type": "3" },

  {
    "id": "350600",
    "name": "漳州市",
    "parent_id": "350000",
    "level_type": "2" },

  {
    "id": "350602",
    "name": "芗城区",
    "parent_id": "350600",
    "level_type": "3" },

  {
    "id": "350603",
    "name": "龙文区",
    "parent_id": "350600",
    "level_type": "3" },

  {
    "id": "350622",
    "name": "云霄县",
    "parent_id": "350600",
    "level_type": "3" },

  {
    "id": "350623",
    "name": "漳浦县",
    "parent_id": "350600",
    "level_type": "3" },

  {
    "id": "350624",
    "name": "诏安县",
    "parent_id": "350600",
    "level_type": "3" },

  {
    "id": "350625",
    "name": "长泰县",
    "parent_id": "350600",
    "level_type": "3" },

  {
    "id": "350626",
    "name": "东山县",
    "parent_id": "350600",
    "level_type": "3" },

  {
    "id": "350627",
    "name": "南靖县",
    "parent_id": "350600",
    "level_type": "3" },

  {
    "id": "350628",
    "name": "平和县",
    "parent_id": "350600",
    "level_type": "3" },

  {
    "id": "350629",
    "name": "华安县",
    "parent_id": "350600",
    "level_type": "3" },

  {
    "id": "350681",
    "name": "龙海市",
    "parent_id": "350600",
    "level_type": "3" },

  {
    "id": "350700",
    "name": "南平市",
    "parent_id": "350000",
    "level_type": "2" },

  {
    "id": "350702",
    "name": "延平区",
    "parent_id": "350700",
    "level_type": "3" },

  {
    "id": "350703",
    "name": "建阳区",
    "parent_id": "350700",
    "level_type": "3" },

  {
    "id": "350721",
    "name": "顺昌县",
    "parent_id": "350700",
    "level_type": "3" },

  {
    "id": "350722",
    "name": "浦城县",
    "parent_id": "350700",
    "level_type": "3" },

  {
    "id": "350723",
    "name": "光泽县",
    "parent_id": "350700",
    "level_type": "3" },

  {
    "id": "350724",
    "name": "松溪县",
    "parent_id": "350700",
    "level_type": "3" },

  {
    "id": "350725",
    "name": "政和县",
    "parent_id": "350700",
    "level_type": "3" },

  {
    "id": "350781",
    "name": "邵武市",
    "parent_id": "350700",
    "level_type": "3" },

  {
    "id": "350782",
    "name": "武夷山市",
    "parent_id": "350700",
    "level_type": "3" },

  {
    "id": "350783",
    "name": "建瓯市",
    "parent_id": "350700",
    "level_type": "3" },

  {
    "id": "350800",
    "name": "龙岩市",
    "parent_id": "350000",
    "level_type": "2" },

  {
    "id": "350802",
    "name": "新罗区",
    "parent_id": "350800",
    "level_type": "3" },

  {
    "id": "350821",
    "name": "长汀县",
    "parent_id": "350800",
    "level_type": "3" },

  {
    "id": "350822",
    "name": "永定区",
    "parent_id": "350800",
    "level_type": "3" },

  {
    "id": "350823",
    "name": "上杭县",
    "parent_id": "350800",
    "level_type": "3" },

  {
    "id": "350824",
    "name": "武平县",
    "parent_id": "350800",
    "level_type": "3" },

  {
    "id": "350825",
    "name": "连城县",
    "parent_id": "350800",
    "level_type": "3" },

  {
    "id": "350881",
    "name": "漳平市",
    "parent_id": "350800",
    "level_type": "3" },

  {
    "id": "350900",
    "name": "宁德市",
    "parent_id": "350000",
    "level_type": "2" },

  {
    "id": "350902",
    "name": "蕉城区",
    "parent_id": "350900",
    "level_type": "3" },

  {
    "id": "350921",
    "name": "霞浦县",
    "parent_id": "350900",
    "level_type": "3" },

  {
    "id": "350922",
    "name": "古田县",
    "parent_id": "350900",
    "level_type": "3" },

  {
    "id": "350923",
    "name": "屏南县",
    "parent_id": "350900",
    "level_type": "3" },

  {
    "id": "350924",
    "name": "寿宁县",
    "parent_id": "350900",
    "level_type": "3" },

  {
    "id": "350925",
    "name": "周宁县",
    "parent_id": "350900",
    "level_type": "3" },

  {
    "id": "350926",
    "name": "柘荣县",
    "parent_id": "350900",
    "level_type": "3" },

  {
    "id": "350981",
    "name": "福安市",
    "parent_id": "350900",
    "level_type": "3" },

  {
    "id": "350982",
    "name": "福鼎市",
    "parent_id": "350900",
    "level_type": "3" },

  {
    "id": "360000",
    "name": "江西省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "360100",
    "name": "南昌市",
    "parent_id": "360000",
    "level_type": "2" },

  {
    "id": "360102",
    "name": "东湖区",
    "parent_id": "360100",
    "level_type": "3" },

  {
    "id": "360103",
    "name": "西湖区",
    "parent_id": "360100",
    "level_type": "3" },

  {
    "id": "360104",
    "name": "青云谱区",
    "parent_id": "360100",
    "level_type": "3" },

  {
    "id": "360105",
    "name": "湾里区",
    "parent_id": "360100",
    "level_type": "3" },

  {
    "id": "360111",
    "name": "青山湖区",
    "parent_id": "360100",
    "level_type": "3" },

  {
    "id": "360121",
    "name": "南昌县",
    "parent_id": "360100",
    "level_type": "3" },

  {
    "id": "360122",
    "name": "新建县",
    "parent_id": "360100",
    "level_type": "3" },

  {
    "id": "360123",
    "name": "安义县",
    "parent_id": "360100",
    "level_type": "3" },

  {
    "id": "360124",
    "name": "进贤县",
    "parent_id": "360100",
    "level_type": "3" },

  {
    "id": "360200",
    "name": "景德镇市",
    "parent_id": "360000",
    "level_type": "2" },

  {
    "id": "360202",
    "name": "昌江区",
    "parent_id": "360200",
    "level_type": "3" },

  {
    "id": "360203",
    "name": "珠山区",
    "parent_id": "360200",
    "level_type": "3" },

  {
    "id": "360222",
    "name": "浮梁县",
    "parent_id": "360200",
    "level_type": "3" },

  {
    "id": "360281",
    "name": "乐平市",
    "parent_id": "360200",
    "level_type": "3" },

  {
    "id": "360300",
    "name": "萍乡市",
    "parent_id": "360000",
    "level_type": "2" },

  {
    "id": "360302",
    "name": "安源区",
    "parent_id": "360300",
    "level_type": "3" },

  {
    "id": "360313",
    "name": "湘东区",
    "parent_id": "360300",
    "level_type": "3" },

  {
    "id": "360321",
    "name": "莲花县",
    "parent_id": "360300",
    "level_type": "3" },

  {
    "id": "360322",
    "name": "上栗县",
    "parent_id": "360300",
    "level_type": "3" },

  {
    "id": "360323",
    "name": "芦溪县",
    "parent_id": "360300",
    "level_type": "3" },

  {
    "id": "360400",
    "name": "九江市",
    "parent_id": "360000",
    "level_type": "2" },

  {
    "id": "360402",
    "name": "庐山区",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360403",
    "name": "浔阳区",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360421",
    "name": "九江县",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360423",
    "name": "武宁县",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360424",
    "name": "修水县",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360425",
    "name": "永修县",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360426",
    "name": "德安县",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360427",
    "name": "星子县",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360428",
    "name": "都昌县",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360429",
    "name": "湖口县",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360430",
    "name": "彭泽县",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360481",
    "name": "瑞昌市",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360482",
    "name": "共青城市",
    "parent_id": "360400",
    "level_type": "3" },

  {
    "id": "360500",
    "name": "新余市",
    "parent_id": "360000",
    "level_type": "2" },

  {
    "id": "360502",
    "name": "渝水区",
    "parent_id": "360500",
    "level_type": "3" },

  {
    "id": "360521",
    "name": "分宜县",
    "parent_id": "360500",
    "level_type": "3" },

  {
    "id": "360600",
    "name": "鹰潭市",
    "parent_id": "360000",
    "level_type": "2" },

  {
    "id": "360602",
    "name": "月湖区",
    "parent_id": "360600",
    "level_type": "3" },

  {
    "id": "360622",
    "name": "余江县",
    "parent_id": "360600",
    "level_type": "3" },

  {
    "id": "360681",
    "name": "贵溪市",
    "parent_id": "360600",
    "level_type": "3" },

  {
    "id": "360700",
    "name": "赣州市",
    "parent_id": "360000",
    "level_type": "2" },

  {
    "id": "360702",
    "name": "章贡区",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360703",
    "name": "南康区",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360721",
    "name": "赣县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360722",
    "name": "信丰县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360723",
    "name": "大余县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360724",
    "name": "上犹县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360725",
    "name": "崇义县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360726",
    "name": "安远县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360727",
    "name": "龙南县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360728",
    "name": "定南县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360729",
    "name": "全南县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360730",
    "name": "宁都县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360731",
    "name": "于都县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360732",
    "name": "兴国县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360733",
    "name": "会昌县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360734",
    "name": "寻乌县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360735",
    "name": "石城县",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360781",
    "name": "瑞金市",
    "parent_id": "360700",
    "level_type": "3" },

  {
    "id": "360800",
    "name": "吉安市",
    "parent_id": "360000",
    "level_type": "2" },

  {
    "id": "360802",
    "name": "吉州区",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360803",
    "name": "青原区",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360821",
    "name": "吉安县",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360822",
    "name": "吉水县",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360823",
    "name": "峡江县",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360824",
    "name": "新干县",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360825",
    "name": "永丰县",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360826",
    "name": "泰和县",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360827",
    "name": "遂川县",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360828",
    "name": "万安县",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360829",
    "name": "安福县",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360830",
    "name": "永新县",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360881",
    "name": "井冈山市",
    "parent_id": "360800",
    "level_type": "3" },

  {
    "id": "360900",
    "name": "宜春市",
    "parent_id": "360000",
    "level_type": "2" },

  {
    "id": "360902",
    "name": "袁州区",
    "parent_id": "360900",
    "level_type": "3" },

  {
    "id": "360921",
    "name": "奉新县",
    "parent_id": "360900",
    "level_type": "3" },

  {
    "id": "360922",
    "name": "万载县",
    "parent_id": "360900",
    "level_type": "3" },

  {
    "id": "360923",
    "name": "上高县",
    "parent_id": "360900",
    "level_type": "3" },

  {
    "id": "360924",
    "name": "宜丰县",
    "parent_id": "360900",
    "level_type": "3" },

  {
    "id": "360925",
    "name": "靖安县",
    "parent_id": "360900",
    "level_type": "3" },

  {
    "id": "360926",
    "name": "铜鼓县",
    "parent_id": "360900",
    "level_type": "3" },

  {
    "id": "360981",
    "name": "丰城市",
    "parent_id": "360900",
    "level_type": "3" },

  {
    "id": "360982",
    "name": "樟树市",
    "parent_id": "360900",
    "level_type": "3" },

  {
    "id": "360983",
    "name": "高安市",
    "parent_id": "360900",
    "level_type": "3" },

  {
    "id": "361000",
    "name": "抚州市",
    "parent_id": "360000",
    "level_type": "2" },

  {
    "id": "361002",
    "name": "临川区",
    "parent_id": "361000",
    "level_type": "3" },

  {
    "id": "361021",
    "name": "南城县",
    "parent_id": "361000",
    "level_type": "3" },

  {
    "id": "361022",
    "name": "黎川县",
    "parent_id": "361000",
    "level_type": "3" },

  {
    "id": "361023",
    "name": "南丰县",
    "parent_id": "361000",
    "level_type": "3" },

  {
    "id": "361024",
    "name": "崇仁县",
    "parent_id": "361000",
    "level_type": "3" },

  {
    "id": "361025",
    "name": "乐安县",
    "parent_id": "361000",
    "level_type": "3" },

  {
    "id": "361026",
    "name": "宜黄县",
    "parent_id": "361000",
    "level_type": "3" },

  {
    "id": "361027",
    "name": "金溪县",
    "parent_id": "361000",
    "level_type": "3" },

  {
    "id": "361028",
    "name": "资溪县",
    "parent_id": "361000",
    "level_type": "3" },

  {
    "id": "361029",
    "name": "东乡县",
    "parent_id": "361000",
    "level_type": "3" },

  {
    "id": "361030",
    "name": "广昌县",
    "parent_id": "361000",
    "level_type": "3" },

  {
    "id": "361100",
    "name": "上饶市",
    "parent_id": "360000",
    "level_type": "2" },

  {
    "id": "361102",
    "name": "信州区",
    "parent_id": "361100",
    "level_type": "3" },

  {
    "id": "361121",
    "name": "上饶县",
    "parent_id": "361100",
    "level_type": "3" },

  {
    "id": "361122",
    "name": "广丰县",
    "parent_id": "361100",
    "level_type": "3" },

  {
    "id": "361123",
    "name": "玉山县",
    "parent_id": "361100",
    "level_type": "3" },

  {
    "id": "361124",
    "name": "铅山县",
    "parent_id": "361100",
    "level_type": "3" },

  {
    "id": "361125",
    "name": "横峰县",
    "parent_id": "361100",
    "level_type": "3" },

  {
    "id": "361126",
    "name": "弋阳县",
    "parent_id": "361100",
    "level_type": "3" },

  {
    "id": "361127",
    "name": "余干县",
    "parent_id": "361100",
    "level_type": "3" },

  {
    "id": "361128",
    "name": "鄱阳县",
    "parent_id": "361100",
    "level_type": "3" },

  {
    "id": "361129",
    "name": "万年县",
    "parent_id": "361100",
    "level_type": "3" },

  {
    "id": "361130",
    "name": "婺源县",
    "parent_id": "361100",
    "level_type": "3" },

  {
    "id": "361181",
    "name": "德兴市",
    "parent_id": "361100",
    "level_type": "3" },

  {
    "id": "370000",
    "name": "山东省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "370100",
    "name": "济南市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "370102",
    "name": "历下区",
    "parent_id": "370100",
    "level_type": "3" },

  {
    "id": "370103",
    "name": "市中区",
    "parent_id": "370100",
    "level_type": "3" },

  {
    "id": "370104",
    "name": "槐荫区",
    "parent_id": "370100",
    "level_type": "3" },

  {
    "id": "370105",
    "name": "天桥区",
    "parent_id": "370100",
    "level_type": "3" },

  {
    "id": "370112",
    "name": "历城区",
    "parent_id": "370100",
    "level_type": "3" },

  {
    "id": "370113",
    "name": "长清区",
    "parent_id": "370100",
    "level_type": "3" },

  {
    "id": "370124",
    "name": "平阴县",
    "parent_id": "370100",
    "level_type": "3" },

  {
    "id": "370125",
    "name": "济阳县",
    "parent_id": "370100",
    "level_type": "3" },

  {
    "id": "370126",
    "name": "商河县",
    "parent_id": "370100",
    "level_type": "3" },

  {
    "id": "370181",
    "name": "章丘市",
    "parent_id": "370100",
    "level_type": "3" },

  {
    "id": "370200",
    "name": "青岛市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "370202",
    "name": "市南区",
    "parent_id": "370200",
    "level_type": "3" },

  {
    "id": "370203",
    "name": "市北区",
    "parent_id": "370200",
    "level_type": "3" },

  {
    "id": "370211",
    "name": "黄岛区",
    "parent_id": "370200",
    "level_type": "3" },

  {
    "id": "370212",
    "name": "崂山区",
    "parent_id": "370200",
    "level_type": "3" },

  {
    "id": "370213",
    "name": "李沧区",
    "parent_id": "370200",
    "level_type": "3" },

  {
    "id": "370214",
    "name": "城阳区",
    "parent_id": "370200",
    "level_type": "3" },

  {
    "id": "370281",
    "name": "胶州市",
    "parent_id": "370200",
    "level_type": "3" },

  {
    "id": "370282",
    "name": "即墨市",
    "parent_id": "370200",
    "level_type": "3" },

  {
    "id": "370283",
    "name": "平度市",
    "parent_id": "370200",
    "level_type": "3" },

  {
    "id": "370285",
    "name": "莱西市",
    "parent_id": "370200",
    "level_type": "3" },

  {
    "id": "370286",
    "name": "西海岸新区",
    "parent_id": "370200",
    "level_type": "3" },

  {
    "id": "370300",
    "name": "淄博市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "370302",
    "name": "淄川区",
    "parent_id": "370300",
    "level_type": "3" },

  {
    "id": "370303",
    "name": "张店区",
    "parent_id": "370300",
    "level_type": "3" },

  {
    "id": "370304",
    "name": "博山区",
    "parent_id": "370300",
    "level_type": "3" },

  {
    "id": "370305",
    "name": "临淄区",
    "parent_id": "370300",
    "level_type": "3" },

  {
    "id": "370306",
    "name": "周村区",
    "parent_id": "370300",
    "level_type": "3" },

  {
    "id": "370321",
    "name": "桓台县",
    "parent_id": "370300",
    "level_type": "3" },

  {
    "id": "370322",
    "name": "高青县",
    "parent_id": "370300",
    "level_type": "3" },

  {
    "id": "370323",
    "name": "沂源县",
    "parent_id": "370300",
    "level_type": "3" },

  {
    "id": "370400",
    "name": "枣庄市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "370402",
    "name": "市中区",
    "parent_id": "370400",
    "level_type": "3" },

  {
    "id": "370403",
    "name": "薛城区",
    "parent_id": "370400",
    "level_type": "3" },

  {
    "id": "370404",
    "name": "峄城区",
    "parent_id": "370400",
    "level_type": "3" },

  {
    "id": "370405",
    "name": "台儿庄区",
    "parent_id": "370400",
    "level_type": "3" },

  {
    "id": "370406",
    "name": "山亭区",
    "parent_id": "370400",
    "level_type": "3" },

  {
    "id": "370481",
    "name": "滕州市",
    "parent_id": "370400",
    "level_type": "3" },

  {
    "id": "370500",
    "name": "东营市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "370502",
    "name": "东营区",
    "parent_id": "370500",
    "level_type": "3" },

  {
    "id": "370503",
    "name": "河口区",
    "parent_id": "370500",
    "level_type": "3" },

  {
    "id": "370521",
    "name": "垦利县",
    "parent_id": "370500",
    "level_type": "3" },

  {
    "id": "370522",
    "name": "利津县",
    "parent_id": "370500",
    "level_type": "3" },

  {
    "id": "370523",
    "name": "广饶县",
    "parent_id": "370500",
    "level_type": "3" },

  {
    "id": "370600",
    "name": "烟台市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "370602",
    "name": "芝罘区",
    "parent_id": "370600",
    "level_type": "3" },

  {
    "id": "370611",
    "name": "福山区",
    "parent_id": "370600",
    "level_type": "3" },

  {
    "id": "370612",
    "name": "牟平区",
    "parent_id": "370600",
    "level_type": "3" },

  {
    "id": "370613",
    "name": "莱山区",
    "parent_id": "370600",
    "level_type": "3" },

  {
    "id": "370634",
    "name": "长岛县",
    "parent_id": "370600",
    "level_type": "3" },

  {
    "id": "370681",
    "name": "龙口市",
    "parent_id": "370600",
    "level_type": "3" },

  {
    "id": "370682",
    "name": "莱阳市",
    "parent_id": "370600",
    "level_type": "3" },

  {
    "id": "370683",
    "name": "莱州市",
    "parent_id": "370600",
    "level_type": "3" },

  {
    "id": "370684",
    "name": "蓬莱市",
    "parent_id": "370600",
    "level_type": "3" },

  {
    "id": "370685",
    "name": "招远市",
    "parent_id": "370600",
    "level_type": "3" },

  {
    "id": "370686",
    "name": "栖霞市",
    "parent_id": "370600",
    "level_type": "3" },

  {
    "id": "370687",
    "name": "海阳市",
    "parent_id": "370600",
    "level_type": "3" },

  {
    "id": "370700",
    "name": "潍坊市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "370702",
    "name": "潍城区",
    "parent_id": "370700",
    "level_type": "3" },

  {
    "id": "370703",
    "name": "寒亭区",
    "parent_id": "370700",
    "level_type": "3" },

  {
    "id": "370704",
    "name": "坊子区",
    "parent_id": "370700",
    "level_type": "3" },

  {
    "id": "370705",
    "name": "奎文区",
    "parent_id": "370700",
    "level_type": "3" },

  {
    "id": "370724",
    "name": "临朐县",
    "parent_id": "370700",
    "level_type": "3" },

  {
    "id": "370725",
    "name": "昌乐县",
    "parent_id": "370700",
    "level_type": "3" },

  {
    "id": "370781",
    "name": "青州市",
    "parent_id": "370700",
    "level_type": "3" },

  {
    "id": "370782",
    "name": "诸城市",
    "parent_id": "370700",
    "level_type": "3" },

  {
    "id": "370783",
    "name": "寿光市",
    "parent_id": "370700",
    "level_type": "3" },

  {
    "id": "370784",
    "name": "安丘市",
    "parent_id": "370700",
    "level_type": "3" },

  {
    "id": "370785",
    "name": "高密市",
    "parent_id": "370700",
    "level_type": "3" },

  {
    "id": "370786",
    "name": "昌邑市",
    "parent_id": "370700",
    "level_type": "3" },

  {
    "id": "370800",
    "name": "济宁市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "370811",
    "name": "任城区",
    "parent_id": "370800",
    "level_type": "3" },

  {
    "id": "370812",
    "name": "兖州区",
    "parent_id": "370800",
    "level_type": "3" },

  {
    "id": "370826",
    "name": "微山县",
    "parent_id": "370800",
    "level_type": "3" },

  {
    "id": "370827",
    "name": "鱼台县",
    "parent_id": "370800",
    "level_type": "3" },

  {
    "id": "370828",
    "name": "金乡县",
    "parent_id": "370800",
    "level_type": "3" },

  {
    "id": "370829",
    "name": "嘉祥县",
    "parent_id": "370800",
    "level_type": "3" },

  {
    "id": "370830",
    "name": "汶上县",
    "parent_id": "370800",
    "level_type": "3" },

  {
    "id": "370831",
    "name": "泗水县",
    "parent_id": "370800",
    "level_type": "3" },

  {
    "id": "370832",
    "name": "梁山县",
    "parent_id": "370800",
    "level_type": "3" },

  {
    "id": "370881",
    "name": "曲阜市",
    "parent_id": "370800",
    "level_type": "3" },

  {
    "id": "370883",
    "name": "邹城市",
    "parent_id": "370800",
    "level_type": "3" },

  {
    "id": "370900",
    "name": "泰安市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "370902",
    "name": "泰山区",
    "parent_id": "370900",
    "level_type": "3" },

  {
    "id": "370911",
    "name": "岱岳区",
    "parent_id": "370900",
    "level_type": "3" },

  {
    "id": "370921",
    "name": "宁阳县",
    "parent_id": "370900",
    "level_type": "3" },

  {
    "id": "370923",
    "name": "东平县",
    "parent_id": "370900",
    "level_type": "3" },

  {
    "id": "370982",
    "name": "新泰市",
    "parent_id": "370900",
    "level_type": "3" },

  {
    "id": "370983",
    "name": "肥城市",
    "parent_id": "370900",
    "level_type": "3" },

  {
    "id": "371000",
    "name": "威海市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "371002",
    "name": "环翠区",
    "parent_id": "371000",
    "level_type": "3" },

  {
    "id": "371003",
    "name": "文登区",
    "parent_id": "371000",
    "level_type": "3" },

  {
    "id": "371082",
    "name": "荣成市",
    "parent_id": "371000",
    "level_type": "3" },

  {
    "id": "371083",
    "name": "乳山市",
    "parent_id": "371000",
    "level_type": "3" },

  {
    "id": "371100",
    "name": "日照市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "371102",
    "name": "东港区",
    "parent_id": "371100",
    "level_type": "3" },

  {
    "id": "371103",
    "name": "岚山区",
    "parent_id": "371100",
    "level_type": "3" },

  {
    "id": "371121",
    "name": "五莲县",
    "parent_id": "371100",
    "level_type": "3" },

  {
    "id": "371122",
    "name": "莒县",
    "parent_id": "371100",
    "level_type": "3" },

  {
    "id": "371200",
    "name": "莱芜市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "371202",
    "name": "莱城区",
    "parent_id": "371200",
    "level_type": "3" },

  {
    "id": "371203",
    "name": "钢城区",
    "parent_id": "371200",
    "level_type": "3" },

  {
    "id": "371300",
    "name": "临沂市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "371302",
    "name": "兰山区",
    "parent_id": "371300",
    "level_type": "3" },

  {
    "id": "371311",
    "name": "罗庄区",
    "parent_id": "371300",
    "level_type": "3" },

  {
    "id": "371312",
    "name": "河东区",
    "parent_id": "371300",
    "level_type": "3" },

  {
    "id": "371321",
    "name": "沂南县",
    "parent_id": "371300",
    "level_type": "3" },

  {
    "id": "371322",
    "name": "郯城县",
    "parent_id": "371300",
    "level_type": "3" },

  {
    "id": "371323",
    "name": "沂水县",
    "parent_id": "371300",
    "level_type": "3" },

  {
    "id": "371324",
    "name": "兰陵县",
    "parent_id": "371300",
    "level_type": "3" },

  {
    "id": "371325",
    "name": "费县",
    "parent_id": "371300",
    "level_type": "3" },

  {
    "id": "371326",
    "name": "平邑县",
    "parent_id": "371300",
    "level_type": "3" },

  {
    "id": "371327",
    "name": "莒南县",
    "parent_id": "371300",
    "level_type": "3" },

  {
    "id": "371328",
    "name": "蒙阴县",
    "parent_id": "371300",
    "level_type": "3" },

  {
    "id": "371329",
    "name": "临沭县",
    "parent_id": "371300",
    "level_type": "3" },

  {
    "id": "371400",
    "name": "德州市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "371402",
    "name": "德城区",
    "parent_id": "371400",
    "level_type": "3" },

  {
    "id": "371403",
    "name": "陵城区",
    "parent_id": "371400",
    "level_type": "3" },

  {
    "id": "371422",
    "name": "宁津县",
    "parent_id": "371400",
    "level_type": "3" },

  {
    "id": "371423",
    "name": "庆云县",
    "parent_id": "371400",
    "level_type": "3" },

  {
    "id": "371424",
    "name": "临邑县",
    "parent_id": "371400",
    "level_type": "3" },

  {
    "id": "371425",
    "name": "齐河县",
    "parent_id": "371400",
    "level_type": "3" },

  {
    "id": "371426",
    "name": "平原县",
    "parent_id": "371400",
    "level_type": "3" },

  {
    "id": "371427",
    "name": "夏津县",
    "parent_id": "371400",
    "level_type": "3" },

  {
    "id": "371428",
    "name": "武城县",
    "parent_id": "371400",
    "level_type": "3" },

  {
    "id": "371481",
    "name": "乐陵市",
    "parent_id": "371400",
    "level_type": "3" },

  {
    "id": "371482",
    "name": "禹城市",
    "parent_id": "371400",
    "level_type": "3" },

  {
    "id": "371500",
    "name": "聊城市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "371502",
    "name": "东昌府区",
    "parent_id": "371500",
    "level_type": "3" },

  {
    "id": "371521",
    "name": "阳谷县",
    "parent_id": "371500",
    "level_type": "3" },

  {
    "id": "371522",
    "name": "莘县",
    "parent_id": "371500",
    "level_type": "3" },

  {
    "id": "371523",
    "name": "茌平县",
    "parent_id": "371500",
    "level_type": "3" },

  {
    "id": "371524",
    "name": "东阿县",
    "parent_id": "371500",
    "level_type": "3" },

  {
    "id": "371525",
    "name": "冠县",
    "parent_id": "371500",
    "level_type": "3" },

  {
    "id": "371526",
    "name": "高唐县",
    "parent_id": "371500",
    "level_type": "3" },

  {
    "id": "371581",
    "name": "临清市",
    "parent_id": "371500",
    "level_type": "3" },

  {
    "id": "371600",
    "name": "滨州市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "371602",
    "name": "滨城区",
    "parent_id": "371600",
    "level_type": "3" },

  {
    "id": "371603",
    "name": "沾化区",
    "parent_id": "371600",
    "level_type": "3" },

  {
    "id": "371621",
    "name": "惠民县",
    "parent_id": "371600",
    "level_type": "3" },

  {
    "id": "371622",
    "name": "阳信县",
    "parent_id": "371600",
    "level_type": "3" },

  {
    "id": "371623",
    "name": "无棣县",
    "parent_id": "371600",
    "level_type": "3" },

  {
    "id": "371625",
    "name": "博兴县",
    "parent_id": "371600",
    "level_type": "3" },

  {
    "id": "371626",
    "name": "邹平县",
    "parent_id": "371600",
    "level_type": "3" },

  {
    "id": "371627",
    "name": "北海新区",
    "parent_id": "371600",
    "level_type": "3" },

  {
    "id": "371700",
    "name": "菏泽市",
    "parent_id": "370000",
    "level_type": "2" },

  {
    "id": "371702",
    "name": "牡丹区",
    "parent_id": "371700",
    "level_type": "3" },

  {
    "id": "371721",
    "name": "曹县",
    "parent_id": "371700",
    "level_type": "3" },

  {
    "id": "371722",
    "name": "单县",
    "parent_id": "371700",
    "level_type": "3" },

  {
    "id": "371723",
    "name": "成武县",
    "parent_id": "371700",
    "level_type": "3" },

  {
    "id": "371724",
    "name": "巨野县",
    "parent_id": "371700",
    "level_type": "3" },

  {
    "id": "371725",
    "name": "郓城县",
    "parent_id": "371700",
    "level_type": "3" },

  {
    "id": "371726",
    "name": "鄄城县",
    "parent_id": "371700",
    "level_type": "3" },

  {
    "id": "371727",
    "name": "定陶县",
    "parent_id": "371700",
    "level_type": "3" },

  {
    "id": "371728",
    "name": "东明县",
    "parent_id": "371700",
    "level_type": "3" },

  {
    "id": "410000",
    "name": "河南省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "410100",
    "name": "郑州市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "410102",
    "name": "中原区",
    "parent_id": "410100",
    "level_type": "3" },

  {
    "id": "410103",
    "name": "二七区",
    "parent_id": "410100",
    "level_type": "3" },

  {
    "id": "410104",
    "name": "管城回族区",
    "parent_id": "410100",
    "level_type": "3" },

  {
    "id": "410105",
    "name": "金水区",
    "parent_id": "410100",
    "level_type": "3" },

  {
    "id": "410106",
    "name": "上街区",
    "parent_id": "410100",
    "level_type": "3" },

  {
    "id": "410108",
    "name": "惠济区",
    "parent_id": "410100",
    "level_type": "3" },

  {
    "id": "410122",
    "name": "中牟县",
    "parent_id": "410100",
    "level_type": "3" },

  {
    "id": "410181",
    "name": "巩义市",
    "parent_id": "410100",
    "level_type": "3" },

  {
    "id": "410182",
    "name": "荥阳市",
    "parent_id": "410100",
    "level_type": "3" },

  {
    "id": "410183",
    "name": "新密市",
    "parent_id": "410100",
    "level_type": "3" },

  {
    "id": "410184",
    "name": "新郑市",
    "parent_id": "410100",
    "level_type": "3" },

  {
    "id": "410185",
    "name": "登封市",
    "parent_id": "410100",
    "level_type": "3" },

  {
    "id": "410200",
    "name": "开封市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "410202",
    "name": "龙亭区",
    "parent_id": "410200",
    "level_type": "3" },

  {
    "id": "410203",
    "name": "顺河回族区",
    "parent_id": "410200",
    "level_type": "3" },

  {
    "id": "410204",
    "name": "鼓楼区",
    "parent_id": "410200",
    "level_type": "3" },

  {
    "id": "410205",
    "name": "禹王台区",
    "parent_id": "410200",
    "level_type": "3" },

  {
    "id": "410212",
    "name": "祥符区",
    "parent_id": "410200",
    "level_type": "3" },

  {
    "id": "410221",
    "name": "杞县",
    "parent_id": "410200",
    "level_type": "3" },

  {
    "id": "410222",
    "name": "通许县",
    "parent_id": "410200",
    "level_type": "3" },

  {
    "id": "410223",
    "name": "尉氏县",
    "parent_id": "410200",
    "level_type": "3" },

  {
    "id": "410225",
    "name": "兰考县",
    "parent_id": "410200",
    "level_type": "3" },

  {
    "id": "410300",
    "name": "洛阳市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "410302",
    "name": "老城区",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410303",
    "name": "西工区",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410304",
    "name": "瀍河回族区",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410305",
    "name": "涧西区",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410306",
    "name": "吉利区",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410311",
    "name": "洛龙区",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410322",
    "name": "孟津县",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410323",
    "name": "新安县",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410324",
    "name": "栾川县",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410325",
    "name": "嵩县",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410326",
    "name": "汝阳县",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410327",
    "name": "宜阳县",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410328",
    "name": "洛宁县",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410329",
    "name": "伊川县",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410381",
    "name": "偃师市",
    "parent_id": "410300",
    "level_type": "3" },

  {
    "id": "410400",
    "name": "平顶山市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "410402",
    "name": "新华区",
    "parent_id": "410400",
    "level_type": "3" },

  {
    "id": "410403",
    "name": "卫东区",
    "parent_id": "410400",
    "level_type": "3" },

  {
    "id": "410404",
    "name": "石龙区",
    "parent_id": "410400",
    "level_type": "3" },

  {
    "id": "410411",
    "name": "湛河区",
    "parent_id": "410400",
    "level_type": "3" },

  {
    "id": "410421",
    "name": "宝丰县",
    "parent_id": "410400",
    "level_type": "3" },

  {
    "id": "410422",
    "name": "叶县",
    "parent_id": "410400",
    "level_type": "3" },

  {
    "id": "410423",
    "name": "鲁山县",
    "parent_id": "410400",
    "level_type": "3" },

  {
    "id": "410425",
    "name": "郏县",
    "parent_id": "410400",
    "level_type": "3" },

  {
    "id": "410481",
    "name": "舞钢市",
    "parent_id": "410400",
    "level_type": "3" },

  {
    "id": "410482",
    "name": "汝州市",
    "parent_id": "410400",
    "level_type": "3" },

  {
    "id": "410500",
    "name": "安阳市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "410502",
    "name": "文峰区",
    "parent_id": "410500",
    "level_type": "3" },

  {
    "id": "410503",
    "name": "北关区",
    "parent_id": "410500",
    "level_type": "3" },

  {
    "id": "410505",
    "name": "殷都区",
    "parent_id": "410500",
    "level_type": "3" },

  {
    "id": "410506",
    "name": "龙安区",
    "parent_id": "410500",
    "level_type": "3" },

  {
    "id": "410522",
    "name": "安阳县",
    "parent_id": "410500",
    "level_type": "3" },

  {
    "id": "410523",
    "name": "汤阴县",
    "parent_id": "410500",
    "level_type": "3" },

  {
    "id": "410526",
    "name": "滑县",
    "parent_id": "410500",
    "level_type": "3" },

  {
    "id": "410527",
    "name": "内黄县",
    "parent_id": "410500",
    "level_type": "3" },

  {
    "id": "410581",
    "name": "林州市",
    "parent_id": "410500",
    "level_type": "3" },

  {
    "id": "410600",
    "name": "鹤壁市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "410602",
    "name": "鹤山区",
    "parent_id": "410600",
    "level_type": "3" },

  {
    "id": "410603",
    "name": "山城区",
    "parent_id": "410600",
    "level_type": "3" },

  {
    "id": "410611",
    "name": "淇滨区",
    "parent_id": "410600",
    "level_type": "3" },

  {
    "id": "410621",
    "name": "浚县",
    "parent_id": "410600",
    "level_type": "3" },

  {
    "id": "410622",
    "name": "淇县",
    "parent_id": "410600",
    "level_type": "3" },

  {
    "id": "410700",
    "name": "新乡市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "410702",
    "name": "红旗区",
    "parent_id": "410700",
    "level_type": "3" },

  {
    "id": "410703",
    "name": "卫滨区",
    "parent_id": "410700",
    "level_type": "3" },

  {
    "id": "410704",
    "name": "凤泉区",
    "parent_id": "410700",
    "level_type": "3" },

  {
    "id": "410711",
    "name": "牧野区",
    "parent_id": "410700",
    "level_type": "3" },

  {
    "id": "410721",
    "name": "新乡县",
    "parent_id": "410700",
    "level_type": "3" },

  {
    "id": "410724",
    "name": "获嘉县",
    "parent_id": "410700",
    "level_type": "3" },

  {
    "id": "410725",
    "name": "原阳县",
    "parent_id": "410700",
    "level_type": "3" },

  {
    "id": "410726",
    "name": "延津县",
    "parent_id": "410700",
    "level_type": "3" },

  {
    "id": "410727",
    "name": "封丘县",
    "parent_id": "410700",
    "level_type": "3" },

  {
    "id": "410728",
    "name": "长垣县",
    "parent_id": "410700",
    "level_type": "3" },

  {
    "id": "410781",
    "name": "卫辉市",
    "parent_id": "410700",
    "level_type": "3" },

  {
    "id": "410782",
    "name": "辉县市",
    "parent_id": "410700",
    "level_type": "3" },

  {
    "id": "410800",
    "name": "焦作市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "410802",
    "name": "解放区",
    "parent_id": "410800",
    "level_type": "3" },

  {
    "id": "410803",
    "name": "中站区",
    "parent_id": "410800",
    "level_type": "3" },

  {
    "id": "410804",
    "name": "马村区",
    "parent_id": "410800",
    "level_type": "3" },

  {
    "id": "410811",
    "name": "山阳区",
    "parent_id": "410800",
    "level_type": "3" },

  {
    "id": "410821",
    "name": "修武县",
    "parent_id": "410800",
    "level_type": "3" },

  {
    "id": "410822",
    "name": "博爱县",
    "parent_id": "410800",
    "level_type": "3" },

  {
    "id": "410823",
    "name": "武陟县",
    "parent_id": "410800",
    "level_type": "3" },

  {
    "id": "410825",
    "name": "温县",
    "parent_id": "410800",
    "level_type": "3" },

  {
    "id": "410882",
    "name": "沁阳市",
    "parent_id": "410800",
    "level_type": "3" },

  {
    "id": "410883",
    "name": "孟州市",
    "parent_id": "410800",
    "level_type": "3" },

  {
    "id": "410900",
    "name": "濮阳市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "410902",
    "name": "华龙区",
    "parent_id": "410900",
    "level_type": "3" },

  {
    "id": "410922",
    "name": "清丰县",
    "parent_id": "410900",
    "level_type": "3" },

  {
    "id": "410923",
    "name": "南乐县",
    "parent_id": "410900",
    "level_type": "3" },

  {
    "id": "410926",
    "name": "范县",
    "parent_id": "410900",
    "level_type": "3" },

  {
    "id": "410927",
    "name": "台前县",
    "parent_id": "410900",
    "level_type": "3" },

  {
    "id": "410928",
    "name": "濮阳县",
    "parent_id": "410900",
    "level_type": "3" },

  {
    "id": "411000",
    "name": "许昌市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "411002",
    "name": "魏都区",
    "parent_id": "411000",
    "level_type": "3" },

  {
    "id": "411023",
    "name": "许昌县",
    "parent_id": "411000",
    "level_type": "3" },

  {
    "id": "411024",
    "name": "鄢陵县",
    "parent_id": "411000",
    "level_type": "3" },

  {
    "id": "411025",
    "name": "襄城县",
    "parent_id": "411000",
    "level_type": "3" },

  {
    "id": "411081",
    "name": "禹州市",
    "parent_id": "411000",
    "level_type": "3" },

  {
    "id": "411082",
    "name": "长葛市",
    "parent_id": "411000",
    "level_type": "3" },

  {
    "id": "411100",
    "name": "漯河市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "411102",
    "name": "源汇区",
    "parent_id": "411100",
    "level_type": "3" },

  {
    "id": "411103",
    "name": "郾城区",
    "parent_id": "411100",
    "level_type": "3" },

  {
    "id": "411104",
    "name": "召陵区",
    "parent_id": "411100",
    "level_type": "3" },

  {
    "id": "411121",
    "name": "舞阳县",
    "parent_id": "411100",
    "level_type": "3" },

  {
    "id": "411122",
    "name": "临颍县",
    "parent_id": "411100",
    "level_type": "3" },

  {
    "id": "411200",
    "name": "三门峡市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "411202",
    "name": "湖滨区",
    "parent_id": "411200",
    "level_type": "3" },

  {
    "id": "411221",
    "name": "渑池县",
    "parent_id": "411200",
    "level_type": "3" },

  {
    "id": "411222",
    "name": "陕县",
    "parent_id": "411200",
    "level_type": "3" },

  {
    "id": "411224",
    "name": "卢氏县",
    "parent_id": "411200",
    "level_type": "3" },

  {
    "id": "411281",
    "name": "义马市",
    "parent_id": "411200",
    "level_type": "3" },

  {
    "id": "411282",
    "name": "灵宝市",
    "parent_id": "411200",
    "level_type": "3" },

  {
    "id": "411300",
    "name": "南阳市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "411302",
    "name": "宛城区",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411303",
    "name": "卧龙区",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411321",
    "name": "南召县",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411322",
    "name": "方城县",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411323",
    "name": "西峡县",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411324",
    "name": "镇平县",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411325",
    "name": "内乡县",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411326",
    "name": "淅川县",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411327",
    "name": "社旗县",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411328",
    "name": "唐河县",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411329",
    "name": "新野县",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411330",
    "name": "桐柏县",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411381",
    "name": "邓州市",
    "parent_id": "411300",
    "level_type": "3" },

  {
    "id": "411400",
    "name": "商丘市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "411402",
    "name": "梁园区",
    "parent_id": "411400",
    "level_type": "3" },

  {
    "id": "411403",
    "name": "睢阳区",
    "parent_id": "411400",
    "level_type": "3" },

  {
    "id": "411421",
    "name": "民权县",
    "parent_id": "411400",
    "level_type": "3" },

  {
    "id": "411422",
    "name": "睢县",
    "parent_id": "411400",
    "level_type": "3" },

  {
    "id": "411423",
    "name": "宁陵县",
    "parent_id": "411400",
    "level_type": "3" },

  {
    "id": "411424",
    "name": "柘城县",
    "parent_id": "411400",
    "level_type": "3" },

  {
    "id": "411425",
    "name": "虞城县",
    "parent_id": "411400",
    "level_type": "3" },

  {
    "id": "411426",
    "name": "夏邑县",
    "parent_id": "411400",
    "level_type": "3" },

  {
    "id": "411481",
    "name": "永城市",
    "parent_id": "411400",
    "level_type": "3" },

  {
    "id": "411500",
    "name": "信阳市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "411502",
    "name": "浉河区",
    "parent_id": "411500",
    "level_type": "3" },

  {
    "id": "411503",
    "name": "平桥区",
    "parent_id": "411500",
    "level_type": "3" },

  {
    "id": "411521",
    "name": "罗山县",
    "parent_id": "411500",
    "level_type": "3" },

  {
    "id": "411522",
    "name": "光山县",
    "parent_id": "411500",
    "level_type": "3" },

  {
    "id": "411523",
    "name": "新县",
    "parent_id": "411500",
    "level_type": "3" },

  {
    "id": "411524",
    "name": "商城县",
    "parent_id": "411500",
    "level_type": "3" },

  {
    "id": "411525",
    "name": "固始县",
    "parent_id": "411500",
    "level_type": "3" },

  {
    "id": "411526",
    "name": "潢川县",
    "parent_id": "411500",
    "level_type": "3" },

  {
    "id": "411527",
    "name": "淮滨县",
    "parent_id": "411500",
    "level_type": "3" },

  {
    "id": "411528",
    "name": "息县",
    "parent_id": "411500",
    "level_type": "3" },

  {
    "id": "411600",
    "name": "周口市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "411602",
    "name": "川汇区",
    "parent_id": "411600",
    "level_type": "3" },

  {
    "id": "411621",
    "name": "扶沟县",
    "parent_id": "411600",
    "level_type": "3" },

  {
    "id": "411622",
    "name": "西华县",
    "parent_id": "411600",
    "level_type": "3" },

  {
    "id": "411623",
    "name": "商水县",
    "parent_id": "411600",
    "level_type": "3" },

  {
    "id": "411624",
    "name": "沈丘县",
    "parent_id": "411600",
    "level_type": "3" },

  {
    "id": "411625",
    "name": "郸城县",
    "parent_id": "411600",
    "level_type": "3" },

  {
    "id": "411626",
    "name": "淮阳县",
    "parent_id": "411600",
    "level_type": "3" },

  {
    "id": "411627",
    "name": "太康县",
    "parent_id": "411600",
    "level_type": "3" },

  {
    "id": "411628",
    "name": "鹿邑县",
    "parent_id": "411600",
    "level_type": "3" },

  {
    "id": "411681",
    "name": "项城市",
    "parent_id": "411600",
    "level_type": "3" },

  {
    "id": "411700",
    "name": "驻马店市",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "411702",
    "name": "驿城区",
    "parent_id": "411700",
    "level_type": "3" },

  {
    "id": "411721",
    "name": "西平县",
    "parent_id": "411700",
    "level_type": "3" },

  {
    "id": "411722",
    "name": "上蔡县",
    "parent_id": "411700",
    "level_type": "3" },

  {
    "id": "411723",
    "name": "平舆县",
    "parent_id": "411700",
    "level_type": "3" },

  {
    "id": "411724",
    "name": "正阳县",
    "parent_id": "411700",
    "level_type": "3" },

  {
    "id": "411725",
    "name": "确山县",
    "parent_id": "411700",
    "level_type": "3" },

  {
    "id": "411726",
    "name": "泌阳县",
    "parent_id": "411700",
    "level_type": "3" },

  {
    "id": "411727",
    "name": "汝南县",
    "parent_id": "411700",
    "level_type": "3" },

  {
    "id": "411728",
    "name": "遂平县",
    "parent_id": "411700",
    "level_type": "3" },

  {
    "id": "411729",
    "name": "新蔡县",
    "parent_id": "411700",
    "level_type": "3" },

  {
    "id": "419000",
    "name": "直辖县级",
    "parent_id": "410000",
    "level_type": "2" },

  {
    "id": "419001",
    "name": "济源市",
    "parent_id": "419000",
    "level_type": "3" },

  {
    "id": "420000",
    "name": "湖北省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "420100",
    "name": "武汉市",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "420102",
    "name": "江岸区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420103",
    "name": "江汉区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420104",
    "name": "硚口区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420105",
    "name": "汉阳区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420106",
    "name": "武昌区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420107",
    "name": "青山区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420111",
    "name": "洪山区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420112",
    "name": "东西湖区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420113",
    "name": "汉南区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420114",
    "name": "蔡甸区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420115",
    "name": "江夏区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420116",
    "name": "黄陂区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420117",
    "name": "新洲区",
    "parent_id": "420100",
    "level_type": "3" },

  {
    "id": "420200",
    "name": "黄石市",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "420202",
    "name": "黄石港区",
    "parent_id": "420200",
    "level_type": "3" },

  {
    "id": "420203",
    "name": "西塞山区",
    "parent_id": "420200",
    "level_type": "3" },

  {
    "id": "420204",
    "name": "下陆区",
    "parent_id": "420200",
    "level_type": "3" },

  {
    "id": "420205",
    "name": "铁山区",
    "parent_id": "420200",
    "level_type": "3" },

  {
    "id": "420222",
    "name": "阳新县",
    "parent_id": "420200",
    "level_type": "3" },

  {
    "id": "420281",
    "name": "大冶市",
    "parent_id": "420200",
    "level_type": "3" },

  {
    "id": "420300",
    "name": "十堰市",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "420302",
    "name": "茅箭区",
    "parent_id": "420300",
    "level_type": "3" },

  {
    "id": "420303",
    "name": "张湾区",
    "parent_id": "420300",
    "level_type": "3" },

  {
    "id": "420304",
    "name": "郧阳区",
    "parent_id": "420300",
    "level_type": "3" },

  {
    "id": "420322",
    "name": "郧西县",
    "parent_id": "420300",
    "level_type": "3" },

  {
    "id": "420323",
    "name": "竹山县",
    "parent_id": "420300",
    "level_type": "3" },

  {
    "id": "420324",
    "name": "竹溪县",
    "parent_id": "420300",
    "level_type": "3" },

  {
    "id": "420325",
    "name": "房县",
    "parent_id": "420300",
    "level_type": "3" },

  {
    "id": "420381",
    "name": "丹江口市",
    "parent_id": "420300",
    "level_type": "3" },

  {
    "id": "420500",
    "name": "宜昌市",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "420502",
    "name": "西陵区",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420503",
    "name": "伍家岗区",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420504",
    "name": "点军区",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420505",
    "name": "猇亭区",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420506",
    "name": "夷陵区",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420525",
    "name": "远安县",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420526",
    "name": "兴山县",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420527",
    "name": "秭归县",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420528",
    "name": "长阳土家族自治县",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420529",
    "name": "五峰土家族自治县",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420581",
    "name": "宜都市",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420582",
    "name": "当阳市",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420583",
    "name": "枝江市",
    "parent_id": "420500",
    "level_type": "3" },

  {
    "id": "420600",
    "name": "襄阳市",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "420602",
    "name": "襄城区",
    "parent_id": "420600",
    "level_type": "3" },

  {
    "id": "420606",
    "name": "樊城区",
    "parent_id": "420600",
    "level_type": "3" },

  {
    "id": "420607",
    "name": "襄州区",
    "parent_id": "420600",
    "level_type": "3" },

  {
    "id": "420624",
    "name": "南漳县",
    "parent_id": "420600",
    "level_type": "3" },

  {
    "id": "420625",
    "name": "谷城县",
    "parent_id": "420600",
    "level_type": "3" },

  {
    "id": "420626",
    "name": "保康县",
    "parent_id": "420600",
    "level_type": "3" },

  {
    "id": "420682",
    "name": "老河口市",
    "parent_id": "420600",
    "level_type": "3" },

  {
    "id": "420683",
    "name": "枣阳市",
    "parent_id": "420600",
    "level_type": "3" },

  {
    "id": "420684",
    "name": "宜城市",
    "parent_id": "420600",
    "level_type": "3" },

  {
    "id": "420700",
    "name": "鄂州市",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "420702",
    "name": "梁子湖区",
    "parent_id": "420700",
    "level_type": "3" },

  {
    "id": "420703",
    "name": "华容区",
    "parent_id": "420700",
    "level_type": "3" },

  {
    "id": "420704",
    "name": "鄂城区",
    "parent_id": "420700",
    "level_type": "3" },

  {
    "id": "420800",
    "name": "荆门市",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "420802",
    "name": "东宝区",
    "parent_id": "420800",
    "level_type": "3" },

  {
    "id": "420804",
    "name": "掇刀区",
    "parent_id": "420800",
    "level_type": "3" },

  {
    "id": "420821",
    "name": "京山县",
    "parent_id": "420800",
    "level_type": "3" },

  {
    "id": "420822",
    "name": "沙洋县",
    "parent_id": "420800",
    "level_type": "3" },

  {
    "id": "420881",
    "name": "钟祥市",
    "parent_id": "420800",
    "level_type": "3" },

  {
    "id": "420900",
    "name": "孝感市",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "420902",
    "name": "孝南区",
    "parent_id": "420900",
    "level_type": "3" },

  {
    "id": "420921",
    "name": "孝昌县",
    "parent_id": "420900",
    "level_type": "3" },

  {
    "id": "420922",
    "name": "大悟县",
    "parent_id": "420900",
    "level_type": "3" },

  {
    "id": "420923",
    "name": "云梦县",
    "parent_id": "420900",
    "level_type": "3" },

  {
    "id": "420981",
    "name": "应城市",
    "parent_id": "420900",
    "level_type": "3" },

  {
    "id": "420982",
    "name": "安陆市",
    "parent_id": "420900",
    "level_type": "3" },

  {
    "id": "420984",
    "name": "汉川市",
    "parent_id": "420900",
    "level_type": "3" },

  {
    "id": "421000",
    "name": "荆州市",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "421002",
    "name": "沙市区",
    "parent_id": "421000",
    "level_type": "3" },

  {
    "id": "421003",
    "name": "荆州区",
    "parent_id": "421000",
    "level_type": "3" },

  {
    "id": "421022",
    "name": "公安县",
    "parent_id": "421000",
    "level_type": "3" },

  {
    "id": "421023",
    "name": "监利县",
    "parent_id": "421000",
    "level_type": "3" },

  {
    "id": "421024",
    "name": "江陵县",
    "parent_id": "421000",
    "level_type": "3" },

  {
    "id": "421081",
    "name": "石首市",
    "parent_id": "421000",
    "level_type": "3" },

  {
    "id": "421083",
    "name": "洪湖市",
    "parent_id": "421000",
    "level_type": "3" },

  {
    "id": "421087",
    "name": "松滋市",
    "parent_id": "421000",
    "level_type": "3" },

  {
    "id": "421100",
    "name": "黄冈市",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "421102",
    "name": "黄州区",
    "parent_id": "421100",
    "level_type": "3" },

  {
    "id": "421121",
    "name": "团风县",
    "parent_id": "421100",
    "level_type": "3" },

  {
    "id": "421122",
    "name": "红安县",
    "parent_id": "421100",
    "level_type": "3" },

  {
    "id": "421123",
    "name": "罗田县",
    "parent_id": "421100",
    "level_type": "3" },

  {
    "id": "421124",
    "name": "英山县",
    "parent_id": "421100",
    "level_type": "3" },

  {
    "id": "421125",
    "name": "浠水县",
    "parent_id": "421100",
    "level_type": "3" },

  {
    "id": "421126",
    "name": "蕲春县",
    "parent_id": "421100",
    "level_type": "3" },

  {
    "id": "421127",
    "name": "黄梅县",
    "parent_id": "421100",
    "level_type": "3" },

  {
    "id": "421181",
    "name": "麻城市",
    "parent_id": "421100",
    "level_type": "3" },

  {
    "id": "421182",
    "name": "武穴市",
    "parent_id": "421100",
    "level_type": "3" },

  {
    "id": "421200",
    "name": "咸宁市",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "421202",
    "name": "咸安区",
    "parent_id": "421200",
    "level_type": "3" },

  {
    "id": "421221",
    "name": "嘉鱼县",
    "parent_id": "421200",
    "level_type": "3" },

  {
    "id": "421222",
    "name": "通城县",
    "parent_id": "421200",
    "level_type": "3" },

  {
    "id": "421223",
    "name": "崇阳县",
    "parent_id": "421200",
    "level_type": "3" },

  {
    "id": "421224",
    "name": "通山县",
    "parent_id": "421200",
    "level_type": "3" },

  {
    "id": "421281",
    "name": "赤壁市",
    "parent_id": "421200",
    "level_type": "3" },

  {
    "id": "421300",
    "name": "随州市",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "421303",
    "name": "曾都区",
    "parent_id": "421300",
    "level_type": "3" },

  {
    "id": "421321",
    "name": "随县",
    "parent_id": "421300",
    "level_type": "3" },

  {
    "id": "421381",
    "name": "广水市",
    "parent_id": "421300",
    "level_type": "3" },

  {
    "id": "422800",
    "name": "恩施土家族苗族自治州",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "422801",
    "name": "恩施市",
    "parent_id": "422800",
    "level_type": "3" },

  {
    "id": "422802",
    "name": "利川市",
    "parent_id": "422800",
    "level_type": "3" },

  {
    "id": "422822",
    "name": "建始县",
    "parent_id": "422800",
    "level_type": "3" },

  {
    "id": "422823",
    "name": "巴东县",
    "parent_id": "422800",
    "level_type": "3" },

  {
    "id": "422825",
    "name": "宣恩县",
    "parent_id": "422800",
    "level_type": "3" },

  {
    "id": "422826",
    "name": "咸丰县",
    "parent_id": "422800",
    "level_type": "3" },

  {
    "id": "422827",
    "name": "来凤县",
    "parent_id": "422800",
    "level_type": "3" },

  {
    "id": "422828",
    "name": "鹤峰县",
    "parent_id": "422800",
    "level_type": "3" },

  {
    "id": "429000",
    "name": "直辖县级",
    "parent_id": "420000",
    "level_type": "2" },

  {
    "id": "429004",
    "name": "仙桃市",
    "parent_id": "429000",
    "level_type": "3" },

  {
    "id": "429005",
    "name": "潜江市",
    "parent_id": "429000",
    "level_type": "3" },

  {
    "id": "429006",
    "name": "天门市",
    "parent_id": "429000",
    "level_type": "3" },

  {
    "id": "429021",
    "name": "神农架林区",
    "parent_id": "429000",
    "level_type": "3" },

  {
    "id": "430000",
    "name": "湖南省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "430100",
    "name": "长沙市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "430102",
    "name": "芙蓉区",
    "parent_id": "430100",
    "level_type": "3" },

  {
    "id": "430103",
    "name": "天心区",
    "parent_id": "430100",
    "level_type": "3" },

  {
    "id": "430104",
    "name": "岳麓区",
    "parent_id": "430100",
    "level_type": "3" },

  {
    "id": "430105",
    "name": "开福区",
    "parent_id": "430100",
    "level_type": "3" },

  {
    "id": "430111",
    "name": "雨花区",
    "parent_id": "430100",
    "level_type": "3" },

  {
    "id": "430112",
    "name": "望城区",
    "parent_id": "430100",
    "level_type": "3" },

  {
    "id": "430121",
    "name": "长沙县",
    "parent_id": "430100",
    "level_type": "3" },

  {
    "id": "430124",
    "name": "宁乡县",
    "parent_id": "430100",
    "level_type": "3" },

  {
    "id": "430181",
    "name": "浏阳市",
    "parent_id": "430100",
    "level_type": "3" },

  {
    "id": "430200",
    "name": "株洲市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "430202",
    "name": "荷塘区",
    "parent_id": "430200",
    "level_type": "3" },

  {
    "id": "430203",
    "name": "芦淞区",
    "parent_id": "430200",
    "level_type": "3" },

  {
    "id": "430204",
    "name": "石峰区",
    "parent_id": "430200",
    "level_type": "3" },

  {
    "id": "430211",
    "name": "天元区",
    "parent_id": "430200",
    "level_type": "3" },

  {
    "id": "430221",
    "name": "株洲县",
    "parent_id": "430200",
    "level_type": "3" },

  {
    "id": "430223",
    "name": "攸县",
    "parent_id": "430200",
    "level_type": "3" },

  {
    "id": "430224",
    "name": "茶陵县",
    "parent_id": "430200",
    "level_type": "3" },

  {
    "id": "430225",
    "name": "炎陵县",
    "parent_id": "430200",
    "level_type": "3" },

  {
    "id": "430281",
    "name": "醴陵市",
    "parent_id": "430200",
    "level_type": "3" },

  {
    "id": "430300",
    "name": "湘潭市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "430302",
    "name": "雨湖区",
    "parent_id": "430300",
    "level_type": "3" },

  {
    "id": "430304",
    "name": "岳塘区",
    "parent_id": "430300",
    "level_type": "3" },

  {
    "id": "430321",
    "name": "湘潭县",
    "parent_id": "430300",
    "level_type": "3" },

  {
    "id": "430381",
    "name": "湘乡市",
    "parent_id": "430300",
    "level_type": "3" },

  {
    "id": "430382",
    "name": "韶山市",
    "parent_id": "430300",
    "level_type": "3" },

  {
    "id": "430400",
    "name": "衡阳市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "430405",
    "name": "珠晖区",
    "parent_id": "430400",
    "level_type": "3" },

  {
    "id": "430406",
    "name": "雁峰区",
    "parent_id": "430400",
    "level_type": "3" },

  {
    "id": "430407",
    "name": "石鼓区",
    "parent_id": "430400",
    "level_type": "3" },

  {
    "id": "430408",
    "name": "蒸湘区",
    "parent_id": "430400",
    "level_type": "3" },

  {
    "id": "430412",
    "name": "南岳区",
    "parent_id": "430400",
    "level_type": "3" },

  {
    "id": "430421",
    "name": "衡阳县",
    "parent_id": "430400",
    "level_type": "3" },

  {
    "id": "430422",
    "name": "衡南县",
    "parent_id": "430400",
    "level_type": "3" },

  {
    "id": "430423",
    "name": "衡山县",
    "parent_id": "430400",
    "level_type": "3" },

  {
    "id": "430424",
    "name": "衡东县",
    "parent_id": "430400",
    "level_type": "3" },

  {
    "id": "430426",
    "name": "祁东县",
    "parent_id": "430400",
    "level_type": "3" },

  {
    "id": "430481",
    "name": "耒阳市",
    "parent_id": "430400",
    "level_type": "3" },

  {
    "id": "430482",
    "name": "常宁市",
    "parent_id": "430400",
    "level_type": "3" },

  {
    "id": "430500",
    "name": "邵阳市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "430502",
    "name": "双清区",
    "parent_id": "430500",
    "level_type": "3" },

  {
    "id": "430503",
    "name": "大祥区",
    "parent_id": "430500",
    "level_type": "3" },

  {
    "id": "430511",
    "name": "北塔区",
    "parent_id": "430500",
    "level_type": "3" },

  {
    "id": "430521",
    "name": "邵东县",
    "parent_id": "430500",
    "level_type": "3" },

  {
    "id": "430522",
    "name": "新邵县",
    "parent_id": "430500",
    "level_type": "3" },

  {
    "id": "430523",
    "name": "邵阳县",
    "parent_id": "430500",
    "level_type": "3" },

  {
    "id": "430524",
    "name": "隆回县",
    "parent_id": "430500",
    "level_type": "3" },

  {
    "id": "430525",
    "name": "洞口县",
    "parent_id": "430500",
    "level_type": "3" },

  {
    "id": "430527",
    "name": "绥宁县",
    "parent_id": "430500",
    "level_type": "3" },

  {
    "id": "430528",
    "name": "新宁县",
    "parent_id": "430500",
    "level_type": "3" },

  {
    "id": "430529",
    "name": "城步苗族自治县",
    "parent_id": "430500",
    "level_type": "3" },

  {
    "id": "430581",
    "name": "武冈市",
    "parent_id": "430500",
    "level_type": "3" },

  {
    "id": "430600",
    "name": "岳阳市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "430602",
    "name": "岳阳楼区",
    "parent_id": "430600",
    "level_type": "3" },

  {
    "id": "430603",
    "name": "云溪区",
    "parent_id": "430600",
    "level_type": "3" },

  {
    "id": "430611",
    "name": "君山区",
    "parent_id": "430600",
    "level_type": "3" },

  {
    "id": "430621",
    "name": "岳阳县",
    "parent_id": "430600",
    "level_type": "3" },

  {
    "id": "430623",
    "name": "华容县",
    "parent_id": "430600",
    "level_type": "3" },

  {
    "id": "430624",
    "name": "湘阴县",
    "parent_id": "430600",
    "level_type": "3" },

  {
    "id": "430626",
    "name": "平江县",
    "parent_id": "430600",
    "level_type": "3" },

  {
    "id": "430681",
    "name": "汨罗市",
    "parent_id": "430600",
    "level_type": "3" },

  {
    "id": "430682",
    "name": "临湘市",
    "parent_id": "430600",
    "level_type": "3" },

  {
    "id": "430700",
    "name": "常德市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "430702",
    "name": "武陵区",
    "parent_id": "430700",
    "level_type": "3" },

  {
    "id": "430703",
    "name": "鼎城区",
    "parent_id": "430700",
    "level_type": "3" },

  {
    "id": "430721",
    "name": "安乡县",
    "parent_id": "430700",
    "level_type": "3" },

  {
    "id": "430722",
    "name": "汉寿县",
    "parent_id": "430700",
    "level_type": "3" },

  {
    "id": "430723",
    "name": "澧县",
    "parent_id": "430700",
    "level_type": "3" },

  {
    "id": "430724",
    "name": "临澧县",
    "parent_id": "430700",
    "level_type": "3" },

  {
    "id": "430725",
    "name": "桃源县",
    "parent_id": "430700",
    "level_type": "3" },

  {
    "id": "430726",
    "name": "石门县",
    "parent_id": "430700",
    "level_type": "3" },

  {
    "id": "430781",
    "name": "津市市",
    "parent_id": "430700",
    "level_type": "3" },

  {
    "id": "430800",
    "name": "张家界市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "430802",
    "name": "永定区",
    "parent_id": "430800",
    "level_type": "3" },

  {
    "id": "430811",
    "name": "武陵源区",
    "parent_id": "430800",
    "level_type": "3" },

  {
    "id": "430821",
    "name": "慈利县",
    "parent_id": "430800",
    "level_type": "3" },

  {
    "id": "430822",
    "name": "桑植县",
    "parent_id": "430800",
    "level_type": "3" },

  {
    "id": "430900",
    "name": "益阳市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "430902",
    "name": "资阳区",
    "parent_id": "430900",
    "level_type": "3" },

  {
    "id": "430903",
    "name": "赫山区",
    "parent_id": "430900",
    "level_type": "3" },

  {
    "id": "430921",
    "name": "南县",
    "parent_id": "430900",
    "level_type": "3" },

  {
    "id": "430922",
    "name": "桃江县",
    "parent_id": "430900",
    "level_type": "3" },

  {
    "id": "430923",
    "name": "安化县",
    "parent_id": "430900",
    "level_type": "3" },

  {
    "id": "430981",
    "name": "沅江市",
    "parent_id": "430900",
    "level_type": "3" },

  {
    "id": "431000",
    "name": "郴州市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "431002",
    "name": "北湖区",
    "parent_id": "431000",
    "level_type": "3" },

  {
    "id": "431003",
    "name": "苏仙区",
    "parent_id": "431000",
    "level_type": "3" },

  {
    "id": "431021",
    "name": "桂阳县",
    "parent_id": "431000",
    "level_type": "3" },

  {
    "id": "431022",
    "name": "宜章县",
    "parent_id": "431000",
    "level_type": "3" },

  {
    "id": "431023",
    "name": "永兴县",
    "parent_id": "431000",
    "level_type": "3" },

  {
    "id": "431024",
    "name": "嘉禾县",
    "parent_id": "431000",
    "level_type": "3" },

  {
    "id": "431025",
    "name": "临武县",
    "parent_id": "431000",
    "level_type": "3" },

  {
    "id": "431026",
    "name": "汝城县",
    "parent_id": "431000",
    "level_type": "3" },

  {
    "id": "431027",
    "name": "桂东县",
    "parent_id": "431000",
    "level_type": "3" },

  {
    "id": "431028",
    "name": "安仁县",
    "parent_id": "431000",
    "level_type": "3" },

  {
    "id": "431081",
    "name": "资兴市",
    "parent_id": "431000",
    "level_type": "3" },

  {
    "id": "431100",
    "name": "永州市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "431102",
    "name": "零陵区",
    "parent_id": "431100",
    "level_type": "3" },

  {
    "id": "431103",
    "name": "冷水滩区",
    "parent_id": "431100",
    "level_type": "3" },

  {
    "id": "431121",
    "name": "祁阳县",
    "parent_id": "431100",
    "level_type": "3" },

  {
    "id": "431122",
    "name": "东安县",
    "parent_id": "431100",
    "level_type": "3" },

  {
    "id": "431123",
    "name": "双牌县",
    "parent_id": "431100",
    "level_type": "3" },

  {
    "id": "431124",
    "name": "道县",
    "parent_id": "431100",
    "level_type": "3" },

  {
    "id": "431125",
    "name": "江永县",
    "parent_id": "431100",
    "level_type": "3" },

  {
    "id": "431126",
    "name": "宁远县",
    "parent_id": "431100",
    "level_type": "3" },

  {
    "id": "431127",
    "name": "蓝山县",
    "parent_id": "431100",
    "level_type": "3" },

  {
    "id": "431128",
    "name": "新田县",
    "parent_id": "431100",
    "level_type": "3" },

  {
    "id": "431129",
    "name": "江华瑶族自治县",
    "parent_id": "431100",
    "level_type": "3" },

  {
    "id": "431200",
    "name": "怀化市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "431202",
    "name": "鹤城区",
    "parent_id": "431200",
    "level_type": "3" },

  {
    "id": "431221",
    "name": "中方县",
    "parent_id": "431200",
    "level_type": "3" },

  {
    "id": "431222",
    "name": "沅陵县",
    "parent_id": "431200",
    "level_type": "3" },

  {
    "id": "431223",
    "name": "辰溪县",
    "parent_id": "431200",
    "level_type": "3" },

  {
    "id": "431224",
    "name": "溆浦县",
    "parent_id": "431200",
    "level_type": "3" },

  {
    "id": "431225",
    "name": "会同县",
    "parent_id": "431200",
    "level_type": "3" },

  {
    "id": "431226",
    "name": "麻阳苗族自治县",
    "parent_id": "431200",
    "level_type": "3" },

  {
    "id": "431227",
    "name": "新晃侗族自治县",
    "parent_id": "431200",
    "level_type": "3" },

  {
    "id": "431228",
    "name": "芷江侗族自治县",
    "parent_id": "431200",
    "level_type": "3" },

  {
    "id": "431229",
    "name": "靖州苗族侗族自治县",
    "parent_id": "431200",
    "level_type": "3" },

  {
    "id": "431230",
    "name": "通道侗族自治县",
    "parent_id": "431200",
    "level_type": "3" },

  {
    "id": "431281",
    "name": "洪江市",
    "parent_id": "431200",
    "level_type": "3" },

  {
    "id": "431300",
    "name": "娄底市",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "431302",
    "name": "娄星区",
    "parent_id": "431300",
    "level_type": "3" },

  {
    "id": "431321",
    "name": "双峰县",
    "parent_id": "431300",
    "level_type": "3" },

  {
    "id": "431322",
    "name": "新化县",
    "parent_id": "431300",
    "level_type": "3" },

  {
    "id": "431381",
    "name": "冷水江市",
    "parent_id": "431300",
    "level_type": "3" },

  {
    "id": "431382",
    "name": "涟源市",
    "parent_id": "431300",
    "level_type": "3" },

  {
    "id": "433100",
    "name": "湘西土家族苗族自治州",
    "parent_id": "430000",
    "level_type": "2" },

  {
    "id": "433101",
    "name": "吉首市",
    "parent_id": "433100",
    "level_type": "3" },

  {
    "id": "433122",
    "name": "泸溪县",
    "parent_id": "433100",
    "level_type": "3" },

  {
    "id": "433123",
    "name": "凤凰县",
    "parent_id": "433100",
    "level_type": "3" },

  {
    "id": "433124",
    "name": "花垣县",
    "parent_id": "433100",
    "level_type": "3" },

  {
    "id": "433125",
    "name": "保靖县",
    "parent_id": "433100",
    "level_type": "3" },

  {
    "id": "433126",
    "name": "古丈县",
    "parent_id": "433100",
    "level_type": "3" },

  {
    "id": "433127",
    "name": "永顺县",
    "parent_id": "433100",
    "level_type": "3" },

  {
    "id": "433130",
    "name": "龙山县",
    "parent_id": "433100",
    "level_type": "3" },

  {
    "id": "440000",
    "name": "广东省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "440100",
    "name": "广州市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "440103",
    "name": "荔湾区",
    "parent_id": "440100",
    "level_type": "3" },

  {
    "id": "440104",
    "name": "越秀区",
    "parent_id": "440100",
    "level_type": "3" },

  {
    "id": "440105",
    "name": "海珠区",
    "parent_id": "440100",
    "level_type": "3" },

  {
    "id": "440106",
    "name": "天河区",
    "parent_id": "440100",
    "level_type": "3" },

  {
    "id": "440111",
    "name": "白云区",
    "parent_id": "440100",
    "level_type": "3" },

  {
    "id": "440112",
    "name": "黄埔区",
    "parent_id": "440100",
    "level_type": "3" },

  {
    "id": "440113",
    "name": "番禺区",
    "parent_id": "440100",
    "level_type": "3" },

  {
    "id": "440114",
    "name": "花都区",
    "parent_id": "440100",
    "level_type": "3" },

  {
    "id": "440115",
    "name": "南沙区",
    "parent_id": "440100",
    "level_type": "3" },

  {
    "id": "440117",
    "name": "从化区",
    "parent_id": "440100",
    "level_type": "3" },

  {
    "id": "440118",
    "name": "增城区",
    "parent_id": "440100",
    "level_type": "3" },

  {
    "id": "440200",
    "name": "韶关市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "440203",
    "name": "武江区",
    "parent_id": "440200",
    "level_type": "3" },

  {
    "id": "440204",
    "name": "浈江区",
    "parent_id": "440200",
    "level_type": "3" },

  {
    "id": "440205",
    "name": "曲江区",
    "parent_id": "440200",
    "level_type": "3" },

  {
    "id": "440222",
    "name": "始兴县",
    "parent_id": "440200",
    "level_type": "3" },

  {
    "id": "440224",
    "name": "仁化县",
    "parent_id": "440200",
    "level_type": "3" },

  {
    "id": "440229",
    "name": "翁源县",
    "parent_id": "440200",
    "level_type": "3" },

  {
    "id": "440232",
    "name": "乳源瑶族自治县",
    "parent_id": "440200",
    "level_type": "3" },

  {
    "id": "440233",
    "name": "新丰县",
    "parent_id": "440200",
    "level_type": "3" },

  {
    "id": "440281",
    "name": "乐昌市",
    "parent_id": "440200",
    "level_type": "3" },

  {
    "id": "440282",
    "name": "南雄市",
    "parent_id": "440200",
    "level_type": "3" },

  {
    "id": "440300",
    "name": "深圳市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "440303",
    "name": "罗湖区",
    "parent_id": "440300",
    "level_type": "3" },

  {
    "id": "440304",
    "name": "福田区",
    "parent_id": "440300",
    "level_type": "3" },

  {
    "id": "440305",
    "name": "南山区",
    "parent_id": "440300",
    "level_type": "3" },

  {
    "id": "440306",
    "name": "宝安区",
    "parent_id": "440300",
    "level_type": "3" },

  {
    "id": "440307",
    "name": "龙岗区",
    "parent_id": "440300",
    "level_type": "3" },

  {
    "id": "440308",
    "name": "盐田区",
    "parent_id": "440300",
    "level_type": "3" },

  {
    "id": "440309",
    "name": "光明新区",
    "parent_id": "440300",
    "level_type": "3" },

  {
    "id": "440310",
    "name": "坪山新区",
    "parent_id": "440300",
    "level_type": "3" },

  {
    "id": "440311",
    "name": "大鹏新区",
    "parent_id": "440300",
    "level_type": "3" },

  {
    "id": "440312",
    "name": "龙华新区",
    "parent_id": "440300",
    "level_type": "3" },

  {
    "id": "440400",
    "name": "珠海市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "440402",
    "name": "香洲区",
    "parent_id": "440400",
    "level_type": "3" },

  {
    "id": "440403",
    "name": "斗门区",
    "parent_id": "440400",
    "level_type": "3" },

  {
    "id": "440404",
    "name": "金湾区",
    "parent_id": "440400",
    "level_type": "3" },

  {
    "id": "440500",
    "name": "汕头市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "440507",
    "name": "龙湖区",
    "parent_id": "440500",
    "level_type": "3" },

  {
    "id": "440511",
    "name": "金平区",
    "parent_id": "440500",
    "level_type": "3" },

  {
    "id": "440512",
    "name": "濠江区",
    "parent_id": "440500",
    "level_type": "3" },

  {
    "id": "440513",
    "name": "潮阳区",
    "parent_id": "440500",
    "level_type": "3" },

  {
    "id": "440514",
    "name": "潮南区",
    "parent_id": "440500",
    "level_type": "3" },

  {
    "id": "440515",
    "name": "澄海区",
    "parent_id": "440500",
    "level_type": "3" },

  {
    "id": "440523",
    "name": "南澳县",
    "parent_id": "440500",
    "level_type": "3" },

  {
    "id": "440600",
    "name": "佛山市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "440604",
    "name": "禅城区",
    "parent_id": "440600",
    "level_type": "3" },

  {
    "id": "440605",
    "name": "南海区",
    "parent_id": "440600",
    "level_type": "3" },

  {
    "id": "440606",
    "name": "顺德区",
    "parent_id": "440600",
    "level_type": "3" },

  {
    "id": "440607",
    "name": "三水区",
    "parent_id": "440600",
    "level_type": "3" },

  {
    "id": "440608",
    "name": "高明区",
    "parent_id": "440600",
    "level_type": "3" },

  {
    "id": "440700",
    "name": "江门市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "440703",
    "name": "蓬江区",
    "parent_id": "440700",
    "level_type": "3" },

  {
    "id": "440704",
    "name": "江海区",
    "parent_id": "440700",
    "level_type": "3" },

  {
    "id": "440705",
    "name": "新会区",
    "parent_id": "440700",
    "level_type": "3" },

  {
    "id": "440781",
    "name": "台山市",
    "parent_id": "440700",
    "level_type": "3" },

  {
    "id": "440783",
    "name": "开平市",
    "parent_id": "440700",
    "level_type": "3" },

  {
    "id": "440784",
    "name": "鹤山市",
    "parent_id": "440700",
    "level_type": "3" },

  {
    "id": "440785",
    "name": "恩平市",
    "parent_id": "440700",
    "level_type": "3" },

  {
    "id": "440800",
    "name": "湛江市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "440802",
    "name": "赤坎区",
    "parent_id": "440800",
    "level_type": "3" },

  {
    "id": "440803",
    "name": "霞山区",
    "parent_id": "440800",
    "level_type": "3" },

  {
    "id": "440804",
    "name": "坡头区",
    "parent_id": "440800",
    "level_type": "3" },

  {
    "id": "440811",
    "name": "麻章区",
    "parent_id": "440800",
    "level_type": "3" },

  {
    "id": "440823",
    "name": "遂溪县",
    "parent_id": "440800",
    "level_type": "3" },

  {
    "id": "440825",
    "name": "徐闻县",
    "parent_id": "440800",
    "level_type": "3" },

  {
    "id": "440881",
    "name": "廉江市",
    "parent_id": "440800",
    "level_type": "3" },

  {
    "id": "440882",
    "name": "雷州市",
    "parent_id": "440800",
    "level_type": "3" },

  {
    "id": "440883",
    "name": "吴川市",
    "parent_id": "440800",
    "level_type": "3" },

  {
    "id": "440900",
    "name": "茂名市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "440902",
    "name": "茂南区",
    "parent_id": "440900",
    "level_type": "3" },

  {
    "id": "440904",
    "name": "电白区",
    "parent_id": "440900",
    "level_type": "3" },

  {
    "id": "440981",
    "name": "高州市",
    "parent_id": "440900",
    "level_type": "3" },

  {
    "id": "440982",
    "name": "化州市",
    "parent_id": "440900",
    "level_type": "3" },

  {
    "id": "440983",
    "name": "信宜市",
    "parent_id": "440900",
    "level_type": "3" },

  {
    "id": "441200",
    "name": "肇庆市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "441202",
    "name": "端州区",
    "parent_id": "441200",
    "level_type": "3" },

  {
    "id": "441203",
    "name": "鼎湖区",
    "parent_id": "441200",
    "level_type": "3" },

  {
    "id": "441223",
    "name": "广宁县",
    "parent_id": "441200",
    "level_type": "3" },

  {
    "id": "441224",
    "name": "怀集县",
    "parent_id": "441200",
    "level_type": "3" },

  {
    "id": "441225",
    "name": "封开县",
    "parent_id": "441200",
    "level_type": "3" },

  {
    "id": "441226",
    "name": "德庆县",
    "parent_id": "441200",
    "level_type": "3" },

  {
    "id": "441283",
    "name": "高要市",
    "parent_id": "441200",
    "level_type": "3" },

  {
    "id": "441284",
    "name": "四会市",
    "parent_id": "441200",
    "level_type": "3" },

  {
    "id": "441300",
    "name": "惠州市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "441302",
    "name": "惠城区",
    "parent_id": "441300",
    "level_type": "3" },

  {
    "id": "441303",
    "name": "惠阳区",
    "parent_id": "441300",
    "level_type": "3" },

  {
    "id": "441322",
    "name": "博罗县",
    "parent_id": "441300",
    "level_type": "3" },

  {
    "id": "441323",
    "name": "惠东县",
    "parent_id": "441300",
    "level_type": "3" },

  {
    "id": "441324",
    "name": "龙门县",
    "parent_id": "441300",
    "level_type": "3" },

  {
    "id": "441400",
    "name": "梅州市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "441402",
    "name": "梅江区",
    "parent_id": "441400",
    "level_type": "3" },

  {
    "id": "441403",
    "name": "梅县区",
    "parent_id": "441400",
    "level_type": "3" },

  {
    "id": "441422",
    "name": "大埔县",
    "parent_id": "441400",
    "level_type": "3" },

  {
    "id": "441423",
    "name": "丰顺县",
    "parent_id": "441400",
    "level_type": "3" },

  {
    "id": "441424",
    "name": "五华县",
    "parent_id": "441400",
    "level_type": "3" },

  {
    "id": "441426",
    "name": "平远县",
    "parent_id": "441400",
    "level_type": "3" },

  {
    "id": "441427",
    "name": "蕉岭县",
    "parent_id": "441400",
    "level_type": "3" },

  {
    "id": "441481",
    "name": "兴宁市",
    "parent_id": "441400",
    "level_type": "3" },

  {
    "id": "441500",
    "name": "汕尾市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "441502",
    "name": "城区",
    "parent_id": "441500",
    "level_type": "3" },

  {
    "id": "441521",
    "name": "海丰县",
    "parent_id": "441500",
    "level_type": "3" },

  {
    "id": "441523",
    "name": "陆河县",
    "parent_id": "441500",
    "level_type": "3" },

  {
    "id": "441581",
    "name": "陆丰市",
    "parent_id": "441500",
    "level_type": "3" },

  {
    "id": "441600",
    "name": "河源市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "441602",
    "name": "源城区",
    "parent_id": "441600",
    "level_type": "3" },

  {
    "id": "441621",
    "name": "紫金县",
    "parent_id": "441600",
    "level_type": "3" },

  {
    "id": "441622",
    "name": "龙川县",
    "parent_id": "441600",
    "level_type": "3" },

  {
    "id": "441623",
    "name": "连平县",
    "parent_id": "441600",
    "level_type": "3" },

  {
    "id": "441624",
    "name": "和平县",
    "parent_id": "441600",
    "level_type": "3" },

  {
    "id": "441625",
    "name": "东源县",
    "parent_id": "441600",
    "level_type": "3" },

  {
    "id": "441700",
    "name": "阳江市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "441702",
    "name": "江城区",
    "parent_id": "441700",
    "level_type": "3" },

  {
    "id": "441704",
    "name": "阳东区",
    "parent_id": "441700",
    "level_type": "3" },

  {
    "id": "441721",
    "name": "阳西县",
    "parent_id": "441700",
    "level_type": "3" },

  {
    "id": "441781",
    "name": "阳春市",
    "parent_id": "441700",
    "level_type": "3" },

  {
    "id": "441800",
    "name": "清远市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "441802",
    "name": "清城区",
    "parent_id": "441800",
    "level_type": "3" },

  {
    "id": "441803",
    "name": "清新区",
    "parent_id": "441800",
    "level_type": "3" },

  {
    "id": "441821",
    "name": "佛冈县",
    "parent_id": "441800",
    "level_type": "3" },

  {
    "id": "441823",
    "name": "阳山县",
    "parent_id": "441800",
    "level_type": "3" },

  {
    "id": "441825",
    "name": "连山壮族瑶族自治县",
    "parent_id": "441800",
    "level_type": "3" },

  {
    "id": "441826",
    "name": "连南瑶族自治县",
    "parent_id": "441800",
    "level_type": "3" },

  {
    "id": "441881",
    "name": "英德市",
    "parent_id": "441800",
    "level_type": "3" },

  {
    "id": "441882",
    "name": "连州市",
    "parent_id": "441800",
    "level_type": "3" },

  {
    "id": "441900",
    "name": "东莞市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "441901",
    "name": "莞城区",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441902",
    "name": "南城区",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441904",
    "name": "万江区",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441905",
    "name": "石碣镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441906",
    "name": "石龙镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441907",
    "name": "茶山镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441908",
    "name": "石排镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441909",
    "name": "企石镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441910",
    "name": "横沥镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441911",
    "name": "桥头镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441912",
    "name": "谢岗镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441913",
    "name": "东坑镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441914",
    "name": "常平镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441915",
    "name": "寮步镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441916",
    "name": "大朗镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441917",
    "name": "麻涌镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441918",
    "name": "中堂镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441919",
    "name": "高埗镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441920",
    "name": "樟木头镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441921",
    "name": "大岭山镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441922",
    "name": "望牛墩镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441923",
    "name": "黄江镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441924",
    "name": "洪梅镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441925",
    "name": "清溪镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441926",
    "name": "沙田镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441927",
    "name": "道滘镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441928",
    "name": "塘厦镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441929",
    "name": "虎门镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441930",
    "name": "厚街镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441931",
    "name": "凤岗镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "441932",
    "name": "长安镇",
    "parent_id": "441900",
    "level_type": "3" },

  {
    "id": "442000",
    "name": "中山市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "442001",
    "name": "石岐区",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442004",
    "name": "南区",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442005",
    "name": "五桂山区",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442006",
    "name": "火炬开发区",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442007",
    "name": "黄圃镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442008",
    "name": "南头镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442009",
    "name": "东凤镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442010",
    "name": "阜沙镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442011",
    "name": "小榄镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442012",
    "name": "东升镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442013",
    "name": "古镇镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442014",
    "name": "横栏镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442015",
    "name": "三角镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442016",
    "name": "民众镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442017",
    "name": "南朗镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442018",
    "name": "港口镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442019",
    "name": "大涌镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442020",
    "name": "沙溪镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442021",
    "name": "三乡镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442022",
    "name": "板芙镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442023",
    "name": "神湾镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "442024",
    "name": "坦洲镇",
    "parent_id": "442000",
    "level_type": "3" },

  {
    "id": "445100",
    "name": "潮州市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "445102",
    "name": "湘桥区",
    "parent_id": "445100",
    "level_type": "3" },

  {
    "id": "445103",
    "name": "潮安区",
    "parent_id": "445100",
    "level_type": "3" },

  {
    "id": "445122",
    "name": "饶平县",
    "parent_id": "445100",
    "level_type": "3" },

  {
    "id": "445200",
    "name": "揭阳市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "445202",
    "name": "榕城区",
    "parent_id": "445200",
    "level_type": "3" },

  {
    "id": "445203",
    "name": "揭东区",
    "parent_id": "445200",
    "level_type": "3" },

  {
    "id": "445222",
    "name": "揭西县",
    "parent_id": "445200",
    "level_type": "3" },

  {
    "id": "445224",
    "name": "惠来县",
    "parent_id": "445200",
    "level_type": "3" },

  {
    "id": "445281",
    "name": "普宁市",
    "parent_id": "445200",
    "level_type": "3" },

  {
    "id": "445300",
    "name": "云浮市",
    "parent_id": "440000",
    "level_type": "2" },

  {
    "id": "445302",
    "name": "云城区",
    "parent_id": "445300",
    "level_type": "3" },

  {
    "id": "445303",
    "name": "云安区",
    "parent_id": "445300",
    "level_type": "3" },

  {
    "id": "445321",
    "name": "新兴县",
    "parent_id": "445300",
    "level_type": "3" },

  {
    "id": "445322",
    "name": "郁南县",
    "parent_id": "445300",
    "level_type": "3" },

  {
    "id": "445381",
    "name": "罗定市",
    "parent_id": "445300",
    "level_type": "3" },

  {
    "id": "450000",
    "name": "广西壮族自治区",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "450100",
    "name": "南宁市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "450102",
    "name": "兴宁区",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450103",
    "name": "青秀区",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450105",
    "name": "江南区",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450107",
    "name": "西乡塘区",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450108",
    "name": "良庆区",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450109",
    "name": "邕宁区",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450122",
    "name": "武鸣县",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450123",
    "name": "隆安县",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450124",
    "name": "马山县",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450125",
    "name": "上林县",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450126",
    "name": "宾阳县",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450127",
    "name": "横县",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450128",
    "name": "埌东新区",
    "parent_id": "450100",
    "level_type": "3" },

  {
    "id": "450200",
    "name": "柳州市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "450202",
    "name": "城中区",
    "parent_id": "450200",
    "level_type": "3" },

  {
    "id": "450203",
    "name": "鱼峰区",
    "parent_id": "450200",
    "level_type": "3" },

  {
    "id": "450204",
    "name": "柳南区",
    "parent_id": "450200",
    "level_type": "3" },

  {
    "id": "450205",
    "name": "柳北区",
    "parent_id": "450200",
    "level_type": "3" },

  {
    "id": "450221",
    "name": "柳江县",
    "parent_id": "450200",
    "level_type": "3" },

  {
    "id": "450222",
    "name": "柳城县",
    "parent_id": "450200",
    "level_type": "3" },

  {
    "id": "450223",
    "name": "鹿寨县",
    "parent_id": "450200",
    "level_type": "3" },

  {
    "id": "450224",
    "name": "融安县",
    "parent_id": "450200",
    "level_type": "3" },

  {
    "id": "450225",
    "name": "融水苗族自治县",
    "parent_id": "450200",
    "level_type": "3" },

  {
    "id": "450226",
    "name": "三江侗族自治县",
    "parent_id": "450200",
    "level_type": "3" },

  {
    "id": "450227",
    "name": "柳东新区",
    "parent_id": "450200",
    "level_type": "3" },

  {
    "id": "450300",
    "name": "桂林市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "450302",
    "name": "秀峰区",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450303",
    "name": "叠彩区",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450304",
    "name": "象山区",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450305",
    "name": "七星区",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450311",
    "name": "雁山区",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450312",
    "name": "临桂区",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450321",
    "name": "阳朔县",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450323",
    "name": "灵川县",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450324",
    "name": "全州县",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450325",
    "name": "兴安县",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450326",
    "name": "永福县",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450327",
    "name": "灌阳县",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450328",
    "name": "龙胜各族自治县",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450329",
    "name": "资源县",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450330",
    "name": "平乐县",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450331",
    "name": "荔浦县",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450332",
    "name": "恭城瑶族自治县",
    "parent_id": "450300",
    "level_type": "3" },

  {
    "id": "450400",
    "name": "梧州市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "450403",
    "name": "万秀区",
    "parent_id": "450400",
    "level_type": "3" },

  {
    "id": "450405",
    "name": "长洲区",
    "parent_id": "450400",
    "level_type": "3" },

  {
    "id": "450406",
    "name": "龙圩区",
    "parent_id": "450400",
    "level_type": "3" },

  {
    "id": "450421",
    "name": "苍梧县",
    "parent_id": "450400",
    "level_type": "3" },

  {
    "id": "450422",
    "name": "藤县",
    "parent_id": "450400",
    "level_type": "3" },

  {
    "id": "450423",
    "name": "蒙山县",
    "parent_id": "450400",
    "level_type": "3" },

  {
    "id": "450481",
    "name": "岑溪市",
    "parent_id": "450400",
    "level_type": "3" },

  {
    "id": "450500",
    "name": "北海市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "450502",
    "name": "海城区",
    "parent_id": "450500",
    "level_type": "3" },

  {
    "id": "450503",
    "name": "银海区",
    "parent_id": "450500",
    "level_type": "3" },

  {
    "id": "450512",
    "name": "铁山港区",
    "parent_id": "450500",
    "level_type": "3" },

  {
    "id": "450521",
    "name": "合浦县",
    "parent_id": "450500",
    "level_type": "3" },

  {
    "id": "450600",
    "name": "防城港市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "450602",
    "name": "港口区",
    "parent_id": "450600",
    "level_type": "3" },

  {
    "id": "450603",
    "name": "防城区",
    "parent_id": "450600",
    "level_type": "3" },

  {
    "id": "450621",
    "name": "上思县",
    "parent_id": "450600",
    "level_type": "3" },

  {
    "id": "450681",
    "name": "东兴市",
    "parent_id": "450600",
    "level_type": "3" },

  {
    "id": "450700",
    "name": "钦州市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "450702",
    "name": "钦南区",
    "parent_id": "450700",
    "level_type": "3" },

  {
    "id": "450703",
    "name": "钦北区",
    "parent_id": "450700",
    "level_type": "3" },

  {
    "id": "450721",
    "name": "灵山县",
    "parent_id": "450700",
    "level_type": "3" },

  {
    "id": "450722",
    "name": "浦北县",
    "parent_id": "450700",
    "level_type": "3" },

  {
    "id": "450800",
    "name": "贵港市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "450802",
    "name": "港北区",
    "parent_id": "450800",
    "level_type": "3" },

  {
    "id": "450803",
    "name": "港南区",
    "parent_id": "450800",
    "level_type": "3" },

  {
    "id": "450804",
    "name": "覃塘区",
    "parent_id": "450800",
    "level_type": "3" },

  {
    "id": "450821",
    "name": "平南县",
    "parent_id": "450800",
    "level_type": "3" },

  {
    "id": "450881",
    "name": "桂平市",
    "parent_id": "450800",
    "level_type": "3" },

  {
    "id": "450900",
    "name": "玉林市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "450902",
    "name": "玉州区",
    "parent_id": "450900",
    "level_type": "3" },

  {
    "id": "450903",
    "name": "福绵区",
    "parent_id": "450900",
    "level_type": "3" },

  {
    "id": "450904",
    "name": "玉东新区",
    "parent_id": "450900",
    "level_type": "3" },

  {
    "id": "450921",
    "name": "容县",
    "parent_id": "450900",
    "level_type": "3" },

  {
    "id": "450922",
    "name": "陆川县",
    "parent_id": "450900",
    "level_type": "3" },

  {
    "id": "450923",
    "name": "博白县",
    "parent_id": "450900",
    "level_type": "3" },

  {
    "id": "450924",
    "name": "兴业县",
    "parent_id": "450900",
    "level_type": "3" },

  {
    "id": "450981",
    "name": "北流市",
    "parent_id": "450900",
    "level_type": "3" },

  {
    "id": "451000",
    "name": "百色市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "451002",
    "name": "右江区",
    "parent_id": "451000",
    "level_type": "3" },

  {
    "id": "451021",
    "name": "田阳县",
    "parent_id": "451000",
    "level_type": "3" },

  {
    "id": "451022",
    "name": "田东县",
    "parent_id": "451000",
    "level_type": "3" },

  {
    "id": "451023",
    "name": "平果县",
    "parent_id": "451000",
    "level_type": "3" },

  {
    "id": "451024",
    "name": "德保县",
    "parent_id": "451000",
    "level_type": "3" },

  {
    "id": "451025",
    "name": "靖西县",
    "parent_id": "451000",
    "level_type": "3" },

  {
    "id": "451026",
    "name": "那坡县",
    "parent_id": "451000",
    "level_type": "3" },

  {
    "id": "451027",
    "name": "凌云县",
    "parent_id": "451000",
    "level_type": "3" },

  {
    "id": "451028",
    "name": "乐业县",
    "parent_id": "451000",
    "level_type": "3" },

  {
    "id": "451029",
    "name": "田林县",
    "parent_id": "451000",
    "level_type": "3" },

  {
    "id": "451030",
    "name": "西林县",
    "parent_id": "451000",
    "level_type": "3" },

  {
    "id": "451031",
    "name": "隆林各族自治县",
    "parent_id": "451000",
    "level_type": "3" },

  {
    "id": "451100",
    "name": "贺州市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "451102",
    "name": "八步区",
    "parent_id": "451100",
    "level_type": "3" },

  {
    "id": "451121",
    "name": "昭平县",
    "parent_id": "451100",
    "level_type": "3" },

  {
    "id": "451122",
    "name": "钟山县",
    "parent_id": "451100",
    "level_type": "3" },

  {
    "id": "451123",
    "name": "富川瑶族自治县",
    "parent_id": "451100",
    "level_type": "3" },

  {
    "id": "451124",
    "name": "平桂管理区",
    "parent_id": "451100",
    "level_type": "3" },

  {
    "id": "451200",
    "name": "河池市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "451202",
    "name": "金城江区",
    "parent_id": "451200",
    "level_type": "3" },

  {
    "id": "451221",
    "name": "南丹县",
    "parent_id": "451200",
    "level_type": "3" },

  {
    "id": "451222",
    "name": "天峨县",
    "parent_id": "451200",
    "level_type": "3" },

  {
    "id": "451223",
    "name": "凤山县",
    "parent_id": "451200",
    "level_type": "3" },

  {
    "id": "451224",
    "name": "东兰县",
    "parent_id": "451200",
    "level_type": "3" },

  {
    "id": "451225",
    "name": "罗城仫佬族自治县",
    "parent_id": "451200",
    "level_type": "3" },

  {
    "id": "451226",
    "name": "环江毛南族自治县",
    "parent_id": "451200",
    "level_type": "3" },

  {
    "id": "451227",
    "name": "巴马瑶族自治县",
    "parent_id": "451200",
    "level_type": "3" },

  {
    "id": "451228",
    "name": "都安瑶族自治县",
    "parent_id": "451200",
    "level_type": "3" },

  {
    "id": "451229",
    "name": "大化瑶族自治县",
    "parent_id": "451200",
    "level_type": "3" },

  {
    "id": "451281",
    "name": "宜州市",
    "parent_id": "451200",
    "level_type": "3" },

  {
    "id": "451300",
    "name": "来宾市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "451302",
    "name": "兴宾区",
    "parent_id": "451300",
    "level_type": "3" },

  {
    "id": "451321",
    "name": "忻城县",
    "parent_id": "451300",
    "level_type": "3" },

  {
    "id": "451322",
    "name": "象州县",
    "parent_id": "451300",
    "level_type": "3" },

  {
    "id": "451323",
    "name": "武宣县",
    "parent_id": "451300",
    "level_type": "3" },

  {
    "id": "451324",
    "name": "金秀瑶族自治县",
    "parent_id": "451300",
    "level_type": "3" },

  {
    "id": "451381",
    "name": "合山市",
    "parent_id": "451300",
    "level_type": "3" },

  {
    "id": "451400",
    "name": "崇左市",
    "parent_id": "450000",
    "level_type": "2" },

  {
    "id": "451402",
    "name": "江州区",
    "parent_id": "451400",
    "level_type": "3" },

  {
    "id": "451421",
    "name": "扶绥县",
    "parent_id": "451400",
    "level_type": "3" },

  {
    "id": "451422",
    "name": "宁明县",
    "parent_id": "451400",
    "level_type": "3" },

  {
    "id": "451423",
    "name": "龙州县",
    "parent_id": "451400",
    "level_type": "3" },

  {
    "id": "451424",
    "name": "大新县",
    "parent_id": "451400",
    "level_type": "3" },

  {
    "id": "451425",
    "name": "天等县",
    "parent_id": "451400",
    "level_type": "3" },

  {
    "id": "451481",
    "name": "凭祥市",
    "parent_id": "451400",
    "level_type": "3" },

  {
    "id": "460000",
    "name": "海南省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "460100",
    "name": "海口市",
    "parent_id": "460000",
    "level_type": "2" },

  {
    "id": "460105",
    "name": "秀英区",
    "parent_id": "460100",
    "level_type": "3" },

  {
    "id": "460106",
    "name": "龙华区",
    "parent_id": "460100",
    "level_type": "3" },

  {
    "id": "460107",
    "name": "琼山区",
    "parent_id": "460100",
    "level_type": "3" },

  {
    "id": "460108",
    "name": "美兰区",
    "parent_id": "460100",
    "level_type": "3" },

  {
    "id": "460200",
    "name": "三亚市",
    "parent_id": "460000",
    "level_type": "2" },

  {
    "id": "460202",
    "name": "海棠区",
    "parent_id": "460200",
    "level_type": "3" },

  {
    "id": "460203",
    "name": "吉阳区",
    "parent_id": "460200",
    "level_type": "3" },

  {
    "id": "460204",
    "name": "天涯区",
    "parent_id": "460200",
    "level_type": "3" },

  {
    "id": "460205",
    "name": "崖州区",
    "parent_id": "460200",
    "level_type": "3" },

  {
    "id": "460300",
    "name": "三沙市",
    "parent_id": "460000",
    "level_type": "2" },

  {
    "id": "460321",
    "name": "西沙群岛",
    "parent_id": "460300",
    "level_type": "3" },

  {
    "id": "460322",
    "name": "南沙群岛",
    "parent_id": "460300",
    "level_type": "3" },

  {
    "id": "460323",
    "name": "中沙群岛",
    "parent_id": "460300",
    "level_type": "3" },

  {
    "id": "469000",
    "name": "直辖县级",
    "parent_id": "460000",
    "level_type": "2" },

  {
    "id": "469001",
    "name": "五指山市",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469002",
    "name": "琼海市",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469003",
    "name": "儋州市",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469005",
    "name": "文昌市",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469006",
    "name": "万宁市",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469007",
    "name": "东方市",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469021",
    "name": "定安县",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469022",
    "name": "屯昌县",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469023",
    "name": "澄迈县",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469024",
    "name": "临高县",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469025",
    "name": "白沙黎族自治县",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469026",
    "name": "昌江黎族自治县",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469027",
    "name": "乐东黎族自治县",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469028",
    "name": "陵水黎族自治县",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469029",
    "name": "保亭黎族苗族自治县",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "469030",
    "name": "琼中黎族苗族自治县",
    "parent_id": "469000",
    "level_type": "3" },

  {
    "id": "500000",
    "name": "重庆",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "500100",
    "name": "重庆市",
    "parent_id": "500000",
    "level_type": "2" },

  {
    "id": "500101",
    "name": "万州区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500102",
    "name": "涪陵区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500103",
    "name": "渝中区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500104",
    "name": "大渡口区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500105",
    "name": "江北区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500106",
    "name": "沙坪坝区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500107",
    "name": "九龙坡区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500108",
    "name": "南岸区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500109",
    "name": "北碚区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500110",
    "name": "綦江区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500111",
    "name": "大足区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500112",
    "name": "渝北区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500113",
    "name": "巴南区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500114",
    "name": "黔江区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500115",
    "name": "长寿区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500116",
    "name": "江津区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500117",
    "name": "合川区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500118",
    "name": "永川区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500119",
    "name": "南川区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500120",
    "name": "璧山区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500151",
    "name": "铜梁区",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500223",
    "name": "潼南县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500226",
    "name": "荣昌县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500228",
    "name": "梁平县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500229",
    "name": "城口县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500230",
    "name": "丰都县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500231",
    "name": "垫江县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500232",
    "name": "武隆县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500233",
    "name": "忠县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500234",
    "name": "开县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500235",
    "name": "云阳县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500236",
    "name": "奉节县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500237",
    "name": "巫山县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500238",
    "name": "巫溪县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500240",
    "name": "石柱土家族自治县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500241",
    "name": "秀山土家族苗族自治县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500242",
    "name": "酉阳土家族苗族自治县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500243",
    "name": "彭水苗族土家族自治县",
    "parent_id": "500100",
    "level_type": "3" },

  {
    "id": "500300",
    "name": "两江新区",
    "parent_id": "500000",
    "level_type": "2" },

  {
    "id": "500301",
    "name": "北部新区",
    "parent_id": "500300",
    "level_type": "3" },

  {
    "id": "500302",
    "name": "保税港区",
    "parent_id": "500300",
    "level_type": "3" },

  {
    "id": "500303",
    "name": "工业园区",
    "parent_id": "500300",
    "level_type": "3" },

  {
    "id": "510000",
    "name": "四川省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "510100",
    "name": "成都市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "510104",
    "name": "锦江区",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510105",
    "name": "青羊区",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510106",
    "name": "金牛区",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510107",
    "name": "武侯区",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510108",
    "name": "成华区",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510112",
    "name": "龙泉驿区",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510113",
    "name": "青白江区",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510114",
    "name": "新都区",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510115",
    "name": "温江区",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510121",
    "name": "金堂县",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510122",
    "name": "双流县",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510124",
    "name": "郫县",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510129",
    "name": "大邑县",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510131",
    "name": "蒲江县",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510132",
    "name": "新津县",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510181",
    "name": "都江堰市",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510182",
    "name": "彭州市",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510183",
    "name": "邛崃市",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510184",
    "name": "崇州市",
    "parent_id": "510100",
    "level_type": "3" },

  {
    "id": "510300",
    "name": "自贡市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "510302",
    "name": "自流井区",
    "parent_id": "510300",
    "level_type": "3" },

  {
    "id": "510303",
    "name": "贡井区",
    "parent_id": "510300",
    "level_type": "3" },

  {
    "id": "510304",
    "name": "大安区",
    "parent_id": "510300",
    "level_type": "3" },

  {
    "id": "510311",
    "name": "沿滩区",
    "parent_id": "510300",
    "level_type": "3" },

  {
    "id": "510321",
    "name": "荣县",
    "parent_id": "510300",
    "level_type": "3" },

  {
    "id": "510322",
    "name": "富顺县",
    "parent_id": "510300",
    "level_type": "3" },

  {
    "id": "510400",
    "name": "攀枝花市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "510402",
    "name": "东区",
    "parent_id": "510400",
    "level_type": "3" },

  {
    "id": "510403",
    "name": "西区",
    "parent_id": "510400",
    "level_type": "3" },

  {
    "id": "510411",
    "name": "仁和区",
    "parent_id": "510400",
    "level_type": "3" },

  {
    "id": "510421",
    "name": "米易县",
    "parent_id": "510400",
    "level_type": "3" },

  {
    "id": "510422",
    "name": "盐边县",
    "parent_id": "510400",
    "level_type": "3" },

  {
    "id": "510500",
    "name": "泸州市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "510502",
    "name": "江阳区",
    "parent_id": "510500",
    "level_type": "3" },

  {
    "id": "510503",
    "name": "纳溪区",
    "parent_id": "510500",
    "level_type": "3" },

  {
    "id": "510504",
    "name": "龙马潭区",
    "parent_id": "510500",
    "level_type": "3" },

  {
    "id": "510521",
    "name": "泸县",
    "parent_id": "510500",
    "level_type": "3" },

  {
    "id": "510522",
    "name": "合江县",
    "parent_id": "510500",
    "level_type": "3" },

  {
    "id": "510524",
    "name": "叙永县",
    "parent_id": "510500",
    "level_type": "3" },

  {
    "id": "510525",
    "name": "古蔺县",
    "parent_id": "510500",
    "level_type": "3" },

  {
    "id": "510600",
    "name": "德阳市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "510603",
    "name": "旌阳区",
    "parent_id": "510600",
    "level_type": "3" },

  {
    "id": "510623",
    "name": "中江县",
    "parent_id": "510600",
    "level_type": "3" },

  {
    "id": "510626",
    "name": "罗江县",
    "parent_id": "510600",
    "level_type": "3" },

  {
    "id": "510681",
    "name": "广汉市",
    "parent_id": "510600",
    "level_type": "3" },

  {
    "id": "510682",
    "name": "什邡市",
    "parent_id": "510600",
    "level_type": "3" },

  {
    "id": "510683",
    "name": "绵竹市",
    "parent_id": "510600",
    "level_type": "3" },

  {
    "id": "510700",
    "name": "绵阳市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "510703",
    "name": "涪城区",
    "parent_id": "510700",
    "level_type": "3" },

  {
    "id": "510704",
    "name": "游仙区",
    "parent_id": "510700",
    "level_type": "3" },

  {
    "id": "510722",
    "name": "三台县",
    "parent_id": "510700",
    "level_type": "3" },

  {
    "id": "510723",
    "name": "盐亭县",
    "parent_id": "510700",
    "level_type": "3" },

  {
    "id": "510724",
    "name": "安县",
    "parent_id": "510700",
    "level_type": "3" },

  {
    "id": "510725",
    "name": "梓潼县",
    "parent_id": "510700",
    "level_type": "3" },

  {
    "id": "510726",
    "name": "北川羌族自治县",
    "parent_id": "510700",
    "level_type": "3" },

  {
    "id": "510727",
    "name": "平武县",
    "parent_id": "510700",
    "level_type": "3" },

  {
    "id": "510781",
    "name": "江油市",
    "parent_id": "510700",
    "level_type": "3" },

  {
    "id": "510800",
    "name": "广元市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "510802",
    "name": "利州区",
    "parent_id": "510800",
    "level_type": "3" },

  {
    "id": "510811",
    "name": "昭化区",
    "parent_id": "510800",
    "level_type": "3" },

  {
    "id": "510812",
    "name": "朝天区",
    "parent_id": "510800",
    "level_type": "3" },

  {
    "id": "510821",
    "name": "旺苍县",
    "parent_id": "510800",
    "level_type": "3" },

  {
    "id": "510822",
    "name": "青川县",
    "parent_id": "510800",
    "level_type": "3" },

  {
    "id": "510823",
    "name": "剑阁县",
    "parent_id": "510800",
    "level_type": "3" },

  {
    "id": "510824",
    "name": "苍溪县",
    "parent_id": "510800",
    "level_type": "3" },

  {
    "id": "510900",
    "name": "遂宁市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "510903",
    "name": "船山区",
    "parent_id": "510900",
    "level_type": "3" },

  {
    "id": "510904",
    "name": "安居区",
    "parent_id": "510900",
    "level_type": "3" },

  {
    "id": "510921",
    "name": "蓬溪县",
    "parent_id": "510900",
    "level_type": "3" },

  {
    "id": "510922",
    "name": "射洪县",
    "parent_id": "510900",
    "level_type": "3" },

  {
    "id": "510923",
    "name": "大英县",
    "parent_id": "510900",
    "level_type": "3" },

  {
    "id": "511000",
    "name": "内江市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "511002",
    "name": "市中区",
    "parent_id": "511000",
    "level_type": "3" },

  {
    "id": "511011",
    "name": "东兴区",
    "parent_id": "511000",
    "level_type": "3" },

  {
    "id": "511024",
    "name": "威远县",
    "parent_id": "511000",
    "level_type": "3" },

  {
    "id": "511025",
    "name": "资中县",
    "parent_id": "511000",
    "level_type": "3" },

  {
    "id": "511028",
    "name": "隆昌县",
    "parent_id": "511000",
    "level_type": "3" },

  {
    "id": "511100",
    "name": "乐山市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "511102",
    "name": "市中区",
    "parent_id": "511100",
    "level_type": "3" },

  {
    "id": "511111",
    "name": "沙湾区",
    "parent_id": "511100",
    "level_type": "3" },

  {
    "id": "511112",
    "name": "五通桥区",
    "parent_id": "511100",
    "level_type": "3" },

  {
    "id": "511113",
    "name": "金口河区",
    "parent_id": "511100",
    "level_type": "3" },

  {
    "id": "511123",
    "name": "犍为县",
    "parent_id": "511100",
    "level_type": "3" },

  {
    "id": "511124",
    "name": "井研县",
    "parent_id": "511100",
    "level_type": "3" },

  {
    "id": "511126",
    "name": "夹江县",
    "parent_id": "511100",
    "level_type": "3" },

  {
    "id": "511129",
    "name": "沐川县",
    "parent_id": "511100",
    "level_type": "3" },

  {
    "id": "511132",
    "name": "峨边彝族自治县",
    "parent_id": "511100",
    "level_type": "3" },

  {
    "id": "511133",
    "name": "马边彝族自治县",
    "parent_id": "511100",
    "level_type": "3" },

  {
    "id": "511181",
    "name": "峨眉山市",
    "parent_id": "511100",
    "level_type": "3" },

  {
    "id": "511300",
    "name": "南充市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "511302",
    "name": "顺庆区",
    "parent_id": "511300",
    "level_type": "3" },

  {
    "id": "511303",
    "name": "高坪区",
    "parent_id": "511300",
    "level_type": "3" },

  {
    "id": "511304",
    "name": "嘉陵区",
    "parent_id": "511300",
    "level_type": "3" },

  {
    "id": "511321",
    "name": "南部县",
    "parent_id": "511300",
    "level_type": "3" },

  {
    "id": "511322",
    "name": "营山县",
    "parent_id": "511300",
    "level_type": "3" },

  {
    "id": "511323",
    "name": "蓬安县",
    "parent_id": "511300",
    "level_type": "3" },

  {
    "id": "511324",
    "name": "仪陇县",
    "parent_id": "511300",
    "level_type": "3" },

  {
    "id": "511325",
    "name": "西充县",
    "parent_id": "511300",
    "level_type": "3" },

  {
    "id": "511381",
    "name": "阆中市",
    "parent_id": "511300",
    "level_type": "3" },

  {
    "id": "511400",
    "name": "眉山市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "511402",
    "name": "东坡区",
    "parent_id": "511400",
    "level_type": "3" },

  {
    "id": "511403",
    "name": "彭山区",
    "parent_id": "511400",
    "level_type": "3" },

  {
    "id": "511421",
    "name": "仁寿县",
    "parent_id": "511400",
    "level_type": "3" },

  {
    "id": "511423",
    "name": "洪雅县",
    "parent_id": "511400",
    "level_type": "3" },

  {
    "id": "511424",
    "name": "丹棱县",
    "parent_id": "511400",
    "level_type": "3" },

  {
    "id": "511425",
    "name": "青神县",
    "parent_id": "511400",
    "level_type": "3" },

  {
    "id": "511500",
    "name": "宜宾市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "511502",
    "name": "翠屏区",
    "parent_id": "511500",
    "level_type": "3" },

  {
    "id": "511503",
    "name": "南溪区",
    "parent_id": "511500",
    "level_type": "3" },

  {
    "id": "511521",
    "name": "宜宾县",
    "parent_id": "511500",
    "level_type": "3" },

  {
    "id": "511523",
    "name": "江安县",
    "parent_id": "511500",
    "level_type": "3" },

  {
    "id": "511524",
    "name": "长宁县",
    "parent_id": "511500",
    "level_type": "3" },

  {
    "id": "511525",
    "name": "高县",
    "parent_id": "511500",
    "level_type": "3" },

  {
    "id": "511526",
    "name": "珙县",
    "parent_id": "511500",
    "level_type": "3" },

  {
    "id": "511527",
    "name": "筠连县",
    "parent_id": "511500",
    "level_type": "3" },

  {
    "id": "511528",
    "name": "兴文县",
    "parent_id": "511500",
    "level_type": "3" },

  {
    "id": "511529",
    "name": "屏山县",
    "parent_id": "511500",
    "level_type": "3" },

  {
    "id": "511600",
    "name": "广安市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "511602",
    "name": "广安区",
    "parent_id": "511600",
    "level_type": "3" },

  {
    "id": "511603",
    "name": "前锋区",
    "parent_id": "511600",
    "level_type": "3" },

  {
    "id": "511621",
    "name": "岳池县",
    "parent_id": "511600",
    "level_type": "3" },

  {
    "id": "511622",
    "name": "武胜县",
    "parent_id": "511600",
    "level_type": "3" },

  {
    "id": "511623",
    "name": "邻水县",
    "parent_id": "511600",
    "level_type": "3" },

  {
    "id": "511681",
    "name": "华蓥市",
    "parent_id": "511600",
    "level_type": "3" },

  {
    "id": "511700",
    "name": "达州市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "511702",
    "name": "通川区",
    "parent_id": "511700",
    "level_type": "3" },

  {
    "id": "511703",
    "name": "达川区",
    "parent_id": "511700",
    "level_type": "3" },

  {
    "id": "511722",
    "name": "宣汉县",
    "parent_id": "511700",
    "level_type": "3" },

  {
    "id": "511723",
    "name": "开江县",
    "parent_id": "511700",
    "level_type": "3" },

  {
    "id": "511724",
    "name": "大竹县",
    "parent_id": "511700",
    "level_type": "3" },

  {
    "id": "511725",
    "name": "渠县",
    "parent_id": "511700",
    "level_type": "3" },

  {
    "id": "511781",
    "name": "万源市",
    "parent_id": "511700",
    "level_type": "3" },

  {
    "id": "511800",
    "name": "雅安市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "511802",
    "name": "雨城区",
    "parent_id": "511800",
    "level_type": "3" },

  {
    "id": "511803",
    "name": "名山区",
    "parent_id": "511800",
    "level_type": "3" },

  {
    "id": "511822",
    "name": "荥经县",
    "parent_id": "511800",
    "level_type": "3" },

  {
    "id": "511823",
    "name": "汉源县",
    "parent_id": "511800",
    "level_type": "3" },

  {
    "id": "511824",
    "name": "石棉县",
    "parent_id": "511800",
    "level_type": "3" },

  {
    "id": "511825",
    "name": "天全县",
    "parent_id": "511800",
    "level_type": "3" },

  {
    "id": "511826",
    "name": "芦山县",
    "parent_id": "511800",
    "level_type": "3" },

  {
    "id": "511827",
    "name": "宝兴县",
    "parent_id": "511800",
    "level_type": "3" },

  {
    "id": "511900",
    "name": "巴中市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "511902",
    "name": "巴州区",
    "parent_id": "511900",
    "level_type": "3" },

  {
    "id": "511903",
    "name": "恩阳区",
    "parent_id": "511900",
    "level_type": "3" },

  {
    "id": "511921",
    "name": "通江县",
    "parent_id": "511900",
    "level_type": "3" },

  {
    "id": "511922",
    "name": "南江县",
    "parent_id": "511900",
    "level_type": "3" },

  {
    "id": "511923",
    "name": "平昌县",
    "parent_id": "511900",
    "level_type": "3" },

  {
    "id": "512000",
    "name": "资阳市",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "512002",
    "name": "雁江区",
    "parent_id": "512000",
    "level_type": "3" },

  {
    "id": "512021",
    "name": "安岳县",
    "parent_id": "512000",
    "level_type": "3" },

  {
    "id": "512022",
    "name": "乐至县",
    "parent_id": "512000",
    "level_type": "3" },

  {
    "id": "512081",
    "name": "简阳市",
    "parent_id": "512000",
    "level_type": "3" },

  {
    "id": "513200",
    "name": "阿坝藏族羌族自治州",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "513221",
    "name": "汶川县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513222",
    "name": "理县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513223",
    "name": "茂县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513224",
    "name": "松潘县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513225",
    "name": "九寨沟县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513226",
    "name": "金川县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513227",
    "name": "小金县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513228",
    "name": "黑水县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513229",
    "name": "马尔康县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513230",
    "name": "壤塘县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513231",
    "name": "阿坝县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513232",
    "name": "若尔盖县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513233",
    "name": "红原县",
    "parent_id": "513200",
    "level_type": "3" },

  {
    "id": "513300",
    "name": "甘孜藏族自治州",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "513321",
    "name": "康定县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513322",
    "name": "泸定县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513323",
    "name": "丹巴县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513324",
    "name": "九龙县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513325",
    "name": "雅江县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513326",
    "name": "道孚县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513327",
    "name": "炉霍县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513328",
    "name": "甘孜县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513329",
    "name": "新龙县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513330",
    "name": "德格县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513331",
    "name": "白玉县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513332",
    "name": "石渠县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513333",
    "name": "色达县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513334",
    "name": "理塘县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513335",
    "name": "巴塘县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513336",
    "name": "乡城县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513337",
    "name": "稻城县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513338",
    "name": "得荣县",
    "parent_id": "513300",
    "level_type": "3" },

  {
    "id": "513400",
    "name": "凉山彝族自治州",
    "parent_id": "510000",
    "level_type": "2" },

  {
    "id": "513401",
    "name": "西昌市",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513422",
    "name": "木里藏族自治县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513423",
    "name": "盐源县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513424",
    "name": "德昌县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513425",
    "name": "会理县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513426",
    "name": "会东县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513427",
    "name": "宁南县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513428",
    "name": "普格县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513429",
    "name": "布拖县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513430",
    "name": "金阳县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513431",
    "name": "昭觉县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513432",
    "name": "喜德县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513433",
    "name": "冕宁县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513434",
    "name": "越西县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513435",
    "name": "甘洛县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513436",
    "name": "美姑县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "513437",
    "name": "雷波县",
    "parent_id": "513400",
    "level_type": "3" },

  {
    "id": "520000",
    "name": "贵州省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "520100",
    "name": "贵阳市",
    "parent_id": "520000",
    "level_type": "2" },

  {
    "id": "520102",
    "name": "南明区",
    "parent_id": "520100",
    "level_type": "3" },

  {
    "id": "520103",
    "name": "云岩区",
    "parent_id": "520100",
    "level_type": "3" },

  {
    "id": "520111",
    "name": "花溪区",
    "parent_id": "520100",
    "level_type": "3" },

  {
    "id": "520112",
    "name": "乌当区",
    "parent_id": "520100",
    "level_type": "3" },

  {
    "id": "520113",
    "name": "白云区",
    "parent_id": "520100",
    "level_type": "3" },

  {
    "id": "520115",
    "name": "观山湖区",
    "parent_id": "520100",
    "level_type": "3" },

  {
    "id": "520121",
    "name": "开阳县",
    "parent_id": "520100",
    "level_type": "3" },

  {
    "id": "520122",
    "name": "息烽县",
    "parent_id": "520100",
    "level_type": "3" },

  {
    "id": "520123",
    "name": "修文县",
    "parent_id": "520100",
    "level_type": "3" },

  {
    "id": "520181",
    "name": "清镇市",
    "parent_id": "520100",
    "level_type": "3" },

  {
    "id": "520200",
    "name": "六盘水市",
    "parent_id": "520000",
    "level_type": "2" },

  {
    "id": "520201",
    "name": "钟山区",
    "parent_id": "520200",
    "level_type": "3" },

  {
    "id": "520203",
    "name": "六枝特区",
    "parent_id": "520200",
    "level_type": "3" },

  {
    "id": "520221",
    "name": "水城县",
    "parent_id": "520200",
    "level_type": "3" },

  {
    "id": "520222",
    "name": "盘县",
    "parent_id": "520200",
    "level_type": "3" },

  {
    "id": "520300",
    "name": "遵义市",
    "parent_id": "520000",
    "level_type": "2" },

  {
    "id": "520302",
    "name": "红花岗区",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520303",
    "name": "汇川区",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520321",
    "name": "遵义县",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520322",
    "name": "桐梓县",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520323",
    "name": "绥阳县",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520324",
    "name": "正安县",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520325",
    "name": "道真仡佬族苗族自治县",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520326",
    "name": "务川仡佬族苗族自治县",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520327",
    "name": "凤冈县",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520328",
    "name": "湄潭县",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520329",
    "name": "余庆县",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520330",
    "name": "习水县",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520381",
    "name": "赤水市",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520382",
    "name": "仁怀市",
    "parent_id": "520300",
    "level_type": "3" },

  {
    "id": "520400",
    "name": "安顺市",
    "parent_id": "520000",
    "level_type": "2" },

  {
    "id": "520402",
    "name": "西秀区",
    "parent_id": "520400",
    "level_type": "3" },

  {
    "id": "520421",
    "name": "平坝区",
    "parent_id": "520400",
    "level_type": "3" },

  {
    "id": "520422",
    "name": "普定县",
    "parent_id": "520400",
    "level_type": "3" },

  {
    "id": "520423",
    "name": "镇宁布依族苗族自治县",
    "parent_id": "520400",
    "level_type": "3" },

  {
    "id": "520424",
    "name": "关岭布依族苗族自治县",
    "parent_id": "520400",
    "level_type": "3" },

  {
    "id": "520425",
    "name": "紫云苗族布依族自治县",
    "parent_id": "520400",
    "level_type": "3" },

  {
    "id": "520500",
    "name": "毕节市",
    "parent_id": "520000",
    "level_type": "2" },

  {
    "id": "520502",
    "name": "七星关区",
    "parent_id": "520500",
    "level_type": "3" },

  {
    "id": "520521",
    "name": "大方县",
    "parent_id": "520500",
    "level_type": "3" },

  {
    "id": "520522",
    "name": "黔西县",
    "parent_id": "520500",
    "level_type": "3" },

  {
    "id": "520523",
    "name": "金沙县",
    "parent_id": "520500",
    "level_type": "3" },

  {
    "id": "520524",
    "name": "织金县",
    "parent_id": "520500",
    "level_type": "3" },

  {
    "id": "520525",
    "name": "纳雍县",
    "parent_id": "520500",
    "level_type": "3" },

  {
    "id": "520526",
    "name": "威宁彝族回族苗族自治县",
    "parent_id": "520500",
    "level_type": "3" },

  {
    "id": "520527",
    "name": "赫章县",
    "parent_id": "520500",
    "level_type": "3" },

  {
    "id": "520600",
    "name": "铜仁市",
    "parent_id": "520000",
    "level_type": "2" },

  {
    "id": "520602",
    "name": "碧江区",
    "parent_id": "520600",
    "level_type": "3" },

  {
    "id": "520603",
    "name": "万山区",
    "parent_id": "520600",
    "level_type": "3" },

  {
    "id": "520621",
    "name": "江口县",
    "parent_id": "520600",
    "level_type": "3" },

  {
    "id": "520622",
    "name": "玉屏侗族自治县",
    "parent_id": "520600",
    "level_type": "3" },

  {
    "id": "520623",
    "name": "石阡县",
    "parent_id": "520600",
    "level_type": "3" },

  {
    "id": "520624",
    "name": "思南县",
    "parent_id": "520600",
    "level_type": "3" },

  {
    "id": "520625",
    "name": "印江土家族苗族自治县",
    "parent_id": "520600",
    "level_type": "3" },

  {
    "id": "520626",
    "name": "德江县",
    "parent_id": "520600",
    "level_type": "3" },

  {
    "id": "520627",
    "name": "沿河土家族自治县",
    "parent_id": "520600",
    "level_type": "3" },

  {
    "id": "520628",
    "name": "松桃苗族自治县",
    "parent_id": "520600",
    "level_type": "3" },

  {
    "id": "522300",
    "name": "黔西南布依族苗族自治州",
    "parent_id": "520000",
    "level_type": "2" },

  {
    "id": "522301",
    "name": "兴义市 ",
    "parent_id": "522300",
    "level_type": "3" },

  {
    "id": "522322",
    "name": "兴仁县",
    "parent_id": "522300",
    "level_type": "3" },

  {
    "id": "522323",
    "name": "普安县",
    "parent_id": "522300",
    "level_type": "3" },

  {
    "id": "522324",
    "name": "晴隆县",
    "parent_id": "522300",
    "level_type": "3" },

  {
    "id": "522325",
    "name": "贞丰县",
    "parent_id": "522300",
    "level_type": "3" },

  {
    "id": "522326",
    "name": "望谟县",
    "parent_id": "522300",
    "level_type": "3" },

  {
    "id": "522327",
    "name": "册亨县",
    "parent_id": "522300",
    "level_type": "3" },

  {
    "id": "522328",
    "name": "安龙县",
    "parent_id": "522300",
    "level_type": "3" },

  {
    "id": "522600",
    "name": "黔东南苗族侗族自治州",
    "parent_id": "520000",
    "level_type": "2" },

  {
    "id": "522601",
    "name": "凯里市",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522622",
    "name": "黄平县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522623",
    "name": "施秉县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522624",
    "name": "三穗县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522625",
    "name": "镇远县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522626",
    "name": "岑巩县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522627",
    "name": "天柱县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522628",
    "name": "锦屏县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522629",
    "name": "剑河县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522630",
    "name": "台江县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522631",
    "name": "黎平县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522632",
    "name": "榕江县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522633",
    "name": "从江县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522634",
    "name": "雷山县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522635",
    "name": "麻江县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522636",
    "name": "丹寨县",
    "parent_id": "522600",
    "level_type": "3" },

  {
    "id": "522700",
    "name": "黔南布依族苗族自治州",
    "parent_id": "520000",
    "level_type": "2" },

  {
    "id": "522701",
    "name": "都匀市",
    "parent_id": "522700",
    "level_type": "3" },

  {
    "id": "522702",
    "name": "福泉市",
    "parent_id": "522700",
    "level_type": "3" },

  {
    "id": "522722",
    "name": "荔波县",
    "parent_id": "522700",
    "level_type": "3" },

  {
    "id": "522723",
    "name": "贵定县",
    "parent_id": "522700",
    "level_type": "3" },

  {
    "id": "522725",
    "name": "瓮安县",
    "parent_id": "522700",
    "level_type": "3" },

  {
    "id": "522726",
    "name": "独山县",
    "parent_id": "522700",
    "level_type": "3" },

  {
    "id": "522727",
    "name": "平塘县",
    "parent_id": "522700",
    "level_type": "3" },

  {
    "id": "522728",
    "name": "罗甸县",
    "parent_id": "522700",
    "level_type": "3" },

  {
    "id": "522729",
    "name": "长顺县",
    "parent_id": "522700",
    "level_type": "3" },

  {
    "id": "522730",
    "name": "龙里县",
    "parent_id": "522700",
    "level_type": "3" },

  {
    "id": "522731",
    "name": "惠水县",
    "parent_id": "522700",
    "level_type": "3" },

  {
    "id": "522732",
    "name": "三都水族自治县",
    "parent_id": "522700",
    "level_type": "3" },

  {
    "id": "530000",
    "name": "云南省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "530100",
    "name": "昆明市",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "530102",
    "name": "五华区",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530103",
    "name": "盘龙区",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530111",
    "name": "官渡区",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530112",
    "name": "西山区",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530113",
    "name": "东川区",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530114",
    "name": "呈贡区",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530122",
    "name": "晋宁县",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530124",
    "name": "富民县",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530125",
    "name": "宜良县",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530126",
    "name": "石林彝族自治县",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530127",
    "name": "嵩明县",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530128",
    "name": "禄劝彝族苗族自治县",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530129",
    "name": "寻甸回族彝族自治县 ",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530181",
    "name": "安宁市",
    "parent_id": "530100",
    "level_type": "3" },

  {
    "id": "530300",
    "name": "曲靖市",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "530302",
    "name": "麒麟区",
    "parent_id": "530300",
    "level_type": "3" },

  {
    "id": "530321",
    "name": "马龙县",
    "parent_id": "530300",
    "level_type": "3" },

  {
    "id": "530322",
    "name": "陆良县",
    "parent_id": "530300",
    "level_type": "3" },

  {
    "id": "530323",
    "name": "师宗县",
    "parent_id": "530300",
    "level_type": "3" },

  {
    "id": "530324",
    "name": "罗平县",
    "parent_id": "530300",
    "level_type": "3" },

  {
    "id": "530325",
    "name": "富源县",
    "parent_id": "530300",
    "level_type": "3" },

  {
    "id": "530326",
    "name": "会泽县",
    "parent_id": "530300",
    "level_type": "3" },

  {
    "id": "530328",
    "name": "沾益县",
    "parent_id": "530300",
    "level_type": "3" },

  {
    "id": "530381",
    "name": "宣威市",
    "parent_id": "530300",
    "level_type": "3" },

  {
    "id": "530400",
    "name": "玉溪市",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "530402",
    "name": "红塔区",
    "parent_id": "530400",
    "level_type": "3" },

  {
    "id": "530421",
    "name": "江川县",
    "parent_id": "530400",
    "level_type": "3" },

  {
    "id": "530422",
    "name": "澄江县",
    "parent_id": "530400",
    "level_type": "3" },

  {
    "id": "530423",
    "name": "通海县",
    "parent_id": "530400",
    "level_type": "3" },

  {
    "id": "530424",
    "name": "华宁县",
    "parent_id": "530400",
    "level_type": "3" },

  {
    "id": "530425",
    "name": "易门县",
    "parent_id": "530400",
    "level_type": "3" },

  {
    "id": "530426",
    "name": "峨山彝族自治县",
    "parent_id": "530400",
    "level_type": "3" },

  {
    "id": "530427",
    "name": "新平彝族傣族自治县",
    "parent_id": "530400",
    "level_type": "3" },

  {
    "id": "530428",
    "name": "元江哈尼族彝族傣族自治县",
    "parent_id": "530400",
    "level_type": "3" },

  {
    "id": "530500",
    "name": "保山市",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "530502",
    "name": "隆阳区",
    "parent_id": "530500",
    "level_type": "3" },

  {
    "id": "530521",
    "name": "施甸县",
    "parent_id": "530500",
    "level_type": "3" },

  {
    "id": "530522",
    "name": "腾冲县",
    "parent_id": "530500",
    "level_type": "3" },

  {
    "id": "530523",
    "name": "龙陵县",
    "parent_id": "530500",
    "level_type": "3" },

  {
    "id": "530524",
    "name": "昌宁县",
    "parent_id": "530500",
    "level_type": "3" },

  {
    "id": "530600",
    "name": "昭通市",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "530602",
    "name": "昭阳区",
    "parent_id": "530600",
    "level_type": "3" },

  {
    "id": "530621",
    "name": "鲁甸县",
    "parent_id": "530600",
    "level_type": "3" },

  {
    "id": "530622",
    "name": "巧家县",
    "parent_id": "530600",
    "level_type": "3" },

  {
    "id": "530623",
    "name": "盐津县",
    "parent_id": "530600",
    "level_type": "3" },

  {
    "id": "530624",
    "name": "大关县",
    "parent_id": "530600",
    "level_type": "3" },

  {
    "id": "530625",
    "name": "永善县",
    "parent_id": "530600",
    "level_type": "3" },

  {
    "id": "530626",
    "name": "绥江县",
    "parent_id": "530600",
    "level_type": "3" },

  {
    "id": "530627",
    "name": "镇雄县",
    "parent_id": "530600",
    "level_type": "3" },

  {
    "id": "530628",
    "name": "彝良县",
    "parent_id": "530600",
    "level_type": "3" },

  {
    "id": "530629",
    "name": "威信县",
    "parent_id": "530600",
    "level_type": "3" },

  {
    "id": "530630",
    "name": "水富县",
    "parent_id": "530600",
    "level_type": "3" },

  {
    "id": "530700",
    "name": "丽江市",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "530702",
    "name": "古城区",
    "parent_id": "530700",
    "level_type": "3" },

  {
    "id": "530721",
    "name": "玉龙纳西族自治县",
    "parent_id": "530700",
    "level_type": "3" },

  {
    "id": "530722",
    "name": "永胜县",
    "parent_id": "530700",
    "level_type": "3" },

  {
    "id": "530723",
    "name": "华坪县",
    "parent_id": "530700",
    "level_type": "3" },

  {
    "id": "530724",
    "name": "宁蒗彝族自治县",
    "parent_id": "530700",
    "level_type": "3" },

  {
    "id": "530800",
    "name": "普洱市",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "530802",
    "name": "思茅区",
    "parent_id": "530800",
    "level_type": "3" },

  {
    "id": "530821",
    "name": "宁洱哈尼族彝族自治县",
    "parent_id": "530800",
    "level_type": "3" },

  {
    "id": "530822",
    "name": "墨江哈尼族自治县",
    "parent_id": "530800",
    "level_type": "3" },

  {
    "id": "530823",
    "name": "景东彝族自治县",
    "parent_id": "530800",
    "level_type": "3" },

  {
    "id": "530824",
    "name": "景谷傣族彝族自治县",
    "parent_id": "530800",
    "level_type": "3" },

  {
    "id": "530825",
    "name": "镇沅彝族哈尼族拉祜族自治县",
    "parent_id": "530800",
    "level_type": "3" },

  {
    "id": "530826",
    "name": "江城哈尼族彝族自治县",
    "parent_id": "530800",
    "level_type": "3" },

  {
    "id": "530827",
    "name": "孟连傣族拉祜族佤族自治县",
    "parent_id": "530800",
    "level_type": "3" },

  {
    "id": "530828",
    "name": "澜沧拉祜族自治县",
    "parent_id": "530800",
    "level_type": "3" },

  {
    "id": "530829",
    "name": "西盟佤族自治县",
    "parent_id": "530800",
    "level_type": "3" },

  {
    "id": "530900",
    "name": "临沧市",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "530902",
    "name": "临翔区",
    "parent_id": "530900",
    "level_type": "3" },

  {
    "id": "530921",
    "name": "凤庆县",
    "parent_id": "530900",
    "level_type": "3" },

  {
    "id": "530922",
    "name": "云县",
    "parent_id": "530900",
    "level_type": "3" },

  {
    "id": "530923",
    "name": "永德县",
    "parent_id": "530900",
    "level_type": "3" },

  {
    "id": "530924",
    "name": "镇康县",
    "parent_id": "530900",
    "level_type": "3" },

  {
    "id": "530925",
    "name": "双江拉祜族佤族布朗族傣族自治县",
    "parent_id": "530900",
    "level_type": "3" },

  {
    "id": "530926",
    "name": "耿马傣族佤族自治县",
    "parent_id": "530900",
    "level_type": "3" },

  {
    "id": "530927",
    "name": "沧源佤族自治县",
    "parent_id": "530900",
    "level_type": "3" },

  {
    "id": "532300",
    "name": "楚雄彝族自治州",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "532301",
    "name": "楚雄市",
    "parent_id": "532300",
    "level_type": "3" },

  {
    "id": "532322",
    "name": "双柏县",
    "parent_id": "532300",
    "level_type": "3" },

  {
    "id": "532323",
    "name": "牟定县",
    "parent_id": "532300",
    "level_type": "3" },

  {
    "id": "532324",
    "name": "南华县",
    "parent_id": "532300",
    "level_type": "3" },

  {
    "id": "532325",
    "name": "姚安县",
    "parent_id": "532300",
    "level_type": "3" },

  {
    "id": "532326",
    "name": "大姚县",
    "parent_id": "532300",
    "level_type": "3" },

  {
    "id": "532327",
    "name": "永仁县",
    "parent_id": "532300",
    "level_type": "3" },

  {
    "id": "532328",
    "name": "元谋县",
    "parent_id": "532300",
    "level_type": "3" },

  {
    "id": "532329",
    "name": "武定县",
    "parent_id": "532300",
    "level_type": "3" },

  {
    "id": "532331",
    "name": "禄丰县",
    "parent_id": "532300",
    "level_type": "3" },

  {
    "id": "532500",
    "name": "红河哈尼族彝族自治州",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "532501",
    "name": "个旧市",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532502",
    "name": "开远市",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532503",
    "name": "蒙自市",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532504",
    "name": "弥勒市",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532523",
    "name": "屏边苗族自治县",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532524",
    "name": "建水县",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532525",
    "name": "石屏县",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532527",
    "name": "泸西县",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532528",
    "name": "元阳县",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532529",
    "name": "红河县",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532530",
    "name": "金平苗族瑶族傣族自治县",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532531",
    "name": "绿春县",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532532",
    "name": "河口瑶族自治县",
    "parent_id": "532500",
    "level_type": "3" },

  {
    "id": "532600",
    "name": "文山壮族苗族自治州",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "532601",
    "name": "文山市",
    "parent_id": "532600",
    "level_type": "3" },

  {
    "id": "532622",
    "name": "砚山县",
    "parent_id": "532600",
    "level_type": "3" },

  {
    "id": "532623",
    "name": "西畴县",
    "parent_id": "532600",
    "level_type": "3" },

  {
    "id": "532624",
    "name": "麻栗坡县",
    "parent_id": "532600",
    "level_type": "3" },

  {
    "id": "532625",
    "name": "马关县",
    "parent_id": "532600",
    "level_type": "3" },

  {
    "id": "532626",
    "name": "丘北县",
    "parent_id": "532600",
    "level_type": "3" },

  {
    "id": "532627",
    "name": "广南县",
    "parent_id": "532600",
    "level_type": "3" },

  {
    "id": "532628",
    "name": "富宁县",
    "parent_id": "532600",
    "level_type": "3" },

  {
    "id": "532800",
    "name": "西双版纳傣族自治州",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "532801",
    "name": "景洪市",
    "parent_id": "532800",
    "level_type": "3" },

  {
    "id": "532822",
    "name": "勐海县",
    "parent_id": "532800",
    "level_type": "3" },

  {
    "id": "532823",
    "name": "勐腊县",
    "parent_id": "532800",
    "level_type": "3" },

  {
    "id": "532900",
    "name": "大理白族自治州",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "532901",
    "name": "大理市",
    "parent_id": "532900",
    "level_type": "3" },

  {
    "id": "532922",
    "name": "漾濞彝族自治县",
    "parent_id": "532900",
    "level_type": "3" },

  {
    "id": "532923",
    "name": "祥云县",
    "parent_id": "532900",
    "level_type": "3" },

  {
    "id": "532924",
    "name": "宾川县",
    "parent_id": "532900",
    "level_type": "3" },

  {
    "id": "532925",
    "name": "弥渡县",
    "parent_id": "532900",
    "level_type": "3" },

  {
    "id": "532926",
    "name": "南涧彝族自治县",
    "parent_id": "532900",
    "level_type": "3" },

  {
    "id": "532927",
    "name": "巍山彝族回族自治县",
    "parent_id": "532900",
    "level_type": "3" },

  {
    "id": "532928",
    "name": "永平县",
    "parent_id": "532900",
    "level_type": "3" },

  {
    "id": "532929",
    "name": "云龙县",
    "parent_id": "532900",
    "level_type": "3" },

  {
    "id": "532930",
    "name": "洱源县",
    "parent_id": "532900",
    "level_type": "3" },

  {
    "id": "532931",
    "name": "剑川县",
    "parent_id": "532900",
    "level_type": "3" },

  {
    "id": "532932",
    "name": "鹤庆县",
    "parent_id": "532900",
    "level_type": "3" },

  {
    "id": "533100",
    "name": "德宏傣族景颇族自治州",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "533102",
    "name": "瑞丽市",
    "parent_id": "533100",
    "level_type": "3" },

  {
    "id": "533103",
    "name": "芒市",
    "parent_id": "533100",
    "level_type": "3" },

  {
    "id": "533122",
    "name": "梁河县",
    "parent_id": "533100",
    "level_type": "3" },

  {
    "id": "533123",
    "name": "盈江县",
    "parent_id": "533100",
    "level_type": "3" },

  {
    "id": "533124",
    "name": "陇川县",
    "parent_id": "533100",
    "level_type": "3" },

  {
    "id": "533300",
    "name": "怒江傈僳族自治州",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "533321",
    "name": "泸水县",
    "parent_id": "533300",
    "level_type": "3" },

  {
    "id": "533323",
    "name": "福贡县",
    "parent_id": "533300",
    "level_type": "3" },

  {
    "id": "533324",
    "name": "贡山独龙族怒族自治县",
    "parent_id": "533300",
    "level_type": "3" },

  {
    "id": "533325",
    "name": "兰坪白族普米族自治县",
    "parent_id": "533300",
    "level_type": "3" },

  {
    "id": "533400",
    "name": "迪庆藏族自治州",
    "parent_id": "530000",
    "level_type": "2" },

  {
    "id": "533421",
    "name": "香格里拉市",
    "parent_id": "533400",
    "level_type": "3" },

  {
    "id": "533422",
    "name": "德钦县",
    "parent_id": "533400",
    "level_type": "3" },

  {
    "id": "533423",
    "name": "维西傈僳族自治县",
    "parent_id": "533400",
    "level_type": "3" },

  {
    "id": "540000",
    "name": "西藏自治区",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "540100",
    "name": "拉萨市",
    "parent_id": "540000",
    "level_type": "2" },

  {
    "id": "540102",
    "name": "城关区",
    "parent_id": "540100",
    "level_type": "3" },

  {
    "id": "540121",
    "name": "林周县",
    "parent_id": "540100",
    "level_type": "3" },

  {
    "id": "540122",
    "name": "当雄县",
    "parent_id": "540100",
    "level_type": "3" },

  {
    "id": "540123",
    "name": "尼木县",
    "parent_id": "540100",
    "level_type": "3" },

  {
    "id": "540124",
    "name": "曲水县",
    "parent_id": "540100",
    "level_type": "3" },

  {
    "id": "540125",
    "name": "堆龙德庆县",
    "parent_id": "540100",
    "level_type": "3" },

  {
    "id": "540126",
    "name": "达孜县",
    "parent_id": "540100",
    "level_type": "3" },

  {
    "id": "540127",
    "name": "墨竹工卡县",
    "parent_id": "540100",
    "level_type": "3" },

  {
    "id": "540200",
    "name": "日喀则市",
    "parent_id": "540000",
    "level_type": "2" },

  {
    "id": "540202",
    "name": "桑珠孜区",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540221",
    "name": "南木林县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540222",
    "name": "江孜县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540223",
    "name": "定日县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540224",
    "name": "萨迦县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540225",
    "name": "拉孜县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540226",
    "name": "昂仁县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540227",
    "name": "谢通门县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540228",
    "name": "白朗县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540229",
    "name": "仁布县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540230",
    "name": "康马县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540231",
    "name": "定结县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540232",
    "name": "仲巴县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540233",
    "name": "亚东县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540234",
    "name": "吉隆县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540235",
    "name": "聂拉木县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540236",
    "name": "萨嘎县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540237",
    "name": "岗巴县",
    "parent_id": "540200",
    "level_type": "3" },

  {
    "id": "540300",
    "name": "昌都市",
    "parent_id": "540000",
    "level_type": "2" },

  {
    "id": "540302",
    "name": "卡若区",
    "parent_id": "540300",
    "level_type": "3" },

  {
    "id": "540321",
    "name": "江达县",
    "parent_id": "540300",
    "level_type": "3" },

  {
    "id": "540322",
    "name": "贡觉县",
    "parent_id": "540300",
    "level_type": "3" },

  {
    "id": "540323",
    "name": "类乌齐县",
    "parent_id": "540300",
    "level_type": "3" },

  {
    "id": "540324",
    "name": "丁青县",
    "parent_id": "540300",
    "level_type": "3" },

  {
    "id": "540325",
    "name": "察雅县",
    "parent_id": "540300",
    "level_type": "3" },

  {
    "id": "540326",
    "name": "八宿县",
    "parent_id": "540300",
    "level_type": "3" },

  {
    "id": "540327",
    "name": "左贡县",
    "parent_id": "540300",
    "level_type": "3" },

  {
    "id": "540328",
    "name": "芒康县",
    "parent_id": "540300",
    "level_type": "3" },

  {
    "id": "540329",
    "name": "洛隆县",
    "parent_id": "540300",
    "level_type": "3" },

  {
    "id": "540330",
    "name": "边坝县",
    "parent_id": "540300",
    "level_type": "3" },

  {
    "id": "542200",
    "name": "山南地区",
    "parent_id": "540000",
    "level_type": "2" },

  {
    "id": "542221",
    "name": "乃东县",
    "parent_id": "542200",
    "level_type": "3" },

  {
    "id": "542222",
    "name": "扎囊县",
    "parent_id": "542200",
    "level_type": "3" },

  {
    "id": "542223",
    "name": "贡嘎县",
    "parent_id": "542200",
    "level_type": "3" },

  {
    "id": "542224",
    "name": "桑日县",
    "parent_id": "542200",
    "level_type": "3" },

  {
    "id": "542225",
    "name": "琼结县",
    "parent_id": "542200",
    "level_type": "3" },

  {
    "id": "542226",
    "name": "曲松县",
    "parent_id": "542200",
    "level_type": "3" },

  {
    "id": "542227",
    "name": "措美县",
    "parent_id": "542200",
    "level_type": "3" },

  {
    "id": "542228",
    "name": "洛扎县",
    "parent_id": "542200",
    "level_type": "3" },

  {
    "id": "542229",
    "name": "加查县",
    "parent_id": "542200",
    "level_type": "3" },

  {
    "id": "542231",
    "name": "隆子县",
    "parent_id": "542200",
    "level_type": "3" },

  {
    "id": "542232",
    "name": "错那县",
    "parent_id": "542200",
    "level_type": "3" },

  {
    "id": "542233",
    "name": "浪卡子县",
    "parent_id": "542200",
    "level_type": "3" },

  {
    "id": "542400",
    "name": "那曲地区",
    "parent_id": "540000",
    "level_type": "2" },

  {
    "id": "542421",
    "name": "那曲县",
    "parent_id": "542400",
    "level_type": "3" },

  {
    "id": "542422",
    "name": "嘉黎县",
    "parent_id": "542400",
    "level_type": "3" },

  {
    "id": "542423",
    "name": "比如县",
    "parent_id": "542400",
    "level_type": "3" },

  {
    "id": "542424",
    "name": "聂荣县",
    "parent_id": "542400",
    "level_type": "3" },

  {
    "id": "542425",
    "name": "安多县",
    "parent_id": "542400",
    "level_type": "3" },

  {
    "id": "542426",
    "name": "申扎县",
    "parent_id": "542400",
    "level_type": "3" },

  {
    "id": "542427",
    "name": "索县",
    "parent_id": "542400",
    "level_type": "3" },

  {
    "id": "542428",
    "name": "班戈县",
    "parent_id": "542400",
    "level_type": "3" },

  {
    "id": "542429",
    "name": "巴青县",
    "parent_id": "542400",
    "level_type": "3" },

  {
    "id": "542430",
    "name": "尼玛县",
    "parent_id": "542400",
    "level_type": "3" },

  {
    "id": "542431",
    "name": "双湖县",
    "parent_id": "542400",
    "level_type": "3" },

  {
    "id": "542500",
    "name": "阿里地区",
    "parent_id": "540000",
    "level_type": "2" },

  {
    "id": "542521",
    "name": "普兰县",
    "parent_id": "542500",
    "level_type": "3" },

  {
    "id": "542522",
    "name": "札达县",
    "parent_id": "542500",
    "level_type": "3" },

  {
    "id": "542523",
    "name": "噶尔县",
    "parent_id": "542500",
    "level_type": "3" },

  {
    "id": "542524",
    "name": "日土县",
    "parent_id": "542500",
    "level_type": "3" },

  {
    "id": "542525",
    "name": "革吉县",
    "parent_id": "542500",
    "level_type": "3" },

  {
    "id": "542526",
    "name": "改则县",
    "parent_id": "542500",
    "level_type": "3" },

  {
    "id": "542527",
    "name": "措勤县",
    "parent_id": "542500",
    "level_type": "3" },

  {
    "id": "542600",
    "name": "林芝地区",
    "parent_id": "540000",
    "level_type": "2" },

  {
    "id": "542621",
    "name": "林芝县",
    "parent_id": "542600",
    "level_type": "3" },

  {
    "id": "542622",
    "name": "工布江达县",
    "parent_id": "542600",
    "level_type": "3" },

  {
    "id": "542623",
    "name": "米林县",
    "parent_id": "542600",
    "level_type": "3" },

  {
    "id": "542624",
    "name": "墨脱县",
    "parent_id": "542600",
    "level_type": "3" },

  {
    "id": "542625",
    "name": "波密县",
    "parent_id": "542600",
    "level_type": "3" },

  {
    "id": "542626",
    "name": "察隅县",
    "parent_id": "542600",
    "level_type": "3" },

  {
    "id": "542627",
    "name": "朗县",
    "parent_id": "542600",
    "level_type": "3" },

  {
    "id": "610000",
    "name": "陕西省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "610100",
    "name": "西安市",
    "parent_id": "610000",
    "level_type": "2" },

  {
    "id": "610102",
    "name": "新城区",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610103",
    "name": "碑林区",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610104",
    "name": "莲湖区",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610111",
    "name": "灞桥区",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610112",
    "name": "未央区",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610113",
    "name": "雁塔区",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610114",
    "name": "阎良区",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610115",
    "name": "临潼区",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610116",
    "name": "长安区",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610122",
    "name": "蓝田县",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610124",
    "name": "周至县",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610125",
    "name": "户县",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610126",
    "name": "高陵区",
    "parent_id": "610100",
    "level_type": "3" },

  {
    "id": "610200",
    "name": "铜川市",
    "parent_id": "610000",
    "level_type": "2" },

  {
    "id": "610202",
    "name": "王益区",
    "parent_id": "610200",
    "level_type": "3" },

  {
    "id": "610203",
    "name": "印台区",
    "parent_id": "610200",
    "level_type": "3" },

  {
    "id": "610204",
    "name": "耀州区",
    "parent_id": "610200",
    "level_type": "3" },

  {
    "id": "610222",
    "name": "宜君县",
    "parent_id": "610200",
    "level_type": "3" },

  {
    "id": "610300",
    "name": "宝鸡市",
    "parent_id": "610000",
    "level_type": "2" },

  {
    "id": "610302",
    "name": "渭滨区",
    "parent_id": "610300",
    "level_type": "3" },

  {
    "id": "610303",
    "name": "金台区",
    "parent_id": "610300",
    "level_type": "3" },

  {
    "id": "610304",
    "name": "陈仓区",
    "parent_id": "610300",
    "level_type": "3" },

  {
    "id": "610322",
    "name": "凤翔县",
    "parent_id": "610300",
    "level_type": "3" },

  {
    "id": "610323",
    "name": "岐山县",
    "parent_id": "610300",
    "level_type": "3" },

  {
    "id": "610324",
    "name": "扶风县",
    "parent_id": "610300",
    "level_type": "3" },

  {
    "id": "610326",
    "name": "眉县",
    "parent_id": "610300",
    "level_type": "3" },

  {
    "id": "610327",
    "name": "陇县",
    "parent_id": "610300",
    "level_type": "3" },

  {
    "id": "610328",
    "name": "千阳县",
    "parent_id": "610300",
    "level_type": "3" },

  {
    "id": "610329",
    "name": "麟游县",
    "parent_id": "610300",
    "level_type": "3" },

  {
    "id": "610330",
    "name": "凤县",
    "parent_id": "610300",
    "level_type": "3" },

  {
    "id": "610331",
    "name": "太白县",
    "parent_id": "610300",
    "level_type": "3" },

  {
    "id": "610400",
    "name": "咸阳市",
    "parent_id": "610000",
    "level_type": "2" },

  {
    "id": "610402",
    "name": "秦都区",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610403",
    "name": "杨陵区",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610404",
    "name": "渭城区",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610422",
    "name": "三原县",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610423",
    "name": "泾阳县",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610424",
    "name": "乾县",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610425",
    "name": "礼泉县",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610426",
    "name": "永寿县",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610427",
    "name": "彬县",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610428",
    "name": "长武县",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610429",
    "name": "旬邑县",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610430",
    "name": "淳化县",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610431",
    "name": "武功县",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610481",
    "name": "兴平市",
    "parent_id": "610400",
    "level_type": "3" },

  {
    "id": "610500",
    "name": "渭南市",
    "parent_id": "610000",
    "level_type": "2" },

  {
    "id": "610502",
    "name": "临渭区",
    "parent_id": "610500",
    "level_type": "3" },

  {
    "id": "610521",
    "name": "华县",
    "parent_id": "610500",
    "level_type": "3" },

  {
    "id": "610522",
    "name": "潼关县",
    "parent_id": "610500",
    "level_type": "3" },

  {
    "id": "610523",
    "name": "大荔县",
    "parent_id": "610500",
    "level_type": "3" },

  {
    "id": "610524",
    "name": "合阳县",
    "parent_id": "610500",
    "level_type": "3" },

  {
    "id": "610525",
    "name": "澄城县",
    "parent_id": "610500",
    "level_type": "3" },

  {
    "id": "610526",
    "name": "蒲城县",
    "parent_id": "610500",
    "level_type": "3" },

  {
    "id": "610527",
    "name": "白水县",
    "parent_id": "610500",
    "level_type": "3" },

  {
    "id": "610528",
    "name": "富平县",
    "parent_id": "610500",
    "level_type": "3" },

  {
    "id": "610581",
    "name": "韩城市",
    "parent_id": "610500",
    "level_type": "3" },

  {
    "id": "610582",
    "name": "华阴市",
    "parent_id": "610500",
    "level_type": "3" },

  {
    "id": "610600",
    "name": "延安市",
    "parent_id": "610000",
    "level_type": "2" },

  {
    "id": "610602",
    "name": "宝塔区",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610621",
    "name": "延长县",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610622",
    "name": "延川县",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610623",
    "name": "子长县",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610624",
    "name": "安塞县",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610625",
    "name": "志丹县",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610626",
    "name": "吴起县",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610627",
    "name": "甘泉县",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610628",
    "name": "富县",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610629",
    "name": "洛川县",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610630",
    "name": "宜川县",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610631",
    "name": "黄龙县",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610632",
    "name": "黄陵县",
    "parent_id": "610600",
    "level_type": "3" },

  {
    "id": "610700",
    "name": "汉中市",
    "parent_id": "610000",
    "level_type": "2" },

  {
    "id": "610702",
    "name": "汉台区",
    "parent_id": "610700",
    "level_type": "3" },

  {
    "id": "610721",
    "name": "南郑县",
    "parent_id": "610700",
    "level_type": "3" },

  {
    "id": "610722",
    "name": "城固县",
    "parent_id": "610700",
    "level_type": "3" },

  {
    "id": "610723",
    "name": "洋县",
    "parent_id": "610700",
    "level_type": "3" },

  {
    "id": "610724",
    "name": "西乡县",
    "parent_id": "610700",
    "level_type": "3" },

  {
    "id": "610725",
    "name": "勉县",
    "parent_id": "610700",
    "level_type": "3" },

  {
    "id": "610726",
    "name": "宁强县",
    "parent_id": "610700",
    "level_type": "3" },

  {
    "id": "610727",
    "name": "略阳县",
    "parent_id": "610700",
    "level_type": "3" },

  {
    "id": "610728",
    "name": "镇巴县",
    "parent_id": "610700",
    "level_type": "3" },

  {
    "id": "610729",
    "name": "留坝县",
    "parent_id": "610700",
    "level_type": "3" },

  {
    "id": "610730",
    "name": "佛坪县",
    "parent_id": "610700",
    "level_type": "3" },

  {
    "id": "610800",
    "name": "榆林市",
    "parent_id": "610000",
    "level_type": "2" },

  {
    "id": "610802",
    "name": "榆阳区",
    "parent_id": "610800",
    "level_type": "3" },

  {
    "id": "610821",
    "name": "神木县",
    "parent_id": "610800",
    "level_type": "3" },

  {
    "id": "610822",
    "name": "府谷县",
    "parent_id": "610800",
    "level_type": "3" },

  {
    "id": "610823",
    "name": "横山县",
    "parent_id": "610800",
    "level_type": "3" },

  {
    "id": "610824",
    "name": "靖边县",
    "parent_id": "610800",
    "level_type": "3" },

  {
    "id": "610825",
    "name": "定边县",
    "parent_id": "610800",
    "level_type": "3" },

  {
    "id": "610826",
    "name": "绥德县",
    "parent_id": "610800",
    "level_type": "3" },

  {
    "id": "610827",
    "name": "米脂县",
    "parent_id": "610800",
    "level_type": "3" },

  {
    "id": "610828",
    "name": "佳县",
    "parent_id": "610800",
    "level_type": "3" },

  {
    "id": "610829",
    "name": "吴堡县",
    "parent_id": "610800",
    "level_type": "3" },

  {
    "id": "610830",
    "name": "清涧县",
    "parent_id": "610800",
    "level_type": "3" },

  {
    "id": "610831",
    "name": "子洲县",
    "parent_id": "610800",
    "level_type": "3" },

  {
    "id": "610900",
    "name": "安康市",
    "parent_id": "610000",
    "level_type": "2" },

  {
    "id": "610902",
    "name": "汉滨区",
    "parent_id": "610900",
    "level_type": "3" },

  {
    "id": "610921",
    "name": "汉阴县",
    "parent_id": "610900",
    "level_type": "3" },

  {
    "id": "610922",
    "name": "石泉县",
    "parent_id": "610900",
    "level_type": "3" },

  {
    "id": "610923",
    "name": "宁陕县",
    "parent_id": "610900",
    "level_type": "3" },

  {
    "id": "610924",
    "name": "紫阳县",
    "parent_id": "610900",
    "level_type": "3" },

  {
    "id": "610925",
    "name": "岚皋县",
    "parent_id": "610900",
    "level_type": "3" },

  {
    "id": "610926",
    "name": "平利县",
    "parent_id": "610900",
    "level_type": "3" },

  {
    "id": "610927",
    "name": "镇坪县",
    "parent_id": "610900",
    "level_type": "3" },

  {
    "id": "610928",
    "name": "旬阳县",
    "parent_id": "610900",
    "level_type": "3" },

  {
    "id": "610929",
    "name": "白河县",
    "parent_id": "610900",
    "level_type": "3" },

  {
    "id": "611000",
    "name": "商洛市",
    "parent_id": "610000",
    "level_type": "2" },

  {
    "id": "611002",
    "name": "商州区",
    "parent_id": "611000",
    "level_type": "3" },

  {
    "id": "611021",
    "name": "洛南县",
    "parent_id": "611000",
    "level_type": "3" },

  {
    "id": "611022",
    "name": "丹凤县",
    "parent_id": "611000",
    "level_type": "3" },

  {
    "id": "611023",
    "name": "商南县",
    "parent_id": "611000",
    "level_type": "3" },

  {
    "id": "611024",
    "name": "山阳县",
    "parent_id": "611000",
    "level_type": "3" },

  {
    "id": "611025",
    "name": "镇安县",
    "parent_id": "611000",
    "level_type": "3" },

  {
    "id": "611026",
    "name": "柞水县",
    "parent_id": "611000",
    "level_type": "3" },

  {
    "id": "611100",
    "name": "西咸新区",
    "parent_id": "610000",
    "level_type": "2" },

  {
    "id": "611101",
    "name": "空港新城",
    "parent_id": "611100",
    "level_type": "3" },

  {
    "id": "611102",
    "name": "沣东新城",
    "parent_id": "611100",
    "level_type": "3" },

  {
    "id": "611103",
    "name": "秦汉新城",
    "parent_id": "611100",
    "level_type": "3" },

  {
    "id": "611104",
    "name": "沣西新城",
    "parent_id": "611100",
    "level_type": "3" },

  {
    "id": "611105",
    "name": "泾河新城",
    "parent_id": "611100",
    "level_type": "3" },

  {
    "id": "620000",
    "name": "甘肃省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "620100",
    "name": "兰州市",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "620102",
    "name": "城关区",
    "parent_id": "620100",
    "level_type": "3" },

  {
    "id": "620103",
    "name": "七里河区",
    "parent_id": "620100",
    "level_type": "3" },

  {
    "id": "620104",
    "name": "西固区",
    "parent_id": "620100",
    "level_type": "3" },

  {
    "id": "620105",
    "name": "安宁区",
    "parent_id": "620100",
    "level_type": "3" },

  {
    "id": "620111",
    "name": "红古区",
    "parent_id": "620100",
    "level_type": "3" },

  {
    "id": "620121",
    "name": "永登县",
    "parent_id": "620100",
    "level_type": "3" },

  {
    "id": "620122",
    "name": "皋兰县",
    "parent_id": "620100",
    "level_type": "3" },

  {
    "id": "620123",
    "name": "榆中县",
    "parent_id": "620100",
    "level_type": "3" },

  {
    "id": "620200",
    "name": "嘉峪关市",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "620201",
    "name": "雄关区",
    "parent_id": "620200",
    "level_type": "3" },

  {
    "id": "620202",
    "name": "长城区",
    "parent_id": "620200",
    "level_type": "3" },

  {
    "id": "620203",
    "name": "镜铁区",
    "parent_id": "620200",
    "level_type": "3" },

  {
    "id": "620300",
    "name": "金昌市",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "620302",
    "name": "金川区",
    "parent_id": "620300",
    "level_type": "3" },

  {
    "id": "620321",
    "name": "永昌县",
    "parent_id": "620300",
    "level_type": "3" },

  {
    "id": "620400",
    "name": "白银市",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "620402",
    "name": "白银区",
    "parent_id": "620400",
    "level_type": "3" },

  {
    "id": "620403",
    "name": "平川区",
    "parent_id": "620400",
    "level_type": "3" },

  {
    "id": "620421",
    "name": "靖远县",
    "parent_id": "620400",
    "level_type": "3" },

  {
    "id": "620422",
    "name": "会宁县",
    "parent_id": "620400",
    "level_type": "3" },

  {
    "id": "620423",
    "name": "景泰县",
    "parent_id": "620400",
    "level_type": "3" },

  {
    "id": "620500",
    "name": "天水市",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "620502",
    "name": "秦州区",
    "parent_id": "620500",
    "level_type": "3" },

  {
    "id": "620503",
    "name": "麦积区",
    "parent_id": "620500",
    "level_type": "3" },

  {
    "id": "620521",
    "name": "清水县",
    "parent_id": "620500",
    "level_type": "3" },

  {
    "id": "620522",
    "name": "秦安县",
    "parent_id": "620500",
    "level_type": "3" },

  {
    "id": "620523",
    "name": "甘谷县",
    "parent_id": "620500",
    "level_type": "3" },

  {
    "id": "620524",
    "name": "武山县",
    "parent_id": "620500",
    "level_type": "3" },

  {
    "id": "620525",
    "name": "张家川回族自治县",
    "parent_id": "620500",
    "level_type": "3" },

  {
    "id": "620600",
    "name": "武威市",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "620602",
    "name": "凉州区",
    "parent_id": "620600",
    "level_type": "3" },

  {
    "id": "620621",
    "name": "民勤县",
    "parent_id": "620600",
    "level_type": "3" },

  {
    "id": "620622",
    "name": "古浪县",
    "parent_id": "620600",
    "level_type": "3" },

  {
    "id": "620623",
    "name": "天祝藏族自治县",
    "parent_id": "620600",
    "level_type": "3" },

  {
    "id": "620700",
    "name": "张掖市",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "620702",
    "name": "甘州区",
    "parent_id": "620700",
    "level_type": "3" },

  {
    "id": "620721",
    "name": "肃南裕固族自治县",
    "parent_id": "620700",
    "level_type": "3" },

  {
    "id": "620722",
    "name": "民乐县",
    "parent_id": "620700",
    "level_type": "3" },

  {
    "id": "620723",
    "name": "临泽县",
    "parent_id": "620700",
    "level_type": "3" },

  {
    "id": "620724",
    "name": "高台县",
    "parent_id": "620700",
    "level_type": "3" },

  {
    "id": "620725",
    "name": "山丹县",
    "parent_id": "620700",
    "level_type": "3" },

  {
    "id": "620800",
    "name": "平凉市",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "620802",
    "name": "崆峒区",
    "parent_id": "620800",
    "level_type": "3" },

  {
    "id": "620821",
    "name": "泾川县",
    "parent_id": "620800",
    "level_type": "3" },

  {
    "id": "620822",
    "name": "灵台县",
    "parent_id": "620800",
    "level_type": "3" },

  {
    "id": "620823",
    "name": "崇信县",
    "parent_id": "620800",
    "level_type": "3" },

  {
    "id": "620824",
    "name": "华亭县",
    "parent_id": "620800",
    "level_type": "3" },

  {
    "id": "620825",
    "name": "庄浪县",
    "parent_id": "620800",
    "level_type": "3" },

  {
    "id": "620826",
    "name": "静宁县",
    "parent_id": "620800",
    "level_type": "3" },

  {
    "id": "620900",
    "name": "酒泉市",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "620902",
    "name": "肃州区",
    "parent_id": "620900",
    "level_type": "3" },

  {
    "id": "620921",
    "name": "金塔县",
    "parent_id": "620900",
    "level_type": "3" },

  {
    "id": "620922",
    "name": "瓜州县",
    "parent_id": "620900",
    "level_type": "3" },

  {
    "id": "620923",
    "name": "肃北蒙古族自治县",
    "parent_id": "620900",
    "level_type": "3" },

  {
    "id": "620924",
    "name": "阿克塞哈萨克族自治县",
    "parent_id": "620900",
    "level_type": "3" },

  {
    "id": "620981",
    "name": "玉门市",
    "parent_id": "620900",
    "level_type": "3" },

  {
    "id": "620982",
    "name": "敦煌市",
    "parent_id": "620900",
    "level_type": "3" },

  {
    "id": "621000",
    "name": "庆阳市",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "621002",
    "name": "西峰区",
    "parent_id": "621000",
    "level_type": "3" },

  {
    "id": "621021",
    "name": "庆城县",
    "parent_id": "621000",
    "level_type": "3" },

  {
    "id": "621022",
    "name": "环县",
    "parent_id": "621000",
    "level_type": "3" },

  {
    "id": "621023",
    "name": "华池县",
    "parent_id": "621000",
    "level_type": "3" },

  {
    "id": "621024",
    "name": "合水县",
    "parent_id": "621000",
    "level_type": "3" },

  {
    "id": "621025",
    "name": "正宁县",
    "parent_id": "621000",
    "level_type": "3" },

  {
    "id": "621026",
    "name": "宁县",
    "parent_id": "621000",
    "level_type": "3" },

  {
    "id": "621027",
    "name": "镇原县",
    "parent_id": "621000",
    "level_type": "3" },

  {
    "id": "621100",
    "name": "定西市",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "621102",
    "name": "安定区",
    "parent_id": "621100",
    "level_type": "3" },

  {
    "id": "621121",
    "name": "通渭县",
    "parent_id": "621100",
    "level_type": "3" },

  {
    "id": "621122",
    "name": "陇西县",
    "parent_id": "621100",
    "level_type": "3" },

  {
    "id": "621123",
    "name": "渭源县",
    "parent_id": "621100",
    "level_type": "3" },

  {
    "id": "621124",
    "name": "临洮县",
    "parent_id": "621100",
    "level_type": "3" },

  {
    "id": "621125",
    "name": "漳县",
    "parent_id": "621100",
    "level_type": "3" },

  {
    "id": "621126",
    "name": "岷县",
    "parent_id": "621100",
    "level_type": "3" },

  {
    "id": "621200",
    "name": "陇南市",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "621202",
    "name": "武都区",
    "parent_id": "621200",
    "level_type": "3" },

  {
    "id": "621221",
    "name": "成县",
    "parent_id": "621200",
    "level_type": "3" },

  {
    "id": "621222",
    "name": "文县",
    "parent_id": "621200",
    "level_type": "3" },

  {
    "id": "621223",
    "name": "宕昌县",
    "parent_id": "621200",
    "level_type": "3" },

  {
    "id": "621224",
    "name": "康县",
    "parent_id": "621200",
    "level_type": "3" },

  {
    "id": "621225",
    "name": "西和县",
    "parent_id": "621200",
    "level_type": "3" },

  {
    "id": "621226",
    "name": "礼县",
    "parent_id": "621200",
    "level_type": "3" },

  {
    "id": "621227",
    "name": "徽县",
    "parent_id": "621200",
    "level_type": "3" },

  {
    "id": "621228",
    "name": "两当县",
    "parent_id": "621200",
    "level_type": "3" },

  {
    "id": "622900",
    "name": "临夏回族自治州",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "622901",
    "name": "临夏市",
    "parent_id": "622900",
    "level_type": "3" },

  {
    "id": "622921",
    "name": "临夏县",
    "parent_id": "622900",
    "level_type": "3" },

  {
    "id": "622922",
    "name": "康乐县",
    "parent_id": "622900",
    "level_type": "3" },

  {
    "id": "622923",
    "name": "永靖县",
    "parent_id": "622900",
    "level_type": "3" },

  {
    "id": "622924",
    "name": "广河县",
    "parent_id": "622900",
    "level_type": "3" },

  {
    "id": "622925",
    "name": "和政县",
    "parent_id": "622900",
    "level_type": "3" },

  {
    "id": "622926",
    "name": "东乡族自治县",
    "parent_id": "622900",
    "level_type": "3" },

  {
    "id": "622927",
    "name": "积石山保安族东乡族撒拉族自治县",
    "parent_id": "622900",
    "level_type": "3" },

  {
    "id": "623000",
    "name": "甘南藏族自治州",
    "parent_id": "620000",
    "level_type": "2" },

  {
    "id": "623001",
    "name": "合作市",
    "parent_id": "623000",
    "level_type": "3" },

  {
    "id": "623021",
    "name": "临潭县",
    "parent_id": "623000",
    "level_type": "3" },

  {
    "id": "623022",
    "name": "卓尼县",
    "parent_id": "623000",
    "level_type": "3" },

  {
    "id": "623023",
    "name": "舟曲县",
    "parent_id": "623000",
    "level_type": "3" },

  {
    "id": "623024",
    "name": "迭部县",
    "parent_id": "623000",
    "level_type": "3" },

  {
    "id": "623025",
    "name": "玛曲县",
    "parent_id": "623000",
    "level_type": "3" },

  {
    "id": "623026",
    "name": "碌曲县",
    "parent_id": "623000",
    "level_type": "3" },

  {
    "id": "623027",
    "name": "夏河县",
    "parent_id": "623000",
    "level_type": "3" },

  {
    "id": "630000",
    "name": "青海省",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "630100",
    "name": "西宁市",
    "parent_id": "630000",
    "level_type": "2" },

  {
    "id": "630102",
    "name": "城东区",
    "parent_id": "630100",
    "level_type": "3" },

  {
    "id": "630103",
    "name": "城中区",
    "parent_id": "630100",
    "level_type": "3" },

  {
    "id": "630104",
    "name": "城西区",
    "parent_id": "630100",
    "level_type": "3" },

  {
    "id": "630105",
    "name": "城北区",
    "parent_id": "630100",
    "level_type": "3" },

  {
    "id": "630121",
    "name": "大通回族土族自治县",
    "parent_id": "630100",
    "level_type": "3" },

  {
    "id": "630122",
    "name": "湟中县",
    "parent_id": "630100",
    "level_type": "3" },

  {
    "id": "630123",
    "name": "湟源县",
    "parent_id": "630100",
    "level_type": "3" },

  {
    "id": "630200",
    "name": "海东市",
    "parent_id": "630000",
    "level_type": "2" },

  {
    "id": "630202",
    "name": "乐都区",
    "parent_id": "630200",
    "level_type": "3" },

  {
    "id": "630221",
    "name": "平安县",
    "parent_id": "630200",
    "level_type": "3" },

  {
    "id": "630222",
    "name": "民和回族土族自治县",
    "parent_id": "630200",
    "level_type": "3" },

  {
    "id": "630223",
    "name": "互助土族自治县",
    "parent_id": "630200",
    "level_type": "3" },

  {
    "id": "630224",
    "name": "化隆回族自治县",
    "parent_id": "630200",
    "level_type": "3" },

  {
    "id": "630225",
    "name": "循化撒拉族自治县",
    "parent_id": "630200",
    "level_type": "3" },

  {
    "id": "632200",
    "name": "海北藏族自治州",
    "parent_id": "630000",
    "level_type": "2" },

  {
    "id": "632221",
    "name": "门源回族自治县",
    "parent_id": "632200",
    "level_type": "3" },

  {
    "id": "632222",
    "name": "祁连县",
    "parent_id": "632200",
    "level_type": "3" },

  {
    "id": "632223",
    "name": "海晏县",
    "parent_id": "632200",
    "level_type": "3" },

  {
    "id": "632224",
    "name": "刚察县",
    "parent_id": "632200",
    "level_type": "3" },

  {
    "id": "632300",
    "name": "黄南藏族自治州",
    "parent_id": "630000",
    "level_type": "2" },

  {
    "id": "632321",
    "name": "同仁县",
    "parent_id": "632300",
    "level_type": "3" },

  {
    "id": "632322",
    "name": "尖扎县",
    "parent_id": "632300",
    "level_type": "3" },

  {
    "id": "632323",
    "name": "泽库县",
    "parent_id": "632300",
    "level_type": "3" },

  {
    "id": "632324",
    "name": "河南蒙古族自治县",
    "parent_id": "632300",
    "level_type": "3" },

  {
    "id": "632500",
    "name": "海南藏族自治州",
    "parent_id": "630000",
    "level_type": "2" },

  {
    "id": "632521",
    "name": "共和县",
    "parent_id": "632500",
    "level_type": "3" },

  {
    "id": "632522",
    "name": "同德县",
    "parent_id": "632500",
    "level_type": "3" },

  {
    "id": "632523",
    "name": "贵德县",
    "parent_id": "632500",
    "level_type": "3" },

  {
    "id": "632524",
    "name": "兴海县",
    "parent_id": "632500",
    "level_type": "3" },

  {
    "id": "632525",
    "name": "贵南县",
    "parent_id": "632500",
    "level_type": "3" },

  {
    "id": "632600",
    "name": "果洛藏族自治州",
    "parent_id": "630000",
    "level_type": "2" },

  {
    "id": "632621",
    "name": "玛沁县",
    "parent_id": "632600",
    "level_type": "3" },

  {
    "id": "632622",
    "name": "班玛县",
    "parent_id": "632600",
    "level_type": "3" },

  {
    "id": "632623",
    "name": "甘德县",
    "parent_id": "632600",
    "level_type": "3" },

  {
    "id": "632624",
    "name": "达日县",
    "parent_id": "632600",
    "level_type": "3" },

  {
    "id": "632625",
    "name": "久治县",
    "parent_id": "632600",
    "level_type": "3" },

  {
    "id": "632626",
    "name": "玛多县",
    "parent_id": "632600",
    "level_type": "3" },

  {
    "id": "632700",
    "name": "玉树藏族自治州",
    "parent_id": "630000",
    "level_type": "2" },

  {
    "id": "632701",
    "name": "玉树市",
    "parent_id": "632700",
    "level_type": "3" },

  {
    "id": "632722",
    "name": "杂多县",
    "parent_id": "632700",
    "level_type": "3" },

  {
    "id": "632723",
    "name": "称多县",
    "parent_id": "632700",
    "level_type": "3" },

  {
    "id": "632724",
    "name": "治多县",
    "parent_id": "632700",
    "level_type": "3" },

  {
    "id": "632725",
    "name": "囊谦县",
    "parent_id": "632700",
    "level_type": "3" },

  {
    "id": "632726",
    "name": "曲麻莱县",
    "parent_id": "632700",
    "level_type": "3" },

  {
    "id": "632800",
    "name": "海西蒙古族藏族自治州",
    "parent_id": "630000",
    "level_type": "2" },

  {
    "id": "632801",
    "name": "格尔木市",
    "parent_id": "632800",
    "level_type": "3" },

  {
    "id": "632802",
    "name": "德令哈市",
    "parent_id": "632800",
    "level_type": "3" },

  {
    "id": "632821",
    "name": "乌兰县",
    "parent_id": "632800",
    "level_type": "3" },

  {
    "id": "632822",
    "name": "都兰县",
    "parent_id": "632800",
    "level_type": "3" },

  {
    "id": "632823",
    "name": "天峻县",
    "parent_id": "632800",
    "level_type": "3" },

  {
    "id": "640000",
    "name": "宁夏回族自治区",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "640100",
    "name": "银川市",
    "parent_id": "640000",
    "level_type": "2" },

  {
    "id": "640104",
    "name": "兴庆区",
    "parent_id": "640100",
    "level_type": "3" },

  {
    "id": "640105",
    "name": "西夏区",
    "parent_id": "640100",
    "level_type": "3" },

  {
    "id": "640106",
    "name": "金凤区",
    "parent_id": "640100",
    "level_type": "3" },

  {
    "id": "640121",
    "name": "永宁县",
    "parent_id": "640100",
    "level_type": "3" },

  {
    "id": "640122",
    "name": "贺兰县",
    "parent_id": "640100",
    "level_type": "3" },

  {
    "id": "640181",
    "name": "灵武市",
    "parent_id": "640100",
    "level_type": "3" },

  {
    "id": "640200",
    "name": "石嘴山市",
    "parent_id": "640000",
    "level_type": "2" },

  {
    "id": "640202",
    "name": "大武口区",
    "parent_id": "640200",
    "level_type": "3" },

  {
    "id": "640205",
    "name": "惠农区",
    "parent_id": "640200",
    "level_type": "3" },

  {
    "id": "640221",
    "name": "平罗县",
    "parent_id": "640200",
    "level_type": "3" },

  {
    "id": "640300",
    "name": "吴忠市",
    "parent_id": "640000",
    "level_type": "2" },

  {
    "id": "640302",
    "name": "利通区",
    "parent_id": "640300",
    "level_type": "3" },

  {
    "id": "640303",
    "name": "红寺堡区",
    "parent_id": "640300",
    "level_type": "3" },

  {
    "id": "640323",
    "name": "盐池县",
    "parent_id": "640300",
    "level_type": "3" },

  {
    "id": "640324",
    "name": "同心县",
    "parent_id": "640300",
    "level_type": "3" },

  {
    "id": "640381",
    "name": "青铜峡市",
    "parent_id": "640300",
    "level_type": "3" },

  {
    "id": "640400",
    "name": "固原市",
    "parent_id": "640000",
    "level_type": "2" },

  {
    "id": "640402",
    "name": "原州区",
    "parent_id": "640400",
    "level_type": "3" },

  {
    "id": "640422",
    "name": "西吉县",
    "parent_id": "640400",
    "level_type": "3" },

  {
    "id": "640423",
    "name": "隆德县",
    "parent_id": "640400",
    "level_type": "3" },

  {
    "id": "640424",
    "name": "泾源县",
    "parent_id": "640400",
    "level_type": "3" },

  {
    "id": "640425",
    "name": "彭阳县",
    "parent_id": "640400",
    "level_type": "3" },

  {
    "id": "640500",
    "name": "中卫市",
    "parent_id": "640000",
    "level_type": "2" },

  {
    "id": "640502",
    "name": "沙坡头区",
    "parent_id": "640500",
    "level_type": "3" },

  {
    "id": "640521",
    "name": "中宁县",
    "parent_id": "640500",
    "level_type": "3" },

  {
    "id": "640522",
    "name": "海原县",
    "parent_id": "640500",
    "level_type": "3" },

  {
    "id": "650000",
    "name": "新疆维吾尔自治区",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "650100",
    "name": "乌鲁木齐市",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "650102",
    "name": "天山区",
    "parent_id": "650100",
    "level_type": "3" },

  {
    "id": "650103",
    "name": "沙依巴克区",
    "parent_id": "650100",
    "level_type": "3" },

  {
    "id": "650104",
    "name": "新市区",
    "parent_id": "650100",
    "level_type": "3" },

  {
    "id": "650105",
    "name": "水磨沟区",
    "parent_id": "650100",
    "level_type": "3" },

  {
    "id": "650106",
    "name": "头屯河区",
    "parent_id": "650100",
    "level_type": "3" },

  {
    "id": "650107",
    "name": "达坂城区",
    "parent_id": "650100",
    "level_type": "3" },

  {
    "id": "650109",
    "name": "米东区",
    "parent_id": "650100",
    "level_type": "3" },

  {
    "id": "650121",
    "name": "乌鲁木齐县",
    "parent_id": "650100",
    "level_type": "3" },

  {
    "id": "650200",
    "name": "克拉玛依市",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "650202",
    "name": "独山子区",
    "parent_id": "650200",
    "level_type": "3" },

  {
    "id": "650203",
    "name": "克拉玛依区",
    "parent_id": "650200",
    "level_type": "3" },

  {
    "id": "650204",
    "name": "白碱滩区",
    "parent_id": "650200",
    "level_type": "3" },

  {
    "id": "650205",
    "name": "乌尔禾区",
    "parent_id": "650200",
    "level_type": "3" },

  {
    "id": "652100",
    "name": "吐鲁番地区",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "652101",
    "name": "吐鲁番市",
    "parent_id": "652100",
    "level_type": "3" },

  {
    "id": "652122",
    "name": "鄯善县",
    "parent_id": "652100",
    "level_type": "3" },

  {
    "id": "652123",
    "name": "托克逊县",
    "parent_id": "652100",
    "level_type": "3" },

  {
    "id": "652200",
    "name": "哈密地区",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "652201",
    "name": "哈密市",
    "parent_id": "652200",
    "level_type": "3" },

  {
    "id": "652222",
    "name": "巴里坤哈萨克自治县",
    "parent_id": "652200",
    "level_type": "3" },

  {
    "id": "652223",
    "name": "伊吾县",
    "parent_id": "652200",
    "level_type": "3" },

  {
    "id": "652300",
    "name": "昌吉回族自治州",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "652301",
    "name": "昌吉市",
    "parent_id": "652300",
    "level_type": "3" },

  {
    "id": "652302",
    "name": "阜康市",
    "parent_id": "652300",
    "level_type": "3" },

  {
    "id": "652323",
    "name": "呼图壁县",
    "parent_id": "652300",
    "level_type": "3" },

  {
    "id": "652324",
    "name": "玛纳斯县",
    "parent_id": "652300",
    "level_type": "3" },

  {
    "id": "652325",
    "name": "奇台县",
    "parent_id": "652300",
    "level_type": "3" },

  {
    "id": "652327",
    "name": "吉木萨尔县",
    "parent_id": "652300",
    "level_type": "3" },

  {
    "id": "652328",
    "name": "木垒哈萨克自治县",
    "parent_id": "652300",
    "level_type": "3" },

  {
    "id": "652700",
    "name": "博尔塔拉蒙古自治州",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "652701",
    "name": "博乐市",
    "parent_id": "652700",
    "level_type": "3" },

  {
    "id": "652702",
    "name": "阿拉山口市",
    "parent_id": "652700",
    "level_type": "3" },

  {
    "id": "652722",
    "name": "精河县",
    "parent_id": "652700",
    "level_type": "3" },

  {
    "id": "652723",
    "name": "温泉县",
    "parent_id": "652700",
    "level_type": "3" },

  {
    "id": "652800",
    "name": "巴音郭楞蒙古自治州",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "652801",
    "name": "库尔勒市",
    "parent_id": "652800",
    "level_type": "3" },

  {
    "id": "652822",
    "name": "轮台县",
    "parent_id": "652800",
    "level_type": "3" },

  {
    "id": "652823",
    "name": "尉犁县",
    "parent_id": "652800",
    "level_type": "3" },

  {
    "id": "652824",
    "name": "若羌县",
    "parent_id": "652800",
    "level_type": "3" },

  {
    "id": "652825",
    "name": "且末县",
    "parent_id": "652800",
    "level_type": "3" },

  {
    "id": "652826",
    "name": "焉耆回族自治县",
    "parent_id": "652800",
    "level_type": "3" },

  {
    "id": "652827",
    "name": "和静县",
    "parent_id": "652800",
    "level_type": "3" },

  {
    "id": "652828",
    "name": "和硕县",
    "parent_id": "652800",
    "level_type": "3" },

  {
    "id": "652829",
    "name": "博湖县",
    "parent_id": "652800",
    "level_type": "3" },

  {
    "id": "652900",
    "name": "阿克苏地区",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "652901",
    "name": "阿克苏市",
    "parent_id": "652900",
    "level_type": "3" },

  {
    "id": "652922",
    "name": "温宿县",
    "parent_id": "652900",
    "level_type": "3" },

  {
    "id": "652923",
    "name": "库车县",
    "parent_id": "652900",
    "level_type": "3" },

  {
    "id": "652924",
    "name": "沙雅县",
    "parent_id": "652900",
    "level_type": "3" },

  {
    "id": "652925",
    "name": "新和县",
    "parent_id": "652900",
    "level_type": "3" },

  {
    "id": "652926",
    "name": "拜城县",
    "parent_id": "652900",
    "level_type": "3" },

  {
    "id": "652927",
    "name": "乌什县",
    "parent_id": "652900",
    "level_type": "3" },

  {
    "id": "652928",
    "name": "阿瓦提县",
    "parent_id": "652900",
    "level_type": "3" },

  {
    "id": "652929",
    "name": "柯坪县",
    "parent_id": "652900",
    "level_type": "3" },

  {
    "id": "653000",
    "name": "克孜勒苏柯尔克孜自治州",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "653001",
    "name": "阿图什市",
    "parent_id": "653000",
    "level_type": "3" },

  {
    "id": "653022",
    "name": "阿克陶县",
    "parent_id": "653000",
    "level_type": "3" },

  {
    "id": "653023",
    "name": "阿合奇县",
    "parent_id": "653000",
    "level_type": "3" },

  {
    "id": "653024",
    "name": "乌恰县",
    "parent_id": "653000",
    "level_type": "3" },

  {
    "id": "653100",
    "name": "喀什地区",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "653101",
    "name": "喀什市",
    "parent_id": "653100",
    "level_type": "3" },

  {
    "id": "653121",
    "name": "疏附县",
    "parent_id": "653100",
    "level_type": "3" },

  {
    "id": "653122",
    "name": "疏勒县",
    "parent_id": "653100",
    "level_type": "3" },

  {
    "id": "653123",
    "name": "英吉沙县",
    "parent_id": "653100",
    "level_type": "3" },

  {
    "id": "653124",
    "name": "泽普县",
    "parent_id": "653100",
    "level_type": "3" },

  {
    "id": "653125",
    "name": "莎车县",
    "parent_id": "653100",
    "level_type": "3" },

  {
    "id": "653126",
    "name": "叶城县",
    "parent_id": "653100",
    "level_type": "3" },

  {
    "id": "653127",
    "name": "麦盖提县",
    "parent_id": "653100",
    "level_type": "3" },

  {
    "id": "653128",
    "name": "岳普湖县",
    "parent_id": "653100",
    "level_type": "3" },

  {
    "id": "653129",
    "name": "伽师县",
    "parent_id": "653100",
    "level_type": "3" },

  {
    "id": "653130",
    "name": "巴楚县",
    "parent_id": "653100",
    "level_type": "3" },

  {
    "id": "653131",
    "name": "塔什库尔干塔吉克自治县",
    "parent_id": "653100",
    "level_type": "3" },

  {
    "id": "653200",
    "name": "和田地区",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "653201",
    "name": "和田市",
    "parent_id": "653200",
    "level_type": "3" },

  {
    "id": "653221",
    "name": "和田县",
    "parent_id": "653200",
    "level_type": "3" },

  {
    "id": "653222",
    "name": "墨玉县",
    "parent_id": "653200",
    "level_type": "3" },

  {
    "id": "653223",
    "name": "皮山县",
    "parent_id": "653200",
    "level_type": "3" },

  {
    "id": "653224",
    "name": "洛浦县",
    "parent_id": "653200",
    "level_type": "3" },

  {
    "id": "653225",
    "name": "策勒县",
    "parent_id": "653200",
    "level_type": "3" },

  {
    "id": "653226",
    "name": "于田县",
    "parent_id": "653200",
    "level_type": "3" },

  {
    "id": "653227",
    "name": "民丰县",
    "parent_id": "653200",
    "level_type": "3" },

  {
    "id": "654000",
    "name": "伊犁哈萨克自治州",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "654002",
    "name": "伊宁市",
    "parent_id": "654000",
    "level_type": "3" },

  {
    "id": "654003",
    "name": "奎屯市",
    "parent_id": "654000",
    "level_type": "3" },

  {
    "id": "654004",
    "name": "霍尔果斯市",
    "parent_id": "654000",
    "level_type": "3" },

  {
    "id": "654021",
    "name": "伊宁县",
    "parent_id": "654000",
    "level_type": "3" },

  {
    "id": "654022",
    "name": "察布查尔锡伯自治县",
    "parent_id": "654000",
    "level_type": "3" },

  {
    "id": "654023",
    "name": "霍城县",
    "parent_id": "654000",
    "level_type": "3" },

  {
    "id": "654024",
    "name": "巩留县",
    "parent_id": "654000",
    "level_type": "3" },

  {
    "id": "654025",
    "name": "新源县",
    "parent_id": "654000",
    "level_type": "3" },

  {
    "id": "654026",
    "name": "昭苏县",
    "parent_id": "654000",
    "level_type": "3" },

  {
    "id": "654027",
    "name": "特克斯县",
    "parent_id": "654000",
    "level_type": "3" },

  {
    "id": "654028",
    "name": "尼勒克县",
    "parent_id": "654000",
    "level_type": "3" },

  {
    "id": "654200",
    "name": "塔城地区",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "654201",
    "name": "塔城市",
    "parent_id": "654200",
    "level_type": "3" },

  {
    "id": "654202",
    "name": "乌苏市",
    "parent_id": "654200",
    "level_type": "3" },

  {
    "id": "654221",
    "name": "额敏县",
    "parent_id": "654200",
    "level_type": "3" },

  {
    "id": "654223",
    "name": "沙湾县",
    "parent_id": "654200",
    "level_type": "3" },

  {
    "id": "654224",
    "name": "托里县",
    "parent_id": "654200",
    "level_type": "3" },

  {
    "id": "654225",
    "name": "裕民县",
    "parent_id": "654200",
    "level_type": "3" },

  {
    "id": "654226",
    "name": "和布克赛尔蒙古自治县",
    "parent_id": "654200",
    "level_type": "3" },

  {
    "id": "654300",
    "name": "阿勒泰地区",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "654301",
    "name": "阿勒泰市",
    "parent_id": "654300",
    "level_type": "3" },

  {
    "id": "654321",
    "name": "布尔津县",
    "parent_id": "654300",
    "level_type": "3" },

  {
    "id": "654322",
    "name": "富蕴县",
    "parent_id": "654300",
    "level_type": "3" },

  {
    "id": "654323",
    "name": "福海县",
    "parent_id": "654300",
    "level_type": "3" },

  {
    "id": "654324",
    "name": "哈巴河县",
    "parent_id": "654300",
    "level_type": "3" },

  {
    "id": "654325",
    "name": "青河县",
    "parent_id": "654300",
    "level_type": "3" },

  {
    "id": "654326",
    "name": "吉木乃县",
    "parent_id": "654300",
    "level_type": "3" },

  {
    "id": "659000",
    "name": "直辖县级",
    "parent_id": "650000",
    "level_type": "2" },

  {
    "id": "659001",
    "name": "石河子市",
    "parent_id": "659000",
    "level_type": "3" },

  {
    "id": "659002",
    "name": "阿拉尔市",
    "parent_id": "659000",
    "level_type": "3" },

  {
    "id": "659003",
    "name": "图木舒克市",
    "parent_id": "659000",
    "level_type": "3" },

  {
    "id": "659004",
    "name": "五家渠市",
    "parent_id": "659000",
    "level_type": "3" },

  {
    "id": "659005",
    "name": "北屯市",
    "parent_id": "659000",
    "level_type": "3" },

  {
    "id": "659006",
    "name": "铁门关市",
    "parent_id": "659000",
    "level_type": "3" },

  {
    "id": "659007",
    "name": "双河市",
    "parent_id": "659000",
    "level_type": "3" },

  {
    "id": "710000",
    "name": "台湾",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "710100",
    "name": "台北市",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "710101",
    "name": "松山区",
    "parent_id": "710100",
    "level_type": "3" },

  {
    "id": "710102",
    "name": "信义区",
    "parent_id": "710100",
    "level_type": "3" },

  {
    "id": "710103",
    "name": "大安区",
    "parent_id": "710100",
    "level_type": "3" },

  {
    "id": "710104",
    "name": "中山区",
    "parent_id": "710100",
    "level_type": "3" },

  {
    "id": "710105",
    "name": "中正区",
    "parent_id": "710100",
    "level_type": "3" },

  {
    "id": "710106",
    "name": "大同区",
    "parent_id": "710100",
    "level_type": "3" },

  {
    "id": "710107",
    "name": "万华区",
    "parent_id": "710100",
    "level_type": "3" },

  {
    "id": "710108",
    "name": "文山区",
    "parent_id": "710100",
    "level_type": "3" },

  {
    "id": "710109",
    "name": "南港区",
    "parent_id": "710100",
    "level_type": "3" },

  {
    "id": "710110",
    "name": "内湖区",
    "parent_id": "710100",
    "level_type": "3" },

  {
    "id": "710111",
    "name": "士林区",
    "parent_id": "710100",
    "level_type": "3" },

  {
    "id": "710112",
    "name": "北投区",
    "parent_id": "710100",
    "level_type": "3" },

  {
    "id": "710200",
    "name": "高雄市",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "710201",
    "name": "盐埕区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710202",
    "name": "鼓山区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710203",
    "name": "左营区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710204",
    "name": "楠梓区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710205",
    "name": "三民区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710206",
    "name": "新兴区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710207",
    "name": "前金区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710208",
    "name": "苓雅区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710209",
    "name": "前镇区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710210",
    "name": "旗津区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710211",
    "name": "小港区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710212",
    "name": "凤山区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710213",
    "name": "林园区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710214",
    "name": "大寮区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710215",
    "name": "大树区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710216",
    "name": "大社区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710217",
    "name": "仁武区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710218",
    "name": "鸟松区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710219",
    "name": "冈山区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710220",
    "name": "桥头区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710221",
    "name": "燕巢区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710222",
    "name": "田寮区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710223",
    "name": "阿莲区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710224",
    "name": "路竹区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710225",
    "name": "湖内区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710226",
    "name": "茄萣区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710227",
    "name": "永安区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710228",
    "name": "弥陀区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710229",
    "name": "梓官区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710230",
    "name": "旗山区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710231",
    "name": "美浓区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710232",
    "name": "六龟区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710233",
    "name": "甲仙区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710234",
    "name": "杉林区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710235",
    "name": "内门区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710236",
    "name": "茂林区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710237",
    "name": "桃源区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710238",
    "name": "那玛夏区",
    "parent_id": "710200",
    "level_type": "3" },

  {
    "id": "710300",
    "name": "基隆市",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "710301",
    "name": "中正区",
    "parent_id": "710300",
    "level_type": "3" },

  {
    "id": "710302",
    "name": "七堵区",
    "parent_id": "710300",
    "level_type": "3" },

  {
    "id": "710303",
    "name": "暖暖区",
    "parent_id": "710300",
    "level_type": "3" },

  {
    "id": "710304",
    "name": "仁爱区",
    "parent_id": "710300",
    "level_type": "3" },

  {
    "id": "710305",
    "name": "中山区",
    "parent_id": "710300",
    "level_type": "3" },

  {
    "id": "710306",
    "name": "安乐区",
    "parent_id": "710300",
    "level_type": "3" },

  {
    "id": "710307",
    "name": "信义区",
    "parent_id": "710300",
    "level_type": "3" },

  {
    "id": "710400",
    "name": "台中市",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "710401",
    "name": "中区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710402",
    "name": "东区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710403",
    "name": "南区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710404",
    "name": "西区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710405",
    "name": "北区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710406",
    "name": "西屯区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710407",
    "name": "南屯区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710408",
    "name": "北屯区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710409",
    "name": "丰原区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710410",
    "name": "东势区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710411",
    "name": "大甲区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710412",
    "name": "清水区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710413",
    "name": "沙鹿区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710414",
    "name": "梧栖区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710415",
    "name": "后里区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710416",
    "name": "神冈区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710417",
    "name": "潭子区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710418",
    "name": "大雅区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710419",
    "name": "新社区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710420",
    "name": "石冈区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710421",
    "name": "外埔区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710422",
    "name": "大安区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710423",
    "name": "乌日区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710424",
    "name": "大肚区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710425",
    "name": "龙井区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710426",
    "name": "雾峰区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710427",
    "name": "太平区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710428",
    "name": "大里区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710429",
    "name": "和平区",
    "parent_id": "710400",
    "level_type": "3" },

  {
    "id": "710500",
    "name": "台南市",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "710501",
    "name": "东区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710502",
    "name": "南区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710504",
    "name": "北区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710506",
    "name": "安南区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710507",
    "name": "安平区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710508",
    "name": "中西区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710509",
    "name": "新营区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710510",
    "name": "盐水区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710511",
    "name": "白河区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710512",
    "name": "柳营区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710513",
    "name": "后壁区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710514",
    "name": "东山区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710515",
    "name": "麻豆区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710516",
    "name": "下营区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710517",
    "name": "六甲区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710518",
    "name": "官田区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710519",
    "name": "大内区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710520",
    "name": "佳里区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710521",
    "name": "学甲区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710522",
    "name": "西港区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710523",
    "name": "七股区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710524",
    "name": "将军区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710525",
    "name": "北门区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710526",
    "name": "新化区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710527",
    "name": "善化区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710528",
    "name": "新市区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710529",
    "name": "安定区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710530",
    "name": "山上区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710531",
    "name": "玉井区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710532",
    "name": "楠西区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710533",
    "name": "南化区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710534",
    "name": "左镇区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710535",
    "name": "仁德区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710536",
    "name": "归仁区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710537",
    "name": "关庙区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710538",
    "name": "龙崎区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710539",
    "name": "永康区",
    "parent_id": "710500",
    "level_type": "3" },

  {
    "id": "710600",
    "name": "新竹市",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "710601",
    "name": "东区",
    "parent_id": "710600",
    "level_type": "3" },

  {
    "id": "710602",
    "name": "北区",
    "parent_id": "710600",
    "level_type": "3" },

  {
    "id": "710603",
    "name": "香山区",
    "parent_id": "710600",
    "level_type": "3" },

  {
    "id": "710700",
    "name": "嘉义市",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "710701",
    "name": "东区",
    "parent_id": "710700",
    "level_type": "3" },

  {
    "id": "710702",
    "name": "西区",
    "parent_id": "710700",
    "level_type": "3" },

  {
    "id": "710800",
    "name": "新北市",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "710801",
    "name": "板桥区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710802",
    "name": "三重区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710803",
    "name": "中和区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710804",
    "name": "永和区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710805",
    "name": "新庄区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710806",
    "name": "新店区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710807",
    "name": "树林区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710808",
    "name": "莺歌区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710809",
    "name": "三峡区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710810",
    "name": "淡水区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710811",
    "name": "汐止区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710812",
    "name": "瑞芳区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710813",
    "name": "土城区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710814",
    "name": "芦洲区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710815",
    "name": "五股区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710816",
    "name": "泰山区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710817",
    "name": "林口区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710818",
    "name": "深坑区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710819",
    "name": "石碇区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710820",
    "name": "坪林区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710821",
    "name": "三芝区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710822",
    "name": "石门区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710823",
    "name": "八里区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710824",
    "name": "平溪区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710825",
    "name": "双溪区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710826",
    "name": "贡寮区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710827",
    "name": "金山区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710828",
    "name": "万里区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "710829",
    "name": "乌来区",
    "parent_id": "710800",
    "level_type": "3" },

  {
    "id": "712200",
    "name": "宜兰县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "712201",
    "name": "宜兰市",
    "parent_id": "712200",
    "level_type": "3" },

  {
    "id": "712221",
    "name": "罗东镇",
    "parent_id": "712200",
    "level_type": "3" },

  {
    "id": "712222",
    "name": "苏澳镇",
    "parent_id": "712200",
    "level_type": "3" },

  {
    "id": "712223",
    "name": "头城镇",
    "parent_id": "712200",
    "level_type": "3" },

  {
    "id": "712224",
    "name": "礁溪乡",
    "parent_id": "712200",
    "level_type": "3" },

  {
    "id": "712225",
    "name": "壮围乡",
    "parent_id": "712200",
    "level_type": "3" },

  {
    "id": "712226",
    "name": "员山乡",
    "parent_id": "712200",
    "level_type": "3" },

  {
    "id": "712227",
    "name": "冬山乡",
    "parent_id": "712200",
    "level_type": "3" },

  {
    "id": "712228",
    "name": "五结乡",
    "parent_id": "712200",
    "level_type": "3" },

  {
    "id": "712229",
    "name": "三星乡",
    "parent_id": "712200",
    "level_type": "3" },

  {
    "id": "712230",
    "name": "大同乡",
    "parent_id": "712200",
    "level_type": "3" },

  {
    "id": "712231",
    "name": "南澳乡",
    "parent_id": "712200",
    "level_type": "3" },

  {
    "id": "712300",
    "name": "桃园县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "712301",
    "name": "桃园市",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712302",
    "name": "中坜市",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712303",
    "name": "平镇市",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712304",
    "name": "八德市",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712305",
    "name": "杨梅市",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712306",
    "name": "芦竹市",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712321",
    "name": "大溪镇",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712324",
    "name": "大园乡",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712325",
    "name": "龟山乡",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712327",
    "name": "龙潭乡",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712329",
    "name": "新屋乡",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712330",
    "name": "观音乡",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712331",
    "name": "复兴乡",
    "parent_id": "712300",
    "level_type": "3" },

  {
    "id": "712400",
    "name": "新竹县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "712401",
    "name": "竹北市",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712421",
    "name": "竹东镇",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712422",
    "name": "新埔镇",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712423",
    "name": "关西镇",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712424",
    "name": "湖口乡",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712425",
    "name": "新丰乡",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712426",
    "name": "芎林乡",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712427",
    "name": "横山乡",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712428",
    "name": "北埔乡",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712429",
    "name": "宝山乡",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712430",
    "name": "峨眉乡",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712431",
    "name": "尖石乡",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712432",
    "name": "五峰乡",
    "parent_id": "712400",
    "level_type": "3" },

  {
    "id": "712500",
    "name": "苗栗县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "712501",
    "name": "苗栗市",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712521",
    "name": "苑里镇",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712522",
    "name": "通霄镇",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712523",
    "name": "竹南镇",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712524",
    "name": "头份镇",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712525",
    "name": "后龙镇",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712526",
    "name": "卓兰镇",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712527",
    "name": "大湖乡",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712528",
    "name": "公馆乡",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712529",
    "name": "铜锣乡",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712530",
    "name": "南庄乡",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712531",
    "name": "头屋乡",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712532",
    "name": "三义乡",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712533",
    "name": "西湖乡",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712534",
    "name": "造桥乡",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712535",
    "name": "三湾乡",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712536",
    "name": "狮潭乡",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712537",
    "name": "泰安乡",
    "parent_id": "712500",
    "level_type": "3" },

  {
    "id": "712700",
    "name": "彰化县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "712701",
    "name": "彰化市",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712721",
    "name": "鹿港镇",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712722",
    "name": "和美镇",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712723",
    "name": "线西乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712724",
    "name": "伸港乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712725",
    "name": "福兴乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712726",
    "name": "秀水乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712727",
    "name": "花坛乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712728",
    "name": "芬园乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712729",
    "name": "员林镇",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712730",
    "name": "溪湖镇",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712731",
    "name": "田中镇",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712732",
    "name": "大村乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712733",
    "name": "埔盐乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712734",
    "name": "埔心乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712735",
    "name": "永靖乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712736",
    "name": "社头乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712737",
    "name": "二水乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712738",
    "name": "北斗镇",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712739",
    "name": "二林镇",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712740",
    "name": "田尾乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712741",
    "name": "埤头乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712742",
    "name": "芳苑乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712743",
    "name": "大城乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712744",
    "name": "竹塘乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712745",
    "name": "溪州乡",
    "parent_id": "712700",
    "level_type": "3" },

  {
    "id": "712800",
    "name": "南投县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "712801",
    "name": "南投市",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712821",
    "name": "埔里镇",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712822",
    "name": "草屯镇",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712823",
    "name": "竹山镇",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712824",
    "name": "集集镇",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712825",
    "name": "名间乡",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712826",
    "name": "鹿谷乡",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712827",
    "name": "中寮乡",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712828",
    "name": "鱼池乡",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712829",
    "name": "国姓乡",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712830",
    "name": "水里乡",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712831",
    "name": "信义乡",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712832",
    "name": "仁爱乡",
    "parent_id": "712800",
    "level_type": "3" },

  {
    "id": "712900",
    "name": "云林县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "712901",
    "name": "斗六市",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712921",
    "name": "斗南镇",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712922",
    "name": "虎尾镇",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712923",
    "name": "西螺镇",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712924",
    "name": "土库镇",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712925",
    "name": "北港镇",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712926",
    "name": "古坑乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712927",
    "name": "大埤乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712928",
    "name": "莿桐乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712929",
    "name": "林内乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712930",
    "name": "二仑乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712931",
    "name": "仑背乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712932",
    "name": "麦寮乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712933",
    "name": "东势乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712934",
    "name": "褒忠乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712935",
    "name": "台西乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712936",
    "name": "元长乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712937",
    "name": "四湖乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712938",
    "name": "口湖乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "712939",
    "name": "水林乡",
    "parent_id": "712900",
    "level_type": "3" },

  {
    "id": "713000",
    "name": "嘉义县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "713001",
    "name": "太保市",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713002",
    "name": "朴子市",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713023",
    "name": "布袋镇",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713024",
    "name": "大林镇",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713025",
    "name": "民雄乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713026",
    "name": "溪口乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713027",
    "name": "新港乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713028",
    "name": "六脚乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713029",
    "name": "东石乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713030",
    "name": "义竹乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713031",
    "name": "鹿草乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713032",
    "name": "水上乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713033",
    "name": "中埔乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713034",
    "name": "竹崎乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713035",
    "name": "梅山乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713036",
    "name": "番路乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713037",
    "name": "大埔乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713038",
    "name": "阿里山乡",
    "parent_id": "713000",
    "level_type": "3" },

  {
    "id": "713300",
    "name": "屏东县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "713301",
    "name": "屏东市",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713321",
    "name": "潮州镇",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713322",
    "name": "东港镇",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713323",
    "name": "恒春镇",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713324",
    "name": "万丹乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713325",
    "name": "长治乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713326",
    "name": "麟洛乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713327",
    "name": "九如乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713328",
    "name": "里港乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713329",
    "name": "盐埔乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713330",
    "name": "高树乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713331",
    "name": "万峦乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713332",
    "name": "内埔乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713333",
    "name": "竹田乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713334",
    "name": "新埤乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713335",
    "name": "枋寮乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713336",
    "name": "新园乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713337",
    "name": "崁顶乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713338",
    "name": "林边乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713339",
    "name": "南州乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713340",
    "name": "佳冬乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713341",
    "name": "琉球乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713342",
    "name": "车城乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713343",
    "name": "满州乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713344",
    "name": "枋山乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713345",
    "name": "三地门乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713346",
    "name": "雾台乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713347",
    "name": "玛家乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713348",
    "name": "泰武乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713349",
    "name": "来义乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713350",
    "name": "春日乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713351",
    "name": "狮子乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713352",
    "name": "牡丹乡",
    "parent_id": "713300",
    "level_type": "3" },

  {
    "id": "713400",
    "name": "台东县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "713401",
    "name": "台东市",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713421",
    "name": "成功镇",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713422",
    "name": "关山镇",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713423",
    "name": "卑南乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713424",
    "name": "鹿野乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713425",
    "name": "池上乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713426",
    "name": "东河乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713427",
    "name": "长滨乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713428",
    "name": "太麻里乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713429",
    "name": "大武乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713430",
    "name": "绿岛乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713431",
    "name": "海端乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713432",
    "name": "延平乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713433",
    "name": "金峰乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713434",
    "name": "达仁乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713435",
    "name": "兰屿乡",
    "parent_id": "713400",
    "level_type": "3" },

  {
    "id": "713500",
    "name": "花莲县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "713501",
    "name": "花莲市",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713521",
    "name": "凤林镇",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713522",
    "name": "玉里镇",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713523",
    "name": "新城乡",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713524",
    "name": "吉安乡",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713525",
    "name": "寿丰乡",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713526",
    "name": "光复乡",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713527",
    "name": "丰滨乡",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713528",
    "name": "瑞穗乡",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713529",
    "name": "富里乡",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713530",
    "name": "秀林乡",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713531",
    "name": "万荣乡",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713532",
    "name": "卓溪乡",
    "parent_id": "713500",
    "level_type": "3" },

  {
    "id": "713600",
    "name": "澎湖县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "713601",
    "name": "马公市",
    "parent_id": "713600",
    "level_type": "3" },

  {
    "id": "713621",
    "name": "湖西乡",
    "parent_id": "713600",
    "level_type": "3" },

  {
    "id": "713622",
    "name": "白沙乡",
    "parent_id": "713600",
    "level_type": "3" },

  {
    "id": "713623",
    "name": "西屿乡",
    "parent_id": "713600",
    "level_type": "3" },

  {
    "id": "713624",
    "name": "望安乡",
    "parent_id": "713600",
    "level_type": "3" },

  {
    "id": "713625",
    "name": "七美乡",
    "parent_id": "713600",
    "level_type": "3" },

  {
    "id": "713700",
    "name": "金门县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "713701",
    "name": "金城镇",
    "parent_id": "713700",
    "level_type": "3" },

  {
    "id": "713702",
    "name": "金湖镇",
    "parent_id": "713700",
    "level_type": "3" },

  {
    "id": "713703",
    "name": "金沙镇",
    "parent_id": "713700",
    "level_type": "3" },

  {
    "id": "713704",
    "name": "金宁乡",
    "parent_id": "713700",
    "level_type": "3" },

  {
    "id": "713705",
    "name": "烈屿乡",
    "parent_id": "713700",
    "level_type": "3" },

  {
    "id": "713706",
    "name": "乌丘乡",
    "parent_id": "713700",
    "level_type": "3" },

  {
    "id": "713800",
    "name": "连江县",
    "parent_id": "710000",
    "level_type": "2" },

  {
    "id": "713801",
    "name": "南竿乡",
    "parent_id": "713800",
    "level_type": "3" },

  {
    "id": "713802",
    "name": "北竿乡",
    "parent_id": "713800",
    "level_type": "3" },

  {
    "id": "713803",
    "name": "莒光乡",
    "parent_id": "713800",
    "level_type": "3" },

  {
    "id": "713804",
    "name": "东引乡",
    "parent_id": "713800",
    "level_type": "3" },

  {
    "id": "810000",
    "name": "香港特别行政区",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "810100",
    "name": "香港岛",
    "parent_id": "810000",
    "level_type": "2" },

  {
    "id": "810101",
    "name": "中西区",
    "parent_id": "810100",
    "level_type": "3" },

  {
    "id": "810102",
    "name": "湾仔区",
    "parent_id": "810100",
    "level_type": "3" },

  {
    "id": "810103",
    "name": "东区",
    "parent_id": "810100",
    "level_type": "3" },

  {
    "id": "810104",
    "name": "南区",
    "parent_id": "810100",
    "level_type": "3" },

  {
    "id": "810200",
    "name": "九龙",
    "parent_id": "810000",
    "level_type": "2" },

  {
    "id": "810201",
    "name": "油尖旺区",
    "parent_id": "810200",
    "level_type": "3" },

  {
    "id": "810202",
    "name": "深水埗区",
    "parent_id": "810200",
    "level_type": "3" },

  {
    "id": "810203",
    "name": "九龙城区",
    "parent_id": "810200",
    "level_type": "3" },

  {
    "id": "810204",
    "name": "黄大仙区",
    "parent_id": "810200",
    "level_type": "3" },

  {
    "id": "810205",
    "name": "观塘区",
    "parent_id": "810200",
    "level_type": "3" },

  {
    "id": "810300",
    "name": "新界",
    "parent_id": "810000",
    "level_type": "2" },

  {
    "id": "810301",
    "name": "荃湾区",
    "parent_id": "810300",
    "level_type": "3" },

  {
    "id": "810302",
    "name": "屯门区",
    "parent_id": "810300",
    "level_type": "3" },

  {
    "id": "810303",
    "name": "元朗区",
    "parent_id": "810300",
    "level_type": "3" },

  {
    "id": "810304",
    "name": "北区",
    "parent_id": "810300",
    "level_type": "3" },

  {
    "id": "810305",
    "name": "大埔区",
    "parent_id": "810300",
    "level_type": "3" },

  {
    "id": "810306",
    "name": "西贡区",
    "parent_id": "810300",
    "level_type": "3" },

  {
    "id": "810307",
    "name": "沙田区",
    "parent_id": "810300",
    "level_type": "3" },

  {
    "id": "810308",
    "name": "葵青区",
    "parent_id": "810300",
    "level_type": "3" },

  {
    "id": "810309",
    "name": "离岛区",
    "parent_id": "810300",
    "level_type": "3" },

  {
    "id": "820000",
    "name": "澳门特别行政区",
    "parent_id": "0",
    "level_type": "1" },

  {
    "id": "820100",
    "name": "澳门半岛",
    "parent_id": "820000",
    "level_type": "2" },

  {
    "id": "820101",
    "name": "花地玛堂区",
    "parent_id": "820100",
    "level_type": "3" },

  {
    "id": "820102",
    "name": "圣安多尼堂区",
    "parent_id": "820100",
    "level_type": "3" },

  {
    "id": "820103",
    "name": "大堂区",
    "parent_id": "820100",
    "level_type": "3" },

  {
    "id": "820104",
    "name": "望德堂区",
    "parent_id": "820100",
    "level_type": "3" },

  {
    "id": "820105",
    "name": "风顺堂区",
    "parent_id": "820100",
    "level_type": "3" },

  {
    "id": "820200",
    "name": "氹仔岛",
    "parent_id": "820000",
    "level_type": "2" },

  {
    "id": "820201",
    "name": "嘉模堂区",
    "parent_id": "820200",
    "level_type": "3" },

  {
    "id": "820300",
    "name": "路环岛",
    "parent_id": "820000",
    "level_type": "2" },

  {
    "id": "820301",
    "name": "圣方济各堂区",
    "parent_id": "820300",
    "level_type": "3" }] };



function init() {
  return cityData;
}

module.exports = {
  data: cityData };

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\common\\getLocation.js":
/*!******************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/common/getLocation.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var shoppublic = __webpack_require__(/*! ./shoppublic.js */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\common\\shoppublic.js");
var city_new = __webpack_require__(/*! ./city.js */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\common\\city.js");
var cityData_new = city_new.data.RECORDS;
// 所有的 省市区 集合
var result_province = cityData_new.filter(
function (value) {
  return value.level_type == 1;
});

var result_city = cityData_new.filter(
function (value) {
  return value.level_type == 2;
});

var result_county = cityData_new.filter(
function (value) {
  return value.level_type == 3;
});

var province_s = result_province;
// 获取地理位置
function getLocation(callBack) {
  uni.getLocation({
    type: 'wgs84',
    success: function success(res) {
      console.log(res);
      var longitude = res.longitude;
      var latitude = res.latitude;
      loadCity(longitude, latitude, callBack);
    },
    fail: function fail(res) {} });

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
      output: 'json' },

    header: {
      "Content-Type": "application/x-www-form-urlencoded" },

    success: function success(res) {
      console.log(JSON.stringify(res));
      var result_P = result_province.filter( //过滤省
      function (value) {
        return value.name == res.data.result.addressComponent.province;
      });

      var result_C = result_city.filter( //过滤市
      function (value) {
        return value.name == res.data.result.addressComponent.city;
      });

      console.log('省', JSON.stringify(result_P));
      console.log('市', JSON.stringify(result_C));
      callBack(result_P, result_C);
    },
    fail: function fail(res) {} });

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
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ "./node_modules/@dcloudio/uni-mp-weixin/dist/index.js")["default"]))

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\common\\shoppublic.js":
/*!*****************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/common/shoppublic.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) { //var HOST = "https://www.soeasyit.com/shop_api";
function getUrl() {
  //  // 线上
  var HOST = "https://www.kaidianapp.com/shop_api/";
  // // 测试服务器
  //  var HOST = "https://www.kaidianapp.net/shop_api";
  // var HOST = "http://192.168.0.109:8080/";
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
    var value = uni.getStorageSync('islogin');
    //console.info(value);
    if (value) {
      return true;
    }
  } catch (e) {}
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
  getQrCodeUrl: getQrCodeUrl };
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ "./node_modules/@dcloudio/uni-mp-weixin/dist/index.js")["default"]))

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue":
/*!***************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/commentModule/commentModule.vue ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _commentModule_vue_vue_type_template_id_57c99424___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./commentModule.vue?vue&type=template&id=57c99424& */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue?vue&type=template&id=57c99424&");
/* harmony import */ var _commentModule_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./commentModule.vue?vue&type=script&lang=js& */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _commentModule_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _commentModule_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _commentModule_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./commentModule.vue?vue&type=style&index=0&lang=scss& */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _commentModule_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _commentModule_vue_vue_type_template_id_57c99424___WEBPACK_IMPORTED_MODULE_0__["render"],
  _commentModule_vue_vue_type_template_id_57c99424___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/commentModule/commentModule.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/commentModule/commentModule.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!./commentModule.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue?vue&type=script&lang=js&");
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue?vue&type=style&index=0&lang=scss&":
/*!*************************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/commentModule/commentModule.vue?vue&type=style&index=0&lang=scss& ***!
  \*************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-1!./node_modules/css-loader??ref--8-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-4!./node_modules/vue-loader/lib??vue-loader-options!./commentModule.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue?vue&type=template&id=57c99424&":
/*!**********************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/commentModule/commentModule.vue?vue&type=template&id=57c99424& ***!
  \**********************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_template_id_57c99424___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!./commentModule.vue?vue&type=template&id=57c99424& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\commentModule\\commentModule.vue?vue&type=template&id=57c99424&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_template_id_57c99424___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_commentModule_vue_vue_type_template_id_57c99424___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\city-data\\area.js":
/*!******************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-citypicker/city-data/area.js ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /* eslint-disable */
var areaData = [
[
[{
  "label": "东城区",
  "value": "110101" },

{
  "label": "西城区",
  "value": "110102" },

{
  "label": "朝阳区",
  "value": "110105" },

{
  "label": "丰台区",
  "value": "110106" },

{
  "label": "石景山区",
  "value": "110107" },

{
  "label": "海淀区",
  "value": "110108" },

{
  "label": "门头沟区",
  "value": "110109" },

{
  "label": "房山区",
  "value": "110111" },

{
  "label": "通州区",
  "value": "110112" },

{
  "label": "顺义区",
  "value": "110113" },

{
  "label": "昌平区",
  "value": "110114" },

{
  "label": "大兴区",
  "value": "110115" },

{
  "label": "怀柔区",
  "value": "110116" },

{
  "label": "平谷区",
  "value": "110117" },

{
  "label": "密云区",
  "value": "110118" },

{
  "label": "延庆区",
  "value": "110119" }]],



[
[{
  "label": "和平区",
  "value": "120101" },

{
  "label": "河东区",
  "value": "120102" },

{
  "label": "河西区",
  "value": "120103" },

{
  "label": "南开区",
  "value": "120104" },

{
  "label": "河北区",
  "value": "120105" },

{
  "label": "红桥区",
  "value": "120106" },

{
  "label": "东丽区",
  "value": "120110" },

{
  "label": "西青区",
  "value": "120111" },

{
  "label": "津南区",
  "value": "120112" },

{
  "label": "北辰区",
  "value": "120113" },

{
  "label": "武清区",
  "value": "120114" },

{
  "label": "宝坻区",
  "value": "120115" },

{
  "label": "滨海新区",
  "value": "120116" },

{
  "label": "宁河区",
  "value": "120117" },

{
  "label": "静海区",
  "value": "120118" },

{
  "label": "蓟州区",
  "value": "120119" }]],



[
[{
  "label": "长安区",
  "value": "130102" },

{
  "label": "桥西区",
  "value": "130104" },

{
  "label": "新华区",
  "value": "130105" },

{
  "label": "井陉矿区",
  "value": "130107" },

{
  "label": "裕华区",
  "value": "130108" },

{
  "label": "藁城区",
  "value": "130109" },

{
  "label": "鹿泉区",
  "value": "130110" },

{
  "label": "栾城区",
  "value": "130111" },

{
  "label": "井陉县",
  "value": "130121" },

{
  "label": "正定县",
  "value": "130123" },

{
  "label": "行唐县",
  "value": "130125" },

{
  "label": "灵寿县",
  "value": "130126" },

{
  "label": "高邑县",
  "value": "130127" },

{
  "label": "深泽县",
  "value": "130128" },

{
  "label": "赞皇县",
  "value": "130129" },

{
  "label": "无极县",
  "value": "130130" },

{
  "label": "平山县",
  "value": "130131" },

{
  "label": "元氏县",
  "value": "130132" },

{
  "label": "赵县",
  "value": "130133" },

{
  "label": "石家庄高新技术产业开发区",
  "value": "130171" },

{
  "label": "石家庄循环化工园区",
  "value": "130172" },

{
  "label": "辛集市",
  "value": "130181" },

{
  "label": "晋州市",
  "value": "130183" },

{
  "label": "新乐市",
  "value": "130184" }],


[{
  "label": "路南区",
  "value": "130202" },

{
  "label": "路北区",
  "value": "130203" },

{
  "label": "古冶区",
  "value": "130204" },

{
  "label": "开平区",
  "value": "130205" },

{
  "label": "丰南区",
  "value": "130207" },

{
  "label": "丰润区",
  "value": "130208" },

{
  "label": "曹妃甸区",
  "value": "130209" },

{
  "label": "滦县",
  "value": "130223" },

{
  "label": "滦南县",
  "value": "130224" },

{
  "label": "乐亭县",
  "value": "130225" },

{
  "label": "迁西县",
  "value": "130227" },

{
  "label": "玉田县",
  "value": "130229" },

{
  "label": "唐山市芦台经济技术开发区",
  "value": "130271" },

{
  "label": "唐山市汉沽管理区",
  "value": "130272" },

{
  "label": "唐山高新技术产业开发区",
  "value": "130273" },

{
  "label": "河北唐山海港经济开发区",
  "value": "130274" },

{
  "label": "遵化市",
  "value": "130281" },

{
  "label": "迁安市",
  "value": "130283" }],


[{
  "label": "海港区",
  "value": "130302" },

{
  "label": "山海关区",
  "value": "130303" },

{
  "label": "北戴河区",
  "value": "130304" },

{
  "label": "抚宁区",
  "value": "130306" },

{
  "label": "青龙满族自治县",
  "value": "130321" },

{
  "label": "昌黎县",
  "value": "130322" },

{
  "label": "卢龙县",
  "value": "130324" },

{
  "label": "秦皇岛市经济技术开发区",
  "value": "130371" },

{
  "label": "北戴河新区",
  "value": "130372" }],


[{
  "label": "邯山区",
  "value": "130402" },

{
  "label": "丛台区",
  "value": "130403" },

{
  "label": "复兴区",
  "value": "130404" },

{
  "label": "峰峰矿区",
  "value": "130406" },

{
  "label": "肥乡区",
  "value": "130407" },

{
  "label": "永年区",
  "value": "130408" },

{
  "label": "临漳县",
  "value": "130423" },

{
  "label": "成安县",
  "value": "130424" },

{
  "label": "大名县",
  "value": "130425" },

{
  "label": "涉县",
  "value": "130426" },

{
  "label": "磁县",
  "value": "130427" },

{
  "label": "邱县",
  "value": "130430" },

{
  "label": "鸡泽县",
  "value": "130431" },

{
  "label": "广平县",
  "value": "130432" },

{
  "label": "馆陶县",
  "value": "130433" },

{
  "label": "魏县",
  "value": "130434" },

{
  "label": "曲周县",
  "value": "130435" },

{
  "label": "邯郸经济技术开发区",
  "value": "130471" },

{
  "label": "邯郸冀南新区",
  "value": "130473" },

{
  "label": "武安市",
  "value": "130481" }],


[{
  "label": "桥东区",
  "value": "130502" },

{
  "label": "桥西区",
  "value": "130503" },

{
  "label": "邢台县",
  "value": "130521" },

{
  "label": "临城县",
  "value": "130522" },

{
  "label": "内丘县",
  "value": "130523" },

{
  "label": "柏乡县",
  "value": "130524" },

{
  "label": "隆尧县",
  "value": "130525" },

{
  "label": "任县",
  "value": "130526" },

{
  "label": "南和县",
  "value": "130527" },

{
  "label": "宁晋县",
  "value": "130528" },

{
  "label": "巨鹿县",
  "value": "130529" },

{
  "label": "新河县",
  "value": "130530" },

{
  "label": "广宗县",
  "value": "130531" },

{
  "label": "平乡县",
  "value": "130532" },

{
  "label": "威县",
  "value": "130533" },

{
  "label": "清河县",
  "value": "130534" },

{
  "label": "临西县",
  "value": "130535" },

{
  "label": "河北邢台经济开发区",
  "value": "130571" },

{
  "label": "南宫市",
  "value": "130581" },

{
  "label": "沙河市",
  "value": "130582" }],


[{
  "label": "竞秀区",
  "value": "130602" },

{
  "label": "莲池区",
  "value": "130606" },

{
  "label": "满城区",
  "value": "130607" },

{
  "label": "清苑区",
  "value": "130608" },

{
  "label": "徐水区",
  "value": "130609" },

{
  "label": "涞水县",
  "value": "130623" },

{
  "label": "阜平县",
  "value": "130624" },

{
  "label": "定兴县",
  "value": "130626" },

{
  "label": "唐县",
  "value": "130627" },

{
  "label": "高阳县",
  "value": "130628" },

{
  "label": "容城县",
  "value": "130629" },

{
  "label": "涞源县",
  "value": "130630" },

{
  "label": "望都县",
  "value": "130631" },

{
  "label": "安新县",
  "value": "130632" },

{
  "label": "易县",
  "value": "130633" },

{
  "label": "曲阳县",
  "value": "130634" },

{
  "label": "蠡县",
  "value": "130635" },

{
  "label": "顺平县",
  "value": "130636" },

{
  "label": "博野县",
  "value": "130637" },

{
  "label": "雄县",
  "value": "130638" },

{
  "label": "保定高新技术产业开发区",
  "value": "130671" },

{
  "label": "保定白沟新城",
  "value": "130672" },

{
  "label": "涿州市",
  "value": "130681" },

{
  "label": "定州市",
  "value": "130682" },

{
  "label": "安国市",
  "value": "130683" },

{
  "label": "高碑店市",
  "value": "130684" }],


[{
  "label": "桥东区",
  "value": "130702" },

{
  "label": "桥西区",
  "value": "130703" },

{
  "label": "宣化区",
  "value": "130705" },

{
  "label": "下花园区",
  "value": "130706" },

{
  "label": "万全区",
  "value": "130708" },

{
  "label": "崇礼区",
  "value": "130709" },

{
  "label": "张北县",
  "value": "130722" },

{
  "label": "康保县",
  "value": "130723" },

{
  "label": "沽源县",
  "value": "130724" },

{
  "label": "尚义县",
  "value": "130725" },

{
  "label": "蔚县",
  "value": "130726" },

{
  "label": "阳原县",
  "value": "130727" },

{
  "label": "怀安县",
  "value": "130728" },

{
  "label": "怀来县",
  "value": "130730" },

{
  "label": "涿鹿县",
  "value": "130731" },

{
  "label": "赤城县",
  "value": "130732" },

{
  "label": "张家口市高新技术产业开发区",
  "value": "130771" },

{
  "label": "张家口市察北管理区",
  "value": "130772" },

{
  "label": "张家口市塞北管理区",
  "value": "130773" }],


[{
  "label": "双桥区",
  "value": "130802" },

{
  "label": "双滦区",
  "value": "130803" },

{
  "label": "鹰手营子矿区",
  "value": "130804" },

{
  "label": "承德县",
  "value": "130821" },

{
  "label": "兴隆县",
  "value": "130822" },

{
  "label": "滦平县",
  "value": "130824" },

{
  "label": "隆化县",
  "value": "130825" },

{
  "label": "丰宁满族自治县",
  "value": "130826" },

{
  "label": "宽城满族自治县",
  "value": "130827" },

{
  "label": "围场满族蒙古族自治县",
  "value": "130828" },

{
  "label": "承德高新技术产业开发区",
  "value": "130871" },

{
  "label": "平泉市",
  "value": "130881" }],


[{
  "label": "新华区",
  "value": "130902" },

{
  "label": "运河区",
  "value": "130903" },

{
  "label": "沧县",
  "value": "130921" },

{
  "label": "青县",
  "value": "130922" },

{
  "label": "东光县",
  "value": "130923" },

{
  "label": "海兴县",
  "value": "130924" },

{
  "label": "盐山县",
  "value": "130925" },

{
  "label": "肃宁县",
  "value": "130926" },

{
  "label": "南皮县",
  "value": "130927" },

{
  "label": "吴桥县",
  "value": "130928" },

{
  "label": "献县",
  "value": "130929" },

{
  "label": "孟村回族自治县",
  "value": "130930" },

{
  "label": "河北沧州经济开发区",
  "value": "130971" },

{
  "label": "沧州高新技术产业开发区",
  "value": "130972" },

{
  "label": "沧州渤海新区",
  "value": "130973" },

{
  "label": "泊头市",
  "value": "130981" },

{
  "label": "任丘市",
  "value": "130982" },

{
  "label": "黄骅市",
  "value": "130983" },

{
  "label": "河间市",
  "value": "130984" }],


[{
  "label": "安次区",
  "value": "131002" },

{
  "label": "广阳区",
  "value": "131003" },

{
  "label": "固安县",
  "value": "131022" },

{
  "label": "永清县",
  "value": "131023" },

{
  "label": "香河县",
  "value": "131024" },

{
  "label": "大城县",
  "value": "131025" },

{
  "label": "文安县",
  "value": "131026" },

{
  "label": "大厂回族自治县",
  "value": "131028" },

{
  "label": "廊坊经济技术开发区",
  "value": "131071" },

{
  "label": "霸州市",
  "value": "131081" },

{
  "label": "三河市",
  "value": "131082" }],


[{
  "label": "桃城区",
  "value": "131102" },

{
  "label": "冀州区",
  "value": "131103" },

{
  "label": "枣强县",
  "value": "131121" },

{
  "label": "武邑县",
  "value": "131122" },

{
  "label": "武强县",
  "value": "131123" },

{
  "label": "饶阳县",
  "value": "131124" },

{
  "label": "安平县",
  "value": "131125" },

{
  "label": "故城县",
  "value": "131126" },

{
  "label": "景县",
  "value": "131127" },

{
  "label": "阜城县",
  "value": "131128" },

{
  "label": "河北衡水经济开发区",
  "value": "131171" },

{
  "label": "衡水滨湖新区",
  "value": "131172" },

{
  "label": "深州市",
  "value": "131182" }]],



[
[{
  "label": "小店区",
  "value": "140105" },

{
  "label": "迎泽区",
  "value": "140106" },

{
  "label": "杏花岭区",
  "value": "140107" },

{
  "label": "尖草坪区",
  "value": "140108" },

{
  "label": "万柏林区",
  "value": "140109" },

{
  "label": "晋源区",
  "value": "140110" },

{
  "label": "清徐县",
  "value": "140121" },

{
  "label": "阳曲县",
  "value": "140122" },

{
  "label": "娄烦县",
  "value": "140123" },

{
  "label": "山西转型综合改革示范区",
  "value": "140171" },

{
  "label": "古交市",
  "value": "140181" }],


[{
  "label": "城区",
  "value": "140202" },

{
  "label": "矿区",
  "value": "140203" },

{
  "label": "南郊区",
  "value": "140211" },

{
  "label": "新荣区",
  "value": "140212" },

{
  "label": "阳高县",
  "value": "140221" },

{
  "label": "天镇县",
  "value": "140222" },

{
  "label": "广灵县",
  "value": "140223" },

{
  "label": "灵丘县",
  "value": "140224" },

{
  "label": "浑源县",
  "value": "140225" },

{
  "label": "左云县",
  "value": "140226" },

{
  "label": "大同县",
  "value": "140227" },

{
  "label": "山西大同经济开发区",
  "value": "140271" }],


[{
  "label": "城区",
  "value": "140302" },

{
  "label": "矿区",
  "value": "140303" },

{
  "label": "郊区",
  "value": "140311" },

{
  "label": "平定县",
  "value": "140321" },

{
  "label": "盂县",
  "value": "140322" },

{
  "label": "山西阳泉经济开发区",
  "value": "140371" }],


[{
  "label": "城区",
  "value": "140402" },

{
  "label": "郊区",
  "value": "140411" },

{
  "label": "长治县",
  "value": "140421" },

{
  "label": "襄垣县",
  "value": "140423" },

{
  "label": "屯留县",
  "value": "140424" },

{
  "label": "平顺县",
  "value": "140425" },

{
  "label": "黎城县",
  "value": "140426" },

{
  "label": "壶关县",
  "value": "140427" },

{
  "label": "长子县",
  "value": "140428" },

{
  "label": "武乡县",
  "value": "140429" },

{
  "label": "沁县",
  "value": "140430" },

{
  "label": "沁源县",
  "value": "140431" },

{
  "label": "山西长治高新技术产业园区",
  "value": "140471" },

{
  "label": "潞城市",
  "value": "140481" }],


[{
  "label": "城区",
  "value": "140502" },

{
  "label": "沁水县",
  "value": "140521" },

{
  "label": "阳城县",
  "value": "140522" },

{
  "label": "陵川县",
  "value": "140524" },

{
  "label": "泽州县",
  "value": "140525" },

{
  "label": "高平市",
  "value": "140581" }],


[{
  "label": "朔城区",
  "value": "140602" },

{
  "label": "平鲁区",
  "value": "140603" },

{
  "label": "山阴县",
  "value": "140621" },

{
  "label": "应县",
  "value": "140622" },

{
  "label": "右玉县",
  "value": "140623" },

{
  "label": "怀仁县",
  "value": "140624" },

{
  "label": "山西朔州经济开发区",
  "value": "140671" }],


[{
  "label": "榆次区",
  "value": "140702" },

{
  "label": "榆社县",
  "value": "140721" },

{
  "label": "左权县",
  "value": "140722" },

{
  "label": "和顺县",
  "value": "140723" },

{
  "label": "昔阳县",
  "value": "140724" },

{
  "label": "寿阳县",
  "value": "140725" },

{
  "label": "太谷县",
  "value": "140726" },

{
  "label": "祁县",
  "value": "140727" },

{
  "label": "平遥县",
  "value": "140728" },

{
  "label": "灵石县",
  "value": "140729" },

{
  "label": "介休市",
  "value": "140781" }],


[{
  "label": "盐湖区",
  "value": "140802" },

{
  "label": "临猗县",
  "value": "140821" },

{
  "label": "万荣县",
  "value": "140822" },

{
  "label": "闻喜县",
  "value": "140823" },

{
  "label": "稷山县",
  "value": "140824" },

{
  "label": "新绛县",
  "value": "140825" },

{
  "label": "绛县",
  "value": "140826" },

{
  "label": "垣曲县",
  "value": "140827" },

{
  "label": "夏县",
  "value": "140828" },

{
  "label": "平陆县",
  "value": "140829" },

{
  "label": "芮城县",
  "value": "140830" },

{
  "label": "永济市",
  "value": "140881" },

{
  "label": "河津市",
  "value": "140882" }],


[{
  "label": "忻府区",
  "value": "140902" },

{
  "label": "定襄县",
  "value": "140921" },

{
  "label": "五台县",
  "value": "140922" },

{
  "label": "代县",
  "value": "140923" },

{
  "label": "繁峙县",
  "value": "140924" },

{
  "label": "宁武县",
  "value": "140925" },

{
  "label": "静乐县",
  "value": "140926" },

{
  "label": "神池县",
  "value": "140927" },

{
  "label": "五寨县",
  "value": "140928" },

{
  "label": "岢岚县",
  "value": "140929" },

{
  "label": "河曲县",
  "value": "140930" },

{
  "label": "保德县",
  "value": "140931" },

{
  "label": "偏关县",
  "value": "140932" },

{
  "label": "五台山风景名胜区",
  "value": "140971" },

{
  "label": "原平市",
  "value": "140981" }],


[{
  "label": "尧都区",
  "value": "141002" },

{
  "label": "曲沃县",
  "value": "141021" },

{
  "label": "翼城县",
  "value": "141022" },

{
  "label": "襄汾县",
  "value": "141023" },

{
  "label": "洪洞县",
  "value": "141024" },

{
  "label": "古县",
  "value": "141025" },

{
  "label": "安泽县",
  "value": "141026" },

{
  "label": "浮山县",
  "value": "141027" },

{
  "label": "吉县",
  "value": "141028" },

{
  "label": "乡宁县",
  "value": "141029" },

{
  "label": "大宁县",
  "value": "141030" },

{
  "label": "隰县",
  "value": "141031" },

{
  "label": "永和县",
  "value": "141032" },

{
  "label": "蒲县",
  "value": "141033" },

{
  "label": "汾西县",
  "value": "141034" },

{
  "label": "侯马市",
  "value": "141081" },

{
  "label": "霍州市",
  "value": "141082" }],


[{
  "label": "离石区",
  "value": "141102" },

{
  "label": "文水县",
  "value": "141121" },

{
  "label": "交城县",
  "value": "141122" },

{
  "label": "兴县",
  "value": "141123" },

{
  "label": "临县",
  "value": "141124" },

{
  "label": "柳林县",
  "value": "141125" },

{
  "label": "石楼县",
  "value": "141126" },

{
  "label": "岚县",
  "value": "141127" },

{
  "label": "方山县",
  "value": "141128" },

{
  "label": "中阳县",
  "value": "141129" },

{
  "label": "交口县",
  "value": "141130" },

{
  "label": "孝义市",
  "value": "141181" },

{
  "label": "汾阳市",
  "value": "141182" }]],



[
[{
  "label": "新城区",
  "value": "150102" },

{
  "label": "回民区",
  "value": "150103" },

{
  "label": "玉泉区",
  "value": "150104" },

{
  "label": "赛罕区",
  "value": "150105" },

{
  "label": "土默特左旗",
  "value": "150121" },

{
  "label": "托克托县",
  "value": "150122" },

{
  "label": "和林格尔县",
  "value": "150123" },

{
  "label": "清水河县",
  "value": "150124" },

{
  "label": "武川县",
  "value": "150125" },

{
  "label": "呼和浩特金海工业园区",
  "value": "150171" },

{
  "label": "呼和浩特经济技术开发区",
  "value": "150172" }],


[{
  "label": "东河区",
  "value": "150202" },

{
  "label": "昆都仑区",
  "value": "150203" },

{
  "label": "青山区",
  "value": "150204" },

{
  "label": "石拐区",
  "value": "150205" },

{
  "label": "白云鄂博矿区",
  "value": "150206" },

{
  "label": "九原区",
  "value": "150207" },

{
  "label": "土默特右旗",
  "value": "150221" },

{
  "label": "固阳县",
  "value": "150222" },

{
  "label": "达尔罕茂明安联合旗",
  "value": "150223" },

{
  "label": "包头稀土高新技术产业开发区",
  "value": "150271" }],


[{
  "label": "海勃湾区",
  "value": "150302" },

{
  "label": "海南区",
  "value": "150303" },

{
  "label": "乌达区",
  "value": "150304" }],


[{
  "label": "红山区",
  "value": "150402" },

{
  "label": "元宝山区",
  "value": "150403" },

{
  "label": "松山区",
  "value": "150404" },

{
  "label": "阿鲁科尔沁旗",
  "value": "150421" },

{
  "label": "巴林左旗",
  "value": "150422" },

{
  "label": "巴林右旗",
  "value": "150423" },

{
  "label": "林西县",
  "value": "150424" },

{
  "label": "克什克腾旗",
  "value": "150425" },

{
  "label": "翁牛特旗",
  "value": "150426" },

{
  "label": "喀喇沁旗",
  "value": "150428" },

{
  "label": "宁城县",
  "value": "150429" },

{
  "label": "敖汉旗",
  "value": "150430" }],


[{
  "label": "科尔沁区",
  "value": "150502" },

{
  "label": "科尔沁左翼中旗",
  "value": "150521" },

{
  "label": "科尔沁左翼后旗",
  "value": "150522" },

{
  "label": "开鲁县",
  "value": "150523" },

{
  "label": "库伦旗",
  "value": "150524" },

{
  "label": "奈曼旗",
  "value": "150525" },

{
  "label": "扎鲁特旗",
  "value": "150526" },

{
  "label": "通辽经济技术开发区",
  "value": "150571" },

{
  "label": "霍林郭勒市",
  "value": "150581" }],


[{
  "label": "东胜区",
  "value": "150602" },

{
  "label": "康巴什区",
  "value": "150603" },

{
  "label": "达拉特旗",
  "value": "150621" },

{
  "label": "准格尔旗",
  "value": "150622" },

{
  "label": "鄂托克前旗",
  "value": "150623" },

{
  "label": "鄂托克旗",
  "value": "150624" },

{
  "label": "杭锦旗",
  "value": "150625" },

{
  "label": "乌审旗",
  "value": "150626" },

{
  "label": "伊金霍洛旗",
  "value": "150627" }],


[{
  "label": "海拉尔区",
  "value": "150702" },

{
  "label": "扎赉诺尔区",
  "value": "150703" },

{
  "label": "阿荣旗",
  "value": "150721" },

{
  "label": "莫力达瓦达斡尔族自治旗",
  "value": "150722" },

{
  "label": "鄂伦春自治旗",
  "value": "150723" },

{
  "label": "鄂温克族自治旗",
  "value": "150724" },

{
  "label": "陈巴尔虎旗",
  "value": "150725" },

{
  "label": "新巴尔虎左旗",
  "value": "150726" },

{
  "label": "新巴尔虎右旗",
  "value": "150727" },

{
  "label": "满洲里市",
  "value": "150781" },

{
  "label": "牙克石市",
  "value": "150782" },

{
  "label": "扎兰屯市",
  "value": "150783" },

{
  "label": "额尔古纳市",
  "value": "150784" },

{
  "label": "根河市",
  "value": "150785" }],


[{
  "label": "临河区",
  "value": "150802" },

{
  "label": "五原县",
  "value": "150821" },

{
  "label": "磴口县",
  "value": "150822" },

{
  "label": "乌拉特前旗",
  "value": "150823" },

{
  "label": "乌拉特中旗",
  "value": "150824" },

{
  "label": "乌拉特后旗",
  "value": "150825" },

{
  "label": "杭锦后旗",
  "value": "150826" }],


[{
  "label": "集宁区",
  "value": "150902" },

{
  "label": "卓资县",
  "value": "150921" },

{
  "label": "化德县",
  "value": "150922" },

{
  "label": "商都县",
  "value": "150923" },

{
  "label": "兴和县",
  "value": "150924" },

{
  "label": "凉城县",
  "value": "150925" },

{
  "label": "察哈尔右翼前旗",
  "value": "150926" },

{
  "label": "察哈尔右翼中旗",
  "value": "150927" },

{
  "label": "察哈尔右翼后旗",
  "value": "150928" },

{
  "label": "四子王旗",
  "value": "150929" },

{
  "label": "丰镇市",
  "value": "150981" }],


[{
  "label": "乌兰浩特市",
  "value": "152201" },

{
  "label": "阿尔山市",
  "value": "152202" },

{
  "label": "科尔沁右翼前旗",
  "value": "152221" },

{
  "label": "科尔沁右翼中旗",
  "value": "152222" },

{
  "label": "扎赉特旗",
  "value": "152223" },

{
  "label": "突泉县",
  "value": "152224" }],


[{
  "label": "二连浩特市",
  "value": "152501" },

{
  "label": "锡林浩特市",
  "value": "152502" },

{
  "label": "阿巴嘎旗",
  "value": "152522" },

{
  "label": "苏尼特左旗",
  "value": "152523" },

{
  "label": "苏尼特右旗",
  "value": "152524" },

{
  "label": "东乌珠穆沁旗",
  "value": "152525" },

{
  "label": "西乌珠穆沁旗",
  "value": "152526" },

{
  "label": "太仆寺旗",
  "value": "152527" },

{
  "label": "镶黄旗",
  "value": "152528" },

{
  "label": "正镶白旗",
  "value": "152529" },

{
  "label": "正蓝旗",
  "value": "152530" },

{
  "label": "多伦县",
  "value": "152531" },

{
  "label": "乌拉盖管委会",
  "value": "152571" }],


[{
  "label": "阿拉善左旗",
  "value": "152921" },

{
  "label": "阿拉善右旗",
  "value": "152922" },

{
  "label": "额济纳旗",
  "value": "152923" },

{
  "label": "内蒙古阿拉善经济开发区",
  "value": "152971" }]],



[
[{
  "label": "和平区",
  "value": "210102" },

{
  "label": "沈河区",
  "value": "210103" },

{
  "label": "大东区",
  "value": "210104" },

{
  "label": "皇姑区",
  "value": "210105" },

{
  "label": "铁西区",
  "value": "210106" },

{
  "label": "苏家屯区",
  "value": "210111" },

{
  "label": "浑南区",
  "value": "210112" },

{
  "label": "沈北新区",
  "value": "210113" },

{
  "label": "于洪区",
  "value": "210114" },

{
  "label": "辽中区",
  "value": "210115" },

{
  "label": "康平县",
  "value": "210123" },

{
  "label": "法库县",
  "value": "210124" },

{
  "label": "新民市",
  "value": "210181" }],


[{
  "label": "中山区",
  "value": "210202" },

{
  "label": "西岗区",
  "value": "210203" },

{
  "label": "沙河口区",
  "value": "210204" },

{
  "label": "甘井子区",
  "value": "210211" },

{
  "label": "旅顺口区",
  "value": "210212" },

{
  "label": "金州区",
  "value": "210213" },

{
  "label": "普兰店区",
  "value": "210214" },

{
  "label": "长海县",
  "value": "210224" },

{
  "label": "瓦房店市",
  "value": "210281" },

{
  "label": "庄河市",
  "value": "210283" }],


[{
  "label": "铁东区",
  "value": "210302" },

{
  "label": "铁西区",
  "value": "210303" },

{
  "label": "立山区",
  "value": "210304" },

{
  "label": "千山区",
  "value": "210311" },

{
  "label": "台安县",
  "value": "210321" },

{
  "label": "岫岩满族自治县",
  "value": "210323" },

{
  "label": "海城市",
  "value": "210381" }],


[{
  "label": "新抚区",
  "value": "210402" },

{
  "label": "东洲区",
  "value": "210403" },

{
  "label": "望花区",
  "value": "210404" },

{
  "label": "顺城区",
  "value": "210411" },

{
  "label": "抚顺县",
  "value": "210421" },

{
  "label": "新宾满族自治县",
  "value": "210422" },

{
  "label": "清原满族自治县",
  "value": "210423" }],


[{
  "label": "平山区",
  "value": "210502" },

{
  "label": "溪湖区",
  "value": "210503" },

{
  "label": "明山区",
  "value": "210504" },

{
  "label": "南芬区",
  "value": "210505" },

{
  "label": "本溪满族自治县",
  "value": "210521" },

{
  "label": "桓仁满族自治县",
  "value": "210522" }],


[{
  "label": "元宝区",
  "value": "210602" },

{
  "label": "振兴区",
  "value": "210603" },

{
  "label": "振安区",
  "value": "210604" },

{
  "label": "宽甸满族自治县",
  "value": "210624" },

{
  "label": "东港市",
  "value": "210681" },

{
  "label": "凤城市",
  "value": "210682" }],


[{
  "label": "古塔区",
  "value": "210702" },

{
  "label": "凌河区",
  "value": "210703" },

{
  "label": "太和区",
  "value": "210711" },

{
  "label": "黑山县",
  "value": "210726" },

{
  "label": "义县",
  "value": "210727" },

{
  "label": "凌海市",
  "value": "210781" },

{
  "label": "北镇市",
  "value": "210782" }],


[{
  "label": "站前区",
  "value": "210802" },

{
  "label": "西市区",
  "value": "210803" },

{
  "label": "鲅鱼圈区",
  "value": "210804" },

{
  "label": "老边区",
  "value": "210811" },

{
  "label": "盖州市",
  "value": "210881" },

{
  "label": "大石桥市",
  "value": "210882" }],


[{
  "label": "海州区",
  "value": "210902" },

{
  "label": "新邱区",
  "value": "210903" },

{
  "label": "太平区",
  "value": "210904" },

{
  "label": "清河门区",
  "value": "210905" },

{
  "label": "细河区",
  "value": "210911" },

{
  "label": "阜新蒙古族自治县",
  "value": "210921" },

{
  "label": "彰武县",
  "value": "210922" }],


[{
  "label": "白塔区",
  "value": "211002" },

{
  "label": "文圣区",
  "value": "211003" },

{
  "label": "宏伟区",
  "value": "211004" },

{
  "label": "弓长岭区",
  "value": "211005" },

{
  "label": "太子河区",
  "value": "211011" },

{
  "label": "辽阳县",
  "value": "211021" },

{
  "label": "灯塔市",
  "value": "211081" }],


[{
  "label": "双台子区",
  "value": "211102" },

{
  "label": "兴隆台区",
  "value": "211103" },

{
  "label": "大洼区",
  "value": "211104" },

{
  "label": "盘山县",
  "value": "211122" }],


[{
  "label": "银州区",
  "value": "211202" },

{
  "label": "清河区",
  "value": "211204" },

{
  "label": "铁岭县",
  "value": "211221" },

{
  "label": "西丰县",
  "value": "211223" },

{
  "label": "昌图县",
  "value": "211224" },

{
  "label": "调兵山市",
  "value": "211281" },

{
  "label": "开原市",
  "value": "211282" }],


[{
  "label": "双塔区",
  "value": "211302" },

{
  "label": "龙城区",
  "value": "211303" },

{
  "label": "朝阳县",
  "value": "211321" },

{
  "label": "建平县",
  "value": "211322" },

{
  "label": "喀喇沁左翼蒙古族自治县",
  "value": "211324" },

{
  "label": "北票市",
  "value": "211381" },

{
  "label": "凌源市",
  "value": "211382" }],


[{
  "label": "连山区",
  "value": "211402" },

{
  "label": "龙港区",
  "value": "211403" },

{
  "label": "南票区",
  "value": "211404" },

{
  "label": "绥中县",
  "value": "211421" },

{
  "label": "建昌县",
  "value": "211422" },

{
  "label": "兴城市",
  "value": "211481" }]],



[
[{
  "label": "南关区",
  "value": "220102" },

{
  "label": "宽城区",
  "value": "220103" },

{
  "label": "朝阳区",
  "value": "220104" },

{
  "label": "二道区",
  "value": "220105" },

{
  "label": "绿园区",
  "value": "220106" },

{
  "label": "双阳区",
  "value": "220112" },

{
  "label": "九台区",
  "value": "220113" },

{
  "label": "农安县",
  "value": "220122" },

{
  "label": "长春经济技术开发区",
  "value": "220171" },

{
  "label": "长春净月高新技术产业开发区",
  "value": "220172" },

{
  "label": "长春高新技术产业开发区",
  "value": "220173" },

{
  "label": "长春汽车经济技术开发区",
  "value": "220174" },

{
  "label": "榆树市",
  "value": "220182" },

{
  "label": "德惠市",
  "value": "220183" }],


[{
  "label": "昌邑区",
  "value": "220202" },

{
  "label": "龙潭区",
  "value": "220203" },

{
  "label": "船营区",
  "value": "220204" },

{
  "label": "丰满区",
  "value": "220211" },

{
  "label": "永吉县",
  "value": "220221" },

{
  "label": "吉林经济开发区",
  "value": "220271" },

{
  "label": "吉林高新技术产业开发区",
  "value": "220272" },

{
  "label": "吉林中国新加坡食品区",
  "value": "220273" },

{
  "label": "蛟河市",
  "value": "220281" },

{
  "label": "桦甸市",
  "value": "220282" },

{
  "label": "舒兰市",
  "value": "220283" },

{
  "label": "磐石市",
  "value": "220284" }],


[{
  "label": "铁西区",
  "value": "220302" },

{
  "label": "铁东区",
  "value": "220303" },

{
  "label": "梨树县",
  "value": "220322" },

{
  "label": "伊通满族自治县",
  "value": "220323" },

{
  "label": "公主岭市",
  "value": "220381" },

{
  "label": "双辽市",
  "value": "220382" }],


[{
  "label": "龙山区",
  "value": "220402" },

{
  "label": "西安区",
  "value": "220403" },

{
  "label": "东丰县",
  "value": "220421" },

{
  "label": "东辽县",
  "value": "220422" }],


[{
  "label": "东昌区",
  "value": "220502" },

{
  "label": "二道江区",
  "value": "220503" },

{
  "label": "通化县",
  "value": "220521" },

{
  "label": "辉南县",
  "value": "220523" },

{
  "label": "柳河县",
  "value": "220524" },

{
  "label": "梅河口市",
  "value": "220581" },

{
  "label": "集安市",
  "value": "220582" }],


[{
  "label": "浑江区",
  "value": "220602" },

{
  "label": "江源区",
  "value": "220605" },

{
  "label": "抚松县",
  "value": "220621" },

{
  "label": "靖宇县",
  "value": "220622" },

{
  "label": "长白朝鲜族自治县",
  "value": "220623" },

{
  "label": "临江市",
  "value": "220681" }],


[{
  "label": "宁江区",
  "value": "220702" },

{
  "label": "前郭尔罗斯蒙古族自治县",
  "value": "220721" },

{
  "label": "长岭县",
  "value": "220722" },

{
  "label": "乾安县",
  "value": "220723" },

{
  "label": "吉林松原经济开发区",
  "value": "220771" },

{
  "label": "扶余市",
  "value": "220781" }],


[{
  "label": "洮北区",
  "value": "220802" },

{
  "label": "镇赉县",
  "value": "220821" },

{
  "label": "通榆县",
  "value": "220822" },

{
  "label": "吉林白城经济开发区",
  "value": "220871" },

{
  "label": "洮南市",
  "value": "220881" },

{
  "label": "大安市",
  "value": "220882" }],


[{
  "label": "延吉市",
  "value": "222401" },

{
  "label": "图们市",
  "value": "222402" },

{
  "label": "敦化市",
  "value": "222403" },

{
  "label": "珲春市",
  "value": "222404" },

{
  "label": "龙井市",
  "value": "222405" },

{
  "label": "和龙市",
  "value": "222406" },

{
  "label": "汪清县",
  "value": "222424" },

{
  "label": "安图县",
  "value": "222426" }]],



[
[{
  "label": "道里区",
  "value": "230102" },

{
  "label": "南岗区",
  "value": "230103" },

{
  "label": "道外区",
  "value": "230104" },

{
  "label": "平房区",
  "value": "230108" },

{
  "label": "松北区",
  "value": "230109" },

{
  "label": "香坊区",
  "value": "230110" },

{
  "label": "呼兰区",
  "value": "230111" },

{
  "label": "阿城区",
  "value": "230112" },

{
  "label": "双城区",
  "value": "230113" },

{
  "label": "依兰县",
  "value": "230123" },

{
  "label": "方正县",
  "value": "230124" },

{
  "label": "宾县",
  "value": "230125" },

{
  "label": "巴彦县",
  "value": "230126" },

{
  "label": "木兰县",
  "value": "230127" },

{
  "label": "通河县",
  "value": "230128" },

{
  "label": "延寿县",
  "value": "230129" },

{
  "label": "尚志市",
  "value": "230183" },

{
  "label": "五常市",
  "value": "230184" }],


[{
  "label": "龙沙区",
  "value": "230202" },

{
  "label": "建华区",
  "value": "230203" },

{
  "label": "铁锋区",
  "value": "230204" },

{
  "label": "昂昂溪区",
  "value": "230205" },

{
  "label": "富拉尔基区",
  "value": "230206" },

{
  "label": "碾子山区",
  "value": "230207" },

{
  "label": "梅里斯达斡尔族区",
  "value": "230208" },

{
  "label": "龙江县",
  "value": "230221" },

{
  "label": "依安县",
  "value": "230223" },

{
  "label": "泰来县",
  "value": "230224" },

{
  "label": "甘南县",
  "value": "230225" },

{
  "label": "富裕县",
  "value": "230227" },

{
  "label": "克山县",
  "value": "230229" },

{
  "label": "克东县",
  "value": "230230" },

{
  "label": "拜泉县",
  "value": "230231" },

{
  "label": "讷河市",
  "value": "230281" }],


[{
  "label": "鸡冠区",
  "value": "230302" },

{
  "label": "恒山区",
  "value": "230303" },

{
  "label": "滴道区",
  "value": "230304" },

{
  "label": "梨树区",
  "value": "230305" },

{
  "label": "城子河区",
  "value": "230306" },

{
  "label": "麻山区",
  "value": "230307" },

{
  "label": "鸡东县",
  "value": "230321" },

{
  "label": "虎林市",
  "value": "230381" },

{
  "label": "密山市",
  "value": "230382" }],


[{
  "label": "向阳区",
  "value": "230402" },

{
  "label": "工农区",
  "value": "230403" },

{
  "label": "南山区",
  "value": "230404" },

{
  "label": "兴安区",
  "value": "230405" },

{
  "label": "东山区",
  "value": "230406" },

{
  "label": "兴山区",
  "value": "230407" },

{
  "label": "萝北县",
  "value": "230421" },

{
  "label": "绥滨县",
  "value": "230422" }],


[{
  "label": "尖山区",
  "value": "230502" },

{
  "label": "岭东区",
  "value": "230503" },

{
  "label": "四方台区",
  "value": "230505" },

{
  "label": "宝山区",
  "value": "230506" },

{
  "label": "集贤县",
  "value": "230521" },

{
  "label": "友谊县",
  "value": "230522" },

{
  "label": "宝清县",
  "value": "230523" },

{
  "label": "饶河县",
  "value": "230524" }],


[{
  "label": "萨尔图区",
  "value": "230602" },

{
  "label": "龙凤区",
  "value": "230603" },

{
  "label": "让胡路区",
  "value": "230604" },

{
  "label": "红岗区",
  "value": "230605" },

{
  "label": "大同区",
  "value": "230606" },

{
  "label": "肇州县",
  "value": "230621" },

{
  "label": "肇源县",
  "value": "230622" },

{
  "label": "林甸县",
  "value": "230623" },

{
  "label": "杜尔伯特蒙古族自治县",
  "value": "230624" },

{
  "label": "大庆高新技术产业开发区",
  "value": "230671" }],


[{
  "label": "伊春区",
  "value": "230702" },

{
  "label": "南岔区",
  "value": "230703" },

{
  "label": "友好区",
  "value": "230704" },

{
  "label": "西林区",
  "value": "230705" },

{
  "label": "翠峦区",
  "value": "230706" },

{
  "label": "新青区",
  "value": "230707" },

{
  "label": "美溪区",
  "value": "230708" },

{
  "label": "金山屯区",
  "value": "230709" },

{
  "label": "五营区",
  "value": "230710" },

{
  "label": "乌马河区",
  "value": "230711" },

{
  "label": "汤旺河区",
  "value": "230712" },

{
  "label": "带岭区",
  "value": "230713" },

{
  "label": "乌伊岭区",
  "value": "230714" },

{
  "label": "红星区",
  "value": "230715" },

{
  "label": "上甘岭区",
  "value": "230716" },

{
  "label": "嘉荫县",
  "value": "230722" },

{
  "label": "铁力市",
  "value": "230781" }],


[{
  "label": "向阳区",
  "value": "230803" },

{
  "label": "前进区",
  "value": "230804" },

{
  "label": "东风区",
  "value": "230805" },

{
  "label": "郊区",
  "value": "230811" },

{
  "label": "桦南县",
  "value": "230822" },

{
  "label": "桦川县",
  "value": "230826" },

{
  "label": "汤原县",
  "value": "230828" },

{
  "label": "同江市",
  "value": "230881" },

{
  "label": "富锦市",
  "value": "230882" },

{
  "label": "抚远市",
  "value": "230883" }],


[{
  "label": "新兴区",
  "value": "230902" },

{
  "label": "桃山区",
  "value": "230903" },

{
  "label": "茄子河区",
  "value": "230904" },

{
  "label": "勃利县",
  "value": "230921" }],


[{
  "label": "东安区",
  "value": "231002" },

{
  "label": "阳明区",
  "value": "231003" },

{
  "label": "爱民区",
  "value": "231004" },

{
  "label": "西安区",
  "value": "231005" },

{
  "label": "林口县",
  "value": "231025" },

{
  "label": "牡丹江经济技术开发区",
  "value": "231071" },

{
  "label": "绥芬河市",
  "value": "231081" },

{
  "label": "海林市",
  "value": "231083" },

{
  "label": "宁安市",
  "value": "231084" },

{
  "label": "穆棱市",
  "value": "231085" },

{
  "label": "东宁市",
  "value": "231086" }],


[{
  "label": "爱辉区",
  "value": "231102" },

{
  "label": "嫩江县",
  "value": "231121" },

{
  "label": "逊克县",
  "value": "231123" },

{
  "label": "孙吴县",
  "value": "231124" },

{
  "label": "北安市",
  "value": "231181" },

{
  "label": "五大连池市",
  "value": "231182" }],


[{
  "label": "北林区",
  "value": "231202" },

{
  "label": "望奎县",
  "value": "231221" },

{
  "label": "兰西县",
  "value": "231222" },

{
  "label": "青冈县",
  "value": "231223" },

{
  "label": "庆安县",
  "value": "231224" },

{
  "label": "明水县",
  "value": "231225" },

{
  "label": "绥棱县",
  "value": "231226" },

{
  "label": "安达市",
  "value": "231281" },

{
  "label": "肇东市",
  "value": "231282" },

{
  "label": "海伦市",
  "value": "231283" }],


[{
  "label": "加格达奇区",
  "value": "232701" },

{
  "label": "松岭区",
  "value": "232702" },

{
  "label": "新林区",
  "value": "232703" },

{
  "label": "呼中区",
  "value": "232704" },

{
  "label": "呼玛县",
  "value": "232721" },

{
  "label": "塔河县",
  "value": "232722" },

{
  "label": "漠河县",
  "value": "232723" }]],



[
[{
  "label": "黄浦区",
  "value": "310101" },

{
  "label": "徐汇区",
  "value": "310104" },

{
  "label": "长宁区",
  "value": "310105" },

{
  "label": "静安区",
  "value": "310106" },

{
  "label": "普陀区",
  "value": "310107" },

{
  "label": "虹口区",
  "value": "310109" },

{
  "label": "杨浦区",
  "value": "310110" },

{
  "label": "闵行区",
  "value": "310112" },

{
  "label": "宝山区",
  "value": "310113" },

{
  "label": "嘉定区",
  "value": "310114" },

{
  "label": "浦东新区",
  "value": "310115" },

{
  "label": "金山区",
  "value": "310116" },

{
  "label": "松江区",
  "value": "310117" },

{
  "label": "青浦区",
  "value": "310118" },

{
  "label": "奉贤区",
  "value": "310120" },

{
  "label": "崇明区",
  "value": "310151" }]],



[
[{
  "label": "玄武区",
  "value": "320102" },

{
  "label": "秦淮区",
  "value": "320104" },

{
  "label": "建邺区",
  "value": "320105" },

{
  "label": "鼓楼区",
  "value": "320106" },

{
  "label": "浦口区",
  "value": "320111" },

{
  "label": "栖霞区",
  "value": "320113" },

{
  "label": "雨花台区",
  "value": "320114" },

{
  "label": "江宁区",
  "value": "320115" },

{
  "label": "六合区",
  "value": "320116" },

{
  "label": "溧水区",
  "value": "320117" },

{
  "label": "高淳区",
  "value": "320118" }],


[{
  "label": "锡山区",
  "value": "320205" },

{
  "label": "惠山区",
  "value": "320206" },

{
  "label": "滨湖区",
  "value": "320211" },

{
  "label": "梁溪区",
  "value": "320213" },

{
  "label": "新吴区",
  "value": "320214" },

{
  "label": "江阴市",
  "value": "320281" },

{
  "label": "宜兴市",
  "value": "320282" }],


[{
  "label": "鼓楼区",
  "value": "320302" },

{
  "label": "云龙区",
  "value": "320303" },

{
  "label": "贾汪区",
  "value": "320305" },

{
  "label": "泉山区",
  "value": "320311" },

{
  "label": "铜山区",
  "value": "320312" },

{
  "label": "丰县",
  "value": "320321" },

{
  "label": "沛县",
  "value": "320322" },

{
  "label": "睢宁县",
  "value": "320324" },

{
  "label": "徐州经济技术开发区",
  "value": "320371" },

{
  "label": "新沂市",
  "value": "320381" },

{
  "label": "邳州市",
  "value": "320382" }],


[{
  "label": "天宁区",
  "value": "320402" },

{
  "label": "钟楼区",
  "value": "320404" },

{
  "label": "新北区",
  "value": "320411" },

{
  "label": "武进区",
  "value": "320412" },

{
  "label": "金坛区",
  "value": "320413" },

{
  "label": "溧阳市",
  "value": "320481" }],


[{
  "label": "虎丘区",
  "value": "320505" },

{
  "label": "吴中区",
  "value": "320506" },

{
  "label": "相城区",
  "value": "320507" },

{
  "label": "姑苏区",
  "value": "320508" },

{
  "label": "吴江区",
  "value": "320509" },

{
  "label": "苏州工业园区",
  "value": "320571" },

{
  "label": "常熟市",
  "value": "320581" },

{
  "label": "张家港市",
  "value": "320582" },

{
  "label": "昆山市",
  "value": "320583" },

{
  "label": "太仓市",
  "value": "320585" }],


[{
  "label": "崇川区",
  "value": "320602" },

{
  "label": "港闸区",
  "value": "320611" },

{
  "label": "通州区",
  "value": "320612" },

{
  "label": "海安县",
  "value": "320621" },

{
  "label": "如东县",
  "value": "320623" },

{
  "label": "南通经济技术开发区",
  "value": "320671" },

{
  "label": "启东市",
  "value": "320681" },

{
  "label": "如皋市",
  "value": "320682" },

{
  "label": "海门市",
  "value": "320684" }],


[{
  "label": "连云区",
  "value": "320703" },

{
  "label": "海州区",
  "value": "320706" },

{
  "label": "赣榆区",
  "value": "320707" },

{
  "label": "东海县",
  "value": "320722" },

{
  "label": "灌云县",
  "value": "320723" },

{
  "label": "灌南县",
  "value": "320724" },

{
  "label": "连云港经济技术开发区",
  "value": "320771" },

{
  "label": "连云港高新技术产业开发区",
  "value": "320772" }],


[{
  "label": "淮安区",
  "value": "320803" },

{
  "label": "淮阴区",
  "value": "320804" },

{
  "label": "清江浦区",
  "value": "320812" },

{
  "label": "洪泽区",
  "value": "320813" },

{
  "label": "涟水县",
  "value": "320826" },

{
  "label": "盱眙县",
  "value": "320830" },

{
  "label": "金湖县",
  "value": "320831" },

{
  "label": "淮安经济技术开发区",
  "value": "320871" }],


[{
  "label": "亭湖区",
  "value": "320902" },

{
  "label": "盐都区",
  "value": "320903" },

{
  "label": "大丰区",
  "value": "320904" },

{
  "label": "响水县",
  "value": "320921" },

{
  "label": "滨海县",
  "value": "320922" },

{
  "label": "阜宁县",
  "value": "320923" },

{
  "label": "射阳县",
  "value": "320924" },

{
  "label": "建湖县",
  "value": "320925" },

{
  "label": "盐城经济技术开发区",
  "value": "320971" },

{
  "label": "东台市",
  "value": "320981" }],


[{
  "label": "广陵区",
  "value": "321002" },

{
  "label": "邗江区",
  "value": "321003" },

{
  "label": "江都区",
  "value": "321012" },

{
  "label": "宝应县",
  "value": "321023" },

{
  "label": "扬州经济技术开发区",
  "value": "321071" },

{
  "label": "仪征市",
  "value": "321081" },

{
  "label": "高邮市",
  "value": "321084" }],


[{
  "label": "京口区",
  "value": "321102" },

{
  "label": "润州区",
  "value": "321111" },

{
  "label": "丹徒区",
  "value": "321112" },

{
  "label": "镇江新区",
  "value": "321171" },

{
  "label": "丹阳市",
  "value": "321181" },

{
  "label": "扬中市",
  "value": "321182" },

{
  "label": "句容市",
  "value": "321183" }],


[{
  "label": "海陵区",
  "value": "321202" },

{
  "label": "高港区",
  "value": "321203" },

{
  "label": "姜堰区",
  "value": "321204" },

{
  "label": "泰州医药高新技术产业开发区",
  "value": "321271" },

{
  "label": "兴化市",
  "value": "321281" },

{
  "label": "靖江市",
  "value": "321282" },

{
  "label": "泰兴市",
  "value": "321283" }],


[{
  "label": "宿城区",
  "value": "321302" },

{
  "label": "宿豫区",
  "value": "321311" },

{
  "label": "沭阳县",
  "value": "321322" },

{
  "label": "泗阳县",
  "value": "321323" },

{
  "label": "泗洪县",
  "value": "321324" },

{
  "label": "宿迁经济技术开发区",
  "value": "321371" }]],



[
[{
  "label": "上城区",
  "value": "330102" },

{
  "label": "下城区",
  "value": "330103" },

{
  "label": "江干区",
  "value": "330104" },

{
  "label": "拱墅区",
  "value": "330105" },

{
  "label": "西湖区",
  "value": "330106" },

{
  "label": "滨江区",
  "value": "330108" },

{
  "label": "萧山区",
  "value": "330109" },

{
  "label": "余杭区",
  "value": "330110" },

{
  "label": "富阳区",
  "value": "330111" },

{
  "label": "临安区",
  "value": "330112" },

{
  "label": "桐庐县",
  "value": "330122" },

{
  "label": "淳安县",
  "value": "330127" },

{
  "label": "建德市",
  "value": "330182" }],


[{
  "label": "海曙区",
  "value": "330203" },

{
  "label": "江北区",
  "value": "330205" },

{
  "label": "北仑区",
  "value": "330206" },

{
  "label": "镇海区",
  "value": "330211" },

{
  "label": "鄞州区",
  "value": "330212" },

{
  "label": "奉化区",
  "value": "330213" },

{
  "label": "象山县",
  "value": "330225" },

{
  "label": "宁海县",
  "value": "330226" },

{
  "label": "余姚市",
  "value": "330281" },

{
  "label": "慈溪市",
  "value": "330282" }],


[{
  "label": "鹿城区",
  "value": "330302" },

{
  "label": "龙湾区",
  "value": "330303" },

{
  "label": "瓯海区",
  "value": "330304" },

{
  "label": "洞头区",
  "value": "330305" },

{
  "label": "永嘉县",
  "value": "330324" },

{
  "label": "平阳县",
  "value": "330326" },

{
  "label": "苍南县",
  "value": "330327" },

{
  "label": "文成县",
  "value": "330328" },

{
  "label": "泰顺县",
  "value": "330329" },

{
  "label": "温州经济技术开发区",
  "value": "330371" },

{
  "label": "瑞安市",
  "value": "330381" },

{
  "label": "乐清市",
  "value": "330382" }],


[{
  "label": "南湖区",
  "value": "330402" },

{
  "label": "秀洲区",
  "value": "330411" },

{
  "label": "嘉善县",
  "value": "330421" },

{
  "label": "海盐县",
  "value": "330424" },

{
  "label": "海宁市",
  "value": "330481" },

{
  "label": "平湖市",
  "value": "330482" },

{
  "label": "桐乡市",
  "value": "330483" }],


[{
  "label": "吴兴区",
  "value": "330502" },

{
  "label": "南浔区",
  "value": "330503" },

{
  "label": "德清县",
  "value": "330521" },

{
  "label": "长兴县",
  "value": "330522" },

{
  "label": "安吉县",
  "value": "330523" }],


[{
  "label": "越城区",
  "value": "330602" },

{
  "label": "柯桥区",
  "value": "330603" },

{
  "label": "上虞区",
  "value": "330604" },

{
  "label": "新昌县",
  "value": "330624" },

{
  "label": "诸暨市",
  "value": "330681" },

{
  "label": "嵊州市",
  "value": "330683" }],


[{
  "label": "婺城区",
  "value": "330702" },

{
  "label": "金东区",
  "value": "330703" },

{
  "label": "武义县",
  "value": "330723" },

{
  "label": "浦江县",
  "value": "330726" },

{
  "label": "磐安县",
  "value": "330727" },

{
  "label": "兰溪市",
  "value": "330781" },

{
  "label": "义乌市",
  "value": "330782" },

{
  "label": "东阳市",
  "value": "330783" },

{
  "label": "永康市",
  "value": "330784" }],


[{
  "label": "柯城区",
  "value": "330802" },

{
  "label": "衢江区",
  "value": "330803" },

{
  "label": "常山县",
  "value": "330822" },

{
  "label": "开化县",
  "value": "330824" },

{
  "label": "龙游县",
  "value": "330825" },

{
  "label": "江山市",
  "value": "330881" }],


[{
  "label": "定海区",
  "value": "330902" },

{
  "label": "普陀区",
  "value": "330903" },

{
  "label": "岱山县",
  "value": "330921" },

{
  "label": "嵊泗县",
  "value": "330922" }],


[{
  "label": "椒江区",
  "value": "331002" },

{
  "label": "黄岩区",
  "value": "331003" },

{
  "label": "路桥区",
  "value": "331004" },

{
  "label": "三门县",
  "value": "331022" },

{
  "label": "天台县",
  "value": "331023" },

{
  "label": "仙居县",
  "value": "331024" },

{
  "label": "温岭市",
  "value": "331081" },

{
  "label": "临海市",
  "value": "331082" },

{
  "label": "玉环市",
  "value": "331083" }],


[{
  "label": "莲都区",
  "value": "331102" },

{
  "label": "青田县",
  "value": "331121" },

{
  "label": "缙云县",
  "value": "331122" },

{
  "label": "遂昌县",
  "value": "331123" },

{
  "label": "松阳县",
  "value": "331124" },

{
  "label": "云和县",
  "value": "331125" },

{
  "label": "庆元县",
  "value": "331126" },

{
  "label": "景宁畲族自治县",
  "value": "331127" },

{
  "label": "龙泉市",
  "value": "331181" }]],



[
[{
  "label": "瑶海区",
  "value": "340102" },

{
  "label": "庐阳区",
  "value": "340103" },

{
  "label": "蜀山区",
  "value": "340104" },

{
  "label": "包河区",
  "value": "340111" },

{
  "label": "长丰县",
  "value": "340121" },

{
  "label": "肥东县",
  "value": "340122" },

{
  "label": "肥西县",
  "value": "340123" },

{
  "label": "庐江县",
  "value": "340124" },

{
  "label": "合肥高新技术产业开发区",
  "value": "340171" },

{
  "label": "合肥经济技术开发区",
  "value": "340172" },

{
  "label": "合肥新站高新技术产业开发区",
  "value": "340173" },

{
  "label": "巢湖市",
  "value": "340181" }],


[{
  "label": "镜湖区",
  "value": "340202" },

{
  "label": "弋江区",
  "value": "340203" },

{
  "label": "鸠江区",
  "value": "340207" },

{
  "label": "三山区",
  "value": "340208" },

{
  "label": "芜湖县",
  "value": "340221" },

{
  "label": "繁昌县",
  "value": "340222" },

{
  "label": "南陵县",
  "value": "340223" },

{
  "label": "无为县",
  "value": "340225" },

{
  "label": "芜湖经济技术开发区",
  "value": "340271" },

{
  "label": "安徽芜湖长江大桥经济开发区",
  "value": "340272" }],


[{
  "label": "龙子湖区",
  "value": "340302" },

{
  "label": "蚌山区",
  "value": "340303" },

{
  "label": "禹会区",
  "value": "340304" },

{
  "label": "淮上区",
  "value": "340311" },

{
  "label": "怀远县",
  "value": "340321" },

{
  "label": "五河县",
  "value": "340322" },

{
  "label": "固镇县",
  "value": "340323" },

{
  "label": "蚌埠市高新技术开发区",
  "value": "340371" },

{
  "label": "蚌埠市经济开发区",
  "value": "340372" }],


[{
  "label": "大通区",
  "value": "340402" },

{
  "label": "田家庵区",
  "value": "340403" },

{
  "label": "谢家集区",
  "value": "340404" },

{
  "label": "八公山区",
  "value": "340405" },

{
  "label": "潘集区",
  "value": "340406" },

{
  "label": "凤台县",
  "value": "340421" },

{
  "label": "寿县",
  "value": "340422" }],


[{
  "label": "花山区",
  "value": "340503" },

{
  "label": "雨山区",
  "value": "340504" },

{
  "label": "博望区",
  "value": "340506" },

{
  "label": "当涂县",
  "value": "340521" },

{
  "label": "含山县",
  "value": "340522" },

{
  "label": "和县",
  "value": "340523" }],


[{
  "label": "杜集区",
  "value": "340602" },

{
  "label": "相山区",
  "value": "340603" },

{
  "label": "烈山区",
  "value": "340604" },

{
  "label": "濉溪县",
  "value": "340621" }],


[{
  "label": "铜官区",
  "value": "340705" },

{
  "label": "义安区",
  "value": "340706" },

{
  "label": "郊区",
  "value": "340711" },

{
  "label": "枞阳县",
  "value": "340722" }],


[{
  "label": "迎江区",
  "value": "340802" },

{
  "label": "大观区",
  "value": "340803" },

{
  "label": "宜秀区",
  "value": "340811" },

{
  "label": "怀宁县",
  "value": "340822" },

{
  "label": "潜山县",
  "value": "340824" },

{
  "label": "太湖县",
  "value": "340825" },

{
  "label": "宿松县",
  "value": "340826" },

{
  "label": "望江县",
  "value": "340827" },

{
  "label": "岳西县",
  "value": "340828" },

{
  "label": "安徽安庆经济开发区",
  "value": "340871" },

{
  "label": "桐城市",
  "value": "340881" }],


[{
  "label": "屯溪区",
  "value": "341002" },

{
  "label": "黄山区",
  "value": "341003" },

{
  "label": "徽州区",
  "value": "341004" },

{
  "label": "歙县",
  "value": "341021" },

{
  "label": "休宁县",
  "value": "341022" },

{
  "label": "黟县",
  "value": "341023" },

{
  "label": "祁门县",
  "value": "341024" }],


[{
  "label": "琅琊区",
  "value": "341102" },

{
  "label": "南谯区",
  "value": "341103" },

{
  "label": "来安县",
  "value": "341122" },

{
  "label": "全椒县",
  "value": "341124" },

{
  "label": "定远县",
  "value": "341125" },

{
  "label": "凤阳县",
  "value": "341126" },

{
  "label": "苏滁现代产业园",
  "value": "341171" },

{
  "label": "滁州经济技术开发区",
  "value": "341172" },

{
  "label": "天长市",
  "value": "341181" },

{
  "label": "明光市",
  "value": "341182" }],


[{
  "label": "颍州区",
  "value": "341202" },

{
  "label": "颍东区",
  "value": "341203" },

{
  "label": "颍泉区",
  "value": "341204" },

{
  "label": "临泉县",
  "value": "341221" },

{
  "label": "太和县",
  "value": "341222" },

{
  "label": "阜南县",
  "value": "341225" },

{
  "label": "颍上县",
  "value": "341226" },

{
  "label": "阜阳合肥现代产业园区",
  "value": "341271" },

{
  "label": "阜阳经济技术开发区",
  "value": "341272" },

{
  "label": "界首市",
  "value": "341282" }],


[{
  "label": "埇桥区",
  "value": "341302" },

{
  "label": "砀山县",
  "value": "341321" },

{
  "label": "萧县",
  "value": "341322" },

{
  "label": "灵璧县",
  "value": "341323" },

{
  "label": "泗县",
  "value": "341324" },

{
  "label": "宿州马鞍山现代产业园区",
  "value": "341371" },

{
  "label": "宿州经济技术开发区",
  "value": "341372" }],


[{
  "label": "金安区",
  "value": "341502" },

{
  "label": "裕安区",
  "value": "341503" },

{
  "label": "叶集区",
  "value": "341504" },

{
  "label": "霍邱县",
  "value": "341522" },

{
  "label": "舒城县",
  "value": "341523" },

{
  "label": "金寨县",
  "value": "341524" },

{
  "label": "霍山县",
  "value": "341525" }],


[{
  "label": "谯城区",
  "value": "341602" },

{
  "label": "涡阳县",
  "value": "341621" },

{
  "label": "蒙城县",
  "value": "341622" },

{
  "label": "利辛县",
  "value": "341623" }],


[{
  "label": "贵池区",
  "value": "341702" },

{
  "label": "东至县",
  "value": "341721" },

{
  "label": "石台县",
  "value": "341722" },

{
  "label": "青阳县",
  "value": "341723" }],


[{
  "label": "宣州区",
  "value": "341802" },

{
  "label": "郎溪县",
  "value": "341821" },

{
  "label": "广德县",
  "value": "341822" },

{
  "label": "泾县",
  "value": "341823" },

{
  "label": "绩溪县",
  "value": "341824" },

{
  "label": "旌德县",
  "value": "341825" },

{
  "label": "宣城市经济开发区",
  "value": "341871" },

{
  "label": "宁国市",
  "value": "341881" }]],



[
[{
  "label": "鼓楼区",
  "value": "350102" },

{
  "label": "台江区",
  "value": "350103" },

{
  "label": "仓山区",
  "value": "350104" },

{
  "label": "马尾区",
  "value": "350105" },

{
  "label": "晋安区",
  "value": "350111" },

{
  "label": "闽侯县",
  "value": "350121" },

{
  "label": "连江县",
  "value": "350122" },

{
  "label": "罗源县",
  "value": "350123" },

{
  "label": "闽清县",
  "value": "350124" },

{
  "label": "永泰县",
  "value": "350125" },

{
  "label": "平潭县",
  "value": "350128" },

{
  "label": "福清市",
  "value": "350181" },

{
  "label": "长乐市",
  "value": "350182" }],


[{
  "label": "思明区",
  "value": "350203" },

{
  "label": "海沧区",
  "value": "350205" },

{
  "label": "湖里区",
  "value": "350206" },

{
  "label": "集美区",
  "value": "350211" },

{
  "label": "同安区",
  "value": "350212" },

{
  "label": "翔安区",
  "value": "350213" }],


[{
  "label": "城厢区",
  "value": "350302" },

{
  "label": "涵江区",
  "value": "350303" },

{
  "label": "荔城区",
  "value": "350304" },

{
  "label": "秀屿区",
  "value": "350305" },

{
  "label": "仙游县",
  "value": "350322" }],


[{
  "label": "梅列区",
  "value": "350402" },

{
  "label": "三元区",
  "value": "350403" },

{
  "label": "明溪县",
  "value": "350421" },

{
  "label": "清流县",
  "value": "350423" },

{
  "label": "宁化县",
  "value": "350424" },

{
  "label": "大田县",
  "value": "350425" },

{
  "label": "尤溪县",
  "value": "350426" },

{
  "label": "沙县",
  "value": "350427" },

{
  "label": "将乐县",
  "value": "350428" },

{
  "label": "泰宁县",
  "value": "350429" },

{
  "label": "建宁县",
  "value": "350430" },

{
  "label": "永安市",
  "value": "350481" }],


[{
  "label": "鲤城区",
  "value": "350502" },

{
  "label": "丰泽区",
  "value": "350503" },

{
  "label": "洛江区",
  "value": "350504" },

{
  "label": "泉港区",
  "value": "350505" },

{
  "label": "惠安县",
  "value": "350521" },

{
  "label": "安溪县",
  "value": "350524" },

{
  "label": "永春县",
  "value": "350525" },

{
  "label": "德化县",
  "value": "350526" },

{
  "label": "金门县",
  "value": "350527" },

{
  "label": "石狮市",
  "value": "350581" },

{
  "label": "晋江市",
  "value": "350582" },

{
  "label": "南安市",
  "value": "350583" }],


[{
  "label": "芗城区",
  "value": "350602" },

{
  "label": "龙文区",
  "value": "350603" },

{
  "label": "云霄县",
  "value": "350622" },

{
  "label": "漳浦县",
  "value": "350623" },

{
  "label": "诏安县",
  "value": "350624" },

{
  "label": "长泰县",
  "value": "350625" },

{
  "label": "东山县",
  "value": "350626" },

{
  "label": "南靖县",
  "value": "350627" },

{
  "label": "平和县",
  "value": "350628" },

{
  "label": "华安县",
  "value": "350629" },

{
  "label": "龙海市",
  "value": "350681" }],


[{
  "label": "延平区",
  "value": "350702" },

{
  "label": "建阳区",
  "value": "350703" },

{
  "label": "顺昌县",
  "value": "350721" },

{
  "label": "浦城县",
  "value": "350722" },

{
  "label": "光泽县",
  "value": "350723" },

{
  "label": "松溪县",
  "value": "350724" },

{
  "label": "政和县",
  "value": "350725" },

{
  "label": "邵武市",
  "value": "350781" },

{
  "label": "武夷山市",
  "value": "350782" },

{
  "label": "建瓯市",
  "value": "350783" }],


[{
  "label": "新罗区",
  "value": "350802" },

{
  "label": "永定区",
  "value": "350803" },

{
  "label": "长汀县",
  "value": "350821" },

{
  "label": "上杭县",
  "value": "350823" },

{
  "label": "武平县",
  "value": "350824" },

{
  "label": "连城县",
  "value": "350825" },

{
  "label": "漳平市",
  "value": "350881" }],


[{
  "label": "蕉城区",
  "value": "350902" },

{
  "label": "霞浦县",
  "value": "350921" },

{
  "label": "古田县",
  "value": "350922" },

{
  "label": "屏南县",
  "value": "350923" },

{
  "label": "寿宁县",
  "value": "350924" },

{
  "label": "周宁县",
  "value": "350925" },

{
  "label": "柘荣县",
  "value": "350926" },

{
  "label": "福安市",
  "value": "350981" },

{
  "label": "福鼎市",
  "value": "350982" }]],



[
[{
  "label": "东湖区",
  "value": "360102" },

{
  "label": "西湖区",
  "value": "360103" },

{
  "label": "青云谱区",
  "value": "360104" },

{
  "label": "湾里区",
  "value": "360105" },

{
  "label": "青山湖区",
  "value": "360111" },

{
  "label": "新建区",
  "value": "360112" },

{
  "label": "南昌县",
  "value": "360121" },

{
  "label": "安义县",
  "value": "360123" },

{
  "label": "进贤县",
  "value": "360124" }],


[{
  "label": "昌江区",
  "value": "360202" },

{
  "label": "珠山区",
  "value": "360203" },

{
  "label": "浮梁县",
  "value": "360222" },

{
  "label": "乐平市",
  "value": "360281" }],


[{
  "label": "安源区",
  "value": "360302" },

{
  "label": "湘东区",
  "value": "360313" },

{
  "label": "莲花县",
  "value": "360321" },

{
  "label": "上栗县",
  "value": "360322" },

{
  "label": "芦溪县",
  "value": "360323" }],


[{
  "label": "濂溪区",
  "value": "360402" },

{
  "label": "浔阳区",
  "value": "360403" },

{
  "label": "柴桑区",
  "value": "360404" },

{
  "label": "武宁县",
  "value": "360423" },

{
  "label": "修水县",
  "value": "360424" },

{
  "label": "永修县",
  "value": "360425" },

{
  "label": "德安县",
  "value": "360426" },

{
  "label": "都昌县",
  "value": "360428" },

{
  "label": "湖口县",
  "value": "360429" },

{
  "label": "彭泽县",
  "value": "360430" },

{
  "label": "瑞昌市",
  "value": "360481" },

{
  "label": "共青城市",
  "value": "360482" },

{
  "label": "庐山市",
  "value": "360483" }],


[{
  "label": "渝水区",
  "value": "360502" },

{
  "label": "分宜县",
  "value": "360521" }],


[{
  "label": "月湖区",
  "value": "360602" },

{
  "label": "余江县",
  "value": "360622" },

{
  "label": "贵溪市",
  "value": "360681" }],


[{
  "label": "章贡区",
  "value": "360702" },

{
  "label": "南康区",
  "value": "360703" },

{
  "label": "赣县区",
  "value": "360704" },

{
  "label": "信丰县",
  "value": "360722" },

{
  "label": "大余县",
  "value": "360723" },

{
  "label": "上犹县",
  "value": "360724" },

{
  "label": "崇义县",
  "value": "360725" },

{
  "label": "安远县",
  "value": "360726" },

{
  "label": "龙南县",
  "value": "360727" },

{
  "label": "定南县",
  "value": "360728" },

{
  "label": "全南县",
  "value": "360729" },

{
  "label": "宁都县",
  "value": "360730" },

{
  "label": "于都县",
  "value": "360731" },

{
  "label": "兴国县",
  "value": "360732" },

{
  "label": "会昌县",
  "value": "360733" },

{
  "label": "寻乌县",
  "value": "360734" },

{
  "label": "石城县",
  "value": "360735" },

{
  "label": "瑞金市",
  "value": "360781" }],


[{
  "label": "吉州区",
  "value": "360802" },

{
  "label": "青原区",
  "value": "360803" },

{
  "label": "吉安县",
  "value": "360821" },

{
  "label": "吉水县",
  "value": "360822" },

{
  "label": "峡江县",
  "value": "360823" },

{
  "label": "新干县",
  "value": "360824" },

{
  "label": "永丰县",
  "value": "360825" },

{
  "label": "泰和县",
  "value": "360826" },

{
  "label": "遂川县",
  "value": "360827" },

{
  "label": "万安县",
  "value": "360828" },

{
  "label": "安福县",
  "value": "360829" },

{
  "label": "永新县",
  "value": "360830" },

{
  "label": "井冈山市",
  "value": "360881" }],


[{
  "label": "袁州区",
  "value": "360902" },

{
  "label": "奉新县",
  "value": "360921" },

{
  "label": "万载县",
  "value": "360922" },

{
  "label": "上高县",
  "value": "360923" },

{
  "label": "宜丰县",
  "value": "360924" },

{
  "label": "靖安县",
  "value": "360925" },

{
  "label": "铜鼓县",
  "value": "360926" },

{
  "label": "丰城市",
  "value": "360981" },

{
  "label": "樟树市",
  "value": "360982" },

{
  "label": "高安市",
  "value": "360983" }],


[{
  "label": "临川区",
  "value": "361002" },

{
  "label": "东乡区",
  "value": "361003" },

{
  "label": "南城县",
  "value": "361021" },

{
  "label": "黎川县",
  "value": "361022" },

{
  "label": "南丰县",
  "value": "361023" },

{
  "label": "崇仁县",
  "value": "361024" },

{
  "label": "乐安县",
  "value": "361025" },

{
  "label": "宜黄县",
  "value": "361026" },

{
  "label": "金溪县",
  "value": "361027" },

{
  "label": "资溪县",
  "value": "361028" },

{
  "label": "广昌县",
  "value": "361030" }],


[{
  "label": "信州区",
  "value": "361102" },

{
  "label": "广丰区",
  "value": "361103" },

{
  "label": "上饶县",
  "value": "361121" },

{
  "label": "玉山县",
  "value": "361123" },

{
  "label": "铅山县",
  "value": "361124" },

{
  "label": "横峰县",
  "value": "361125" },

{
  "label": "弋阳县",
  "value": "361126" },

{
  "label": "余干县",
  "value": "361127" },

{
  "label": "鄱阳县",
  "value": "361128" },

{
  "label": "万年县",
  "value": "361129" },

{
  "label": "婺源县",
  "value": "361130" },

{
  "label": "德兴市",
  "value": "361181" }]],



[
[{
  "label": "历下区",
  "value": "370102" },

{
  "label": "市中区",
  "value": "370103" },

{
  "label": "槐荫区",
  "value": "370104" },

{
  "label": "天桥区",
  "value": "370105" },

{
  "label": "历城区",
  "value": "370112" },

{
  "label": "长清区",
  "value": "370113" },

{
  "label": "章丘区",
  "value": "370114" },

{
  "label": "平阴县",
  "value": "370124" },

{
  "label": "济阳县",
  "value": "370125" },

{
  "label": "商河县",
  "value": "370126" },

{
  "label": "济南高新技术产业开发区",
  "value": "370171" }],


[{
  "label": "市南区",
  "value": "370202" },

{
  "label": "市北区",
  "value": "370203" },

{
  "label": "黄岛区",
  "value": "370211" },

{
  "label": "崂山区",
  "value": "370212" },

{
  "label": "李沧区",
  "value": "370213" },

{
  "label": "城阳区",
  "value": "370214" },

{
  "label": "即墨区",
  "value": "370215" },

{
  "label": "青岛高新技术产业开发区",
  "value": "370271" },

{
  "label": "胶州市",
  "value": "370281" },

{
  "label": "平度市",
  "value": "370283" },

{
  "label": "莱西市",
  "value": "370285" }],


[{
  "label": "淄川区",
  "value": "370302" },

{
  "label": "张店区",
  "value": "370303" },

{
  "label": "博山区",
  "value": "370304" },

{
  "label": "临淄区",
  "value": "370305" },

{
  "label": "周村区",
  "value": "370306" },

{
  "label": "桓台县",
  "value": "370321" },

{
  "label": "高青县",
  "value": "370322" },

{
  "label": "沂源县",
  "value": "370323" }],


[{
  "label": "市中区",
  "value": "370402" },

{
  "label": "薛城区",
  "value": "370403" },

{
  "label": "峄城区",
  "value": "370404" },

{
  "label": "台儿庄区",
  "value": "370405" },

{
  "label": "山亭区",
  "value": "370406" },

{
  "label": "滕州市",
  "value": "370481" }],


[{
  "label": "东营区",
  "value": "370502" },

{
  "label": "河口区",
  "value": "370503" },

{
  "label": "垦利区",
  "value": "370505" },

{
  "label": "利津县",
  "value": "370522" },

{
  "label": "广饶县",
  "value": "370523" },

{
  "label": "东营经济技术开发区",
  "value": "370571" },

{
  "label": "东营港经济开发区",
  "value": "370572" }],


[{
  "label": "芝罘区",
  "value": "370602" },

{
  "label": "福山区",
  "value": "370611" },

{
  "label": "牟平区",
  "value": "370612" },

{
  "label": "莱山区",
  "value": "370613" },

{
  "label": "长岛县",
  "value": "370634" },

{
  "label": "烟台高新技术产业开发区",
  "value": "370671" },

{
  "label": "烟台经济技术开发区",
  "value": "370672" },

{
  "label": "龙口市",
  "value": "370681" },

{
  "label": "莱阳市",
  "value": "370682" },

{
  "label": "莱州市",
  "value": "370683" },

{
  "label": "蓬莱市",
  "value": "370684" },

{
  "label": "招远市",
  "value": "370685" },

{
  "label": "栖霞市",
  "value": "370686" },

{
  "label": "海阳市",
  "value": "370687" }],


[{
  "label": "潍城区",
  "value": "370702" },

{
  "label": "寒亭区",
  "value": "370703" },

{
  "label": "坊子区",
  "value": "370704" },

{
  "label": "奎文区",
  "value": "370705" },

{
  "label": "临朐县",
  "value": "370724" },

{
  "label": "昌乐县",
  "value": "370725" },

{
  "label": "潍坊滨海经济技术开发区",
  "value": "370772" },

{
  "label": "青州市",
  "value": "370781" },

{
  "label": "诸城市",
  "value": "370782" },

{
  "label": "寿光市",
  "value": "370783" },

{
  "label": "安丘市",
  "value": "370784" },

{
  "label": "高密市",
  "value": "370785" },

{
  "label": "昌邑市",
  "value": "370786" }],


[{
  "label": "任城区",
  "value": "370811" },

{
  "label": "兖州区",
  "value": "370812" },

{
  "label": "微山县",
  "value": "370826" },

{
  "label": "鱼台县",
  "value": "370827" },

{
  "label": "金乡县",
  "value": "370828" },

{
  "label": "嘉祥县",
  "value": "370829" },

{
  "label": "汶上县",
  "value": "370830" },

{
  "label": "泗水县",
  "value": "370831" },

{
  "label": "梁山县",
  "value": "370832" },

{
  "label": "济宁高新技术产业开发区",
  "value": "370871" },

{
  "label": "曲阜市",
  "value": "370881" },

{
  "label": "邹城市",
  "value": "370883" }],


[{
  "label": "泰山区",
  "value": "370902" },

{
  "label": "岱岳区",
  "value": "370911" },

{
  "label": "宁阳县",
  "value": "370921" },

{
  "label": "东平县",
  "value": "370923" },

{
  "label": "新泰市",
  "value": "370982" },

{
  "label": "肥城市",
  "value": "370983" }],


[{
  "label": "环翠区",
  "value": "371002" },

{
  "label": "文登区",
  "value": "371003" },

{
  "label": "威海火炬高技术产业开发区",
  "value": "371071" },

{
  "label": "威海经济技术开发区",
  "value": "371072" },

{
  "label": "威海临港经济技术开发区",
  "value": "371073" },

{
  "label": "荣成市",
  "value": "371082" },

{
  "label": "乳山市",
  "value": "371083" }],


[{
  "label": "东港区",
  "value": "371102" },

{
  "label": "岚山区",
  "value": "371103" },

{
  "label": "五莲县",
  "value": "371121" },

{
  "label": "莒县",
  "value": "371122" },

{
  "label": "日照经济技术开发区",
  "value": "371171" },

{
  "label": "日照国际海洋城",
  "value": "371172" }],


[{
  "label": "莱城区",
  "value": "371202" },

{
  "label": "钢城区",
  "value": "371203" }],


[{
  "label": "兰山区",
  "value": "371302" },

{
  "label": "罗庄区",
  "value": "371311" },

{
  "label": "河东区",
  "value": "371312" },

{
  "label": "沂南县",
  "value": "371321" },

{
  "label": "郯城县",
  "value": "371322" },

{
  "label": "沂水县",
  "value": "371323" },

{
  "label": "兰陵县",
  "value": "371324" },

{
  "label": "费县",
  "value": "371325" },

{
  "label": "平邑县",
  "value": "371326" },

{
  "label": "莒南县",
  "value": "371327" },

{
  "label": "蒙阴县",
  "value": "371328" },

{
  "label": "临沭县",
  "value": "371329" },

{
  "label": "临沂高新技术产业开发区",
  "value": "371371" },

{
  "label": "临沂经济技术开发区",
  "value": "371372" },

{
  "label": "临沂临港经济开发区",
  "value": "371373" }],


[{
  "label": "德城区",
  "value": "371402" },

{
  "label": "陵城区",
  "value": "371403" },

{
  "label": "宁津县",
  "value": "371422" },

{
  "label": "庆云县",
  "value": "371423" },

{
  "label": "临邑县",
  "value": "371424" },

{
  "label": "齐河县",
  "value": "371425" },

{
  "label": "平原县",
  "value": "371426" },

{
  "label": "夏津县",
  "value": "371427" },

{
  "label": "武城县",
  "value": "371428" },

{
  "label": "德州经济技术开发区",
  "value": "371471" },

{
  "label": "德州运河经济开发区",
  "value": "371472" },

{
  "label": "乐陵市",
  "value": "371481" },

{
  "label": "禹城市",
  "value": "371482" }],


[{
  "label": "东昌府区",
  "value": "371502" },

{
  "label": "阳谷县",
  "value": "371521" },

{
  "label": "莘县",
  "value": "371522" },

{
  "label": "茌平县",
  "value": "371523" },

{
  "label": "东阿县",
  "value": "371524" },

{
  "label": "冠县",
  "value": "371525" },

{
  "label": "高唐县",
  "value": "371526" },

{
  "label": "临清市",
  "value": "371581" }],


[{
  "label": "滨城区",
  "value": "371602" },

{
  "label": "沾化区",
  "value": "371603" },

{
  "label": "惠民县",
  "value": "371621" },

{
  "label": "阳信县",
  "value": "371622" },

{
  "label": "无棣县",
  "value": "371623" },

{
  "label": "博兴县",
  "value": "371625" },

{
  "label": "邹平县",
  "value": "371626" }],


[{
  "label": "牡丹区",
  "value": "371702" },

{
  "label": "定陶区",
  "value": "371703" },

{
  "label": "曹县",
  "value": "371721" },

{
  "label": "单县",
  "value": "371722" },

{
  "label": "成武县",
  "value": "371723" },

{
  "label": "巨野县",
  "value": "371724" },

{
  "label": "郓城县",
  "value": "371725" },

{
  "label": "鄄城县",
  "value": "371726" },

{
  "label": "东明县",
  "value": "371728" },

{
  "label": "菏泽经济技术开发区",
  "value": "371771" },

{
  "label": "菏泽高新技术开发区",
  "value": "371772" }]],



[
[{
  "label": "中原区",
  "value": "410102" },

{
  "label": "二七区",
  "value": "410103" },

{
  "label": "管城回族区",
  "value": "410104" },

{
  "label": "金水区",
  "value": "410105" },

{
  "label": "上街区",
  "value": "410106" },

{
  "label": "惠济区",
  "value": "410108" },

{
  "label": "中牟县",
  "value": "410122" },

{
  "label": "郑州经济技术开发区",
  "value": "410171" },

{
  "label": "郑州高新技术产业开发区",
  "value": "410172" },

{
  "label": "郑州航空港经济综合实验区",
  "value": "410173" },

{
  "label": "巩义市",
  "value": "410181" },

{
  "label": "荥阳市",
  "value": "410182" },

{
  "label": "新密市",
  "value": "410183" },

{
  "label": "新郑市",
  "value": "410184" },

{
  "label": "登封市",
  "value": "410185" }],


[{
  "label": "龙亭区",
  "value": "410202" },

{
  "label": "顺河回族区",
  "value": "410203" },

{
  "label": "鼓楼区",
  "value": "410204" },

{
  "label": "禹王台区",
  "value": "410205" },

{
  "label": "祥符区",
  "value": "410212" },

{
  "label": "杞县",
  "value": "410221" },

{
  "label": "通许县",
  "value": "410222" },

{
  "label": "尉氏县",
  "value": "410223" },

{
  "label": "兰考县",
  "value": "410225" }],


[{
  "label": "老城区",
  "value": "410302" },

{
  "label": "西工区",
  "value": "410303" },

{
  "label": "瀍河回族区",
  "value": "410304" },

{
  "label": "涧西区",
  "value": "410305" },

{
  "label": "吉利区",
  "value": "410306" },

{
  "label": "洛龙区",
  "value": "410311" },

{
  "label": "孟津县",
  "value": "410322" },

{
  "label": "新安县",
  "value": "410323" },

{
  "label": "栾川县",
  "value": "410324" },

{
  "label": "嵩县",
  "value": "410325" },

{
  "label": "汝阳县",
  "value": "410326" },

{
  "label": "宜阳县",
  "value": "410327" },

{
  "label": "洛宁县",
  "value": "410328" },

{
  "label": "伊川县",
  "value": "410329" },

{
  "label": "洛阳高新技术产业开发区",
  "value": "410371" },

{
  "label": "偃师市",
  "value": "410381" }],


[{
  "label": "新华区",
  "value": "410402" },

{
  "label": "卫东区",
  "value": "410403" },

{
  "label": "石龙区",
  "value": "410404" },

{
  "label": "湛河区",
  "value": "410411" },

{
  "label": "宝丰县",
  "value": "410421" },

{
  "label": "叶县",
  "value": "410422" },

{
  "label": "鲁山县",
  "value": "410423" },

{
  "label": "郏县",
  "value": "410425" },

{
  "label": "平顶山高新技术产业开发区",
  "value": "410471" },

{
  "label": "平顶山市新城区",
  "value": "410472" },

{
  "label": "舞钢市",
  "value": "410481" },

{
  "label": "汝州市",
  "value": "410482" }],


[{
  "label": "文峰区",
  "value": "410502" },

{
  "label": "北关区",
  "value": "410503" },

{
  "label": "殷都区",
  "value": "410505" },

{
  "label": "龙安区",
  "value": "410506" },

{
  "label": "安阳县",
  "value": "410522" },

{
  "label": "汤阴县",
  "value": "410523" },

{
  "label": "滑县",
  "value": "410526" },

{
  "label": "内黄县",
  "value": "410527" },

{
  "label": "安阳高新技术产业开发区",
  "value": "410571" },

{
  "label": "林州市",
  "value": "410581" }],


[{
  "label": "鹤山区",
  "value": "410602" },

{
  "label": "山城区",
  "value": "410603" },

{
  "label": "淇滨区",
  "value": "410611" },

{
  "label": "浚县",
  "value": "410621" },

{
  "label": "淇县",
  "value": "410622" },

{
  "label": "鹤壁经济技术开发区",
  "value": "410671" }],


[{
  "label": "红旗区",
  "value": "410702" },

{
  "label": "卫滨区",
  "value": "410703" },

{
  "label": "凤泉区",
  "value": "410704" },

{
  "label": "牧野区",
  "value": "410711" },

{
  "label": "新乡县",
  "value": "410721" },

{
  "label": "获嘉县",
  "value": "410724" },

{
  "label": "原阳县",
  "value": "410725" },

{
  "label": "延津县",
  "value": "410726" },

{
  "label": "封丘县",
  "value": "410727" },

{
  "label": "长垣县",
  "value": "410728" },

{
  "label": "新乡高新技术产业开发区",
  "value": "410771" },

{
  "label": "新乡经济技术开发区",
  "value": "410772" },

{
  "label": "新乡市平原城乡一体化示范区",
  "value": "410773" },

{
  "label": "卫辉市",
  "value": "410781" },

{
  "label": "辉县市",
  "value": "410782" }],


[{
  "label": "解放区",
  "value": "410802" },

{
  "label": "中站区",
  "value": "410803" },

{
  "label": "马村区",
  "value": "410804" },

{
  "label": "山阳区",
  "value": "410811" },

{
  "label": "修武县",
  "value": "410821" },

{
  "label": "博爱县",
  "value": "410822" },

{
  "label": "武陟县",
  "value": "410823" },

{
  "label": "温县",
  "value": "410825" },

{
  "label": "焦作城乡一体化示范区",
  "value": "410871" },

{
  "label": "沁阳市",
  "value": "410882" },

{
  "label": "孟州市",
  "value": "410883" }],


[{
  "label": "华龙区",
  "value": "410902" },

{
  "label": "清丰县",
  "value": "410922" },

{
  "label": "南乐县",
  "value": "410923" },

{
  "label": "范县",
  "value": "410926" },

{
  "label": "台前县",
  "value": "410927" },

{
  "label": "濮阳县",
  "value": "410928" },

{
  "label": "河南濮阳工业园区",
  "value": "410971" },

{
  "label": "濮阳经济技术开发区",
  "value": "410972" }],


[{
  "label": "魏都区",
  "value": "411002" },

{
  "label": "建安区",
  "value": "411003" },

{
  "label": "鄢陵县",
  "value": "411024" },

{
  "label": "襄城县",
  "value": "411025" },

{
  "label": "许昌经济技术开发区",
  "value": "411071" },

{
  "label": "禹州市",
  "value": "411081" },

{
  "label": "长葛市",
  "value": "411082" }],


[{
  "label": "源汇区",
  "value": "411102" },

{
  "label": "郾城区",
  "value": "411103" },

{
  "label": "召陵区",
  "value": "411104" },

{
  "label": "舞阳县",
  "value": "411121" },

{
  "label": "临颍县",
  "value": "411122" },

{
  "label": "漯河经济技术开发区",
  "value": "411171" }],


[{
  "label": "湖滨区",
  "value": "411202" },

{
  "label": "陕州区",
  "value": "411203" },

{
  "label": "渑池县",
  "value": "411221" },

{
  "label": "卢氏县",
  "value": "411224" },

{
  "label": "河南三门峡经济开发区",
  "value": "411271" },

{
  "label": "义马市",
  "value": "411281" },

{
  "label": "灵宝市",
  "value": "411282" }],


[{
  "label": "宛城区",
  "value": "411302" },

{
  "label": "卧龙区",
  "value": "411303" },

{
  "label": "南召县",
  "value": "411321" },

{
  "label": "方城县",
  "value": "411322" },

{
  "label": "西峡县",
  "value": "411323" },

{
  "label": "镇平县",
  "value": "411324" },

{
  "label": "内乡县",
  "value": "411325" },

{
  "label": "淅川县",
  "value": "411326" },

{
  "label": "社旗县",
  "value": "411327" },

{
  "label": "唐河县",
  "value": "411328" },

{
  "label": "新野县",
  "value": "411329" },

{
  "label": "桐柏县",
  "value": "411330" },

{
  "label": "南阳高新技术产业开发区",
  "value": "411371" },

{
  "label": "南阳市城乡一体化示范区",
  "value": "411372" },

{
  "label": "邓州市",
  "value": "411381" }],


[{
  "label": "梁园区",
  "value": "411402" },

{
  "label": "睢阳区",
  "value": "411403" },

{
  "label": "民权县",
  "value": "411421" },

{
  "label": "睢县",
  "value": "411422" },

{
  "label": "宁陵县",
  "value": "411423" },

{
  "label": "柘城县",
  "value": "411424" },

{
  "label": "虞城县",
  "value": "411425" },

{
  "label": "夏邑县",
  "value": "411426" },

{
  "label": "豫东综合物流产业聚集区",
  "value": "411471" },

{
  "label": "河南商丘经济开发区",
  "value": "411472" },

{
  "label": "永城市",
  "value": "411481" }],


[{
  "label": "浉河区",
  "value": "411502" },

{
  "label": "平桥区",
  "value": "411503" },

{
  "label": "罗山县",
  "value": "411521" },

{
  "label": "光山县",
  "value": "411522" },

{
  "label": "新县",
  "value": "411523" },

{
  "label": "商城县",
  "value": "411524" },

{
  "label": "固始县",
  "value": "411525" },

{
  "label": "潢川县",
  "value": "411526" },

{
  "label": "淮滨县",
  "value": "411527" },

{
  "label": "息县",
  "value": "411528" },

{
  "label": "信阳高新技术产业开发区",
  "value": "411571" }],


[{
  "label": "川汇区",
  "value": "411602" },

{
  "label": "扶沟县",
  "value": "411621" },

{
  "label": "西华县",
  "value": "411622" },

{
  "label": "商水县",
  "value": "411623" },

{
  "label": "沈丘县",
  "value": "411624" },

{
  "label": "郸城县",
  "value": "411625" },

{
  "label": "淮阳县",
  "value": "411626" },

{
  "label": "太康县",
  "value": "411627" },

{
  "label": "鹿邑县",
  "value": "411628" },

{
  "label": "河南周口经济开发区",
  "value": "411671" },

{
  "label": "项城市",
  "value": "411681" }],


[{
  "label": "驿城区",
  "value": "411702" },

{
  "label": "西平县",
  "value": "411721" },

{
  "label": "上蔡县",
  "value": "411722" },

{
  "label": "平舆县",
  "value": "411723" },

{
  "label": "正阳县",
  "value": "411724" },

{
  "label": "确山县",
  "value": "411725" },

{
  "label": "泌阳县",
  "value": "411726" },

{
  "label": "汝南县",
  "value": "411727" },

{
  "label": "遂平县",
  "value": "411728" },

{
  "label": "新蔡县",
  "value": "411729" },

{
  "label": "河南驻马店经济开发区",
  "value": "411771" }],


[{
  "label": "济源市",
  "value": "419001" }]],


[
[{
  "label": "江岸区",
  "value": "420102" },

{
  "label": "江汉区",
  "value": "420103" },

{
  "label": "硚口区",
  "value": "420104" },

{
  "label": "汉阳区",
  "value": "420105" },

{
  "label": "武昌区",
  "value": "420106" },

{
  "label": "青山区",
  "value": "420107" },

{
  "label": "洪山区",
  "value": "420111" },

{
  "label": "东西湖区",
  "value": "420112" },

{
  "label": "汉南区",
  "value": "420113" },

{
  "label": "蔡甸区",
  "value": "420114" },

{
  "label": "江夏区",
  "value": "420115" },

{
  "label": "黄陂区",
  "value": "420116" },

{
  "label": "新洲区",
  "value": "420117" }],


[{
  "label": "黄石港区",
  "value": "420202" },

{
  "label": "西塞山区",
  "value": "420203" },

{
  "label": "下陆区",
  "value": "420204" },

{
  "label": "铁山区",
  "value": "420205" },

{
  "label": "阳新县",
  "value": "420222" },

{
  "label": "大冶市",
  "value": "420281" }],


[{
  "label": "茅箭区",
  "value": "420302" },

{
  "label": "张湾区",
  "value": "420303" },

{
  "label": "郧阳区",
  "value": "420304" },

{
  "label": "郧西县",
  "value": "420322" },

{
  "label": "竹山县",
  "value": "420323" },

{
  "label": "竹溪县",
  "value": "420324" },

{
  "label": "房县",
  "value": "420325" },

{
  "label": "丹江口市",
  "value": "420381" }],


[{
  "label": "西陵区",
  "value": "420502" },

{
  "label": "伍家岗区",
  "value": "420503" },

{
  "label": "点军区",
  "value": "420504" },

{
  "label": "猇亭区",
  "value": "420505" },

{
  "label": "夷陵区",
  "value": "420506" },

{
  "label": "远安县",
  "value": "420525" },

{
  "label": "兴山县",
  "value": "420526" },

{
  "label": "秭归县",
  "value": "420527" },

{
  "label": "长阳土家族自治县",
  "value": "420528" },

{
  "label": "五峰土家族自治县",
  "value": "420529" },

{
  "label": "宜都市",
  "value": "420581" },

{
  "label": "当阳市",
  "value": "420582" },

{
  "label": "枝江市",
  "value": "420583" }],


[{
  "label": "襄城区",
  "value": "420602" },

{
  "label": "樊城区",
  "value": "420606" },

{
  "label": "襄州区",
  "value": "420607" },

{
  "label": "南漳县",
  "value": "420624" },

{
  "label": "谷城县",
  "value": "420625" },

{
  "label": "保康县",
  "value": "420626" },

{
  "label": "老河口市",
  "value": "420682" },

{
  "label": "枣阳市",
  "value": "420683" },

{
  "label": "宜城市",
  "value": "420684" }],


[{
  "label": "梁子湖区",
  "value": "420702" },

{
  "label": "华容区",
  "value": "420703" },

{
  "label": "鄂城区",
  "value": "420704" }],


[{
  "label": "东宝区",
  "value": "420802" },

{
  "label": "掇刀区",
  "value": "420804" },

{
  "label": "京山县",
  "value": "420821" },

{
  "label": "沙洋县",
  "value": "420822" },

{
  "label": "钟祥市",
  "value": "420881" }],


[{
  "label": "孝南区",
  "value": "420902" },

{
  "label": "孝昌县",
  "value": "420921" },

{
  "label": "大悟县",
  "value": "420922" },

{
  "label": "云梦县",
  "value": "420923" },

{
  "label": "应城市",
  "value": "420981" },

{
  "label": "安陆市",
  "value": "420982" },

{
  "label": "汉川市",
  "value": "420984" }],


[{
  "label": "沙市区",
  "value": "421002" },

{
  "label": "荆州区",
  "value": "421003" },

{
  "label": "公安县",
  "value": "421022" },

{
  "label": "监利县",
  "value": "421023" },

{
  "label": "江陵县",
  "value": "421024" },

{
  "label": "荆州经济技术开发区",
  "value": "421071" },

{
  "label": "石首市",
  "value": "421081" },

{
  "label": "洪湖市",
  "value": "421083" },

{
  "label": "松滋市",
  "value": "421087" }],


[{
  "label": "黄州区",
  "value": "421102" },

{
  "label": "团风县",
  "value": "421121" },

{
  "label": "红安县",
  "value": "421122" },

{
  "label": "罗田县",
  "value": "421123" },

{
  "label": "英山县",
  "value": "421124" },

{
  "label": "浠水县",
  "value": "421125" },

{
  "label": "蕲春县",
  "value": "421126" },

{
  "label": "黄梅县",
  "value": "421127" },

{
  "label": "龙感湖管理区",
  "value": "421171" },

{
  "label": "麻城市",
  "value": "421181" },

{
  "label": "武穴市",
  "value": "421182" }],


[{
  "label": "咸安区",
  "value": "421202" },

{
  "label": "嘉鱼县",
  "value": "421221" },

{
  "label": "通城县",
  "value": "421222" },

{
  "label": "崇阳县",
  "value": "421223" },

{
  "label": "通山县",
  "value": "421224" },

{
  "label": "赤壁市",
  "value": "421281" }],


[{
  "label": "曾都区",
  "value": "421303" },

{
  "label": "随县",
  "value": "421321" },

{
  "label": "广水市",
  "value": "421381" }],


[{
  "label": "恩施市",
  "value": "422801" },

{
  "label": "利川市",
  "value": "422802" },

{
  "label": "建始县",
  "value": "422822" },

{
  "label": "巴东县",
  "value": "422823" },

{
  "label": "宣恩县",
  "value": "422825" },

{
  "label": "咸丰县",
  "value": "422826" },

{
  "label": "来凤县",
  "value": "422827" },

{
  "label": "鹤峰县",
  "value": "422828" }],


[{
  "label": "仙桃市",
  "value": "429004" },

{
  "label": "潜江市",
  "value": "429005" },

{
  "label": "天门市",
  "value": "429006" },

{
  "label": "神农架林区",
  "value": "429021" }]],



[
[{
  "label": "芙蓉区",
  "value": "430102" },

{
  "label": "天心区",
  "value": "430103" },

{
  "label": "岳麓区",
  "value": "430104" },

{
  "label": "开福区",
  "value": "430105" },

{
  "label": "雨花区",
  "value": "430111" },

{
  "label": "望城区",
  "value": "430112" },

{
  "label": "长沙县",
  "value": "430121" },

{
  "label": "浏阳市",
  "value": "430181" },

{
  "label": "宁乡市",
  "value": "430182" }],


[{
  "label": "荷塘区",
  "value": "430202" },

{
  "label": "芦淞区",
  "value": "430203" },

{
  "label": "石峰区",
  "value": "430204" },

{
  "label": "天元区",
  "value": "430211" },

{
  "label": "株洲县",
  "value": "430221" },

{
  "label": "攸县",
  "value": "430223" },

{
  "label": "茶陵县",
  "value": "430224" },

{
  "label": "炎陵县",
  "value": "430225" },

{
  "label": "云龙示范区",
  "value": "430271" },

{
  "label": "醴陵市",
  "value": "430281" }],


[{
  "label": "雨湖区",
  "value": "430302" },

{
  "label": "岳塘区",
  "value": "430304" },

{
  "label": "湘潭县",
  "value": "430321" },

{
  "label": "湖南湘潭高新技术产业园区",
  "value": "430371" },

{
  "label": "湘潭昭山示范区",
  "value": "430372" },

{
  "label": "湘潭九华示范区",
  "value": "430373" },

{
  "label": "湘乡市",
  "value": "430381" },

{
  "label": "韶山市",
  "value": "430382" }],


[{
  "label": "珠晖区",
  "value": "430405" },

{
  "label": "雁峰区",
  "value": "430406" },

{
  "label": "石鼓区",
  "value": "430407" },

{
  "label": "蒸湘区",
  "value": "430408" },

{
  "label": "南岳区",
  "value": "430412" },

{
  "label": "衡阳县",
  "value": "430421" },

{
  "label": "衡南县",
  "value": "430422" },

{
  "label": "衡山县",
  "value": "430423" },

{
  "label": "衡东县",
  "value": "430424" },

{
  "label": "祁东县",
  "value": "430426" },

{
  "label": "衡阳综合保税区",
  "value": "430471" },

{
  "label": "湖南衡阳高新技术产业园区",
  "value": "430472" },

{
  "label": "湖南衡阳松木经济开发区",
  "value": "430473" },

{
  "label": "耒阳市",
  "value": "430481" },

{
  "label": "常宁市",
  "value": "430482" }],


[{
  "label": "双清区",
  "value": "430502" },

{
  "label": "大祥区",
  "value": "430503" },

{
  "label": "北塔区",
  "value": "430511" },

{
  "label": "邵东县",
  "value": "430521" },

{
  "label": "新邵县",
  "value": "430522" },

{
  "label": "邵阳县",
  "value": "430523" },

{
  "label": "隆回县",
  "value": "430524" },

{
  "label": "洞口县",
  "value": "430525" },

{
  "label": "绥宁县",
  "value": "430527" },

{
  "label": "新宁县",
  "value": "430528" },

{
  "label": "城步苗族自治县",
  "value": "430529" },

{
  "label": "武冈市",
  "value": "430581" }],


[{
  "label": "岳阳楼区",
  "value": "430602" },

{
  "label": "云溪区",
  "value": "430603" },

{
  "label": "君山区",
  "value": "430611" },

{
  "label": "岳阳县",
  "value": "430621" },

{
  "label": "华容县",
  "value": "430623" },

{
  "label": "湘阴县",
  "value": "430624" },

{
  "label": "平江县",
  "value": "430626" },

{
  "label": "岳阳市屈原管理区",
  "value": "430671" },

{
  "label": "汨罗市",
  "value": "430681" },

{
  "label": "临湘市",
  "value": "430682" }],


[{
  "label": "武陵区",
  "value": "430702" },

{
  "label": "鼎城区",
  "value": "430703" },

{
  "label": "安乡县",
  "value": "430721" },

{
  "label": "汉寿县",
  "value": "430722" },

{
  "label": "澧县",
  "value": "430723" },

{
  "label": "临澧县",
  "value": "430724" },

{
  "label": "桃源县",
  "value": "430725" },

{
  "label": "石门县",
  "value": "430726" },

{
  "label": "常德市西洞庭管理区",
  "value": "430771" },

{
  "label": "津市市",
  "value": "430781" }],


[{
  "label": "永定区",
  "value": "430802" },

{
  "label": "武陵源区",
  "value": "430811" },

{
  "label": "慈利县",
  "value": "430821" },

{
  "label": "桑植县",
  "value": "430822" }],


[{
  "label": "资阳区",
  "value": "430902" },

{
  "label": "赫山区",
  "value": "430903" },

{
  "label": "南县",
  "value": "430921" },

{
  "label": "桃江县",
  "value": "430922" },

{
  "label": "安化县",
  "value": "430923" },

{
  "label": "益阳市大通湖管理区",
  "value": "430971" },

{
  "label": "湖南益阳高新技术产业园区",
  "value": "430972" },

{
  "label": "沅江市",
  "value": "430981" }],


[{
  "label": "北湖区",
  "value": "431002" },

{
  "label": "苏仙区",
  "value": "431003" },

{
  "label": "桂阳县",
  "value": "431021" },

{
  "label": "宜章县",
  "value": "431022" },

{
  "label": "永兴县",
  "value": "431023" },

{
  "label": "嘉禾县",
  "value": "431024" },

{
  "label": "临武县",
  "value": "431025" },

{
  "label": "汝城县",
  "value": "431026" },

{
  "label": "桂东县",
  "value": "431027" },

{
  "label": "安仁县",
  "value": "431028" },

{
  "label": "资兴市",
  "value": "431081" }],


[{
  "label": "零陵区",
  "value": "431102" },

{
  "label": "冷水滩区",
  "value": "431103" },

{
  "label": "祁阳县",
  "value": "431121" },

{
  "label": "东安县",
  "value": "431122" },

{
  "label": "双牌县",
  "value": "431123" },

{
  "label": "道县",
  "value": "431124" },

{
  "label": "江永县",
  "value": "431125" },

{
  "label": "宁远县",
  "value": "431126" },

{
  "label": "蓝山县",
  "value": "431127" },

{
  "label": "新田县",
  "value": "431128" },

{
  "label": "江华瑶族自治县",
  "value": "431129" },

{
  "label": "永州经济技术开发区",
  "value": "431171" },

{
  "label": "永州市金洞管理区",
  "value": "431172" },

{
  "label": "永州市回龙圩管理区",
  "value": "431173" }],


[{
  "label": "鹤城区",
  "value": "431202" },

{
  "label": "中方县",
  "value": "431221" },

{
  "label": "沅陵县",
  "value": "431222" },

{
  "label": "辰溪县",
  "value": "431223" },

{
  "label": "溆浦县",
  "value": "431224" },

{
  "label": "会同县",
  "value": "431225" },

{
  "label": "麻阳苗族自治县",
  "value": "431226" },

{
  "label": "新晃侗族自治县",
  "value": "431227" },

{
  "label": "芷江侗族自治县",
  "value": "431228" },

{
  "label": "靖州苗族侗族自治县",
  "value": "431229" },

{
  "label": "通道侗族自治县",
  "value": "431230" },

{
  "label": "怀化市洪江管理区",
  "value": "431271" },

{
  "label": "洪江市",
  "value": "431281" }],


[{
  "label": "娄星区",
  "value": "431302" },

{
  "label": "双峰县",
  "value": "431321" },

{
  "label": "新化县",
  "value": "431322" },

{
  "label": "冷水江市",
  "value": "431381" },

{
  "label": "涟源市",
  "value": "431382" }],


[{
  "label": "吉首市",
  "value": "433101" },

{
  "label": "泸溪县",
  "value": "433122" },

{
  "label": "凤凰县",
  "value": "433123" },

{
  "label": "花垣县",
  "value": "433124" },

{
  "label": "保靖县",
  "value": "433125" },

{
  "label": "古丈县",
  "value": "433126" },

{
  "label": "永顺县",
  "value": "433127" },

{
  "label": "龙山县",
  "value": "433130" },

{
  "label": "湖南吉首经济开发区",
  "value": "433172" },

{
  "label": "湖南永顺经济开发区",
  "value": "433173" }]],



[
[{
  "label": "荔湾区",
  "value": "440103" },

{
  "label": "越秀区",
  "value": "440104" },

{
  "label": "海珠区",
  "value": "440105" },

{
  "label": "天河区",
  "value": "440106" },

{
  "label": "白云区",
  "value": "440111" },

{
  "label": "黄埔区",
  "value": "440112" },

{
  "label": "番禺区",
  "value": "440113" },

{
  "label": "花都区",
  "value": "440114" },

{
  "label": "南沙区",
  "value": "440115" },

{
  "label": "从化区",
  "value": "440117" },

{
  "label": "增城区",
  "value": "440118" }],


[{
  "label": "武江区",
  "value": "440203" },

{
  "label": "浈江区",
  "value": "440204" },

{
  "label": "曲江区",
  "value": "440205" },

{
  "label": "始兴县",
  "value": "440222" },

{
  "label": "仁化县",
  "value": "440224" },

{
  "label": "翁源县",
  "value": "440229" },

{
  "label": "乳源瑶族自治县",
  "value": "440232" },

{
  "label": "新丰县",
  "value": "440233" },

{
  "label": "乐昌市",
  "value": "440281" },

{
  "label": "南雄市",
  "value": "440282" }],


[{
  "label": "罗湖区",
  "value": "440303" },

{
  "label": "福田区",
  "value": "440304" },

{
  "label": "南山区",
  "value": "440305" },

{
  "label": "宝安区",
  "value": "440306" },

{
  "label": "龙岗区",
  "value": "440307" },

{
  "label": "盐田区",
  "value": "440308" },

{
  "label": "龙华区",
  "value": "440309" },

{
  "label": "坪山区",
  "value": "440310" }],


[{
  "label": "香洲区",
  "value": "440402" },

{
  "label": "斗门区",
  "value": "440403" },

{
  "label": "金湾区",
  "value": "440404" }],


[{
  "label": "龙湖区",
  "value": "440507" },

{
  "label": "金平区",
  "value": "440511" },

{
  "label": "濠江区",
  "value": "440512" },

{
  "label": "潮阳区",
  "value": "440513" },

{
  "label": "潮南区",
  "value": "440514" },

{
  "label": "澄海区",
  "value": "440515" },

{
  "label": "南澳县",
  "value": "440523" }],


[{
  "label": "禅城区",
  "value": "440604" },

{
  "label": "南海区",
  "value": "440605" },

{
  "label": "顺德区",
  "value": "440606" },

{
  "label": "三水区",
  "value": "440607" },

{
  "label": "高明区",
  "value": "440608" }],


[{
  "label": "蓬江区",
  "value": "440703" },

{
  "label": "江海区",
  "value": "440704" },

{
  "label": "新会区",
  "value": "440705" },

{
  "label": "台山市",
  "value": "440781" },

{
  "label": "开平市",
  "value": "440783" },

{
  "label": "鹤山市",
  "value": "440784" },

{
  "label": "恩平市",
  "value": "440785" }],


[{
  "label": "赤坎区",
  "value": "440802" },

{
  "label": "霞山区",
  "value": "440803" },

{
  "label": "坡头区",
  "value": "440804" },

{
  "label": "麻章区",
  "value": "440811" },

{
  "label": "遂溪县",
  "value": "440823" },

{
  "label": "徐闻县",
  "value": "440825" },

{
  "label": "廉江市",
  "value": "440881" },

{
  "label": "雷州市",
  "value": "440882" },

{
  "label": "吴川市",
  "value": "440883" }],


[{
  "label": "茂南区",
  "value": "440902" },

{
  "label": "电白区",
  "value": "440904" },

{
  "label": "高州市",
  "value": "440981" },

{
  "label": "化州市",
  "value": "440982" },

{
  "label": "信宜市",
  "value": "440983" }],


[{
  "label": "端州区",
  "value": "441202" },

{
  "label": "鼎湖区",
  "value": "441203" },

{
  "label": "高要区",
  "value": "441204" },

{
  "label": "广宁县",
  "value": "441223" },

{
  "label": "怀集县",
  "value": "441224" },

{
  "label": "封开县",
  "value": "441225" },

{
  "label": "德庆县",
  "value": "441226" },

{
  "label": "四会市",
  "value": "441284" }],


[{
  "label": "惠城区",
  "value": "441302" },

{
  "label": "惠阳区",
  "value": "441303" },

{
  "label": "博罗县",
  "value": "441322" },

{
  "label": "惠东县",
  "value": "441323" },

{
  "label": "龙门县",
  "value": "441324" }],


[{
  "label": "梅江区",
  "value": "441402" },

{
  "label": "梅县区",
  "value": "441403" },

{
  "label": "大埔县",
  "value": "441422" },

{
  "label": "丰顺县",
  "value": "441423" },

{
  "label": "五华县",
  "value": "441424" },

{
  "label": "平远县",
  "value": "441426" },

{
  "label": "蕉岭县",
  "value": "441427" },

{
  "label": "兴宁市",
  "value": "441481" }],


[{
  "label": "城区",
  "value": "441502" },

{
  "label": "海丰县",
  "value": "441521" },

{
  "label": "陆河县",
  "value": "441523" },

{
  "label": "陆丰市",
  "value": "441581" }],


[{
  "label": "源城区",
  "value": "441602" },

{
  "label": "紫金县",
  "value": "441621" },

{
  "label": "龙川县",
  "value": "441622" },

{
  "label": "连平县",
  "value": "441623" },

{
  "label": "和平县",
  "value": "441624" },

{
  "label": "东源县",
  "value": "441625" }],


[{
  "label": "江城区",
  "value": "441702" },

{
  "label": "阳东区",
  "value": "441704" },

{
  "label": "阳西县",
  "value": "441721" },

{
  "label": "阳春市",
  "value": "441781" }],


[{
  "label": "清城区",
  "value": "441802" },

{
  "label": "清新区",
  "value": "441803" },

{
  "label": "佛冈县",
  "value": "441821" },

{
  "label": "阳山县",
  "value": "441823" },

{
  "label": "连山壮族瑶族自治县",
  "value": "441825" },

{
  "label": "连南瑶族自治县",
  "value": "441826" },

{
  "label": "英德市",
  "value": "441881" },

{
  "label": "连州市",
  "value": "441882" }],


[{
  "label": "东莞市",
  "value": "441900" }],

[{
  "label": "中山市",
  "value": "442000" }],

[{
  "label": "湘桥区",
  "value": "445102" },

{
  "label": "潮安区",
  "value": "445103" },

{
  "label": "饶平县",
  "value": "445122" }],


[{
  "label": "榕城区",
  "value": "445202" },

{
  "label": "揭东区",
  "value": "445203" },

{
  "label": "揭西县",
  "value": "445222" },

{
  "label": "惠来县",
  "value": "445224" },

{
  "label": "普宁市",
  "value": "445281" }],


[{
  "label": "云城区",
  "value": "445302" },

{
  "label": "云安区",
  "value": "445303" },

{
  "label": "新兴县",
  "value": "445321" },

{
  "label": "郁南县",
  "value": "445322" },

{
  "label": "罗定市",
  "value": "445381" }]],



[
[{
  "label": "兴宁区",
  "value": "450102" },

{
  "label": "青秀区",
  "value": "450103" },

{
  "label": "江南区",
  "value": "450105" },

{
  "label": "西乡塘区",
  "value": "450107" },

{
  "label": "良庆区",
  "value": "450108" },

{
  "label": "邕宁区",
  "value": "450109" },

{
  "label": "武鸣区",
  "value": "450110" },

{
  "label": "隆安县",
  "value": "450123" },

{
  "label": "马山县",
  "value": "450124" },

{
  "label": "上林县",
  "value": "450125" },

{
  "label": "宾阳县",
  "value": "450126" },

{
  "label": "横县",
  "value": "450127" }],


[{
  "label": "城中区",
  "value": "450202" },

{
  "label": "鱼峰区",
  "value": "450203" },

{
  "label": "柳南区",
  "value": "450204" },

{
  "label": "柳北区",
  "value": "450205" },

{
  "label": "柳江区",
  "value": "450206" },

{
  "label": "柳城县",
  "value": "450222" },

{
  "label": "鹿寨县",
  "value": "450223" },

{
  "label": "融安县",
  "value": "450224" },

{
  "label": "融水苗族自治县",
  "value": "450225" },

{
  "label": "三江侗族自治县",
  "value": "450226" }],


[{
  "label": "秀峰区",
  "value": "450302" },

{
  "label": "叠彩区",
  "value": "450303" },

{
  "label": "象山区",
  "value": "450304" },

{
  "label": "七星区",
  "value": "450305" },

{
  "label": "雁山区",
  "value": "450311" },

{
  "label": "临桂区",
  "value": "450312" },

{
  "label": "阳朔县",
  "value": "450321" },

{
  "label": "灵川县",
  "value": "450323" },

{
  "label": "全州县",
  "value": "450324" },

{
  "label": "兴安县",
  "value": "450325" },

{
  "label": "永福县",
  "value": "450326" },

{
  "label": "灌阳县",
  "value": "450327" },

{
  "label": "龙胜各族自治县",
  "value": "450328" },

{
  "label": "资源县",
  "value": "450329" },

{
  "label": "平乐县",
  "value": "450330" },

{
  "label": "荔浦县",
  "value": "450331" },

{
  "label": "恭城瑶族自治县",
  "value": "450332" }],


[{
  "label": "万秀区",
  "value": "450403" },

{
  "label": "长洲区",
  "value": "450405" },

{
  "label": "龙圩区",
  "value": "450406" },

{
  "label": "苍梧县",
  "value": "450421" },

{
  "label": "藤县",
  "value": "450422" },

{
  "label": "蒙山县",
  "value": "450423" },

{
  "label": "岑溪市",
  "value": "450481" }],


[{
  "label": "海城区",
  "value": "450502" },

{
  "label": "银海区",
  "value": "450503" },

{
  "label": "铁山港区",
  "value": "450512" },

{
  "label": "合浦县",
  "value": "450521" }],


[{
  "label": "港口区",
  "value": "450602" },

{
  "label": "防城区",
  "value": "450603" },

{
  "label": "上思县",
  "value": "450621" },

{
  "label": "东兴市",
  "value": "450681" }],


[{
  "label": "钦南区",
  "value": "450702" },

{
  "label": "钦北区",
  "value": "450703" },

{
  "label": "灵山县",
  "value": "450721" },

{
  "label": "浦北县",
  "value": "450722" }],


[{
  "label": "港北区",
  "value": "450802" },

{
  "label": "港南区",
  "value": "450803" },

{
  "label": "覃塘区",
  "value": "450804" },

{
  "label": "平南县",
  "value": "450821" },

{
  "label": "桂平市",
  "value": "450881" }],


[{
  "label": "玉州区",
  "value": "450902" },

{
  "label": "福绵区",
  "value": "450903" },

{
  "label": "容县",
  "value": "450921" },

{
  "label": "陆川县",
  "value": "450922" },

{
  "label": "博白县",
  "value": "450923" },

{
  "label": "兴业县",
  "value": "450924" },

{
  "label": "北流市",
  "value": "450981" }],


[{
  "label": "右江区",
  "value": "451002" },

{
  "label": "田阳县",
  "value": "451021" },

{
  "label": "田东县",
  "value": "451022" },

{
  "label": "平果县",
  "value": "451023" },

{
  "label": "德保县",
  "value": "451024" },

{
  "label": "那坡县",
  "value": "451026" },

{
  "label": "凌云县",
  "value": "451027" },

{
  "label": "乐业县",
  "value": "451028" },

{
  "label": "田林县",
  "value": "451029" },

{
  "label": "西林县",
  "value": "451030" },

{
  "label": "隆林各族自治县",
  "value": "451031" },

{
  "label": "靖西市",
  "value": "451081" }],


[{
  "label": "八步区",
  "value": "451102" },

{
  "label": "平桂区",
  "value": "451103" },

{
  "label": "昭平县",
  "value": "451121" },

{
  "label": "钟山县",
  "value": "451122" },

{
  "label": "富川瑶族自治县",
  "value": "451123" }],


[{
  "label": "金城江区",
  "value": "451202" },

{
  "label": "宜州区",
  "value": "451203" },

{
  "label": "南丹县",
  "value": "451221" },

{
  "label": "天峨县",
  "value": "451222" },

{
  "label": "凤山县",
  "value": "451223" },

{
  "label": "东兰县",
  "value": "451224" },

{
  "label": "罗城仫佬族自治县",
  "value": "451225" },

{
  "label": "环江毛南族自治县",
  "value": "451226" },

{
  "label": "巴马瑶族自治县",
  "value": "451227" },

{
  "label": "都安瑶族自治县",
  "value": "451228" },

{
  "label": "大化瑶族自治县",
  "value": "451229" }],


[{
  "label": "兴宾区",
  "value": "451302" },

{
  "label": "忻城县",
  "value": "451321" },

{
  "label": "象州县",
  "value": "451322" },

{
  "label": "武宣县",
  "value": "451323" },

{
  "label": "金秀瑶族自治县",
  "value": "451324" },

{
  "label": "合山市",
  "value": "451381" }],


[{
  "label": "江州区",
  "value": "451402" },

{
  "label": "扶绥县",
  "value": "451421" },

{
  "label": "宁明县",
  "value": "451422" },

{
  "label": "龙州县",
  "value": "451423" },

{
  "label": "大新县",
  "value": "451424" },

{
  "label": "天等县",
  "value": "451425" },

{
  "label": "凭祥市",
  "value": "451481" }]],



[
[{
  "label": "秀英区",
  "value": "460105" },

{
  "label": "龙华区",
  "value": "460106" },

{
  "label": "琼山区",
  "value": "460107" },

{
  "label": "美兰区",
  "value": "460108" }],


[{
  "label": "海棠区",
  "value": "460202" },

{
  "label": "吉阳区",
  "value": "460203" },

{
  "label": "天涯区",
  "value": "460204" },

{
  "label": "崖州区",
  "value": "460205" }],


[{
  "label": "西沙群岛",
  "value": "460321" },

{
  "label": "南沙群岛",
  "value": "460322" },

{
  "label": "中沙群岛的岛礁及其海域",
  "value": "460323" }],


[{
  "label": "儋州市",
  "value": "460400" }],

[{
  "label": "五指山市",
  "value": "469001" },

{
  "label": "琼海市",
  "value": "469002" },

{
  "label": "文昌市",
  "value": "469005" },

{
  "label": "万宁市",
  "value": "469006" },

{
  "label": "东方市",
  "value": "469007" },

{
  "label": "定安县",
  "value": "469021" },

{
  "label": "屯昌县",
  "value": "469022" },

{
  "label": "澄迈县",
  "value": "469023" },

{
  "label": "临高县",
  "value": "469024" },

{
  "label": "白沙黎族自治县",
  "value": "469025" },

{
  "label": "昌江黎族自治县",
  "value": "469026" },

{
  "label": "乐东黎族自治县",
  "value": "469027" },

{
  "label": "陵水黎族自治县",
  "value": "469028" },

{
  "label": "保亭黎族苗族自治县",
  "value": "469029" },

{
  "label": "琼中黎族苗族自治县",
  "value": "469030" }]],



[
[{
  "label": "万州区",
  "value": "500101" },

{
  "label": "涪陵区",
  "value": "500102" },

{
  "label": "渝中区",
  "value": "500103" },

{
  "label": "大渡口区",
  "value": "500104" },

{
  "label": "江北区",
  "value": "500105" },

{
  "label": "沙坪坝区",
  "value": "500106" },

{
  "label": "九龙坡区",
  "value": "500107" },

{
  "label": "南岸区",
  "value": "500108" },

{
  "label": "北碚区",
  "value": "500109" },

{
  "label": "綦江区",
  "value": "500110" },

{
  "label": "大足区",
  "value": "500111" },

{
  "label": "渝北区",
  "value": "500112" },

{
  "label": "巴南区",
  "value": "500113" },

{
  "label": "黔江区",
  "value": "500114" },

{
  "label": "长寿区",
  "value": "500115" },

{
  "label": "江津区",
  "value": "500116" },

{
  "label": "合川区",
  "value": "500117" },

{
  "label": "永川区",
  "value": "500118" },

{
  "label": "南川区",
  "value": "500119" },

{
  "label": "璧山区",
  "value": "500120" },

{
  "label": "铜梁区",
  "value": "500151" },

{
  "label": "潼南区",
  "value": "500152" },

{
  "label": "荣昌区",
  "value": "500153" },

{
  "label": "开州区",
  "value": "500154" },

{
  "label": "梁平区",
  "value": "500155" },

{
  "label": "武隆区",
  "value": "500156" }],


[{
  "label": "城口县",
  "value": "500229" },

{
  "label": "丰都县",
  "value": "500230" },

{
  "label": "垫江县",
  "value": "500231" },

{
  "label": "忠县",
  "value": "500233" },

{
  "label": "云阳县",
  "value": "500235" },

{
  "label": "奉节县",
  "value": "500236" },

{
  "label": "巫山县",
  "value": "500237" },

{
  "label": "巫溪县",
  "value": "500238" },

{
  "label": "石柱土家族自治县",
  "value": "500240" },

{
  "label": "秀山土家族苗族自治县",
  "value": "500241" },

{
  "label": "酉阳土家族苗族自治县",
  "value": "500242" },

{
  "label": "彭水苗族土家族自治县",
  "value": "500243" }]],



[
[{
  "label": "锦江区",
  "value": "510104" },

{
  "label": "青羊区",
  "value": "510105" },

{
  "label": "金牛区",
  "value": "510106" },

{
  "label": "武侯区",
  "value": "510107" },

{
  "label": "成华区",
  "value": "510108" },

{
  "label": "龙泉驿区",
  "value": "510112" },

{
  "label": "青白江区",
  "value": "510113" },

{
  "label": "新都区",
  "value": "510114" },

{
  "label": "温江区",
  "value": "510115" },

{
  "label": "双流区",
  "value": "510116" },

{
  "label": "郫都区",
  "value": "510117" },

{
  "label": "金堂县",
  "value": "510121" },

{
  "label": "大邑县",
  "value": "510129" },

{
  "label": "蒲江县",
  "value": "510131" },

{
  "label": "新津县",
  "value": "510132" },

{
  "label": "都江堰市",
  "value": "510181" },

{
  "label": "彭州市",
  "value": "510182" },

{
  "label": "邛崃市",
  "value": "510183" },

{
  "label": "崇州市",
  "value": "510184" },

{
  "label": "简阳市",
  "value": "510185" }],


[{
  "label": "自流井区",
  "value": "510302" },

{
  "label": "贡井区",
  "value": "510303" },

{
  "label": "大安区",
  "value": "510304" },

{
  "label": "沿滩区",
  "value": "510311" },

{
  "label": "荣县",
  "value": "510321" },

{
  "label": "富顺县",
  "value": "510322" }],


[{
  "label": "东区",
  "value": "510402" },

{
  "label": "西区",
  "value": "510403" },

{
  "label": "仁和区",
  "value": "510411" },

{
  "label": "米易县",
  "value": "510421" },

{
  "label": "盐边县",
  "value": "510422" }],


[{
  "label": "江阳区",
  "value": "510502" },

{
  "label": "纳溪区",
  "value": "510503" },

{
  "label": "龙马潭区",
  "value": "510504" },

{
  "label": "泸县",
  "value": "510521" },

{
  "label": "合江县",
  "value": "510522" },

{
  "label": "叙永县",
  "value": "510524" },

{
  "label": "古蔺县",
  "value": "510525" }],


[{
  "label": "旌阳区",
  "value": "510603" },

{
  "label": "罗江区",
  "value": "510604" },

{
  "label": "中江县",
  "value": "510623" },

{
  "label": "广汉市",
  "value": "510681" },

{
  "label": "什邡市",
  "value": "510682" },

{
  "label": "绵竹市",
  "value": "510683" }],


[{
  "label": "涪城区",
  "value": "510703" },

{
  "label": "游仙区",
  "value": "510704" },

{
  "label": "安州区",
  "value": "510705" },

{
  "label": "三台县",
  "value": "510722" },

{
  "label": "盐亭县",
  "value": "510723" },

{
  "label": "梓潼县",
  "value": "510725" },

{
  "label": "北川羌族自治县",
  "value": "510726" },

{
  "label": "平武县",
  "value": "510727" },

{
  "label": "江油市",
  "value": "510781" }],


[{
  "label": "利州区",
  "value": "510802" },

{
  "label": "昭化区",
  "value": "510811" },

{
  "label": "朝天区",
  "value": "510812" },

{
  "label": "旺苍县",
  "value": "510821" },

{
  "label": "青川县",
  "value": "510822" },

{
  "label": "剑阁县",
  "value": "510823" },

{
  "label": "苍溪县",
  "value": "510824" }],


[{
  "label": "船山区",
  "value": "510903" },

{
  "label": "安居区",
  "value": "510904" },

{
  "label": "蓬溪县",
  "value": "510921" },

{
  "label": "射洪县",
  "value": "510922" },

{
  "label": "大英县",
  "value": "510923" }],


[{
  "label": "市中区",
  "value": "511002" },

{
  "label": "东兴区",
  "value": "511011" },

{
  "label": "威远县",
  "value": "511024" },

{
  "label": "资中县",
  "value": "511025" },

{
  "label": "内江经济开发区",
  "value": "511071" },

{
  "label": "隆昌市",
  "value": "511083" }],


[{
  "label": "市中区",
  "value": "511102" },

{
  "label": "沙湾区",
  "value": "511111" },

{
  "label": "五通桥区",
  "value": "511112" },

{
  "label": "金口河区",
  "value": "511113" },

{
  "label": "犍为县",
  "value": "511123" },

{
  "label": "井研县",
  "value": "511124" },

{
  "label": "夹江县",
  "value": "511126" },

{
  "label": "沐川县",
  "value": "511129" },

{
  "label": "峨边彝族自治县",
  "value": "511132" },

{
  "label": "马边彝族自治县",
  "value": "511133" },

{
  "label": "峨眉山市",
  "value": "511181" }],


[{
  "label": "顺庆区",
  "value": "511302" },

{
  "label": "高坪区",
  "value": "511303" },

{
  "label": "嘉陵区",
  "value": "511304" },

{
  "label": "南部县",
  "value": "511321" },

{
  "label": "营山县",
  "value": "511322" },

{
  "label": "蓬安县",
  "value": "511323" },

{
  "label": "仪陇县",
  "value": "511324" },

{
  "label": "西充县",
  "value": "511325" },

{
  "label": "阆中市",
  "value": "511381" }],


[{
  "label": "东坡区",
  "value": "511402" },

{
  "label": "彭山区",
  "value": "511403" },

{
  "label": "仁寿县",
  "value": "511421" },

{
  "label": "洪雅县",
  "value": "511423" },

{
  "label": "丹棱县",
  "value": "511424" },

{
  "label": "青神县",
  "value": "511425" }],


[{
  "label": "翠屏区",
  "value": "511502" },

{
  "label": "南溪区",
  "value": "511503" },

{
  "label": "宜宾县",
  "value": "511521" },

{
  "label": "江安县",
  "value": "511523" },

{
  "label": "长宁县",
  "value": "511524" },

{
  "label": "高县",
  "value": "511525" },

{
  "label": "珙县",
  "value": "511526" },

{
  "label": "筠连县",
  "value": "511527" },

{
  "label": "兴文县",
  "value": "511528" },

{
  "label": "屏山县",
  "value": "511529" }],


[{
  "label": "广安区",
  "value": "511602" },

{
  "label": "前锋区",
  "value": "511603" },

{
  "label": "岳池县",
  "value": "511621" },

{
  "label": "武胜县",
  "value": "511622" },

{
  "label": "邻水县",
  "value": "511623" },

{
  "label": "华蓥市",
  "value": "511681" }],


[{
  "label": "通川区",
  "value": "511702" },

{
  "label": "达川区",
  "value": "511703" },

{
  "label": "宣汉县",
  "value": "511722" },

{
  "label": "开江县",
  "value": "511723" },

{
  "label": "大竹县",
  "value": "511724" },

{
  "label": "渠县",
  "value": "511725" },

{
  "label": "达州经济开发区",
  "value": "511771" },

{
  "label": "万源市",
  "value": "511781" }],


[{
  "label": "雨城区",
  "value": "511802" },

{
  "label": "名山区",
  "value": "511803" },

{
  "label": "荥经县",
  "value": "511822" },

{
  "label": "汉源县",
  "value": "511823" },

{
  "label": "石棉县",
  "value": "511824" },

{
  "label": "天全县",
  "value": "511825" },

{
  "label": "芦山县",
  "value": "511826" },

{
  "label": "宝兴县",
  "value": "511827" }],


[{
  "label": "巴州区",
  "value": "511902" },

{
  "label": "恩阳区",
  "value": "511903" },

{
  "label": "通江县",
  "value": "511921" },

{
  "label": "南江县",
  "value": "511922" },

{
  "label": "平昌县",
  "value": "511923" },

{
  "label": "巴中经济开发区",
  "value": "511971" }],


[{
  "label": "雁江区",
  "value": "512002" },

{
  "label": "安岳县",
  "value": "512021" },

{
  "label": "乐至县",
  "value": "512022" }],


[{
  "label": "马尔康市",
  "value": "513201" },

{
  "label": "汶川县",
  "value": "513221" },

{
  "label": "理县",
  "value": "513222" },

{
  "label": "茂县",
  "value": "513223" },

{
  "label": "松潘县",
  "value": "513224" },

{
  "label": "九寨沟县",
  "value": "513225" },

{
  "label": "金川县",
  "value": "513226" },

{
  "label": "小金县",
  "value": "513227" },

{
  "label": "黑水县",
  "value": "513228" },

{
  "label": "壤塘县",
  "value": "513230" },

{
  "label": "阿坝县",
  "value": "513231" },

{
  "label": "若尔盖县",
  "value": "513232" },

{
  "label": "红原县",
  "value": "513233" }],


[{
  "label": "康定市",
  "value": "513301" },

{
  "label": "泸定县",
  "value": "513322" },

{
  "label": "丹巴县",
  "value": "513323" },

{
  "label": "九龙县",
  "value": "513324" },

{
  "label": "雅江县",
  "value": "513325" },

{
  "label": "道孚县",
  "value": "513326" },

{
  "label": "炉霍县",
  "value": "513327" },

{
  "label": "甘孜县",
  "value": "513328" },

{
  "label": "新龙县",
  "value": "513329" },

{
  "label": "德格县",
  "value": "513330" },

{
  "label": "白玉县",
  "value": "513331" },

{
  "label": "石渠县",
  "value": "513332" },

{
  "label": "色达县",
  "value": "513333" },

{
  "label": "理塘县",
  "value": "513334" },

{
  "label": "巴塘县",
  "value": "513335" },

{
  "label": "乡城县",
  "value": "513336" },

{
  "label": "稻城县",
  "value": "513337" },

{
  "label": "得荣县",
  "value": "513338" }],


[{
  "label": "西昌市",
  "value": "513401" },

{
  "label": "木里藏族自治县",
  "value": "513422" },

{
  "label": "盐源县",
  "value": "513423" },

{
  "label": "德昌县",
  "value": "513424" },

{
  "label": "会理县",
  "value": "513425" },

{
  "label": "会东县",
  "value": "513426" },

{
  "label": "宁南县",
  "value": "513427" },

{
  "label": "普格县",
  "value": "513428" },

{
  "label": "布拖县",
  "value": "513429" },

{
  "label": "金阳县",
  "value": "513430" },

{
  "label": "昭觉县",
  "value": "513431" },

{
  "label": "喜德县",
  "value": "513432" },

{
  "label": "冕宁县",
  "value": "513433" },

{
  "label": "越西县",
  "value": "513434" },

{
  "label": "甘洛县",
  "value": "513435" },

{
  "label": "美姑县",
  "value": "513436" },

{
  "label": "雷波县",
  "value": "513437" }]],



[
[{
  "label": "南明区",
  "value": "520102" },

{
  "label": "云岩区",
  "value": "520103" },

{
  "label": "花溪区",
  "value": "520111" },

{
  "label": "乌当区",
  "value": "520112" },

{
  "label": "白云区",
  "value": "520113" },

{
  "label": "观山湖区",
  "value": "520115" },

{
  "label": "开阳县",
  "value": "520121" },

{
  "label": "息烽县",
  "value": "520122" },

{
  "label": "修文县",
  "value": "520123" },

{
  "label": "清镇市",
  "value": "520181" }],


[{
  "label": "钟山区",
  "value": "520201" },

{
  "label": "六枝特区",
  "value": "520203" },

{
  "label": "水城县",
  "value": "520221" },

{
  "label": "盘州市",
  "value": "520281" }],


[{
  "label": "红花岗区",
  "value": "520302" },

{
  "label": "汇川区",
  "value": "520303" },

{
  "label": "播州区",
  "value": "520304" },

{
  "label": "桐梓县",
  "value": "520322" },

{
  "label": "绥阳县",
  "value": "520323" },

{
  "label": "正安县",
  "value": "520324" },

{
  "label": "道真仡佬族苗族自治县",
  "value": "520325" },

{
  "label": "务川仡佬族苗族自治县",
  "value": "520326" },

{
  "label": "凤冈县",
  "value": "520327" },

{
  "label": "湄潭县",
  "value": "520328" },

{
  "label": "余庆县",
  "value": "520329" },

{
  "label": "习水县",
  "value": "520330" },

{
  "label": "赤水市",
  "value": "520381" },

{
  "label": "仁怀市",
  "value": "520382" }],


[{
  "label": "西秀区",
  "value": "520402" },

{
  "label": "平坝区",
  "value": "520403" },

{
  "label": "普定县",
  "value": "520422" },

{
  "label": "镇宁布依族苗族自治县",
  "value": "520423" },

{
  "label": "关岭布依族苗族自治县",
  "value": "520424" },

{
  "label": "紫云苗族布依族自治县",
  "value": "520425" }],


[{
  "label": "七星关区",
  "value": "520502" },

{
  "label": "大方县",
  "value": "520521" },

{
  "label": "黔西县",
  "value": "520522" },

{
  "label": "金沙县",
  "value": "520523" },

{
  "label": "织金县",
  "value": "520524" },

{
  "label": "纳雍县",
  "value": "520525" },

{
  "label": "威宁彝族回族苗族自治县",
  "value": "520526" },

{
  "label": "赫章县",
  "value": "520527" }],


[{
  "label": "碧江区",
  "value": "520602" },

{
  "label": "万山区",
  "value": "520603" },

{
  "label": "江口县",
  "value": "520621" },

{
  "label": "玉屏侗族自治县",
  "value": "520622" },

{
  "label": "石阡县",
  "value": "520623" },

{
  "label": "思南县",
  "value": "520624" },

{
  "label": "印江土家族苗族自治县",
  "value": "520625" },

{
  "label": "德江县",
  "value": "520626" },

{
  "label": "沿河土家族自治县",
  "value": "520627" },

{
  "label": "松桃苗族自治县",
  "value": "520628" }],


[{
  "label": "兴义市",
  "value": "522301" },

{
  "label": "兴仁县",
  "value": "522322" },

{
  "label": "普安县",
  "value": "522323" },

{
  "label": "晴隆县",
  "value": "522324" },

{
  "label": "贞丰县",
  "value": "522325" },

{
  "label": "望谟县",
  "value": "522326" },

{
  "label": "册亨县",
  "value": "522327" },

{
  "label": "安龙县",
  "value": "522328" }],


[{
  "label": "凯里市",
  "value": "522601" },

{
  "label": "黄平县",
  "value": "522622" },

{
  "label": "施秉县",
  "value": "522623" },

{
  "label": "三穗县",
  "value": "522624" },

{
  "label": "镇远县",
  "value": "522625" },

{
  "label": "岑巩县",
  "value": "522626" },

{
  "label": "天柱县",
  "value": "522627" },

{
  "label": "锦屏县",
  "value": "522628" },

{
  "label": "剑河县",
  "value": "522629" },

{
  "label": "台江县",
  "value": "522630" },

{
  "label": "黎平县",
  "value": "522631" },

{
  "label": "榕江县",
  "value": "522632" },

{
  "label": "从江县",
  "value": "522633" },

{
  "label": "雷山县",
  "value": "522634" },

{
  "label": "麻江县",
  "value": "522635" },

{
  "label": "丹寨县",
  "value": "522636" }],


[{
  "label": "都匀市",
  "value": "522701" },

{
  "label": "福泉市",
  "value": "522702" },

{
  "label": "荔波县",
  "value": "522722" },

{
  "label": "贵定县",
  "value": "522723" },

{
  "label": "瓮安县",
  "value": "522725" },

{
  "label": "独山县",
  "value": "522726" },

{
  "label": "平塘县",
  "value": "522727" },

{
  "label": "罗甸县",
  "value": "522728" },

{
  "label": "长顺县",
  "value": "522729" },

{
  "label": "龙里县",
  "value": "522730" },

{
  "label": "惠水县",
  "value": "522731" },

{
  "label": "三都水族自治县",
  "value": "522732" }]],



[
[{
  "label": "五华区",
  "value": "530102" },

{
  "label": "盘龙区",
  "value": "530103" },

{
  "label": "官渡区",
  "value": "530111" },

{
  "label": "西山区",
  "value": "530112" },

{
  "label": "东川区",
  "value": "530113" },

{
  "label": "呈贡区",
  "value": "530114" },

{
  "label": "晋宁区",
  "value": "530115" },

{
  "label": "富民县",
  "value": "530124" },

{
  "label": "宜良县",
  "value": "530125" },

{
  "label": "石林彝族自治县",
  "value": "530126" },

{
  "label": "嵩明县",
  "value": "530127" },

{
  "label": "禄劝彝族苗族自治县",
  "value": "530128" },

{
  "label": "寻甸回族彝族自治县",
  "value": "530129" },

{
  "label": "安宁市",
  "value": "530181" }],


[{
  "label": "麒麟区",
  "value": "530302" },

{
  "label": "沾益区",
  "value": "530303" },

{
  "label": "马龙县",
  "value": "530321" },

{
  "label": "陆良县",
  "value": "530322" },

{
  "label": "师宗县",
  "value": "530323" },

{
  "label": "罗平县",
  "value": "530324" },

{
  "label": "富源县",
  "value": "530325" },

{
  "label": "会泽县",
  "value": "530326" },

{
  "label": "宣威市",
  "value": "530381" }],


[{
  "label": "红塔区",
  "value": "530402" },

{
  "label": "江川区",
  "value": "530403" },

{
  "label": "澄江县",
  "value": "530422" },

{
  "label": "通海县",
  "value": "530423" },

{
  "label": "华宁县",
  "value": "530424" },

{
  "label": "易门县",
  "value": "530425" },

{
  "label": "峨山彝族自治县",
  "value": "530426" },

{
  "label": "新平彝族傣族自治县",
  "value": "530427" },

{
  "label": "元江哈尼族彝族傣族自治县",
  "value": "530428" }],


[{
  "label": "隆阳区",
  "value": "530502" },

{
  "label": "施甸县",
  "value": "530521" },

{
  "label": "龙陵县",
  "value": "530523" },

{
  "label": "昌宁县",
  "value": "530524" },

{
  "label": "腾冲市",
  "value": "530581" }],


[{
  "label": "昭阳区",
  "value": "530602" },

{
  "label": "鲁甸县",
  "value": "530621" },

{
  "label": "巧家县",
  "value": "530622" },

{
  "label": "盐津县",
  "value": "530623" },

{
  "label": "大关县",
  "value": "530624" },

{
  "label": "永善县",
  "value": "530625" },

{
  "label": "绥江县",
  "value": "530626" },

{
  "label": "镇雄县",
  "value": "530627" },

{
  "label": "彝良县",
  "value": "530628" },

{
  "label": "威信县",
  "value": "530629" },

{
  "label": "水富县",
  "value": "530630" }],


[{
  "label": "古城区",
  "value": "530702" },

{
  "label": "玉龙纳西族自治县",
  "value": "530721" },

{
  "label": "永胜县",
  "value": "530722" },

{
  "label": "华坪县",
  "value": "530723" },

{
  "label": "宁蒗彝族自治县",
  "value": "530724" }],


[{
  "label": "思茅区",
  "value": "530802" },

{
  "label": "宁洱哈尼族彝族自治县",
  "value": "530821" },

{
  "label": "墨江哈尼族自治县",
  "value": "530822" },

{
  "label": "景东彝族自治县",
  "value": "530823" },

{
  "label": "景谷傣族彝族自治县",
  "value": "530824" },

{
  "label": "镇沅彝族哈尼族拉祜族自治县",
  "value": "530825" },

{
  "label": "江城哈尼族彝族自治县",
  "value": "530826" },

{
  "label": "孟连傣族拉祜族佤族自治县",
  "value": "530827" },

{
  "label": "澜沧拉祜族自治县",
  "value": "530828" },

{
  "label": "西盟佤族自治县",
  "value": "530829" }],


[{
  "label": "临翔区",
  "value": "530902" },

{
  "label": "凤庆县",
  "value": "530921" },

{
  "label": "云县",
  "value": "530922" },

{
  "label": "永德县",
  "value": "530923" },

{
  "label": "镇康县",
  "value": "530924" },

{
  "label": "双江拉祜族佤族布朗族傣族自治县",
  "value": "530925" },

{
  "label": "耿马傣族佤族自治县",
  "value": "530926" },

{
  "label": "沧源佤族自治县",
  "value": "530927" }],


[{
  "label": "楚雄市",
  "value": "532301" },

{
  "label": "双柏县",
  "value": "532322" },

{
  "label": "牟定县",
  "value": "532323" },

{
  "label": "南华县",
  "value": "532324" },

{
  "label": "姚安县",
  "value": "532325" },

{
  "label": "大姚县",
  "value": "532326" },

{
  "label": "永仁县",
  "value": "532327" },

{
  "label": "元谋县",
  "value": "532328" },

{
  "label": "武定县",
  "value": "532329" },

{
  "label": "禄丰县",
  "value": "532331" }],


[{
  "label": "个旧市",
  "value": "532501" },

{
  "label": "开远市",
  "value": "532502" },

{
  "label": "蒙自市",
  "value": "532503" },

{
  "label": "弥勒市",
  "value": "532504" },

{
  "label": "屏边苗族自治县",
  "value": "532523" },

{
  "label": "建水县",
  "value": "532524" },

{
  "label": "石屏县",
  "value": "532525" },

{
  "label": "泸西县",
  "value": "532527" },

{
  "label": "元阳县",
  "value": "532528" },

{
  "label": "红河县",
  "value": "532529" },

{
  "label": "金平苗族瑶族傣族自治县",
  "value": "532530" },

{
  "label": "绿春县",
  "value": "532531" },

{
  "label": "河口瑶族自治县",
  "value": "532532" }],


[{
  "label": "文山市",
  "value": "532601" },

{
  "label": "砚山县",
  "value": "532622" },

{
  "label": "西畴县",
  "value": "532623" },

{
  "label": "麻栗坡县",
  "value": "532624" },

{
  "label": "马关县",
  "value": "532625" },

{
  "label": "丘北县",
  "value": "532626" },

{
  "label": "广南县",
  "value": "532627" },

{
  "label": "富宁县",
  "value": "532628" }],


[{
  "label": "景洪市",
  "value": "532801" },

{
  "label": "勐海县",
  "value": "532822" },

{
  "label": "勐腊县",
  "value": "532823" }],


[{
  "label": "大理市",
  "value": "532901" },

{
  "label": "漾濞彝族自治县",
  "value": "532922" },

{
  "label": "祥云县",
  "value": "532923" },

{
  "label": "宾川县",
  "value": "532924" },

{
  "label": "弥渡县",
  "value": "532925" },

{
  "label": "南涧彝族自治县",
  "value": "532926" },

{
  "label": "巍山彝族回族自治县",
  "value": "532927" },

{
  "label": "永平县",
  "value": "532928" },

{
  "label": "云龙县",
  "value": "532929" },

{
  "label": "洱源县",
  "value": "532930" },

{
  "label": "剑川县",
  "value": "532931" },

{
  "label": "鹤庆县",
  "value": "532932" }],


[{
  "label": "瑞丽市",
  "value": "533102" },

{
  "label": "芒市",
  "value": "533103" },

{
  "label": "梁河县",
  "value": "533122" },

{
  "label": "盈江县",
  "value": "533123" },

{
  "label": "陇川县",
  "value": "533124" }],


[{
  "label": "泸水市",
  "value": "533301" },

{
  "label": "福贡县",
  "value": "533323" },

{
  "label": "贡山独龙族怒族自治县",
  "value": "533324" },

{
  "label": "兰坪白族普米族自治县",
  "value": "533325" }],


[{
  "label": "香格里拉市",
  "value": "533401" },

{
  "label": "德钦县",
  "value": "533422" },

{
  "label": "维西傈僳族自治县",
  "value": "533423" }]],



[
[{
  "label": "城关区",
  "value": "540102" },

{
  "label": "堆龙德庆区",
  "value": "540103" },

{
  "label": "林周县",
  "value": "540121" },

{
  "label": "当雄县",
  "value": "540122" },

{
  "label": "尼木县",
  "value": "540123" },

{
  "label": "曲水县",
  "value": "540124" },

{
  "label": "达孜县",
  "value": "540126" },

{
  "label": "墨竹工卡县",
  "value": "540127" },

{
  "label": "格尔木藏青工业园区",
  "value": "540171" },

{
  "label": "拉萨经济技术开发区",
  "value": "540172" },

{
  "label": "西藏文化旅游创意园区",
  "value": "540173" },

{
  "label": "达孜工业园区",
  "value": "540174" }],


[{
  "label": "桑珠孜区",
  "value": "540202" },

{
  "label": "南木林县",
  "value": "540221" },

{
  "label": "江孜县",
  "value": "540222" },

{
  "label": "定日县",
  "value": "540223" },

{
  "label": "萨迦县",
  "value": "540224" },

{
  "label": "拉孜县",
  "value": "540225" },

{
  "label": "昂仁县",
  "value": "540226" },

{
  "label": "谢通门县",
  "value": "540227" },

{
  "label": "白朗县",
  "value": "540228" },

{
  "label": "仁布县",
  "value": "540229" },

{
  "label": "康马县",
  "value": "540230" },

{
  "label": "定结县",
  "value": "540231" },

{
  "label": "仲巴县",
  "value": "540232" },

{
  "label": "亚东县",
  "value": "540233" },

{
  "label": "吉隆县",
  "value": "540234" },

{
  "label": "聂拉木县",
  "value": "540235" },

{
  "label": "萨嘎县",
  "value": "540236" },

{
  "label": "岗巴县",
  "value": "540237" }],


[{
  "label": "卡若区",
  "value": "540302" },

{
  "label": "江达县",
  "value": "540321" },

{
  "label": "贡觉县",
  "value": "540322" },

{
  "label": "类乌齐县",
  "value": "540323" },

{
  "label": "丁青县",
  "value": "540324" },

{
  "label": "察雅县",
  "value": "540325" },

{
  "label": "八宿县",
  "value": "540326" },

{
  "label": "左贡县",
  "value": "540327" },

{
  "label": "芒康县",
  "value": "540328" },

{
  "label": "洛隆县",
  "value": "540329" },

{
  "label": "边坝县",
  "value": "540330" }],


[{
  "label": "巴宜区",
  "value": "540402" },

{
  "label": "工布江达县",
  "value": "540421" },

{
  "label": "米林县",
  "value": "540422" },

{
  "label": "墨脱县",
  "value": "540423" },

{
  "label": "波密县",
  "value": "540424" },

{
  "label": "察隅县",
  "value": "540425" },

{
  "label": "朗县",
  "value": "540426" }],


[{
  "label": "乃东区",
  "value": "540502" },

{
  "label": "扎囊县",
  "value": "540521" },

{
  "label": "贡嘎县",
  "value": "540522" },

{
  "label": "桑日县",
  "value": "540523" },

{
  "label": "琼结县",
  "value": "540524" },

{
  "label": "曲松县",
  "value": "540525" },

{
  "label": "措美县",
  "value": "540526" },

{
  "label": "洛扎县",
  "value": "540527" },

{
  "label": "加查县",
  "value": "540528" },

{
  "label": "隆子县",
  "value": "540529" },

{
  "label": "错那县",
  "value": "540530" },

{
  "label": "浪卡子县",
  "value": "540531" }],


[{
  "label": "那曲县",
  "value": "542421" },

{
  "label": "嘉黎县",
  "value": "542422" },

{
  "label": "比如县",
  "value": "542423" },

{
  "label": "聂荣县",
  "value": "542424" },

{
  "label": "安多县",
  "value": "542425" },

{
  "label": "申扎县",
  "value": "542426" },

{
  "label": "索县",
  "value": "542427" },

{
  "label": "班戈县",
  "value": "542428" },

{
  "label": "巴青县",
  "value": "542429" },

{
  "label": "尼玛县",
  "value": "542430" },

{
  "label": "双湖县",
  "value": "542431" }],


[{
  "label": "普兰县",
  "value": "542521" },

{
  "label": "札达县",
  "value": "542522" },

{
  "label": "噶尔县",
  "value": "542523" },

{
  "label": "日土县",
  "value": "542524" },

{
  "label": "革吉县",
  "value": "542525" },

{
  "label": "改则县",
  "value": "542526" },

{
  "label": "措勤县",
  "value": "542527" }]],



[
[{
  "label": "新城区",
  "value": "610102" },

{
  "label": "碑林区",
  "value": "610103" },

{
  "label": "莲湖区",
  "value": "610104" },

{
  "label": "灞桥区",
  "value": "610111" },

{
  "label": "未央区",
  "value": "610112" },

{
  "label": "雁塔区",
  "value": "610113" },

{
  "label": "阎良区",
  "value": "610114" },

{
  "label": "临潼区",
  "value": "610115" },

{
  "label": "长安区",
  "value": "610116" },

{
  "label": "高陵区",
  "value": "610117" },

{
  "label": "鄠邑区",
  "value": "610118" },

{
  "label": "蓝田县",
  "value": "610122" },

{
  "label": "周至县",
  "value": "610124" }],


[{
  "label": "王益区",
  "value": "610202" },

{
  "label": "印台区",
  "value": "610203" },

{
  "label": "耀州区",
  "value": "610204" },

{
  "label": "宜君县",
  "value": "610222" }],


[{
  "label": "渭滨区",
  "value": "610302" },

{
  "label": "金台区",
  "value": "610303" },

{
  "label": "陈仓区",
  "value": "610304" },

{
  "label": "凤翔县",
  "value": "610322" },

{
  "label": "岐山县",
  "value": "610323" },

{
  "label": "扶风县",
  "value": "610324" },

{
  "label": "眉县",
  "value": "610326" },

{
  "label": "陇县",
  "value": "610327" },

{
  "label": "千阳县",
  "value": "610328" },

{
  "label": "麟游县",
  "value": "610329" },

{
  "label": "凤县",
  "value": "610330" },

{
  "label": "太白县",
  "value": "610331" }],


[{
  "label": "秦都区",
  "value": "610402" },

{
  "label": "杨陵区",
  "value": "610403" },

{
  "label": "渭城区",
  "value": "610404" },

{
  "label": "三原县",
  "value": "610422" },

{
  "label": "泾阳县",
  "value": "610423" },

{
  "label": "乾县",
  "value": "610424" },

{
  "label": "礼泉县",
  "value": "610425" },

{
  "label": "永寿县",
  "value": "610426" },

{
  "label": "彬县",
  "value": "610427" },

{
  "label": "长武县",
  "value": "610428" },

{
  "label": "旬邑县",
  "value": "610429" },

{
  "label": "淳化县",
  "value": "610430" },

{
  "label": "武功县",
  "value": "610431" },

{
  "label": "兴平市",
  "value": "610481" }],


[{
  "label": "临渭区",
  "value": "610502" },

{
  "label": "华州区",
  "value": "610503" },

{
  "label": "潼关县",
  "value": "610522" },

{
  "label": "大荔县",
  "value": "610523" },

{
  "label": "合阳县",
  "value": "610524" },

{
  "label": "澄城县",
  "value": "610525" },

{
  "label": "蒲城县",
  "value": "610526" },

{
  "label": "白水县",
  "value": "610527" },

{
  "label": "富平县",
  "value": "610528" },

{
  "label": "韩城市",
  "value": "610581" },

{
  "label": "华阴市",
  "value": "610582" }],


[{
  "label": "宝塔区",
  "value": "610602" },

{
  "label": "安塞区",
  "value": "610603" },

{
  "label": "延长县",
  "value": "610621" },

{
  "label": "延川县",
  "value": "610622" },

{
  "label": "子长县",
  "value": "610623" },

{
  "label": "志丹县",
  "value": "610625" },

{
  "label": "吴起县",
  "value": "610626" },

{
  "label": "甘泉县",
  "value": "610627" },

{
  "label": "富县",
  "value": "610628" },

{
  "label": "洛川县",
  "value": "610629" },

{
  "label": "宜川县",
  "value": "610630" },

{
  "label": "黄龙县",
  "value": "610631" },

{
  "label": "黄陵县",
  "value": "610632" }],


[{
  "label": "汉台区",
  "value": "610702" },

{
  "label": "南郑区",
  "value": "610703" },

{
  "label": "城固县",
  "value": "610722" },

{
  "label": "洋县",
  "value": "610723" },

{
  "label": "西乡县",
  "value": "610724" },

{
  "label": "勉县",
  "value": "610725" },

{
  "label": "宁强县",
  "value": "610726" },

{
  "label": "略阳县",
  "value": "610727" },

{
  "label": "镇巴县",
  "value": "610728" },

{
  "label": "留坝县",
  "value": "610729" },

{
  "label": "佛坪县",
  "value": "610730" }],


[{
  "label": "榆阳区",
  "value": "610802" },

{
  "label": "横山区",
  "value": "610803" },

{
  "label": "府谷县",
  "value": "610822" },

{
  "label": "靖边县",
  "value": "610824" },

{
  "label": "定边县",
  "value": "610825" },

{
  "label": "绥德县",
  "value": "610826" },

{
  "label": "米脂县",
  "value": "610827" },

{
  "label": "佳县",
  "value": "610828" },

{
  "label": "吴堡县",
  "value": "610829" },

{
  "label": "清涧县",
  "value": "610830" },

{
  "label": "子洲县",
  "value": "610831" },

{
  "label": "神木市",
  "value": "610881" }],


[{
  "label": "汉滨区",
  "value": "610902" },

{
  "label": "汉阴县",
  "value": "610921" },

{
  "label": "石泉县",
  "value": "610922" },

{
  "label": "宁陕县",
  "value": "610923" },

{
  "label": "紫阳县",
  "value": "610924" },

{
  "label": "岚皋县",
  "value": "610925" },

{
  "label": "平利县",
  "value": "610926" },

{
  "label": "镇坪县",
  "value": "610927" },

{
  "label": "旬阳县",
  "value": "610928" },

{
  "label": "白河县",
  "value": "610929" }],


[{
  "label": "商州区",
  "value": "611002" },

{
  "label": "洛南县",
  "value": "611021" },

{
  "label": "丹凤县",
  "value": "611022" },

{
  "label": "商南县",
  "value": "611023" },

{
  "label": "山阳县",
  "value": "611024" },

{
  "label": "镇安县",
  "value": "611025" },

{
  "label": "柞水县",
  "value": "611026" }]],



[
[{
  "label": "城关区",
  "value": "620102" },

{
  "label": "七里河区",
  "value": "620103" },

{
  "label": "西固区",
  "value": "620104" },

{
  "label": "安宁区",
  "value": "620105" },

{
  "label": "红古区",
  "value": "620111" },

{
  "label": "永登县",
  "value": "620121" },

{
  "label": "皋兰县",
  "value": "620122" },

{
  "label": "榆中县",
  "value": "620123" },

{
  "label": "兰州新区",
  "value": "620171" }],


[{
  "label": "嘉峪关市",
  "value": "620201" }],

[{
  "label": "金川区",
  "value": "620302" },

{
  "label": "永昌县",
  "value": "620321" }],


[{
  "label": "白银区",
  "value": "620402" },

{
  "label": "平川区",
  "value": "620403" },

{
  "label": "靖远县",
  "value": "620421" },

{
  "label": "会宁县",
  "value": "620422" },

{
  "label": "景泰县",
  "value": "620423" }],


[{
  "label": "秦州区",
  "value": "620502" },

{
  "label": "麦积区",
  "value": "620503" },

{
  "label": "清水县",
  "value": "620521" },

{
  "label": "秦安县",
  "value": "620522" },

{
  "label": "甘谷县",
  "value": "620523" },

{
  "label": "武山县",
  "value": "620524" },

{
  "label": "张家川回族自治县",
  "value": "620525" }],


[{
  "label": "凉州区",
  "value": "620602" },

{
  "label": "民勤县",
  "value": "620621" },

{
  "label": "古浪县",
  "value": "620622" },

{
  "label": "天祝藏族自治县",
  "value": "620623" }],


[{
  "label": "甘州区",
  "value": "620702" },

{
  "label": "肃南裕固族自治县",
  "value": "620721" },

{
  "label": "民乐县",
  "value": "620722" },

{
  "label": "临泽县",
  "value": "620723" },

{
  "label": "高台县",
  "value": "620724" },

{
  "label": "山丹县",
  "value": "620725" }],


[{
  "label": "崆峒区",
  "value": "620802" },

{
  "label": "泾川县",
  "value": "620821" },

{
  "label": "灵台县",
  "value": "620822" },

{
  "label": "崇信县",
  "value": "620823" },

{
  "label": "华亭县",
  "value": "620824" },

{
  "label": "庄浪县",
  "value": "620825" },

{
  "label": "静宁县",
  "value": "620826" },

{
  "label": "平凉工业园区",
  "value": "620871" }],


[{
  "label": "肃州区",
  "value": "620902" },

{
  "label": "金塔县",
  "value": "620921" },

{
  "label": "瓜州县",
  "value": "620922" },

{
  "label": "肃北蒙古族自治县",
  "value": "620923" },

{
  "label": "阿克塞哈萨克族自治县",
  "value": "620924" },

{
  "label": "玉门市",
  "value": "620981" },

{
  "label": "敦煌市",
  "value": "620982" }],


[{
  "label": "西峰区",
  "value": "621002" },

{
  "label": "庆城县",
  "value": "621021" },

{
  "label": "环县",
  "value": "621022" },

{
  "label": "华池县",
  "value": "621023" },

{
  "label": "合水县",
  "value": "621024" },

{
  "label": "正宁县",
  "value": "621025" },

{
  "label": "宁县",
  "value": "621026" },

{
  "label": "镇原县",
  "value": "621027" }],


[{
  "label": "安定区",
  "value": "621102" },

{
  "label": "通渭县",
  "value": "621121" },

{
  "label": "陇西县",
  "value": "621122" },

{
  "label": "渭源县",
  "value": "621123" },

{
  "label": "临洮县",
  "value": "621124" },

{
  "label": "漳县",
  "value": "621125" },

{
  "label": "岷县",
  "value": "621126" }],


[{
  "label": "武都区",
  "value": "621202" },

{
  "label": "成县",
  "value": "621221" },

{
  "label": "文县",
  "value": "621222" },

{
  "label": "宕昌县",
  "value": "621223" },

{
  "label": "康县",
  "value": "621224" },

{
  "label": "西和县",
  "value": "621225" },

{
  "label": "礼县",
  "value": "621226" },

{
  "label": "徽县",
  "value": "621227" },

{
  "label": "两当县",
  "value": "621228" }],


[{
  "label": "临夏市",
  "value": "622901" },

{
  "label": "临夏县",
  "value": "622921" },

{
  "label": "康乐县",
  "value": "622922" },

{
  "label": "永靖县",
  "value": "622923" },

{
  "label": "广河县",
  "value": "622924" },

{
  "label": "和政县",
  "value": "622925" },

{
  "label": "东乡族自治县",
  "value": "622926" },

{
  "label": "积石山保安族东乡族撒拉族自治县",
  "value": "622927" }],


[{
  "label": "合作市",
  "value": "623001" },

{
  "label": "临潭县",
  "value": "623021" },

{
  "label": "卓尼县",
  "value": "623022" },

{
  "label": "舟曲县",
  "value": "623023" },

{
  "label": "迭部县",
  "value": "623024" },

{
  "label": "玛曲县",
  "value": "623025" },

{
  "label": "碌曲县",
  "value": "623026" },

{
  "label": "夏河县",
  "value": "623027" }]],



[
[{
  "label": "城东区",
  "value": "630102" },

{
  "label": "城中区",
  "value": "630103" },

{
  "label": "城西区",
  "value": "630104" },

{
  "label": "城北区",
  "value": "630105" },

{
  "label": "大通回族土族自治县",
  "value": "630121" },

{
  "label": "湟中县",
  "value": "630122" },

{
  "label": "湟源县",
  "value": "630123" }],


[{
  "label": "乐都区",
  "value": "630202" },

{
  "label": "平安区",
  "value": "630203" },

{
  "label": "民和回族土族自治县",
  "value": "630222" },

{
  "label": "互助土族自治县",
  "value": "630223" },

{
  "label": "化隆回族自治县",
  "value": "630224" },

{
  "label": "循化撒拉族自治县",
  "value": "630225" }],


[{
  "label": "门源回族自治县",
  "value": "632221" },

{
  "label": "祁连县",
  "value": "632222" },

{
  "label": "海晏县",
  "value": "632223" },

{
  "label": "刚察县",
  "value": "632224" }],


[{
  "label": "同仁县",
  "value": "632321" },

{
  "label": "尖扎县",
  "value": "632322" },

{
  "label": "泽库县",
  "value": "632323" },

{
  "label": "河南蒙古族自治县",
  "value": "632324" }],


[{
  "label": "共和县",
  "value": "632521" },

{
  "label": "同德县",
  "value": "632522" },

{
  "label": "贵德县",
  "value": "632523" },

{
  "label": "兴海县",
  "value": "632524" },

{
  "label": "贵南县",
  "value": "632525" }],


[{
  "label": "玛沁县",
  "value": "632621" },

{
  "label": "班玛县",
  "value": "632622" },

{
  "label": "甘德县",
  "value": "632623" },

{
  "label": "达日县",
  "value": "632624" },

{
  "label": "久治县",
  "value": "632625" },

{
  "label": "玛多县",
  "value": "632626" }],


[{
  "label": "玉树市",
  "value": "632701" },

{
  "label": "杂多县",
  "value": "632722" },

{
  "label": "称多县",
  "value": "632723" },

{
  "label": "治多县",
  "value": "632724" },

{
  "label": "囊谦县",
  "value": "632725" },

{
  "label": "曲麻莱县",
  "value": "632726" }],


[{
  "label": "格尔木市",
  "value": "632801" },

{
  "label": "德令哈市",
  "value": "632802" },

{
  "label": "乌兰县",
  "value": "632821" },

{
  "label": "都兰县",
  "value": "632822" },

{
  "label": "天峻县",
  "value": "632823" },

{
  "label": "大柴旦行政委员会",
  "value": "632857" },

{
  "label": "冷湖行政委员会",
  "value": "632858" },

{
  "label": "茫崖行政委员会",
  "value": "632859" }]],



[
[{
  "label": "兴庆区",
  "value": "640104" },

{
  "label": "西夏区",
  "value": "640105" },

{
  "label": "金凤区",
  "value": "640106" },

{
  "label": "永宁县",
  "value": "640121" },

{
  "label": "贺兰县",
  "value": "640122" },

{
  "label": "灵武市",
  "value": "640181" }],


[{
  "label": "大武口区",
  "value": "640202" },

{
  "label": "惠农区",
  "value": "640205" },

{
  "label": "平罗县",
  "value": "640221" }],


[{
  "label": "利通区",
  "value": "640302" },

{
  "label": "红寺堡区",
  "value": "640303" },

{
  "label": "盐池县",
  "value": "640323" },

{
  "label": "同心县",
  "value": "640324" },

{
  "label": "青铜峡市",
  "value": "640381" }],


[{
  "label": "原州区",
  "value": "640402" },

{
  "label": "西吉县",
  "value": "640422" },

{
  "label": "隆德县",
  "value": "640423" },

{
  "label": "泾源县",
  "value": "640424" },

{
  "label": "彭阳县",
  "value": "640425" }],


[{
  "label": "沙坡头区",
  "value": "640502" },

{
  "label": "中宁县",
  "value": "640521" },

{
  "label": "海原县",
  "value": "640522" }]],



[
[{
  "label": "天山区",
  "value": "650102" },

{
  "label": "沙依巴克区",
  "value": "650103" },

{
  "label": "新市区",
  "value": "650104" },

{
  "label": "水磨沟区",
  "value": "650105" },

{
  "label": "头屯河区",
  "value": "650106" },

{
  "label": "达坂城区",
  "value": "650107" },

{
  "label": "米东区",
  "value": "650109" },

{
  "label": "乌鲁木齐县",
  "value": "650121" },

{
  "label": "乌鲁木齐经济技术开发区",
  "value": "650171" },

{
  "label": "乌鲁木齐高新技术产业开发区",
  "value": "650172" }],


[{
  "label": "独山子区",
  "value": "650202" },

{
  "label": "克拉玛依区",
  "value": "650203" },

{
  "label": "白碱滩区",
  "value": "650204" },

{
  "label": "乌尔禾区",
  "value": "650205" }],


[{
  "label": "高昌区",
  "value": "650402" },

{
  "label": "鄯善县",
  "value": "650421" },

{
  "label": "托克逊县",
  "value": "650422" }],


[{
  "label": "伊州区",
  "value": "650502" },

{
  "label": "巴里坤哈萨克自治县",
  "value": "650521" },

{
  "label": "伊吾县",
  "value": "650522" }],


[{
  "label": "昌吉市",
  "value": "652301" },

{
  "label": "阜康市",
  "value": "652302" },

{
  "label": "呼图壁县",
  "value": "652323" },

{
  "label": "玛纳斯县",
  "value": "652324" },

{
  "label": "奇台县",
  "value": "652325" },

{
  "label": "吉木萨尔县",
  "value": "652327" },

{
  "label": "木垒哈萨克自治县",
  "value": "652328" }],


[{
  "label": "博乐市",
  "value": "652701" },

{
  "label": "阿拉山口市",
  "value": "652702" },

{
  "label": "精河县",
  "value": "652722" },

{
  "label": "温泉县",
  "value": "652723" }],


[{
  "label": "库尔勒市",
  "value": "652801" },

{
  "label": "轮台县",
  "value": "652822" },

{
  "label": "尉犁县",
  "value": "652823" },

{
  "label": "若羌县",
  "value": "652824" },

{
  "label": "且末县",
  "value": "652825" },

{
  "label": "焉耆回族自治县",
  "value": "652826" },

{
  "label": "和静县",
  "value": "652827" },

{
  "label": "和硕县",
  "value": "652828" },

{
  "label": "博湖县",
  "value": "652829" },

{
  "label": "库尔勒经济技术开发区",
  "value": "652871" }],


[{
  "label": "阿克苏市",
  "value": "652901" },

{
  "label": "温宿县",
  "value": "652922" },

{
  "label": "库车县",
  "value": "652923" },

{
  "label": "沙雅县",
  "value": "652924" },

{
  "label": "新和县",
  "value": "652925" },

{
  "label": "拜城县",
  "value": "652926" },

{
  "label": "乌什县",
  "value": "652927" },

{
  "label": "阿瓦提县",
  "value": "652928" },

{
  "label": "柯坪县",
  "value": "652929" }],


[{
  "label": "阿图什市",
  "value": "653001" },

{
  "label": "阿克陶县",
  "value": "653022" },

{
  "label": "阿合奇县",
  "value": "653023" },

{
  "label": "乌恰县",
  "value": "653024" }],


[{
  "label": "喀什市",
  "value": "653101" },

{
  "label": "疏附县",
  "value": "653121" },

{
  "label": "疏勒县",
  "value": "653122" },

{
  "label": "英吉沙县",
  "value": "653123" },

{
  "label": "泽普县",
  "value": "653124" },

{
  "label": "莎车县",
  "value": "653125" },

{
  "label": "叶城县",
  "value": "653126" },

{
  "label": "麦盖提县",
  "value": "653127" },

{
  "label": "岳普湖县",
  "value": "653128" },

{
  "label": "伽师县",
  "value": "653129" },

{
  "label": "巴楚县",
  "value": "653130" },

{
  "label": "塔什库尔干塔吉克自治县",
  "value": "653131" }],


[{
  "label": "和田市",
  "value": "653201" },

{
  "label": "和田县",
  "value": "653221" },

{
  "label": "墨玉县",
  "value": "653222" },

{
  "label": "皮山县",
  "value": "653223" },

{
  "label": "洛浦县",
  "value": "653224" },

{
  "label": "策勒县",
  "value": "653225" },

{
  "label": "于田县",
  "value": "653226" },

{
  "label": "民丰县",
  "value": "653227" }],


[{
  "label": "伊宁市",
  "value": "654002" },

{
  "label": "奎屯市",
  "value": "654003" },

{
  "label": "霍尔果斯市",
  "value": "654004" },

{
  "label": "伊宁县",
  "value": "654021" },

{
  "label": "察布查尔锡伯自治县",
  "value": "654022" },

{
  "label": "霍城县",
  "value": "654023" },

{
  "label": "巩留县",
  "value": "654024" },

{
  "label": "新源县",
  "value": "654025" },

{
  "label": "昭苏县",
  "value": "654026" },

{
  "label": "特克斯县",
  "value": "654027" },

{
  "label": "尼勒克县",
  "value": "654028" }],


[{
  "label": "塔城市",
  "value": "654201" },

{
  "label": "乌苏市",
  "value": "654202" },

{
  "label": "额敏县",
  "value": "654221" },

{
  "label": "沙湾县",
  "value": "654223" },

{
  "label": "托里县",
  "value": "654224" },

{
  "label": "裕民县",
  "value": "654225" },

{
  "label": "和布克赛尔蒙古自治县",
  "value": "654226" }],


[{
  "label": "阿勒泰市",
  "value": "654301" },

{
  "label": "布尔津县",
  "value": "654321" },

{
  "label": "富蕴县",
  "value": "654322" },

{
  "label": "福海县",
  "value": "654323" },

{
  "label": "哈巴河县",
  "value": "654324" },

{
  "label": "青河县",
  "value": "654325" },

{
  "label": "吉木乃县",
  "value": "654326" }],


[{
  "label": "石河子市",
  "value": "659001" },

{
  "label": "阿拉尔市",
  "value": "659002" },

{
  "label": "图木舒克市",
  "value": "659003" },

{
  "label": "五家渠市",
  "value": "659004" },

{
  "label": "铁门关市",
  "value": "659006" }]],



[
[{
  "label": "台北",
  "value": "660101" }],

[{
  "label": "高雄",
  "value": "660201" }],

[{
  "label": "基隆",
  "value": "660301" }],

[{
  "label": "台中",
  "value": "660401" }],

[{
  "label": "台南",
  "value": "660501" }],

[{
  "label": "新竹",
  "value": "660601" }],

[{
  "label": "嘉义",
  "value": "660701" }],

[{
  "label": "宜兰",
  "value": "660801" }],

[{
  "label": "桃园",
  "value": "660901" }],

[{
  "label": "苗栗",
  "value": "661001" }],

[{
  "label": "彰化",
  "value": "661101" }],

[{
  "label": "南投",
  "value": "661201" }],

[{
  "label": "云林",
  "value": "661301" }],

[{
  "label": "屏东",
  "value": "661401" }],

[{
  "label": "台东",
  "value": "661501" }],

[{
  "label": "花莲",
  "value": "661601" }],

[{
  "label": "澎湖",
  "value": "661701" }]],


[
[{
  "label": "香港岛",
  "value": "670101" }],

[{
  "label": "九龙",
  "value": "670201" }],

[{
  "label": "新界",
  "value": "670301" }]],


[
[{
  "label": "澳门半岛",
  "value": "680101" }],

[{
  "label": "氹仔岛",
  "value": "680201" }],

[{
  "label": "路环岛",
  "value": "680301" }],

[{
  "label": "路氹城",
  "value": "680401" }]]];var _default =



areaData;exports.default = _default;

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\city-data\\city.js":
/*!******************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-citypicker/city-data/city.js ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /* eslint-disable */
var cityData = [
[{
  "label": "市辖区",
  "value": "1101" }],

[{
  "label": "市辖区",
  "value": "1201" }],

[{
  "label": "石家庄市",
  "value": "1301" },

{
  "label": "唐山市",
  "value": "1302" },

{
  "label": "秦皇岛市",
  "value": "1303" },

{
  "label": "邯郸市",
  "value": "1304" },

{
  "label": "邢台市",
  "value": "1305" },

{
  "label": "保定市",
  "value": "1306" },

{
  "label": "张家口市",
  "value": "1307" },

{
  "label": "承德市",
  "value": "1308" },

{
  "label": "沧州市",
  "value": "1309" },

{
  "label": "廊坊市",
  "value": "1310" },

{
  "label": "衡水市",
  "value": "1311" }],


[{
  "label": "太原市",
  "value": "1401" },

{
  "label": "大同市",
  "value": "1402" },

{
  "label": "阳泉市",
  "value": "1403" },

{
  "label": "长治市",
  "value": "1404" },

{
  "label": "晋城市",
  "value": "1405" },

{
  "label": "朔州市",
  "value": "1406" },

{
  "label": "晋中市",
  "value": "1407" },

{
  "label": "运城市",
  "value": "1408" },

{
  "label": "忻州市",
  "value": "1409" },

{
  "label": "临汾市",
  "value": "1410" },

{
  "label": "吕梁市",
  "value": "1411" }],


[{
  "label": "呼和浩特市",
  "value": "1501" },

{
  "label": "包头市",
  "value": "1502" },

{
  "label": "乌海市",
  "value": "1503" },

{
  "label": "赤峰市",
  "value": "1504" },

{
  "label": "通辽市",
  "value": "1505" },

{
  "label": "鄂尔多斯市",
  "value": "1506" },

{
  "label": "呼伦贝尔市",
  "value": "1507" },

{
  "label": "巴彦淖尔市",
  "value": "1508" },

{
  "label": "乌兰察布市",
  "value": "1509" },

{
  "label": "兴安盟",
  "value": "1522" },

{
  "label": "锡林郭勒盟",
  "value": "1525" },

{
  "label": "阿拉善盟",
  "value": "1529" }],


[{
  "label": "沈阳市",
  "value": "2101" },

{
  "label": "大连市",
  "value": "2102" },

{
  "label": "鞍山市",
  "value": "2103" },

{
  "label": "抚顺市",
  "value": "2104" },

{
  "label": "本溪市",
  "value": "2105" },

{
  "label": "丹东市",
  "value": "2106" },

{
  "label": "锦州市",
  "value": "2107" },

{
  "label": "营口市",
  "value": "2108" },

{
  "label": "阜新市",
  "value": "2109" },

{
  "label": "辽阳市",
  "value": "2110" },

{
  "label": "盘锦市",
  "value": "2111" },

{
  "label": "铁岭市",
  "value": "2112" },

{
  "label": "朝阳市",
  "value": "2113" },

{
  "label": "葫芦岛市",
  "value": "2114" }],


[{
  "label": "长春市",
  "value": "2201" },

{
  "label": "吉林市",
  "value": "2202" },

{
  "label": "四平市",
  "value": "2203" },

{
  "label": "辽源市",
  "value": "2204" },

{
  "label": "通化市",
  "value": "2205" },

{
  "label": "白山市",
  "value": "2206" },

{
  "label": "松原市",
  "value": "2207" },

{
  "label": "白城市",
  "value": "2208" },

{
  "label": "延边朝鲜族自治州",
  "value": "2224" }],


[{
  "label": "哈尔滨市",
  "value": "2301" },

{
  "label": "齐齐哈尔市",
  "value": "2302" },

{
  "label": "鸡西市",
  "value": "2303" },

{
  "label": "鹤岗市",
  "value": "2304" },

{
  "label": "双鸭山市",
  "value": "2305" },

{
  "label": "大庆市",
  "value": "2306" },

{
  "label": "伊春市",
  "value": "2307" },

{
  "label": "佳木斯市",
  "value": "2308" },

{
  "label": "七台河市",
  "value": "2309" },

{
  "label": "牡丹江市",
  "value": "2310" },

{
  "label": "黑河市",
  "value": "2311" },

{
  "label": "绥化市",
  "value": "2312" },

{
  "label": "大兴安岭地区",
  "value": "2327" }],


[{
  "label": "市辖区",
  "value": "3101" }],

[{
  "label": "南京市",
  "value": "3201" },

{
  "label": "无锡市",
  "value": "3202" },

{
  "label": "徐州市",
  "value": "3203" },

{
  "label": "常州市",
  "value": "3204" },

{
  "label": "苏州市",
  "value": "3205" },

{
  "label": "南通市",
  "value": "3206" },

{
  "label": "连云港市",
  "value": "3207" },

{
  "label": "淮安市",
  "value": "3208" },

{
  "label": "盐城市",
  "value": "3209" },

{
  "label": "扬州市",
  "value": "3210" },

{
  "label": "镇江市",
  "value": "3211" },

{
  "label": "泰州市",
  "value": "3212" },

{
  "label": "宿迁市",
  "value": "3213" }],


[{
  "label": "杭州市",
  "value": "3301" },

{
  "label": "宁波市",
  "value": "3302" },

{
  "label": "温州市",
  "value": "3303" },

{
  "label": "嘉兴市",
  "value": "3304" },

{
  "label": "湖州市",
  "value": "3305" },

{
  "label": "绍兴市",
  "value": "3306" },

{
  "label": "金华市",
  "value": "3307" },

{
  "label": "衢州市",
  "value": "3308" },

{
  "label": "舟山市",
  "value": "3309" },

{
  "label": "台州市",
  "value": "3310" },

{
  "label": "丽水市",
  "value": "3311" }],


[{
  "label": "合肥市",
  "value": "3401" },

{
  "label": "芜湖市",
  "value": "3402" },

{
  "label": "蚌埠市",
  "value": "3403" },

{
  "label": "淮南市",
  "value": "3404" },

{
  "label": "马鞍山市",
  "value": "3405" },

{
  "label": "淮北市",
  "value": "3406" },

{
  "label": "铜陵市",
  "value": "3407" },

{
  "label": "安庆市",
  "value": "3408" },

{
  "label": "黄山市",
  "value": "3410" },

{
  "label": "滁州市",
  "value": "3411" },

{
  "label": "阜阳市",
  "value": "3412" },

{
  "label": "宿州市",
  "value": "3413" },

{
  "label": "六安市",
  "value": "3415" },

{
  "label": "亳州市",
  "value": "3416" },

{
  "label": "池州市",
  "value": "3417" },

{
  "label": "宣城市",
  "value": "3418" }],


[{
  "label": "福州市",
  "value": "3501" },

{
  "label": "厦门市",
  "value": "3502" },

{
  "label": "莆田市",
  "value": "3503" },

{
  "label": "三明市",
  "value": "3504" },

{
  "label": "泉州市",
  "value": "3505" },

{
  "label": "漳州市",
  "value": "3506" },

{
  "label": "南平市",
  "value": "3507" },

{
  "label": "龙岩市",
  "value": "3508" },

{
  "label": "宁德市",
  "value": "3509" }],


[{
  "label": "南昌市",
  "value": "3601" },

{
  "label": "景德镇市",
  "value": "3602" },

{
  "label": "萍乡市",
  "value": "3603" },

{
  "label": "九江市",
  "value": "3604" },

{
  "label": "新余市",
  "value": "3605" },

{
  "label": "鹰潭市",
  "value": "3606" },

{
  "label": "赣州市",
  "value": "3607" },

{
  "label": "吉安市",
  "value": "3608" },

{
  "label": "宜春市",
  "value": "3609" },

{
  "label": "抚州市",
  "value": "3610" },

{
  "label": "上饶市",
  "value": "3611" }],


[{
  "label": "济南市",
  "value": "3701" },

{
  "label": "青岛市",
  "value": "3702" },

{
  "label": "淄博市",
  "value": "3703" },

{
  "label": "枣庄市",
  "value": "3704" },

{
  "label": "东营市",
  "value": "3705" },

{
  "label": "烟台市",
  "value": "3706" },

{
  "label": "潍坊市",
  "value": "3707" },

{
  "label": "济宁市",
  "value": "3708" },

{
  "label": "泰安市",
  "value": "3709" },

{
  "label": "威海市",
  "value": "3710" },

{
  "label": "日照市",
  "value": "3711" },

{
  "label": "莱芜市",
  "value": "3712" },

{
  "label": "临沂市",
  "value": "3713" },

{
  "label": "德州市",
  "value": "3714" },

{
  "label": "聊城市",
  "value": "3715" },

{
  "label": "滨州市",
  "value": "3716" },

{
  "label": "菏泽市",
  "value": "3717" }],


[{
  "label": "郑州市",
  "value": "4101" },

{
  "label": "开封市",
  "value": "4102" },

{
  "label": "洛阳市",
  "value": "4103" },

{
  "label": "平顶山市",
  "value": "4104" },

{
  "label": "安阳市",
  "value": "4105" },

{
  "label": "鹤壁市",
  "value": "4106" },

{
  "label": "新乡市",
  "value": "4107" },

{
  "label": "焦作市",
  "value": "4108" },

{
  "label": "濮阳市",
  "value": "4109" },

{
  "label": "许昌市",
  "value": "4110" },

{
  "label": "漯河市",
  "value": "4111" },

{
  "label": "三门峡市",
  "value": "4112" },

{
  "label": "南阳市",
  "value": "4113" },

{
  "label": "商丘市",
  "value": "4114" },

{
  "label": "信阳市",
  "value": "4115" },

{
  "label": "周口市",
  "value": "4116" },

{
  "label": "驻马店市",
  "value": "4117" },

{
  "label": "省直辖县级行政区划",
  "value": "4190" }],


[{
  "label": "武汉市",
  "value": "4201" },

{
  "label": "黄石市",
  "value": "4202" },

{
  "label": "十堰市",
  "value": "4203" },

{
  "label": "宜昌市",
  "value": "4205" },

{
  "label": "襄阳市",
  "value": "4206" },

{
  "label": "鄂州市",
  "value": "4207" },

{
  "label": "荆门市",
  "value": "4208" },

{
  "label": "孝感市",
  "value": "4209" },

{
  "label": "荆州市",
  "value": "4210" },

{
  "label": "黄冈市",
  "value": "4211" },

{
  "label": "咸宁市",
  "value": "4212" },

{
  "label": "随州市",
  "value": "4213" },

{
  "label": "恩施土家族苗族自治州",
  "value": "4228" },

{
  "label": "省直辖县级行政区划",
  "value": "4290" }],


[{
  "label": "长沙市",
  "value": "4301" },

{
  "label": "株洲市",
  "value": "4302" },

{
  "label": "湘潭市",
  "value": "4303" },

{
  "label": "衡阳市",
  "value": "4304" },

{
  "label": "邵阳市",
  "value": "4305" },

{
  "label": "岳阳市",
  "value": "4306" },

{
  "label": "常德市",
  "value": "4307" },

{
  "label": "张家界市",
  "value": "4308" },

{
  "label": "益阳市",
  "value": "4309" },

{
  "label": "郴州市",
  "value": "4310" },

{
  "label": "永州市",
  "value": "4311" },

{
  "label": "怀化市",
  "value": "4312" },

{
  "label": "娄底市",
  "value": "4313" },

{
  "label": "湘西土家族苗族自治州",
  "value": "4331" }],


[{
  "label": "广州市",
  "value": "4401" },

{
  "label": "韶关市",
  "value": "4402" },

{
  "label": "深圳市",
  "value": "4403" },

{
  "label": "珠海市",
  "value": "4404" },

{
  "label": "汕头市",
  "value": "4405" },

{
  "label": "佛山市",
  "value": "4406" },

{
  "label": "江门市",
  "value": "4407" },

{
  "label": "湛江市",
  "value": "4408" },

{
  "label": "茂名市",
  "value": "4409" },

{
  "label": "肇庆市",
  "value": "4412" },

{
  "label": "惠州市",
  "value": "4413" },

{
  "label": "梅州市",
  "value": "4414" },

{
  "label": "汕尾市",
  "value": "4415" },

{
  "label": "河源市",
  "value": "4416" },

{
  "label": "阳江市",
  "value": "4417" },

{
  "label": "清远市",
  "value": "4418" },

{
  "label": "东莞市",
  "value": "4419" },

{
  "label": "中山市",
  "value": "4420" },

{
  "label": "潮州市",
  "value": "4451" },

{
  "label": "揭阳市",
  "value": "4452" },

{
  "label": "云浮市",
  "value": "4453" }],


[{
  "label": "南宁市",
  "value": "4501" },

{
  "label": "柳州市",
  "value": "4502" },

{
  "label": "桂林市",
  "value": "4503" },

{
  "label": "梧州市",
  "value": "4504" },

{
  "label": "北海市",
  "value": "4505" },

{
  "label": "防城港市",
  "value": "4506" },

{
  "label": "钦州市",
  "value": "4507" },

{
  "label": "贵港市",
  "value": "4508" },

{
  "label": "玉林市",
  "value": "4509" },

{
  "label": "百色市",
  "value": "4510" },

{
  "label": "贺州市",
  "value": "4511" },

{
  "label": "河池市",
  "value": "4512" },

{
  "label": "来宾市",
  "value": "4513" },

{
  "label": "崇左市",
  "value": "4514" }],


[{
  "label": "海口市",
  "value": "4601" },

{
  "label": "三亚市",
  "value": "4602" },

{
  "label": "三沙市",
  "value": "4603" },

{
  "label": "儋州市",
  "value": "4604" },

{
  "label": "省直辖县级行政区划",
  "value": "4690" }],


[{
  "label": "市辖区",
  "value": "5001" },

{
  "label": "县",
  "value": "5002" }],


[{
  "label": "成都市",
  "value": "5101" },

{
  "label": "自贡市",
  "value": "5103" },

{
  "label": "攀枝花市",
  "value": "5104" },

{
  "label": "泸州市",
  "value": "5105" },

{
  "label": "德阳市",
  "value": "5106" },

{
  "label": "绵阳市",
  "value": "5107" },

{
  "label": "广元市",
  "value": "5108" },

{
  "label": "遂宁市",
  "value": "5109" },

{
  "label": "内江市",
  "value": "5110" },

{
  "label": "乐山市",
  "value": "5111" },

{
  "label": "南充市",
  "value": "5113" },

{
  "label": "眉山市",
  "value": "5114" },

{
  "label": "宜宾市",
  "value": "5115" },

{
  "label": "广安市",
  "value": "5116" },

{
  "label": "达州市",
  "value": "5117" },

{
  "label": "雅安市",
  "value": "5118" },

{
  "label": "巴中市",
  "value": "5119" },

{
  "label": "资阳市",
  "value": "5120" },

{
  "label": "阿坝藏族羌族自治州",
  "value": "5132" },

{
  "label": "甘孜藏族自治州",
  "value": "5133" },

{
  "label": "凉山彝族自治州",
  "value": "5134" }],


[{
  "label": "贵阳市",
  "value": "5201" },

{
  "label": "六盘水市",
  "value": "5202" },

{
  "label": "遵义市",
  "value": "5203" },

{
  "label": "安顺市",
  "value": "5204" },

{
  "label": "毕节市",
  "value": "5205" },

{
  "label": "铜仁市",
  "value": "5206" },

{
  "label": "黔西南布依族苗族自治州",
  "value": "5223" },

{
  "label": "黔东南苗族侗族自治州",
  "value": "5226" },

{
  "label": "黔南布依族苗族自治州",
  "value": "5227" }],


[{
  "label": "昆明市",
  "value": "5301" },

{
  "label": "曲靖市",
  "value": "5303" },

{
  "label": "玉溪市",
  "value": "5304" },

{
  "label": "保山市",
  "value": "5305" },

{
  "label": "昭通市",
  "value": "5306" },

{
  "label": "丽江市",
  "value": "5307" },

{
  "label": "普洱市",
  "value": "5308" },

{
  "label": "临沧市",
  "value": "5309" },

{
  "label": "楚雄彝族自治州",
  "value": "5323" },

{
  "label": "红河哈尼族彝族自治州",
  "value": "5325" },

{
  "label": "文山壮族苗族自治州",
  "value": "5326" },

{
  "label": "西双版纳傣族自治州",
  "value": "5328" },

{
  "label": "大理白族自治州",
  "value": "5329" },

{
  "label": "德宏傣族景颇族自治州",
  "value": "5331" },

{
  "label": "怒江傈僳族自治州",
  "value": "5333" },

{
  "label": "迪庆藏族自治州",
  "value": "5334" }],


[{
  "label": "拉萨市",
  "value": "5401" },

{
  "label": "日喀则市",
  "value": "5402" },

{
  "label": "昌都市",
  "value": "5403" },

{
  "label": "林芝市",
  "value": "5404" },

{
  "label": "山南市",
  "value": "5405" },

{
  "label": "那曲地区",
  "value": "5424" },

{
  "label": "阿里地区",
  "value": "5425" }],


[{
  "label": "西安市",
  "value": "6101" },

{
  "label": "铜川市",
  "value": "6102" },

{
  "label": "宝鸡市",
  "value": "6103" },

{
  "label": "咸阳市",
  "value": "6104" },

{
  "label": "渭南市",
  "value": "6105" },

{
  "label": "延安市",
  "value": "6106" },

{
  "label": "汉中市",
  "value": "6107" },

{
  "label": "榆林市",
  "value": "6108" },

{
  "label": "安康市",
  "value": "6109" },

{
  "label": "商洛市",
  "value": "6110" }],


[{
  "label": "兰州市",
  "value": "6201" },

{
  "label": "嘉峪关市",
  "value": "6202" },

{
  "label": "金昌市",
  "value": "6203" },

{
  "label": "白银市",
  "value": "6204" },

{
  "label": "天水市",
  "value": "6205" },

{
  "label": "武威市",
  "value": "6206" },

{
  "label": "张掖市",
  "value": "6207" },

{
  "label": "平凉市",
  "value": "6208" },

{
  "label": "酒泉市",
  "value": "6209" },

{
  "label": "庆阳市",
  "value": "6210" },

{
  "label": "定西市",
  "value": "6211" },

{
  "label": "陇南市",
  "value": "6212" },

{
  "label": "临夏回族自治州",
  "value": "6229" },

{
  "label": "甘南藏族自治州",
  "value": "6230" }],


[{
  "label": "西宁市",
  "value": "6301" },

{
  "label": "海东市",
  "value": "6302" },

{
  "label": "海北藏族自治州",
  "value": "6322" },

{
  "label": "黄南藏族自治州",
  "value": "6323" },

{
  "label": "海南藏族自治州",
  "value": "6325" },

{
  "label": "果洛藏族自治州",
  "value": "6326" },

{
  "label": "玉树藏族自治州",
  "value": "6327" },

{
  "label": "海西蒙古族藏族自治州",
  "value": "6328" }],


[{
  "label": "银川市",
  "value": "6401" },

{
  "label": "石嘴山市",
  "value": "6402" },

{
  "label": "吴忠市",
  "value": "6403" },

{
  "label": "固原市",
  "value": "6404" },

{
  "label": "中卫市",
  "value": "6405" }],


[{
  "label": "乌鲁木齐市",
  "value": "6501" },

{
  "label": "克拉玛依市",
  "value": "6502" },

{
  "label": "吐鲁番市",
  "value": "6504" },

{
  "label": "哈密市",
  "value": "6505" },

{
  "label": "昌吉回族自治州",
  "value": "6523" },

{
  "label": "博尔塔拉蒙古自治州",
  "value": "6527" },

{
  "label": "巴音郭楞蒙古自治州",
  "value": "6528" },

{
  "label": "阿克苏地区",
  "value": "6529" },

{
  "label": "克孜勒苏柯尔克孜自治州",
  "value": "6530" },

{
  "label": "喀什地区",
  "value": "6531" },

{
  "label": "和田地区",
  "value": "6532" },

{
  "label": "伊犁哈萨克自治州",
  "value": "6540" },

{
  "label": "塔城地区",
  "value": "6542" },

{
  "label": "阿勒泰地区",
  "value": "6543" },

{
  "label": "自治区直辖县级行政区划",
  "value": "6590" }],


[{
  "label": "台北",
  "value": "6601" },

{
  "label": "高雄",
  "value": "6602" },

{
  "label": "基隆",
  "value": "6603" },

{
  "label": "台中",
  "value": "6604" },

{
  "label": "台南",
  "value": "6605" },

{
  "label": "新竹",
  "value": "6606" },

{
  "label": "嘉义",
  "value": "6607" },

{
  "label": "宜兰",
  "value": "6608" },

{
  "label": "桃园",
  "value": "6609" },

{
  "label": "苗栗",
  "value": "6610" },

{
  "label": "彰化",
  "value": "6611" },

{
  "label": "南投",
  "value": "6612" },

{
  "label": "云林",
  "value": "6613" },

{
  "label": "屏东",
  "value": "6614" },

{
  "label": "台东",
  "value": "6615" },

{
  "label": "花莲",
  "value": "6616" },

{
  "label": "澎湖",
  "value": "6617" }],


[{
  "label": "香港岛",
  "value": "6701" },

{
  "label": "九龙",
  "value": "6702" },

{
  "label": "新界",
  "value": "6703" }],


[{
  "label": "澳门半岛",
  "value": "6801" },

{
  "label": "氹仔岛",
  "value": "6802" },

{
  "label": "路环岛",
  "value": "6803" },

{
  "label": "路氹城",
  "value": "6804" }]];var _default =



cityData;exports.default = _default;

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\city-data\\province.js":
/*!**********************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-citypicker/city-data/province.js ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /* eslint-disable */
var provinceData = [{
  "label": "北京市",
  "value": "11" },

{
  "label": "天津市",
  "value": "12" },

{
  "label": "河北省",
  "value": "13" },

{
  "label": "山西省",
  "value": "14" },

{
  "label": "内蒙古自治区",
  "value": "15" },

{
  "label": "辽宁省",
  "value": "21" },

{
  "label": "吉林省",
  "value": "22" },

{
  "label": "黑龙江省",
  "value": "23" },

{
  "label": "上海市",
  "value": "31" },

{
  "label": "江苏省",
  "value": "32" },

{
  "label": "浙江省",
  "value": "33" },

{
  "label": "安徽省",
  "value": "34" },

{
  "label": "福建省",
  "value": "35" },

{
  "label": "江西省",
  "value": "36" },

{
  "label": "山东省",
  "value": "37" },

{
  "label": "河南省",
  "value": "41" },

{
  "label": "湖北省",
  "value": "42" },

{
  "label": "湖南省",
  "value": "43" },

{
  "label": "广东省",
  "value": "44" },

{
  "label": "广西壮族自治区",
  "value": "45" },

{
  "label": "海南省",
  "value": "46" },

{
  "label": "重庆市",
  "value": "50" },

{
  "label": "四川省",
  "value": "51" },

{
  "label": "贵州省",
  "value": "52" },

{
  "label": "云南省",
  "value": "53" },

{
  "label": "西藏自治区",
  "value": "54" },

{
  "label": "陕西省",
  "value": "61" },

{
  "label": "甘肃省",
  "value": "62" },

{
  "label": "青海省",
  "value": "63" },

{
  "label": "宁夏回族自治区",
  "value": "64" },

{
  "label": "新疆维吾尔自治区",
  "value": "65" },

{
  "label": "台湾",
  "value": "66" },

{
  "label": "香港",
  "value": "67" },

{
  "label": "澳门",
  "value": "68" }];var _default =


provinceData;exports.default = _default;

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue":
/*!********************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-citypicker/mpvueCityPicker.vue ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mpvueCityPicker_vue_vue_type_template_id_758146e3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mpvueCityPicker.vue?vue&type=template&id=758146e3& */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue?vue&type=template&id=758146e3&");
/* harmony import */ var _mpvueCityPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mpvueCityPicker.vue?vue&type=script&lang=js& */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _mpvueCityPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _mpvueCityPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _mpvueCityPicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mpvueCityPicker.vue?vue&type=style&index=0&lang=css& */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _mpvueCityPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _mpvueCityPicker_vue_vue_type_template_id_758146e3___WEBPACK_IMPORTED_MODULE_0__["render"],
  _mpvueCityPicker_vue_vue_type_template_id_758146e3___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-citypicker/mpvueCityPicker.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-citypicker/mpvueCityPicker.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!./mpvueCityPicker.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue?vue&type=script&lang=js&");
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue?vue&type=style&index=0&lang=css&":
/*!*****************************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-citypicker/mpvueCityPicker.vue?vue&type=style&index=0&lang=css& ***!
  \*****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-1!./node_modules/css-loader??ref--6-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/vue-loader/lib??vue-loader-options!./mpvueCityPicker.vue?vue&type=style&index=0&lang=css& */ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue?vue&type=template&id=758146e3&":
/*!***************************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-citypicker/mpvueCityPicker.vue?vue&type=template&id=758146e3& ***!
  \***************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_template_id_758146e3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!./mpvueCityPicker.vue?vue&type=template&id=758146e3& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-citypicker\\mpvueCityPicker.vue?vue&type=template&id=758146e3&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_template_id_758146e3___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvueCityPicker_vue_vue_type_template_id_758146e3___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue":
/*!************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-picker/mpvuePicker.vue ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mpvuePicker_vue_vue_type_template_id_40da1126___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mpvuePicker.vue?vue&type=template&id=40da1126& */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue?vue&type=template&id=40da1126&");
/* harmony import */ var _mpvuePicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mpvuePicker.vue?vue&type=script&lang=js& */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _mpvuePicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _mpvuePicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _mpvuePicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mpvuePicker.vue?vue&type=style&index=0&lang=css& */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _mpvuePicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _mpvuePicker_vue_vue_type_template_id_40da1126___WEBPACK_IMPORTED_MODULE_0__["render"],
  _mpvuePicker_vue_vue_type_template_id_40da1126___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-picker/mpvuePicker.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-picker/mpvuePicker.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!./mpvuePicker.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue?vue&type=script&lang=js&");
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue?vue&type=style&index=0&lang=css&":
/*!*********************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-picker/mpvuePicker.vue?vue&type=style&index=0&lang=css& ***!
  \*********************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-1!./node_modules/css-loader??ref--6-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/vue-loader/lib??vue-loader-options!./mpvuePicker.vue?vue&type=style&index=0&lang=css& */ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_6_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue?vue&type=template&id=40da1126&":
/*!*******************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/components/mpvue-picker/mpvuePicker.vue?vue&type=template&id=40da1126& ***!
  \*******************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_template_id_40da1126___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!./mpvuePicker.vue?vue&type=template&id=40da1126& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\components\\mpvue-picker\\mpvuePicker.vue?vue&type=template&id=40da1126&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_template_id_40da1126___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_mpvuePicker_vue_vue_type_template_id_40da1126___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages.json":
/*!*******************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/pages.json ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map