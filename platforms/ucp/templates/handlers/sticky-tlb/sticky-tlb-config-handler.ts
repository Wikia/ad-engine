import {
	AdSlot,
	slotService,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class StickyTlbConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'sticky'>): Promise<void> {
		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.hide();
		this.adSlot.setConfigProperty('useGptOnloadEvent', true);
		this.adSlot.loaded.then(() => {
			this.adSlot.emitEvent(universalAdPackage.SLOT_STICKY_READY_STATE);
		});

		slotService.disable('incontent_player', 'hivi-collapse');

		document.body.classList.add('has-bfaa');
		this.adSlot.addClass('expanded-slot');
		this.adSlot.addClass('sticky-tlb');
		this.adSlot.getAdContainer().classList.add('iframe-centered');
	}

	async onLeave(): Promise<void> {
		this.adSlot.show();
	}
}
