import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SecondBMockHandler implements TemplateStateHandler {
	constructor() {}

	async onEnter(transition: TemplateTransition<'first'>): Promise<void> {
		console.log(`second - b enter`);
	}

	async onLeave(): Promise<void> {
		console.log(`second - b leave`);
	}
}
