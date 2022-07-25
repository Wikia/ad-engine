import { context, utils, externalLogger } from '@ad-engine/core';

const logGroup = 'audigent';
const DEFAULT_AUDIENCE_TAG_SCRIPT_URL = 'https://a.ad.gt/api/v1/u/matches/158';
const DEFAULT_SEGMENTS_SCRIPT_URL = 'https://seg.ad.gt/api/v1/segments.js';
const DEFAULT_NUMBER_OF_TRIES = 5;

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

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		const gamDirectTestEnabled = context.get('services.audigent.gamDirectTestEnabled');
		const newIntegrationEnabled = context.get('services.audigent.newIntegrationEnabled');
		const audienceTagScriptUrl =
			context.get('services.audigent.audienceTagScriptUrl') || DEFAULT_AUDIENCE_TAG_SCRIPT_URL;
		const segmentsScriptUrl =
			context.get('services.audigent.segmentsScriptUrl') || DEFAULT_SEGMENTS_SCRIPT_URL;
		const numberOfTriesWhenWaiting =
			context.get('services.audigent.numberOfTries') || DEFAULT_NUMBER_OF_TRIES;

		context.set('targeting.AU_SEG', '-1');

		if (gamDirectTestEnabled) {
			window['au_gam_direct_test'] = true;

			utils.scriptLoader
				.loadScript(audienceTagScriptUrl, 'text/javascript', true, 'first')
				.then(() => {
					utils.logger(logGroup, 'audience tag script loaded');
				});
			return;
		}

		if (newIntegrationEnabled) {
			this.setupSegmentsListener();
		}

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading...');

			utils.scriptLoader
				.loadScript(audienceTagScriptUrl, 'text/javascript', true, 'first')
				.then(() => {
					utils.logger(logGroup, 'audience tag script loaded');
				});

			if (!newIntegrationEnabled) {
				utils.scriptLoader
					.loadScript(segmentsScriptUrl, 'text/javascript', true, 'first')
					.then(() => {
						utils.logger(logGroup, 'segment tag script loaded');
						this.legacySetup();
					});
			}

			this.isLoaded = true;
		}

		if (newIntegrationEnabled) {
			await new utils.WaitFor(this.isAuSegGlobalSet, numberOfTriesWhenWaiting, 250)
				.until()
				.then((isGlobalSet) => {
					utils.logger(logGroup, 'Audigent global variable set', isGlobalSet, window['au_seg']);

					if (isGlobalSet) {
						const segments = Audigent.sliceSegments();
						Audigent.trackWithExternalLoggerIfEnabled(segments);
						Audigent.setSegmentsInTargeting(segments);
					}
				});
		}
	}

	setupSegmentsListener(): void {
		utils.logger(logGroup, 'setting up auSegReady event listener');

		document.addEventListener('auSegReady', function (e) {
			utils.logger(logGroup, 'auSegReady event recieved', e);

			const segments = Audigent.sliceSegments();
			Audigent.trackWithExternalLoggerIfEnabled(segments);
			Audigent.setSegmentsInTargeting(segments);
		});
	}

	legacySetup(): void {
		if (this.isAuSegGlobalSet()) {
			const segments = Audigent.sliceSegments();
			Audigent.trackWithExternalLoggerIfEnabled(segments);
			Audigent.setSegmentsInTargeting(segments);
		}
	}

	isAuSegGlobalSet(): boolean {
		return typeof window['au_seg'] !== 'undefined';
	}

	resetLoadedState(): void {
		this.isLoaded = false;
	}

	private static sliceSegments() {
		const au_segments = window['au_seg'].segments || [];
		const limit = context.get('services.audigent.segmentLimit') || 0;

		let segments = au_segments.length ? au_segments : 'no_segments';

		if (Audigent.canSliceSegments(segments, limit)) {
			segments = segments.slice(0, limit);
		}

		utils.logger(logGroup, 'Sliced segments', segments, limit, au_segments);

		return segments;
	}

	private static setSegmentsInTargeting(segments) {
		utils.logger(logGroup, 'Setting segments in the targeting', segments);
		console.log('hello its audigent');
		context.set('targeting.AU_SEG', segments);
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
