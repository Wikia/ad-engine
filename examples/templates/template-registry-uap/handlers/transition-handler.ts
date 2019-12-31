import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TransitionHandler implements TemplateStateHandler {
	constructor() {}

	async onEnter(transition: TemplateTransition<'resolved'>): Promise<void> {}

	async onLeave(): Promise<void> {}
}
