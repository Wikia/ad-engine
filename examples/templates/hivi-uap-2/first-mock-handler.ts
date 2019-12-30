import { Context, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class FirstMockHandler implements TemplateStateHandler {
	private id = Math.random() * 10;

	constructor(private context: Context) {}

	async onEnter(transition: TemplateTransition<'second'>): Promise<void> {
		console.log(`first mock handler (${this.id}) enter`);
		console.log(this.context.get('src'));
		setTimeout(() => transition('second'), 2000);
	}

	async onLeave(): Promise<void> {
		console.log(`first mock handler (${this.id}) leave`);
		console.log('#########################');
	}
}
