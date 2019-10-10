import {
	BiddersConfigSetup,
	BiddersStateSetup,
	CommonBiddersStateSetup,
	CommonContextSetup,
	CommonStateSetup,
	ContextSetup,
	CurseSlotsContextSetup,
	CurseSlotsStateSetup,
	CurseUapSetup,
	DelayModulesSetup,
	PlatformAdsMode,
	SlotsContextSetup,
	SlotsStateSetup,
	StateSetup,
	TargetingSetup,
	TemplateSetup,
	UapSetup,
} from '@platforms/shared';
import {
	SportsAdsMode,
	SportsDelayModulesSetup,
	SportsTemplateSetup,
} from '@platforms/shared-sports';
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from '../fallback-config.json';
import { MutheadBiddersConfigSetup } from './context/bidders/muthead-bidders-config.setup';
import { MutheadTargetingSetup } from './targeting/muthead-targeting.setup';

export async function setupIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(TargetingSetup).to(MutheadTargetingSetup);
	container.bind(BiddersConfigSetup).to(MutheadBiddersConfigSetup);
	container.bind(TemplateSetup).to(SportsTemplateSetup);
	container.bind(DelayModulesSetup).to(SportsDelayModulesSetup);
	container.bind(PlatformAdsMode).to(SportsAdsMode);
	container.bind(ContextSetup).to(CommonContextSetup);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(StateSetup).to(CommonStateSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(CurseSlotsStateSetup);
	container.bind(UapSetup).to(CurseUapSetup);

	return container;
}
