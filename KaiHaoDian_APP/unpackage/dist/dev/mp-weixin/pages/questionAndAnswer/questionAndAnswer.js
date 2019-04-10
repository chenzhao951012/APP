(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/questionAndAnswer/questionAndAnswer"],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/pages/questionAndAnswer/questionAndAnswer.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;


























































var _shoppublic = _interopRequireDefault(__webpack_require__(/*! @/common/shoppublic */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\common\\shoppublic.js"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} //服务器地址
var _default = {
  data: function data() {
    return {
      topTabState: '0',
      paegsize: 1, //触底加载更多
      index: 11,
      pageInfo: [] };

  },
  onLoad: function onLoad() {
    var _this = this;
    _this.getQuesition();
  },
  onReachBottom: function onReachBottom() {
    console.log('onReach');
    this.getQuesition('onReach');
  },
  methods: {
    // 获取问答列表
    getQuesition: function getQuesition() {var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '0';
      var _this = this;
      var oldpageInfo = _this.pageInfo;
      if (page === 'onReach') {
        uni.request({
          url: _shoppublic.default.getUrl() + 'questions/findQuestionsList',
          data: {
            token: 6239,
            type: 1,
            updatetime: '',
            pagesise: _this.index,
            province_id: 610000,
            city_id: 610100,
            questions: '' },

          success: function success(res) {
            if (page === 'onReach' && res.data.responseBody) {
              oldpageInfo = oldpageInfo.concat(res.data.responseBody);
              _this.index += 7;
            } else {
              return false;
            }
            _this.pageInfo = oldpageInfo;
            console.log(_this.pageInfo);
          } });

        this.paegsize += 10;
      } else {
        uni.request({
          url: _shoppublic.default.getUrl() + 'questions/findQuestionsList',
          data: {
            token: 6239,
            type: 1,
            updatetime: '',
            pagesise: _this.paegsize,
            province_id: 610000,
            city_id: 610100,
            questions: '' },

          success: function success(res) {
            _this.pageInfo = res.data.responseBody;
            console.log(_this.pageInfo);
          } });

      }
    },

    // 顶部选项卡切换
    tabChanges: function tabChanges(state) {
      this.topTabState = state;
    },
    //跳转搜索:1是问答跳转
    toSearch: function toSearch(e) {
      uni.navigateTo({
        url: '../searchPage/searchPage?search_state=' + '1' });

    },
    toQuestionAndAnswerDetails: function toQuestionAndAnswerDetails(id) {
      uni.navigateTo({
        url: './questionAndAnswerDetails/questionAndAnswerDetails?id=' + id });

    } },

  // 原生按钮点击事件
  onNavigationBarButtonTap: function onNavigationBarButtonTap(e) {
    var _this = this;
    if (e.index === 0) {//跳转问答发布

    }
    if (e.index === 1) {
      _this.toSearch(); //跳转搜索
    }
  } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ "./node_modules/@dcloudio/uni-mp-weixin/dist/index.js")["default"]))

/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue?vue&type=style&index=0&lang=scss&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-1!./node_modules/css-loader??ref--8-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-4!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/pages/questionAndAnswer/questionAndAnswer.vue?vue&type=style&index=0&lang=scss& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue?vue&type=template&id=59781b9e&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/pages/questionAndAnswer/questionAndAnswer.vue?vue&type=template&id=59781b9e& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  return _c(
    "view",
    { staticClass: "content" },
    [
      _c("view", { staticClass: "top_tab" }, [
        _c(
          "view",
          {
            staticClass: "_tab",
            attrs: { eventid: "edbcc6d6-0" },
            on: {
              click: function($event) {
                _vm.tabChanges("0")
              }
            }
          },
          [
            _c(
              "view",
              {
                class: {
                  _top: "_top",
                  _topColor: _vm.topTabState === "0" ? "_topColor" : ""
                }
              },
              [_vm._v("热门")]
            ),
            _c("view", {
              class: { _lineCss: _vm.topTabState === "0" ? "_lineCss" : "" }
            })
          ]
        ),
        _c(
          "view",
          {
            staticClass: "_tab",
            attrs: { eventid: "edbcc6d6-1" },
            on: {
              click: function($event) {
                _vm.tabChanges("1")
              }
            }
          },
          [
            _c(
              "view",
              {
                class: {
                  _top: "_top",
                  _topColor: _vm.topTabState === "1" ? "_topColor" : ""
                }
              },
              [_vm._v("推荐")]
            ),
            _c("view", {
              class: { _lineCss: _vm.topTabState === "1" ? "_lineCss" : "" }
            })
          ]
        ),
        _c(
          "view",
          {
            staticClass: "_tab",
            attrs: { eventid: "edbcc6d6-2" },
            on: {
              click: function($event) {
                _vm.tabChanges("2")
              }
            }
          },
          [
            _c(
              "view",
              {
                class: {
                  _top: "_top",
                  _topColor: _vm.topTabState === "2" ? "_topColor" : ""
                }
              },
              [_vm._v("全部")]
            ),
            _c("view", {
              class: { _lineCss: _vm.topTabState === "2" ? "_lineCss" : "" }
            })
          ]
        )
      ]),
      _vm._l(_vm.pageInfo, function(item, index) {
        return _c(
          "view",
          {
            key: index,
            staticClass: "openStory",
            attrs: { eventid: "edbcc6d6-3-" + index },
            on: {
              click: function($event) {
                _vm.toQuestionAndAnswerDetails(item.id)
              }
            }
          },
          [
            _c("view", { staticClass: "openStory_cell" }, [
              item.user != undefined
                ? _c("view", { staticClass: "osCell_title" }, [
                    _c("view", { staticClass: "osCell_title_left" }, [
                      _c("image", {
                        attrs: { src: item.user.portrait, mode: "" }
                      })
                    ]),
                    _c("view", { staticClass: "osCell_title_right" }, [
                      _c("view", { staticClass: "_name" }, [
                        _c("text", [_vm._v(_vm._s(item.user.name))]),
                        item.user.position
                          ? _c("text", [_vm._v("·")])
                          : _vm._e(),
                        _c("text", [_vm._v(_vm._s(item.user.position))])
                      ]),
                      _c("view", { staticClass: "_company" }, [
                        _c("text", { staticClass: "_L textHidden" }, [
                          _vm._v(_vm._s(item.user.company))
                        ]),
                        _c("text", { staticClass: "iconfont" }, [_vm._v("")])
                      ])
                    ])
                  ])
                : _vm._e(),
              _c("view", { staticClass: "osCell_content" }, [
                _vm._v(_vm._s(item.questions))
              ]),
              _c("view", { staticClass: "osCell_text" }, [
                _vm._v(_vm._s(item.replycontent))
              ]),
              _c("view", { staticClass: "osCell_bottom" }, [
                _c("view", { staticClass: "osCell_bottom_left" }, [
                  _vm._v(_vm._s(item.addtime))
                ]),
                _c("view", { staticClass: "osCell_bottom_center" }, [
                  _vm._v("已有" + _vm._s(item.attentioncount) + "人关注")
                ]),
                _c("view", { staticClass: "osCell_bottom_right" }, [
                  _c("text", { staticClass: "icon_comment" }, [_vm._v("")]),
                  _c("text", [_vm._v(_vm._s(item.replycount))])
                ])
              ])
            ])
          ]
        )
      })
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\main.js?{\"page\":\"pages%2FquestionAndAnswer%2FquestionAndAnswer\"}":
/*!*************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/main.js?{"page":"pages%2FquestionAndAnswer%2FquestionAndAnswer"} ***!
  \*************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
__webpack_require__(/*! uni-pages */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages.json");
var _mpvuePageFactory = _interopRequireDefault(__webpack_require__(/*! mpvue-page-factory */ "./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mpvue-page-factory/index.js"));
var _questionAndAnswer = _interopRequireDefault(__webpack_require__(/*! ./pages/questionAndAnswer/questionAndAnswer.vue */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
Page((0, _mpvuePageFactory.default)(_questionAndAnswer.default));

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue":
/*!******************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/pages/questionAndAnswer/questionAndAnswer.vue ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _questionAndAnswer_vue_vue_type_template_id_59781b9e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./questionAndAnswer.vue?vue&type=template&id=59781b9e& */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue?vue&type=template&id=59781b9e&");
/* harmony import */ var _questionAndAnswer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./questionAndAnswer.vue?vue&type=script&lang=js& */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue?vue&type=script&lang=js&");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _questionAndAnswer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _questionAndAnswer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _questionAndAnswer_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./questionAndAnswer.vue?vue&type=style&index=0&lang=scss& */ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _questionAndAnswer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _questionAndAnswer_vue_vue_type_template_id_59781b9e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _questionAndAnswer_vue_vue_type_template_id_59781b9e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/pages/questionAndAnswer/questionAndAnswer.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/pages/questionAndAnswer/questionAndAnswer.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--18-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib??vue-loader-options!./questionAndAnswer.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue?vue&type=script&lang=js&");
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_18_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue?vue&type=style&index=0&lang=scss&":
/*!****************************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/pages/questionAndAnswer/questionAndAnswer.vue?vue&type=style&index=0&lang=scss& ***!
  \****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/mini-css-extract-plugin/dist/loader.js??ref--8-oneOf-1-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--8-oneOf-1-1!./node_modules/css-loader??ref--8-oneOf-1-2!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--8-oneOf-1-3!./node_modules/sass-loader/lib/loader.js??ref--8-oneOf-1-4!./node_modules/vue-loader/lib??vue-loader-options!./questionAndAnswer.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/mini-css-extract-plugin/dist/loader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_D_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_8_oneOf_1_1_D_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_index_js_ref_8_oneOf_1_2_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_stylePostLoader_js_D_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_8_oneOf_1_3_D_HBuilderX_plugins_uniapp_cli_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_4_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue?vue&type=template&id=59781b9e&":
/*!*************************************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/kaiHaoDian_APP/KaiHaoDian_APP/pages/questionAndAnswer/questionAndAnswer.vue?vue&type=template&id=59781b9e& ***!
  \*************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_template_id_59781b9e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib??vue-loader-options!./questionAndAnswer.vue?vue&type=template&id=59781b9e& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader/index.js?!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/vue-loader/lib/index.js?!C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\pages\\questionAndAnswer\\questionAndAnswer.vue?vue&type=template&id=59781b9e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_template_id_59781b9e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_D_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_D_HBuilderX_plugins_uniapp_cli_node_modules_vue_loader_lib_index_js_vue_loader_options_questionAndAnswer_vue_vue_type_template_id_59781b9e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

},[["C:\\Users\\Administrator\\Desktop\\kaiHaoDian_APP\\KaiHaoDian_APP\\main.js?{\"page\":\"pages%2FquestionAndAnswer%2FquestionAndAnswer\"}","common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/questionAndAnswer/questionAndAnswer.js.map