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
/******/ 	return __webpack_require__(__webpack_require__.s = 54);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/classCallCheck"
var classCallCheck_ = __webpack_require__(2);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/createClass"
var createClass_ = __webpack_require__(3);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass_);

// EXTERNAL MODULE: external "blockadblock"
var external_blockadblock_ = __webpack_require__(52);
var external_blockadblock_default = /*#__PURE__*/__webpack_require__.n(external_blockadblock_);

// EXTERNAL MODULE: external "current-device"
var external_current_device_ = __webpack_require__(39);
var external_current_device_default = /*#__PURE__*/__webpack_require__.n(external_current_device_);

// CONCATENATED MODULE: ./src/ad-engine/utils/client.ts



/* global BlockAdBlock */


var bab = null;
var browser = null;
var operatingSystem = null;

var client_Client =
/*#__PURE__*/
function () {
  function Client() {
    classCallCheck_default()(this, Client);
  }

  createClass_default()(Client, [{
    key: "isSmartphone",
    value: function isSmartphone() {
      return external_current_device_default.a.mobile();
    }
  }, {
    key: "isTablet",
    value: function isTablet() {
      return external_current_device_default.a.tablet();
    }
  }, {
    key: "isDesktop",
    value: function isDesktop() {
      return !this.isSmartphone() && !this.isTablet();
    }
  }, {
    key: "checkBlocking",
    value: function checkBlocking() {
      var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var disabled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (bab === null) {
        if (typeof external_blockadblock_default.a === 'undefined' || typeof BlockAdBlock === 'undefined') {
          if (enabled !== null) enabled();
          return;
        }

        bab = new BlockAdBlock({
          checkOnLoad: false,
          resetOnEnd: true,
          loopCheckTime: 50,
          loopMaxNumber: 5
        });
      }

      if (enabled !== null) bab.onDetected(enabled);
      if (disabled !== null) bab.onNotDetected(disabled);
      bab.check(true);
    }
  }, {
    key: "getDeviceType",
    value: function getDeviceType() {
      if (this.isTablet()) {
        return 'tablet';
      }

      if (this.isSmartphone()) {
        return 'smartphone';
      }

      return 'desktop';
    }
  }, {
    key: "getOperatingSystem",
    value: function getOperatingSystem() {
      if (operatingSystem !== null) {
        return operatingSystem;
      }

      var userAgent = window.navigator.userAgent;
      operatingSystem = 'unknown';

      if (userAgent.indexOf('Win') !== -1) {
        operatingSystem = 'Windows';
      }

      if (userAgent.indexOf('Mac') !== -1) {
        operatingSystem = 'OSX';
      }

      if (userAgent.indexOf('Linux') !== -1) {
        operatingSystem = 'Linux';
      }

      if (userAgent.indexOf('Android') !== -1) {
        operatingSystem = 'Android';
      }

      if (userAgent.indexOf('like Mac') !== -1) {
        operatingSystem = 'iOS';
      }

      return operatingSystem;
    }
  }, {
    key: "getBrowser",
    value: function getBrowser() {
      if (browser !== null) {
        return browser;
      }

      var _window$navigator = window.navigator,
          appName = _window$navigator.appName,
          appVersion = _window$navigator.appVersion,
          userAgent = _window$navigator.userAgent;
      var temp;
      var matches = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

      if (/trident/i.test(matches[1])) {
        temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
        browser = "IE ".concat(temp[1] || '');
        return browser;
      }

      if (matches[1] === 'Chrome') {
        temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/);

        if (temp !== null) {
          browser = temp.slice(1).join(' ').replace('OPR', 'Opera');
          return browser;
        }
      }

      matches = matches[2] ? [matches[1], matches[2]] : [appName, appVersion, '-?'];
      temp = userAgent.match(/version\/(\d+)/i);

      if (temp !== null) {
        matches.splice(1, 1, temp[1]);
      }

      browser = matches.join(' ');
      return browser;
    }
  }]);

  return Client;
}();

var client = new client_Client();
// EXTERNAL MODULE: ./src/ad-engine/utils/dimensions.ts
var dimensions = __webpack_require__(16);

// CONCATENATED MODULE: ./src/ad-engine/utils/document.ts
var VISIBILITY_STATUS = {
  visible: 'visible',
  hidden: 'hidden',
  notImplemented: 'not_implemented'
};
/**
 * Returns document visibility status.
 *
 * @returns {string} 'visible'|'hidden'|'notImplemented'
 */

function getDocumentVisibilityStatus() {
  var status;

  switch (document.hidden) {
    case true:
      status = VISIBILITY_STATUS.hidden;
      break;

    case false:
      status = VISIBILITY_STATUS.visible;
      break;

    default:
      status = VISIBILITY_STATUS.notImplemented;
  }

  return status;
}
// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/objectSpread"
var objectSpread_ = __webpack_require__(24);
var objectSpread_default = /*#__PURE__*/__webpack_require__.n(objectSpread_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/typeof"
var typeof_ = __webpack_require__(51);
var typeof_default = /*#__PURE__*/__webpack_require__.n(typeof_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/promise"
var promise_ = __webpack_require__(6);
var promise_default = /*#__PURE__*/__webpack_require__.n(promise_);

// CONCATENATED MODULE: ./src/ad-engine/utils/flow-control.ts



var flow_control_wait = function wait() {
  var milliseconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return new promise_default.a(function (resolve, reject) {
    if (typeof milliseconds !== 'number') {
      reject(new Error('Delay value must be a number.'));
      return;
    }

    setTimeout(resolve, milliseconds);
  });
};
var flow_control_defer = function defer(fn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return new promise_default.a(function (resolve, reject) {
    if (typeof fn !== 'function') {
      reject(new Error('Expected a function.'));
      return;
    }

    setTimeout(function () {
      return resolve(fn.apply(void 0, args));
    }, 0);
  });
};
function once(emitter, eventName) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var isObject = typeof_default()(emitter) === 'object';
  var hasAddEventListener = isObject && typeof emitter.addEventListener === 'function';
  var hasOnce = isObject && typeof emitter.once === 'function';
  return new promise_default.a(function (resolve, reject) {
    if (typeof options === 'boolean') {
      options = {
        capture: options
      };
    }

    if (hasOnce) {
      emitter.once(eventName, resolve);
    } else if (hasAddEventListener) {
      emitter.addEventListener(eventName, resolve, objectSpread_default()({}, options, {
        once: true
      }));
    } else {
      reject(new Error('Emitter does not have `addEventListener` nor `once` method.'));
    }
  });
}
/**
 * @param {number} msToTimeout
 * @returns {Promise}
 */

function timeoutReject(msToTimeout) {
  return new promise_default.a(function (resolve, reject) {
    setTimeout(reject, msToTimeout);
  });
}
/**
 * Fires the Promise if function is fulfilled or timeout is reached
 * @param {function} func
 * @param {number} msToTimeout
 * @returns {Promise}
 */

function createWithTimeout(func) {
  var msToTimeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
  return promise_default.a.race([new promise_default.a(func), timeoutReject(msToTimeout)]);
}
// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/json/stringify"
var stringify_ = __webpack_require__(12);
var stringify_default = /*#__PURE__*/__webpack_require__.n(stringify_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/keys"
var keys_ = __webpack_require__(5);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/parse-float"
var parse_float_ = __webpack_require__(50);
var parse_float_default = /*#__PURE__*/__webpack_require__.n(parse_float_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/slicedToArray"
var slicedToArray_ = __webpack_require__(11);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray_);

// EXTERNAL MODULE: external "js-cookie"
var external_js_cookie_ = __webpack_require__(27);
var external_js_cookie_default = /*#__PURE__*/__webpack_require__.n(external_js_cookie_);

// EXTERNAL MODULE: ./src/ad-engine/services/context-service.ts
var context_service = __webpack_require__(4);

// CONCATENATED MODULE: ./src/ad-engine/utils/random.ts
// TODO remove this module
// It is a workaround for issue with mocking Math.random in our environment
// https://github.com/babel/babel/issues/5426#issuecomment-284839994
function getRandom() {
  return Math.random();
}

/* harmony default export */ var random = ({
  getRandom: getRandom
});
// CONCATENATED MODULE: ./src/ad-engine/utils/geo.ts







var cacheMarker = '-cached';
var cacheMaxAge = 30 * 60 * 1000;
var earth = 'XX';
var negativePrefix = 'non-'; // precision to 0.00000001 (or 0.000001%) of traffic

var precision = Math.pow(10, 6);
var samplingSeparator = '/';
var sessionCookieDefault = 'tracking_session_id';
var cache = {};
var cookieLoaded = false;
var geoData = null;

function hasCache(countryList) {
  return countryList.some(function (country) {
    return country.indexOf(cacheMarker) !== -1;
  });
}

function hasSampling(geo) {
  return function (value) {
    return value.indexOf(negativePrefix) !== 0 && value.indexOf(geo + samplingSeparator) > -1;
  };
}

function getSamplingLimits(value) {
  var _value$split = value.split(samplingSeparator),
      _value$split2 = slicedToArray_default()(_value$split, 2),
      samplingValue = _value$split2[1];

  samplingValue = samplingValue.replace(cacheMarker, '');
  return Math.round(parse_float_default()(samplingValue) * precision) | 0;
}

function addResultToCache(name, result, samplingLimits, withCookie) {
  var _samplingLimits = slicedToArray_default()(samplingLimits, 1),
      limitValue = _samplingLimits[0];

  cache[name] = {
    name: name,
    group: result ? 'B' : 'A',
    limit: (result ? limitValue : precision * 100 - limitValue) / precision,
    result: result,
    withCookie: withCookie
  };

  if (withCookie) {
    synchronizeCookie();
  }
}

function getCookieDomain() {
  var domain = window.location.hostname.split('.');
  return domain.length > 1 ? ".".concat(domain[domain.length - 2], ".").concat(domain[domain.length - 1]) : undefined;
}

function loadCookie() {
  readSessionId();
  var cookie = external_js_cookie_default.a.get("".concat(context_service["a" /* context */].get('options.session.id'), "_basset"));

  if (cookie) {
    var cachedVariables = JSON.parse(cookie);

    keys_default()(cachedVariables).forEach(function (variable) {
      cache[variable] = cachedVariables[variable];
    });

    setCookie(cookie);
  }

  cookieLoaded = true;
}

function synchronizeCookie() {
  var cachedVariables = {};

  keys_default()(cache).forEach(function (variable) {
    if (cache[variable].withCookie) {
      cachedVariables[variable] = cache[variable];
    }
  });

  setCookie(stringify_default()(cachedVariables));
}

function setCookie(value) {
  external_js_cookie_default.a.set("".concat(context_service["a" /* context */].get('options.session.id'), "_basset"), value, {
    maxAge: cacheMaxAge,
    expires: new Date(new Date().getTime() + cacheMaxAge),
    path: '/',
    domain: getCookieDomain(),
    overwrite: true
  });
}

function getResult(samplingLimits, name, withCookie) {
  var randomValue = Math.round(random.getRandom() * (precision * 100)) | 0;
  var result = samplingLimits.some(function (value) {
    return randomValue < value;
  });

  if (name) {
    addResultToCache(name, result, samplingLimits, withCookie);
  }

  return result;
}

function isSampledForGeo(countryList, geo, name) {
  var countryListWithSampling = countryList.filter(hasSampling(geo));
  var cachedWithCookie = hasCache(countryList);

  if (countryListWithSampling.length === 0) {
    return false;
  }

  return getResult(countryListWithSampling.map(getSamplingLimits), name, cachedWithCookie);
}

function containsEarth(countryList, name) {
  return countryList.indexOf(earth) > -1 || isSampledForGeo(countryList, earth, name);
}
/**
 * Return geo data from cookie
 * @returns {Object}
 */


function getGeoData() {
  if (geoData === null) {
    var jsonData = decodeURIComponent(external_js_cookie_default.a.get('Geo'));

    try {
      geoData = JSON.parse(jsonData) || {};
    } catch (e) {
      geoData = {};
    }
  }

  return geoData;
}
/**
 * Set geo data
 * @param {Object} data
 * @returns {void}
 */


function setGeoData(data) {
  geoData = data;
}
/**
 * Return country code based on cookie
 * @returns {string}
 */

function getCountryCode() {
  return getGeoData().country;
}
/**
 * Return continent code based on cookie
 * @returns {string}
 */

function getContinentCode() {
  return getGeoData().continent;
}
/**
 * Return region code based on cookie
 * @returns {*}
 */

function getRegionCode() {
  return getGeoData().region;
}
/**
 * Checks whether current country (from cookie) is listed in array
 * @param {string[]} countryList
 * @param {string|undefined}name
 * @returns {boolean}
 */

function isProperCountry() {
  var countryList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 ? arguments[1] : undefined;
  return !!(countryList && countryList.indexOf && (countryList.indexOf(getCountryCode()) > -1 || isSampledForGeo(countryList, getCountryCode(), name)));
}
/**
 * Checks whether current regions (from cookie) is listed in array
 * @param {string[]} countryList
 * @param {string|undefined} name
 * @returns {boolean}
 */

function isProperRegion() {
  var countryList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 ? arguments[1] : undefined;
  var code = "".concat(getCountryCode(), "-").concat(getRegionCode());
  return !!(countryList && countryList.indexOf && (countryList.indexOf(code) > -1 || isSampledForGeo(countryList, code, name)));
}

function containsContinent() {
  var countryList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 ? arguments[1] : undefined;
  var geo = "".concat(earth, "-").concat(getContinentCode());
  return countryList.indexOf(geo) > -1 || isSampledForGeo(countryList, geo, name);
}
/**
 * Checks whether current continent (from cookie) is listed in array
 * @param {string[]} countryList
 * @param {string|undefined} name
 * @returns {boolean}
 */


function isProperContinent() {
  var countryList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 ? arguments[1] : undefined;
  return !!(countryList && countryList.indexOf && (containsEarth(countryList, name) || containsContinent(countryList, name)));
}
/**
 * Checks whether current geo is excluded in array (by using non- prefix)
 * @param {string[]} countryList
 * @returns {boolean}
 */

function isGeoExcluded() {
  var countryList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return !!(countryList.indexOf("".concat(negativePrefix).concat(getCountryCode())) > -1 || countryList.indexOf("".concat(negativePrefix).concat(getCountryCode(), "-").concat(getRegionCode())) > -1 || countryList.indexOf("".concat(negativePrefix).concat(earth, "-").concat(getContinentCode())) > -1);
}

function getResultLog(name) {
  var entry = cache[name];
  return "".concat(entry.name, "_").concat(entry.group, "_").concat(entry.limit);
}

function resetSamplingCache() {
  cache = {};
}
function readSessionId() {
  var sessionCookieName = context_service["a" /* context */].get('options.session.cookieName') || sessionCookieDefault;
  var sid = external_js_cookie_default.a.get(sessionCookieName) || context_service["a" /* context */].get('options.session.id') || 'ae3';
  setSessionId(sid);
}
function setSessionId(sid) {
  context_service["a" /* context */].set('options.session.id', sid);
  cookieLoaded = false;
}
function getSamplingResults() {
  return keys_default()(cache).map(getResultLog);
}
/**
 * Checks whether current geo (from cookie) is listed in array and it's not excluded
 *
 * @param {string[]} countryList
 * @param {string|undefined} name
 * @returns {boolean}
 */

function isProperGeo() {
  var countryList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

  if (!cookieLoaded) {
    loadCookie();
  }

  if (name !== undefined && typeof cache[name] !== 'undefined') {
    return cache[name].result;
  }

  return !!(countryList && countryList.indexOf && !isGeoExcluded(countryList) && (isProperContinent(countryList, name) || isProperCountry(countryList, name) || isProperRegion(countryList, name)));
}
/**
 * Transform sampling results using supplied key-values map.
 *
 * @param {string[] | undefined} keyVals mapping
 * @returns {string[]}
 */

function mapSamplingResults(keyVals) {
  if (!keyVals || !keyVals.length) {
    return [];
  }

  var labradorVariables = geo_module.getSamplingResults();
  return keyVals.map(function (keyVal) {
    return keyVal.split(':');
  }).filter(function (keyVal) {
    return labradorVariables.indexOf(keyVal[0]) !== -1;
  }).map(function (keyVal) {
    return keyVal[1];
  });
}
var geo_module = {
  getContinentCode: getContinentCode,
  getCountryCode: getCountryCode,
  getRegionCode: getRegionCode,
  getSamplingResults: getSamplingResults,
  isProperGeo: isProperGeo,
  resetSamplingCache: resetSamplingCache,
  readSessionId: readSessionId,
  setSessionId: setSessionId,
  mapSamplingResults: mapSamplingResults
};
/* harmony default export */ var geo = (geo_module);
// CONCATENATED MODULE: ./src/ad-engine/utils/get-promise-and-execute-callback.ts


/**
 * Returns promise and executes callback if present.
 * @param {function} func - Function to from which a promise is made.
 * @param {function=} callback
 * @returns {Promise}
 */
function getPromiseAndExecuteCallback(func) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var promise = new promise_default.a(func);

  if (callback && typeof callback === 'function') {
    promise.then(callback.bind(null, null), callback);
  }

  return promise;
}
// CONCATENATED MODULE: ./src/ad-engine/utils/iframe-builder.ts


var iframe_builder_IframeBuilder =
/*#__PURE__*/
function () {
  function IframeBuilder() {
    classCallCheck_default()(this, IframeBuilder);
  }

  createClass_default()(IframeBuilder, [{
    key: "create",
    value: function create(adSlot) {
      var doc = adSlot.getElement();
      return doc.appendChild(this.createEmptyIframe());
    }
    /**
     * @private
     * Inspired by `createInvisibleIframe` method from Prebid.js
     */

  }, {
    key: "createEmptyIframe",
    value: function createEmptyIframe() {
      var iframe = document.createElement('iframe');
      iframe.height = 0;
      iframe.width = 0;
      iframe.border = '0px';
      iframe.hspace = '0';
      iframe.vspace = '0';
      iframe.marginWidth = '0';
      iframe.marginHeight = '0';
      iframe.style.border = '0';
      iframe.scrolling = 'no';
      iframe.frameBorder = '0';
      iframe.src = 'about:blank';
      iframe.style.display = 'inline';
      iframe.style.overflow = 'hidden';
      return iframe;
    }
  }]);

  return IframeBuilder;
}();
// CONCATENATED MODULE: ./src/ad-engine/utils/lazy-queue.ts



/**
 * @deprecated
 * Please use LazyQueue class instead
 */

/**
 * @deprecated
 * Please use LazyQueue class instead
 */
function makeLazyQueue(queue, callback) {
  if (typeof callback !== 'function') {
    throw new Error('LazyQueue used with callback not being a function');
  } else if (queue instanceof Array) {
    queue.start = function () {
      while (queue.length > 0) {
        callback(queue.shift());
      }

      queue.push = function (item) {
        callback(item);
      };
    };
  } else {
    throw new Error('LazyQueue requires an array as the first parameter');
  }
}
var lazy_queue_LazyQueue =
/*#__PURE__*/
function () {
  createClass_default()(LazyQueue, [{
    key: "length",
    get: function get() {
      return this.items.length;
    }
  }]);

  function LazyQueue() {
    classCallCheck_default()(this, LazyQueue);

    this.itemFlushCallbacks = [];
    this.pushCommand = void 0;
    this.items = [];

    for (var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++) {
      items[_key] = arguments[_key];
    }

    this.items = [].concat(items);
    this.setPreFlushPush();
  }

  createClass_default()(LazyQueue, [{
    key: "flush",
    value: function flush() {
      while (this.items.length > 0) {
        this.emit(this.items.shift());
      }

      this.setPostFlushPush();
    }
  }, {
    key: "push",
    value: function push() {
      this.pushCommand.apply(this, arguments);
    }
  }, {
    key: "onItemFlush",
    value: function onItemFlush(callback) {
      if (typeof callback !== 'function') {
        throw new Error('onItemFlush used with callback not being a function');
      }

      this.itemFlushCallbacks.push(callback);
    }
  }, {
    key: "setPreFlushPush",
    value: function setPreFlushPush() {
      var _this = this;

      this.pushCommand = function () {
        var _this$items;

        (_this$items = _this.items).push.apply(_this$items, arguments);
      };
    }
  }, {
    key: "setPostFlushPush",
    value: function setPostFlushPush() {
      var _this2 = this;

      this.pushCommand = function () {
        for (var _len2 = arguments.length, items = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          items[_key2] = arguments[_key2];
        }

        items.forEach(function (item) {
          _this2.emit(item);
        });
      };
    }
  }, {
    key: "emit",
    value: function emit(item) {
      this.itemFlushCallbacks.forEach(function (flushCallback) {
        flushCallback(item);
      });
    }
  }]);

  return LazyQueue;
}();
// EXTERNAL MODULE: ./src/ad-engine/utils/logger.ts
var logger = __webpack_require__(33);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/possibleConstructorReturn"
var possibleConstructorReturn_ = __webpack_require__(23);
var possibleConstructorReturn_default = /*#__PURE__*/__webpack_require__.n(possibleConstructorReturn_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/getPrototypeOf"
var getPrototypeOf_ = __webpack_require__(18);
var getPrototypeOf_default = /*#__PURE__*/__webpack_require__.n(getPrototypeOf_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/inherits"
var inherits_ = __webpack_require__(22);
var inherits_default = /*#__PURE__*/__webpack_require__.n(inherits_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/assertThisInitialized"
var assertThisInitialized_ = __webpack_require__(26);
var assertThisInitialized_default = /*#__PURE__*/__webpack_require__.n(assertThisInitialized_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/wrapNativeSuper"
var wrapNativeSuper_ = __webpack_require__(49);
var wrapNativeSuper_default = /*#__PURE__*/__webpack_require__.n(wrapNativeSuper_);

// CONCATENATED MODULE: ./src/ad-engine/utils/not-implemented-exception.ts






var not_implemented_exception_NotImplementedException =
/*#__PURE__*/
function (_Error) {
  inherits_default()(NotImplementedException, _Error);

  /**
   * @param parameters - pass here method input parameters as an object.
   * @param params - standard new Error() parameters, leave empty.
   */
  function NotImplementedException() {
    var _getPrototypeOf2;

    var _this;

    var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    classCallCheck_default()(this, NotImplementedException);

    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    params[0] = 'Not Implemented Exception'; // Pass remaining arguments (including vendor specific ones) to parent constructor

    _this = possibleConstructorReturn_default()(this, (_getPrototypeOf2 = getPrototypeOf_default()(NotImplementedException)).call.apply(_getPrototypeOf2, [this].concat(params))); // Maintains proper stack trace for where our error was thrown (only available on V8)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(assertThisInitialized_default()(assertThisInitialized_default()(_this)), NotImplementedException);
    } // Custom debugging information


    _this.parameters = parameters;
    return _this;
  }

  return NotImplementedException;
}(wrapNativeSuper_default()(Error));
// EXTERNAL MODULE: ./src/ad-engine/utils/query-string.ts
var query_string = __webpack_require__(15);

// CONCATENATED MODULE: ./src/ad-engine/utils/sampler.ts




function isSamplingIgnored(name) {
  var ignored = (query_string["a" /* queryString */].get('ignored_samplers') || '').split(',');
  return ignored.indexOf(name) !== -1;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var sampler_Sampler =
/*#__PURE__*/
function () {
  function Sampler() {
    classCallCheck_default()(this, Sampler);
  }

  createClass_default()(Sampler, [{
    key: "sample",
    value: function sample(name, sampling) {
      var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
      return isSamplingIgnored(name) ? true : getRandomInt(0, max) < sampling;
    }
  }]);

  return Sampler;
}();

var sampler = new sampler_Sampler();
// CONCATENATED MODULE: ./src/ad-engine/utils/script-loader.ts





var script_loader_ScriptLoader =
/*#__PURE__*/
function () {
  function ScriptLoader() {
    classCallCheck_default()(this, ScriptLoader);
  }

  createClass_default()(ScriptLoader, [{
    key: "createScript",

    /**
     * Creates <script> tag
     * @param {string} src
     * @param {string} type
     * @param {boolean} isAsync
     * @param {HTMLElement|string|null} node
     * @param {Object} parameters
     * @returns {HTMLScriptElement}
     */
    value: function createScript(src) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text/javascript';
      var isAsync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var node = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var parameters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var script = document.createElement('script');
      node = node === 'first' ? document.getElementsByTagName('script')[0] : node || document.body.lastChild;
      script.async = isAsync;
      script.type = type;
      script.src = src;

      keys_default()(parameters).forEach(function (parameter) {
        script[parameter] = parameters[parameter];
      });

      node.parentNode.insertBefore(script, node);
      return script;
    }
    /**
     * Injects <script> tag
     * @param {string} src
     * @param {string} type
     * @param {boolean} isAsync
     * @param {HTMLElement|string|null} node
     * @param {Object} parameters
     * @returns {Promise<any>}
     */

  }, {
    key: "loadScript",
    value: function loadScript(src) {
      var _this = this;

      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text/javascript';
      var isAsync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var node = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var parameters = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      return new promise_default.a(function (resolve, reject) {
        var script = _this.createScript(src, type, isAsync, node, parameters);

        script.onload = resolve;
        script.onerror = reject;
      });
    }
  }]);

  return ScriptLoader;
}();

var scriptLoader = new script_loader_ScriptLoader();
// EXTERNAL MODULE: ./src/ad-engine/utils/string-builder.ts
var string_builder = __webpack_require__(32);

// CONCATENATED MODULE: ./src/ad-engine/utils/timer.ts



var timer_Timer =
/*#__PURE__*/
function () {
  function Timer() {
    classCallCheck_default()(this, Timer);

    this.start = 0; // this.clock = performance;

    this.clock = {
      now: function now() {
        return 0;
      }
    };
    this.reset();
  }

  createClass_default()(Timer, [{
    key: "reset",
    value: function reset() {
      this.start = this.clock.now();
    }
  }, {
    key: "now",
    value: function now() {
      if (this.start) {
        var result = this.clock.now() - this.start;
        return Math.round(result * 100) / 100;
      }

      this.start = this.clock.now();
      return 0;
    }
  }, {
    key: "log",
    value: function log(msg) {
      var _console;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // tslint:disable-next-line:no-console
      (_console = console).log.apply(_console, ["%c ".concat(msg), 'color: white; background: #6b5b95', this.now()].concat(args));
    }
  }]);

  return Timer;
}();

var timer = new timer_Timer();
// CONCATENATED MODULE: ./src/ad-engine/utils/try-property.ts
function whichProperty(obj) {
  var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  // TODO: replace with properties.find(...)
  // tslint:disable-next-line
  for (var i = 0; i < properties.length; i += 1) {
    var property = properties[i];

    if (typeof property !== 'string') {
      throw new Error('property name must be a string');
    }

    if (property in obj) {
      return property;
    }
  }

  return null;
}
function tryProperty(obj) {
  var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var property = whichProperty(obj, properties);

  if (property !== null) {
    var propertyValue = obj[property];
    return typeof propertyValue === 'function' ? propertyValue.bind(obj) : propertyValue;
  }

  return null;
}
// EXTERNAL MODULE: ./src/ad-engine/listeners/index.ts + 3 modules
var listeners = __webpack_require__(7);

// CONCATENATED MODULE: ./src/ad-engine/utils/viewport-observer.ts



function updateInViewport(listener) {
  var newInViewport = Object(dimensions["f" /* isInViewport */])(listener.element, listener.offsetTop, listener.offsetBottom, listener.areaThreshold);

  if (newInViewport !== listener.inViewport) {
    listener.callback(newInViewport);
    listener.inViewport = newInViewport;
  }
}

function addListener(element, callback) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var listener = {
    element: element,
    callback: callback,
    offsetTop: params.offsetTop || 0,
    offsetBottom: params.offsetBottom || 0,
    areaThreshold: params.areaThreshold,
    inViewport: false
  };

  var updateCallback = function updateCallback() {
    updateInViewport(listener);
  };

  listener.id = listeners["c" /* scrollListener */].addCallback(updateCallback);
  updateCallback();
  return listener.id;
}

function removeListener(listenerId) {
  listeners["c" /* scrollListener */].removeCallback(listenerId);
}

var viewportObserver = {
  addListener: addListener,
  removeListener: removeListener
};
// CONCATENATED MODULE: ./src/ad-engine/utils/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "client", function() { return client; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "getTopOffset", function() { return dimensions["b" /* getTopOffset */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "getLeftOffset", function() { return dimensions["a" /* getLeftOffset */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "getViewportHeight", function() { return dimensions["c" /* getViewportHeight */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "getViewportWidth", function() { return dimensions["d" /* getViewportWidth */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isInViewport", function() { return dimensions["f" /* isInViewport */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isInTheSameViewport", function() { return dimensions["e" /* isInTheSameViewport */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "VISIBILITY_STATUS", function() { return VISIBILITY_STATUS; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "getDocumentVisibilityStatus", function() { return getDocumentVisibilityStatus; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "wait", function() { return flow_control_wait; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "defer", function() { return flow_control_defer; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "once", function() { return once; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "timeoutReject", function() { return timeoutReject; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "createWithTimeout", function() { return createWithTimeout; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "setGeoData", function() { return setGeoData; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "getCountryCode", function() { return getCountryCode; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "getContinentCode", function() { return getContinentCode; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "getRegionCode", function() { return getRegionCode; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isProperCountry", function() { return isProperCountry; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isProperRegion", function() { return isProperRegion; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isProperContinent", function() { return isProperContinent; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "resetSamplingCache", function() { return resetSamplingCache; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "readSessionId", function() { return readSessionId; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "setSessionId", function() { return setSessionId; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "getSamplingResults", function() { return getSamplingResults; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isProperGeo", function() { return isProperGeo; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "mapSamplingResults", function() { return mapSamplingResults; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "getPromiseAndExecuteCallback", function() { return getPromiseAndExecuteCallback; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "IframeBuilder", function() { return iframe_builder_IframeBuilder; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "makeLazyQueue", function() { return makeLazyQueue; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "LazyQueue", function() { return lazy_queue_LazyQueue; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "logger", function() { return logger["a" /* logger */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "NotImplementedException", function() { return not_implemented_exception_NotImplementedException; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "queryString", function() { return query_string["a" /* queryString */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "sampler", function() { return sampler; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "scriptLoader", function() { return scriptLoader; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "stringBuilder", function() { return string_builder["a" /* stringBuilder */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "timer", function() { return timer; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "whichProperty", function() { return whichProperty; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "tryProperty", function() { return tryProperty; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "viewportObserver", function() { return viewportObserver; });


















/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/keys"
var keys_ = __webpack_require__(5);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/toConsumableArray"
var toConsumableArray_ = __webpack_require__(17);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/classCallCheck"
var classCallCheck_ = __webpack_require__(2);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/createClass"
var createClass_ = __webpack_require__(3);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass_);

// EXTERNAL MODULE: external "lodash/intersection"
var intersection_ = __webpack_require__(48);
var intersection_default = /*#__PURE__*/__webpack_require__.n(intersection_);

// EXTERNAL MODULE: ./src/ad-engine/utils/index.ts + 14 modules
var utils = __webpack_require__(0);

// EXTERNAL MODULE: ./src/ad-engine/services/context-service.ts
var context_service = __webpack_require__(4);

// EXTERNAL MODULE: ./src/ad-engine/services/events.ts
var events = __webpack_require__(10);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/entries"
var entries_ = __webpack_require__(37);
var entries_default = /*#__PURE__*/__webpack_require__.n(entries_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/slicedToArray"
var slicedToArray_ = __webpack_require__(11);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/json/stringify"
var stringify_ = __webpack_require__(12);
var stringify_default = /*#__PURE__*/__webpack_require__.n(stringify_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/promise"
var promise_ = __webpack_require__(6);
var promise_default = /*#__PURE__*/__webpack_require__.n(promise_);

// CONCATENATED MODULE: ./src/ad-engine/services/message-bus.ts



var callbacks = [];
var logGroup = 'message-bus';

function isAdEngineMessage(message) {
  try {
    return !!JSON.parse(message.data).AdEngine;
  } catch (e) {
    return false;
  }
}

function messageMatch(match, message) {
  var matching = true;

  if (match.keys) {
    var data = JSON.parse(message.data).AdEngine;
    match.keys.forEach(function (key) {
      matching = matching && data[key];
    });
  }

  return matching;
}

function onMessage(message) {
  var i = 0;
  var callback;

  if (isAdEngineMessage(message)) {
    Object(utils["logger"])(logGroup, 'Message received', message);

    for (i = 0; i < callbacks.length; i += 1) {
      callback = callbacks[i];

      if (messageMatch(callback.match, message)) {
        Object(utils["logger"])(logGroup, 'Matching message', message, callback);
        callback.fn(JSON.parse(message.data).AdEngine);

        if (!callback.match.infinite) {
          callbacks.splice(i, 1);
        }

        return;
      }
    }
  }
}

var message_bus_MessageBus =
/*#__PURE__*/
function () {
  function MessageBus() {
    classCallCheck_default()(this, MessageBus);
  }

  createClass_default()(MessageBus, [{
    key: "init",
    value: function init() {
      Object(utils["logger"])(logGroup, 'Register message listener');
      window.addEventListener('message', onMessage);
    }
  }, {
    key: "register",
    value: function register(match, callback) {
      callbacks.push({
        match: match,
        fn: callback
      });
    }
  }]);

  return MessageBus;
}();

var messageBus = new message_bus_MessageBus();
// CONCATENATED MODULE: ./src/ad-engine/services/slot-tweaker.ts







var slot_tweaker_logGroup = 'slot-tweaker';
var slot_tweaker_SlotTweaker =
/*#__PURE__*/
function () {
  function SlotTweaker() {
    classCallCheck_default()(this, SlotTweaker);
  }

  createClass_default()(SlotTweaker, [{
    key: "forceRepaint",

    /** @readonly */
    value: function forceRepaint(domElement) {
      return domElement.offsetWidth;
    }
  }, {
    key: "getContainer",
    value: function getContainer(adSlot) {
      var container = adSlot.getElement();

      if (!container) {
        Object(utils["logger"])(slot_tweaker_logGroup, 'cannot find container', adSlot.getSlotName());
      }

      return container;
    }
  }, {
    key: "addDefaultClasses",
    value: function addDefaultClasses(adSlot) {
      var container = this.getContainer(adSlot);
      var defaultClasses = adSlot.getConfigProperty('defaultClasses') || [];

      if (container && defaultClasses.length) {
        defaultClasses.forEach(function (className) {
          return container.classList.add(className);
        });
      }
    }
  }, {
    key: "hide",
    value: function hide(adSlot) {
      var container = this.getContainer(adSlot);

      if (container) {
        Object(utils["logger"])(slot_tweaker_logGroup, 'hide', adSlot.getSlotName());
        container.classList.add('hide');
      }
    }
  }, {
    key: "show",
    value: function show(adSlot) {
      var container = this.getContainer(adSlot);

      if (container) {
        Object(utils["logger"])(slot_tweaker_logGroup, 'show', adSlot.getSlotName());
        container.classList.remove('hide');
      }
    }
  }, {
    key: "collapse",
    value: function collapse(adSlot) {
      var container = this.getContainer(adSlot);
      container.style.maxHeight = "".concat(container.scrollHeight, "px");
      this.forceRepaint(container);
      container.classList.add('slot-animation');
      container.style.maxHeight = '0';
    }
  }, {
    key: "expand",
    value: function expand(adSlot) {
      var container = this.getContainer(adSlot);
      container.style.maxHeight = "".concat(container.offsetHeight, "px");
      container.classList.remove('hide');
      container.classList.add('slot-animation');
      container.style.maxHeight = "".concat(container.scrollHeight, "px");
    }
  }, {
    key: "makeResponsive",
    value: function makeResponsive(adSlot) {
      var aspectRatio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var paddingBottom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var slotContainer = this.getContainer(adSlot);
      slotContainer.classList.add('slot-responsive');
      return this.onReady(adSlot).then(function (iframe) {
        var container = iframe.parentElement;

        if (!aspectRatio) {
          var height = iframe.contentWindow.document.body.scrollHeight;
          var width = iframe.contentWindow.document.body.scrollWidth;
          aspectRatio = width / height;
        }

        Object(utils["logger"])(slot_tweaker_logGroup, 'make responsive', adSlot.getSlotName());

        if (paddingBottom) {
          container.style.paddingBottom = "".concat(100 / aspectRatio, "%");
        }

        return iframe;
      });
    }
  }, {
    key: "onReady",
    value: function onReady(adSlot) {
      if (adSlot.getConfigProperty('useGptOnloadEvent')) {
        return adSlot.onLoad();
      }

      var container = this.getContainer(adSlot);
      var iframe = container.querySelector('div[id*="_container_"] iframe');
      return new promise_default.a(function (resolve, reject) {
        if (!iframe) {
          reject(new Error('Cannot find iframe element'));
        }

        var iframeDocument = null;

        try {
          iframeDocument = iframe.contentWindow.document;
        } catch (ignore) {
          Object(utils["logger"])(slot_tweaker_logGroup, adSlot.getSlotName(), 'loaded through SafeFrame');
        }

        if (iframeDocument && iframeDocument.readyState === 'complete') {
          resolve(iframe);
        } else {
          iframe.addEventListener('load', function () {
            return resolve(iframe);
          });
        }
      });
    }
  }, {
    key: "adjustIframeByContentSize",
    value: function adjustIframeByContentSize(adSlot) {
      this.onReady(adSlot).then(function (iframe) {
        var height = iframe.contentWindow.document.body.scrollHeight;
        var width = iframe.contentWindow.document.body.scrollWidth;
        iframe.width = width;
        iframe.height = height;
        Object(utils["logger"])(slot_tweaker_logGroup, 'adjust size', adSlot.getSlotName(), width, height);
      });
    }
  }, {
    key: "registerMessageListener",
    value: function registerMessageListener() {
      var _this = this;

      messageBus.register({
        keys: ['action', 'slotName'],
        infinite: true
      }, function (data) {
        if (!data.slotName) {
          Object(utils["logger"])(slot_tweaker_logGroup, 'Missing slot name');
          return;
        }

        var adSlot = slotService.get(data.slotName);

        switch (data.action) {
          case 'expand':
            _this.expand(adSlot);

            break;

          case 'collapse':
            _this.collapse(adSlot);

            break;

          case 'hide':
            _this.hide(adSlot);

            break;

          case 'show':
            _this.show(adSlot);

            break;

          case 'make-responsive':
            _this.makeResponsive(adSlot, data.aspectRatio);

            break;

          default:
            Object(utils["logger"])(slot_tweaker_logGroup, 'Unknown action', data.action);
        }
      });
    }
  }, {
    key: "setDataParam",
    value: function setDataParam(adSlot, attrName, data) {
      var container = this.getContainer(adSlot);
      container.dataset[attrName] = typeof data === 'string' ? data : stringify_default()(data);
    }
  }]);

  return SlotTweaker;
}();
slot_tweaker_SlotTweaker.SLOT_CLOSE_IMMEDIATELY = 'force-close';
var slotTweaker = new slot_tweaker_SlotTweaker();
// CONCATENATED MODULE: ./src/ad-engine/services/slot-service.ts










var groupName = 'slot-service';

function isSlotInTheSameViewport(slotHeight, slotOffset, viewportHeight, elementId) {
  var element = document.getElementById(elementId); // According to https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
  // Hidden element does not have offsetParent

  if (element.offsetParent === null) {
    return false;
  }

  var elementHeight = element.offsetHeight;
  var elementOffset = Object(utils["getTopOffset"])(element);
  var isFirst = elementOffset < slotOffset;
  var distance = isFirst ? slotOffset - elementOffset - elementHeight : elementOffset - slotOffset - slotHeight;
  return distance < viewportHeight;
}

events["a" /* eventService */].on(events["b" /* events */].PAGE_CHANGE_EVENT, function () {
  slotService.slotEvents = {};
  slotService.slotStates = {};
  slotService.slotStatuses = {};
});

var slot_service_SlotService =
/*#__PURE__*/
function () {
  function SlotService() {
    classCallCheck_default()(this, SlotService);

    this.slotEvents = {};
    this.slotStatuses = {};
    this.slotStates = {};
    this.slots = {};
  }

  createClass_default()(SlotService, [{
    key: "add",

    /**
     * Add new slot to register
     */
    value: function add(adSlot) {
      var slotName = adSlot.getSlotName();
      this.slots[slotName] = adSlot;

      if (!this.slotStates[slotName] === false) {
        adSlot.disable(this.slotStatuses[slotName]);
      }

      if (this.slotStates[slotName] === true) {
        adSlot.enable();
      }

      slotTweaker.addDefaultClasses(adSlot);
      events["a" /* eventService */].emit(events["b" /* events */].AD_SLOT_CREATED, adSlot);

      if (this.slotEvents[slotName]) {
        var _adSlot$events;

        (_adSlot$events = adSlot.events).push.apply(_adSlot$events, toConsumableArray_default()(this.slotEvents[slotName]));

        delete this.slotEvents[slotName];
      }

      adSlot.events.flush();
    }
    /**
     * Removes slot from register
     */

  }, {
    key: "remove",
    value: function remove(adSlot) {
      var slotName = adSlot.getSlotName();
      context_service["a" /* context */].removeListeners("slots.".concat(slotName));
      adSlot.disable('Marked for remove');
      delete this.slots[slotName];
      delete this.slotStates[slotName];
      delete this.slotStatuses[slotName];
    }
    /**
     * Get slot by its name or pos
     */

  }, {
    key: "get",
    value: function get(id) {
      var _id$split = id.split(','),
          _id$split2 = slicedToArray_default()(_id$split, 1),
          singleSlotName = _id$split2[0];

      if (this.slots[singleSlotName]) {
        return this.slots[singleSlotName];
      } // Find slots by first targeting.pos


      var slotByPos = null;
      this.forEach(function (slot) {
        if (slotByPos !== null) {
          return;
        }

        var position = slot.getConfigProperty('targeting.pos') || [];

        if (position === singleSlotName || position[0] === singleSlotName) {
          slotByPos = slot;
        }
      });
      return slotByPos;
    }
    /**
     * Iterate over all defined slots
     * @param {function} callback
     */

  }, {
    key: "forEach",
    value: function forEach(callback) {
      var _this = this;

      keys_default()(this.slots).forEach(function (id) {
        callback(_this.slots[id]);
      });
    }
  }, {
    key: "on",
    value: function on(slotName, eventName, callback) {
      var adSlot = this.get(slotName);
      var event = {
        name: eventName,
        callback: callback
      };
      this.slotEvents[slotName] = this.slotEvents[slotName] || [];

      if (adSlot) {
        adSlot.events.push(event);
      } else {
        this.slotEvents[slotName].push(event);
      }
    }
    /**
     * Enable slot by name (it isn't necessary to have given ad slot in register at this point)
     */

  }, {
    key: "enable",
    value: function enable(slotName) {
      this.setState(slotName, true);
    }
    /**
     * Disable slot by name (it isn't necessary to have given ad slot in register at this point)
     */

  }, {
    key: "disable",
    value: function disable(slotName) {
      var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.setState(slotName, false, status);
    }
    /**
     * Get current state of slot (it isn't necessary to have given ad slot in register at this point)
     */

  }, {
    key: "getState",
    value: function getState(slotName) {
      // Comparing with false in order to get truthy value for slot
      // that wasn't disabled or enabled (in case when state is undefined)
      return this.slotStates[slotName] !== false;
    }
  }, {
    key: "setState",
    value: function setState(slotName, state) {
      var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var slot = this.get(slotName);
      this.slotStates[slotName] = state;
      this.slotStatuses[slotName] = status; // After slot is created context should be read-only

      if (slot) {
        slot.setStatus(status);

        if (state) {
          slot.enable();
        } else {
          slot.disable();
        }
      } else if (state) {
        context_service["a" /* context */].set("slots.".concat(slotName, ".disabled"), false);
      } else {
        context_service["a" /* context */].set("slots.".concat(slotName, ".disabled"), true);
      }

      Object(utils["logger"])(groupName, 'set state', slotName, state);
    }
    /**
     * Checks whether ad slot has conflict with defined elements
     */

  }, {
    key: "hasViewportConflict",
    value: function hasViewportConflict(adSlot) {
      if (!adSlot.hasDefinedViewportConflicts() || adSlot.getElement() === null) {
        return false;
      }

      var slotHeight = adSlot.getElement().offsetHeight;
      var slotOffset = Object(utils["getTopOffset"])(adSlot.getElement());
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      var hasConflict = adSlot.getViewportConflicts().some(function (elementId) {
        return isSlotInTheSameViewport(slotHeight, slotOffset, viewportHeight, elementId);
      });
      Object(utils["logger"])(groupName, 'hasViewportConflict', adSlot.getSlotName(), hasConflict);
      return hasConflict;
    }
  }, {
    key: "getAtfSlotNames",
    value: function getAtfSlotNames() {
      return entries_default()(this.slotConfigsMap).filter(function (_ref) {
        var _ref2 = slicedToArray_default()(_ref, 2),
            name = _ref2[0],
            config = _ref2[1];

        return !!config.aboveTheFold;
      }).map(function (_ref3) {
        var _ref4 = slicedToArray_default()(_ref3, 2),
            name = _ref4[0],
            config = _ref4[1];

        return name;
      });
    }
    /**
     * Returns configuration of first call slots.
     */

  }, {
    key: "getFirstCallSlotNames",
    value: function getFirstCallSlotNames() {
      return entries_default()(this.slotConfigsMap).filter(function (_ref5) {
        var _ref6 = slicedToArray_default()(_ref5, 2),
            name = _ref6[0],
            config = _ref6[1];

        return !!config.firstCall;
      }).map(function (_ref7) {
        var _ref8 = slicedToArray_default()(_ref7, 2),
            name = _ref8[0],
            config = _ref8[1];

        return name;
      });
    }
    /**
     * Returns names of enabled slots.
     */

  }, {
    key: "getEnabledSlotNames",
    value: function getEnabledSlotNames() {
      return entries_default()(this.slotConfigsMap).filter(function (_ref9) {
        var _ref10 = slicedToArray_default()(_ref9, 2),
            name = _ref10[0],
            config = _ref10[1];

        return !config.disabled;
      }).map(function (_ref11) {
        var _ref12 = slicedToArray_default()(_ref11, 2),
            name = _ref12[0],
            config = _ref12[1];

        return name;
      });
    }
  }, {
    key: "slotConfigsMap",
    get: function get() {
      return context_service["a" /* context */].get('slots');
    }
  }]);

  return SlotService;
}();

var slotService = new slot_service_SlotService();
// CONCATENATED MODULE: ./src/ad-engine/services/btf-blocker-service.ts









var btf_blocker_service_logGroup = 'btf-blocker';

var btf_blocker_service_BtfBlockerService =
/*#__PURE__*/
function () {
  function BtfBlockerService() {
    classCallCheck_default()(this, BtfBlockerService);

    this.firstCallEnded = false;
    this.unblockedSlotNames = [];
    this.slotsQueue = void 0;
    this.resetState();
  }
  /**
   * @private
   */


  createClass_default()(BtfBlockerService, [{
    key: "resetState",
    value: function resetState() {
      var _this = this;

      this.firstCallEnded = false;
      this.unblockedSlotNames = [];
      this.slotsQueue = new utils["LazyQueue"]();
      this.slotsQueue.onItemFlush(function (_ref) {
        var adSlot = _ref.adSlot,
            fillInCallback = _ref.fillInCallback;
        Object(utils["logger"])(btf_blocker_service_logGroup, adSlot.getSlotName(), 'Filling delayed second call slot');

        _this.disableAdSlotIfHasConflict(adSlot);

        _this.fillInSlotIfEnabled(adSlot, fillInCallback);
      });

      if (window.ads && window.ads.runtime) {
        window.ads.runtime.disableBtf = false;
        window.ads.runtime.disableSecondCall = false;
      }
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      context_service["a" /* context */].push('listeners.slot', {
        onRenderEnded: function onRenderEnded(adSlot) {
          Object(utils["logger"])(btf_blocker_service_logGroup, adSlot.getSlotName(), 'Slot rendered');

          if (!_this2.firstCallEnded && adSlot.isFirstCall()) {
            _this2.finishFirstCall();
          }
        }
      });
      events["a" /* eventService */].on(events["b" /* events */].PAGE_CHANGE_EVENT, function () {
        _this2.resetState();
      });

      var enabledFirstCallSlots = intersection_default()(slotService.getFirstCallSlotNames(), slotService.getEnabledSlotNames());

      if (enabledFirstCallSlots.length === 0) {
        this.finishFirstCall();
      }
    }
  }, {
    key: "finishFirstCall",
    value: function finishFirstCall() {
      this.firstCallEnded = true;
      Object(utils["logger"])(btf_blocker_service_logGroup, 'first call queue finished');

      if (window.ads.runtime.disableSecondCall) {
        this.disableSecondCall([]);
      } else if (window.ads.runtime.disableBtf) {
        this.disableSecondCall([].concat(toConsumableArray_default()(this.unblockedSlotNames), toConsumableArray_default()(slotService.getAtfSlotNames())));
      }

      this.slotsQueue.flush();
    }
  }, {
    key: "disableSecondCall",
    value: function disableSecondCall(unblockedSlots) {
      var slots = context_service["a" /* context */].get('slots');
      Object(utils["logger"])(btf_blocker_service_logGroup, 'second call queue disabled');

      keys_default()(slots).forEach(function (adSlotKey) {
        var slotConfig = slots[adSlotKey];

        if (!slotConfig.firstCall && unblockedSlots.indexOf(adSlotKey) === -1) {
          slotService.disable(adSlotKey, 'blocked');
        }
      });
    }
  }, {
    key: "push",
    value: function push(adSlot, fillInCallback) {
      if (!this.firstCallEnded && !adSlot.isFirstCall()) {
        this.slotsQueue.push({
          adSlot: adSlot,
          fillInCallback: fillInCallback
        });
        Object(utils["logger"])(btf_blocker_service_logGroup, adSlot.getSlotName(), 'second call slot pushed to queue');
        return;
      }

      this.disableAdSlotIfHasConflict(adSlot);
      this.fillInSlotIfEnabled(adSlot, fillInCallback);
    }
  }, {
    key: "disableAdSlotIfHasConflict",
    value: function disableAdSlotIfHasConflict(adSlot) {
      if (slotService.hasViewportConflict(adSlot)) {
        slotService.disable(adSlot.getSlotName(), 'viewport-conflict');
      }
    }
  }, {
    key: "fillInSlotIfEnabled",
    value: function fillInSlotIfEnabled(adSlot, fillInCallback) {
      if (!adSlot.isEnabled()) {
        Object(utils["logger"])(btf_blocker_service_logGroup, adSlot.getSlotName(), 'Slot blocked', adSlot.getStatus());
        return;
      }

      Object(utils["logger"])(btf_blocker_service_logGroup, adSlot.getSlotName(), 'Filling in slot');
      fillInCallback(adSlot);
    }
  }, {
    key: "unblock",
    value: function unblock(slotName) {
      Object(utils["logger"])(btf_blocker_service_logGroup, slotName, 'Unblocking slot');
      this.unblockedSlotNames.push(slotName);
      slotService.enable(slotName);
    }
  }]);

  return BtfBlockerService;
}();

var btfBlockerService = new btf_blocker_service_BtfBlockerService();
// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/objectSpread"
var objectSpread_ = __webpack_require__(24);
var objectSpread_default = /*#__PURE__*/__webpack_require__.n(objectSpread_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/assign"
var assign_ = __webpack_require__(36);
var assign_default = /*#__PURE__*/__webpack_require__.n(assign_);

// EXTERNAL MODULE: ./src/ad-engine/utils/logger.ts
var logger = __webpack_require__(33);

// CONCATENATED MODULE: ./src/ad-engine/services/template-service.ts






var template_service_logGroup = 'template-service';
var templates = {};

var template_service_TemplateService =
/*#__PURE__*/
function () {
  function TemplateService() {
    classCallCheck_default()(this, TemplateService);
  }

  createClass_default()(TemplateService, [{
    key: "register",
    value: function register(template) {
      var customConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (typeof template.getName !== 'function') {
        throw new Error('Template does not implement getName method.');
      }

      var name = template.getName();
      var config = context_service["a" /* context */].get("templates.".concat(name)) || {};

      if (typeof template.getDefaultConfig === 'function') {
        config = assign_default()(template.getDefaultConfig(), config);
      }

      if (customConfig) {
        config = objectSpread_default()({}, config, customConfig);
      }

      context_service["a" /* context */].set("templates.".concat(name), config);
      templates[name] = template;
    }
  }, {
    key: "init",
    value: function init(name) {
      var slot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      Object(logger["a" /* logger */])(template_service_logGroup, 'Load template', name, slot, params);

      if (!templates[name]) {
        throw new Error("Template ".concat(name, " does not exist."));
      }

      return new templates[name](slot).init(params);
    }
  }]);

  return TemplateService;
}();

var templateService = new template_service_TemplateService();
// CONCATENATED MODULE: ./src/ad-engine/services/custom-ad-loader.ts


function registerCustomAdLoader(methodName) {
  window[methodName] = function (params) {
    var slot = params.slotName ? slotService.get(params.slotName) : null;
    templateService.init(params.type, slot, params);
  };
}
// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/date/now"
var now_ = __webpack_require__(38);
var now_default = /*#__PURE__*/__webpack_require__.n(now_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/parse-int"
var parse_int_ = __webpack_require__(14);
var parse_int_default = /*#__PURE__*/__webpack_require__.n(parse_int_);

// CONCATENATED MODULE: ./src/ad-engine/services/local-cache.ts






/* global Storage */

var local_cache_logGroup = 'local-cache';

var _canUseStorage;

var local_cache_LocalCache =
/*#__PURE__*/
function () {
  function LocalCache() {
    classCallCheck_default()(this, LocalCache);
  }

  createClass_default()(LocalCache, [{
    key: "canUseStorage",
    value: function canUseStorage() {
      if (typeof _canUseStorage === 'undefined') {
        _canUseStorage = false;

        if (window.localStorage) {
          try {
            window.localStorage.setItem('test', '1');
            window.localStorage.removeItem('test');
            _canUseStorage = true;
          } catch (e) {
            /* There are two known possibilities here:
             *
             * 1) The browser isn't allowing access due to a
             * privacy setting (which can happen in Safari).
             *
             * 2) The allowed disk space for storage is used
             * up. However, this is more likely to happen in
             * calls to LocalCache.set().
             */
            try {
              LocalCache.createPolyfill();
              _canUseStorage = true;
            } catch (exception) {
              Object(utils["logger"])(local_cache_logGroup, 'Local Storage polyfill error: ', exception);
            }
          }
        }
      }

      return _canUseStorage;
    }
  }, {
    key: "createPolyfill",
    value: function createPolyfill() {
      Object(utils["logger"])(local_cache_logGroup, 'Local Storage polyfill being created');
      Storage.prototype.data = {};

      Storage.prototype.setItem = function (id, val) {
        this.data[id] = String(val);
      };

      Storage.prototype.getItem = function (id) {
        return this.data[id] ? this.data[id] : null;
      };

      Storage.prototype.removeItem = function (id) {
        delete this.data[id];
      };

      Storage.prototype.clear = function () {
        this.data = {};
      };
    }
  }, {
    key: "get",
    value: function get(key) {
      if (!this.canUseStorage()) {
        return false;
      }

      var cacheItem = window.localStorage.getItem(key);

      if (cacheItem) {
        // De-serialize
        cacheItem = JSON.parse(cacheItem); // Check if item has expired

        if (this.isExpired(cacheItem)) {
          this.delete(key);
          return false;
        }

        return cacheItem.data;
      }

      return false;
    }
  }, {
    key: "set",
    value: function set(key, value) {
      var expires = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (!this.canUseStorage() || !this.isStorable(value)) {
        return false;
      }

      var cacheItem = {
        data: value
      };

      var expiresValue = parse_int_default()(expires, 10);

      if (!isNaN(expiresValue)) {
        // Set expiration as a JS timestamp
        cacheItem.expires = expiresValue * 1000 + now_default()();
      }

      try {
        window.localStorage.setItem(key, stringify_default()(cacheItem));
      } catch (e) {
        // Local Storage is at capacity
        return false;
      }

      return true;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      if (!this.canUseStorage()) {
        return;
      }

      window.localStorage.removeItem(key);
    }
  }, {
    key: "isStorable",
    value: function isStorable(value) {
      if ( // Functions might be a security risk
      typeof value === 'function' || // NaN
      typeof value === 'number' && isNaN(value) || // undefined
      typeof value === 'undefined') {
        return false;
      }

      return true;
    }
  }, {
    key: "isExpired",
    value: function isExpired(cacheItem) {
      return cacheItem.expires && now_default()() >= parse_int_default()(cacheItem.expires, 10);
    }
  }]);

  return LocalCache;
}();

var localCache = new local_cache_LocalCache();
// EXTERNAL MODULE: ./src/ad-engine/providers/index.ts
var providers = __webpack_require__(9);

// CONCATENATED MODULE: ./src/ad-engine/services/slot-data-params-updater.ts





/**
 * Sets dataset properties on AdSlot container for debug purposes.
 */

var slot_data_params_updater_SlotDataParamsUpdater =
/*#__PURE__*/
function () {
  function SlotDataParamsUpdater() {
    classCallCheck_default()(this, SlotDataParamsUpdater);
  }

  createClass_default()(SlotDataParamsUpdater, [{
    key: "updateOnCreate",
    value: function updateOnCreate(adSlot, targeting) {
      var sizes = adSlot.isOutOfPage() ? 'out-of-page' : new providers["GptSizeMap"](adSlot.getSizes()).toString();
      slotTweaker.setDataParam(adSlot, 'gptPageParams', context_service["a" /* context */].get('targeting'));
      slotTweaker.setDataParam(adSlot, 'gptSlotParams', targeting);
      slotTweaker.setDataParam(adSlot, 'sizes', sizes);
    }
  }, {
    key: "updateOnRenderEnd",
    value: function updateOnRenderEnd(adSlot) {
      slotTweaker.setDataParam(adSlot, 'gptCreativeId', adSlot.creativeId);
      slotTweaker.setDataParam(adSlot, 'gptLineItemId', adSlot.lineItemId);
      slotTweaker.setDataParam(adSlot, 'gptCreativeSize', adSlot.creativeSize);
    }
  }]);

  return SlotDataParamsUpdater;
}();

var slotDataParamsUpdater = new slot_data_params_updater_SlotDataParamsUpdater();
// EXTERNAL MODULE: ./src/ad-engine/utils/dimensions.ts
var dimensions = __webpack_require__(16);

// CONCATENATED MODULE: ./src/ad-engine/services/slot-injector.ts





var slot_injector_logGroup = 'slot-repeater';

function findNextSuitablePlace() {
  var anchorElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var conflictingElements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var i;

  for (i = 0; i < anchorElements.length; i += 1) {
    if (!Object(dimensions["e" /* isInTheSameViewport */])(anchorElements[i], conflictingElements)) {
      return anchorElements[i];
    }
  }

  return null;
}

function insertNewSlot(slotName, nextSibling) {
  var container = document.createElement('div');
  container.id = slotName;
  nextSibling.parentNode.insertBefore(container, nextSibling);
  context_service["a" /* context */].push('events.pushOnScroll.ids', slotName);
  return container;
}

var slot_injector_SlotInjector =
/*#__PURE__*/
function () {
  function SlotInjector() {
    classCallCheck_default()(this, SlotInjector);
  }

  createClass_default()(SlotInjector, [{
    key: "inject",
    value: function inject(slotName) {
      var insertBelowScrollPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var config = context_service["a" /* context */].get("slots.".concat(slotName));
      var anchorElements = Array.prototype.slice.call(document.querySelectorAll(config.insertBeforeSelector));
      var conflictingElements = Array.prototype.slice.call(document.querySelectorAll(config.avoidConflictWith));

      if (insertBelowScrollPosition) {
        var scrollPos = window.scrollY;
        anchorElements = anchorElements.filter(function (el) {
          return el.offsetTop > scrollPos;
        });
      }

      var nextSibling = findNextSuitablePlace(anchorElements, conflictingElements);

      if (!nextSibling) {
        Object(utils["logger"])(slot_injector_logGroup, "There is not enough space for ".concat(slotName));
        return null;
      }

      var container = insertNewSlot(slotName, nextSibling);
      Object(utils["logger"])(slot_injector_logGroup, 'Inject slot', slotName);
      return container;
    }
  }]);

  return SlotInjector;
}();

var slotInjector = new slot_injector_SlotInjector();
// EXTERNAL MODULE: ./src/ad-engine/utils/string-builder.ts
var string_builder = __webpack_require__(32);

// CONCATENATED MODULE: ./src/ad-engine/services/slot-repeater.ts







var slot_repeater_logGroup = 'slot-repeater';

function buildString(pattern, definition) {
  return string_builder["a" /* stringBuilder */].build(pattern, {
    slotConfig: definition
  });
}

function repeatSlot(adSlot) {
  var newSlotDefinition = adSlot.getCopy();
  var repeatConfig = newSlotDefinition.repeat;
  repeatConfig.index += 1;
  var slotName = buildString(repeatConfig.slotNamePattern, newSlotDefinition);
  newSlotDefinition.slotName = slotName;

  if (repeatConfig.limit !== null && repeatConfig.index > repeatConfig.limit) {
    Object(utils["logger"])(slot_repeater_logGroup, "Limit reached for ".concat(slotName));
    return false;
  }

  context_service["a" /* context */].set("slots.".concat(slotName), newSlotDefinition);

  if (repeatConfig.updateProperties) {
    keys_default()(repeatConfig.updateProperties).forEach(function (key) {
      var value = typeof repeatConfig.updateProperties[key] === 'string' ? buildString(repeatConfig.updateProperties[key], newSlotDefinition) : repeatConfig.updateProperties[key];
      context_service["a" /* context */].set("slots.".concat(slotName, ".").concat(key), value);
    });
  }

  var insertBelowScrollPosition = !!adSlot.config.repeat.insertBelowScrollPosition;
  var container = slotInjector.inject(slotName, insertBelowScrollPosition);
  var additionalClasses = repeatConfig.additionalClasses || '';

  if (container !== null) {
    container.className = "".concat(adSlot.getElement().className, " ").concat(additionalClasses);
    return true;
  }

  return false;
}

var slot_repeater_SlotRepeater =
/*#__PURE__*/
function () {
  function SlotRepeater() {
    classCallCheck_default()(this, SlotRepeater);
  }

  createClass_default()(SlotRepeater, [{
    key: "init",
    value: function init() {
      if (context_service["a" /* context */].get('options.slotRepeater')) {
        context_service["a" /* context */].push('listeners.slot', {
          onRenderEnded: function onRenderEnded(adSlot) {
            if (adSlot.isEnabled() && adSlot.isRepeatable()) {
              return repeatSlot(adSlot);
            }

            return false;
          }
        });
      }
    }
  }]);

  return SlotRepeater;
}();

var slotRepeater = new slot_repeater_SlotRepeater();
// EXTERNAL MODULE: ./src/ad-engine/utils/query-string.ts
var query_string = __webpack_require__(15);

// CONCATENATED MODULE: ./src/ad-engine/services/tracking-opt-in.ts


var isOptInByQueryParam = query_string["a" /* queryString */].get('tracking-opt-in-status') === 'true';

function isOptedIn() {
  return isOptInByQueryParam || context_service["a" /* context */].get('options.trackingOptIn');
}

var trackingOptIn = {
  isOptedIn: isOptedIn
};
// CONCATENATED MODULE: ./src/ad-engine/services/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "b", function() { return btfBlockerService; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "c", function() { return context_service["a" /* context */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "h", function() { return registerCustomAdLoader; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "e", function() { return events["b" /* events */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "d", function() { return events["a" /* eventService */]; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "f", function() { return localCache; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "g", function() { return messageBus; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "i", function() { return slotDataParamsUpdater; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "j", function() { return slotInjector; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "k", function() { return slotRepeater; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "l", function() { return slotService; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "a", function() { return slot_tweaker_SlotTweaker; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "m", function() { return slotTweaker; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "n", function() { return templateService; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "o", function() { return trackingOptIn; });














/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/classCallCheck");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/createClass");

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return context; });
/* harmony import */ var _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_assign__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(36);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_assign__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_assign__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);




var contextObject = {
  adUnitId: '',
  events: {},
  delayModules: [],
  listeners: {
    twitch: [],
    porvata: [],
    slot: []
  },
  options: {
    customAdLoader: {
      globalMethodName: 'loadCustomAd'
    },
    maxDelayTimeout: 2000,
    video: {
      moatTracking: {
        enabled: true,
        partnerCode: 'wikiaimajsint377461931603',
        sampling: 1
      }
    },
    slotRepeater: false,
    trackingOptIn: false
  },
  slots: {},
  src: 'gpt',
  state: {
    adStack: [],
    isMobile: false
  },
  targeting: {},
  vast: {
    size: [640, 480],
    adUnitId: ''
  }
};
var onChangeCallbacks = {};

function runCallbacks(trigger, key, newValue) {
  if (!onChangeCallbacks[trigger]) {
    return;
  }

  onChangeCallbacks[trigger].forEach(function (callback) {
    callback(key, newValue);
  });
}

function triggerOnChange(key, segments, newValue) {
  var trigger = '';
  segments.forEach(function (seg) {
    trigger += (trigger === '' ? '' : '.') + seg;
    runCallbacks(trigger, key, newValue);
  });
}

function segment(key, newValue) {
  var remove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var segments = key.split('.');
  var segmentsCount = segments.length;
  var seg = contextObject;
  var lastKey = null;

  for (var i = 0; i < segmentsCount; i += 1) {
    lastKey = segments[i];

    if (i < segmentsCount - 1) {
      seg[lastKey] = seg[lastKey] || {};
      seg = seg[lastKey];
    }
  }

  if (remove) {
    delete seg[lastKey];
    triggerOnChange(key, segments, null);
    return null;
  }

  if (newValue !== undefined) {
    seg[lastKey] = newValue;
    triggerOnChange(key, segments, newValue);
  }

  return seg[lastKey];
}

var Context =
/*#__PURE__*/
function () {
  function Context() {
    _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, Context);

    this.__useDefault = true;
  }

  _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(Context, [{
    key: "extend",
    value: function extend(newContext) {
      _babel_runtime_corejs2_core_js_object_assign__WEBPACK_IMPORTED_MODULE_1___default()(contextObject, newContext);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      segment(key, value);
    }
  }, {
    key: "get",
    value: function get(key) {
      return segment(key);
    }
  }, {
    key: "remove",
    value: function remove(key) {
      segment(key, null, true);
    }
  }, {
    key: "push",
    value: function push(key, value) {
      var array = segment(key);

      if (array) {
        array.push(value);
      }
    }
  }, {
    key: "onChange",
    value: function onChange(key, callback) {
      onChangeCallbacks[key] = onChangeCallbacks[key] || [];
      onChangeCallbacks[key].push(callback);
    }
  }, {
    key: "removeListeners",
    value: function removeListeners(key) {
      _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default()(onChangeCallbacks).forEach(function (contextKey) {
        if (contextKey === key || contextKey.indexOf("".concat(key, ".")) === 0) {
          delete onChangeCallbacks[contextKey];
        }
      });
    }
  }]);

  return Context;
}();

var context = new Context();

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/object/keys");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/promise");

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/keys"
var keys_ = __webpack_require__(5);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/classCallCheck"
var classCallCheck_ = __webpack_require__(2);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/createClass"
var createClass_ = __webpack_require__(3);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass_);

// EXTERNAL MODULE: ./src/ad-engine/models/index.ts + 1 modules
var models = __webpack_require__(8);

// EXTERNAL MODULE: ./src/ad-engine/services/index.ts + 11 modules
var services = __webpack_require__(1);

// EXTERNAL MODULE: ./src/ad-engine/utils/index.ts + 14 modules
var utils = __webpack_require__(0);

// EXTERNAL MODULE: ./src/ad-engine/video/index.ts + 14 modules
var ad_engine_video = __webpack_require__(28);

// CONCATENATED MODULE: ./src/ad-engine/listeners/porvata-listener.ts








function getListeners() {
  return services["c" /* context */].get('listeners.porvata');
}

var porvata_listener_PorvataListener =
/*#__PURE__*/
function () {
  function PorvataListener(params) {
    classCallCheck_default()(this, PorvataListener);

    this.params = params;
    this.listeners = getListeners().filter(function (listener) {
      return !listener.isEnabled || listener.isEnabled();
    });

    this.logger = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return utils["logger"].apply(void 0, [PorvataListener.LOG_GROUP].concat(args));
    };
  }

  createClass_default()(PorvataListener, [{
    key: "init",
    value: function init() {
      this.dispatch('init');
    }
  }, {
    key: "registerVideoEvents",
    value: function registerVideoEvents(video) {
      var _this = this;

      this.video = video;
      this.dispatch('ready');

      keys_default()(PorvataListener.EVENTS).forEach(function (eventKey) {
        video.addEventListener(eventKey, function (event) {
          var errorCode = event.getError && event.getError().getErrorCode();

          _this.dispatch(PorvataListener.EVENTS[eventKey], errorCode);
        });
      });
    }
  }, {
    key: "dispatch",
    value: function dispatch(eventName) {
      var _this2 = this;

      var errorCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var data = this.getData(eventName, errorCode);
      this.logger(eventName, data);
      this.listeners.forEach(function (listener) {
        listener.onEvent(eventName, _this2.params, data);
      });

      if (this.params.position && eventName === PorvataListener.EVENTS.viewable_impression) {
        var adSlot = services["l" /* slotService */].get(this.params.position);
        adSlot.emit(models["a" /* AdSlot */].VIDEO_VIEWED_EVENT);
      }
    }
  }, {
    key: "getData",
    value: function getData(eventName, errorCode) {
      var imaAd = this.video && this.video.ima.getAdsManager() && this.video.ima.getAdsManager().getCurrentAd();

      var _vastParser$getAdInfo = ad_engine_video["j" /* vastParser */].getAdInfo(imaAd),
          contentType = _vastParser$getAdInfo.contentType,
          creativeId = _vastParser$getAdInfo.creativeId,
          lineItemId = _vastParser$getAdInfo.lineItemId;

      if (!imaAd && this.video && this.video.container) {
        contentType = this.video.container.getAttribute('data-vast-content-type');
        creativeId = this.video.container.getAttribute('data-vast-creative-id');
        lineItemId = this.video.container.getAttribute('data-vast-line-item-id');
      }

      var now = new Date();
      return {
        ad_error_code: errorCode,
        ad_product: this.params.adProduct,
        audio: this.params.withAudio ? 1 : 0,
        content_type: contentType || '(none)',
        creative_id: creativeId || 0,
        ctp: this.params.withCtp ? 1 : 0,
        event_name: eventName,
        line_item_id: lineItemId || 0,
        player: PorvataListener.PLAYER_NAME,
        position: this.params.position ? this.params.position.toLowerCase() : '(none)',
        // @DEPRECATED
        browser: "".concat(utils["client"].getOperatingSystem(), " ").concat(utils["client"].getBrowser()),
        timestamp: now.getTime(),
        tz_offset: now.getTimezoneOffset()
      };
    }
  }]);

  return PorvataListener;
}();
porvata_listener_PorvataListener.EVENTS = {
  adCanPlay: 'ad_can_play',
  complete: 'completed',
  click: 'clicked',
  firstquartile: 'first_quartile',
  impression: 'impression',
  loaded: 'loaded',
  midpoint: 'midpoint',
  pause: 'paused',
  resume: 'resumed',
  start: 'started',
  thirdquartile: 'third_quartile',
  viewable_impression: 'viewable_impression',
  adError: 'error',
  wikiaAdPlayTriggered: 'play_triggered',
  wikiaAdStop: 'closed',
  wikiaAdMute: 'mute',
  wikiaAdUnmute: 'unmute',
  wikiaInViewportWithOffer: 'in_viewport_with_offer',
  wikiaInViewportWithoutOffer: 'in_viewport_without_offer'
};
porvata_listener_PorvataListener.LOG_GROUP = 'porvata-listener';
porvata_listener_PorvataListener.PLAYER_NAME = 'porvata';
// EXTERNAL MODULE: ./src/ad-engine/services/events.ts
var events = __webpack_require__(10);

// EXTERNAL MODULE: ./src/ad-engine/utils/dimensions.ts
var dimensions = __webpack_require__(16);

// CONCATENATED MODULE: ./src/ad-engine/listeners/scroll-listener.ts





var callbacks = {};

function getUniqueId() {
  return ((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

function pushSlot(adStack, node) {
  adStack.push({
    id: node.id
  });
}

var scroll_listener_ScrollListener =
/*#__PURE__*/
function () {
  function ScrollListener() {
    classCallCheck_default()(this, ScrollListener);
  }

  createClass_default()(ScrollListener, [{
    key: "init",
    value: function init() {
      var requestAnimationFrameHandleAdded = false;
      document.addEventListener('scroll', function (event) {
        if (!requestAnimationFrameHandleAdded) {
          window.requestAnimationFrame(function () {
            requestAnimationFrameHandleAdded = false;

            keys_default()(callbacks).forEach(function (id) {
              if (typeof callbacks[id] === 'function') {
                callbacks[id](event, id);
              }
            });
          });
          requestAnimationFrameHandleAdded = true;
        }
      });
    }
  }, {
    key: "addSlot",
    value: function addSlot(adStack, id) {
      var _this = this;

      var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var node = document.getElementById(id);

      if (!node) {
        return;
      }

      this.addCallback(function (event, callbackId) {
        var scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        var slotPosition = Object(dimensions["b" /* getTopOffset */])(node);
        var viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        if (scrollPosition + viewPortHeight > slotPosition - threshold) {
          _this.removeCallback(callbackId);

          pushSlot(adStack, node);
        }
      });
    }
  }, {
    key: "addCallback",
    value: function addCallback(callback) {
      var _this2 = this;

      var id = getUniqueId();
      callbacks[id] = callback;
      events["a" /* eventService */].once(events["b" /* events */].BEFORE_PAGE_CHANGE_EVENT, function () {
        return _this2.removeCallback(id);
      });
      return id;
    }
  }, {
    key: "removeCallback",
    value: function removeCallback(id) {
      delete callbacks[id];
    }
  }]);

  return ScrollListener;
}();

var scrollListener = new scroll_listener_ScrollListener();
// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/array/is-array"
var is_array_ = __webpack_require__(46);
var is_array_default = /*#__PURE__*/__webpack_require__.n(is_array_);

// CONCATENATED MODULE: ./src/ad-engine/listeners/slot-listener.ts






var logGroup = 'slot-listener';
var listeners = null;

function getIframe(adSlot) {
  return adSlot.getElement().querySelector('div[id*="_container_"] iframe');
}

function getAdType(event, adSlot) {
  var iframe = getIframe(adSlot);
  var isIframeAccessible = false;

  if (event.isEmpty) {
    return models["a" /* AdSlot */].STATUS_COLLAPSE;
  }

  try {
    isIframeAccessible = !!iframe.contentWindow.document.querySelector;
  } catch (e) {
    Object(utils["logger"])(logGroup, 'getAdType', 'iframe is not accessible');
  }

  if (isIframeAccessible && iframe.contentWindow.AdEngine_adType) {
    return iframe.contentWindow.AdEngine_adType;
  }

  return models["a" /* AdSlot */].STATUS_SUCCESS;
}

function slot_listener_getData(adSlot, _ref) {
  var adType = _ref.adType,
      status = _ref.status;
  var now = new Date();
  return {
    browser: "".concat(utils["client"].getOperatingSystem(), " ").concat(utils["client"].getBrowser()),
    adType: adType || '',
    creative_id: adSlot.creativeId,
    creative_size: is_array_default()(adSlot.creativeSize) && adSlot.creativeSize.length ? adSlot.creativeSize.join('x') : adSlot.creativeSize,
    line_item_id: adSlot.lineItemId,
    status: status || adSlot.getStatus(),
    page_width: window.document.body.scrollWidth || '',
    time_bucket: now.getHours(),
    timestamp: now.getTime(),
    tz_offset: now.getTimezoneOffset(),
    viewport_height: window.innerHeight || 0
  };
}

function slot_listener_dispatch(methodName, adSlot) {
  var adInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!listeners) {
    listeners = services["c" /* context */].get('listeners.slot').filter(function (listener) {
      return !listener.isEnabled || listener.isEnabled();
    });
  }

  var data = slot_listener_getData(adSlot, adInfo);
  listeners.forEach(function (listener) {
    if (typeof listener[methodName] !== 'function') {
      return;
    }

    listener[methodName](adSlot, data);
  });
  Object(utils["logger"])(logGroup, methodName, adSlot, adInfo, data);
}

var slot_listener_SlotListener =
/*#__PURE__*/
function () {
  function SlotListener() {
    classCallCheck_default()(this, SlotListener);
  }

  createClass_default()(SlotListener, [{
    key: "emitRenderEnded",
    value: function emitRenderEnded(event, adSlot) {
      var adType = getAdType(event, adSlot);
      adSlot.updateOnRenderEnd(event);

      switch (adType) {
        case 'collapse':
          adSlot.collapse();
          break;

        case 'manual':
          adSlot.setStatus(adType);
          break;

        default:
          adSlot.success();
          break;
      }

      var slotsToPush = services["c" /* context */].get("events.pushAfterRendered.".concat(adSlot.getSlotName()));

      if (slotsToPush) {
        slotsToPush.forEach(function (slotName) {
          services["j" /* slotInjector */].inject(slotName);
        });
      }

      slot_listener_dispatch('onRenderEnded', adSlot, {
        adType: adType,
        event: event
      });
    }
  }, {
    key: "emitLoadedEvent",
    value: function emitLoadedEvent(event, adSlot) {
      adSlot.emit(models["a" /* AdSlot */].SLOT_LOADED_EVENT);
      slot_listener_dispatch('onLoaded', adSlot);
      services["m" /* slotTweaker */].setDataParam(adSlot, 'slotLoaded', true);
    }
  }, {
    key: "emitImpressionViewable",
    value: function emitImpressionViewable(event, adSlot) {
      adSlot.emit(models["a" /* AdSlot */].SLOT_VIEWED_EVENT);
      slot_listener_dispatch('onImpressionViewable', adSlot);
      services["m" /* slotTweaker */].setDataParam(adSlot, 'slotViewed', true);
    }
  }, {
    key: "emitStatusChanged",
    value: function emitStatusChanged(adSlot) {
      services["m" /* slotTweaker */].setDataParam(adSlot, 'slotResult', adSlot.getStatus());
      slot_listener_dispatch('onStatusChanged', adSlot);
    }
  }, {
    key: "emitCustomEvent",
    value: function emitCustomEvent(event, adSlot) {
      slot_listener_dispatch('onCustomEvent', adSlot, {
        status: event
      });
    }
  }]);

  return SlotListener;
}();

var slotListener = new slot_listener_SlotListener();
// EXTERNAL MODULE: ./src/ad-engine/listeners/twitch-listener.ts
var twitch_listener = __webpack_require__(31);

// CONCATENATED MODULE: ./src/ad-engine/listeners/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "a", function() { return porvata_listener_PorvataListener; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "c", function() { return scrollListener; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "d", function() { return slotListener; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "b", function() { return twitch_listener["a" /* TwitchListener */]; });





/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/json/stringify"
var stringify_ = __webpack_require__(12);
var stringify_default = /*#__PURE__*/__webpack_require__.n(stringify_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/promise"
var promise_ = __webpack_require__(6);
var promise_default = /*#__PURE__*/__webpack_require__.n(promise_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/classCallCheck"
var classCallCheck_ = __webpack_require__(2);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/createClass"
var createClass_ = __webpack_require__(3);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/possibleConstructorReturn"
var possibleConstructorReturn_ = __webpack_require__(23);
var possibleConstructorReturn_default = /*#__PURE__*/__webpack_require__.n(possibleConstructorReturn_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/getPrototypeOf"
var getPrototypeOf_ = __webpack_require__(18);
var getPrototypeOf_default = /*#__PURE__*/__webpack_require__.n(getPrototypeOf_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/inherits"
var inherits_ = __webpack_require__(22);
var inherits_default = /*#__PURE__*/__webpack_require__.n(inherits_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/assertThisInitialized"
var assertThisInitialized_ = __webpack_require__(26);
var assertThisInitialized_default = /*#__PURE__*/__webpack_require__.n(assertThisInitialized_);

// EXTERNAL MODULE: external "eventemitter3"
var external_eventemitter3_ = __webpack_require__(35);
var external_eventemitter3_default = /*#__PURE__*/__webpack_require__.n(external_eventemitter3_);

// EXTERNAL MODULE: ./src/ad-engine/listeners/index.ts + 3 modules
var listeners = __webpack_require__(7);

// EXTERNAL MODULE: ./src/ad-engine/providers/index.ts
var providers = __webpack_require__(9);

// EXTERNAL MODULE: ./src/ad-engine/services/index.ts + 11 modules
var services = __webpack_require__(1);

// EXTERNAL MODULE: ./src/ad-engine/utils/index.ts + 14 modules
var utils = __webpack_require__(0);

// CONCATENATED MODULE: ./src/ad-engine/models/ad-slot.ts













var ad_slot_AdSlot =
/*#__PURE__*/
function (_EventEmitter) {
  inherits_default()(AdSlot, _EventEmitter);

  function AdSlot(ad) {
    var _this;

    classCallCheck_default()(this, AdSlot);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(AdSlot).call(this));
    _this.config = void 0;
    _this.viewed = false;
    _this.element = null;
    _this.status = null;
    _this.enabled = void 0;
    _this.events = void 0;
    _this.adUnit = void 0;
    _this.config = services["c" /* context */].get("slots.".concat(ad.id)) || {};
    _this.enabled = !_this.config.disabled;
    _this.events = new utils["LazyQueue"]();

    _this.events.onItemFlush(function (event) {
      _this.on(event.name, event.callback);
    });

    _this.creativeId = null;
    _this.creativeSize = null;
    _this.lineItemId = null;
    _this.config.slotName = _this.config.slotName || ad.id;
    _this.config.targeting = _this.config.targeting || {};
    _this.config.targeting.src = _this.config.targeting.src || services["c" /* context */].get('src');
    _this.config.targeting.pos = _this.config.targeting.pos || _this.getSlotName();
    _this.winningPbBidderDetails = null;

    _this.once(AdSlot.SLOT_VIEWED_EVENT, function () {
      _this.viewed = true;
    });

    _this.onLoadPromise = new promise_default.a(function (resolve) {
      _this.once(AdSlot.SLOT_LOADED_EVENT, resolve);
    });

    _this.addClass(AdSlot.AD_CLASS);

    if (!_this.enabled) {
      services["m" /* slotTweaker */].hide(assertThisInitialized_default()(assertThisInitialized_default()(_this)));
    }

    _this.logger = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return utils["logger"].apply(void 0, [AdSlot.LOG_GROUP].concat(args));
    };

    return _this;
  }

  createClass_default()(AdSlot, [{
    key: "getAdUnit",
    value: function getAdUnit() {
      if (!this.adUnit) {
        this.adUnit = utils["stringBuilder"].build(this.config.adUnit || services["c" /* context */].get('adUnitId'), {
          slotConfig: this.config
        });
      }

      return this.adUnit;
    }
  }, {
    key: "getVideoAdUnit",
    value: function getVideoAdUnit() {
      return utils["stringBuilder"].build(this.config.videoAdUnit || services["c" /* context */].get('vast.adUnitId'), {
        slotConfig: this.config
      });
    }
  }, {
    key: "getElement",
    value: function getElement() {
      if (!this.element) {
        this.element = document.getElementById(this.getSlotName());
      }

      return this.element;
    }
  }, {
    key: "getSlotName",
    value: function getSlotName() {
      return this.config.slotName;
    }
  }, {
    key: "getSizes",
    value: function getSizes() {
      return this.config.sizes;
    }
    /**
     * Convenient property to get targeting.
     * @returns {Object}
     */

  }, {
    key: "getTargeting",
    value: function getTargeting() {
      return this.config.targeting;
    }
  }, {
    key: "getDefaultSizes",
    value: function getDefaultSizes() {
      return this.config.defaultSizes;
    }
  }, {
    key: "getVideoSizes",
    value: function getVideoSizes() {
      return this.config.videoSizes;
    }
  }, {
    key: "getViewportConflicts",
    value: function getViewportConflicts() {
      return this.config.viewportConflicts || [];
    }
  }, {
    key: "hasDefinedViewportConflicts",
    value: function hasDefinedViewportConflicts() {
      return this.getViewportConflicts().length > 0;
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: "setStatus",
    value: function setStatus() {
      var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.status = status;

      if (status !== null) {
        this.emit(status);
        listeners["d" /* slotListener */].emitStatusChanged(this);
      }
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return this.enabled;
    }
  }, {
    key: "isFirstCall",
    value: function isFirstCall() {
      return !!this.config.firstCall;
    }
  }, {
    key: "isViewed",
    value: function isViewed() {
      return this.viewed;
    }
  }, {
    key: "isRepeatable",
    value: function isRepeatable() {
      return !!this.config.repeat;
    }
  }, {
    key: "isOutOfPage",
    value: function isOutOfPage() {
      return !!this.config.outOfPage;
    }
  }, {
    key: "getCopy",
    value: function getCopy() {
      return JSON.parse(stringify_default()(this.config));
    }
  }, {
    key: "enable",
    value: function enable() {
      this.enabled = true;
    }
  }, {
    key: "disable",
    value: function disable() {
      var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.enabled = false;
      this.setStatus(status);
      services["m" /* slotTweaker */].hide(this);
    }
  }, {
    key: "getConfigProperty",
    value: function getConfigProperty(key) {
      return services["c" /* context */].get("slots.".concat(this.config.slotName, ".").concat(key));
    }
  }, {
    key: "setConfigProperty",
    value: function setConfigProperty(key, value) {
      services["c" /* context */].set("slots.".concat(this.config.slotName, ".").concat(key), value);
    }
  }, {
    key: "onLoad",
    value: function onLoad() {
      return this.onLoadPromise;
    }
  }, {
    key: "success",
    value: function success() {
      var _this2 = this;

      var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : AdSlot.STATUS_SUCCESS;
      services["m" /* slotTweaker */].show(this);
      this.setStatus(status);
      var templateNames = this.getConfigProperty('defaultTemplates');

      if (templateNames && templateNames.length) {
        templateNames.forEach(function (templateName) {
          return services["n" /* templateService */].init(templateName, _this2);
        });
      }
    }
  }, {
    key: "collapse",
    value: function collapse() {
      var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : AdSlot.STATUS_COLLAPSE;
      services["m" /* slotTweaker */].hide(this);
      this.setStatus(status);
    }
  }, {
    key: "emitEvent",
    value: function emitEvent() {
      var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (eventName !== null) {
        listeners["d" /* slotListener */].emitCustomEvent(eventName, this);
      }
    }
  }, {
    key: "updateWinningPbBidderDetails",
    value: function updateWinningPbBidderDetails() {
      if (this.targeting.hb_bidder && this.targeting.hb_pb) {
        this.winningPbBidderDetails = {
          name: this.targeting.hb_bidder,
          price: this.targeting.hb_pb
        };
      } else {
        this.winningPbBidderDetails = null;
      }
    }
  }, {
    key: "updateOnRenderEnd",
    value: function updateOnRenderEnd(event) {
      if (!event) {
        return;
      }

      var creativeId = event.creativeId,
          lineItemId = event.lineItemId;

      if (!event.isEmpty && event.slot) {
        var resp = event.slot.getResponseInformation();

        if (resp) {
          if (resp.sourceAgnosticCreativeId && resp.sourceAgnosticLineItemId) {
            this.logger('set line item and creative id to source agnostic values');
            creativeId = resp.sourceAgnosticCreativeId;
            lineItemId = resp.sourceAgnosticLineItemId;
          } else if (resp.creativeId === null && resp.lineItemId === null) {
            creativeId = providers["ADX"];
            lineItemId = providers["ADX"];
          }
        }
      }

      this.creativeId = creativeId;
      this.lineItemId = lineItemId;
      this.creativeSize = this.isOutOfPage() ? 'out-of-page' : event.size;
      services["i" /* slotDataParamsUpdater */].updateOnRenderEnd(this);
    }
    /**
     * Appends gpt-ad class to adSlot node.
     */

  }, {
    key: "addClass",
    value: function addClass(className) {
      var container = this.getElement();

      if (container) {
        container.classList.add(className);
        return true;
      }

      return false;
    }
  }, {
    key: "targeting",
    get: function get() {
      return this.config.targeting;
    }
  }]);

  return AdSlot;
}(external_eventemitter3_default.a);
ad_slot_AdSlot.PROPERTY_CHANGED_EVENT = 'propertyChanged';
ad_slot_AdSlot.SLOT_LOADED_EVENT = 'slotLoaded';
ad_slot_AdSlot.SLOT_VIEWED_EVENT = 'slotViewed';
ad_slot_AdSlot.VIDEO_VIEWED_EVENT = 'videoViewed';
ad_slot_AdSlot.LOG_GROUP = 'AdSlot';
ad_slot_AdSlot.STATUS_SUCCESS = 'success';
ad_slot_AdSlot.STATUS_COLLAPSE = 'collapse';
ad_slot_AdSlot.STATUS_ERROR = 'error';
ad_slot_AdSlot.AD_CLASS = 'gpt-ad';
// CONCATENATED MODULE: ./src/ad-engine/models/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "a", function() { return ad_slot_AdSlot; });


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gpt_provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ADX", function() { return _gpt_provider__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GptProvider", function() { return _gpt_provider__WEBPACK_IMPORTED_MODULE_0__["b"]; });

/* harmony import */ var _gpt_size_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(30);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GptSizeMap", function() { return _gpt_size_map__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony import */ var _gpt_targeting__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(29);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setupGptTargeting", function() { return _gpt_targeting__WEBPACK_IMPORTED_MODULE_2__["a"]; });

/* harmony import */ var _prebidium_provider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(43);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PrebidiumProvider", function() { return _prebidium_provider__WEBPACK_IMPORTED_MODULE_3__["a"]; });

/* harmony import */ var _provider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(42);
/* harmony import */ var _provider__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_provider__WEBPACK_IMPORTED_MODULE_4__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _provider__WEBPACK_IMPORTED_MODULE_4__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _provider__WEBPACK_IMPORTED_MODULE_4__[key]; }) }(__WEBPACK_IMPORT_KEY__));






/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return events; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return eventService; });
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(23);
/* harmony import */ var _babel_runtime_corejs2_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs2_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(18);
/* harmony import */ var _babel_runtime_corejs2_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs2_helpers_get__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(47);
/* harmony import */ var _babel_runtime_corejs2_helpers_get__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_get__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_corejs2_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(22);
/* harmony import */ var _babel_runtime_corejs2_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(13);
/* harmony import */ var _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(35);
/* harmony import */ var eventemitter3__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(eventemitter3__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(0);









var groupName = 'eventService';
var events = {
  AD_SLOT_CREATED: _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6___default()('AD_SLOT_CREATED'),
  AD_STACK_START: _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6___default()('AD_STACK_START'),
  BEFORE_PAGE_CHANGE_EVENT: _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6___default()('BEFORE_PAGE_CHANGE_EVENT'),
  PAGE_CHANGE_EVENT: _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6___default()('PAGE_CHANGE_EVENT'),
  PAGE_RENDER_EVENT: _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6___default()('PAGE_RENDER_EVENT'),
  // video events should happen in the order below
  VIDEO_AD_REQUESTED: _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6___default()('VIDEO_AD_REQUESTED'),
  VIDEO_AD_ERROR: _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6___default()('VIDEO_AD_ERROR'),
  VIDEO_AD_IMPRESSION: _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6___default()('VIDEO_AD_IMPRESSION'),
  VIDEO_AD_USED: _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6___default()('VIDEO_AD_USED'),
  BIDS_REFRESH: _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6___default()('BIDS_REFRESH'),
  PREBID_LAZY_CALL: _babel_runtime_corejs2_core_js_symbol__WEBPACK_IMPORTED_MODULE_6___default()('PREBID_LAZY_CALL')
};

var EventService =
/*#__PURE__*/
function (_EventEmitter$EventEm) {
  _babel_runtime_corejs2_helpers_inherits__WEBPACK_IMPORTED_MODULE_5___default()(EventService, _EventEmitter$EventEm);

  function EventService() {
    _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, EventService);

    return _babel_runtime_corejs2_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _babel_runtime_corejs2_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(EventService).apply(this, arguments));
  }

  _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(EventService, [{
    key: "emit",
    value: function emit(event) {
      var _get2;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      _utils__WEBPACK_IMPORTED_MODULE_8__["logger"].apply(void 0, [groupName, 'emit', event].concat(args));
      return (_get2 = _babel_runtime_corejs2_helpers_get__WEBPACK_IMPORTED_MODULE_4___default()(_babel_runtime_corejs2_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(EventService.prototype), "emit", this)).call.apply(_get2, [this, event].concat(args));
    }
  }]);

  return EventService;
}(eventemitter3__WEBPACK_IMPORTED_MODULE_7__["EventEmitter"]);

var eventService = new EventService();

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/slicedToArray");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/json/stringify");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/symbol");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/parse-int");

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return queryString; });
/* harmony import */ var _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _babel_runtime_corejs2_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);





var QueryString =
/*#__PURE__*/
function () {
  function QueryString() {
    _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, QueryString);
  }

  _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(QueryString, [{
    key: "getValues",
    value: function getValues() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var path = input || window.location.search.substr(1);
      var queryParameters = {};
      var queryString = path.split('&');

      if (queryString === '') {
        return null;
      }

      queryString.forEach(function (pair) {
        var _pair$split = pair.split('='),
            _pair$split2 = _babel_runtime_corejs2_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(_pair$split, 2),
            id = _pair$split2[0],
            value = _pair$split2[1];

        if (value) {
          queryParameters[id] = decodeURIComponent(value.replace(/\+/g, ' '));
        }
      });
      return queryParameters;
    }
  }, {
    key: "get",
    value: function get(key) {
      var queryParameters = this.getValues();
      return queryParameters[key];
    }
  }, {
    key: "isUrlParamSet",
    value: function isUrlParamSet(param) {
      return !!_babel_runtime_corejs2_core_js_parse_int__WEBPACK_IMPORTED_MODULE_0___default()(this.get(param), 10);
    }
  }]);

  return QueryString;
}();

var queryString = new QueryString();

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getTopOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getLeftOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getViewportHeight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getViewportWidth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return isInViewport; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return isInTheSameViewport; });
/**
 * Returns element's offset of given element depending on offset parameter name
 * @param element DOM element
 * @param offsetParameter node element parameter to count overall offset
 * @returns {number}
 */
function getElementOffset(element, offsetParameter) {
  var elementWindow = element.ownerDocument.defaultView;
  var currentElement = element;
  var hideAgain = false;
  var topPos = 0;

  if (element.classList.contains('hide')) {
    hideAgain = true;
    element.classList.remove('hide');
  }

  do {
    topPos += currentElement[offsetParameter];
    currentElement = currentElement.offsetParent;
  } while (currentElement !== null);

  if (hideAgain) {
    element.classList.add('hide');
  }

  if (elementWindow && elementWindow.frameElement) {
    topPos += getElementOffset(elementWindow.frameElement, offsetParameter);
  }

  return topPos;
}
/**
 * Returns element's offset of given element from the top of the page
 * @param element DOM element
 * @returns {number}
 */


function getTopOffset(element) {
  return getElementOffset(element, 'offsetTop');
}
/**
 * Returns element's offset of given element from the left of the page
 * @param element DOM element
 * @returns {number}
 */

function getLeftOffset(element) {
  return getElementOffset(element, 'offsetLeft');
}
/**
 * Returns client's viewport height
 * @returns {number}
 */

function getViewportHeight() {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}
/**
 * Returns client's viewport width
 * @returns {number}
 */

function getViewportWidth() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}
/**
 * Checks whether given element is in the viewport
 * @param element DOM element that is going to be checked
 * @param topOffset top offset that defines top margin of viewport, may be used to exclude navbar
 * @param bottomOffset bottom offset that defines bottom margin of viewport
 * @param areaThreshold element area that needs to be in/outside viewport to decide whether element
 * is in the viewport
 * @returns {boolean}
 */

function isInViewport(element) {
  var topOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var bottomOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var areaThreshold = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.5;
  var alwaysInViewportPositions = ['fixed', 'sticky'];
  var elementPosition = window.getComputedStyle(element).position;

  if (alwaysInViewportPositions.includes(elementPosition)) {
    return true;
  }

  var elementHeight = element.offsetHeight;
  var elementTop = getTopOffset(element);
  var elementBottom = elementTop + elementHeight;
  var scrollPosition = window.scrollY;
  var viewportHeight = getViewportHeight();
  var viewportTop = topOffset + scrollPosition;
  var viewportBottom = bottomOffset + scrollPosition + viewportHeight;
  var minimumElementArea = areaThreshold * elementHeight;
  return elementTop >= viewportTop - minimumElementArea && elementBottom <= viewportBottom + minimumElementArea;
}
function isInTheSameViewport(element) {
  var elementsToCompare = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  // According to https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
  // Hidden element does not have offsetParent
  if (element.offsetParent === null) {
    return false;
  }

  var elementHeight = element.offsetHeight;
  var elementOffset = getTopOffset(element);
  var viewportHeight = getViewportHeight();
  var conflicts = elementsToCompare.filter(function (conflictElement) {
    if (element.previousSibling && element.previousSibling.isSameNode(conflictElement) || element.nextSibling && element.nextSibling.isSameNode(conflictElement)) {
      return true;
    }

    var conflictHeight = conflictElement.offsetHeight;
    var conflictOffset = getTopOffset(conflictElement);
    var isFirst = conflictOffset < elementOffset;
    var distance = isFirst ? elementOffset - conflictOffset - conflictHeight : conflictOffset - elementOffset - elementHeight;
    return distance < viewportHeight;
  });
  return conflicts.length > 0;
}

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/toConsumableArray");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/getPrototypeOf");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("core-decorators");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/applyDecoratedDescriptor");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptor");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/inherits");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/possibleConstructorReturn");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/objectSpread");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/regenerator");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/assertThisInitialized");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("js-cookie");

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/json/stringify"
var stringify_ = __webpack_require__(12);
var stringify_default = /*#__PURE__*/__webpack_require__.n(stringify_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/classCallCheck"
var classCallCheck_ = __webpack_require__(2);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/createClass"
var createClass_ = __webpack_require__(3);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/parse-int"
var parse_int_ = __webpack_require__(14);
var parse_int_default = /*#__PURE__*/__webpack_require__.n(parse_int_);

// EXTERNAL MODULE: ./src/ad-engine/providers/index.ts
var providers = __webpack_require__(9);

// EXTERNAL MODULE: ./src/ad-engine/utils/index.ts + 14 modules
var utils = __webpack_require__(0);

// CONCATENATED MODULE: ./src/ad-engine/video/vast-parser.ts






var vast_parser_VastParser =
/*#__PURE__*/
function () {
  function VastParser() {
    classCallCheck_default()(this, VastParser);
  }

  createClass_default()(VastParser, [{
    key: "getLastNumber",

    /**
     * @private
     */
    value: function getLastNumber(possibleValues) {
      var i;
      var value = '';

      for (i = 0; i < possibleValues.length; i += 1) {
        if (!isNaN(parse_int_default()(possibleValues[i], 10))) {
          value = possibleValues[i];
        }
      }

      return value;
    }
  }, {
    key: "getAdInfo",
    value: function getAdInfo(imaAd) {
      var adInfo = {};

      if (imaAd) {
        adInfo.lineItemId = imaAd.getAdId();
        adInfo.creativeId = imaAd.getCreativeId();
        adInfo.contentType = imaAd.getContentType();
        var wrapperAdIds = imaAd.getWrapperAdIds() || [];

        if (wrapperAdIds && wrapperAdIds.length) {
          adInfo.lineItemId = this.getLastNumber(wrapperAdIds);
        }

        var wrapperCreativeIds = imaAd.getWrapperCreativeIds() || [];

        if (wrapperCreativeIds && wrapperCreativeIds.length) {
          adInfo.creativeId = this.getLastNumber(wrapperCreativeIds);
        }

        var wrapperAdSystems = imaAd.getWrapperAdSystems() || [];

        if (wrapperAdSystems && wrapperAdSystems.indexOf('AdSense/AdX') !== -1) {
          adInfo.lineItemId = providers["ADX"];
          adInfo.creativeId = providers["ADX"];
        }
      }

      return adInfo;
    }
  }, {
    key: "parse",
    value: function parse(vastUrl) {
      var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var currentAd = this.getAdInfo(extra.imaAd);
      var vastParams = utils["queryString"].getValues(vastUrl.substr(1 + vastUrl.indexOf('?')));
      var customParams = utils["queryString"].getValues(encodeURI(vastParams.cust_params));
      return {
        contentType: currentAd.contentType || extra.contentType,
        creativeId: currentAd.creativeId || extra.creativeId,
        customParams: customParams,
        lineItemId: currentAd.lineItemId || extra.lineItemId,
        position: vastParams.vpos,
        size: vastParams.sz
      };
    }
  }]);

  return VastParser;
}();

var vastParser = new vast_parser_VastParser();
// CONCATENATED MODULE: ./src/ad-engine/video/vast-debugger.ts





function setAttribute(element, attribute, value) {
  if (!element || !value) {
    return;
  }

  element.setAttribute(attribute, value);
}

var vast_debugger_VastDebugger =
/*#__PURE__*/
function () {
  function VastDebugger() {
    classCallCheck_default()(this, VastDebugger);
  }

  createClass_default()(VastDebugger, [{
    key: "setVastAttributesFromVastParams",
    value: function setVastAttributesFromVastParams(element, status, vastParams) {
      setAttribute(element, 'data-vast-content-type', vastParams.contentType);
      setAttribute(element, 'data-vast-creative-id', vastParams.creativeId);
      setAttribute(element, 'data-vast-line-item-id', vastParams.lineItemId);
      setAttribute(element, 'data-vast-position', vastParams.position);
      setAttribute(element, 'data-vast-size', vastParams.size);
      setAttribute(element, 'data-vast-status', status);
      setAttribute(element, 'data-vast-params', stringify_default()(vastParams.customParams));
    }
  }, {
    key: "setVastAttributes",
    value: function setVastAttributes(element, vastUrl, status, imaAd) {
      var vastParams = vastParser.parse(vastUrl, {
        imaAd: imaAd
      });
      this.setVastAttributesFromVastParams(element, status, vastParams);
    }
  }]);

  return VastDebugger;
}();

var vastDebugger = new vast_debugger_VastDebugger();
// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/keys"
var keys_ = __webpack_require__(5);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/objectSpread"
var objectSpread_ = __webpack_require__(24);
var objectSpread_default = /*#__PURE__*/__webpack_require__.n(objectSpread_);

// EXTERNAL MODULE: ./src/ad-engine/services/index.ts + 11 modules
var services = __webpack_require__(1);

// CONCATENATED MODULE: ./src/ad-engine/video/vast-url-builder.ts



var availableVideoPositions = ['preroll', 'midroll', 'postroll'];
var baseUrl = 'https://pubads.g.doubleclick.net/gampad/ads?';
var correlator = Math.round(Math.random() * 10000000000);

function getCustomParameters(slot) {
  var extraTargeting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var params = objectSpread_default()({}, services["c" /* context */].get('targeting'), slot.getTargeting(), extraTargeting);

  return encodeURIComponent(keys_default()(params).filter(function (key) {
    return params[key];
  }).map(function (key) {
    return "".concat(key, "=").concat(params[key]);
  }).join('&'));
}

function getVideoSizes(slot) {
  var sizes = slot.getVideoSizes();

  if (sizes) {
    return sizes.map(function (size) {
      return size.join('x');
    }).join('|');
  }

  return '640x480';
}

function buildVastUrl(aspectRatio, slotName) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var params = ['output=vast', 'env=vp', 'gdfp_req=1', 'impl=s', 'unviewed_position_start=1', "url=".concat(encodeURIComponent(window.location.href)), "description_url=".concat(encodeURIComponent(window.location.href)), "correlator=".concat(correlator)];
  var slot = services["l" /* slotService */].get(slotName);

  if (slot) {
    params.push("iu=".concat(slot.getVideoAdUnit()));
    params.push("sz=".concat(getVideoSizes(slot)));
    params.push("cust_params=".concat(getCustomParameters(slot, options.targeting)));
  } else if (options.videoAdUnitId && options.customParams) {
    // This condition can be removed once we have Porvata3 and AdEngine3 everywhere
    params.push("iu=".concat(options.videoAdUnitId));
    params.push("sz=640x480");
    params.push("cust_params=".concat(encodeURIComponent(options.customParams)));
  } else {
    throw Error('Slot does not exist!');
  }

  if (options.contentSourceId && options.videoId) {
    params.push("cmsid=".concat(options.contentSourceId));
    params.push("vid=".concat(options.videoId));
  }

  if (options.vpos && availableVideoPositions.indexOf(options.vpos) > -1) {
    params.push("vpos=".concat(options.vpos));
  }

  if (options.numberOfAds !== undefined) {
    params.push("pmad=".concat(options.numberOfAds));
  }

  params.push("npa=".concat(services["o" /* trackingOptIn */].isOptedIn() ? 0 : 1));
  return baseUrl + params.join('&');
}
// EXTERNAL MODULE: ./src/ad-engine/listeners/index.ts + 3 modules
var listeners = __webpack_require__(7);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/promise"
var promise_ = __webpack_require__(6);
var promise_default = /*#__PURE__*/__webpack_require__.n(promise_);

// CONCATENATED MODULE: ./src/ad-engine/video/player/porvata/moat/moat-video-tracker-script.js
// Fixes for MOAT script incompatibility
var eventMapping = {};
var moat_video_tracker_script_listeners = [];
var moatapi = {}; // MOAT CODE START

/* Copyright (c) 2011-2016 Moat Inc. All Rights Reserved. */

function initMoatTracking(a, f, c) {
  if (!1 === f.hasOwnProperty("partnerCode")) return !1;
  var g = document.createElement("script");
  c = c || a && ("undefined" !== typeof a.O ? a.O.parentNode : document.body) || document.body;
  moat_video_tracker_script_listeners = [];
  moatapi = {
    adsManager: a,
    ids: f,
    imaSDK: !0,
    events: []
  };
  eventMapping = {
    complete: "AdVideoComplete",
    firstquartile: "AdVideoFirstQuartile",
    impression: "AdImpression",
    loaded: "AdLoaded",
    midpoint: "AdVideoMidpoint",
    pause: "AdPaused",
    skip: "AdSkipped",
    start: "AdVideoStart",
    thirdquartile: "AdVideoThirdQuartile",
    volumeChange: "AdVolumeChange"
  };

  if (google && google.ima && a) {
    var d = "_moatApi" + Math.floor(1E8 * Math.random()),
        h;

    for (h in google.ima.AdEvent.Type) {
      var l = function l(b) {
        if (moatapi.sendEvent) {
          for (b = moat_video_tracker_script_listeners.length - 1; 0 <= b; b--) {
            a.removeEventListener(moat_video_tracker_script_listeners[b].type, moat_video_tracker_script_listeners[b].func);
          }

          moatapi.sendEvent(moatapi.events);
        } else moatapi.events.push({
          type: eventMapping[b.type] || b.type,
          adVolume: a.getVolume()
        });
      };

      a.addEventListener(google.ima.AdEvent.Type[h], l);
      moat_video_tracker_script_listeners.push({
        type: google.ima.AdEvent.Type[h],
        func: l
      });
    }
  }

  var d = "undefined" !== typeof d ? d : "",
      e,
      k;

  try {
    e = c.ownerDocument, k = e.defaultView || e.parentWindow;
  } catch (m) {
    e = document, k = window;
  }

  k[d] = moatapi;
  g.type = "text/javascript";
  c && c.appendChild(g);
  g.src = "https://z.moatads.com/" + f.partnerCode + "/moatvideo.js#" + d;
}
; // MOAT CODE END
// CONCATENATED MODULE: ./src/ad-engine/video/player/porvata/moat/moat-video-tracker.ts





var logGroup = 'moat-video-tracker';

var moat_video_tracker_MoatVideoTracker =
/*#__PURE__*/
function () {
  function MoatVideoTracker() {
    classCallCheck_default()(this, MoatVideoTracker);
  }

  createClass_default()(MoatVideoTracker, [{
    key: "init",
    value: function init(adsManager, container, viewMode, slicer1, slicer2) {
      var ids = {
        partnerCode: services["c" /* context */].get('options.video.moatTracking.partnerCode'),
        viewMode: viewMode,
        slicer1: slicer1,
        slicer2: slicer2
      };

      try {
        initMoatTracking(adsManager, ids, container);
        Object(utils["logger"])(logGroup, 'MOAT video tracking initialized');
      } catch (error) {
        Object(utils["logger"])(logGroup, 'MOAT video tracking initalization error', error);
      }
    }
  }]);

  return MoatVideoTracker;
}();

var moatVideoTracker = new moat_video_tracker_MoatVideoTracker();
// CONCATENATED MODULE: ./src/ad-engine/video/player/porvata/ima/google-ima-setup.ts



var google_ima_setup_logGroup = 'google-ima-setup';

function getOverriddenVast() {
  if (utils["queryString"].get('porvata_override_vast') === '1') {
    var vastXML = window.localStorage.getItem('porvata_vast');
    Object(utils["logger"])(google_ima_setup_logGroup, 'Overridden VAST', vastXML);
    return vastXML;
  }

  return null;
}

function createRequest(params) {
  var adSlot = services["l" /* slotService */].get(params.slotName);
  var adsRequest = new window.google.ima.AdsRequest();
  var overriddenVast = getOverriddenVast();

  if (params.vastResponse || overriddenVast) {
    adsRequest.adsResponse = overriddenVast || params.vastResponse;
  } // DEPRECATED: options.porvata.audio.segment


  var segment = services["c" /* context */].get('options.porvata.audio.segment');

  if (segment) {
    adSlot.setConfigProperty('audioSegment', params.autoPlay ? '' : segment);
  }

  adSlot.setConfigProperty('autoplay', params.autoPlay);
  adSlot.setConfigProperty('audio', !params.autoPlay);
  adSlot.setConfigProperty('targeting.autoplay', params.autoPlay ? 'yes' : 'no');
  adSlot.setConfigProperty('targeting.audio', !params.autoPlay ? 'yes' : 'no');
  adsRequest.adTagUrl = params.vastUrl || buildVastUrl(params.width / params.height, params.slotName, {
    targeting: params.vastTargeting
  });
  adsRequest.linearAdSlotWidth = params.width;
  adsRequest.linearAdSlotHeight = params.height;
  return adsRequest;
}

function getRenderingSettings() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var adsRenderingSettings = new window.google.ima.AdsRenderingSettings();
  var maximumRecommendedBitrate = 68000; // 2160p High Frame Rate

  if (!services["c" /* context */].get('state.isMobile')) {
    adsRenderingSettings.bitrate = maximumRecommendedBitrate;
  }

  adsRenderingSettings.loadVideoTimeout = params.loadVideoTimeout || 15000;
  adsRenderingSettings.enablePreloading = true;
  adsRenderingSettings.uiElements = [];
  return adsRenderingSettings;
}

var googleImaSetup = {
  createRequest: createRequest,
  getRenderingSettings: getRenderingSettings
};
// CONCATENATED MODULE: ./src/ad-engine/video/player/porvata/ima/google-ima-player-factory.ts






function getVideoElement() {
  var videoElement = document.createElement('video');
  videoElement.setAttribute('preload', 'none');
  return videoElement;
}

var google_ima_player_factory_GoogleImaPlayer =
/*#__PURE__*/
function () {
  function GoogleImaPlayer(adDisplayContainer, adsLoader, params) {
    classCallCheck_default()(this, GoogleImaPlayer);

    this.isAdsManagerLoaded = false;
    this.status = '';
    this.adDisplayContainer = adDisplayContainer;
    this.adsLoader = adsLoader;
    this.adsManager = null;
    this.params = params;
    this.videoAd = params.container.querySelector('video');
    this.eventListeners = {};
    this.vastUrl = '';
  }

  createClass_default()(GoogleImaPlayer, [{
    key: "setVastUrl",
    value: function setVastUrl(vastUrl) {
      this.vastUrl = vastUrl;
    }
  }, {
    key: "setAdsManager",
    value: function setAdsManager(adsManager) {
      this.adsManager = adsManager;
      this.isAdsManagerLoaded = true;
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(eventName, callback) {
      var _this = this;

      if (eventName.indexOf('wikia') !== -1) {
        this.eventListeners[eventName] = this.eventListeners[eventName] || [];
        this.eventListeners[eventName].push(callback);
        return;
      }

      if (this.isAdsManagerLoaded) {
        this.adsManager.addEventListener(eventName, callback);
      } else {
        this.adsLoader.addEventListener('adsManagerLoaded', function () {
          _this.adsManager.addEventListener(eventName, callback);
        });
      }
    }
  }, {
    key: "setVastAttributes",
    value: function setVastAttributes(status) {
      var currentAd = this.adsManager && this.adsManager.getCurrentAd && this.adsManager.getCurrentAd();
      var playerElement = this.params.container.querySelector('.video-player');
      vastDebugger.setVastAttributes(playerElement, this.vastUrl, status, currentAd);
    }
  }, {
    key: "setAutoPlay",
    value: function setAutoPlay(value) {
      if (this.videoAd) {
        this.videoAd.autoplay = value;
        this.videoAd.muted = value;
      }

      this.params.autoPlay = value;
    }
  }, {
    key: "playVideo",
    value: function playVideo(width, height) {
      var _this2 = this;

      var callback = function callback() {
        _this2.dispatchEvent('wikiaAdPlayTriggered'); // https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdDisplayContainer.initialize


        _this2.adDisplayContainer.initialize();

        _this2.adsManager.init(Math.round(width), Math.round(height), window.google.ima.ViewMode.NORMAL);

        _this2.adsManager.start();

        _this2.adsLoader.removeEventListener('adsManagerLoaded', callback);
      };

      if (this.isAdsManagerLoaded) {
        callback();
      } else {
        // When adsManager is not loaded yet video can't start without click on mobile
        // Muted auto play is workaround to run video on adsManagerLoaded event
        this.setAutoPlay(true);
        this.adsLoader.addEventListener('adsManagerLoaded', callback, false);
      }
    }
  }, {
    key: "reload",
    value: function reload() {
      var adRequest = googleImaSetup.createRequest(this.params);
      this.adsManager.destroy();
      this.adsLoader.contentComplete();
      this.setVastUrl(adRequest.adTagUrl);
      this.adsLoader.requestAds(adRequest);
    }
  }, {
    key: "resize",
    value: function resize(width, height) {
      var isFullscreen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var viewMode = window.google.ima.ViewMode;

      if (this.adsManager) {
        this.adsManager.resize(Math.round(width), Math.round(height), isFullscreen ? viewMode.FULLSCREEN : viewMode.NORMAL);
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(eventName) {
      if (this.eventListeners[eventName] && this.eventListeners[eventName].length > 0) {
        this.eventListeners[eventName].forEach(function (callback) {
          callback({});
        });
      }
    }
  }, {
    key: "setStatus",
    value: function setStatus(newStatus) {
      var _this3 = this;

      return function () {
        _this3.status = newStatus;
      };
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: "getAdsManager",
    value: function getAdsManager() {
      return this.adsManager;
    }
  }]);

  return GoogleImaPlayer;
}();

var googleImaPlayerFactory = {
  create: function create(adDisplayContainer, adsLoader, videoSettings) {
    var adRequest = googleImaSetup.createRequest(videoSettings.getParams());
    var player = new google_ima_player_factory_GoogleImaPlayer(adDisplayContainer, adsLoader, videoSettings.getParams());
    var videoElement = getVideoElement();

    if (player.videoAd) {
      player.videoAd.classList.add('porvata-video');
      videoSettings.getContainer().classList.add('porvata');
    }

    adsLoader.addEventListener('adsManagerLoaded', function (adsManagerLoadedEvent) {
      var renderingSettings = googleImaSetup.getRenderingSettings(videoSettings);
      var adsManager = adsManagerLoadedEvent.getAdsManager(videoElement, renderingSettings);
      player.setAdsManager(adsManager);

      if (videoSettings.isMoatTrackingEnabled()) {
        moatVideoTracker.init(adsManager, videoSettings.getContainer(), window.google.ima.ViewMode.NORMAL, videoSettings.get('src'), "".concat(videoSettings.get('adProduct'), "/").concat(videoSettings.get('slotName')));
      }

      player.dispatchEvent('wikiaAdsManagerLoaded');
      adsManager.addEventListener('loaded', function () {
        return player.setVastAttributes('success');
      });
      adsManager.addEventListener('adError', function () {
        return player.setVastAttributes('error');
      });
    }, false);
    adsLoader.addEventListener('adError', function (event) {
      var emptyVastErrorCode = window.google.ima.AdError.ErrorCode.VAST_EMPTY_RESPONSE;

      if (typeof event.getError === 'function' && event.getError().getErrorCode() === emptyVastErrorCode) {
        player.dispatchEvent('wikiaEmptyAd');
      }

      player.setVastAttributes('error');
    });
    player.setVastUrl(adRequest.adTagUrl);
    adsLoader.requestAds(adRequest);

    if (videoSettings.get('autoPlay')) {
      player.setAutoPlay(true);
    }

    player.addEventListener('resume', player.setStatus('playing'));
    player.addEventListener('start', player.setStatus('playing'));
    player.addEventListener('pause', player.setStatus('paused'));
    player.addEventListener('wikiaAdStop', player.setStatus('stopped'));
    player.addEventListener('allAdsCompleted', player.setStatus('stopped'));
    return player;
  }
};
// CONCATENATED MODULE: ./src/ad-engine/video/player/porvata/ima/google-ima.ts



var imaLibraryUrl = '//imasdk.googleapis.com/js/sdkloader/ima3.js';

function load() {
  if (window.google && window.google.ima) {
    return new promise_default.a(function (resolve) {
      resolve();
    });
  }

  return utils["scriptLoader"].loadScript(imaLibraryUrl);
}

function google_ima_getPlayer(videoSettings) {
  var adDisplayContainer = new window.google.ima.AdDisplayContainer(videoSettings.getContainer());
  var iframe = videoSettings.getContainer().querySelector('div > iframe'); // Reload iframe in order to make IMA work when user is moving back/forward to the page with
  // player
  // https://groups.google.com/forum/#!topic/ima-sdk/Q6Y56CcXkpk
  // https://github.com/googleads/videojs-ima/issues/110

  if (window.performance && window.performance.navigation && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
    iframe.contentWindow.location.href = iframe.src;
  }

  var adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);
  adsLoader.getSettings().setVpaidMode(videoSettings.getVpaidMode());
  return googleImaPlayerFactory.create(adDisplayContainer, adsLoader, videoSettings);
}

var googleIma = {
  load: load,
  getPlayer: google_ima_getPlayer
};
// CONCATENATED MODULE: ./src/ad-engine/video/player/porvata/video-settings.ts





function getMoatTrackingStatus(params) {
  var sampling = services["c" /* context */].get('options.video.moatTracking.sampling');

  if (typeof params.moatTracking === 'boolean') {
    return params.moatTracking;
  }

  if (!services["c" /* context */].get('options.video.moatTracking.enabled')) {
    return false;
  }

  if (sampling === 100) {
    return true;
  }

  if (sampling > 0) {
    return utils["sampler"].sample('moat_video_tracking', sampling);
  }

  return false;
}

var video_settings_VideoSettings =
/*#__PURE__*/
function () {
  function VideoSettings() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    classCallCheck_default()(this, VideoSettings);

    this.params = params;
    this.moatTracking = getMoatTrackingStatus(params);
  }

  createClass_default()(VideoSettings, [{
    key: "get",
    value: function get(key) {
      return this.params[key];
    }
  }, {
    key: "getContainer",
    value: function getContainer() {
      return this.get('container');
    }
  }, {
    key: "getParams",
    value: function getParams() {
      return this.params;
    }
  }, {
    key: "getVpaidMode",
    value: function getVpaidMode() {
      if (typeof this.params.vpaidMode !== 'undefined') {
        return this.params.vpaidMode;
      }

      return window.google.ima.ImaSdkSettings.VpaidMode.ENABLED;
    }
  }, {
    key: "isMoatTrackingEnabled",
    value: function isMoatTrackingEnabled() {
      return this.moatTracking;
    }
  }, {
    key: "isAutoPlay",
    value: function isAutoPlay() {
      return this.params.autoPlay;
    }
  }]);

  return VideoSettings;
}();
// CONCATENATED MODULE: ./src/ad-engine/video/player/porvata/porvata.ts







var VIDEO_FULLSCREEN_CLASS_NAME = 'video-player-fullscreen';
var STOP_SCROLLING_CLASS_NAME = 'stop-scrolling';

var prepareVideoAdContainer = function prepareVideoAdContainer(params) {
  var videoAdContainer = params.container.querySelector('div');
  videoAdContainer.classList.add('video-player');
  videoAdContainer.classList.add('hide');
  return videoAdContainer;
};

var porvata_nativeFullscreenOnElement = function nativeFullscreenOnElement(element) {
  var enter = Object(utils["tryProperty"])(element, ['webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen', 'requestFullscreen']);
  var exit = Object(utils["tryProperty"])(document, ['webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen', 'exitFullscreen']);
  var fullscreenChangeEvent = (Object(utils["whichProperty"])(document, ['onwebkitfullscreenchange', 'onmozfullscreenchange', 'onmsfullscreenchange', 'onfullscreenchange']) || '').replace(/^on/, '').replace('msfullscreenchange', 'MSFullscreenChange');

  var addChangeListener = function addChangeListener() {
    var _document;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_document = document).addEventListener.apply(_document, [fullscreenChangeEvent].concat(args));
  };

  var removeChangeListener = function removeChangeListener() {
    var _document2;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return (_document2 = document).removeEventListener.apply(_document2, [fullscreenChangeEvent].concat(args));
  };

  var isSupported = function isSupported() {
    return Boolean(enter && exit);
  };

  return {
    enter: enter,
    exit: exit,
    addChangeListener: addChangeListener,
    removeChangeListener: removeChangeListener,
    isSupported: isSupported
  };
};

var porvata_PorvataPlayer =
/*#__PURE__*/
function () {
  function PorvataPlayer(ima, params, videoSettings) {
    var _this = this;

    classCallCheck_default()(this, PorvataPlayer);

    this.ima = ima;
    this.container = prepareVideoAdContainer(params);
    this.mobileVideoAd = params.container.querySelector('video');
    this.params = params;
    this.videoSettings = videoSettings;
    this.isFloating = false;
    var nativeFullscreen = porvata_nativeFullscreenOnElement(this.container);
    this.fullscreen = Boolean(params.isFullscreen);
    this.nativeFullscreen = nativeFullscreen;
    this.width = params.width;
    this.height = params.height;
    this.muteProtect = false;
    this.defaultVolume = 0.75;
    this.destroyCallbacks = new utils["LazyQueue"]();
    this.destroyCallbacks.onItemFlush(function (callback) {
      return callback();
    });

    if (nativeFullscreen.isSupported()) {
      nativeFullscreen.addChangeListener(function () {
        return _this.onFullscreenChange();
      });
    }
  }

  createClass_default()(PorvataPlayer, [{
    key: "addEventListener",
    value: function addEventListener(eventName, callback) {
      this.ima.addEventListener(eventName, callback);
    }
  }, {
    key: "getRemainingTime",
    value: function getRemainingTime() {
      return this.ima.getAdsManager().getRemainingTime();
    }
  }, {
    key: "isFullscreen",
    value: function isFullscreen() {
      return this.fullscreen;
    }
  }, {
    key: "isMuted",
    value: function isMuted() {
      return this.ima.getAdsManager().getVolume() === 0;
    }
  }, {
    key: "isMobilePlayerMuted",
    value: function isMobilePlayerMuted() {
      var mobileVideoAd = this.container.querySelector('video');
      return mobileVideoAd && mobileVideoAd.autoplay && mobileVideoAd.muted;
    }
  }, {
    key: "isPaused",
    value: function isPaused() {
      return this.ima.getStatus() === 'paused';
    }
  }, {
    key: "isPlaying",
    value: function isPlaying() {
      return this.ima.getStatus() === 'playing';
    }
  }, {
    key: "pause",
    value: function pause() {
      this.ima.getAdsManager().pause();
    }
  }, {
    key: "play",
    value: function play(newWidth, newHeight) {
      if (newWidth !== undefined && newHeight !== undefined) {
        this.width = newWidth;
        this.height = newHeight;
      }

      if (!this.width || !this.height || this.isFullscreen()) {
        this.width = this.params.container.offsetWidth;
        this.height = this.params.container.offsetHeight;
      }

      this.ima.playVideo(this.width, this.height);
    }
  }, {
    key: "reload",
    value: function reload() {
      this.ima.reload();
    }
  }, {
    key: "resize",
    value: function resize(newWidth, newHeight) {
      if (isFinite(newWidth) && isFinite(newHeight)) {
        this.width = newWidth;
        this.height = newHeight;
      }

      if (this.isFullscreen()) {
        this.ima.resize(window.innerWidth, window.innerHeight, true);
      } else {
        this.ima.resize(this.width, this.height, false);
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      this.ima.getAdsManager().resume();
    }
  }, {
    key: "rewind",
    value: function rewind() {
      this.params.autoPlay = false;
      this.ima.setAutoPlay(false);
      this.ima.dispatchEvent('wikiaAdRestart');
      this.play();
    }
  }, {
    key: "setVolume",
    value: function setVolume(volume) {
      this.updateVideoDOMElement(volume);
      this.ima.getAdsManager().setVolume(volume); // This is hack for Safari, because it can't dispatch original IMA event (volumeChange)

      this.ima.dispatchEvent('wikiaVolumeChange');
    }
  }, {
    key: "toggleFullscreen",
    value: function toggleFullscreen() {
      var isFullscreen = this.isFullscreen();
      var nativeFullscreen = this.nativeFullscreen;
      this.muteProtect = true;

      if (nativeFullscreen.isSupported()) {
        var toggleNativeFullscreen = isFullscreen ? nativeFullscreen.exit : nativeFullscreen.enter;
        toggleNativeFullscreen();
      } else {
        this.onFullscreenChange();
      }
    }
  }, {
    key: "onFullscreenChange",
    value: function onFullscreenChange() {
      this.fullscreen = !this.fullscreen;

      if (this.isFullscreen()) {
        this.container.classList.add(VIDEO_FULLSCREEN_CLASS_NAME);
        document.documentElement.classList.add(STOP_SCROLLING_CLASS_NAME);
      } else {
        this.container.classList.remove(VIDEO_FULLSCREEN_CLASS_NAME);
        document.documentElement.classList.remove(STOP_SCROLLING_CLASS_NAME);

        if (this.muteProtect) {
          this.muteProtect = false;
        } else if (this.isPlaying() && !this.isMuted()) {
          this.mute();
        }
      }

      this.resize();
      this.ima.dispatchEvent('wikiaFullscreenChange');
    }
  }, {
    key: "updateVideoDOMElement",
    value: function updateVideoDOMElement(volume) {
      if (this.mobileVideoAd) {
        this.mobileVideoAd.muted = volume === 0;
        this.mobileVideoAd.volume = volume;
      }
    }
  }, {
    key: "mute",
    value: function mute() {
      this.setVolume(0);
    }
  }, {
    key: "unmute",
    value: function unmute() {
      this.setVolume(this.defaultVolume);

      if (this.params.autoPlay && this.params.restartOnUnmute) {
        this.rewind();
      }
    }
  }, {
    key: "volumeToggle",
    value: function volumeToggle() {
      if (this.isMuted()) {
        this.unmute();
        this.ima.dispatchEvent('wikiaAdUnmute');
      } else {
        this.mute();
        this.ima.dispatchEvent('wikiaAdMute');
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      this.ima.getAdsManager().stop();
      this.ima.dispatchEvent('wikiaAdStop');
    }
  }, {
    key: "addOnDestroyCallback",
    value: function addOnDestroyCallback(callback) {
      this.destroyCallbacks.push(callback);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.destroyCallbacks.flush();
    }
  }]);

  return PorvataPlayer;
}();
var porvata_Porvata =
/*#__PURE__*/
function () {
  function Porvata() {
    classCallCheck_default()(this, Porvata);
  }

  createClass_default()(Porvata, null, [{
    key: "addOnViewportChangeListener",

    /**
     * @private
     * @returns listener id
     */
    value: function addOnViewportChangeListener(params, listener) {
      return utils["viewportObserver"].addListener(params.viewportHookElement || params.container, listener, {
        offsetTop: params.viewportOffsetTop || 0,
        offsetBottom: params.viewportOffsetBottom || 0
      });
    }
  }, {
    key: "inject",
    value: function inject(params) {
      var porvataListener = new listeners["a" /* PorvataListener */]({
        adProduct: params.adProduct,
        position: params.slotName,
        src: params.src,
        withAudio: !params.autoPlay,
        withCtp: !params.autoPlay
      });
      var isFirstPlay = true;
      var autoPaused = false;
      var autoPlayed = false;
      var viewportListenerId = null;

      function muteFirstPlay(video) {
        video.addEventListener('loaded', function () {
          if (isFirstPlay) {
            video.mute();
          }
        });
      }

      params.vastTargeting = params.vastTargeting || {
        passback: 'porvata'
      };
      var videoSettings = new video_settings_VideoSettings(params);
      porvataListener.init();
      return googleIma.load().then(function () {
        return googleIma.getPlayer(videoSettings);
      }).then(function (ima) {
        return new porvata_PorvataPlayer(ima, params, videoSettings);
      }).then(function (video) {
        function inViewportCallback(isVisible) {
          // Play video automatically only for the first time
          if (isVisible && !autoPlayed && params.autoPlay) {
            video.ima.dispatchEvent('wikiaFirstTimeInViewport');
            video.play();
            autoPlayed = true; // Don't resume when video was paused manually
          } else if (isVisible && autoPaused) {
            video.resume(); // Pause video once it's out of viewport and set autoPaused to distinguish manual
            // and auto pause
          } else if (!isVisible && video.isPlaying() && !params.blockOutOfViewportPausing) {
            video.pause();
            autoPaused = true;
          }
        }

        function setupAutoPlayMethod() {
          if (params.blockOutOfViewportPausing && !params.startInViewportOnly) {
            if (params.autoPlay && !autoPlayed) {
              autoPlayed = true;
              video.play();
            }
          } else {
            viewportListenerId = Porvata.addOnViewportChangeListener(params, inViewportCallback);
          }
        }

        porvataListener.registerVideoEvents(video);
        video.addEventListener('adCanPlay', function () {
          video.ima.dispatchEvent('wikiaAdStarted');
        });
        video.addEventListener('allAdsCompleted', function () {
          if (video.isFullscreen()) {
            video.toggleFullscreen();
          }

          video.ima.setAutoPlay(false);
          video.ima.dispatchEvent('wikiaAdCompleted');

          if (viewportListenerId) {
            utils["viewportObserver"].removeListener(viewportListenerId);
            viewportListenerId = null;
          }

          isFirstPlay = false;
          porvataListener.params.withAudio = true;
          porvataListener.params.withCtp = true;
        });
        video.addEventListener('wikiaAdRestart', function () {
          isFirstPlay = false;
        });
        video.addEventListener('start', function () {
          video.ima.dispatchEvent('wikiaAdPlay');

          if (!viewportListenerId && !autoPlayed) {
            setupAutoPlayMethod();
          }
        });
        video.addEventListener('resume', function () {
          video.ima.dispatchEvent('wikiaAdPlay');
          autoPaused = false;
        });
        video.addEventListener('pause', function () {
          video.ima.dispatchEvent('wikiaAdPause');
        });
        video.addOnDestroyCallback(function () {
          if (viewportListenerId) {
            utils["viewportObserver"].removeListener(viewportListenerId);
            viewportListenerId = null;
          }
        });

        if (params.autoPlay) {
          muteFirstPlay(video);
        }

        if (params.onReady) {
          params.onReady(video);
        }

        video.addEventListener('wikiaAdsManagerLoaded', function () {
          setupAutoPlayMethod();
        });
        video.addEventListener('wikiaEmptyAd', function () {
          viewportListenerId = Porvata.addOnViewportChangeListener(params, function () {
            video.ima.dispatchEvent('wikiaFirstTimeInViewport');
            utils["viewportObserver"].removeListener(viewportListenerId);
          });
        });
        return video;
      });
    }
  }, {
    key: "isVpaid",
    value: function isVpaid(contentType) {
      return contentType === 'application/javascript';
    }
  }, {
    key: "isVideoAutoplaySupported",
    value: function isVideoAutoplaySupported() {
      var isAndroid = utils["client"].getOperatingSystem() === 'Android';
      var browser = utils["client"].getBrowser().split(' ');
      var isCompatibleChrome = browser[0].indexOf('Chrome') !== -1 && parse_int_default()(browser[1], 10) >= 54;
      return !isAndroid || isCompatibleChrome;
    }
  }]);

  return Porvata;
}();
// CONCATENATED MODULE: ./src/ad-engine/video/player/porvata/index.ts




// EXTERNAL MODULE: external "@babel/runtime-corejs2/regenerator"
var regenerator_ = __webpack_require__(25);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/asyncToGenerator"
var asyncToGenerator_ = __webpack_require__(34);
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator_);

// EXTERNAL MODULE: ./src/ad-engine/listeners/twitch-listener.ts
var twitch_listener = __webpack_require__(31);

// CONCATENATED MODULE: ./src/ad-engine/video/player/twitch/embed/twitch-embed.ts


var twitchLibraryUrl = '//player.twitch.tv/js/embed/v1.js';

function twitch_embed_load() {
  if (window.Twitch) {
    return promise_default.a.resolve();
  }

  return utils["scriptLoader"].loadScript(twitchLibraryUrl);
}

function getLibrary() {
  return window.Twitch;
}

function twitch_embed_getPlayer(identifier, videoSettings) {
  return new window.Twitch.Player(identifier, videoSettings);
}

var twitchEmbed = {
  load: twitch_embed_load,
  getLibrary: getLibrary,
  getPlayer: twitch_embed_getPlayer
};
// CONCATENATED MODULE: ./src/ad-engine/video/player/twitch/twitch.ts






var twitch_TwitchPlayer =
/*#__PURE__*/
function () {
  function TwitchPlayer(identifier, videoSettings, params) {
    classCallCheck_default()(this, TwitchPlayer);

    this.identifier = identifier;
    this.videoSettings = videoSettings;
    this.params = params;
  }

  createClass_default()(TwitchPlayer, [{
    key: "getPlayer",
    value: function () {
      var _getPlayer = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee() {
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return twitch_Twitch.inject(this.identifier, this.videoSettings, this.params);

              case 2:
                this.player = _context.sent;
                return _context.abrupt("return", this.player);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getPlayer() {
        return _getPlayer.apply(this, arguments);
      }

      return getPlayer;
    }()
  }, {
    key: "addEventListener",
    value: function addEventListener(eventName, callback) {
      this.player.addEventListener(eventName, callback);
    }
  }, {
    key: "getIdentifier",
    value: function getIdentifier() {
      return this.identifier;
    }
  }, {
    key: "getVideoSettings",
    value: function getVideoSettings() {
      return this.videoSettings;
    }
  }]);

  return TwitchPlayer;
}();
var twitch_Twitch =
/*#__PURE__*/
function () {
  function Twitch() {
    classCallCheck_default()(this, Twitch);
  }

  createClass_default()(Twitch, null, [{
    key: "inject",
    value: function inject(identifier, videoSettings, params) {
      var twitchListener = new twitch_listener["a" /* TwitchListener */](params);
      twitchListener.init();
      return twitchEmbed.load().then(function () {
        return twitchEmbed.getPlayer(identifier, videoSettings);
      }).then(function (player) {
        twitchListener.registerTwitchEvents(player);
        return player;
      });
    }
  }]);

  return Twitch;
}();
// CONCATENATED MODULE: ./src/ad-engine/video/player/twitch/index.ts

// CONCATENATED MODULE: ./src/ad-engine/video/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "i", function() { return vastDebugger; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "j", function() { return vastParser; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "f", function() { return buildVastUrl; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "b", function() { return porvata_PorvataPlayer; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "a", function() { return porvata_Porvata; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "e", function() { return video_settings_VideoSettings; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "h", function() { return moatVideoTracker; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "g", function() { return googleImaPlayerFactory; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "d", function() { return twitch_TwitchPlayer; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "c", function() { return twitch_Twitch; });






/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return setupGptTargeting; });
/* harmony import */ var _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);


function setupGptTargeting() {
  var tag = window.googletag.pubads();
  var targeting = _services__WEBPACK_IMPORTED_MODULE_1__[/* context */ "c"].get('targeting');

  function setTargetingValue(key, value) {
    if (typeof value === 'undefined' || value === null) {
      tag.clearTargeting(key);
    } else if (typeof value === 'function') {
      tag.setTargeting(key, value());
    } else {
      tag.setTargeting(key, value);
    }
  }

  function setTargetingFromContext() {
    _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default()(targeting).forEach(function (key) {
      setTargetingValue(key, targeting[key]);
    });
  }

  _services__WEBPACK_IMPORTED_MODULE_1__[/* eventService */ "d"].on(_services__WEBPACK_IMPORTED_MODULE_1__[/* events */ "e"].PAGE_CHANGE_EVENT, function () {
    setTargetingFromContext();
  });
  setTargetingFromContext();
  _services__WEBPACK_IMPORTED_MODULE_1__[/* context */ "c"].onChange('targeting', function (trigger, value) {
    var segments = trigger.split('.');
    var key = segments[segments.length - 1];
    setTargetingValue(key, value);
  });
}

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GptSizeMap; });
/* harmony import */ var _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(0);




var logGroup = 'gpt-size-map';
var GptSizeMap =
/*#__PURE__*/
function () {
  function GptSizeMap(sizeMap) {
    _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, GptSizeMap);

    this.sizeMap = sizeMap || [];
    Object(_utils__WEBPACK_IMPORTED_MODULE_3__["logger"])(logGroup, this.sizeMap, 'creating new size map');
  }

  _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(GptSizeMap, [{
    key: "addSize",
    value: function addSize(viewportSize, sizes) {
      Object(_utils__WEBPACK_IMPORTED_MODULE_3__["logger"])(logGroup, viewportSize, sizes, 'adding new size mapping');
      this.sizeMap.push({
        viewportSize: viewportSize,
        sizes: sizes
      });
    }
  }, {
    key: "build",
    value: function build() {
      Object(_utils__WEBPACK_IMPORTED_MODULE_3__["logger"])(logGroup, this.sizeMap, 'creating GPT size mapping builder');
      var builder = window.googletag && window.googletag.sizeMapping();

      if (!builder) {
        Object(_utils__WEBPACK_IMPORTED_MODULE_3__["logger"])(logGroup, 'cannot create GPT size mapping builder');
        return null;
      }

      this.sizeMap.forEach(function (_ref) {
        var viewportSize = _ref.viewportSize,
            sizes = _ref.sizes;
        builder.addSize(viewportSize, sizes);
      });
      return builder.build();
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return !this.sizeMap.length;
    }
  }, {
    key: "mapAllSizes",
    value: function mapAllSizes(callback) {
      return new GptSizeMap(this.sizeMap.map(function (_ref2, index) {
        var viewportSize = _ref2.viewportSize,
            sizes = _ref2.sizes;
        var mappedSizes = callback(sizes, viewportSize, index);
        Object(_utils__WEBPACK_IMPORTED_MODULE_3__["logger"])(logGroup, viewportSize, sizes, mappedSizes, 'mapping viewport sizes');
        return {
          viewportSize: viewportSize,
          sizes: mappedSizes
        };
      }));
    }
  }, {
    key: "toString",
    value: function toString() {
      Object(_utils__WEBPACK_IMPORTED_MODULE_3__["logger"])(logGroup, this.sizeMap, 'casting to string');
      var map = {};
      this.sizeMap.forEach(function (_ref3) {
        var viewportSize = _ref3.viewportSize,
            sizes = _ref3.sizes;
        map[viewportSize.join('x')] = sizes;
      });
      return _babel_runtime_corejs2_core_js_json_stringify__WEBPACK_IMPORTED_MODULE_0___default()(map);
    }
  }]);

  return GptSizeMap;
}();

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TwitchListener; });
/* harmony import */ var _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(0);







function getListeners() {
  return _services__WEBPACK_IMPORTED_MODULE_4__[/* context */ "c"].get('listeners.twitch');
}

var TwitchListener =
/*#__PURE__*/
function () {
  function TwitchListener(params) {
    _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, TwitchListener);

    this.params = params;
    this.listeners = getListeners().filter(function (listener) {
      return !listener.isEnabled || listener.isEnabled();
    });

    this.logger = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _utils__WEBPACK_IMPORTED_MODULE_5__["logger"].apply(void 0, [TwitchListener.LOG_GROUP].concat(args));
    };
  }

  _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(TwitchListener, [{
    key: "init",
    value: function init() {
      this.dispatch('init');
    }
  }, {
    key: "registerTwitchEvents",
    value: function registerTwitchEvents(player) {
      var _this = this;

      _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default()(TwitchListener.EVENTS).forEach(function (eventKey) {
        player.addEventListener(eventKey, function () {
          _this.dispatch(TwitchListener.EVENTS[eventKey]);
        });
      });
    }
  }, {
    key: "dispatch",
    value: function dispatch(eventName) {
      var _this2 = this;

      var data = this.getData(eventName);
      this.logger(eventName, data);
      this.listeners.forEach(function (listener) {
        listener.onEvent(eventName, _this2.params, data);
      });

      if (this.params.position && eventName === TwitchListener.EVENTS.viewable_impression) {
        var adSlot = _services__WEBPACK_IMPORTED_MODULE_4__[/* slotService */ "l"].get(this.params.position);
        adSlot.emit(_models__WEBPACK_IMPORTED_MODULE_3__[/* AdSlot */ "a"].VIDEO_VIEWED_EVENT);
      }
    }
  }, {
    key: "getData",
    value: function getData(eventName) {
      return {
        ad_product: this.params.adProduct,
        creative_id: this.params.creativeId || 0,
        event_name: eventName,
        line_item_id: this.params.lineItemId || 0,
        player: TwitchListener.PLAYER_NAME,
        position: this.params.slotName || '(none)'
      };
    }
  }]);

  return TwitchListener;
}();
TwitchListener.EVENTS = {
  ended: 'closed',
  offline: 'offline',
  online: 'online',
  pause: 'pause',
  play: 'play_triggered',
  playback_blocked: 'playback_blocked',
  playing: 'playing',
  ready: 'ready'
};
TwitchListener.LOG_GROUP = 'twitch-listener';
TwitchListener.PLAYER_NAME = 'twitch';

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return stringBuilder; });
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1);




var StringBuilder =
/*#__PURE__*/
function () {
  function StringBuilder() {
    _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, StringBuilder);
  }

  _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(StringBuilder, [{
    key: "build",
    value: function build(string) {
      var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var matches = string.match(/{(.+?)}/g);

      if (matches) {
        matches.forEach(function (match) {
          var key = match.replace('{', '').replace('}', '');
          var fallbackValue = _services__WEBPACK_IMPORTED_MODULE_2__[/* context */ "c"].get(key);
          var keySegments = key.split('.');
          var index;
          var segment;
          var value = parameters[keySegments[0]];

          if (value) {
            for (index = 1; index < keySegments.length; index += 1) {
              segment = keySegments[index];

              if (typeof value[segment] === 'undefined') {
                value = undefined;
                break;
              }

              value = value[segment];
            }
          }

          if (typeof value === 'undefined') {
            value = fallbackValue;
          }

          if (typeof value !== 'undefined') {
            string = string.replace(match, value);
          }
        });
      }

      return string;
    }
  }]);

  return StringBuilder;
}();

var stringBuilder = new StringBuilder();

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return logger; });
/* harmony import */ var _query_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);

var debugGroup = _query_string__WEBPACK_IMPORTED_MODULE_0__[/* queryString */ "a"].get('adengine_debug') || '';
var groups = debugGroup.split(',');

if (debugGroup !== '') {
  window.console.info('AdEngine debug mode - groups:', debugGroup === '1' ? 'all' : groups);
}

function logger(logGroup) {
  if (debugGroup === '') {
    return;
  }

  if (debugGroup === '1' || groups.indexOf(logGroup) !== -1) {
    for (var _len = arguments.length, logValues = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      logValues[_key - 1] = arguments[_key];
    }

    window.console.info(logGroup, logValues);
  }
}

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/asyncToGenerator");

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = require("eventemitter3");

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/object/assign");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/object/entries");

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/date/now");

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("current-device");

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("lodash/set");

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: external "@babel/runtime-corejs2/regenerator"
var regenerator_ = __webpack_require__(25);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/promise"
var promise_ = __webpack_require__(6);
var promise_default = /*#__PURE__*/__webpack_require__.n(promise_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/asyncToGenerator"
var asyncToGenerator_ = __webpack_require__(34);
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/construct"
var construct_ = __webpack_require__(45);
var construct_default = /*#__PURE__*/__webpack_require__.n(construct_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/toConsumableArray"
var toConsumableArray_ = __webpack_require__(17);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/classCallCheck"
var classCallCheck_ = __webpack_require__(2);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/createClass"
var createClass_ = __webpack_require__(3);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass_);

// EXTERNAL MODULE: ./src/ad-engine/listeners/index.ts + 3 modules
var listeners = __webpack_require__(7);

// EXTERNAL MODULE: ./src/ad-engine/models/index.ts + 1 modules
var models = __webpack_require__(8);

// EXTERNAL MODULE: ./src/ad-engine/providers/index.ts
var providers = __webpack_require__(9);

// EXTERNAL MODULE: ./src/ad-engine/services/index.ts + 11 modules
var services = __webpack_require__(1);

// EXTERNAL MODULE: ./src/ad-engine/utils/index.ts + 14 modules
var utils = __webpack_require__(0);

// CONCATENATED MODULE: ./src/ad-engine/templates/floating-ad.ts




var floating_ad_FloatingAd =
/*#__PURE__*/
function () {
  createClass_default()(FloatingAd, null, [{
    key: "getName",
    value: function getName() {
      return 'floating-ad';
    }
  }]);

  function FloatingAd(adSlot) {
    classCallCheck_default()(this, FloatingAd);

    this.adSlot = adSlot;
  }

  createClass_default()(FloatingAd, [{
    key: "init",
    value: function init() {
      var slotNode = document.getElementById(this.adSlot.getSlotName());
      var container;
      var containerOffset;
      var end;
      var slotHeight;
      var space;
      var start = 0;

      if (!slotNode || !slotNode.classList.contains('floating')) {
        return;
      }

      listeners["c" /* scrollListener */].addCallback(function () {
        var scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        container = slotNode.parentNode;
        containerOffset = Object(utils["getTopOffset"])(container);
        slotHeight = slotNode.offsetHeight;
        end = containerOffset + container.offsetHeight - slotHeight;
        start = containerOffset;

        if (slotNode.previousElementSibling) {
          start = Object(utils["getTopOffset"])(slotNode.previousElementSibling) + slotNode.previousElementSibling.offsetHeight;
        }

        space = end - start;

        if (space <= slotHeight) {
          slotNode.classList.add('pinned-top');
          slotNode.classList.remove('pinned-bottom');
          return;
        }

        if (scrollPosition <= start) {
          slotNode.classList.add('pinned-top');
          slotNode.classList.remove('pinned-bottom');
        } else if (scrollPosition >= end) {
          slotNode.classList.add('pinned-bottom');
          slotNode.classList.remove('pinned-top');
        } else {
          slotNode.classList.remove('pinned-top');
          slotNode.classList.remove('pinned-bottom');
        }
      });
    }
  }]);

  return FloatingAd;
}();
// CONCATENATED MODULE: ./src/ad-engine/templates/index.ts

// CONCATENATED MODULE: ./src/ad-engine/ad-engine.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ad_engine_AdEngine; });













var logGroup = 'ad-engine';
var ad_engine_AdEngine =
/*#__PURE__*/
function () {
  function AdEngine() {
    var _this = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    classCallCheck_default()(this, AdEngine);

    this.started = false;
    this.provider = void 0;
    this.adStack = void 0;
    services["c" /* context */].extend(config);
    window.ads = window.ads || {};
    window.ads.runtime = window.ads.runtime || {};
    services["n" /* templateService */].register(floating_ad_FloatingAd);
    services["d" /* eventService */].on(services["e" /* events */].PAGE_CHANGE_EVENT, function () {
      _this.started = false;

      _this.setupAdStack();
    });
  }

  createClass_default()(AdEngine, [{
    key: "init",
    value: function init() {
      this.setupProviders();
      this.setupAdStack();
      services["b" /* btfBlockerService */].init();
      Object(services["h" /* registerCustomAdLoader */])(services["c" /* context */].get('options.customAdLoader.globalMethodName'));
      services["g" /* messageBus */].init();
      services["m" /* slotTweaker */].registerMessageListener();
      this.runAdQueue();
      listeners["c" /* scrollListener */].init();
      services["k" /* slotRepeater */].init();
      this.setupPushOnScrollQueue();
    }
  }, {
    key: "setupProviders",
    value: function setupProviders() {
      var providerName = services["c" /* context */].get('state.provider');

      switch (providerName) {
        case 'prebidium':
          this.provider = new providers["PrebidiumProvider"]();
          break;

        case 'gpt':
        default:
          this.provider = new providers["GptProvider"]();
      }
    }
  }, {
    key: "setupAdStack",
    value: function setupAdStack() {
      var _this2 = this;

      this.adStack = services["c" /* context */].get('state.adStack');

      if (!this.adStack.start) {
        Object(utils["makeLazyQueue"])(this.adStack, function (ad) {
          var adSlot = new models["a" /* AdSlot */](ad);
          services["l" /* slotService */].add(adSlot);

          _this2.provider.fillIn(adSlot);
        });
      }
    }
  }, {
    key: "setupPushOnScrollQueue",
    value: function setupPushOnScrollQueue() {
      var _this3 = this;

      if (services["c" /* context */].get('events.pushOnScroll')) {
        var pushOnScrollIds = services["c" /* context */].get('events.pushOnScroll.ids');

        var pushOnScrollQueue = construct_default()(utils["LazyQueue"], toConsumableArray_default()(pushOnScrollIds));

        pushOnScrollQueue.onItemFlush(function (id) {
          listeners["c" /* scrollListener */].addSlot(_this3.adStack, id, services["c" /* context */].get('events.pushOnScroll.threshold'));
        });
        services["c" /* context */].set('events.pushOnScroll.ids', pushOnScrollQueue);
        pushOnScrollQueue.flush();
      }
    }
  }, {
    key: "runAdQueue",
    value: function () {
      var _runAdQueue = asyncToGenerator_default()(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee() {
        var delayModulesPromises, maxTimeout, timeoutPromise;
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                delayModulesPromises = this.getDelayModulesPromises();
                maxTimeout = services["c" /* context */].get('options.maxDelayTimeout');
                timeoutPromise = new promise_default.a(function (resolve) {
                  return setTimeout(resolve, maxTimeout);
                });
                Object(utils["logger"])(logGroup, "Delay by ".concat(delayModulesPromises.length, " modules (").concat(maxTimeout, "ms timeout)"));
                _context.next = 6;
                return promise_default.a.race([promise_default.a.all(delayModulesPromises), timeoutPromise]);

              case 6:
                Object(utils["logger"])(logGroup, 'startAdQueue', 'Ready');
                this.startAdStack();

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function runAdQueue() {
        return _runAdQueue.apply(this, arguments);
      }

      return runAdQueue;
    }()
  }, {
    key: "getDelayModulesPromises",
    value: function getDelayModulesPromises() {
      var delayModules = services["c" /* context */].get('delayModules') || [];
      return delayModules.filter(function (delayModule) {
        return delayModule.isEnabled();
      }).map(function (delayModule) {
        Object(utils["logger"])(logGroup, 'Register delay module', delayModule.getName());
        return delayModule.getPromise();
      });
    }
  }, {
    key: "startAdStack",
    value: function startAdStack() {
      if (!this.started) {
        services["d" /* eventService */].emit(services["e" /* events */].AD_STACK_START);
        this.started = true;
        this.adStack.start();
      }
    }
  }]);

  return AdEngine;
}();

/***/ }),
/* 42 */
/***/ (function(module, exports) {



/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PrebidiumProvider; });
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs2_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(20);
/* harmony import */ var _babel_runtime_corejs2_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_decorators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(19);
/* harmony import */ var core_decorators__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_decorators__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(0);





var _dec, _class, _temp;




var logGroup = 'prebidium-provider'; // TODO: ADEN-8075
//  Duplicate from ad-bidders/prebid/index.js
//  Perhaps create PBJS wrapper, or at least place to share this kind of functions

function postponeExecutionUntilPbjsLoads(method) {
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return window.pbjs.que.push(function () {
      return method.apply(_this, args);
    });
  };
}

var PrebidiumProvider = (_dec = Object(core_decorators__WEBPACK_IMPORTED_MODULE_4__["decorate"])(postponeExecutionUntilPbjsLoads), (_class = (_temp =
/*#__PURE__*/
function () {
  function PrebidiumProvider() {
    _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, PrebidiumProvider);

    this.iframeBuilder = new _utils__WEBPACK_IMPORTED_MODULE_6__["IframeBuilder"]();
  }

  _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_2___default()(PrebidiumProvider, [{
    key: "fillIn",
    value: function fillIn(adSlot) {
      var doc = this.getIframeDoc(adSlot);
      var adId = this.getAdId(adSlot);
      window.pbjs.renderAd(doc, adId);
      Object(_utils__WEBPACK_IMPORTED_MODULE_6__["logger"])(logGroup, adSlot.getSlotName(), 'slot added');
    }
  }, {
    key: "getIframeDoc",
    value: function getIframeDoc(adSlot) {
      var iframe = this.iframeBuilder.create(adSlot);
      return iframe.contentWindow.document;
    }
  }, {
    key: "getAdId",
    value: function getAdId(adSlot) {
      return _services__WEBPACK_IMPORTED_MODULE_5__[/* context */ "c"].get("slots.".concat(adSlot.getSlotName(), ".targeting.hb_adid"));
    }
  }]);

  return PrebidiumProvider;
}(), _temp), (_babel_runtime_corejs2_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_3___default()(_class.prototype, "fillIn", [_dec], _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0___default()(_class.prototype, "fillIn"), _class.prototype)), _class));

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ADX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return GptProvider; });
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);
/* harmony import */ var _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_corejs2_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(20);
/* harmony import */ var _babel_runtime_corejs2_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_corejs2_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_decorators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(19);
/* harmony import */ var core_decorators__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_decorators__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _listeners__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(0);
/* harmony import */ var _gpt_size_map__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(30);
/* harmony import */ var _gpt_targeting__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(29);






var _dec, _dec2, _dec3, _dec4, _class;







var logGroup = 'gpt-provider';
var ADX = 'AdX';

function postponeExecutionUntilGptLoads(method) {
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return window.googletag.cmd.push(function () {
      return method.apply(_this, args);
    });
  };
}

var definedSlots = [];
var initialized = false;

function getAdSlotFromEvent(event) {
  var id = event.slot.getSlotElementId();
  return _services__WEBPACK_IMPORTED_MODULE_7__[/* slotService */ "l"].get(id);
}

function configure() {
  var tag = window.googletag.pubads();

  if (!_services__WEBPACK_IMPORTED_MODULE_7__[/* context */ "c"].get('options.isSraDisabled')) {
    tag.enableSingleRequest();
  }

  tag.disableInitialLoad();
  tag.addEventListener('slotOnload', function (event) {
    _listeners__WEBPACK_IMPORTED_MODULE_6__[/* slotListener */ "d"].emitLoadedEvent(event, getAdSlotFromEvent(event));
  });
  tag.addEventListener('slotRenderEnded', function (event) {
    // IE doesn't allow us to inspect GPT iframe at this point.
    // Let's launch our callback in a setTimeout instead.
    Object(_utils__WEBPACK_IMPORTED_MODULE_8__["defer"])(function () {
      return _listeners__WEBPACK_IMPORTED_MODULE_6__[/* slotListener */ "d"].emitRenderEnded(event, getAdSlotFromEvent(event));
    });
  });
  tag.addEventListener('impressionViewable', function (event) {
    _listeners__WEBPACK_IMPORTED_MODULE_6__[/* slotListener */ "d"].emitImpressionViewable(event, getAdSlotFromEvent(event));
  });
  window.googletag.enableServices();
}

var GptProvider = (_dec = Object(core_decorators__WEBPACK_IMPORTED_MODULE_5__["decorate"])(postponeExecutionUntilGptLoads), _dec2 = Object(core_decorators__WEBPACK_IMPORTED_MODULE_5__["decorate"])(postponeExecutionUntilGptLoads), _dec3 = Object(core_decorators__WEBPACK_IMPORTED_MODULE_5__["decorate"])(postponeExecutionUntilGptLoads), _dec4 = Object(core_decorators__WEBPACK_IMPORTED_MODULE_5__["decorate"])(postponeExecutionUntilGptLoads), (_class =
/*#__PURE__*/
function () {
  function GptProvider() {
    var forceInit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _babel_runtime_corejs2_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, GptProvider);

    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    this.init(forceInit);
  }

  _babel_runtime_corejs2_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(GptProvider, [{
    key: "isInitialized",
    value: function isInitialized() {
      return initialized;
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      if (this.isInitialized()) {
        return;
      }

      Object(_gpt_targeting__WEBPACK_IMPORTED_MODULE_10__[/* setupGptTargeting */ "a"])();
      configure();
      this.setupNonPersonalizedAds();
      _services__WEBPACK_IMPORTED_MODULE_7__[/* eventService */ "d"].on(_services__WEBPACK_IMPORTED_MODULE_7__[/* events */ "e"].BEFORE_PAGE_CHANGE_EVENT, function () {
        return _this2.destroySlots();
      });
      _services__WEBPACK_IMPORTED_MODULE_7__[/* eventService */ "d"].on(_services__WEBPACK_IMPORTED_MODULE_7__[/* events */ "e"].PAGE_RENDER_EVENT, function () {
        return _this2.updateCorrelator();
      });
      initialized = true;
    }
  }, {
    key: "setupNonPersonalizedAds",
    value: function setupNonPersonalizedAds() {
      var tag = window.googletag.pubads();
      tag.setRequestNonPersonalizedAds(_services__WEBPACK_IMPORTED_MODULE_7__[/* trackingOptIn */ "o"].isOptedIn() ? 0 : 1);
    }
  }, {
    key: "fillIn",
    value: function fillIn(adSlot) {
      var _this3 = this;

      var adStack = _services__WEBPACK_IMPORTED_MODULE_7__[/* context */ "c"].get('state.adStack');
      _services__WEBPACK_IMPORTED_MODULE_7__[/* btfBlockerService */ "b"].push(adSlot, function () {
        _this3.fillInCallback.apply(_this3, arguments);
      });

      if (adStack.length === 0) {
        this.flush();
      }
    }
    /** @private */

  }, {
    key: "fillInCallback",
    value: function fillInCallback(adSlot) {
      var targeting = this.parseTargetingParams(adSlot.getTargeting());
      var sizeMap = new _gpt_size_map__WEBPACK_IMPORTED_MODULE_9__[/* GptSizeMap */ "a"](adSlot.getSizes());
      var gptSlot = this.createGptSlot(adSlot, sizeMap);
      gptSlot.addService(window.googletag.pubads()).setCollapseEmptyDiv(true);
      this.applyTargetingParams(gptSlot, targeting);
      _services__WEBPACK_IMPORTED_MODULE_7__[/* slotDataParamsUpdater */ "i"].updateOnCreate(adSlot, targeting);
      adSlot.updateWinningPbBidderDetails();
      window.googletag.display(adSlot.getSlotName());
      definedSlots.push(gptSlot);

      if (!adSlot.isFirstCall()) {
        this.flush();
      }

      Object(_utils__WEBPACK_IMPORTED_MODULE_8__["logger"])(logGroup, adSlot.getSlotName(), 'slot added');
    }
    /** @private */

  }, {
    key: "createGptSlot",
    value: function createGptSlot(adSlot, sizeMap) {
      if (adSlot.isOutOfPage()) {
        return window.googletag.defineOutOfPageSlot(adSlot.getAdUnit(), adSlot.getSlotName());
      }

      return window.googletag.defineSlot(adSlot.getAdUnit(), adSlot.getDefaultSizes(), adSlot.getSlotName()).defineSizeMapping(sizeMap.build());
    }
  }, {
    key: "applyTargetingParams",
    value: function applyTargetingParams(gptSlot, targeting) {
      _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default()(targeting).forEach(function (key) {
        return gptSlot.setTargeting(key, targeting[key]);
      });
    }
  }, {
    key: "parseTargetingParams",
    value: function parseTargetingParams(targetingParams) {
      var result = {};

      _babel_runtime_corejs2_core_js_object_keys__WEBPACK_IMPORTED_MODULE_1___default()(targetingParams).forEach(function (key) {
        var value = targetingParams[key];

        if (typeof value === 'function') {
          value = value();
        }

        if (value !== null) {
          result[key] = value;
        }
      });

      return result;
    }
  }, {
    key: "updateCorrelator",
    value: function updateCorrelator() {
      window.googletag.pubads().updateCorrelator();
    }
    /** @private */

  }, {
    key: "flush",
    value: function flush() {
      if (definedSlots.length) {
        window.googletag.pubads().refresh(definedSlots, {
          changeCorrelator: false
        });
        definedSlots = [];
      }
    }
  }, {
    key: "destroyGptSlots",
    value: function destroyGptSlots(gptSlots) {
      Object(_utils__WEBPACK_IMPORTED_MODULE_8__["logger"])(logGroup, 'destroySlots', gptSlots);
      gptSlots.forEach(function (gptSlot) {
        var adSlot = _services__WEBPACK_IMPORTED_MODULE_7__[/* slotService */ "l"].get(gptSlot.getSlotElementId());
        _services__WEBPACK_IMPORTED_MODULE_7__[/* slotService */ "l"].remove(adSlot);
      });
      var success = window.googletag.destroySlots(gptSlots);

      if (!success) {
        Object(_utils__WEBPACK_IMPORTED_MODULE_8__["logger"])(logGroup, 'destroySlots', gptSlots, 'failed');
      }
    }
  }, {
    key: "destroySlots",
    value: function destroySlots(slotNames) {
      var allSlots = window.googletag.pubads().getSlots();
      var slotsToDestroy = allSlots;

      if (slotNames && slotNames.length) {
        slotsToDestroy = allSlots.filter(function (slot) {
          var slotId = slot.getSlotElementId();

          if (!slotId) {
            Object(_utils__WEBPACK_IMPORTED_MODULE_8__["logger"])(logGroup, 'destroySlots', "slot doesn't return element id", slot);
          } else if (slotNames.indexOf(slotId) > -1) {
            return true;
          }

          return false;
        });
      }

      if (slotsToDestroy.length) {
        this.destroyGptSlots(slotsToDestroy);
      } else {
        Object(_utils__WEBPACK_IMPORTED_MODULE_8__["logger"])(logGroup, 'destroySlots', 'no slots returned to destroy', allSlots, slotNames);
      }
    }
  }]);

  return GptProvider;
}(), (_babel_runtime_corejs2_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_4___default()(_class.prototype, "init", [_dec], _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0___default()(_class.prototype, "init"), _class.prototype), _babel_runtime_corejs2_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_4___default()(_class.prototype, "fillIn", [_dec2], _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0___default()(_class.prototype, "fillIn"), _class.prototype), _babel_runtime_corejs2_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_4___default()(_class.prototype, "updateCorrelator", [_dec3], _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0___default()(_class.prototype, "updateCorrelator"), _class.prototype), _babel_runtime_corejs2_helpers_applyDecoratedDescriptor__WEBPACK_IMPORTED_MODULE_4___default()(_class.prototype, "destroyGptSlots", [_dec4], _babel_runtime_corejs2_core_js_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_0___default()(_class.prototype, "destroyGptSlots"), _class.prototype)), _class));

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/construct");

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/array/is-array");

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/get");

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = require("lodash/intersection");

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/wrapNativeSuper");

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/parse-float");

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/typeof");

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = require("blockadblock");

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = require("lodash/get");

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40);
/* harmony import */ var lodash_set__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_set__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(53);
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_get__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "utils", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__; });
/* harmony import */ var _ad_engine__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(41);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AdEngine", function() { return _ad_engine__WEBPACK_IMPORTED_MODULE_3__["a"]; });

/* harmony import */ var _listeners__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PorvataListener", function() { return _listeners__WEBPACK_IMPORTED_MODULE_4__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "scrollListener", function() { return _listeners__WEBPACK_IMPORTED_MODULE_4__["c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "slotListener", function() { return _listeners__WEBPACK_IMPORTED_MODULE_4__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TwitchListener", function() { return _listeners__WEBPACK_IMPORTED_MODULE_4__["b"]; });

/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AdSlot", function() { return _models__WEBPACK_IMPORTED_MODULE_5__["a"]; });

/* harmony import */ var _providers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _providers__WEBPACK_IMPORTED_MODULE_6__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _providers__WEBPACK_IMPORTED_MODULE_6__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "btfBlockerService", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["b"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "context", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerCustomAdLoader", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["h"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "events", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "eventService", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "localCache", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["f"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "messageBus", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["g"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "slotDataParamsUpdater", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["i"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "slotInjector", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["j"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "slotRepeater", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["k"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "slotService", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["l"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SlotTweaker", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "slotTweaker", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["m"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "templateService", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["n"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "trackingOptIn", function() { return _services__WEBPACK_IMPORTED_MODULE_7__["o"]; });

/* harmony import */ var _video__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(28);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "vastDebugger", function() { return _video__WEBPACK_IMPORTED_MODULE_8__["i"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "vastParser", function() { return _video__WEBPACK_IMPORTED_MODULE_8__["j"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "buildVastUrl", function() { return _video__WEBPACK_IMPORTED_MODULE_8__["f"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PorvataPlayer", function() { return _video__WEBPACK_IMPORTED_MODULE_8__["b"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Porvata", function() { return _video__WEBPACK_IMPORTED_MODULE_8__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "VideoSettings", function() { return _video__WEBPACK_IMPORTED_MODULE_8__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "moatVideoTracker", function() { return _video__WEBPACK_IMPORTED_MODULE_8__["h"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "googleImaPlayerFactory", function() { return _video__WEBPACK_IMPORTED_MODULE_8__["g"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TwitchPlayer", function() { return _video__WEBPACK_IMPORTED_MODULE_8__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Twitch", function() { return _video__WEBPACK_IMPORTED_MODULE_8__["c"]; });




var versionField = 'ads.adEngineVersion';
var commitField = 'ads.adEngineCommit';

if (lodash_get__WEBPACK_IMPORTED_MODULE_1___default()(window, versionField, null)) {
  window.console.warn('Multiple @wikia/ad-engine initializations. This may cause issues.');
}

lodash_set__WEBPACK_IMPORTED_MODULE_0___default()(window, versionField, 'v25.0.3');

lodash_set__WEBPACK_IMPORTED_MODULE_0___default()(window, commitField, '6768a4f5');

_utils__WEBPACK_IMPORTED_MODULE_2__["logger"]('ad-engine', 'v25.0.3 (6768a4f5)');








/***/ })
/******/ ]);
//# sourceMappingURL=ad-engine.js.map