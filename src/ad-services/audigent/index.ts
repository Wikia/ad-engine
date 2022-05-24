import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, utils, externalLogger } from '@ad-engine/core';

const logGroup = 'audigent';
const DEFAULT_AUDIENCE_TAG_SCRIPT_URL = 'https://a.ad.gt/api/v1/u/matches/158';
const DEFAULT_SEGMENTS_SCRIPT_URL = 'https://seg.ad.gt/api/v1/segments.js';

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

		const audienceTagScriptUrl =
			context.get('services.audigent.audienceTagScriptUrl') || DEFAULT_AUDIENCE_TAG_SCRIPT_URL;
		const segmentsScriptUrl =
			context.get('services.audigent.segmentsScriptUrl') || DEFAULT_SEGMENTS_SCRIPT_URL;

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading');
			context.set('targeting.AU_SEG', '-1');

			utils.scriptLoader.loadScript(
				audienceTagScriptUrl,
				{
				node: 'first'
			});

			utils.scriptLoader
				.loadScript(segmentsScriptUrl, {
					node: 'first'
				})
				.then(() => {
					this.setup();
					communicationService.emit(eventsRepository.AUDIGENT_LOADED);
				});
			this.isLoaded = true;
		}
	}

	setup(): void {
		if (typeof window['au_seg'] !== 'undefined') {
			const au_segments = window['au_seg'].segments || [];
			const limit = context.get('services.audigent.segmentLimit') || 0;

			let segments = au_segments.length ? au_segments : 'no_segments';

			if (this.canSliceSegments(segments, limit)) {
				segments = segments.slice(0, limit);
			}

			this.trackWithExternalLoggerIfEnabled(segments);

			context.set('targeting.AU_SEG', segments);
		}
	}

	private canSliceSegments(segments: string | [], limit: number): boolean {
		return limit > 0 && typeof segments !== 'string';
	}

	private trackWithExternalLoggerIfEnabled(segments: string | []) {
		const randomNumber = Math.random() * 100;

		if (
			externalLogger.isEnabled('services.audigent.tracking.sampling', randomNumber) &&
			typeof segments !== 'string'
		) {
			externalLogger.log('Audigent segments', {
				segmentsNo: segments.length,
				segments,
			});
		}
	}
}

window.au = window.au || [];

export const audigent = new Audigent();
