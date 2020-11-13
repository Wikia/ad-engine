import {
	AdSlot,
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
		if (!this.isLineAndGeo()) {
			this.adSlot.emitEvent(universalAdPackage.SLOT_STICKINESS_DISABLED);
			this.logger(`Line item ID ${this.adSlot.lineItemId} not listed on sticky list`);
			return;
		}

		this.logger('Disabling incontent_player and affiliate_slot');
		slotService.disable('incontent_player', 'hivi-collapse');
		slotService.disable('affiliate_slot', 'hivi-collapse');

		transition('initial');
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

	private logger(...logMsgs: any): void {
		utils.logger(StickyTlbBlockingHandler.LOG_GROUP, ...logMsgs);
	}
}
