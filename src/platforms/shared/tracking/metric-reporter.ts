import { AdSlot, communicationService, context, utils } from '@wikia/ad-engine';
import { clickDetector } from './metric-reporter-trackers/click-detector';

interface EndpointInfo {
	baseUrl: string;
	service: string;
	appName?: string;
}

export interface MetricReporterSenderSlotData {
	slotName: string;
	state: string;
}

export interface MetricReporterSenderTimeData {
	action?: string;
	duration?: number;
}

export class MetricReporter {
	private readonly isActive: boolean;

	constructor() {
		this.isActive = utils.outboundTrafficRestrict.isOutboundTrafficAllowed('monitoring');
	}

	execute() {
		if (!this.isActive) {
			return;
		}

		this.trackLibInitialization();

		this.trackGamSlotRequest();
		this.trackGamSlotRendered();

		clickDetector((data) => this.sendToMeteringSystem(data));
	}

	private sendToMeteringSystem(
		metricData: MetricReporterSenderSlotData | MetricReporterSenderTimeData,
	): void {
		const endpointInfo = this.getEndpointInfoFromContext();
		let endpointUrl = '';

		if (this.isMetricSlotData(metricData)) {
			endpointUrl = this.getEndpointUrlFor('slot', endpointInfo);
		}
		if (this.isMetricTimeData(metricData)) {
			endpointUrl = this.getEndpointUrlFor('time', endpointInfo);
		}

		const queryParams = [];
		Object.entries(metricData).forEach(([k, v]) => {
			queryParams.push(`${k}=${encodeURIComponent(v)}`);
		});

		utils.fetchTimeout(`${endpointUrl}?app=${endpointInfo.appName}&${queryParams.join('&')}`);
	}

	private isMetricSlotData(item: any): item is MetricReporterSenderSlotData {
		return item.slotName && item.state;
	}
	private isMetricTimeData(item: any): item is MetricReporterSenderTimeData {
		return item.action && item.duration;
	}

	public trackLibInitialization(): void {
		this.sendToMeteringSystem({
			action: 'init',
			duration: Math.round(utils.getTimeDelta()),
		});
	}

	private trackGamSlotRequest(): void {
		communicationService.onSlotEvent(AdSlot.SLOT_REQUESTED_EVENT, ({ slot }) => {
			this.sendToMeteringSystem({
				slotName: slot.getSlotName(),
				state: 'request',
			});
		});
	}

	private trackGamSlotRendered(): void {
		communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
			this.sendToMeteringSystem({
				slotName: slot.getSlotName(),
				state: 'render',
			});
		});
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
