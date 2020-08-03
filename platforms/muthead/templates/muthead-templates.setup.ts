import { getBfaaConfig, getBfabConfig, TemplatesSetup } from '@platforms/shared';
import { BigFancyAdAbove, BigFancyAdBelow, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { LogoReplacement } from './logo-replacement/logo-replacement-muthead-template';

@Injectable()
export class MutheadTemplatesSetup implements TemplatesSetup {
	execute(): void {
		templateService.register(BigFancyAdAbove, getBfaaConfig());
		templateService.register(BigFancyAdBelow, getBfabConfig());
		templateService.register(LogoReplacement);
	}
}
