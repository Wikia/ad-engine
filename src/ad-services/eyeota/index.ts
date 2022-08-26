import { BaseServiceSetup, context, tcf, utils } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';

const logGroup = 'eyeota';
const pid = 'r8rcb20';
const siteName = 'fandom';

class Eyeota extends BaseServiceSetup {
	isEnabled(): boolean {
		return (
			context.get('services.eyeota.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
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
				communicationService.emit(eventsRepository.EYEOTA_STARTED);
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
