import { BaseServiceSetup, GlobalTargeting, targetingService, tcf, utils } from '@ad-engine/core';
import { communicationService, eventsRepository } from '@ad-engine/communication';

const logGroup = 'eyeota';
const pid = 'r8rcb20';
const siteName = 'fandom';

export function parseContextTags(tags: TaxonomyTags): string {
	let urlParams = '';
	Object.keys(tags).forEach((tagName) =>
		(tags[tagName] || []).forEach(
			(tagValue) => (urlParams += `&${tagName}=${encodeURI(tagValue)}`),
		),
	);

	return urlParams;
}

class Eyeota extends BaseServiceSetup {
	async call(): Promise<void> {
		if (!this.isEnabled('services.eyeota.enabled')) {
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
		const s0v = targetingService.getAll<GlobalTargeting>().s0v;

		const url = new URL('https://ps.eyeota.net/pixel');
		url.searchParams.append('pid', pid);
		url.searchParams.append('sid', siteName);
		url.searchParams.append('t', 'ajs');
		url.searchParams.append('s0v', s0v);

		let contextTags = '';
		if (window.fandomContext?.site?.tags) {
			const { gnre, pform, pub, tv } = window.fandomContext.site.tags;
			contextTags = parseContextTags({ gnre, pform, pub, tv });
		}

		if (tcfData.gdprApplies) {
			url.searchParams.append('gdpr', '1');
			url.searchParams.append('gdpr_consent', tcfData.tcString);
		}

		return url.toString() + contextTags;
	}
}

export const eyeota = new Eyeota();
