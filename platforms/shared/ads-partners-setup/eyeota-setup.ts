import { BaseServiceSetup, context, tcf, utils } from '@wikia/ad-engine';

const logGroup = 'eyeota';
const pid = 'r8rcb20';
const siteName = 'fandom';

class EyeotaSetup extends BaseServiceSetup {
	isEnabled(): boolean {
		return context.get('services.eyeota.enabled');
	}

	async initialize() {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			this.res();
		} else {
			utils.logger(logGroup, 'loading');
			utils.scriptLoader
				.loadScript(await this.createScriptSource())
				.then(() => {
					utils.logger(logGroup, 'ready');
					this.res();
				})
				.catch(() => {
					this.res();
					throw new Error(`Error occurred while loading ${logGroup}`);
				});
		}
	}

	async createScriptSource(): Promise<string> {
		const { tcString } = await tcf.getTCData();

		return `https://ps.eyeota.net/pixel?pid=${pid}&sid=${siteName}&gdpr=1&gdpr_consent=${tcString}&t=ajs`;
	}
}

export const eyeotaSetup = new EyeotaSetup();
