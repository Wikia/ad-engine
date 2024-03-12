import { context } from '@ad-engine/core';
import { FetchTimeout } from '@ad-engine/utils';

interface EndpointInfo {
	baseUrl: string;
	service: string;
	appName?: string;
}

export interface MetricReporterSenderTimeData {
	action?: string;
	duration?: number;
}

export interface MetricReporterSender {
	activate: () => void;
	sendToMeteringSystem: (metricData: MetricReporterSenderTimeData) => void;
}

export class MetricReporterSenderService implements MetricReporterSender {
	public constructor(private isActive = false) {}

	public activate(): void {
		this.isActive = true;
	}

	public sendToMeteringSystem(metricData: MetricReporterSenderTimeData): void {
		if (!this.isActive) {
			return;
		}

		const endpointInfo = this.getEndpointInfoFromContext();
		const endpointUrl = this.getEndpointUrlFor('time', endpointInfo);

		const queryParams = [];
		Object.entries(metricData).forEach(([k, v]) => {
			queryParams.push(`${k}=${encodeURIComponent(v)}`);
		});

		const fetchTimeout = new FetchTimeout();
		fetchTimeout.fetch(
			`${endpointUrl}?app=${endpointInfo.appName}&${queryParams.join('&')}`,
			2000,
			{
				mode: 'no-cors',
			},
		);
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
