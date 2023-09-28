import {
	AdSlot,
	AdSlotEvent,
	communicationService,
	context,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';
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

	constructor() {
		this.isActive = utils.outboundTrafficRestrict.isOutboundTrafficAllowed('monitoring-default');
	}

	initialise() {
		if (!this.isActive) {
			return;
		}

		this.trackLibInitialization();
		this.trackGptLibReady();

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

	private trackLibInitialization(): void {
		this.sendToMeteringSystem({
			action: 'init',
			duration: Math.round(utils.getTimeDelta()),
		});
	}

	private trackGptLibReady(): void {
		if (!this.isActive) {
			return;
		}
		communicationService.on(eventsRepository.AD_ENGINE_GPT_READY, ({ time }) => {
			this.sendToMeteringSystem({
				action: 'gpt-ready',
				duration: Math.round(time),
			});
		});
	}

	public setTrackingVariant(variant: string): this {
		context.set('metering.system.additional.variant.plw', variant);
		return this;
	}

	public trackLoadTimeVarianted(): void {
		const variant = context.get('metering.system.additional.variant.plw');
		this.sendToMeteringSystem({
			action: `load-variant-${variant}`,
			duration: Math.round(utils.getTimeDelta()),
		});
	}

	private trackGamSlotRequest(): void {
		communicationService.onSlotEvent(AdSlotEvent.SLOT_REQUESTED_EVENT, ({ slot }) => {
			this.sendSlotInfoToMeteringSystem(slot, 'request');
			this.trackGamSlotTimedInfo(slot, 'request');
		});
	}

	private trackGamSlotTimedInfo(slot: AdSlot, state: string): void {
		const variant = context.get('metering.system.additional.variant.plw');
		if (!variant || !REPORTABLE_SLOTS.stateMetric.includes(slot.getSlotName())) {
			return;
		}

		this.sendToMeteringSystem({
			action: `${slot.getSlotName()}-${state}-variant-${variant}`,
			duration: Math.round(utils.getTimeDelta()),
		});
	}

	private trackGamSlotRendered(): void {
		communicationService.onSlotEvent(AdSlotEvent.SLOT_RENDERED_EVENT, ({ slot }) => {
			this.sendSlotInfoToMeteringSystem(slot, 'render');
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
