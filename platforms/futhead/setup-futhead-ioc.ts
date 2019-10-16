import {
	A9ConfigSetup,
	AdEngineRunnerSetup,
	AdsMode,
	BiddersStateSetup,
	CommonAdEngineRunnerSetup,
	CommonBiddersStateSetup,
	CommonContextSetup,
	CommonStateSetup,
	CommonTrackingSetup,
	ContextSetup,
	CurseSlotsContextSetup,
	CurseUapSetup,
	DelayModulesSetup,
	DynamicSlotsSetup,
	PrebidConfigSetup,
	SlotsContextSetup,
	SlotsStateSetup,
	SportsA9ConfigSetup,
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
import { SportsDynamicSlotsSetup } from '../shared/setup/dynamic-slots/sports-dynamic-slots.setup';
import * as fallbackInstantConfig from './fallback-config.json';
import { FutheadPrebidConfigSetup } from './setup/context/prebid/futhead-prebid-config.setup';
import { FutheadTargetingSetup } from './setup/context/targeting/futhead-targeting.setup';
import { FutheadSlotsStateSetup } from './setup/state/slots/futhead-slots-state.setup';

export async function setupFutheadIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(TargetingSetup).to(FutheadTargetingSetup);
	container.bind(TemplatesSetup).to(SportsTemplatesSetup);
	container.bind(DelayModulesSetup).to(SportsDelayModulesSetup);
	container.bind(AdEngineRunnerSetup).to(CommonAdEngineRunnerSetup);
	container.bind(AdsMode).to(SportsAdsMode);
	container.bind(ContextSetup).to(CommonContextSetup);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(StateSetup).to(CommonStateSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(FutheadSlotsStateSetup);
	container.bind(UapSetup).to(CurseUapSetup);
	container.bind(TrackingSetup).to(CommonTrackingSetup);
	container.bind(PrebidConfigSetup).to(FutheadPrebidConfigSetup);
	container.bind(A9ConfigSetup).to(SportsA9ConfigSetup);
	container.bind(DynamicSlotsSetup).to(SportsDynamicSlotsSetup);

	return container;
}
