import {
	A9ConfigSetup,
	AdsMode,
	BiddersStateSetup,
	CommonBiddersStateSetup,
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
import {
	bidderTrackingMiddleware,
	context,
	InstantConfigService,
	slotBiddersTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotTrackingMiddleware,
	templateService,
} from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import { LogoReplacement } from '../shared/templates-old/logo-replacement-template';
import * as fallbackInstantConfig from './fallback-config.json';
import { FutheadPrebidConfigSetup } from './setup/context/prebid/futhead-prebid-config.setup';
import { FutheadTargetingSetup } from './setup/context/targeting/futhead-targeting.setup';
import { FutheadDynamicSlotsSetup } from './setup/dynamic-slots/futhead-dynamic-slots.setup';
import { getLogoReplacementConfig } from './templates/logo-replacement-config';

export async function setupFutheadIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(TargetingSetup).to(FutheadTargetingSetup);
	container.bind(TemplatesSetup).to(SportsTemplatesSetup);
	templateService.register(LogoReplacement, getLogoReplacementConfig());
	container.bind(AdsMode).to(SportsAdsMode);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(CurseSlotsStateSetup);
	container.bind(PrebidConfigSetup).to(FutheadPrebidConfigSetup);
	container.bind(A9ConfigSetup).to(SportsA9ConfigSetup);
	container.bind(DynamicSlotsSetup).to(FutheadDynamicSlotsSetup);

	TrackingSetup.provideMiddlewares({
		slotTrackingMiddlewares: [
			slotPropertiesTrackingMiddleware,
			slotBiddersTrackingMiddleware,
			slotTrackingMiddleware,
		],
		bidderTrackingMiddlewares: [bidderTrackingMiddleware],
	}).forEach((binder) => container.bind(binder));

	return container;
}
