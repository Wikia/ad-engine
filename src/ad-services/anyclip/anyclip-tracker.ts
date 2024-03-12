import { VideoData, VideoEventProvider, VideoTracker } from '@ad-engine/core';
import { logger } from '@ad-engine/utils';

const logGroup = 'Anyclip';

export class AnyclipTracker implements VideoTracker {
	constructor(private subscribeFuncName: string) {}

	private trackingEvents = {
		init: 'init',
		eligible: 'eligible',
		WidgetLoad: 'ready',
		adImpression: 'impression',
		adSkipped: 'skipped',
		adFirstQuartile: 'first_quartile',
		adMidpoint: 'midpoint',
		adThirdQuartile: 'third_quartile',
		adComplete: 'completed',
		adClick: 'clicked',
	};

	register() {
		this.setupAnyclipListeners();
	}

	private setupAnyclipListeners() {
		const subscribe = window[this.subscribeFuncName];

		if (typeof subscribe !== 'function') {
			logger(
				logGroup,
				'Given subscribe function is not a function',
				this.subscribeFuncName,
				subscribe,
			);
			return;
		}

		logger(logGroup, 'Subscribing to Anyclip events...');
		Object.keys(this.trackingEvents).map((eventName) => {
			subscribe((data) => this.track(eventName, data), eventName);
		});
	}

	trackInit() {
		const eventName = 'init';
		this.track(eventName, VideoEventProvider.getEventData(this.getVideoData(eventName)));
	}

	trackEligible() {
		const eventName = 'eligible';
		this.track(eventName, VideoEventProvider.getEventData(this.getVideoData(eventName)));
	}

	private track(eventName: string, eventData) {
		const dataForDataWarehouse = VideoEventProvider.getEventData(this.getVideoData(eventName));

		logger(
			logGroup,
			`Anyclip ${eventName} event data: `,
			eventData,
			this.getVideoData(eventName),
			dataForDataWarehouse,
		);

		VideoEventProvider.emit(dataForDataWarehouse);
		VideoEventProvider.emitVideoEvent(dataForDataWarehouse);
	}

	private getVideoData(eventName: string): VideoData {
		return {
			ad_error_code: 0,
			event_name: this.trackingEvents[eventName],
			player: 'anyclip',
			ad_product: 'outstream',
			position: 'incontent_player',
			line_item_id: 'unknown',
			creative_id: 'unknown',
		};
	}
}
