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
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'initial'>): Promise<void> {
		if (!this.isLineAndGeo()) {
			this.adSlot.emitEvent(universalAdPackage.SLOT_STICKINESS_DISABLED);
			return;
		}

		slotService.disable('incontent_player', 'hivi-collapse');

		transition('initial');
	}

	private isLineAndGeo(): boolean {
		const lines: string[] = context.get('templates.stickyTlb.lineItemIds') || [];

		if (Array.isArray(lines)) {
			return lines.some((line) => {
				const [lineId, geo] = line.split(':', 2);

				return (
					lineId.toString() === this.adSlot.lineItemId.toString() &&
					(!geo || utils.geoService.isProperGeo([geo]))
				);
			});
		}
		return false;
	}

	async onLeave(): Promise<void> {}
}
