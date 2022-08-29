import { context, PartnerServiceStage, tcf, utils } from '@ad-engine/core';
// eslint-disable-next-line no-restricted-imports
import { Service } from '@ad-engine/services';
import { communicationService, eventsRepository } from '@ad-engine/communication';

const logGroup = 'eyeota';
const pid = 'r8rcb20';
const siteName = 'fandom';

@Service({
	stage: PartnerServiceStage.preProvider,
})
class Eyeota {
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
		const s0v = context.get('targeting.s0v');

		return `https://ps.eyeota.net/pixel?pid=${pid}&sid=${siteName}&gdpr=1&gdpr_consent=${tcString}&t=ajs&s0v=${s0v}`;
	}
}

export const eyeota = new Eyeota();
