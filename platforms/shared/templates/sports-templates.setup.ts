import { BigFancyAdAbove, BigFancyAdBelow, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { TemplatesSetup } from '../setup/_templates.setup';
import { getBfaaConfig } from './big-fancy-ad-above-config';
import { getBfabConfig } from './big-fancy-ad-below-config';

@Injectable()
export class SportsTemplatesSetup implements TemplatesSetup {
	configureTemplates(): void {
		templateService.register(BigFancyAdAbove, getBfaaConfig());
		templateService.register(BigFancyAdBelow, getBfabConfig());
	}
}
