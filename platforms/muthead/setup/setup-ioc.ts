import {
	AdsMode,
	BiddersConfigSetup,
	BiddersStateSetup,
	CommonBiddersStateSetup,
	CommonContextSetup,
	CommonStateSetup,
	CommonTrackingSetup,
	ContextSetup,
	CurseDynamicSlotsSetup,
	CurseSlotsContextSetup,
	CurseSlotsStateSetup,
	CurseUapSetup,
	DelayModulesSetup,
	DynamicSlotsSetup,
	SlotsContextSetup,
	SlotsStateSetup,
	SportsAdsMode,
	SportsDelayModulesSetup,
	SportsTemplatesSetup,
	StateSetup,
	TargetingSetup,
	TemplatesSetup,
	TrackingSetup,
	UapSetup,
} from '@platforms/shared';
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
	container.bind(TemplatesSetup).to(SportsTemplatesSetup);
	container.bind(DelayModulesSetup).to(SportsDelayModulesSetup);
	container.bind(AdsMode).to(SportsAdsMode);
	container.bind(ContextSetup).to(CommonContextSetup);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(StateSetup).to(CommonStateSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(CurseSlotsStateSetup);
	container.bind(UapSetup).to(CurseUapSetup);
	container.bind(DynamicSlotsSetup).to(CurseDynamicSlotsSetup);
	container.bind(TrackingSetup).to(CommonTrackingSetup);

	return container;
}
