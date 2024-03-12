import { TemplateStateHandler } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';
import { DomManipulator } from '../helpers/manipulators/dom-manipulator';

/**
 * Resets DomManipulator on leave
 */
@Injectable({ autobind: false })
export class DomCleanupHandler implements TemplateStateHandler {
	constructor(private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {
		// do nothing on enter
	}

	async onLeave(): Promise<void> {
		this.manipulator.restore();
	}
}
