import {
	A9ConfigSetup,
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
import { context, InstantConfigService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from './fallback-config.json';
import { MutheadPrebidConfigSetup } from './setup/context/prebid/muthead-prebid-config.setup';
import { MutheadDynamicSlotsSetup } from './setup/dynamic-slots/muthead-dynamic-slots.setup';
import { MutheadTargetingSetup } from './setup/targeting/muthead-targeting.setup';

export async function setupMutheadIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(TargetingSetup).to(MutheadTargetingSetup);
	container.bind(TemplatesSetup).to(SportsTemplatesSetup);
	container.bind(AdsMode).to(SportsAdsMode);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(CurseSlotsStateSetup);
	container.bind(TrackingSetup).to(CommonTrackingSetup);
	container.bind(PrebidConfigSetup).to(MutheadPrebidConfigSetup);
	container.bind(A9ConfigSetup).to(SportsA9ConfigSetup);
	container.bind(DynamicSlotsSetup).to(MutheadDynamicSlotsSetup);

	return container;
}
