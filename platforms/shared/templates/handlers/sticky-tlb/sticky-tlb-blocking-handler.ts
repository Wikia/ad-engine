import {
	AdSlot,
	communicationService,
	context,
	eventsRepository,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapLoadStatus,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

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
		if (!this.isStickyTlbForced() && !this.isLineAndGeo()) {
			this.blockStickyTLB(`Line item ID ${this.adSlot.lineItemId}`);
			return;
		}

		transition('initial');
	}

	private blockStickyTLB(reason: string): void {
		this.adSlot.emitEvent(universalAdPackage.SLOT_STICKINESS_DISABLED);
		this.logger(`Template 'stickyTlb' could not be applied for ${reason}`);
	}

	private isLineAndGeo(): boolean {
		const lines: string[] = context.get('templates.stickyTlb.lineItemIds') || [];

		if (Array.isArray(lines)) {
			return lines
				.map((line) => line.toString())
				.some((line) => {
					const [lineId, geo] = line.split(':', 2);

					return (
						lineId.toString() === this.adSlot.lineItemId.toString() &&
						(!geo || utils.geoService.isProperGeo([geo]))
					);
				});
		}
		return false;
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

	private isStickyTlbForced(): boolean {
		return context.get('templates.stickyTlb.forced');
	}

	private logger(...logMsgs: any): void {
		utils.logger(StickyTlbBlockingHandler.LOG_GROUP, ...logMsgs);
	}
}
