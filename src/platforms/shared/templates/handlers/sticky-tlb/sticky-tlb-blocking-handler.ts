import {
	AdSlot,
	babDetection,
	communicationService,
	eventsRepository,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapLoadStatus,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { StickyTlbAllowanceExaminer } from './sticky-tlb-allowance-examiner';

@Injectable({ autobind: false })
export class StickyTlbBlockingHandler implements TemplateStateHandler {
	static LOG_GROUP = 'sticky-tlb';

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'initial'>): Promise<void> {
		const isUap = await this.isUAP();
		if (isUap) {
			this.blockStickyTLB('UAP');
			return;
		}
		const stickyExaminer = new StickyTlbAllowanceExaminer(this.adSlot);
		if (!stickyExaminer.shouldStick()) {
			this.blockStickyTLB(`Stickiness forced`);
			return;
		}
		if (babDetection.isBlocking()) {
			this.blockStickyTLB('AdBlock');
			return;
		}

		transition('initial');
	}

	private blockStickyTLB(reason: string): void {
		this.adSlot.emitEvent(universalAdPackage.SLOT_STICKINESS_DISABLED);
		this.logger(`Template 'stickyTlb' could not be applied for ${reason}`);
	}

	private async isUAP(): Promise<boolean> {
		return new Promise((resolve) => {
			communicationService.on(
				eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
				(action: UapLoadStatus) => {
					resolve(action.isLoaded);
				},
			);
		});
	}

	private logger(...logMsgs: any): void {
		utils.logger(StickyTlbBlockingHandler.LOG_GROUP, ...logMsgs);
	}
}
