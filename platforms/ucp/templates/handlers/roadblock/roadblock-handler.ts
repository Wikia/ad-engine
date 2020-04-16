import { context, TEMPLATE, TemplateStateHandler, universalAdPackage } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { RoadblockParams } from './roadblock-params';

@Injectable({ autobind: false })
export class RoadblockHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.PARAMS) private params: RoadblockParams) {}

	async onEnter(): Promise<void> {
		const enabledSlots: string[] = ['top_boxad', 'invisible_skin'];
		const disableSlots: string[] = ['incontent_player', 'floor_adhesion'];

		this.params.adProduct = 'ruap';
		universalAdPackage.init(this.params as any, enabledSlots, disableSlots);
		context.push('state.adStack', { id: 'invisible_skin' });
	}

	async onLeave(): Promise<void> {}
}
