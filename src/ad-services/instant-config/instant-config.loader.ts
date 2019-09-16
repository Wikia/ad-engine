import { context, utils } from '@ad-engine/core';
import { get } from 'lodash';
import { InstantConfigResponse } from './instant-config.models';

const logGroup = 'instant-config-loader';

class InstantConfigLoader {
	private configPromise: Promise<InstantConfigResponse> = null;

	async getConfig(): Promise<InstantConfigResponse> {
		if (!this.configPromise) {
			this.configPromise = this.fetchInstantConfig();
		}

		return this.configPromise;
	}

	private async fetchInstantConfig(): Promise<InstantConfigResponse> {
		const request = new XMLHttpRequest();
		const url = context.get('services.instantConfig.endpoint');
		const fallbackConfigKey =
			context.get('services.instantConfig.fallbackConfigKey') || 'fallbackInstantConfig';
		const fallbackConfig: InstantConfigResponse = get(window, fallbackConfigKey, {}) as any;

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
		});
	}
}

export const instantConfigLoader = new InstantConfigLoader();
