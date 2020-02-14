import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SecondAMockHandler implements TemplateStateHandler {
	constructor() {}

	async onEnter(transition: TemplateTransition<'first'>): Promise<void> {
		console.log(`second - a enter`);
	}

	async onLeave(): Promise<void> {
		console.log(`second - a leave`);
	}
}
