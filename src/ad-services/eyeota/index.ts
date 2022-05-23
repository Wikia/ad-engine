import { context, tcf, utils } from '@ad-engine/core';

const logGroup = 'eyeota';
const pid = 'r8rcb20';
const siteName = 'fandom';

class Eyeota {
	isEnabled(): boolean {
		return context.get('services.eyeota.enabled');
	};

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		utils.logger(logGroup, 'loading');
		return utils.scriptLoader
			.loadScript(await this.createScriptSource())
			.then(() => {
				utils.logger(logGroup, 'ready');
			})
			.catch(() => {
				throw new Error(`Error occurred while loading ${logGroup}`);
			})
	}

	async createScriptSource(): Promise<string> {
		const { tcString } = await tcf.getTCData(2);

		return `https://ps.eyeota.net/pixel?pid=${pid}&sid=${siteName}&gdpr=1&gdpr_consent=${tcString}&t=aj`
	}
}

export const eyeota = new Eyeota();
