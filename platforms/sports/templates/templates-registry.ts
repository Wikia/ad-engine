import { BigFancyAdAbove, BigFancyAdBelow, templateService } from '@wikia/ad-engine';
import { getBfaaConfig } from './big-fancy-ad-above-config';
import { getBfabConfig } from './big-fancy-ad-below-config';

export const templateRegistry = {
	registerTemplates(): void {
		templateService.register(BigFancyAdAbove, getBfaaConfig());
		templateService.register(BigFancyAdBelow, getBfabConfig());
	},
};
