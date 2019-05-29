import { context, utils } from '@wikia/ad-engine';
import { get } from 'lodash';

const logGroup = 'instant-config';
const instantGlobalsQueryParamPrefix = 'InstantGlobals';

type ConfigValue = boolean | string | string[] | number | number[] | object | null;
interface Config {
	[key: string]: ConfigValue;
}

export const overrideInstantConfig = (config: Config): Config => {
	const newConfig = {};
	const queryParams = utils.queryString.getValues();

	Object.keys(queryParams)
		.filter((instantGlobalKey: string) => {
			return instantGlobalKey.indexOf(instantGlobalsQueryParamPrefix) === 0;
		})
		.map((instantGlobalKey) => {
			const [, key] = instantGlobalKey.split('.');

			return {
				instantGlobalKey,
				key,
			};
		})
		.forEach(({ instantGlobalKey, key }) => {
			newConfig[key] = utils.queryString.parseValue(queryParams[instantGlobalKey]);
		});

	return { ...config, ...newConfig };
};

/**
 * InstantConfig service
 */
class InstantConfig {
	config: Config = null;

	async get(variableName: string, defaultValue: ConfigValue = null): Promise<ConfigValue> {
		const config = await this.getConfig();

		if (typeof config[variableName] === 'undefined') {
			return defaultValue;
		}

		return config[variableName];
	}

	async getConfig(): Promise<Config> {
		if (!this.config) {
			this.config = await this.fetchInstantConfig();
		}

		return this.config;
	}

	private fetchInstantConfig(): Promise<Config> {
		const request = new XMLHttpRequest();
		const url = context.get('services.instantConfig.endpoint');
		const fallbackConfigKey =
			context.get('services.instantConfig.fallbackConfigKey') || 'fallbackInstantConfig';
		const fallbackConfig = get(window, fallbackConfigKey, {});

		request.open('GET', url, true);
		request.responseType = 'json';

		return new Promise((resolve) => {
			request.addEventListener('timeout', () => {
				resolve(fallbackConfig);
				utils.logger(logGroup, 'timed out');
			});
			request.addEventListener('error', () => {
				resolve(fallbackConfig);
				utils.logger(logGroup, 'errored');
			});
			request.onreadystatechange = function () {
				if (this.readyState === 4) {
					if (this.status === 200) {
						utils.logger(logGroup, 'has response', this.response);
						resolve(this.response);
					} else {
						utils.logger(logGroup, 'did not respond successfully', this.response);
						resolve(fallbackConfig);
					}
				}
			};
			request.send();
		}).then(overrideInstantConfig);
	}
}

export const instantConfig = new InstantConfig();
