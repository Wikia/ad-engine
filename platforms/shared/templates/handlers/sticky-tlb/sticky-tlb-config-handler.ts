import {
	AdSlot,
	context,
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

		if (context.get('templates.stickyTlb.forced')) {
			document.body.classList.add('has-sticky-tlb');
		}
	}

	async onDestroy(): Promise<void> {
		document.body.classList.remove('has-uap');

		if (context.get('templates.stickyTlb.forced')) {
			document.body.classList.remove('has-sticky-tlb');
		}
	}
}
