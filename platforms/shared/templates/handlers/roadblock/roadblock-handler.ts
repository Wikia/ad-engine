import {
	context,
	TEMPLATE,
	TemplateDependency,
	TemplateStateHandler,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { RoadblockParams } from './roadblock-params';

const ROADBLOCK_CONFIG = Symbol('Roadblock Config');

interface RoadblockConfig {
	enabledSlots: string[];
	disableSlots: string[];
}

@Injectable({ autobind: false })
export class RoadblockHandler implements TemplateStateHandler {
	static config(config: RoadblockConfig): TemplateDependency<RoadblockConfig> {
		return {
			bind: ROADBLOCK_CONFIG,
			value: config,
		};
	}

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: RoadblockParams,
		@Inject(ROADBLOCK_CONFIG) private config: RoadblockConfig,
	) {}

	async onEnter(): Promise<void> {
		this.params.adProduct = 'ruap';
		universalAdPackage.init(this.params as any, this.config.enabledSlots, this.config.disableSlots);
		context.push('state.adStack', { id: 'invisible_skin' });
	}
}
