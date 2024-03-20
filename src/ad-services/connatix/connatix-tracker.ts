// @ts-strict-ignore
import { utils, VideoData, VideoEventProvider, VideoTracker } from '@ad-engine/core';
import { ConnatixPlayerApi, ConnatixPlayerType } from './connatix-player';

const logGroup = 'connatix';

export class ConnatixTracker implements VideoTracker {
	private playerApi: ConnatixPlayerApi;

	private trackingEvents = {
		init: 'init',
		ready: 'ready',
		adImpression: 'impression',
		adSkipped: 'skipped',
		adCompleted25: 'first_quartile',
		adCompleted50: 'midpoint',
		adCompleted75: 'third_quartile',
		adCompleted100: 'completed',
		adClick: 'clicked',
	};

	register() {
		this.setupListeners();
	}

	setPlayerApi(playerApi: ConnatixPlayerApi) {
		this.playerApi = playerApi;
	}

	private setupListeners() {
		if (typeof this.playerApi !== 'object') {
			utils.logger(logGroup, 'Given playerApi is not an object', this.playerApi);
			return;
		}

		utils.logger(logGroup, 'Subscribing to Connatix events...');
		Object.keys(this.trackingEvents).map((eventName) => {
			this.playerApi.on(eventName, (data) => this.track(eventName, data));
		});
	}

	trackInit() {
		const eventName = 'init';
		this.track(eventName, VideoEventProvider.getEventData(this.getVideoData(eventName)));
	}

	trackReady() {
		const eventName = 'ready';
		this.track(eventName, VideoEventProvider.getEventData(this.getVideoData(eventName)));
	}

	private track(eventName: string, eventData) {
		const dataForDataWarehouse = VideoEventProvider.getEventData(this.getVideoData(eventName));

		utils.logger(
			logGroup,
			`Connatix ${eventName} event data: `,
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
			player: 'connatix',
			ad_product:
				this?.playerApi?.getPlayerType() === ConnatixPlayerType.InStream ? 'instream' : 'outstream',
			position: 'incontent_player',
			line_item_id: 'unknown',
			creative_id: 'unknown',
		};
	}
}
