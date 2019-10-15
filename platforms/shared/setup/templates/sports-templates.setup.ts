import { BigFancyAdAbove, BigFancyAdBelow, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getBfaaConfig } from '../../templates/big-fancy-ad-above-config';
import { getBfabConfig } from '../../templates/big-fancy-ad-below-config';
import { TemplatesSetup } from './_templates.setup';

@Injectable()
export class SportsTemplatesSetup implements TemplatesSetup {
	configureTemplates(): void {
		templateService.register(BigFancyAdAbove, getBfaaConfig());
		templateService.register(BigFancyAdBelow, getBfabConfig());
	}
}
