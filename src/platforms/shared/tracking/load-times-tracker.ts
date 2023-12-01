import { communicationService, eventsRepository, utils } from '@wikia/ad-engine';
import { trackingUrls } from '../setup/tracking-urls';
import { DataWarehouseTracker } from './data-warehouse';

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

		communicationService.on(eventsRepository.AD_ENGINE_SLOT_LOADED, (payload) => {
			if (payload.name == 'top_leaderboard') {
				this.trackLoadTime('top_leaderboard_loaded', Date.now());
			}
		});

		communicationService.on(eventsRepository.PARTNER_LOAD_STATUS, ({ status }) => {
			this.trackLoadTime(status, Date.now());
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
