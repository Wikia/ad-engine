import { TemplateStateHandler } from "../../../../core/services/templates-registry/template-state-handler";
import { DomManipulator } from './manipulators/dom-manipulator';

export class DomCleanupHandler implements TemplateStateHandler {
	constructor(private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {
		// do nothing on enter
	}

	async onLeave(): Promise<void> {
		this.manipulator.restore();
	}
}
