import {
	BigFancyAdAbove,
	context,
	DiProcess,
	PorvataTemplate,
	Roadblock,
	templateService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getBfaaConfigDesktop } from '../../templates/big-fancy-ad-above-config-desktop';
import { getBfaaConfigMobile } from '../../templates/big-fancy-ad-above-config-mobile';
import { LogoReplacementGamepediaTemplate } from '../../templates/logo-replacement/logo-replacement-gamepedia-template';
import { getPorvataConfig } from '../../templates/porvata-config';
import { getRoadblockConfig } from '../../templates/roadblock-config';

@Injectable()
export class GamepediaTemplatesSetup implements DiProcess {
	execute(): void {
		templateService.register(
			BigFancyAdAbove,
			context.get('state.isMobile') ? getBfaaConfigMobile() : getBfaaConfigDesktop(),
		);
		templateService.register(LogoReplacementGamepediaTemplate);
		templateService.register(PorvataTemplate, getPorvataConfig());
		templateService.register(Roadblock, getRoadblockConfig());
	}
}
