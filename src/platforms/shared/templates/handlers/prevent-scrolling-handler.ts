import { TemplateStateHandler } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';
import { DomManipulator } from '../helpers/manipulators/dom-manipulator';

@injectable()
export class PreventScrollingHandler implements TemplateStateHandler {
	constructor(private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {
		this.manipulator.element(document.documentElement).setProperty('overflow', 'hidden');
	}
}
