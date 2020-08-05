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
	TargetingSetup,
	TemplatesSetup,
	TrackingSetup,
} from '@platforms/shared';
import {
	bidderTrackingMiddleware,
	InstantConfigService,
	slotBiddersTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotTrackingMiddleware,
} from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { FutheadPrebidConfigSetup } from './setup/context/prebid/futhead-prebid-config.setup';
import { FutheadTargetingSetup } from './setup/context/targeting/futhead-targeting.setup';
import { FutheadDynamicSlotsSetup } from './setup/dynamic-slots/futhead-dynamic-slots.setup';
import { FutheadTemplatesSetup } from './templates/futhead-templates.setup';

export async function setupFutheadIoc(): Promise<Container> {
	const container = new Container();

	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(TargetingSetup).to(FutheadTargetingSetup);
	container.bind(TemplatesSetup).to(FutheadTemplatesSetup);
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
