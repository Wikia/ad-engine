import { BigFancyAdAbove, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { TemplatesSetup } from '../../shared/setup/_templates.setup';
import { getBfaaConfig } from './big-fancy-ad-above-config';

@Injectable()
export class UcpTemplatesSetup implements TemplatesSetup {
	configureTemplates(): void {
		templateService.register(BigFancyAdAbove, getBfaaConfig());
	}
}
