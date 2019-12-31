import {
	TemplateAdSlot,
	TemplateParams,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class InitialHandler implements TemplateStateHandler {
	constructor(private params: TemplateParams, private slot: TemplateAdSlot) {}

	async onEnter(transition: TemplateTransition): Promise<void> {}

	async onLeave(): Promise<void> {}
}
