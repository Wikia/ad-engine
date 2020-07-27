import { communicationService, globalAction } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';

const logGroup = 'audigent';
const audienceTagScriptUrl = 'https://a.ad.gt/api/v1/u/matches/158';
const segmentsScriptUrl = 'https://seg.ad.gt/api/v1/segments.js';

class Audigent {
	private isLoaded = false;

	private isEnabled(): boolean {
		return (
			context.get('services.audigent.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	call(): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading');
			context.set('targeting.AU_SEG', '-1');

			utils.scriptLoader.loadScript(audienceTagScriptUrl, 'text/javascript', true, 'first');
			utils.scriptLoader
				.loadScript(segmentsScriptUrl, 'text/javascript', true, 'first')
				.then(() => {
					this.setup();
					communicationService.dispatch(audigentLoadedEvent({}));
				});
			this.isLoaded = true;
		}
	}

	setup(): void {
		if (typeof window['au_seg'] !== 'undefined') {
			const au_segments = window['au_seg'].segments || [];
			const segments = au_segments.length ? au_segments : 'no_segments';

			context.set('targeting.AU_SEG', segments);
		}
	}
}

export const audigent = new Audigent();
export const audigentLoadedEvent = globalAction('[AdEngine] Audigent loaded', props<{}>());
