import { AdSlotClass, TemplateStateHandler } from '@ad-engine/core';
import { DomManipulator } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class FloorAdhesionAnchorHiddenHandler implements TemplateStateHandler {
	constructor(private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {
		this.manipulator
			.element(document.getElementById('floor_adhesion_anchor'))
			.addClass('hide', AdSlotClass.HIDDEN_AD_CLASS);
	}
}
