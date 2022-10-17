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
		const tcfData = await tcf.getTCData();
		const s0v = context.get('targeting.s0v');
		const url = `https://ps.eyeota.net/pixel?pid=${pid}&sid=${siteName}&t=ajs&s0v=${s0v}`;

		if (tcfData.gdprApplies) {
			url.concat(`&gdpr=1&gdpr_consent=${tcfData.tcString}`);
		}

		return url;
	}
}

export const eyeota = new Eyeota();
