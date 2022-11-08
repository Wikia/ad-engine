import { utils, VideoData, VideoTracker } from '@ad-engine/core';
import { PlayerEventEmitter } from '../player-event-emitter';
import { VideoEventDataProvider } from '../video-event-data-provider';

const logGroup = 'Anyclip';

export class AnyclipTracker implements VideoTracker {
	constructor(private subscribeFuncName: string) {}

	private trackingEvents = {
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
			utils.logger(
				logGroup,
				'Given subscribe function is not a function',
				this.subscribeFuncName,
				subscribe,
			);
			return;
		}

		Object.keys(this.trackingEvents).map((eventName) => {
			subscribe((data) => this.track(eventName, data), eventName);
		});
	}

	private track(eventName: string, eventData) {
		const dataForDataWarehouse = VideoEventDataProvider.getEventData(this.getVideoData(eventName));

		utils.logger(
			logGroup,
			`Anyclip ${eventName} event data: `,
			eventData,
			this.getVideoData(eventName),
			dataForDataWarehouse,
		);

		PlayerEventEmitter.emit(dataForDataWarehouse);
		PlayerEventEmitter.emitVideoEvent(dataForDataWarehouse);
	}

	private getVideoData(eventName: string): VideoData {
		return {
			event_name: this.trackingEvents[eventName],
			player: 'anyclip',
			ad_product: 'outstream',
			position: 'incontent_player',
			line_item_id: 'unknown',
			creative_id: 'unknown',
		};
	}
}
