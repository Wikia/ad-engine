import { TemplatesSetup } from '@platforms/shared';
import { BigFancyAdAbove, BigFancyAdBelow, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getBfaaConfig } from './big-fancy-ad-above-config';
import { getBfabConfig } from './big-fancy-ad-below-config';
import { LogoReplacement } from './logo-replacement-template';

@Injectable()
export class FutheadTemplatesSetup implements TemplatesSetup {
	configureTemplates(): void {
		templateService.register(BigFancyAdAbove, getBfaaConfig());
		templateService.register(BigFancyAdBelow, getBfabConfig());
		templateService.register(LogoReplacement);
	}
}
