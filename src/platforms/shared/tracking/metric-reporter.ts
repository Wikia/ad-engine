import { AdSlot, AdSlotEvent, communicationService, context, utils } from '@wikia/ad-engine';
import { clickDetector } from './metric-reporter-trackers/click-detector';

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

const REPORTABLE_SLOTS = {
	stateMetric: ['top_leaderboard'],
	timingMetric: ['top_leaderboard'],
};

export class MetricReporter {
	private readonly isActive: boolean;
	private slotTimeDiffRequestToRender = new Map<string, number>();

	constructor() {
		this.isActive = utils.outboundTrafficRestrict.isOutboundTrafficAllowed('monitoring-default');
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

		const fetchTimeout = new utils.FetchTimeout();
		fetchTimeout.fetch(
			`${endpointUrl}?app=${endpointInfo.appName}&${queryParams.join('&')}`,
			2000,
			{
				mode: 'no-cors',
			},
		);
	}

	private isMetricSlotData(item: any): item is MetricReporterSenderSlotData {
		return item.slot && item.state;
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

	public trackGptLibReady(): void {
		if (!this.isActive) {
			return;
		}

		this.sendToMeteringSystem({
			action: 'gpt-ready',
			duration: Math.round(utils.getTimeDelta()),
		});
	}

	private trackGamSlotRequest(): void {
		communicationService.onSlotEvent(AdSlotEvent.SLOT_REQUESTED_EVENT, ({ slot }) => {
			this.sendSlotInfoToMeteringSystem(slot, 'request');
			this.slotTimeDiffRequestToRender.set(slot.getSlotName(), Math.round(utils.getTimeDelta()));
		});
	}

	private trackGamSlotRendered(): void {
		communicationService.onSlotEvent(AdSlotEvent.SLOT_RENDERED_EVENT, ({ slot }) => {
			this.sendSlotInfoToMeteringSystem(slot, 'render');
			this.sendSlotLoadTimeDiffToMeteringSystem(slot);
		});
	}

	private sendSlotInfoToMeteringSystem(slot: AdSlot, state: string): void {
		if (!REPORTABLE_SLOTS.stateMetric.includes(slot.getSlotName())) {
			return;
		}

		this.sendToMeteringSystem({
			slot: slot.getSlotName(),
			state,
		});
	}

	private sendSlotLoadTimeDiffToMeteringSystem(slot: AdSlot): void {
		if (
			!REPORTABLE_SLOTS.timingMetric.includes(slot.getSlotName()) ||
			!this.slotTimeDiffRequestToRender.has(slot.getSlotName())
		) {
			return;
		}

		const requestTime = this.slotTimeDiffRequestToRender.get(slot.getSlotName());
		const duration = Math.round(utils.getTimeDelta()) - requestTime;

		this.sendToMeteringSystem({
			action: `${slot.getSlotName()}_ratio`,
			duration,
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
