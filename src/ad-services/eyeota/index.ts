import { BaseServiceSetup, context, tcf, utils } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';

const logGroup = 'eyeota';
const pid = 'r8rcb20';
const siteName = 'fandom';

export function appendContextTags(tags: object, url: URL): void {
	Object.keys(tags).forEach((tagName) =>
		(tags[tagName] || []).forEach((tagValue) => url.searchParams.append(tagName, tagValue)),
	);
}

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
				communicationService.emit(eventsRepository.EYEOTA_FAILED);
				throw new Error(`Error occurred while loading ${logGroup}`);
			});
	}

	async createScriptSource(): Promise<string> {
		const tcfData = await tcf.getTCData();
		const s0v = context.get('targeting.s0v');

		const url = new URL('https://ps.eyeota.net/pixel');
		url.searchParams.append('pid', pid);
		url.searchParams.append('sid', siteName);
		url.searchParams.append('t', 'ajs');
		url.searchParams.append('s0v', s0v);

		if (window.fandomContext?.site?.tags) {
			const { gnre, pform, pub, tv } = window.fandomContext.site.tags;
			appendContextTags({ gnre, pform, pub, tv }, url);
		}

		if (tcfData.gdprApplies) {
			url.searchParams.append('gdpr', '1');
			url.searchParams.append('gdpr_consent', tcfData.tcString);
		}

		return url.toString();
	}
}

export const eyeota = new Eyeota();
