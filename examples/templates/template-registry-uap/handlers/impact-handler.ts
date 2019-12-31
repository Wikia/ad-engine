import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class ImpactHandler implements TemplateStateHandler {
	constructor() {}

	async onEnter(transition: TemplateTransition<'sticky' | 'transition'>): Promise<void> {
		console.log('impact');
	}

	async onLeave(): Promise<void> {}
}
