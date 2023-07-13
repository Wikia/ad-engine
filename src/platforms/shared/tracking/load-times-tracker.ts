import { communicationService, eventsRepository, utils } from '@wikia/ad-engine';
import { trackingUrls } from '../setup/tracking-urls';
import { DataWarehouseTracker } from './data-warehouse';

const eventsToTrack = {
	ad_engine_configured: eventsRepository.AD_ENGINE_CONFIGURED,
	ad_engine_stack_start: eventsRepository.AD_ENGINE_STACK_START,
	prebid_auction_started: eventsRepository.BIDDERS_BIDS_CALLED,
	prebid_auction_ended: eventsRepository.BIDDERS_AUCTION_DONE,
	live_connect_cached: eventsRepository.LIVE_CONNECT_CACHED,
	live_connect_started: eventsRepository.LIVE_CONNECT_STARTED,
	live_connect_responded_uuid: eventsRepository.LIVE_CONNECT_RESPONDED_UUID,
	audigent_matches_library_loaded: eventsRepository.AUDIGENT_MATCHES_LIBRARY_LOADED,
	audigent_segment_library_loaded: eventsRepository.AUDIGENT_SEGMENT_LIBRARY_LOADED,
	audigent_segments_ready: eventsRepository.AUDIGENT_SEGMENTS_READY,
	captify_loaded: eventsRepository.CAPTIFY_LOADED,
	eyeota_started: eventsRepository.EYEOTA_STARTED,
	eyeota_failed: eventsRepository.EYEOTA_FAILED,
	intentiq_ppid_not_set_on_time: eventsRepository.INTENTIQ_PPID_NOT_SET_ON_TIME,
};

export class LoadTimesTracker {
	private static instance: LoadTimesTracker;
	private startTime: number;
	private tzOffset: number;

	private constructor() {
		this.initStartTime();
		this.initLoadTimesTracker();
	}

	static make(): LoadTimesTracker {
		if (!LoadTimesTracker.instance) {
			LoadTimesTracker.instance = new LoadTimesTracker();
		}

		return LoadTimesTracker.instance;
	}

	initStartTime(): void {
		const now = new Date();
		if (!this.startTime) {
			this.startTime = utils.getTimeOrigin();
			this.tzOffset = now.getTimezoneOffset();
		}
		communicationService.emit(eventsRepository.AD_ENGINE_LOAD_TIME_INIT, {
			timestamp: this.startTime,
		});
	}

	getStartTime(): number {
		return this.startTime;
	}

	getTimezoneOffset(): number {
		return this.tzOffset;
	}

	initLoadTimesTracker(): void {
		communicationService.on(eventsRepository.AD_ENGINE_LOAD_TIME_INIT, (payload) => {
			this.trackLoadTime('load_time_init', payload.timestamp);
		});

		Object.keys(eventsToTrack).forEach((eventName) => {
			communicationService.on(eventsToTrack[eventName], () => {
				this.trackLoadTime(eventName, Date.now());
			});
		});

		communicationService.on(eventsRepository.AD_ENGINE_SLOT_LOADED, (payload) => {
			if (payload.name == 'top_leaderboard') {
				this.trackLoadTime('top_leaderboard_loaded', Date.now());
			}
		});
	}

	private trackLoadTime(eventName: string, timestamp: number): void {
		const dataWarehouseTracker = new DataWarehouseTracker();

		dataWarehouseTracker.track(
			{
				event_name: eventName,
				browser_ts: timestamp,
				load_time: timestamp - this.getStartTime(),
				tz_offset: this.getTimezoneOffset(),
				country: utils.geoService.getCountryCode() || '',
			},
			trackingUrls.AD_ENG_LOAD_TIMES,
		);
	}
}
