import { TemplateStateHandler } from "../../../../core/services/templates-registry/template-state-handler";

export class DebugTransitionHandler implements TemplateStateHandler {
	constructor(private name: string) {}

	async onEnter(transitionCallback): Promise<void> {
		(window.ads as any).transitions = (window.ads as any).transitions || {};
		(window.ads as any).transitions[this.name] = (state: any) =>
			transitionCallback(state, { allowMulticast: true });
	}

	async onDestroy(): Promise<void> {
		delete (window.ads as any).transitions[this.name];
	}
}
