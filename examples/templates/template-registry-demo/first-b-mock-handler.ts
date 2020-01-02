import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class FirstBMockHandler implements TemplateStateHandler {
	constructor() {}

	async onEnter(transition: TemplateTransition<'second'>): Promise<void> {
		console.log(`first - b enter`);
		transition('second');
	}

	async onLeave(): Promise<void> {
		console.log(`first - b leave`);
	}
}
