import { TEMPLATE, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';

@injectable()
export class DebugTransitionHandler implements TemplateStateHandler {
	constructor(@inject(TEMPLATE.NAME) private name: string) {}

	async onEnter(transition: TemplateTransition<any>): Promise<void> {
		(window.ads as any).transitions = (window.ads as any).transitions || {};
		(window.ads as any).transitions[this.name] = (state: any) =>
			transition(state, { allowMulticast: true });
	}

	async onDestroy(): Promise<void> {
		delete (window.ads as any).transitions[this.name];
	}
}
