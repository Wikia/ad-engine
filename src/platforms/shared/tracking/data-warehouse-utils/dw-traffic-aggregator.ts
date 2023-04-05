import { Dictionary, utils } from '@wikia/ad-engine';
import { TrackingUrl } from '../../setup/tracking-urls';
import { DataWarehouseParams } from '../data-warehouse';

interface AggregateQueue {
	track: TrackingUrl;
	params: DataWarehouseParams[];
}

class DwTrafficAggregator {
	private readonly AGGREGATION_SECONDS_OFF = 5;
	private readonly SEND_DATA_INTERVAL = 1000;
	private readonly AGGREGATION_LIMIT_PER_TRACK = 5;

	private queue: Dictionary<AggregateQueue>;
	private enabled: boolean;
	private count: number;

	constructor() {
		this.queue = {};
		this.enabled = true;
		this.count = 0;

		this.start();
	}

	public isAggregatorActive(): boolean {
		return this.enabled;
	}

	public push(track: TrackingUrl, element: DataWarehouseParams): void {
		if (!this.queue[track.name]) {
			this.queue[track.name] = {
				track,
				params: [],
			};
		}
		this.queue[track.name].params.push(element);

		if (this.queue[track.name].params.length >= this.AGGREGATION_LIMIT_PER_TRACK) {
			this.fireAggregatedQueueByTrack(track);
		}
	}

	private fireAggregatedQueue(): void {
		const keys = Object.keys(this.queue);
		keys.forEach((queueKey) => {
			this.fireAggregatedQueueByTrack(this.queue[queueKey].track);
		});
	}

	private fireAggregatedQueueByTrack(track: TrackingUrl): void {
		const paramsAggregated = [];
		this.queue[track.name]?.params?.forEach((options) => paramsAggregated.push(options));

		if (paramsAggregated.length === 0) {
			return;
		}

		this.sendTrackData(this.queue[track.name].track.url, paramsAggregated);
		this.queue[track.name] = {
			track,
			params: [],
		};
	}

	private sendTrackData(trackingUrl: string, paramsAggregated: DataWarehouseParams[]): void {
		const dwTrackingUrlV2 = `${trackingUrl}_v2`;
		this.sendRequest(dwTrackingUrlV2, paramsAggregated);
	}

	private sendRequest(url: string, params: DataWarehouseParams[]): void {
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(params),
		}).then((response) => {
			if (response.status === 200) {
				utils.logger(`DW - Track Aggregated Success`, { url, params });
			} else {
				utils.logger(`DW - Track Aggregated Failed`, { url, params });
			}
		});
	}

	private start(): void {
		const interval = setInterval(() => {
			this.fireAggregatedQueue();
			this.count++;

			if (this.count >= this.AGGREGATION_SECONDS_OFF) {
				this.enabled = false;
				clearInterval(interval);
			}
		}, this.SEND_DATA_INTERVAL);

		window.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				this.fireAggregatedQueue();
			}
		});
	}
}

export const dwTrafficAggregator = new DwTrafficAggregator();
