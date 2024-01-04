import { context, utils } from '@wikia/ad-engine';

interface EndpointInfo {
	baseUrl: string;
	service: string;
	appName?: string;
}

export interface MetricReporterSenderSlotData {
	slot: string;
	state: string;
}

export interface MetricReporterSenderTimeData {
	action?: string;
	duration?: number;
}

export interface MetricReporterSender {
	activate: () => void;
	sendToMeteringSystem: (
		metricData: MetricReporterSenderSlotData | MetricReporterSenderTimeData,
	) => void;
}

export class MetricReporterSenderService implements MetricReporterSender {
	public constructor(private isActive = false) {}

	public activate(): void {
		this.isActive = true;
	}

	public sendToMeteringSystem(
		metricData: MetricReporterSenderSlotData | MetricReporterSenderTimeData,
	): void {
		if (!this.isActive) {
			return;
		}

		const endpointInfo = this.getEndpointInfoFromContext();
		let endpointUrl = this.getEndpointUrlFor('time', endpointInfo);

		// TODO: remove below condition within ADEN-13800
		if (this.isMetricSlotData(metricData)) {
			endpointUrl = this.getEndpointUrlFor('slot', endpointInfo);
		}

		const queryParams = [];
		Object.entries(metricData).forEach(([k, v]) => {
			queryParams.push(`${k}=${encodeURIComponent(v)}`);
		});

		const fetchTimeout = new utils.FetchTimeout();
		fetchTimeout.fetch(
			`${endpointUrl}?app=${endpointInfo.appName}&${queryParams.join('&')}`,
			2000,
			{
				mode: 'no-cors',
			},
		);
	}

	// TODO: remove below func within ADEN-13800
	private isMetricSlotData(item: any): item is MetricReporterSenderSlotData {
		return item.slot && item.state;
	}

	private getEndpointInfoFromContext(): EndpointInfo {
		return {
			baseUrl: context.get('services.monitoring.endpoint'),
			service: context.get('services.monitoring.service'),
			appName: context.get('services.instantConfig.appName'),
		};
	}

	private getEndpointUrlFor(endpointSpecific: string, { baseUrl, service }): string {
		return [baseUrl, service, 'api', 'adengine', 'meter', endpointSpecific]
			.filter((element) => !!element)
			.join('/');
	}
}

export const metricReporterSender = new MetricReporterSenderService();
