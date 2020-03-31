import { TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { DomManipulator } from '../helpers/manipulators/dom-manipulator';

/**
 * Resets DomManipulator on leave
 */
@Injectable({ autobind: false })
export class DomCleanupHandler implements TemplateStateHandler {
	constructor(private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {}

	async onLeave(): Promise<void> {
		this.manipulator.restore();
	}
}
