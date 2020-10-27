import { getBfaaConfig, getBfabConfig } from '@platforms/shared';
import { BigFancyAdAbove, BigFancyAdBelow, DiProcess, templateService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { LogoReplacement } from './logo-replacement/logo-replacement-futhead-template';

@Injectable()
export class FutheadTemplatesSetup implements DiProcess {
	execute(): void {
		templateService.register(BigFancyAdAbove, getBfaaConfig());
		templateService.register(BigFancyAdBelow, getBfabConfig());
		templateService.register(LogoReplacement);
	}
}
