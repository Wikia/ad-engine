import { context } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { logger, timedPartnerScriptLoader } from '@ad-engine/utils';

const logGroup = 'duration-media';

export class DurationMedia extends BaseServiceSetup {
	call(): Promise<void> {
		const libraryUrl: string = context.get('services.durationMedia.libraryUrl');

		if (this.isEnabled('icDurationMedia', false) && libraryUrl) {
			logger(logGroup, 'loading', libraryUrl);

			timedPartnerScriptLoader
				.loadScriptWithStatus(libraryUrl, logGroup, false, null, { id: 'dm-script' })
				.then(() => {
					logger(logGroup, 'ready');
				});
		} else {
			logger(logGroup, 'disabled');
		}
		return Promise.resolve();
	}
}
