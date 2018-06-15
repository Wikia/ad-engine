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
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/createClass");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/get-prototype-of");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/possibleConstructorReturn");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/inherits");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/keys");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/assign");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("core-decorators");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/get-own-property-descriptor");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/typeof");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/get");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("eventemitter3");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/symbol");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("ismobilejs");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/get-own-property-names");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/map");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("blockadblock");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("lodash/get");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("lodash/set");

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var utils_namespaceObject = {};
__webpack_require__.d(utils_namespaceObject, "client", function() { return client; });
__webpack_require__.d(utils_namespaceObject, "getTopOffset", function() { return getTopOffset; });
__webpack_require__.d(utils_namespaceObject, "getViewportHeight", function() { return getViewportHeight; });
__webpack_require__.d(utils_namespaceObject, "isInViewport", function() { return isInViewport; });
__webpack_require__.d(utils_namespaceObject, "wait", function() { return flow_control_wait; });
__webpack_require__.d(utils_namespaceObject, "defer", function() { return flow_control_defer; });
__webpack_require__.d(utils_namespaceObject, "once", function() { return flow_control_once; });
__webpack_require__.d(utils_namespaceObject, "makeLazyQueue", function() { return makeLazyQueue; });
__webpack_require__.d(utils_namespaceObject, "logger", function() { return logger; });
__webpack_require__.d(utils_namespaceObject, "queryString", function() { return query_string_queryString; });
__webpack_require__.d(utils_namespaceObject, "sampler", function() { return sampler; });
__webpack_require__.d(utils_namespaceObject, "scriptLoader", function() { return scriptLoader; });
__webpack_require__.d(utils_namespaceObject, "stringBuilder", function() { return stringBuilder; });
__webpack_require__.d(utils_namespaceObject, "whichProperty", function() { return whichProperty; });
__webpack_require__.d(utils_namespaceObject, "tryProperty", function() { return tryProperty; });
__webpack_require__.d(utils_namespaceObject, "viewportObserver", function() { return viewportObserver; });

// EXTERNAL MODULE: external "lodash/set"
var set_ = __webpack_require__(21);
var set_default = /*#__PURE__*/__webpack_require__.n(set_);

// EXTERNAL MODULE: external "lodash/get"
var get_ = __webpack_require__(20);
var get_default = /*#__PURE__*/__webpack_require__.n(get_);

// EXTERNAL MODULE: external "babel-runtime/helpers/classCallCheck"
var classCallCheck_ = __webpack_require__(1);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck_);

// EXTERNAL MODULE: external "babel-runtime/helpers/createClass"
var createClass_ = __webpack_require__(0);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass_);

// EXTERNAL MODULE: external "ismobilejs"
var external_ismobilejs_ = __webpack_require__(16);
var external_ismobilejs_default = /*#__PURE__*/__webpack_require__.n(external_ismobilejs_);

// EXTERNAL MODULE: external "blockadblock"
var external_blockadblock_ = __webpack_require__(19);
var external_blockadblock_default = /*#__PURE__*/__webpack_require__.n(external_blockadblock_);

// CONCATENATED MODULE: ./src/utils/client.js


/* global BlockAdBlock */



var bab = null,
    browser = null,
    isMobile = null,
    operatingSystem = null;

function getIsMobile() {
	if (isMobile === null) {
		var userAgent = window.navigator.userAgent;


		isMobile = typeof external_ismobilejs_default.a === 'function' ? external_ismobilejs_default()(userAgent) : external_ismobilejs_default.a;
	}

	return isMobile;
}

var client_Client = function () {
	function Client() {
		classCallCheck_default()(this, Client);
	}

	createClass_default()(Client, [{
		key: 'isSmartphone',
		value: function isSmartphone() {
			var device = getIsMobile();

			return device.phone;
		}
	}, {
		key: 'isTablet',
		value: function isTablet() {
			var device = getIsMobile();

			return device.tablet;
		}
	}, {
		key: 'isDesktop',
		value: function isDesktop() {
			return !this.isSmartphone() && !this.isTablet();
		}
	}, {
		key: 'checkBlocking',
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
		key: 'getDeviceType',
		value: function getDeviceType() {
			if (this.isTablet()) {
				return 'tablet';
			} else if (this.isSmartphone()) {
				return 'smartphone';
			}

			return 'desktop';
		}
	}, {
		key: 'getOperatingSystem',
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
		key: 'getBrowser',
		value: function getBrowser() {
			if (browser !== null) {
				return browser;
			}

			var _window$navigator = window.navigator,
			    appName = _window$navigator.appName,
			    appVersion = _window$navigator.appVersion,
			    userAgent = _window$navigator.userAgent;


			var temp = void 0,
			    matches = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

			if (/trident/i.test(matches[1])) {
				temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
				browser = 'IE ' + (temp[1] || '');
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
// CONCATENATED MODULE: ./src/utils/dimensions.js
function getTopOffset(element) {
	var elementWindow = element.ownerDocument.defaultView;

	var currentElement = element,
	    hideAgain = false,
	    topPos = 0;

	if (element.classList.contains('hide')) {
		hideAgain = true;
		element.classList.remove('hide');
	}

	do {
		topPos += currentElement.offsetTop;
		currentElement = currentElement.offsetParent;
	} while (currentElement !== null);

	if (hideAgain) {
		element.classList.add('hide');
	}

	if (elementWindow && elementWindow.frameElement) {
		topPos += getTopOffset(elementWindow.frameElement);
	}

	return topPos;
}

function getViewportHeight() {
	return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

function isInViewport(element) {
	var topOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	var bottomOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

	var alwaysInViewportPositions = ['fixed', 'sticky'],
	    elementPosition = window.getComputedStyle(element).position;

	if (alwaysInViewportPositions.includes(elementPosition)) {
		return true;
	}

	var elementHeight = element.offsetHeight,
	    elementTop = getTopOffset(element),
	    elementBottom = elementTop + elementHeight,
	    scrollPosition = window.scrollY,
	    viewportHeight = getViewportHeight(),
	    viewportTop = topOffset + scrollPosition,
	    viewportBottom = bottomOffset + scrollPosition + viewportHeight;

	return elementTop >= viewportTop - elementHeight / 2 && elementBottom <= viewportBottom + elementHeight / 2;
}
// EXTERNAL MODULE: external "babel-runtime/core-js/object/assign"
var assign_ = __webpack_require__(9);
var assign_default = /*#__PURE__*/__webpack_require__.n(assign_);

// EXTERNAL MODULE: external "babel-runtime/helpers/typeof"
var typeof_ = __webpack_require__(12);
var typeof_default = /*#__PURE__*/__webpack_require__.n(typeof_);

// EXTERNAL MODULE: external "babel-runtime/core-js/promise"
var promise_ = __webpack_require__(6);
var promise_default = /*#__PURE__*/__webpack_require__.n(promise_);

// CONCATENATED MODULE: ./src/utils/flow-control.js



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
	for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		args[_key - 1] = arguments[_key];
	}

	return new promise_default.a(function (resolve, reject) {
		if (typeof fn !== 'function') {
			reject(new Error('Expected a function.'));
			return;
		}

		setTimeout(function () {
			return resolve(fn.apply(undefined, args));
		}, 0);
	});
};

function flow_control_once(emitter, eventName) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var isObject = (typeof emitter === 'undefined' ? 'undefined' : typeof_default()(emitter)) === 'object';
	var hasAddEventListener = isObject && typeof emitter.addEventListener === 'function';
	var hasOnce = isObject && typeof emitter.once === 'function';

	return new promise_default.a(function (resolve, reject) {
		if (typeof options === 'boolean') {
			options = { capture: options };
		}

		if (hasOnce) {
			emitter.once(eventName, resolve);
		} else if (hasAddEventListener) {
			emitter.addEventListener(eventName, resolve, assign_default()({}, options, { once: true }));
		} else {
			reject(new Error('Emitter does not have `addEventListener` nor `once` method.'));
		}
	});
}
// CONCATENATED MODULE: ./src/utils/lazy-queue.js
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
// EXTERNAL MODULE: external "babel-runtime/helpers/slicedToArray"
var slicedToArray_ = __webpack_require__(8);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray_);

// CONCATENATED MODULE: ./src/utils/query-string.js




var query_string_QueryString = function () {
	function QueryString() {
		classCallCheck_default()(this, QueryString);
	}

	createClass_default()(QueryString, [{
		key: 'getValues',
		value: function getValues() {
			var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			var path = input || window.location.search.substr(1),
			    queryParameters = {},
			    queryString = path.split('&');

			if (queryString === '') {
				return null;
			}

			queryString.forEach(function (pair) {
				var _pair$split = pair.split('='),
				    _pair$split2 = slicedToArray_default()(_pair$split, 2),
				    id = _pair$split2[0],
				    value = _pair$split2[1];

				if (value) {
					queryParameters[id] = decodeURIComponent(value.replace(/\+/g, ' '));
				}
			});

			return queryParameters;
		}
	}, {
		key: 'get',
		value: function get(key) {
			var queryParameters = this.getValues();

			return queryParameters[key];
		}
	}]);

	return QueryString;
}();

var query_string_queryString = new query_string_QueryString();
// CONCATENATED MODULE: ./src/utils/logger.js


var debugGroup = query_string_queryString.get('adengine_debug') || '',
    groups = debugGroup.split(',');

if (debugGroup !== '') {
	window.console.info('AdEngine debug mode - groups:', debugGroup === '1' ? 'all' : groups);
}

function logger(logGroup) {
	if (debugGroup === '') {
		return;
	}

	if (debugGroup === '1' || groups.indexOf(logGroup) !== -1) {
		for (var _len = arguments.length, logValues = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			logValues[_key - 1] = arguments[_key];
		}

		window.console.info(logGroup, logValues);
	}
}
// CONCATENATED MODULE: ./src/utils/sampler.js




function isSamplingIgnored(name) {
	var ignored = (query_string_queryString.get('ignored_samplers') || '').split(',');

	return ignored.indexOf(name) !== -1;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

var sampler_Sampler = function () {
	function Sampler() {
		classCallCheck_default()(this, Sampler);
	}

	createClass_default()(Sampler, [{
		key: 'sample',
		value: function sample(name, sampling) {
			var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

			return isSamplingIgnored(name) ? true : getRandomInt(0, max) < sampling;
		}
	}]);

	return Sampler;
}();

var sampler = new sampler_Sampler();
// CONCATENATED MODULE: ./src/utils/script-loader.js




var script_loader_ScriptLoader = function () {
	function ScriptLoader() {
		classCallCheck_default()(this, ScriptLoader);
	}

	createClass_default()(ScriptLoader, [{
		key: 'createScript',
		value: function createScript(src) {
			var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text/javascript';
			var isAsync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
			var node = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			var script = document.createElement('script');

			node = node || document.body.lastChild;
			script.async = isAsync;
			script.type = type;
			script.src = src;
			node.parentNode.insertBefore(script, node);

			return script;
		}
	}, {
		key: 'loadScript',
		value: function loadScript(src) {
			var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text/javascript';

			var _this = this;

			var isAsync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
			var node = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

			return new promise_default.a(function (resolve, reject) {
				var script = _this.createScript(src, type, isAsync, node);

				script.onload = resolve;
				script.onerror = reject;
			});
		}
	}]);

	return ScriptLoader;
}();

var scriptLoader = new script_loader_ScriptLoader();
// EXTERNAL MODULE: external "babel-runtime/core-js/object/keys"
var keys_ = __webpack_require__(5);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys_);

// CONCATENATED MODULE: ./src/services/context-service.js



var contextObject = {
	adUnitId: '',
	events: {},
	delayModules: [],
	listeners: {
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
},
    onChangeCallbacks = {};

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

function context_service_segment(key, newValue) {
	var segments = key.split('.'),
	    segmentsCount = segments.length;
	var seg = contextObject,
	    lastKey = null;

	for (var i = 0; i < segmentsCount; i += 1) {
		lastKey = segments[i];
		if (i < segmentsCount - 1) {
			seg[lastKey] = seg[lastKey] || {};
			seg = seg[lastKey];
		}
	}

	if (newValue !== undefined) {
		seg[lastKey] = newValue;
		triggerOnChange(key, segments, newValue);
	}

	return seg[lastKey];
}

var context_service_Context = function () {
	function Context() {
		classCallCheck_default()(this, Context);

		this.__useDefault = true;
	}

	createClass_default()(Context, [{
		key: 'extend',
		value: function extend(newContext) {
			assign_default()(contextObject, newContext);
		}
	}, {
		key: 'set',
		value: function set(key, value) {
			context_service_segment(key, value);
		}
	}, {
		key: 'get',
		value: function get(key) {
			return context_service_segment(key);
		}
	}, {
		key: 'push',
		value: function push(key, value) {
			var array = context_service_segment(key);

			if (array) {
				array.push(value);
			}
		}
	}, {
		key: 'onChange',
		value: function onChange(key, callback) {
			onChangeCallbacks[key] = onChangeCallbacks[key] || [];
			onChangeCallbacks[key].push(callback);
		}
	}]);

	return Context;
}();

var context = new context_service_Context();
// CONCATENATED MODULE: ./src/services/slot-service.js





var groupName = 'slot-service';
var slot_service_slots = {};
var slotStates = {};
var slotStatuses = {};

function isSlotInTheSameViewport(slotHeight, slotOffset, viewportHeight, elementId) {
	var element = document.getElementById(elementId);

	// According to https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
	// Hidden element does not have offsetParent
	if (element.offsetParent === null) {
		return false;
	}

	var elementHeight = element.offsetHeight,
	    elementOffset = getTopOffset(element),
	    isFirst = elementOffset < slotOffset,
	    distance = isFirst ? slotOffset - elementOffset - elementHeight : elementOffset - slotOffset - slotHeight;

	return distance < viewportHeight;
}

var slot_service_SlotService = function () {
	function SlotService() {
		classCallCheck_default()(this, SlotService);
	}

	createClass_default()(SlotService, [{
		key: 'add',
		value: function add(adSlot) {
			var slotName = adSlot.getSlotName();

			slot_service_slots[slotName] = adSlot;

			if (slotStates[slotName] === false) {
				adSlot.disable(slotStatuses[slotName]);
			}
			if (slotStates[slotName] === true) {
				adSlot.enable();
			}
		}
	}, {
		key: 'remove',
		value: function remove(adSlot) {
			var slotName = adSlot.getSlotName();

			adSlot.disable('Marked for remove');
			delete slot_service_slots[slotName];
			delete slotStates[slotName];
			delete slotStatuses[slotName];
		}
	}, {
		key: 'get',
		value: function get(id) {
			return slot_service_slots[id];
		}

		/**
   * @deprecated since 12.0.0
   * Use get function
   */

	}, {
		key: 'getBySlotName',
		value: function getBySlotName(slotName) {
			return this.get(slotName);
		}
	}, {
		key: 'forEach',
		value: function forEach(callback) {
			keys_default()(slot_service_slots).forEach(function (id) {
				callback(slot_service_slots[id]);
			});
		}
	}, {
		key: 'enable',
		value: function enable(slotName) {
			setState(slotName, true);
		}
	}, {
		key: 'disable',
		value: function disable(slotName) {
			var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			setState(slotName, false, status);
		}
	}, {
		key: 'hasViewportConflict',
		value: function hasViewportConflict(adSlot) {
			if (!adSlot.hasDefinedViewportConflicts() || adSlot.getElement() === null) {
				return false;
			}

			var slotHeight = adSlot.getElement().offsetHeight,
			    slotOffset = getTopOffset(adSlot.getElement()),
			    viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

			var hasConflict = adSlot.getViewportConflicts().some(function (elementId) {
				return isSlotInTheSameViewport(slotHeight, slotOffset, viewportHeight, elementId);
			});
			logger(groupName, 'hasViewportConflict', adSlot.getSlotName(), hasConflict);

			return hasConflict;
		}
	}]);

	return SlotService;
}();

var slotService = new slot_service_SlotService();

function setState(slotName, state) {
	var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	var slot = slotService.get(slotName);
	slotStates[slotName] = state;
	slotStatuses[slotName] = status;

	if (slot) {
		if (state) {
			slot.enable();
		} else {
			slot.disable(status);
		}
	}
}
// EXTERNAL MODULE: external "babel-runtime/core-js/object/get-own-property-names"
var get_own_property_names_ = __webpack_require__(17);
var get_own_property_names_default = /*#__PURE__*/__webpack_require__.n(get_own_property_names_);

// EXTERNAL MODULE: external "babel-runtime/core-js/symbol"
var symbol_ = __webpack_require__(15);
var symbol_default = /*#__PURE__*/__webpack_require__.n(symbol_);

// EXTERNAL MODULE: external "babel-runtime/core-js/object/get-prototype-of"
var get_prototype_of_ = __webpack_require__(2);
var get_prototype_of_default = /*#__PURE__*/__webpack_require__.n(get_prototype_of_);

// EXTERNAL MODULE: external "babel-runtime/helpers/possibleConstructorReturn"
var possibleConstructorReturn_ = __webpack_require__(3);
var possibleConstructorReturn_default = /*#__PURE__*/__webpack_require__.n(possibleConstructorReturn_);

// EXTERNAL MODULE: external "babel-runtime/helpers/get"
var helpers_get_ = __webpack_require__(13);
var helpers_get_default = /*#__PURE__*/__webpack_require__.n(helpers_get_);

// EXTERNAL MODULE: external "babel-runtime/helpers/inherits"
var inherits_ = __webpack_require__(4);
var inherits_default = /*#__PURE__*/__webpack_require__.n(inherits_);

// EXTERNAL MODULE: external "eventemitter3"
var external_eventemitter3_ = __webpack_require__(14);
var external_eventemitter3_default = /*#__PURE__*/__webpack_require__.n(external_eventemitter3_);

// CONCATENATED MODULE: ./src/services/events.js











var events_EventService = function (_EventEmitter) {
	inherits_default()(EventService, _EventEmitter);

	function EventService() {
		var _ref;

		var _temp, _this, _ret;

		classCallCheck_default()(this, EventService);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = possibleConstructorReturn_default()(this, (_ref = EventService.__proto__ || get_prototype_of_default()(EventService)).call.apply(_ref, [this].concat(args))), _this), _this.PAGE_CHANGE_EVENT = symbol_default()('PAGE_CHANGE_EVENT'), _this.PAGE_RENDER_EVENT = symbol_default()('PAGE_RENDER_EVENT'), _temp), possibleConstructorReturn_default()(_this, _ret);
	}

	createClass_default()(EventService, [{
		key: 'pageChange',
		value: function pageChange() {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			this.emit.apply(this, [this.PAGE_CHANGE_EVENT].concat(args));
		}
	}, {
		key: 'pageRender',
		value: function pageRender() {
			for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				args[_key3] = arguments[_key3];
			}

			this.emit.apply(this, [this.PAGE_RENDER_EVENT].concat(args));
		}
	}, {
		key: 'hasEvent',
		value: function hasEvent(event) {
			var _this2 = this;

			return get_own_property_names_default()(this).some(function (name) {
				return typeof_default()(_this2[name]) === 'symbol' && _this2[name] === event;
			});
		}
	}, {
		key: 'emit',
		value: function emit(event) {
			var _get2;

			if (!this.hasEvent(event)) {
				throw new Error('Event "' + event + '" is not registered. Please register an event first.');
			}

			for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
				args[_key4 - 1] = arguments[_key4];
			}

			(_get2 = helpers_get_default()(EventService.prototype.__proto__ || get_prototype_of_default()(EventService.prototype), 'emit', this)).call.apply(_get2, [this, event].concat(args));
		}
	}, {
		key: 'on',
		value: function on(event) {
			var _get3;

			if (!this.hasEvent(event)) {
				throw new Error('You can\'t listen for an event which is not registered yet.');
			}

			for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
				args[_key5 - 1] = arguments[_key5];
			}

			(_get3 = helpers_get_default()(EventService.prototype.__proto__ || get_prototype_of_default()(EventService.prototype), 'on', this)).call.apply(_get3, [this, event].concat(args));
		}
	}, {
		key: 'addListener',
		value: function addListener(event) {
			var _get4;

			if (!this.hasEvent(event)) {
				throw new Error('You can\'t listen for an event which is not registered yet.');
			}

			for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
				args[_key6 - 1] = arguments[_key6];
			}

			(_get4 = helpers_get_default()(EventService.prototype.__proto__ || get_prototype_of_default()(EventService.prototype), 'addListener', this)).call.apply(_get4, [this, event].concat(args));
		}
	}, {
		key: 'once',
		value: function once(event) {
			var _get5;

			if (!this.hasEvent(event)) {
				throw new Error('You can\'t listen for an event which is not registered yet.');
			}

			for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
				args[_key7 - 1] = arguments[_key7];
			}

			(_get5 = helpers_get_default()(EventService.prototype.__proto__ || get_prototype_of_default()(EventService.prototype), 'once', this)).call.apply(_get5, [this, event].concat(args));
		}
	}, {
		key: 'registerEvent',
		value: function registerEvent(name) {
			if (typeof name !== 'string') {
				throw new Error('Event name must be a string.');
			}

			if (this[name] !== undefined) {
				throw new Error('Event or property "' + name + '" already exists.');
			}

			this[name] = symbol_default()(name);

			return this[name];
		}
	}, {
		key: 'getRegisteredEventNames',
		value: function getRegisteredEventNames() {
			var _this3 = this;

			return get_own_property_names_default()(this).filter(function (name) {
				return typeof_default()(_this3[name]) === 'symbol';
			});
		}
	}]);

	return EventService;
}(external_eventemitter3_default.a);

var events = new events_EventService();
// CONCATENATED MODULE: ./src/services/btf-blocker-service.js








var logGroup = 'btf-blocker';

function disableBtf() {
	var _this = this;

	var slots = context.get('slots');

	keys_default()(slots).forEach(function (adSlotKey) {
		var slotConfig = slots[adSlotKey];

		if (!slotConfig.aboveTheFold && _this.unblockedSlots.indexOf(slotConfig.slotName) === -1) {
			slotService.disable(slotConfig.slotName, 'blocked');
		}
	});
}

var btf_blocker_service_BtfBlockerService = function () {
	function BtfBlockerService() {
		classCallCheck_default()(this, BtfBlockerService);

		this.resetState();
	}

	createClass_default()(BtfBlockerService, [{
		key: 'resetState',
		value: function resetState() {
			this.slotsQueue = [];
			this.atfEnded = false;
			this.unblockedSlots = [];

			makeLazyQueue(this.slotsQueue, function (_ref) {
				var adSlot = _ref.adSlot,
				    fillInCallback = _ref.fillInCallback;

				logger(logGroup, adSlot.getSlotName(), 'Filling delayed BTF slot');
				fillInCallback(adSlot);
			});

			if (window.ads && window.ads.runtime) {
				window.ads.runtime.disableBtf = false;
			}
		}
	}, {
		key: 'init',
		value: function init() {
			var _this2 = this;

			context.push('listeners.slot', {
				onRenderEnded: function onRenderEnded(adSlot) {
					logger(logGroup, adSlot.getSlotName(), 'Slot rendered');
					if (!_this2.atfEnded && adSlot.isAboveTheFold()) {
						_this2.finishAboveTheFold();
					}
				}
			});
			events.on(events.PAGE_CHANGE_EVENT, function () {
				_this2.resetState();
			});
		}
	}, {
		key: 'finishAboveTheFold',
		value: function finishAboveTheFold() {
			this.atfEnded = true;

			if (window.ads.runtime.disableBtf) {
				disableBtf.call(this);
			}

			this.slotsQueue.start();
		}
	}, {
		key: 'push',
		value: function push(adSlot, fillInCallback) {
			function wrappedFillInCallback() {
				if (slotService.hasViewportConflict(adSlot)) {
					slotService.disable(adSlot.getSlotName(), 'viewport-conflict');
				}

				if (!adSlot.isEnabled()) {
					logger(logGroup, adSlot.getSlotName(), 'Slot blocked', adSlot.getStatus());
					return;
				}

				logger(logGroup, adSlot.getSlotName(), 'Filling in slot');
				fillInCallback(adSlot);
			}

			if (!this.atfEnded && !adSlot.isAboveTheFold()) {
				this.slotsQueue.push({ adSlot: adSlot, fillInCallback: wrappedFillInCallback });
				logger(logGroup, adSlot.getSlotName(), 'BTF slot pushed to queue');
				return;
			}

			wrappedFillInCallback(adSlot);
		}
	}, {
		key: 'unblock',
		value: function unblock(slotName) {
			logger(logGroup, slotName, 'Unblocking slot');

			this.unblockedSlots.push(slotName);
			slotService.enable(slotName);
		}
	}]);

	return BtfBlockerService;
}();

var btfBlockerService = new btf_blocker_service_BtfBlockerService();
// CONCATENATED MODULE: ./src/services/template-service.js






var template_service_logGroup = 'template-service',
    templates = {};

var template_service_TemplateService = function () {
	function TemplateService() {
		classCallCheck_default()(this, TemplateService);
	}

	createClass_default()(TemplateService, [{
		key: 'register',
		value: function register(template) {
			var customConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (typeof template.getName !== 'function') {
				throw new Error('Template does not implement getName method.');
			}
			var name = template.getName();

			var config = {};

			if (typeof template.getDefaultConfig === 'function') {
				config = template.getDefaultConfig();
			}

			if (customConfig) {
				config = assign_default()(config, customConfig);
			}

			context.set('templates.' + name, config);
			templates[name] = template;
		}
	}, {
		key: 'init',
		value: function init(name) {
			var slot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			logger(template_service_logGroup, 'Load template', name, slot, params);
			if (!templates[name]) {
				throw new Error('Template ' + name + ' does not exist.');
			}

			return new templates[name](slot).init(params);
		}
	}]);

	return TemplateService;
}();

var templateService = new template_service_TemplateService();
// CONCATENATED MODULE: ./src/services/custom-ad-loader.js



function registerCustomAdLoader(methodName) {
	window[methodName] = function (params) {
		var slot = slotService.get(params.slotName);

		templateService.init(params.type, slot, params);
	};
}
// EXTERNAL MODULE: external "babel-runtime/core-js/json/stringify"
var stringify_ = __webpack_require__(7);
var stringify_default = /*#__PURE__*/__webpack_require__.n(stringify_);

// CONCATENATED MODULE: ./src/services/local-cache.js



/* global Storage */


var local_cache_logGroup = 'local-cache';

var _canUseStorage = void 0;

var local_cache_LocalCache = function () {
	function LocalCache() {
		classCallCheck_default()(this, LocalCache);
	}

	createClass_default()(LocalCache, [{
		key: 'canUseStorage',
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
							logger(local_cache_logGroup, 'Local Storage polyfill error: ', exception);
						}
					}
				}
			}

			return _canUseStorage;
		}
	}, {
		key: 'createPolyfill',
		value: function createPolyfill() {
			logger(local_cache_logGroup, 'Local Storage polyfill being created');
			Storage.prototype.data = {};

			Storage.prototype.setItem = function setItem(id, val) {
				this.data[id] = String(val);
			};

			Storage.prototype.getItem = function getItem(id) {
				return this.data[id] ? this.data[id] : null;
			};

			Storage.prototype.removeItem = function removeItem(id) {
				delete this.data[id];
			};

			Storage.prototype.clear = function clear() {
				this.data = {};
			};
		}
	}, {
		key: 'get',
		value: function get(key) {
			if (!this.canUseStorage()) {
				return false;
			}

			var cacheItem = window.localStorage.getItem(key);

			if (cacheItem) {
				// De-serialize
				cacheItem = JSON.parse(cacheItem);

				// Check if item has expired
				if (this.isExpired(cacheItem)) {
					this.delete(key);
					return false;
				}

				return cacheItem.data;
			}

			return false;
		}
	}, {
		key: 'set',
		value: function set(key, value) {
			var expires = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			if (!this.canUseStorage() || !this.isStorable(value)) {
				return false;
			}

			var cacheItem = { data: value };
			var expiresValue = parseInt(expires, 10);

			if (!isNaN(expiresValue)) {
				// Set expiration as a JS timestamp
				cacheItem.expires = expiresValue * 1000 + Date.now();
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
		key: 'delete',
		value: function _delete(key) {
			if (!this.canUseStorage()) {
				return;
			}

			window.localStorage.removeItem(key);
		}
	}, {
		key: 'isStorable',
		value: function isStorable(value) {
			if (
			// Functions might be a security risk
			typeof value === 'function' ||
			// NaN
			typeof value === 'number' && isNaN(value) ||
			// undefined
			typeof value === 'undefined') {
				return false;
			}

			return true;
		}
	}, {
		key: 'isExpired',
		value: function isExpired(cacheItem) {
			return cacheItem.expires && Date.now() >= parseInt(cacheItem.expires, 10);
		}
	}]);

	return LocalCache;
}();

var localCache = new local_cache_LocalCache();
// CONCATENATED MODULE: ./src/services/message-bus.js




var callbacks = [],
    message_bus_logGroup = 'message-bus';

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
	var i = 0,
	    callback = void 0;

	if (isAdEngineMessage(message)) {
		logger(message_bus_logGroup, 'Message received', message);

		for (i = 0; i < callbacks.length; i += 1) {
			callback = callbacks[i];
			if (messageMatch(callback.match, message)) {
				logger(message_bus_logGroup, 'Matching message', message, callback);

				callback.fn(JSON.parse(message.data).AdEngine);

				if (!callback.match.infinite) {
					callbacks.splice(i, 1);
				}
				return;
			}
		}
	}
}

var message_bus_MessageBus = function () {
	function MessageBus() {
		classCallCheck_default()(this, MessageBus);
	}

	createClass_default()(MessageBus, [{
		key: 'init',
		value: function init() {
			logger(message_bus_logGroup, 'Register message listener');
			window.addEventListener('message', onMessage);
		}
	}, {
		key: 'register',
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
// EXTERNAL MODULE: external "babel-runtime/core-js/object/get-own-property-descriptor"
var get_own_property_descriptor_ = __webpack_require__(11);
var get_own_property_descriptor_default = /*#__PURE__*/__webpack_require__.n(get_own_property_descriptor_);

// EXTERNAL MODULE: external "core-decorators"
var external_core_decorators_ = __webpack_require__(10);

// CONCATENATED MODULE: ./src/providers/gpt-size-map.js





var gpt_size_map_logGroup = 'gpt-size-map';

var gpt_size_map_GptSizeMap = function () {
	function GptSizeMap(sizeMap) {
		classCallCheck_default()(this, GptSizeMap);

		this.sizeMap = sizeMap || [];
		logger(gpt_size_map_logGroup, this.sizeMap, 'creating new size map');
	}

	createClass_default()(GptSizeMap, [{
		key: 'addSize',
		value: function addSize(viewportSize, sizes) {
			logger(gpt_size_map_logGroup, viewportSize, sizes, 'adding new size mapping');
			this.sizeMap.push({
				viewportSize: viewportSize,
				sizes: sizes
			});
		}
	}, {
		key: 'build',
		value: function build() {
			logger(gpt_size_map_logGroup, this.sizeMap, 'creating GPT size mapping builder');
			var builder = window.googletag && window.googletag.sizeMapping();

			if (!builder) {
				logger(gpt_size_map_logGroup, 'cannot create GPT size mapping builder');
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
		key: 'isEmpty',
		value: function isEmpty() {
			return !this.sizeMap.length;
		}
	}, {
		key: 'mapAllSizes',
		value: function mapAllSizes(callback) {
			return new GptSizeMap(this.sizeMap.map(function (_ref2, index) {
				var viewportSize = _ref2.viewportSize,
				    sizes = _ref2.sizes;

				var mappedSizes = callback(sizes, viewportSize, index);

				logger(gpt_size_map_logGroup, viewportSize, sizes, mappedSizes, 'mapping viewport sizes');

				return {
					viewportSize: viewportSize,
					sizes: mappedSizes
				};
			}));
		}
	}, {
		key: 'toString',
		value: function toString() {
			logger(gpt_size_map_logGroup, this.sizeMap, 'casting to string');
			var map = {};

			this.sizeMap.forEach(function (_ref3) {
				var viewportSize = _ref3.viewportSize,
				    sizes = _ref3.sizes;

				map[viewportSize.join('x')] = sizes;
			});

			return stringify_default()(map);
		}
	}]);

	return GptSizeMap;
}();
// CONCATENATED MODULE: ./src/providers/gpt-targeting.js



function setupGptTargeting() {
	var tag = window.googletag.pubads(),
	    targeting = context.get('targeting');

	function setTargetingValue(key, value) {
		if (typeof value === 'function') {
			tag.setTargeting(key, value());
		} else {
			tag.setTargeting(key, value);
		}
	}

	keys_default()(targeting).forEach(function (key) {
		setTargetingValue(key, targeting[key]);
	});

	context.onChange('targeting', function (trigger, value) {
		var segments = trigger.split('.'),
		    key = segments[segments.length - 1];

		setTargetingValue(key, value);
	});
}
// CONCATENATED MODULE: ./src/models/ad-slot.js











var ad_slot_AdSlot = function (_EventEmitter) {
	inherits_default()(AdSlot, _EventEmitter);

	function AdSlot(ad) {
		classCallCheck_default()(this, AdSlot);

		var _this = possibleConstructorReturn_default()(this, (AdSlot.__proto__ || get_prototype_of_default()(AdSlot)).call(this));

		_this.config = context.get('slots.' + ad.id) || {};
		_this.enabled = !_this.config.disabled;
		_this.viewed = false;
		_this.element = null;
		_this.status = null;

		_this.config.slotName = _this.config.slotName || ad.id;
		_this.config.targeting = _this.config.targeting || {};
		_this.config.targeting.src = _this.config.targeting.src || context.get('src');
		_this.config.targeting.pos = _this.config.targeting.pos || _this.getSlotName();

		_this.once(AdSlot.SLOT_VIEWED_EVENT, function () {
			_this.viewed = true;
		});
		return _this;
	}

	createClass_default()(AdSlot, [{
		key: 'getAdUnit',
		value: function getAdUnit() {
			if (!this.adUnit) {
				this.adUnit = stringBuilder.build(this.config.adUnit || context.get('adUnitId'), {
					slotConfig: this.config
				});
			}

			return this.adUnit;
		}
	}, {
		key: 'getVideoAdUnit',
		value: function getVideoAdUnit() {
			return stringBuilder.build(this.config.videoAdUnit || context.get('vast.adUnitId'), {
				slotConfig: this.config
			});
		}
	}, {
		key: 'getElement',
		value: function getElement() {
			if (!this.element) {
				this.element = document.getElementById(this.getSlotName());
			}

			return this.element;
		}
	}, {
		key: 'getSlotName',
		value: function getSlotName() {
			return this.config.slotName;
		}
	}, {
		key: 'getSizes',
		value: function getSizes() {
			return this.config.sizes;
		}
	}, {
		key: 'getTargeting',
		value: function getTargeting() {
			return this.config.targeting;
		}
	}, {
		key: 'getDefaultSizes',
		value: function getDefaultSizes() {
			return this.config.defaultSizes;
		}
	}, {
		key: 'getViewportConflicts',
		value: function getViewportConflicts() {
			return this.config.viewportConflicts || [];
		}
	}, {
		key: 'hasDefinedViewportConflicts',
		value: function hasDefinedViewportConflicts() {
			return this.getViewportConflicts().length > 0;
		}
	}, {
		key: 'getStatus',
		value: function getStatus() {
			return this.status;
		}
	}, {
		key: 'setStatus',
		value: function setStatus() {
			var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			this.status = status;
			if (status !== null) {
				slotListener.emitStatusChanged(this);
			}
		}
	}, {
		key: 'isAboveTheFold',
		value: function isAboveTheFold() {
			return !!this.config.aboveTheFold;
		}
	}, {
		key: 'isEnabled',
		value: function isEnabled() {
			return this.enabled;
		}
	}, {
		key: 'isViewed',
		value: function isViewed() {
			return this.viewed;
		}
	}, {
		key: 'isRepeatable',
		value: function isRepeatable() {
			return !!this.config.repeat;
		}
	}, {
		key: 'getCopy',
		value: function getCopy() {
			return JSON.parse(stringify_default()(this.config));
		}
	}, {
		key: 'enable',
		value: function enable() {
			this.enabled = true;
		}
	}, {
		key: 'disable',
		value: function disable() {
			var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			this.enabled = false;
			this.setStatus(status);
		}
	}, {
		key: 'setConfigProperty',
		value: function setConfigProperty(key, value) {
			context.set('slots.' + this.config.slotName + '.' + key, value);
		}
	}, {
		key: 'success',
		value: function success() {
			var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'success';

			slotTweaker.show(this);
			this.setStatus(status);

			if (this.config.defaultTemplate) {
				templateService.init(this.config.defaultTemplate, this);
			}
		}
	}, {
		key: 'collapse',
		value: function collapse() {
			var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'collapse';

			slotTweaker.hide(this);
			this.setStatus(status);
		}
	}]);

	return AdSlot;
}(external_eventemitter3_default.a);
ad_slot_AdSlot.PROPERTY_CHANGED_EVENT = 'propertyChanged';
ad_slot_AdSlot.SLOT_VIEWED_EVENT = 'slotViewed';
ad_slot_AdSlot.VIDEO_VIEWED_EVENT = 'videoViewed';
// CONCATENATED MODULE: ./src/models/index.js

// CONCATENATED MODULE: ./src/video/vast-parser.js





var vast_parser_VastParser = function () {
	function VastParser() {
		classCallCheck_default()(this, VastParser);
	}

	createClass_default()(VastParser, [{
		key: 'getAdInfo',
		value: function getAdInfo(imaAd) {
			var adInfo = {};

			if (imaAd) {
				adInfo.lineItemId = imaAd.getAdId();
				adInfo.creativeId = imaAd.getCreativeId();
				adInfo.contentType = imaAd.getContentType();

				var _ref = imaAd.getWrapperAdIds() || [],
				    _ref2 = slicedToArray_default()(_ref, 1),
				    lineItemId = _ref2[0];

				if (lineItemId !== undefined) {
					adInfo.lineItemId = lineItemId;
				}

				var _ref3 = imaAd.getWrapperCreativeIds() || [],
				    _ref4 = slicedToArray_default()(_ref3, 1),
				    creativeId = _ref4[0];

				if (creativeId !== undefined) {
					adInfo.creativeId = creativeId;
				}
			}

			return adInfo;
		}
	}, {
		key: 'parse',
		value: function parse(vastUrl) {
			var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var currentAd = this.getAdInfo(extra.imaAd),
			    vastParams = query_string_queryString.getValues(vastUrl.substr(1 + vastUrl.indexOf('?'))),
			    customParams = query_string_queryString.getValues(encodeURI(vastParams.cust_params));

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
// CONCATENATED MODULE: ./src/video/vast-debugger.js





function setAttribute(element, attribute, value) {
	if (!element || !value) {
		return;
	}

	element.setAttribute(attribute, value);
}

var vast_debugger_VastDebugger = function () {
	function VastDebugger() {
		classCallCheck_default()(this, VastDebugger);
	}

	createClass_default()(VastDebugger, [{
		key: 'setVastAttributesFromVastParams',
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
		key: 'setVastAttributes',
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
// CONCATENATED MODULE: ./src/video/vast-url-builder.js




var availableVideoPositions = ['preroll', 'midroll', 'postroll'],
    baseUrl = 'https://pubads.g.doubleclick.net/gampad/ads?',
    correlator = Math.round(Math.random() * 10000000000);

function getCustomParameters(slot) {
	var extraTargeting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var params = assign_default()({}, context.get('targeting'), slot.getTargeting(), extraTargeting);

	return encodeURIComponent(keys_default()(params).filter(function (key) {
		return params[key];
	}).map(function (key) {
		return key + '=' + params[key];
	}).join('&'));
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function buildVastUrl(aspectRatio, slotName) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var params = ['output=vast', 'env=vp', 'gdfp_req=1', 'impl=s', 'unviewed_position_start=1', 'sz=' + (aspectRatio > 1 || !isNumeric(aspectRatio) ? '640x480' : '320x480'), 'url=' + encodeURIComponent(window.location.href), 'description_url=' + encodeURIComponent(window.location.href), 'correlator=' + correlator],
	    slot = slotService.get(slotName);

	if (slot) {
		params.push('iu=' + slot.getVideoAdUnit());
		params.push('cust_params=' + getCustomParameters(slot, options.targeting));
	} else {
		throw Error('Slot does not exist!');
	}

	if (options.contentSourceId && options.videoId) {
		params.push('cmsid=' + options.contentSourceId);
		params.push('vid=' + options.videoId);
	}

	if (options.vpos && availableVideoPositions.indexOf(options.vpos) > -1) {
		params.push('vpos=' + options.vpos);
	}

	if (options.numberOfAds !== undefined) {
		params.push('pmad=' + options.numberOfAds);
	}

	params.push('npa=' + (trackingOptIn.isOptedIn() ? 0 : 1));

	return baseUrl + params.join('&');
}
// CONCATENATED MODULE: ./src/video/player/porvata/ima/google-ima-setup.js




var google_ima_setup_logGroup = 'google-ima-setup';

function getOverriddenVast() {
	if (query_string_queryString.get('porvata_override_vast') === '1') {
		var vastXML = window.localStorage.getItem('porvata_vast');
		logger(google_ima_setup_logGroup, 'Overridden VAST', vastXML);

		return vastXML;
	}

	return null;
}

function createRequest(params) {
	var adSlot = slotService.get(params.slotName),
	    adsRequest = new window.google.ima.AdsRequest(),
	    overriddenVast = getOverriddenVast();

	if (params.vastResponse || overriddenVast) {
		adsRequest.adsResponse = overriddenVast || params.vastResponse;
	}

	if (context.get('options.porvata.audio.exposeToSlot')) {
		var key = context.get('options.porvata.audio.key'),
		    segment = context.get('options.porvata.audio.segment');

		adSlot.setConfigProperty('audioSegment', params.autoPlay ? '' : segment);
		adSlot.setConfigProperty('targeting.' + key, params.autoPlay ? 'no' : 'yes');
	}

	adsRequest.adTagUrl = params.vastUrl || buildVastUrl(params.width / params.height, params.slotName, {
		targeting: params.vastTargeting
	});
	adsRequest.linearAdSlotWidth = params.width;
	adsRequest.linearAdSlotHeight = params.height;

	return adsRequest;
}

function getRenderingSettings() {
	var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var adsRenderingSettings = new window.google.ima.AdsRenderingSettings(),
	    maximumRecommendedBitrate = 68000; // 2160p High Frame Rate

	if (!context.get('state.isMobile')) {
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
// CONCATENATED MODULE: ./src/video/player/porvata/moat/moat-video-tracker-script.js
// Fixes for MOAT script incompatibility
var eventMapping = {},
    listeners = [],
    moatapi = {};

// MOAT CODE START
/* Copyright (c) 2011-2016 Moat Inc. All Rights Reserved. */
// eslint-disable-next-line
function initMoatTracking(a, f, c) {
	if (!1 === f.hasOwnProperty("partnerCode")) return !1;var g = document.createElement("script");c = c || a && ("undefined" !== typeof a.O ? a.O.parentNode : document.body) || document.body;listeners = [];moatapi = { adsManager: a, ids: f, imaSDK: !0, events: [] };eventMapping = { complete: "AdVideoComplete", firstquartile: "AdVideoFirstQuartile", impression: "AdImpression", loaded: "AdLoaded", midpoint: "AdVideoMidpoint", pause: "AdPaused", skip: "AdSkipped", start: "AdVideoStart", thirdquartile: "AdVideoThirdQuartile", volumeChange: "AdVolumeChange" };if (google && google.ima && a) {
		var d = "_moatApi" + Math.floor(1E8 * Math.random()),
		    h;for (h in google.ima.AdEvent.Type) {
			var l = function l(b) {
				if (moatapi.sendEvent) {
					for (b = listeners.length - 1; 0 <= b; b--) {
						a.removeEventListener(listeners[b].type, listeners[b].func);
					}moatapi.sendEvent(moatapi.events);
				} else moatapi.events.push({ type: eventMapping[b.type] || b.type, adVolume: a.getVolume() });
			};a.addEventListener(google.ima.AdEvent.Type[h], l);listeners.push({ type: google.ima.AdEvent.Type[h], func: l });
		}
	}var d = "undefined" !== typeof d ? d : "",
	    e,
	    k;try {
		e = c.ownerDocument, k = e.defaultView || e.parentWindow;
	} catch (m) {
		e = document, k = window;
	}k[d] = moatapi;g.type = "text/javascript";c && c.appendChild(g);g.src = "https://z.moatads.com/" + f.partnerCode + "/moatvideo.js#" + d;
};
// MOAT CODE END
// CONCATENATED MODULE: ./src/video/player/porvata/moat/moat-video-tracker.js






var moat_video_tracker_logGroup = 'moat-video-tracker';

var moat_video_tracker_MoatVideoTracker = function () {
	function MoatVideoTracker() {
		classCallCheck_default()(this, MoatVideoTracker);
	}

	createClass_default()(MoatVideoTracker, [{
		key: 'init',
		value: function init(adsManager, container, viewMode, slicer1, slicer2) {
			var ids = {
				partnerCode: context.get('options.video.moatTracking.partnerCode'),
				viewMode: viewMode,
				slicer1: slicer1,
				slicer2: slicer2
			};

			try {
				initMoatTracking(adsManager, ids, container);
				logger(moat_video_tracker_logGroup, 'MOAT video tracking initialized');
			} catch (error) {
				logger(moat_video_tracker_logGroup, 'MOAT video tracking initalization error', error);
			}
		}
	}]);

	return MoatVideoTracker;
}();

var moatVideoTracker = new moat_video_tracker_MoatVideoTracker();
// CONCATENATED MODULE: ./src/video/player/porvata/ima/google-ima-player-factory.js






function getVideoElement() {
	var videoElement = document.createElement('video');

	videoElement.setAttribute('preload', 'none');

	return videoElement;
}

var google_ima_player_factory_GoogleImaPlayer = function () {
	function GoogleImaPlayer(adDisplayContainer, adsLoader, params) {
		classCallCheck_default()(this, GoogleImaPlayer);

		this.isAdsManagerLoaded = false;
		this.status = '';
		this.adDisplayContainer = adDisplayContainer;
		this.adsLoader = adsLoader;
		this.adsManager = null;
		this.params = params;
		this.mobileVideoAd = params.container.querySelector('video');
		this.eventListeners = {};
		this.vastUrl = '';
	}

	createClass_default()(GoogleImaPlayer, [{
		key: 'setVastUrl',
		value: function setVastUrl(vastUrl) {
			this.vastUrl = vastUrl;
		}
	}, {
		key: 'setAdsManager',
		value: function setAdsManager(adsManager) {
			this.adsManager = adsManager;
			this.isAdsManagerLoaded = true;
		}
	}, {
		key: 'addEventListener',
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
		key: 'setVastAttributes',
		value: function setVastAttributes(status) {
			var currentAd = this.adsManager && this.adsManager.getCurrentAd && this.adsManager.getCurrentAd(),
			    playerElement = this.params.container.querySelector('.video-player');

			vastDebugger.setVastAttributes(playerElement, this.vastUrl, status, currentAd);
		}
	}, {
		key: 'setAutoPlay',
		value: function setAutoPlay(value) {
			// mobileVideoAd DOM element is present on mobile only
			if (this.mobileVideoAd) {
				this.mobileVideoAd.autoplay = value;
				this.mobileVideoAd.muted = value;
			}
			this.params.autoPlay = value;
		}
	}, {
		key: 'playVideo',
		value: function playVideo(width, height) {
			var _this2 = this;

			var callback = function callback() {
				_this2.dispatchEvent('wikiaAdPlayTriggered');
				// https://developers.google.com/interactive-media-ads/docs/sdks/html5/v3/apis#ima.AdDisplayContainer.initialize
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
		key: 'reload',
		value: function reload() {
			var adRequest = googleImaSetup.createRequest(this.params);

			this.adsManager.destroy();
			this.adsLoader.contentComplete();
			this.setVastUrl(adRequest.adTagUrl);
			this.adsLoader.requestAds(adRequest);
		}
	}, {
		key: 'resize',
		value: function resize(width, height) {
			var isFullscreen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			var viewMode = window.google.ima.ViewMode;

			if (this.adsManager) {
				this.adsManager.resize(Math.round(width), Math.round(height), isFullscreen ? viewMode.FULLSCREEN : viewMode.NORMAL);
			}
		}
	}, {
		key: 'dispatchEvent',
		value: function dispatchEvent(eventName) {
			if (this.eventListeners[eventName] && this.eventListeners[eventName].length > 0) {
				this.eventListeners[eventName].forEach(function (callback) {
					callback({});
				});
			}
		}
	}, {
		key: 'setStatus',
		value: function setStatus(newStatus) {
			var _this3 = this;

			return function () {
				_this3.status = newStatus;
			};
		}
	}, {
		key: 'getStatus',
		value: function getStatus() {
			return this.status;
		}
	}, {
		key: 'getAdsManager',
		value: function getAdsManager() {
			return this.adsManager;
		}
	}]);

	return GoogleImaPlayer;
}();

var googleImaPlayerFactory = {
	create: function create(adDisplayContainer, adsLoader, videoSettings) {
		var adRequest = googleImaSetup.createRequest(videoSettings.getParams()),
		    player = new google_ima_player_factory_GoogleImaPlayer(adDisplayContainer, adsLoader, videoSettings.getParams()),
		    videoElement = getVideoElement();

		if (player.mobileVideoAd) {
			videoSettings.getContainer().classList.add('mobile-porvata');
		}

		adsLoader.addEventListener('adsManagerLoaded', function (adsManagerLoadedEvent) {
			var renderingSettings = googleImaSetup.getRenderingSettings(videoSettings),
			    adsManager = adsManagerLoadedEvent.getAdsManager(videoElement, renderingSettings);
			player.setAdsManager(adsManager);

			if (videoSettings.isMoatTrackingEnabled()) {
				moatVideoTracker.init(adsManager, videoSettings.getContainer(), window.google.ima.ViewMode.NORMAL, videoSettings.get('src'), videoSettings.get('adProduct') + '/' + videoSettings.get('slotName'));
			}

			player.dispatchEvent('wikiaAdsManagerLoaded');

			adsManager.addEventListener('loaded', function () {
				return player.setVastAttributes('success');
			});
			adsManager.addEventListener('adError', function () {
				return player.setVastAttributes('error');
			});
		}, false);

		adsLoader.addEventListener('adError', function () {
			return player.setVastAttributes('error');
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
// CONCATENATED MODULE: ./src/video/player/porvata/ima/google-ima.js




var imaLibraryUrl = '//imasdk.googleapis.com/js/sdkloader/ima3.js';

function load() {
	if (window.google && window.google.ima) {
		return new promise_default.a(function (resolve) {
			resolve();
		});
	}

	return scriptLoader.loadScript(imaLibraryUrl);
}

function getPlayer(videoSettings) {
	var adDisplayContainer = new window.google.ima.AdDisplayContainer(videoSettings.getContainer()),
	    iframe = videoSettings.getContainer().querySelector('div > iframe');

	// Reload iframe in order to make IMA work when user is moving back/forward to the page with player
	// https://groups.google.com/forum/#!topic/ima-sdk/Q6Y56CcXkpk
	// https://github.com/googleads/videojs-ima/issues/110
	if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
		iframe.contentWindow.location.href = iframe.src;
	}

	var adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);

	return googleImaPlayerFactory.create(adDisplayContainer, adsLoader, videoSettings);
}

var googleIma = {
	load: load,
	getPlayer: getPlayer
};
// CONCATENATED MODULE: ./src/video/player/porvata/video-settings.js





function getMoatTrackingStatus(params) {
	var sampling = context.get('options.video.moatTracking.sampling');

	if (typeof params.moatTracking === 'boolean') {
		return params.moatTracking;
	}

	if (!context.get('options.video.moatTracking.enabled')) {
		return false;
	}

	if (sampling === 100) {
		return true;
	}

	if (sampling > 0) {
		return sampler.sample('moat_video_tracking', sampling);
	}

	return false;
}

var video_settings_VideoSettings = function () {
	function VideoSettings() {
		var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		classCallCheck_default()(this, VideoSettings);

		this.params = params;
		this.moatTracking = getMoatTrackingStatus(params);
	}

	createClass_default()(VideoSettings, [{
		key: 'get',
		value: function get(key) {
			return this.params[key];
		}
	}, {
		key: 'getContainer',
		value: function getContainer() {
			return this.get('container');
		}
	}, {
		key: 'getParams',
		value: function getParams() {
			return this.params;
		}
	}, {
		key: 'isMoatTrackingEnabled',
		value: function isMoatTrackingEnabled() {
			return this.moatTracking;
		}
	}]);

	return VideoSettings;
}();
// CONCATENATED MODULE: ./src/video/player/porvata/porvata.js







var VIDEO_FULLSCREEN_CLASS_NAME = 'video-player-fullscreen';
var STOP_SCROLLING_CLASS_NAME = 'stop-scrolling';

var prepareVideoAdContainer = function prepareVideoAdContainer(params) {
	var videoAdContainer = params.container.querySelector('div');

	videoAdContainer.classList.add('video-player');
	videoAdContainer.classList.add('hide');

	return videoAdContainer;
};

var porvata_nativeFullscreenOnElement = function nativeFullscreenOnElement(element) {
	var enter = tryProperty(element, ['webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen', 'requestFullscreen']);
	var exit = tryProperty(document, ['webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen', 'exitFullscreen']);
	var fullscreenChangeEvent = (whichProperty(document, ['onwebkitfullscreenchange', 'onmozfullscreenchange', 'onmsfullscreenchange', 'onfullscreenchange']) || '').replace(/^on/, '').replace('msfullscreenchange', 'MSFullscreenChange');
	var addChangeListener = function addChangeListener() {
		var _document;

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return (_document = document).addEventListener.apply(_document, [fullscreenChangeEvent].concat(args));
	};
	var removeChangeListener = function removeChangeListener() {
		var _document2;

		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
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

var porvata_PorvataPlayer = function () {
	function PorvataPlayer(ima, params) {
		var _this = this;

		classCallCheck_default()(this, PorvataPlayer);

		this.ima = ima;
		this.container = prepareVideoAdContainer(params);
		this.mobileVideoAd = params.container.querySelector('video');
		this.params = params;

		var nativeFullscreen = porvata_nativeFullscreenOnElement(this.container);

		this.fullscreen = Boolean(params.isFullscreen);
		this.nativeFullscreen = nativeFullscreen;
		this.width = params.width;
		this.height = params.height;
		this.muteProtect = false;
		this.defaultVolume = 0.75;

		if (nativeFullscreen.isSupported()) {
			nativeFullscreen.addChangeListener(function () {
				return _this.onFullscreenChange();
			});
		}
	}

	createClass_default()(PorvataPlayer, [{
		key: 'addEventListener',
		value: function addEventListener(eventName, callback) {
			this.ima.addEventListener(eventName, callback);
		}
	}, {
		key: 'getRemainingTime',
		value: function getRemainingTime() {
			return this.ima.getAdsManager().getRemainingTime();
		}
	}, {
		key: 'isFullscreen',
		value: function isFullscreen() {
			return this.fullscreen;
		}
	}, {
		key: 'isMuted',
		value: function isMuted() {
			return this.ima.getAdsManager().getVolume() === 0;
		}
	}, {
		key: 'isMobilePlayerMuted',
		value: function isMobilePlayerMuted() {
			var mobileVideoAd = this.container.querySelector('video');
			return mobileVideoAd && mobileVideoAd.autoplay && mobileVideoAd.muted;
		}
	}, {
		key: 'isPaused',
		value: function isPaused() {
			return this.ima.getStatus() === 'paused';
		}
	}, {
		key: 'isPlaying',
		value: function isPlaying() {
			return this.ima.getStatus() === 'playing';
		}
	}, {
		key: 'pause',
		value: function pause() {
			this.ima.getAdsManager().pause();
		}
	}, {
		key: 'play',
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
		key: 'reload',
		value: function reload() {
			this.ima.reload();
		}
	}, {
		key: 'resize',
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
		key: 'resume',
		value: function resume() {
			this.ima.getAdsManager().resume();
		}
	}, {
		key: 'rewind',
		value: function rewind() {
			this.params.autoPlay = false;
			this.ima.setAutoPlay(false);
			this.ima.dispatchEvent('wikiaAdRestart');
			this.play();
		}
	}, {
		key: 'setVolume',
		value: function setVolume(volume) {
			this.updateVideoDOMElement(volume);
			this.ima.getAdsManager().setVolume(volume);

			// This is hack for Safari, because it can't dispatch original IMA event (volumeChange)
			this.ima.dispatchEvent('wikiaVolumeChange');
		}
	}, {
		key: 'toggleFullscreen',
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
		key: 'onFullscreenChange',
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
		key: 'updateVideoDOMElement',
		value: function updateVideoDOMElement(volume) {
			if (this.mobileVideoAd) {
				this.mobileVideoAd.muted = volume === 0;
				this.mobileVideoAd.volume = volume;
			}
		}
	}, {
		key: 'mute',
		value: function mute() {
			this.setVolume(0);
		}
	}, {
		key: 'unmute',
		value: function unmute() {
			this.setVolume(this.defaultVolume);

			if (this.params.autoPlay && this.params.restartOnUnmute) {
				this.rewind();
			}
		}
	}, {
		key: 'volumeToggle',
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
		key: 'stop',
		value: function stop() {
			this.ima.getAdsManager().stop();
			this.ima.dispatchEvent('wikiaAdStop');
		}
	}]);

	return PorvataPlayer;
}();

var porvata_Porvata = function () {
	function Porvata() {
		classCallCheck_default()(this, Porvata);
	}

	createClass_default()(Porvata, null, [{
		key: 'addOnViewportChangeListener',

		/**
   * @private
   * @returns listener id
   */
		value: function addOnViewportChangeListener(params, listener) {
			return viewportObserver.addListener(params.container, listener, {
				offsetTop: params.viewportOffsetTop || 0,
				offsetBottom: params.viewportOffsetBottom || 0
			});
		}
	}, {
		key: 'inject',
		value: function inject(params) {
			var porvataListener = new porvata_listener_PorvataListener({
				adProduct: params.adProduct,
				position: params.slotName,
				src: params.src,
				withAudio: !params.autoPlay
			});

			var isFirstPlay = true,
			    autoPaused = false,
			    autoPlayed = false,
			    viewportListenerId = null;

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
				return new porvata_PorvataPlayer(ima, params);
			}).then(function (video) {
				function inViewportCallback(isVisible) {
					// Play video automatically only for the first time
					if (isVisible && !autoPlayed && params.autoPlay) {
						video.play();
						autoPlayed = true;
						// Don't resume when video was paused manually
					} else if (isVisible && autoPaused) {
						video.resume();
						// Pause video once it's out of viewport and set autoPaused to distinguish manual and auto pause
					} else if (!isVisible && video.isPlaying() && !params.blockOutOfViewportPausing) {
						video.pause();
						autoPaused = true;
					}
				}

				function setupAutoPlayMethod() {
					if (params.blockOutOfViewportPausing) {
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
						viewportObserver.removeListener(viewportListenerId);
						viewportListenerId = null;
					}
					isFirstPlay = false;
					porvataListener.params.withAudio = true;
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

				if (params.autoPlay) {
					muteFirstPlay(video);
				}

				if (params.onReady) {
					params.onReady(video);
				}

				video.addEventListener('wikiaAdsManagerLoaded', function () {
					setupAutoPlayMethod();
				});

				return video;
			});
		}
	}]);

	return Porvata;
}();
// CONCATENATED MODULE: ./src/video/player/porvata/index.js




// CONCATENATED MODULE: ./src/video/index.js




// CONCATENATED MODULE: ./src/listeners/porvata-listener.js








function getListeners() {
	return context.get('listeners.porvata');
}

var porvata_listener_PorvataListener = function () {
	function PorvataListener(params) {
		classCallCheck_default()(this, PorvataListener);

		this.params = params;
		this.listeners = getListeners().filter(function (listener) {
			return !listener.isEnabled || listener.isEnabled();
		});
		this.logger = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return logger.apply(undefined, [PorvataListener.LOG_GROUP].concat(args));
		};
	}

	createClass_default()(PorvataListener, [{
		key: 'init',
		value: function init() {
			this.dispatch('init');
		}
	}, {
		key: 'registerVideoEvents',
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
		key: 'dispatch',
		value: function dispatch(eventName) {
			var _this2 = this;

			var errorCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			var data = this.getData(eventName, errorCode);

			this.logger(eventName, data);
			this.listeners.forEach(function (listener) {
				listener.onEvent(eventName, _this2.params, data);
			});

			if (this.params.position && eventName === PorvataListener.EVENTS.viewable_impression) {
				var adSlot = slotService.get(this.params.position);
				adSlot.emit(ad_slot_AdSlot.VIDEO_VIEWED_EVENT);
			}
		}
	}, {
		key: 'getData',
		value: function getData(eventName, errorCode) {
			var imaAd = this.video && this.video.ima.getAdsManager() && this.video.ima.getAdsManager().getCurrentAd(),
			    _vastParser$getAdInfo = vastParser.getAdInfo(imaAd),
			    contentType = _vastParser$getAdInfo.contentType,
			    creativeId = _vastParser$getAdInfo.creativeId,
			    lineItemId = _vastParser$getAdInfo.lineItemId;


			return {
				ad_error_code: errorCode,
				ad_product: this.params.adProduct,
				browser: client.getOperatingSystem() + ' ' + client.getBrowser(),
				content_type: contentType || '(none)',
				creative_id: creativeId || 0,
				event_name: eventName,
				line_item_id: lineItemId || 0,
				player: PorvataListener.PLAYER_NAME,
				position: this.params.position || '(none)',
				timestamp: new Date().getTime(),
				audio: this.params.withAudio ? 1 : 0
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
	wikiaAdUnmute: 'unmute'
};
porvata_listener_PorvataListener.LOG_GROUP = 'porvata-listener';
porvata_listener_PorvataListener.PLAYER_NAME = 'porvata';
// CONCATENATED MODULE: ./src/listeners/scroll-listener.js





var scroll_listener_callbacks = {};

function getUniqueId() {
	return ((1 + Math.random()) * 0x1000000).toString(16).substring(1);
}

function pushSlot(adStack, node) {
	adStack.push({
		id: node.id
	});
}

var scroll_listener_ScrollListener = function () {
	function ScrollListener() {
		classCallCheck_default()(this, ScrollListener);
	}

	createClass_default()(ScrollListener, [{
		key: 'init',
		value: function init() {
			var requestAnimationFrameHandleAdded = false;

			document.addEventListener('scroll', function (event) {
				if (!requestAnimationFrameHandleAdded) {
					window.requestAnimationFrame(function () {
						requestAnimationFrameHandleAdded = false;
						keys_default()(scroll_listener_callbacks).forEach(function (id) {
							if (typeof scroll_listener_callbacks[id] === 'function') {
								scroll_listener_callbacks[id](event, id);
							}
						});
					});
					requestAnimationFrameHandleAdded = true;
				}
			});
		}
	}, {
		key: 'addSlot',
		value: function addSlot(adStack, id) {
			var _this = this;

			var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

			var node = document.getElementById(id);

			if (!node) {
				return;
			}

			this.addCallback(function (event, callbackId) {
				var scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop,
				    slotPosition = getTopOffset(node),
				    viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

				if (scrollPosition + viewPortHeight > slotPosition - threshold) {
					_this.removeCallback(callbackId);
					pushSlot(adStack, node);
				}
			});
		}
	}, {
		key: 'addCallback',
		value: function addCallback(callback) {
			var id = getUniqueId();
			scroll_listener_callbacks[id] = callback;

			return id;
		}
	}, {
		key: 'removeCallback',
		value: function removeCallback(id) {
			delete scroll_listener_callbacks[id];
		}
	}]);

	return ScrollListener;
}();

var scrollListener = new scroll_listener_ScrollListener();
// CONCATENATED MODULE: ./src/listeners/slot-listener.js






var slot_listener_logGroup = 'slot-listener';

var slot_listener_listeners = null;

function getIframe(adSlot) {
	return adSlot.getElement().querySelector('div[id*="_container_"] iframe');
}

function getAdType(event, adSlot) {
	var iframe = getIframe(adSlot);

	var isIframeAccessible = false;

	if (event.isEmpty) {
		return 'collapse';
	}

	try {
		isIframeAccessible = !!iframe.contentWindow.document.querySelector;
	} catch (e) {
		logger(slot_listener_logGroup, 'getAdType', 'iframe is not accessible');
	}

	if (isIframeAccessible && iframe.contentWindow.AdEngine_adType) {
		return iframe.contentWindow.AdEngine_adType;
	}

	return 'success';
}

function slot_listener_getData(adSlot, _ref) {
	var adType = _ref.adType,
	    event = _ref.event;

	var data = {
		browser: client.getOperatingSystem() + ' ' + client.getBrowser(),
		status: adType || adSlot.getStatus(),
		page_width: window.document.body.scrollWidth || '',
		time_bucket: new Date().getHours(),
		timestamp: new Date().getTime(),
		viewport_height: window.innerHeight || 0
	};

	if (event) {
		if (event.slot) {
			var response = event.slot.getResponseInformation();

			if (response) {
				data.creative_id = response.creativeId;
				data.line_item_id = response.lineItemId;
			}
		}

		if (event.size && event.size.length) {
			data.creative_size = event.size.join('x');
		}
	}

	return data;
}

function slot_listener_dispatch(methodName, adSlot) {
	var adInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	if (!slot_listener_listeners) {
		slot_listener_listeners = context.get('listeners.slot').filter(function (listener) {
			return !listener.isEnabled || listener.isEnabled();
		});
	}

	var data = slot_listener_getData(adSlot, adInfo);

	slot_listener_listeners.forEach(function (listener) {
		if (typeof listener[methodName] !== 'function') {
			return;
		}

		listener[methodName](adSlot, data);
	});
	logger(slot_listener_logGroup, methodName, adSlot, adInfo, data);
}

var slot_listener_SlotListener = function () {
	function SlotListener() {
		classCallCheck_default()(this, SlotListener);
	}

	createClass_default()(SlotListener, [{
		key: 'emitRenderEnded',
		value: function emitRenderEnded(event, adSlot) {
			var adType = getAdType(event, adSlot);

			slotDataParamsUpdater.updateOnRenderEnd(adSlot, event);

			switch (adType) {
				case 'collapse':
					adSlot.collapse();
					break;
				default:
					adSlot.success();
					break;
			}

			slot_listener_dispatch('onRenderEnded', adSlot, { adType: adType, event: event });
		}
	}, {
		key: 'emitImpressionViewable',
		value: function emitImpressionViewable(event, adSlot) {
			adSlot.emit(ad_slot_AdSlot.SLOT_VIEWED_EVENT);
			slot_listener_dispatch('onImpressionViewable', adSlot, { event: event });
			slotTweaker.setDataParam(adSlot, 'slotViewed', true);
		}
	}, {
		key: 'emitStatusChanged',
		value: function emitStatusChanged(adSlot) {
			slotTweaker.setDataParam(adSlot, 'slotResult', adSlot.getStatus());
			slot_listener_dispatch('onStatusChanged', adSlot);
		}
	}]);

	return SlotListener;
}();

var slotListener = new slot_listener_SlotListener();
// CONCATENATED MODULE: ./src/listeners/index.js



// CONCATENATED MODULE: ./src/bidders/base-bidder.js





var base_bidder_BaseBidder = function () {
	function BaseBidder(bidderConfig, resetListener) {
		var _this = this;

		var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2000;

		classCallCheck_default()(this, BaseBidder);

		this.logGroup = 'bidder';
		this.bidderConfig = bidderConfig;
		this.timeout = timeout;

		this.resetState();

		if (resetListener) {
			resetListener(this.resetState);
		}

		this.onResponse = function () {
			return _this.onResponseCall();
		};
	}

	createClass_default()(BaseBidder, [{
		key: 'addResponseListener',
		value: function addResponseListener(callback) {
			this.onResponseCallbacks.push(callback);
		}
	}, {
		key: 'call',
		value: function call() {
			this.response = false;

			if (this.callBids) {
				this.callBids(this.onResponse);
			}

			this.called = true;
		}
	}, {
		key: 'createWithTimeout',
		value: function createWithTimeout(func) {
			var msToTimeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;

			var timeout = new promise_default.a(function (resolve, reject) {
				setTimeout(reject, msToTimeout);
			});

			return promise_default.a.race([new promise_default.a(func), timeout]);
		}
	}, {
		key: 'getName',
		value: function getName() {
			return this.name;
		}
	}, {
		key: 'getSlotBestPrice',
		value: function getSlotBestPrice(slotName) {
			if (this.getBestPrice) {
				return this.getBestPrice(slotName);
			}

			return {};
		}
	}, {
		key: 'getSlotTargetingParams',
		value: function getSlotTargetingParams(slotName, floorPrice) {
			if (!this.called || !this.isSlotSupported(slotName) || !this.getTargetingParams) {
				return {};
			}

			return this.getTargetingParams(slotName, floorPrice);
		}
	}, {
		key: 'hasResponse',
		value: function hasResponse() {
			return this.response;
		}
	}, {
		key: 'isSlotSupported',
		value: function isSlotSupported(slotName) {
			if (this.isSupported) {
				return this.isSupported(slotName);
			}

			return false;
		}
	}, {
		key: 'onResponseCall',
		value: function onResponseCall() {
			// this.calculatePrices();
			if (this.onResponseCallbacks) {
				this.onResponseCallbacks.start();
			}

			this.response = true;
		}
	}, {
		key: 'resetState',
		value: function resetState() {
			this.called = false;
			this.response = false;
			this.onResponseCallbacks = [];

			makeLazyQueue(this.onResponseCallbacks, BaseBidder.responseCallback);
		}
	}, {
		key: 'waitForResponse',
		value: function waitForResponse() {
			var _this2 = this;

			return this.createWithTimeout(function (resolve) {
				if (_this2.hasResponse()) {
					resolve();
				} else {
					_this2.addResponseListener(resolve);
				}
			}, this.timeout);
		}
	}, {
		key: 'wasCalled',
		value: function wasCalled() {
			return this.called;
		}
	}], [{
		key: 'responseCallback',
		value: function responseCallback(callback) {
			callback();
		}
	}]);

	return BaseBidder;
}();
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/base-adapter.js



var base_adapter_BaseAdapter = function () {
	function BaseAdapter(_ref) {
		var enabled = _ref.enabled,
		    slots = _ref.slots;

		classCallCheck_default()(this, BaseAdapter);

		this.enabled = enabled;
		this.slots = slots;
	}

	createClass_default()(BaseAdapter, [{
		key: "prepareAdUnits",
		value: function prepareAdUnits() {
			var _this = this;

			return keys_default()(this.slots).map(function (slotName) {
				return _this.prepareConfigForAdUnit(slotName, _this.slots[slotName]);
			});
		}
	}]);

	return BaseAdapter;
}();
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/aol.js







var aol_Aol = function (_BaseAdapter) {
	inherits_default()(Aol, _BaseAdapter);

	function Aol(options) {
		classCallCheck_default()(this, Aol);

		var _this = possibleConstructorReturn_default()(this, (Aol.__proto__ || get_prototype_of_default()(Aol)).call(this, options));

		_this.bidderName = 'aol';
		_this.network = '9435.1';
		return _this;
	}

	createClass_default()(Aol, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var sizes = _ref.sizes,
			    placement = _ref.placement,
			    alias = _ref.alias,
			    sizeId = _ref.sizeId;

			return {
				code: code,
				mediaTypes: {
					banner: {
						sizes: sizes
					}
				},
				bids: [{
					bidder: this.bidderName,
					params: {
						placement: placement,
						network: this.network,
						alias: alias,
						sizeId: sizeId
					}
				}]
			};
		}
	}]);

	return Aol;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/appnexus.js








var appnexus_Appnexus = function (_BaseAdapter) {
	inherits_default()(Appnexus, _BaseAdapter);

	function Appnexus(options) {
		classCallCheck_default()(this, Appnexus);

		var _this = possibleConstructorReturn_default()(this, (Appnexus.__proto__ || get_prototype_of_default()(Appnexus)).call(this, options));

		_this.bidderName = 'appnexus';
		_this.placements = options.placements;
		/* this.recoveryPlacements = {
  	atf: '11823778',
  	btf: '11823724',
  	hivi: '11823799'
  } */
		return _this;
	}

	createClass_default()(Appnexus, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var sizes = _ref.sizes,
			    _ref$position = _ref.position,
			    position = _ref$position === undefined ? 'mobile' : _ref$position;

			return {
				code: code,
				mediaTypes: {
					banner: {
						sizes: sizes
					}
				},
				bids: [{
					bidder: this.bidderName,
					params: {
						placementId: this.getPlacement(position)
					}
				}]
			};
		}
	}, {
		key: 'getPlacement',
		value: function getPlacement(position) {
			if (position === 'mobile') {
				var vertical = context.get('targeting.mappedVerticalName');

				position = vertical && this.placements[vertical] ? vertical : 'other';
			}

			return this.placements[position];
		}
	}]);

	return Appnexus;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/appnexus-ast.js








var appnexus_ast_AppnexusAst = function (_BaseAdapter) {
	inherits_default()(AppnexusAst, _BaseAdapter);

	function AppnexusAst(options) {
		classCallCheck_default()(this, AppnexusAst);

		var _this = possibleConstructorReturn_default()(this, (AppnexusAst.__proto__ || get_prototype_of_default()(AppnexusAst)).call(this, options));

		_this.bidderName = 'appnexusAst';
		_this.aliases = {
			appnexus: [_this.bidderName]
		};
		_this.debugPlacementId = '5768085';
		_this.isDebugMode = query_string_queryString.get('appnexusast_debug_mode') === '1';
		return _this;
	}

	createClass_default()(AppnexusAst, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var placementId = _ref.placementId;

			return {
				code: code,
				mediaTypes: {
					video: {
						context: 'outstream',
						playerSize: [640, 480]
					}
				},
				bids: [{
					bidder: this.bidderName,
					params: {
						placementId: this.isDebugMode ? this.debugPlacementId : placementId,
						video: {
							skippable: false,
							playback_method: ['auto_play_sound_off']
						}
					}
				}]
			};
		}
	}]);

	return AppnexusAst;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/appnexus-webads.js







var appnexus_webads_AppnexusWebads = function (_BaseAdapter) {
	inherits_default()(AppnexusWebads, _BaseAdapter);

	function AppnexusWebads(options) {
		classCallCheck_default()(this, AppnexusWebads);

		var _this = possibleConstructorReturn_default()(this, (AppnexusWebads.__proto__ || get_prototype_of_default()(AppnexusWebads)).call(this, options));

		_this.bidderName = 'appnexusWebAds';
		_this.aliases = {
			appnexus: [_this.bidderName]
		};
		_this.priority = 0;
		return _this;
	}

	createClass_default()(AppnexusWebads, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var placementId = _ref.placementId,
			    sizes = _ref.sizes;

			return {
				code: code,
				mediaTypes: {
					banner: {
						sizes: sizes
					}
				},
				bids: [{
					bidder: this.bidderName,
					params: {
						placementId: placementId
					}
				}]
			};
		}
	}]);

	return AppnexusWebads;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/audience-network.js








var audience_network_AudienceNetwork = function (_BaseAdapter) {
	inherits_default()(AudienceNetwork, _BaseAdapter);

	function AudienceNetwork(options) {
		classCallCheck_default()(this, AudienceNetwork);

		var _this = possibleConstructorReturn_default()(this, (AudienceNetwork.__proto__ || get_prototype_of_default()(AudienceNetwork)).call(this, options));

		_this.bidderName = 'audienceNetwork';
		_this.testMode = query_string_queryString.get('audiencenetworktest') === 'true';
		return _this;
	}

	createClass_default()(AudienceNetwork, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var sizes = _ref.sizes,
			    placementId = _ref.placementId;

			return {
				code: code,
				mediaTypes: {
					banner: {
						sizes: sizes
					}
				},
				bids: [{
					bidder: this.bidderName,
					params: {
						testMode: this.testMode,
						placementId: placementId
					}
				}]
			};
		}
	}]);

	return AudienceNetwork;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/beachfront.js








var beachfront_Beachfront = function (_BaseAdapter) {
	inherits_default()(Beachfront, _BaseAdapter);

	function Beachfront(options) {
		classCallCheck_default()(this, Beachfront);

		var _this = possibleConstructorReturn_default()(this, (Beachfront.__proto__ || get_prototype_of_default()(Beachfront)).call(this, options));

		_this.bidderName = 'beachfront';
		_this.bidfloor = 0.01;
		_this.debugAppId = '2e55f7ad-3558-49eb-a3e1-056ccd0e74e2';
		_this.isDebugMode = query_string_queryString.get('beachfront_debug_mode') === '1';
		return _this;
	}

	createClass_default()(Beachfront, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var appId = _ref.appId;

			return {
				code: code,
				mediaTypes: {
					video: {
						playerSize: [640, 480]
					}
				},
				bids: [{
					bidder: this.bidderName,
					params: {
						bidfloor: this.bidfloor,
						appId: this.isDebugMode ? this.debugAppId : appId
					}
				}]
			};
		}
	}]);

	return Beachfront;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/index-exchange.js







var index_exchange_IndexExchange = function (_BaseAdapter) {
	inherits_default()(IndexExchange, _BaseAdapter);

	function IndexExchange(options) {
		classCallCheck_default()(this, IndexExchange);

		var _this = possibleConstructorReturn_default()(this, (IndexExchange.__proto__ || get_prototype_of_default()(IndexExchange)).call(this, options));

		_this.bidderName = 'indexExchange';
		_this.aliases = {
			ix: [_this.bidderName]
		};
		/* this.recoveryConfig = {
  	TOP_LEADERBOARD: {
  		sizes: [
  			[728, 90],
  			[970, 250]
  		],
  		siteId: 215807
  	},
  	TOP_RIGHT_BOXAD: {
  		sizes: [
  			[300, 250],
  			[300, 600]
  		],
  		siteId: 215808
  	},
  	INCONTENT_BOXAD_1: {
  		sizes: [
  			[160, 600],
  			[300, 600],
  			[300, 250]
  		],
  		siteId: 215809
  	},
  	BOTTOM_LEADERBOARD: {
  		sizes: [
  			[728, 90],
  			[970, 250]
  		],
  		siteId: 215810
  	}
  }; */
		return _this;
	}

	createClass_default()(IndexExchange, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var _this2 = this;

			var sizes = _ref.sizes,
			    siteId = _ref.siteId;

			return {
				code: code,
				mediaTypes: {
					banner: {
						sizes: sizes
					}
				},
				bids: sizes.map(function (size) {
					return {
						bidder: _this2.bidderName,
						params: {
							siteId: siteId,
							size: size
						}
					};
				})
			};
		}
	}]);

	return IndexExchange;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/onemobile.js







var onemobile_Onemobile = function (_BaseAdapter) {
	inherits_default()(Onemobile, _BaseAdapter);

	function Onemobile(options) {
		classCallCheck_default()(this, Onemobile);

		var _this = possibleConstructorReturn_default()(this, (Onemobile.__proto__ || get_prototype_of_default()(Onemobile)).call(this, options));

		_this.bidderName = 'onemobile';
		_this.siteId = '2c9d2b50015e5e9a6540a64f3eac0266';
		return _this;
	}

	createClass_default()(Onemobile, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var sizes = _ref.sizes,
			    pos = _ref.pos;

			return {
				code: code,
				mediaTypes: {
					banner: {
						sizes: sizes
					}
				},
				bids: [{
					bidder: this.bidderName,
					params: {
						dcn: this.siteId,
						pos: pos
					}
				}]
			};
		}
	}]);

	return Onemobile;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/openx.js







var openx_Openx = function (_BaseAdapter) {
	inherits_default()(Openx, _BaseAdapter);

	function Openx(options) {
		classCallCheck_default()(this, Openx);

		var _this = possibleConstructorReturn_default()(this, (Openx.__proto__ || get_prototype_of_default()(Openx)).call(this, options));

		_this.bidderName = 'openx';
		_this.delDomain = 'wikia-d.openx.net';
		return _this;
	}

	createClass_default()(Openx, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var sizes = _ref.sizes,
			    unit = _ref.unit;

			return {
				code: code,
				mediaTypes: {
					banner: {
						sizes: sizes
					}
				},
				bids: [{
					bidder: this.bidderName,
					params: {
						unit: unit,
						delDomain: this.delDomain
					}
				}]
			};
		}
	}]);

	return Openx;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/pubmatic.js







var pubmatic_Pubmatic = function (_BaseAdapter) {
	inherits_default()(Pubmatic, _BaseAdapter);

	function Pubmatic(options) {
		classCallCheck_default()(this, Pubmatic);

		var _this = possibleConstructorReturn_default()(this, (Pubmatic.__proto__ || get_prototype_of_default()(Pubmatic)).call(this, options));

		_this.bidderName = 'pubmatic';
		_this.publisherId = '156260';
		return _this;
	}

	createClass_default()(Pubmatic, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var _this2 = this;

			var sizes = _ref.sizes,
			    ids = _ref.ids;

			return {
				code: code,
				mediaTypes: {
					banner: {
						sizes: sizes
					}
				},
				bids: ids.map(function (adSlot) {
					return {
						bidder: _this2.bidderName,
						params: {
							adSlot: adSlot,
							publisherId: _this2.publisherId
						}
					};
				})
			};
		}
	}]);

	return Pubmatic;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/prebid-helper.js



var lazyLoadSlots = ['BOTTOM_LEADERBOARD'];

function isSlotAvailable(code) {
	var lazyLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'off';

	var available = true;
	var isSlotLazy = lazyLoadSlots.indexOf(code) !== -1;

	if (lazyLoad !== 'off' && (lazyLoad === 'pre' && isSlotLazy || lazyLoad === 'post' && !isSlotLazy)) {
		available = false;
	}

	return available;
}

function setupAdUnits(adaptersConfig) {
	var adUnits = [];
	var adapters = getAdapters(adaptersConfig);

	adapters.forEach(function (adapter) {
		if (adapter && adapter.enabled) {
			var adapterAdUnits = adapter.prepareAdUnits();

			adapterAdUnits.forEach(function (adUnit) {
				if (adUnit && isSlotAvailable(adUnit.code)) {
					adUnits.push(adUnit);
				}
			});
		}
	});

	return adUnits;
}

function getTargeting(slotName) {
	var provider = context.get('state.isMobile') ? 'mobile' : 'gpt',
	    s1 = context.get('targeting.wikiIsTop1000') ? context.get('targeting.s1') : 'not a top1k wiki';

	return {
		pos: [slotName],
		src: [provider],
		s0: [context.get('targeting.s0') || ''],
		s1: [s1],
		s2: [context.get('targeting.s2') || ''],
		lang: [context.get('targeting.wikiLanguage') || 'en']
	};
}
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/rubicon.js









var rubicon_Rubicon = function (_BaseAdapter) {
	inherits_default()(Rubicon, _BaseAdapter);

	function Rubicon(options) {
		classCallCheck_default()(this, Rubicon);

		var _this = possibleConstructorReturn_default()(this, (Rubicon.__proto__ || get_prototype_of_default()(Rubicon)).call(this, options));

		_this.bidderName = 'rubicon';
		_this.accountId = 7450;
		return _this;
	}

	createClass_default()(Rubicon, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var siteId = _ref.siteId,
			    zoneId = _ref.zoneId,
			    sizeId = _ref.sizeId,
			    position = _ref.position;

			if (code === 'FEATURED' && !context.get('bidders.rubiconInFV')) {
				return null;
			}

			var targeting = getTargeting(code);

			return {
				code: code,
				mediaType: 'video',
				mediaTypes: {
					video: {
						playerSize: [640, 480]
					}
				},
				bids: [{
					bidder: this.bidderName,
					params: {
						accountId: this.accountId,
						siteId: siteId,
						zoneId: zoneId,
						name: code,
						position: position,
						inventory: targeting,
						video: {
							playerWidth: '640',
							playerHeight: '480',
							size_id: sizeId,
							language: targeting.lang[0]
						}
					}
				}]
			};
		}
	}]);

	return Rubicon;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/rubicon-display.js









var rubicon_display_RubiconDisplay = function (_BaseAdapter) {
	inherits_default()(RubiconDisplay, _BaseAdapter);

	function RubiconDisplay(options) {
		classCallCheck_default()(this, RubiconDisplay);

		var _this = possibleConstructorReturn_default()(this, (RubiconDisplay.__proto__ || get_prototype_of_default()(RubiconDisplay)).call(this, options));

		_this.bidderName = 'rubicon_display';
		_this.aliases = {
			rubicon: [_this.bidderName]
		};
		_this.accountId = 7450;
		return _this;
	}

	createClass_default()(RubiconDisplay, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var siteId = _ref.siteId,
			    zoneId = _ref.zoneId,
			    sizes = _ref.sizes,
			    position = _ref.position,
			    targeting = _ref.targeting;

			var pageTargeting = getTargeting(code);

			keys_default()(targeting || {}).forEach(function (key) {
				pageTargeting[key] = targeting[key];
			});

			return {
				code: code,
				mediaTypes: {
					banner: {
						sizes: sizes
					}
				},
				bids: [{
					bidder: this.bidderName,
					params: {
						accountId: this.accountId,
						siteId: siteId,
						zoneId: zoneId,
						name: code,
						position: position,
						keywords: ['rp.fastlane'],
						inventory: pageTargeting
					}
				}]
			};
		}
	}]);

	return RubiconDisplay;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/wikia.js









var wikia_Wikia = function (_BaseAdapter) {
	inherits_default()(Wikia, _BaseAdapter);

	function Wikia(options) {
		classCallCheck_default()(this, Wikia);

		var _this = possibleConstructorReturn_default()(this, (Wikia.__proto__ || get_prototype_of_default()(Wikia)).call(this, options));

		_this.bidderName = 'wikia';
		_this.enabled = !!query_string_queryString.get('wikia_adapter');

		if (_this.enabled) {
			_this.price = _this.getPrice();
		}

		_this.create = function () {
			return _this;
		};
		return _this;
	}

	createClass_default()(Wikia, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code, _ref) {
			var sizes = _ref.sizes;

			return {
				code: code,
				mediaTypes: {
					banner: {
						sizes: sizes
					}
				},
				bids: [{
					bidder: this.bidderName
				}]
			};
		}
	}, {
		key: 'getSpec',
		value: function getSpec() {
			return {
				code: this.bidderName,
				supportedMediaTypes: ['banner']
			};
		}
	}, {
		key: 'getPrice',
		value: function getPrice() {
			var price = query_string_queryString.get('wikia_adapter');

			return parseInt(price, 10) / 100;
		}
	}, {
		key: 'callBids',
		value: function callBids(bidRequest, addBidResponse, done) {
			var _this2 = this;

			window.pbjs.que.push(function () {
				_this2.addBids(bidRequest, addBidResponse, done);
			});
		}
	}, {
		key: 'addBids',
		value: function addBids(bidRequest, addBidResponse, done) {
			var _this3 = this;

			bidRequest.bids.forEach(function (bid) {
				var bidResponse = window.pbjs.createBid(1),
				    _bid$sizes$ = slicedToArray_default()(bid.sizes[0], 2),
				    width = _bid$sizes$[0],
				    height = _bid$sizes$[1];


				bidResponse.ad = _this3.getCreative(bid.sizes[0]);
				bidResponse.bidderCode = bidRequest.bidderCode;
				bidResponse.cpm = _this3.price;
				bidResponse.ttl = 300;
				bidResponse.mediaType = 'banner';
				bidResponse.width = width;
				bidResponse.height = height;

				addBidResponse(bid.adUnitCode, bidResponse);
				done();
			});
		}
	}, {
		key: 'getCreative',
		value: function getCreative(size) {
			var creative = document.createElement('div');

			creative.style.background = '#00b7e0';
			creative.style.color = '#fff';
			creative.style.fontFamily = 'sans-serif';
			creative.style.height = '100%';
			creative.style.textAlign = 'center';
			creative.style.width = '100%';

			var title = document.createElement('p');

			title.innerText = 'Wikia Creative';
			title.style.fontWeight = 'bold';
			title.style.margin = '0';
			title.style.paddingTop = '10px';

			var details = document.createElement('small');

			details.innerText = 'price: ' + this.price + ', ' + size + ': ' + size.join('x');

			creative.appendChild(title);
			creative.appendChild(details);

			return creative.outerHTML;
		}
	}]);

	return Wikia;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters/wikia-video.js










var wikia_video_WikiaVideo = function (_BaseAdapter) {
	inherits_default()(WikiaVideo, _BaseAdapter);

	function WikiaVideo(options) {
		classCallCheck_default()(this, WikiaVideo);

		var _this = possibleConstructorReturn_default()(this, (WikiaVideo.__proto__ || get_prototype_of_default()(WikiaVideo)).call(this, options));

		_this.bidderName = 'wikiaVideo';
		_this.enabled = !!query_string_queryString.get('wikia_video_adapter');

		if (_this.enabled) {
			_this.price = _this.getPrice();
		}

		_this.create = function () {
			return _this;
		};
		return _this;
	}

	createClass_default()(WikiaVideo, [{
		key: 'prepareConfigForAdUnit',
		value: function prepareConfigForAdUnit(code) {
			return {
				code: code,
				mediaTypes: {
					video: {
						context: 'outstream',
						playerSize: [640, 480]
					}
				},
				bids: [{
					bidder: this.bidderName
				}]
			};
		}
	}, {
		key: 'getSpec',
		value: function getSpec() {
			return {
				code: this.bidderName,
				supportedMediaTypes: ['video']
			};
		}
	}, {
		key: 'getPrice',
		value: function getPrice() {
			var price = query_string_queryString.get('wikia_video_adapter');

			return parseInt(price, 10) / 100;
		}
	}, {
		key: 'callBids',
		value: function callBids(bidRequest, addBidResponse, done) {
			var _this2 = this;

			window.pbjs.que.push(function () {
				_this2.addBids(bidRequest, addBidResponse, done);
			});
		}
	}, {
		key: 'addBids',
		value: function addBids(bidRequest, addBidResponse, done) {
			var _this3 = this;

			bidRequest.bids.forEach(function (bid) {
				var bidResponse = window.pbjs.createBid(1),
				    _bid$sizes$ = slicedToArray_default()(bid.sizes[0], 2),
				    width = _bid$sizes$[0],
				    height = _bid$sizes$[1];


				bidResponse.bidderCode = bidRequest.bidderCode;
				bidResponse.cpm = _this3.price;
				bidResponse.creativeId = 'foo123_wikiaVideoCreativeId';
				bidResponse.ttl = 300;
				bidResponse.mediaType = 'video';
				bidResponse.width = width;
				bidResponse.height = height;
				bidResponse.vastUrl = buildVastUrl(bidResponse.width / bidResponse.height, bid.adUnitCode, {
					src: 'test',
					pos: 'outstream',
					passback: 'wikiaVideo'
				});

				addBidResponse(bid.adUnitCode, bidResponse);
				done();
			});
		}
	}]);

	return WikiaVideo;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/bidders/prebid/adapters-registry.js
















var adapters_registry_adapters = [];
var customAdapters = [];
var availableAdapters = {
	aol: aol_Aol,
	appnexus: appnexus_Appnexus,
	appnexusAst: appnexus_ast_AppnexusAst,
	appnexusWebads: appnexus_webads_AppnexusWebads,
	audienceNetwork: audience_network_AudienceNetwork,
	beachfront: beachfront_Beachfront,
	indexExchange: index_exchange_IndexExchange,
	onemobile: onemobile_Onemobile,
	openx: openx_Openx,
	pubmatic: pubmatic_Pubmatic,
	rubicon: rubicon_Rubicon,
	rubiconDisplay: rubicon_display_RubiconDisplay
};

function registerAliases() {
	adapters_registry_adapters.filter(function (adapter) {
		return adapter.aliases;
	}).forEach(function (adapter) {
		window.pbjs.que.push(function () {
			var aliasMap = adapter.aliases;

			keys_default()(aliasMap).forEach(function (bidderName) {
				aliasMap[bidderName].forEach(function (alias) {
					window.pbjs.aliasBidder(bidderName, alias);
				});
			});
		});
	});
}

function setupAdapters(bidders) {
	keys_default()(availableAdapters).forEach(function (key) {
		if (bidders[key]) {
			var adapter = new availableAdapters[key](bidders[key]);

			adapters_registry_adapters.push(adapter);
		}
	});

	setupCustomAdapters(bidders);
}

function setupCustomAdapters(bidders) {
	if (bidders.wikia) {
		customAdapters.push(new wikia_Wikia(bidders.wikia));
	}

	if (bidders.wikiaVideo) {
		customAdapters.push(new wikia_video_WikiaVideo(bidders.wikiaVideo));
	}

	customAdapters.forEach(function (adapter) {
		adapters_registry_adapters.push(adapter);

		window.pbjs.que.push(function () {
			window.pbjs.registerBidAdapter(adapter.create, adapter.bidderName);
		});
	});
}

function getPriorities() {
	var priorities = {};

	adapters_registry_adapters.forEach(function (adapter) {
		priorities[adapter.bidderName] = adapter.priority || 1;
	});

	return priorities;
}

function getAdapters(config) {
	if (adapters_registry_adapters.length === 0 && config) {
		setupAdapters(config);
		registerAliases();
	}

	return adapters_registry_adapters;
}
// CONCATENATED MODULE: ./src/bidders/prebid/price-helper.js



function isValidPrice(bid) {
	return bid.getStatusCode && bid.getStatusCode() === prebid_Prebid.validResponseStatusCode;
}

function getPrebidBestPrice(slotName) {
	var bestPrices = {};

	if (window.pbjs && window.pbjs.getBidResponsesForAdUnitCode) {
		var slotBids = window.pbjs.getBidResponsesForAdUnitCode(slotName).bids || [];

		getAdapters().forEach(function (adapter) {
			bestPrices[adapter.bidderName] = '';
		});

		slotBids.forEach(function (bid) {
			if (isValidPrice(bid)) {
				var bidderCode = bid.bidderCode,
				    cpm = bid.cpm;

				var cpmPrice = transformPriceFromCpm(cpm);

				bestPrices[bidderCode] = Math.max(bestPrices[bidderCode] || 0, parseFloat(cpmPrice)).toFixed(2).toString();
			}
		});
	}

	return bestPrices;
}

function transformPriceFromCpm(cpm) {
	var maxCpm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;

	var defaultCpm = 20;

	if (maxCpm < defaultCpm) {
		maxCpm = defaultCpm;
	}

	var result = Math.floor(maxCpm).toFixed(2);

	if (cpm === 0) {
		result = '0.00';
	} else if (cpm < 0.05) {
		result = '0.01';
	} else if (cpm < 5.00) {
		result = (Math.floor(cpm * 20) / 20).toFixed(2);
	} else if (cpm < 10.00) {
		result = (Math.floor(cpm * 10) / 10).toFixed(2);
	} else if (cpm < 20.00) {
		result = (Math.floor(cpm * 2) / 2).toFixed(2);
	} else if (cpm < maxCpm) {
		result = Math.floor(cpm).toFixed(2);
	}

	return result;
}
// CONCATENATED MODULE: ./src/bidders/prebid/prebid-settings.js


function getSettings() {
	return {
		standard: {
			alwaysUseBid: false,
			adserverTargeting: [{
				key: 'hb_bidder',
				val: function val(_ref) {
					var bidderCode = _ref.bidderCode;
					return bidderCode;
				}
			}, {
				key: 'hb_adid',
				val: function val(_ref2) {
					var adId = _ref2.adId;
					return adId;
				}
			}, {
				key: 'hb_pb',
				val: function val(bidResponse) {
					return transformPriceFromCpm(bidResponse.cpm);
				}
			}, {
				key: 'hb_size',
				val: function val(_ref3) {
					var size = _ref3.size;
					return size;
				}
			}]
		}
	};
}
// CONCATENATED MODULE: ./src/bidders/prebid/index.js












var prebid_Prebid = function (_BaseBidder) {
	inherits_default()(Prebid, _BaseBidder);

	function Prebid() {
		var _ref;

		classCallCheck_default()(this, Prebid);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		var _this = possibleConstructorReturn_default()(this, (_ref = Prebid.__proto__ || get_prototype_of_default()(Prebid)).call.apply(_ref, [this].concat(args)));

		_this.logGroup = 'prebid-bidder';
		_this.name = 'prebid';
		_this.adUnits = setupAdUnits(_this.bidderConfig);
		_this.isCMPEnabled = false;
		_this.prebidConfig = {
			debug: query_string_queryString.get('pbjs_debug') === '1',
			enableSendAllBids: true,
			bidderSequence: 'random',
			bidderTimeout: _this.timeout,
			userSync: {
				iframeEnabled: true,
				enabledBidders: [],
				syncDelay: 6000
			}
		};

		if (_this.isCMPEnabled) {
			_this.prebidConfig.consentManagement = {
				cmpApi: 'iab',
				timeout: _this.timeout,
				allowAuctionWithoutConsent: false
			};
		}

		window.pbjs = window.pbjs || {};
		window.pbjs.que = window.pbjs.que || [];
		window.pbjs.que.push(function () {
			window.pbjs.setConfig(_this.prebidConfig);
		});
		return _this;
	}

	createClass_default()(Prebid, [{
		key: 'callBids',
		value: function callBids(bidsBackHandler) {
			var _this2 = this;

			if (this.adUnits.length > 0) {
				window.pbjs.que.push(function () {
					window.pbjs.bidderSettings = getSettings();
				});

				window.pbjs.que.push(function () {
					_this2.removeAdUnits();

					window.pbjs.requestBids({
						adUnits: _this2.adUnits,
						bidsBackHandler: bidsBackHandler
					});
				});
			}
		}
	}, {
		key: 'removeAdUnits',
		value: function removeAdUnits() {
			(window.pbjs.adUnits || []).forEach(function (adUnit) {
				window.pbjs.removeAdUnit(adUnit.code);
			});
		}
	}, {
		key: 'getBestPrice',
		value: function getBestPrice(slotName) {
			return getPrebidBestPrice(slotName);
		}
	}, {
		key: 'getTargetingParams',
		value: function getTargetingParams(slotName) {
			var slotParams = {};

			if (window.pbjs && typeof window.pbjs.getBidResponsesForAdUnitCode === 'function') {
				var bids = window.pbjs.getBidResponsesForAdUnitCode(slotName).bids || [];

				if (bids.length) {
					var bidParams = null;
					var priorities = getPriorities();

					bids.forEach(function (param) {
						if (!bidParams) {
							bidParams = param;
						} else if (bidParams.cpm === param.cpm) {
							if (priorities[bidParams.bidder] === priorities[param.bidder]) {
								bidParams = bidParams.timeToRespond > param.timeToRespond ? param : bidParams;
							} else {
								bidParams = priorities[bidParams.bidder] < priorities[param.bidder] ? param : bidParams;
							}
						} else {
							bidParams = bidParams.cpm < param.cpm ? param : bidParams;
						}
					});

					slotParams = bidParams.adserverTargeting;
				}
			}

			return slotParams || {};
		}
	}, {
		key: 'isSupported',
		value: function isSupported(slotName) {
			return this.adUnits && this.adUnits.some(function (adUnit) {
				return adUnit.code === slotName;
			});
		}
	}]);

	return Prebid;
}(base_bidder_BaseBidder);
prebid_Prebid.validResponseStatusCode = 1;
prebid_Prebid.errorResponseStatusCode = 2;
// CONCATENATED MODULE: ./src/bidders/index.js

// import A9 from './a9/index';


__webpack_require__(23);

var bidIndex = {
	a9: {
		pos: 2,
		char: '9'
	},
	prebid: {
		pos: 4,
		char: 'P'
	}
};

var bidderMarker = ['x', 'x', 'x', 'x', 'x'];
var biddersRegistry = {};

function getBidParameters(slotName) {
	var floorPrice = 0;
	var slotParams = {};

	if (biddersRegistry.prebid && biddersRegistry.prebid.wasCalled()) {
		var prebidPrices = biddersRegistry.prebid.getSlotBestPrice(slotName);

		floorPrice = Math.max.apply(null, keys_default()(prebidPrices).filter(function (key) {
			return !isNaN(parseFloat(prebidPrices[key])) && parseFloat(prebidPrices[key]) > 0;
		}).map(function (key) {
			return parseFloat(prebidPrices[key]);
		}));
	}

	keys_default()(biddersRegistry).forEach(function (bidderName) {
		var bidder = biddersRegistry[bidderName];

		if (bidder && bidder.wasCalled()) {
			var params = bidder.getSlotTargetingParams(slotName, floorPrice);

			keys_default()(params).forEach(function (key) {
				slotParams[key] = params[key];
			});

			if (bidder.hasResponse()) {
				bidderMarker = updateBidderMarker(bidder.getName(), bidderMarker);
			}
		}
	});

	slotParams.bid = bidderMarker.join('');

	return slotParams;
}

function getCurrentSlotPrices(slotName) {
	var slotPrices = {};

	keys_default()(biddersRegistry).forEach(function (bidder) {
		bidder = biddersRegistry[bidder];

		if (bidder && bidder.isSlotSupported(slotName)) {
			var priceFromBidder = bidder.getSlotBestPrice(slotName);

			keys_default()(priceFromBidder).forEach(function (bidderName) {
				slotPrices[bidderName] = priceFromBidder[bidderName];
			});
		}
	});

	return slotPrices;
}
function requestBids(_ref) {
	var config = _ref.config,
	    resetListener = _ref.resetListener,
	    timeout = _ref.timeout;

	if (config.prebid) {
		biddersRegistry.prebid = new prebid_Prebid(config.prebid, resetListener, timeout);
		biddersRegistry.prebid.call();
	}

	//if (bidders.a9) {
	//	biddersRegistry.a9 = new A9(bidders.a9, resetListener, timeout);
	//}
}

function updateBidderMarker(bidderName, bidMarker) {
	if (!bidIndex[bidderName]) {
		return bidMarker;
	}

	var bidder = bidIndex[bidderName];
	bidMarker[bidder.pos] = bidder.char;

	return bidMarker;
}

var bidders_bidders = {
	requestBids: requestBids,
	getBidParameters: getBidParameters
};
// CONCATENATED MODULE: ./src/providers/gpt-provider.js





var _dec, _dec2, _dec3, _dec4, _dec5, _desc, _value, _class;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
	var desc = {};
	Object['ke' + 'ys'](descriptor).forEach(function (key) {
		desc[key] = descriptor[key];
	});
	desc.enumerable = !!desc.enumerable;
	desc.configurable = !!desc.configurable;

	if ('value' in desc || desc.initializer) {
		desc.writable = true;
	}

	desc = decorators.slice().reverse().reduce(function (desc, decorator) {
		return decorator(target, property, desc) || desc;
	}, desc);

	if (context && desc.initializer !== void 0) {
		desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
		desc.initializer = undefined;
	}

	if (desc.initializer === void 0) {
		Object['define' + 'Property'](target, property, desc);
		desc = null;
	}

	return desc;
}









var gpt_provider_logGroup = 'gpt-provider';

var gptLazyMethod = function gptLazyMethod(method) {
	return function decoratedGptLazyMethod() {
		var _this = this;

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return window.googletag.cmd.push(function () {
			return method.apply(_this, args);
		});
	};
};

var definedSlots = [];
var initialized = false;

function configure() {
	var tag = window.googletag.pubads();

	tag.enableSingleRequest();
	tag.disableInitialLoad();
	tag.addEventListener('slotRenderEnded', function (event) {
		var id = event.slot.getSlotElementId();
		var slot = slotService.get(id);

		// IE doesn't allow us to inspect GPT iframe at this point.
		// Let's launch our callback in a setTimeout instead.
		flow_control_defer(function () {
			return slotListener.emitRenderEnded(event, slot);
		});
	});

	tag.addEventListener('impressionViewable', function (event) {
		var id = event.slot.getSlotElementId(),
		    slot = slotService.get(id);

		slotListener.emitImpressionViewable(event, slot);
	});
	window.googletag.enableServices();
}

var gpt_provider_GptProvider = (_dec = Object(external_core_decorators_["decorate"])(gptLazyMethod), _dec2 = Object(external_core_decorators_["decorate"])(gptLazyMethod), _dec3 = Object(external_core_decorators_["decorate"])(gptLazyMethod), _dec4 = Object(external_core_decorators_["decorate"])(gptLazyMethod), _dec5 = Object(external_core_decorators_["decorate"])(gptLazyMethod), (_class = function () {
	function GptProvider() {
		classCallCheck_default()(this, GptProvider);

		window.googletag = window.googletag || {};
		window.googletag.cmd = window.googletag.cmd || [];

		this.init();
	}

	createClass_default()(GptProvider, [{
		key: 'init',
		value: function init() {
			var _this2 = this;

			if (initialized) {
				return;
			}

			setupGptTargeting();
			configure();
			this.setupNonPersonalizedAds();
			events.on(events.PAGE_CHANGE_EVENT, function () {
				var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

				if (!options.doNotDestroyGptSlots) {
					_this2.destroySlots();
				}
			});
			events.on(events.PAGE_RENDER_EVENT, function () {
				return _this2.updateCorrelator();
			});
			initialized = true;
		}
	}, {
		key: 'setupNonPersonalizedAds',
		value: function setupNonPersonalizedAds() {
			var tag = window.googletag.pubads();

			tag.setRequestNonPersonalizedAds(trackingOptIn.isOptedIn() ? 0 : 1);
		}
	}, {
		key: 'fillIn',
		value: function fillIn(adSlot) {
			var targeting = this.parseTargetingParams(adSlot.getTargeting());
			var sizeMap = new gpt_size_map_GptSizeMap(adSlot.getSizes());

			var gptSlot = window.googletag.defineSlot(adSlot.getAdUnit(), adSlot.getDefaultSizes(), adSlot.getSlotName()).addService(window.googletag.pubads()).setCollapseEmptyDiv(true).defineSizeMapping(sizeMap.build());

			this.applyTargetingParams(gptSlot, targeting);
			slotDataParamsUpdater.updateOnCreate(adSlot, targeting);

			var bidderTargeting = bidders_bidders.getBidParameters(adSlot.getSlotName());
			this.applyTargetingParams(gptSlot, bidderTargeting);

			window.googletag.display(adSlot.getSlotName());
			definedSlots.push(gptSlot);

			if (!adSlot.isAboveTheFold()) {
				this.flush();
			}

			logger(gpt_provider_logGroup, adSlot.getSlotName(), 'slot added');
		}
	}, {
		key: 'applyTargetingParams',
		value: function applyTargetingParams(gptSlot, targeting) {
			keys_default()(targeting).forEach(function (key) {
				return gptSlot.setTargeting(key, targeting[key]);
			});
		}
	}, {
		key: 'parseTargetingParams',
		value: function parseTargetingParams(targeting) {
			var result = {};

			keys_default()(targeting).forEach(function (key) {
				var value = targeting[key];

				if (typeof value === 'function') {
					value = value();
				}
				result[key] = value;
			});

			return result;
		}
	}, {
		key: 'updateCorrelator',
		value: function updateCorrelator() {
			window.googletag.pubads().updateCorrelator();
		}
	}, {
		key: 'flush',
		value: function flush() {
			if (definedSlots.length) {
				window.googletag.pubads().refresh(definedSlots);
				definedSlots = [];
			}
		}
	}, {
		key: 'destroyGptSlots',
		value: function destroyGptSlots(gptSlots) {
			logger(gpt_provider_logGroup, 'destroySlots', gptSlots);

			gptSlots.forEach(function (gptSlot) {
				var adSlot = slotService.get(gptSlot.getSlotElementId());

				slotService.remove(adSlot);
			});

			var success = window.googletag.destroySlots(gptSlots);

			if (!success) {
				logger(gpt_provider_logGroup, 'destroySlots', gptSlots, 'failed');
			}
		}
	}, {
		key: 'destroySlots',
		value: function destroySlots(slotNames) {
			var allSlots = window.googletag.pubads().getSlots();
			var slotsToDestroy = slotNames && slotNames.length ? allSlots.filter(function (slot) {
				var slotId = slot.getSlotElementId();

				if (!slotId) {
					logger(gpt_provider_logGroup, 'destroySlots', 'slot doesn\'t return element id', slot);
				} else if (slotNames.indexOf(slotId) > -1) {
					return true;
				}

				return false;
			}) : allSlots;

			if (slotsToDestroy.length) {
				this.destroyGptSlots(slotsToDestroy);
			} else {
				logger(gpt_provider_logGroup, 'destroySlots', 'no slots returned to destroy', allSlots, slotNames);
			}
		}
	}]);

	return GptProvider;
}(), (_applyDecoratedDescriptor(_class.prototype, 'init', [_dec], get_own_property_descriptor_default()(_class.prototype, 'init'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fillIn', [_dec2], get_own_property_descriptor_default()(_class.prototype, 'fillIn'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'updateCorrelator', [_dec3], get_own_property_descriptor_default()(_class.prototype, 'updateCorrelator'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'flush', [_dec4], get_own_property_descriptor_default()(_class.prototype, 'flush'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'destroyGptSlots', [_dec5], get_own_property_descriptor_default()(_class.prototype, 'destroyGptSlots'), _class.prototype)), _class));
// CONCATENATED MODULE: ./src/providers/index.js



// CONCATENATED MODULE: ./src/services/slot-tweaker.js








var slot_tweaker_logGroup = 'slot-tweaker';

var slot_tweaker_SlotTweaker = function () {
	function SlotTweaker() {
		classCallCheck_default()(this, SlotTweaker);
	}

	createClass_default()(SlotTweaker, [{
		key: 'forceRepaint',
		value: function forceRepaint(domElement) {
			return domElement.offsetWidth;
		}
	}, {
		key: 'getContainer',
		value: function getContainer(adSlot) {
			var container = document.getElementById(adSlot.getSlotName());

			if (!container) {
				logger(slot_tweaker_logGroup, 'cannot find container', adSlot.getSlotName());
			}

			return container;
		}
	}, {
		key: 'hide',
		value: function hide(adSlot) {
			var container = this.getContainer(adSlot);

			if (container) {
				logger(slot_tweaker_logGroup, 'hide', adSlot.getSlotName());
				container.classList.add('hide');
			}
		}
	}, {
		key: 'show',
		value: function show(adSlot) {
			var container = this.getContainer(adSlot);

			if (container) {
				logger(slot_tweaker_logGroup, 'show', adSlot.getSlotName());
				container.classList.remove('hide');
			}
		}
	}, {
		key: 'collapse',
		value: function collapse(adSlot) {
			var container = this.getContainer(adSlot);

			container.style.maxHeight = container.scrollHeight + 'px';
			this.forceRepaint(container);
			container.classList.add('slot-animation');
			container.style.maxHeight = '0';
		}
	}, {
		key: 'expand',
		value: function expand(adSlot) {
			var container = this.getContainer(adSlot);

			container.style.maxHeight = container.offsetHeight + 'px';
			container.classList.remove('hide');
			container.classList.add('slot-animation');
			container.style.maxHeight = container.scrollHeight + 'px';
		}
	}, {
		key: 'makeResponsive',
		value: function makeResponsive(adSlot) {
			var aspectRatio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var slotContainer = this.getContainer(adSlot);

			slotContainer.classList.add('slot-responsive');

			return this.onReady(adSlot).then(function (iframe) {
				var container = iframe.parentElement;
				if (!aspectRatio) {
					var height = iframe.contentWindow.document.body.scrollHeight,
					    width = iframe.contentWindow.document.body.scrollWidth;

					aspectRatio = width / height;
				}

				logger(slot_tweaker_logGroup, 'make responsive', adSlot.getSlotName());
				container.style.paddingBottom = 100 / aspectRatio + '%';
				return iframe;
			});
		}
	}, {
		key: 'onReady',
		value: function onReady(adSlot) {
			var container = this.getContainer(adSlot),
			    iframe = container.querySelector('div[id*="_container_"] iframe');

			return new promise_default.a(function (resolve, reject) {
				if (!iframe) {
					reject(new Error('Cannot find iframe element'));
				}

				if (iframe.contentWindow.document.readyState === 'complete') {
					resolve(iframe);
				} else {
					iframe.addEventListener('load', function () {
						return resolve(iframe);
					});
				}
			});
		}
	}, {
		key: 'registerMessageListener',
		value: function registerMessageListener() {
			var _this = this;

			messageBus.register({
				keys: ['action', 'slotName'],
				infinite: true
			}, function (data) {
				if (!data.slotName) {
					logger(slot_tweaker_logGroup, 'Missing slot name');
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
						logger(slot_tweaker_logGroup, 'Unknown action', data.action);
				}
			});
		}
	}, {
		key: 'setDataParam',
		value: function setDataParam(adSlot, attrName, data) {
			var container = this.getContainer(adSlot);

			container.dataset[attrName] = typeof data === 'string' ? data : stringify_default()(data);
		}
	}]);

	return SlotTweaker;
}();

var slotTweaker = new slot_tweaker_SlotTweaker();
// CONCATENATED MODULE: ./src/services/slot-data-params-updater.js






var slot_data_params_updater_SlotDataParamsUpdater = function () {
	function SlotDataParamsUpdater() {
		classCallCheck_default()(this, SlotDataParamsUpdater);
	}

	createClass_default()(SlotDataParamsUpdater, [{
		key: 'updateOnCreate',
		value: function updateOnCreate(adSlot, targeting) {
			slotTweaker.setDataParam(adSlot, 'gptPageParams', context.get('targeting'));
			slotTweaker.setDataParam(adSlot, 'gptSlotParams', targeting);
			slotTweaker.setDataParam(adSlot, 'sizes', new gpt_size_map_GptSizeMap(adSlot.getSizes()).toString());
		}
	}, {
		key: 'updateOnRenderEnd',
		value: function updateOnRenderEnd(adSlot, event) {
			if (event) {
				slotTweaker.setDataParam(adSlot, 'gptLineItemId', event.lineItemId);
				slotTweaker.setDataParam(adSlot, 'gptCreativeId', event.creativeId);
				slotTweaker.setDataParam(adSlot, 'gptCreativeSize', event.size);
			}
		}
	}]);

	return SlotDataParamsUpdater;
}();

var slotDataParamsUpdater = new slot_data_params_updater_SlotDataParamsUpdater();
// CONCATENATED MODULE: ./src/services/slot-repeater.js









var slot_repeater_logGroup = 'slot-repeater';

function findNextSiblingForSlot(previousSlotElement, elements, config) {
	var minimalPosition = getTopOffset(previousSlotElement) + previousSlotElement.offsetHeight + getViewportHeight();

	config.previousSiblingIndex = config.previousSiblingIndex || 0;
	for (; config.previousSiblingIndex < elements.length; config.previousSiblingIndex += 1) {
		var elementPosition = getTopOffset(elements[config.previousSiblingIndex]);

		if (minimalPosition <= elementPosition) {
			return elements[config.previousSiblingIndex];
		}
	}

	return null;
}

function insertNewSlotContainer(previousSlotElement, slotName, config, nextSibling) {
	var container = document.createElement('div');
	var additionalClasses = config.additionalClasses || '';

	container.id = slotName;
	container.className = previousSlotElement.className + ' ' + additionalClasses;

	nextSibling.parentNode.insertBefore(container, nextSibling);
}

function insertFakePlaceholderAfterLastSelector(slotName, elements) {
	var lastElement = elements[elements.length - 1];
	var placeholder = document.createElement('div');

	placeholder.id = slotName;
	placeholder.className = 'hide';

	lastElement.parentNode.insertBefore(placeholder, lastElement.nextSibling);
}

function buildString(pattern, definition) {
	return stringBuilder.build(pattern, {
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
		logger(slot_repeater_logGroup, 'Limit reached for ' + slotName);

		return false;
	}

	context.set('slots.' + slotName, newSlotDefinition);
	if (repeatConfig.updateProperties) {
		keys_default()(repeatConfig.updateProperties).forEach(function (key) {
			var value = buildString(repeatConfig.updateProperties[key], newSlotDefinition);

			context.set('slots.' + slotName + '.' + key, value);
		});
	}

	var elements = document.querySelectorAll(repeatConfig.insertBeforeSelector);
	var nextSibling = findNextSiblingForSlot(adSlot.getElement(), elements, repeatConfig);

	if (nextSibling) {
		insertNewSlotContainer(adSlot.getElement(), slotName, repeatConfig, nextSibling);
		context.push('events.pushOnScroll.ids', slotName);

		logger(slot_repeater_logGroup, 'Repeat slot', slotName);

		return true;
	}

	insertFakePlaceholderAfterLastSelector(slotName, elements, repeatConfig);
	slotService.disable(slotName, 'viewport-conflict');
	context.push('events.pushOnScroll.ids', slotName);

	logger(slot_repeater_logGroup, 'There is not enough space for ' + slotName);

	return false;
}

var slot_repeater_SlotRepeater = function () {
	function SlotRepeater() {
		classCallCheck_default()(this, SlotRepeater);
	}

	createClass_default()(SlotRepeater, [{
		key: 'init',
		value: function init() {
			if (context.get('options.slotRepeater')) {
				context.push('listeners.slot', {
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
// CONCATENATED MODULE: ./src/services/tracking-opt-in.js



var isOptInByQueryParam = query_string_queryString.get('tracking-opt-in-status') === 'true';

function isOptedIn() {
	return isOptInByQueryParam || context.get('options.trackingOptIn');
}

var trackingOptIn = {
	isOptedIn: isOptedIn
};
// CONCATENATED MODULE: ./src/services/index.js












// CONCATENATED MODULE: ./src/utils/string-builder.js




var string_builder_StringBuilder = function () {
	function StringBuilder() {
		classCallCheck_default()(this, StringBuilder);
	}

	createClass_default()(StringBuilder, [{
		key: 'build',
		value: function build(string) {
			var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			var matches = string.match(/{(.+?)}/g);

			if (matches) {
				matches.forEach(function (match) {
					var key = match.replace('{', '').replace('}', ''),
					    fallbackValue = context.get(key),
					    keySegments = key.split('.');

					var index = void 0,
					    segment = void 0,
					    value = parameters[keySegments[0]];

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

var stringBuilder = new string_builder_StringBuilder();
// CONCATENATED MODULE: ./src/utils/try-property.js
function whichProperty(obj) {
	var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

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
// CONCATENATED MODULE: ./src/utils/viewport-observer.js



function updateInViewport(listener) {
	var newInViewport = isInViewport(listener.element);

	if (newInViewport !== listener.inViewport) {
		listener.callback(newInViewport);
		listener.inViewport = newInViewport;
	}
}

function viewport_observer_addListener(element, callback) {
	var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var listener = {
		element: element,
		callback: callback,
		offsetTop: params.offsetTop || 0,
		offsetBottom: params.offsetBottom || 0,
		inViewport: false
	},
	    updateCallback = function updateCallback() {
		updateInViewport(listener);
	};

	listener.id = scrollListener.addCallback(updateCallback);
	updateCallback();

	return listener.id;
}

function removeListener(listenerId) {
	scrollListener.removeCallback(listenerId);
}

var viewportObserver = {
	addListener: viewport_observer_addListener,
	removeListener: removeListener
};
// CONCATENATED MODULE: ./src/utils/index.js











// EXTERNAL MODULE: external "babel-runtime/core-js/map"
var map_ = __webpack_require__(18);
var map_default = /*#__PURE__*/__webpack_require__.n(map_);

// CONCATENATED MODULE: ./src/templates/floating-ad.js





var floating_ad_FloatingAd = function () {
	createClass_default()(FloatingAd, null, [{
		key: 'getName',
		value: function getName() {
			return 'floating-ad';
		}
	}]);

	function FloatingAd(adSlot) {
		classCallCheck_default()(this, FloatingAd);

		this.adSlot = adSlot;
	}

	createClass_default()(FloatingAd, [{
		key: 'init',
		value: function init() {
			var slotNode = document.getElementById(this.adSlot.getSlotName());

			var container = void 0,
			    containerOffset = void 0,
			    end = void 0,
			    slotHeight = void 0,
			    space = void 0,
			    start = 0;

			if (!slotNode || !slotNode.classList.contains('floating')) {
				return;
			}

			scrollListener.addCallback(function () {
				var scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

				container = slotNode.parentNode;
				containerOffset = getTopOffset(container);
				slotHeight = slotNode.offsetHeight;
				end = containerOffset + container.offsetHeight - slotHeight;

				start = containerOffset;
				if (slotNode.previousElementSibling) {
					start = getTopOffset(slotNode.previousElementSibling) + slotNode.previousElementSibling.offsetHeight;
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
// CONCATENATED MODULE: ./src/templates/index.js

// CONCATENATED MODULE: ./src/ad-engine.js











var ad_engine_logGroup = 'ad-engine';

function fillInUsingProvider(ad, provider) {
	var adSlot = new ad_slot_AdSlot(ad);

	slotService.add(adSlot);
	btfBlockerService.push(adSlot, provider.fillIn.bind(provider));
}

function getPromises() {
	return (context.get('delayModules') || []).filter(function (module) {
		return module.isEnabled();
	}).map(function (module) {
		logger(ad_engine_logGroup, 'Register delay module', module.getName());

		return module.getPromise();
	}) || [];
}

var ad_engine_AdEngine = function () {
	function AdEngine() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

		classCallCheck_default()(this, AdEngine);

		context.extend(config);
		this.adStack = context.get('state.adStack');
		this.providers = new map_default.a();

		window.ads = window.ads || {};
		window.ads.runtime = window.ads.runtime || {};

		templateService.register(floating_ad_FloatingAd);
	}

	createClass_default()(AdEngine, [{
		key: 'setupProviders',
		value: function setupProviders() {
			var _this = this;

			this.providers.set('gpt', new gpt_provider_GptProvider());

			makeLazyQueue(this.adStack, function (ad) {
				var gpt = _this.providers.get('gpt');

				fillInUsingProvider(ad, gpt);

				if (_this.adStack.length === 0) {
					gpt.flush();
				}
			});
		}
	}, {
		key: 'runAdQueue',
		value: function runAdQueue() {
			var _this2 = this;

			var started = false,
			    timeout = null;

			var promises = getPromises(),
			    startAdQueue = function startAdQueue() {
				if (!started) {
					started = true;
					clearTimeout(timeout);
					_this2.adStack.start();
				}
			},
			    maxTimeout = context.get('options.maxDelayTimeout');

			logger(ad_engine_logGroup, 'Delay by ' + promises.length + ' modules (' + maxTimeout + 'ms timeout)');

			if (promises.length > 0) {
				promise_default.a.all(promises).then(function () {
					logger(ad_engine_logGroup, 'startAdQueue', 'All modules ready');
					startAdQueue();
				});
				timeout = setTimeout(function () {
					logger(ad_engine_logGroup, 'startAdQueue', 'Timeout reached');
					startAdQueue();
				}, maxTimeout);
			} else {
				startAdQueue();
			}
		}
	}, {
		key: 'getProvider',
		value: function getProvider(name) {
			return this.providers.get(name);
		}
	}, {
		key: 'init',
		value: function init() {
			var _this3 = this;

			alert('asssaa');
			this.setupProviders();
			btfBlockerService.init();

			registerCustomAdLoader(context.get('options.customAdLoader.globalMethodName'));
			messageBus.init();
			slotTweaker.registerMessageListener();
			this.runAdQueue();

			scrollListener.init();
			slotRepeater.init();

			if (context.get('events.pushOnScroll')) {
				var pushOnScrollQueue = context.get('events.pushOnScroll.ids');

				makeLazyQueue(pushOnScrollQueue, function (id) {
					scrollListener.addSlot(_this3.adStack, id, context.get('events.pushOnScroll.threshold'));
				});
				pushOnScrollQueue.start();
			}
		}
	}]);

	return AdEngine;
}();
// CONCATENATED MODULE: ./src/index.js
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "AdEngine", function() { return ad_engine_AdEngine; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "bidders", function() { return bidders_bidders; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "PorvataListener", function() { return porvata_listener_PorvataListener; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "scrollListener", function() { return scrollListener; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "slotListener", function() { return slotListener; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "AdSlot", function() { return ad_slot_AdSlot; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "gptLazyMethod", function() { return gptLazyMethod; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "GptProvider", function() { return gpt_provider_GptProvider; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "GptSizeMap", function() { return gpt_size_map_GptSizeMap; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "setupGptTargeting", function() { return setupGptTargeting; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "btfBlockerService", function() { return btfBlockerService; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "context", function() { return context; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "registerCustomAdLoader", function() { return registerCustomAdLoader; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "events", function() { return events; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "localCache", function() { return localCache; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "messageBus", function() { return messageBus; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "slotDataParamsUpdater", function() { return slotDataParamsUpdater; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "slotRepeater", function() { return slotRepeater; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "slotService", function() { return slotService; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "slotTweaker", function() { return slotTweaker; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "templateService", function() { return templateService; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "trackingOptIn", function() { return trackingOptIn; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "vastDebugger", function() { return vastDebugger; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "vastParser", function() { return vastParser; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "buildVastUrl", function() { return buildVastUrl; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "PorvataPlayer", function() { return porvata_PorvataPlayer; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Porvata", function() { return porvata_Porvata; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "VideoSettings", function() { return video_settings_VideoSettings; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "moatVideoTracker", function() { return moatVideoTracker; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "googleImaPlayerFactory", function() { return googleImaPlayerFactory; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "utils", function() { return utils_namespaceObject; });





var versionField = 'ads.adEngineVersion';

if (get_default()(window, versionField, null)) {
	window.console.warn('Multiple @wikia/ad-engine initializations. This may cause issues.');
}

set_default()(window, versionField, 'v12.0.2');
logger('ad-engine', 'v12.0.2');










/***/ }),
/* 23 */
/***/ (function(module, exports) {

/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["pbjsChunk"];
/******/ 	window["pbjsChunk"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/ 		if(executeModules) {
/******/ 			for(i=0; i < executeModules.length; i++) {
/******/ 				result = __webpack_require__(__webpack_require__.s = executeModules[i]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		136: 0
/******/ 	};
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
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 463);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getAdUnitSizes = getAdUnitSizes;
exports.parseSizesInput = parseSizesInput;
exports.parseGPTSingleSizeArray = parseGPTSingleSizeArray;
exports.uniques = uniques;
exports.flatten = flatten;
exports.getBidRequest = getBidRequest;
exports.getKeys = getKeys;
exports.getValue = getValue;
exports.getBidderCodes = getBidderCodes;
exports.isGptPubadsDefined = isGptPubadsDefined;
exports.getHighestCpm = getHighestCpm;
exports.shuffle = shuffle;
exports.adUnitsFilter = adUnitsFilter;
exports.isSrcdocSupported = isSrcdocSupported;
exports.deepClone = deepClone;
exports.inIframe = inIframe;
exports.isSafariBrowser = isSafariBrowser;
exports.replaceAuctionPrice = replaceAuctionPrice;
exports.timestamp = timestamp;
exports.checkCookieSupport = checkCookieSupport;
exports.cookiesAreEnabled = cookiesAreEnabled;
exports.delayExecution = delayExecution;
exports.groupBy = groupBy;
exports.deepAccess = deepAccess;
exports.createContentToExecuteExtScriptInFriendlyFrame = createContentToExecuteExtScriptInFriendlyFrame;
exports.getDefinedParams = getDefinedParams;
exports.isValidMediaTypes = isValidMediaTypes;
exports.getBidderRequest = getBidderRequest;
exports.getUserConfiguredParams = getUserConfiguredParams;
exports.getOrigin = getOrigin;
exports.getDNT = getDNT;
exports.isAdUnitCodeMatchingSlot = isAdUnitCodeMatchingSlot;
exports.isSlotMatchingAdUnitCode = isSlotMatchingAdUnitCode;
exports.unsupportedBidderMessage = unsupportedBidderMessage;
exports.deletePropertyFromObject = deletePropertyFromObject;
exports.removeRequestId = removeRequestId;
exports.isInteger = isInteger;
exports.convertCamelToUnderscore = convertCamelToUnderscore;

var _config = __webpack_require__(4);

var _justClone = __webpack_require__(62);

var _justClone2 = _interopRequireDefault(_justClone);

var _find = __webpack_require__(10);

var _find2 = _interopRequireDefault(_find);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

var _url = __webpack_require__(12);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CONSTANTS = __webpack_require__(2);

var _loggingChecked = false;

var t_Arr = 'Array';
var t_Str = 'String';
var t_Fn = 'Function';
var t_Numb = 'Number';
var t_Object = 'Object';
var toString = Object.prototype.toString;
var infoLogger = null;
try {
  infoLogger = console.info.bind(window.console);
} catch (e) {}

/*
 *   Substitutes into a string from a given map using the token
 *   Usage
 *   var str = 'text %%REPLACE%% this text with %%SOMETHING%%';
 *   var map = {};
 *   map['replace'] = 'it was subbed';
 *   map['something'] = 'something else';
 *   console.log(replaceTokenInString(str, map, '%%')); => "text it was subbed this text with something else"
 */
exports.replaceTokenInString = function (str, map, token) {
  this._each(map, function (value, key) {
    value = value === undefined ? '' : value;

    var keyString = token + key.toUpperCase() + token;
    var re = new RegExp(keyString, 'g');

    str = str.replace(re, value);
  });

  return str;
};

/* utility method to get incremental integer starting from 1 */
var getIncrementalInteger = function () {
  var count = 0;
  return function () {
    count++;
    return count;
  };
}();

function _getUniqueIdentifierStr() {
  return getIncrementalInteger() + Math.random().toString(16).substr(2);
}

// generate a random string (to be used as a dynamic JSONP callback)
exports.getUniqueIdentifierStr = _getUniqueIdentifierStr;

/**
 * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
 * where each x is replaced with a random hexadecimal digit from 0 to f,
 * and y is replaced with a random hexadecimal digit from 8 to b.
 * https://gist.github.com/jed/982883 via node-uuid
 */
exports.generateUUID = function generateUUID(placeholder) {
  return placeholder ? (placeholder ^ Math.random() * 16 >> placeholder / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateUUID);
};

exports.getBidIdParameter = function (key, paramsObj) {
  if (paramsObj && paramsObj[key]) {
    return paramsObj[key];
  }

  return '';
};

exports.tryAppendQueryString = function (existingUrl, key, value) {
  if (value) {
    return existingUrl += key + '=' + encodeURIComponent(value) + '&';
  }

  return existingUrl;
};

// parse a query string object passed in bid params
// bid params should be an object such as {key: "value", key1 : "value1"}
exports.parseQueryStringParameters = function (queryObj) {
  var result = '';
  for (var k in queryObj) {
    if (queryObj.hasOwnProperty(k)) {
      result += k + '=' + encodeURIComponent(queryObj[k]) + '&';
    }
  }

  return result;
};

// transform an AdServer targeting bids into a query string to send to the adserver
exports.transformAdServerTargetingObj = function (targeting) {
  // we expect to receive targeting for a single slot at a time
  if (targeting && Object.getOwnPropertyNames(targeting).length > 0) {
    return getKeys(targeting).map(function (key) {
      return key + '=' + encodeURIComponent(getValue(targeting, key));
    }).join('&');
  } else {
    return '';
  }
};

/**
 * Read an adUnit object and return the sizes used in an [[728, 90]] format (even if they had [728, 90] defined)
 * Preference is given to the `adUnit.mediaTypes.banner.sizes` object over the `adUnit.sizes`
 * @param {object} adUnit one adUnit object from the normal list of adUnits
 * @returns {array[array[number]]} array of arrays containing numeric sizes
 */
function getAdUnitSizes(adUnit) {
  if (!adUnit) {
    return;
  }

  var sizes = [];
  if (adUnit.mediaTypes && adUnit.mediaTypes.banner && Array.isArray(adUnit.mediaTypes.banner.sizes)) {
    var bannerSizes = adUnit.mediaTypes.banner.sizes;
    if (Array.isArray(bannerSizes[0])) {
      sizes = bannerSizes;
    } else {
      sizes.push(bannerSizes);
    }
  } else if (Array.isArray(adUnit.sizes)) {
    if (Array.isArray(adUnit.sizes[0])) {
      sizes = adUnit.sizes;
    } else {
      sizes.push(adUnit.sizes);
    }
  }
  return sizes;
}

/**
 * Parse a GPT-Style general size Array like `[[300, 250]]` or `"300x250,970x90"` into an array of sizes `["300x250"]` or '['300x250', '970x90']'
 * @param  {array[array|number]} sizeObj Input array or double array [300,250] or [[300,250], [728,90]]
 * @return {array[string]}  Array of strings like `["300x250"]` or `["300x250", "728x90"]`
 */
function parseSizesInput(sizeObj) {
  var parsedSizes = [];

  // if a string for now we can assume it is a single size, like "300x250"
  if (typeof sizeObj === 'string') {
    // multiple sizes will be comma-separated
    var sizes = sizeObj.split(',');

    // regular expression to match strigns like 300x250
    // start of line, at least 1 number, an "x" , then at least 1 number, and the then end of the line
    var sizeRegex = /^(\d)+x(\d)+$/i;
    if (sizes) {
      for (var curSizePos in sizes) {
        if (hasOwn(sizes, curSizePos) && sizes[curSizePos].match(sizeRegex)) {
          parsedSizes.push(sizes[curSizePos]);
        }
      }
    }
  } else if ((typeof sizeObj === 'undefined' ? 'undefined' : _typeof(sizeObj)) === 'object') {
    var sizeArrayLength = sizeObj.length;

    // don't process empty array
    if (sizeArrayLength > 0) {
      // if we are a 2 item array of 2 numbers, we must be a SingleSize array
      if (sizeArrayLength === 2 && typeof sizeObj[0] === 'number' && typeof sizeObj[1] === 'number') {
        parsedSizes.push(parseGPTSingleSizeArray(sizeObj));
      } else {
        // otherwise, we must be a MultiSize array
        for (var i = 0; i < sizeArrayLength; i++) {
          parsedSizes.push(parseGPTSingleSizeArray(sizeObj[i]));
        }
      }
    }
  }

  return parsedSizes;
};

// parse a GPT style sigle size array, (i.e [300,250])
// into an AppNexus style string, (i.e. 300x250)
function parseGPTSingleSizeArray(singleSize) {
  // if we aren't exactly 2 items in this array, it is invalid
  if (exports.isArray(singleSize) && singleSize.length === 2 && !isNaN(singleSize[0]) && !isNaN(singleSize[1])) {
    return singleSize[0] + 'x' + singleSize[1];
  }
};

exports.getTopWindowLocation = function () {
  if (exports.inIframe()) {
    var loc = void 0;
    try {
      loc = exports.getAncestorOrigins() || exports.getTopFrameReferrer();
    } catch (e) {
      logInfo('could not obtain top window location', e);
    }
    if (loc) return (0, _url.parse)(loc, { 'decodeSearchAsString': true });
  }
  return exports.getWindowLocation();
};

exports.getTopFrameReferrer = function () {
  try {
    // force an exception in x-domain environments. #1509
    window.top.location.toString();
    var referrerLoc = '';
    var currentWindow = void 0;
    do {
      currentWindow = currentWindow ? currentWindow.parent : window;
      if (currentWindow.document && currentWindow.document.referrer) {
        referrerLoc = currentWindow.document.referrer;
      }
    } while (currentWindow !== window.top);
    return referrerLoc;
  } catch (e) {
    return window.document.referrer;
  }
};

exports.getAncestorOrigins = function () {
  if (window.document.location && window.document.location.ancestorOrigins && window.document.location.ancestorOrigins.length >= 1) {
    return window.document.location.ancestorOrigins[window.document.location.ancestorOrigins.length - 1];
  }
};

exports.getWindowTop = function () {
  return window.top;
};

exports.getWindowSelf = function () {
  return window.self;
};

exports.getWindowLocation = function () {
  return window.location;
};

exports.getTopWindowUrl = function () {
  var href = void 0;
  try {
    href = this.getTopWindowLocation().href;
  } catch (e) {
    href = '';
  }

  return href;
};

exports.getTopWindowReferrer = function () {
  try {
    return window.top.document.referrer;
  } catch (e) {
    return document.referrer;
  }
};

exports.logWarn = function (msg) {
  if (debugTurnedOn() && console.warn) {
    console.warn('WARNING: ' + msg);
  }
};

exports.logInfo = function (msg, args) {
  if (debugTurnedOn() && hasConsoleLogger()) {
    if (infoLogger) {
      if (!args || args.length === 0) {
        args = '';
      }

      infoLogger('INFO: ' + msg + (args === '' ? '' : ' : params : '), args);
    }
  }
};

exports.logMessage = function (msg) {
  if (debugTurnedOn() && hasConsoleLogger()) {
    console.log('MESSAGE: ' + msg);
  }
};

function hasConsoleLogger() {
  return window.console && window.console.log;
}

function hasConsoleError() {
  return window.console && window.console.error;
}

exports.hasConsoleLogger = hasConsoleLogger;

var debugTurnedOn = function debugTurnedOn() {
  if (_config.config.getConfig('debug') === false && _loggingChecked === false) {
    var debug = getParameterByName(CONSTANTS.DEBUG_MODE).toUpperCase() === 'TRUE';
    _config.config.setConfig({ debug: debug });
    _loggingChecked = true;
  }

  return !!_config.config.getConfig('debug');
};

exports.debugTurnedOn = debugTurnedOn;

/**
 * Wrapper to console.error. Takes N arguments to log the same as console.error.
 */
exports.logError = function () {
  if (debugTurnedOn() && hasConsoleError()) {
    console.error.apply(console, arguments);
  }
};

exports.createInvisibleIframe = function _createInvisibleIframe() {
  var f = document.createElement('iframe');
  f.id = _getUniqueIdentifierStr();
  f.height = 0;
  f.width = 0;
  f.border = '0px';
  f.hspace = '0';
  f.vspace = '0';
  f.marginWidth = '0';
  f.marginHeight = '0';
  f.style.border = '0';
  f.scrolling = 'no';
  f.frameBorder = '0';
  f.src = 'about:blank';
  f.style.display = 'none';
  return f;
};

/*
 *   Check if a given parameter name exists in query string
 *   and if it does return the value
 */
var getParameterByName = function getParameterByName(name) {
  var regexS = '[\\?&]' + name + '=([^&#]*)';
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if (results === null) {
    return '';
  }

  return decodeURIComponent(results[1].replace(/\+/g, ' '));
};

exports.getParameterByName = getParameterByName;

/**
 * This function validates paramaters.
 * @param  {object[string]} paramObj          [description]
 * @param  {string[]} requiredParamsArr [description]
 * @return {bool}                   Bool if paramaters are valid
 */
exports.hasValidBidRequest = function (paramObj, requiredParamsArr, adapter) {
  var found = false;

  function findParam(value, key) {
    if (key === requiredParamsArr[i]) {
      found = true;
    }
  }

  for (var i = 0; i < requiredParamsArr.length; i++) {
    found = false;

    this._each(paramObj, findParam);

    if (!found) {
      this.logError('Params are missing for bid request. One of these required paramaters are missing: ' + requiredParamsArr, adapter);
      return false;
    }
  }

  return true;
};

// Handle addEventListener gracefully in older browsers
exports.addEventHandler = function (element, event, func) {
  if (element.addEventListener) {
    element.addEventListener(event, func, true);
  } else if (element.attachEvent) {
    element.attachEvent('on' + event, func);
  }
};
/**
 * Return if the object is of the
 * given type.
 * @param {*} object to test
 * @param {String} _t type string (e.g., Array)
 * @return {Boolean} if object is of type _t
 */
exports.isA = function (object, _t) {
  return toString.call(object) === '[object ' + _t + ']';
};

exports.isFn = function (object) {
  return this.isA(object, t_Fn);
};

exports.isStr = function (object) {
  return this.isA(object, t_Str);
};

exports.isArray = function (object) {
  return this.isA(object, t_Arr);
};

exports.isNumber = function (object) {
  return this.isA(object, t_Numb);
};

exports.isPlainObject = function (object) {
  return this.isA(object, t_Object);
};

/**
 * Return if the object is "empty";
 * this includes falsey, no keys, or no items at indices
 * @param {*} object object to test
 * @return {Boolean} if object is empty
 */
exports.isEmpty = function (object) {
  if (!object) return true;
  if (exports.isArray(object) || exports.isStr(object)) {
    return !(object.length > 0);
  }

  for (var k in object) {
    if (hasOwnProperty.call(object, k)) return false;
  }

  return true;
};

/**
 * Return if string is empty, null, or undefined
 * @param str string to test
 * @returns {boolean} if string is empty
 */
exports.isEmptyStr = function (str) {
  return this.isStr(str) && (!str || str.length === 0);
};

/**
 * Iterate object with the function
 * falls back to es5 `forEach`
 * @param {Array|Object} object
 * @param {Function(value, key, object)} fn
 */
exports._each = function (object, fn) {
  if (this.isEmpty(object)) return;
  if (this.isFn(object.forEach)) return object.forEach(fn, this);

  var k = 0;
  var l = object.length;

  if (l > 0) {
    for (; k < l; k++) {
      fn(object[k], k, object);
    }
  } else {
    for (k in object) {
      if (hasOwnProperty.call(object, k)) fn.call(this, object[k], k);
    }
  }
};

exports.contains = function (a, obj) {
  if (this.isEmpty(a)) {
    return false;
  }

  if (this.isFn(a.indexOf)) {
    return a.indexOf(obj) !== -1;
  }

  var i = a.length;
  while (i--) {
    if (a[i] === obj) {
      return true;
    }
  }

  return false;
};

exports.indexOf = function () {
  if (Array.prototype.indexOf) {
    return Array.prototype.indexOf;
  }

  // ie8 no longer supported
  // return polyfills.indexOf;
}();

/**
 * Map an array or object into another array
 * given a function
 * @param {Array|Object} object
 * @param {Function(value, key, object)} callback
 * @return {Array}
 */
exports._map = function (object, callback) {
  if (this.isEmpty(object)) return [];
  if (this.isFn(object.map)) return object.map(callback);
  var output = [];
  this._each(object, function (value, key) {
    output.push(callback(value, key, object));
  });

  return output;
};

var hasOwn = function hasOwn(objectToCheck, propertyToCheckFor) {
  if (objectToCheck.hasOwnProperty) {
    return objectToCheck.hasOwnProperty(propertyToCheckFor);
  } else {
    return typeof objectToCheck[propertyToCheckFor] !== 'undefined' && objectToCheck.constructor.prototype[propertyToCheckFor] !== objectToCheck[propertyToCheckFor];
  }
};

exports.insertElement = function (elm, doc, target) {
  doc = doc || document;
  var elToAppend = void 0;
  if (target) {
    elToAppend = doc.getElementsByTagName(target);
  } else {
    elToAppend = doc.getElementsByTagName('head');
  }
  try {
    elToAppend = elToAppend.length ? elToAppend : doc.getElementsByTagName('body');
    if (elToAppend.length) {
      elToAppend = elToAppend[0];
      elToAppend.insertBefore(elm, elToAppend.firstChild);
    }
  } catch (e) {}
};

exports.triggerPixel = function (url) {
  var img = new Image();
  img.src = url;
};

exports.callBurl = function (_ref) {
  var source = _ref.source,
      burl = _ref.burl;

  if (source === CONSTANTS.S2S.SRC && burl) {
    exports.triggerPixel(burl);
  }
};

/**
 * Inserts an empty iframe with the specified `html`, primarily used for tracking purposes
 * (though could be for other purposes)
 * @param {string} htmlCode snippet of HTML code used for tracking purposes
 */
exports.insertHtmlIntoIframe = function (htmlCode) {
  if (!htmlCode) {
    return;
  }

  var iframe = document.createElement('iframe');
  iframe.id = exports.getUniqueIdentifierStr();
  iframe.width = 0;
  iframe.height = 0;
  iframe.hspace = '0';
  iframe.vspace = '0';
  iframe.marginWidth = '0';
  iframe.marginHeight = '0';
  iframe.style.display = 'none';
  iframe.style.height = '0px';
  iframe.style.width = '0px';
  iframe.scrolling = 'no';
  iframe.frameBorder = '0';
  iframe.allowtransparency = 'true';

  exports.insertElement(iframe, document, 'body');

  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write(htmlCode);
  iframe.contentWindow.document.close();
};

/**
 * Inserts empty iframe with the specified `url` for cookie sync
 * @param  {string} url URL to be requested
 * @param  {string} encodeUri boolean if URL should be encoded before inserted. Defaults to true
 */
exports.insertUserSyncIframe = function (url) {
  var iframeHtml = this.createTrackPixelIframeHtml(url, false, 'allow-scripts allow-same-origin');
  var div = document.createElement('div');
  div.innerHTML = iframeHtml;
  var iframe = div.firstChild;
  exports.insertElement(iframe);
};

/**
 * Creates a snippet of HTML that retrieves the specified `url`
 * @param  {string} url URL to be requested
 * @return {string}     HTML snippet that contains the img src = set to `url`
 */
exports.createTrackPixelHtml = function (url) {
  if (!url) {
    return '';
  }

  var escapedUrl = encodeURI(url);
  var img = '<div style="position:absolute;left:0px;top:0px;visibility:hidden;">';
  img += '<img src="' + escapedUrl + '"></div>';
  return img;
};

/**
 * Creates a snippet of Iframe HTML that retrieves the specified `url`
 * @param  {string} url plain URL to be requested
 * @param  {string} encodeUri boolean if URL should be encoded before inserted. Defaults to true
 * @param  {string} sandbox string if provided the sandbox attribute will be included with the given value
 * @return {string}     HTML snippet that contains the iframe src = set to `url`
 */
exports.createTrackPixelIframeHtml = function (url) {
  var encodeUri = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var sandbox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  if (!url) {
    return '';
  }
  if (encodeUri) {
    url = encodeURI(url);
  }
  if (sandbox) {
    sandbox = 'sandbox="' + sandbox + '"';
  }

  return '<iframe ' + sandbox + ' id="' + exports.getUniqueIdentifierStr() + '"\n      frameborder="0"\n      allowtransparency="true"\n      marginheight="0" marginwidth="0"\n      width="0" hspace="0" vspace="0" height="0"\n      style="height:0px;width:0px;display:none;"\n      scrolling="no"\n      src="' + url + '">\n    </iframe>';
};

/**
 * Returns iframe document in a browser agnostic way
 * @param  {object} iframe reference
 * @return {object}        iframe `document` reference
 */
exports.getIframeDocument = function (iframe) {
  if (!iframe) {
    return;
  }

  var doc = void 0;
  try {
    if (iframe.contentWindow) {
      doc = iframe.contentWindow.document;
    } else if (iframe.contentDocument.document) {
      doc = iframe.contentDocument.document;
    } else {
      doc = iframe.contentDocument;
    }
  } catch (e) {
    this.logError('Cannot get iframe document', e);
  }

  return doc;
};

exports.getValueString = function (param, val, defaultValue) {
  if (val === undefined || val === null) {
    return defaultValue;
  }
  if (this.isStr(val)) {
    return val;
  }
  if (this.isNumber(val)) {
    return val.toString();
  }
  this.logWarn('Unsuported type for param: ' + param + ' required type: String');
};

function uniques(value, index, arry) {
  return arry.indexOf(value) === index;
}

function flatten(a, b) {
  return a.concat(b);
}

function getBidRequest(id, bidsRequested) {
  return (0, _find2.default)(bidsRequested.map(function (bidSet) {
    return (0, _find2.default)(bidSet.bids, function (bid) {
      return bid.bidId === id;
    });
  }), function (bid) {
    return bid;
  });
}

function getKeys(obj) {
  return Object.keys(obj);
}

function getValue(obj, key) {
  return obj[key];
}

function getBidderCodes() {
  var adUnits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : pbjs.adUnits;

  // this could memoize adUnits
  return adUnits.map(function (unit) {
    return unit.bids.map(function (bid) {
      return bid.bidder;
    }).reduce(flatten, []);
  }).reduce(flatten).filter(uniques);
}

function isGptPubadsDefined() {
  if (window.googletag && exports.isFn(window.googletag.pubads) && exports.isFn(window.googletag.pubads().getSlots)) {
    return true;
  }
}

function getHighestCpm(previous, current) {
  if (previous.cpm === current.cpm) {
    return previous.timeToRespond > current.timeToRespond ? current : previous;
  }

  return previous.cpm < current.cpm ? current : previous;
}

/**
 * Fisher–Yates shuffle
 * http://stackoverflow.com/a/6274398
 * https://bost.ocks.org/mike/shuffle/
 * istanbul ignore next
 */
function shuffle(array) {
  var counter = array.length;

  // while there are elements in the array
  while (counter > 0) {
    // pick a random index
    var index = Math.floor(Math.random() * counter);

    // decrease counter by 1
    counter--;

    // and swap the last element with it
    var temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function adUnitsFilter(filter, bid) {
  return (0, _includes2.default)(filter, bid && bid.adUnitCode);
}

/**
 * Check if parent iframe of passed document supports content rendering via 'srcdoc' property
 * @param {HTMLDocument} doc document to check support of 'srcdoc'
 */
function isSrcdocSupported(doc) {
  // Firefox is excluded due to https://bugzilla.mozilla.org/show_bug.cgi?id=1265961
  return doc.defaultView && doc.defaultView.frameElement && 'srcdoc' in doc.defaultView.frameElement && !/firefox/i.test(navigator.userAgent);
}

function deepClone(obj) {
  return (0, _justClone2.default)(obj);
}

function inIframe() {
  try {
    return exports.getWindowSelf() !== exports.getWindowTop();
  } catch (e) {
    return true;
  }
}

function isSafariBrowser() {
  return (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  );
}

function replaceAuctionPrice(str, cpm) {
  if (!str) return;
  return str.replace(/\$\{AUCTION_PRICE\}/g, cpm);
}

function timestamp() {
  return new Date().getTime();
}

function checkCookieSupport() {
  if (window.navigator.cookieEnabled || !!document.cookie.length) {
    return true;
  }
}
function cookiesAreEnabled() {
  if (exports.checkCookieSupport()) {
    return true;
  }
  window.document.cookie = 'prebid.cookieTest';
  return window.document.cookie.indexOf('prebid.cookieTest') != -1;
}

/**
 * Given a function, return a function which only executes the original after
 * it's been called numRequiredCalls times.
 *
 * Note that the arguments from the previous calls will *not* be forwarded to the original function.
 * Only the final call's arguments matter.
 *
 * @param {function} func The function which should be executed, once the returned function has been executed
 *   numRequiredCalls times.
 * @param {int} numRequiredCalls The number of times which the returned function needs to be called before
 *   func is.
 */
function delayExecution(func, numRequiredCalls) {
  if (numRequiredCalls < 1) {
    throw new Error('numRequiredCalls must be a positive number. Got ' + numRequiredCalls);
  }
  var numCalls = 0;
  return function () {
    numCalls++;
    if (numCalls === numRequiredCalls) {
      func.apply(null, arguments);
    }
  };
}

/**
 * https://stackoverflow.com/a/34890276/428704
 * @export
 * @param {array} xs
 * @param {string} key
 * @returns {${key_value}: ${groupByArray}, key_value: {groupByArray}}
 */
function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

/**
 * deepAccess utility function useful for doing safe access (will not throw exceptions) of deep object paths.
 * @param {object} obj The object containing the values you would like to access.
 * @param {string|number} path Object path to the value you would like to access.  Non-strings are coerced to strings.
 * @returns {*} The value found at the specified object path, or undefined if path is not found.
 */
function deepAccess(obj, path) {
  if (!obj) {
    return;
  }
  path = String(path).split('.');
  for (var i = 0; i < path.length; i++) {
    obj = obj[path[i]];
    if (typeof obj === 'undefined') {
      return;
    }
  }
  return obj;
}

/**
 * Returns content for a friendly iframe to execute a URL in script tag
 * @param {url} URL to be executed in a script tag in a friendly iframe
 * <!--PRE_SCRIPT_TAG_MACRO--> and <!--POST_SCRIPT_TAG_MACRO--> are macros left to be replaced if required
 */
function createContentToExecuteExtScriptInFriendlyFrame(url) {
  if (!url) {
    return '';
  }

  return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html><head><base target="_top" /><script>inDapIF=true;</script></head><body><!--PRE_SCRIPT_TAG_MACRO--><script src="' + url + '"></script><!--POST_SCRIPT_TAG_MACRO--></body></html>';
}

/**
 * Build an object consisting of only defined parameters to avoid creating an
 * object with defined keys and undefined values.
 * @param {object} object The object to pick defined params out of
 * @param {string[]} params An array of strings representing properties to look for in the object
 * @returns {object} An object containing all the specified values that are defined
 */
function getDefinedParams(object, params) {
  return params.filter(function (param) {
    return object[param];
  }).reduce(function (bid, param) {
    return _extends(bid, _defineProperty({}, param, object[param]));
  }, {});
}

/**
 * @typedef {Object} MediaTypes
 * @property {Object} banner banner configuration
 * @property {Object} native native configuration
 * @property {Object} video video configuration
 */

/**
 * Validates an adunit's `mediaTypes` parameter
 * @param {MediaTypes} mediaTypes mediaTypes parameter to validate
 * @return {boolean} If object is valid
 */
function isValidMediaTypes(mediaTypes) {
  var SUPPORTED_MEDIA_TYPES = ['banner', 'native', 'video'];
  var SUPPORTED_STREAM_TYPES = ['instream', 'outstream'];

  var types = Object.keys(mediaTypes);

  if (!types.every(function (type) {
    return (0, _includes2.default)(SUPPORTED_MEDIA_TYPES, type);
  })) {
    return false;
  }

  if (mediaTypes.video && mediaTypes.video.context) {
    return (0, _includes2.default)(SUPPORTED_STREAM_TYPES, mediaTypes.video.context);
  }

  return true;
}

function getBidderRequest(bidRequests, bidder, adUnitCode) {
  return (0, _find2.default)(bidRequests, function (request) {
    return request.bids.filter(function (bid) {
      return bid.bidder === bidder && bid.adUnitCode === adUnitCode;
    }).length > 0;
  }) || { start: null, auctionId: null };
}
/**
 * Returns user configured bidder params from adunit
 * @param {object} adunits
 * @param {string} adunit code
 * @param {string} bidder code
 * @return {Array} user configured param for the given bidder adunit configuration
 */
function getUserConfiguredParams(adUnits, adUnitCode, bidder) {
  return adUnits.filter(function (adUnit) {
    return adUnit.code === adUnitCode;
  }).map(function (adUnit) {
    return adUnit.bids;
  }).reduce(flatten, []).filter(function (bidderData) {
    return bidderData.bidder === bidder;
  }).map(function (bidderData) {
    return bidderData.params || {};
  });
}
/**
 * Returns the origin
 */
function getOrigin() {
  // IE10 does not have this property. https://gist.github.com/hbogs/7908703
  if (!window.location.origin) {
    return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  } else {
    return window.location.origin;
  }
}

/**
 * Returns Do Not Track state
 */
function getDNT() {
  return navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1' || navigator.doNotTrack === 'yes';
}

var compareCodeAndSlot = function compareCodeAndSlot(slot, adUnitCode) {
  return slot.getAdUnitPath() === adUnitCode || slot.getSlotElementId() === adUnitCode;
};

/**
 * Returns filter function to match adUnitCode in slot
 * @param {object} slot GoogleTag slot
 * @return {function} filter function
 */
function isAdUnitCodeMatchingSlot(slot) {
  return function (adUnitCode) {
    return compareCodeAndSlot(slot, adUnitCode);
  };
}

/**
 * Returns filter function to match adUnitCode in slot
 * @param {string} adUnitCode AdUnit code
 * @return {function} filter function
 */
function isSlotMatchingAdUnitCode(adUnitCode) {
  return function (slot) {
    return compareCodeAndSlot(slot, adUnitCode);
  };
}

/**
 * Constructs warning message for when unsupported bidders are dropped from an adunit
 * @param {Object} adUnit ad unit from which the bidder is being dropped
 * @param {string} bidder bidder code that is not compatible with the adUnit
 * @return {string} warning message to display when condition is met
 */
function unsupportedBidderMessage(adUnit, bidder) {
  var mediaType = Object.keys(adUnit.mediaTypes || { 'banner': 'banner' }).join(', ');

  return '\n    ' + adUnit.code + ' is a ' + mediaType + ' ad unit\n    containing bidders that don\'t support ' + mediaType + ': ' + bidder + '.\n    This bidder won\'t fetch demand.\n  ';
}

/**
 * Delete property from object
 * @param {Object} object
 * @param {string} prop
 * @return {Object} object
 */
function deletePropertyFromObject(object, prop) {
  var result = _extends({}, object);
  delete result[prop];
  return result;
}

/**
 * Delete requestId from external bid object.
 * @param {Object} bid
 * @return {Object} bid
 */
function removeRequestId(bid) {
  return exports.deletePropertyFromObject(bid, 'requestId');
}

/**
 * Checks input is integer or not
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 * @param {*} value
 */
function isInteger(value) {
  if (Number.isInteger) {
    return Number.isInteger(value);
  } else {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }
}

/**
 * Converts a string value in camel-case to underscore eg 'placementId' becomes 'placement_id'
 * @param {string} value string value to convert
 */
function convertCamelToUnderscore(value) {
  return value.replace(/(?:^|\.?)([A-Z])/g, function (x, y) {
    return '_' + y.toLowerCase();
  }).replace(/^_/, '');
}

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.registerBidder = registerBidder;
exports.newBidder = newBidder;
exports.isValid = isValid;

var _adapter = __webpack_require__(25);

var _adapter2 = _interopRequireDefault(_adapter);

var _adaptermanager = __webpack_require__(8);

var _adaptermanager2 = _interopRequireDefault(_adaptermanager);

var _config = __webpack_require__(4);

var _bidfactory = __webpack_require__(19);

var _bidfactory2 = _interopRequireDefault(_bidfactory);

var _userSync = __webpack_require__(13);

var _native = __webpack_require__(18);

var _video = __webpack_require__(64);

var _constants = __webpack_require__(2);

var _constants2 = _interopRequireDefault(_constants);

var _events = __webpack_require__(9);

var _events2 = _interopRequireDefault(_events);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This file aims to support Adapters during the Prebid 0.x -> 1.x transition.
 *
 * Prebid 1.x and Prebid 0.x will be in separate branches--perhaps for a long time.
 * This function defines an API for adapter construction which is compatible with both versions.
 * Adapters which use it can maintain their code in master, and only this file will need to change
 * in the 1.x branch.
 *
 * Typical usage looks something like:
 *
 * const adapter = registerBidder({
 *   code: 'myBidderCode',
 *   aliases: ['alias1', 'alias2'],
 *   supportedMediaTypes: ['video', 'native'],
 *   isBidRequestValid: function(paramsObject) { return true/false },
 *   buildRequests: function(bidRequests, bidderRequest) { return some ServerRequest(s) },
 *   interpretResponse: function(oneServerResponse) { return some Bids, or throw an error. }
 * });
 *
 * @see BidderSpec for the full API and more thorough descriptions.
 */

/**
 * @typedef {object} BidderSpec An object containing the adapter-specific functions needed to
 * make a Bidder.
 *
 * @property {string} code A code which will be used to uniquely identify this bidder. This should be the same
 *   one as is used in the call to registerBidAdapter
 * @property {string[]} [aliases] A list of aliases which should also resolve to this bidder.
 * @property {MediaType[]} [supportedMediaTypes]: A list of Media Types which the adapter supports.
 * @property {function(object): boolean} isBidRequestValid Determines whether or not the given bid has all the params
 *   needed to make a valid request.
 * @property {function(BidRequest[], bidderRequest): ServerRequest|ServerRequest[]} buildRequests Build the request to the Server
 *   which requests Bids for the given array of Requests. Each BidRequest in the argument array is guaranteed to have
 *   passed the isBidRequestValid() test.
 * @property {function(ServerResponse, BidRequest): Bid[]} interpretResponse Given a successful response from the Server,
 *   interpret it and return the Bid objects. This function will be run inside a try/catch.
 *   If it throws any errors, your bids will be discarded.
 * @property {function(SyncOptions, ServerResponse[]): UserSync[]} [getUserSyncs] Given an array of all the responses
 *   from the server, determine which user syncs should occur. The argument array will contain every element
 *   which has been sent through to interpretResponse. The order of syncs in this array matters. The most
 *   important ones should come first, since publishers may limit how many are dropped on their page.
 */

/**
 * @typedef {object} BidRequest
 *
 * @property {string} bidId A string which uniquely identifies this BidRequest in the current Auction.
 * @property {object} params Any bidder-specific params which the publisher used in their bid request.
 */

/**
 * @typedef {object} ServerRequest
 *
 * @property {('GET'|'POST')} method The type of request which this is.
 * @property {string} url The endpoint for the request. For example, "//bids.example.com".
 * @property {string|object} data Data to be sent in the request.
 * @property {object} options Content-Type set in the header of the bid request, overrides default 'text/plain'.
 *   If this is a GET request, they'll become query params. If it's a POST request, they'll be added to the body.
 *   Strings will be added as-is. Objects will be unpacked into query params based on key/value mappings, or
 *   JSON-serialized into the Request body.
 */

/**
 * @typedef {object} ServerResponse
 *
 * @property {*} body The response body. If this is legal JSON, then it will be parsed. Otherwise it'll be a
 *   string with the body's content.
 * @property {{get: function(string): string} headers The response headers.
 *   Call this like `ServerResponse.headers.get("Content-Type")`
 */

/**
 * @typedef {object} Bid
 *
 * @property {string} requestId The specific BidRequest which this bid is aimed at.
 *   This should match the BidRequest.bidId which this Bid targets.
 * @property {string} ad A URL which can be used to load this ad, if it's chosen by the publisher.
 * @property {string} currency The currency code for the cpm value
 * @property {number} cpm The bid price, in US cents per thousand impressions.
 * @property {number} ttl Time-to-live - how long (in seconds) Prebid can use this bid.
 * @property {boolean} netRevenue Boolean defining whether the bid is Net or Gross.  The default is true (Net).
 * @property {number} height The height of the ad, in pixels.
 * @property {number} width The width of the ad, in pixels.
 *
 * @property [Renderer] renderer A Renderer which can be used as a default for this bid,
 *   if the publisher doesn't override it. This is only relevant for Outstream Video bids.
 */

/**
 * @typedef {Object} SyncOptions
 *
 * An object containing information about usersyncs which the adapter should obey.
 *
 * @property {boolean} iframeEnabled True if iframe usersyncs are allowed, and false otherwise
 * @property {boolean} pixelEnabled True if image usersyncs are allowed, and false otherwise
 */

/**
 * TODO: Move this to the UserSync module after that PR is merged.
 *
 * @typedef {object} UserSync
 *
 * @property {('image'|'iframe')} type The type of user sync to be done.
 * @property {string} url The URL which makes the sync happen.
 */

// common params for all mediaTypes
var COMMON_BID_RESPONSE_KEYS = ['requestId', 'cpm', 'ttl', 'creativeId', 'netRevenue', 'currency'];

/**
 * Register a bidder with prebid, using the given spec.
 *
 * If possible, Adapter modules should use this function instead of adaptermanager.registerBidAdapter().
 *
 * @param {BidderSpec} spec An object containing the bare-bones functions we need to make a Bidder.
 */
function registerBidder(spec) {
  var mediaTypes = Array.isArray(spec.supportedMediaTypes) ? { supportedMediaTypes: spec.supportedMediaTypes } : undefined;
  function putBidder(spec) {
    var bidder = newBidder(spec);
    _adaptermanager2.default.registerBidAdapter(bidder, spec.code, mediaTypes);
  }

  putBidder(spec);
  if (Array.isArray(spec.aliases)) {
    spec.aliases.forEach(function (alias) {
      _adaptermanager2.default.aliasRegistry[alias] = spec.code;
      putBidder(_extends({}, spec, { code: alias }));
    });
  }
}

/**
 * Make a new bidder from the given spec. This is exported mainly for testing.
 * Adapters will probably find it more convenient to use registerBidder instead.
 *
 * @param {BidderSpec} spec
 */
function newBidder(spec) {
  return _extends(new _adapter2.default(spec.code), {
    getSpec: function getSpec() {
      return Object.freeze(spec);
    },
    registerSyncs: registerSyncs,
    callBids: function callBids(bidderRequest, addBidResponse, done, ajax) {
      if (!Array.isArray(bidderRequest.bids)) {
        return;
      }

      var adUnitCodesHandled = {};
      function addBidWithCode(adUnitCode, bid) {
        adUnitCodesHandled[adUnitCode] = true;
        if (isValid(adUnitCode, bid, [bidderRequest])) {
          addBidResponse(adUnitCode, bid);
        }
      }

      // After all the responses have come back, call done() and
      // register any required usersync pixels.
      var responses = [];
      function afterAllResponses(bids) {
        var bidsArray = bids ? bids[0] ? bids : [bids] : [];

        var videoBid = bidsArray.some(function (bid) {
          return bid.mediaType === 'video';
        });
        var cacheEnabled = _config.config.getConfig('cache.url');

        // video bids with cache enabled need to be cached first before they are considered done
        if (!(videoBid && cacheEnabled)) {
          done();
        }

        // TODO: the code above needs to be refactored. We should always call done when we're done. if the auction
        // needs to do cleanup before _it_ can be done it should handle that itself in the auction.  It should _not_
        // require us, the bidders, to conditionally call done.  That makes the whole done API very flaky.
        // As soon as that is refactored, we can move this emit event where it should be, within the done function.
        _events2.default.emit(_constants2.default.EVENTS.BIDDER_DONE, bidderRequest);

        registerSyncs(responses, bidderRequest.gdprConsent);
      }

      var validBidRequests = bidderRequest.bids.filter(filterAndWarn);
      if (validBidRequests.length === 0) {
        afterAllResponses();
        return;
      }
      var bidRequestMap = {};
      validBidRequests.forEach(function (bid) {
        bidRequestMap[bid.bidId] = bid;
        // Delete this once we are 1.0
        if (!bid.adUnitCode) {
          bid.adUnitCode = bid.placementCode;
        }
      });

      var requests = spec.buildRequests(validBidRequests, bidderRequest);
      if (!requests || requests.length === 0) {
        afterAllResponses();
        return;
      }
      if (!Array.isArray(requests)) {
        requests = [requests];
      }

      // Callbacks don't compose as nicely as Promises. We should call done() once _all_ the
      // Server requests have returned and been processed. Since `ajax` accepts a single callback,
      // we need to rig up a function which only executes after all the requests have been responded.
      var onResponse = (0, _utils.delayExecution)(afterAllResponses, requests.length);
      requests.forEach(processRequest);

      function formatGetParameters(data) {
        if (data) {
          return '?' + ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' ? (0, _utils.parseQueryStringParameters)(data) : data);
        }

        return '';
      }

      function processRequest(request) {
        switch (request.method) {
          case 'GET':
            ajax('' + request.url + formatGetParameters(request.data), {
              success: onSuccess,
              error: onFailure
            }, undefined, _extends({
              method: 'GET',
              withCredentials: true
            }, request.options));
            break;
          case 'POST':
            ajax(request.url, {
              success: onSuccess,
              error: onFailure
            }, typeof request.data === 'string' ? request.data : JSON.stringify(request.data), _extends({
              method: 'POST',
              contentType: 'text/plain',
              withCredentials: true
            }, request.options));
            break;
          default:
            (0, _utils.logWarn)('Skipping invalid request from ' + spec.code + '. Request type ' + request.type + ' must be GET or POST');
            onResponse();
        }

        // If the server responds successfully, use the adapter code to unpack the Bids from it.
        // If the adapter code fails, no bids should be added. After all the bids have been added, make
        // sure to call the `onResponse` function so that we're one step closer to calling done().
        function onSuccess(response, responseObj) {
          try {
            response = JSON.parse(response);
          } catch (e) {} /* response might not be JSON... that's ok. */

          // Make response headers available for #1742. These are lazy-loaded because most adapters won't need them.
          response = {
            body: response,
            headers: headerParser(responseObj)
          };
          responses.push(response);

          var bids = void 0;
          try {
            bids = spec.interpretResponse(response, request);
          } catch (err) {
            (0, _utils.logError)('Bidder ' + spec.code + ' failed to interpret the server\'s response. Continuing without bids', null, err);
            onResponse();
            return;
          }

          if (bids) {
            if (bids.forEach) {
              bids.forEach(addBidUsingRequestMap);
            } else {
              addBidUsingRequestMap(bids);
            }
          }
          onResponse(bids);

          function addBidUsingRequestMap(bid) {
            var bidRequest = bidRequestMap[bid.requestId];
            if (bidRequest) {
              var prebidBid = _extends(_bidfactory2.default.createBid(_constants2.default.STATUS.GOOD, bidRequest), bid);
              addBidWithCode(bidRequest.adUnitCode, prebidBid);
            } else {
              (0, _utils.logWarn)('Bidder ' + spec.code + ' made bid for unknown request ID: ' + bid.requestId + '. Ignoring.');
            }
          }

          function headerParser(xmlHttpResponse) {
            return {
              get: responseObj.getResponseHeader.bind(responseObj)
            };
          }
        }

        // If the server responds with an error, there's not much we can do. Log it, and make sure to
        // call onResponse() so that we're one step closer to calling done().
        function onFailure(err) {
          (0, _utils.logError)('Server call for ' + spec.code + ' failed: ' + err + '. Continuing without bids.');
          onResponse();
        }
      }
    }
  });

  function registerSyncs(responses, gdprConsent) {
    if (spec.getUserSyncs) {
      var syncs = spec.getUserSyncs({
        iframeEnabled: _config.config.getConfig('userSync.iframeEnabled'),
        pixelEnabled: _config.config.getConfig('userSync.pixelEnabled')
      }, responses, gdprConsent);
      if (syncs) {
        if (!Array.isArray(syncs)) {
          syncs = [syncs];
        }
        syncs.forEach(function (sync) {
          _userSync.userSync.registerSync(sync.type, spec.code, sync.url);
        });
      }
    }
  }

  function filterAndWarn(bid) {
    if (!spec.isBidRequestValid(bid)) {
      (0, _utils.logWarn)('Invalid bid sent to bidder ' + spec.code + ': ' + JSON.stringify(bid));
      return false;
    }
    return true;
  }
}

// check that the bid has a width and height set
function validBidSize(adUnitCode, bid, bidRequests) {
  if ((bid.width || bid.width === 0) && (bid.height || bid.height === 0)) {
    return true;
  }

  var adUnit = (0, _utils.getBidderRequest)(bidRequests, bid.bidderCode, adUnitCode);

  var sizes = adUnit && adUnit.bids && adUnit.bids[0] && adUnit.bids[0].sizes;
  var parsedSizes = (0, _utils.parseSizesInput)(sizes);

  // if a banner impression has one valid size, we assign that size to any bid
  // response that does not explicitly set width or height
  if (parsedSizes.length === 1) {
    var _parsedSizes$0$split = parsedSizes[0].split('x'),
        _parsedSizes$0$split2 = _slicedToArray(_parsedSizes$0$split, 2),
        width = _parsedSizes$0$split2[0],
        height = _parsedSizes$0$split2[1];

    bid.width = width;
    bid.height = height;
    return true;
  }

  return false;
}

// Validate the arguments sent to us by the adapter. If this returns false, the bid should be totally ignored.
function isValid(adUnitCode, bid, bidRequests) {
  function hasValidKeys() {
    var bidKeys = Object.keys(bid);
    return COMMON_BID_RESPONSE_KEYS.every(function (key) {
      return (0, _includes2.default)(bidKeys, key);
    });
  }

  function errorMessage(msg) {
    return 'Invalid bid from ' + bid.bidderCode + '. Ignoring bid: ' + msg;
  }

  if (!adUnitCode) {
    (0, _utils.logWarn)('No adUnitCode was supplied to addBidResponse.');
    return false;
  }

  if (!bid) {
    (0, _utils.logWarn)('Some adapter tried to add an undefined bid for ' + adUnitCode + '.');
    return false;
  }

  if (!hasValidKeys()) {
    (0, _utils.logError)(errorMessage('Bidder ' + bid.bidderCode + ' is missing required params. Check http://prebid.org/dev-docs/bidder-adapter-1.html for list of params.'));
    return false;
  }

  if (bid.mediaType === 'native' && !(0, _native.nativeBidIsValid)(bid, bidRequests)) {
    (0, _utils.logError)(errorMessage('Native bid missing some required properties.'));
    return false;
  }
  if (bid.mediaType === 'video' && !(0, _video.isValidVideoBid)(bid, bidRequests)) {
    (0, _utils.logError)(errorMessage('Video bid does not have required vastUrl or renderer property'));
    return false;
  }
  if (bid.mediaType === 'banner' && !validBidSize(adUnitCode, bid, bidRequests)) {
    (0, _utils.logError)(errorMessage('Banner bids require a width and height'));
    return false;
  }

  return true;
}

/***/ }),

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(42);
module.exports = __webpack_require__(15).Array.find;


/***/ }),

/***/ 101:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__(16);
var $find = __webpack_require__(30)(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(24)(KEY);


/***/ }),

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _requestCache = {};
var _vendorWhitelist = ['criteo'];

/**
 * Loads external javascript. Can only be used if external JS is approved by Prebid. See https://github.com/prebid/prebid-js-external-js-template#policy
 * Each unique URL will be loaded at most 1 time.
 * @param {string} url the url to load
 * @param {string} moduleCode bidderCode or module code of the module requesting this resource
 */
exports.loadExternalScript = function (url, moduleCode) {
  if (!moduleCode || !url) {
    utils.logError('cannot load external script without url and moduleCode');
    return;
  }
  if (!(0, _includes2.default)(_vendorWhitelist, moduleCode)) {
    utils.logError(moduleCode + ' not whitelisted for loading external JavaScript');
    return;
  }
  // only load each asset once
  if (_requestCache[url]) {
    return;
  }

  utils.logWarn('module ' + moduleCode + ' is loading external JavaScript');
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = url;

  utils.insertElement(script);
  _requestCache[url] = true;
};

/**
 *
 * @deprecated
 * Do not use this function. Will be removed in the next release. If external resources are required, use #loadExternalScript instead.
 */
exports.loadScript = function (tagSrc, callback, cacheRequest) {
  // var noop = () => {};
  //
  // callback = callback || noop;
  if (!tagSrc) {
    utils.logError('Error attempting to request empty URL', 'adloader.js:loadScript');
    return;
  }

  if (cacheRequest) {
    if (_requestCache[tagSrc]) {
      if (callback && typeof callback === 'function') {
        if (_requestCache[tagSrc].loaded) {
          // invokeCallbacks immediately
          callback();
        } else {
          // queue the callback
          _requestCache[tagSrc].callbacks.push(callback);
        }
      }
    } else {
      _requestCache[tagSrc] = {
        loaded: false,
        callbacks: []
      };
      if (callback && typeof callback === 'function') {
        _requestCache[tagSrc].callbacks.push(callback);
      }

      requestResource(tagSrc, function () {
        _requestCache[tagSrc].loaded = true;
        try {
          for (var i = 0; i < _requestCache[tagSrc].callbacks.length; i++) {
            _requestCache[tagSrc].callbacks[i]();
          }
        } catch (e) {
          utils.logError('Error executing callback', 'adloader.js:loadScript', e);
        }
      });
    }
  } else {
    // trigger one time request
    requestResource(tagSrc, callback);
  }
};

function requestResource(tagSrc, callback) {
  var jptScript = document.createElement('script');
  jptScript.type = 'text/javascript';
  jptScript.async = true;

  // Execute a callback if necessary
  if (callback && typeof callback === 'function') {
    if (jptScript.readyState) {
      jptScript.onreadystatechange = function () {
        if (jptScript.readyState === 'loaded' || jptScript.readyState === 'complete') {
          jptScript.onreadystatechange = null;
          callback();
        }
      };
    } else {
      jptScript.onload = function () {
        callback();
      };
    }
  }

  jptScript.src = tagSrc;

  // add the new script tag to the page
  var elToAppend = document.getElementsByTagName('head');
  elToAppend = elToAppend.length ? elToAppend : document.getElementsByTagName('body');
  if (elToAppend.length) {
    elToAppend = elToAppend[0];
    elToAppend.insertBefore(jptScript, elToAppend.firstChild);
  }
}

/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.parseQS = parseQS;
exports.formatQS = formatQS;
exports.parse = parse;
exports.format = format;
function parseQS(query) {
  return !query ? {} : query.replace(/^\?/, '').split('&').reduce(function (acc, criteria) {
    var _criteria$split = criteria.split('='),
        _criteria$split2 = _slicedToArray(_criteria$split, 2),
        k = _criteria$split2[0],
        v = _criteria$split2[1];

    if (/\[\]$/.test(k)) {
      k = k.replace('[]', '');
      acc[k] = acc[k] || [];
      acc[k].push(v);
    } else {
      acc[k] = v || '';
    }
    return acc;
  }, {});
}

function formatQS(query) {
  return Object.keys(query).map(function (k) {
    return Array.isArray(query[k]) ? query[k].map(function (v) {
      return k + '[]=' + v;
    }).join('&') : k + '=' + query[k];
  }).join('&');
}

function parse(url, options) {
  var parsed = document.createElement('a');
  if (options && 'noDecodeWholeURL' in options && options.noDecodeWholeURL) {
    parsed.href = url;
  } else {
    parsed.href = decodeURIComponent(url);
  }
  // in window.location 'search' is string, not object
  var qsAsString = options && 'decodeSearchAsString' in options && options.decodeSearchAsString;
  return {
    href: parsed.href,
    protocol: (parsed.protocol || '').replace(/:$/, ''),
    hostname: parsed.hostname,
    port: +parsed.port,
    pathname: parsed.pathname.replace(/^(?!\/)/, '/'),
    search: qsAsString ? parsed.search : parseQS(parsed.search || ''),
    hash: (parsed.hash || '').replace(/^#/, ''),
    host: parsed.host || window.location.host
  };
}

function format(obj) {
  return (obj.protocol || 'http') + '://' + (obj.host || obj.hostname + (obj.port ? ':' + obj.port : '')) + (obj.pathname || '') + (obj.search ? '?' + formatQS(obj.search || '') : '') + (obj.hash ? '#' + obj.hash : '');
}

/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userSync = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.newUserSync = newUserSync;

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

var _config = __webpack_require__(4);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Set userSync default values
_config.config.setDefaults({
  'userSync': {
    syncEnabled: true,
    pixelEnabled: true,
    syncsPerBidder: 5,
    syncDelay: 3000
  }
});

/**
 * Factory function which creates a new UserSyncPool.
 *
 * @param {UserSyncDependencies} userSyncDependencies Configuration options and dependencies which the
 *   UserSync object needs in order to behave properly.
 */
function newUserSync(userSyncDependencies) {
  var publicApi = {};
  // A queue of user syncs for each adapter
  // Let getDefaultQueue() set the defaults
  var queue = getDefaultQueue();

  // Whether or not user syncs have been trigger on this page load
  var hasFired = false;
  // How many bids for each adapter
  var numAdapterBids = {};

  // Use what is in config by default
  var usConfig = userSyncDependencies.config;
  // Update if it's (re)set
  _config.config.getConfig('userSync', function (conf) {
    usConfig = _extends(usConfig, conf.userSync);
  });

  /**
   * @function getDefaultQueue
   * @summary Returns the default empty queue
   * @private
   * @return {object} A queue with no syncs
   */
  function getDefaultQueue() {
    return {
      image: [],
      iframe: []
    };
  }

  /**
   * @function fireSyncs
   * @summary Trigger all user syncs in the queue
   * @private
   */
  function fireSyncs() {
    if (!usConfig.syncEnabled || !userSyncDependencies.browserSupportsCookies || hasFired) {
      return;
    }

    try {
      // Image pixels
      fireImagePixels();
      // Iframe syncs
      loadIframes();
    } catch (e) {
      return utils.logError('Error firing user syncs', e);
    }
    // Reset the user sync queue
    queue = getDefaultQueue();
    hasFired = true;
  }

  /**
   * @function fireImagePixels
   * @summary Loops through user sync pixels and fires each one
   * @private
   */
  function fireImagePixels() {
    if (!usConfig.pixelEnabled) {
      return;
    }
    // Randomize the order of the pixels before firing
    // This is to avoid giving any bidder who has registered multiple syncs
    // any preferential treatment and balancing them out
    utils.shuffle(queue.image).forEach(function (sync) {
      var _sync = _slicedToArray(sync, 2),
          bidderName = _sync[0],
          trackingPixelUrl = _sync[1];

      utils.logMessage('Invoking image pixel user sync for bidder: ' + bidderName);
      // Create image object and add the src url
      utils.triggerPixel(trackingPixelUrl);
    });
  }

  /**
   * @function loadIframes
   * @summary Loops through iframe syncs and loads an iframe element into the page
   * @private
   */
  function loadIframes() {
    if (!usConfig.iframeEnabled) {
      return;
    }
    // Randomize the order of these syncs just like the pixels above
    utils.shuffle(queue.iframe).forEach(function (sync) {
      var _sync2 = _slicedToArray(sync, 2),
          bidderName = _sync2[0],
          iframeUrl = _sync2[1];

      utils.logMessage('Invoking iframe user sync for bidder: ' + bidderName);
      // Insert iframe into DOM
      utils.insertUserSyncIframe(iframeUrl);
    });
  }

  /**
   * @function incrementAdapterBids
   * @summary Increment the count of user syncs queue for the adapter
   * @private
   * @params {object} numAdapterBids The object contain counts for all adapters
   * @params {string} bidder The name of the bidder adding a sync
   * @returns {object} The updated version of numAdapterBids
   */
  function incrementAdapterBids(numAdapterBids, bidder) {
    if (!numAdapterBids[bidder]) {
      numAdapterBids[bidder] = 1;
    } else {
      numAdapterBids[bidder] += 1;
    }
    return numAdapterBids;
  }

  /**
   * @function registerSync
   * @summary Add sync for this bidder to a queue to be fired later
   * @public
   * @params {string} type The type of the sync including image, iframe
   * @params {string} bidder The name of the adapter. e.g. "rubicon"
   * @params {string} url Either the pixel url or iframe url depending on the type
    * @example <caption>Using Image Sync</caption>
   * // registerSync(type, adapter, pixelUrl)
   * userSync.registerSync('image', 'rubicon', 'http://example.com/pixel')
   */
  publicApi.registerSync = function (type, bidder, url) {
    if (!usConfig.syncEnabled || !utils.isArray(queue[type])) {
      return utils.logWarn('User sync type "' + type + '" not supported');
    }
    if (!bidder) {
      return utils.logWarn('Bidder is required for registering sync');
    }
    if (Number(numAdapterBids[bidder]) >= usConfig.syncsPerBidder) {
      return utils.logWarn('Number of user syncs exceeded for "' + bidder + '"');
    }
    // All bidders are enabled by default. If specified only register for enabled bidders.
    var hasEnabledBidders = usConfig.enabledBidders && usConfig.enabledBidders.length;
    if (hasEnabledBidders && usConfig.enabledBidders.indexOf(bidder) < 0) {
      return utils.logWarn('Bidder "' + bidder + '" not supported');
    }
    queue[type].push([bidder, url]);
    numAdapterBids = incrementAdapterBids(numAdapterBids, bidder);
  };

  /**
   * @function syncUsers
   * @summary Trigger all the user syncs based on publisher-defined timeout
   * @public
   * @params {int} timeout The delay in ms before syncing data - default 0
   */
  publicApi.syncUsers = function () {
    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    if (timeout) {
      return setTimeout(fireSyncs, Number(timeout));
    }
    fireSyncs();
  };

  /**
   * @function triggerUserSyncs
   * @summary A `syncUsers` wrapper for determining if enableOverride has been turned on
   * @public
   */
  publicApi.triggerUserSyncs = function () {
    if (usConfig.enableOverride) {
      publicApi.syncUsers();
    }
  };

  return publicApi;
}

var browserSupportsCookies = !utils.isSafariBrowser() && utils.cookiesAreEnabled();

var userSync = exports.userSync = newUserSync({
  config: _config.config.getConfig('userSync'),
  browserSupportsCookies: browserSupportsCookies
});

/**
 * @typedef {Object} UserSyncDependencies
 *
 * @property {UserSyncConfig} config
 * @property {boolean} browserSupportsCookies True if the current browser supports cookies, and false otherwise.
 */

/**
 * @typedef {Object} UserSyncConfig
 *
 * @property {boolean} enableOverride
 * @property {boolean} syncEnabled
 * @property {boolean} pixelEnabled
 * @property {boolean} iframeEnabled
 * @property {int} syncsPerBidder
 * @property {string[]} enabledBidders
 */

/***/ }),

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Renderer = Renderer;

var _adloader = __webpack_require__(11);

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @typedef {object} Renderer
 *
 * A Renderer stores some functions which are used to render a particular Bid.
 * These are used in Outstream Video Bids, returned on the Bid by the adapter, and will
 * be used to render that bid unless the Publisher overrides them.
 */

function Renderer(options) {
  var _this = this;

  var url = options.url,
      config = options.config,
      id = options.id,
      callback = options.callback,
      loaded = options.loaded;

  this.url = url;
  this.config = config;
  this.handlers = {};
  this.id = id;

  // a renderer may push to the command queue to delay rendering until the
  // render function is loaded by loadScript, at which point the the command
  // queue will be processed
  this.loaded = loaded;
  this.cmd = [];
  this.push = function (func) {
    if (typeof func !== 'function') {
      utils.logError('Commands given to Renderer.push must be wrapped in a function');
      return;
    }
    _this.loaded ? func.call() : _this.cmd.push(func);
  };

  // bidders may override this with the `callback` property given to `install`
  this.callback = callback || function () {
    _this.loaded = true;
    _this.process();
  };

  // we expect to load a renderer url once only so cache the request to load script
  (0, _adloader.loadScript)(url, this.callback, true);
}

Renderer.install = function (_ref) {
  var url = _ref.url,
      config = _ref.config,
      id = _ref.id,
      callback = _ref.callback,
      loaded = _ref.loaded;

  return new Renderer({ url: url, config: config, id: id, callback: callback, loaded: loaded });
};

Renderer.prototype.getConfig = function () {
  return this.config;
};

Renderer.prototype.setRender = function (fn) {
  this.render = fn;
};

Renderer.prototype.setEventHandlers = function (handlers) {
  this.handlers = handlers;
};

Renderer.prototype.handleVideoEvent = function (_ref2) {
  var id = _ref2.id,
      eventName = _ref2.eventName;

  if (typeof this.handlers[eventName] === 'function') {
    this.handlers[eventName]();
  }

  utils.logMessage('Prebid Renderer event for id ' + id + ' type ' + eventName);
};

/*
 * Calls functions that were pushed to the command queue before the
 * renderer was loaded by `loadScript`
 */
Renderer.prototype.process = function () {
  while (this.cmd.length > 0) {
    try {
      this.cmd.shift().call();
    } catch (error) {
      utils.logError('Error processing Renderer command: ', error);
    }
  }
};

/***/ }),

/***/ 15:
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(20);
var core = __webpack_require__(15);
var ctx = __webpack_require__(28);
var hide = __webpack_require__(44);
var has = __webpack_require__(51);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addBidResponse = exports.AUCTION_COMPLETED = exports.AUCTION_IN_PROGRESS = exports.AUCTION_STARTED = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * Module for auction instances.
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * In Prebid 0.x, pbjs had _bidsRequested and _bidsReceived as public properties.
                                                                                                                                                                                                                                                                   * Starting 1.0, Prebid will support concurrent auctions. Each auction instance will store private properties, bidsRequested and bidsReceived.
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * AuctionManager will create instance of auction and will store all the auctions.
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   */

/**
  * @typedef {Object} AdUnit An object containing the adUnit configuration.
  *
  * @property {string} code A code which will be used to uniquely identify this bidder. This should be the same
  *   one as is used in the call to registerBidAdapter
  * @property {Array.<size>} sizes A list of size for adUnit.
  * @property {object} params Any bidder-specific params which the publisher used in their bid request.
  *   This is guaranteed to have passed the spec.areParamsValid() test.
  */

/**
 * @typedef {Array.<number>} size
 */

/**
 * @typedef {Array.<string>} AdUnitCode
 */

/**
 * @typedef {Object} BidRequest
 * //TODO add all properties
 */

/**
 * @typedef {Object} BidReceived
 * //TODO add all properties
 */

/**
 * @typedef {Object} Auction
 *
 * @property {function(): string} getAuctionStatus - returns the auction status which can be any one of 'started', 'in progress' or 'completed'
 * @property {function(): AdUnit[]} getAdUnits - return the adUnits for this auction instance
 * @property {function(): AdUnitCode[]} getAdUnitCodes - return the adUnitCodes for this auction instance
 * @property {function(): BidRequest[]} getBidRequests - get all bid requests for this auction instance
 * @property {function(): BidReceived[]} getBidsReceived - get all bid received for this auction instance
 * @property {function(): void} startAuctionTimer - sets the bidsBackHandler callback and starts the timer for auction
 * @property {function(): void} callBids - sends requests to all adapters for bids
 */

exports.newAuction = newAuction;
exports.getStandardBidderSettings = getStandardBidderSettings;
exports.getKeyValueTargetingPairs = getKeyValueTargetingPairs;
exports.adjustBids = adjustBids;

var _utils = __webpack_require__(0);

var _cpmBucketManager = __webpack_require__(27);

var _native = __webpack_require__(18);

var _videoCache = __webpack_require__(168);

var _Renderer = __webpack_require__(14);

var _config = __webpack_require__(4);

var _userSync = __webpack_require__(13);

var _hook = __webpack_require__(21);

var _find = __webpack_require__(10);

var _find2 = _interopRequireDefault(_find);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var syncUsers = _userSync.userSync.syncUsers;

var utils = __webpack_require__(0);
var adaptermanager = __webpack_require__(8);
var events = __webpack_require__(9);
var CONSTANTS = __webpack_require__(2);

var AUCTION_STARTED = exports.AUCTION_STARTED = 'started';
var AUCTION_IN_PROGRESS = exports.AUCTION_IN_PROGRESS = 'inProgress';
var AUCTION_COMPLETED = exports.AUCTION_COMPLETED = 'completed';

// register event for bid adjustment
events.on(CONSTANTS.EVENTS.BID_ADJUSTMENT, function (bid) {
  adjustBids(bid);
});

/**
  * Creates new auction instance
  *
  * @param {Object} requestConfig
  * @param {AdUnit} requestConfig.adUnits
  * @param {AdUnitCode} requestConfig.adUnitCode
  *
  * @returns {Auction} auction instance
  */
function newAuction(_ref) {
  var adUnits = _ref.adUnits,
      adUnitCodes = _ref.adUnitCodes,
      callback = _ref.callback,
      cbTimeout = _ref.cbTimeout,
      labels = _ref.labels;

  var _adUnits = adUnits;
  var _labels = labels;
  var _adUnitCodes = adUnitCodes;
  var _bidderRequests = [];
  var _bidsReceived = [];
  var _auctionStart = void 0;
  var _auctionId = utils.generateUUID();
  var _auctionStatus = void 0;
  var _callback = callback;
  var _timer = void 0;
  var _timeout = cbTimeout;
  var _winningBids = [];

  function addBidRequests(bidderRequests) {
    _bidderRequests = _bidderRequests.concat(bidderRequests);
  };
  function addBidReceived(bidsReceived) {
    _bidsReceived = _bidsReceived.concat(bidsReceived);
  }

  function startAuctionTimer() {
    var timedOut = true;
    var timeoutCallback = executeCallback.bind(null, timedOut);
    var timer = setTimeout(timeoutCallback, _timeout);
    _timer = timer;
  }

  function executeCallback(timedOut, cleartimer) {
    // clear timer when done calls executeCallback
    if (cleartimer) {
      clearTimeout(_timer);
    }

    if (_callback != null) {
      var timedOutBidders = [];
      if (timedOut) {
        utils.logMessage('Auction ' + _auctionId + ' timedOut');
        timedOutBidders = getTimedOutBids(_bidderRequests, _bidsReceived);
        if (timedOutBidders.length) {
          events.emit(CONSTANTS.EVENTS.BID_TIMEOUT, timedOutBidders);
        }
      }

      events.emit(CONSTANTS.EVENTS.AUCTION_END, { auctionId: _auctionId });

      try {
        _auctionStatus = AUCTION_COMPLETED;
        var _adUnitCodes2 = _adUnitCodes;
        var bids = [_bidsReceived.filter(_utils.adUnitsFilter.bind(this, _adUnitCodes2)).reduce(groupByPlacement, {})];
        _callback.apply(pbjs, bids);
      } catch (e) {
        utils.logError('Error executing bidsBackHandler', null, e);
      } finally {
        // Calling timed out bidders
        if (timedOutBidders.length) {
          adaptermanager.callTimedOutBidders(adUnits, timedOutBidders, _timeout);
        }
        // Only automatically sync if the publisher has not chosen to "enableOverride"
        var userSyncConfig = _config.config.getConfig('userSync') || {};
        if (!userSyncConfig.enableOverride) {
          // Delay the auto sync by the config delay
          syncUsers(userSyncConfig.syncDelay);
        }
      }
      _callback = null;
    }
  }

  function done(bidRequestId) {
    var innerBidRequestId = bidRequestId;
    return (0, _utils.delayExecution)(function () {
      var request = (0, _find2.default)(_bidderRequests, function (bidRequest) {
        return innerBidRequestId === bidRequest.bidderRequestId;
      });

      // this is done for cache-enabled video bids in tryAddVideoBid, after the cache is stored
      request.doneCbCallCount += 1;
      bidsBackAll();
    }, 1);
  }

  /**
   * Execute bidBackHandler if all bidders have called done.
   */
  function bidsBackAll() {
    if (_bidderRequests.every(function (bidRequest) {
      return bidRequest.doneCbCallCount >= 1;
    })) {
      // when all bidders have called done callback atleast once it means auction is complete
      utils.logInfo('Bids Received for Auction with id: ' + _auctionId, _bidsReceived);
      _auctionStatus = AUCTION_COMPLETED;
      executeCallback(false, true);
    }
  }

  function callBids() {
    startAuctionTimer();
    _auctionStatus = AUCTION_STARTED;
    _auctionStart = Date.now();

    var auctionInit = {
      timestamp: _auctionStart,
      auctionId: _auctionId,
      timeout: _timeout
    };
    events.emit(CONSTANTS.EVENTS.AUCTION_INIT, auctionInit);

    var bidRequests = adaptermanager.makeBidRequests(_adUnits, _auctionStart, _auctionId, _timeout, _labels);
    utils.logInfo('Bids Requested for Auction with id: ' + _auctionId, bidRequests);
    bidRequests.forEach(function (bidRequest) {
      addBidRequests(bidRequest);
    });

    _auctionStatus = AUCTION_IN_PROGRESS;
    adaptermanager.callBids(_adUnits, bidRequests, addBidResponse.bind(this), done.bind(this));
  };

  return {
    addBidReceived: addBidReceived,
    executeCallback: executeCallback,
    callBids: callBids,
    bidsBackAll: bidsBackAll,
    addWinningBid: function addWinningBid(winningBid) {
      _winningBids = _winningBids.concat(winningBid);
    },
    getWinningBids: function getWinningBids() {
      return _winningBids;
    },
    getTimeout: function getTimeout() {
      return _timeout;
    },
    getAuctionId: function getAuctionId() {
      return _auctionId;
    },
    getAuctionStatus: function getAuctionStatus() {
      return _auctionStatus;
    },
    getAdUnits: function getAdUnits() {
      return _adUnits;
    },
    getAdUnitCodes: function getAdUnitCodes() {
      return _adUnitCodes;
    },
    getBidRequests: function getBidRequests() {
      return _bidderRequests;
    },
    getBidsReceived: function getBidsReceived() {
      return _bidsReceived;
    }
  };
}

function doCallbacksIfTimedout(auctionInstance, bidResponse) {
  if (bidResponse.timeToRespond > auctionInstance.getTimeout() + _config.config.getConfig('timeoutBuffer')) {
    auctionInstance.executeCallback(true);
  }
}

// Add a bid to the auction.
function addBidToAuction(auctionInstance, bidResponse) {
  events.emit(CONSTANTS.EVENTS.BID_RESPONSE, bidResponse);
  auctionInstance.addBidReceived(bidResponse);

  doCallbacksIfTimedout(auctionInstance, bidResponse);
}

// Video bids may fail if the cache is down, or there's trouble on the network.
function tryAddVideoBid(auctionInstance, bidResponse, bidRequest) {
  var addBid = true;
  if (_config.config.getConfig('cache.url')) {
    if (!bidResponse.videoCacheKey) {
      addBid = false;
      (0, _videoCache.store)([bidResponse], function (error, cacheIds) {
        if (error) {
          utils.logWarn('Failed to save to the video cache: ' + error + '. Video bid must be discarded.');

          doCallbacksIfTimedout(auctionInstance, bidResponse);
        } else {
          bidResponse.videoCacheKey = cacheIds[0].uuid;
          if (!bidResponse.vastUrl) {
            bidResponse.vastUrl = (0, _videoCache.getCacheUrl)(bidResponse.videoCacheKey);
          }
          // only set this prop after the bid has been cached to avoid early ending auction early in bidsBackAll
          bidRequest.doneCbCallCount += 1;
          addBidToAuction(auctionInstance, bidResponse);
          auctionInstance.bidsBackAll();
        }
      });
    } else if (!bidResponse.vastUrl) {
      utils.logError('videoCacheKey specified but not required vastUrl for video bid');
      addBid = false;
    }
  }
  if (addBid) {
    addBidToAuction(auctionInstance, bidResponse);
  }
}

var addBidResponse = exports.addBidResponse = (0, _hook.createHook)('asyncSeries', function (adUnitCode, bid) {
  var auctionInstance = this;
  var bidRequests = auctionInstance.getBidRequests();
  var auctionId = auctionInstance.getAuctionId();

  var bidRequest = (0, _utils.getBidderRequest)(bidRequests, bid.bidderCode, adUnitCode);
  var bidResponse = getPreparedBidForAuction({ adUnitCode: adUnitCode, bid: bid, bidRequest: bidRequest, auctionId: auctionId });

  if (bidResponse.mediaType === 'video') {
    tryAddVideoBid(auctionInstance, bidResponse, bidRequest);
  } else {
    addBidToAuction(auctionInstance, bidResponse);
  }
}, 'addBidResponse');

// Postprocess the bids so that all the universal properties exist, no matter which bidder they came from.
// This should be called before addBidToAuction().
function getPreparedBidForAuction(_ref2) {
  var adUnitCode = _ref2.adUnitCode,
      bid = _ref2.bid,
      bidRequest = _ref2.bidRequest,
      auctionId = _ref2.auctionId;

  var start = bidRequest.start;

  var bidObject = _extends({}, bid, {
    auctionId: auctionId,
    responseTimestamp: (0, _utils.timestamp)(),
    requestTimestamp: start,
    cpm: parseFloat(bid.cpm) || 0,
    bidder: bid.bidderCode,
    adUnitCode: adUnitCode
  });

  bidObject.timeToRespond = bidObject.responseTimestamp - bidObject.requestTimestamp;

  // Let listeners know that now is the time to adjust the bid, if they want to.
  //
  // CAREFUL: Publishers rely on certain bid properties to be available (like cpm),
  // but others to not be set yet (like priceStrings). See #1372 and #1389.
  events.emit(CONSTANTS.EVENTS.BID_ADJUSTMENT, bidObject);

  // a publisher-defined renderer can be used to render bids
  var bidReq = bidRequest.bids && (0, _find2.default)(bidRequest.bids, function (bid) {
    return bid.adUnitCode == adUnitCode;
  });
  var adUnitRenderer = bidReq && bidReq.renderer;

  if (adUnitRenderer && adUnitRenderer.url) {
    bidObject.renderer = _Renderer.Renderer.install({ url: adUnitRenderer.url });
    bidObject.renderer.setRender(adUnitRenderer.render);
  }

  var priceStringsObj = (0, _cpmBucketManager.getPriceBucketString)(bidObject.cpm, _config.config.getConfig('customPriceBucket'), _config.config.getConfig('currency.granularityMultiplier'));
  bidObject.pbLg = priceStringsObj.low;
  bidObject.pbMg = priceStringsObj.med;
  bidObject.pbHg = priceStringsObj.high;
  bidObject.pbAg = priceStringsObj.auto;
  bidObject.pbDg = priceStringsObj.dense;
  bidObject.pbCg = priceStringsObj.custom;

  // if there is any key value pairs to map do here
  var keyValues;
  if (bidObject.bidderCode && (bidObject.cpm > 0 || bidObject.dealId)) {
    keyValues = getKeyValueTargetingPairs(bidObject.bidderCode, bidObject);
  }

  // use any targeting provided as defaults, otherwise just set from getKeyValueTargetingPairs
  bidObject.adserverTargeting = _extends(bidObject.adserverTargeting || {}, keyValues);

  return bidObject;
}

function getStandardBidderSettings() {
  var granularity = _config.config.getConfig('priceGranularity');
  var bidder_settings = pbjs.bidderSettings;
  if (!bidder_settings[CONSTANTS.JSON_MAPPING.BD_SETTING_STANDARD]) {
    bidder_settings[CONSTANTS.JSON_MAPPING.BD_SETTING_STANDARD] = {};
  }
  if (!bidder_settings[CONSTANTS.JSON_MAPPING.BD_SETTING_STANDARD][CONSTANTS.JSON_MAPPING.ADSERVER_TARGETING]) {
    bidder_settings[CONSTANTS.JSON_MAPPING.BD_SETTING_STANDARD][CONSTANTS.JSON_MAPPING.ADSERVER_TARGETING] = [{
      key: 'hb_bidder',
      val: function val(bidResponse) {
        return bidResponse.bidderCode;
      }
    }, {
      key: 'hb_adid',
      val: function val(bidResponse) {
        return bidResponse.adId;
      }
    }, {
      key: 'hb_pb',
      val: function val(bidResponse) {
        if (granularity === CONSTANTS.GRANULARITY_OPTIONS.AUTO) {
          return bidResponse.pbAg;
        } else if (granularity === CONSTANTS.GRANULARITY_OPTIONS.DENSE) {
          return bidResponse.pbDg;
        } else if (granularity === CONSTANTS.GRANULARITY_OPTIONS.LOW) {
          return bidResponse.pbLg;
        } else if (granularity === CONSTANTS.GRANULARITY_OPTIONS.MEDIUM) {
          return bidResponse.pbMg;
        } else if (granularity === CONSTANTS.GRANULARITY_OPTIONS.HIGH) {
          return bidResponse.pbHg;
        } else if (granularity === CONSTANTS.GRANULARITY_OPTIONS.CUSTOM) {
          return bidResponse.pbCg;
        }
      }
    }, {
      key: 'hb_size',
      val: function val(bidResponse) {
        return bidResponse.size;
      }
    }, {
      key: 'hb_deal',
      val: function val(bidResponse) {
        return bidResponse.dealId;
      }
    }, {
      key: 'hb_source',
      val: function val(bidResponse) {
        return bidResponse.source;
      }
    }, {
      key: 'hb_format',
      val: function val(bidResponse) {
        return bidResponse.mediaType;
      }
    }];
  }
  return bidder_settings[CONSTANTS.JSON_MAPPING.BD_SETTING_STANDARD];
}

function getKeyValueTargetingPairs(bidderCode, custBidObj) {
  if (!custBidObj) {
    return {};
  }

  var keyValues = {};
  var bidder_settings = pbjs.bidderSettings;

  // 1) set the keys from "standard" setting or from prebid defaults
  if (bidder_settings) {
    // initialize default if not set
    var standardSettings = getStandardBidderSettings();
    setKeys(keyValues, standardSettings, custBidObj);

    // 2) set keys from specific bidder setting override if they exist
    if (bidderCode && bidder_settings[bidderCode] && bidder_settings[bidderCode][CONSTANTS.JSON_MAPPING.ADSERVER_TARGETING]) {
      setKeys(keyValues, bidder_settings[bidderCode], custBidObj);
      custBidObj.sendStandardTargeting = bidder_settings[bidderCode].sendStandardTargeting;
    }
  }

  // set native key value targeting
  if (custBidObj['native']) {
    keyValues = _extends({}, keyValues, (0, _native.getNativeTargeting)(custBidObj));
  }

  return keyValues;
}

function setKeys(keyValues, bidderSettings, custBidObj) {
  var targeting = bidderSettings[CONSTANTS.JSON_MAPPING.ADSERVER_TARGETING];
  custBidObj.size = custBidObj.getSize();

  utils._each(targeting, function (kvPair) {
    var key = kvPair.key;
    var value = kvPair.val;

    if (keyValues[key]) {
      utils.logWarn('The key: ' + key + ' is getting ovewritten');
    }

    if (utils.isFn(value)) {
      try {
        value = value(custBidObj);
      } catch (e) {
        utils.logError('bidmanager', 'ERROR', e);
      }
    }

    if ((typeof bidderSettings.suppressEmptyKeys !== 'undefined' && bidderSettings.suppressEmptyKeys === true || key === 'hb_deal') && ( // hb_deal is suppressed automatically if not set
    utils.isEmptyStr(value) || value === null || value === undefined)) {
      utils.logInfo("suppressing empty key '" + key + "' from adserver targeting");
    } else {
      keyValues[key] = value;
    }
  });

  return keyValues;
}

function adjustBids(bid) {
  var code = bid.bidderCode;
  var bidPriceAdjusted = bid.cpm;
  var bidCpmAdjustment = void 0;
  if (pbjs.bidderSettings) {
    if (code && pbjs.bidderSettings[code] && typeof pbjs.bidderSettings[code].bidCpmAdjustment === 'function') {
      bidCpmAdjustment = pbjs.bidderSettings[code].bidCpmAdjustment;
    } else if (pbjs.bidderSettings[CONSTANTS.JSON_MAPPING.BD_SETTING_STANDARD] && typeof pbjs.bidderSettings[CONSTANTS.JSON_MAPPING.BD_SETTING_STANDARD].bidCpmAdjustment === 'function') {
      bidCpmAdjustment = pbjs.bidderSettings[CONSTANTS.JSON_MAPPING.BD_SETTING_STANDARD].bidCpmAdjustment;
    }
    if (bidCpmAdjustment) {
      try {
        bidPriceAdjusted = bidCpmAdjustment(bid.cpm, _extends({}, bid));
      } catch (e) {
        utils.logError('Error during bid adjustment', 'bidmanager.js', e);
      }
    }
  }

  if (bidPriceAdjusted >= 0) {
    bid.cpm = bidPriceAdjusted;
  }
}

/**
 * groupByPlacement is a reduce function that converts an array of Bid objects
 * to an object with placement codes as keys, with each key representing an object
 * with an array of `Bid` objects for that placement
 * @returns {*} as { [adUnitCode]: { bids: [Bid, Bid, Bid] } }
 */
function groupByPlacement(bidsByPlacement, bid) {
  if (!bidsByPlacement[bid.adUnitCode]) {
    bidsByPlacement[bid.adUnitCode] = { bids: [] };
  }
  bidsByPlacement[bid.adUnitCode].bids.push(bid);
  return bidsByPlacement;
}

/**
 * Returns a list of bids that we haven't received a response yet where the bidder did not call done
 * @param {BidRequest[]} bidderRequests List of bids requested for auction instance
 * @param {BidReceived[]} bidsReceived List of bids received for auction instance
 *
 * @typedef {Object} TimedOutBid
 * @property {string} bidId The id representing the bid
 * @property {string} bidder The string name of the bidder
 * @property {string} adUnitCode The code used to uniquely identify the ad unit on the publisher's page
 * @property {string} auctionId The id representing the auction
 *
 * @return {Array<TimedOutBid>} List of bids that Prebid hasn't received a response for
 */
function getTimedOutBids(bidderRequests, bidsReceived) {
  var bidRequestedWithoutDoneCodes = bidderRequests.filter(function (bidderRequest) {
    return !bidderRequest.doneCbCallCount;
  }).map(function (bid) {
    return bid.bidderCode;
  }).filter(_utils.uniques);

  var bidReceivedCodes = bidsReceived.map(function (bid) {
    return bid.bidder;
  }).filter(_utils.uniques);

  var timedOutBidderCodes = bidRequestedWithoutDoneCodes.filter(function (bidder) {
    return !(0, _includes2.default)(bidReceivedCodes, bidder);
  });

  var timedOutBids = bidderRequests.map(function (bid) {
    return (bid.bids || []).filter(function (bid) {
      return (0, _includes2.default)(timedOutBidderCodes, bid.bidder);
    });
  }).reduce(_utils.flatten, []).map(function (bid) {
    return {
      bidId: bid.bidId,
      bidder: bid.bidder,
      adUnitCode: bid.adUnitCode,
      auctionId: bid.auctionId
    };
  });

  return timedOutBids;
}

/***/ }),

/***/ 168:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = store;
exports.getCacheUrl = getCacheUrl;

var _ajax = __webpack_require__(6);

var _config = __webpack_require__(4);

/**
 * @typedef {object} CacheableUrlBid
 * @property {string} vastUrl A URL which loads some valid VAST XML.
 */

/**
 * @typedef {object} CacheablePayloadBid
 * @property {string} vastXml Some VAST XML which loads an ad in a video player.
 */

/**
 * A CacheableBid describes the types which the videoCache can store.
 *
 * @typedef {CacheableUrlBid|CacheablePayloadBid} CacheableBid
 */

/**
 * Function which wraps a URI that serves VAST XML, so that it can be loaded.
 *
 * @param {string} uri The URI where the VAST content can be found.
 * @param {string} impUrl An impression tracker URL for the delivery of the video ad
 * @return A VAST URL which loads XML from the given URI.
 */
/**
 * This module interacts with the server used to cache video ad content to be restored later.
 * At a high level, the expected workflow goes like this:
 *
 *   - Request video ads from Bidders
 *   - Generate IDs for each valid bid, and cache the key/value pair on the server.
 *   - Return these IDs so that publishers can use them to fetch the bids later.
 *
 * This trickery helps integrate with ad servers, which set character limits on request params.
 */

function wrapURI(uri, impUrl) {
  // Technically, this is vulnerable to cross-script injection by sketchy vastUrl bids.
  // We could make sure it's a valid URI... but since we're loading VAST XML from the
  // URL they provide anyway, that's probably not a big deal.
  var vastImp = impUrl ? '<![CDATA[' + impUrl + ']]>' : '';
  return '<VAST version="3.0">\n    <Ad>\n      <Wrapper>\n        <AdSystem>prebid.org wrapper</AdSystem>\n        <VASTAdTagURI><![CDATA[' + uri + ']]></VASTAdTagURI>\n        <Impression>' + vastImp + '</Impression>\n        <Creatives></Creatives>\n      </Wrapper>\n    </Ad>\n  </VAST>';
}

/**
 * Wraps a bid in the format expected by the prebid-server endpoints, or returns null if
 * the bid can't be converted cleanly.
 *
 * @param {CacheableBid} bid
 */
function toStorageRequest(bid) {
  var vastValue = bid.vastXml ? bid.vastXml : wrapURI(bid.vastUrl, bid.vastImpUrl);
  return {
    type: 'xml',
    value: vastValue
  };
}

/**
 * A function which should be called with the results of the storage operation.
 *
 * @callback videoCacheStoreCallback
 *
 * @param {Error} [error] The error, if one occurred.
 * @param {?string[]} uuids An array of unique IDs. The array will have one element for each bid we were asked
 *   to store. It may include null elements if some of the bids were malformed, or an error occurred.
 *   Each non-null element in this array is a valid input into the retrieve function, which will fetch
 *   some VAST XML which can be used to render this bid's ad.
 */

/**
 * A function which bridges the APIs between the videoCacheStoreCallback and our ajax function's API.
 *
 * @param {videoCacheStoreCallback} done A callback to the "store" function.
 * @return {Function} A callback which interprets the cache server's responses, and makes up the right
 *   arguments for our callback.
 */
function shimStorageCallback(done) {
  return {
    success: function success(responseBody) {
      var ids = void 0;
      try {
        ids = JSON.parse(responseBody).responses;
      } catch (e) {
        done(e, []);
        return;
      }

      if (ids) {
        done(null, ids);
      } else {
        done(new Error("The cache server didn't respond with a responses property."), []);
      }
    },
    error: function error(statusText, responseBody) {
      done(new Error('Error storing video ad in the cache: ' + statusText + ': ' + JSON.stringify(responseBody)), []);
    }
  };
}

/**
 * If the given bid is for a Video ad, generate a unique ID and cache it somewhere server-side.
 *
 * @param {CacheableBid[]} bids A list of bid objects which should be cached.
 * @param {videoCacheStoreCallback} [done] An optional callback which should be executed after
 *   the data has been stored in the cache.
 */
function store(bids, done) {
  var requestData = {
    puts: bids.map(toStorageRequest)
  };

  (0, _ajax.ajax)(_config.config.getConfig('cache.url'), shimStorageCallback(done), JSON.stringify(requestData), {
    contentType: 'text/plain',
    withCredentials: true
  });
}

function getCacheUrl(id) {
  return _config.config.getConfig('cache.url') + '?uuid=' + id;
}

/***/ }),

/***/ 17:
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasNonNativeBidder = exports.nativeBidder = exports.nativeAdUnit = exports.NATIVE_TARGETING_KEYS = exports.NATIVE_KEYS = exports.nativeAdapters = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.processNativeAdUnitParams = processNativeAdUnitParams;
exports.nativeBidIsValid = nativeBidIsValid;
exports.fireNativeTrackers = fireNativeTrackers;
exports.getNativeTargeting = getNativeTargeting;

var _utils = __webpack_require__(0);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nativeAdapters = exports.nativeAdapters = [];

var NATIVE_KEYS = exports.NATIVE_KEYS = {
  title: 'hb_native_title',
  body: 'hb_native_body',
  sponsoredBy: 'hb_native_brand',
  image: 'hb_native_image',
  icon: 'hb_native_icon',
  clickUrl: 'hb_native_linkurl',
  cta: 'hb_native_cta'
};

var NATIVE_TARGETING_KEYS = exports.NATIVE_TARGETING_KEYS = Object.keys(NATIVE_KEYS).map(function (key) {
  return NATIVE_KEYS[key];
});

var IMAGE = {
  image: { required: true },
  title: { required: true },
  sponsoredBy: { required: true },
  clickUrl: { required: true },
  body: { required: false },
  icon: { required: false }
};

var SUPPORTED_TYPES = {
  image: IMAGE
};

/**
 * Recieves nativeParams from an adUnit. If the params were not of type 'type',
 * passes them on directly. If they were of type 'type', translate
 * them into the predefined specific asset requests for that type of native ad.
 */
function processNativeAdUnitParams(params) {
  if (params && params.type && typeIsSupported(params.type)) {
    return SUPPORTED_TYPES[params.type];
  }

  return params;
}

/**
 * Check if the native type specified in the adUnit is supported by Prebid.
 */
function typeIsSupported(type) {
  if (!(type && (0, _includes2.default)(Object.keys(SUPPORTED_TYPES), type))) {
    (0, _utils.logError)(type + ' nativeParam is not supported');
    return false;
  }

  return true;
}

/**
 * Helper functions for working with native-enabled adUnits
 * TODO: abstract this and the video helper functions into general
 * adunit validation helper functions
 */
var nativeAdUnit = exports.nativeAdUnit = function nativeAdUnit(adUnit) {
  var mediaType = adUnit.mediaType === 'native';
  var mediaTypes = (0, _utils.deepAccess)(adUnit, 'mediaTypes.native');
  return mediaType || mediaTypes;
};
var nativeBidder = exports.nativeBidder = function nativeBidder(bid) {
  return (0, _includes2.default)(nativeAdapters, bid.bidder);
};
var hasNonNativeBidder = exports.hasNonNativeBidder = function hasNonNativeBidder(adUnit) {
  return adUnit.bids.filter(function (bid) {
    return !nativeBidder(bid);
  }).length;
};

/**
 * Validate that the native assets on this bid contain all assets that were
 * marked as required in the adUnit configuration.
 * @param {Bid} bid Native bid to validate
 * @param {BidRequest[]} bidRequests All bid requests for an auction
 * @return {Boolean} If object is valid
 */
function nativeBidIsValid(bid, bidRequests) {
  var bidRequest = (0, _utils.getBidRequest)(bid.adId, bidRequests);
  if (!bidRequest) {
    return false;
  }

  // all native bid responses must define a landing page url
  if (!(0, _utils.deepAccess)(bid, 'native.clickUrl')) {
    return false;
  }

  if ((0, _utils.deepAccess)(bid, 'native.image')) {
    if (!(0, _utils.deepAccess)(bid, 'native.image.height') || !(0, _utils.deepAccess)(bid, 'native.image.width')) {
      return false;
    }
  }

  if ((0, _utils.deepAccess)(bid, 'native.icon')) {
    if (!(0, _utils.deepAccess)(bid, 'native.icon.height') || !(0, _utils.deepAccess)(bid, 'native.icon.width')) {
      return false;
    }
  }

  var requestedAssets = bidRequest.nativeParams;
  if (!requestedAssets) {
    return true;
  }

  var requiredAssets = Object.keys(requestedAssets).filter(function (key) {
    return requestedAssets[key].required;
  });
  var returnedAssets = Object.keys(bid['native']).filter(function (key) {
    return bid['native'][key];
  });

  return requiredAssets.every(function (asset) {
    return (0, _includes2.default)(returnedAssets, asset);
  });
}

/*
 * Native responses may have associated impression or click trackers.
 * This retrieves the appropriate tracker urls for the given ad object and
 * fires them. As a native creatives may be in a cross-origin frame, it may be
 * necessary to invoke this function via postMessage. secureCreatives is
 * configured to fire this function when it receives a `message` of 'Prebid Native'
 * and an `adId` with the value of the `bid.adId`. When a message is posted with
 * these parameters, impression trackers are fired. To fire click trackers, the
 * message should contain an `action` set to 'click'.
 *
 * // Native creative template example usage
 * <a href="%%CLICK_URL_UNESC%%%%PATTERN:hb_native_linkurl%%"
 *    target="_blank"
 *    onclick="fireTrackers('click')">
 *    %%PATTERN:hb_native_title%%
 * </a>
 *
 * <script>
 *   function fireTrackers(action) {
 *     var message = {message: 'Prebid Native', adId: '%%PATTERN:hb_adid%%'};
 *     if (action === 'click') {message.action = 'click';} // fires click trackers
 *     window.parent.postMessage(JSON.stringify(message), '*');
 *   }
 *   fireTrackers(); // fires impressions when creative is loaded
 * </script>
 */
function fireNativeTrackers(message, adObject) {
  var trackers = void 0;

  if (message.action === 'click') {
    trackers = adObject['native'] && adObject['native'].clickTrackers;
  } else {
    trackers = adObject['native'] && adObject['native'].impressionTrackers;

    if (adObject['native'] && adObject['native'].javascriptTrackers) {
      (0, _utils.insertHtmlIntoIframe)(adObject['native'].javascriptTrackers);
    }
  }

  (trackers || []).forEach(_utils.triggerPixel);
}

/**
 * Gets native targeting key-value paris
 * @param {Object} bid
 * @return {Object} targeting
 */
function getNativeTargeting(bid) {
  var keyValues = {};

  Object.keys(bid['native']).forEach(function (asset) {
    var key = NATIVE_KEYS[asset];
    var value = bid['native'][asset];

    // native image-type assets can be a string or an object with a url prop
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.url) {
      value = value.url;
    }

    if (key) {
      keyValues[key] = value;
    }
  });

  return keyValues;
}

/***/ }),

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

/**
 Required paramaters
 bidderCode,
 height,
 width,
 statusCode
 Optional paramaters
 adId,
 cpm,
 ad,
 adUrl,
 dealId,
 priceKeyString;
 */
function Bid(statusCode, bidRequest) {
  var _bidId = bidRequest && bidRequest.bidId || utils.getUniqueIdentifierStr();
  var _bidSrc = bidRequest && bidRequest.src || 'client';
  var _statusCode = statusCode || 0;

  this.bidderCode = bidRequest && bidRequest.bidder || '';
  this.width = 0;
  this.height = 0;
  this.statusMessage = _getStatus();
  this.adId = _bidId;
  this.mediaType = 'banner';
  this.source = _bidSrc;

  function _getStatus() {
    switch (_statusCode) {
      case 0:
        return 'Pending';
      case 1:
        return 'Bid available';
      case 2:
        return 'Bid returned empty or error response';
      case 3:
        return 'Bid timed out';
    }
  }

  this.getStatusCode = function () {
    return _statusCode;
  };

  // returns the size of the bid creative. Concatenation of width and height by ‘x’.
  this.getSize = function () {
    return this.width + 'x' + this.height;
  };
}

// Bid factory function.
exports.createBid = function (statusCode, bidRequest) {
  return new Bid(statusCode, bidRequest);
};

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = {"JSON_MAPPING":{"PL_CODE":"code","PL_SIZE":"sizes","PL_BIDS":"bids","BD_BIDDER":"bidder","BD_ID":"paramsd","BD_PL_ID":"placementId","ADSERVER_TARGETING":"adserverTargeting","BD_SETTING_STANDARD":"standard"},"REPO_AND_VERSION":"Wikia_prebid_1.11.0","DEBUG_MODE":"pbjs_debug","STATUS":{"GOOD":1,"NO_BID":2},"CB":{"TYPE":{"ALL_BIDS_BACK":"allRequestedBidsBack","AD_UNIT_BIDS_BACK":"adUnitBidsBack","BID_WON":"bidWon","REQUEST_BIDS":"requestBids"}},"EVENTS":{"AUCTION_INIT":"auctionInit","AUCTION_END":"auctionEnd","BID_ADJUSTMENT":"bidAdjustment","BID_TIMEOUT":"bidTimeout","BID_REQUESTED":"bidRequested","BID_RESPONSE":"bidResponse","BID_WON":"bidWon","BIDDER_DONE":"bidderDone","SET_TARGETING":"setTargeting","REQUEST_BIDS":"requestBids","ADD_AD_UNITS":"addAdUnits","AD_RENDER_FAILED":"adRenderFailed"},"AD_RENDER_FAILED_REASON":{"PREVENT_WRITING_ON_MAIN_DOCUMENT":"preventWritingOnMainDocuemnt","NO_AD":"noAd","EXCEPTION":"exception","CANNOT_FIND_AD":"cannotFindAd","MISSING_DOC_OR_ADID":"missingDocOrAdid"},"EVENT_ID_PATHS":{"bidWon":"adUnitCode"},"GRANULARITY_OPTIONS":{"LOW":"low","MEDIUM":"medium","HIGH":"high","AUTO":"auto","DENSE":"dense","CUSTOM":"custom"},"TARGETING_KEYS":["hb_bidder","hb_adid","hb_pb","hb_size","hb_deal","hb_source","hb_format"],"S2S":{"SRC":"s2s","SYNCED_BIDDERS_KEY":"pbjsSyncs"}}

/***/ }),

/***/ 20:
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.createHook = createHook;

/**
 * @typedef {function} HookedFunction
 * @property {function(function(), [number])} addHook A method that takes a new function to attach as a hook
 *  to the HookedFunction
 * @property {function(function())} removeHook A method to remove attached hooks
 */

/**
 * A map of global hook methods to allow easy extension of hooked functions that are intended to be extended globally
 * @type {{}}
 */
var hooks = exports.hooks = {};

/**
 * A utility function for allowing a regular function to be extensible with additional hook functions
 * @param {string} type The method for applying all attached hooks when this hooked function is called
 * @param {function()} fn The function to make hookable
 * @param {string} hookName If provided this allows you to register a name for a global hook to have easy access to
 *  the addHook and removeHook methods for that hook (which are usually accessed as methods on the function itself)
 * @returns {HookedFunction} A new function that implements the HookedFunction interface
 */
function createHook(type, fn, hookName) {
  var _hooks = [{ fn: fn, priority: 0 }];

  var types = {
    sync: function sync() {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _hooks.forEach(function (hook) {
        hook.fn.apply(_this, args);
      });
    },
    asyncSeries: function asyncSeries() {
      var _this2 = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var curr = 0;

      var asyncSeriesNext = function asyncSeriesNext() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        var hook = _hooks[++curr];
        if ((typeof hook === 'undefined' ? 'undefined' : _typeof(hook)) === 'object' && typeof hook.fn === 'function') {
          return hook.fn.apply(_this2, args.concat(asyncSeriesNext));
        }
      };

      return _hooks[curr].fn.apply(this, args.concat(asyncSeriesNext));
    }
  };

  if (!types[type]) {
    throw 'invalid hook type';
  }

  var methods = {
    addHook: function addHook(fn) {
      var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

      if (typeof fn === 'function') {
        _hooks.push({
          fn: fn,
          priority: priority
        });

        _hooks.sort(function (a, b) {
          return b.priority - a.priority;
        });
      }
    },
    removeHook: function removeHook(removeFn) {
      _hooks = _hooks.filter(function (hook) {
        return hook.fn === fn || hook.fn !== removeFn;
      });
    }
  };

  if (typeof hookName === 'string') {
    hooks[hookName] = methods;
  }

  function hookedFn() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    if (_hooks.length === 1 && _hooks[0].fn === fn) {
      return fn.apply(this, args);
    }
    return types[type].apply(this, args);
  }

  return _extends(hookedFn, methods);
}

/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(101);
module.exports = __webpack_require__(15).Array.findIndex;


/***/ }),

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(29)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 24:
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),

/***/ 25:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Adapter;
function Adapter(code) {
  var bidderCode = code;

  function setBidderCode(code) {
    bidderCode = code;
  }

  function getBidderCode() {
    return bidderCode;
  }

  function callBids() {}

  return {
    callBids: callBids,
    setBidderCode: setBidderCode,
    getBidderCode: getBidderCode
  };
}

/***/ }),

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auctionManager = undefined;
exports.newAuctionManager = newAuctionManager;

var _utils = __webpack_require__(0);

var _auction = __webpack_require__(167);

var _find = __webpack_require__(10);

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONSTANTS = __webpack_require__(2);

/**
 * Creates new instance of auctionManager. There will only be one instance of auctionManager but
 * a factory is created to assist in testing.
 *
 * @returns {AuctionManager} auctionManagerInstance
 */
/**
 * AuctionManager modules is responsible for creating auction instances.
 * This module is the gateway for Prebid core to access auctions.
 * It stores all created instances of auction and can be used to get consolidated values from auction.
 */

/**
 * @typedef {Object} AuctionManager
 *
 * @property {function(): Array} getBidsRequested - returns consolidated bid requests
 * @property {function(): Array} getBidsReceived - returns consolidated bid received
 * @property {function(): Array} getAdUnits - returns consolidated adUnits
 * @property {function(): Array} getAdUnitCodes - returns consolidated adUnitCodes
 * @property {function(): Object} createAuction - creates auction instance and stores it for future reference
 * @property {function(): Object} findBidByAdId - find bid received by adId. This function will be called by pbjs.renderAd
 * @property {function(): Object} getStandardBidderAdServerTargeting - returns standard bidder targeting for all the adapters. Refer http://prebid.org/dev-docs/publisher-api-reference.html#module_pbjs.bidderSettings for more details
 */

function newAuctionManager() {
  var _auctions = [];
  var auctionManager = {};

  auctionManager.addWinningBid = function (bid) {
    var auction = (0, _find2.default)(_auctions, function (auction) {
      return auction.getAuctionId() === bid.auctionId;
    });
    if (auction) {
      auction.addWinningBid(bid);
    } else {
      utils.logWarn('Auction not found when adding winning bid');
    }
  };

  auctionManager.getAllWinningBids = function () {
    return _auctions.map(function (auction) {
      return auction.getWinningBids();
    }).reduce(_utils.flatten, []);
  };

  auctionManager.getBidsRequested = function () {
    return _auctions.map(function (auction) {
      return auction.getBidRequests();
    }).reduce(_utils.flatten, []);
  };

  auctionManager.getBidsReceived = function () {
    // As of now, an old bid which is not used in auction 1 can be used in auction n.
    // To prevent this, bid.ttl (time to live) will be added to this logic and bid pool will also be added
    // As of now none of the adapters are sending back bid.ttl
    return _auctions.map(function (auction) {
      if (auction.getAuctionStatus() === _auction.AUCTION_COMPLETED) {
        return auction.getBidsReceived();
      }
    }).reduce(_utils.flatten, []).filter(function (bid) {
      return bid;
    });
  };

  auctionManager.getAdUnits = function () {
    return _auctions.map(function (auction) {
      return auction.getAdUnits();
    }).reduce(_utils.flatten, []);
  };

  auctionManager.getAdUnitCodes = function () {
    return _auctions.map(function (auction) {
      return auction.getAdUnitCodes();
    }).reduce(_utils.flatten, []).filter(_utils.uniques);
  };

  auctionManager.createAuction = function (_ref) {
    var adUnits = _ref.adUnits,
        adUnitCodes = _ref.adUnitCodes,
        callback = _ref.callback,
        cbTimeout = _ref.cbTimeout,
        labels = _ref.labels;

    var auction = (0, _auction.newAuction)({ adUnits: adUnits, adUnitCodes: adUnitCodes, callback: callback, cbTimeout: cbTimeout, labels: labels });
    _addAuction(auction);
    return auction;
  };

  auctionManager.findBidByAdId = function (adId) {
    return (0, _find2.default)(_auctions.map(function (auction) {
      return auction.getBidsReceived();
    }).reduce(_utils.flatten, []), function (bid) {
      return bid.adId === adId;
    });
  };

  auctionManager.getStandardBidderAdServerTargeting = function () {
    return (0, _auction.getStandardBidderSettings)()[CONSTANTS.JSON_MAPPING.ADSERVER_TARGETING];
  };

  function _addAuction(auction) {
    _auctions.push(auction);
  }

  return auctionManager;
}

var auctionManager = exports.auctionManager = newAuctionManager();

/***/ }),

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidPriceConfig = exports.getPriceBucketString = undefined;

var _find = __webpack_require__(10);

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = __webpack_require__(0);

var _defaultPrecision = 2;
var _lgPriceConfig = {
  'buckets': [{
    'min': 0,
    'max': 5,
    'increment': 0.5
  }]
};
var _mgPriceConfig = {
  'buckets': [{
    'min': 0,
    'max': 20,
    'increment': 0.1
  }]
};
var _hgPriceConfig = {
  'buckets': [{
    'min': 0,
    'max': 20,
    'increment': 0.01
  }]
};
var _densePriceConfig = {
  'buckets': [{
    'min': 0,
    'max': 3,
    'increment': 0.01
  }, {
    'min': 3,
    'max': 8,
    'increment': 0.05
  }, {
    'min': 8,
    'max': 20,
    'increment': 0.5
  }]
};
var _autoPriceConfig = {
  'buckets': [{
    'min': 0,
    'max': 5,
    'increment': 0.05
  }, {
    'min': 5,
    'max': 10,
    'increment': 0.1
  }, {
    'min': 10,
    'max': 20,
    'increment': 0.5
  }]
};

function getPriceBucketString(cpm, customConfig) {
  var granularityMultiplier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var cpmFloat = parseFloat(cpm);
  if (isNaN(cpmFloat)) {
    cpmFloat = '';
  }

  return {
    low: cpmFloat === '' ? '' : getCpmStringValue(cpm, _lgPriceConfig, granularityMultiplier),
    med: cpmFloat === '' ? '' : getCpmStringValue(cpm, _mgPriceConfig, granularityMultiplier),
    high: cpmFloat === '' ? '' : getCpmStringValue(cpm, _hgPriceConfig, granularityMultiplier),
    auto: cpmFloat === '' ? '' : getCpmStringValue(cpm, _autoPriceConfig, granularityMultiplier),
    dense: cpmFloat === '' ? '' : getCpmStringValue(cpm, _densePriceConfig, granularityMultiplier),
    custom: cpmFloat === '' ? '' : getCpmStringValue(cpm, customConfig, granularityMultiplier)
  };
}

function getCpmStringValue(cpm, config, granularityMultiplier) {
  var cpmStr = '';
  if (!isValidPriceConfig(config)) {
    return cpmStr;
  }
  var cap = config.buckets.reduce(function (prev, curr) {
    if (prev.max > curr.max) {
      return prev;
    }
    return curr;
  }, {
    'max': 0
  });
  var bucket = (0, _find2.default)(config.buckets, function (bucket) {
    if (cpm > cap.max * granularityMultiplier) {
      // cpm exceeds cap, just return the cap.
      var precision = bucket.precision;
      if (typeof precision === 'undefined') {
        precision = _defaultPrecision;
      }
      cpmStr = (bucket.max * granularityMultiplier).toFixed(precision);
    } else if (cpm <= bucket.max * granularityMultiplier && cpm >= bucket.min * granularityMultiplier) {
      return bucket;
    }
  });
  if (bucket) {
    cpmStr = getCpmTarget(cpm, bucket, granularityMultiplier);
  }
  return cpmStr;
}

function isValidPriceConfig(config) {
  if (utils.isEmpty(config) || !config.buckets || !Array.isArray(config.buckets)) {
    return false;
  }
  var isValid = true;
  config.buckets.forEach(function (bucket) {
    if (typeof bucket.min === 'undefined' || !bucket.max || !bucket.increment) {
      isValid = false;
    }
  });
  return isValid;
}

function getCpmTarget(cpm, bucket, granularityMultiplier) {
  var precision = typeof bucket.precision !== 'undefined' ? bucket.precision : _defaultPrecision;
  var increment = bucket.increment * granularityMultiplier;
  var bucketMin = bucket.min * granularityMultiplier;

  // start increments at the bucket min and then add bucket min back to arrive at the correct rounding
  var cpmTarget = Math.floor((cpm - bucketMin) / increment) * increment + bucketMin;
  // force to 10 decimal places to deal with imprecise decimal/binary conversions
  //    (for example 0.1 * 3 = 0.30000000000000004)
  cpmTarget = Number(cpmTarget.toFixed(10));
  return cpmTarget.toFixed(precision);
}

exports.getPriceBucketString = getPriceBucketString;
exports.isValidPriceConfig = isValidPriceConfig;

/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(43);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 29:
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This file contains the valid Media Types in Prebid.
 *
 * All adapters are assumed to support banner ads. Other media types are specified by Adapters when they
 * register themselves with prebid-core.
 */

/**
 * @typedef {('native'|'video'|'banner')} MediaType
 */

/** @type MediaType */
var NATIVE = exports.NATIVE = 'native';
/** @type MediaType */
var VIDEO = exports.VIDEO = 'video';
/** @type MediaType */
var BANNER = exports.BANNER = 'banner';

/***/ }),

/***/ 30:
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(28);
var IObject = __webpack_require__(31);
var toObject = __webpack_require__(52);
var toLength = __webpack_require__(34);
var asc = __webpack_require__(53);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(32);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ 32:
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ 33:
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(35);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ 35:
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(32);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobal = getGlobal;
// if pbjs already exists in global document scope, use it, if not, create the object
// global defination should happen BEFORE imports to avoid global undefined errors.
window.pbjs = window.pbjs || {};
window.pbjs.cmd = window.pbjs.cmd || [];
window.pbjs.que = window.pbjs.que || [];

function getGlobal() {
  return window.pbjs;
}

/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.targeting = exports.getOldestBid = exports.isBidExpired = exports.RENDERED = exports.BID_TARGETING_SET = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.newTargeting = newTargeting;

var _utils = __webpack_require__(0);

var _config = __webpack_require__(4);

var _native = __webpack_require__(18);

var _auctionManager = __webpack_require__(26);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var utils = __webpack_require__(0);
var CONSTANTS = __webpack_require__(2);

var pbTargetingKeys = [];

var BID_TARGETING_SET = exports.BID_TARGETING_SET = 'targetingSet';
var RENDERED = exports.RENDERED = 'rendered';

var MAX_DFP_KEYLENGTH = 20;
var TTL_BUFFER = 1000;

// return unexpired bids
var isBidExpired = exports.isBidExpired = function isBidExpired(bid) {
  return bid.responseTimestamp + bid.ttl * 1000 + TTL_BUFFER > (0, _utils.timestamp)();
};

// return bids whose status is not set. Winning bid can have status `targetingSet` or `rendered`.
var isUnusedBid = function isUnusedBid(bid) {
  return bid && (bid.status && !(0, _includes2.default)([BID_TARGETING_SET, RENDERED], bid.status) || !bid.status);
};

// If two bids are found for same adUnitCode, we will use the latest one to take part in auction
// This can happen in case of concurrent auctions
var getOldestBid = exports.getOldestBid = function getOldestBid(bid, i, arr) {
  var oldestBid = true;
  arr.forEach(function (val, j) {
    if (i === j) return;
    if (bid.bidder === val.bidder && bid.adUnitCode === val.adUnitCode && bid.responseTimestamp > val.responseTimestamp) {
      oldestBid = false;
    }
  });
  return oldestBid;
};

/**
 * @typedef {Object.<string,string>} targeting
 * @property {string} targeting_key
 */

/**
 * @typedef {Object.<string,Object.<string,string[]>[]>[]} targetingArray
 */

function newTargeting(auctionManager) {
  var targeting = {};

  targeting.resetPresetTargeting = function (adUnitCode) {
    if ((0, _utils.isGptPubadsDefined)()) {
      var adUnitCodes = getAdUnitCodes(adUnitCode);
      var adUnits = auctionManager.getAdUnits().filter(function (adUnit) {
        return (0, _includes2.default)(adUnitCodes, adUnit.code);
      });
      window.googletag.pubads().getSlots().forEach(function (slot) {
        pbTargetingKeys.forEach(function (key) {
          // reset only registered adunits
          adUnits.forEach(function (unit) {
            if (unit.code === slot.getAdUnitPath() || unit.code === slot.getSlotElementId()) {
              slot.setTargeting(key, null);
            }
          });
        });
      });
    }
  };

  /**
   * Returns all ad server targeting for all ad units.
   * @param {string=} adUnitCode
   * @return {Object.<string,targeting>} targeting
   */
  targeting.getAllTargeting = function (adUnitCode) {
    var bidsReceived = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getBidsReceived();

    var adUnitCodes = getAdUnitCodes(adUnitCode);

    // Get targeting for the winning bid. Add targeting for any bids that have
    // `alwaysUseBid=true`. If sending all bids is enabled, add targeting for losing bids.
    var targeting = getWinningBidTargeting(adUnitCodes, bidsReceived).concat(getCustomBidTargeting(adUnitCodes, bidsReceived)).concat(_config.config.getConfig('enableSendAllBids') ? getBidLandscapeTargeting(adUnitCodes, bidsReceived) : []);

    // store a reference of the targeting keys
    targeting.map(function (adUnitCode) {
      Object.keys(adUnitCode).map(function (key) {
        adUnitCode[key].map(function (targetKey) {
          if (pbTargetingKeys.indexOf(Object.keys(targetKey)[0]) === -1) {
            pbTargetingKeys = Object.keys(targetKey).concat(pbTargetingKeys);
          }
        });
      });
    });

    targeting = flattenTargeting(targeting);
    return targeting;
  };

  /**
   * Converts targeting array and flattens to make it easily iteratable
   * e.g: Sample input to this function
   * ```
   * [
   *    {
   *      "div-gpt-ad-1460505748561-0": [{"hb_bidder": ["appnexusAst"]}]
   *    },
   *    {
   *      "div-gpt-ad-1460505748561-0": [{"hb_bidder_appnexusAs": ["appnexusAst"]}]
   *    }
   * ]
   * ```
   * Resulting array
   * ```
   * {
   *  "div-gpt-ad-1460505748561-0": {
   *    "hb_bidder": "appnexusAst",
   *    "hb_bidder_appnexusAs": "appnexusAst"
   *  }
   * }
   * ```
   *
   * @param {targetingArray}  targeting
   * @return {Object.<string,targeting>}  targeting
   */
  function flattenTargeting(targeting) {
    var targetingObj = targeting.map(function (targeting) {
      return _defineProperty({}, Object.keys(targeting)[0], targeting[Object.keys(targeting)[0]].map(function (target) {
        return _defineProperty({}, Object.keys(target)[0], target[Object.keys(target)[0]].join(', '));
      }).reduce(function (p, c) {
        return _extends(c, p);
      }, {}));
    }).reduce(function (accumulator, targeting) {
      var key = Object.keys(targeting)[0];
      accumulator[key] = _extends({}, accumulator[key], targeting[key]);
      return accumulator;
    }, {});
    return targetingObj;
  }

  /**
   * Sets targeting for DFP
   * @param {Object.<string,Object.<string,string>>} targetingConfig
   */
  targeting.setTargetingForGPT = function (targetingConfig) {
    window.googletag.pubads().getSlots().forEach(function (slot) {
      Object.keys(targetingConfig).filter((0, _utils.isAdUnitCodeMatchingSlot)(slot)).forEach(function (targetId) {
        return Object.keys(targetingConfig[targetId]).forEach(function (key) {
          var valueArr = targetingConfig[targetId][key].split(',');
          valueArr = valueArr.length > 1 ? [valueArr] : valueArr;
          valueArr.map(function (value) {
            utils.logMessage('Attempting to set key value for slot: ' + slot.getSlotElementId() + ' key: ' + key + ' value: ' + value);
            return value;
          }).forEach(function (value) {
            slot.setTargeting(key, value);
          });
        });
      });
    });
  };

  /**
   * normlizes input to a `adUnit.code` array
   * @param  {(string|string[])} adUnitCode [description]
   * @return {string[]}     AdUnit code array
   */
  function getAdUnitCodes(adUnitCode) {
    if (typeof adUnitCode === 'string') {
      return [adUnitCode];
    } else if (utils.isArray(adUnitCode)) {
      return adUnitCode;
    }
    return auctionManager.getAdUnitCodes() || [];
  }

  function getBidsReceived() {
    return auctionManager.getBidsReceived().filter(isUnusedBid).filter(exports.isBidExpired).filter(getOldestBid);
  }

  /**
   * Returns top bids for a given adUnit or set of adUnits.
   * @param  {(string|string[])} adUnitCode adUnitCode or array of adUnitCodes
   * @return {[type]}            [description]
   */
  targeting.getWinningBids = function (adUnitCode) {
    var bidsReceived = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getBidsReceived();

    var adUnitCodes = getAdUnitCodes(adUnitCode);

    return bidsReceived.filter(function (bid) {
      return (0, _includes2.default)(adUnitCodes, bid.adUnitCode);
    }).filter(function (bid) {
      return bid.cpm > 0;
    }).map(function (bid) {
      return bid.adUnitCode;
    }).filter(_utils.uniques).map(function (adUnitCode) {
      return bidsReceived.filter(function (bid) {
        return bid.adUnitCode === adUnitCode ? bid : null;
      }).reduce(_utils.getHighestCpm, getEmptyBid(adUnitCode));
    });
  };

  /**
   * Sets targeting for AST
   */
  targeting.setTargetingForAst = function () {
    var astTargeting = targeting.getAllTargeting();
    Object.keys(astTargeting).forEach(function (targetId) {
      return Object.keys(astTargeting[targetId]).forEach(function (key) {
        utils.logMessage('Attempting to set targeting for targetId: ' + targetId + ' key: ' + key + ' value: ' + astTargeting[targetId][key]);
        // setKeywords supports string and array as value
        if (utils.isStr(astTargeting[targetId][key]) || utils.isArray(astTargeting[targetId][key])) {
          var keywordsObj = {};
          keywordsObj[key.toUpperCase()] = astTargeting[targetId][key];
          window.apntag.setKeywords(targetId, keywordsObj);
        }
      });
    });
  };

  /**
   * Get targeting key value pairs for winning bid.
   * @param {string[]}    AdUnit code array
   * @return {targetingArray}   winning bids targeting
   */
  function getWinningBidTargeting(adUnitCodes, bidsReceived) {
    var winners = targeting.getWinningBids(adUnitCodes, bidsReceived);
    winners.forEach(function (winner) {
      winner.status = BID_TARGETING_SET;
    });

    // TODO : Add losing bids to pool from here ?
    var standardKeys = getStandardKeys();

    winners = winners.map(function (winner) {
      return _defineProperty({}, winner.adUnitCode, Object.keys(winner.adserverTargeting).filter(function (key) {
        return typeof winner.sendStandardTargeting === 'undefined' || winner.sendStandardTargeting || standardKeys.indexOf(key) === -1;
      }).map(function (key) {
        return _defineProperty({}, key === 'hb_deal' ? (key + '_' + winner.bidderCode).substring(0, MAX_DFP_KEYLENGTH) : key.substring(0, MAX_DFP_KEYLENGTH), [winner.adserverTargeting[key]]);
      }));
    });

    return winners;
  }

  function getStandardKeys() {
    return auctionManager.getStandardBidderAdServerTargeting() // in case using a custom standard key set
    .map(function (targeting) {
      return targeting.key;
    }).concat(CONSTANTS.TARGETING_KEYS).filter(_utils.uniques); // standard keys defined in the library.
  }

  /**
   * Merge custom adserverTargeting with same key name for same adUnitCode.
   * e.g: Appnexus defining custom keyvalue pair foo:bar and Rubicon defining custom keyvalue pair foo:baz will be merged to foo: ['bar','baz']
   *
   * @param {Object[]} acc Accumulator for reducer. It will store updated bidResponse objects
   * @param {Object} bid BidResponse
   * @param {number} index current index
   * @param {Array} arr original array
   */
  function mergeAdServerTargeting(acc, bid, index, arr) {
    function concatTargetingValue(key) {
      return function (currentBidElement) {
        if (!utils.isArray(currentBidElement.adserverTargeting[key])) {
          currentBidElement.adserverTargeting[key] = [currentBidElement.adserverTargeting[key]];
        }
        currentBidElement.adserverTargeting[key] = currentBidElement.adserverTargeting[key].concat(bid.adserverTargeting[key]).filter(_utils.uniques);
        delete bid.adserverTargeting[key];
      };
    }

    function hasSameAdunitCodeAndKey(key) {
      return function (currentBidElement) {
        return currentBidElement.adUnitCode === bid.adUnitCode && currentBidElement.adserverTargeting[key];
      };
    }

    Object.keys(bid.adserverTargeting).filter(getCustomKeys()).forEach(function (key) {
      if (acc.length) {
        acc.filter(hasSameAdunitCodeAndKey(key)).forEach(concatTargetingValue(key));
      }
    });
    acc.push(bid);
    return acc;
  }

  function getCustomKeys() {
    var standardKeys = getStandardKeys();
    return function (key) {
      return standardKeys.indexOf(key) === -1;
    };
  }

  function truncateCustomKeys(bid) {
    return _defineProperty({}, bid.adUnitCode, Object.keys(bid.adserverTargeting)
    // Get only the non-standard keys of the losing bids, since we
    // don't want to override the standard keys of the winning bid.
    .filter(getCustomKeys()).map(function (key) {
      return _defineProperty({}, key.substring(0, MAX_DFP_KEYLENGTH), [bid.adserverTargeting[key]]);
    }));
  }

  /**
   * Get custom targeting key value pairs for bids.
   * @param {string[]}    AdUnit code array
   * @return {targetingArray}   bids with custom targeting defined in bidderSettings
   */
  function getCustomBidTargeting(adUnitCodes, bidsReceived) {
    return bidsReceived.filter(function (bid) {
      return (0, _includes2.default)(adUnitCodes, bid.adUnitCode);
    }).map(function (bid) {
      return _extends({}, bid);
    }).reduce(mergeAdServerTargeting, []).map(truncateCustomKeys).filter(function (bid) {
      return bid;
    }); // removes empty elements in array;
  }

  /**
   * Get targeting key value pairs for non-winning bids.
   * @param {string[]}    AdUnit code array
   * @return {targetingArray}   all non-winning bids targeting
   */
  function getBidLandscapeTargeting(adUnitCodes, bidsReceived) {
    var standardKeys = CONSTANTS.TARGETING_KEYS.concat(_native.NATIVE_TARGETING_KEYS);
    var bids = [];
    // bucket by adUnitcode
    var buckets = (0, _utils.groupBy)(bidsReceived, 'adUnitCode');
    // filter top bid for each bucket by bidder
    Object.keys(buckets).forEach(function (bucketKey) {
      var bidsByBidder = (0, _utils.groupBy)(buckets[bucketKey], 'bidderCode');
      Object.keys(bidsByBidder).forEach(function (key) {
        return bids.push(bidsByBidder[key].reduce(_utils.getHighestCpm, getEmptyBid()));
      });
    });
    // populate targeting keys for the remaining bids
    return bids.map(function (bid) {
      if (bid.adserverTargeting && adUnitCodes && (utils.isArray(adUnitCodes) && (0, _includes2.default)(adUnitCodes, bid.adUnitCode) || typeof adUnitCodes === 'string' && bid.adUnitCode === adUnitCodes)) {
        return _defineProperty({}, bid.adUnitCode, getTargetingMap(bid, standardKeys.filter(function (key) {
          return typeof bid.adserverTargeting[key] !== 'undefined';
        })));
      }
    }).filter(function (bid) {
      return bid;
    }); // removes empty elements in array
  }

  function getTargetingMap(bid, keys) {
    return keys.map(function (key) {
      return _defineProperty({}, (key + '_' + bid.bidderCode).substring(0, MAX_DFP_KEYLENGTH), [bid.adserverTargeting[key]]);
    });
  }

  targeting.isApntagDefined = function () {
    if (window.apntag && utils.isFn(window.apntag.setKeywords)) {
      return true;
    }
  };

  function getEmptyBid(adUnitCode) {
    return {
      adUnitCode: adUnitCode,
      cpm: 0,
      adserverTargeting: {},
      timeToRespond: 0
    };
  }
  return targeting;
}

var targeting = exports.targeting = newTargeting(_auctionManager.auctionManager);

/***/ }),

/***/ 39:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.RANDOM = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                               * Module for getting and setting Prebid configuration.
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * Prebid previously defined these properties directly on the global object:
                                                                                                                                                                                                                                                                               * pbjs.logging = true;
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * Defining and access properties in this way is now deprecated, but these will
                                                                                                                                                                                                                                                                               * continue to work during a deprecation window.
                                                                                                                                                                                                                                                                               */


exports.newConfig = newConfig;

var _cpmBucketManager = __webpack_require__(27);

var _find = __webpack_require__(10);

var _find2 = _interopRequireDefault(_find);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

var _hook = __webpack_require__(21);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var utils = __webpack_require__(0);

var DEFAULT_DEBUG = false;
var DEFAULT_BIDDER_TIMEOUT = 3000;
var DEFAULT_PUBLISHER_DOMAIN = window.location.origin;
var DEFAULT_COOKIESYNC_DELAY = 100;
var DEFAULT_ENABLE_SEND_ALL_BIDS = true;

var DEFAULT_TIMEOUTBUFFER = 200;

var RANDOM = exports.RANDOM = 'random';
var FIXED = 'fixed';

var VALID_ORDERS = {};
VALID_ORDERS[RANDOM] = true;
VALID_ORDERS[FIXED] = true;

var DEFAULT_BIDDER_SEQUENCE = RANDOM;

var GRANULARITY_OPTIONS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  AUTO: 'auto',
  DENSE: 'dense',
  CUSTOM: 'custom'
};

var ALL_TOPICS = '*';

/**
 * @typedef {object} PrebidConfig
 *
 * @property {string} cache.url Set a url if we should use prebid-cache to store video bids before adding
 *   bids to the auction. **NOTE** This must be set if you want to use the dfpAdServerVideo module.
 */

function newConfig() {
  var listeners = [];
  var defaults = void 0;
  var config = void 0;

  function resetConfig() {
    defaults = {};
    config = {
      // `debug` is equivalent to legacy `pbjs.logging` property
      _debug: DEFAULT_DEBUG,
      get debug() {
        return this._debug;
      },
      set debug(val) {
        this._debug = val;
      },

      // default timeout for all bids
      _bidderTimeout: DEFAULT_BIDDER_TIMEOUT,
      get bidderTimeout() {
        return this._bidderTimeout;
      },
      set bidderTimeout(val) {
        this._bidderTimeout = val;
      },

      // domain where prebid is running for cross domain iframe communication
      _publisherDomain: DEFAULT_PUBLISHER_DOMAIN,
      get publisherDomain() {
        return this._publisherDomain;
      },
      set publisherDomain(val) {
        this._publisherDomain = val;
      },

      // delay to request cookie sync to stay out of critical path
      _cookieSyncDelay: DEFAULT_COOKIESYNC_DELAY,
      get cookieSyncDelay() {
        return pbjs.cookieSyncDelay || this._cookieSyncDelay;
      },
      set cookieSyncDelay(val) {
        this._cookieSyncDelay = val;
      },

      // calls existing function which may be moved after deprecation
      _priceGranularity: GRANULARITY_OPTIONS.MEDIUM,
      set priceGranularity(val) {
        if (validatePriceGranularity(val)) {
          if (typeof val === 'string') {
            this._priceGranularity = hasGranularity(val) ? val : GRANULARITY_OPTIONS.MEDIUM;
          } else if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
            this._customPriceBucket = val;
            this._priceGranularity = GRANULARITY_OPTIONS.CUSTOM;
            utils.logMessage('Using custom price granularity');
          }
        }
      },
      get priceGranularity() {
        return this._priceGranularity;
      },

      _customPriceBucket: {},
      get customPriceBucket() {
        return this._customPriceBucket;
      },

      _sendAllBids: DEFAULT_ENABLE_SEND_ALL_BIDS,
      get enableSendAllBids() {
        return this._sendAllBids;
      },
      set enableSendAllBids(val) {
        this._sendAllBids = val;
      },

      _bidderSequence: DEFAULT_BIDDER_SEQUENCE,
      get bidderSequence() {
        return this._bidderSequence;
      },
      set bidderSequence(val) {
        if (VALID_ORDERS[val]) {
          this._bidderSequence = val;
        } else {
          utils.logWarn('Invalid order: ' + val + '. Bidder Sequence was not set.');
        }
      },

      // timeout buffer to adjust for bidder CDN latency
      _timoutBuffer: DEFAULT_TIMEOUTBUFFER,
      get timeoutBuffer() {
        return this._timoutBuffer;
      },
      set timeoutBuffer(val) {
        this._timoutBuffer = val;
      }

    };

    function hasGranularity(val) {
      return (0, _find2.default)(Object.keys(GRANULARITY_OPTIONS), function (option) {
        return val === GRANULARITY_OPTIONS[option];
      });
    }

    function validatePriceGranularity(val) {
      if (!val) {
        utils.logError('Prebid Error: no value passed to `setPriceGranularity()`');
        return false;
      }
      if (typeof val === 'string') {
        if (!hasGranularity(val)) {
          utils.logWarn('Prebid Warning: setPriceGranularity was called with invalid setting, using `medium` as default.');
        }
      } else if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
        if (!(0, _cpmBucketManager.isValidPriceConfig)(val)) {
          utils.logError('Invalid custom price value passed to `setPriceGranularity()`');
          return false;
        }
      }
      return true;
    }
  }

  /*
   * Returns configuration object if called without parameters,
   * or single configuration property if given a string matching a configuration
   * property name.  Allows deep access e.g. getConfig('currency.adServerCurrency')
   *
   * If called with callback parameter, or a string and a callback parameter,
   * subscribes to configuration updates. See `subscribe` function for usage.
   */
  function getConfig() {
    if (arguments.length <= 1 && typeof (arguments.length <= 0 ? undefined : arguments[0]) !== 'function') {
      var option = arguments.length <= 0 ? undefined : arguments[0];
      return option ? utils.deepAccess(config, option) : config;
    }

    return subscribe.apply(undefined, arguments);
  }

  /*
   * Sets configuration given an object containing key-value pairs and calls
   * listeners that were added by the `subscribe` function
   */
  var setConfig = (0, _hook.createHook)('asyncSeries', function setConfig(options) {
    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
      utils.logError('setConfig options must be an object');
      return;
    }

    var topics = Object.keys(options);
    var topicalConfig = {};

    topics.forEach(function (topic) {
      var option = options[topic];

      if (_typeof(defaults[topic]) === 'object' && (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object') {
        option = _extends({}, defaults[topic], option);
      }

      topicalConfig[topic] = config[topic] = option;
    });

    callSubscribers(topicalConfig);
  });

  /**
   * Sets configuration defaults which setConfig values can be applied on top of
   * @param {object} options
   */
  function setDefaults(options) {
    if ((typeof defaults === 'undefined' ? 'undefined' : _typeof(defaults)) !== 'object') {
      utils.logError('defaults must be an object');
      return;
    }

    _extends(defaults, options);
    // Add default values to config as well
    _extends(config, options);
  }

  /*
   * Adds a function to a set of listeners that are invoked whenever `setConfig`
   * is called. The subscribed function will be passed the options object that
   * was used in the `setConfig` call. Topics can be subscribed to to only get
   * updates when specific properties are updated by passing a topic string as
   * the first parameter.
   *
   * Returns an `unsubscribe` function for removing the subscriber from the
   * set of listeners
   *
   * Example use:
   * // subscribe to all configuration changes
   * subscribe((config) => console.log('config set:', config));
   *
   * // subscribe to only 'logging' changes
   * subscribe('logging', (config) => console.log('logging set:', config));
   *
   * // unsubscribe
   * const unsubscribe = subscribe(...);
   * unsubscribe(); // no longer listening
   */
  function subscribe(topic, listener) {
    var callback = listener;

    if (typeof topic !== 'string') {
      // first param should be callback function in this case,
      // meaning it gets called for any config change
      callback = topic;
      topic = ALL_TOPICS;
    }

    if (typeof callback !== 'function') {
      utils.logError('listener must be a function');
      return;
    }

    listeners.push({ topic: topic, callback: callback });

    // save and call this function to remove the listener
    return function unsubscribe() {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  }

  /*
   * Calls listeners that were added by the `subscribe` function
   */
  function callSubscribers(options) {
    var TOPICS = Object.keys(options);

    // call subscribers of a specific topic, passing only that configuration
    listeners.filter(function (listener) {
      return (0, _includes2.default)(TOPICS, listener.topic);
    }).forEach(function (listener) {
      listener.callback(_defineProperty({}, listener.topic, options[listener.topic]));
    });

    // call subscribers that didn't give a topic, passing everything that was set
    listeners.filter(function (listener) {
      return listener.topic === ALL_TOPICS;
    }).forEach(function (listener) {
      return listener.callback(options);
    });
  }

  resetConfig();

  return {
    getConfig: getConfig,
    setConfig: setConfig,
    setDefaults: setDefaults,
    resetConfig: resetConfig
  };
}

var config = exports.config = newConfig();

/***/ }),

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(16);
var $find = __webpack_require__(30)(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(24)(KEY);


/***/ }),

/***/ 43:
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(45);
var createDesc = __webpack_require__(50);
module.exports = __webpack_require__(23) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(46);
var IE8_DOM_DEFINE = __webpack_require__(47);
var toPrimitive = __webpack_require__(49);
var dP = Object.defineProperty;

exports.f = __webpack_require__(23) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(17);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ 463:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(464);


/***/ }),

/***/ 464:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _prebidGlobal = __webpack_require__(37);

var _utils = __webpack_require__(0);

var _secureCreatives = __webpack_require__(465);

var _userSync = __webpack_require__(13);

var _adloader = __webpack_require__(11);

var _config = __webpack_require__(4);

var _auctionManager = __webpack_require__(26);

var _targeting = __webpack_require__(38);

var _hook = __webpack_require__(21);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /** @module pbjs */

var pbjs = (0, _prebidGlobal.getGlobal)();
var CONSTANTS = __webpack_require__(2);
var utils = __webpack_require__(0);
var adaptermanager = __webpack_require__(8);
var bidfactory = __webpack_require__(19);
var events = __webpack_require__(9);
var triggerUserSyncs = _userSync.userSync.triggerUserSyncs;

/* private variables */

var _CONSTANTS$EVENTS = CONSTANTS.EVENTS,
    ADD_AD_UNITS = _CONSTANTS$EVENTS.ADD_AD_UNITS,
    BID_WON = _CONSTANTS$EVENTS.BID_WON,
    REQUEST_BIDS = _CONSTANTS$EVENTS.REQUEST_BIDS,
    SET_TARGETING = _CONSTANTS$EVENTS.SET_TARGETING,
    AD_RENDER_FAILED = _CONSTANTS$EVENTS.AD_RENDER_FAILED;
var _CONSTANTS$AD_RENDER_ = CONSTANTS.AD_RENDER_FAILED_REASON,
    PREVENT_WRITING_ON_MAIN_DOCUMENT = _CONSTANTS$AD_RENDER_.PREVENT_WRITING_ON_MAIN_DOCUMENT,
    NO_AD = _CONSTANTS$AD_RENDER_.NO_AD,
    EXCEPTION = _CONSTANTS$AD_RENDER_.EXCEPTION,
    CANNOT_FIND_AD = _CONSTANTS$AD_RENDER_.CANNOT_FIND_AD,
    MISSING_DOC_OR_ADID = _CONSTANTS$AD_RENDER_.MISSING_DOC_OR_ADID;


var eventValidators = {
  bidWon: checkDefinedPlacement
};

/* Public vars */
pbjs.bidderSettings = pbjs.bidderSettings || {};

// current timeout set in `requestBids` or to default `bidderTimeout`
pbjs.cbTimeout = pbjs.cbTimeout || 200;

// let the world know we are loaded
pbjs.libLoaded = true;

// version auto generated from build
pbjs.version = 'v1.11.0';
utils.logInfo('Prebid.js v1.11.0 loaded');

// create adUnit array
pbjs.adUnits = pbjs.adUnits || [];

// Allow publishers who enable user sync override to trigger their sync
pbjs.triggerUserSyncs = triggerUserSyncs;

function checkDefinedPlacement(id) {
  var adUnitCodes = _auctionManager.auctionManager.getBidsRequested().map(function (bidSet) {
    return bidSet.bids.map(function (bid) {
      return bid.adUnitCode;
    });
  }).reduce(_utils.flatten).filter(_utils.uniques);

  if (!utils.contains(adUnitCodes, id)) {
    utils.logError('The "' + id + '" placement is not defined.');
    return;
  }

  return true;
}

function setRenderSize(doc, width, height) {
  if (doc.defaultView && doc.defaultView.frameElement) {
    doc.defaultView.frameElement.width = width;
    doc.defaultView.frameElement.height = height;
  }
}

/// ///////////////////////////////
//                              //
//    Start Public APIs         //
//                              //
/// ///////////////////////////////

/**
 * This function returns the query string targeting parameters available at this moment for a given ad unit. Note that some bidder's response may not have been received if you call this function too quickly after the requests are sent.
 * @param  {string} [adunitCode] adUnitCode to get the bid responses for
 * @alias module:pbjs.getAdserverTargetingForAdUnitCodeStr
 * @return {Array}  returnObj return bids array
 */
pbjs.getAdserverTargetingForAdUnitCodeStr = function (adunitCode) {
  utils.logInfo('Invoking pbjs.getAdserverTargetingForAdUnitCodeStr', arguments);

  // call to retrieve bids array
  if (adunitCode) {
    var res = pbjs.getAdserverTargetingForAdUnitCode(adunitCode);
    return utils.transformAdServerTargetingObj(res);
  } else {
    utils.logMessage('Need to call getAdserverTargetingForAdUnitCodeStr with adunitCode');
  }
};

/**
 * This function returns the query string targeting parameters available at this moment for a given ad unit. Note that some bidder's response may not have been received if you call this function too quickly after the requests are sent.
 * @param adUnitCode {string} adUnitCode to get the bid responses for
 * @alias module:pbjs.getAdserverTargetingForAdUnitCode
 * @returns {Object}  returnObj return bids
 */
pbjs.getAdserverTargetingForAdUnitCode = function (adUnitCode) {
  return pbjs.getAdserverTargeting(adUnitCode)[adUnitCode];
};

/**
 * returns all ad server targeting for all ad units
 * @return {Object} Map of adUnitCodes and targeting values []
 * @alias module:pbjs.getAdserverTargeting
 */

pbjs.getAdserverTargeting = function (adUnitCode) {
  utils.logInfo('Invoking pbjs.getAdserverTargeting', arguments);
  var bidsReceived = _auctionManager.auctionManager.getBidsReceived();
  return _targeting.targeting.getAllTargeting(adUnitCode, bidsReceived);
};

/**
 * This function returns the bid responses at the given moment.
 * @alias module:pbjs.getBidResponses
 * @return {Object}            map | object that contains the bidResponses
 */

pbjs.getBidResponses = function () {
  utils.logInfo('Invoking pbjs.getBidResponses', arguments);
  var responses = _auctionManager.auctionManager.getBidsReceived().filter(_utils.adUnitsFilter.bind(this, _auctionManager.auctionManager.getAdUnitCodes()));

  // find the last auction id to get responses for most recent auction only
  var currentAuctionId = responses && responses.length && responses[responses.length - 1].auctionId;

  return responses.map(function (bid) {
    return bid.adUnitCode;
  }).filter(_utils.uniques).map(function (adUnitCode) {
    return responses.filter(function (bid) {
      return bid.auctionId === currentAuctionId && bid.adUnitCode === adUnitCode;
    });
  }).filter(function (bids) {
    return bids && bids[0] && bids[0].adUnitCode;
  }).map(function (bids) {
    return _defineProperty({}, bids[0].adUnitCode, { bids: bids.map(_utils.removeRequestId) });
  }).reduce(function (a, b) {
    return _extends(a, b);
  }, {});
};

/**
 * Returns bidResponses for the specified adUnitCode
 * @param  {string} adUnitCode adUnitCode
 * @alias module:pbjs.getBidResponsesForAdUnitCode
 * @return {Object}            bidResponse object
 */

pbjs.getBidResponsesForAdUnitCode = function (adUnitCode) {
  var bids = _auctionManager.auctionManager.getBidsReceived().filter(function (bid) {
    return bid.adUnitCode === adUnitCode;
  });
  return {
    bids: bids.map(_utils.removeRequestId)
  };
};

/**
 * Set query string targeting on one or more GPT ad units.
 * @param {(string|string[])} adUnit a single `adUnit.code` or multiple.
 * @alias module:pbjs.setTargetingForGPTAsync
 */
pbjs.setTargetingForGPTAsync = function (adUnit) {
  utils.logInfo('Invoking pbjs.setTargetingForGPTAsync', arguments);
  if (!(0, _utils.isGptPubadsDefined)()) {
    utils.logError('window.googletag is not defined on the page');
    return;
  }

  // get our ad unit codes
  var targetingSet = _targeting.targeting.getAllTargeting(adUnit);

  // first reset any old targeting
  _targeting.targeting.resetPresetTargeting(adUnit);

  // now set new targeting keys
  _targeting.targeting.setTargetingForGPT(targetingSet);

  // emit event
  events.emit(SET_TARGETING, targetingSet);
};

/**
 * Set query string targeting on all AST (AppNexus Seller Tag) ad units. Note that this function has to be called after all ad units on page are defined. For working example code, see [Using Prebid.js with AppNexus Publisher Ad Server](http://prebid.org/dev-docs/examples/use-prebid-with-appnexus-ad-server.html).
 * @alias module:pbjs.setTargetingForAst
 */
pbjs.setTargetingForAst = function () {
  utils.logInfo('Invoking pbjs.setTargetingForAn', arguments);
  if (!_targeting.targeting.isApntagDefined()) {
    utils.logError('window.apntag is not defined on the page');
    return;
  }

  _targeting.targeting.setTargetingForAst();

  // emit event
  events.emit(SET_TARGETING, _targeting.targeting.getAllTargeting());
};

function emitAdRenderFail(reason, message, bid) {
  var data = {};

  data.reason = reason;
  data.message = message;
  if (bid) {
    data.bid = bid;
  }

  utils.logError(message);
  events.emit(AD_RENDER_FAILED, data);
}
/**
 * This function will render the ad (based on params) in the given iframe document passed through.
 * Note that doc SHOULD NOT be the parent document page as we can't doc.write() asynchronously
 * @param  {HTMLDocument} doc document
 * @param  {string} id bid id to locate the ad
 * @alias module:pbjs.renderAd
 */
pbjs.renderAd = function (doc, id) {
  utils.logInfo('Invoking pbjs.renderAd', arguments);
  utils.logMessage('Calling renderAd with adId :' + id);

  if (doc && id) {
    try {
      // lookup ad by ad Id
      var bid = _auctionManager.auctionManager.findBidByAdId(id);
      if (bid) {
        bid.status = _targeting.RENDERED;
        // replace macros according to openRTB with price paid = bid.cpm
        bid.ad = utils.replaceAuctionPrice(bid.ad, bid.cpm);
        bid.adUrl = utils.replaceAuctionPrice(bid.adUrl, bid.cpm);
        // save winning bids
        _auctionManager.auctionManager.addWinningBid(bid);

        // emit 'bid won' event here
        events.emit(BID_WON, bid);

        var height = bid.height,
            width = bid.width,
            ad = bid.ad,
            mediaType = bid.mediaType,
            adUrl = bid.adUrl,
            renderer = bid.renderer;


        var creativeComment = document.createComment('Creative ' + bid.creativeId + ' served by ' + bid.bidder + ' Prebid.js Header Bidding');
        utils.insertElement(creativeComment, doc, 'body');

        if (renderer && renderer.url) {
          renderer.render(bid);
        } else if (doc === document && !utils.inIframe() || mediaType === 'video') {
          var message = 'Error trying to write ad. Ad render call ad id ' + id + ' was prevented from writing to the main document.';
          emitAdRenderFail(PREVENT_WRITING_ON_MAIN_DOCUMENT, message, bid);
        } else if (ad) {
          doc.write(ad);
          doc.close();
          setRenderSize(doc, width, height);
          utils.callBurl(bid);
        } else if (adUrl) {
          var iframe = utils.createInvisibleIframe();
          iframe.height = height;
          iframe.width = width;
          iframe.style.display = 'inline';
          iframe.style.overflow = 'hidden';
          iframe.src = adUrl;

          utils.insertElement(iframe, doc, 'body');
          setRenderSize(doc, width, height);
          utils.callBurl(bid);
        } else {
          var _message = 'Error trying to write ad. No ad for bid response id: ' + id;
          emitAdRenderFail(NO_AD, _message, bid);
        }
      } else {
        var _message2 = 'Error trying to write ad. Cannot find ad by given id : ' + id;
        emitAdRenderFail(CANNOT_FIND_AD, _message2);
      }
    } catch (e) {
      var _message3 = 'Error trying to write ad Id :' + id + ' to the page:' + e.message;
      emitAdRenderFail(EXCEPTION, _message3);
    }
  } else {
    var _message4 = 'Error trying to write ad Id :' + id + ' to the page. Missing document or adId';
    emitAdRenderFail(MISSING_DOC_OR_ADID, _message4);
  }
};

/**
 * Remove adUnit from the pbjs configuration
 * @param  {string} adUnitCode the adUnitCode to remove
 * @alias module:pbjs.removeAdUnit
 */
pbjs.removeAdUnit = function (adUnitCode) {
  utils.logInfo('Invoking pbjs.removeAdUnit', arguments);
  if (adUnitCode) {
    for (var i = 0; i < pbjs.adUnits.length; i++) {
      if (pbjs.adUnits[i].code === adUnitCode) {
        pbjs.adUnits.splice(i, 1);
      }
    }
  }
};

/**
 * @param {Object} requestOptions
 * @param {function} requestOptions.bidsBackHandler
 * @param {number} requestOptions.timeout
 * @param {Array} requestOptions.adUnits
 * @param {Array} requestOptions.adUnitCodes
 * @param {Array} requestOptions.labels
 * @alias module:pbjs.requestBids
 */
pbjs.requestBids = (0, _hook.createHook)('asyncSeries', function () {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      bidsBackHandler = _ref2.bidsBackHandler,
      timeout = _ref2.timeout,
      adUnits = _ref2.adUnits,
      adUnitCodes = _ref2.adUnitCodes,
      labels = _ref2.labels;

  events.emit(REQUEST_BIDS);
  var cbTimeout = timeout || _config.config.getConfig('bidderTimeout');
  adUnits = adUnits || pbjs.adUnits;

  utils.logInfo('Invoking pbjs.requestBids', arguments);

  if (adUnitCodes && adUnitCodes.length) {
    // if specific adUnitCodes supplied filter adUnits for those codes
    adUnits = adUnits.filter(function (unit) {
      return (0, _includes2.default)(adUnitCodes, unit.code);
    });
  } else {
    // otherwise derive adUnitCodes from adUnits
    adUnitCodes = adUnits && adUnits.map(function (unit) {
      return unit.code;
    });
  }

  /*
   * for a given adunit which supports a set of mediaTypes
   * and a given bidder which supports a set of mediaTypes
   * a bidder is eligible to participate on the adunit
   * if it supports at least one of the mediaTypes on the adunit
   */
  adUnits.forEach(function (adUnit) {
    // get the adunit's mediaTypes, defaulting to banner if mediaTypes isn't present
    var adUnitMediaTypes = Object.keys(adUnit.mediaTypes || { 'banner': 'banner' });

    // get the bidder's mediaTypes
    var bidders = adUnit.bids.map(function (bid) {
      return bid.bidder;
    });
    var bidderRegistry = adaptermanager.bidderRegistry;

    bidders.forEach(function (bidder) {
      var adapter = bidderRegistry[bidder];
      var spec = adapter && adapter.getSpec && adapter.getSpec();
      // banner is default if not specified in spec
      var bidderMediaTypes = spec && spec.supportedMediaTypes || ['banner'];

      // check if the bidder's mediaTypes are not in the adUnit's mediaTypes
      var bidderEligible = adUnitMediaTypes.some(function (type) {
        return (0, _includes2.default)(bidderMediaTypes, type);
      });
      if (!bidderEligible) {
        // drop the bidder from the ad unit if it's not compatible
        utils.logWarn(utils.unsupportedBidderMessage(adUnit, bidder));
        adUnit.bids = adUnit.bids.filter(function (bid) {
          return bid.bidder !== bidder;
        });
      }
    });
  });

  if (!adUnits || adUnits.length === 0) {
    utils.logMessage('No adUnits configured. No bids requested.');
    if (typeof bidsBackHandler === 'function') {
      // executeCallback, this will only be called in case of first request
      try {
        bidsBackHandler();
      } catch (e) {
        utils.logError('Error executing bidsBackHandler', null, e);
      }
    }
    return;
  }

  var auction = _auctionManager.auctionManager.createAuction({ adUnits: adUnits, adUnitCodes: adUnitCodes, callback: bidsBackHandler, cbTimeout: cbTimeout, labels: labels });
  auction.callBids();
  return auction;
});

/**
 *
 * Add adunit(s)
 * @param {Array|Object} adUnitArr Array of adUnits or single adUnit Object.
 * @alias module:pbjs.addAdUnits
 */
pbjs.addAdUnits = function (adUnitArr) {
  utils.logInfo('Invoking pbjs.addAdUnits', arguments);
  if (utils.isArray(adUnitArr)) {
    // generate transactionid for each new adUnits
    // Append array to existing
    adUnitArr.forEach(function (adUnit) {
      return adUnit.transactionId = utils.generateUUID();
    });
    pbjs.adUnits.push.apply(pbjs.adUnits, adUnitArr);
  } else if ((typeof adUnitArr === 'undefined' ? 'undefined' : _typeof(adUnitArr)) === 'object') {
    // Generate the transaction id for the adunit
    adUnitArr.transactionId = utils.generateUUID();
    pbjs.adUnits.push(adUnitArr);
  }
  // emit event
  events.emit(ADD_AD_UNITS);
};

/**
 * @param {string} event the name of the event
 * @param {Function} handler a callback to set on event
 * @param {string} id an identifier in the context of the event
 * @alias module:pbjs.onEvent
 *
 * This API call allows you to register a callback to handle a Prebid.js event.
 * An optional `id` parameter provides more finely-grained event callback registration.
 * This makes it possible to register callback events for a specific item in the
 * event context. For example, `bidWon` events will accept an `id` for ad unit code.
 * `bidWon` callbacks registered with an ad unit code id will be called when a bid
 * for that ad unit code wins the auction. Without an `id` this method registers the
 * callback for every `bidWon` event.
 *
 * Currently `bidWon` is the only event that accepts an `id` parameter.
 */
pbjs.onEvent = function (event, handler, id) {
  utils.logInfo('Invoking pbjs.onEvent', arguments);
  if (!utils.isFn(handler)) {
    utils.logError('The event handler provided is not a function and was not set on event "' + event + '".');
    return;
  }

  if (id && !eventValidators[event].call(null, id)) {
    utils.logError('The id provided is not valid for event "' + event + '" and no handler was set.');
    return;
  }

  events.on(event, handler, id);
};

/**
 * @param {string} event the name of the event
 * @param {Function} handler a callback to remove from the event
 * @param {string} id an identifier in the context of the event (see `pbjs.onEvent`)
 * @alias module:pbjs.offEvent
 */
pbjs.offEvent = function (event, handler, id) {
  utils.logInfo('Invoking pbjs.offEvent', arguments);
  if (id && !eventValidators[event].call(null, id)) {
    return;
  }

  events.off(event, handler, id);
};

/*
 * Wrapper to register bidderAdapter externally (adaptermanager.registerBidAdapter())
 * @param  {Function} bidderAdaptor [description]
 * @param  {string} bidderCode [description]
 * @alias module:pbjs.registerBidAdapter
 */
pbjs.registerBidAdapter = function (bidderAdaptor, bidderCode) {
  utils.logInfo('Invoking pbjs.registerBidAdapter', arguments);
  try {
    adaptermanager.registerBidAdapter(bidderAdaptor(), bidderCode);
  } catch (e) {
    utils.logError('Error registering bidder adapter : ' + e.message);
  }
};

/**
 * Wrapper to register analyticsAdapter externally (adaptermanager.registerAnalyticsAdapter())
 * @param  {Object} options [description]
 * @alias module:pbjs.registerAnalyticsAdapter
 */
pbjs.registerAnalyticsAdapter = function (options) {
  utils.logInfo('Invoking pbjs.registerAnalyticsAdapter', arguments);
  try {
    adaptermanager.registerAnalyticsAdapter(options);
  } catch (e) {
    utils.logError('Error registering analytics adapter : ' + e.message);
  }
};

/**
 * Wrapper to bidfactory.createBid()
 * @param  {string} statusCode [description]
 * @alias module:pbjs.createBid
 * @return {Object} bidResponse [description]
 */
pbjs.createBid = function (statusCode) {
  utils.logInfo('Invoking pbjs.createBid', arguments);
  return bidfactory.createBid(statusCode);
};

/**
 * @deprecated this function will be removed in the next release. Prebid has deprected external JS loading.
 * @param  {string} tagSrc [description]
 * @param  {Function} callback [description]
 * @alias module:pbjs.loadScript
 */
pbjs.loadScript = function (tagSrc, callback, useCache) {
  utils.logInfo('Invoking pbjs.loadScript', arguments);
  (0, _adloader.loadScript)(tagSrc, callback, useCache);
};

/**
 * Enable sending analytics data to the analytics provider of your
 * choice.
 *
 * For usage, see [Integrate with the Prebid Analytics
 * API](http://prebid.org/dev-docs/integrate-with-the-prebid-analytics-api.html).
 *
 * For a list of analytics adapters, see [Analytics for
 * Prebid](http://prebid.org/overview/analytics.html).
 * @param  {Object} config
 * @param {string} config.provider The name of the provider, e.g., `"ga"` for Google Analytics.
 * @param {Object} config.options The options for this particular analytics adapter.  This will likely vary between adapters.
 * @alias module:pbjs.enableAnalytics
 */
pbjs.enableAnalytics = function (config) {
  if (config && !utils.isEmpty(config)) {
    utils.logInfo('Invoking pbjs.enableAnalytics for: ', config);
    adaptermanager.enableAnalytics(config);
  } else {
    utils.logError('pbjs.enableAnalytics should be called with option {}');
  }
};

/**
 * @alias module:pbjs.aliasBidder
 */
pbjs.aliasBidder = function (bidderCode, alias) {
  utils.logInfo('Invoking pbjs.aliasBidder', arguments);
  if (bidderCode && alias) {
    adaptermanager.aliasBidAdapter(bidderCode, alias);
  } else {
    utils.logError('bidderCode and alias must be passed as arguments', 'pbjs.aliasBidder');
  }
};

/**
 * The bid response object returned by an external bidder adapter during the auction.
 * @typedef {Object} AdapterBidResponse
 * @property {string} pbAg Auto granularity price bucket; CPM <= 5 ? increment = 0.05 : CPM > 5 && CPM <= 10 ? increment = 0.10 : CPM > 10 && CPM <= 20 ? increment = 0.50 : CPM > 20 ? priceCap = 20.00.  Example: `"0.80"`.
 * @property {string} pbCg Custom price bucket.  For example setup, see {@link setPriceGranularity}.  Example: `"0.84"`.
 * @property {string} pbDg Dense granularity price bucket; CPM <= 3 ? increment = 0.01 : CPM > 3 && CPM <= 8 ? increment = 0.05 : CPM > 8 && CPM <= 20 ? increment = 0.50 : CPM > 20? priceCap = 20.00.  Example: `"0.84"`.
 * @property {string} pbLg Low granularity price bucket; $0.50 increment, capped at $5, floored to two decimal places.  Example: `"0.50"`.
 * @property {string} pbMg Medium granularity price bucket; $0.10 increment, capped at $20, floored to two decimal places.  Example: `"0.80"`.
 * @property {string} pbHg High granularity price bucket; $0.01 increment, capped at $20, floored to two decimal places.  Example: `"0.84"`.
 *
 * @property {string} bidder The string name of the bidder.  This *may* be the same as the `bidderCode`.  For For a list of all bidders and their codes, see [Bidders' Params](http://prebid.org/dev-docs/bidders.html).
 * @property {string} bidderCode The unique string that identifies this bidder.  For a list of all bidders and their codes, see [Bidders' Params](http://prebid.org/dev-docs/bidders.html).
 *
 * @property {string} requestId The [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) representing the bid request.
 * @property {number} requestTimestamp The time at which the bid request was sent out, expressed in milliseconds.
 * @property {number} responseTimestamp The time at which the bid response was received, expressed in milliseconds.
 * @property {number} timeToRespond How long it took for the bidder to respond with this bid, expressed in milliseconds.
 *
 * @property {string} size The size of the ad creative, expressed in `"AxB"` format, where A and B are numbers of pixels.  Example: `"320x50"`.
 * @property {string} width The width of the ad creative in pixels.  Example: `"320"`.
 * @property {string} height The height of the ad creative in pixels.  Example: `"50"`.
 *
 * @property {string} ad The actual ad creative content, often HTML with CSS, JavaScript, and/or links to additional content.  Example: `"<div id='beacon_-YQbipJtdxmMCgEPHExLhmqzEm' style='position: absolute; left: 0px; top: 0px; visibility: hidden;'><img src='http://aplus-...'/></div><iframe src=\"http://aax-us-east.amazon-adsystem.com/e/is/8dcfcd..." width=\"728\" height=\"90\" frameborder=\"0\" ...></iframe>",`.
 * @property {number} ad_id The ad ID of the creative, as understood by the bidder's system.  Used by the line item's [creative in the ad server](http://prebid.org/adops/send-all-bids-adops.html#step-3-add-a-creative).
 * @property {string} adUnitCode The code used to uniquely identify the ad unit on the publisher's page.
 *
 * @property {string} statusMessage The status of the bid.  Allowed values: `"Bid available"` or `"Bid returned empty or error response"`.
 * @property {number} cpm The exact bid price from the bidder, expressed to the thousandths place.  Example: `"0.849"`.
 *
 * @property {Object} adserverTargeting An object whose values represent the ad server's targeting on the bid.
 * @property {string} adserverTargeting.hb_adid The ad ID of the creative, as understood by the ad server.
 * @property {string} adserverTargeting.hb_pb The price paid to show the creative, as logged in the ad server.
 * @property {string} adserverTargeting.hb_bidder The winning bidder whose ad creative will be served by the ad server.
*/

/**
 * Get all of the bids that have been rendered.  Useful for [troubleshooting your integration](http://prebid.org/dev-docs/prebid-troubleshooting-guide.html).
 * @return {Array<AdapterBidResponse>} A list of bids that have been rendered.
*/
pbjs.getAllWinningBids = function () {
  return _auctionManager.auctionManager.getAllWinningBids().map(_utils.removeRequestId);
};

/**
 * Get all of the bids that have won their respective auctions.
 * @return {Array<AdapterBidResponse>} A list of bids that have won their respective auctions.
 */
pbjs.getAllPrebidWinningBids = function () {
  return _auctionManager.auctionManager.getBidsReceived().filter(function (bid) {
    return bid.status === _targeting.BID_TARGETING_SET;
  }).map(_utils.removeRequestId);
};

/**
 * Get array of highest cpm bids for all adUnits, or highest cpm bid
 * object for the given adUnit
 * @param {string} adUnitCode - optional ad unit code
 * @alias module:pbjs.getHighestCpmBids
 * @return {Array} array containing highest cpm bid object(s)
 */
pbjs.getHighestCpmBids = function (adUnitCode) {
  var bidsReceived = _auctionManager.auctionManager.getBidsReceived().filter(_targeting.getOldestBid);
  return _targeting.targeting.getWinningBids(adUnitCode, bidsReceived).map(_utils.removeRequestId);
};

/**
 * Get Prebid config options
 * @param {Object} options
 * @alias module:pbjs.getConfig
 */
pbjs.getConfig = _config.config.getConfig;

/**
 * Set Prebid config options.
 * (Added in version 0.27.0).
 *
 * `setConfig` is designed to allow for advanced configuration while
 * reducing the surface area of the public API.  For more information
 * about the move to `setConfig` (and the resulting deprecations of
 * some other public methods), see [the Prebid 1.0 public API
 * proposal](https://gist.github.com/mkendall07/51ee5f6b9f2df01a89162cf6de7fe5b6).
 *
 * #### Troubleshooting your configuration
 *
 * If you call `pbjs.setConfig` without an object, e.g.,
 *
 * `pbjs.setConfig('debug', 'true'))`
 *
 * then Prebid.js will print an error to the console that says:
 *
 * ```
 * ERROR: setConfig options must be an object
 * ```
 *
 * If you don't see that message, you can assume the config object is valid.
 *
 * @param {Object} options Global Prebid configuration object. Must be JSON - no JavaScript functions are allowed.
 * @param {string} options.bidderSequence The order in which bidders are called.  Example: `pbjs.setConfig({ bidderSequence: "fixed" })`.  Allowed values: `"fixed"` (order defined in `adUnit.bids` array on page), `"random"`.
 * @param {boolean} options.debug Turn debug logging on/off. Example: `pbjs.setConfig({ debug: true })`.
 * @param {string} options.priceGranularity The bid price granularity to use.  Example: `pbjs.setConfig({ priceGranularity: "medium" })`. Allowed values: `"low"` ($0.50), `"medium"` ($0.10), `"high"` ($0.01), `"auto"` (sliding scale), `"dense"` (like `"auto"`, with smaller increments at lower CPMs), or a custom price bucket object, e.g., `{ "buckets" : [{"min" : 0,"max" : 20,"increment" : 0.1,"cap" : true}]}`.
 * @param {boolean} options.enableSendAllBids Turn "send all bids" mode on/off.  Example: `pbjs.setConfig({ enableSendAllBids: true })`.
 * @param {number} options.bidderTimeout Set a global bidder timeout, in milliseconds.  Example: `pbjs.setConfig({ bidderTimeout: 3000 })`.  Note that it's still possible for a bid to get into the auction that responds after this timeout. This is due to how [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) works in JS: it queues the callback in the event loop in an approximate location that should execute after this time but it is not guaranteed.  For more information about the asynchronous event loop and `setTimeout`, see [How JavaScript Timers Work](https://johnresig.com/blog/how-javascript-timers-work/).
 * @param {string} options.publisherDomain The publisher's domain where Prebid is running, for cross-domain iFrame communication.  Example: `pbjs.setConfig({ publisherDomain: "https://www.theverge.com" })`.
 * @param {number} options.cookieSyncDelay A delay (in milliseconds) for requesting cookie sync to stay out of the critical path of page load.  Example: `pbjs.setConfig({ cookieSyncDelay: 100 })`.
 * @param {Object} options.s2sConfig The configuration object for [server-to-server header bidding](http://prebid.org/dev-docs/get-started-with-prebid-server.html).  Example:
 * @alias module:pbjs.setConfig
 * ```
 * pbjs.setConfig({
 *     s2sConfig: {
 *         accountId: '1',
 *         enabled: true,
 *         bidders: ['appnexus', 'pubmatic'],
 *         timeout: 1000,
 *         adapter: 'prebidServer',
 *         endpoint: 'https://prebid.adnxs.com/pbs/v1/auction'
 *     }
 * })
 * ```
 */
pbjs.setConfig = _config.config.setConfig;

pbjs.que.push(function () {
  return (0, _secureCreatives.listenMessagesFromCreative)();
});

/**
 * This queue lets users load Prebid asynchronously, but run functions the same way regardless of whether it gets loaded
 * before or after their script executes. For example, given the code:
 *
 * <script src="url/to/Prebid.js" async></script>
 * <script>
 *   var pbjs = pbjs || {};
 *   pbjs.cmd = pbjs.cmd || [];
 *   pbjs.cmd.push(functionToExecuteOncePrebidLoads);
 * </script>
 *
 * If the page's script runs before prebid loads, then their function gets added to the queue, and executed
 * by prebid once it's done loading. If it runs after prebid loads, then this monkey-patch causes their
 * function to execute immediately.
 *
 * @memberof pbjs
 * @param  {function} command A function which takes no arguments. This is guaranteed to run exactly once, and only after
 *                            the Prebid script has been fully loaded.
 * @alias module:pbjs.cmd.push
 */
pbjs.cmd.push = function (command) {
  if (typeof command === 'function') {
    try {
      command.call();
    } catch (e) {
      utils.logError('Error processing command :', e.message, e.stack);
    }
  } else {
    utils.logError('Commands written into pbjs.cmd.push must be wrapped in a function');
  }
};

pbjs.que.push = pbjs.cmd.push;

function processQueue(queue) {
  queue.forEach(function (cmd) {
    if (typeof cmd.called === 'undefined') {
      try {
        cmd.call();
        cmd.called = true;
      } catch (e) {
        utils.logError('Error processing command :', 'prebid.js', e);
      }
    }
  });
}

/**
 * @alias module:pbjs.processQueue
 */
pbjs.processQueue = function () {
  processQueue(pbjs.que);
  processQueue(pbjs.cmd);
};

/***/ }),

/***/ 465:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listenMessagesFromCreative = listenMessagesFromCreative;

var _events = __webpack_require__(9);

var _events2 = _interopRequireDefault(_events);

var _native = __webpack_require__(18);

var _constants = __webpack_require__(2);

var _utils = __webpack_require__(0);

var _auctionManager = __webpack_require__(26);

var _find = __webpack_require__(10);

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Secure Creatives
  Provides support for rendering creatives into cross domain iframes such as SafeFrame to prevent
   access to a publisher page from creative payloads.
 */

var BID_WON = _constants.EVENTS.BID_WON;

function listenMessagesFromCreative() {
  addEventListener('message', receiveMessage, false);
}

function receiveMessage(ev) {
  var key = ev.message ? 'message' : 'data';
  var data = {};
  try {
    data = JSON.parse(ev[key]);
  } catch (e) {
    return;
  }

  if (data.adId) {
    var adObject = (0, _find2.default)(_auctionManager.auctionManager.getBidsReceived(), function (bid) {
      return bid.adId === data.adId;
    });

    if (data.message === 'Prebid Request') {
      sendAdToCreative(adObject, data.adServerDomain, ev.source);

      // save winning bids
      _auctionManager.auctionManager.addWinningBid(adObject);

      _events2.default.emit(BID_WON, adObject);
    }

    // handle this script from native template in an ad server
    // window.parent.postMessage(JSON.stringify({
    //   message: 'Prebid Native',
    //   adId: '%%PATTERN:hb_adid%%'
    // }), '*');
    if (data.message === 'Prebid Native') {
      (0, _native.fireNativeTrackers)(data, adObject);
      _auctionManager.auctionManager.addWinningBid(adObject);
      _events2.default.emit(BID_WON, adObject);
    }
  }
}

function sendAdToCreative(adObject, remoteDomain, source) {
  var adId = adObject.adId,
      ad = adObject.ad,
      adUrl = adObject.adUrl,
      width = adObject.width,
      height = adObject.height;


  if (adId) {
    resizeRemoteCreative(adObject);
    source.postMessage(JSON.stringify({
      message: 'Prebid Response',
      ad: ad,
      adUrl: adUrl,
      adId: adId,
      width: width,
      height: height
    }), remoteDomain);
  }
}

function resizeRemoteCreative(_ref) {
  var adUnitCode = _ref.adUnitCode,
      width = _ref.width,
      height = _ref.height;

  var iframe = document.getElementById((0, _find2.default)(window.googletag.pubads().getSlots().filter((0, _utils.isSlotMatchingAdUnitCode)(adUnitCode)), function (slot) {
    return slot;
  }).getSlotElementId()).querySelector('iframe');

  iframe.width = '' + width;
  iframe.height = '' + height;
}

/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(23) && !__webpack_require__(29)(function () {
  return Object.defineProperty(__webpack_require__(48)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 48:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(17);
var document = __webpack_require__(20).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ 49:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(17);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 50:
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 51:
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(33);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(54);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(17);
var isArray = __webpack_require__(36);
var SPECIES = __webpack_require__(55)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ 55:
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(56)('wks');
var uid = __webpack_require__(57);
var Symbol = __webpack_require__(20).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ 56:
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(20);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),

/***/ 57:
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__(16);
var $includes = __webpack_require__(59)(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__(24)('includes');


/***/ }),

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(60);
var toLength = __webpack_require__(34);
var toAbsoluteIndex = __webpack_require__(61);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ajax = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.ajaxBuilder = ajaxBuilder;

var _url = __webpack_require__(12);

var utils = __webpack_require__(0);

var XHR_DONE = 4;

/**
 * Simple IE9+ and cross-browser ajax request function
 * Note: x-domain requests in IE9 do not support the use of cookies
 *
 * @param url string url
 * @param callback {object | function} callback
 * @param data mixed data
 * @param options object
 */
var ajax = exports.ajax = ajaxBuilder();

function ajaxBuilder() {
  var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3000;

  return function (url, callback, data) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    try {
      var x = void 0;
      var useXDomainRequest = false;
      var method = options.method || (data ? 'POST' : 'GET');

      var callbacks = (typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) === 'object' && callback !== null ? callback : {
        success: function success() {
          utils.logMessage('xhr success');
        },
        error: function error(e) {
          utils.logError('xhr error', null, e);
        }
      };

      if (typeof callback === 'function') {
        callbacks.success = callback;
      }

      if (!window.XMLHttpRequest) {
        useXDomainRequest = true;
      } else {
        x = new window.XMLHttpRequest();
        if (x.responseType === undefined) {
          useXDomainRequest = true;
        }
      }

      if (useXDomainRequest) {
        x = new window.XDomainRequest();
        x.onload = function () {
          callbacks.success(x.responseText, x);
        };

        // http://stackoverflow.com/questions/15786966/xdomainrequest-aborts-post-on-ie-9
        x.onerror = function () {
          callbacks.error('error', x);
        };
        x.ontimeout = function () {
          callbacks.error('timeout', x);
        };
        x.onprogress = function () {
          utils.logMessage('xhr onprogress');
        };
      } else {
        x.onreadystatechange = function () {
          if (x.readyState === XHR_DONE) {
            var status = x.status;
            if (status >= 200 && status < 300 || status === 304) {
              callbacks.success(x.responseText, x);
            } else {
              callbacks.error(x.statusText, x);
            }
          }
        };
        x.ontimeout = function () {
          utils.logError('  xhr timeout after ', x.timeout, 'ms');
        };
      }

      if (method === 'GET' && data) {
        var urlInfo = (0, _url.parse)(url, options);
        _extends(urlInfo.search, data);
        url = (0, _url.format)(urlInfo);
      }

      x.open(method, url);
      // IE needs timoeut to be set after open - see #1410
      x.timeout = timeout;

      if (!useXDomainRequest) {
        if (options.withCredentials) {
          x.withCredentials = true;
        }
        utils._each(options.customHeaders, function (value, header) {
          x.setRequestHeader(header, value);
        });
        if (options.preflight) {
          x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        x.setRequestHeader('Content-Type', options.contentType || 'text/plain');
      }
      if (method === 'POST' && data) {
        x.send(data);
      } else {
        x.send();
      }
    } catch (error) {
      utils.logError('xhr construction', error);
    }
  };
}

/***/ }),

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(31);
var defined = __webpack_require__(33);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ 61:
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(35);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ 62:
/***/ (function(module, exports) {

module.exports = clone;

/*
  Identical to `just-extend(true, {}, obj1)`

  var arr = [1, 2, 3];
  var subObj = {aa: 1};
  var obj = {a: 3, b: 5, c: arr, d: subObj};
  var objClone = clone(obj);
  arr.push(4);
  subObj.bb = 2;
  obj; // {a: 3, b: 5, c: [1, 2, 3, 4], d: {aa: 1}}
  objClone; // {a: 3, b: 5, c: [1, 2, 3], d: {aa: 1, bb: 2}}
*/

function clone(obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    // include prototype properties
    var value = obj[key];
    if (value && typeof value == 'object') {
      result[key] = clone(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}


/***/ }),

/***/ 63:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.setSizeConfig = setSizeConfig;
exports.resolveStatus = resolveStatus;

var _config = __webpack_require__(4);

var _utils = __webpack_require__(0);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sizeConfig = [];

/**
 * @typedef {object} SizeConfig
 *
 * @property {string} [mediaQuery] A CSS media query string that will to be interpreted by window.matchMedia.  If the
 *  media query matches then the this config will be active and sizesSupported will filter bid and adUnit sizes.  If
 *  this property is not present then this SizeConfig will only be active if triggered manually by a call to
 *  pbjs.setConfig({labels:['label']) specifying one of the labels present on this SizeConfig.
 * @property {Array<Array>} sizesSupported The sizes to be accepted if this SizeConfig is enabled.
 * @property {Array<string>} labels The active labels to match this SizeConfig to an adUnits and/or bidders.
 */

/**
 *
 * @param {Array<SizeConfig>} config
 */
function setSizeConfig(config) {
  sizeConfig = config;
}
_config.config.getConfig('sizeConfig', function (config) {
  return setSizeConfig(config.sizeConfig);
});

/**
 * Resolves the unique set of the union of all sizes and labels that are active from a SizeConfig.mediaQuery match
 * @param {Array<string>} labels Labels specified on adUnit or bidder
 * @param {boolean} labelAll if true, all labels must match to be enabled
 * @param {Array<string>} activeLabels Labels passed in through requestBids
 * @param {Array<Array<number>>} sizes Sizes specified on adUnit
 * @param {Array<SizeConfig>} configs
 * @returns {{labels: Array<string>, sizes: Array<Array<number>>}}
 */
function resolveStatus() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$labels = _ref.labels,
      labels = _ref$labels === undefined ? [] : _ref$labels,
      _ref$labelAll = _ref.labelAll,
      labelAll = _ref$labelAll === undefined ? false : _ref$labelAll,
      _ref$activeLabels = _ref.activeLabels,
      activeLabels = _ref$activeLabels === undefined ? [] : _ref$activeLabels;

  var sizes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var configs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : sizeConfig;

  var maps = evaluateSizeConfig(configs);

  var filteredSizes = void 0;
  if (maps.shouldFilter) {
    filteredSizes = sizes.filter(function (size) {
      return maps.sizesSupported[size];
    });
  } else {
    filteredSizes = sizes;
  }

  return {
    active: filteredSizes.length > 0 && (labels.length === 0 || !labelAll && (labels.some(function (label) {
      return maps.labels[label];
    }) || labels.some(function (label) {
      return (0, _includes2.default)(activeLabels, label);
    })) || labelAll && labels.reduce(function (result, label) {
      return !result ? result : maps.labels[label] || (0, _includes2.default)(activeLabels, label);
    }, true)),
    sizes: filteredSizes
  };
}

function evaluateSizeConfig(configs) {
  return configs.reduce(function (results, config) {
    if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && typeof config.mediaQuery === 'string') {
      if (matchMedia(config.mediaQuery).matches) {
        if (Array.isArray(config.sizesSupported)) {
          results.shouldFilter = true;
        }
        ['labels', 'sizesSupported'].forEach(function (type) {
          return (config[type] || []).forEach(function (thing) {
            return results[type][thing] = true;
          });
        });
      }
    } else {
      (0, _utils.logWarn)('sizeConfig rule missing required property "mediaQuery"');
    }
    return results;
  }, {
    labels: {},
    sizesSupported: {},
    shouldFilter: false
  });
}

/***/ }),

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasNonVideoBidder = exports.videoBidder = exports.videoAdUnit = undefined;
exports.isValidVideoBid = isValidVideoBid;

var _adaptermanager = __webpack_require__(8);

var _utils = __webpack_require__(0);

var _config = __webpack_require__(4);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VIDEO_MEDIA_TYPE = 'video';
var OUTSTREAM = 'outstream';

/**
 * Helper functions for working with video-enabled adUnits
 */
var videoAdUnit = exports.videoAdUnit = function videoAdUnit(adUnit) {
  var mediaType = adUnit.mediaType === VIDEO_MEDIA_TYPE;
  var mediaTypes = (0, _utils.deepAccess)(adUnit, 'mediaTypes.video');
  return mediaType || mediaTypes;
};
var videoBidder = exports.videoBidder = function videoBidder(bid) {
  return (0, _includes2.default)(_adaptermanager.videoAdapters, bid.bidder);
};
var hasNonVideoBidder = exports.hasNonVideoBidder = function hasNonVideoBidder(adUnit) {
  return adUnit.bids.filter(function (bid) {
    return !videoBidder(bid);
  }).length;
};

/**
 * @typedef {object} VideoBid
 * @property {string} adId id of the bid
 */

/**
 * Validate that the assets required for video context are present on the bid
 * @param {VideoBid} bid Video bid to validate
 * @param {BidRequest[]} bidRequests All bid requests for an auction
 * @return {Boolean} If object is valid
 */
function isValidVideoBid(bid, bidRequests) {
  var bidRequest = (0, _utils.getBidRequest)(bid.adId, bidRequests);

  var videoMediaType = bidRequest && (0, _utils.deepAccess)(bidRequest, 'mediaTypes.video');
  var context = videoMediaType && (0, _utils.deepAccess)(videoMediaType, 'context');

  // if context not defined assume default 'instream' for video bids
  // instream bids require a vast url or vast xml content
  if (!bidRequest || videoMediaType && context !== OUTSTREAM) {
    // xml-only video bids require a prebid cache url
    if (!_config.config.getConfig('cache.url') && bid.vastXml && !bid.vastUrl) {
      (0, _utils.logError)('\n        This bid contains only vastXml and will not work when a prebid cache url is not specified.\n        Try enabling prebid cache with pbjs.setConfig({ cache: {url: "..."} });\n      ');
      return false;
    }

    return !!(bid.vastUrl || bid.vastXml);
  }

  // outstream bids require a renderer on the bid or pub-defined on adunit
  if (context === OUTSTREAM) {
    // WIKIA_CHANGE: Set as valid if bidder renderer is disabled for outstream bids
    return !!(bid.renderer || bidRequest.renderer || bid.vastContent);
  }

  return true;
}

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(58);
module.exports = __webpack_require__(15).Array.includes;


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /** @module adaptermanger */

var _utils = __webpack_require__(0);

var _sizeMapping = __webpack_require__(63);

var _native = __webpack_require__(18);

var _bidderFactory = __webpack_require__(1);

var _ajax = __webpack_require__(6);

var _config = __webpack_require__(4);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

var _find = __webpack_require__(10);

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utils = __webpack_require__(0);
var CONSTANTS = __webpack_require__(2);
var events = __webpack_require__(9);
var s2sTestingModule = void 0; // store s2sTesting module if it's loaded

var _bidderRegistry = {};
exports.bidderRegistry = _bidderRegistry;
exports.aliasRegistry = {};

var _s2sConfig = {};
_config.config.getConfig('s2sConfig', function (config) {
  _s2sConfig = config.s2sConfig;
});

var _analyticsRegistry = {};

/**
 * @typedef {object} LabelDescriptor
 * @property {boolean} labelAll describes whether or not this object expects all labels to match, or any label to match
 * @property {Array<string>} labels the labels listed on the bidder or adUnit
 * @property {Array<string>} activeLabels the labels specified as being active by requestBids
 */

/**
 * Returns object describing the status of labels on the adUnit or bidder along with labels passed into requestBids
 * @param bidOrAdUnit the bidder or adUnit to get label info on
 * @param activeLabels the labels passed to requestBids
 * @returns {LabelDescriptor}
 */
function getLabels(bidOrAdUnit, activeLabels) {
  if (bidOrAdUnit.labelAll) {
    return { labelAll: true, labels: bidOrAdUnit.labelAll, activeLabels: activeLabels };
  }
  return { labelAll: false, labels: bidOrAdUnit.labelAny, activeLabels: activeLabels };
}

function getBids(_ref) {
  var bidderCode = _ref.bidderCode,
      auctionId = _ref.auctionId,
      bidderRequestId = _ref.bidderRequestId,
      adUnits = _ref.adUnits,
      labels = _ref.labels;

  return adUnits.reduce(function (result, adUnit) {
    var _resolveStatus = (0, _sizeMapping.resolveStatus)(getLabels(adUnit, labels), adUnit.sizes),
        active = _resolveStatus.active,
        filteredAdUnitSizes = _resolveStatus.sizes;

    if (active) {
      result.push(adUnit.bids.filter(function (bid) {
        return bid.bidder === bidderCode;
      }).reduce(function (bids, bid) {
        if (adUnit.mediaTypes) {
          if (utils.isValidMediaTypes(adUnit.mediaTypes)) {
            bid = _extends({}, bid, { mediaTypes: adUnit.mediaTypes });
          } else {
            utils.logError('mediaTypes is not correctly configured for adunit ' + adUnit.code);
          }
        }

        var nativeParams = adUnit.nativeParams || utils.deepAccess(adUnit, 'mediaTypes.native');
        if (nativeParams) {
          bid = _extends({}, bid, {
            nativeParams: (0, _native.processNativeAdUnitParams)(nativeParams)
          });
        }

        bid = _extends({}, bid, (0, _utils.getDefinedParams)(adUnit, ['mediaType', 'renderer']));

        var _resolveStatus2 = (0, _sizeMapping.resolveStatus)(getLabels(bid, labels), filteredAdUnitSizes),
            active = _resolveStatus2.active,
            sizes = _resolveStatus2.sizes;

        if (active) {
          bids.push(_extends({}, bid, {
            adUnitCode: adUnit.code,
            transactionId: adUnit.transactionId,
            sizes: sizes,
            bidId: bid.bid_id || utils.getUniqueIdentifierStr(),
            bidderRequestId: bidderRequestId,
            auctionId: auctionId
          }));
        }
        return bids;
      }, []));
    }
    return result;
  }, []).reduce(_utils.flatten, []).filter(function (val) {
    return val !== '';
  });
}

function getAdUnitCopyForPrebidServer(adUnits) {
  var adaptersServerSide = _s2sConfig.bidders;
  var adUnitsCopy = utils.deepClone(adUnits);

  adUnitsCopy.forEach(function (adUnit) {
    // filter out client side bids
    adUnit.bids = adUnit.bids.filter(function (bid) {
      return (0, _includes2.default)(adaptersServerSide, bid.bidder) && (!doingS2STesting() || bid.finalSource !== s2sTestingModule.CLIENT);
    }).map(function (bid) {
      bid.bid_id = utils.getUniqueIdentifierStr();
      return bid;
    });
  });

  // don't send empty requests
  adUnitsCopy = adUnitsCopy.filter(function (adUnit) {
    return adUnit.bids.length !== 0;
  });
  return adUnitsCopy;
}

function getAdUnitCopyForClientAdapters(adUnits) {
  var adUnitsClientCopy = utils.deepClone(adUnits);
  // filter out s2s bids
  adUnitsClientCopy.forEach(function (adUnit) {
    adUnit.bids = adUnit.bids.filter(function (bid) {
      return !doingS2STesting() || bid.finalSource !== s2sTestingModule.SERVER;
    });
  });

  // don't send empty requests
  adUnitsClientCopy = adUnitsClientCopy.filter(function (adUnit) {
    return adUnit.bids.length !== 0;
  });

  return adUnitsClientCopy;
}

exports.gdprDataHandler = {
  consentData: null,
  setConsentData: function setConsentData(consentInfo) {
    this.consentData = consentInfo;
  },
  getConsentData: function getConsentData() {
    return this.consentData;
  }
};

exports.makeBidRequests = function (adUnits, auctionStart, auctionId, cbTimeout, labels) {
  var bidRequests = [];

  adUnits = exports.checkBidRequestSizes(adUnits);

  var bidderCodes = (0, _utils.getBidderCodes)(adUnits);
  if (_config.config.getConfig('bidderSequence') === _config.RANDOM) {
    bidderCodes = (0, _utils.shuffle)(bidderCodes);
  }

  var clientBidderCodes = bidderCodes;
  var clientTestAdapters = [];
  if (_s2sConfig.enabled) {
    // if s2sConfig.bidderControl testing is turned on
    if (doingS2STesting()) {
      // get all adapters doing client testing
      clientTestAdapters = s2sTestingModule.getSourceBidderMap(adUnits)[s2sTestingModule.CLIENT];
    }

    // these are called on the s2s adapter
    var adaptersServerSide = _s2sConfig.bidders;

    // don't call these client side (unless client request is needed for testing)
    clientBidderCodes = bidderCodes.filter(function (elm) {
      return !(0, _includes2.default)(adaptersServerSide, elm) || (0, _includes2.default)(clientTestAdapters, elm);
    });

    var adUnitsS2SCopy = getAdUnitCopyForPrebidServer(adUnits);
    var tid = utils.generateUUID();
    adaptersServerSide.forEach(function (bidderCode) {
      var bidderRequestId = utils.getUniqueIdentifierStr();
      var bidderRequest = {
        bidderCode: bidderCode,
        auctionId: auctionId,
        bidderRequestId: bidderRequestId,
        tid: tid,
        adUnitsS2SCopy: adUnitsS2SCopy,
        bids: getBids({ bidderCode: bidderCode, auctionId: auctionId, bidderRequestId: bidderRequestId, 'adUnits': adUnitsS2SCopy, labels: labels }),
        auctionStart: auctionStart,
        timeout: _s2sConfig.timeout,
        src: CONSTANTS.S2S.SRC
      };
      if (bidderRequest.bids.length !== 0) {
        bidRequests.push(bidderRequest);
      }
    });
  }

  // client adapters
  var adUnitsClientCopy = getAdUnitCopyForClientAdapters(adUnits);
  clientBidderCodes.forEach(function (bidderCode) {
    var bidderRequestId = utils.getUniqueIdentifierStr();
    var bidderRequest = {
      bidderCode: bidderCode,
      auctionId: auctionId,
      bidderRequestId: bidderRequestId,
      bids: getBids({ bidderCode: bidderCode, auctionId: auctionId, bidderRequestId: bidderRequestId, 'adUnits': adUnitsClientCopy, labels: labels }),
      auctionStart: auctionStart,
      timeout: cbTimeout
    };
    if (bidderRequest.bids && bidderRequest.bids.length !== 0) {
      bidRequests.push(bidderRequest);
    }
  });

  if (exports.gdprDataHandler.getConsentData()) {
    bidRequests.forEach(function (bidRequest) {
      bidRequest['gdprConsent'] = exports.gdprDataHandler.getConsentData();
    });
  }
  return bidRequests;
};

exports.checkBidRequestSizes = function (adUnits) {
  function isArrayOfNums(val) {
    return Array.isArray(val) && val.length === 2 && utils.isInteger(val[0]) && utils.isInteger(val[1]);
  }

  adUnits.forEach(function (adUnit) {
    if (adUnit.sizes) {
      utils.logWarn('Usage of adUnits.sizes will eventually be deprecated.  Please define size dimensions within the corresponding area of the mediaTypes.<object> (eg mediaTypes.banner.sizes).');
    }

    var mediaTypes = adUnit.mediaTypes;
    if (mediaTypes && mediaTypes.banner) {
      var banner = mediaTypes.banner;
      if (banner.sizes) {
        adUnit.sizes = banner.sizes;
      } else {
        utils.logError('Detected a mediaTypes.banner object did not include sizes.  This is a required field for the mediaTypes.banner object.  Removing invalid mediaTypes.banner object from request.');
        delete adUnit.mediaTypes.banner;
      }
    }

    if (mediaTypes && mediaTypes.video) {
      var video = mediaTypes.video;
      if (video.playerSize) {
        if (Array.isArray(video.playerSize) && video.playerSize.length === 1 && video.playerSize.every(isArrayOfNums)) {
          adUnit.sizes = video.playerSize;
        } else if (isArrayOfNums(video.playerSize)) {
          var newPlayerSize = [];
          newPlayerSize.push(video.playerSize);
          utils.logInfo('Transforming video.playerSize from ' + video.playerSize + ' to ' + newPlayerSize + ' so it\'s in the proper format.');
          adUnit.sizes = video.playerSize = newPlayerSize;
        } else {
          utils.logError('Detected incorrect configuration of mediaTypes.video.playerSize.  Please specify only one set of dimensions in a format like: [[640, 480]]. Removing invalid mediaTypes.video.playerSize property from request.');
          delete adUnit.mediaTypes.video.playerSize;
        }
      }
    }

    if (mediaTypes && mediaTypes.native) {
      var native = mediaTypes.native;
      if (native.image && native.image.sizes && !Array.isArray(native.image.sizes)) {
        utils.logError('Please use an array of sizes for native.image.sizes field.  Removing invalid mediaTypes.native.image.sizes property from request.');
        delete adUnit.mediaTypes.native.image.sizes;
      }
      if (native.image && native.image.aspect_ratios && !Array.isArray(native.image.aspect_ratios)) {
        utils.logError('Please use an array of sizes for native.image.aspect_ratios field.  Removing invalid mediaTypes.native.image.aspect_ratios property from request.');
        delete adUnit.mediaTypes.native.image.aspect_ratios;
      }
      if (native.icon && native.icon.sizes && !Array.isArray(native.icon.sizes)) {
        utils.logError('Please use an array of sizes for native.icon.sizes field.  Removing invalid mediaTypes.native.icon.sizes property from request.');
        delete adUnit.mediaTypes.native.icon.sizes;
      }
    }
  });
  return adUnits;
};

exports.callBids = function (adUnits, bidRequests, addBidResponse, doneCb) {
  if (!bidRequests.length) {
    utils.logWarn('callBids executed with no bidRequests.  Were they filtered by labels or sizing?');
    return;
  }

  var ajax = (0, _ajax.ajaxBuilder)(bidRequests[0].timeout);

  var _bidRequests$reduce = bidRequests.reduce(function (partitions, bidRequest) {
    partitions[Number(typeof bidRequest.src !== 'undefined' && bidRequest.src === CONSTANTS.S2S.SRC)].push(bidRequest);
    return partitions;
  }, [[], []]),
      _bidRequests$reduce2 = _slicedToArray(_bidRequests$reduce, 2),
      clientBidRequests = _bidRequests$reduce2[0],
      serverBidRequests = _bidRequests$reduce2[1];

  if (serverBidRequests.length) {
    var adaptersServerSide = _s2sConfig.bidders;
    var s2sAdapter = _bidderRegistry[_s2sConfig.adapter];
    var tid = serverBidRequests[0].tid;
    var adUnitsS2SCopy = serverBidRequests[0].adUnitsS2SCopy;
    adUnitsS2SCopy.forEach(function (adUnitCopy) {
      var validBids = adUnitCopy.bids.filter(function (bid) {
        return (0, _find2.default)(serverBidRequests, function (request) {
          return request.bidderCode === bid.bidder && (0, _find2.default)(request.bids, function (reqBid) {
            return reqBid.adUnitCode === adUnitCopy.code;
          });
        });
      });
      adUnitCopy.bids = validBids;
    });

    adUnitsS2SCopy = adUnitsS2SCopy.filter(function (adUnitCopy) {
      return adUnitCopy.bids.length > 0;
    });

    if (s2sAdapter) {
      var s2sBidRequest = { tid: tid, 'ad_units': adUnitsS2SCopy };
      if (s2sBidRequest.ad_units.length) {
        var doneCbs = serverBidRequests.map(function (bidRequest) {
          bidRequest.start = (0, _utils.timestamp)();
          bidRequest.doneCbCallCount = 0;
          return doneCb(bidRequest.bidderRequestId);
        });

        // only log adapters that actually have adUnit bids
        var allBidders = s2sBidRequest.ad_units.reduce(function (adapters, adUnit) {
          return adapters.concat((adUnit.bids || []).reduce(function (adapters, bid) {
            return adapters.concat(bid.bidder);
          }, []));
        }, []);
        utils.logMessage('CALLING S2S HEADER BIDDERS ==== ' + adaptersServerSide.filter(function (adapter) {
          return (0, _includes2.default)(allBidders, adapter);
        }).join(','));

        // fire BID_REQUESTED event for each s2s bidRequest
        serverBidRequests.forEach(function (bidRequest) {
          events.emit(CONSTANTS.EVENTS.BID_REQUESTED, bidRequest);
        });

        // make bid requests
        s2sAdapter.callBids(s2sBidRequest, serverBidRequests, addBidResponse, function () {
          return doneCbs.forEach(function (done) {
            return done();
          });
        }, ajax);
      }
    }
  }

  // handle client adapter requests
  clientBidRequests.forEach(function (bidRequest) {
    bidRequest.start = (0, _utils.timestamp)();
    // TODO : Do we check for bid in pool from here and skip calling adapter again ?
    var adapter = _bidderRegistry[bidRequest.bidderCode];
    if (adapter) {
      utils.logMessage('CALLING BIDDER ======= ' + bidRequest.bidderCode);
      events.emit(CONSTANTS.EVENTS.BID_REQUESTED, bidRequest);
      bidRequest.doneCbCallCount = 0;
      var done = doneCb(bidRequest.bidderRequestId);
      adapter.callBids(bidRequest, addBidResponse, done, ajax);
    } else {
      utils.logError('Adapter trying to be called which does not exist: ' + bidRequest.bidderCode + ' adaptermanager.callBids');
    }
  });
};

function doingS2STesting() {
  return _s2sConfig && _s2sConfig.enabled && _s2sConfig.testing && s2sTestingModule;
}

function getSupportedMediaTypes(bidderCode) {
  var result = [];
  if ((0, _includes2.default)(exports.videoAdapters, bidderCode)) result.push('video');
  if ((0, _includes2.default)(_native.nativeAdapters, bidderCode)) result.push('native');
  return result;
}

exports.videoAdapters = []; // added by adapterLoader for now

exports.registerBidAdapter = function (bidAdaptor, bidderCode) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$supportedMediaT = _ref2.supportedMediaTypes,
      supportedMediaTypes = _ref2$supportedMediaT === undefined ? [] : _ref2$supportedMediaT;

  if (bidAdaptor && bidderCode) {
    if (typeof bidAdaptor.callBids === 'function') {
      _bidderRegistry[bidderCode] = bidAdaptor;

      if ((0, _includes2.default)(supportedMediaTypes, 'video')) {
        exports.videoAdapters.push(bidderCode);
      }
      if ((0, _includes2.default)(supportedMediaTypes, 'native')) {
        _native.nativeAdapters.push(bidderCode);
      }
    } else {
      utils.logError('Bidder adaptor error for bidder code: ' + bidderCode + 'bidder must implement a callBids() function');
    }
  } else {
    utils.logError('bidAdaptor or bidderCode not specified');
  }
};

exports.aliasBidAdapter = function (bidderCode, alias) {
  var existingAlias = _bidderRegistry[alias];

  if (typeof existingAlias === 'undefined') {
    var bidAdaptor = _bidderRegistry[bidderCode];
    if (typeof bidAdaptor === 'undefined') {
      utils.logError('bidderCode "' + bidderCode + '" is not an existing bidder.', 'adaptermanager.aliasBidAdapter');
    } else {
      try {
        var newAdapter = void 0;
        var supportedMediaTypes = getSupportedMediaTypes(bidderCode);
        // Have kept old code to support backward compatibilitiy.
        // Remove this if loop when all adapters are supporting bidderFactory. i.e When Prebid.js is 1.0
        if (bidAdaptor.constructor.prototype != Object.prototype) {
          newAdapter = new bidAdaptor.constructor();
          newAdapter.setBidderCode(alias);
        } else {
          var spec = bidAdaptor.getSpec();
          newAdapter = (0, _bidderFactory.newBidder)(_extends({}, spec, { code: alias }));
          exports.aliasRegistry[alias] = bidderCode;
        }
        this.registerBidAdapter(newAdapter, alias, {
          supportedMediaTypes: supportedMediaTypes
        });
      } catch (e) {
        utils.logError(bidderCode + ' bidder does not currently support aliasing.', 'adaptermanager.aliasBidAdapter');
      }
    }
  } else {
    utils.logMessage('alias name "' + alias + '" has been already specified.');
  }
};

exports.registerAnalyticsAdapter = function (_ref3) {
  var adapter = _ref3.adapter,
      code = _ref3.code;

  if (adapter && code) {
    if (typeof adapter.enableAnalytics === 'function') {
      adapter.code = code;
      _analyticsRegistry[code] = adapter;
    } else {
      utils.logError('Prebid Error: Analytics adaptor error for analytics "' + code + '"\n        analytics adapter must implement an enableAnalytics() function');
    }
  } else {
    utils.logError('Prebid Error: analyticsAdapter or analyticsCode not specified');
  }
};

exports.enableAnalytics = function (config) {
  if (!utils.isArray(config)) {
    config = [config];
  }

  utils._each(config, function (adapterConfig) {
    var adapter = _analyticsRegistry[adapterConfig.provider];
    if (adapter) {
      adapter.enableAnalytics(adapterConfig);
    } else {
      utils.logError('Prebid Error: no analytics adapter found in registry for\n        ' + adapterConfig.provider + '.');
    }
  });
};

exports.getBidAdapter = function (bidder) {
  return _bidderRegistry[bidder];
};

// the s2sTesting module is injected when it's loaded rather than being imported
// importing it causes the packager to include it even when it's not explicitly included in the build
exports.setS2STestingModule = function (module) {
  s2sTestingModule = module;
};

exports.callTimedOutBidders = function (adUnits, timedOutBidders, cbTimeout) {
  timedOutBidders = timedOutBidders.map(function (timedOutBidder) {
    // Adding user configured params & timeout to timeout event data
    timedOutBidder.params = utils.getUserConfiguredParams(adUnits, timedOutBidder.adUnitCode, timedOutBidder.bidder);
    timedOutBidder.timeout = cbTimeout;
    return timedOutBidder;
  });
  timedOutBidders = utils.groupBy(timedOutBidders, 'bidder');

  Object.keys(timedOutBidders).forEach(function (bidder) {
    try {
      var adapter = _bidderRegistry[bidder];
      var spec = adapter.getSpec();
      if (spec && spec.onTimeout && typeof spec.onTimeout === 'function') {
        utils.logInfo('Invoking ' + bidder + '.onTimeout');
        spec.onTimeout(timedOutBidders[bidder]);
      }
    } catch (e) {
      utils.logWarn('Error calling onTimeout of ' + bidder);
    }
  });
};

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * events.js
 */
var utils = __webpack_require__(0);
var CONSTANTS = __webpack_require__(2);
var slice = Array.prototype.slice;
var push = Array.prototype.push;

// define entire events
// var allEvents = ['bidRequested','bidResponse','bidWon','bidTimeout'];
var allEvents = utils._map(CONSTANTS.EVENTS, function (v) {
  return v;
});

var idPaths = CONSTANTS.EVENT_ID_PATHS;

// keep a record of all events fired
var eventsFired = [];

module.exports = function () {
  var _handlers = {};
  var _public = {};

  /**
   *
   * @param {String} eventString  The name of the event.
   * @param {Array} args  The payload emitted with the event.
   * @private
   */
  function _dispatch(eventString, args) {
    utils.logMessage('Emitting event for: ' + eventString);

    var eventPayload = args[0] || {};
    var idPath = idPaths[eventString];
    var key = eventPayload[idPath];
    var event = _handlers[eventString] || { que: [] };
    var eventKeys = utils._map(event, function (v, k) {
      return k;
    });

    var callbacks = [];

    // record the event:
    eventsFired.push({
      eventType: eventString,
      args: eventPayload,
      id: key
    });

    /** Push each specific callback to the `callbacks` array.
     * If the `event` map has a key that matches the value of the
     * event payload id path, e.g. `eventPayload[idPath]`, then apply
     * each function in the `que` array as an argument to push to the
     * `callbacks` array
     * */
    if (key && utils.contains(eventKeys, key)) {
      push.apply(callbacks, event[key].que);
    }

    /** Push each general callback to the `callbacks` array. */
    push.apply(callbacks, event.que);

    /** call each of the callbacks */
    utils._each(callbacks, function (fn) {
      if (!fn) return;
      try {
        fn.apply(null, args);
      } catch (e) {
        utils.logError('Error executing handler:', 'events.js', e);
      }
    });
  }

  function _checkAvailableEvent(event) {
    return utils.contains(allEvents, event);
  }

  _public.on = function (eventString, handler, id) {
    // check whether available event or not
    if (_checkAvailableEvent(eventString)) {
      var event = _handlers[eventString] || { que: [] };

      if (id) {
        event[id] = event[id] || { que: [] };
        event[id].que.push(handler);
      } else {
        event.que.push(handler);
      }

      _handlers[eventString] = event;
    } else {
      utils.logError('Wrong event name : ' + eventString + ' Valid event names :' + allEvents);
    }
  };

  _public.emit = function (event) {
    var args = slice.call(arguments, 1);
    _dispatch(event, args);
  };

  _public.off = function (eventString, handler, id) {
    var event = _handlers[eventString];

    if (utils.isEmpty(event) || utils.isEmpty(event.que) && utils.isEmpty(event[id])) {
      return;
    }

    if (id && (utils.isEmpty(event[id]) || utils.isEmpty(event[id].que))) {
      return;
    }

    if (id) {
      utils._each(event[id].que, function (_handler) {
        var que = event[id].que;
        if (_handler === handler) {
          que.splice(utils.indexOf.call(que, _handler), 1);
        }
      });
    } else {
      utils._each(event.que, function (_handler) {
        var que = event.que;
        if (_handler === handler) {
          que.splice(utils.indexOf.call(que, _handler), 1);
        }
      });
    }

    _handlers[eventString] = event;
  };

  _public.get = function () {
    return _handlers;
  };

  /**
   * This method can return a copy of all the events fired
   * @return {Array} array of events fired
   */
  _public.getEvents = function () {
    var arrayCopy = [];
    utils._each(eventsFired, function (value) {
      var newProp = _extends({}, value);
      arrayCopy.push(newProp);
    });

    return arrayCopy;
  };

  return _public;
}();

/***/ })

/******/ });

pbjsChunk([111],{

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(114);
module.exports = __webpack_require__(115);


/***/ }),

/***/ 114:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spec = undefined;

var _templateObject = _taggedTemplateLiteral(['//', '/pubapi/3.0/', '/', '/', '/', '/ADTECH;v=2;cmd=bid;cors=yes;alias=', ';misc=', '', '', '', ''], ['//', '/pubapi/3.0/', '/', '/', '/', '/ADTECH;v=2;cmd=bid;cors=yes;alias=', ';misc=', '', '', '', '']),
    _templateObject2 = _taggedTemplateLiteral(['//', '/bidRequest?'], ['//', '/bidRequest?']),
    _templateObject3 = _taggedTemplateLiteral(['dcn=', '&pos=', '&cmd=bid', ''], ['dcn=', '&pos=', '&cmd=bid', '']);

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

var _bidderFactory = __webpack_require__(1);

var _config = __webpack_require__(4);

var _constants = __webpack_require__(2);

var _mediaTypes = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var AOL_BIDDERS_CODES = {
  AOL: 'aol',
  ONEMOBILE: 'onemobile',
  ONEDISPLAY: 'onedisplay'
};

var AOL_ENDPOINTS = {
  DISPLAY: {
    GET: 'display-get'
  },
  MOBILE: {
    GET: 'mobile-get',
    POST: 'mobile-post'
  }
};

var SYNC_TYPES = {
  IFRAME: {
    TAG: 'iframe',
    TYPE: 'iframe'
  },
  IMAGE: {
    TAG: 'img',
    TYPE: 'image'
  }
};

var pubapiTemplate = template(_templateObject, 'host', 'network', 'placement', 'pageid', 'sizeid', 'alias', 'misc', 'bidfloor', 'keyValues', 'consentData');
var nexageBaseApiTemplate = template(_templateObject2, 'host');
var nexageGetApiTemplate = template(_templateObject3, 'dcn', 'pos', 'dynamicParams');
var MP_SERVER_MAP = {
  us: 'adserver-us.adtech.advertising.com',
  eu: 'adserver-eu.adtech.advertising.com',
  as: 'adserver-as.adtech.advertising.com'
};
var NEXAGE_SERVER = 'hb.nexage.com';
var ONE_DISPLAY_TTL = 60;
var ONE_MOBILE_TTL = 3600;

pbjs.aolGlobals = {
  pixelsDropped: false
};

var showCpmAdjustmentWarning = function () {
  var showCpmWarning = true;

  return function () {
    var bidderSettings = pbjs.bidderSettings;
    if (showCpmWarning && bidderSettings && bidderSettings.aol && typeof bidderSettings.aol.bidCpmAdjustment === 'function') {
      utils.logWarn('bidCpmAdjustment is active for the AOL adapter. ' + 'As of Prebid 0.14, AOL can bid in net – please contact your accounts team to enable.');
      showCpmWarning = false; // warning is shown at most once
    }
  };
}();

function template(strings) {
  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      values[_key2] = arguments[_key2];
    }

    var dict = values[values.length - 1] || {};
    var result = [strings[0]];
    keys.forEach(function (key, i) {
      var value = utils.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
}

function parsePixelItems(pixels) {
  var itemsRegExp = /(img|iframe)[\s\S]*?src\s*=\s*("|')(.*?)\2/gi;
  var tagNameRegExp = /\w*(?=\s)/;
  var srcRegExp = /src=("|')(.*?)\1/;
  var pixelsItems = [];

  if (pixels) {
    var matchedItems = pixels.match(itemsRegExp);
    if (matchedItems) {
      matchedItems.forEach(function (item) {
        var tagName = item.match(tagNameRegExp)[0];
        var url = item.match(srcRegExp)[2];

        if (tagName && tagName) {
          pixelsItems.push({
            type: tagName === SYNC_TYPES.IMAGE.TAG ? SYNC_TYPES.IMAGE.TYPE : SYNC_TYPES.IFRAME.TYPE,
            url: url
          });
        }
      });
    }
  }

  return pixelsItems;
}

function formatMarketplaceBidFloor(bidFloor) {
  return typeof bidFloor !== 'undefined' ? ';bidfloor=' + bidFloor.toString() : '';
}

function formatMarketplaceKeyValues(keyValues) {
  var formattedKeyValues = '';

  utils._each(keyValues, function (value, key) {
    formattedKeyValues += ';kv' + key + '=' + encodeURIComponent(value);
  });

  return formattedKeyValues;
}

function _isMarketplaceBidder(bidder) {
  return bidder === AOL_BIDDERS_CODES.AOL || bidder === AOL_BIDDERS_CODES.ONEDISPLAY;
}

function _isOneMobileBidder(bidderCode) {
  return bidderCode === AOL_BIDDERS_CODES.AOL || bidderCode === AOL_BIDDERS_CODES.ONEMOBILE;
}

function _isNexageRequestPost(bid) {
  if (_isOneMobileBidder(bid.bidder) && bid.params.id && bid.params.imp && bid.params.imp[0]) {
    var imp = bid.params.imp[0];
    return imp.id && imp.tagid && (imp.banner && imp.banner.w && imp.banner.h || imp.video && imp.video.mimes && imp.video.minduration && imp.video.maxduration);
  }
}

function _isNexageRequestGet(bid) {
  return _isOneMobileBidder(bid.bidder) && bid.params.dcn && bid.params.pos;
}

function isMarketplaceBid(bid) {
  return _isMarketplaceBidder(bid.bidder) && bid.params.placement && bid.params.network;
}

function isMobileBid(bid) {
  return _isNexageRequestGet(bid) || _isNexageRequestPost(bid);
}

function resolveEndpointCode(bid) {
  if (_isNexageRequestGet(bid)) {
    return AOL_ENDPOINTS.MOBILE.GET;
  } else if (_isNexageRequestPost(bid)) {
    return AOL_ENDPOINTS.MOBILE.POST;
  } else if (isMarketplaceBid(bid)) {
    return AOL_ENDPOINTS.DISPLAY.GET;
  }
}

var spec = exports.spec = {
  code: AOL_BIDDERS_CODES.AOL,
  aliases: [AOL_BIDDERS_CODES.ONEMOBILE, AOL_BIDDERS_CODES.ONEDISPLAY],
  supportedMediaTypes: [_mediaTypes.BANNER],
  isBidRequestValid: function isBidRequestValid(bid) {
    return isMarketplaceBid(bid) || isMobileBid(bid);
  },
  buildRequests: function buildRequests(bids, bidderRequest) {
    var _this = this;

    var consentData = bidderRequest ? bidderRequest.gdprConsent : null;

    return bids.map(function (bid) {
      var endpointCode = resolveEndpointCode(bid);

      if (endpointCode) {
        return _this.formatBidRequest(endpointCode, bid, consentData);
      }
    });
  },
  interpretResponse: function interpretResponse(_ref, bidRequest) {
    var body = _ref.body;

    showCpmAdjustmentWarning();

    if (!body) {
      utils.logError('Empty bid response', bidRequest.bidderCode, body);
    } else {
      var _bid = this._parseBidResponse(body, bidRequest);

      if (_bid) {
        return _bid;
      }
    }
  },
  getUserSyncs: function getUserSyncs(options, bidResponses) {
    var bidResponse = bidResponses[0];

    if (_config.config.getConfig('aol.userSyncOn') === _constants.EVENTS.BID_RESPONSE) {
      if (!pbjs.aolGlobals.pixelsDropped && bidResponse && bidResponse.ext && bidResponse.ext.pixels) {
        pbjs.aolGlobals.pixelsDropped = true;

        return parsePixelItems(bidResponse.ext.pixels);
      }
    }

    return [];
  },
  formatBidRequest: function formatBidRequest(endpointCode, bid, consentData) {
    var bidRequest = void 0;

    switch (endpointCode) {
      case AOL_ENDPOINTS.DISPLAY.GET:
        bidRequest = {
          url: this.buildMarketplaceUrl(bid, consentData),
          method: 'GET',
          ttl: ONE_DISPLAY_TTL
        };
        break;

      case AOL_ENDPOINTS.MOBILE.GET:
        bidRequest = {
          url: this.buildOneMobileGetUrl(bid, consentData),
          method: 'GET',
          ttl: ONE_MOBILE_TTL
        };
        break;

      case AOL_ENDPOINTS.MOBILE.POST:
        bidRequest = {
          url: this.buildOneMobileBaseUrl(bid),
          method: 'POST',
          ttl: ONE_MOBILE_TTL,
          data: this.buildOpenRtbRequestData(bid, consentData),
          options: {
            contentType: 'application/json',
            customHeaders: {
              'x-openrtb-version': '2.2'
            }
          }
        };
        break;
    }

    bidRequest.bidderCode = bid.bidder;
    bidRequest.bidId = bid.bidId;
    bidRequest.userSyncOn = bid.params.userSyncOn;

    return bidRequest;
  },
  buildMarketplaceUrl: function buildMarketplaceUrl(bid, consentData) {
    var params = bid.params;
    var serverParam = params.server;
    var regionParam = params.region || 'us';
    var server = void 0;

    if (!MP_SERVER_MAP.hasOwnProperty(regionParam)) {
      utils.logWarn('Unknown region \'' + regionParam + '\' for AOL bidder.');
      regionParam = 'us'; // Default region.
    }

    if (serverParam) {
      server = serverParam;
    } else {
      server = MP_SERVER_MAP[regionParam];
    }

    // Set region param, used by AOL analytics.
    params.region = regionParam;

    return pubapiTemplate({
      host: server,
      network: params.network,
      placement: parseInt(params.placement),
      pageid: params.pageId || 0,
      sizeid: params.sizeId || 0,
      alias: params.alias || utils.getUniqueIdentifierStr(),
      misc: new Date().getTime(), // cache busting,
      bidfloor: formatMarketplaceBidFloor(params.bidFloor),
      keyValues: formatMarketplaceKeyValues(params.keyValues),
      consentData: this.formatMarketplaceConsentData(consentData)
    });
  },
  buildOneMobileGetUrl: function buildOneMobileGetUrl(bid, consentData) {
    var _bid$params = bid.params,
        dcn = _bid$params.dcn,
        pos = _bid$params.pos,
        ext = _bid$params.ext;

    var nexageApi = this.buildOneMobileBaseUrl(bid);
    if (dcn && pos) {
      var dynamicParams = this.formatOneMobileDynamicParams(ext, consentData);
      nexageApi += nexageGetApiTemplate({ dcn: dcn, pos: pos, dynamicParams: dynamicParams });
    }
    return nexageApi;
  },
  buildOneMobileBaseUrl: function buildOneMobileBaseUrl(bid) {
    return nexageBaseApiTemplate({
      host: bid.params.host || NEXAGE_SERVER
    });
  },
  formatOneMobileDynamicParams: function formatOneMobileDynamicParams() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var consentData = arguments[1];

    if (this.isSecureProtocol()) {
      params.secure = 1;
    }

    if (this.isConsentRequired(consentData)) {
      params.euconsent = consentData.consentString;
      params.gdpr = 1;
    }

    var paramsFormatted = '';
    utils._each(params, function (value, key) {
      paramsFormatted += '&' + key + '=' + encodeURIComponent(value);
    });

    return paramsFormatted;
  },
  buildOpenRtbRequestData: function buildOpenRtbRequestData(bid, consentData) {
    var openRtbObject = {
      id: bid.params.id,
      imp: bid.params.imp
    };

    if (this.isConsentRequired(consentData)) {
      openRtbObject.user = {
        ext: {
          consent: consentData.consentString
        }
      };
      openRtbObject.regs = {
        ext: {
          gdpr: 1
        }
      };
    }

    return openRtbObject;
  },
  isConsentRequired: function isConsentRequired(consentData) {
    return !!(consentData && consentData.consentString && consentData.gdprApplies);
  },
  formatMarketplaceConsentData: function formatMarketplaceConsentData(consentData) {
    var consentRequired = this.isConsentRequired(consentData);

    return consentRequired ? ';euconsent=' + consentData.consentString + ';gdpr=1' : '';
  },
  _parseBidResponse: function _parseBidResponse(response, bidRequest) {
    var bidData = void 0;

    try {
      bidData = response.seatbid[0].bid[0];
    } catch (e) {
      return;
    }

    var cpm = void 0;

    if (bidData.ext && bidData.ext.encp) {
      cpm = bidData.ext.encp;
    } else {
      cpm = bidData.price;

      if (cpm === null || isNaN(cpm)) {
        utils.logError('Invalid price in bid response', AOL_BIDDERS_CODES.AOL, bid);
        return;
      }
    }

    var bidResponse = {
      bidderCode: bidRequest.bidderCode,
      requestId: bidRequest.bidId,
      ad: bidData.adm,
      cpm: cpm,
      width: bidData.w,
      height: bidData.h,
      creativeId: bidData.crid,
      pubapiId: response.id,
      currency: response.cur,
      dealId: bidData.dealid,
      netRevenue: true,
      ttl: bidRequest.ttl
    };

    if (response.ext && response.ext.pixels) {
      if (_config.config.getConfig('aol.userSyncOn') !== _constants.EVENTS.BID_RESPONSE) {
        bidResponse.ad += this.formatPixels(response.ext.pixels);
      }
    }

    return bidResponse;
  },
  formatPixels: function formatPixels(pixels) {
    var formattedPixels = pixels.replace(/<\/?script( type=('|")text\/javascript('|")|)?>/g, '');

    return '<script>var w=window,prebid;' + 'for(var i=0;i<10;i++){w = w.parent;prebid=w.pbjs;' + 'if(prebid && prebid.aolGlobals && !prebid.aolGlobals.pixelsDropped){' + 'try{prebid.aolGlobals.pixelsDropped=true;' + formattedPixels + 'break;}' + 'catch(e){continue;}' + '}}</script>';
  },

  isOneMobileBidder: _isOneMobileBidder,
  isSecureProtocol: function isSecureProtocol() {
    return document.location.protocol === 'https:';
  }
};

(0, _bidderFactory.registerBidder)(spec);

/***/ }),

/***/ 115:
/***/ (function(module, exports) {



/***/ })

},[113]);

pbjsChunk([109],{

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(119);
module.exports = __webpack_require__(120);


/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spec = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Renderer = __webpack_require__(14);

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

var _bidderFactory = __webpack_require__(1);

var _mediaTypes = __webpack_require__(3);

var _find = __webpack_require__(10);

var _find2 = _interopRequireDefault(_find);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var BIDDER_CODE = 'appnexus';
var URL = '//ib.adnxs.com/ut/v3/prebid';
var VIDEO_TARGETING = ['id', 'mimes', 'minduration', 'maxduration', 'startdelay', 'skippable', 'playback_method', 'frameworks'];
var USER_PARAMS = ['age', 'external_uid', 'segments', 'gender', 'dnt', 'language'];
var NATIVE_MAPPING = {
  body: 'description',
  cta: 'ctatext',
  image: {
    serverName: 'main_image',
    requiredParams: { required: true },
    minimumParams: { sizes: [{}] }
  },
  icon: {
    serverName: 'icon',
    requiredParams: { required: true },
    minimumParams: { sizes: [{}] }
  },
  sponsoredBy: 'sponsored_by'
};
var SOURCE = 'pbjs';
var ENABLE_VIDEO_RENDERER = false;

var spec = exports.spec = {
  code: BIDDER_CODE,
  aliases: ['appnexusAst', 'brealtime', 'pagescience', 'defymedia', 'gourmetads', 'matomy', 'featureforward', 'oftmedia', 'districtm'],
  supportedMediaTypes: [_mediaTypes.BANNER, _mediaTypes.VIDEO, _mediaTypes.NATIVE],

  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param {object} bid The bid to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function isBidRequestValid(bid) {
    return !!(bid.params.placementId || bid.params.member && bid.params.invCode);
  },

  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {BidRequest[]} bidRequests A non-empty list of bid requests which should be sent to the Server.
   * @return ServerRequest Info describing the request to the server.
   */
  buildRequests: function buildRequests(bidRequests, bidderRequest) {
    var tags = bidRequests.map(bidToTag);
    var userObjBid = (0, _find2.default)(bidRequests, hasUserInfo);
    var userObj = void 0;
    if (userObjBid) {
      userObj = {};
      Object.keys(userObjBid.params.user).filter(function (param) {
        return (0, _includes2.default)(USER_PARAMS, param);
      }).forEach(function (param) {
        return userObj[param] = userObjBid.params.user[param];
      });
    }

    var memberIdBid = (0, _find2.default)(bidRequests, hasMemberId);
    var member = memberIdBid ? parseInt(memberIdBid.params.member, 10) : 0;

    var payload = {
      tags: [].concat(_toConsumableArray(tags)),
      user: userObj,
      sdk: {
        source: SOURCE,
        version: '1.11.0'
      }
    };
    if (member > 0) {
      payload.member_id = member;
    }

    if (bidderRequest && bidderRequest.gdprConsent) {
      // note - objects for impbus use underscore instead of camelCase
      payload.gdpr_consent = {
        consent_string: bidderRequest.gdprConsent.consentString,
        consent_required: bidderRequest.gdprConsent.gdprApplies
      };
    }

    var payloadString = JSON.stringify(payload);
    return {
      method: 'POST',
      url: URL,
      data: payloadString,
      bidderRequest: bidderRequest
    };
  },

  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {*} serverResponse A successful response from the server.
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: function interpretResponse(serverResponse, _ref) {
    var _this = this;

    var bidderRequest = _ref.bidderRequest;

    serverResponse = serverResponse.body;
    var bids = [];
    if (!serverResponse || serverResponse.error) {
      var errorMessage = 'in response for ' + bidderRequest.bidderCode + ' adapter';
      if (serverResponse && serverResponse.error) {
        errorMessage += ': ' + serverResponse.error;
      }
      utils.logError(errorMessage);
      return bids;
    }

    if (serverResponse.tags) {
      serverResponse.tags.forEach(function (serverBid) {
        var rtbBid = getRtbBid(serverBid);
        if (rtbBid) {
          // WIKIA_CHANGE: 0 is also a valid information for us
          if (isFinite(rtbBid.cpm) && (0, _includes2.default)(_this.supportedMediaTypes, rtbBid.ad_type)) {
            var bid = newBid(serverBid, rtbBid, bidderRequest);
            bid.mediaType = parseMediaType(rtbBid);
            bids.push(bid);
          }
        }
      });
    }
    return bids;
  },

  getUserSyncs: function getUserSyncs(syncOptions) {
    if (syncOptions.iframeEnabled) {
      return [{
        type: 'iframe',
        url: '//acdn.adnxs.com/ib/static/usersync/v3/async_usersync.html'
      }];
    }
  }
};

function newRenderer(adUnitCode, rtbBid) {
  var rendererOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var renderer = _Renderer.Renderer.install({
    id: rtbBid.renderer_id,
    url: rtbBid.renderer_url,
    config: rendererOptions,
    loaded: false
  });

  try {
    renderer.setRender(outstreamRender);
  } catch (err) {
    utils.logWarn('Prebid Error calling setRender on renderer', err);
  }

  renderer.setEventHandlers({
    impression: function impression() {
      return utils.logMessage('AppNexus outstream video impression event');
    },
    loaded: function loaded() {
      return utils.logMessage('AppNexus outstream video loaded event');
    },
    ended: function ended() {
      utils.logMessage('AppNexus outstream renderer video event');
      document.querySelector('#' + adUnitCode).style.display = 'none';
    }
  });
  return renderer;
}

/* Turn keywords parameter into ut-compatible format */
function getKeywords(keywords) {
  var arrs = [];

  utils._each(keywords, function (v, k) {
    if (utils.isArray(v)) {
      var values = [];
      utils._each(v, function (val) {
        val = utils.getValueString('keywords.' + k, val);
        if (val) {
          values.push(val);
        }
      });
      v = values;
    } else {
      v = utils.getValueString('keywords.' + k, v);
      if (utils.isStr(v)) {
        v = [v];
      } else {
        return;
      } // unsuported types - don't send a key
    }
    arrs.push({ key: k, value: v });
  });

  return arrs;
}

/**
 * Unpack the Server's Bid into a Prebid-compatible one.
 * @param serverBid
 * @param rtbBid
 * @param bidderRequest
 * @return Bid
 */
function newBid(serverBid, rtbBid, bidderRequest) {
  var bid = {
    requestId: serverBid.uuid,
    cpm: rtbBid.cpm,
    creativeId: rtbBid.creative_id,
    dealId: rtbBid.deal_id,
    currency: 'USD',
    netRevenue: true,
    ttl: 300,
    appnexus: {
      buyerMemberId: rtbBid.buyer_member_id
    }
  };

  if (rtbBid.rtb.video) {
    _extends(bid, {
      // WIKIA_CHANGE: When 0 is returned by AppNexus size is not set - we want to fallback to 0 instead of undefined
      width: rtbBid.rtb.video.player_width || 0,
      height: rtbBid.rtb.video.player_height || 0,
      vastUrl: rtbBid.rtb.video.asset_url,
      vastImpUrl: rtbBid.notify_url,
      // WIKIA_CHANGE: Expose VAST content
      vastContent: rtbBid.rtb.video.content,
      ttl: 3600
    });
    // This supports Outstream Video
    // WIKIA_CHANGE: we want to disable ANOutstreamVideo renderer
    if (rtbBid.renderer_url && ENABLE_VIDEO_RENDERER) {
      var rendererOptions = utils.deepAccess(bidderRequest.bids[0], 'renderer.options');

      _extends(bid, {
        adResponse: serverBid,
        renderer: newRenderer(bid.adUnitCode, rtbBid, rendererOptions)
      });
      bid.adResponse.ad = bid.adResponse.ads[0];
      bid.adResponse.ad.video = bid.adResponse.ad.rtb.video;
    }
  } else if (rtbBid.rtb[_mediaTypes.NATIVE]) {
    var nativeAd = rtbBid.rtb[_mediaTypes.NATIVE];
    bid[_mediaTypes.NATIVE] = {
      title: nativeAd.title,
      body: nativeAd.desc,
      cta: nativeAd.ctatext,
      sponsoredBy: nativeAd.sponsored,
      clickUrl: nativeAd.link.url,
      clickTrackers: nativeAd.link.click_trackers,
      impressionTrackers: nativeAd.impression_trackers,
      javascriptTrackers: nativeAd.javascript_trackers
    };
    if (nativeAd.main_img) {
      bid['native'].image = {
        url: nativeAd.main_img.url,
        height: nativeAd.main_img.height,
        width: nativeAd.main_img.width
      };
    }
    if (nativeAd.icon) {
      bid['native'].icon = {
        url: nativeAd.icon.url,
        height: nativeAd.icon.height,
        width: nativeAd.icon.width
      };
    }
  } else {
    _extends(bid, {
      // WIKIA_CHANGE: When 0 is returned by AppNexus size is not set - we want to fallback to 0 instead of undefined
      width: rtbBid.rtb.banner.width || 0,
      height: rtbBid.rtb.banner.height || 0,
      ad: rtbBid.rtb.banner.content
    });
    try {
      var url = rtbBid.rtb.trackers[0].impression_urls[0];
      var tracker = utils.createTrackPixelHtml(url);
      bid.ad += tracker;
    } catch (error) {
      utils.logError('Error appending tracking pixel', error);
    }
  }

  return bid;
}

function bidToTag(bid) {
  var tag = {};
  tag.sizes = transformSizes(bid.sizes);
  tag.primary_size = tag.sizes[0];
  tag.ad_types = [];
  tag.uuid = bid.bidId;
  if (bid.params.placementId) {
    tag.id = parseInt(bid.params.placementId, 10);
  } else {
    tag.code = bid.params.invCode;
  }
  tag.allow_smaller_sizes = bid.params.allowSmallerSizes || false;
  tag.use_pmt_rule = bid.params.usePaymentRule || false;
  tag.prebid = true;
  tag.disable_psa = true;
  if (bid.params.reserve) {
    tag.reserve = bid.params.reserve;
  }
  if (bid.params.position) {
    tag.position = { 'above': 1, 'below': 2 }[bid.params.position] || 0;
  }
  if (bid.params.trafficSourceCode) {
    tag.traffic_source_code = bid.params.trafficSourceCode;
  }
  if (bid.params.privateSizes) {
    tag.private_sizes = transformSizes(bid.params.privateSizes);
  }
  if (bid.params.supplyType) {
    tag.supply_type = bid.params.supplyType;
  }
  if (bid.params.pubClick) {
    tag.pubclick = bid.params.pubClick;
  }
  if (bid.params.extInvCode) {
    tag.ext_inv_code = bid.params.extInvCode;
  }
  if (bid.params.externalImpId) {
    tag.external_imp_id = bid.params.externalImpId;
  }
  if (!utils.isEmpty(bid.params.keywords)) {
    tag.keywords = getKeywords(bid.params.keywords);
  }

  if (bid.mediaType === _mediaTypes.NATIVE || utils.deepAccess(bid, 'mediaTypes.' + _mediaTypes.NATIVE)) {
    tag.ad_types.push(_mediaTypes.NATIVE);

    if (bid.nativeParams) {
      var nativeRequest = buildNativeRequest(bid.nativeParams);
      tag[_mediaTypes.NATIVE] = { layouts: [nativeRequest] };
    }
  }

  var videoMediaType = utils.deepAccess(bid, 'mediaTypes.' + _mediaTypes.VIDEO);
  var context = utils.deepAccess(bid, 'mediaTypes.video.context');

  if (bid.mediaType === _mediaTypes.VIDEO || videoMediaType) {
    tag.ad_types.push(_mediaTypes.VIDEO);
  }

  // instream gets vastUrl, outstream gets vastXml
  if (bid.mediaType === _mediaTypes.VIDEO || videoMediaType && context !== 'outstream') {
    tag.require_asset_url = true;
  }

  if (bid.params.video) {
    tag.video = {};
    // place any valid video params on the tag
    Object.keys(bid.params.video).filter(function (param) {
      return (0, _includes2.default)(VIDEO_TARGETING, param);
    }).forEach(function (param) {
      return tag.video[param] = bid.params.video[param];
    });
  }

  if (utils.isEmpty(bid.mediaType) && utils.isEmpty(bid.mediaTypes) || bid.mediaType === _mediaTypes.BANNER || bid.mediaTypes && bid.mediaTypes[_mediaTypes.BANNER]) {
    tag.ad_types.push(_mediaTypes.BANNER);
  }

  return tag;
}

/* Turn bid request sizes into ut-compatible format */
function transformSizes(requestSizes) {
  var sizes = [];
  var sizeObj = {};

  if (utils.isArray(requestSizes) && requestSizes.length === 2 && !utils.isArray(requestSizes[0])) {
    sizeObj.width = parseInt(requestSizes[0], 10);
    sizeObj.height = parseInt(requestSizes[1], 10);
    sizes.push(sizeObj);
  } else if ((typeof requestSizes === 'undefined' ? 'undefined' : _typeof(requestSizes)) === 'object') {
    for (var i = 0; i < requestSizes.length; i++) {
      var size = requestSizes[i];
      sizeObj = {};
      sizeObj.width = parseInt(size[0], 10);
      sizeObj.height = parseInt(size[1], 10);
      sizes.push(sizeObj);
    }
  }

  return sizes;
}

function hasUserInfo(bid) {
  return !!bid.params.user;
}

function hasMemberId(bid) {
  return !!parseInt(bid.params.member, 10);
}

function getRtbBid(tag) {
  return tag && tag.ads && tag.ads.length && (0, _find2.default)(tag.ads, function (ad) {
    return ad.rtb;
  });
}

function buildNativeRequest(params) {
  var request = {};

  // map standard prebid native asset identifier to /ut parameters
  // e.g., tag specifies `body` but /ut only knows `description`.
  // mapping may be in form {tag: '<server name>'} or
  // {tag: {serverName: '<server name>', requiredParams: {...}}}
  Object.keys(params).forEach(function (key) {
    // check if one of the <server name> forms is used, otherwise
    // a mapping wasn't specified so pass the key straight through
    var requestKey = NATIVE_MAPPING[key] && NATIVE_MAPPING[key].serverName || NATIVE_MAPPING[key] || key;

    // required params are always passed on request
    var requiredParams = NATIVE_MAPPING[key] && NATIVE_MAPPING[key].requiredParams;
    request[requestKey] = _extends({}, requiredParams, params[key]);

    // minimum params are passed if no non-required params given on adunit
    var minimumParams = NATIVE_MAPPING[key] && NATIVE_MAPPING[key].minimumParams;

    if (requiredParams && minimumParams) {
      // subtract required keys from adunit keys
      var adunitKeys = Object.keys(params[key]);
      var requiredKeys = Object.keys(requiredParams);
      var remaining = adunitKeys.filter(function (key) {
        return !(0, _includes2.default)(requiredKeys, key);
      });

      // if none are left over, the minimum params needs to be sent
      if (remaining.length === 0) {
        request[requestKey] = _extends({}, request[requestKey], minimumParams);
      }
    }
  });

  return request;
}

function outstreamRender(bid) {
  // push to render queue because ANOutstreamVideo may not be loaded yet
  bid.renderer.push(function () {
    window.ANOutstreamVideo.renderAd({
      tagId: bid.adResponse.tag_id,
      sizes: [bid.getSize().split('x')],
      targetId: bid.adUnitCode, // target div id to render video
      uuid: bid.adResponse.uuid,
      adResponse: bid.adResponse,
      rendererOptions: bid.renderer.getConfig()
    }, handleOutstreamRendererEvents.bind(null, bid));
  });
}

function handleOutstreamRendererEvents(bid, id, eventName) {
  bid.renderer.handleVideoEvent({ id: id, eventName: eventName });
}

function parseMediaType(rtbBid) {
  var adType = rtbBid.ad_type;
  if (adType === _mediaTypes.VIDEO) {
    return _mediaTypes.VIDEO;
  } else if (adType === _mediaTypes.NATIVE) {
    return _mediaTypes.NATIVE;
  } else {
    return _mediaTypes.BANNER;
  }
}

(0, _bidderFactory.registerBidder)(spec);

/***/ }),

/***/ 120:
/***/ (function(module, exports) {



/***/ })

},[118]);

pbjsChunk([106],{

/***/ 127:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(128);
module.exports = __webpack_require__(129);


/***/ }),

/***/ 128:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spec = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * @file AudienceNetwork adapter.
                                                                                                                                                                                                                                                                               */


var _bidderFactory = __webpack_require__(1);

var _config = __webpack_require__(4);

var _url = __webpack_require__(12);

var _utils = __webpack_require__(0);

var _findIndex = __webpack_require__(22);

var _findIndex2 = _interopRequireDefault(_findIndex);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var code = 'audienceNetwork';
var currency = 'USD';
var method = 'GET';
var url = 'https://an.facebook.com/v2/placementbid.json';
var supportedMediaTypes = ['banner', 'video'];
var netRevenue = true;
var hb_bidder = 'fan';
var pbv = '1.11.0';

/**
 * Does this bid request contain valid parameters?
 * @param {Object} bid
 * @returns {Boolean}
 */
var isBidRequestValid = function isBidRequestValid(bid) {
  return _typeof(bid.params) === 'object' && typeof bid.params.placementId === 'string' && bid.params.placementId.length > 0 && Array.isArray(bid.sizes) && bid.sizes.length > 0 && (isFullWidth(bid.params.format) ? bid.sizes.map(flattenSize).some(function (size) {
    return size === '300x250';
  }) : true) && (isValidNonSizedFormat(bid.params.format) || bid.sizes.map(flattenSize).some(isValidSize));
};

/**
 * Flattens a 2-element [W, H] array as a 'WxH' string,
 * otherwise passes value through.
 * @param {Array|String} size
 * @returns {String}
 */
var flattenSize = function flattenSize(size) {
  return Array.isArray(size) && size.length === 2 ? size[0] + 'x' + size[1] : size;
};

/**
 * Expands a 'WxH' string as a 2-element [W, H] array
 * @param {String} size
 * @returns {Array}
 */
var expandSize = function expandSize(size) {
  return size.split('x').map(Number);
};

/**
 * Is this a valid slot size?
 * @param {String} size
 * @returns {Boolean}
 */
var isValidSize = function isValidSize(size) {
  return (0, _includes2.default)(['300x250', '320x50'], size);
};

/**
 * Is this a valid, non-sized format?
 * @param {String} size
 * @returns {Boolean}
 */
var isValidNonSizedFormat = function isValidNonSizedFormat(format) {
  return (0, _includes2.default)(['video', 'native'], format);
};

/**
 * Is this a valid size and format?
 * @param {String} size
 * @returns {Boolean}
 */
var isValidSizeAndFormat = function isValidSizeAndFormat(size, format) {
  return isFullWidth(format) && flattenSize(size) === '300x250' || isValidNonSizedFormat(format) || isValidSize(flattenSize(size));
};

/**
 * Is this a video format?
 * @param {String} format
 * @returns {Boolean}
 */
var isVideo = function isVideo(format) {
  return format === 'video';
};

/**
 * Is this a fullwidth format?
 * @param {String} format
 * @returns {Boolean}
 */
var isFullWidth = function isFullWidth(format) {
  return format === 'fullwidth';
};

/**
 * Which SDK version should be used for this format?
 * @param {String} format
 * @returns {String}
 */
var sdkVersion = function sdkVersion(format) {
  return isVideo(format) ? '' : '5.5.web';
};

/**
 * Does the search part of the URL contain "anhb_testmode"
 * and therefore indicate testmode should be used?
 * @returns {String} "true" or "false"
 */
var isTestmode = function isTestmode() {
  return Boolean(window && window.location && typeof window.location.search === 'string' && window.location.search.indexOf('anhb_testmode') !== -1).toString();
};

/**
 * Generate ad HTML for injection into an iframe
 * @param {String} placementId
 * @param {String} format
 * @param {String} bidId
 * @returns {String} HTML
 */
var createAdHtml = function createAdHtml(placementId, format, bidId) {
  var nativeStyle = format === 'native' ? '<script>window.onload=function(){if(parent){var o=document.getElementsByTagName("head")[0];var s=parent.document.getElementsByTagName("style");for(var i=0;i<s.length;i++)o.appendChild(s[i].cloneNode(true));}}</script>' : '';
  var nativeContainer = format === 'native' ? '<div class="thirdPartyRoot"><a class="fbAdLink"><div class="fbAdMedia thirdPartyMediaClass"></div><div class="fbAdSubtitle thirdPartySubtitleClass"></div><div class="fbDefaultNativeAdWrapper"><div class="fbAdCallToAction thirdPartyCallToActionClass"></div><div class="fbAdTitle thirdPartyTitleClass"></div></div></a></div>' : '';
  return '<html><head>' + nativeStyle + '</head><body><div style="display:none;position:relative;">\n<script type=\'text/javascript\'>var data = {placementid:\'' + placementId + '\',format:\'' + format + '\',bidid:\'' + bidId + '\',onAdLoaded:function(e){console.log(\'Audience Network [' + placementId + '] ad loaded\');e.style.display = \'block\';},onAdError:function(c,m){console.log(\'Audience Network [' + placementId + '] error (\' + c + \') \' + m);}};\n(function(a,b,c){var d=\'https://www.facebook.com\',e=\'https://connect.facebook.net/en_US/fbadnw55.js\',f={iframeLoaded:true,xhrLoaded:true},g=a.data,h=function(){if(Date.now){return Date.now();}else return +new Date();},i=function(aa){var ba=d+\'/audience_network/client_event\',ca={cb:h(),event_name:\'ADNW_ADERROR\',ad_pivot_type:\'audience_network_mobile_web\',sdk_version:\'5.5.web\',app_id:g.placementid.split(\'_\')[0],publisher_id:g.placementid.split(\'_\')[1],error_message:aa},da=[];for(var ea in ca)da.push(encodeURIComponent(ea)+\'=\'+encodeURIComponent(ca[ea]));var fa=ba+\'?\'+da.join(\'&\'),ga=new XMLHttpRequest();ga.open(\'GET\',fa,true);ga.send();if(g.onAdError)g.onAdError(\'1000\',\'Internal error.\');},j=function(){if(b.currentScript){return b.currentScript;}else{var aa=b.getElementsByTagName(\'script\');return aa[aa.length-1];}},k=function(aa){try{return aa.document.referrer;}catch(ba){}return \'\';},l=function(){var aa=a,ba=[aa];try{while(aa!==aa.parent&&aa.parent.document)ba.push(aa=aa.parent);}catch(ca){}return ba.reverse();},m=function(){var aa=l();for(var ba=0;ba<aa.length;ba++){var ca=aa[ba],da=ca.ADNW||{};ca.ADNW=da;if(!ca.ADNW)continue;return da.v55=da.v55||{ads:[],window:ca};}throw new Error(\'no_writable_global\');},n=function(aa){var ba=aa.indexOf(\'/\',aa.indexOf(\'://\')+3);if(ba===-1)return aa;return aa.substring(0,ba);},o=function(aa){return aa.location.href||k(aa);},p=function(aa){if(aa.sdkLoaded)return;var ba=aa.window.document,ca=ba.createElement(\'iframe\');ca.name=\'fbadnw\';ca.style.display=\'none\';ba.body.appendChild(ca);var da=ca.contentDocument.createElement(\'script\');da.src=e;da.async=true;ca.contentDocument.body.appendChild(da);aa.sdkLoaded=true;},q=function(aa){var ba=/^https?:\\/\\/www\\.google(\\.com?)?\\.\\w{2,3}$/;return !!aa.match(ba);},r=function(aa){return !!aa.match(/cdn\\.ampproject\\.org$/);},s=function(){var aa=c.ancestorOrigins||[],ba=aa[aa.length-1]||c.origin,ca=aa[aa.length-2]||c.origin;if(q(ba)&&r(ca)){return n(ca);}else return n(ba);},t=function(aa){try{return JSON.parse(aa);}catch(ba){i(ba.message);throw ba;}},u=function(aa,ba,ca){if(!aa.iframe){var da=ca.createElement(\'iframe\');da.src=d+\'/audiencenetwork/iframe/\';da.style.display=\'none\';ca.body.appendChild(da);aa.iframe=da;aa.iframeAppendedTime=h();aa.iframeData={};}ba.iframe=aa.iframe;ba.iframeData=aa.iframeData;ba.tagJsIframeAppendedTime=aa.iframeAppendedTime||0;},v=function(aa){var ba=d+\'/audiencenetwork/xhr/?sdk=5.5.web\';for(var ca in aa)if(typeof aa[ca]!==\'function\')ba+=\'&\'+ca+\'=\'+encodeURIComponent(aa[ca]);var da=new XMLHttpRequest();da.open(\'GET\',ba,true);da.withCredentials=true;da.onreadystatechange=function(){if(da.readyState===4){var ea=t(da.response);aa.events.push({name:\'xhrLoaded\',source:aa.iframe.contentWindow,data:ea,postMessageTimestamp:h(),receivedTimestamp:h()});}};da.send();},w=function(aa,ba){var ca=d+\'/audiencenetwork/xhriframe/?sdk=5.5.web\';for(var da in ba)if(typeof ba[da]!==\'function\')ca+=\'&\'+da+\'=\'+encodeURIComponent(ba[da]);var ea=b.createElement(\'iframe\');ea.src=ca;ea.style.display=\'none\';b.body.appendChild(ea);ba.iframe=ea;ba.iframeData={};ba.tagJsIframeAppendedTime=h();},x=function(aa){var ba=function(event){try{var da=event.data;if(da.name in f)aa.events.push({name:da.name,source:event.source,data:da.data});}catch(ea){}},ca=aa.iframe.contentWindow.parent;ca.addEventListener(\'message\',ba,false);},y=function(aa){if(aa.context&&aa.context.sourceUrl)return true;try{return !!JSON.parse(decodeURI(aa.name)).ampcontextVersion;}catch(ba){return false;}},z=function(aa){var ba=h(),ca=l()[0],da=j().parentElement,ea=ca!=a.top,fa=ca.$sf&&ca.$sf.ext,ga=o(ca),ha=m();p(ha);var ia={amp:y(ca),events:[],tagJsInitTime:ba,rootElement:da,iframe:null,tagJsIframeAppendedTime:ha.iframeAppendedTime||0,url:ga,domain:s(),channel:n(o(ca)),width:screen.width,height:screen.height,pixelratio:a.devicePixelRatio,placementindex:ha.ads.length,crossdomain:ea,safeframe:!!fa,placementid:g.placementid,format:g.format||\'300x250\',testmode:!!g.testmode,onAdLoaded:g.onAdLoaded,onAdError:g.onAdError};if(g.bidid)ia.bidid=g.bidid;if(ea){w(ha,ia);}else{u(ha,ia,ca.document);v(ia);}; x(ia);ia.rootElement.dataset.placementid=ia.placementid;ha.ads.push(ia);};try{z();}catch(aa){i(aa.message||aa);throw aa;}})(window,document,location);\n</script>\n' + nativeContainer + '</div></body></html>';
};

/**
 * Get the current window location URL correctly encoded for use in a URL query string.
 * @returns {String} URI-encoded URL
 */
var getTopWindowUrlEncoded = function getTopWindowUrlEncoded() {
  return encodeURIComponent((0, _utils.getTopWindowUrl)());
};

/**
 * Convert each bid request to a single URL to fetch those bids.
 * @param {Array} bids - list of bids
 * @param {String} bids[].placementCode - Prebid placement identifier
 * @param {Object} bids[].params
 * @param {String} bids[].params.placementId - Audience Network placement identifier
 * @param {String} bids[].params.format - Optional format, one of 'video', 'native' or 'fullwidth' if set
 * @param {Array} bids[].sizes - list of desired advert sizes
 * @param {Array} bids[].sizes[] - Size arrays [h,w]: should include one of [300, 250], [320, 50]: first matched size is used
 * @returns {Array<Object>} List of URLs to fetch, plus formats and sizes for later use with interpretResponse
 */
var buildRequests = function buildRequests(bids) {
  // Build lists of placementids, adformats, sizes and SDK versions
  var placementids = [];
  var adformats = [];
  var sizes = [];
  var sdk = [];
  var requestIds = [];

  bids.forEach(function (bid) {
    return bid.sizes.map(flattenSize).filter(function (size) {
      return isValidSizeAndFormat(size, bid.params.format);
    }).slice(0, 1).forEach(function (size) {
      placementids.push(bid.params.placementId);
      adformats.push(bid.params.format || size);
      sizes.push(size);
      sdk.push(sdkVersion(bid.params.format));
      requestIds.push(bid.bidId);
    });
  });

  // Build URL
  var testmode = isTestmode();
  var pageurl = getTopWindowUrlEncoded();
  var search = {
    placementids: placementids,
    adformats: adformats,
    testmode: testmode,
    pageurl: pageurl,
    sdk: sdk,
    pbv: pbv
  };
  var video = (0, _findIndex2.default)(adformats, isVideo);
  if (video !== -1) {
    var _expandSize = expandSize(sizes[video]);

    var _expandSize2 = _slicedToArray(_expandSize, 2);

    search.playerwidth = _expandSize2[0];
    search.playerheight = _expandSize2[1];
  }
  if ((0, _utils.isSafariBrowser)()) {
    search.cb = (0, _utils.generateUUID)();
  }
  var data = (0, _url.formatQS)(search);

  return [{ adformats: adformats, data: data, method: method, requestIds: requestIds, sizes: sizes, url: url }];
};

/**
 * Convert a server response to a bid response.
 * @param {Object} response - object representing the response
 * @param {Object} response.body - response body, already converted from JSON
 * @param {Object} bidRequests - the original bid requests
 * @param {Array} bidRequest.adformats - list of formats for the original bid requests
 * @param {Array} bidRequest.sizes - list of sizes fot the original bid requests
 * @returns {Array<Object>} A list of bid response objects
 */
var interpretResponse = function interpretResponse(_ref, _ref2) {
  var body = _ref.body;
  var adformats = _ref2.adformats,
      requestIds = _ref2.requestIds,
      sizes = _ref2.sizes;

  var ttl = Number(_config.config.getConfig().bidderTimeout);

  var _body$bids = body.bids,
      bids = _body$bids === undefined ? {} : _body$bids;

  return Object.keys(bids)
  // extract Array of bid responses
  .map(function (placementId) {
    return bids[placementId];
  })
  // flatten
  .reduce(function (a, b) {
    return a.concat(b);
  }, [])
  // transform to bidResponse
  .map(function (bid, i) {
    var fb_bidid = bid.bid_id,
        creativeId = bid.placement_id,
        cpm = bid.bid_price_cents;


    var format = adformats[i];

    var _expandSize3 = expandSize(flattenSize(sizes[i])),
        _expandSize4 = _slicedToArray(_expandSize3, 2),
        width = _expandSize4[0],
        height = _expandSize4[1];

    var ad = createAdHtml(creativeId, format, fb_bidid);
    var requestId = requestIds[i];

    var bidResponse = {
      // Prebid attributes
      requestId: requestId,
      cpm: cpm / 100,
      width: width,
      height: height,
      ad: ad,
      ttl: ttl,
      creativeId: creativeId,
      netRevenue: netRevenue,
      currency: currency,
      // Audience Network attributes
      hb_bidder: hb_bidder,
      fb_bidid: fb_bidid,
      fb_format: format,
      fb_placementid: creativeId
    };
    // Video attributes
    if (isVideo(format)) {
      var pageurl = getTopWindowUrlEncoded();
      bidResponse.mediaType = 'video';
      bidResponse.vastUrl = 'https://an.facebook.com/v1/instream/vast.xml?placementid=' + creativeId + '&pageurl=' + pageurl + '&playerwidth=' + width + '&playerheight=' + height + '&bidid=' + fb_bidid;
    }
    return bidResponse;
  });
};

var spec = exports.spec = {
  code: code,
  supportedMediaTypes: supportedMediaTypes,
  isBidRequestValid: isBidRequestValid,
  buildRequests: buildRequests,
  interpretResponse: interpretResponse
};

(0, _bidderFactory.registerBidder)(spec);

/***/ }),

/***/ 129:
/***/ (function(module, exports) {



/***/ })

},[127]);

pbjsChunk([105],{

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(131);
module.exports = __webpack_require__(132);


/***/ }),

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spec = exports.DEFAULT_MIMES = exports.VIDEO_TARGETING = exports.OUTSTREAM_SRC = exports.BANNER_ENDPOINT = exports.VIDEO_ENDPOINT = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

var _bidderFactory = __webpack_require__(1);

var _Renderer = __webpack_require__(14);

var _mediaTypes = __webpack_require__(3);

var _find = __webpack_require__(10);

var _find2 = _interopRequireDefault(_find);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var ADAPTER_VERSION = '1.1';
var ADAPTER_NAME = 'BFIO_PREBID';
var OUTSTREAM = 'outstream';

var VIDEO_ENDPOINT = exports.VIDEO_ENDPOINT = '//reachms.bfmio.com/bid.json?exchange_id=';
var BANNER_ENDPOINT = exports.BANNER_ENDPOINT = '//display.bfmio.com/prebid_display';
var OUTSTREAM_SRC = exports.OUTSTREAM_SRC = '//player-cdn.beachfrontmedia.com/playerapi/loader/outstream.js';

var VIDEO_TARGETING = exports.VIDEO_TARGETING = ['mimes'];
var DEFAULT_MIMES = exports.DEFAULT_MIMES = ['video/mp4', 'application/javascript'];

var spec = exports.spec = {
  code: 'beachfront',
  supportedMediaTypes: [_mediaTypes.VIDEO, _mediaTypes.BANNER],

  isBidRequestValid: function isBidRequestValid(bid) {
    return !!(bid && bid.params && bid.params.appId && bid.params.bidfloor);
  },
  buildRequests: function buildRequests(bids, bidderRequest) {
    var requests = [];
    var videoBids = bids.filter(function (bid) {
      return isVideoBid(bid);
    });
    var bannerBids = bids.filter(function (bid) {
      return !isVideoBid(bid);
    });
    videoBids.forEach(function (bid) {
      requests.push({
        method: 'POST',
        url: VIDEO_ENDPOINT + bid.params.appId,
        data: createVideoRequestData(bid, bidderRequest),
        bidRequest: bid
      });
    });
    if (bannerBids.length) {
      requests.push({
        method: 'POST',
        url: BANNER_ENDPOINT,
        data: createBannerRequestData(bannerBids, bidderRequest),
        bidRequest: bannerBids
      });
    }
    return requests;
  },
  interpretResponse: function interpretResponse(response, _ref) {
    var bidRequest = _ref.bidRequest;

    response = response.body;

    if (isVideoBid(bidRequest)) {
      if (!response || !response.url || !response.bidPrice) {
        utils.logWarn('No valid video bids from ' + spec.code + ' bidder');
        return [];
      }
      var size = getFirstSize(bidRequest);
      var context = utils.deepAccess(bidRequest, 'mediaTypes.video.context');
      return {
        requestId: bidRequest.bidId,
        bidderCode: spec.code,
        vastUrl: response.url,
        cpm: response.bidPrice,
        width: size.w,
        height: size.h,
        creativeId: response.cmpId,
        renderer: context === OUTSTREAM ? createRenderer(bidRequest) : null,
        mediaType: _mediaTypes.VIDEO,
        currency: 'USD',
        netRevenue: true,
        ttl: 300
      };
    } else {
      if (!response || !response.length) {
        utils.logWarn('No valid banner bids from ' + spec.code + ' bidder');
        return [];
      }
      return response.map(function (bid) {
        var request = (0, _find2.default)(bidRequest, function (req) {
          return req.adUnitCode === bid.slot;
        });
        return {
          requestId: request.bidId,
          bidderCode: spec.code,
          ad: bid.adm,
          creativeId: bid.crid,
          cpm: bid.price,
          width: bid.w,
          height: bid.h,
          mediaType: _mediaTypes.BANNER,
          currency: 'USD',
          netRevenue: true,
          ttl: 300
        };
      });
    }
  }
};

function createRenderer(bidRequest) {
  var renderer = _Renderer.Renderer.install({
    id: bidRequest.bidId,
    url: OUTSTREAM_SRC,
    loaded: false
  });

  renderer.setRender(outstreamRender);

  return renderer;
}

function outstreamRender(bid) {
  bid.renderer.push(function () {
    window.Beachfront.Player(bid.adUnitCode, {
      ad_tag_url: bid.vastUrl,
      width: bid.width,
      height: bid.height,
      expand_in_view: false,
      collapse_on_complete: true
    });
  });
}

function getSizes(bid) {
  var sizes = (isVideoBid(bid) ? utils.deepAccess(bid, 'mediaTypes.video.playerSize') : utils.deepAccess(bid, 'mediaTypes.banner.sizes')) || bid.sizes;
  return utils.parseSizesInput(sizes).map(function (size) {
    var _size$split = size.split('x'),
        _size$split2 = _slicedToArray(_size$split, 2),
        width = _size$split2[0],
        height = _size$split2[1];

    return {
      w: parseInt(width, 10) || undefined,
      h: parseInt(height, 10) || undefined
    };
  });
}

function getFirstSize(bid) {
  var sizes = getSizes(bid);
  return sizes.length ? sizes[0] : { w: undefined, h: undefined };
}

function getOsVersion() {
  var clientStrings = [{ s: 'Android', r: /Android/ }, { s: 'iOS', r: /(iPhone|iPad|iPod)/ }, { s: 'Mac OS X', r: /Mac OS X/ }, { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ }, { s: 'Linux', r: /(Linux|X11)/ }, { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ }, { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ }, { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ }, { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ }, { s: 'Windows Vista', r: /Windows NT 6.0/ }, { s: 'Windows Server 2003', r: /Windows NT 5.2/ }, { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ }, { s: 'UNIX', r: /UNIX/ }, { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }];
  var cs = (0, _find2.default)(clientStrings, function (cs) {
    return cs.r.test(navigator.userAgent);
  });
  return cs ? cs.s : 'unknown';
}

function isMobile() {
  return (/(ios|ipod|ipad|iphone|android)/i.test(navigator.userAgent)
  );
}

function isConnectedTV() {
  return (/(smart[-]?tv|hbbtv|appletv|googletv|hdmi|netcast\.tv|viera|nettv|roku|\bdtv\b|sonydtv|inettvbrowser|\btv\b)/i.test(navigator.userAgent)
  );
}

function getDoNotTrack() {
  return navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNoTrack === '1' || navigator.doNotTrack === 'yes';
}

function isVideoBid(bid) {
  return bid.mediaTypes && bid.mediaTypes.video;
}

function getVideoParams(bid) {
  return Object.keys(Object(bid.params.video)).filter(function (param) {
    return (0, _includes2.default)(VIDEO_TARGETING, param);
  }).reduce(function (obj, param) {
    obj[param] = bid.params.video[param];
    return obj;
  }, {});
}

function createVideoRequestData(bid, bidderRequest) {
  var size = getFirstSize(bid);
  var video = getVideoParams(bid);
  var topLocation = utils.getTopWindowLocation();
  var payload = {
    isPrebid: true,
    appId: bid.params.appId,
    domain: document.location.hostname,
    id: utils.getUniqueIdentifierStr(),
    imp: [{
      video: _extends({
        w: size.w,
        h: size.h,
        mimes: DEFAULT_MIMES
      }, video),
      bidfloor: bid.params.bidfloor,
      secure: topLocation.protocol === 'https:' ? 1 : 0
    }],
    site: {
      page: topLocation.href,
      domain: topLocation.hostname
    },
    device: {
      ua: navigator.userAgent,
      language: navigator.language,
      devicetype: isMobile() ? 1 : isConnectedTV() ? 3 : 2,
      dnt: getDoNotTrack() ? 1 : 0,
      js: 1,
      geo: {}
    },
    regs: {},
    user: {},
    cur: ['USD']
  };

  if (bidderRequest && bidderRequest.gdprConsent) {
    var _bidderRequest$gdprCo = bidderRequest.gdprConsent,
        consentRequired = _bidderRequest$gdprCo.consentRequired,
        consentString = _bidderRequest$gdprCo.consentString;

    payload.regs.ext = { gdpr: consentRequired ? 1 : 0 };
    payload.user.ext = { consent: consentString };
  }

  return payload;
}

function createBannerRequestData(bids, bidderRequest) {
  var topLocation = utils.getTopWindowLocation();
  var referrer = utils.getTopWindowReferrer();
  var slots = bids.map(function (bid) {
    return {
      slot: bid.adUnitCode,
      id: bid.params.appId,
      bidfloor: bid.params.bidfloor,
      sizes: getSizes(bid)
    };
  });
  var payload = {
    slots: slots,
    page: topLocation.href,
    domain: topLocation.hostname,
    search: topLocation.search,
    secure: topLocation.protocol === 'https:' ? 1 : 0,
    referrer: referrer,
    ua: navigator.userAgent,
    deviceOs: getOsVersion(),
    isMobile: isMobile() ? 1 : 0,
    dnt: getDoNotTrack() ? 1 : 0,
    adapterVersion: ADAPTER_VERSION,
    adapterName: ADAPTER_NAME
  };

  if (bidderRequest && bidderRequest.gdprConsent) {
    var _bidderRequest$gdprCo2 = bidderRequest.gdprConsent,
        consentRequired = _bidderRequest$gdprCo2.consentRequired,
        consentString = _bidderRequest$gdprCo2.consentString;

    payload.gdpr = consentRequired ? 1 : 0;
    payload.gdprConsent = consentString;
  }

  return payload;
}

(0, _bidderFactory.registerBidder)(spec);

/***/ }),

/***/ 132:
/***/ (function(module, exports) {



/***/ })

},[130]);

pbjsChunk([135],{

/***/ 148:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(149);


/***/ }),

/***/ 149:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allowAuction = exports.consentTimeout = exports.userCMP = undefined;
exports.requestBidsHook = requestBidsHook;
exports.resetConsentData = resetConsentData;
exports.setConfig = setConfig;

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

var _config = __webpack_require__(4);

var _adaptermanager = __webpack_require__(8);

var _includes = __webpack_require__(7);

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * This module adds GDPR consentManagement support to prebid.js.  It interacts with
 * supported CMPs (Consent Management Platforms) to grab the user's consent information
 * and make it available for any GDPR supported adapters to read/pass this information to
 * their system.
 */
var DEFAULT_CMP = 'iab';
var DEFAULT_CONSENT_TIMEOUT = 10000;
var DEFAULT_ALLOW_AUCTION_WO_CONSENT = true;

var userCMP = exports.userCMP = void 0;
var consentTimeout = exports.consentTimeout = void 0;
var allowAuction = exports.allowAuction = void 0;

var consentData = void 0;

var context = void 0;
var args = void 0;
var nextFn = void 0;

var timer = void 0;
var haveExited = void 0;

// add new CMPs here, with their dedicated lookup function
var cmpCallMap = {
  'iab': lookupIabConsent
};

/**
 * This function handles interacting with an IAB compliant CMP to obtain the consentObject value of the user.
 * Given the async nature of the CMP's API, we pass in acting success/error callback functions to exit this function
 * based on the appropriate result.
 * @param {function(string)} cmpSuccess acts as a success callback when CMP returns a value; pass along consentObject (string) from CMP
 * @param {function(string)} cmpError acts as an error callback while interacting with CMP; pass along an error message (string)
 * @param {[objects]} adUnits used in the safeframe workflow to know what sizes to include in the $sf.ext.register call
 */
function lookupIabConsent(cmpSuccess, cmpError, adUnits) {
  var cmpCallbacks = void 0;

  // check if the CMP is located on the same window level as the prebid code.
  // if it's found, directly call the CMP via it's API and call the cmpSuccess callback.
  // if it's not found, assume the prebid code may be inside an iframe and the CMP code is located in a higher parent window.
  // in this case, use the IAB's iframe locator sample code (which is slightly cutomized) to try to find the CMP and use postMessage() to communicate with the CMP.
  if (utils.isFn(window.__cmp)) {
    window.__cmp('getVendorConsents', null, cmpSuccess);
  } else if (inASafeFrame() && typeof window.$sf.ext.cmp === 'function') {
    callCmpWhileInSafeFrame();
  } else {
    callCmpWhileInIframe();
  }

  function inASafeFrame() {
    return !!(window.$sf && window.$sf.ext);
  }

  function callCmpWhileInSafeFrame() {
    function sfCallback(msgName, data) {
      if (msgName === 'cmpReturn') {
        cmpSuccess(data.vendorConsents);
      }
    }

    // find sizes from adUnits object
    var width = 1;
    var height = 1;

    if (Array.isArray(adUnits) && adUnits.length > 0) {
      var sizes = utils.getAdUnitSizes(adUnits[0]);
      width = sizes[0][0];
      height = sizes[0][1];
    }

    window.$sf.ext.register(width, height, sfCallback);
    window.$sf.ext.cmp('getVendorConsents');
  }

  function callCmpWhileInIframe() {
    /**
     * START OF STOCK CODE FROM IAB 1.1 CMP SPEC
    */

    // find the CMP frame
    var f = window;
    var cmpFrame = void 0;
    while (!cmpFrame) {
      try {
        if (f.frames['__cmpLocator']) cmpFrame = f;
      } catch (e) {}
      if (f === window.top) break;
      f = f.parent;
    }

    cmpCallbacks = {};

    /* Setup up a __cmp function to do the postMessage and stash the callback.
      This function behaves (from the caller's perspective identicially to the in-frame __cmp call */
    window.__cmp = function (cmd, arg, callback) {
      if (!cmpFrame) {
        removePostMessageListener();

        var errmsg = 'CMP not found';
        // small customization to properly return error
        return cmpError(errmsg);
      }
      var callId = Math.random() + '';
      var msg = { __cmpCall: {
          command: cmd,
          parameter: arg,
          callId: callId
        } };
      cmpCallbacks[callId] = callback;
      cmpFrame.postMessage(msg, '*');
    };

    /** when we get the return message, call the stashed callback */
    // small customization to remove this eventListener later in module
    window.addEventListener('message', readPostMessageResponse, false);

    /**
     * END OF STOCK CODE FROM IAB 1.1 CMP SPEC
     */

    // call CMP
    window.__cmp('getVendorConsents', null, cmpIframeCallback);
  }

  function readPostMessageResponse(event) {
    // small customization to prevent reading strings from other sources that aren't JSON.stringified
    var json = typeof event.data === 'string' && (0, _includes2.default)(event.data, 'cmpReturn') ? JSON.parse(event.data) : event.data;
    if (json.__cmpReturn) {
      var i = json.__cmpReturn;
      cmpCallbacks[i.callId](i.returnValue, i.success);
      delete cmpCallbacks[i.callId];
    }
  }

  function removePostMessageListener() {
    window.removeEventListener('message', readPostMessageResponse, false);
  }

  function cmpIframeCallback(consentObject) {
    removePostMessageListener();
    cmpSuccess(consentObject);
  }
}

/**
 * If consentManagement module is enabled (ie included in setConfig), this hook function will attempt to fetch the
 * user's encoded consent string from the supported CMP.  Once obtained, the module will store this
 * data as part of a gdprConsent object which gets transferred to adaptermanager's gdprDataHandler object.
 * This information is later added into the bidRequest object for any supported adapters to read/pass along to their system.
 * @param {object} config required; This is the same param that's used in pbjs.requestBids.
 * @param {function} fn required; The next function in the chain, used by hook.js
 */
function requestBidsHook(config, fn) {
  context = this;
  args = arguments;
  nextFn = fn;
  haveExited = false;
  var adUnits = config.adUnits || pbjs.adUnits;

  // in case we already have consent (eg during bid refresh)
  if (consentData) {
    return exitModule();
  }

  if (!(0, _includes2.default)(Object.keys(cmpCallMap), userCMP)) {
    utils.logWarn('CMP framework (' + userCMP + ') is not a supported framework.  Aborting consentManagement module and resuming auction.');
    return nextFn.apply(context, args);
  }

  cmpCallMap[userCMP].call(this, processCmpData, cmpFailed, adUnits);

  // only let this code run if module is still active (ie if the callbacks used by CMPs haven't already finished)
  if (!haveExited) {
    if (consentTimeout === 0) {
      processCmpData(undefined);
    } else {
      timer = setTimeout(cmpTimedOut, consentTimeout);
    }
  }
}

/**
 * This function checks the consent data provided by CMP to ensure it's in an expected state.
 * If it's bad, we exit the module depending on config settings.
 * If it's good, then we store the value and exits the module.
 * @param {object} consentObject required; object returned by CMP that contains user's consent choices
 */
function processCmpData(consentObject) {
  if (!utils.isPlainObject(consentObject) || !utils.isStr(consentObject.metadata) || consentObject.metadata === '') {
    cmpFailed('CMP returned unexpected value during lookup process; returned value was (' + consentObject + ').');
  } else {
    clearTimeout(timer);
    storeConsentData(consentObject);

    exitModule();
  }
}

/**
 * General timeout callback when interacting with CMP takes too long.
 */
function cmpTimedOut() {
  cmpFailed('CMP workflow exceeded timeout threshold.');
}

/**
 * This function contains the controlled steps to perform when there's a problem with CMP.
 * @param {string} errMsg required; should be a short descriptive message for why the failure/issue happened.
*/
function cmpFailed(errMsg) {
  clearTimeout(timer);

  // still set the consentData to undefined when there is a problem as per config options
  if (allowAuction) {
    storeConsentData(undefined);
  }
  exitModule(errMsg);
}

/**
 * Stores CMP data locally in module and then invokes gdprDataHandler.setConsentData() to make information available in adaptermanger.js for later in the auction
 * @param {object} cmpConsentObject required; an object representing user's consent choices (can be undefined in certain use-cases for this function only)
 */
function storeConsentData(cmpConsentObject) {
  consentData = {
    consentString: cmpConsentObject ? cmpConsentObject.metadata : undefined,
    vendorData: cmpConsentObject,
    gdprApplies: cmpConsentObject ? cmpConsentObject.gdprApplies : undefined
  };
  _adaptermanager.gdprDataHandler.setConsentData(consentData);
}

/**
 * This function handles the exit logic for the module.
 * There are several paths in the module's logic to call this function and we only allow 1 of the 3 potential exits to happen before suppressing others.
 *
 * We prevent multiple exits to avoid conflicting messages in the console depending on certain scenarios.
 * One scenario could be auction was canceled due to timeout with CMP being reached.
 * While the timeout is the accepted exit and runs first, the CMP's callback still tries to process the user's data (which normally leads to a good exit).
 * In this case, the good exit will be suppressed since we already decided to cancel the auction.
 *
 * Three exit paths are:
 * 1. good exit where auction runs (CMP data is processed normally).
 * 2. bad exit but auction still continues (warning message is logged, CMP data is undefined and still passed along).
 * 3. bad exit with auction canceled (error message is logged).
 * @param {string} errMsg optional; only to be used when there was a 'bad' exit.  String is a descriptive message for the failure/issue encountered.
 */
function exitModule(errMsg) {
  if (haveExited === false) {
    haveExited = true;

    if (errMsg) {
      if (allowAuction) {
        utils.logWarn(errMsg + ' Resuming auction without consent data as per consentManagement config.');
        nextFn.apply(context, args);
      } else {
        utils.logError(errMsg + ' Canceling auction as per consentManagement config.');
      }
    } else {
      nextFn.apply(context, args);
    }
  }
}

/**
 * Simply resets the module's consentData variable back to undefined, mainly for testing purposes
 */
function resetConsentData() {
  consentData = undefined;
  _adaptermanager.gdprDataHandler.setConsentData(null);
}

/**
 * A configuration function that initializes some module variables, as well as add a hook into the requestBids function
 * @param {object} config required; consentManagement module config settings; cmp (string), timeout (int), allowAuctionWithoutConsent (boolean)
 */
function setConfig(config) {
  if (utils.isStr(config.cmpApi)) {
    exports.userCMP = userCMP = config.cmpApi;
  } else {
    exports.userCMP = userCMP = DEFAULT_CMP;
    utils.logInfo('consentManagement config did not specify cmp.  Using system default setting (' + DEFAULT_CMP + ').');
  }

  if (utils.isNumber(config.timeout)) {
    exports.consentTimeout = consentTimeout = config.timeout;
  } else {
    exports.consentTimeout = consentTimeout = DEFAULT_CONSENT_TIMEOUT;
    utils.logInfo('consentManagement config did not specify timeout.  Using system default setting (' + DEFAULT_CONSENT_TIMEOUT + ').');
  }

  if (typeof config.allowAuctionWithoutConsent === 'boolean') {
    exports.allowAuction = allowAuction = config.allowAuctionWithoutConsent;
  } else {
    exports.allowAuction = allowAuction = DEFAULT_ALLOW_AUCTION_WO_CONSENT;
    utils.logInfo('consentManagement config did not specify allowAuctionWithoutConsent.  Using system default setting (' + DEFAULT_ALLOW_AUCTION_WO_CONSENT + ').');
  }

  pbjs.requestBids.addHook(requestBidsHook, 50);
}
_config.config.getConfig('consentManagement', function (config) {
  return setConfig(config.consentManagement);
});

/***/ })

},[148]);

pbjsChunk([0],{

/***/ 230:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(231);
module.exports = __webpack_require__(237);


/***/ }),

/***/ 231:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spec = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

var _mediaTypes = __webpack_require__(3);

var _config = __webpack_require__(4);

var _isArray = __webpack_require__(232);

var _isArray2 = _interopRequireDefault(_isArray);

var _isInteger = __webpack_require__(234);

var _isInteger2 = _interopRequireDefault(_isInteger);

var _bidderFactory = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var BIDDER_CODE = 'ix';
var BANNER_SECURE_BID_URL = 'https://as-sec.casalemedia.com/cygnus';
var BANNER_INSECURE_BID_URL = 'http://as.casalemedia.com/cygnus';
var SUPPORTED_AD_TYPES = [_mediaTypes.BANNER];
var ENDPOINT_VERSION = 7.2;
var CENT_TO_DOLLAR_FACTOR = 100;
var TIME_TO_LIVE = 60;
var NET_REVENUE = true;

// Always start by assuming the protocol is HTTPS. This way, it will work
// whether the page protocol is HTTP or HTTPS. Then check if the page is
// actually HTTP.If we can guarantee it is, then, and only then, set protocol to
// HTTP.
var isSecureWeb = true;
if (utils.getTopWindowLocation().protocol.indexOf('https') !== 0) {
  isSecureWeb = false;
}
var baseUrl = isSecureWeb ? BANNER_SECURE_BID_URL : BANNER_INSECURE_BID_URL;

var PRICE_TO_DOLLAR_FACTOR = {
  JPY: 1
};

/**
 * Transform valid bid request config object to impression object that will be sent to ad server.
 *
 * @param  {object} bid A valid bid request config object.
 * @return {object}     A impression object that will be sent to ad server.
 */
function bidToBannerImp(bid) {
  var imp = {};

  imp.id = bid.bidId;

  imp.banner = {};
  imp.banner.w = bid.params.size[0];
  imp.banner.h = bid.params.size[1];
  imp.banner.topframe = utils.inIframe() ? 0 : 1;

  imp.ext = {};
  imp.ext.sid = bid.params.size[0] + 'x' + bid.params.size[1];
  imp.ext.siteID = bid.params.siteId;

  if (bid.params.hasOwnProperty('bidFloor') && bid.params.hasOwnProperty('bidFloorCur')) {
    imp.bidfloor = bid.params.bidFloor;
    imp.bidfloorcur = bid.params.bidFloorCur;
  }

  return imp;
}

/**
 * Parses a raw bid for the relevant information.
 *
 * @param  {object} rawBid   The bid to be parsed.
 * @param  {string} currency Global currency in bid response.
 * @return {object} bid      The parsed bid.
 */
function parseBid(rawBid, currency) {
  var bid = {};

  if (PRICE_TO_DOLLAR_FACTOR.hasOwnProperty(currency)) {
    bid.cpm = rawBid.price / PRICE_TO_DOLLAR_FACTOR[currency];
  } else {
    bid.cpm = rawBid.price / CENT_TO_DOLLAR_FACTOR;
  }

  bid.requestId = rawBid.impid;
  bid.width = rawBid.w;
  bid.height = rawBid.h;
  bid.ad = rawBid.adm;
  bid.dealId = utils.deepAccess(rawBid, 'ext.dealid');
  bid.ttl = TIME_TO_LIVE;
  bid.netRevenue = NET_REVENUE;
  bid.currency = currency;
  bid.creativeId = rawBid.hasOwnProperty('crid') ? rawBid.crid : '-';

  return bid;
}

/**
 * Determines whether or not the given object is valid size format.
 *
 * @param  {*}       size The object to be validated.
 * @return {boolean}      True if this is a valid size format, and false otherwise.
 */
function isValidSize(size) {
  return (0, _isArray2.default)(size) && size.length === 2 && (0, _isInteger2.default)(size[0]) && (0, _isInteger2.default)(size[1]);
}

/**
 * Determines whether or not the given size object is an element of the size
 * array.
 *
 * @param  {array}  sizeArray The size array.
 * @param  {object} size      The size object.
 * @return {boolean}          True if the size object is an element of the size array, and false
 *                            otherwise.
 */
function includesSize(sizeArray, size) {
  if (isValidSize(sizeArray)) {
    return sizeArray[0] === size[0] && sizeArray[1] === size[1];
  }

  for (var i = 0; i < sizeArray.length; i++) {
    if (sizeArray[i][0] === size[0] && sizeArray[i][1] === size[1]) {
      return true;
    }
  }

  return false;
}

/**
 * Determines whether or not the given bidFloor parameters are valid.
 *
 * @param  {*}       bidFloor    The bidFloor parameter inside bid request config.
 * @param  {*}       bidFloorCur The bidFloorCur parameter inside bid request config.
 * @return {boolean}             True if this is a valid biFfloor parameters format, and false
 *                               otherwise.
 */
function isValidBidFloorParams(bidFloor, bidFloorCur) {
  var curRegex = /^[A-Z]{3}$/;

  return Boolean(typeof bidFloor === 'number' && typeof bidFloorCur === 'string' && bidFloorCur.match(curRegex));
}

var spec = exports.spec = {

  code: BIDDER_CODE,
  supportedMediaTypes: SUPPORTED_AD_TYPES,

  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param  {object}  bid The bid to validate.
   * @return {boolean}     True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function isBidRequestValid(bid) {
    if (!isValidSize(bid.params.size)) {
      return false;
    }

    if (!includesSize(bid.sizes, bid.params.size)) {
      return false;
    }

    if (typeof bid.params.siteId !== 'string') {
      return false;
    }

    var hasBidFloor = bid.params.hasOwnProperty('bidFloor');
    var hasBidFloorCur = bid.params.hasOwnProperty('bidFloorCur');

    if (hasBidFloor || hasBidFloorCur) {
      return hasBidFloor && hasBidFloorCur && isValidBidFloorParams(bid.params.bidFloor, bid.params.bidFloorCur);
    }

    return true;
  },

  /**
   * Make a server request from the list of BidRequests.
   *
   * @param  {array}  validBidRequests A list of valid bid request config objects.
   * @param  {object} options          A object contains bids and other info like gdprConsent.
   * @return {object}                  Info describing the request to the server.
   */
  buildRequests: function buildRequests(validBidRequests, options) {
    var bannerImps = [];
    var validBidRequest = null;
    var bannerImp = null;

    for (var i = 0; i < validBidRequests.length; i++) {
      validBidRequest = validBidRequests[i];

      // If the bid request is for banner, then transform the bid request based on banner format.
      if (utils.deepAccess(validBidRequest, 'mediaTypes.banner') || validBidRequest.mediaType === 'banner') {
        bannerImp = bidToBannerImp(validBidRequest);
        bannerImps.push(bannerImp);
      }
    }

    var r = {};

    // Since bidderRequestId are the same for different bid request, just use the first one.
    r.id = validBidRequests[0].bidderRequestId;

    r.imp = bannerImps;
    r.site = {};
    r.site.page = utils.getTopWindowUrl();
    r.site.ref = utils.getTopWindowReferrer();
    r.ext = {};
    r.ext.source = 'prebid';

    // Apply GDPR information to the request if GDPR is enabled.
    if (options && options.gdprConsent) {
      var gdprConsent = options.gdprConsent;

      if (gdprConsent.hasOwnProperty('gdprApplies')) {
        r.regs = {
          ext: {
            gdpr: gdprConsent.gdprApplies ? 1 : 0
          }
        };
      }

      if (gdprConsent.hasOwnProperty('consentString')) {
        r.user = {
          ext: {
            consent: gdprConsent.consentString || ''
          }
        };
      }
    }

    var payload = {};

    // Parse additional runtime configs.
    var otherIxConfig = _config.config.getConfig('ix');
    if (otherIxConfig) {
      // Append firstPartyData to r.site.page if firstPartyData exists.
      if (_typeof(otherIxConfig.firstPartyData) === 'object') {
        var firstPartyData = otherIxConfig.firstPartyData;
        var firstPartyString = '?';
        for (var key in firstPartyData) {
          if (firstPartyData.hasOwnProperty(key)) {
            firstPartyString += encodeURIComponent(key) + '=' + encodeURIComponent(firstPartyData[key]) + '&';
          }
        }
        firstPartyString = firstPartyString.slice(0, -1);

        r.site.page += firstPartyString;
      }

      // Create t in payload if timeout is configured.
      if (typeof otherIxConfig.timeout === 'number') {
        payload.t = otherIxConfig.timeout;
      }
    }

    // Use the siteId in the first bid request as the main siteId.
    payload.s = validBidRequests[0].params.siteId;

    payload.v = ENDPOINT_VERSION;
    payload.r = JSON.stringify(r);
    payload.ac = 'j';
    payload.sd = 1;

    return {
      method: 'GET',
      url: baseUrl,
      data: payload
    };
  },

  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param  {object} serverResponse A successful response from the server.
   * @return {array}                 An array of bids which were nested inside the server.
   */
  interpretResponse: function interpretResponse(serverResponse) {
    var bids = [];
    var bid = null;

    if (!serverResponse.hasOwnProperty('body') || !serverResponse.body.hasOwnProperty('seatbid')) {
      return bids;
    }

    var responseBody = serverResponse.body;
    var seatbid = responseBody.seatbid;
    for (var i = 0; i < seatbid.length; i++) {
      if (!seatbid[i].hasOwnProperty('bid')) {
        continue;
      }

      // Transform rawBid in bid response to the format that will be accepted by prebid.
      var innerBids = seatbid[i].bid;
      for (var j = 0; j < innerBids.length; j++) {
        bid = parseBid(innerBids[j], responseBody.cur);
        bids.push(bid);
      }
    }

    return bids;
  }
};

(0, _bidderFactory.registerBidder)(spec);

/***/ }),

/***/ 232:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(233);
module.exports = __webpack_require__(15).Array.isArray;


/***/ }),

/***/ 233:
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(16);

$export($export.S, 'Array', { isArray: __webpack_require__(36) });


/***/ }),

/***/ 234:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(235);
module.exports = __webpack_require__(15).Number.isInteger;


/***/ }),

/***/ 235:
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var $export = __webpack_require__(16);

$export($export.S, 'Number', { isInteger: __webpack_require__(236) });


/***/ }),

/***/ 236:
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.3 Number.isInteger(number)
var isObject = __webpack_require__(17);
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};


/***/ }),

/***/ 237:
/***/ (function(module, exports) {



/***/ })

},[230]);

pbjsChunk([58],{

/***/ 291:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(292);
module.exports = __webpack_require__(293);


/***/ }),

/***/ 292:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spec = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.resetBoPixel = resetBoPixel;

var _config = __webpack_require__(4);

var _bidderFactory = __webpack_require__(1);

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

var _userSync = __webpack_require__(13);

var _mediaTypes = __webpack_require__(3);

var _url = __webpack_require__(12);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var SUPPORTED_AD_TYPES = [_mediaTypes.BANNER, _mediaTypes.VIDEO];
var BIDDER_CODE = 'openx';
var BIDDER_CONFIG = 'hb_pb';
var BIDDER_VERSION = '2.1.0';

var shouldSendBoPixel = true;
function resetBoPixel() {
  shouldSendBoPixel = true;
}

var spec = exports.spec = {
  code: BIDDER_CODE,
  supportedMediaTypes: SUPPORTED_AD_TYPES,
  isBidRequestValid: function isBidRequestValid(bidRequest) {
    return !!(bidRequest.params.unit && bidRequest.params.delDomain);
  },
  buildRequests: function buildRequests(bidRequests, bidderRequest) {
    if (bidRequests.length === 0) {
      return [];
    }

    var requests = [];

    var _partitionByVideoBids = partitionByVideoBids(bidRequests),
        _partitionByVideoBids2 = _slicedToArray(_partitionByVideoBids, 2),
        videoBids = _partitionByVideoBids2[0],
        bannerBids = _partitionByVideoBids2[1];

    // build banner requests


    if (bannerBids.length > 0) {
      requests.push(buildOXBannerRequest(bannerBids, bidderRequest));
    }
    // build video requests
    if (videoBids.length > 0) {
      videoBids.forEach(function (videoBid) {
        requests.push(buildOXVideoRequest(videoBid, bidderRequest));
      });
    }

    return requests;
  },
  interpretResponse: function interpretResponse(_ref, serverRequest) {
    var oxResponseObj = _ref.body;

    var mediaType = getMediaTypeFromRequest(serverRequest);

    return mediaType === _mediaTypes.VIDEO ? createVideoBidResponses(oxResponseObj, serverRequest.payload) : createBannerBidResponses(oxResponseObj, serverRequest.payload);
  },
  getUserSyncs: function getUserSyncs(syncOptions, responses) {
    if (syncOptions.iframeEnabled) {
      var url = utils.deepAccess(responses, '0.body.ads.pixels') || utils.deepAccess(responses, '0.body.pixels') || '//u.openx.net/w/1.0/pd';
      return [{
        type: 'iframe',
        url: url
      }];
    }
  }
};

function isVideoRequest(bidRequest) {
  return utils.deepAccess(bidRequest, 'mediaTypes.video') || bidRequest.mediaType === _mediaTypes.VIDEO;
}

function createBannerBidResponses(oxResponseObj, _ref2) {
  var bids = _ref2.bids,
      startTime = _ref2.startTime;

  var adUnits = oxResponseObj.ads.ad;
  var bidResponses = [];
  for (var i = 0; i < adUnits.length; i++) {
    var adUnit = adUnits[i];
    var adUnitIdx = parseInt(adUnit.idx, 10);
    var bidResponse = {};

    bidResponse.requestId = bids[adUnitIdx].bidId;

    if (adUnit.pub_rev) {
      bidResponse.cpm = Number(adUnit.pub_rev) / 1000;
    } else {
      // No fill, do not add the bidresponse
      continue;
    }
    var creative = adUnit.creative[0];
    if (creative) {
      bidResponse.width = creative.width;
      bidResponse.height = creative.height;
    }
    bidResponse.creativeId = creative.id;
    bidResponse.ad = adUnit.html;
    if (adUnit.deal_id) {
      bidResponse.dealId = adUnit.deal_id;
    }
    // default 5 mins
    bidResponse.ttl = 300;
    // true is net, false is gross
    bidResponse.netRevenue = true;
    bidResponse.currency = adUnit.currency;

    // additional fields to add
    if (adUnit.tbd) {
      bidResponse.tbd = adUnit.tbd;
    }
    bidResponse.ts = adUnit.ts;

    bidResponses.push(bidResponse);

    registerBeacon(_mediaTypes.BANNER, adUnit, startTime);
  }
  return bidResponses;
}

function buildQueryStringFromParams(params) {
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      if (!params[key]) {
        delete params[key];
      }
    }
  }
  return utils._map(Object.keys(params), function (key) {
    return key + '=' + params[key];
  }).join('&');
}

function getViewportDimensions(isIfr) {
  var width = void 0;
  var height = void 0;
  var tWin = window;
  var tDoc = document;
  var docEl = tDoc.documentElement;
  var body = void 0;

  if (isIfr) {
    try {
      tWin = window.top;
      tDoc = window.top.document;
    } catch (e) {
      return;
    }
    docEl = tDoc.documentElement;
    body = tDoc.body;

    width = tWin.innerWidth || docEl.clientWidth || body.clientWidth;
    height = tWin.innerHeight || docEl.clientHeight || body.clientHeight;
  } else {
    docEl = tDoc.documentElement;
    width = tWin.innerWidth || docEl.clientWidth;
    height = tWin.innerHeight || docEl.clientHeight;
  }

  return width + 'x' + height;
}

function formatCustomParms(customKey, customParams) {
  var value = customParams[customKey];
  if (utils.isArray(value)) {
    // if value is an array, join them with commas first
    value = value.join(',');
  }
  // return customKey=customValue format, escaping + to . and / to _
  return (customKey.toLowerCase() + '=' + value.toLowerCase()).replace('+', '.').replace('/', '_');
}

function partitionByVideoBids(bidRequests) {
  return bidRequests.reduce(function (acc, bid) {
    // Fallback to banner ads if nothing specified
    if (isVideoRequest(bid)) {
      acc[0].push(bid);
    } else {
      acc[1].push(bid);
    }
    return acc;
  }, [[], []]);
}

function getMediaTypeFromRequest(serverRequest) {
  return (/avjp$/.test(serverRequest.url) ? _mediaTypes.VIDEO : _mediaTypes.BANNER
  );
}

function buildCommonQueryParamsFromBids(bids, bidderRequest) {
  var isInIframe = utils.inIframe();
  var defaultParams = void 0;

  defaultParams = {
    ju: _config.config.getConfig('pageUrl') || utils.getTopWindowUrl(),
    jr: utils.getTopWindowReferrer(),
    ch: document.charSet || document.characterSet,
    res: screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
    ifr: isInIframe,
    tz: new Date().getTimezoneOffset(),
    tws: getViewportDimensions(isInIframe),
    be: 1,
    dddid: utils._map(bids, function (bid) {
      return bid.transactionId;
    }).join(','),
    nocache: new Date().getTime()
  };

  if (utils.deepAccess(bidderRequest, 'gdprConsent')) {
    var gdprConsentConfig = bidderRequest.gdprConsent;

    if (gdprConsentConfig.consentString !== undefined) {
      defaultParams.gdpr_consent = gdprConsentConfig.consentString;
    }

    if (gdprConsentConfig.gdprApplies !== undefined) {
      defaultParams.gdpr = gdprConsentConfig.gdprApplies ? 1 : 0;
    }

    if (_config.config.getConfig('consentManagement.cmpApi') === 'iab') {
      defaultParams.x_gdpr_f = 1;
    }
  }

  return defaultParams;
}

function buildOXBannerRequest(bids, bidderRequest) {
  var queryParams = buildCommonQueryParamsFromBids(bids, bidderRequest);

  queryParams.auid = utils._map(bids, function (bid) {
    return bid.params.unit;
  }).join(',');
  queryParams.aus = utils._map(bids, function (bid) {
    return utils.parseSizesInput(bid.sizes).join(',');
  }).join('|');
  queryParams.bc = bids[0].params.bc || BIDDER_CONFIG + '_' + BIDDER_VERSION;

  var customParamsForAllBids = [];
  var hasCustomParam = false;
  bids.forEach(function (bid) {
    if (bid.params.customParams) {
      var customParamsForBid = utils._map(Object.keys(bid.params.customParams), function (customKey) {
        return formatCustomParms(customKey, bid.params.customParams);
      });
      var formattedCustomParams = window.btoa(customParamsForBid.join('&'));
      hasCustomParam = true;
      customParamsForAllBids.push(formattedCustomParams);
    } else {
      customParamsForAllBids.push('');
    }
  });
  if (hasCustomParam) {
    queryParams.tps = customParamsForAllBids.join(',');
  }

  var customFloorsForAllBids = [];
  var hasCustomFloor = false;
  bids.forEach(function (bid) {
    if (bid.params.customFloor) {
      customFloorsForAllBids.push(bid.params.customFloor * 1000);
      hasCustomFloor = true;
    } else {
      customFloorsForAllBids.push(0);
    }
  });
  if (hasCustomFloor) {
    queryParams.aumfs = customFloorsForAllBids.join(',');
  }

  var url = '//' + bids[0].params.delDomain + '/w/1.0/arj';
  return {
    method: 'GET',
    url: url,
    data: queryParams,
    payload: { 'bids': bids, 'startTime': new Date() }
  };
}

function buildOXVideoRequest(bid, bidderRequest) {
  var url = '//' + bid.params.delDomain + '/v/1.0/avjp';
  var oxVideoParams = generateVideoParameters(bid, bidderRequest);
  return {
    method: 'GET',
    url: url,
    data: oxVideoParams,
    payload: { 'bid': bid, 'startTime': new Date() }
  };
}

function generateVideoParameters(bid, bidderRequest) {
  var queryParams = buildCommonQueryParamsFromBids([bid], bidderRequest);
  var oxVideoConfig = utils.deepAccess(bid, 'params.video') || {};
  var context = utils.deepAccess(bid, 'mediaTypes.video.context');
  var playerSize = utils.deepAccess(bid, 'mediaTypes.video.playerSize');
  var width = void 0;
  var height = void 0;

  // normalize config for video size
  if (utils.isArray(bid.sizes) && bid.sizes.length === 2 && !utils.isArray(bid.sizes[0])) {
    width = parseInt(bid.sizes[0], 10);
    height = parseInt(bid.sizes[1], 10);
  } else if (utils.isArray(bid.sizes) && utils.isArray(bid.sizes[0]) && bid.sizes[0].length === 2) {
    width = parseInt(bid.sizes[0][0], 10);
    height = parseInt(bid.sizes[0][1], 10);
  } else if (utils.isArray(playerSize) && playerSize.length === 2) {
    width = parseInt(playerSize[0], 10);
    height = parseInt(playerSize[1], 10);
  }

  Object.keys(oxVideoConfig).forEach(function (key) {
    if (key === 'openrtb') {
      oxVideoConfig[key].w = width || oxVideoConfig[key].w;
      oxVideoConfig[key].v = height || oxVideoConfig[key].v;
      queryParams[key] = JSON.stringify(oxVideoConfig[key]);
    } else if (!(key in queryParams) && key !== 'url') {
      // only allow video-related attributes
      queryParams[key] = oxVideoConfig[key];
    }
  });

  queryParams.auid = bid.params.unit;
  // override prebid config with openx config if available
  queryParams.vwd = width || oxVideoConfig.vwd;
  queryParams.vht = height || oxVideoConfig.vht;

  if (context === 'outstream') {
    queryParams.vos = '101';
  }

  if (oxVideoConfig.mimes) {
    queryParams.vmimes = oxVideoConfig.mimes;
  }

  return queryParams;
}

function createVideoBidResponses(response, _ref3) {
  var bid = _ref3.bid,
      startTime = _ref3.startTime;

  var bidResponses = [];

  if (response !== undefined && response.vastUrl !== '' && response.pub_rev !== '') {
    var vastQueryParams = (0, _url.parse)(response.vastUrl).search || {};
    var bidResponse = {};
    bidResponse.requestId = bid.bidId;
    bidResponse.bidderCode = BIDDER_CODE;
    // default 5 mins
    bidResponse.ttl = 300;
    // true is net, false is gross
    bidResponse.netRevenue = true;
    bidResponse.currency = response.currency;
    bidResponse.cpm = Number(response.pub_rev) / 1000;
    bidResponse.width = response.width;
    bidResponse.height = response.height;
    bidResponse.creativeId = response.adid;
    bidResponse.vastUrl = response.vastUrl;
    bidResponse.mediaType = _mediaTypes.VIDEO;

    // enrich adunit with vast parameters
    response.ph = vastQueryParams.ph;
    response.colo = vastQueryParams.colo;
    response.ts = vastQueryParams.ts;

    bidResponses.push(bidResponse);

    registerBeacon(_mediaTypes.VIDEO, response, startTime);
  }

  return bidResponses;
}

function registerBeacon(mediaType, adUnit, startTime) {
  // only register beacon once
  if (!shouldSendBoPixel) {
    return;
  }
  shouldSendBoPixel = false;

  var bt = _config.config.getConfig('bidderTimeout');
  var beaconUrl = void 0;
  if (window.PREBID_TIMEOUT) {
    bt = Math.min(window.PREBID_TIMEOUT, bt);
  }

  var beaconParams = {
    bd: +new Date() - startTime,
    bp: adUnit.pub_rev,
    br: '0', // may be 0, t, or p
    bs: utils.getTopWindowLocation().hostname,
    bt: bt,
    ts: adUnit.ts
  };

  beaconParams.br = beaconParams.bt < beaconParams.bd ? 't' : 'p';

  if (mediaType === _mediaTypes.VIDEO) {
    var url = (0, _url.parse)(adUnit.colo);
    beaconParams.ph = adUnit.ph;
    beaconUrl = '//' + url.hostname + '/w/1.0/bo?' + buildQueryStringFromParams(beaconParams);
  } else {
    var recordPixel = utils.deepAccess(adUnit, 'creative.0.tracking.impression');
    var boBase = recordPixel.match(/([^?]+\/)ri\?/);

    if (boBase && boBase.length > 1) {
      beaconUrl = boBase[1] + 'bo?' + buildQueryStringFromParams(beaconParams);
    }
  }

  if (beaconUrl) {
    _userSync.userSync.registerSync('image', BIDDER_CODE, beaconUrl);
  }
}

(0, _bidderFactory.registerBidder)(spec);

/***/ }),

/***/ 293:
/***/ (function(module, exports) {



/***/ })

},[291]);

pbjsChunk([50],{

/***/ 319:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(320);
module.exports = __webpack_require__(321);


/***/ }),

/***/ 320:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spec = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

var _bidderFactory = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var constants = __webpack_require__(2);

var BIDDER_CODE = 'pubmatic';
var ENDPOINT = '//hbopenbid.pubmatic.com/translator?source=prebid-client';
var USYNCURL = '//ads.pubmatic.com/AdServer/js/showad.js#PIX&kdntuid=1&p=';
var CURRENCY = 'USD';
var AUCTION_TYPE = 1;
var UNDEFINED = undefined;
var CUSTOM_PARAMS = {
  'kadpageurl': '', // Custom page url
  'gender': '', // User gender
  'yob': '', // User year of birth
  'lat': '', // User location - Latitude
  'lon': '', // User Location - Longitude
  'wiid': '', // OpenWrap Wrapper Impression ID
  'profId': '', // OpenWrap Legacy: Profile ID
  'verId': '' // OpenWrap Legacy: version ID
};
var NET_REVENUE = false;
var dealChannelValues = {
  1: 'PMP',
  5: 'PREF',
  6: 'PMPG'
};

var publisherId = 0;

function _getDomainFromURL(url) {
  var anchor = document.createElement('a');
  anchor.href = url;
  return anchor.hostname;
}

function _parseSlotParam(paramName, paramValue) {
  if (!utils.isStr(paramValue)) {
    paramValue && utils.logWarn('PubMatic: Ignoring param key: ' + paramName + ', expects string-value, found ' + (typeof paramValue === 'undefined' ? 'undefined' : _typeof(paramValue)));
    return UNDEFINED;
  }

  switch (paramName) {
    case 'pmzoneid':
      return paramValue.split(',').slice(0, 50).map(function (id) {
        return id.trim();
      }).join();
    case 'kadfloor':
      return parseFloat(paramValue) || UNDEFINED;
    case 'lat':
      return parseFloat(paramValue) || UNDEFINED;
    case 'lon':
      return parseFloat(paramValue) || UNDEFINED;
    case 'yob':
      return parseInt(paramValue) || UNDEFINED;
    default:
      return paramValue;
  }
}

function _cleanSlot(slotName) {
  if (utils.isStr(slotName)) {
    return slotName.replace(/^\s+/g, '').replace(/\s+$/g, '');
  }
  return '';
}

function _parseAdSlot(bid) {
  bid.params.adUnit = '';
  bid.params.adUnitIndex = '0';
  bid.params.width = 0;
  bid.params.height = 0;

  bid.params.adSlot = _cleanSlot(bid.params.adSlot);

  var slot = bid.params.adSlot;
  var splits = slot.split(':');

  slot = splits[0];
  if (splits.length == 2) {
    bid.params.adUnitIndex = splits[1];
  }
  splits = slot.split('@');
  if (splits.length != 2) {
    utils.logWarn('AdSlot Error: adSlot not in required format');
    return;
  }
  bid.params.adUnit = splits[0];
  splits = splits[1].split('x');
  if (splits.length != 2) {
    utils.logWarn('AdSlot Error: adSlot not in required format');
    return;
  }
  bid.params.width = parseInt(splits[0]);
  bid.params.height = parseInt(splits[1]);
}

function _initConf() {
  var conf = {};
  conf.pageURL = utils.getTopWindowUrl();
  conf.refURL = utils.getTopWindowReferrer();
  return conf;
}

function _handleCustomParams(params, conf) {
  if (!conf.kadpageurl) {
    conf.kadpageurl = conf.pageURL;
  }

  var key, value, entry;
  for (key in CUSTOM_PARAMS) {
    if (CUSTOM_PARAMS.hasOwnProperty(key)) {
      value = params[key];
      if (value) {
        entry = CUSTOM_PARAMS[key];

        if ((typeof entry === 'undefined' ? 'undefined' : _typeof(entry)) === 'object') {
          // will be used in future when we want to process a custom param before using
          // 'keyname': {f: function() {}}
          value = entry.f(value, conf);
        }

        if (utils.isStr(value)) {
          conf[key] = value;
        } else {
          utils.logWarn('PubMatic: Ignoring param : ' + key + ' with value : ' + CUSTOM_PARAMS[key] + ', expects string-value, found ' + (typeof value === 'undefined' ? 'undefined' : _typeof(value)));
        }
      }
    }
  }
  return conf;
}

function _createOrtbTemplate(conf) {
  return {
    id: '' + new Date().getTime(),
    at: AUCTION_TYPE,
    cur: [CURRENCY],
    imp: [],
    site: {
      page: conf.pageURL,
      ref: conf.refURL,
      publisher: {}
    },
    device: {
      ua: navigator.userAgent,
      js: 1,
      dnt: navigator.doNotTrack == 'yes' || navigator.doNotTrack == '1' || navigator.msDoNotTrack == '1' ? 1 : 0,
      h: screen.height,
      w: screen.width,
      language: navigator.language
    },
    user: {},
    ext: {}
  };
}

function _createImpressionObject(bid, conf) {
  return {
    id: bid.bidId,
    tagid: bid.params.adUnit,
    bidfloor: _parseSlotParam('kadfloor', bid.params.kadfloor),
    secure: window.location.protocol === 'https:' ? 1 : 0,
    banner: {
      pos: 0,
      w: bid.params.width,
      h: bid.params.height,
      topframe: utils.inIframe() ? 0 : 1
    },
    ext: {
      pmZoneId: _parseSlotParam('pmzoneid', bid.params.pmzoneid)
    }
  };
}

var spec = exports.spec = {
  code: BIDDER_CODE,

  /**
  * Determines whether or not the given bid request is valid. Valid bid request must have placementId and hbid
  *
  * @param {BidRequest} bid The bid params to validate.
  * @return boolean True if this is a valid bid, and false otherwise.
  */
  isBidRequestValid: function isBidRequestValid(bid) {
    if (bid && bid.params) {
      if (!utils.isStr(bid.params.publisherId)) {
        utils.logWarn('PubMatic Error: publisherId is mandatory and cannot be numeric. Call to OpenBid will not be sent.');
        return false;
      }
      if (!utils.isStr(bid.params.adSlot)) {
        utils.logWarn('PubMatic: adSlotId is mandatory and cannot be numeric. Call to OpenBid will not be sent.');
        return false;
      }
      return true;
    }
    return false;
  },

  /**
  * Make a server request from the list of BidRequests.
  *
  * @param {validBidRequests[]} - an array of bids
  * @return ServerRequest Info describing the request to the server.
  */
  buildRequests: function buildRequests(validBidRequests, bidderRequest) {
    var conf = _initConf();
    var payload = _createOrtbTemplate(conf);
    validBidRequests.forEach(function (bid) {
      _parseAdSlot(bid);
      if (!(bid.params.adSlot && bid.params.adUnit && bid.params.adUnitIndex && bid.params.width && bid.params.height)) {
        utils.logWarn('PubMatic: Skipping the non-standard adslot:', bid.params.adSlot, bid);
        return;
      }
      conf.pubId = conf.pubId || bid.params.publisherId;
      conf = _handleCustomParams(bid.params, conf);
      conf.transactionId = bid.transactionId;
      payload.imp.push(_createImpressionObject(bid, conf));
    });

    if (payload.imp.length == 0) {
      return;
    }

    payload.site.publisher.id = conf.pubId.trim();
    publisherId = conf.pubId.trim();
    payload.ext.wrapper = {};
    payload.ext.wrapper.profile = parseInt(conf.profId) || UNDEFINED;
    payload.ext.wrapper.version = parseInt(conf.verId) || UNDEFINED;
    payload.ext.wrapper.wiid = conf.wiid || UNDEFINED;
    payload.ext.wrapper.wv = constants.REPO_AND_VERSION;
    payload.ext.wrapper.transactionId = conf.transactionId;
    payload.ext.wrapper.wp = 'pbjs';
    payload.user.gender = conf.gender ? conf.gender.trim() : UNDEFINED;
    payload.user.geo = {};

    // Attaching GDPR Consent Params
    if (bidderRequest && bidderRequest.gdprConsent) {
      payload.user.ext = {
        consent: bidderRequest.gdprConsent.consentString
      };

      payload.regs = {
        ext: {
          gdpr: bidderRequest.gdprConsent.gdprApplies ? 1 : 0
        }
      };
    }

    payload.user.geo.lat = _parseSlotParam('lat', conf.lat);
    payload.user.geo.lon = _parseSlotParam('lon', conf.lon);
    payload.user.yob = _parseSlotParam('yob', conf.yob);
    payload.device.geo = {};
    payload.device.geo.lat = _parseSlotParam('lat', conf.lat);
    payload.device.geo.lon = _parseSlotParam('lon', conf.lon);
    payload.site.page = conf.kadpageurl.trim() || payload.site.page.trim();
    payload.site.domain = _getDomainFromURL(payload.site.page);
    return {
      method: 'POST',
      url: ENDPOINT,
      data: JSON.stringify(payload)
    };
  },

  /**
  * Unpack the response from the server into a list of bids.
  *
  * @param {*} response A successful response from the server.
  * @return {Bid[]} An array of bids which were nested inside the server.
  */
  interpretResponse: function interpretResponse(response, request) {
    var bidResponses = [];
    try {
      if (response.body && response.body.seatbid && utils.isArray(response.body.seatbid)) {
        // Supporting multiple bid responses for same adSize
        response.body.seatbid.forEach(function (seatbidder) {
          seatbidder.bid && utils.isArray(seatbidder.bid) && seatbidder.bid.forEach(function (bid) {
            var newBid = {
              requestId: bid.impid,
              cpm: (parseFloat(bid.price) || 0).toFixed(2),
              width: bid.w,
              height: bid.h,
              creativeId: bid.crid || bid.id,
              dealId: bid.dealid,
              currency: CURRENCY,
              netRevenue: NET_REVENUE,
              ttl: 300,
              referrer: utils.getTopWindowUrl(),
              ad: bid.adm
            };

            if (bid.ext && bid.ext.deal_channel) {
              newBid['dealChannel'] = dealChannelValues[bid.ext.deal_channel] || null;
            }

            bidResponses.push(newBid);
          });
        });
      }
    } catch (error) {
      utils.logError(error);
    }
    return bidResponses;
  },

  /**
  * Register User Sync.
  */
  getUserSyncs: function getUserSyncs(syncOptions, responses, gdprConsent) {
    var syncurl = USYNCURL + publisherId;

    // Attaching GDPR Consent Params in UserSync url
    if (gdprConsent) {
      syncurl += '&gdpr=' + (gdprConsent.gdprApplies ? 1 : 0);
      syncurl += '&gdpr_consent=' + encodeURIComponent(gdprConsent.consentString || '');
    }

    if (syncOptions.iframeEnabled) {
      return [{
        type: 'iframe',
        url: syncurl
      }];
    } else {
      utils.logWarn('PubMatic: Please enable iframe based user sync.');
    }
  }
};

(0, _bidderFactory.registerBidder)(spec);

/***/ }),

/***/ 321:
/***/ (function(module, exports) {



/***/ })

},[319]);

pbjsChunk([36],{

/***/ 360:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(361);
module.exports = __webpack_require__(362);


/***/ }),

/***/ 361:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spec = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.masSizeOrdering = masSizeOrdering;
exports.resetUserSync = resetUserSync;

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

var _bidderFactory = __webpack_require__(1);

var _config = __webpack_require__(4);

var _mediaTypes = __webpack_require__(3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var INTEGRATION = 'pbjs_lite_v1.11.0';

function isSecure() {
  return location.protocol === 'https:';
}

// use protocol relative urls for http or https
var FASTLANE_ENDPOINT = '//fastlane.rubiconproject.com/a/api/fastlane.json';
var VIDEO_ENDPOINT = '//fastlane-adv.rubiconproject.com/v1/auction/video';
var SYNC_ENDPOINT = 'https://eus.rubiconproject.com/usync.html';

var TIMEOUT_BUFFER = 500;

var sizeMap = {
  1: '468x60',
  2: '728x90',
  5: '120x90',
  8: '120x600',
  9: '160x600',
  10: '300x600',
  13: '200x200',
  14: '250x250',
  15: '300x250',
  16: '336x280',
  19: '300x100',
  31: '980x120',
  32: '250x360',
  33: '180x500',
  35: '980x150',
  37: '468x400',
  38: '930x180',
  43: '320x50',
  44: '300x50',
  48: '300x300',
  53: '1024x768',
  54: '300x1050',
  55: '970x90',
  57: '970x250',
  58: '1000x90',
  59: '320x80',
  60: '320x150',
  61: '1000x1000',
  65: '640x480',
  67: '320x480',
  68: '1800x1000',
  72: '320x320',
  73: '320x160',
  78: '980x240',
  79: '980x300',
  80: '980x400',
  83: '480x300',
  94: '970x310',
  96: '970x210',
  101: '480x320',
  102: '768x1024',
  103: '480x280',
  108: '320x240',
  113: '1000x300',
  117: '320x100',
  125: '800x250',
  126: '200x600',
  144: '980x600',
  195: '600x300',
  199: '640x200',
  213: '1030x590',
  214: '980x360'
};
utils._each(sizeMap, function (item, key) {
  return sizeMap[item] = key;
});

var spec = exports.spec = {
  code: 'rubicon',
  aliases: ['rubiconLite'],
  supportedMediaTypes: [_mediaTypes.BANNER, _mediaTypes.VIDEO],
  /**
   * @param {object} bid
   * @return boolean
   */
  isBidRequestValid: function isBidRequestValid(bid) {
    if (_typeof(bid.params) !== 'object') {
      return false;
    }
    var params = bid.params;

    if (!/^\d+$/.test(params.accountId)) {
      return false;
    }

    // Log warning if context is 'outstream', is not currently supported
    if (utils.deepAccess(bid, 'mediaTypes.' + _mediaTypes.VIDEO + '.context') === 'outstream') {
      utils.logWarn('Warning: outstream video for Rubicon Client Adapter is not supported yet');
    }

    // Log warning if mediaTypes contains both 'banner' and 'video'
    if (spec.hasVideoMediaType(bid) && typeof utils.deepAccess(bid, 'mediaTypes.' + _mediaTypes.BANNER) !== 'undefined') {
      utils.logWarn('Warning: instream video and banner requested for same ad unit, continuing with video instream request');
    }

    // Bid is invalid if legacy video is set but params video is missing size_id
    if (bid.mediaType === 'video' && typeof utils.deepAccess(bid, 'params.video.size_id') === 'undefined') {
      return false;
    }

    // Bid is invalid if mediaTypes video is invalid and a mediaTypes banner property is not defined
    if (bid.mediaTypes && !spec.hasVideoMediaType(bid) && typeof bid.mediaTypes.banner === 'undefined') {
      return false;
    }

    var parsedSizes = parseSizes(bid);
    if (parsedSizes.length < 1) {
      return false;
    }

    return true;
  },
  /**
   * @param {BidRequest[]} bidRequests
   * @param bidderRequest
   * @return ServerRequest[]
   */
  buildRequests: function buildRequests(bidRequests, bidderRequest) {
    return bidRequests.map(function (bidRequest) {
      bidRequest.startTime = new Date().getTime();

      var page_url = _config.config.getConfig('pageUrl');
      if (bidRequest.params.referrer) {
        page_url = bidRequest.params.referrer;
      } else if (!page_url) {
        page_url = utils.getTopWindowUrl();
      }

      // GDPR reference, for use by 'banner' and 'video'
      var gdprConsent = bidderRequest.gdprConsent;

      if (spec.hasVideoMediaType(bidRequest)) {
        var params = bidRequest.params;
        var size = parseSizes(bidRequest);

        var _data = {
          page_url: page_url,
          resolution: _getScreenResolution(),
          account_id: params.accountId,
          integration: INTEGRATION,
          'x_source.tid': bidRequest.transactionId,
          timeout: bidderRequest.timeout - (Date.now() - bidderRequest.auctionStart + TIMEOUT_BUFFER),
          stash_creatives: true,
          ae_pass_through_parameters: params.video.aeParams,
          rp_secure: bidRequest.params.secure !== false,
          slots: []
        };

        // Define the slot object
        var slotData = {
          site_id: params.siteId,
          zone_id: params.zoneId,
          position: parsePosition(params.position),
          floor: parseFloat(params.floor) > 0.01 ? params.floor : 0.01,
          element_id: bidRequest.adUnitCode,
          name: bidRequest.adUnitCode,
          language: params.video.language,
          width: size[0],
          height: size[1],
          size_id: params.video.size_id
        };

        if (params.inventory && _typeof(params.inventory) === 'object') {
          slotData.inventory = params.inventory;
        }

        if (params.keywords && Array.isArray(params.keywords)) {
          slotData.keywords = params.keywords;
        }

        if (params.visitor && _typeof(params.visitor) === 'object') {
          slotData.visitor = params.visitor;
        }

        _data.slots.push(slotData);

        if (gdprConsent) {
          // add 'gdpr' only if 'gdprApplies' is defined
          if (typeof gdprConsent.gdprApplies === 'boolean') {
            _data.gdpr = Number(gdprConsent.gdprApplies);
          }
          _data.gdpr_consent = gdprConsent.consentString;
        }

        return {
          method: 'POST',
          url: VIDEO_ENDPOINT,
          data: _data,
          bidRequest: bidRequest
        };
      }

      // non-video request builder
      var _bidRequest$params = bidRequest.params,
          accountId = _bidRequest$params.accountId,
          siteId = _bidRequest$params.siteId,
          zoneId = _bidRequest$params.zoneId,
          position = _bidRequest$params.position,
          floor = _bidRequest$params.floor,
          keywords = _bidRequest$params.keywords,
          visitor = _bidRequest$params.visitor,
          inventory = _bidRequest$params.inventory,
          userId = _bidRequest$params.userId,
          _bidRequest$params$la = _bidRequest$params.latLong;
      _bidRequest$params$la = _bidRequest$params$la === undefined ? [] : _bidRequest$params$la;

      var _bidRequest$params$la2 = _slicedToArray(_bidRequest$params$la, 2),
          latitude = _bidRequest$params$la2[0],
          longitude = _bidRequest$params$la2[1];

      // defaults


      floor = (floor = parseFloat(floor)) > 0.01 ? floor : 0.01;
      position = position || 'btf';

      // use rubicon sizes if provided, otherwise adUnit.sizes
      var parsedSizes = parseSizes(bidRequest);

      // using array to honor ordering. if order isn't important (it shouldn't be), an object would probably be preferable
      var data = ['account_id', accountId, 'site_id', siteId, 'zone_id', zoneId, 'size_id', parsedSizes[0], 'alt_size_ids', parsedSizes.slice(1).join(',') || undefined, 'p_pos', position, 'rp_floor', floor, 'rp_secure', isSecure() ? '1' : '0', 'tk_flint', INTEGRATION, 'x_source.tid', bidRequest.transactionId, 'p_screen_res', _getScreenResolution(), 'kw', keywords, 'tk_user_key', userId, 'p_geo.latitude', isNaN(parseFloat(latitude)) ? undefined : parseFloat(latitude).toFixed(4), 'p_geo.longitude', isNaN(parseFloat(longitude)) ? undefined : parseFloat(longitude).toFixed(4)];

      if (gdprConsent) {
        // add 'gdpr' only if 'gdprApplies' is defined
        if (typeof gdprConsent.gdprApplies === 'boolean') {
          data.push('gdpr', Number(gdprConsent.gdprApplies));
        }
        data.push('gdpr_consent', gdprConsent.consentString);
      }

      if (visitor !== null && (typeof visitor === 'undefined' ? 'undefined' : _typeof(visitor)) === 'object') {
        utils._each(visitor, function (item, key) {
          return data.push('tg_v.' + key, item);
        });
      }

      if (inventory !== null && (typeof inventory === 'undefined' ? 'undefined' : _typeof(inventory)) === 'object') {
        utils._each(inventory, function (item, key) {
          return data.push('tg_i.' + key, item);
        });
      }

      data.push('rand', Math.random(), 'rf', page_url);

      data = data.concat(_getDigiTrustQueryParams());

      data = data.reduce(function (memo, curr, index) {
        return index % 2 === 0 && data[index + 1] !== undefined && !isNaN(data[index + 1]) ? memo + curr + '=' + encodeURIComponent(data[index + 1]) + '&' : memo;
      }, '').slice(0, -1); // remove trailing &

      return {
        method: 'GET',
        url: FASTLANE_ENDPOINT,
        data: data,
        bidRequest: bidRequest
      };
    });
  },
  /**
   * Test if bid has mediaType or mediaTypes set for video.
   * note: 'mediaType' has been deprecated, however support will remain for a transitional period
   * @param {BidRequest} bidRequest
   * @returns {boolean}
   */
  hasVideoMediaType: function hasVideoMediaType(bidRequest) {
    return typeof utils.deepAccess(bidRequest, 'params.video.size_id') !== 'undefined' && (bidRequest.mediaType === _mediaTypes.VIDEO || utils.deepAccess(bidRequest, 'mediaTypes.' + _mediaTypes.VIDEO + '.context') === 'instream');
  },
  /**
   * @param {*} responseObj
   * @param {BidRequest} bidRequest
   * @return {Bid[]} An array of bids which
   */
  interpretResponse: function interpretResponse(responseObj, _ref) {
    var bidRequest = _ref.bidRequest;

    responseObj = responseObj.body;
    var ads = responseObj.ads;

    // check overall response
    if ((typeof responseObj === 'undefined' ? 'undefined' : _typeof(responseObj)) !== 'object' || responseObj.status !== 'ok') {
      return [];
    }

    // video ads array is wrapped in an object
    if ((typeof bidRequest === 'undefined' ? 'undefined' : _typeof(bidRequest)) === 'object' && spec.hasVideoMediaType(bidRequest) && (typeof ads === 'undefined' ? 'undefined' : _typeof(ads)) === 'object') {
      ads = ads[bidRequest.adUnitCode];
    }

    // check the ad response
    if (!Array.isArray(ads) || ads.length < 1) {
      return [];
    }

    // if there are multiple ads, sort by CPM
    ads = ads.sort(_adCpmSort);

    return ads.reduce(function (bids, ad) {
      if (ad.status !== 'ok') {
        return [];
      }

      var bid = {
        requestId: bidRequest.bidId,
        currency: 'USD',
        creativeId: ad.creative_id,
        cpm: ad.cpm || 0,
        dealId: ad.deal,
        ttl: 300, // 5 minutes
        netRevenue: _config.config.getConfig('rubicon.netRevenue') || false,
        rubicon: {
          advertiserId: ad.advertiser,
          networkId: ad.network
        }
      };

      if (ad.creative_type) {
        bid.mediaType = ad.creative_type;
      }

      if (ad.creative_type === _mediaTypes.VIDEO) {
        bid.width = bidRequest.params.video.playerWidth;
        bid.height = bidRequest.params.video.playerHeight;
        bid.vastUrl = ad.creative_depot_url;
        // WIKIA_CHANGE: Extend Rubicon bid
        bid.rubiconAdId = ad.ad_id;
        bid.rubiconAdvertiserId = ad.advertiser;
        bid.descriptionUrl = ad.impression_id;
        bid.impression_id = ad.impression_id;
        bid.videoCacheKey = ad.impression_id;
      } else {
        bid.ad = _renderCreative(ad.script, ad.impression_id);

        var _sizeMap$ad$size_id$s = sizeMap[ad.size_id].split('x').map(function (num) {
          return Number(num);
        });

        var _sizeMap$ad$size_id$s2 = _slicedToArray(_sizeMap$ad$size_id$s, 2);

        bid.width = _sizeMap$ad$size_id$s2[0];
        bid.height = _sizeMap$ad$size_id$s2[1];
      }

      // add server-side targeting
      bid.rubiconTargeting = (Array.isArray(ad.targeting) ? ad.targeting : []).reduce(function (memo, item) {
        memo[item.key] = item.values[0];
        return memo;
      }, { 'rpfl_elemid': bidRequest.adUnitCode });

      bids.push(bid);

      return bids;
    }, []);
  },
  getUserSyncs: function getUserSyncs(syncOptions, responses, gdprConsent) {
    if (!hasSynced && syncOptions.iframeEnabled) {
      // data is only assigned if params are available to pass to SYNC_ENDPOINT
      var params = '';

      if (gdprConsent && typeof gdprConsent.consentString === 'string') {
        // add 'gdpr' only if 'gdprApplies' is defined
        if (typeof gdprConsent.gdprApplies === 'boolean') {
          params += '?gdpr=' + Number(gdprConsent.gdprApplies) + '&gdpr_consent=' + gdprConsent.consentString;
        } else {
          params += '?gdpr_consent=' + gdprConsent.consentString;
        }
      }

      hasSynced = true;
      return {
        type: 'iframe',
        url: SYNC_ENDPOINT + params
      };
    }
  }
};

function _adCpmSort(adA, adB) {
  return (adB.cpm || 0.0) - (adA.cpm || 0.0);
}

function _getScreenResolution() {
  return [window.screen.width, window.screen.height].join('x');
}

function _getDigiTrustQueryParams() {
  function getDigiTrustId() {
    var digiTrustUser = window.DigiTrust && (_config.config.getConfig('digiTrustId') || window.DigiTrust.getUser({ member: 'T9QSFKPDN9' }));
    return digiTrustUser && digiTrustUser.success && digiTrustUser.identity || null;
  }

  var digiTrustId = getDigiTrustId();
  // Verify there is an ID and this user has not opted out
  if (!digiTrustId || digiTrustId.privacy && digiTrustId.privacy.optout) {
    return [];
  }
  return ['dt.id', digiTrustId.id, 'dt.keyv', digiTrustId.keyv, 'dt.pref', 0];
}

function _renderCreative(script, impId) {
  return '<html>\n<head><script type=\'text/javascript\'>inDapIF=true;</script></head>\n<body style=\'margin : 0; padding: 0;\'>\n<!-- Rubicon Project Ad Tag -->\n<div data-rp-impression-id=\'' + impId + '\'>\n<script type=\'text/javascript\'>' + script + '</script>\n</div>\n</body>\n</html>';
}

function parseSizes(bid) {
  var params = bid.params;
  if (spec.hasVideoMediaType(bid)) {
    var size = [];
    if (params.video && params.video.playerWidth && params.video.playerHeight) {
      size = [params.video.playerWidth, params.video.playerHeight];
    } else if (Array.isArray(bid.sizes) && bid.sizes.length > 0 && Array.isArray(bid.sizes[0]) && bid.sizes[0].length > 1) {
      size = bid.sizes[0];
    }
    return size;
  }

  // deprecated: temp legacy support
  var sizes = Array.isArray(params.sizes) ? params.sizes : mapSizes(bid.sizes);

  return masSizeOrdering(sizes);
}

function mapSizes(sizes) {
  return utils.parseSizesInput(sizes)
  // map sizes while excluding non-matches
  .reduce(function (result, size) {
    var mappedSize = parseInt(sizeMap[size], 10);
    if (mappedSize) {
      result.push(mappedSize);
    }
    return result;
  }, []);
}

function parsePosition(position) {
  if (position === 'atf' || position === 'btf') {
    return position;
  }
  return 'unknown';
}

function masSizeOrdering(sizes) {
  var MAS_SIZE_PRIORITY = [15, 2, 9];

  return sizes.sort(function (first, second) {
    // sort by MAS_SIZE_PRIORITY priority order
    var firstPriority = MAS_SIZE_PRIORITY.indexOf(first);
    var secondPriority = MAS_SIZE_PRIORITY.indexOf(second);

    if (firstPriority > -1 || secondPriority > -1) {
      if (firstPriority === -1) {
        return 1;
      }
      if (secondPriority === -1) {
        return -1;
      }
      return firstPriority - secondPriority;
    }

    // and finally ascending order
    return first - second;
  });
}

var hasSynced = false;

function resetUserSync() {
  hasSynced = false;
}

function isNaN(value) {
  // eslint-disable-next-line no-self-compare
  return value !== value;
}

(0, _bidderFactory.registerBidder)(spec);

/***/ }),

/***/ 362:
/***/ (function(module, exports) {



/***/ })

},[360]);

pbjs.processQueue();
//# sourceMappingURL=prebid.js.map


/***/ })
/******/ ]);
//# sourceMappingURL=ad-engine.js.map