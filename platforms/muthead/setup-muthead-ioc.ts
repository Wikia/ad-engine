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
import { MutheadPrebidConfigSetup } from './setup/context/prebid/muthead-prebid-config.setup';
import { MutheadDynamicSlotsSetup } from './setup/dynamic-slots/muthead-dynamic-slots.setup';
import { MutheadTargetingSetup } from './setup/targeting/muthead-targeting.setup';
import { MutheadTemplatesSetup } from './templates/muthead-templates.setup';

export async function setupMutheadIoc(): Promise<Container> {
	const container = new Container();

	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(TargetingSetup).to(MutheadTargetingSetup);
	container.bind(TemplatesSetup).to(MutheadTemplatesSetup);
	container.bind(AdsMode).to(SportsAdsMode);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(CurseSlotsStateSetup);
	container.bind(PrebidConfigSetup).to(MutheadPrebidConfigSetup);
	container.bind(A9ConfigSetup).to(SportsA9ConfigSetup);
	container.bind(DynamicSlotsSetup).to(MutheadDynamicSlotsSetup);

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
