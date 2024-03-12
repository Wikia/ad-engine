import { communicationService, eventsRepository } from '@ad-engine/communication';
import { AdSlot, AdSlotEvent } from '@ad-engine/core';
import { getTimeDelta, outboundTrafficRestrict } from '@ad-engine/utils';
import { MetricReporterSender } from './metric-reporter/metric-reporter-sender';

const REPORTABLE_SLOTS = {
	stateMetric: ['top_leaderboard'],
	timingMetric: ['top_leaderboard'],
};

export class MetricReporter {
	private readonly isActive: boolean;

	constructor(private readonly sender: MetricReporterSender) {
		this.isActive = outboundTrafficRestrict.isOutboundTrafficAllowed('monitoring-default');
	}

	initialise() {
		if (!this.isActive) {
			return;
		}

		this.trackLibInitialization();
		this.trackGptLibReady();

		this.trackGamSlotRequest();
		this.trackGamSlotRendered();
	}

	private trackLibInitialization(): void {
		this.sender.sendToMeteringSystem({
			action: 'init',
			duration: Math.round(getTimeDelta()),
		});
	}

	private trackGptLibReady(): void {
		communicationService.on(eventsRepository.AD_ENGINE_GPT_READY, () => {
			this.sender.sendToMeteringSystem({
				action: 'gpt-ready',
				duration: Math.round(getTimeDelta()),
			});
		});
	}

	private trackGamSlotRequest(): void {
		communicationService.onSlotEvent(AdSlotEvent.SLOT_REQUESTED_EVENT, ({ slot }) => {
			this.sendSlotInfoToMeteringSystem(slot, 'request');
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

		this.sender.sendToMeteringSystem({
			action: `${state}_${slot.getSlotName()}`,
			duration: Math.round(getTimeDelta()),
		});
	}
}
