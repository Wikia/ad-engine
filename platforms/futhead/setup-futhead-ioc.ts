import {
	A9ConfigSetup,
	AdEngineRunnerSetup,
	AdsMode,
	BiddersStateSetup,
	CommonBiddersStateSetup,
	CommonTrackingSetup,
	CurseSlotsContextSetup,
	CurseSlotsStateSetup,
	DynamicSlotsSetup,
	PrebidConfigSetup,
	SlotsContextSetup,
	SlotsStateSetup,
	SportsA9ConfigSetup,
	SportsAdsMode,
	SportsTemplatesSetup,
	TargetingSetup,
	TemplatesSetup,
	TrackingSetup,
} from '@platforms/shared';
import { babDetection, context, InhibitorsRegistry, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import { FutheadAdEngineRunnerSetup } from './ad-engine-runner/futhead-ad-engine-runner.setup';
import * as fallbackInstantConfig from './fallback-config.json';
import { FutheadPrebidConfigSetup } from './setup/context/prebid/futhead-prebid-config.setup';
import { FutheadTargetingSetup } from './setup/context/targeting/futhead-targeting.setup';
import { FutheadDynamicSlotsSetup } from './setup/dynamic-slots/futhead-dynamic-slots.setup';

export async function setupFutheadIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(InhibitorsRegistry).value(new InhibitorsRegistry([babDetection]));

	container.bind(TargetingSetup).to(FutheadTargetingSetup);
	container.bind(TemplatesSetup).to(SportsTemplatesSetup);
	container.bind(AdEngineRunnerSetup).to(FutheadAdEngineRunnerSetup);
	container.bind(AdsMode).to(SportsAdsMode);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(CurseSlotsStateSetup);
	container.bind(TrackingSetup).to(CommonTrackingSetup);
	container.bind(PrebidConfigSetup).to(FutheadPrebidConfigSetup);
	container.bind(A9ConfigSetup).to(SportsA9ConfigSetup);
	container.bind(DynamicSlotsSetup).to(FutheadDynamicSlotsSetup);

	return container;
}
