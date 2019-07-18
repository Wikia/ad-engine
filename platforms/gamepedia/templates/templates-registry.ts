import { BigFancyAdAbove, context, PorvataTemplate, templateService } from '@wikia/ad-engine';
import { getBfaaConfigDesktop } from './big-fancy-ad-above-config-desktop';
import { getBfaaConfigMobile } from './big-fancy-ad-above-config-mobile';
import { getPorvataConfig } from './porvata-config';

export const templateRegistry = {
	registerTemplates(): void {
		templateService.register(
			BigFancyAdAbove,
			context.get('state.isMobile') ? getBfaaConfigMobile() : getBfaaConfigDesktop(),
		);
		templateService.register(PorvataTemplate, getPorvataConfig());
	},
};
