import {
	TemplateAdSlot,
	TemplateParams,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SecondMockHandler implements TemplateStateHandler {
	private id = Math.random() * 10;

	constructor(private params: TemplateParams, private slot: TemplateAdSlot) {}

	async onEnter(transition: TemplateTransition<'first'>): Promise<void> {
		console.log(`second mock handler (${this.id}) enter`);
		console.log(this.params, this.slot);
		setTimeout(() => transition('first'), 2000);
	}

	async onLeave(): Promise<void> {
		console.log(`second mock handler (${this.id}) leave`);
		console.log('#########################');
	}
}
