import { utils, VideoData } from '@ad-engine/core';
import { PlayerEventEmitter } from './player-event-emitter';
import { VideoEventDataProvider } from './video-event-data-provider';

const logGroup = 'Anyclip';
const isSubscribeReady = () => typeof window['lreSubscribe'] !== 'undefined';

export class AnyclipTracker {
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
		this.waitForSubscribeReady().then((isSubscribeReady) => {
			utils.logger(
				logGroup,
				'Anyclip global subscribe function set',
				isSubscribeReady,
				window['lreSubscribe'],
			);
			isSubscribeReady
				? this.setupAnyclipListeners()
				: utils.logger(logGroup, 'Anyclip global subscribe function set');
		});
	}

	private waitForSubscribeReady(): Promise<boolean> {
		return new utils.WaitFor(isSubscribeReady, 4, 250).until();
	}

	private setupAnyclipListeners() {
		const subscribe = window['lreSubscribe'];

		Object.keys(this.trackingEvents).map((eventName) =>
			subscribe((data) => this.track(eventName, data), eventName),
		);
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
