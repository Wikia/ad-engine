import { context, PartnerServiceStage, tcf, utils } from '@ad-engine/core';
// eslint-disable-next-line no-restricted-imports
import { Service } from '@ad-engine/services';

const logGroup = 'eyeota';
const pid = 'r8rcb20';
const siteName = 'fandom';

@Service({
	stage: PartnerServiceStage.preProvider,
})
class Eyeota {
	isEnabled(): boolean {
		return context.get('services.eyeota.enabled');
	}

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
			});
	}

	async createScriptSource(): Promise<string> {
		const { tcString } = await tcf.getTCData();

		return `https://ps.eyeota.net/pixel?pid=${pid}&sid=${siteName}&gdpr=1&gdpr_consent=${tcString}&t=ajs`;
	}
}

export const eyeota = new Eyeota();
