import {
	BiddersConfigSetup,
	DelayModulesSetup,
	PlatformAdsMode,
	TargetingSetup,
	TemplateSetup,
} from '@platforms/shared';
import {
	SportsAdsMode,
	SportsDelayModulesSetup,
	SportsTemplateSetup,
} from '@platforms/shared-sports';
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import { MutheadBiddersConfigSetup } from '../bidders/bidders-config-setup';
import * as fallbackInstantConfig from '../fallback-config.json';
import { MutheadTargetingSetup } from './targeting-setup';

export async function setupIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(TargetingSetup).to(MutheadTargetingSetup);
	container.bind(BiddersConfigSetup).to(MutheadBiddersConfigSetup);
	container.bind(TemplateSetup).to(SportsTemplateSetup);
	container.bind(DelayModulesSetup).to(SportsDelayModulesSetup);
	container.bind(PlatformAdsMode).to(SportsAdsMode);

	return container;
}
