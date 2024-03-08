import { communicationService, eventsRepository, trackingUrls, utils } from '@wikia/ad-engine';
import { DataWarehouseTracker } from './data-warehouse';

const eventsToTrack = {
	ad_engine_configured: eventsRepository.AD_ENGINE_CONFIGURED,
	ad_engine_stack_start: eventsRepository.AD_ENGINE_STACK_START,
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
	}

	private trackLoadTime(eventName: string, timestamp: number): void {
		this.dataWarehouseTracker.track(
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
