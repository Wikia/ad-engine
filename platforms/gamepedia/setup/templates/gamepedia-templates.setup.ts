import { TemplatesSetup } from '@platforms/shared';
import {
	BigFancyAdAbove,
	context,
	LogoReplacement,
	PorvataTemplate,
	Roadblock,
	templateService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getBfaaConfigDesktop } from '../../templates/big-fancy-ad-above-config-desktop';
import { getBfaaConfigMobile } from '../../templates/big-fancy-ad-above-config-mobile';
import { getLogoReplacementConfig } from '../../templates/logo-replacement-config';
import { getPorvataConfig } from '../../templates/porvata-config';
import { getRoadblockConfig } from '../../templates/roadblock-config';

@Injectable()
export class GamepediaTemplatesSetup implements TemplatesSetup {
	configureTemplates(): void {
		templateService.register(
			BigFancyAdAbove,
			context.get('state.isMobile') ? getBfaaConfigMobile() : getBfaaConfigDesktop(),
		);
		templateService.register(LogoReplacement, getLogoReplacementConfig());
		templateService.register(PorvataTemplate, getPorvataConfig());
		templateService.register(Roadblock, getRoadblockConfig());
	}
}
