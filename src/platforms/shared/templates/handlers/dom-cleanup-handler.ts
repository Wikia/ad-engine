import { TemplateStateHandler } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';
import { DomManipulator } from '../helpers/manipulators/dom-manipulator';

/**
 * Resets DomManipulator on leave
 */
@injectable()
export class DomCleanupHandler implements TemplateStateHandler {
	constructor(private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {
		// do nothing on enter
	}

	async onLeave(): Promise<void> {
		this.manipulator.restore();
	}
}
