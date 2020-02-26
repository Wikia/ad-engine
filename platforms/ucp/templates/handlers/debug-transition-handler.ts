import { TEMPLATE, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable()
export class DebugTransitionHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.NAME) private name: string) {}

	async onEnter(transition: TemplateTransition<any>): Promise<void> {
		(window.ads as any).transitions = (window.ads as any).transitions || {};
		(window.ads as any).transitions[this.name] = (state: any) =>
			transition(state, { allowMulticast: true });
	}

	async onLeave(): Promise<void> {}
}
