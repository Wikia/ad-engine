// @ts-strict-ignore
import {
	AdSlot,
	AdSlotEvent,
	communicationService,
	eventsRepository,
	utils,
} from '@wikia/ad-engine';
import { MetricReporterSender } from './metric-reporter/metric-reporter-sender';

const REPORTABLE_SLOTS = {
	stateMetric: ['top_leaderboard'],
	timingMetric: ['top_leaderboard'],
	reportedGamSlotRequests: [],
	reportedGamSlotRenders: [],
};

export class MetricReporter {
	private readonly isActive: boolean;

	constructor(private readonly sender: MetricReporterSender) {
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
	}

	private trackLibInitialization(): void {
		this.sender.sendToMeteringSystem({
			action: 'init',
			duration: Math.round(utils.getTimeDelta()),
		});
	}

	private trackGptLibReady(): void {
		communicationService.on(eventsRepository.AD_ENGINE_GPT_READY, () => {
			this.sender.sendToMeteringSystem({
				action: 'gpt-ready',
				duration: Math.round(utils.getTimeDelta()),
			});
		});
	}

	private trackGamSlotRequest(): void {
		communicationService.onSlotEvent(AdSlotEvent.SLOT_REQUESTED_EVENT, ({ slot }) => {
			if (REPORTABLE_SLOTS.reportedGamSlotRequests.includes(slot.getSlotName())) return;
			this.sendSlotInfoToMeteringSystem(slot, 'request');
			REPORTABLE_SLOTS.reportedGamSlotRequests.push(slot.getSlotName());
		});
	}

	private trackGamSlotRendered(): void {
		communicationService.onSlotEvent(AdSlotEvent.SLOT_RENDERED_EVENT, ({ slot }) => {
			if (REPORTABLE_SLOTS.reportedGamSlotRenders.includes(slot.getSlotName())) return;
			this.sendSlotInfoToMeteringSystem(slot, 'render');
			REPORTABLE_SLOTS.reportedGamSlotRenders.push(slot.getSlotName());
		});
	}

	private sendSlotInfoToMeteringSystem(slot: AdSlot, state: string): void {
		if (!REPORTABLE_SLOTS.stateMetric.includes(slot.getSlotName())) {
			return;
		}

		this.sender.sendToMeteringSystem({
			action: `${state}_${slot.getSlotName()}`,
			duration: Math.round(utils.getTimeDelta()),
		});
	}
}
