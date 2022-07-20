import { communicationService, eventsRepository } from '@ad-engine/communication';
import { DataWarehouseTracker } from '../../../platforms/shared';

const loadTimeTrackingUrl = 'https://beacon.wikia-services.com/__track/special/adengloadtimes';

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
		communicationService.emit(eventsRepository.TIMESTAMP_EVENT, {
			eventName: 'load_time_init',
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
		const dataWarehouseTracker = new DataWarehouseTracker();

		communicationService.on(
			eventsRepository.TIMESTAMP_EVENT,
			(eventInfo) => {
				dataWarehouseTracker.track(
					{
						event_name: eventInfo.eventName,
						timestamp: eventInfo.timestamp,
						load_time: eventInfo.timestamp - this.getStartTime(),
						tz_offset: this.getTimezoneOffset(),
					},
					loadTimeTrackingUrl,
				);
			},
			false,
		);
	}
}
