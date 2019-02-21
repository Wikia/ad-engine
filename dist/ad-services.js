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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
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

module.exports = require("@babel/runtime-corejs2/core-js/promise");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/object/keys");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/symbol");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/object/assign");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/parse-int");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/set");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/toConsumableArray");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/core-js/object/entries");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("@babel/runtime-corejs2/helpers/slicedToArray");

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/slicedToArray"
var slicedToArray_ = __webpack_require__(11);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/entries"
var entries_ = __webpack_require__(10);
var entries_default = /*#__PURE__*/__webpack_require__.n(entries_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/toConsumableArray"
var toConsumableArray_ = __webpack_require__(9);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/set"
var set_ = __webpack_require__(8);
var set_default = /*#__PURE__*/__webpack_require__.n(set_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/classCallCheck"
var classCallCheck_ = __webpack_require__(2);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/helpers/createClass"
var createClass_ = __webpack_require__(1);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/parse-int"
var parse_int_ = __webpack_require__(7);
var parse_int_default = /*#__PURE__*/__webpack_require__.n(parse_int_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/assign"
var assign_ = __webpack_require__(6);
var assign_default = /*#__PURE__*/__webpack_require__.n(assign_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/promise"
var promise_ = __webpack_require__(3);
var promise_default = /*#__PURE__*/__webpack_require__.n(promise_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/object/keys"
var keys_ = __webpack_require__(4);
var keys_default = /*#__PURE__*/__webpack_require__.n(keys_);

// EXTERNAL MODULE: external "@babel/runtime-corejs2/core-js/symbol"
var symbol_ = __webpack_require__(5);
var symbol_default = /*#__PURE__*/__webpack_require__.n(symbol_);

// EXTERNAL MODULE: external "@wikia/ad-engine"
var ad_engine_ = __webpack_require__(0);

// CONCATENATED MODULE: ./src/ad-services/bill-the-lizard/executor.ts




var logGroup = 'executor';
/**
 * Bill the Lizard methods executor
 */

var executor_Executor =
/*#__PURE__*/
function () {
  function Executor() {
    classCallCheck_default()(this, Executor);

    this.methods = {};
  }

  createClass_default()(Executor, [{
    key: "register",

    /**
     * Registeres new method
     * @param {string} name
     * @param {function} callback
     */
    value: function register(name, callback) {
      ad_engine_["utils"].logger(logGroup, "method ".concat(name, " registered"));
      this.methods[name] = callback;
    }
    /**
     * Executes method by name
     * @param {string} methodName
     * @param {ModelDefinition} model
     * @param {number|undefined} prediction
     */

  }, {
    key: "execute",
    value: function execute(methodName, model, prediction) {
      var callback = this.methods[methodName];

      if (typeof callback !== 'function') {
        throw Error("".concat(methodName, " is not executable"));
      }

      ad_engine_["utils"].logger(logGroup, "executing ".concat(methodName, " method"), model.name, prediction);
      callback(model, prediction);
    }
    /**
     * Executes all methods defined in given model based on service response
     * @param {ModelDefinition[]} models
     * @param {Object} response
     */

  }, {
    key: "executeMethods",
    value: function executeMethods(models, response) {
      var _this = this;

      keys_default()(response).forEach(function (modelName) {
        var result = response[modelName].result;
        var executableModel = models.find(function (model) {
          return model.name === modelName && model.executable;
        });

        if (!executableModel) {
          return;
        }

        var definedMethods = executableModel["on_".concat(result)];

        if (!definedMethods) {
          return;
        }

        definedMethods.forEach(function (methodName) {
          return _this.execute(methodName, executableModel, result);
        });
      });
    }
  }]);

  return Executor;
}();
// CONCATENATED MODULE: ./src/ad-services/bill-the-lizard/projects-handler.ts





var projects_handler_logGroup = 'project-handler';
/**
 * Bill the Lizard projects handler
 */

var projects_handler_ProjectsHandler =
/*#__PURE__*/
function () {
  function ProjectsHandler() {
    classCallCheck_default()(this, ProjectsHandler);

    this.projects = {};
  }

  createClass_default()(ProjectsHandler, [{
    key: "enable",

    /**
     * Enables project by name
     * @param {string} name
     */
    value: function enable(name) {
      ad_engine_["utils"].logger(projects_handler_logGroup, "project ".concat(name, " enabled"));
      this.projects[name] = true;
    }
    /**
     * Checks whether project is enabled
     * @param {string} name
     * @returns {boolean}
     */

  }, {
    key: "isEnabled",
    value: function isEnabled(name) {
      return !!this.projects[name];
    }
    /**
     * Returns all geo-enabled models' definitions based on enabled projects
     * @param {string[]} projectNames
     * @returns {{models: ModelDefinition[], parameters: Object}}
     */

  }, {
    key: "getEnabledModelsWithParams",
    value: function getEnabledModelsWithParams(projectNames) {
      var _this = this;

      var projects = ad_engine_["context"].get('services.billTheLizard.projects');
      var projectParameters = ad_engine_["context"].get('services.billTheLizard.parameters');

      var enabledProjectNames = keys_default()(projects).filter(function (name) {
        return _this.isEnabled(name) && projectNames.includes(name);
      });

      var models = [];
      var parameters = {};
      enabledProjectNames.forEach(function (name) {
        // Only first enabled model in project is executable
        var isNextModelExecutable = true;
        projects[name].forEach(function (model) {
          if (ad_engine_["utils"].isProperGeo(model.countries, model.name)) {
            model.executable = isNextModelExecutable;
            isNextModelExecutable = false;
            models.push(model);

            assign_default()(parameters, projectParameters[name]);
          } else {
            model.executable = false;
          }
        });
      });
      return {
        models: models,
        parameters: parameters
      };
    }
  }]);

  return ProjectsHandler;
}();
// CONCATENATED MODULE: ./src/ad-services/bill-the-lizard/index.ts














/**
 * @typedef {Object} ModelDefinition
 * @property {boolean|undefined} executable
 * @property {string[]} countries
 * @property {string} name
 * @property {function} on_*
 */

/**
 * @typedef {Object} PredictionDefinition
 * @property {string} modelName
 * @property {result} number
 * @property {(number|string)} callId
 */

var bill_the_lizard_logGroup = 'bill-the-lizard';
var openRequests = [];
var events = {
  BILL_THE_LIZARD_REQUEST: symbol_default()('BILL_THE_LIZARD_REQUEST'),
  BILL_THE_LIZARD_RESPONSE: symbol_default()('BILL_THE_LIZARD_RESPONSE')
};
/**
 * Builds query parameters for url
 * @param {Object} queryParameters (key-value pairs for query parameters)
 * @returns {string}
 */

function buildQueryUrl(queryParameters) {
  var params = [];

  keys_default()(queryParameters).forEach(function (key) {
    params.push("".concat(key, "=").concat(queryParameters[key]));
  });

  return encodeURI(params.join('&'));
}
/**
 * Builds endpoint url
 * @param {string} host
 * @param {string} endpoint
 * @param {string} query
 * @returns {string}
 */


function buildUrl(host, endpoint, query) {
  return "".concat(host, "/").concat(endpoint, "?").concat(query);
}
/**
 * Requests service
 * @param {string} host
 * @param {string} endpoint
 * @param {Object} queryParameters (key-value pairs for query parameters)
 * @param {number} timeout
 * @param {number|string} callId
 * @returns {Promise}
 */


function httpRequest(host, endpoint) {
  var queryParameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var timeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var callId = arguments.length > 4 ? arguments[4] : undefined;
  var request = new window.XMLHttpRequest();
  var query = buildQueryUrl(queryParameters);
  var url = buildUrl(host, endpoint, query);
  ad_engine_["eventService"].emit(events.BILL_THE_LIZARD_REQUEST, {
    query: query,
    callId: callId
  });
  request.open('GET', url, true);
  request.responseType = 'json';
  request.timeout = timeout;
  openRequests.push(request);
  ad_engine_["utils"].logger(bill_the_lizard_logGroup, 'timeout configured to', request.timeout);
  return new promise_default.a(function (resolve, reject) {
    request.addEventListener('timeout', function () {
      reject(new Error('timeout'));
      ad_engine_["utils"].logger(bill_the_lizard_logGroup, 'timed out');
    });
    request.addEventListener('error', function () {
      reject(new Error('error'));
      ad_engine_["utils"].logger(bill_the_lizard_logGroup, 'errored');
    });

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        ad_engine_["utils"].logger(bill_the_lizard_logGroup, 'has response');
        resolve(this.response);
      }
    };

    request.send();
  });
}
/**
 * Builds key-value pairs for query parameters
 * @param {ModelDefinition[]} models
 * @param {Object} parameters (key-value pairs)
 * @returns {Object}
 */


function getQueryParameters(models, parameters) {
  var now = new Date();
  var day = now.getDay() - 1;
  return assign_default()({}, {
    models: models.map(function (model) {
      return model.name;
    }),
    h: now.getHours(),
    dow: day === -1 ? 6 : day
  }, parameters);
}
/**
 * Overrides predictions based on response
 * @param {Object} response
 * @returns {Object}
 */


function overridePredictions(response) {
  keys_default()(response).forEach(function (name) {
    var newValue = ad_engine_["utils"].queryString.get("bill.".concat(name));

    if (newValue) {
      response[name].result = parse_int_default()(newValue, 10);
    }
  });

  return response;
}
/**
 * Bill the Lizard service handler
 */


var bill_the_lizard_BillTheLizard =
/*#__PURE__*/
function () {
  function BillTheLizard() {
    classCallCheck_default()(this, BillTheLizard);

    this.executor = new executor_Executor();
    this.projectsHandler = new projects_handler_ProjectsHandler();
    this.targetedModelNames = new set_default.a();
    this.callCounter = 0;
    this.predictions = [];
    this.statuses = {};
  }

  createClass_default()(BillTheLizard, [{
    key: "reset",
    value: function reset() {
      this.callCounter = 0;
      this.predictions = [];
      this.statuses = {};
      openRequests.forEach(function (req) {
        return req.abort();
      });
      openRequests = [];
      ad_engine_["context"].remove('targeting.btl');
    }
    /**
     * Requests service, executes defined methods and parses response
     *
     * Supply callKey if you need to access status for this specific request.
     * DO NOT use an integer as callKey as it's the default value.
     * Good key example: "incontent_boxad1".
     *
     * @param {string[]} projectNames
     * @param {string} callId key for this call
     * @returns {Promise}
     */

  }, {
    key: "call",
    value: function call(projectNames, callId) {
      var _this = this;

      if (!ad_engine_["context"].get('services.billTheLizard.enabled')) {
        ad_engine_["utils"].logger(bill_the_lizard_logGroup, 'disabled');
        return new promise_default.a(function (resolve, reject) {
          return reject(new Error('Disabled'));
        });
      }

      if (!callId) {
        this.callCounter += 1;
        callId = this.callCounter;
      }

      var host = ad_engine_["context"].get('services.billTheLizard.host');
      var endpoint = ad_engine_["context"].get('services.billTheLizard.endpoint');
      var timeout = ad_engine_["context"].get('services.billTheLizard.timeout');

      var _this$projectsHandler = this.projectsHandler.getEnabledModelsWithParams(projectNames),
          models = _this$projectsHandler.models,
          parameters = _this$projectsHandler.parameters;

      if (!models || models.length < 1) {
        ad_engine_["utils"].logger(bill_the_lizard_logGroup, 'no models to predict');
        this.statuses[callId] = BillTheLizard.NOT_USED;
        return promise_default.a.resolve({});
      } // update names of GAM targeted models


      models.filter(function (model) {
        return model.dfp_targeting;
      }).forEach(function (model) {
        return _this.targetedModelNames.add(model.name);
      });
      var queryParameters = getQueryParameters(models, parameters);
      ad_engine_["utils"].logger(bill_the_lizard_logGroup, 'calling service', host, endpoint, queryParameters, "callId: ".concat(callId));
      this.statuses[callId] = BillTheLizard.TOO_LATE;
      return httpRequest(host, endpoint, queryParameters, timeout, callId).catch(function (error) {
        if (error.message === 'timeout') {
          _this.statuses[callId] = BillTheLizard.TIMEOUT;
        } else {
          _this.statuses[callId] = BillTheLizard.FAILURE;
        }

        return promise_default.a.reject(error);
      }).then(function (response) {
        return overridePredictions(response);
      }).then(function (response) {
        var _this$predictions;

        ad_engine_["utils"].logger(bill_the_lizard_logGroup, 'service response OK', "callId: ".concat(callId));
        _this.statuses[callId] = BillTheLizard.ON_TIME;

        var modelToResultMap = _this.getModelToResultMap(response);

        ad_engine_["utils"].logger(bill_the_lizard_logGroup, 'predictions', modelToResultMap, "callId: ".concat(callId));

        var predictions = _this.buildPredictions(models, modelToResultMap, callId);

        (_this$predictions = _this.predictions).push.apply(_this$predictions, toConsumableArray_default()(predictions));

        _this.setTargeting();

        ad_engine_["eventService"].emit(events.BILL_THE_LIZARD_RESPONSE, {
          callId: callId,
          response: _this.serialize(callId)
        });

        _this.executor.executeMethods(models, response);

        return modelToResultMap;
      }).catch(function (error) {
        ad_engine_["utils"].logger(bill_the_lizard_logGroup, 'service response', error.message, "callId: ".concat(callId));
        return {};
      });
    }
    /**
     *
     * @param {ModelDefinition[]} models
     * @param {Object.<string, number>} modelToResultMap
     * @param {number|string} callId
     * @returns {PredictionDefinition[]}
     */

  }, {
    key: "buildPredictions",
    value: function buildPredictions(models, modelToResultMap, callId) {
      return models.map(function (model) {
        return model.name;
      }).filter(function (modelName) {
        return modelToResultMap[modelName] !== undefined;
      }).map(function (modelName) {
        return {
          modelName: modelName,
          callId: callId,
          result: modelToResultMap[modelName]
        };
      });
    }
    /**
     * Converts response to predictions
     * @param {Object} response
     * @returns {PredictionDefinition}
     */

  }, {
    key: "getModelToResultMap",
    value: function getModelToResultMap(response) {
      var modelToResultMap = {};

      keys_default()(response).forEach(function (modelName) {
        var result = response[modelName].result;

        if (typeof result !== 'undefined') {
          modelToResultMap[modelName] = result;
        }
      });

      return modelToResultMap;
    }
    /**
     * Sets DFP targeting in context.
     *
     * @returns string
     */

  }, {
    key: "setTargeting",
    value: function setTargeting() {
      var targeting = this.getTargeting();

      if (keys_default()(targeting).length > 0) {
        var serializedTargeting = entries_default()(targeting).map(function (_ref) {
          var _ref2 = slicedToArray_default()(_ref, 2),
              modelName = _ref2[0],
              result = _ref2[1];

          return "".concat(modelName, "_").concat(result);
        });

        ad_engine_["context"].set('targeting.btl', serializedTargeting);
        return serializedTargeting;
      }

      return '';
    }
    /**
     * Returns map of targeted models to their results.
     *
     * For each model, it takes the latest result.
     *
     * @returns {Object.<string, number>}
     */

  }, {
    key: "getTargeting",
    value: function getTargeting() {
      var _this2 = this;

      var latestResults = {};
      this.predictions.filter(function (pred) {
        return _this2.targetedModelNames.has(pred.modelName);
      }).forEach(function (pred) {
        latestResults[pred.modelName] = pred.result;
      });
      return latestResults;
    }
    /**
     * Get prediction by modelName and callId.
     *
     * @param {string} modelName
     * @param {(number|string)} callId
     * @returns {PredictionDefinition}
     */

  }, {
    key: "getPrediction",
    value: function getPrediction(modelName, callId) {
      return this.getPredictions(modelName).find(function (pred) {
        return pred.callId === callId;
      });
    }
    /**
     * Returns predictions optionally filtered by model name.
     *
     * If model name is given, it returns all predictions with models matching.
     * Model matches when raw name (without version) is matched.
     *
     * @param {string} [modelName]
     * @returns {PredictionDefinition[]}
     */

  }, {
    key: "getPredictions",
    value: function getPredictions(modelName) {
      var separator = ':';

      if (modelName) {
        return this.predictions.filter(function (pred) {
          return pred.modelName.split(separator)[0] === modelName.split(separator)[0];
        });
      }

      return this.predictions;
    }
    /**
     * Returns response status (one of: failure, not_used, on_time, timeout, too_late or undefined);
     *
     * If callId is not supplied, the latest response without a specific key is returned.
     *
     * @param {number|string} [callId] value passed as key for call
     * @returns {string}
     */

  }, {
    key: "getResponseStatus",
    value: function getResponseStatus(callId) {
      callId = callId || this.callCounter;
      return this.statuses[callId];
    }
    /**
     * Serializes all predictions
     * @param {number|string} [callId]
     * @returns {string}
     */

  }, {
    key: "serialize",
    value: function serialize(callId) {
      var predictions = this.predictions;

      if (callId !== undefined) {
        predictions = predictions.filter(function (pred) {
          return pred.callId === callId;
        });
      }

      return predictions.map(function (pred) {
        return "".concat(pred.modelName, "|").concat(pred.callId, "=").concat(pred.result);
      }).join(',');
    }
    /**
     * Get prediction of previous calls.
     *
     * Uses a supplied callIdBuilder to construct callId
     * by iterating down from startId to 2.
     *
     * @param {number} startId
     * @param {function} callIdBuilder
     * @param {string} modelName
     * @returns {number | undefined}
     */

  }, {
    key: "getPreviousPrediction",
    value: function getPreviousPrediction(startId, callIdBuilder, modelName) {
      if (startId <= 1) {
        return undefined;
      }

      for (var backCounter = startId - 1; backCounter >= 1; backCounter--) {
        var _callId = callIdBuilder(backCounter);

        var prevStatus = this.getResponseStatus(_callId);

        if (prevStatus === BillTheLizard.ON_TIME || prevStatus === BillTheLizard.TOO_LATE) {
          return this.getPrediction(modelName, _callId);
        }
      }

      return undefined;
    }
  }]);

  return BillTheLizard;
}();
bill_the_lizard_BillTheLizard.FAILURE = 'failure';
bill_the_lizard_BillTheLizard.NOT_USED = 'not_used';
bill_the_lizard_BillTheLizard.ON_TIME = 'on_time';
bill_the_lizard_BillTheLizard.TIMEOUT = 'timeout';
bill_the_lizard_BillTheLizard.TOO_LATE = 'too_late';
bill_the_lizard_BillTheLizard.REUSED = 'reused';
var billTheLizard = new bill_the_lizard_BillTheLizard();
// CONCATENATED MODULE: ./src/ad-services/confiant/index.ts




var confiant_logGroup = 'confiant';
var scriptDomain = 'clarium.global.ssl.fastly.net';
/**
 * Injects Confiant script
 * @returns {Promise}
 */

function loadScript() {
  var confiantLibraryUrl = "//".concat(scriptDomain, "/gpt/a/wrap.js");
  return ad_engine_["utils"].scriptLoader.loadScript(confiantLibraryUrl, 'text/javascript', true, 'first');
}
/**
 * Confiant service handler
 */


var confiant_Confiant =
/*#__PURE__*/
function () {
  function Confiant() {
    classCallCheck_default()(this, Confiant);
  }

  createClass_default()(Confiant, [{
    key: "call",

    /**
     * Requests service and injects script tag
     * @returns {Promise}
     */
    value: function call() {
      var propertyId = ad_engine_["context"].get('services.confiant.propertyId');
      var mapping = ad_engine_["context"].get('services.confiant.mapping');
      var activation = ad_engine_["context"].get('services.confiant.activation');

      if (!ad_engine_["context"].get('services.confiant.enabled') || !propertyId || !mapping || !activation) {
        ad_engine_["utils"].logger(confiant_logGroup, 'disabled');
        return promise_default.a.resolve();
      }

      ad_engine_["utils"].logger(confiant_logGroup, 'loading'); // eslint-disable-next-line  no-underscore-dangle

      window._clrm = window._clrm || {}; // eslint-disable-next-line  no-underscore-dangle

      window._clrm.gpt = {
        propertyId: propertyId,
        confiantCdn: scriptDomain,
        sandbox: 0,
        mapping: mapping,
        activation: activation,
        callback: function callback() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          ad_engine_["utils"].logger(confiant_logGroup, args);
        }
      };
      return loadScript().then(function () {
        ad_engine_["utils"].logger(confiant_logGroup, 'ready');
      });
    }
  }]);

  return Confiant;
}();

var confiant = new confiant_Confiant();
// CONCATENATED MODULE: ./src/ad-services/geo-edge/index.ts




var geo_edge_logGroup = 'geo-edge';
var scriptDomainId = 'd3b02estmut877';
/**
 * Injects Geo Edge Site Side Protection script
 * @returns {Promise}
 */

function geo_edge_loadScript() {
  var geoEdgeLibraryUrl = "//".concat(scriptDomainId, ".cloudfront.net/grumi-ip.js");
  return ad_engine_["utils"].scriptLoader.loadScript(geoEdgeLibraryUrl, 'text/javascript', true, 'first');
}
/**
 * GeoEdge service handler
 */


var geo_edge_GeoEdge =
/*#__PURE__*/
function () {
  function GeoEdge() {
    classCallCheck_default()(this, GeoEdge);
  }

  createClass_default()(GeoEdge, [{
    key: "call",

    /**
     * Requests service and injects script tag
     * @returns {Promise}
     */
    value: function call() {
      var geoEdgeKey = ad_engine_["context"].get('services.geoEdge.id');
      var geoEdgeConfig = ad_engine_["context"].get('services.geoEdge.config');

      if (!ad_engine_["context"].get('services.geoEdge.enabled') || !geoEdgeKey) {
        ad_engine_["utils"].logger(geo_edge_logGroup, 'disabled');
        return promise_default.a.resolve();
      }

      ad_engine_["utils"].logger(geo_edge_logGroup, 'loading');
      window.grumi = {
        cfg: geoEdgeConfig,
        key: geoEdgeKey
      };
      return geo_edge_loadScript().then(function () {
        ad_engine_["utils"].logger(geo_edge_logGroup, 'ready');
      });
    }
  }]);

  return GeoEdge;
}();

var geoEdge = new geo_edge_GeoEdge();
// CONCATENATED MODULE: ./src/ad-services/krux/index.ts





var krux_logGroup = 'krux';
/**
 * Injects Krux script
 * @returns {Promise}
 */

function krux_loadScript() {
  var kruxId = ad_engine_["context"].get('services.krux.id');
  var kruxLibraryUrl = "//cdn.krxd.net/controltag?confid=".concat(kruxId);
  return ad_engine_["utils"].scriptLoader.loadScript(kruxLibraryUrl, 'text/javascript', true, 'first', {
    id: 'krux-control-tag'
  });
}
/**
 * Gets Krux data from localStorage
 * @param {string} key
 * @returns {string}
 */


function getKruxData(key) {
  if (window.localStorage) {
    return window.localStorage[key];
  }

  if (window.navigator.cookieEnabled) {
    var match = document.cookie.match("".concat(key, "=([^;]*)"));
    return match && decodeURI(match[1]) || '';
  }

  return '';
}

window.Krux = window.Krux || function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  window.Krux.q.push(args);
};

window.Krux.q = window.Krux.q || [];
/**
 * Krux service handler
 */

var krux_Krux =
/*#__PURE__*/
function () {
  function Krux() {
    classCallCheck_default()(this, Krux);
  }

  createClass_default()(Krux, [{
    key: "call",

    /**
     * Requests service, saves user id and segments in context and exports page level params
     * @returns {Promise}
     */
    value: function call() {
      var _this = this;

      if (!ad_engine_["context"].get('services.krux.enabled') || !ad_engine_["context"].get('options.trackingOptIn')) {
        ad_engine_["utils"].logger(krux_logGroup, 'disabled');
        return promise_default.a.resolve();
      }

      ad_engine_["utils"].logger(krux_logGroup, 'loading');
      return krux_loadScript().then(function () {
        _this.exportPageParams();

        _this.importUserData();
      });
    }
    /**
     * Export page level params to Krux
     * @returns {void}
     */

  }, {
    key: "exportPageParams",
    value: function exportPageParams() {
      keys_default()(ad_engine_["context"].get('targeting')).forEach(function (key) {
        var value = ad_engine_["context"].get("targeting.".concat(key));

        if (value) {
          window["kruxDartParam_".concat(key)] = value;
        }
      });
    }
    /**
     * Imports Krux data from localStorage
     * @returns {void}
     */

  }, {
    key: "importUserData",
    value: function importUserData() {
      var user = getKruxData('kxuser') || getKruxData('kxwikia_user');
      var segments = getKruxData('kxsegs') || getKruxData('kxwikia_segs');
      ad_engine_["context"].set('targeting.kuid', user || null);
      ad_engine_["context"].set('targeting.ksg', segments ? segments.split(',') : []);
      ad_engine_["utils"].logger(krux_logGroup, 'data set', user, segments);
    }
    /**
     * Returns Krux user ID
     * @returns {string}
     */

  }, {
    key: "getUserId",
    value: function getUserId() {
      return ad_engine_["context"].get('targeting.kuid') || null;
    }
    /**
     * Returns Krux segments
     * @returns {string[]}
     */

  }, {
    key: "getSegments",
    value: function getSegments() {
      return ad_engine_["context"].get('targeting.ksg') || [];
    }
  }]);

  return Krux;
}();

var krux = new krux_Krux();
// CONCATENATED MODULE: ./src/ad-services/moat-yi/index.ts





var moat_yi_logGroup = 'moat-yi';
var moat_yi_events = {
  MOAT_YI_READY: symbol_default()('MOAT_YI_READY')
};
/**
 * Injects MOAT YI script
 * @returns {Promise}
 */

function moat_yi_loadScript() {
  var partnerCode = ad_engine_["context"].get('services.moatYi.partnerCode');
  var url = "//z.moatads.com/".concat(partnerCode, "/yi.js");
  return ad_engine_["utils"].scriptLoader.loadScript(url, 'text/javascript', true, 'first');
}
/**
 * MOAT YI service handler
 */


var moat_yi_MoatYi =
/*#__PURE__*/
function () {
  function MoatYi() {
    classCallCheck_default()(this, MoatYi);
  }

  createClass_default()(MoatYi, [{
    key: "call",

    /**
     * Requests MOAT YI service and saves page level data in targeting
     * @returns {Promise}
     */
    value: function call() {
      var _this = this;

      if (!ad_engine_["context"].get('services.moatYi.enabled') || !ad_engine_["context"].get('services.moatYi.partnerCode')) {
        ad_engine_["utils"].logger(moat_yi_logGroup, 'disabled');
        return promise_default.a.resolve();
      }

      var moatYeildReadyResolve;
      var promise = new promise_default.a(function (resolve) {
        moatYeildReadyResolve = resolve;
      });
      ad_engine_["utils"].logger(moat_yi_logGroup, 'loading');

      window.moatYieldReady = function () {
        _this.importPageParams();

        moatYeildReadyResolve();
      };

      ad_engine_["context"].set('targeting.m_data', 'waiting');
      moat_yi_loadScript().then(function () {
        ad_engine_["utils"].logger(moat_yi_logGroup, 'ready');
      });
      return promise;
    }
    /**
     * Adds page params to targeting
     * @returns {void}
     */

  }, {
    key: "importPageParams",
    value: function importPageParams() {
      if (window.moatPrebidApi && typeof window.moatPrebidApi.getMoatTargetingForPage === 'function') {
        var pageParams = window.moatPrebidApi.getMoatTargetingForPage() || {};
        ad_engine_["context"].set('targeting.m_data', pageParams.m_data);
        ad_engine_["eventService"].emit(moat_yi_events.MOAT_YI_READY, "m_data=".concat(pageParams.m_data));
        ad_engine_["utils"].logger(moat_yi_logGroup, 'moatYieldReady', pageParams);
      }
    }
  }]);

  return MoatYi;
}();

var moatYi = new moat_yi_MoatYi();
// CONCATENATED MODULE: ./src/ad-services/nielsen/static-queue-script.js
// NIELSEN CODE START
// eslint-disable-next-line
function initNielsenStaticQueue() {
  !function (t, n) {
    t[n] = t[n] || {
      nlsQ: function nlsQ(e, o, c, r, s, i) {
        return s = t.document, r = s.createElement("script"), r.async = 1, r.src = ("http:" === t.location.protocol ? "http:" : "https:") + "//cdn-gl.imrworldwide.com/conf/" + e + ".js#name=" + o + "&ns=" + n, i = s.getElementsByTagName("script")[0], i.parentNode.insertBefore(r, i), t[n][o] = t[n][o] || {
          g: c || {},
          ggPM: function ggPM(e, c, r, s, i) {
            (t[n][o].q = t[n][o].q || []).push([e, c, r, s, i]);
          }
        }, t[n][o];
      }
    };
  }(window, "NOLBUNDLE");
} // NIELSEN CODE END
// CONCATENATED MODULE: ./src/ad-services/nielsen/index.ts



/* global NOLBUNDLE */


var nielsen_logGroup = 'nielsen-dcr';
var nlsnConfig = {};
/**
 * Creates Nielsen Static Queue Snippet
 */

function createInstance(nielsenKey) {
  ad_engine_["utils"].logger(nielsen_logGroup, 'loading');
  initNielsenStaticQueue();
  return NOLBUNDLE.nlsQ(nielsenKey, 'nlsnInstance', nlsnConfig);
}
/**
 * Nielsen service handler
 */


var nielsen_Nielsen =
/*#__PURE__*/
function () {
  /**
   * Class constructor
   */
  function Nielsen() {
    classCallCheck_default()(this, Nielsen);

    this.nlsnInstance = null;

    if (ad_engine_["utils"].queryString.get('nielsen-dcr-debug') === '1') {
      nlsnConfig.nol_sdkDebug = 'debug';
    }
  }
  /**
   * Create Nielsen Static Queue and make a call
   * @param {Object} nielsenMetadata
   * @returns {Object}
   */


  createClass_default()(Nielsen, [{
    key: "call",
    value: function call(nielsenMetadata) {
      var nielsenKey = ad_engine_["context"].get('services.nielsen.appId');

      if (!ad_engine_["context"].get('services.nielsen.enabled') || !nielsenKey) {
        ad_engine_["utils"].logger(nielsen_logGroup, 'disabled');
        return null;
      }

      if (!this.nlsnInstance) {
        this.nlsnInstance = createInstance(nielsenKey);
      }

      ad_engine_["utils"].logger(nielsen_logGroup, 'ready');
      this.nlsnInstance.ggPM('staticstart', nielsenMetadata);
      ad_engine_["utils"].logger(nielsen_logGroup, 'called', nielsenMetadata);
      return this.nlsnInstance;
    }
  }]);

  return Nielsen;
}();

var nielsen = new nielsen_Nielsen();
// CONCATENATED MODULE: ./src/ad-services/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "billTheLizard", function() { return billTheLizard; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "BillTheLizard", function() { return bill_the_lizard_BillTheLizard; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "billTheLizardEvents", function() { return events; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "confiant", function() { return confiant; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "geoEdge", function() { return geoEdge; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "krux", function() { return krux; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "moatYi", function() { return moatYi; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "moatYiEvents", function() { return moat_yi_events; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "nielsen", function() { return nielsen; });







/***/ })
/******/ ]);
//# sourceMappingURL=ad-services.js.map