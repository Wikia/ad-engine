import { AdSlot, TEMPLATE, TemplateStateHandler, universalAdPackage } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class StickyTlbConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(): Promise<void> {
		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.addClass('expanded-slot');
		this.adSlot.addClass('sticky-tlb');

		this.adSlot.setConfigProperty('useGptOnloadEvent', true);
		this.adSlot.loaded.then(() => {
			this.adSlot.emitEvent(universalAdPackage.SLOT_STICKY_READY_STATE);
		});
	}

	async onLeave(): Promise<void> {
		this.adSlot.show();
		document.body.classList.add('has-uap');
		document.body.classList.add('has-sticky-tlb');
	}

	async onDestroy(): Promise<void> {
		document.body.classList.remove('has-uap');
		document.body.classList.remove('has-sticky-tlb');
	}
}
