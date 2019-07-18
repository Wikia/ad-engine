import { BigFancyAdAbove, templateService, utils } from '@wikia/ad-engine';
import { getBfaaConfigDesktop } from './big-fancy-ad-above-config-desktop';
import { getBfaaConfigMobile } from './big-fancy-ad-above-config-mobile';

export const templateRegistry = {
	registerTemplates(): void {
		templateService.register(
			BigFancyAdAbove,
			utils.client.isDesktop() ? getBfaaConfigDesktop() : getBfaaConfigMobile(),
		);
	},
};
