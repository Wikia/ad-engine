import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, externalLogger, targetingService } from '@ad-engine/core';
import { BaseServiceSetup } from '@ad-engine/pipeline';
import { logger, scriptLoader, WaitFor } from '@ad-engine/utils';

const logGroup = 'audigent';
const DEFAULT_MATCHES_SCRIPT_URL = 'https://a.ad.gt/api/v1/u/matches/158';
const DEFAULT_SEGMENTS_SCRIPT_URL = 'https://seg.ad.gt/api/v1/s/158';
const DEFAULT_NUMBER_OF_TRIES = 5;
const isAuSegGlobalSet = () => typeof window['au_seg'] !== 'undefined';

window.au = window.au || [];

export class Audigent extends BaseServiceSetup {
	private isLoaded = false;
	private matchesTagScriptLoader: Promise<void>;
	private static segmentsScriptLoader: Promise<void>;
	private static sampling;
	private static segmentLimit;

	static loadSegmentLibrary(): void {
		Audigent.segmentsScriptLoader = scriptLoader
			.loadScript(DEFAULT_SEGMENTS_SCRIPT_URL, true, 'first')
			.then(() => {
				communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
					status: 'audigent_segment_library_loaded',
				});
			});
	}

	loadMatchesLibrary(): void {
		this.matchesTagScriptLoader = scriptLoader
			.loadScript(DEFAULT_MATCHES_SCRIPT_URL, true, 'first')
			.then(() => {
				communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
					status: 'audigent_matches_library_loaded',
				});
			});
	}

	async call(): Promise<void> {
		if (!this.isEnabled('icAudigent')) {
			logger(logGroup, 'disabled');
			return;
		}

		targetingService.set('AU_SEG', '-1');

		Audigent.sampling = this.instantConfig.get('icAudigentTrackingSampling');
		Audigent.segmentLimit = this.instantConfig.get('icAudigentSegmentLimit');

		!Audigent.segmentsScriptLoader && Audigent.loadSegmentLibrary();
		!this.matchesTagScriptLoader && this.loadMatchesLibrary();
		this.setupSegmentsListener();

		if (!this.isLoaded) {
			logger(logGroup, 'loading...');
			this.matchesTagScriptLoader.then(() => {
				logger(logGroup, 'audience tag script loaded');
			});
			Audigent.segmentsScriptLoader.then(() => {
				logger(logGroup, 'segment tag script loaded');
				this.setup();
			});
			this.isLoaded = true;
		}

		await this.waitForAuSegGlobalSet().then((isGlobalSet) => {
			logger(logGroup, 'Audigent global variable set', isGlobalSet, window['au_seg']);
			this.setup();
		});
	}

	setup(): void {
		if (isAuSegGlobalSet()) {
			Audigent.sliceAndSetSegmentsInTargeting();
		}
	}

	setupSegmentsListener(): void {
		logger(logGroup, 'setting up auSegReady event listener');

		document.addEventListener('auSegReady', function (e) {
			logger(logGroup, 'auSegReady event received', e);
			communicationService.emit(eventsRepository.PARTNER_LOAD_STATUS, {
				status: 'audigent_segments_ready',
			});
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
		this.matchesTagScriptLoader = null;
		Audigent.segmentsScriptLoader = null;
	}

	private static sliceSegments() {
		const au_segments = window['au_seg'].segments || [];
		const limit = Audigent.segmentLimit || 0;

		let segments = au_segments.length ? au_segments : 'no_segments';

		if (Audigent.canSliceSegments(segments, limit)) {
			segments = segments.slice(0, limit);
		}

		logger(logGroup, 'Sliced segments', segments, limit, au_segments);

		return segments;
	}

	private static setSegmentsInTargeting(segments) {
		logger(logGroup, 'Setting segments in the targeting', segments);
		targetingService.set('AU_SEG', segments);
	}

	private static canSliceSegments(segments: string | [], limit: number): boolean {
		return limit > 0 && typeof segments !== 'string';
	}

	private static trackWithExternalLoggerIfEnabled(segments: string | []) {
		const randomNumber = Math.random() * 100;
		const sampling = Audigent.sampling || 0;

		if (sampling > 0 && randomNumber <= sampling && typeof segments !== 'string') {
			externalLogger.log('Audigent segments', {
				segmentsNo: segments.length,
				segments,
			});
		}
	}

	private waitForAuSegGlobalSet(numberOfTries = DEFAULT_NUMBER_OF_TRIES): Promise<boolean> {
		const numberOfTriesWhenWaiting =
			context.get('services.audigent.numberOfTries') || numberOfTries;

		return new WaitFor(isAuSegGlobalSet, numberOfTriesWhenWaiting, 250).until();
	}
}
