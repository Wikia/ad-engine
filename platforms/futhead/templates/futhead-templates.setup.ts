import { TemplatesSetup } from '@platforms/shared';
import { BigFancyAdAbove, BigFancyAdBelow, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { LogoReplacement } from '../../shared/templates-old/logo-replacement-template';
import { getBfaaConfig } from './big-fancy-ad-above-config';
import { getBfabConfig } from './big-fancy-ad-below-config';
import { getLogoReplacementConfig } from './logo-replacement-config';

@Injectable()
export class FutheadTemplatesSetup implements TemplatesSetup {
	configureTemplates(): void {
		templateService.register(BigFancyAdAbove, getBfaaConfig());
		templateService.register(BigFancyAdBelow, getBfabConfig());
		templateService.register(LogoReplacement, getLogoReplacementConfig());
	}
}
