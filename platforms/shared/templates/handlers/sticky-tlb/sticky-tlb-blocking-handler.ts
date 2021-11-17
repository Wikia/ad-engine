import {
	AdSlot,
	adSlotEvent,
	communicationService,
	context,
	slotService,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class StickyTlbBlockingHandler implements TemplateStateHandler {
	static LOG_GROUP = 'sticky-tlb';

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'initial'>): Promise<void> {
		if (this.isStickyTlbForced() || this.isLineAndGeo()) {
			this.logger('Disabling incontent_player and affiliate_slot');
			slotService.disable('incontent_player', 'hivi-collapse');
			slotService.disable('affiliate_slot', 'hivi-collapse');
			communicationService.dispatch(
				adSlotEvent({
					event: 'Stick TLB',
					adSlotName: this.adSlot.getSlotName(),
				}),
			);
			transition('initial');
		} else {
			this.adSlot.emitEvent(universalAdPackage.SLOT_STICKINESS_DISABLED);
			this.logger(
				`Template 'stickyTlb' could not be applied for Line item ID ${this.adSlot.lineItemId}`,
			);
		}
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

	private isStickyTlbForced(): boolean {
		return context.get('templates.stickyTlb.forced');
	}

	private logger(...logMsgs: any): void {
		utils.logger(StickyTlbBlockingHandler.LOG_GROUP, ...logMsgs);
	}
}
