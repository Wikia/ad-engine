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

	private queue: Dictionary<AggregateQueue>;
	private enabled: boolean;
	private count: number;

	constructor() {
		this.queue = {};
		this.enabled = true;
		this.count = 0;

		this.start();
	}

	isAggregatorActive(): boolean {
		return this.enabled;
	}

	push(track: string, url: string, element: DataWarehouseParams) {
		if (!this.findInQueue(track)) {
			this.queue[track] = {
				url: url,
				params: [],
			};
		}
		this.queue[track].params.push(element);
	}

	findInQueue(track: string) {
		const keys = Object.keys(this.queue);

		return keys.filter((queueTrack) => queueTrack === track).length > 0;
	}

	fireAggregatedQueue() {
		const keys = Object.keys(this.queue);
		keys.forEach((queueKey) => {
			const paramsAggregated = [];
			this.queue[queueKey]?.params?.forEach((options) => paramsAggregated.push(options));
			if (paramsAggregated.length > 0) {
				this.sendTrackData(this.queue[queueKey].url, paramsAggregated);
				this.queue[queueKey] = {
					url: this.queue[queueKey].url,
					params: [],
				};
			}
		});
	}

	sendTrackData(trackingUrl: string, paramsAggregated: DataWarehouseParams[]): void {
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

	start() {
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
