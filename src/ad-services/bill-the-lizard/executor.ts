import { utils } from '@ad-engine/core';

const logGroup = 'executor';

/**
 * Bill the Lizard methods executor
 */
export class Executor {
	methods = {};

	/**
	 * Registeres new method
	 * @param {string} name
	 * @param {function} callback
	 */
	register(name, callback) {
		utils.logger(logGroup, `method ${name} registered`);
		this.methods[name] = callback;
	}

	/**
	 * Executes method by name
	 * @param {string} methodName
	 * @param {ModelDefinition} model
	 * @param {number|undefined} prediction
	 */
	execute(methodName, model, prediction) {
		const callback = this.methods[methodName];

		if (typeof callback !== 'function') {
			throw Error(`${methodName} is not executable`);
		}

		utils.logger(logGroup, `executing ${methodName} method`, model.name, prediction);
		callback(model, prediction);
	}

	/**
	 * Executes all methods defined in given model based on service response
	 * @param {ModelDefinition[]} models
	 * @param {Object} response
	 */
	executeMethods(models, response) {
		Object.keys(response).forEach((modelName) => {
			const { result } = response[modelName];

			const executableModel = models.find((model) => model.name === modelName && model.executable);

			if (!executableModel) {
				return;
			}

			const definedMethods = executableModel[`on_${result}`];

			if (!definedMethods) {
				return;
			}

			definedMethods.forEach((methodName) => this.execute(methodName, executableModel, result));
		});
	}
}
