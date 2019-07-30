import {
	BigFancyAdAbove,
	context,
	PorvataTemplate,
	Roadblock,
	templateService,
} from '@wikia/ad-engine';
import { getBfaaConfigDesktop } from './big-fancy-ad-above-config-desktop';
import { getBfaaConfigMobile } from './big-fancy-ad-above-config-mobile';
import { getPorvataConfig } from './porvata-config';
import { getRoadblockConfig } from './roadblock-config';

export const templateRegistry = {
	registerTemplates(): void {
		templateService.register(
			BigFancyAdAbove,
			context.get('state.isMobile') ? getBfaaConfigMobile() : getBfaaConfigDesktop(),
		);
		templateService.register(PorvataTemplate, getPorvataConfig());
		templateService.register(Roadblock, getRoadblockConfig());
	},
};
