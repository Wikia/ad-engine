import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class FirstAMockHandler implements TemplateStateHandler {
	constructor() {}

	async onEnter(transition: TemplateTransition<'second'>): Promise<void> {
		console.log(`first - a enter`);
		transition('second');
	}

	async onLeave(): Promise<void> {
		console.log(`first - a leave`);
	}
}
