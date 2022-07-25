import { communicationService, eventsRepository } from '@ad-engine/communication';
import { DataWarehouseTracker } from '@platforms/shared';
import { context } from './context-service';

const loadTimeTrackingUrl = 'https://beacon.wikia-services.com/__track/special/adengloadtimes';
const eventsToTrack = {
	ad_engine_configured: eventsRepository.AD_ENGINE_CONFIGURED,
	ad_engine_stack_start: eventsRepository.AD_ENGINE_STACK_START,
	prebid_auction_started: eventsRepository.BIDDERS_BIDS_CALLED,
	prebid_auction_ended: eventsRepository.BIDDERS_INIT_STAGE_DONE,
	live_connect_started: eventsRepository.LIVE_CONNECT_STARTED,
	live_connect_responded_uuid: eventsRepository.LIVE_CONNECT_RESPONDED_UUID,
};

export class LoadTimesService {
	private static instance: LoadTimesService;
	private startTime: number;
	private tzOffset: number;

	private constructor() {
		this.initStartTime();
		this.initLoadTimesTracker();
	}

	static make(): LoadTimesService {
		if (!LoadTimesService.instance) {
			LoadTimesService.instance = new LoadTimesService();
		}

		return LoadTimesService.instance;
	}

	initStartTime(): void {
		const now = new Date();
		if (!this.startTime) {
			this.startTime = now.getTime();
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
		const trackerConfig = context.get('options.loadTimeTracking');

		if (!trackerConfig || !trackerConfig.enabled) {
			return;
		}

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
			},
			loadTimeTrackingUrl,
		);
	}
}
