import { communicationService, eventsRepository } from '@ad-engine/communication';
import { geoService, getTimeOrigin } from '@ad-engine/utils';
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
	a9_without_consents: eventsRepository.A9_WITHOUT_CONSENTS,
	a9_apstag_hem_sent: eventsRepository.A9_APSTAG_HEM_SENT,
	yahoo_started: eventsRepository.YAHOO_STARTED,
};

export class LoadTimesTracker {
	private static instance: LoadTimesTracker;
	private dataWarehouseTracker: DataWarehouseTracker;
	private startTime: number;
	private tzOffset: number;

	private constructor() {
		this.dataWarehouseTracker = new DataWarehouseTracker();
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
			this.startTime = getTimeOrigin();
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

		communicationService.on(
			eventsRepository.PARTNER_LOAD_STATUS,
			({ status }) => {
				this.trackLoadTime(status, Date.now());
			},
			false,
		);
	}

	private trackLoadTime(eventName: string, timestamp: number): void {
		this.dataWarehouseTracker.track(
			{
				event_name: eventName,
				browser_ts: timestamp,
				load_time: timestamp - this.getStartTime(),
				tz_offset: this.getTimezoneOffset(),
				country: geoService.getCountryCode() || '',
			},
			trackingUrls.AD_ENG_LOAD_TIMES,
		);
	}
}
