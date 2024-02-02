import { communicationService, eventsRepository } from '@ad-engine/communication';
import { InstantConfigService, targetingService, tcf } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { GlobalTimeout, logger, scriptLoader } from '@ad-engine/utils';

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

export class Eyeota extends BaseServiceSetup {
	constructor(
		protected instantConfig: InstantConfigService,
		protected globalTimeout: GlobalTimeout = null,
	) {
		super(instantConfig, globalTimeout);
	}
	async call(): Promise<void> {
		if (!this.isEnabled('icEyeota')) {
			logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		logger(logGroup, 'loading');
		return scriptLoader
			.loadScript(await this.createScriptSource())
			.then(() => {
				communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
					status: 'eyeota_started',
				});
				logger(logGroup, 'ready');
			})
			.catch(() => {
				communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
					status: 'eyeota_failed',
				});
				throw new Error(`Error occurred while loading ${logGroup}`);
			});
	}

	async createScriptSource(): Promise<string> {
		const tcfData = await tcf.getTCData();
		const s0v = targetingService.get('s0v');

		const url = new URL('https://ps.eyeota.net/pixel');
		url.searchParams.append('pid', pid);
		url.searchParams.append('sid', siteName);
		url.searchParams.append('t', 'ajs');
		url.searchParams.append('s0v', s0v);

		let contextTags = '';
		if (window.fandomContext?.site?.tags) {
			const { gnre, media, pform, pub, theme, tv } = window.fandomContext.site.tags;
			contextTags = parseContextTags({ gnre, media, pform, pub, theme, tv });
		}

		if (tcfData.gdprApplies) {
			url.searchParams.append('gdpr', '1');
			url.searchParams.append('gdpr_consent', tcfData.tcString);
		}

		return url.toString() + contextTags;
	}
}
