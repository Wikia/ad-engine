import { DomManipulator } from '@platforms/shared';
import { HIDDEN_AD_CLASS, TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class FloorAdhesionAnchorHiddenHandler implements TemplateStateHandler {
	constructor(private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {
		this.manipulator
			.element(document.getElementById('floor_adhesion_anchor'))
			.addClass(HIDDEN_AD_CLASS);
	}
}
