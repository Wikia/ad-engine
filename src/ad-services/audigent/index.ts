import { context, utils, externalLogger } from '@ad-engine/core';
import { InstantConfigService } from '../instant-config';

const logGroup = 'audigent';
const DEFAULT_AUDIENCE_TAG_SCRIPT_URL = 'https://a.ad.gt/api/v1/u/matches/158';
const DEFAULT_SEGMENTS_SCRIPT_URL = 'https://seg.ad.gt/api/v1/segments.js';
const DEFAULT_NUMBER_OF_TRIES = 5;
const isAuSegGlobalSet = () => typeof window['au_seg'] !== 'undefined';

export function waitForAuSegGlobalSet(numberOfTries = DEFAULT_NUMBER_OF_TRIES): Promise<boolean> {
	const numberOfTriesWhenWaiting = context.get('services.audigent.numberOfTries') || numberOfTries;

	return new utils.WaitFor(isAuSegGlobalSet, numberOfTriesWhenWaiting, 250).until();
}

class Audigent {
	private isLoaded = false;
	private audienceTagScriptLoader: Promise<Event>;
	private segmentsScriptLoader: Promise<Event>;

	private isEnabled(): boolean {
		return (
			context.get('services.audigent.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	init(instantConfig: InstantConfigService): void {
		context.set(
			'services.audigent.audienceTagScriptUrl',
			instantConfig.get('icAudigentAudienceTagScriptUrl'),
		);
		context.set(
			'services.audigent.segmentsScriptUrl',
			instantConfig.get('icAudigentSegmentsScriptUrl'),
		);

		const gamDirectTestEnabled = instantConfig.get('icAudigentGamDirectTestEnabled');
		const newIntegrationEnabled = instantConfig.get('icAudigentNewIntegrationEnabled');

		context.set('services.audigent.gamDirectTestEnabled', gamDirectTestEnabled);
		context.set('services.audigent.newIntegrationEnabled', newIntegrationEnabled);

		if (gamDirectTestEnabled) {
			window['au_gam_direct_test'] = true;
		}

		if (gamDirectTestEnabled || newIntegrationEnabled) {
			this.preloadLibraries();
		}
	}

	preloadLibraries(): void {
		this.audienceTagScriptLoader = utils.scriptLoader.loadScript(
			context.get('services.audigent.audienceTagScriptUrl') || DEFAULT_AUDIENCE_TAG_SCRIPT_URL,
			'text/javascript',
			true,
			'first',
		);

		if (!context.get('services.audigent.newIntegrationEnabled')) {
			this.segmentsScriptLoader = utils.scriptLoader.loadScript(
				context.get('services.audigent.segmentsScriptUrl') || DEFAULT_SEGMENTS_SCRIPT_URL,
				'text/javascript',
				true,
				'first',
			);
		}
	}

	async call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		const gamDirectTestEnabled = context.get('services.audigent.gamDirectTestEnabled');
		const newIntegrationEnabled = context.get('services.audigent.newIntegrationEnabled');

		context.set('targeting.AU_SEG', '-1');

		if (!this.audienceTagScriptLoader) {
			this.preloadLibraries();
		}

		if (!this.isLoaded && gamDirectTestEnabled) {
			this.audienceTagScriptLoader.then(() => {
				utils.logger(logGroup, 'audience tag script loaded');
				this.isLoaded = true;
			});
			return;
		}

		if (newIntegrationEnabled) {
			this.setupSegmentsListener();
		}

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading...');

			this.audienceTagScriptLoader.then(() => {
				utils.logger(logGroup, 'audience tag script loaded');
			});

			if (!newIntegrationEnabled) {
				this.segmentsScriptLoader.then(() => {
					utils.logger(logGroup, 'segment tag script loaded');
					this.legacySetup();
				});
			}

			this.isLoaded = true;
		}

		if (newIntegrationEnabled) {
			await waitForAuSegGlobalSet().then((isGlobalSet) => {
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
		if (isAuSegGlobalSet()) {
			const segments = Audigent.sliceSegments();
			Audigent.trackWithExternalLoggerIfEnabled(segments);
			Audigent.setSegmentsInTargeting(segments);
		}
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
