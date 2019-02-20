import { context, events, utils } from '@wikia/ad-engine';
import { Executor } from './executor';
import { ProjectsHandler } from './projects-handler';

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

const logGroup = 'bill-the-lizard';
let openRequests = [];

/**
 * Builds query parameters for url
 * @param {Object} queryParameters (key-value pairs for query parameters)
 * @returns {string}
 */
function buildQueryUrl(queryParameters) {
	const params = [];

	Object.keys(queryParameters).forEach((key) => {
		params.push(`${key}=${queryParameters[key]}`);
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
	return `${host}/${endpoint}?${query}`;
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
function httpRequest(host, endpoint, queryParameters = {}, timeout = 0, callId) {
	const request = new window.XMLHttpRequest();
	const query = buildQueryUrl(queryParameters);
	const url = buildUrl(host, endpoint, query);

	events.emit(events.BILL_THE_LIZARD_REQUEST, {
		query,
		callId,
	});

	request.open('GET', url, true);
	request.responseType = 'json';
	request.timeout = timeout;

	openRequests.push(request);

	utils.logger(logGroup, 'timeout configured to', request.timeout);

	return new Promise((resolve, reject) => {
		request.addEventListener('timeout', () => {
			reject(new Error('timeout'));
			utils.logger(logGroup, 'timed out');
		});
		request.addEventListener('error', () => {
			reject(new Error('error'));
			utils.logger(logGroup, 'errored');
		});
		request.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				utils.logger(logGroup, 'has response');
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
	const now = new Date();
	const day = now.getDay() - 1;

	return Object.assign(
		{},
		{
			models: models.map((model) => model.name),
			h: now.getHours(),
			dow: day === -1 ? 6 : day,
		},
		parameters,
	);
}

/**
 * Overrides predictions based on response
 * @param {Object} response
 * @returns {Object}
 */
function overridePredictions(response) {
	Object.keys(response).forEach((name) => {
		const newValue = utils.queryString.get(`bill.${name}`);

		if (newValue) {
			response[name].result = parseInt(newValue, 10);
		}
	});

	return response;
}

/**
 * Bill the Lizard service handler
 */
export class BillTheLizard {
	static FAILURE = 'failure';
	static NOT_USED = 'not_used';
	static ON_TIME = 'on_time';
	static TIMEOUT = 'timeout';
	static TOO_LATE = 'too_late';
	static REUSED = 'reused';

	constructor() {
		this.executor = new Executor();
		this.projectsHandler = new ProjectsHandler();
		this.targetedModelNames = new Set();

		this.callCounter = 0;
		this.predictions = [];
		this.statuses = {};
	}

	reset() {
		this.callCounter = 0;
		this.predictions = [];
		this.statuses = {};

		openRequests.forEach((req) => req.abort());
		openRequests = [];
		context.remove('targeting.btl');
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
	call(projectNames, callId) {
		if (!context.get('services.billTheLizard.enabled')) {
			utils.logger(logGroup, 'disabled');

			return new Promise((resolve, reject) => reject(new Error('Disabled')));
		}

		if (!callId) {
			this.callCounter += 1;
			callId = this.callCounter;
		}

		const host = context.get('services.billTheLizard.host');
		const endpoint = context.get('services.billTheLizard.endpoint');
		const timeout = context.get('services.billTheLizard.timeout');
		const { models, parameters } = this.projectsHandler.getEnabledModelsWithParams(projectNames);

		if (!models || models.length < 1) {
			utils.logger(logGroup, 'no models to predict');
			this.statuses[callId] = BillTheLizard.NOT_USED;

			return Promise.resolve({});
		}

		// update names of GAM targeted models
		models
			.filter((model) => model.dfp_targeting)
			.forEach((model) => this.targetedModelNames.add(model.name));

		const queryParameters = getQueryParameters(models, parameters);

		utils.logger(logGroup, 'calling service', host, endpoint, queryParameters, `callId: ${callId}`);

		this.statuses[callId] = BillTheLizard.TOO_LATE;

		return httpRequest(host, endpoint, queryParameters, timeout, callId)
			.catch((error) => {
				if (error.message === 'timeout') {
					this.statuses[callId] = BillTheLizard.TIMEOUT;
				} else {
					this.statuses[callId] = BillTheLizard.FAILURE;
				}

				return Promise.reject(error);
			})
			.then((response) => overridePredictions(response))
			.then((response) => {
				utils.logger(logGroup, 'service response OK', `callId: ${callId}`);

				this.statuses[callId] = BillTheLizard.ON_TIME;

				const modelToResultMap = this.getModelToResultMap(response);

				utils.logger(logGroup, 'predictions', modelToResultMap, `callId: ${callId}`);

				const predictions = this.buildPredictions(models, modelToResultMap, callId);

				this.predictions.push(...predictions);

				this.setTargeting();

				events.emit(events.BILL_THE_LIZARD_RESPONSE, {
					callId,
					response: this.serialize(callId),
				});

				this.executor.executeMethods(models, response);

				return modelToResultMap;
			})
			.catch((error) => {
				utils.logger(logGroup, 'service response', error.message, `callId: ${callId}`);

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
	buildPredictions(models, modelToResultMap, callId) {
		return models
			.map((model) => model.name)
			.filter((modelName) => modelToResultMap[modelName] !== undefined)
			.map((modelName) => ({ modelName, callId, result: modelToResultMap[modelName] }));
	}

	/**
	 * Converts response to predictions
	 * @param {Object} response
	 * @returns {PredictionDefinition}
	 */
	getModelToResultMap(response) {
		const modelToResultMap = {};

		Object.keys(response).forEach((modelName) => {
			const { result } = response[modelName];

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
	setTargeting() {
		const targeting = this.getTargeting();

		if (Object.keys(targeting).length > 0) {
			const serializedTargeting = Object.entries(targeting).map(
				([modelName, result]) => `${modelName}_${result}`,
			);

			context.set('targeting.btl', serializedTargeting);

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
	getTargeting() {
		const latestResults = {};

		this.predictions
			.filter((pred) => this.targetedModelNames.has(pred.modelName))
			.forEach((pred) => {
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
	getPrediction(modelName, callId) {
		return this.getPredictions(modelName).find((pred) => pred.callId === callId);
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
	getPredictions(modelName) {
		const separator = ':';

		if (modelName) {
			return this.predictions.filter(
				(pred) => pred.modelName.split(separator)[0] === modelName.split(separator)[0],
			);
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
	getResponseStatus(callId) {
		callId = callId || this.callCounter;

		return this.statuses[callId];
	}

	/**
	 * Serializes all predictions
	 * @param {number|string} [callId]
	 * @returns {string}
	 */
	serialize(callId) {
		let { predictions } = this;

		if (callId !== undefined) {
			predictions = predictions.filter((pred) => pred.callId === callId);
		}

		return predictions.map((pred) => `${pred.modelName}|${pred.callId}=${pred.result}`).join(',');
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
	getPreviousPrediction(startId, callIdBuilder, modelName) {
		if (startId <= 1) {
			return undefined;
		}
		for (let backCounter = startId - 1; backCounter >= 1; backCounter--) {
			const callId = callIdBuilder(backCounter);
			const prevStatus = this.getResponseStatus(callId);

			if (prevStatus === BillTheLizard.ON_TIME || prevStatus === BillTheLizard.TOO_LATE) {
				return this.getPrediction(modelName, callId);
			}
		}

		return undefined;
	}
}

export const billTheLizard = new BillTheLizard();
