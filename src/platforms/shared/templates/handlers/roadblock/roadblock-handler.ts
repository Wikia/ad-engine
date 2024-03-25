import {
	communicationService,
	context,
	TEMPLATE,
	TemplateDependency,
	TemplateStateHandler,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { RoadblockParams } from './roadblock-params';
import { AD_ENGINE_UAP_NTC_LOADED } from "../../../../../communication/events/events-ad-engine-uap";

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

		if (this.params.newTakeoverConfig) {
			if (context.get('state.isMobile')) {
				this.config.enabledSlots.push('floor_adhesion');
			}

			communicationService.emit(AD_ENGINE_UAP_NTC_LOADED);
		}

		if (this.params.stickedTlb) {
			context.set('templates.stickyTlb.forced', true);
		}

		universalAdPackage.init(this.params as any, this.config.enabledSlots, this.config.disableSlots);
	}
}
