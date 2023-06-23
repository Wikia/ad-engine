import { AdSlot, TEMPLATE, TemplateStateHandler, universalAdPackage } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class StickyLocTopConfigHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(): Promise<void> {
		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.addClass('expanded-slot');
		this.adSlot.addClass('sticky-loc-top');

		this.adSlot.setConfigProperty('useGptOnloadEvent', true);
		this.adSlot.loaded.then(() => {
			this.adSlot.emitEvent(universalAdPackage.SLOT_STICKY_READY_STATE);
		});
	}

	async onLeave(): Promise<void> {
		this.adSlot.show();
		document.body.classList.add('has-sticky-loc-top');
		document.body.classList.add('has-uap');
	}

	async onDestroy(): Promise<void> {
		document.body.classList.remove('has-sticky-loc-top');
		document.body.classList.remove('has-uap');
	}
}
