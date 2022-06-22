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

		this.setupSegmentsListener();

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading');
			context.set('targeting.AU_SEG', '-1');

			utils.scriptLoader
				.loadScript(audienceTagScriptUrl, 'text/javascript', true, 'first')
				.then(() => {
					utils.logger(logGroup, 'audience tag script loaded');
				});

			utils.scriptLoader
				.loadScript(segmentsScriptUrl, 'text/javascript', true, 'first')
				.then(() => {
					utils.logger(logGroup, 'segment tag script loaded');

					new utils.WaitFor(() => typeof window['au_seg'] !== 'undefined', 100, 100)
						.until()
						.then(() => {
							utils.logger(logGroup, 'segment tag script loaded');
						});

					communicationService.emit(eventsRepository.AUDIGENT_LOADED);
				});
			this.isLoaded = true;
		}
	}

	setupSegmentsListener(): void {
		document.addEventListener('auSegReady', function (e) {
			utils.logger(logGroup, 'auSegReady event recieved', e);

			const au_segments = window['au_seg'].segments || [];
			const limit = context.get('services.audigent.segmentLimit') || 0;

			let segments = au_segments.length ? au_segments : 'no_segments';

			if (Audigent.canSliceSegments(segments, limit)) {
				segments = segments.slice(0, limit);
			}

			Audigent.trackWithExternalLoggerIfEnabled(segments);

			context.set('targeting.AU_SEG', segments);
		});
	}

	private static canSliceSegments(segments: string | [], limit: number): boolean {
		return limit > 0 && typeof segments !== 'string';
	}

	private static trackWithExternalLoggerIfEnabled(segments: string | []) {
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
