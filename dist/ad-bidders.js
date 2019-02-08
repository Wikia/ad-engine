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
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("@wikia/ad-engine");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/createClass");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/inherits");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/possibleConstructorReturn");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/get-prototype-of");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/keys");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/slicedToArray");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/assign");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("core-decorators");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/get-own-property-descriptor");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/extends");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),
/* 13 */
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

// EXTERNAL MODULE: external "babel-runtime/core-js/promise"
var promise_ = __webpack_require__(12);
var promise_default = /*#__PURE__*/__webpack_require__.n(promise_);

// EXTERNAL MODULE: external "babel-runtime/core-js/object/assign"
var assign_ = __webpack_require__(8);
var assign_default = /*#__PURE__*/__webpack_require__.n(assign_);

// EXTERNAL MODULE: external "babel-runtime/core-js/object/keys"
var keys_ = __webpack_require__(6);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys_);

// EXTERNAL MODULE: external "@wikia/ad-engine"
var ad_engine_ = __webpack_require__(0);

// EXTERNAL MODULE: external "babel-runtime/core-js/object/get-prototype-of"
var get_prototype_of_ = __webpack_require__(5);
var get_prototype_of_default = /*#__PURE__*/__webpack_require__.n(get_prototype_of_);

// EXTERNAL MODULE: external "babel-runtime/helpers/classCallCheck"
var classCallCheck_ = __webpack_require__(2);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck_);

// EXTERNAL MODULE: external "babel-runtime/helpers/createClass"
var createClass_ = __webpack_require__(1);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass_);

// EXTERNAL MODULE: external "babel-runtime/helpers/possibleConstructorReturn"
var possibleConstructorReturn_ = __webpack_require__(4);
var possibleConstructorReturn_default = /*#__PURE__*/__webpack_require__.n(possibleConstructorReturn_);

// EXTERNAL MODULE: external "babel-runtime/helpers/inherits"
var inherits_ = __webpack_require__(3);
var inherits_default = /*#__PURE__*/__webpack_require__.n(inherits_);

// CONCATENATED MODULE: ./src/ad-bidders/base-bidder.js




var base_bidder_BaseBidder = function () {
	function BaseBidder(name, bidderConfig) {
		var _this = this;

		var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2000;

		classCallCheck_default()(this, BaseBidder);

		this.name = name;
		this.logGroup = name + '-bidder';
		this.bidderConfig = bidderConfig;
		this.timeout = timeout;

		this.resetState();
		this.onResponse = function () {
			return _this.onResponseCall();
		};

		ad_engine_["utils"].logger(this.logGroup, 'created');
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
			this.called = true;

			if (this.callBids) {
				this.callBids(this.onResponse);
			}

			ad_engine_["utils"].logger(this.logGroup, 'called');
		}

		/**
   * Returns bidder slot alias if available, otherwise slot name
   *
   * @param {string} slotName
   *
   * @returns {string}
   */

	}, {
		key: 'getSlotAlias',
		value: function getSlotAlias(slotName) {
			return ad_engine_["context"].get('slots.' + slotName + '.bidderAlias') || slotName;
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
		value: function getSlotTargetingParams(slotName) {
			if (!this.called || !this.isSlotSupported(slotName) || !this.getTargetingParams) {
				return {};
			}

			return this.getTargetingParams(slotName);
		}
	}, {
		key: 'hasResponse',
		value: function hasResponse() {
			return this.response;
		}
	}, {
		key: 'isSupported',
		value: function isSupported() {
			return false;
		}
	}, {
		key: 'isSlotSupported',
		value: function isSlotSupported(slotName) {
			return this.isSupported(slotName);
		}
	}, {
		key: 'onResponseCall',
		value: function onResponseCall() {
			this.response = true;

			if (this.calculatePrices) {
				this.calculatePrices();
			}

			this.onResponseCallbacks.flush();
			ad_engine_["utils"].logger(this.logGroup, 'respond');
		}
	}, {
		key: 'resetState',
		value: function resetState() {
			var _this2 = this;

			this.called = false;
			this.response = false;

			this.onResponseCallbacks = new ad_engine_["utils"].LazyQueue();
			this.onResponseCallbacks.onItemFlush(function (callback) {
				callback(_this2.name);
			});
		}

		/**
   * Fires the Promise if bidder replied or timeout is reached
   *
   * @returns {Promise}
   */

	}, {
		key: 'waitForResponse',
		value: function waitForResponse() {
			var _this3 = this;

			return ad_engine_["utils"].createWithTimeout(function (resolve) {
				if (_this3.hasResponse()) {
					resolve();
				} else {
					_this3.addResponseListener(resolve);
				}
			}, this.timeout);
		}

		/**
   * Check if bidder was called
   *
   * @returns {boolean}
   */

	}, {
		key: 'wasCalled',
		value: function wasCalled() {
			return this.called;
		}
	}]);

	return BaseBidder;
}();
// CONCATENATED MODULE: ./src/ad-bidders/a9/index.js









/**
 * @typedef {Object} A9SlotDefinition
 * @property {string} slotID
 * @property {string} slotName
 */

var loaded = false;
var logGroup = 'A9';

var a9_A9 = function (_BaseBidder) {
	inherits_default()(A9, _BaseBidder);

	function A9(bidderConfig) {
		var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;

		classCallCheck_default()(this, A9);

		var _this = possibleConstructorReturn_default()(this, (A9.__proto__ || get_prototype_of_default()(A9)).call(this, 'a9', bidderConfig, timeout));

		_this.isCMPEnabled = ad_engine_["context"].get('custom.isCMPEnabled');
		_this.amazonId = _this.bidderConfig.amazonId;
		_this.slots = _this.bidderConfig.slots;
		_this.slotsNames = keys_default()(_this.slots);
		_this.bids = {};
		_this.priceMap = {};
		_this.slotNamesMap = {};
		_this.targetingKeys = [];
		_this.timeout = timeout;
		_this.bidsRefreshing = ad_engine_["context"].get('bidders.a9.bidsRefreshing');
		_this.isBidsRefreshingEnabled = _this.bidsRefreshing && _this.bidsRefreshing.enabled;
		_this.isRenderImpOverwritten = false;
		return _this;
	}

	createClass_default()(A9, [{
		key: 'calculatePrices',
		value: function calculatePrices() {
			var _this2 = this;

			keys_default()(this.bids).forEach(function (slotName) {
				_this2.priceMap[slotName] = _this2.bids[slotName].amznbid;
			});
		}
	}, {
		key: 'callBids',
		value: function callBids() {
			var _this3 = this;

			if (window.__cmp) {
				window.__cmp('getConsentData', null, function (consentData) {
					_this3.init(consentData);
				});
			} else {
				this.init();
			}
		}
	}, {
		key: 'init',
		value: function init() {
			var consentData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			if (!loaded) {
				this.insertScript();
				this.configureApstag();

				var apsConfig = {
					pubID: this.amazonId,
					videoAdServer: 'DFP',
					deals: !!this.bidderConfig.dealsEnabled
				};

				if (this.isCMPEnabled && consentData && consentData.consentData) {
					apsConfig.gdpr = {
						enabled: consentData.gdprApplies,
						consent: consentData.consentData,
						cmpTimeout: 5000
					};
				}

				window.apstag.init(apsConfig);

				loaded = true;
			}

			this.bids = {};
			this.priceMap = {};

			var a9Slots = this.getA9SlotsDefinitions(this.slotsNames);

			this.fetchBids(a9Slots);
		}

		/**
   * Fetches bids from A9.
   *
   * Calls this.onResponse() upon success.
   *
   * @param {A9SlotDefinition[]} slots
   */

	}, {
		key: 'fetchBids',
		value: function fetchBids(slots) {
			var _this4 = this;

			var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			ad_engine_["utils"].logger(logGroup, 'fetching bids for slots', slots);
			window.apstag.fetchBids({
				slots: slots,
				timeout: this.timeout
			}, function (currentBids) {
				ad_engine_["utils"].logger(logGroup, 'bids fetched for slots', slots, 'bids', currentBids);
				// overwrite window.apstag.renderImp on the first fetch
				if (!_this4.isRenderImpOverwritten) {
					_this4.overwriteRenderImp();
					_this4.isRenderImpOverwritten = true;
				}
				currentBids.forEach(function (bid) {
					var slotName = _this4.slotNamesMap[bid.slotID] || bid.slotID;

					var bidTargeting = bid;
					var keys = window.apstag.targetingKeys();

					if (_this4.bidderConfig.dealsEnabled) {
						keys = bid.helpers.targetingKeys;
						bidTargeting = bid.targeting;
					}

					_this4.bids[slotName] = {};
					keys.forEach(function (key) {
						if (_this4.targetingKeys.indexOf(key) === -1) {
							_this4.targetingKeys.push(key);
						}
						_this4.bids[slotName][key] = bidTargeting[key];
					});
				});

				_this4.onResponse();
				if (refresh) {
					ad_engine_["events"].emit(ad_engine_["events"].BIDS_REFRESH);
				}
			});
		}
	}, {
		key: 'configureApstag',
		value: function configureApstag() {
			var _this5 = this;

			window.apstag = window.apstag || {};
			window.apstag._Q = window.apstag._Q || [];

			if (typeof window.apstag.init === 'undefined') {
				window.apstag.init = function () {
					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}

					_this5.configureApstagCommand('i', args);
				};
			}

			if (typeof window.apstag.fetchBids === 'undefined') {
				window.apstag.fetchBids = function () {
					for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
						args[_key2] = arguments[_key2];
					}

					_this5.configureApstagCommand('f', args);
				};
			}
		}
	}, {
		key: 'configureApstagCommand',
		value: function configureApstagCommand(command, args) {
			window.apstag._Q.push([command, args]);
		}
	}, {
		key: 'getBestPrice',
		value: function getBestPrice(slotName) {
			var slotAlias = this.getSlotAlias(slotName);

			return this.priceMap[slotAlias] ? { a9: this.priceMap[slotAlias] } : {};
		}
	}, {
		key: 'getPrices',
		value: function getPrices() {
			return this.priceMap;
		}
	}, {
		key: 'getTargetingKeysToReset',
		value: function getTargetingKeysToReset() {
			return this.targetingKeys;
		}
	}, {
		key: 'getTargetingParams',
		value: function getTargetingParams(slotName) {
			return this.bids[this.getSlotAlias(slotName)] || {};
		}
	}, {
		key: 'insertScript',
		value: function insertScript() {
			ad_engine_["utils"].scriptLoader.loadScript('//c.amazon-adsystem.com/aax2/apstag.js', 'text/javascript', true, 'first');
		}

		/**
   * Wraps apstag.renderImp
   *
   * Calls this.refreshBid() if bids refreshing is enabled.
   */

	}, {
		key: 'overwriteRenderImp',
		value: function overwriteRenderImp() {
			var _this6 = this;

			ad_engine_["utils"].logger(logGroup, 'overwriting window.apstag.renderImp');
			window.apstag.renderImp = function (original) {
				return function (doc, impId) {
					original(doc, impId);

					var slot = _this6.getRenderedSlot(impId);
					var slotName = slot.getSlotName();

					ad_engine_["utils"].logger(logGroup, 'bid used for slot ' + slotName);
					delete _this6.bids[_this6.getSlotAlias(slotName)];

					if (window.apstag.renderImp && _this6.isBidsRefreshingEnabled) {
						_this6.refreshBid(slot);
					}
				};
			}(window.apstag.renderImp);
		}

		/**
   * Checks if slot with given name is supported by bidder.
   *
   * @param {string} slotName
   * @returns {boolean}
   */

	}, {
		key: 'isSupported',
		value: function isSupported(slotName) {
			return !!this.slots[this.getSlotAlias(slotName)];
		}

		/**
   * Checks if slot should be refreshed.
   *
   * @param {AdSlot} slot
   * @returns {boolean}
   */

	}, {
		key: 'shouldRefreshSlot',
		value: function shouldRefreshSlot(slot) {
			return this.bidsRefreshing.slots.includes(this.getSlotAlias(slot.getSlotName()));
		}

		/**
   * Returns slot which used bid with given impression id.
   *
   * @param {string | number} impId
   * @returns {AdSlot | undefined }
   */

	}, {
		key: 'getRenderedSlot',
		value: function getRenderedSlot(impId) {
			var renderedSlot = void 0;

			ad_engine_["slotService"].forEach(function (slot) {
				if (slot.getTargeting().amzniid === impId) {
					renderedSlot = slot;
				}
			});

			return renderedSlot;
		}

		/**
   * Refreshes bid for given slot.
   *
   * @param {string | number} impId
   */

	}, {
		key: 'refreshBid',
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
   * Transforms slots names into A9 slot definitions.
   *
   * @param {string[]} slotsNames
   * @returns {A9SlotDefinition[]}
   */

	}, {
		key: 'getA9SlotsDefinitions',
		value: function getA9SlotsDefinitions(slotsNames) {
			var _this7 = this;

			return slotsNames.map(function (slotName) {
				return _this7.getSlotAlias(slotName);
			}).map(function (slotAlias) {
				return _this7.createSlotDefinition(slotAlias);
			}).filter(function (slot) {
				return slot !== null;
			});
		}

		/**
   * Creates A9 slot definition from slot name.
   *
   * @param {string} slotName
   * @returns {A9SlotDefinition | null} Returns null i
   */

	}, {
		key: 'createSlotDefinition',
		value: function createSlotDefinition(slotName) {
			var config = this.slots[slotName];
			var slotID = config.slotId || slotName;
			var definition = {
				slotID: slotID,
				slotName: slotID
			};

			if (!ad_engine_["slotService"].getState(slotID)) {
				return null;
			}

			this.slotNamesMap[slotID] = slotName;

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
	}]);

	return A9;
}(base_bidder_BaseBidder);
// EXTERNAL MODULE: external "babel-runtime/core-js/object/get-own-property-descriptor"
var get_own_property_descriptor_ = __webpack_require__(10);
var get_own_property_descriptor_default = /*#__PURE__*/__webpack_require__.n(get_own_property_descriptor_);

// EXTERNAL MODULE: external "core-decorators"
var external_core_decorators_ = __webpack_require__(9);

// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/base-adapter.js



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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/aol.js







var aol_Aol = function (_BaseAdapter) {
	inherits_default()(Aol, _BaseAdapter);

	function Aol(options) {
		classCallCheck_default()(this, Aol);

		var _this = possibleConstructorReturn_default()(this, (Aol.__proto__ || get_prototype_of_default()(Aol)).call(this, options));

		_this.bidderName = 'aol';
		_this.network = options.network;
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/appnexus.js








var appnexus_Appnexus = function (_BaseAdapter) {
	inherits_default()(Appnexus, _BaseAdapter);

	function Appnexus(options) {
		classCallCheck_default()(this, Appnexus);

		var _this = possibleConstructorReturn_default()(this, (Appnexus.__proto__ || get_prototype_of_default()(Appnexus)).call(this, options));

		_this.bidderName = 'appnexus';
		_this.placements = options.placements;
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
				var vertical = ad_engine_["context"].get('targeting.mappedVerticalName');

				position = vertical && this.placements[vertical] ? vertical : 'other';
			}

			return this.placements[position];
		}
	}]);

	return Appnexus;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/appnexus-ast.js








var appnexus_ast_AppnexusAst = function (_BaseAdapter) {
	inherits_default()(AppnexusAst, _BaseAdapter);

	function AppnexusAst(options) {
		classCallCheck_default()(this, AppnexusAst);

		var _this = possibleConstructorReturn_default()(this, (AppnexusAst.__proto__ || get_prototype_of_default()(AppnexusAst)).call(this, options));

		_this.bidderName = 'appnexusAst';
		_this.aliases = {
			appnexus: [_this.bidderName]
		};
		_this.debugPlacementId = options.debugPlacementId;
		_this.isDebugMode = ad_engine_["utils"].queryString.get('appnexusast_debug_mode') === '1';
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/audience-network.js








var audience_network_AudienceNetwork = function (_BaseAdapter) {
	inherits_default()(AudienceNetwork, _BaseAdapter);

	function AudienceNetwork(options) {
		classCallCheck_default()(this, AudienceNetwork);

		var _this = possibleConstructorReturn_default()(this, (AudienceNetwork.__proto__ || get_prototype_of_default()(AudienceNetwork)).call(this, options));

		_this.bidderName = 'audienceNetwork';
		_this.testMode = ad_engine_["utils"].queryString.get('audiencenetworktest') === 'true';
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/beachfront.js








var beachfront_Beachfront = function (_BaseAdapter) {
	inherits_default()(Beachfront, _BaseAdapter);

	function Beachfront(options) {
		classCallCheck_default()(this, Beachfront);

		var _this = possibleConstructorReturn_default()(this, (Beachfront.__proto__ || get_prototype_of_default()(Beachfront)).call(this, options));

		_this.bidderName = 'beachfront';
		_this.bidfloor = 0.01;
		_this.debugAppId = options.debugAppId;
		_this.isDebugMode = ad_engine_["utils"].queryString.get('beachfront_debug_mode') === '1';
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/index-exchange.js







var index_exchange_IndexExchange = function (_BaseAdapter) {
	inherits_default()(IndexExchange, _BaseAdapter);

	function IndexExchange(options) {
		classCallCheck_default()(this, IndexExchange);

		var _this = possibleConstructorReturn_default()(this, (IndexExchange.__proto__ || get_prototype_of_default()(IndexExchange)).call(this, options));

		_this.bidderName = 'indexExchange';
		_this.aliases = {
			ix: [_this.bidderName]
		};
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/kargo.js







var kargo_Kargo = function (_BaseAdapter) {
	inherits_default()(Kargo, _BaseAdapter);

	function Kargo(options) {
		classCallCheck_default()(this, Kargo);

		var _this = possibleConstructorReturn_default()(this, (Kargo.__proto__ || get_prototype_of_default()(Kargo)).call(this, options));

		_this.bidderName = 'kargo';
		return _this;
	}

	createClass_default()(Kargo, [{
		key: 'prepareConfigForAdUnit',
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/lkqd.js







var lkqd_Lkqd = function (_BaseAdapter) {
	inherits_default()(Lkqd, _BaseAdapter);

	function Lkqd(options) {
		classCallCheck_default()(this, Lkqd);

		var _this = possibleConstructorReturn_default()(this, (Lkqd.__proto__ || get_prototype_of_default()(Lkqd)).call(this, options));

		_this.bidderName = 'lkqd';
		return _this;
	}

	createClass_default()(Lkqd, [{
		key: 'prepareConfigForAdUnit',
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/onemobile.js







var onemobile_Onemobile = function (_BaseAdapter) {
	inherits_default()(Onemobile, _BaseAdapter);

	function Onemobile(options) {
		classCallCheck_default()(this, Onemobile);

		var _this = possibleConstructorReturn_default()(this, (Onemobile.__proto__ || get_prototype_of_default()(Onemobile)).call(this, options));

		_this.bidderName = 'onemobile';
		_this.siteId = options.siteId;
		return _this;
	}

	createClass_default()(Onemobile, [{
		key: 'prepareConfigForAdUnit',
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/openx.js







var openx_Openx = function (_BaseAdapter) {
	inherits_default()(Openx, _BaseAdapter);

	function Openx(options) {
		classCallCheck_default()(this, Openx);

		var _this = possibleConstructorReturn_default()(this, (Openx.__proto__ || get_prototype_of_default()(Openx)).call(this, options));

		_this.bidderName = 'openx';
		_this.delDomain = options.delDomain;
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
// EXTERNAL MODULE: external "babel-runtime/helpers/extends"
var extends_ = __webpack_require__(11);
var extends_default = /*#__PURE__*/__webpack_require__.n(extends_);

// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/pubmatic.js








var pubmatic_Pubmatic = function (_BaseAdapter) {
	inherits_default()(Pubmatic, _BaseAdapter);

	function Pubmatic(options) {
		classCallCheck_default()(this, Pubmatic);

		var _this = possibleConstructorReturn_default()(this, (Pubmatic.__proto__ || get_prototype_of_default()(Pubmatic)).call(this, options));

		_this.bidderName = 'pubmatic';
		_this.publisherId = options.publisherId;
		return _this;
	}

	createClass_default()(Pubmatic, [{
		key: 'prepareConfigForAdUnit',
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
		key: 'getVideoConfig',
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
		key: 'getStandardConfig',
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
		key: 'getBids',
		value: function getBids(ids) {
			var _this2 = this;

			var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			return ids.map(function (adSlot) {
				return {
					bidder: _this2.bidderName,
					params: extends_default()({
						adSlot: adSlot,
						publisherId: _this2.publisherId
					}, params)
				};
			});
		}
	}]);

	return Pubmatic;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/ad-bidders/prebid/prebid-helper.js





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
	return assign_default()({
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/rubicon.js









var rubicon_Rubicon = function (_BaseAdapter) {
	inherits_default()(Rubicon, _BaseAdapter);

	function Rubicon(options) {
		classCallCheck_default()(this, Rubicon);

		var _this = possibleConstructorReturn_default()(this, (Rubicon.__proto__ || get_prototype_of_default()(Rubicon)).call(this, options));

		_this.bidderName = 'rubicon';
		_this.accountId = options.accountId;
		return _this;
	}

	createClass_default()(Rubicon, [{
		key: 'prepareConfigForAdUnit',
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/rubicon-display.js









var rubicon_display_RubiconDisplay = function (_BaseAdapter) {
	inherits_default()(RubiconDisplay, _BaseAdapter);

	function RubiconDisplay(options) {
		classCallCheck_default()(this, RubiconDisplay);

		var _this = possibleConstructorReturn_default()(this, (RubiconDisplay.__proto__ || get_prototype_of_default()(RubiconDisplay)).call(this, options));

		_this.bidderName = 'rubicon_display';
		_this.aliases = {
			rubicon: [_this.bidderName]
		};
		_this.accountId = options.accountId;
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
// EXTERNAL MODULE: external "babel-runtime/helpers/slicedToArray"
var slicedToArray_ = __webpack_require__(7);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray_);

// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/wikia.js









var price = ad_engine_["utils"].queryString.get('wikia_adapter');
var limit = parseInt(ad_engine_["utils"].queryString.get('wikia_adapter_limit'), 10) || 99;
var wikia_timeout = parseInt(ad_engine_["utils"].queryString.get('wikia_adapter_timeout'), 10) || 0;
var useRandomPrice = ad_engine_["utils"].queryString.get('wikia_adapter_random') === '1';

var wikia_Wikia = function (_BaseAdapter) {
	inherits_default()(Wikia, _BaseAdapter);

	function Wikia(options) {
		classCallCheck_default()(this, Wikia);

		var _this = possibleConstructorReturn_default()(this, (Wikia.__proto__ || get_prototype_of_default()(Wikia)).call(this, options));

		_this.bidderName = 'wikia';
		_this.enabled = !!price;
		_this.limit = limit;
		_this.useRandomPrice = useRandomPrice;
		_this.timeout = wikia_timeout;

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
			if (this.useRandomPrice) {
				return Math.floor(Math.random() * 2000) / 100;
			}

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
		key: 'getCreative',
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

			details.innerText = 'cpm: ' + cpm + ', size: ' + size.join('x');

			creative.appendChild(title);
			creative.appendChild(details);

			return creative.outerHTML;
		}
	}]);

	return Wikia;
}(base_adapter_BaseAdapter);
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters/wikia-video.js









var wikia_video_price = ad_engine_["utils"].queryString.get('wikia_video_adapter');
var wikia_video_limit = parseInt(ad_engine_["utils"].queryString.get('wikia_adapter_limit'), 10) || 99;
var wikia_video_timeout = parseInt(ad_engine_["utils"].queryString.get('wikia_adapter_timeout'), 10) || 0;
var wikia_video_useRandomPrice = ad_engine_["utils"].queryString.get('wikia_adapter_random') === '1';

var wikia_video_WikiaVideo = function (_BaseAdapter) {
	inherits_default()(WikiaVideo, _BaseAdapter);

	function WikiaVideo(options) {
		classCallCheck_default()(this, WikiaVideo);

		var _this = possibleConstructorReturn_default()(this, (WikiaVideo.__proto__ || get_prototype_of_default()(WikiaVideo)).call(this, options));

		_this.bidderName = 'wikiaVideo';
		_this.enabled = !!wikia_video_price;
		_this.limit = wikia_video_limit;
		_this.useRandomPrice = wikia_video_useRandomPrice;
		_this.timeout = wikia_video_timeout;

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
			if (this.useRandomPrice) {
				return Math.floor(Math.random() * 20);
			}

			return parseInt(wikia_video_price, 10) / 100;
		}
	}, {
		key: 'getVastUrl',
		value: function getVastUrl(width, height, slotName) {
			return Object(ad_engine_["buildVastUrl"])(width / height, slotName, {
				videoAdUnitId: ad_engine_["context"].get('bidders.prebid.wikiaVideo.slots.' + slotName + '.videoAdUnitId'),
				customParams: ad_engine_["context"].get('bidders.prebid.wikiaVideo.slots.' + slotName + '.customParams')
			});
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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/adapters-registry.js

















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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/price-helper.js



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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/prebid-settings.js



var dfpVideoBidders = [{ bidderCode: 'appnexusAst', contextKey: 'custom.appnexusDfp' }, { bidderCode: 'beachfront', contextKey: 'custom.beachfrontDfp' }, { bidderCode: 'lkqd', contextKey: 'custom.lkqdDfp' }, { bidderCode: 'rubicon', contextKey: 'custom.rubiconDfp' }, { bidderCode: 'pubmatic', contextKey: 'custom.pubmaticDfp' }];

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
// CONCATENATED MODULE: ./src/ad-bidders/prebid/index.js







var _dec, _dec2, _dec3, _desc, _value, _class;

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









function postponeExecutionUntilPbjsLoads(method) {
	return function () {
		var _this = this;

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return window.pbjs.que.push(function () {
			return method.apply(_this, args);
		});
	};
}

var prebid_logGroup = 'prebid';

var prebid_loaded = false;

window.pbjs = window.pbjs || {};
window.pbjs.que = window.pbjs.que || [];

ad_engine_["events"].registerEvent('BIDS_REFRESH');
ad_engine_["events"].registerEvent('PREBID_LAZY_CALL');

var prebid_Prebid = (_dec = Object(external_core_decorators_["decorate"])(postponeExecutionUntilPbjsLoads), _dec2 = Object(external_core_decorators_["decorate"])(postponeExecutionUntilPbjsLoads), _dec3 = Object(external_core_decorators_["decorate"])(postponeExecutionUntilPbjsLoads), (_class = function (_BaseBidder) {
	inherits_default()(Prebid, _BaseBidder);

	function Prebid(bidderConfig) {
		var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;

		classCallCheck_default()(this, Prebid);

		var _this2 = possibleConstructorReturn_default()(this, (Prebid.__proto__ || get_prototype_of_default()(Prebid)).call(this, 'prebid', bidderConfig, timeout));

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
		key: 'applyConfig',
		value: function applyConfig(config) {
			window.pbjs.setConfig(config);
		}
	}, {
		key: 'applySettings',
		value: function applySettings() {
			window.pbjs.bidderSettings = getSettings();
		}
	}, {
		key: 'callBids',
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
				ad_engine_["events"].on(ad_engine_["events"].PREBID_LAZY_CALL, function () {
					_this3.lazyCall(bidsBackHandler);
				});
			}
		}
	}, {
		key: 'insertScript',
		value: function insertScript() {
			if (prebid_loaded) {
				return;
			}

			var libraryUrl = ad_engine_["context"].get('bidders.prebid.libraryUrl');

			if (!libraryUrl) {
				ad_engine_["utils"].logger(prebid_logGroup, 'Prebid library URL not defined. Assuming that window.pbjs will be loaded.');

				return;
			}

			ad_engine_["utils"].scriptLoader.loadScript(libraryUrl, 'text/javascript', true, 'first');
			prebid_loaded = true;
		}
	}, {
		key: 'lazyCall',
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
		key: 'removeAdUnits',
		value: function removeAdUnits() {
			(window.pbjs.adUnits || []).forEach(function (adUnit) {
				window.pbjs.removeAdUnit(adUnit.code);
			});
		}
	}, {
		key: 'getBestPrice',
		value: function getBestPrice(slotName) {
			var slotAlias = this.getSlotAlias(slotName);

			return getPrebidBestPrice(slotAlias);
		}
	}, {
		key: 'getTargetingKeysToReset',
		value: function getTargetingKeysToReset() {
			return ['hb_bidder', 'hb_adid', 'hb_pb', 'hb_size', 'hb_uuid'];
		}
	}, {
		key: 'getTargetingParams',
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
				}

				// ADEN-7436: AppNexus hb_uuid fix
				// (adserverTargeting params are being set before cache key is returned)
				slotParams.hb_uuid = slotParams.hb_uuid || bidParams.videoCacheKey || 'disabled';
			}

			return slotParams || {};
		}
	}, {
		key: 'isSupported',
		value: function isSupported(slotName) {
			var slotAlias = this.getSlotAlias(slotName);

			return this.adUnits && this.adUnits.some(function (adUnit) {
				return adUnit.code === slotAlias;
			});
		}
	}, {
		key: 'registerBidsRefreshing',
		value: function registerBidsRefreshing() {
			var _this4 = this;

			window.pbjs.que.push(function () {
				var refreshUsedBid = function refreshUsedBid(winningBid) {
					if (_this4.bidsRefreshing.slots.indexOf(winningBid.adUnitCode) !== -1) {
						ad_engine_["events"].emit(ad_engine_["events"].BIDS_REFRESH);
						var adUnitsToRefresh = _this4.adUnits.filter(function (adUnit) {
							return adUnit.code === winningBid.adUnitCode && adUnit.bids && adUnit.bids[0] && adUnit.bids[0].bidder === winningBid.bidderCode;
						});

						_this4.requestBids(adUnitsToRefresh, _this4.bidsRefreshing.bidsBackHandler);
					}
				};

				window.pbjs.onEvent('bidWon', refreshUsedBid);
				ad_engine_["events"].once(ad_engine_["events"].PAGE_CHANGE_EVENT, function () {
					window.pbjs.offEvent('bidWon', refreshUsedBid);
				});
			});
		}
	}, {
		key: 'requestBids',
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
	}]);

	return Prebid;
}(base_bidder_BaseBidder), (_applyDecoratedDescriptor(_class.prototype, 'applyConfig', [_dec], get_own_property_descriptor_default()(_class.prototype, 'applyConfig'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'applySettings', [_dec2], get_own_property_descriptor_default()(_class.prototype, 'applySettings'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'requestBids', [_dec3], get_own_property_descriptor_default()(_class.prototype, 'requestBids'), _class.prototype)), _class));
prebid_Prebid.validResponseStatusCode = 1;
prebid_Prebid.errorResponseStatusCode = 2;
// CONCATENATED MODULE: ./src/ad-bidders/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bidders", function() { return ad_bidders_bidders; });









var biddersRegistry = {};
var realSlotPrices = {};
var ad_bidders_logGroup = 'bidders';

ad_engine_["events"].on(ad_engine_["events"].VIDEO_AD_REQUESTED, function (adSlot) {
	resetTargetingKeys(adSlot.getSlotName());
});

function applyTargetingParams(slotName, targeting) {
	keys_default()(targeting).forEach(function (key) {
		return ad_engine_["context"].set('slots.' + slotName + '.targeting.' + key, targeting[key]);
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
			ad_engine_["context"].remove('slots.' + slotName + '.targeting.' + key);
		});
	});

	ad_engine_["utils"].logger(ad_bidders_logGroup, 'resetTargetingKeys', slotName);
}

function requestBids(_ref) {
	var _ref$responseListener = _ref.responseListener,
	    responseListener = _ref$responseListener === undefined ? null : _ref$responseListener;

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