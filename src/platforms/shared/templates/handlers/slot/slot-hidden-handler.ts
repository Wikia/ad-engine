import { AdSlot, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';

@injectable()
export class SlotHiddenHandler implements TemplateStateHandler {
	constructor(@inject(TEMPLATE.SLOT) private adSlot: AdSlot, private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {
		this.manipulator.element(this.adSlot.element).addClass(AdSlot.HIDDEN_CLASS);
		document.body.classList.remove('has-sticky-tlb');
		this.adSlot.emitEvent(AdSlot.HIDDEN_EVENT);
	}
}
