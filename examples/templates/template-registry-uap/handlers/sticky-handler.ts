import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class StickyHandler implements TemplateStateHandler {
	constructor() {}

	async onEnter(transition: TemplateTransition<'transition'>): Promise<void> {}

	async onLeave(): Promise<void> {}
}
