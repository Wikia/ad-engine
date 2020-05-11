import { TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { DomManipulator } from '../helpers/manipulators/dom-manipulator';

@Injectable({ autobind: false })
export class PreventScrollingHandler implements TemplateStateHandler {
	constructor(private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {
		this.manipulator.element(document.documentElement).setProperty('overflow', 'hidden');
	}

	async onLeave(): Promise<void> {}
}
