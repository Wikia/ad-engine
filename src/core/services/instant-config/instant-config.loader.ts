import { InstantConfigResponse } from './instant-config.models';
import { context, utils } from '../../index';

const logGroup = 'instant-config-loader';

class InstantConfigLoader {
	private configPromise: Promise<InstantConfigResponse> = null;

	async getConfig(): Promise<InstantConfigResponse> {
		if (!this.configPromise) {
			this.configPromise = this.fetchInstantConfig().then((config) => {
				utils.logger(logGroup, config);
				return config ? config : this.fetchFallbackConfig();
			});
		}
		return this.configPromise.then((config) => {
			utils.logger(logGroup, config);
			return config;
		});
	}

	private async fetchFallbackConfig(): Promise<InstantConfigResponse> {
		utils.logger(logGroup, 'Fetching fallback config');
		const request = new XMLHttpRequest();
		const fallbackConfig = context.get('services.instantConfig.fallback') || {};

		request.open('GET', fallbackConfig, true);
		request.responseType = 'json';

		utils.logger(logGroup, fallbackConfig);
		return new Promise((resolve) => {
			request.onreadystatechange = function (): void {
				if (this.readyState === 4) {
					if (this.status === 200) {
						utils.logger(logGroup, 'fallback config fetched', this.response);
						resolve(this.response);
					} else {
						utils.logger(logGroup, 'could not fetch fallback config', this.response);
						resolve({});
					}
				}
			};
			request.send();
		});
	}

	private async fetchInstantConfig(): Promise<InstantConfigResponse | void> {
		const request = new XMLHttpRequest();
		const baseUrl = context.get('services.instantConfig.endpoint') || 'https://services.fandom.com';
		const variant = context.get('wiki.services_instantConfig_variant') || 'icbm';
		const appName = context.get('services.instantConfig.appName');

		request.open('GET', `${baseUrl}/${variant}/api/config?app=${appName}`, true);
		request.responseType = 'json';

		return new Promise((resolve) => {
			request.addEventListener('timeout', () => {
				resolve();
				utils.logger(logGroup, 'timed out');
			});
			request.addEventListener('error', () => {
				resolve();
				utils.logger(logGroup, 'errored');
			});
			request.onreadystatechange = function (): void {
				if (this.readyState === 4) {
					if (this.status === 200) {
						utils.logger(logGroup, 'has response', this.response);
						resolve(this.response);
					} else {
						utils.logger(logGroup, 'did not respond successfully', this.response);
						resolve();
					}
				}
			};
			request.send();
		});
	}
}

export const instantConfigLoader = new InstantConfigLoader();
