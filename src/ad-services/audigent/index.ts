import { communicationService, eventsRepository } from '@ad-engine/communication';
import { BaseServiceSetup, context, externalLogger, utils } from '@ad-engine/core';
import { InstantConfigService } from '../instant-config';

const logGroup = 'audigent';
const DEFAULT_MATCHES_SCRIPT_URL = 'https://a.ad.gt/api/v1/u/matches/158';
const DEFAULT_SEGMENTS_SCRIPT_URL = 'https://seg.ad.gt/api/v1/segments.js';
const DEFAULT_NUMBER_OF_TRIES = 5;
const isAuSegGlobalSet = () => typeof window['au_seg'] !== 'undefined';

window.au = window.au || [];

export class Audigent extends BaseServiceSetup {
	private isLoaded = false;
	private matchesTagScriptLoader: Promise<void>;
	private segmentsScriptLoader: Promise<void>;

	loadSegmentLibrary(): void {
		this.segmentsScriptLoader = utils.scriptLoader
			.loadScript(
				context.get('services.audigent.segmentsScriptUrl') || DEFAULT_SEGMENTS_SCRIPT_URL,
				'text/javascript',
				true,
				'first',
			)
			.then(() => {
				communicationService.emit(eventsRepository.AUDIGENT_SEGMENT_LIBRARY_LOADED);
			});
	}

	loadMatchesLibrary(): void {
		this.matchesTagScriptLoader = utils.scriptLoader
			.loadScript(DEFAULT_MATCHES_SCRIPT_URL, 'text/javascript', true, 'first')
			.then(() => {
				communicationService.emit(eventsRepository.AUDIGENT_MATCHES_LIBRARY_LOADED);
			});
	}

	init(instantConfig: InstantConfigService): void {
		const newIntegrationEnabled = instantConfig.get('icAudigentNewIntegrationEnabled');

		if (newIntegrationEnabled) {
			context.set(
				'services.audigent.segmentsScriptUrl',
				instantConfig.get('icAudigentSegmentsScriptUrl'),
			);
			context.set('services.audigent.newIntegrationEnabled', newIntegrationEnabled);
			this.loadSegmentLibrary();
		} else {
			this.setupSegmentsListener();
		}
	}

	async call(): Promise<void> {
		if (!this.isEnabled('services.audigent.enabled')) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		context.set('targeting.AU_SEG', '-1');

		const newIntegrationEnabled = context.get('services.audigent.newIntegrationEnabled');
		!this.segmentsScriptLoader && this.loadSegmentLibrary();
		!this.matchesTagScriptLoader && this.loadMatchesLibrary();
		if (newIntegrationEnabled) {
			this.setupSegmentsListener();
		}

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading...');
			this.matchesTagScriptLoader.then(() => {
				utils.logger(logGroup, 'audience tag script loaded');
			});
			this.segmentsScriptLoader.then(() => {
				utils.logger(logGroup, 'segment tag script loaded');
				this.setup();
			});
			this.isLoaded = true;
		}

		if (newIntegrationEnabled) {
			await this.waitForAuSegGlobalSet().then((isGlobalSet) => {
				utils.logger(logGroup, 'Audigent global variable set', isGlobalSet, window['au_seg']);
				this.setup();
			});
		}
	}

	setup(): void {
		if (isAuSegGlobalSet()) {
			Audigent.sliceAndSetSegmentsInTargeting();
		}
	}

	setupSegmentsListener(): void {
		utils.logger(logGroup, 'setting up auSegReady event listener');

		document.addEventListener('auSegReady', function (e) {
			utils.logger(logGroup, 'auSegReady event recieved', e);
			communicationService.emit(eventsRepository.AUDIGENT_SEGMENTS_READY);
			Audigent.sliceAndSetSegmentsInTargeting();
		});
	}

	private static sliceAndSetSegmentsInTargeting(): void {
		const segments = Audigent.sliceSegments();
		Audigent.trackWithExternalLoggerIfEnabled(segments);
		Audigent.setSegmentsInTargeting(segments);
	}

	resetLoadedState(): void {
		this.isLoaded = false;
		this.segmentsScriptLoader = null;
		this.matchesTagScriptLoader = null;
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

	private waitForAuSegGlobalSet(numberOfTries = DEFAULT_NUMBER_OF_TRIES): Promise<boolean> {
		const numberOfTriesWhenWaiting =
			context.get('services.audigent.numberOfTries') || numberOfTries;

		return new utils.WaitFor(isAuSegGlobalSet, numberOfTriesWhenWaiting, 250).until();
	}
}

export const audigent = new Audigent();
