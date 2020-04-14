import { AdSlot, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';

@Injectable({ autobind: false })
export class SlotHiddenHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot, private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {
		this.manipulator.element(this.adSlot.element).addClass(AdSlot.HIDDEN_CLASS);
	}

	async onLeave(): Promise<void> {}
}
