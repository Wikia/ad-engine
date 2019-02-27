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
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
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

module.exports = require("@babel/runtime-corejs2/helpers/classCallCheck");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/inherits");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/getPrototypeOf");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/possibleConstructorReturn");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/object/keys");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/parse-int");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/objectSpread");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/assertThisInitialized");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/slicedToArray");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("core-decorators");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/applyDecoratedDescriptor");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/object/get-own-property-descriptor");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/object/assign");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/promise");

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var prebid_helper_namespaceObject = {};
__webpack_require__.d(prebid_helper_namespaceObject, "setupAdUnits", function() { return setupAdUnits; });
__webpack_require__.d(prebid_helper_namespaceObject, "getBidByAdId", function() { return getBidByAdId; });
__webpack_require__.d(prebid_helper_namespaceObject, "getAvailableBidsByAdUnitCode", function() { return getAvailableBidsByAdUnitCode; });
__webpack_require__.d(prebid_helper_namespaceObject, "getPrebid", function() { return getPrebid; });
__webpack_require__.d(prebid_helper_namespaceObject, "getTargeting", function() { return getTargeting; });
__webpack_require__.d(prebid_helper_namespaceObject, "getWinningVideoBidBySlotName", function() { return getWinningVideoBidBySlotName; });
__webpack_require__.d(prebid_helper_namespaceObject, "pushPrebid", function() { return pushPrebid; });

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/promise"
var promise_ = __webpack_require__(15);
var promise_default = /*#__PURE__*/__webpack_require__.n(promise_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/assign"
var assign_ = __webpack_require__(14);
var assign_default = /*#__PURE__*/__webpack_require__.n(assign_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/keys"
var keys_ = __webpack_require__(6);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys_);

// EXTERNAL MODULE: external "@wikia/ad-engine"
var ad_engine_ = __webpack_require__(0);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/objectSpread"
var objectSpread_ = __webpack_require__(8);
var objectSpread_default = /*#__PURE__*/__webpack_require__.n(objectSpread_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/classCallCheck"
var classCallCheck_ = __webpack_require__(2);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/createClass"
var createClass_ = __webpack_require__(1);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/possibleConstructorReturn"
var possibleConstructorReturn_ = __webpack_require__(5);
var possibleConstructorReturn_default = /*#__PURE__*/__webpack_require__.n(possibleConstructorReturn_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/getPrototypeOf"
var getPrototypeOf_ = __webpack_require__(4);
var getPrototypeOf_default = /*#__PURE__*/__webpack_require__.n(getPrototypeOf_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/inherits"
var inherits_ = __webpack_require__(3);
var inherits_default = /*#__PURE__*/__webpack_require__.n(inherits_);

// CONCATENATED MODULE: ./src/ad-bidders/base-bidder.ts



/**
 * @abstract
 */

var base_bidder_BaseBidder =
/*#__PURE__*/
function () {
  function BaseBidder(name, bidderConfig) {
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2000;

    classCallCheck_default()(this, BaseBidder);

    this.name = name;
    this.logGroup = "".concat(name, "-bidder");
    this.bidderConfig = bidderConfig;
    this.timeout = timeout;
    this.utils = ad_engine_["utils"];
    this.context = ad_engine_["context"];
    this.resetState();
    this.utils.logger(this.logGroup, 'created');
  }

  createClass_default()(BaseBidder, [{
    key: "resetState",
    value: function resetState() {
      var _this = this;

      this.called = false;
      this.response = false;
      this.onResponseCallbacks = new ad_engine_["utils"].LazyQueue();
      this.onResponseCallbacks.onItemFlush(function (callback) {
        callback(_this.name);
      });
    }
  }, {
    key: "call",
    value: function call() {
      var _this2 = this;

      this.response = false;
      this.called = true;
      this.callBids(function () {
        return _this2.onBidResponse();
      });
      this.utils.logger(this.logGroup, 'called');
    }
    /**
     * @protected
     */

  }, {
    key: "onBidResponse",
    value: function onBidResponse() {
      this.response = true;
      this.calculatePrices();
      this.onResponseCallbacks.flush();
      this.utils.logger(this.logGroup, 'respond');
    }
    /**
     * Returns bidder slot alias if available, otherwise slot name
     * @protected
     * @param {string} slotName
     * @returns {string}
     */

  }, {
    key: "getSlotAlias",
    value: function getSlotAlias(slotName) {
      return ad_engine_["context"].get("slots.".concat(slotName, ".bidderAlias")) || slotName;
    }
    /**
     * @param {string} slotName
     * @returns {{}}
     */

  }, {
    key: "getSlotBestPrice",
    value: function getSlotBestPrice(slotName) {
      return this.getBestPrice(slotName);
    }
    /**
     * @param {string} slotName
     * @returns {{}}
     */

  }, {
    key: "getSlotTargetingParams",
    value: function getSlotTargetingParams(slotName) {
      if (!this.called || !this.isSlotSupported(slotName)) {
        return {};
      }

      return this.getTargetingParams(slotName);
    }
    /**
     * @param {string} slotName
     * @returns {boolean}
     */

  }, {
    key: "isSlotSupported",
    value: function isSlotSupported(slotName) {
      return this.isSupported(slotName);
    }
    /**
     * Fires the Promise if bidder replied or timeout is reached
     * @returns {Promise}
     */

  }, {
    key: "waitForResponse",
    value: function waitForResponse() {
      var _this3 = this;

      return this.utils.createWithTimeout(function (resolve) {
        if (_this3.hasResponse()) {
          resolve();
        } else {
          _this3.addResponseListener(resolve);
        }
      }, this.timeout);
    }
    /**
     * @returns {boolean}
     */

  }, {
    key: "hasResponse",
    value: function hasResponse() {
      return this.response;
    }
  }, {
    key: "addResponseListener",
    value: function addResponseListener(callback) {
      this.onResponseCallbacks.push(callback);
    }
    /**
     * Check if bidder was called
     * @returns {boolean}
     */

  }, {
    key: "wasCalled",
    value: function wasCalled() {
      return this.called;
    }
    /**
     * @abstract
     * @protected
     */

  }, {
    key: "callBids",
    value: function callBids(cb) {
      throw new ad_engine_["utils"].NotImplementedException({
        cb: cb
      });
    }
    /**
     * @abstract
     * @protected
     */

  }, {
    key: "calculatePrices",
    value: function calculatePrices() {
      throw new ad_engine_["utils"].NotImplementedException();
    }
    /**
     * @abstract
     * @protected
     * @param {string} slotName
     * @returns {*|{}}
     */

  }, {
    key: "getBestPrice",
    value: function getBestPrice(slotName) {
      throw new ad_engine_["utils"].NotImplementedException({
        slotName: slotName
      });
    }
    /**
     * @abstract
     * @protected
     * @param {string} slotName
     * @returns {*|{}}
     */

  }, {
    key: "getTargetingParams",
    value: function getTargetingParams(slotName) {
      throw new ad_engine_["utils"].NotImplementedException({
        slotName: slotName
      });
    }
    /**
     * Checks if slot with given name is supported by bidder.
     * @abstract
     * @protected
     * @param {string} slotName
     * @returns {boolean}
     */

  }, {
    key: "isSupported",
    value: function isSupported(slotName) {
      throw new ad_engine_["utils"].NotImplementedException({
        slotName: slotName
      });
    }
  }]);

  return BaseBidder;
}();
// CONCATENATED MODULE: ./src/ad-bidders/wrappers/apstag.ts



var apstag_Apstag =
/*#__PURE__*/
function () {
  createClass_default()(Apstag, null, [{
    key: "make",

    /**
     * @private
     */
    value: function make() {
      if (!Apstag.instance) {
        Apstag.instance = new Apstag();
      }

      return Apstag.instance;
    }
    /**
     * @private
     */

  }]);

  /**
   * @private
   */
  function Apstag() {
    classCallCheck_default()(this, Apstag);

    this.renderImpEndCallbacks = [];
    this.renderImpHookPresent = false;
    this.utils = ad_engine_["utils"];
    this.insertScript();
    this.configure();
  }
  /**
   * @private
   */


  createClass_default()(Apstag, [{
    key: "insertScript",
    value: function insertScript() {
      this.script = this.utils.scriptLoader.loadScript('//c.amazon-adsystem.com/aax2/apstag.js', 'text/javascript', true, 'first');
    }
    /**
     * @private
     */

  }, {
    key: "configure",
    value: function configure() {
      var _this = this;

      window.apstag = window.apstag || {};
      window.apstag._Q = window.apstag._Q || [];

      if (typeof window.apstag.init === 'undefined') {
        window.apstag.init = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this.configureCommand('i', args);
        };
      }

      if (typeof window.apstag.fetchBids === 'undefined') {
        window.apstag.fetchBids = function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          _this.configureCommand('f', args);
        };
      }
    }
    /** @private */

  }, {
    key: "configureCommand",
    value: function configureCommand(command, args) {
      window.apstag._Q.push([command, args]);
    }
  }, {
    key: "init",
    value: function init(apsConfig) {
      window.apstag.init(apsConfig);
    }
    /**
     * @param {{slots: A9SlotDefinition[], timeout: number}} bidsConfig configuration of bids
     * @param {function(object)} cb Callback receiving current bids
     * @returns {!Promise} If `cb` has been omitted
     */

  }, {
    key: "fetchBids",
    value: function fetchBids(bidsConfig) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      window.apstag.fetchBids(bidsConfig, function (currentBids) {
        return cb(currentBids);
      });
    }
  }, {
    key: "targetingKeys",
    value: function targetingKeys() {
      return window.apstag.targetingKeys();
    }
  }, {
    key: "enableDebug",
    value: function enableDebug() {
      window.apstag.debug('enable');
    }
  }, {
    key: "disableDebug",
    value: function disableDebug() {
      window.apstag.debug('disable');
    }
    /**
     * Executes callback each time after apstag.renderImp is called
     * @param {function} callback
     */

  }, {
    key: "onRenderImpEnd",
    value: function onRenderImpEnd(callback) {
      if (typeof callback !== 'function') {
        throw new Error('onRenderImpEnd used with callback not being a function');
      }

      if (!this.renderImpHookPresent) {
        this.addRenderImpHook();
      }

      this.renderImpEndCallbacks.push(callback);
    }
    /**
     * @private
     */

  }, {
    key: "addRenderImpHook",
    value: function addRenderImpHook() {
      var _this2 = this;

      var original = window.apstag.renderImp;

      window.apstag.renderImp = function () {
        for (var _len3 = arguments.length, options = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          options[_key3] = arguments[_key3];
        }

        original.apply(void 0, options);
        var doc = options[0],
            impId = options[1];

        _this2.renderImpEndCallbacks.forEach(function (cb) {
          return cb(doc, impId);
        });
      };
    }
  }]);

  return Apstag;
}();
apstag_Apstag.instance = void 0;
// CONCATENATED MODULE: ./src/ad-bidders/wrappers/cmp.ts


var cmp_Cmp =
/*#__PURE__*/
function () {
  function Cmp() {
    classCallCheck_default()(this, Cmp);
  }

  createClass_default()(Cmp, [{
    key: "getConsentData",

    /**
     * @param {*=} param
     * @param {function(object)} cb Callback receiving current bids
     */
    value: function getConsentData(param, cb) {
      window.__cmp('getConsentData', param, function (consentData) {
        return cb(consentData);
      });
    }
  }, {
    key: "override",
    value: function override(newCmp) {
      window.__cmp = newCmp;
    }
  }, {
    key: "exists",
    get: function get() {
      return !!window.__cmp;
    }
  }]);

  return Cmp;
}();
var cmp = new cmp_Cmp();
// CONCATENATED MODULE: ./src/ad-bidders/wrappers/index.ts


// CONCATENATED MODULE: ./src/ad-bidders/a9/index.ts










var logGroup = 'A9';
/**
 * @typedef {Object} A9SlotDefinition
 * @property {string} slotID
 * @property {string} slotName
 */

var a9_A9 =
/*#__PURE__*/
function (_BaseBidder) {
  inherits_default()(A9, _BaseBidder);

  /** @private */
  function A9(bidderConfig) {
    var _this;

    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;

    classCallCheck_default()(this, A9);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(A9).call(this, 'a9', bidderConfig, timeout));
    _this.loaded = false;
    _this.isCMPEnabled = ad_engine_["context"].get('custom.isCMPEnabled');
    _this.amazonId = _this.bidderConfig.amazonId;
    _this.slots = _this.bidderConfig.slots;
    _this.slotsNames = keys_default()(_this.slots);
    _this.bids = {};
    _this.priceMap = {};
    _this.slotNamesMap = {};
    _this.targetingKeys = [];
    _this.apstag = apstag_Apstag.make();
    _this.cmp = cmp;
    _this.utils = ad_engine_["utils"];
    _this.events = ad_engine_["events"];
    _this.slotService = ad_engine_["slotService"];
    _this.timeout = timeout;
    _this.bidsRefreshing = ad_engine_["context"].get('bidders.a9.bidsRefreshing') || {};
    _this.isRenderImpOverwritten = false;
    return _this;
  }

  createClass_default()(A9, [{
    key: "getPrices",
    value: function getPrices() {
      return this.priceMap;
    }
  }, {
    key: "getTargetingKeysToReset",
    value: function getTargetingKeysToReset() {
      return this.targetingKeys;
    }
  }, {
    key: "init",
    value: function init() {
      var consentData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.initIfNotLoaded(consentData);
      this.bids = {};
      this.priceMap = {};
      var a9Slots = this.getA9SlotsDefinitions(this.slotsNames);
      this.fetchBids(a9Slots);
    }
    /**
     * @private
     * @param consentData
     */

  }, {
    key: "initIfNotLoaded",
    value: function initIfNotLoaded(consentData) {
      if (!this.loaded) {
        this.apstag.init(this.getApstagConfig(consentData));
        this.loaded = true;
      }
    }
    /**
     * @private
     * @param consentData
     * @returns {{videoAdServer: string, deals: boolean, pubID: (*|string), gdpr: ()}}
     */

  }, {
    key: "getApstagConfig",
    value: function getApstagConfig(consentData) {
      return objectSpread_default()({
        pubID: this.amazonId,
        videoAdServer: 'DFP',
        deals: !!this.bidderConfig.dealsEnabled
      }, this.getGdprIfApplicable(consentData));
    }
    /**
     * @private
     * @param consentData
     * @returns {*}
     */

  }, {
    key: "getGdprIfApplicable",
    value: function getGdprIfApplicable(consentData) {
      if (this.isCMPEnabled && consentData && consentData.consentData) {
        return {
          gdpr: {
            enabled: consentData.gdprApplies,
            consent: consentData.consentData,
            cmpTimeout: 5000
          }
        };
      }

      return {};
    }
    /**
     * Transforms slots names into A9 slot definitions.
     * @param {string[]} slotsNames
     * @returns {A9SlotDefinition[]}
     */

  }, {
    key: "getA9SlotsDefinitions",
    value: function getA9SlotsDefinitions(slotsNames) {
      var _this2 = this;

      return slotsNames.map(function (slotName) {
        return _this2.getSlotAlias(slotName);
      }).map(function (slotAlias) {
        return _this2.createSlotDefinition(slotAlias);
      }).filter(function (slot) {
        return slot !== null;
      });
    }
    /**
     * Fetches bids from A9.
     * Calls this.onBidResponse() upon success.
     * @private
     * @param {A9SlotDefinition[]} slots
     * @param {boolean} refresh
     */

  }, {
    key: "fetchBids",
    value: function fetchBids(slots) {
      var _this3 = this;

      var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      ad_engine_["utils"].logger(logGroup, 'fetching bids for slots', slots);
      this.apstag.fetchBids({
        slots: slots,
        timeout: this.timeout
      }, function (currentBids) {
        ad_engine_["utils"].logger(logGroup, 'bids fetched for slots', slots, 'bids', currentBids);

        _this3.addApstagRenderImpHookOnFirstFetch();

        currentBids.forEach(function (bid) {
          var slotName = _this3.slotNamesMap[bid.slotID] || bid.slotID;

          var _this3$getBidTargetin = _this3.getBidTargetingWithKeys(bid),
              keys = _this3$getBidTargetin.keys,
              bidTargeting = _this3$getBidTargetin.bidTargeting;

          _this3.updateBidSlot(slotName, keys, bidTargeting);
        });

        _this3.onBidResponse();

        if (refresh) {
          ad_engine_["eventService"].emit(ad_engine_["events"].BIDS_REFRESH);
        }
      });
    }
    /**
     * @private
     */

  }, {
    key: "addApstagRenderImpHookOnFirstFetch",
    value: function addApstagRenderImpHookOnFirstFetch() {
      if (!this.isRenderImpOverwritten) {
        this.isRenderImpOverwritten = true;
        this.addApstagRenderImpHook();
      }
    }
    /**
     * Wraps apstag.renderImp
     * Calls this.refreshBid() if bids refreshing is enabled.
     * @private
     */

  }, {
    key: "addApstagRenderImpHook",
    value: function addApstagRenderImpHook() {
      var _this4 = this;

      ad_engine_["utils"].logger(logGroup, 'overwriting window.apstag.renderImp');
      this.apstag.onRenderImpEnd(function (doc, impId) {
        if (!impId) {
          ad_engine_["utils"].logger(logGroup, 'apstag.renderImp() called with 1 argument only');
          return;
        }

        var slot = _this4.getRenderedSlot(impId);

        var slotName = slot.getSlotName();
        slot.addClass(A9.A9_CLASS);
        ad_engine_["utils"].logger(logGroup, "bid used for slot ".concat(slotName));
        delete _this4.bids[_this4.getSlotAlias(slotName)];

        if (_this4.bidsRefreshing.enabled) {
          _this4.refreshBid(slot);
        }
      });
    }
    /**
     * Returns slot which used bid with given impression id.
     * @private
     */

  }, {
    key: "getRenderedSlot",
    value: function getRenderedSlot(impId) {
      var renderedSlot;
      ad_engine_["slotService"].forEach(function (slot) {
        if (slot.getTargeting().amzniid === impId) {
          renderedSlot = slot;
        }
      });
      return renderedSlot;
    }
    /**
     * Refreshes bid for given slot.
     * @private
     * @param {AdSlot} slot
     */

  }, {
    key: "refreshBid",
    value: function refreshBid(slot) {
      if (!this.shouldRefreshSlot(slot)) {
        return;
      }

      var slotDef = this.createSlotDefinition(this.getSlotAlias(slot.getSlotName()));

      if (slotDef) {
        ad_engine_["utils"].logger(logGroup, 'refresh bids for slot', slotDef);
        this.fetchBids([slotDef], true);
      }
    }
    /**
     * Checks if slot should be refreshed.
     * @private
     * @param {AdSlot} slot
     * @returns {boolean}
     */

  }, {
    key: "shouldRefreshSlot",
    value: function shouldRefreshSlot(slot) {
      return this.bidsRefreshing.slots.includes(this.getSlotAlias(slot.getSlotName()));
    }
    /**
     * Creates A9 slot definition from slot alias.
     * @param {string} slotAlias
     * @returns {A9SlotDefinition | null} Returns null i
     */

  }, {
    key: "createSlotDefinition",
    value: function createSlotDefinition(slotAlias) {
      var config = this.slots[slotAlias];
      var slotID = config.slotId || slotAlias;
      var definition = {
        slotID: slotID,
        slotName: slotID
      };
      this.slotNamesMap[slotID] = slotAlias;

      if (!this.bidderConfig.videoEnabled && config.type === 'video') {
        return null;
      }

      if (config.type === 'video') {
        definition.mediaType = 'video';
      } else {
        definition.sizes = config.sizes;
      }

      return definition;
    }
    /**
     * @private
     * @param bid
     * @returns {*}
     */

  }, {
    key: "getBidTargetingWithKeys",
    value: function getBidTargetingWithKeys(bid) {
      var bidTargeting = bid;
      var keys = this.apstag.targetingKeys();

      if (this.bidderConfig.dealsEnabled) {
        keys = bid.helpers.targetingKeys;
        bidTargeting = bid.targeting;
      }

      return {
        keys: keys,
        bidTargeting: bidTargeting
      };
    }
    /**
     * @private
     * @param slotName
     * @param keys
     * @param bidTargeting
     */

  }, {
    key: "updateBidSlot",
    value: function updateBidSlot(slotName, keys, bidTargeting) {
      var _this5 = this;

      this.bids[slotName] = {};
      keys.forEach(function (key) {
        if (_this5.targetingKeys.indexOf(key) === -1) {
          _this5.targetingKeys.push(key);
        }

        _this5.bids[slotName][key] = bidTargeting[key];
      });
    }
    /**
     * @protected
     */

  }, {
    key: "callBids",
    value: function callBids() {
      var _this6 = this;

      if (this.cmp.exists) {
        this.cmp.getConsentData(null, function (consentData) {
          _this6.init(consentData);
        });
      } else {
        this.init();
      }
    }
    /**
     * @inheritDoc
     */

  }, {
    key: "calculatePrices",
    value: function calculatePrices() {
      var _this7 = this;

      return keys_default()(this.bids).forEach(function (slotName) {
        _this7.priceMap[slotName] = _this7.bids[slotName].amznbid;
      });
    }
    /**
     * @inheritDoc
     */

  }, {
    key: "getBestPrice",
    value: function getBestPrice(slotName) {
      var slotAlias = this.getSlotAlias(slotName);
      return this.priceMap[slotAlias] ? {
        a9: this.priceMap[slotAlias]
      } : {};
    }
    /**
     * @inheritDoc
     */

  }, {
    key: "getTargetingParams",
    value: function getTargetingParams(slotName) {
      return this.bids[this.getSlotAlias(slotName)] || {};
    }
    /**
     * @inheritDoc
     */

  }, {
    key: "isSupported",
    value: function isSupported(slotName) {
      return !!this.slots[this.getSlotAlias(slotName)];
    }
  }]);

  return A9;
}(base_bidder_BaseBidder);
a9_A9.A9_CLASS = 'a9-ad';
// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/get-own-property-descriptor"
var get_own_property_descriptor_ = __webpack_require__(13);
var get_own_property_descriptor_default = /*#__PURE__*/__webpack_require__.n(get_own_property_descriptor_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/applyDecoratedDescriptor"
var applyDecoratedDescriptor_ = __webpack_require__(12);
var applyDecoratedDescriptor_default = /*#__PURE__*/__webpack_require__.n(applyDecoratedDescriptor_);

// EXTERNAL MODULE: external "core-decorators"
var external_core_decorators_ = __webpack_require__(11);

// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/base-adapter.ts



var base_adapter_BaseAdapter =
/*#__PURE__*/
function () {
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/aol.ts






var aol_Aol =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(Aol, _BaseAdapter);

  function Aol(options) {
    var _this;

    classCallCheck_default()(this, Aol);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Aol).call(this, options));
    _this.bidderName = 'aol';
    _this.network = options.network;
    return _this;
  }

  createClass_default()(Aol, [{
    key: "prepareConfigForAdUnit",
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/appnexus.ts







var appnexus_Appnexus =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(Appnexus, _BaseAdapter);

  function Appnexus(options) {
    var _this;

    classCallCheck_default()(this, Appnexus);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Appnexus).call(this, options));
    _this.bidderName = 'appnexus';
    _this.placements = options.placements;
    return _this;
  }

  createClass_default()(Appnexus, [{
    key: "prepareConfigForAdUnit",
    value: function prepareConfigForAdUnit(code, _ref) {
      var sizes = _ref.sizes,
          _ref$position = _ref.position,
          position = _ref$position === void 0 ? 'mobile' : _ref$position;
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
    key: "getPlacement",
    value: function getPlacement(position) {
      if (position === 'mobile') {
        var vertical = ad_engine_["context"].get('targeting.mappedVerticalName');
        position = vertical && this.placements[vertical] ? vertical : 'other';
      }

      return this.placements[position];
    }
  }]);

  return Appnexus;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/appnexus-ast.ts







var appnexus_ast_AppnexusAst =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(AppnexusAst, _BaseAdapter);

  function AppnexusAst(options) {
    var _this;

    classCallCheck_default()(this, AppnexusAst);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(AppnexusAst).call(this, options));
    _this.bidderName = 'appnexusAst';
    _this.aliases = {
      appnexus: [_this.bidderName]
    };
    _this.debugPlacementId = options.debugPlacementId;
    _this.isDebugMode = ad_engine_["utils"].queryString.get('appnexusast_debug_mode') === '1';
    return _this;
  }

  createClass_default()(AppnexusAst, [{
    key: "prepareConfigForAdUnit",
    value: function prepareConfigForAdUnit(code, _ref) {
      var placementId = _ref.placementId;
      return {
        code: code,
        mediaTypes: {
          video: {
            context: 'instream',
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/audience-network.ts







var audience_network_AudienceNetwork =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(AudienceNetwork, _BaseAdapter);

  function AudienceNetwork(options) {
    var _this;

    classCallCheck_default()(this, AudienceNetwork);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(AudienceNetwork).call(this, options));
    _this.bidderName = 'audienceNetwork';
    _this.testMode = ad_engine_["utils"].queryString.get('audiencenetworktest') === 'true';
    return _this;
  }

  createClass_default()(AudienceNetwork, [{
    key: "prepareConfigForAdUnit",
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/beachfront.ts







var beachfront_Beachfront =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(Beachfront, _BaseAdapter);

  function Beachfront(options) {
    var _this;

    classCallCheck_default()(this, Beachfront);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Beachfront).call(this, options));
    _this.bidderName = 'beachfront';
    _this.bidfloor = 0.01;
    _this.debugAppId = options.debugAppId;
    _this.isDebugMode = ad_engine_["utils"].queryString.get('beachfront_debug_mode') === '1';
    return _this;
  }

  createClass_default()(Beachfront, [{
    key: "prepareConfigForAdUnit",
    value: function prepareConfigForAdUnit(code, _ref) {
      var appId = _ref.appId;
      return {
        code: code,
        mediaTypes: {
          video: {
            context: 'instream',
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/index-exchange.ts






var index_exchange_IndexExchange =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(IndexExchange, _BaseAdapter);

  function IndexExchange(options) {
    var _this;

    classCallCheck_default()(this, IndexExchange);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(IndexExchange).call(this, options));
    _this.bidderName = 'indexExchange';
    _this.aliases = {
      ix: [_this.bidderName]
    };
    return _this;
  }

  createClass_default()(IndexExchange, [{
    key: "prepareConfigForAdUnit",
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/kargo.ts






var kargo_Kargo =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(Kargo, _BaseAdapter);

  function Kargo(options) {
    var _this;

    classCallCheck_default()(this, Kargo);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Kargo).call(this, options));
    _this.bidderName = 'kargo';
    return _this;
  }

  createClass_default()(Kargo, [{
    key: "prepareConfigForAdUnit",
    value: function prepareConfigForAdUnit(code, _ref) {
      var sizes = _ref.sizes,
          placementId = _ref.placementId;
      return {
        code: code,
        sizes: sizes,
        bids: [{
          bidder: this.bidderName,
          params: {
            placementId: placementId
          }
        }]
      };
    }
  }]);

  return Kargo;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/lkqd.ts






var lkqd_Lkqd =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(Lkqd, _BaseAdapter);

  function Lkqd(options) {
    var _this;

    classCallCheck_default()(this, Lkqd);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Lkqd).call(this, options));
    _this.bidderName = 'lkqd';
    return _this;
  }

  createClass_default()(Lkqd, [{
    key: "prepareConfigForAdUnit",
    value: function prepareConfigForAdUnit(code, _ref) {
      var placementId = _ref.placementId,
          siteId = _ref.siteId;
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
            siteId: siteId,
            placementId: placementId,
            pageurl: window.location.hostname,
            output: 'svpaid'
          }
        }]
      };
    }
  }]);

  return Lkqd;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/onemobile.ts






var onemobile_Onemobile =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(Onemobile, _BaseAdapter);

  function Onemobile(options) {
    var _this;

    classCallCheck_default()(this, Onemobile);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Onemobile).call(this, options));
    _this.bidderName = 'onemobile';
    _this.siteId = options.siteId;
    return _this;
  }

  createClass_default()(Onemobile, [{
    key: "prepareConfigForAdUnit",
    value: function prepareConfigForAdUnit(code, _ref) {
      var size = _ref.size,
          pos = _ref.pos;
      return {
        code: code,
        mediaTypes: {
          banner: {
            sizes: [size]
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/openx.ts






var openx_Openx =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(Openx, _BaseAdapter);

  function Openx(options) {
    var _this;

    classCallCheck_default()(this, Openx);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Openx).call(this, options));
    _this.bidderName = 'openx';
    _this.delDomain = options.delDomain;
    return _this;
  }

  createClass_default()(Openx, [{
    key: "prepareConfigForAdUnit",
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/pubmatic.ts







var pubmatic_Pubmatic =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(Pubmatic, _BaseAdapter);

  function Pubmatic(options) {
    var _this;

    classCallCheck_default()(this, Pubmatic);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Pubmatic).call(this, options));
    _this.bidderName = 'pubmatic';
    _this.publisherId = options.publisherId;
    return _this;
  }

  createClass_default()(Pubmatic, [{
    key: "prepareConfigForAdUnit",
    value: function prepareConfigForAdUnit(code, _ref) {
      var sizes = _ref.sizes,
          ids = _ref.ids;

      switch (code.toLowerCase()) {
        case 'featured':
        case 'incontent_player':
          return this.getVideoConfig(code, ids);

        default:
          return this.getStandardConfig(code, sizes, ids);
      }
    }
  }, {
    key: "getVideoConfig",
    value: function getVideoConfig(code, ids) {
      var videoParams = {
        video: {
          mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
          skippable: true,
          minduration: 1,
          maxduration: 30,
          startdelay: 0,
          playbackmethod: [2, 3],
          protocols: [2, 3, 5, 6],
          linearity: 1,
          placement: 1
        }
      };
      return {
        code: code,
        mediaTypes: {
          video: {
            playerSize: [640, 480],
            context: 'instream'
          }
        },
        bids: this.getBids(ids, videoParams)
      };
    }
  }, {
    key: "getStandardConfig",
    value: function getStandardConfig(code, sizes, ids) {
      return {
        code: code,
        mediaTypes: {
          banner: {
            sizes: sizes
          }
        },
        bids: this.getBids(ids)
      };
    }
  }, {
    key: "getBids",
    value: function getBids(ids) {
      var _this2 = this;

      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return ids.map(function (adSlot) {
        return {
          bidder: _this2.bidderName,
          params: objectSpread_default()({
            adSlot: adSlot,
            publisherId: _this2.publisherId
          }, params)
        };
      });
    }
  }]);

  return Pubmatic;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/ad-bidders/prebid/prebid-helper.ts




var lazyLoadSlots = ['bottom_leaderboard'];

function isSlotApplicable(code, lazyLoad) {
  var isSlotLazy = lazyLoadSlots.indexOf(code) !== -1;

  if (!ad_engine_["slotService"].getState(code)) {
    return false;
  }

  if (lazyLoad !== 'off' && (lazyLoad === 'pre' && isSlotLazy || lazyLoad === 'post' && !isSlotLazy)) {
    return false;
  }

  return true;
}

function setupAdUnits(adaptersConfig) {
  var lazyLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'off';
  var adUnits = [];
  var adapters = getAdapters(adaptersConfig);
  adapters.forEach(function (adapter) {
    if (adapter && adapter.enabled) {
      var adapterAdUnits = adapter.prepareAdUnits();
      adapterAdUnits.forEach(function (adUnit) {
        if (adUnit && isSlotApplicable(adUnit.code, lazyLoad)) {
          adUnits.push(adUnit);
        }
      });
    }
  });
  return adUnits;
}
function getBidByAdId(adId) {
  if (!window.pbjs || typeof window.pbjs.getBidResponses !== 'function') {
    return null;
  }

  var bids = window.pbjs.getAllPrebidWinningBids().filter(function (bid) {
    return adId === bid.adId;
  });

  if (!bids.length) {
    var responses = window.pbjs.getBidResponses();

    keys_default()(responses).forEach(function (adUnit) {
      var adUnitsBids = responses[adUnit].bids.filter(function (bid) {
        return adId === bid.adId;
      });
      bids = bids.concat(adUnitsBids);
    });
  }

  return bids.length ? bids[0] : null;
}
function getAvailableBidsByAdUnitCode(adUnitCode) {
  var bids = [];

  if (window.pbjs && typeof window.pbjs.getBidResponsesForAdUnitCode === 'function') {
    bids = window.pbjs.getBidResponsesForAdUnitCode(adUnitCode).bids || [];
    bids = bids.filter(function (bid) {
      return bid.status !== 'rendered';
    });
  }

  return bids;
}
function getPrebid() {
  return window.pbjs;
}
function getTargeting(slotName) {
  return objectSpread_default()({
    pos: [slotName]
  }, ad_engine_["context"].get('bidders.prebid.targeting') || {});
}
function getWinningVideoBidBySlotName(slotName, allowedBidders) {
  if (!window.pbjs || !window.pbjs.getBidResponsesForAdUnitCode) {
    return null;
  }

  var bids = window.pbjs.getBidResponsesForAdUnitCode(slotName).bids || [];
  return bids.filter(function (bid) {
    var canUseThisBidder = !allowedBidders || allowedBidders.indexOf(bid.bidderCode) !== -1;
    var hasVast = bid.vastUrl || bid.vastContent;
    return canUseThisBidder && hasVast && bid.cpm > 0;
  }).reduce(function (previousBid, currentBid) {
    if (previousBid === null || currentBid.cpm > previousBid.cpm) {
      return currentBid;
    }

    return previousBid;
  }, null);
}
function pushPrebid(callback) {
  window.pbjs.que.push(callback);
}
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/rubicon.ts








var rubicon_Rubicon =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(Rubicon, _BaseAdapter);

  function Rubicon(options) {
    var _this;

    classCallCheck_default()(this, Rubicon);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Rubicon).call(this, options));
    _this.bidderName = 'rubicon';
    _this.accountId = options.accountId;
    return _this;
  }

  createClass_default()(Rubicon, [{
    key: "prepareConfigForAdUnit",
    value: function prepareConfigForAdUnit(code, _ref) {
      var siteId = _ref.siteId,
          zoneId = _ref.zoneId,
          sizeId = _ref.sizeId,
          position = _ref.position;

      if (code === 'featured' && !ad_engine_["context"].get('custom.rubiconInFV')) {
        return null;
      }

      var targeting = getTargeting(code);
      return {
        code: code,
        mediaType: 'video',
        mediaTypes: {
          video: {
            playerSize: [640, 480],
            context: 'instream'
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
              language: targeting.lang ? targeting.lang[0] : 'en'
            }
          }
        }]
      };
    }
  }]);

  return Rubicon;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/rubicon-display.ts








var rubicon_display_RubiconDisplay =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(RubiconDisplay, _BaseAdapter);

  function RubiconDisplay(options) {
    var _this;

    classCallCheck_default()(this, RubiconDisplay);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(RubiconDisplay).call(this, options));
    _this.bidderName = 'rubicon_display';
    _this.aliases = {
      rubicon: [_this.bidderName]
    };
    _this.accountId = options.accountId;
    return _this;
  }

  createClass_default()(RubiconDisplay, [{
    key: "prepareConfigForAdUnit",
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
// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/slicedToArray"
var slicedToArray_ = __webpack_require__(10);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/assertThisInitialized"
var assertThisInitialized_ = __webpack_require__(9);
var assertThisInitialized_default = /*#__PURE__*/__webpack_require__.n(assertThisInitialized_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/parse-int"
var parse_int_ = __webpack_require__(7);
var parse_int_default = /*#__PURE__*/__webpack_require__.n(parse_int_);

// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/wikia.ts










var price = ad_engine_["utils"].queryString.get('wikia_adapter');
var limit = parse_int_default()(ad_engine_["utils"].queryString.get('wikia_adapter_limit'), 10) || 99;
var wikia_timeout = parse_int_default()(ad_engine_["utils"].queryString.get('wikia_adapter_timeout'), 10) || 0;
var useRandomPrice = ad_engine_["utils"].queryString.get('wikia_adapter_random') === '1';
var wikia_Wikia =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(Wikia, _BaseAdapter);

  function Wikia(options) {
    var _this;

    classCallCheck_default()(this, Wikia);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Wikia).call(this, options));
    _this.bidderName = 'wikia';
    _this.enabled = !!price;
    _this.limit = limit;
    _this.useRandomPrice = useRandomPrice;
    _this.timeout = wikia_timeout;

    _this.create = function () {
      return assertThisInitialized_default()(assertThisInitialized_default()(_this));
    };

    return _this;
  }

  createClass_default()(Wikia, [{
    key: "prepareConfigForAdUnit",
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
    key: "getSpec",
    value: function getSpec() {
      return {
        code: this.bidderName,
        supportedMediaTypes: ['banner']
      };
    }
  }, {
    key: "getPrice",
    value: function getPrice() {
      if (this.useRandomPrice) {
        return Math.floor(Math.random() * 2000) / 100;
      }

      return parse_int_default()(price, 10) / 100;
    }
  }, {
    key: "callBids",
    value: function callBids(bidRequest, addBidResponse, done) {
      var _this2 = this;

      window.pbjs.que.push(function () {
        _this2.addBids(bidRequest, addBidResponse, done);
      });
    }
  }, {
    key: "addBids",
    value: function addBids(bidRequest, addBidResponse, done) {
      var _this3 = this;

      setTimeout(function () {
        bidRequest.bids.forEach(function (bid) {
          if (_this3.limit === 0) {
            return;
          }

          var bidResponse = window.pbjs.createBid(1);

          var _bid$sizes$ = slicedToArray_default()(bid.sizes[0], 2),
              width = _bid$sizes$[0],
              height = _bid$sizes$[1];

          var cpm = _this3.getPrice();

          bidResponse.ad = _this3.getCreative(bid.sizes[0], cpm);
          bidResponse.bidderCode = bidRequest.bidderCode;
          bidResponse.cpm = cpm;
          bidResponse.ttl = 300;
          bidResponse.mediaType = 'banner';
          bidResponse.width = width;
          bidResponse.height = height;
          addBidResponse(bid.adUnitCode, bidResponse);
          _this3.limit -= 1;
        });
        done();
      }, this.timeout);
    }
  }, {
    key: "getCreative",
    value: function getCreative(size, cpm) {
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
      details.innerText = "cpm: ".concat(cpm, ", size: ").concat(size.join('x'));
      creative.appendChild(title);
      creative.appendChild(details);
      return creative.outerHTML;
    }
  }]);

  return Wikia;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/wikia-video.ts










var wikia_video_price = ad_engine_["utils"].queryString.get('wikia_video_adapter');
var wikia_video_limit = parse_int_default()(ad_engine_["utils"].queryString.get('wikia_adapter_limit'), 10) || 99;
var wikia_video_timeout = parse_int_default()(ad_engine_["utils"].queryString.get('wikia_adapter_timeout'), 10) || 0;
var wikia_video_useRandomPrice = ad_engine_["utils"].queryString.get('wikia_adapter_random') === '1';
var wikia_video_WikiaVideo =
/*#__PURE__*/
function (_BaseAdapter) {
  inherits_default()(WikiaVideo, _BaseAdapter);

  function WikiaVideo(options) {
    var _this;

    classCallCheck_default()(this, WikiaVideo);

    _this = possibleConstructorReturn_default()(this, getPrototypeOf_default()(WikiaVideo).call(this, options));
    _this.bidderName = 'wikiaVideo';
    _this.enabled = !!wikia_video_price;
    _this.limit = wikia_video_limit;
    _this.useRandomPrice = wikia_video_useRandomPrice;
    _this.timeout = wikia_video_timeout;

    _this.create = function () {
      return assertThisInitialized_default()(assertThisInitialized_default()(_this));
    };

    return _this;
  }

  createClass_default()(WikiaVideo, [{
    key: "prepareConfigForAdUnit",
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
    key: "getSpec",
    value: function getSpec() {
      return {
        code: this.bidderName,
        supportedMediaTypes: ['video']
      };
    }
  }, {
    key: "getPrice",
    value: function getPrice() {
      if (this.useRandomPrice) {
        return Math.floor(Math.random() * 20);
      }

      return parse_int_default()(wikia_video_price, 10) / 100;
    }
  }, {
    key: "getVastUrl",
    value: function getVastUrl(width, height, slotName) {
      return Object(ad_engine_["buildVastUrl"])(width / height, slotName, {
        videoAdUnitId: ad_engine_["context"].get("bidders.prebid.wikiaVideo.slots.".concat(slotName, ".videoAdUnitId")),
        customParams: ad_engine_["context"].get("bidders.prebid.wikiaVideo.slots.".concat(slotName, ".customParams"))
      });
    }
  }, {
    key: "callBids",
    value: function callBids(bidRequest, addBidResponse, done) {
      var _this2 = this;

      window.pbjs.que.push(function () {
        _this2.addBids(bidRequest, addBidResponse, done);
      });
    }
  }, {
    key: "addBids",
    value: function addBids(bidRequest, addBidResponse, done) {
      var _this3 = this;

      setTimeout(function () {
        bidRequest.bids.forEach(function (bid) {
          if (_this3.limit === 0) {
            return;
          }

          var bidResponse = window.pbjs.createBid(1);

          var _bid$sizes$ = slicedToArray_default()(bid.sizes[0], 2),
              width = _bid$sizes$[0],
              height = _bid$sizes$[1];

          var slotName = bid.adUnitCode;
          bidResponse.bidderCode = bidRequest.bidderCode;
          bidResponse.cpm = _this3.getPrice();
          bidResponse.creativeId = 'foo123_wikiaVideoCreativeId';
          bidResponse.ttl = 300;
          bidResponse.mediaType = 'video';
          bidResponse.width = width;
          bidResponse.height = height;
          bidResponse.vastUrl = _this3.getVastUrl(width, height, slotName);
          bidResponse.videoCacheKey = '123foo_wikiaVideoCacheKey';
          addBidResponse(bid.adUnitCode, bidResponse);
          _this3.limit -= 1;
        });
        done();
      }, this.timeout);
    }
  }]);

  return WikiaVideo;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters-registry.ts
















var adapters_registry_adapters = [];
var customAdapters = [];
var availableAdapters = {
  aol: aol_Aol,
  appnexus: appnexus_Appnexus,
  appnexusAst: appnexus_ast_AppnexusAst,
  audienceNetwork: audience_network_AudienceNetwork,
  beachfront: beachfront_Beachfront,
  indexExchange: index_exchange_IndexExchange,
  kargo: kargo_Kargo,
  lkqd: lkqd_Lkqd,
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/price-helper.ts


var DEFAULT_MAX_CPM = 20;
var videoBiddersCap50 = ['appnexusAst', 'rubicon', 'wikiaVideo']; // bidders with $50 cap

function isValidPrice(bid) {
  return bid.getStatusCode && bid.getStatusCode() === prebid_Prebid.validResponseStatusCode;
}
/**
 * Round cpm to predefined values.
 *
 * @param {number} cpm
 * @param {number} maxCpm
 * @returns {number}
 */


function roundCpm(cpm, maxCpm) {
  var result = Math.floor(maxCpm);

  if (cpm === 0) {
    result = 0.0;
  } else if (cpm < 0.05) {
    result = 0.01;
  } else if (cpm < 5.0) {
    result = Math.floor(cpm * 20) / 20;
  } else if (cpm < 10.0) {
    result = Math.floor(cpm * 10) / 10;
  } else if (cpm < 20.0) {
    result = Math.floor(cpm * 2) / 2;
  } else if (cpm < maxCpm) {
    result = Math.floor(cpm);
  }

  return result;
}
/**
 * Round cpm to predefined values and transform to String with 2 decimal places.
 *
 * @param {number} cpm
 * @param {number} maxCpm
 * @returns {string}
 */


function transformPriceFromCpm(cpm) {
  var maxCpm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_MAX_CPM;
  maxCpm = Math.max(maxCpm, DEFAULT_MAX_CPM);
  return roundCpm(cpm, maxCpm).toFixed(2);
}
/**
 *
 * @param {string} slotName
 * @return {object}
 */

function getPrebidBestPrice(slotName) {
  var bestPrices = {};

  if (window.pbjs && window.pbjs.getBidResponsesForAdUnitCode) {
    var slotBids = window.pbjs.getBidResponsesForAdUnitCode(slotName).bids || [];
    getAdapters().forEach(function (adapter) {
      bestPrices[adapter.bidderName] = '';
    });
    slotBids.forEach(function (bid) {
      if (isValidPrice(bid) && bid.status !== 'rendered') {
        var bidderCode = bid.bidderCode,
            cpm = bid.cpm;
        var cmpPrice = Math.max(bestPrices[bidderCode] || 0, roundCpm(cpm, DEFAULT_MAX_CPM));

        if (cmpPrice > 0) {
          bestPrices[bidderCode] = cmpPrice.toFixed(2);
        }
      }
    });
  }

  return bestPrices;
}
function transformPriceFromBid(bid) {
  var maxCpm = DEFAULT_MAX_CPM;

  if (videoBiddersCap50.includes(bid.bidderCode)) {
    maxCpm = 50;
  }

  return transformPriceFromCpm(bid.cpm, maxCpm);
}
// CONCATENATED MODULE: ./src/ad-bidders/prebid/prebid-settings.ts


var dfpVideoBidders = [{
  bidderCode: 'appnexusAst',
  contextKey: 'custom.appnexusDfp'
}, {
  bidderCode: 'beachfront',
  contextKey: 'custom.beachfrontDfp'
}, {
  bidderCode: 'lkqd',
  contextKey: 'custom.lkqdDfp'
}, {
  bidderCode: 'rubicon',
  contextKey: 'custom.rubiconDfp'
}, {
  bidderCode: 'pubmatic',
  contextKey: 'custom.pubmaticDfp'
}];
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
          return transformPriceFromBid(bidResponse);
        }
      }, {
        key: 'hb_size',
        val: function val(_ref3) {
          var size = _ref3.size;
          return size;
        }
      }, {
        key: 'hb_uuid',
        val: function val(bidResponse) {
          return getBidderUuid(bidResponse);
        }
      }]
    }
  };
}

function getBidderUuid(bidResponse) {
  var isVideo = dfpVideoBidders.some(function (video) {
    return bidResponse.bidderCode === video.bidderCode && ad_engine_["context"].get(video.contextKey);
  });
  return isVideo ? bidResponse.videoCacheKey : 'disabled';
}
// CONCATENATED MODULE: ./src/ad-bidders/prebid/index.ts








var _dec, _dec2, _dec3, _class, _class2, _temp;









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

ad_engine_["eventService"].on(ad_engine_["events"].VIDEO_AD_IMPRESSION, markWinningBidAsUsed);
ad_engine_["eventService"].on(ad_engine_["events"].VIDEO_AD_ERROR, markWinningBidAsUsed);

function markWinningBidAsUsed(adSlot) {
  // Mark ad as rendered
  var adId = ad_engine_["context"].get("slots.".concat(adSlot.getSlotName(), ".targeting.hb_adid"));

  if (adId) {
    if (window.pbjs && typeof window.pbjs.markWinningBidAsUsed === 'function') {
      window.pbjs.markWinningBidAsUsed({
        adId: adId
      });
      ad_engine_["eventService"].emit(ad_engine_["events"].VIDEO_AD_USED, adSlot);
    }
  }
}

var prebid_logGroup = 'prebid';
var loaded = false;
window.pbjs = window.pbjs || {};
window.pbjs.que = window.pbjs.que || [];
var prebid_Prebid = (_dec = Object(external_core_decorators_["decorate"])(postponeExecutionUntilPbjsLoads), _dec2 = Object(external_core_decorators_["decorate"])(postponeExecutionUntilPbjsLoads), _dec3 = Object(external_core_decorators_["decorate"])(postponeExecutionUntilPbjsLoads), (_class = (_temp = _class2 =
/*#__PURE__*/
function (_BaseBidder) {
  inherits_default()(Prebid, _BaseBidder);

  function Prebid(bidderConfig) {
    var _this2;

    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;

    classCallCheck_default()(this, Prebid);

    _this2 = possibleConstructorReturn_default()(this, getPrototypeOf_default()(Prebid).call(this, 'prebid', bidderConfig, timeout));

    _this2.insertScript();

    _this2.lazyLoaded = false;
    _this2.isLazyLoadingEnabled = _this2.bidderConfig.lazyLoadingEnabled;
    _this2.isCMPEnabled = ad_engine_["context"].get('custom.isCMPEnabled');
    _this2.adUnits = setupAdUnits(_this2.bidderConfig, _this2.isLazyLoadingEnabled ? 'pre' : 'off');
    _this2.prebidConfig = {
      debug: ad_engine_["utils"].queryString.get('pbjs_debug') === '1' || ad_engine_["utils"].queryString.get('pbjs_debug') === 'true',
      enableSendAllBids: true,
      bidderSequence: 'random',
      bidderTimeout: _this2.timeout,
      cache: {
        url: 'https://prebid.adnxs.com/pbc/v1/cache'
      },
      userSync: {
        iframeEnabled: true,
        enabledBidders: [],
        syncDelay: 6000
      }
    };
    _this2.bidsRefreshing = ad_engine_["context"].get('bidders.prebid.bidsRefreshing');

    if (_this2.isCMPEnabled) {
      _this2.prebidConfig.consentManagement = {
        cmpApi: 'iab',
        timeout: _this2.timeout,
        allowAuctionWithoutConsent: false
      };
    }

    window.pbjs = window.pbjs || {};
    window.pbjs.que = window.pbjs.que || [];

    _this2.applyConfig(_this2.prebidConfig);

    if (_this2.bidsRefreshing && _this2.bidsRefreshing.enabled) {
      _this2.registerBidsRefreshing();
    }

    return _this2;
  }

  createClass_default()(Prebid, [{
    key: "applyConfig",
    value: function applyConfig(config) {
      window.pbjs.setConfig(config);
    }
  }, {
    key: "applySettings",
    value: function applySettings() {
      window.pbjs.bidderSettings = getSettings();
    }
    /**
     * @protected
     */

  }, {
    key: "callBids",
    value: function callBids(bidsBackHandler) {
      var _this3 = this;

      if (!this.adUnits) {
        this.adUnits = setupAdUnits(this.bidderConfig, this.isLazyLoadingEnabled ? 'pre' : 'off');
      }

      if (this.adUnits.length > 0) {
        this.applySettings();
        this.requestBids(this.adUnits, bidsBackHandler, this.removeAdUnits);
      }

      if (this.isLazyLoadingEnabled) {
        ad_engine_["eventService"].on(ad_engine_["events"].PREBID_LAZY_CALL, function () {
          _this3.lazyCall(bidsBackHandler);
        });
      }
    }
    /**
     * @private
     */

  }, {
    key: "insertScript",
    value: function insertScript() {
      if (loaded) {
        return;
      }

      var libraryUrl = ad_engine_["context"].get('bidders.prebid.libraryUrl');

      if (!libraryUrl) {
        ad_engine_["utils"].logger(prebid_logGroup, 'Prebid library URL not defined. Assuming that window.pbjs will be loaded.');
        return;
      }

      ad_engine_["utils"].scriptLoader.loadScript(libraryUrl, 'text/javascript', true, 'first');
      loaded = true;
    }
  }, {
    key: "lazyCall",
    value: function lazyCall(bidsBackHandler) {
      if (this.lazyLoaded) {
        return;
      }

      this.lazyLoaded = true;
      var adUnitsLazy = setupAdUnits(this.bidderConfig, 'post');

      if (adUnitsLazy.length > 0) {
        this.requestBids(adUnitsLazy, bidsBackHandler);
        this.adUnits = this.adUnits.concat(adUnitsLazy);
      }
    }
  }, {
    key: "removeAdUnits",
    value: function removeAdUnits() {
      (window.pbjs.adUnits || []).forEach(function (adUnit) {
        window.pbjs.removeAdUnit(adUnit.code);
      });
    }
    /**
     * @inheritDoc
     */

  }, {
    key: "getBestPrice",
    value: function getBestPrice(slotName) {
      var slotAlias = this.getSlotAlias(slotName);
      return getPrebidBestPrice(slotAlias);
    }
  }, {
    key: "getTargetingKeysToReset",
    value: function getTargetingKeysToReset() {
      return ['hb_bidder', 'hb_adid', 'hb_pb', 'hb_size', 'hb_uuid'];
    }
    /**
     * @inheritDoc
     */

  }, {
    key: "getTargetingParams",
    value: function getTargetingParams(slotName) {
      var slotParams = {};
      var slotAlias = this.getSlotAlias(slotName);
      var bids = getAvailableBidsByAdUnitCode(slotAlias);

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

        if (bidParams) {
          slotParams = bidParams.adserverTargeting;
        } // ADEN-7436: AppNexus hb_uuid fix
        // (adserverTargeting params are being set before cache key is returned)


        slotParams.hb_uuid = slotParams.hb_uuid || bidParams.videoCacheKey || 'disabled';
      }

      return slotParams || {};
    }
    /**
     * @inheritDoc
     */

  }, {
    key: "isSupported",
    value: function isSupported(slotName) {
      var slotAlias = this.getSlotAlias(slotName);
      return this.adUnits && this.adUnits.some(function (adUnit) {
        return adUnit.code === slotAlias;
      });
    }
  }, {
    key: "registerBidsRefreshing",
    value: function registerBidsRefreshing() {
      var _this4 = this;

      window.pbjs.que.push(function () {
        var refreshUsedBid = function refreshUsedBid(winningBid) {
          if (_this4.bidsRefreshing.slots.indexOf(winningBid.adUnitCode) !== -1) {
            ad_engine_["eventService"].emit(ad_engine_["events"].BIDS_REFRESH);

            var adUnitsToRefresh = _this4.adUnits.filter(function (adUnit) {
              return adUnit.code === winningBid.adUnitCode && adUnit.bids && adUnit.bids[0] && adUnit.bids[0].bidder === winningBid.bidderCode;
            });

            _this4.requestBids(adUnitsToRefresh, _this4.bidsRefreshing.bidsBackHandler);
          }
        };

        window.pbjs.onEvent('bidWon', refreshUsedBid);
        ad_engine_["eventService"].once(ad_engine_["events"].PAGE_CHANGE_EVENT, function () {
          window.pbjs.offEvent('bidWon', refreshUsedBid);
        });
      });
    }
  }, {
    key: "requestBids",
    value: function requestBids(adUnits, bidsBackHandler) {
      var withRemove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      if (withRemove) {
        withRemove();
      }

      window.pbjs.requestBids({
        adUnits: adUnits,
        bidsBackHandler: bidsBackHandler
      });
    }
    /**
     * @inheritDoc
     */

  }, {
    key: "calculatePrices",
    value: function calculatePrices() {
      return null;
    }
  }]);

  return Prebid;
}(base_bidder_BaseBidder), _class2.validResponseStatusCode = 1, _class2.errorResponseStatusCode = 2, _temp), (applyDecoratedDescriptor_default()(_class.prototype, "applyConfig", [_dec], get_own_property_descriptor_default()(_class.prototype, "applyConfig"), _class.prototype), applyDecoratedDescriptor_default()(_class.prototype, "applySettings", [_dec2], get_own_property_descriptor_default()(_class.prototype, "applySettings"), _class.prototype), applyDecoratedDescriptor_default()(_class.prototype, "requestBids", [_dec3], get_own_property_descriptor_default()(_class.prototype, "requestBids"), _class.prototype)), _class));
// CONCATENATED MODULE: ./src/ad-bidders/index.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bidders", function() { return ad_bidders_bidders; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Apstag", function() { return apstag_Apstag; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Cmp", function() { return cmp_Cmp; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "cmp", function() { return cmp; });








var biddersRegistry = {};
var realSlotPrices = {};
var ad_bidders_logGroup = 'bidders';
ad_engine_["eventService"].on(ad_engine_["events"].VIDEO_AD_REQUESTED, function (adSlot) {
  adSlot.updateWinningPbBidderDetails();
});
ad_engine_["eventService"].on(ad_engine_["events"].VIDEO_AD_USED, function (adSlot) {
  updateSlotTargeting(adSlot.getSlotName());
});

function applyTargetingParams(slotName, targeting) {
  keys_default()(targeting).forEach(function (key) {
    return ad_engine_["context"].set("slots.".concat(slotName, ".targeting.").concat(key), targeting[key]);
  });
}
/**
 * Executes callback function on each enabled bidder
 *
 * @param {function} callback
 */


function forEachBidder(callback) {
  keys_default()(biddersRegistry).forEach(function (bidderName) {
    callback(biddersRegistry[bidderName]);
  });
}

function getBidParameters(slotName) {
  var slotParams = {};
  forEachBidder(function (bidder) {
    if (bidder && bidder.wasCalled()) {
      var params = bidder.getSlotTargetingParams(slotName);

      assign_default()(slotParams, params);
    }
  });
  return slotParams;
}

function getCurrentSlotPrices(slotName) {
  var slotPrices = {};
  forEachBidder(function (bidder) {
    if (bidder && bidder.isSlotSupported(slotName)) {
      var priceFromBidder = bidder.getSlotBestPrice(slotName);

      keys_default()(priceFromBidder).forEach(function (bidderName) {
        slotPrices[bidderName] = priceFromBidder[bidderName];
      });
    }
  });
  return slotPrices;
}

function getDfpSlotPrices(slotName) {
  return realSlotPrices[slotName] || {};
}
/**
 * Returns true if all bidders replied
 *
 * @returns {boolean}
 */


function hasAllResponses() {
  var missingBidders = keys_default()(biddersRegistry).filter(function (bidderName) {
    var bidder = biddersRegistry[bidderName];
    return !bidder.hasResponse();
  });

  return missingBidders.length === 0;
}

function resetTargetingKeys(slotName) {
  forEachBidder(function (bidder) {
    bidder.getTargetingKeysToReset().forEach(function (key) {
      ad_engine_["context"].remove("slots.".concat(slotName, ".targeting.").concat(key));
    });
  });
  ad_engine_["utils"].logger(ad_bidders_logGroup, 'resetTargetingKeys', slotName);
}

function requestBids(_ref) {
  var _ref$responseListener = _ref.responseListener,
      responseListener = _ref$responseListener === void 0 ? null : _ref$responseListener;
  var config = ad_engine_["context"].get('bidders');

  if (config.prebid && config.prebid.enabled) {
    biddersRegistry.prebid = new prebid_Prebid(config.prebid, config.timeout);
  }

  if (config.a9 && config.a9.enabled) {
    biddersRegistry.a9 = new a9_A9(config.a9, config.timeout);
  }

  forEachBidder(function (bidder) {
    if (responseListener) {
      bidder.addResponseListener(responseListener);
    }

    bidder.call();
  });
}
/**
 * Executes callback function if bidding is finished or timeout is reached
 *
 * @param {function} callback
 *
 * @returns {Promise}
 */


function runOnBiddingReady(callback) {
  var responses = [];
  forEachBidder(function (bidder) {
    responses.push(bidder.waitForResponse());
  });
  return promise_default.a.all(responses).then(callback);
}

function storeRealSlotPrices(slotName) {
  realSlotPrices[slotName] = getCurrentSlotPrices(slotName);
}

function updateSlotTargeting(slotName) {
  var bidderTargeting = getBidParameters(slotName);
  storeRealSlotPrices(slotName);
  resetTargetingKeys(slotName);
  applyTargetingParams(slotName, bidderTargeting);
  ad_engine_["utils"].logger(ad_bidders_logGroup, 'updateSlotTargeting', slotName, bidderTargeting);
  return bidderTargeting;
}

var ad_bidders_bidders = {
  getBidParameters: getBidParameters,
  getCurrentSlotPrices: getCurrentSlotPrices,
  getDfpSlotPrices: getDfpSlotPrices,
  hasAllResponses: hasAllResponses,
  prebidHelper: prebid_helper_namespaceObject,
  requestBids: requestBids,
  runOnBiddingReady: runOnBiddingReady,
  transformPriceFromBid: transformPriceFromBid,
  updateSlotTargeting: updateSlotTargeting
};


/***/ })
/******/ ]);
//# sourceMappingURL=ad-bidders.js.map