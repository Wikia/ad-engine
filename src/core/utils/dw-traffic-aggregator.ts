import { DataWarehouseParams } from '../../platforms/shared';
import { utils } from '../index';
import { Dictionary } from '../models';

interface AggregateQueue {
	url: string;
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

	public push(track: string, url: string, element: DataWarehouseParams): void {
		if (!this.queue[track]) {
			this.queue[track] = {
				url: url,
				params: [],
			};
		}
		this.queue[track].params.push(element);

		if (this.queue[track].params.length >= this.AGGREGATION_LIMIT_PER_TRACK) {
			this.fireAggregatedQueueByTrack(track);
		}
	}

	private fireAggregatedQueue(): void {
		const keys = Object.keys(this.queue);
		keys.forEach((queueKey) => {
			this.fireAggregatedQueueByTrack(queueKey);
		});
	}

	private fireAggregatedQueueByTrack(track: string): void {
		const paramsAggregated = [];
		this.queue[track]?.params?.forEach((options) => paramsAggregated.push(options));

		if (paramsAggregated.length === 0) {
			return;
		}

		this.sendTrackData(this.queue[track].url, paramsAggregated);
		this.queue[track] = {
			url: this.queue[track].url,
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
	}
}

export const dwTrafficAggregator = new DwTrafficAggregator();
