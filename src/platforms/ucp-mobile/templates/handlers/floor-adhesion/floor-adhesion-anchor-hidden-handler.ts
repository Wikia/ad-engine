import { DomManipulator } from '@platforms/shared';
import { AdSlot, TemplateStateHandler } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class FloorAdhesionAnchorHiddenHandler implements TemplateStateHandler {
	constructor(private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {
		this.manipulator
			.element(document.getElementById('floor_adhesion_anchor'))
			.addClass(AdSlot.HIDDEN_CLASS);
	}
}
