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
};

export class MetricReporter {
	private readonly isActive: boolean;
	private initTimeDuration: number;
	private clockTicks: number;

	constructor(private readonly sender: MetricReporterSender) {
		this.isActive = utils.outboundTrafficRestrict.isOutboundTrafficAllowed('monitoring-default');
	}

	initialise() {
		if (!this.isActive) {
			return;
		}

		this.initTimeDuration = utils.getTimeDelta();
		this.clockTicks = 0;
		this.initClock();

		this.trackLibInitialization();
		this.trackGptLibReady();

		this.trackGamSlotRequest();
		this.trackGamSlotRendered();
	}

	private initClock(): void {
		setInterval(() => {
			this.clockTicks++;
		}, 100);
	}

	private trackLibInitialization(): void {
		this.sender.sendToMeteringSystem({
			action: 'init',
			duration: this.initTimeDuration,
		});
	}

	private trackGptLibReady(): void {
		communicationService.on(eventsRepository.AD_ENGINE_GPT_READY, () => {
			this.sender.sendToMeteringSystem({
				action: 'gpt-ready',
				duration: utils.getTimeDelta(),
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
			duration: this.getOwnTimeDelta(),
		});
	}

	private getOwnTimeDelta(): number {
		return this.initTimeDuration + this.clockTicks * 100;
	}
}
