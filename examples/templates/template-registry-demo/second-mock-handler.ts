import {
	AdSlot,
	Dictionary,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class SecondMockHandler implements TemplateStateHandler {
	private id = Math.random() * 10;

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: Dictionary,
		@Inject(TEMPLATE.SLOT) private slot: AdSlot,
	) {}

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
