module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 29);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("@wikia/ad-engine");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/createClass");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/regenerator");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/classCallCheck");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/asyncToGenerator");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/getPrototypeOf");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/inherits");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/possibleConstructorReturn");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/promise");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/object/assign");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/get");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/object/keys");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/toConsumableArray");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/symbol");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("lodash/mapValues");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("eventemitter3");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = {"CROSS":"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19.707 4.293a.999.999 0 0 0-1.414 0L12 10.586 5.707 4.293a.999.999 0 1 0-1.414 1.414L10.586 12l-6.293 6.293a.999.999 0 1 0 1.414 1.414L12 13.414l6.293 6.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L13.414 12l6.293-6.293a.999.999 0 0 0 0-1.414\" fill-rule=\"evenodd\"/></svg>","LEARN_MORE":"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><g stroke=\"none\" stroke-width=\"1\" fill-rule=\"evenodd\"><g transform=\"translate(-753.000000, -1764.000000)\" fill-rule=\"nonzero\"><g transform=\"translate(153.000000, 1746.000000)\"><g transform=\"translate(5.000000, 0.000000)\"><g transform=\"translate(459.000000, 0.000000)\"><g transform=\"translate(136.000000, 18.000000)\"><polygon points=\"24 0 15 0 18.4395 3.4395 9.033 12.846 11.154 14.967 20.5605 5.5605 24 9\"></polygon><path d=\"M19.5,24 L1.5,24 C0.672,24 0,23.328 0,22.5 L0,4.5 C0,3.672 0.672,3 1.5,3 L10.5,3 L10.5,6 L3,6 L3,21 L18,21 L18,13.5 L21,13.5 L21,22.5 C21,23.328 20.328,24 19.5,24 Z\"></path></g></g></g></g></g></g></svg>","PAUSE":"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><g fill-rule=\"evenodd\"><rect width=\"7\" height=\"22\" rx=\"1\" x=\"3\" y=\"1\"></rect><rect x=\"14\" width=\"7\" height=\"22\" rx=\"1\" y=\"1\"></rect></g></svg>","PLAY":"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19.69 12.6L5.143 22.867a.722.722 0 0 1-.753.05.733.733 0 0 1-.391-.65V1.733c0-.274.15-.524.391-.65a.724.724 0 0 1 .753.05l14.545 10.266a.734.734 0 0 1 0 1.201z\" fill-rule=\"evenodd\"></path></svg>","REPLAY":"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 23c6.065 0 11-4.863 11-10.84a.992.992 0 0 0-1-.985c-.553 0-1 .44-1 .986 0 4.89-4.037 8.868-9 8.868s-9-3.978-9-8.868c0-4.89 4.037-8.869 9-8.869a8.991 8.991 0 0 1 6.975 3.292l-3.794-.501a.996.996 0 0 0-1.124.845.987.987 0 0 0 .858 1.108l5.946.785a.996.996 0 0 0 1.124-.845l.797-5.86a.987.987 0 0 0-.858-1.107.994.994 0 0 0-1.124.846l-.446 3.28A10.997 10.997 0 0 0 12 1.322c-6.065 0-11 4.862-11 10.839C1 18.137 5.935 23 12 23\" fill-rule=\"evenodd\"/></svg>","FULLSCREEN_OFF":"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5.5 9H8V2H5v4H1v3h4.5zm13 0H16V2h3v4h4v3h-4.5zm-13 6H8v7H5v-4H1v-3h4.5zm13 0H16v7h3v-4h4v-3h-4.5z\" fill-rule=\"evenodd\"/></svg>","FULLSCREEN_ON":"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M21.5 22H23v-7h-3v4h-4v3h5.5zM23 3.5V9h-3V5h-4V2h7v1.5zm-22 17V15h3v4h4v3H1v-1.5zM2.5 2H1v7h3V5h4V2H2.5z\" fill-rule=\"evenodd\"/></svg>","VOLUME_OFF":"<svg viewBox=\"0 0 28 28\" xmlns=\"http://www.w3.org/2000/svg\"><defs><style>.cls-1{fill:#fff;opacity:0.4;}.cls-2{fill:#231f20;}</style></defs><title>sound_off_button</title><circle class=\"cls-1\" cx=\"14.06\" cy=\"13.96\" r=\"13.74\"/><path class=\"cls-2\" d=\"M16,2.93A13.07,13.07,0,1,1,2.93,16,13.08,13.08,0,0,1,16,2.93M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Z\" transform=\"translate(-2 -2)\"/><g id=\"Page-1\"><g id=\"Video-Player-Skin\"><g id=\"Video-Copy\"><g id=\"volume-off\"><path id=\"Shape\" class=\"cls-2\" d=\"M14.25,9.17l-3.79,4.11H6.84c-.78,0-1,.46-1,.89V17.7a1,1,0,0,0,1,1h3.65l3.79,4.18a1.09,1.09,0,0,0,.53.14,1,1,0,0,0,.5-.14,1,1,0,0,0,.5-.9V10a1,1,0,0,0-.5-.9,1.06,1.06,0,0,0-1,.05Z\" transform=\"translate(-2 -2)\"/><path id=\"Fill-1\" class=\"cls-2\" d=\"M22.91,16.21l3-3a.92.92,0,1,0-1.3-1.3l-3,3-3-3a.92.92,0,1,0-1.3,1.3l3,3-3,3a.92.92,0,1,0,1.3,1.3l3-3,3,3a.92.92,0,1,0,1.3-1.3Z\" transform=\"translate(-2 -2)\"/></g></g></g></g></svg>","VOLUME_ON":"<svg viewBox=\"0 0 28 28\" xmlns=\"http://www.w3.org/2000/svg\"><defs><style>.cls-1{fill:#fff;opacity:0.4;}.cls-2{fill:#231f20;}</style></defs><title>sound_on_button</title><circle class=\"cls-1\" cx=\"13.96\" cy=\"14.06\" r=\"13.74\"/><path class=\"cls-2\" d=\"M16,2.93A13.07,13.07,0,1,1,2.93,16,13.08,13.08,0,0,1,16,2.93M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Z\" transform=\"translate(-2 -2)\"/><g id=\"Page-1\"><g id=\"Video-Player-Skin\"><g id=\"Video-Copy\"><g id=\"volume\"><path id=\"Shape\" class=\"cls-2\" d=\"M14.24,9.17l-3.79,4.11H6.82c-.78,0-1,.46-1,.89V17.7a1,1,0,0,0,1,1h3.65l3.79,4.18a1.09,1.09,0,0,0,.53.14,1,1,0,0,0,.5-.14,1,1,0,0,0,.5-.9V10a1,1,0,0,0-.5-.9,1.06,1.06,0,0,0-1,.05Z\" transform=\"translate(-2 -2)\"/><path id=\"Shape-2\" data-name=\"Shape\" class=\"cls-2\" d=\"M19.18,19.33a4.39,4.39,0,0,0,0-6.19.71.71,0,0,0-1,1,3,3,0,0,1,0,4.19.71.71,0,0,0,1,1Z\" transform=\"translate(-2 -2)\"/><path id=\"Shape-3\" data-name=\"Shape\" class=\"cls-2\" d=\"M23.3,16.23a6.19,6.19,0,0,0-1.81-4.39.71.71,0,1,0-1,1,4.81,4.81,0,0,1,0,6.79.71.71,0,1,0,1,1,6.19,6.19,0,0,0,1.81-4.39Z\" transform=\"translate(-2 -2)\"/></g></g></g></g></svg>","HIVI_VOLUME_OFF":"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6 8.007H1.347C.333 8.007 0 8.769 0 9.391v5.032C0 15.045.333 16 1.347 16H6l5.007 5.796c.215.132.454.205.693.205.24 0 .436-.063.65-.196.429-.265.65-.75.65-1.28V3.447c0-.53-.221-1.02-.65-1.284-.429-.265-.935-.187-1.365.078L6 8.007zM20.305 12l2.425-2.425a.922.922 0 1 0-1.306-1.305l-2.425 2.424-2.423-2.424a.923.923 0 0 0-1.306 1.305L17.695 12l-2.425 2.425a.922.922 0 1 0 1.306 1.304L19 13.306l2.425 2.423a.92.92 0 0 0 1.306 0 .922.922 0 0 0 0-1.304L20.305 12z\" fill-rule=\"evenodd\"></path></svg>","HIVI_VOLUME_ON":"<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><g fill-rule=\"evenodd\"><path d=\"M6 8.007H1.347C.333 8.007 0 8.769 0 9.391v5.032C0 15.045.333 16 1.347 16H6l5.007 5.796c.215.132.454.205.693.205.24 0 .436-.063.65-.196.429-.265.65-.75.65-1.28V3.447c0-.53-.221-1.02-.65-1.284-.429-.265-.935-.187-1.365.078L6 8.007zm11.612 8.524a5.858 5.858 0 0 0 0-8.253.944.944 0 0 0-1.337 1.332 3.97 3.97 0 0 1 0 5.59.943.943 0 1 0 1.337 1.331z\"></path><path d=\"M23.03 12.135c0-2.21-.859-4.292-2.418-5.857a.943.943 0 1 0-1.337 1.332 6.37 6.37 0 0 1 1.868 4.525 6.37 6.37 0 0 1-1.868 4.525.943.943 0 1 0 1.338 1.332 8.249 8.249 0 0 0 2.418-5.857z\"></path></g></svg>"}

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/assertThisInitialized");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("lodash/throttle");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("lodash/isFunction");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/parse-float");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("js-cookie");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("lodash/debounce");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("lodash/isUndefined");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("lodash/toPlainObject");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/toArray");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/objectSpread");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/array/is-array");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/slicedToArray");

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var utils_namespaceObject = {};
__webpack_require__.d(utils_namespaceObject, "setupNpaContext", function() { return setupNpaContext; });
__webpack_require__.d(utils_namespaceObject, "NavbarManager", function() { return navbar_manager_NavbarManager; });
__webpack_require__.d(utils_namespaceObject, "navbarManager", function() { return navbarManager; });
var constants_namespaceObject = {};
__webpack_require__.d(constants_namespaceObject, "CSS_CLASSNAME_FADE_IN_ANIMATION", function() { return CSS_CLASSNAME_FADE_IN_ANIMATION; });
__webpack_require__.d(constants_namespaceObject, "CSS_CLASSNAME_SLIDE_OUT_ANIMATION", function() { return CSS_CLASSNAME_SLIDE_OUT_ANIMATION; });
__webpack_require__.d(constants_namespaceObject, "CSS_CLASSNAME_STICKY_BFAA", function() { return CSS_CLASSNAME_STICKY_BFAA; });
__webpack_require__.d(constants_namespaceObject, "CSS_CLASSNAME_STICKY_BFAB", function() { return CSS_CLASSNAME_STICKY_BFAB; });
__webpack_require__.d(constants_namespaceObject, "CSS_CLASSNAME_STICKY_SLOT", function() { return CSS_CLASSNAME_STICKY_SLOT; });
__webpack_require__.d(constants_namespaceObject, "CSS_CLASSNAME_STICKY_TEMPLATE", function() { return CSS_CLASSNAME_STICKY_TEMPLATE; });
__webpack_require__.d(constants_namespaceObject, "CSS_TIMING_EASE_IN_CUBIC", function() { return CSS_TIMING_EASE_IN_CUBIC; });
__webpack_require__.d(constants_namespaceObject, "CSS_CLASSNAME_STICKY_IAB", function() { return CSS_CLASSNAME_STICKY_IAB; });
__webpack_require__.d(constants_namespaceObject, "SLIDE_OUT_TIME", function() { return SLIDE_OUT_TIME; });
__webpack_require__.d(constants_namespaceObject, "FADE_IN_TIME", function() { return FADE_IN_TIME; });
__webpack_require__.d(constants_namespaceObject, "DEFAULT_UAP_ID", function() { return DEFAULT_UAP_ID; });
__webpack_require__.d(constants_namespaceObject, "DEFAULT_UAP_TYPE", function() { return DEFAULT_UAP_TYPE; });
__webpack_require__.d(constants_namespaceObject, "FAN_TAKEOVER_TYPES", function() { return FAN_TAKEOVER_TYPES; });

// EXTERNAL MODULE: external "@wikia/ad-engine"
var ad_engine_ = __webpack_require__(0);

// CONCATENATED MODULE: ./src/ad-products/utils/npa.ts

function setupNpaContext() {
  var optedOut = ad_engine_["trackingOptIn"].isOptedIn() ? 0 : 1;
  ad_engine_["context"].set('targeting.npa', optedOut.toString());
}
// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/classCallCheck"
var classCallCheck_ = __webpack_require__(3);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/createClass"
var createClass_ = __webpack_require__(1);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass_);

// CONCATENATED MODULE: ./src/ad-products/utils/navbar-manager.ts


var navbar_manager_NavbarManager =
/*#__PURE__*/
function () {
  function NavbarManager() {
    classCallCheck_default()(this, NavbarManager);
  }

  createClass_default()(NavbarManager, [{
    key: "setup",
    value: function setup(config, container) {
      if (!config.handleNavbar) {
        return;
      }

      var desktopNavbarWrapper = document.querySelector(config.desktopNavbarWrapperSelector);
      var mobileNavbarWrapper = document.querySelector(config.mobileNavbarWrapperSelector);
      var slotParent = container.parentNode;
      var sibling = document.querySelector(config.slotSibling) || container.nextElementSibling;

      if (mobileNavbarWrapper) {
        slotParent.insertBefore(mobileNavbarWrapper, sibling);
      }

      if (desktopNavbarWrapper) {
        slotParent.insertBefore(desktopNavbarWrapper, sibling);
      }
    }
  }]);

  return NavbarManager;
}();
var navbarManager = new navbar_manager_NavbarManager();
// CONCATENATED MODULE: ./src/ad-products/utils/index.ts


// EXTERNAL MODULE: ./src/ad-products/styles/styles.scss
var styles = __webpack_require__(31);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/keys"
var keys_ = __webpack_require__(11);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys_);

// CONCATENATED MODULE: ./src/ad-products/common/product-info.ts



function findSlotGroup(product) {
  var slotGroups = ad_engine_["context"].get('slotGroups');

  var result = keys_default()(slotGroups).filter(function (name) {
    return slotGroups[name].indexOf(product) !== -1;
  });

  return result.length === 1 ? result[0] : null;
}

function getGroup(product) {
  return findSlotGroup(product.toUpperCase()) || 'OTHER';
}

function getAdProductInfo(slotName, loadedTemplate, loadedProduct) {
  var product = slotName;

  if (loadedProduct === 'abcd') {
    product = 'ABCD';
  } else if (loadedProduct === 'vuap') {
    product = "UAP_".concat(loadedTemplate.toUpperCase());
  } else if (loadedProduct === 'incontent_veles') {
    product = 'OUTSTREAM';
  }

  return {
    adGroup: getGroup(product),
    adProduct: product.toLowerCase()
  };
}
// CONCATENATED MODULE: ./src/ad-products/common/index.ts

// CONCATENATED MODULE: ./src/ad-products/templates/floating-rail.ts



var adsInRail = 2;
var biggestAdSize = 600;
var availableSpace = null;
var floating_rail_FloatingRail =
/*#__PURE__*/
function () {
  createClass_default()(FloatingRail, null, [{
    key: "getName",
    value: function getName() {
      return 'floatingRail';
    }
  }, {
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        enabled: true,
        railSelector: '#rail',
        wrapperSelector: '#rail-wrapper',
        startOffset: 0
      };
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return ad_engine_["context"].get('templates.floatingRail.enabled') && ad_engine_["context"].get('state.isMobile') === false;
    }
  }]);

  function FloatingRail() {
    classCallCheck_default()(this, FloatingRail);

    this.config = ad_engine_["context"].get('templates.floatingRail');
    this.rail = document.querySelector(this.config.railSelector);
    this.railWrapper = document.querySelector(this.config.wrapperSelector);
  }

  createClass_default()(FloatingRail, [{
    key: "init",
    value: function init(params) {
      var _this = this;

      this.params = params;
      var offset = this.params.offset || 0;

      if (!this.railWrapper || !FloatingRail.isEnabled() || this.getAvailableSpace() === 0) {
        return;
      }

      var floatingSpace = Math.min(offset, this.getAvailableSpace());
      ad_engine_["scrollListener"].addCallback(function () {
        var start = _this.config.startOffset + ad_engine_["utils"].getTopOffset(_this.railWrapper);
        var end = start + floatingSpace;
        var scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

        if (scrollPosition <= start) {
          _this.rail.style.paddingTop = '';

          _this.rail.classList.add('rail-static');

          _this.rail.classList.remove('rail-fixed');
        } else if (scrollPosition >= end) {
          _this.rail.style.paddingTop = "".concat(floatingSpace, "px");

          _this.rail.classList.remove('rail-static');

          _this.rail.classList.remove('rail-fixed');
        } else {
          _this.rail.style.paddingTop = '';

          _this.rail.classList.remove('rail-static');

          _this.rail.classList.add('rail-fixed');
        }
      });
    }
  }, {
    key: "getAvailableSpace",
    value: function getAvailableSpace() {
      if (availableSpace === null) {
        var children = this.railWrapper.lastElementChild;
        var childrenHeight = children.offsetTop + children.offsetHeight;
        var space = this.railWrapper.offsetHeight;
        availableSpace = Math.max(0, space - childrenHeight - adsInRail * biggestAdSize);
      }

      return availableSpace;
    }
  }]);

  return FloatingRail;
}();
// CONCATENATED MODULE: ./src/ad-products/templates/skin.ts



var skin_Skin =
/*#__PURE__*/
function () {
  createClass_default()(Skin, null, [{
    key: "getName",
    value: function getName() {
      return 'skin';
    }
  }, {
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        bodyAdClass: 'has-background-ad',
        onInit: function onInit() {},
        wrapperSelector: '#ad-skin',
        zIndex: 1
      };
    }
  }]);

  function Skin() {
    classCallCheck_default()(this, Skin);

    this.config = ad_engine_["context"].get('templates.skin');
    this.adSkin = document.querySelector(this.config.wrapperSelector);
  }
  /**
   * Initializes the Skin unit
   *
   * @param {Object} params
   * @param {string} params.destUrl - URL to go when the background is clicked
   * @param {string} params.skinImage - URL of the 1700x800 image to show in the background
   * @param {string} params.backgroundColor - background color to use (rrggbb, without leading #)
   * @param {string} [params.middleColor] - color to use in the middle (rrggbb, without leading #)
   * @param {Array} params.pixels - URLs of tracking pixels to append when showing the skin
   */


  createClass_default()(Skin, [{
    key: "init",
    value: function init(params) {
      this.params = params;
      this.params.adProduct = 'skin';
      document.body.classList.add(this.config.bodyAdClass);
      this.setAdSkinStyle(params.skinImage, params.backgroundColor);

      this.adSkin.onclick = function () {
        window.open(params.destUrl);
      };

      if (params.pixels) {
        this.setTrackingPixels(params.pixels);
      }

      this.adSkin.classList.remove('hide');
      this.config.onInit(this.params);
    }
    /**
     * Sets styles for ad skin wrapper
     *
     * @param params
     */

  }, {
    key: "setAdSkinStyle",
    value: function setAdSkinStyle(image, color) {
      this.adSkin.style.position = 'fixed';
      this.adSkin.style.height = '100%';
      this.adSkin.style.width = '100%';
      this.adSkin.style.left = 0;
      this.adSkin.style.top = 0;
      this.adSkin.style.zIndex = this.config.zIndex;
      this.adSkin.style.cursor = 'pointer';
      this.adSkin.style.background = "url(\"".concat(image, "\") no-repeat top center #").concat(color);
    }
    /**
     * Goes through pixels array and adds 1x1 pixel images
     *
     * @param pixels
     */

  }, {
    key: "setTrackingPixels",
    value: function setTrackingPixels(pixels) {
      for (var i = 0, len = pixels.length; i < len; i += 1) {
        var pixelUrl = pixels[i];

        if (pixelUrl) {
          var pixelElement = document.createElement('img');
          pixelElement.src = pixelUrl;
          pixelElement.width = 1;
          pixelElement.height = 1;
          this.adSkin.appendChild(pixelElement);
        }
      }
    }
  }]);

  return Skin;
}();
// EXTERNAL MODULE: external "@babel/runtime-corejs2/regenerator"
var regenerator_ = __webpack_require__(2);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/asyncToGenerator"
var asyncToGenerator_ = __webpack_require__(4);
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/possibleConstructorReturn"
var possibleConstructorReturn_ = __webpack_require__(7);
var possibleConstructorReturn_default = /*#__PURE__*/__webpack_require__.n(possibleConstructorReturn_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/getPrototypeOf"
var getPrototypeOf_ = __webpack_require__(5);
var getPrototypeOf_default = /*#__PURE__*/__webpack_require__.n(getPrototypeOf_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/inherits"
var inherits_ = __webpack_require__(6);
var inherits_default = /*#__PURE__*/__webpack_require__.n(inherits_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/promise"
var promise_ = __webpack_require__(8);
var promise_default = /*#__PURE__*/__webpack_require__.n(promise_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/slicedToArray"
var slicedToArray_ = __webpack_require__(28);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/symbol"
var symbol_ = __webpack_require__(13);
var symbol_default = /*#__PURE__*/__webpack_require__.n(symbol_);

// EXTERNAL MODULE: external "lodash/isFunction"
var isFunction_ = __webpack_require__(19);
var isFunction_default = /*#__PURE__*/__webpack_require__.n(isFunction_);

// EXTERNAL MODULE: external "eventemitter3"
var external_eventemitter3_ = __webpack_require__(15);
var external_eventemitter3_default = /*#__PURE__*/__webpack_require__.n(external_eventemitter3_);

// CONCATENATED MODULE: ./src/ad-products/templates/uap/themes/hivi/stickiness.ts












var stickiness_Stickiness =
/*#__PURE__*/
function (_EventEmitter) {
  inherits_default()(Stickiness, _EventEmitter);

  function Stickiness(adSlot) {
    var _this;

    var customWhen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : promise_default.a.resolve();

    classCallCheck_default()(this, Stickiness);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Stickiness).call(this));
    _this.adSlot = adSlot;
    _this.customWhen = customWhen;
    _this.sticky = false;
    _this.isStickinessBlocked = false;
    _this.isRevertStickinessBlocked = false;

    _this.logger = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return ad_engine_["utils"].logger.apply(ad_engine_["utils"], [Stickiness.LOG_GROUP].concat(args));
    };

    if (!isFunction_default()(_this.customWhen)) {
      promise_default.a.all([_this.customWhen]).then(function () {
        if (!_this.sticky) {
          _this.logger('Blocking stickiness');

          _this.isStickinessBlocked = true;
        }
      });
    }

    return _this;
  }

  createClass_default()(Stickiness, [{
    key: "run",
    value: function () {
      var _run = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee() {
        var _this2 = this;

        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return ad_engine_["slotTweaker"].onReady(this.adSlot);

              case 2:
                if (!document.hidden) {
                  _context.next = 5;
                  break;
                }

                _context.next = 5;
                return ad_engine_["utils"].once(window, 'visibilitychange');

              case 5:
                this.adSlot.once('unstickImmediately', function () {
                  _this2.logger('Unsticking');

                  _this2.emit(Stickiness.UNSTICK_IMMEDIATELY_EVENT);

                  _this2.sticky = false;
                });

                if (!this.isStickinessBlocked) {
                  this.onAdReady();
                }

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function run() {
        return _run.apply(this, arguments);
      }

      return run;
    }()
  }, {
    key: "isSticky",
    value: function isSticky() {
      return this.sticky;
    }
  }, {
    key: "applyStickiness",
    value: function applyStickiness() {
      if (!this.sticky) {
        this.logger('Applying stickiness');
        this.sticky = true;
        this.emit(Stickiness.STICKINESS_CHANGE_EVENT, this.sticky);
      } else {
        this.logger('Stickiness is already applied');
      }
    }
  }, {
    key: "revertStickiness",
    value: function revertStickiness() {
      if (this.sticky) {
        this.logger('Reverting stickiness');
        this.sticky = false;
        this.emit(Stickiness.STICKINESS_CHANGE_EVENT, this.sticky);
      } else {
        this.logger('Stickiness is already reverted');
      }
    }
  }, {
    key: "close",
    value: function close() {
      this.logger('Closing and removing stickiness');
      this.sticky = false;
      this.emit(Stickiness.CLOSE_CLICKED_EVENT, this.sticky);
    }
  }, {
    key: "registerRevertStickiness",
    value: function () {
      var _registerRevertStickiness = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee2() {
        return regenerator_default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.logger('waiting for user interaction');
                _context2.next = 3;
                return ad_engine_["utils"].once(window, 'scroll');

              case 3:
                _context2.next = 5;
                return ad_engine_["utils"].wait();

              case 5:
                if (!this.isRevertStickinessBlocked) {
                  this.revertStickiness();
                } else {
                  this.registerRevertStickiness();
                }

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function registerRevertStickiness() {
        return _registerRevertStickiness.apply(this, arguments);
      }

      return registerRevertStickiness;
    }()
  }, {
    key: "blockRevertStickiness",
    value: function blockRevertStickiness() {
      this.isRevertStickinessBlocked = true;
    }
  }, {
    key: "unblockRevertStickiness",
    value: function unblockRevertStickiness() {
      this.isRevertStickinessBlocked = false;
    }
  }, {
    key: "onAdReady",
    value: function () {
      var _onAdReady = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee3() {
        return regenerator_default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.applyStickiness();
                this.logger('waiting for viewability and custom condition');
                _context3.next = 4;
                return promise_default.a.all([!this.adSlot.isViewed() ? ad_engine_["utils"].once(this.adSlot, ad_engine_["AdSlot"].SLOT_VIEWED_EVENT) : promise_default.a.resolve(), isFunction_default()(this.customWhen) ? this.customWhen() : this.customWhen]);

              case 4:
                this.registerRevertStickiness();

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function onAdReady() {
        return _onAdReady.apply(this, arguments);
      }

      return onAdReady;
    }()
  }]);

  return Stickiness;
}(external_eventemitter3_default.a);
stickiness_Stickiness.LOG_GROUP = 'stickiness';
stickiness_Stickiness.STICKINESS_CHANGE_EVENT = symbol_default()('stickinessChange');
stickiness_Stickiness.CLOSE_CLICKED_EVENT = symbol_default()('closeClicked');
stickiness_Stickiness.UNSTICK_IMMEDIATELY_EVENT = symbol_default()('unstickImmediately');
stickiness_Stickiness.SLOT_STICKED_STATE = 'sticked';
stickiness_Stickiness.SLOT_UNSTICKED_STATE = 'unsticked';
stickiness_Stickiness.SLOT_STICKY_READY_STATE = 'sticky-ready';
stickiness_Stickiness.SLOT_UNSTICK_IMMEDIATELY = 'force-unstick';
stickiness_Stickiness.SLOT_STICKINESS_DISABLED = 'stickiness-disabled';
// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/toConsumableArray"
var toConsumableArray_ = __webpack_require__(12);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/get"
var get_ = __webpack_require__(10);
var get_default = /*#__PURE__*/__webpack_require__.n(get_);

// CONCATENATED MODULE: ./src/ad-products/templates/interface/ui-component.ts



var ui_component_UiComponent =
/*#__PURE__*/
function () {
  createClass_default()(UiComponent, [{
    key: "classNames",
    get: function get() {
      return this.props.classNames || [];
    }
  }]);

  function UiComponent() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    classCallCheck_default()(this, UiComponent);

    this.props = props;
  }

  createClass_default()(UiComponent, [{
    key: "render",
    value: function render() {
      return document.createDocumentFragment();
    }
  }]);

  return UiComponent;
}();


// CONCATENATED MODULE: ./src/ad-products/templates/interface/button.ts









var button_Button =
/*#__PURE__*/
function (_UiComponent) {
  inherits_default()(Button, _UiComponent);

  function Button() {
    classCallCheck_default()(this, Button);

    return possibleConstructorReturn_default()(this, getPrototypeOf_default()(Button).apply(this, arguments));
  }

  createClass_default()(Button, [{
    key: "render",
    value: function render() {
      var _this = this;

      var buttonElement = document.createElement('button');
      this.classNames.forEach(function (className) {
        return buttonElement.classList.add(className);
      });
      buttonElement.addEventListener('click', function (event) {
        return _this.onClick(event);
      });
      return buttonElement;
    }
  }, {
    key: "onClick",
    value: function onClick(event) {
      var onClick = this.props.onClick;

      if (typeof onClick === 'function') {
        return onClick(event);
      }

      return undefined;
    }
  }, {
    key: "classNames",
    get: function get() {
      return ['button-control'].concat(toConsumableArray_default()(get_default()(getPrototypeOf_default()(Button.prototype), "classNames", this)));
    }
  }]);

  return Button;
}(ui_component_UiComponent);


// EXTERNAL MODULE: ./src/ad-products/templates/interface/icons.json
var icons = __webpack_require__(16);
var icons_default = /*#__PURE__*/__webpack_require__.n(icons);

// CONCATENATED MODULE: ./src/ad-products/templates/interface/icons.ts


var parser = new window.DOMParser();
function createIcon(iconName) {
  var classNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (icons_default.a[iconName]) {
    var element = parser.parseFromString(icons_default.a[iconName], 'image/svg+xml').documentElement; // IE 11 doesn't support classList nor className on SVG elements

    element.setAttribute('class', classNames.join(' '));
    return element;
  }

  return null;
}
var icons_icons = keys_default()(icons_default.a).reduce(function (map, name) {
  map[name] = name;
  return map;
}, {});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/close-button.ts











var close_button_CloseButton =
/*#__PURE__*/
function (_UiComponent) {
  inherits_default()(CloseButton, _UiComponent);

  function CloseButton() {
    classCallCheck_default()(this, CloseButton);

    return possibleConstructorReturn_default()(this, getPrototypeOf_default()(CloseButton).apply(this, arguments));
  }

  createClass_default()(CloseButton, [{
    key: "render",
    value: function render() {
      var onClick = this.props.onClick;
      var classNames = this.classNames;
      var button = new button_Button({
        onClick: onClick,
        classNames: classNames
      }).render();
      var closeIcon = createIcon(icons_icons.CROSS, ['icon']);
      button.appendChild(closeIcon);
      return button;
    }
  }, {
    key: "classNames",
    get: function get() {
      return ['button-close'].concat(toConsumableArray_default()(get_default()(getPrototypeOf_default()(CloseButton.prototype), "classNames", this)));
    }
  }]);

  return CloseButton;
}(ui_component_UiComponent);


// CONCATENATED MODULE: ./src/ad-products/templates/sticky-base.ts









var logGroup = 'sticky-base';
/**
 * @abstract
 */

var sticky_base_StickyBase =
/*#__PURE__*/
function () {
  /**
   * Base class for sticky ads
   * @param {AdSlot} adSlot
   */
  function StickyBase(adSlot) {
    classCallCheck_default()(this, StickyBase);

    this.adSlot = adSlot;
    this.container = this.adSlot.getElement();
    this.lineId = adSlot.lineItemId.toString() || '';
    this.lines = ad_engine_["context"].get("templates.".concat(this.getName(), ".lineItemIds")) || [];
    this.stickiness = null;
    this.config = ad_engine_["context"].get("templates.".concat(this.getName()));
  }
  /**
   * @protected
   */


  createClass_default()(StickyBase, [{
    key: "setupStickiness",
    value: function setupStickiness(params) {
      var _this = this;

      this.params = params;
      this.adSlot.setConfigProperty('useGptOnloadEvent', true);
      this.adSlot.onLoad().then(function () {
        ad_engine_["utils"].logger(logGroup, _this.adSlot.getSlotName(), 'slot ready for stickiness');

        _this.adSlot.emitEvent(stickiness_Stickiness.SLOT_STICKY_READY_STATE);
      });
      this.addStickinessPlugin();
    }
    /**
     * @abstract
     * @protected
     */

  }, {
    key: "addStickinessPlugin",
    value: function addStickinessPlugin() {
      throw new ad_engine_["utils"].NotImplementedException();
    }
    /**
     * @protected
     */

  }, {
    key: "isEnabled",
    value: function isEnabled() {
      var isEnabledInContext = ad_engine_["context"].get("templates.".concat(this.getName(), ".enabled"));
      var isEnabled = isEnabledInContext && this.isLineAndGeo();

      if (isEnabled) {
        ad_engine_["utils"].logger(logGroup, "enabled with line item id ".concat(this.lineId));
      }

      return isEnabled;
    }
    /**
     * Returns template name.
     * @abstract
     * @protected
     * @return {string}
     */

  }, {
    key: "getName",
    value: function getName() {
      throw new ad_engine_["utils"].NotImplementedException();
    }
    /**
     * @private
     */

  }, {
    key: "isLineAndGeo",
    value: function isLineAndGeo() {
      var _this2 = this;

      var found = this.lines.some(function (line) {
        var _line$split = line.split(':', 2),
            _line$split2 = slicedToArray_default()(_line$split, 2),
            lineId = _line$split2[0],
            geo = _line$split2[1];

        return lineId === _this2.lineId && (!geo || ad_engine_["utils"].isProperGeo([geo]));
      });

      if (found) {
        ad_engine_["utils"].logger(logGroup, "line item ".concat(this.lineId, " enabled in geo"));
      }

      return found;
    }
    /**
     * Runs logic which decides when to unstick the template.
     * @protected
     */

  }, {
    key: "addUnstickLogic",
    value: function addUnstickLogic() {
      var _this3 = this;

      var _this$config = this.config,
          stickyAdditionalTime = _this$config.stickyAdditionalTime,
          stickyUntilSlotViewed = _this$config.stickyUntilSlotViewed;

      var whenSlotViewedOrTimeout =
      /*#__PURE__*/
      function () {
        var _ref = asyncToGenerator_default()(
        /*#__PURE__*/
        regenerator_default.a.mark(function _callee() {
          return regenerator_default.a.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return stickyUntilSlotViewed && !_this3.adSlot.isViewed() ? ad_engine_["utils"].once(_this3.adSlot, ad_engine_["AdSlot"].SLOT_VIEWED_EVENT) : promise_default.a.resolve();

                case 2:
                  _context.next = 4;
                  return ad_engine_["utils"].wait(StickyBase.DEFAULT_UNSTICK_DELAY + stickyAdditionalTime);

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function whenSlotViewedOrTimeout() {
          return _ref.apply(this, arguments);
        };
      }();

      this.stickiness = new stickiness_Stickiness(this.adSlot, whenSlotViewedOrTimeout());
    }
    /**
     * @protected
     */

  }, {
    key: "addButton",
    value: function addButton(rootElement, cb) {
      this.button = new close_button_CloseButton({
        classNames: ['button-unstick'],
        onClick: cb
      }).render();
      rootElement.appendChild(this.button);
    }
    /**
     * @protected
     */

  }, {
    key: "removeButton",
    value: function removeButton() {
      this.button.remove();
    }
    /**
     * @protected
     */

  }, {
    key: "addUnstickEvents",
    value: function addUnstickEvents() {
      var _this4 = this;

      this.stickiness.on(stickiness_Stickiness.STICKINESS_CHANGE_EVENT, function (isSticky) {
        return _this4.onStickinessChange(isSticky);
      });
      this.stickiness.on(stickiness_Stickiness.CLOSE_CLICKED_EVENT, function () {
        return _this4.unstickImmediately();
      });
      this.stickiness.on(stickiness_Stickiness.UNSTICK_IMMEDIATELY_EVENT, function () {
        return _this4.unstickImmediately();
      });
    }
    /**
     * @abstract
     * @protected
     */

  }, {
    key: "onStickinessChange",
    value: function onStickinessChange(isSticky) {
      throw new ad_engine_["utils"].NotImplementedException({
        isSticky: isSticky
      });
    }
    /**
     * @abstract
     * @protected
     */

  }, {
    key: "unstickImmediately",
    value: function unstickImmediately() {
      throw new ad_engine_["utils"].NotImplementedException();
    }
  }]);

  return StickyBase;
}();
sticky_base_StickyBase.DEFAULT_UNSTICK_DELAY = 2000;
// CONCATENATED MODULE: ./src/ad-products/templates/uap/constants.ts
var CSS_CLASSNAME_FADE_IN_ANIMATION = 'fade-in';
var CSS_CLASSNAME_SLIDE_OUT_ANIMATION = 'slide-out';
var CSS_CLASSNAME_STICKY_BFAA = 'sticky-bfaa';
var CSS_CLASSNAME_STICKY_BFAB = 'sticky-bfab';
var CSS_CLASSNAME_STICKY_SLOT = 'sticky-slot';
var CSS_CLASSNAME_STICKY_TEMPLATE = 'sticky-template';
var CSS_TIMING_EASE_IN_CUBIC = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
var CSS_CLASSNAME_STICKY_IAB = 'sticky-iab'; // Animation time is defined also in CSS, remember to change it in both places

var SLIDE_OUT_TIME = 600;
var FADE_IN_TIME = 400;
var DEFAULT_UAP_ID = 'none';
var DEFAULT_UAP_TYPE = 'none';
var FAN_TAKEOVER_TYPES = ['uap', 'vuap'];
// CONCATENATED MODULE: ./src/ad-products/templates/interface/animate.ts



function animate(_x, _x2, _x3) {
  return _animate.apply(this, arguments);
}

function _animate() {
  _animate = asyncToGenerator_default()(
  /*#__PURE__*/
  regenerator_default.a.mark(function _callee(container, className, duration) {
    return regenerator_default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            container.style.animationDuration = "".concat(duration, "ms");
            container.classList.add(className);
            _context.next = 4;
            return ad_engine_["utils"].wait(duration);

          case 4:
            container.classList.remove(className);
            container.style.animationDuration = '';

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _animate.apply(this, arguments);
}
// CONCATENATED MODULE: ./src/ad-products/templates/sticky-ad.ts












var sticky_ad_logGroup = 'sticky-ad';
var sticky_ad_StickyAd =
/*#__PURE__*/
function (_StickyBase) {
  inherits_default()(StickyAd, _StickyBase);

  createClass_default()(StickyAd, [{
    key: "containerDiv",

    /**
     * @private
     */
    get: function get() {
      return this.container.querySelector('div');
    }
  }], [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        enabled: true,
        stickyAdditionalTime: 0,
        stickyUntilSlotViewed: true,
        handleNavbar: true,
        navbarWrapperSelector: 'body > nav.navigation',
        smartBannerSelector: null,
        slotsIgnoringNavbar: []
      };
    }
  }, {
    key: "getName",
    value: function getName() {
      return 'stickyAd';
    }
  }]);

  function StickyAd(adSlot) {
    var _this;

    classCallCheck_default()(this, StickyAd);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(StickyAd).call(this, adSlot));
    _this.scrollListener = null;
    _this.topOffset = 0;
    _this.leftOffset = 0;
    return _this;
  }

  createClass_default()(StickyAd, [{
    key: "init",
    value: function init(params) {
      var _this2 = this;

      if (!this.isEnabled()) {
        ad_engine_["utils"].logger(sticky_ad_logGroup, 'stickiness rejected');
        this.adSlot.emitEvent(stickiness_Stickiness.SLOT_STICKINESS_DISABLED);
        return;
      }

      this.setupStickiness(params);
      this.setTopOffset();
      this.setLeftOffset();
      this.setupScrollListener();
      window.addEventListener('resize', function () {
        return _this2.setLeftOffset();
      });
    }
    /**
     * @private
     */

  }, {
    key: "setTopOffset",
    value: function setTopOffset() {
      if (this.config.handleNavbar && this.config.slotsIgnoringNavbar.indexOf(this.adSlot.getSlotName()) === -1) {
        var navbarElement = document.querySelector(this.config.navbarWrapperSelector);
        this.topOffset = navbarElement ? navbarElement.offsetHeight : 0;

        if (this.config.smartBannerSelector) {
          var smartBannerElement = document.querySelector(this.config.smartBannerSelector);
          this.topOffset += smartBannerElement ? smartBannerElement.offsetHeight : 0;
        }
      }
    }
    /**
     * @private
     */

  }, {
    key: "setLeftOffset",
    value: function setLeftOffset() {
      this.leftOffset = ad_engine_["utils"].getLeftOffset(this.containerDiv.firstChild);
    }
    /**
     * @private
     */

  }, {
    key: "setupScrollListener",
    value: function setupScrollListener() {
      var _this3 = this;

      var startOffset = ad_engine_["utils"].getTopOffset(this.containerDiv) - this.topOffset;
      this.scrollListener = ad_engine_["scrollListener"].addCallback(function () {
        var scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

        if (scrollPosition >= startOffset) {
          _this3.stickiness.run();

          ad_engine_["utils"].logger(sticky_ad_logGroup, _this3.adSlot.getSlotName(), 'stickiness added');
          ad_engine_["scrollListener"].removeCallback(_this3.scrollListener);
        }
      });
    }
    /**
     * @protected
     */

  }, {
    key: "onStickinessChange",
    value: function () {
      var _onStickinessChange = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee(isSticky) {
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!isSticky) {
                  _context.next = 4;
                  break;
                }

                this.onStick();
                _context.next = 6;
                break;

              case 4:
                _context.next = 6;
                return this.onUnstick();

              case 6:
                ad_engine_["utils"].logger(sticky_ad_logGroup, 'stickiness changed', isSticky);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onStickinessChange(_x) {
        return _onStickinessChange.apply(this, arguments);
      }

      return onStickinessChange;
    }()
    /**
     * @protected
     */

  }, {
    key: "onUnstick",
    value: function () {
      var _onUnstick = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee2() {
        return regenerator_default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.adSlot.emitEvent(stickiness_Stickiness.SLOT_UNSTICKED_STATE);
                _context2.next = 3;
                return animate(this.containerDiv, CSS_CLASSNAME_SLIDE_OUT_ANIMATION, SLIDE_OUT_TIME);

              case 3:
                this.removeStickyParameters();
                animate(this.containerDiv, CSS_CLASSNAME_FADE_IN_ANIMATION, FADE_IN_TIME);
                this.removeUnstickButton();

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function onUnstick() {
        return _onUnstick.apply(this, arguments);
      }

      return onUnstick;
    }()
    /**
     * @private
     */

  }, {
    key: "removeStickyParameters",
    value: function removeStickyParameters() {
      this.container.classList.remove(CSS_CLASSNAME_STICKY_SLOT);
      this.container.style.height = null;
      this.containerDiv.style.top = null;
      this.containerDiv.style.left = null;
    }
    /**
     * @protected
     */

  }, {
    key: "onStick",
    value: function onStick() {
      this.adSlot.emitEvent(stickiness_Stickiness.SLOT_STICKED_STATE);
      this.container.classList.add(CSS_CLASSNAME_STICKY_SLOT);
      this.container.style.height = "".concat(this.containerDiv.offsetHeight, "px");
      this.containerDiv.style.top = "".concat(this.topOffset, "px");
      this.containerDiv.style.left = "".concat(this.leftOffset, "px");
      this.addUnstickButton();
    }
    /**
     * @protected
     */

  }, {
    key: "unstickImmediately",
    value: function unstickImmediately() {
      if (this.stickiness) {
        this.removeStickyParameters();
        this.stickiness.sticky = false;
        this.removeUnstickButton();
        ad_engine_["utils"].logger(sticky_ad_logGroup, 'unstick immediately');
      }
    }
    /**
     * @protected
     */

  }, {
    key: "addStickinessPlugin",
    value: function addStickinessPlugin() {
      this.container.classList.add(CSS_CLASSNAME_STICKY_TEMPLATE);
      this.addUnstickLogic();
      this.addUnstickEvents();
    }
    /**
     * @private
     */

  }, {
    key: "addUnstickButton",
    value: function addUnstickButton() {
      var _this4 = this;

      this.addButton(this.adSlot.getElement().querySelector('div'), function () {
        _this4.adSlot.emitEvent(stickiness_Stickiness.SLOT_UNSTICK_IMMEDIATELY);

        _this4.stickiness.close();
      });
    }
    /**
     * @private
     */

  }, {
    key: "removeUnstickButton",
    value: function removeUnstickButton() {
      this.removeButton();
    }
    /**
     * Returns template name.
     * @protected
     * @return {string}
     */

  }, {
    key: "getName",
    value: function getName() {
      return StickyAd.getName();
    }
  }]);

  return StickyAd;
}(sticky_base_StickyBase);
// CONCATENATED MODULE: ./src/ad-products/common/translations.ts
var TRANSLATIONS = {
  labels: {
    en: {
      advertisement: 'Advertisement',
      'learn-more': 'Learn More'
    },
    ar: {
      advertisement: 'إعلان'
    },
    bn: {
      advertisement: 'বিজ্ঞাপন'
    },
    br: {
      advertisement: 'Bomm bruderezh'
    },
    ca: {
      advertisement: 'Anunci'
    },
    cs: {
      advertisement: 'Reklama'
    },
    de: {
      advertisement: 'Anzeige',
      'learn-more': 'Erfahre mehr'
    },
    es: {
      advertisement: 'Anuncio',
      'learn-more': 'Conoce más'
    },
    eu: {
      advertisement: 'Iragarkia'
    },
    fa: {
      advertisement: 'تبلیغات'
    },
    fo: {
      advertisement: 'Lýsing'
    },
    fr: {
      advertisement: 'Publicité',
      'learn-more': 'En savoir plus'
    },
    fy: {
      advertisement: 'Advertinsje'
    },
    gl: {
      advertisement: 'Anuncio'
    },
    gv: {
      advertisement: 'Soilsheen'
    },
    he: {
      advertisement: 'פרסומת'
    },
    hu: {
      advertisement: 'Hirdetés'
    },
    id: {
      advertisement: 'Iklan',
      'learn-more': 'Baca Selengkapnya'
    },
    inh: {
      advertisement: 'дебат'
    },
    it: {
      advertisement: 'Pubblicità',
      'learn-more': 'Ulteriori informazioni'
    },
    ja: {
      advertisement: '広告',
      'learn-more': 'もっと見る'
    },
    ko: {
      advertisement: '광고'
    },
    krc: {
      advertisement: 'Pеклама'
    },
    lb: {
      advertisement: 'Reklamm'
    },
    mk: {
      advertisement: 'Pеклама'
    },
    mr: {
      advertisement: 'जाहिरात'
    },
    ms: {
      advertisement: 'Iklan'
    },
    nl: {
      advertisement: 'Advertentie',
      'learn-more': 'Meer te weten komen'
    },
    no: {
      advertisement: 'Reklame'
    },
    pl: {
      advertisement: 'Reklama',
      'learn-more': 'Czytaj więcej'
    },
    ps: {
      advertisement: 'خبرتيا'
    },
    pt: {
      advertisement: 'Anúncio',
      'learn-more': 'Saiba Mais'
    },
    'roa-tara': {
      advertisement: 'Pubblecetà'
    },
    ru: {
      advertisement: 'Pеклама',
      'learn-more': 'Узнать больше'
    },
    si: {
      advertisement: 'ප්‍රචාරක දැන්වීම'
    },
    sl: {
      advertisement: 'Oglas'
    },
    'sr-ec': {
      advertisement: 'Pеклама'
    },
    sv: {
      advertisement: 'Annons'
    },
    te: {
      advertisement: 'వాణిజ్య ప్రకటన'
    },
    th: {
      advertisement: 'การโฆษณา'
    },
    tr: {
      advertisement: 'Reklam'
    },
    'tt-cyrl': {
      advertisement: 'Pеклама'
    },
    uk: {
      advertisement: 'Pеклама'
    },
    vi: {
      advertisement: 'Quảng cáo'
    },
    'zh-hans': {
      advertisement: '广告',
      'learn-more': '了解更多'
    },
    'zh-hant': {
      advertisement: '廣告',
      'learn-more': '閱讀更多'
    }
  }
};
// CONCATENATED MODULE: ./src/ad-products/common/i18n.ts


var defaultLanguage = 'en';
function getTranslation(category, key) {
  var lang = ad_engine_["context"].get('options.contentLanguage');
  var language = lang && typeof TRANSLATIONS[category][lang] !== 'undefined' ? lang : defaultLanguage;
  return TRANSLATIONS[category][language][key] || TRANSLATIONS[category][defaultLanguage][key];
}
// CONCATENATED MODULE: ./src/ad-products/templates/interface/advertisement-label.ts








var advertisement_label_AdvertisementLabel =
/*#__PURE__*/
function (_UiComponent) {
  inherits_default()(AdvertisementLabel, _UiComponent);

  function AdvertisementLabel() {
    classCallCheck_default()(this, AdvertisementLabel);

    return possibleConstructorReturn_default()(this, getPrototypeOf_default()(AdvertisementLabel).apply(this, arguments));
  }

  createClass_default()(AdvertisementLabel, [{
    key: "render",
    value: function render() {
      var label = document.createElement('div');
      label.innerText = getTranslation('labels', 'advertisement');
      label.className = 'advertisement-label';
      return label;
    }
  }]);

  return AdvertisementLabel;
}(ui_component_UiComponent);


// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/array/is-array"
var is_array_ = __webpack_require__(27);
var is_array_default = /*#__PURE__*/__webpack_require__.n(is_array_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/objectSpread"
var objectSpread_ = __webpack_require__(26);
var objectSpread_default = /*#__PURE__*/__webpack_require__.n(objectSpread_);

// EXTERNAL MODULE: external "lodash/throttle"
var throttle_ = __webpack_require__(18);
var throttle_default = /*#__PURE__*/__webpack_require__.n(throttle_);

// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/close-button.ts
function add(video, container) {
  var closeButton = document.createElement('div');
  closeButton.classList.add('close-ad');
  closeButton.addEventListener('click', function (event) {
    video.stop();
    event.preventDefault();
  });
  container.appendChild(closeButton);
}

/* harmony default export */ var close_button = ({
  add: add
});
// CONCATENATED MODULE: ./src/ad-products/templates/outstream/porvata-template.ts






var DEFAULT_VIDEO_ASPECT_RATIO = 640 / 360;
var IMA_VPAID_INSECURE_MODE = 2;
var porvata_template_PorvataTemplate =
/*#__PURE__*/
function () {
  createClass_default()(PorvataTemplate, null, [{
    key: "getName",
    value: function getName() {
      return 'porvata3';
    }
  }, {
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        isFloatingEnabled: true,
        inViewportOffsetTop: 0,
        inViewportOffsetBottom: 0,
        onInit: function onInit() {}
      };
    }
  }]);

  function PorvataTemplate(adSlot) {
    classCallCheck_default()(this, PorvataTemplate);

    this.adSlot = adSlot;
    this.config = ad_engine_["context"].get('templates.porvata3');
  }

  createClass_default()(PorvataTemplate, [{
    key: "init",
    value: function init(params) {
      var _this = this;

      var slotName = this.adSlot.getSlotName();

      if (!this.adSlot.getElement().classList.contains('ad-slot')) {
        this.adSlot.getElement().classList.add('ad-slot');
      }

      this.adSlot.getElement().classList.add('porvata3');
      this.adSlot.getElement().setAttribute('data-label', getTranslation('labels', 'advertisement'));
      this.isInsecureMode = params.vpaidMode === IMA_VPAID_INSECURE_MODE;

      if (!ad_engine_["Porvata"].isVideoAutoplaySupported()) {
        return this.adSlot.collapse();
      }

      params.viewportHookElement = this.adSlot.getElement();

      if (this.isInsecureMode) {
        params.originalContainer = params.container;
        params.container = this.createVideoContainer(slotName);
      }

      ad_engine_["slotTweaker"].collapse(this.adSlot);
      this.config.onInit(this.adSlot, params, this.config);
      return ad_engine_["slotTweaker"].makeResponsive(this.adSlot, DEFAULT_VIDEO_ASPECT_RATIO).then(function () {
        return ad_engine_["Porvata"].inject(params).then(function (video) {
          return _this.onReady(video, params);
        });
      });
    }
  }, {
    key: "onReady",
    value: function onReady(video, params) {
      var slotElement = this.adSlot.getElement();
      var template = selectTemplate(video.videoSettings);
      var videoContainer = params.container;

      if (this.isInsecureMode) {
        this.adjustVpaidPlayer(video, videoContainer);
      }

      slotElement.classList.add('porvata-outstream');
      video.addEventListener('loaded', function () {
        video.container.classList.remove('hide');
      });
      window.addEventListener('resize', function () {
        if (!video.isFloating) {
          var slotWidth = slotElement.clientWidth;
          video.resize(slotWidth, slotWidth / DEFAULT_VIDEO_ASPECT_RATIO);
        }
      });
      this.handleSlotStatus(video);
      ad_engine_["events"].once(ad_engine_["events"].PAGE_CHANGE_EVENT, function () {
        video.destroy();
      });
      setup(video, template, {
        container: videoContainer,
        inViewportOffsetTop: this.config.inViewportOffsetTop,
        inViewportOffsetBottom: this.config.inViewportOffsetBottom,
        isFloatingEnabled: this.config.isFloatingEnabled && params.enableInContentFloating,
        slotName: params.slotName
      });
      return video;
    }
  }, {
    key: "handleSlotStatus",
    value: function handleSlotStatus(video) {
      var _this2 = this;

      var resolveStatus = null;
      var statusPromise = new promise_default.a(function (resolve) {
        resolveStatus = resolve;
      });
      video.addEventListener('wikiaAdsManagerLoaded', function () {
        _this2.adSlot.success();

        resolveStatus();
      });
      video.addEventListener('wikiaFirstTimeInViewport', function () {
        statusPromise.then(function () {
          var eventSuffix = _this2.adSlot.getStatus() === ad_engine_["AdSlot"].STATUS_SUCCESS ? 'WithOffer' : 'WithoutOffer';
          video.ima.dispatchEvent("wikiaInViewport".concat(eventSuffix));
        });
      });
      video.addEventListener('wikiaEmptyAd', function () {
        _this2.adSlot.collapse();

        resolveStatus();
      });
    }
  }, {
    key: "adjustVpaidPlayer",
    value: function adjustVpaidPlayer(video, container) {
      var videoPlayer = container.querySelector('.video-player');
      video.addEventListener('loaded', function () {
        var ad = video.ima.getAdsManager().getCurrentAd();

        if (ad && ad_engine_["Porvata"].isVpaid(ad.getContentType() || '')) {
          container.classList.add('vpaid-enabled');
          videoPlayer.classList.remove('hide');
        }
      });
      video.addEventListener('allAdsCompleted', function () {
        container.classList.add('hide');
      });
    }
  }, {
    key: "createVideoContainer",
    value: function createVideoContainer() {
      var container = document.createElement('div');
      var displayWrapper = document.createElement('div');
      container.classList.add('video-overlay');
      displayWrapper.classList.add('video-display-wrapper');
      container.appendChild(displayWrapper);
      this.adSlot.getElement().appendChild(container);
      return displayWrapper;
    }
  }]);

  return PorvataTemplate;
}();
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/dynamic-reveal.ts


/**
 * Add UI animations that expands once video ad starts and collapses the slot once video ad finishes
 * @param video Porvata video element
 * @param container Video container
 * @param params videoSettings parameters
 */

function dynamic_reveal_add(video, container, params) {
  var slot = ad_engine_["slotService"].get(params.slotName);
  var slotExpanded = false;
  video.addEventListener('loaded', function () {
    if (!slotExpanded) {
      ad_engine_["slotTweaker"].expand(slot);
      slotExpanded = true; // Delay dispatching event so it's run after browser really finish expanding the slot
      // Value 1000ms is related to animation defined in _porvata.scss file

      setTimeout(function () {
        video.ima.dispatchEvent('wikiaSlotExpanded');
      }, 1000);
    }

    if (!video.isFloating) {
      var slotWidth = slot.getElement().scrollWidth;
      video.resize(slotWidth, slotWidth / DEFAULT_VIDEO_ASPECT_RATIO);
    }
  });
  video.addEventListener('allAdsCompleted', function () {
    ad_engine_["slotTweaker"].collapse(slot);
    video.ima.dispatchEvent('wikiaSlotCollapsed');
  });
}

/* harmony default export */ var dynamic_reveal = ({
  add: dynamic_reveal_add
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/floating.ts



var FLOATING_CLASS_NAME = 'outstream-floating';
/**
 * Makes the video element floating once main container is out of viewport
 * @param video Porvata video element
 * @param container Video container
 * @param params videoSettings parameters
 */

function floating_add(video, container, params) {
  if (!params.isFloatingEnabled) {
    return;
  }

  var slotElement = ad_engine_["slotService"].get(params.slotName).getElement();
  var videoOverlay = slotElement.querySelector('.video-overlay');
  var videoWrapper = slotElement.querySelector('.video-display-wrapper');
  video.addEventListener('wikiaSlotExpanded', function () {
    var observer = ad_engine_["utils"].viewportObserver.addListener(videoOverlay, function (inViewport) {
      if (inViewport) {
        slotElement.classList.remove(FLOATING_CLASS_NAME);
      } else {
        slotElement.classList.add(FLOATING_CLASS_NAME);
      }

      video.isFloating = !inViewport;
      var width = videoWrapper.offsetWidth;
      video.resize(width, width / DEFAULT_VIDEO_ASPECT_RATIO);
    }, {
      offsetTop: params.inViewportOffsetTop,
      offsetBottom: params.inViewportOffsetBottom,
      areaThreshold: 1
    });

    var disableFloating = function disableFloating() {
      video.isFloating = false;
      slotElement.classList.remove(FLOATING_CLASS_NAME);
      ad_engine_["utils"].viewportObserver.removeListener(observer);
      var width = videoWrapper.offsetWidth;
      video.resize(width, width / DEFAULT_VIDEO_ASPECT_RATIO);
    };

    var closeButton = new close_button_CloseButton({
      onClick: disableFloating
    });
    videoWrapper.appendChild(closeButton.render());
    video.addEventListener('wikiaAdCompleted', disableFloating);
  });
}

/* harmony default export */ var floating = ({
  add: floating_add
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/learn-more.ts



function learn_more_add(video, container, params) {
  var learnMore = document.createElement('div');
  var icon = createIcon(icons_icons.LEARN_MORE, ['learn-more-icon', 'porvata-icon']);
  var label = document.createElement('div');
  label.innerText = getTranslation('labels', 'learn-more');
  learnMore.appendChild(label);
  learnMore.appendChild(icon);
  learnMore.classList.add('learn-more');
  learnMore.addEventListener('click', function () {
    top.open(params.clickThroughURL, '_blank');
  });
  container.appendChild(learnMore);
}

/* harmony default export */ var learn_more = ({
  add: learn_more_add
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/pause-control.ts


function pause_control_add(video, container) {
  var pauseButton = document.createElement('div');
  var pauseIcon = createIcon(icons_icons.PAUSE, ['play-off-icon', 'porvata-icon', 'porvata-off-icon']);
  var playIcon = createIcon(icons_icons.PLAY, ['play-on-icon', 'porvata-icon', 'porvata-on-icon']);
  pauseButton.appendChild(playIcon);
  pauseButton.appendChild(pauseIcon);
  pauseButton.className = 'play-pause-button porvata-switchable-icon';
  pauseButton.addEventListener('click', function () {
    if (video.isPaused()) {
      video.resume();
    } else {
      video.pause();
    }
  });
  video.addEventListener('pause', function () {
    pauseButton.classList.remove('is-on');
  });
  video.addEventListener('resume', function () {
    pauseButton.classList.add('is-on');
  });
  video.addEventListener('start', function () {
    pauseButton.classList.add('is-on');
  });
  container.appendChild(pauseButton);
}

/* harmony default export */ var pause_control = ({
  add: pause_control_add
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/pause-overlay.ts
function pause_overlay_add(video, container) {
  var overlay = document.createElement('div');
  overlay.classList.add('pause-overlay');
  overlay.addEventListener('click', function () {
    if (video.isPaused()) {
      video.resume();
    } else {
      video.pause();
    }
  });
  container.appendChild(overlay);
}

/* harmony default export */ var pause_overlay = ({
  add: pause_overlay_add
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/progress-bar.ts


function progress_bar_add(video, container) {
  var progressBar = document.createElement('div');
  var currentTime = document.createElement('div');
  progressBar.classList.add('progress-bar');
  currentTime.classList.add('current-time');
  progressBar.appendChild(currentTime);

  progressBar.pause = function () {
    currentTime.style.width = "".concat(currentTime.offsetWidth / progressBar.offsetWidth * 100, "%");
  };

  progressBar.reset = function () {
    currentTime.style.transitionDuration = '';
    currentTime.style.width = '0';
  };

  progressBar.rewind = function () {
    var remainingTime = currentTime.style.transitionDuration;
    progressBar.reset();
    ad_engine_["slotTweaker"].forceRepaint(currentTime);
    currentTime.style.transitionDuration = remainingTime;
  };

  progressBar.start = function () {
    var remainingTime = video.getRemainingTime();

    if (remainingTime) {
      if (remainingTime > 0) {
        currentTime.style.transitionDuration = "".concat(remainingTime, "s");
      }

      ad_engine_["slotTweaker"].forceRepaint(currentTime);
      currentTime.style.width = '100%';
    } else {
      currentTime.style.width = '0';
    }
  };

  video.addEventListener('wikiaAdPlay', progressBar.start);
  video.addEventListener('wikiaAdCompleted', progressBar.reset);
  video.addEventListener('wikiaAdRestart', progressBar.rewind);
  video.addEventListener('wikiaAdPause', progressBar.pause);
  container.appendChild(progressBar);
}

/* harmony default export */ var progress_bar = ({
  add: progress_bar_add
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/replay-overlay.ts

var replayOverlayClass = 'replay-overlay';

function replay_overlay_add(video, container, params) {
  var overlay = document.createElement('div');
  overlay.classList.add(replayOverlayClass);
  overlay.addEventListener('click', function () {
    return video.play();
  });

  if (!params.autoPlay) {
    showOverlay(overlay, params);
  }

  video.addEventListener('wikiaAdCompleted', function () {
    showOverlay(overlay, params);
  });

  if (video.params.theme && video.params.theme === 'hivi') {
    var replayIcon = addReplayIcon(overlay);

    if (!params.autoPlay) {
      var playIcon = addPlayIcon(overlay);
      replayIcon.style.display = 'none';
      video.addEventListener('start', function () {
        replayIcon.style.display = '';
        playIcon.style.display = 'none';
      });
    }

    container = video.params.thumbnail;
    container.appendChild(overlay);
  } else {
    container.parentElement.insertBefore(overlay, container);
  }
}

function showOverlay(overlay, params) {
  if (!params.container.classList.contains('theme-hivi')) {
    overlay.style.width = overlay.style.width || getOverlayWidth(params);
  } // make overlay visible after ad finishes


  overlay.style.display = 'block';
}
/**
 * Basing on video width and total ad width compute width (in %)
 * of overlay to make it responsive.
 *
 * offsetWidth won't work in case video container is hidden.
 * @param params
 * @return string in form '55%'
 */


function getOverlayWidth(params) {
  var adWidth = params.container.offsetWidth;
  var videoWidth = params.hideWhenPlaying.offsetWidth;
  return "".concat(100 * videoWidth / adWidth, "%");
}

function addReplayIcon(overlay) {
  var replayIcon = createIcon(icons_icons.REPLAY, ['replay-icon', 'overlay-icon']);
  overlay.appendChild(replayIcon);
  return replayIcon;
}

function addPlayIcon(overlay) {
  var playIcon = createIcon(icons_icons.PLAY, ['play-icon', 'overlay-icon']);
  overlay.appendChild(playIcon);
  return playIcon;
}

/* harmony default export */ var replay_overlay = ({
  add: replay_overlay_add
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/toggle-animation.ts
var toggle_animation_duration = 400;
var onAnimationClassName = 'on-animation';

function resizeContainer(container, finalAspectRatio) {
  container.style.height = "".concat(container.offsetHeight, "px");
  container.style.height = "".concat(container.offsetWidth / finalAspectRatio, "px");
  setTimeout(function () {
    container.style.height = '';
  }, toggle_animation_duration);
}

function toggle(elementToShow, elementToHide) {
  elementToHide.classList.add('hide');
  elementToShow.classList.remove('hide');
}

function hideVideo(video, params) {
  resizeContainer(params.container, params.aspectRatio);
  setTimeout(function () {
    toggle(params.image, video.container);
    params.container.classList.remove(onAnimationClassName);
  }, toggle_animation_duration);
}

function showVideo(video, params) {
  params.container.classList.add(onAnimationClassName);
  resizeContainer(params.container, params.videoAspectRatio);
  toggle(video.container, params.image);
}

function toggle_animation_add(video, container, params) {
  video.addEventListener('wikiaAdStarted', function () {
    showVideo(video, params);
  });
  video.addEventListener('wikiaAdCompleted', function () {
    hideVideo(video, params);
  });
}

/* harmony default export */ var toggle_animation = ({
  add: toggle_animation_add,
  duration: toggle_animation_duration
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/toggle-fullscreen.ts


function toggle_fullscreen_add(video, container) {
  var toggleFullscreenButton = document.createElement('div');
  var offIcon = createIcon(icons_icons.FULLSCREEN_OFF, ['fullscreen-off-icon', 'porvata-icon', 'porvata-off-icon']);
  var onIcon = createIcon(icons_icons.FULLSCREEN_ON, ['fullscreen-on-icon', 'porvata-icon', 'porvata-on-icon']);
  toggleFullscreenButton.appendChild(offIcon);
  toggleFullscreenButton.appendChild(onIcon);
  toggleFullscreenButton.className = 'toggle-fullscreen-button porvata-switchable-icon';
  toggleFullscreenButton.addEventListener('click', function () {
    video.toggleFullscreen();
  });
  video.addEventListener('wikiaFullscreenChange', function () {
    if (video.isFullscreen()) {
      toggleFullscreenButton.classList.add('is-on');
    } else {
      toggleFullscreenButton.classList.remove('is-on');
    }
  });
  video.addEventListener('wikiaAdStop', function () {
    if (video.isFullscreen()) {
      video.toggleFullscreen();
    }
  });
  container.appendChild(toggleFullscreenButton);
}

/* harmony default export */ var toggle_fullscreen = ({
  add: toggle_fullscreen_add
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/toggle-thumbnail.ts
function toggle_thumbnail_add(video, container, params) {
  video.addEventListener('wikiaAdStarted', function () {
    params.thumbnail.classList.add('hidden-state');
  });
  video.addEventListener('wikiaAdCompleted', function () {
    params.thumbnail.classList.remove('hidden-state');
  });
}

/* harmony default export */ var toggle_thumbnail = ({
  add: toggle_thumbnail_add
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/toggle-ui.ts

var overlayTimeout = 5000;

function toggle_ui_add(video, container, params) {
  var timeout = null;
  var isMobile = ad_engine_["utils"].client.isSmartphone() || ad_engine_["utils"].client.isTablet();
  var overlay = document.createElement('div');

  var setAutomaticToggle = function setAutomaticToggle() {
    timeout = setTimeout(function () {
      if (video.isPlaying()) {
        video.container.classList.remove('ui-visible');
      }
    }, overlayTimeout);
  };

  overlay.classList.add('toggle-ui-overlay');

  if (isMobile) {
    overlay.addEventListener('click', function () {
      video.container.classList.toggle('ui-visible');
      clearTimeout(timeout);
      setAutomaticToggle();
    });
    video.addEventListener('resume', setAutomaticToggle);
  } else {
    video.container.addEventListener('mouseenter', function () {
      video.container.classList.add('ui-visible');
    });
    video.container.addEventListener('mouseleave', function () {
      video.container.classList.remove('ui-visible');
    });
    overlay.addEventListener('click', function () {
      top.open(params.clickThroughURL, '_blank');
    });
  }

  container.appendChild(overlay);
}

/* harmony default export */ var toggle_ui = ({
  add: toggle_ui_add
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/toggle-video.ts
function toggle_video_add(video, container) {
  video.addEventListener('wikiaAdStarted', function () {
    container.classList.remove('hide');
  });
  video.addEventListener('wikiaAdCompleted', function () {
    container.classList.add('hide');
  });
}

/* harmony default export */ var toggle_video = ({
  add: toggle_video_add
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/volume-control.ts


function createVolumeControl(params) {
  var iconPrefix = params.theme === 'hivi' ? 'HIVI_' : '';
  var volume = document.createElement('div');
  var offIcon = createIcon(icons_icons["".concat(iconPrefix, "VOLUME_OFF")], ['volume-off-icon', 'porvata-icon', 'porvata-off-icon']);
  var onIcon = createIcon(icons_icons["".concat(iconPrefix, "VOLUME_ON")], ['volume-on-icon', 'porvata-icon', 'porvata-on-icon']);
  volume.className = 'volume-button porvata-switchable-icon hidden';
  volume.appendChild(offIcon);
  volume.appendChild(onIcon);
  return volume;
}

function updateCurrentState(video, volumeControl) {
  if (video.isMuted() || video.isMobilePlayerMuted()) {
    volumeControl.classList.add('is-on');
  } else {
    volumeControl.classList.remove('is-on');
  }

  if (!video.isMobilePlayerMuted() && video.mobileVideoAd && video.mobileVideoAd.muted) {
    video.updateVideoDOMElement(video.defaultVolume);
  }
}

function volume_control_add(video, container) {
  var volumeControl = createVolumeControl(video.params);
  video.addEventListener('wikiaVolumeChange', function () {
    updateCurrentState(video, volumeControl);
  });
  video.addEventListener('wikiaAdStarted', function () {
    updateCurrentState(video, volumeControl);
    volumeControl.classList.remove('hidden');
  });
  volumeControl.addEventListener('click', function (e) {
    video.volumeToggle();
    e.preventDefault();
  });
  container.appendChild(volumeControl);
}

/* harmony default export */ var volume_control = ({
  add: volume_control_add
});
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/panel.ts



var panel_Panel =
/*#__PURE__*/
function () {
  function Panel(className, uiElements) {
    classCallCheck_default()(this, Panel);

    this.uiElements = uiElements;
    this.className = className;
    this.panelContainer = null;
  }

  createClass_default()(Panel, [{
    key: "add",
    value: function add(video, container, params) {
      var _this = this;

      this.panelContainer = document.createElement('div');
      this.panelContainer.className = this.className;
      this.uiElements.forEach(function (uiElement) {
        if (uiElement) {
          uiElement.add(video, _this.panelContainer, params);
        }
      });
      container.appendChild(this.panelContainer);
    }
  }]);

  return Panel;
}();


// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/ui-template.ts
















var ui_template_createBottomPanel = function createBottomPanel(_ref) {
  var _ref$fullscreenAllowe = _ref.fullscreenAllowed,
      fullscreenAllowed = _ref$fullscreenAllowe === void 0 ? true : _ref$fullscreenAllowe,
      _ref$theme = _ref.theme,
      theme = _ref$theme === void 0 ? null : _ref$theme;
  var isHiVi = theme === 'hivi';
  var panelClassName = 'bottom-panel';

  if (isHiVi) {
    panelClassName += ' dynamic-panel';
  }

  return new panel_Panel(panelClassName, [isHiVi ? pause_control : null, volume_control, isHiVi && fullscreenAllowed ? toggle_fullscreen : null]);
};

var ui_template_getTemplates = function getTemplates(params, videoSettings) {
  return {
    'auto-play': [progress_bar, pause_overlay, ui_template_createBottomPanel(params), toggle_animation],
    default: [progress_bar, pause_overlay, ui_template_createBottomPanel(params), close_button, toggle_animation],
    'split-left': [progress_bar, pause_overlay, ui_template_createBottomPanel(params), toggle_video, replay_overlay, !videoSettings.isAutoPlay() ? close_button : null],
    'split-right': [progress_bar, pause_overlay, ui_template_createBottomPanel(params), toggle_video, replay_overlay, !videoSettings.isAutoPlay() ? close_button : null],
    hivi: [progress_bar, ui_template_createBottomPanel(params), params.videoPlaceholderElement ? toggle_video : toggle_animation, toggle_thumbnail, toggle_ui, learn_more, params.videoPlaceholderElement ? replay_overlay : null],
    'outstream-incontent': [dynamic_reveal, floating, progress_bar, volume_control]
  };
};

function selectTemplate(videoSettings) {
  var params = videoSettings.getParams();
  var templates = ui_template_getTemplates(params, videoSettings);
  var template = 'default';

  if (params.type && params.type.indexOf('porvata') === 0) {
    template = 'outstream-incontent';
  } else if (params.theme === 'hivi') {
    template = 'hivi';
  } else if (videoSettings.isSplitLayout()) {
    template = params.splitLayoutVideoPosition === 'right' ? 'split-right' : 'split-left';
  } else if (videoSettings.isAutoPlay()) {
    template = 'auto-play';
  }

  return templates[template];
}
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/video-interface.ts
function setup(video, uiElements, params) {
  uiElements.forEach(function (element) {
    if (element) {
      element.add(video, video.container, params);
    }
  });
}
// CONCATENATED MODULE: ./src/ad-products/templates/interface/video/index.ts


// CONCATENATED MODULE: ./src/ad-products/templates/uap/universal-ad-package.ts









var uapCreativeId = DEFAULT_UAP_ID;
var uapId = DEFAULT_UAP_ID;
var uapType = DEFAULT_UAP_TYPE;

function getVideoSize(slot, params, videoSettings) {
  var width = videoSettings.isSplitLayout() ? params.videoPlaceholderElement.offsetWidth : slot.clientWidth;
  var height = width / params.videoAspectRatio;
  return {
    width: width,
    height: height
  };
}

function adjustVideoAdContainer(params) {
  if (params.splitLayoutVideoPosition) {
    var videoAdContainer = params.container.querySelector('.video-player');
    videoAdContainer.classList.add("video-player-".concat(params.splitLayoutVideoPosition));
  }
}

function loadPorvata(_x, _x2, _x3) {
  return _loadPorvata.apply(this, arguments);
}

function _loadPorvata() {
  _loadPorvata = asyncToGenerator_default()(
  /*#__PURE__*/
  regenerator_default.a.mark(function _callee(videoSettings, slotContainer, imageContainer) {
    var params, template, video;
    return regenerator_default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            params = videoSettings.getParams();
            template = selectTemplate(videoSettings);
            params.autoPlay = videoSettings.isAutoPlay();
            videoSettings.updateParams(params);
            _context.next = 6;
            return ad_engine_["Porvata"].inject(params);

          case 6:
            video = _context.sent;
            video.container.style.position = 'relative';
            setup(video, template, {
              autoPlay: videoSettings.isAutoPlay(),
              image: imageContainer,
              container: slotContainer,
              thumbnail: params.thumbnail,
              clickThroughURL: params.clickThroughURL,
              aspectRatio: params.aspectRatio,
              videoAspectRatio: params.videoAspectRatio,
              hideWhenPlaying: params.videoPlaceholderElement || params.image,
              splitLayoutVideoPosition: params.splitLayoutVideoPosition
            });
            video.addEventListener('wikiaAdCompleted', function () {
              video.reload();
            });
            adjustVideoAdContainer(params);
            return _context.abrupt("return", video);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _loadPorvata.apply(this, arguments);
}

function recalculateTwitchSize(params) {
  return function () {
    var adContainer = params.adContainer,
        clickArea = params.clickArea,
        player = params.player,
        twitchAspectRatio = params.twitchAspectRatio;
    player.style.height = "".concat(adContainer.clientHeight, "px");
    player.style.width = "".concat(player.clientHeight * twitchAspectRatio, "px");
    clickArea.style.width = "".concat(params.adContainer.clientWidth - player.clientWidth, "px");
  };
}

function loadTwitchPlayer(_x4, _x5) {
  return _loadTwitchPlayer.apply(this, arguments);
}

function _loadTwitchPlayer() {
  _loadTwitchPlayer = asyncToGenerator_default()(
  /*#__PURE__*/
  regenerator_default.a.mark(function _callee2(iframe, params) {
    var channelName, player, options, twitchPlayer;
    return regenerator_default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            channelName = params.channelName, player = params.player;
            options = {
              height: '100%',
              width: '100%',
              channel: channelName
            };
            iframe.parentNode.insertBefore(player, iframe);
            twitchPlayer = new ad_engine_["TwitchPlayer"](player, options, params);
            _context2.next = 6;
            return twitchPlayer.getPlayer();

          case 6:
            recalculateTwitchSize(params)();
            return _context2.abrupt("return", twitchPlayer);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _loadTwitchPlayer.apply(this, arguments);
}

function loadTwitchAd(_x6, _x7) {
  return _loadTwitchAd.apply(this, arguments);
}

function _loadTwitchAd() {
  _loadTwitchAd = asyncToGenerator_default()(
  /*#__PURE__*/
  regenerator_default.a.mark(function _callee3(iframe, params) {
    var player;
    return regenerator_default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            player = params.player;
            _context3.next = 3;
            return loadTwitchPlayer(iframe, params);

          case 3:
            window.addEventListener('resize', throttle_default()(recalculateTwitchSize(params), 250));
            player.firstChild.id = 'twitchPlayerContainer';

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _loadTwitchAd.apply(this, arguments);
}

function loadVideoAd(_x8) {
  return _loadVideoAd.apply(this, arguments);
}

function _loadVideoAd() {
  _loadVideoAd = asyncToGenerator_default()(
  /*#__PURE__*/
  regenerator_default.a.mark(function _callee4(videoSettings) {
    var params, imageContainer, size, recalculateVideoSize, video;
    return regenerator_default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            recalculateVideoSize = function _ref(video) {
              return function () {
                var currentSize = getVideoSize(params.container, params, videoSettings);
                video.resize(currentSize.width, currentSize.height);
              };
            };

            params = videoSettings.getParams();
            imageContainer = params.container.querySelector('div:last-of-type');
            size = getVideoSize(params.container, params, videoSettings);
            params.vastTargeting = {
              passback: getType()
            };
            params.width = size.width;
            params.height = size.height;
            videoSettings.updateParams(params);
            _context4.next = 10;
            return loadPorvata(videoSettings, params.container, imageContainer);

          case 10:
            video = _context4.sent;
            window.addEventListener('resize', throttle_default()(recalculateVideoSize(video), 250));

            if (params.videoTriggerElement) {
              params.videoTriggerElement.addEventListener('click', function () {
                return video.play();
              });
            } else if (params.videoTriggers) {
              params.videoTriggers.forEach(function (trigger) {
                trigger.addEventListener('click', function () {
                  return video.play();
                });
              });
            }

            return _context4.abrupt("return", video);

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _loadVideoAd.apply(this, arguments);
}

function getUapId() {
  return uapId;
}

function getCreativeId() {
  return uapCreativeId;
}

function setIds(lineItemId, creativeId) {
  uapId = lineItemId || DEFAULT_UAP_ID;
  uapCreativeId = creativeId || DEFAULT_UAP_ID;
  updateSlotsTargeting(uapId, uapCreativeId);
}

function getType() {
  return uapType;
}

function setType(type) {
  uapType = type;
}

function updateSlotsTargeting(lineItemId, creativeId) {
  var slots = ad_engine_["context"].get('slots');

  keys_default()(slots).forEach(function (slotId) {
    if (!slots[slotId].nonUapSlot) {
      ad_engine_["context"].set("slots.".concat(slotId, ".targeting.uap"), lineItemId);
      ad_engine_["context"].set("slots.".concat(slotId, ".targeting.uap_c"), creativeId);
    }
  });
}

function enableSlots(slotsToEnable) {
  if (getType() !== 'abcd') {
    slotsToEnable.forEach(function (slotName) {
      ad_engine_["btfBlockerService"].unblock(slotName);
    });
  }
}

function disableSlots(slotsToDisable) {
  slotsToDisable.forEach(function (slotName) {
    ad_engine_["slotService"].disable(slotName);
  });
}

function initSlot(params) {
  var adSlot = ad_engine_["slotService"].get(params.slotName);
  params.container = adSlot.getElement();

  if (params.isDarkTheme) {
    params.container.classList.add('is-dark');
  }

  if (params.isMobile) {
    params.container.classList.add('is-mobile-layout');
  }

  if (ad_engine_["utils"].client.isSmartphone() || ad_engine_["utils"].client.isTablet()) {
    params.container.classList.add('is-mobile-device');
  }
}

function universal_ad_package_reset() {
  setType(DEFAULT_UAP_TYPE);
  setIds(DEFAULT_UAP_ID, DEFAULT_UAP_ID);
}

function isFanTakeoverLoaded() {
  return getUapId() !== DEFAULT_UAP_ID && FAN_TAKEOVER_TYPES.indexOf(getType()) !== -1;
}

var universalAdPackage = objectSpread_default()({}, constants_namespaceObject, {
  init: function init(params) {
    var slotsToEnable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var slotsToDisable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var adProduct = 'uap';

    if (this.isVideoEnabled(params)) {
      adProduct = 'vuap';
    }

    params.adProduct = params.adProduct || adProduct;
    setIds(params.uap, params.creativeId);
    disableSlots(slotsToDisable);
    enableSlots(slotsToEnable);
    setType(params.adProduct);

    if (params.slotName) {
      initSlot(params);
    }
  },
  initSlot: initSlot,
  isFanTakeoverLoaded: isFanTakeoverLoaded,
  getCreativeId: getCreativeId,
  getType: getType,
  getUapId: getUapId,
  isVideoEnabled: function isVideoEnabled(params) {
    var triggersArrayIsNotEmpty = is_array_default()(params.videoTriggers) && params.videoTriggers.length > 0;
    return !!params.videoAspectRatio && (params.videoPlaceholderElement || triggersArrayIsNotEmpty);
  },
  loadVideoAd: loadVideoAd,
  loadTwitchAd: loadTwitchAd,
  reset: universal_ad_package_reset,
  setType: setType
});
// CONCATENATED MODULE: ./src/ad-products/templates/sticky-tlb.ts
















var sticky_tlb_logGroup = 'sticky-tlb';
var sticky_tlb_StickyTLB =
/*#__PURE__*/
function (_StickyBase) {
  inherits_default()(StickyTLB, _StickyBase);

  function StickyTLB() {
    classCallCheck_default()(this, StickyTLB);

    return possibleConstructorReturn_default()(this, getPrototypeOf_default()(StickyTLB).apply(this, arguments));
  }

  createClass_default()(StickyTLB, [{
    key: "init",
    value: function init(params) {
      if (!this.isEnabled()) {
        ad_engine_["utils"].logger(sticky_tlb_logGroup, 'stickiness rejected');
        this.adSlot.emitEvent(stickiness_Stickiness.SLOT_STICKINESS_DISABLED);
        return;
      }

      this.setupStickiness(params);
      this.container.style.backgroundColor = '#000';
      this.container.classList.add('bfaa-template');
      this.config.onInit(this.adSlot, this.params, this.config);
      this.onAdReady();
    }
    /**
     * @private
     */

  }, {
    key: "onAdReady",
    value: function () {
      var _onAdReady = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee() {
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.container.classList.add('theme-hivi');
                this.addAdvertisementLabel();
                this.config.mainContainer.style.paddingTop = "".concat(this.container.scrollHeight, "px");
                this.config.mainContainer.classList.add('has-bfaa');
                navbarManager.setup(this.config, this.container);
                this.config.moveNavbar(this.container.scrollHeight, SLIDE_OUT_TIME);

                if (!document.hidden) {
                  _context.next = 9;
                  break;
                }

                _context.next = 9;
                return ad_engine_["utils"].once(window, 'visibilitychange');

              case 9:
                ad_engine_["utils"].logger(sticky_tlb_logGroup, 'ad ready');

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onAdReady() {
        return _onAdReady.apply(this, arguments);
      }

      return onAdReady;
    }()
    /**
     * @private
     */

  }, {
    key: "addAdvertisementLabel",
    value: function addAdvertisementLabel() {
      var advertisementLabel = new advertisement_label_AdvertisementLabel();
      this.container.appendChild(advertisementLabel.render());
    }
    /**
     * @protected
     */

  }, {
    key: "onStickinessChange",
    value: function () {
      var _onStickinessChange = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee2(isSticky) {
        var stickinessBeforeCallback, stickinessAfterCallback;
        return regenerator_default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                stickinessBeforeCallback = isSticky ? this.config.onBeforeStickBfaaCallback : this.config.onBeforeUnstickBfaaCallback;
                stickinessAfterCallback = isSticky ? this.config.onAfterStickBfaaCallback : this.config.onAfterUnstickBfaaCallback;
                stickinessBeforeCallback.call(this.config, this.adSlot, this.params);

                if (!isSticky) {
                  _context2.next = 7;
                  break;
                }

                this.onStick();
                _context2.next = 9;
                break;

              case 7:
                _context2.next = 9;
                return this.onUnstick();

              case 9:
                stickinessAfterCallback.call(this.config, this.adSlot, this.params);
                ad_engine_["utils"].logger(sticky_tlb_logGroup, 'stickiness changed', isSticky);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function onStickinessChange(_x) {
        return _onStickinessChange.apply(this, arguments);
      }

      return onStickinessChange;
    }()
    /**
     * @protected
     */

  }, {
    key: "onUnstick",
    value: function () {
      var _onUnstick = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee3() {
        return regenerator_default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.adSlot.emitEvent(stickiness_Stickiness.SLOT_UNSTICKED_STATE);
                this.config.moveNavbar(0, SLIDE_OUT_TIME);
                _context3.next = 4;
                return animate(this.container, CSS_CLASSNAME_SLIDE_OUT_ANIMATION, SLIDE_OUT_TIME);

              case 4:
                this.container.classList.remove(CSS_CLASSNAME_STICKY_BFAA);
                this.container.classList.add('theme-resolved');
                animate(this.container, CSS_CLASSNAME_FADE_IN_ANIMATION, FADE_IN_TIME);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function onUnstick() {
        return _onUnstick.apply(this, arguments);
      }

      return onUnstick;
    }()
    /**
     * @protected
     */

  }, {
    key: "onStick",
    value: function onStick() {
      this.adSlot.emitEvent(stickiness_Stickiness.SLOT_STICKED_STATE);
      this.container.classList.add(CSS_CLASSNAME_STICKY_BFAA);
      this.addCloseButton();
    }
    /**
     * @protected
     */

  }, {
    key: "unstickImmediately",
    value: function unstickImmediately() {
      this.config.moveNavbar(0, 0);
      ad_engine_["scrollListener"].removeCallback(this.scrollListener);
      this.container.classList.remove(CSS_CLASSNAME_STICKY_BFAA);
      this.container.classList.add('theme-resolved');
      this.stickiness.sticky = false;
      this.config.mainContainer.style.paddingTop = '0';
      this.container.classList.add('hide');
      ad_engine_["utils"].logger(sticky_tlb_logGroup, 'unstick immediately');
      this.removeCloseButton();
    }
    /**
     * @protected
     */

  }, {
    key: "addStickinessPlugin",
    value: function addStickinessPlugin() {
      this.container.classList.add(CSS_CLASSNAME_STICKY_IAB);
      this.addUnstickLogic();
      this.addUnstickEvents();
      this.stickiness.run();
      ad_engine_["utils"].logger(sticky_tlb_logGroup, this.adSlot.getSlotName(), 'stickiness added');
    }
    /**
     * @private
     */

  }, {
    key: "addCloseButton",
    value: function addCloseButton() {
      var _this = this;

      this.addButton(this.container, function () {
        _this.stickiness.close();

        _this.adSlot.emitEvent(ad_engine_["SlotTweaker"].SLOT_CLOSE_IMMEDIATELY);
      });
    }
    /**
     * @private
     */

  }, {
    key: "removeCloseButton",
    value: function removeCloseButton() {
      this.removeButton();
    }
    /**
     * Returns template name.
     * @protected
     * @return {string}
     */

  }, {
    key: "getName",
    value: function getName() {
      return StickyTLB.getName();
    }
    /**
     * @protected
     */

  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return get_default()(getPrototypeOf_default()(StickyTLB.prototype), "isEnabled", this).call(this) && this.container;
    }
  }], [{
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        enabled: true,
        desktopNavbarWrapperSelector: '.wds-global-navigation-wrapper',
        mobileNavbarWrapperSelector: '.global-navigation-mobile-wrapper',
        mainContainer: document.body,
        handleNavbar: false,
        stickyAdditionalTime: 0,
        stickyUntilSlotViewed: true,
        slotSibling: '.topic-header',
        onInit: function onInit() {},
        onBeforeStickBfaaCallback: function onBeforeStickBfaaCallback() {},
        onAfterStickBfaaCallback: function onAfterStickBfaaCallback() {},
        onBeforeUnstickBfaaCallback: function onBeforeUnstickBfaaCallback() {},
        onAfterUnstickBfaaCallback: function onAfterUnstickBfaaCallback() {},
        moveNavbar: function moveNavbar(offset) {
          var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SLIDE_OUT_TIME;
          var navbarElement = document.querySelector('body > nav.navigation');

          if (navbarElement) {
            navbarElement.style.transition = offset ? '' : "top ".concat(time, "ms ").concat(universalAdPackage.CSS_TIMING_EASE_IN_CUBIC);
            navbarElement.style.top = offset ? "".concat(offset, "px") : '';
          }
        }
      };
    }
  }, {
    key: "getName",
    value: function getName() {
      return 'stickyTLB';
    }
  }]);

  return StickyTLB;
}(sticky_base_StickyBase);
// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/assign"
var assign_ = __webpack_require__(9);
var assign_default = /*#__PURE__*/__webpack_require__.n(assign_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/toArray"
var toArray_ = __webpack_require__(25);
var toArray_default = /*#__PURE__*/__webpack_require__.n(toArray_);

// CONCATENATED MODULE: ./src/ad-products/templates/uap/resolved-state-switch.ts


var cacheKey = 'adEngine_resolvedStateCounter';
var cacheTtl = 24 * 3600;
var resolved_state_switch_now = new Date();

function createCacheKey() {
  return "".concat(cacheKey, "_").concat(universalAdPackage.getUapId());
}

function findRecordInCache() {
  return ad_engine_["localCache"].get(createCacheKey());
}

function wasDefaultStateSeen() {
  var record = findRecordInCache(); // check for presence in localStorage and if present, make sure that we're
  // not comparing to current session data - bfab that wants to load after bfaa

  return !!record && resolved_state_switch_now.getTime() !== record.lastSeenDate;
}

function updateInformationAboutSeenDefaultStateAd() {
  ad_engine_["localCache"].set(createCacheKey(), {
    adId: universalAdPackage.getUapId(),
    lastSeenDate: resolved_state_switch_now.getTime()
  }, cacheTtl);
}

var resolvedStateSwitch = {
  updateInformationAboutSeenDefaultStateAd: updateInformationAboutSeenDefaultStateAd,
  wasDefaultStateSeen: wasDefaultStateSeen
};
// CONCATENATED MODULE: ./src/ad-products/templates/uap/resolved-state.ts





var DEFAULT_STATE = 'default';
var RESOLVED_STATE = 'resolved';

function getQueryParam() {
  return ad_engine_["utils"].queryString.get('resolved_state', null);
}

function isForcedByURLParam() {
  return [true, 'true', '1'].indexOf(getQueryParam()) > -1;
}

function isBlockedByURLParam() {
  return [false, 'blocked', 'false', '0'].indexOf(getQueryParam()) > -1;
}

function setState(state, params) {
  var image1 = params.image1,
      image2 = params.image2;
  var promises = [];
  var srcPropertyName = 'defaultStateSrc';

  if (state === RESOLVED_STATE) {
    params.aspectRatio = params.resolvedStateAspectRatio;
    srcPropertyName = 'resolvedStateSrc';
  }

  promises.push(promise_default.a.resolve(params));
  image1.element.src = image1[srcPropertyName];
  promises.push(promise_default.a.race([ad_engine_["utils"].once(image1.element, 'load'), ad_engine_["utils"].once(image1.element, 'error')]));

  if (image2 && image2[srcPropertyName]) {
    image2.element.src = image2[srcPropertyName];
    promises.push(promise_default.a.race([ad_engine_["utils"].once(image2.element, 'load'), ad_engine_["utils"].once(image2.element, 'error')]));
  }

  return promise_default.a.all(promises);
}

function setDefaultState(params) {
  return setState(DEFAULT_STATE, params);
}

function resolved_state_setResolvedState(params) {
  return setState(RESOLVED_STATE, params);
}

function templateSupportsResolvedState(params) {
  return !!(params.image1 && params.image1.resolvedStateSrc) || params.theme === 'hivi';
}

function isResolvedState(params) {
  var result = false;

  if (params.resolvedStateForced) {
    return true;
  }

  if (templateSupportsResolvedState(params)) {
    var showResolvedState = !isBlockedByURLParam();
    var defaultStateSeen = true;

    if (showResolvedState) {
      defaultStateSeen = resolvedStateSwitch.wasDefaultStateSeen() || isForcedByURLParam();
    }

    result = showResolvedState && defaultStateSeen;
  }

  return result;
}

var resolvedState = {
  // This method is used by classic UAP only (not-HiVi)
  // UAP:HiVi template does not support srcPropertyNames like defaultStateSrc
  // UAP:HiVi switch images in uap/themes/hivi/hivi.js by swapping hidden-state class
  // TODO: Remove this code once we get rid of old (classic) UAP
  setImage: function setImage(videoSettings) {
    var params = videoSettings.getParams();

    if (templateSupportsResolvedState(params)) {
      if (videoSettings.isResolvedState()) {
        return resolved_state_setResolvedState(params).then(function (_ref) {
          var _ref2 = toArray_default()(_ref),
              updatedParams = _ref2[0],
              args = _ref2.slice(1);

          videoSettings.updateParams(updatedParams);
          return [updatedParams].concat(toConsumableArray_default()(args));
        });
      }

      resolvedStateSwitch.updateInformationAboutSeenDefaultStateAd();
      return setDefaultState(params);
    }

    return promise_default.a.resolve();
  },
  isResolvedState: isResolvedState
};
// CONCATENATED MODULE: ./src/ad-products/templates/uap/video-settings.ts




var video_settings_VideoSettings =
/*#__PURE__*/
function () {
  function VideoSettings(params) {
    classCallCheck_default()(this, VideoSettings);

    this.params = params;
    Object.defineProperty(this, 'resolvedState', {
      value: resolvedState.isResolvedState(this.params),
      writable: false
    });
    Object.defineProperty(this, 'autoPlay', {
      value: this.detectAutoPlay(),
      writable: false
    });
    Object.defineProperty(this, 'splitLayout', {
      value: Boolean(params.splitLayoutVideoPosition),
      writable: false
    });
  }

  createClass_default()(VideoSettings, [{
    key: "detectAutoPlay",
    value: function detectAutoPlay() {
      var defaultStateAutoPlay = this.params.autoPlay && !this.resolvedState;
      var resolvedStateAutoPlay = this.params.resolvedStateAutoPlay && this.resolvedState;
      return Boolean(defaultStateAutoPlay || resolvedStateAutoPlay);
    }
  }, {
    key: "getParams",
    value: function getParams() {
      return assign_default()({}, this.params);
    }
  }, {
    key: "updateParams",
    value: function updateParams(params) {
      assign_default()(this.params, params);
    }
  }, {
    key: "isAutoPlay",
    value: function isAutoPlay() {
      return this.autoPlay;
    }
  }, {
    key: "isResolvedState",
    value: function isResolvedState() {
      return this.resolvedState;
    }
  }, {
    key: "isSplitLayout",
    value: function isSplitLayout() {
      return this.splitLayout;
    }
  }]);

  return VideoSettings;
}();
// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/assertThisInitialized"
var assertThisInitialized_ = __webpack_require__(17);
var assertThisInitialized_default = /*#__PURE__*/__webpack_require__.n(assertThisInitialized_);

// EXTERNAL MODULE: external "lodash/toPlainObject"
var toPlainObject_ = __webpack_require__(24);
var toPlainObject_default = /*#__PURE__*/__webpack_require__.n(toPlainObject_);

// EXTERNAL MODULE: external "lodash/isUndefined"
var isUndefined_ = __webpack_require__(23);
var isUndefined_default = /*#__PURE__*/__webpack_require__.n(isUndefined_);

// EXTERNAL MODULE: external "lodash/mapValues"
var mapValues_ = __webpack_require__(14);
var mapValues_default = /*#__PURE__*/__webpack_require__.n(mapValues_);

// EXTERNAL MODULE: external "lodash/debounce"
var debounce_ = __webpack_require__(22);
var debounce_default = /*#__PURE__*/__webpack_require__.n(debounce_);

// CONCATENATED MODULE: ./src/ad-products/templates/uap/themes/theme.ts





/**
 * @abstract
 */

var theme_BigFancyAdTheme =
/*#__PURE__*/
function () {
  function BigFancyAdTheme(adSlot, params) {
    classCallCheck_default()(this, BigFancyAdTheme);

    this.adSlot = adSlot;
    this.container = this.adSlot.getElement();
    this.config = ad_engine_["context"].get('templates.bfaa');
    this.params = params;
  }
  /**
   @abstract
   */


  createClass_default()(BigFancyAdTheme, [{
    key: "onAdReady",
    value: function onAdReady() {
      throw new ad_engine_["utils"].NotImplementedException();
    }
    /**
     @abstract
     */

  }, {
    key: "adIsReady",
    value: function () {
      var _adIsReady = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee(videoSettings) {
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                throw new ad_engine_["utils"].NotImplementedException({
                  videoSettings: videoSettings
                });

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function adIsReady(_x) {
        return _adIsReady.apply(this, arguments);
      }

      return adIsReady;
    }()
    /**
     * @abstract
     */

  }, {
    key: "onVideoReady",
    value: function onVideoReady() {
      throw new ad_engine_["utils"].NotImplementedException();
    }
  }]);

  return BigFancyAdTheme;
}();
// CONCATENATED MODULE: ./src/ad-products/templates/uap/themes/hivi/hivi-theme.ts












/**
 * @abstract
 */

var hivi_theme_BigFancyAdHiviTheme =
/*#__PURE__*/
function (_BigFancyAdTheme) {
  inherits_default()(BigFancyAdHiviTheme, _BigFancyAdTheme);

  function BigFancyAdHiviTheme() {
    classCallCheck_default()(this, BigFancyAdHiviTheme);

    return possibleConstructorReturn_default()(this, getPrototypeOf_default()(BigFancyAdHiviTheme).apply(this, arguments));
  }

  createClass_default()(BigFancyAdHiviTheme, [{
    key: "onAdReady",
    value: function onAdReady() {
      this.container.classList.add('theme-hivi');
      this.addAdvertisementLabel();
    }
  }, {
    key: "adIsReady",
    value: function () {
      var _adIsReady = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee() {
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", ad_engine_["slotTweaker"].makeResponsive(this.adSlot, this.params.aspectRatio));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function adIsReady() {
        return _adIsReady.apply(this, arguments);
      }

      return adIsReady;
    }()
  }, {
    key: "addAdvertisementLabel",
    value: function addAdvertisementLabel() {
      var advertisementLabel = new advertisement_label_AdvertisementLabel();
      this.container.appendChild(advertisementLabel.render());
    }
    /**
     * @protected
     */

  }, {
    key: "addUnstickLogic",
    value: function addUnstickLogic() {
      var stateResolvedAndVideoViewed = this.getStateResolvedAndVideoViewed();
      this.stickiness = new stickiness_Stickiness(this.adSlot, stateResolvedAndVideoViewed);
    }
    /**
     * @abstract
     * @protected
     */

  }, {
    key: "getStateResolvedAndVideoViewed",
    value: function getStateResolvedAndVideoViewed() {
      throw new ad_engine_["utils"].NotImplementedException();
    }
    /**
     * @protected
     */

  }, {
    key: "addUnstickButton",
    value: function addUnstickButton() {
      var _this = this;

      var closeButton = new close_button_CloseButton({
        classNames: ['button-unstick'],
        onClick: function onClick() {
          return _this.stickiness.close();
        }
      });
      this.container.appendChild(closeButton.render());
    }
    /**
     * @protected
     */

  }, {
    key: "addUnstickEvents",
    value: function addUnstickEvents() {
      var _this2 = this;

      this.stickiness.on(stickiness_Stickiness.STICKINESS_CHANGE_EVENT, function (isSticky) {
        return _this2.onStickinessChange(isSticky);
      });
      this.stickiness.on(stickiness_Stickiness.CLOSE_CLICKED_EVENT, function () {
        return _this2.onCloseClicked();
      });
      this.stickiness.on(stickiness_Stickiness.UNSTICK_IMMEDIATELY_EVENT, function (arg) {
        return _this2.unstickImmediately(arg);
      });
    }
    /**
     * @abstract
     * @protected
     */

  }, {
    key: "onStickinessChange",
    value: function onStickinessChange(isSticky) {
      throw new ad_engine_["utils"].NotImplementedException({
        isSticky: isSticky
      });
    }
    /**
     * @abstract
     * @protected
     * */

  }, {
    key: "onCloseClicked",
    value: function onCloseClicked() {
      throw new ad_engine_["utils"].NotImplementedException();
    }
    /**
     * @abstract
     * @protected
     * @param stopVideo {boolean}
     */

  }, {
    key: "unstickImmediately",
    value: function unstickImmediately(stopVideo) {
      throw new ad_engine_["utils"].NotImplementedException({
        stopVideo: stopVideo
      });
    }
  }]);

  return BigFancyAdHiviTheme;
}(theme_BigFancyAdTheme);
hivi_theme_BigFancyAdHiviTheme.DEFAULT_UNSTICK_DELAY = 3000;
// CONCATENATED MODULE: ./src/ad-products/templates/uap/themes/hivi/hivi-bfaa.ts
























var HIVI_RESOLVED_THRESHOLD = 0.995;
var hivi_bfaa_BfaaHiviTheme =
/*#__PURE__*/
function (_BigFancyAdHiviTheme) {
  inherits_default()(BfaaHiviTheme, _BigFancyAdHiviTheme);

  function BfaaHiviTheme(adSlot, params) {
    var _this;

    classCallCheck_default()(this, BfaaHiviTheme);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(BfaaHiviTheme).call(this, adSlot, params));

    assign_default()(assertThisInitialized_default()(assertThisInitialized_default()(_this)), toPlainObject_default()(new external_eventemitter3_default.a()));

    _this.stickiness = null;
    _this.scrollListener = null;
    _this.video = null;
    _this.isLocked = false;
    _this.onResolvedStateScroll = null;

    if (_this.params.isSticky && _this.config.stickinessAllowed) {
      _this.addStickinessPlugin();
    }

    if (!_this.config.defaultStateAllowed) {
      _this.params.resolvedStateForced = true;
    }

    return _this;
  }
  /**
   * @private
   */


  createClass_default()(BfaaHiviTheme, [{
    key: "addStickinessPlugin",
    value: function addStickinessPlugin() {
      this.addUnstickLogic();
      this.addUnstickButton();
      this.addUnstickEvents();
      this.stickiness.run();
    }
  }, {
    key: "onAdReady",
    value: function onAdReady() {
      var _this2 = this;

      get_default()(getPrototypeOf_default()(BfaaHiviTheme.prototype), "onAdReady", this).call(this);

      if (resolvedState.isResolvedState(this.params)) {
        this.setResolvedState(true);
      } else {
        resolvedStateSwitch.updateInformationAboutSeenDefaultStateAd();
        this.scrollListener = ad_engine_["scrollListener"].addCallback(function () {
          return _this2.updateAdSizes();
        }); // Manually run update on scroll once

        this.updateAdSizes();
      }
    }
  }, {
    key: "onVideoReady",
    value: function onVideoReady(video) {
      var _this3 = this;

      this.video = video;
      video.addEventListener('wikiaAdStarted', function () {
        _this3.updateAdSizes();

        if (!video.params.autoPlay) {
          _this3.resetResolvedState();
        }
      });
      video.addEventListener('wikiaAdCompleted', function () {
        if (!_this3.isLocked) {
          _this3.setResolvedState(true);
        }
      });
      video.addEventListener('wikiaFullscreenChange', function () {
        if (video.isFullscreen()) {
          _this3.stickiness.blockRevertStickiness();

          _this3.container.classList.add('theme-video-fullscreen');
        } else {
          _this3.stickiness.unblockRevertStickiness();

          _this3.container.classList.remove('theme-video-fullscreen');

          _this3.updateAdSizes();
        }
      });
    }
    /**
     * @private
     */

  }, {
    key: "resetResolvedState",
    value: function resetResolvedState() {
      var offset = this.getHeightDifferenceBetweenStates();

      if (this.isLocked && this.config.defaultStateAllowed && window.scrollY < offset) {
        var aspectRatio = this.params.config.aspectRatio.default;
        this.container.style.top = '';
        this.config.mainContainer.style.paddingTop = "".concat(100 / aspectRatio, "%");

        if (this.params.isSticky && this.config.stickinessAllowed) {
          this.unstickImmediately(false);
        }

        this.unlock();
        this.switchImagesInAd(false);
        this.setResolvedState(false);
        this.updateAdSizes();
      }
    }
    /**
     * @private
     */

  }, {
    key: "lock",
    value: function lock() {
      var offset = this.getHeightDifferenceBetweenStates();
      this.isLocked = true;
      this.container.classList.add('theme-locked');
      ad_engine_["scrollListener"].removeCallback(this.scrollListener);
      this.adjustSizesToResolved(offset);
      this.emit(BfaaHiviTheme.RESOLVED_STATE_EVENT);
    }
    /**
     * @private
     */

  }, {
    key: "unlock",
    value: function unlock() {
      var _this4 = this;

      this.isLocked = false;
      this.container.classList.remove('theme-locked');
      this.scrollListener = ad_engine_["scrollListener"].addCallback(function () {
        return _this4.updateAdSizes();
      });
    }
    /**
     * @private
     */

  }, {
    key: "adjustSizesToResolved",
    value: function adjustSizesToResolved(offset) {
      if (this.adSlot.isEnabled()) {
        var aspectRatio = this.params.config.aspectRatio.resolved;
        this.container.style.top = '';
        this.config.mainContainer.style.paddingTop = "".concat(100 / aspectRatio, "%");
        ad_engine_["slotTweaker"].makeResponsive(this.adSlot, aspectRatio);
        window.scrollBy(0, -Math.min(offset, window.scrollY));
        this.updateAdSizes();
      }
    }
    /**
     * @private
     */

  }, {
    key: "updateAdSizes",
    value: function updateAdSizes() {
      var _this$params$config = this.params.config,
          aspectRatio = _this$params$config.aspectRatio,
          state = _this$params$config.state;
      var currentWidth = this.config.mainContainer.offsetWidth;
      var isResolved = this.container.classList.contains('theme-resolved');
      var maxHeight = currentWidth / aspectRatio.default;
      var minHeight = currentWidth / aspectRatio.resolved;
      var scrollY = window.scrollY || window.pageYOffset || 0;
      var aspectScroll = this.isLocked ? minHeight : Math.max(minHeight, maxHeight - scrollY);
      var currentAspectRatio = currentWidth / aspectScroll;
      var aspectRatioDiff = aspectRatio.default - aspectRatio.resolved;
      var currentDiff = aspectRatio.default - currentAspectRatio;
      var currentState = 1 - (aspectRatioDiff - currentDiff) / aspectRatioDiff;
      var heightDiff = state.height.default - state.height.resolved;
      var heightFactor = (state.height.default - heightDiff * currentState) / 100;
      var relativeHeight = aspectScroll * heightFactor;
      this.adjustVideoSize(relativeHeight);

      if (this.params.thumbnail) {
        this.setThumbnailStyle(currentState);
      }

      if (currentState >= HIVI_RESOLVED_THRESHOLD && !isResolved) {
        this.setResolvedState();
      } else if (currentState < HIVI_RESOLVED_THRESHOLD && isResolved) {
        this.container.style.top = '';
        this.switchImagesInAd(false);
      }

      return ad_engine_["slotTweaker"].makeResponsive(this.adSlot, currentAspectRatio);
    }
    /**
     * @private
     */

  }, {
    key: "adjustVideoSize",
    value: function adjustVideoSize(relativeHeight) {
      if (this.video && !this.video.isFullscreen()) {
        this.video.container.style.width = "".concat(this.params.videoAspectRatio * relativeHeight, "px");
      }
    }
    /**
     * @private
     */

  }, {
    key: "setThumbnailStyle",
    value: function setThumbnailStyle(state) {
      var style = mapValues_default()(this.params.config.state, function (styleProperty) {
        var diff = styleProperty.default - styleProperty.resolved;
        return "".concat(styleProperty.default - diff * state, "%");
      });

      assign_default()(this.params.thumbnail.style, style);

      if (this.video) {
        assign_default()(this.video.container.style, style);

        if (this.video.isFullscreen()) {
          this.video.container.style.height = '100%';
        }
      }
    }
    /**
     * @private
     */

  }, {
    key: "setResolvedState",
    value: function setResolvedState(immediately) {
      var _this5 = this;

      var isSticky = this.stickiness && this.stickiness.isSticky();
      var width = this.container.offsetWidth;
      var aspectRatio = this.params.config.aspectRatio;
      var resolvedHeight = width / aspectRatio.resolved;
      var offset = this.getHeightDifferenceBetweenStates();

      if (isSticky) {
        this.config.moveNavbar(resolvedHeight, SLIDE_OUT_TIME);
      } else {
        this.container.style.top = "".concat(Math.min(window.scrollY, offset), "px");
      }

      this.switchImagesInAd(true);

      if (this.onResolvedStateScroll) {
        window.removeEventListener('scroll', this.onResolvedStateScroll);
        this.onResolvedStateScroll.cancel();
      }

      return new promise_default.a(function (resolve) {
        if (immediately) {
          _this5.lock();

          resolve();
        } else {
          _this5.onResolvedStateScroll = debounce_default()(function () {
            if (window.scrollY < offset) {
              return;
            }

            window.removeEventListener('scroll', _this5.onResolvedStateScroll);
            _this5.onResolvedStateScroll = null;

            _this5.lock();

            resolve();
          }, 50);
          window.addEventListener('scroll', _this5.onResolvedStateScroll);

          _this5.onResolvedStateScroll();
        }
      });
    }
    /**
     * @private
     */

  }, {
    key: "getHeightDifferenceBetweenStates",
    value: function getHeightDifferenceBetweenStates() {
      var width = this.container.offsetWidth;
      var aspectRatio = this.params.config.aspectRatio;
      return Math.round(width / aspectRatio.default - width / aspectRatio.resolved);
    }
    /**
     * @private
     */

  }, {
    key: "switchImagesInAd",
    value: function switchImagesInAd(isResolved) {
      if (isResolved) {
        this.container.classList.add('theme-resolved');
        this.params.image2.element.classList.remove('hidden-state');
      } else {
        this.container.classList.remove('theme-resolved');
        this.params.image2.element.classList.add('hidden-state');
      }
    }
    /**
     * @protected
     */

  }, {
    key: "getStateResolvedAndVideoViewed",
    value: function () {
      var _getStateResolvedAndVideoViewed = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee() {
        var _this$params, stickyAdditionalTime, stickyUntilVideoViewed, stateResolved, videoViewed, unstickDelay;

        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$params = this.params, stickyAdditionalTime = _this$params.stickyAdditionalTime, stickyUntilVideoViewed = _this$params.stickyUntilVideoViewed;
                stateResolved = ad_engine_["utils"].once(this, BfaaHiviTheme.RESOLVED_STATE_EVENT);
                videoViewed = stickyUntilVideoViewed ? ad_engine_["utils"].once(this.adSlot, ad_engine_["AdSlot"].VIDEO_VIEWED_EVENT) : promise_default.a.resolve();
                unstickDelay = isUndefined_default()(stickyAdditionalTime) ? hivi_theme_BigFancyAdHiviTheme.DEFAULT_UNSTICK_DELAY : stickyAdditionalTime;
                _context.next = 6;
                return promise_default.a.all([stateResolved, videoViewed]);

              case 6:
                _context.next = 8;
                return ad_engine_["utils"].wait(unstickDelay);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getStateResolvedAndVideoViewed() {
        return _getStateResolvedAndVideoViewed.apply(this, arguments);
      }

      return getStateResolvedAndVideoViewed;
    }()
    /**
     * @protected
     */

  }, {
    key: "onStickinessChange",
    value: function () {
      var _onStickinessChange = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee2(isSticky) {
        var stickinessBeforeCallback, stickinessAfterCallback;
        return regenerator_default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                stickinessBeforeCallback = isSticky ? this.config.onBeforeStickBfaaCallback : this.config.onBeforeUnstickBfaaCallback;
                stickinessAfterCallback = isSticky ? this.config.onAfterStickBfaaCallback : this.config.onAfterUnstickBfaaCallback;
                stickinessBeforeCallback.call(this.config, this.adSlot, this.params);

                if (isSticky) {
                  _context2.next = 12;
                  break;
                }

                this.adSlot.emitEvent(stickiness_Stickiness.SLOT_UNSTICKED_STATE);
                this.config.moveNavbar(0, SLIDE_OUT_TIME);
                _context2.next = 8;
                return animate(this.adSlot.getElement(), CSS_CLASSNAME_SLIDE_OUT_ANIMATION, SLIDE_OUT_TIME);

              case 8:
                this.adSlot.getElement().classList.remove(CSS_CLASSNAME_STICKY_BFAA);
                animate(this.adSlot.getElement(), CSS_CLASSNAME_FADE_IN_ANIMATION, FADE_IN_TIME);
                _context2.next = 14;
                break;

              case 12:
                this.adSlot.emitEvent(stickiness_Stickiness.SLOT_STICKED_STATE);
                this.adSlot.getElement().classList.add(CSS_CLASSNAME_STICKY_BFAA);

              case 14:
                stickinessAfterCallback.call(this.config, this.adSlot, this.params);

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function onStickinessChange(_x) {
        return _onStickinessChange.apply(this, arguments);
      }

      return onStickinessChange;
    }()
    /**
     * @protected
     */

  }, {
    key: "onCloseClicked",
    value: function onCloseClicked() {
      this.adSlot.emitEvent(ad_engine_["SlotTweaker"].SLOT_CLOSE_IMMEDIATELY);
      this.unstickImmediately();
      this.config.mainContainer.style.paddingTop = '0';
      this.adSlot.disable();
      ad_engine_["slotTweaker"].hide(this.adSlot);
    }
    /**
     * @protected
     */

  }, {
    key: "unstickImmediately",
    value: function unstickImmediately() {
      var stopVideo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      ad_engine_["scrollListener"].removeCallback(this.scrollListener);
      this.adSlot.getElement().classList.remove(CSS_CLASSNAME_STICKY_BFAA);

      if (stopVideo && this.video && this.video.ima.getAdsManager()) {
        this.video.stop();
      }

      this.config.moveNavbar(0, 0);
      this.stickiness.sticky = false;
    }
  }]);

  return BfaaHiviTheme;
}(hivi_theme_BigFancyAdHiviTheme);
hivi_bfaa_BfaaHiviTheme.RESOLVED_STATE_EVENT = symbol_default()('RESOLVED_STATE_EVENT');
// CONCATENATED MODULE: ./src/ad-products/templates/uap/themes/hivi/hivi-bfab.ts


















var hivi_bfab_BfabHiviTheme =
/*#__PURE__*/
function (_BigFancyAdHiviTheme) {
  inherits_default()(BfabHiviTheme, _BigFancyAdHiviTheme);

  function BfabHiviTheme(adSlot, params) {
    var _this;

    classCallCheck_default()(this, BfabHiviTheme);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(BfabHiviTheme).call(this, adSlot, params));
    _this.stickiness = null;
    _this.video = null;
    _this.config = ad_engine_["context"].get('templates.bfab');
    return _this;
  }

  createClass_default()(BfabHiviTheme, [{
    key: "onAdReady",
    value: function onAdReady() {
      get_default()(getPrototypeOf_default()(BfabHiviTheme.prototype), "onAdReady", this).call(this);

      if (this.params.isSticky && this.config.stickinessAllowed) {
        this.addStickinessPlugin();
      }

      if (!this.config.defaultStateAllowed) {
        this.params.resolvedStateForced = true;
      }

      if (resolvedState.isResolvedState(this.params)) {
        this.setResolvedState();
      } else {
        resolvedStateSwitch.updateInformationAboutSeenDefaultStateAd();
        this.updateAdSizes();
        ad_engine_["slotTweaker"].makeResponsive(this.adSlot, this.params.config.aspectRatio.default);
      }
    }
    /**
     * @private
     */

  }, {
    key: "addStickinessPlugin",
    value: function () {
      var _addStickinessPlugin = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee() {
        var _this2 = this;

        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.waitForScrollAndUnstickedBfaa();

              case 2:
                if (!this.adSlot.isViewed()) {
                  this.addUnstickLogic();
                  this.addUnstickButton();
                  this.addUnstickEvents();
                  this.stickiness.run();
                  ad_engine_["scrollListener"].addCallback(function (event, id) {
                    var scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

                    if (scrollPosition <= _this2.config.unstickInstantlyBelowPosition) {
                      _this2.adSlot.emitEvent('top-conflict');

                      ad_engine_["scrollListener"].removeCallback(id);

                      _this2.stickiness.revertStickiness();
                    }
                  });
                }

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function addStickinessPlugin() {
        return _addStickinessPlugin.apply(this, arguments);
      }

      return addStickinessPlugin;
    }()
    /**
     * @private
     */

  }, {
    key: "waitForScrollAndUnstickedBfaa",
    value: function waitForScrollAndUnstickedBfaa() {
      var _this3 = this;

      var resolvePromise = null;
      var promise = new promise_default.a(function (resolve) {
        resolvePromise = resolve;
      });
      var bfaa = ad_engine_["slotService"].get(this.config.bfaaSlotName);
      ad_engine_["scrollListener"].addCallback(function (event, id) {
        if (_this3.adSlot.isViewed()) {
          ad_engine_["scrollListener"].removeCallback(id);
          return;
        }

        var scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        var slotPosition = ad_engine_["utils"].getTopOffset(_this3.adSlot.getElement());
        var isBfaaSticky = bfaa.getElement().classList.contains('sticky-bfaa');
        var bfaaHeight = bfaa.getElement().offsetHeight;

        if (isBfaaSticky && scrollPosition >= slotPosition - _this3.config.topThreshold - bfaaHeight) {
          ad_engine_["scrollListener"].removeCallback(id);

          _this3.adSlot.emitEvent('viewport-conflict');
        } else if (scrollPosition >= slotPosition - _this3.config.topThreshold && !isBfaaSticky) {
          ad_engine_["scrollListener"].removeCallback(id);
          resolvePromise();
        }
      });
      return promise;
    }
  }, {
    key: "onVideoReady",
    value: function onVideoReady(video) {
      var _this4 = this;

      this.video = video;
      video.addEventListener('wikiaAdStarted', function () {
        return _this4.updateAdSizes();
      });
      video.addEventListener('wikiaAdCompleted', function () {
        return _this4.setResolvedState();
      });
      video.addEventListener('wikiaFullscreenChange', function () {
        if (video.isFullscreen()) {
          _this4.stickiness.blockRevertStickiness();

          _this4.container.classList.add('theme-video-fullscreen');
        } else {
          _this4.stickiness.unblockRevertStickiness();

          _this4.container.classList.remove('theme-video-fullscreen');

          _this4.updateAdSizes();
        }
      });
    }
    /**
     * @private
     */

  }, {
    key: "updateAdSizes",
    value: function updateAdSizes() {
      var state = resolvedState.isResolvedState(this.params) ? 'resolved' : 'default';
      var stateHeight = this.params.config.state.height[state];
      var relativeHeight = this.params.container.offsetHeight * (stateHeight / 100);
      this.adjustVideoSize(relativeHeight);

      if (this.params.thumbnail) {
        this.setThumbnailStyle(state);
      }
    }
    /**
     * @private
     */

  }, {
    key: "adjustVideoSize",
    value: function adjustVideoSize(relativeHeight) {
      if (this.video && !this.video.isFullscreen()) {
        this.video.container.style.width = "".concat(this.params.videoAspectRatio * relativeHeight, "px");
      }
    }
    /**
     * @private
     */

  }, {
    key: "setResolvedState",
    value: function () {
      var _setResolvedState = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee2() {
        var _this$params, config, image2;

        return regenerator_default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$params = this.params, config = _this$params.config, image2 = _this$params.image2;
                this.container.classList.add('theme-resolved');
                image2.element.classList.remove('hidden-state');
                _context2.next = 5;
                return ad_engine_["slotTweaker"].makeResponsive(this.adSlot, config.aspectRatio.resolved);

              case 5:
                if (this.params.thumbnail) {
                  this.setThumbnailStyle('resolved');
                }

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setResolvedState() {
        return _setResolvedState.apply(this, arguments);
      }

      return setResolvedState;
    }()
    /**
     * @private
     */

  }, {
    key: "setThumbnailStyle",
    value: function setThumbnailStyle() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
      var thumbnail = this.params.thumbnail;

      var style = mapValues_default()(this.params.config.state, function (styleProperty) {
        return "".concat(styleProperty[state], "%");
      });

      assign_default()(thumbnail.style, style);

      if (this.video) {
        assign_default()(this.video.container.style, style);
      }
    }
    /**
     * @protected
     */

  }, {
    key: "getStateResolvedAndVideoViewed",
    value: function () {
      var _getStateResolvedAndVideoViewed = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee3() {
        return regenerator_default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return ad_engine_["utils"].wait(hivi_theme_BigFancyAdHiviTheme.DEFAULT_UNSTICK_DELAY);

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getStateResolvedAndVideoViewed() {
        return _getStateResolvedAndVideoViewed.apply(this, arguments);
      }

      return getStateResolvedAndVideoViewed;
    }()
    /**
     * @protected
     */

  }, {
    key: "onStickinessChange",
    value: function () {
      var _onStickinessChange = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee4(isSticky) {
        var element;
        return regenerator_default.a.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                element = this.adSlot.getElement();

                if (isSticky) {
                  _context4.next = 12;
                  break;
                }

                if (!(this.adSlot.getStatus() !== 'top-conflict')) {
                  _context4.next = 5;
                  break;
                }

                _context4.next = 5;
                return animate(this.adSlot.getElement(), CSS_CLASSNAME_SLIDE_OUT_ANIMATION, SLIDE_OUT_TIME);

              case 5:
                this.adSlot.emitEvent(stickiness_Stickiness.SLOT_UNSTICKED_STATE);
                element.style.top = null;
                element.parentNode.style.height = null;
                element.classList.remove(CSS_CLASSNAME_STICKY_BFAB);
                animate(this.adSlot.getElement(), CSS_CLASSNAME_FADE_IN_ANIMATION, FADE_IN_TIME);
                _context4.next = 16;
                break;

              case 12:
                this.adSlot.emitEvent(stickiness_Stickiness.SLOT_STICKED_STATE);
                element.parentNode.style.height = "".concat(element.offsetHeight, "px");
                element.classList.add(CSS_CLASSNAME_STICKY_BFAB);
                element.style.top = "".concat(this.config.topThreshold, "px");

              case 16:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function onStickinessChange(_x) {
        return _onStickinessChange.apply(this, arguments);
      }

      return onStickinessChange;
    }()
    /**
     * @protected
     */

  }, {
    key: "onCloseClicked",
    value: function onCloseClicked() {
      this.adSlot.emitEvent(ad_engine_["SlotTweaker"].SLOT_CLOSE_IMMEDIATELY);
      this.unstickImmediately();
      this.adSlot.getElement().parentNode.style.height = null;
      this.adSlot.disable();
      ad_engine_["slotTweaker"].hide(this.adSlot);
    }
    /**
     * @protected
     */

  }, {
    key: "unstickImmediately",
    value: function unstickImmediately() {
      var stopVideo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.stickiness) {
        this.adSlot.getElement().classList.remove(CSS_CLASSNAME_STICKY_BFAB);

        if (stopVideo && this.video && this.video.ima.getAdsManager()) {
          this.video.stop();
        }

        this.stickiness.sticky = false;
      }
    }
  }]);

  return BfabHiviTheme;
}(hivi_theme_BigFancyAdHiviTheme);
// CONCATENATED MODULE: ./src/ad-products/templates/uap/themes/classic/classic.ts













/**
 * @abstract
 */

var classic_BigFancyAdClassicTheme =
/*#__PURE__*/
function (_BigFancyAdTheme) {
  inherits_default()(BigFancyAdClassicTheme, _BigFancyAdTheme);

  function BigFancyAdClassicTheme() {
    classCallCheck_default()(this, BigFancyAdClassicTheme);

    return possibleConstructorReturn_default()(this, getPrototypeOf_default()(BigFancyAdClassicTheme).apply(this, arguments));
  }

  createClass_default()(BigFancyAdClassicTheme, [{
    key: "onAdReady",
    value: function onAdReady() {
      if (universalAdPackage.isVideoEnabled(this.params)) {
        var videoSettings = new video_settings_VideoSettings(this.params);

        if (videoSettings.isSplitLayout()) {
          var theme = videoSettings.getParams().splitLayoutVideoPosition === 'right' ? 'theme-split-right' : 'theme-split-left';
          this.params.container.classList.add(theme);
        } else if (!videoSettings.isAutoPlay()) {
          document.body.classList.add('ctp-vuap-loaded');
        }
      }
    }
  }, {
    key: "adIsReady",
    value: function () {
      var _adIsReady = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee(videoSettings) {
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return resolvedState.setImage(videoSettings);

              case 2:
                return _context.abrupt("return", ad_engine_["slotTweaker"].makeResponsive(this.adSlot, this.params.aspectRatio));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function adIsReady(_x) {
        return _adIsReady.apply(this, arguments);
      }

      return adIsReady;
    }()
  }]);

  return BigFancyAdClassicTheme;
}(theme_BigFancyAdTheme);

var classic_BfaaTheme =
/*#__PURE__*/
function (_BigFancyAdClassicThe) {
  inherits_default()(BfaaTheme, _BigFancyAdClassicThe);

  function BfaaTheme() {
    classCallCheck_default()(this, BfaaTheme);

    return possibleConstructorReturn_default()(this, getPrototypeOf_default()(BfaaTheme).apply(this, arguments));
  }

  createClass_default()(BfaaTheme, [{
    key: "onVideoReady",
    value: function onVideoReady(video) {
      var _this = this;

      if (!this.params.splitLayoutVideoPosition) {
        video.addEventListener('wikiaAdStarted', function () {
          _this.recalculatePaddingTop(_this.params.videoAspectRatio);
        });
        video.addEventListener('wikiaAdCompleted', function () {
          _this.recalculatePaddingTop(_this.params.aspectRatio);
        });
      }
    }
    /**
     * @private
     * @param finalAspectRatio
     */

  }, {
    key: "recalculatePaddingTop",
    value: function recalculatePaddingTop(finalAspectRatio) {
      var _this2 = this;

      this.config.mainContainer.style.paddingTop = "".concat(100 / finalAspectRatio, "%");
      this.container.style.height = "".concat(this.container.offsetHeight, "px"); // get offsetWidth from existing DOM element in order to force repaint

      this.container.style.height = "".concat(this.container.offsetWidth / finalAspectRatio, "px");
      setTimeout(function () {
        // clear height so ad is responsive again
        _this2.container.style.height = '';
      }, toggle_animation.duration);
    }
  }]);

  return BfaaTheme;
}(classic_BigFancyAdClassicTheme);
var classic_BfabTheme =
/*#__PURE__*/
function (_BigFancyAdClassicThe2) {
  inherits_default()(BfabTheme, _BigFancyAdClassicThe2);

  function BfabTheme() {
    classCallCheck_default()(this, BfabTheme);

    return possibleConstructorReturn_default()(this, getPrototypeOf_default()(BfabTheme).apply(this, arguments));
  }

  return BfabTheme;
}(classic_BigFancyAdClassicTheme);
// CONCATENATED MODULE: ./src/ad-products/templates/uap/themes/classic/index.ts

// CONCATENATED MODULE: ./src/ad-products/templates/uap/themes/factory.ts





var factory_BigFancyAdThemeFactory =
/*#__PURE__*/
function () {
  function BigFancyAdThemeFactory() {
    classCallCheck_default()(this, BigFancyAdThemeFactory);
  }

  createClass_default()(BigFancyAdThemeFactory, [{
    key: "makeAboveTheme",
    value: function makeAboveTheme(adSlot, params) {
      return params.theme === 'hivi' ? new hivi_bfaa_BfaaHiviTheme(adSlot, params) : new classic_BfaaTheme(adSlot, params);
    }
  }, {
    key: "makeBelowTheme",
    value: function makeBelowTheme(adSlot, params) {
      return params.theme === 'hivi' ? new hivi_bfab_BfabHiviTheme(adSlot, params) : new classic_BfabTheme(adSlot, params);
    }
  }]);

  return BigFancyAdThemeFactory;
}();
var bfaThemeFactory = new factory_BigFancyAdThemeFactory();
// CONCATENATED MODULE: ./src/ad-products/templates/uap/big-fancy-ad-above.ts










var big_fancy_ad_above_BigFancyAdAbove =
/*#__PURE__*/
function () {
  createClass_default()(BigFancyAdAbove, null, [{
    key: "getName",
    value: function getName() {
      return 'bfaa';
    }
  }, {
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        desktopNavbarWrapperSelector: '.wds-global-navigation-wrapper',
        mobileNavbarWrapperSelector: '.global-navigation-mobile-wrapper',
        mainContainer: document.body,
        handleNavbar: false,
        autoPlayAllowed: true,
        defaultStateAllowed: true,
        fullscreenAllowed: true,
        stickinessAllowed: true,
        slotSibling: '.topic-header',
        slotsToEnable: ['bottom_leaderboard', 'incontent_boxad', 'top_boxad'],
        onInit: function onInit() {},
        onBeforeStickBfaaCallback: function onBeforeStickBfaaCallback() {},
        onAfterStickBfaaCallback: function onAfterStickBfaaCallback() {},
        onBeforeUnstickBfaaCallback: function onBeforeUnstickBfaaCallback() {},
        onAfterUnstickBfaaCallback: function onAfterUnstickBfaaCallback() {},
        moveNavbar: function moveNavbar(offset) {
          var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SLIDE_OUT_TIME;
          var navbarElement = document.querySelector('body > nav.navigation');

          if (navbarElement) {
            navbarElement.style.transition = offset ? '' : "top ".concat(time, "ms ").concat(CSS_TIMING_EASE_IN_CUBIC);
            navbarElement.style.top = offset ? "".concat(offset, "px") : '';
          }
        }
      };
    }
    /**
     * Constructor
     *
     * @param {object} adSlot
     */

  }]);

  function BigFancyAdAbove(adSlot) {
    classCallCheck_default()(this, BigFancyAdAbove);

    this.adSlot = adSlot;
    this.config = ad_engine_["context"].get('templates.bfaa');
    this.container = document.getElementById(this.adSlot.getSlotName());
    this.videoSettings = null;
    this.theme = null;
  }
  /**
   * Initializes the BFAA unit
   */


  createClass_default()(BigFancyAdAbove, [{
    key: "init",
    value: function init(params) {
      var _this = this;

      this.params = params;

      if (!this.container) {
        return;
      } // TODO Remove this hack when all mobile apps support autoplay and fullscreen


      if (!this.config.autoPlayAllowed) {
        this.params.autoPlay = false;
        this.params.resolvedStateAutoPlay = false;
      }

      this.params.fullscreenAllowed = this.config.fullscreenAllowed; // TODO: End of hack

      universalAdPackage.init(this.params, this.config.slotsToEnable);
      this.videoSettings = new video_settings_VideoSettings(this.params);
      this.container.style.backgroundColor = this.getBackgroundColor();
      this.container.classList.add('bfaa-template');
      this.theme = bfaThemeFactory.makeAboveTheme(this.adSlot, this.params);
      this.theme.adIsReady(this.videoSettings).then(function (iframe) {
        return _this.onAdReady(iframe);
      });
      this.config.onInit(this.adSlot, this.params, this.config);
    }
  }, {
    key: "getBackgroundColor",
    value: function getBackgroundColor() {
      var color = "#".concat(this.params.backgroundColor.replace('#', ''));
      return this.params.backgroundColor ? color : '#000';
    }
  }, {
    key: "onAdReady",
    value: function () {
      var _onAdReady = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee(iframe) {
        var video;
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.config.mainContainer.style.paddingTop = iframe.parentElement.style.paddingBottom;
                this.config.mainContainer.classList.add('has-bfaa');
                navbarManager.setup(this.config, this.container);

                if (!document.hidden) {
                  _context.next = 6;
                  break;
                }

                _context.next = 6;
                return ad_engine_["utils"].once(window, 'visibilitychange');

              case 6:
                this.theme.onAdReady();

                if (!universalAdPackage.isVideoEnabled(this.params)) {
                  _context.next = 14;
                  break;
                }

                _context.next = 10;
                return ad_engine_["utils"].defer(universalAdPackage.loadVideoAd, this.videoSettings);

              case 10:
                video = _context.sent;
                this.theme.onVideoReady(video);
                _context.next = 17;
                break;

              case 14:
                if (!this.params.channelName) {
                  _context.next = 17;
                  break;
                }

                _context.next = 17;
                return ad_engine_["utils"].defer(universalAdPackage.loadTwitchAd, iframe, this.params);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onAdReady(_x) {
        return _onAdReady.apply(this, arguments);
      }

      return onAdReady;
    }()
  }]);

  return BigFancyAdAbove;
}();
// CONCATENATED MODULE: ./src/ad-products/templates/uap/big-fancy-ad-below.ts








var big_fancy_ad_below_BigFancyAdBelow =
/*#__PURE__*/
function () {
  createClass_default()(BigFancyAdBelow, null, [{
    key: "getName",
    value: function getName() {
      return 'bfab';
    }
  }, {
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        autoPlayAllowed: true,
        defaultStateAllowed: true,
        fullscreenAllowed: true,
        stickinessAllowed: false,
        bfaaSlotName: 'top_leaderboard',
        unstickInstantlyBelowPosition: 500,
        topThreshold: 58,
        onInit: function onInit() {}
      };
    }
    /**
     * Constructor
     *
     * @param {object} adSlot
     */

  }]);

  function BigFancyAdBelow(adSlot) {
    classCallCheck_default()(this, BigFancyAdBelow);

    this.adSlot = adSlot;
    this.config = ad_engine_["context"].get('templates.bfab');
    this.container = document.getElementById(this.adSlot.getSlotName());
    this.theme = null;
    this.videoSettings = null;
  }
  /**
   * Initializes the BFAB unit
   */


  createClass_default()(BigFancyAdBelow, [{
    key: "init",
    value: function init(params) {
      var _this = this;

      this.params = params;

      if (!this.container) {
        return;
      } // TODO Remove this hack when all mobile apps support autoplay and fullscreen


      if (!this.config.autoPlayAllowed) {
        this.params.autoPlay = false;
        this.params.resolvedStateAutoPlay = false;
      }

      this.params.fullscreenAllowed = this.config.fullscreenAllowed; // TODO: End of hack

      universalAdPackage.initSlot(params);
      this.container.classList.add('bfab-template');
      this.videoSettings = new video_settings_VideoSettings(params);
      this.theme = bfaThemeFactory.makeBelowTheme(this.adSlot, this.params);
      this.theme.adIsReady(this.videoSettings).then(function () {
        return _this.onAdReady();
      });
      this.config.onInit(this.adSlot, this.params, this.config);
    }
  }, {
    key: "onAdReady",
    value: function () {
      var _onAdReady = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee() {
        var video;
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!document.hidden) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return ad_engine_["utils"].once(window, 'visibilitychange');

              case 3:
                this.theme.onAdReady();

                if (!universalAdPackage.isVideoEnabled(this.params)) {
                  _context.next = 9;
                  break;
                }

                _context.next = 7;
                return ad_engine_["utils"].defer(universalAdPackage.loadVideoAd, this.videoSettings);

              case 7:
                video = _context.sent;
                this.theme.onVideoReady(video);

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onAdReady() {
        return _onAdReady.apply(this, arguments);
      }

      return onAdReady;
    }()
  }]);

  return BigFancyAdBelow;
}();
// CONCATENATED MODULE: ./src/ad-products/templates/uap/big-fancy-ad-in-player.ts




var big_fancy_ad_in_player_BigFancyAdInPlayer =
/*#__PURE__*/
function () {
  createClass_default()(BigFancyAdInPlayer, null, [{
    key: "getName",
    value: function getName() {
      return 'bfp';
    }
  }, {
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        slotsToDisable: [],
        slotsToEnable: []
      };
    }
  }]);

  function BigFancyAdInPlayer() {
    classCallCheck_default()(this, BigFancyAdInPlayer);

    this.config = ad_engine_["context"].get('templates.bfp');
  }
  /**
   * Initializes the BFP unit
   */


  createClass_default()(BigFancyAdInPlayer, [{
    key: "init",
    value: function init(params) {
      this.params = params;
      universalAdPackage.init(this.params, this.config.slotsToEnable, this.config.slotsToDisable);
    }
  }]);

  return BigFancyAdInPlayer;
}();
// CONCATENATED MODULE: ./src/ad-products/templates/uap/roadblock.ts




var roadblock_Roadblock =
/*#__PURE__*/
function () {
  createClass_default()(Roadblock, null, [{
    key: "getName",
    value: function getName() {
      return 'roadblock';
    }
  }, {
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        slotsToEnable: [],
        slotsToDisable: [],
        onInit: function onInit() {}
      };
    }
  }]);

  function Roadblock() {
    classCallCheck_default()(this, Roadblock);

    this.config = ad_engine_["context"].get('templates.roadblock');
  }
  /**
   * Initializes the Roadblock unit
   */


  createClass_default()(Roadblock, [{
    key: "init",
    value: function init(params) {
      this.params = params;
      this.params.adProduct = 'ruap';
      universalAdPackage.init(this.params, this.config.slotsToEnable, this.config.slotsToDisable);

      if (this.config.onInit) {
        this.config.onInit();
      }
    }
  }]);

  return Roadblock;
}();
// CONCATENATED MODULE: ./src/ad-products/templates/uap/index.ts






// CONCATENATED MODULE: ./src/ad-products/templates/out-of-page/floor-adhesion.ts




var floor_adhesion_FloorAdhesion =
/*#__PURE__*/
function () {
  createClass_default()(FloorAdhesion, null, [{
    key: "getName",
    value: function getName() {
      return 'floorAdhesion';
    }
  }, {
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        onInit: function onInit() {}
      };
    }
  }]);

  function FloorAdhesion(adSlot) {
    classCallCheck_default()(this, FloorAdhesion);

    this.adSlot = adSlot;
    this.config = ad_engine_["context"].get('templates.floorAdhesion');
  }

  createClass_default()(FloorAdhesion, [{
    key: "init",
    value: function init() {
      var _this = this;

      var wrapper = this.adSlot.getElement();
      var closeButton = new close_button_CloseButton({
        onClick: function onClick() {
          ad_engine_["slotTweaker"].hide(_this.adSlot);

          _this.adSlot.emitEvent(ad_engine_["SlotTweaker"].SLOT_CLOSE_IMMEDIATELY);

          ad_engine_["utils"].logger(FloorAdhesion.getName(), 'closed');
        }
      });
      this.config.onInit();
      wrapper.appendChild(closeButton.render());
      wrapper.classList.add('floor-adhesion');
      wrapper.classList.add('out-of-page-template');
      ad_engine_["slotTweaker"].adjustIframeByContentSize(this.adSlot);
      ad_engine_["utils"].logger(FloorAdhesion.getName(), 'init');
    }
  }]);

  return FloorAdhesion;
}();
// CONCATENATED MODULE: ./src/ad-products/templates/out-of-page/interstitial.ts





var interstitial_Interstitial =
/*#__PURE__*/
function () {
  createClass_default()(Interstitial, null, [{
    key: "getName",
    value: function getName() {
      return 'interstitial';
    }
  }, {
    key: "getDefaultConfig",
    value: function getDefaultConfig() {
      return {
        onInit: function onInit() {}
      };
    }
  }]);

  function Interstitial(adSlot) {
    classCallCheck_default()(this, Interstitial);

    this.adSlot = adSlot;
    this.config = ad_engine_["context"].get('templates.interstitial');
  }

  createClass_default()(Interstitial, [{
    key: "init",
    value: function init() {
      var _this = this;

      var wrapper = this.adSlot.getElement();
      var closeButton = new close_button_CloseButton({
        onClick: function onClick() {
          document.documentElement.classList.remove('stop-scrolling');
          ad_engine_["slotTweaker"].hide(_this.adSlot);

          _this.adSlot.emitEvent(ad_engine_["SlotTweaker"].SLOT_CLOSE_IMMEDIATELY);

          ad_engine_["utils"].logger(Interstitial.getName(), 'closed');
        }
      });
      var label = new advertisement_label_AdvertisementLabel();
      this.config.onInit();
      wrapper.appendChild(closeButton.render());
      wrapper.appendChild(label.render());
      wrapper.classList.add('interstitial');
      wrapper.classList.add('out-of-page-template');
      document.documentElement.classList.add('stop-scrolling');
      ad_engine_["slotTweaker"].adjustIframeByContentSize(this.adSlot);
      ad_engine_["utils"].logger(Interstitial.getName(), 'init');
      ad_engine_["events"].once(ad_engine_["events"].BEFORE_PAGE_CHANGE_EVENT, function () {
        document.documentElement.classList.remove('stop-scrolling');
      });
    }
  }]);

  return Interstitial;
}();
// CONCATENATED MODULE: ./src/ad-products/templates/out-of-page/index.ts


// CONCATENATED MODULE: ./src/ad-products/templates/outstream/index.ts

// CONCATENATED MODULE: ./src/ad-products/templates/index.ts







// EXTERNAL MODULE: external "js-cookie"
var external_js_cookie_ = __webpack_require__(21);
var external_js_cookie_default = /*#__PURE__*/__webpack_require__.n(external_js_cookie_);

// CONCATENATED MODULE: ./src/ad-products/tracking/video/player-event-emitter.ts

ad_engine_["events"].registerEvent('VIDEO_PLAYER_TRACKING_EVENT');
/* harmony default export */ var player_event_emitter = ({
  /**
   * Emit single event
   * @param {object} eventInfo
   * @returns {void}
   */
  emit: function emit(eventInfo) {
    if (!ad_engine_["context"].get('options.tracking.kikimora.player')) {
      return;
    }

    if (!eventInfo.ad_product || !eventInfo.player || !eventInfo.event_name) {
      return;
    }

    ad_engine_["events"].emit(ad_engine_["events"].VIDEO_PLAYER_TRACKING_EVENT, eventInfo);
  }
});
// CONCATENATED MODULE: ./src/ad-products/tracking/video/video-event-data-provider.ts

/* harmony default export */ var video_event_data_provider = ({
  /**
   * Prepares data object for video events tracking
   * @param {object} videoData
   * @param {string} videoData.ad_product
   * @param {string} videoData.event_name
   * @param {string} videoData.player
   * @param {string} videoData.position
   * @param {string} [videoData.ad_error_code]
   * @param {string} [videoData.audio]
   * @param {string} [videoData.content_type]
   * @param {string} [videoData.creative_id]
   * @param {string} [videoData.ctp]
   * @param {string} [videoData.line_item_id]
   * @param {string} [videoData.user_block_autoplay]
   * @param {string} [videoData.video_id]
   * @returns {object}
   */
  getEventData: function getEventData(videoData) {
    var now = new Date();
    var slot = ad_engine_["slotService"].get(videoData.position);
    return {
      ad_error_code: videoData.ad_error_code,
      ad_product: videoData.ad_product,
      audio: videoData.audio ? 1 : 0,
      browser: "".concat(ad_engine_["utils"].client.getOperatingSystem(), " ").concat(ad_engine_["utils"].client.getBrowser()),
      content_type: videoData.content_type || '',
      country: ad_engine_["utils"].getCountryCode() || '',
      creative_id: videoData.creative_id || '',
      ctp: videoData.ctp ? 1 : 0,
      document_visibility: ad_engine_["utils"].getDocumentVisibilityStatus(),
      event_name: videoData.event_name,
      line_item_id: videoData.line_item_id || '',
      player: videoData.player,
      position: slot.getSlotName().toLowerCase(),
      pv_number: ad_engine_["context"].get('options.pvNumber') || window.pvNumber || -1,
      price: '',
      skin: ad_engine_["context"].get('targeting.skin'),
      timestamp: now.getTime(),
      tz_offset: now.getTimezoneOffset(),
      user_block_autoplay: videoData.user_block_autoplay || '',
      video_id: videoData.video_id || '',
      wsi: slot.targeting.wsi || ''
    };
  }
});
// CONCATENATED MODULE: ./src/ad-products/tracking/video/jwplayer-tracker.ts







var trackingEventsMap = {
  ready: 'ready',
  adBlock: 'blocked',
  adClick: 'clicked',
  adRequest: 'loaded',
  adError: 'error',
  adImpression: 'impression',
  adStarted: 'started',
  adViewableImpression: 'viewable_impression',
  adFirstQuartile: 'first_quartile',
  adMidPoint: 'midpoint',
  adThirdQuartile: 'third_quartile',
  adComplete: 'completed',
  adSkipped: 'skipped',
  videoStart: 'content_started',
  complete: 'content_completed'
};
/**
 * Ads tracker for JWPlayer
 */

var jwplayer_tracker_JWPlayerTracker =
/*#__PURE__*/
function () {
  /**
   * @param {Object} params
   */
  function JWPlayerTracker() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    classCallCheck_default()(this, JWPlayerTracker);

    this.adProduct = params.adProduct || null;
    this.audio = params.audio || false;
    this.contentType = null;
    this.creativeId = null;
    this.ctp = params.ctp || false;
    this.isCtpAudioUpdateEnabled = true;
    this.lineItemId = null;
    this.slotName = params.slotName;
    this.userBlockAutoplay = params.userBlockAutoplay || null;
    this.videoId = params.videoId || null;
    this.emit('setup');
  }
  /**
   * Update withCtp and withAudio based on player and slot
   *
   * @param {AdSlot | null} slot
   */


  createClass_default()(JWPlayerTracker, [{
    key: "updatePlayerState",
    value: function updatePlayerState() {
      var slot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (slot && slot.config.autoplay !== undefined && slot.config.audio !== undefined) {
        this.ctp = !slot.config.autoplay;
        this.audio = slot.config.audio;
        this.isCtpAudioUpdateEnabled = false;
      } else {
        this.ctp = !this.playerInstance.getConfig().autostart;
        this.audio = !this.playerInstance.getMute();
      }
    }
    /**
     * @returns {void}
     */

  }, {
    key: "updateVideoId",
    value: function updateVideoId() {
      var playlistItem = this.playerInstance.getPlaylist();
      var playlistIndex = this.playerInstance.getPlaylistIndex();
      this.videoId = playlistItem[playlistIndex].mediaid;
    }
    /**
     * Update creative details
     * @param {Object} params
     * @returns {void}
     */

  }, {
    key: "updateCreativeData",
    value: function updateCreativeData() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.lineItemId = params.lineItemId;
      this.creativeId = params.creativeId;
      this.contentType = params.contentType;
    }
    /**
     * Register event listeners on player
     * @param {Object} player
     * @returns {void}
     */

  }, {
    key: "register",
    value: function register(player) {
      var _this = this;

      this.playerInstance = player;
      this.updateVideoId();
      this.emit('init');
      player.on('videoStart', function () {
        _this.updateCreativeData();
      });
      player.on('adRequest', function (event) {
        var currentAd = ad_engine_["vastParser"].getAdInfo(event.ima && event.ima.ad);

        _this.updateCreativeData(currentAd);
      });
      this.updatePlayerState();

      keys_default()(trackingEventsMap).forEach(function (playerEvent) {
        player.on(playerEvent, function (event) {
          var errorCode;

          if (['adRequest', 'adError', 'ready', 'videoStart'].indexOf(playerEvent) !== -1 && _this.isCtpAudioUpdateEnabled) {
            var slot = ad_engine_["slotService"].get(_this.slotName);

            _this.updatePlayerState(slot);
          }

          if (playerEvent === 'adError') {
            errorCode = event && event.code;
          }

          _this.emit(trackingEventsMap[playerEvent], errorCode); // Disable updating ctp and audio on video completed event
          // It is a failsafe for the case where updating
          // has not been disabled by calling updatePlayerState with VAST params


          if (playerEvent === 'complete') {
            _this.isCtpAudioUpdateEnabled = false;
            _this.ctp = false;
          }
        });
      });

      player.on('adError', function () {
        _this.updateCreativeData();
      });
    }
    /**
     * Dispatch single event
     * @param {string} eventName
     * @param {int} errorCode
     * @returns {void}
     */

  }, {
    key: "emit",
    value: function emit(eventName) {
      var errorCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      this.userBlockAutoplay = -1;
      var featuredVideoAutoplayCookie = external_js_cookie_default.a.get('featuredVideoAutoplay');

      if (['0', '1'].indexOf(featuredVideoAutoplayCookie) > -1) {
        this.userBlockAutoplay = featuredVideoAutoplayCookie === '0' ? 1 : 0;
      }

      var eventInfo = video_event_data_provider.getEventData({
        ad_error_code: errorCode,
        ad_product: this.adProduct,
        audio: this.audio,
        content_type: this.contentType,
        creative_id: this.creativeId,
        ctp: this.ctp,
        event_name: eventName,
        line_item_id: this.lineItemId,
        player: JWPlayerTracker.PLAYER_NAME,
        position: this.slotName,
        user_block_autoplay: this.userBlockAutoplay,
        video_id: this.videoId
      });
      player_event_emitter.emit(eventInfo);
    }
  }]);

  return JWPlayerTracker;
}();
jwplayer_tracker_JWPlayerTracker.PLAYER_NAME = 'jwplayer';
// CONCATENATED MODULE: ./src/ad-products/tracking/video/porvata-tracker.ts





/**
 * Ads tracker for Porvata
 */

var porvata_tracker_PorvataTracker =
/*#__PURE__*/
function () {
  function PorvataTracker() {
    classCallCheck_default()(this, PorvataTracker);
  }

  createClass_default()(PorvataTracker, [{
    key: "register",

    /**
     * Register event listeners on player
     * @returns {void}
     */
    value: function register() {
      var listener = {
        /**
         * Porvata event callback
         * @param {string} eventName
         * @param {Object} playerParams
         * @param {Object} data
         * @returns {void}
         */
        onEvent: function onEvent(eventName, playerParams, data) {
          var eventInfo = video_event_data_provider.getEventData(data);
          player_event_emitter.emit(eventInfo);
        }
      };
      ad_engine_["context"].push('listeners.porvata', listener);
    }
    /**
     * Dispatch single event
     * @param {string} eventName
     * @param {int} errorCode
     * @returns {void}
     */

  }, {
    key: "emit",
    value: function emit(eventName) {
      var errorCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      video_event_data_provider.emit(eventName, errorCode);
    }
  }]);

  return PorvataTracker;
}();

var porvataTracker = new porvata_tracker_PorvataTracker();
// CONCATENATED MODULE: ./src/ad-products/tracking/video/twitch-tracker.ts





/**
 * Ads tracker for Twitch
 */

var twitch_tracker_TwitchTracker =
/*#__PURE__*/
function () {
  function TwitchTracker() {
    classCallCheck_default()(this, TwitchTracker);
  }

  createClass_default()(TwitchTracker, [{
    key: "register",

    /**
     * Register event listeners on player
     * @returns {void}
     */
    value: function register() {
      var listener = {
        /**
         * Twitch event callback
         * @param {string} eventName
         * @param {Object} playerParams
         * @param {Object} data
         * @returns {void}
         */
        onEvent: function onEvent(eventName, playerParams, data) {
          var eventInfo = video_event_data_provider.getEventData(data);
          player_event_emitter.emit(eventInfo);
        }
      };
      ad_engine_["context"].push('listeners.twitch', listener);
    }
    /**
     * Dispatch single event
     * @param {string} eventName
     * @param {int} errorCode
     * @returns {void}
     */

  }, {
    key: "emit",
    value: function emit(eventName) {
      var errorCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      video_event_data_provider.emit(eventName, errorCode);
    }
  }]);

  return TwitchTracker;
}();
var twitchTracker = new twitch_tracker_TwitchTracker();
// CONCATENATED MODULE: ./src/ad-products/tracking/index.ts



// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/parse-float"
var parse_float_ = __webpack_require__(20);
var parse_float_default = /*#__PURE__*/__webpack_require__.n(parse_float_);

// CONCATENATED MODULE: ./src/ad-products/video/featured-video-f15s.ts

var featured_video_f15s_logGroup = 'featured-video-f15s';
/* harmony default export */ var featured_video_f15s = ({
  /**
   * Checks if for given video we want the f15s experiment to be enabled
   *
   * @param {string} videoId a unique mediaId from JWPlayer instance
   * @returns {boolean}
   */
  isEnabled: function isEnabled(videoId) {
    if (!ad_engine_["context"].get('options.featuredVideo15sEnabled')) {
      return false;
    }

    var adTime = this.getTime(videoId);
    ad_engine_["utils"].logger(featured_video_f15s_logGroup, 'isEnabled (video id, time, enabled?)', videoId, adTime, !!adTime);
    return !!adTime;
  },

  /**
   * Returns time for an ad from the configuration
   *
   * @param {string} videoId a unique mediaId from JWPlayer instance
   * @returns {*}
   */
  getTime: function getTime(videoId) {
    return ad_engine_["context"].get("options.featuredVideo15sMap.".concat(videoId));
  }
});
// CONCATENATED MODULE: ./src/ad-products/video/jwplayer-ads-factory.ts





var vastUrls = {
  last: null,
  preroll: null,
  midroll: null,
  postroll: null
}; // 21009	VAST_EMPTY_RESPONSE

var EMPTY_VAST_CODE = 21009;

var jwplayer_ads_factory_log = function log() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return ad_engine_["utils"].logger.apply(ad_engine_["utils"], ['jwplayer-ads-factory'].concat(args));
};
/**
 * Calculate depth
 *
 * @param {number} depth
 * @returns {number}
 */


function calculateRV(depth) {
  var capping = ad_engine_["context"].get('options.video.adsOnNextVideoFrequency');
  return depth < 2 || !capping ? 1 : Math.floor((depth - 1) / capping) + 1;
}
/**
 * @param {number} depth
 * @returns {boolean}
 */


function shouldPlayAdOnNextVideo(depth) {
  var capping = ad_engine_["context"].get('options.video.adsOnNextVideoFrequency');
  return ad_engine_["context"].get('options.video.playAdsOnNextVideo') && capping > 0 && (depth - 1) % capping === 0;
}
/**
 * @param {number} depth
 * @returns {boolean}
 */


function canAdBePlayed(depth) {
  var isReplay = depth > 1;
  return !isReplay || isReplay && shouldPlayAdOnNextVideo(depth);
}
/**
 * @param {number} videoDepth
 * @returns {boolean}
 */


function shouldPlayPreroll(videoDepth) {
  return canAdBePlayed(videoDepth);
}
/**
 * @param {number} videoDepth
 * @returns {boolean}
 */


function shouldPlayMidroll(videoDepth) {
  return ad_engine_["context"].get('options.video.isMidrollEnabled') && canAdBePlayed(videoDepth);
}
/**
 * @param {number} videoDepth
 * @returns {boolean}
 */


function shouldPlayPostroll(videoDepth) {
  return ad_engine_["context"].get('options.video.isPostrollEnabled') && canAdBePlayed(videoDepth);
}
/**
 * @param {string} placement
 * @param {string} vastUrl
 * @returns {void}
 */


function setCurrentVast(placement, vastUrl) {
  vastUrls[placement] = vastUrl;
  vastUrls.last = vastUrl;
}
/**
 * @param {string} placement
 * @returns {string}
 */


function getCurrentVast(placement) {
  return vastUrls[placement] || vastUrls.last;
}
/**
 * @param {Object} slot
 * @param {string} position
 * @param {number} depth
 * @param {number} correlator
 * @param {Object} slotTargeting
 * @returns {string}
 */


function getVastUrl(slot, position, depth, correlator, slotTargeting) {
  return Object(ad_engine_["buildVastUrl"])(16 / 9, slot.getSlotName(), {
    correlator: correlator,
    vpos: position,
    targeting: assign_default()({
      passback: 'jwplayer',
      rv: calculateRV(depth)
    }, slotTargeting)
  });
}
/**
 * @param {Object} adSlot
 * @param {Object} vastParams
 */


function updateSlotParams(adSlot, vastParams) {
  adSlot.lineItemId = vastParams.lineItemId;
  adSlot.creativeId = vastParams.creativeId;
  adSlot.creativeSize = vastParams.size;
}
/**
 * Creates instance with ads schedule and tracking for JWPlayer
 * @param options
 * @param options.adProduct Base ad product name
 * @param options.slotName Slot name for video ads
 * @param [options.audio] Initial state of audio of created player
 * @param [options.autoplay] Initial state of autoplay of created player
 * @param [options.featured] Decides about ad slot used in the video
 * @param [options.videoId] Id of initialized video
 * @returns {{register: register}}
 */


function create(options) {
  function register(player) {
    var slotTargeting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var slot = ad_engine_["slotService"].get(slotName);
    var adProduct = slot.config.trackingKey;
    var videoElement = player && player.getContainer && player.getContainer();
    var videoContainer = videoElement && videoElement.parentNode;
    var targeting = slotTargeting;
    var correlator;
    var depth = 0;
    var prerollPositionReached = false; // the flag is needed to avoid playing the same mid-roll
    // in the very same second, so there is no race condition
    // in JWPlayer when removing ad layer and going back to the video
    // player.off('time') solves it but it also unregisters other event handlers

    var f15sMidrollPlayed = false;
    /** @type {string} */

    var lastBrokenAdPlayId = null;
    slot.element = videoContainer;
    slot.setConfigProperty('audio', !player.getMute());
    slot.setConfigProperty('autoplay', player.getConfig().autostart);

    if (ad_engine_["context"].get('options.video.moatTracking.enabledForArticleVideos')) {
      var partnerCode = ad_engine_["context"].get('options.video.moatTracking.articleVideosPartnerCode') || ad_engine_["context"].get('options.video.moatTracking.partnerCode');
      player.on('adImpression', function (event) {
        if (window.moatjw) {
          window.moatjw.add({
            adImpressionEvent: event,
            partnerCode: partnerCode,
            player: player
          });
        }
      });
    }

    player.on('adBlock', function () {
      tracker.adProduct = adProduct;
    });
    player.on('beforePlay', function () {
      var currentMedia = player.getPlaylistItem() || {};
      targeting.v1 = currentMedia.mediaid;
      tracker.updateVideoId();

      if (prerollPositionReached) {
        return;
      }

      correlator = Math.round(Math.random() * 10000000000);
      depth += 1;
      slot.setConfigProperty('audio', !player.getMute());
      slot.setConfigProperty('videoDepth', depth);

      if (featured_video_f15s.isEnabled(currentMedia.mediaid)) {
        prerollPositionReached = true;
        return;
      }

      if (shouldPlayPreroll(depth)) {
        tracker.adProduct = "".concat(adProduct, "-preroll");
        /**
         * Fill in slot handle
         * @returns {void}
         */

        var fillInSlot = function fillInSlot() {
          var vastUrl = getVastUrl(slot, 'preroll', depth, correlator, targeting);
          setCurrentVast('preroll', vastUrl);
          player.playAd(vastUrl);
        };

        if (options.featured) {
          fillInSlot();
        } else {
          ad_engine_["btfBlockerService"].push(slot, fillInSlot);
        }
      }

      prerollPositionReached = true;
    });
    player.on('videoMidPoint', function () {
      if (shouldPlayMidroll(depth)) {
        var vastUrl = getVastUrl(slot, 'midroll', depth, correlator, targeting);
        tracker.adProduct = "".concat(adProduct, "-midroll");
        slot.setConfigProperty('audio', !player.getMute());
        setCurrentVast('midroll', vastUrl);
        player.playAd(vastUrl);
      }
    });
    player.on('beforeComplete', function () {
      if (shouldPlayPostroll(depth)) {
        var vastUrl = getVastUrl(slot, 'postroll', depth, correlator, targeting);
        tracker.adProduct = "".concat(adProduct, "-postroll");
        slot.setConfigProperty('audio', !player.getMute());
        setCurrentVast('postroll', vastUrl);
        player.playAd(vastUrl);
      }
    });
    player.on('time', function (data) {
      var currentMedia = player.getPlaylistItem() || {};

      if (f15sMidrollPlayed) {
        return;
      }

      if (!featured_video_f15s.isEnabled(currentMedia.mediaid)) {
        return;
      }

      var currentTime = data.currentTime;

      var f15sTime = parse_float_default()(featured_video_f15s.getTime(currentMedia.mediaid));

      if (currentTime >= f15sTime && !f15sMidrollPlayed) {
        var vastUrl = getVastUrl(slot, 'midroll', depth, correlator, targeting);
        tracker.adProduct = "".concat(adProduct, "-midroll");
        slot.setConfigProperty('audio', !player.getMute());
        setCurrentVast('midroll', vastUrl);
        player.playAd(vastUrl);
        f15sMidrollPlayed = true;
      }
    });
    player.on('complete', function () {
      prerollPositionReached = false;
      tracker.adProduct = adProduct;
    });
    player.on('adRequest', function (event) {
      var vastParams = ad_engine_["vastParser"].parse(event.tag, {
        imaAd: event.ima && event.ima.ad
      });
      ad_engine_["vastDebugger"].setVastAttributesFromVastParams(videoContainer, 'success', vastParams);
      ad_engine_["events"].emit(ad_engine_["events"].VIDEO_AD_REQUESTED, slot);
    });
    player.on('adImpression', function (event) {
      var vastParams = ad_engine_["vastParser"].parse(event.tag, {
        imaAd: event.ima && event.ima.ad
      });
      updateSlotParams(slot, vastParams);
      slot.setStatus(ad_engine_["AdSlot"].STATUS_SUCCESS);
      ad_engine_["events"].emit(ad_engine_["events"].VIDEO_AD_IMPRESSION, slot);
    });
    player.on('adError', function (event) {
      var vastParams = ad_engine_["vastParser"].parse(event.tag, {
        imaAd: event.ima && event.ima.ad
      });
      var adPlayId = event.adPlayId; // JWPlayer can fire adError multiple times for the same ad

      if (adPlayId && adPlayId === lastBrokenAdPlayId) {
        return;
      }

      lastBrokenAdPlayId = adPlayId;
      jwplayer_ads_factory_log("ad error message: ".concat(event.message));
      updateSlotParams(slot, vastParams);
      ad_engine_["vastDebugger"].setVastAttributesFromVastParams(videoContainer, 'error', vastParams);

      if (event.adErrorCode === EMPTY_VAST_CODE) {
        slot.setStatus(ad_engine_["AdSlot"].STATUS_COLLAPSE);
      } else {
        slot.setStatus(ad_engine_["AdSlot"].STATUS_ERROR);
      }

      ad_engine_["events"].emit(ad_engine_["events"].VIDEO_AD_ERROR, slot);
    });

    if (ad_engine_["context"].get('options.wad.hmdRec.enabled')) {
      document.addEventListener('hdPlayerEvent', function (event) {
        if (event.detail.slotStatus) {
          updateSlotParams(slot, event.detail.slotStatus.vastParams);
          slot.setStatus(event.detail.slotStatus.statusName);
        }

        if (event.detail.name) {
          tracker.emit(event.detail.name, event.detail.errorCode);
        }
      });
    }

    tracker.register(player);
  }

  var slotName = options.slotName || (options.featured ? 'featured' : 'video');
  var slot = ad_engine_["slotService"].get(slotName) || new ad_engine_["AdSlot"]({
    id: slotName
  });

  if (!ad_engine_["slotService"].get(slotName)) {
    ad_engine_["slotService"].add(slot);
  }

  var tracker = new jwplayer_tracker_JWPlayerTracker({
    adProduct: slot.config.trackingKey,
    audio: options.audio,
    ctp: !options.autoplay,
    slotName: slotName,
    videoId: options.videoId
  });
  return {
    register: register
  };
}

function loadMoatPlugin() {
  ad_engine_["utils"].scriptLoader.loadScript(ad_engine_["context"].get('options.video.moatTracking.jwplayerPluginUrl'));
}

var jwplayerAdsFactory = {
  create: create,
  getCurrentVast: getCurrentVast,
  loadMoatPlugin: loadMoatPlugin
};
// CONCATENATED MODULE: ./src/ad-products/video/index.ts

// CONCATENATED MODULE: ./src/ad-products/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "getAdProductInfo", function() { return getAdProductInfo; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "FloatingRail", function() { return floating_rail_FloatingRail; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Skin", function() { return skin_Skin; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "StickyAd", function() { return sticky_ad_StickyAd; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "StickyTLB", function() { return sticky_tlb_StickyTLB; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "universalAdPackage", function() { return universalAdPackage; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "resolvedState", function() { return resolvedState; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "BigFancyAdAbove", function() { return big_fancy_ad_above_BigFancyAdAbove; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "BigFancyAdBelow", function() { return big_fancy_ad_below_BigFancyAdBelow; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "BigFancyAdInPlayer", function() { return big_fancy_ad_in_player_BigFancyAdInPlayer; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Roadblock", function() { return roadblock_Roadblock; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "FloorAdhesion", function() { return floor_adhesion_FloorAdhesion; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Interstitial", function() { return interstitial_Interstitial; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "DEFAULT_VIDEO_ASPECT_RATIO", function() { return DEFAULT_VIDEO_ASPECT_RATIO; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "IMA_VPAID_INSECURE_MODE", function() { return IMA_VPAID_INSECURE_MODE; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "PorvataTemplate", function() { return porvata_template_PorvataTemplate; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "JWPlayerTracker", function() { return jwplayer_tracker_JWPlayerTracker; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "porvataTracker", function() { return porvataTracker; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "TwitchTracker", function() { return twitch_tracker_TwitchTracker; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "twitchTracker", function() { return twitchTracker; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "jwplayerAdsFactory", function() { return jwplayerAdsFactory; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "utils", function() { return utils_namespaceObject; });








/***/ }),
/* 30 */,
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=ad-products.js.map