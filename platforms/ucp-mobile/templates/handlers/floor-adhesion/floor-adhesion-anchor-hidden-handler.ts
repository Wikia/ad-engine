import { DomManipulator } from '@platforms/shared';
import { AdSlot, TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class FloorAdhesionAnchorHiddenHandler implements TemplateStateHandler {
	constructor(private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {
		this.manipulator
			.element(document.getElementById('floor_adhesion_anchor'))
			.addClass(AdSlot.HIDDEN_CLASS);
	}
}
