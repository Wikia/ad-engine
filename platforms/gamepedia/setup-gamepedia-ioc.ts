import {
	A9ConfigSetup,
	AdsMode,
	BiddersStateSetup,
	CommonBiddersStateSetup,
	CurseSlotsContextSetup,
	CurseSlotsStateSetup,
	DynamicSlotsSetup,
	GamepediaA9ConfigSetup,
	NoAdsMode,
	PrebidConfigSetup,
	SlotsContextSetup,
	SlotsStateSetup,
	TargetingSetup,
	TemplatesSetup,
	TrackingSetup,
	UcpGamepediaPrebidConfigSetup,
} from '@platforms/shared';
import {
	bidderTrackingMiddleware,
	context,
	InstantConfigService,
	slotBiddersTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotTrackingMiddleware,
} from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from './fallback-config.json';
import { GamepediaAdsMode } from './modes/gamepedia-ads.mode';
import { GamepediaNoAdsMode } from './modes/gamepedia-no-ads.mode';
import { GamepediaTargetingSetup } from './setup/context/targeting/gamepedia-targeting.setup';
import { GamepediaDynamicSlotsSetup } from './setup/dynamic-slots/gamepedia-dynamic-slots.setup';
import { GamepediaTemplatesSetup } from './setup/templates/gamepedia-templates.setup';

export async function setupGamepediaIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(TargetingSetup).to(GamepediaTargetingSetup);
	container.bind(TemplatesSetup).to(GamepediaTemplatesSetup);
	container.bind(NoAdsMode).to(GamepediaNoAdsMode);
	container.bind(AdsMode).to(GamepediaAdsMode);
	container.bind(SlotsContextSetup).to(CurseSlotsContextSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsStateSetup).to(CurseSlotsStateSetup);
	container.bind(DynamicSlotsSetup).to(GamepediaDynamicSlotsSetup);
	container.bind(PrebidConfigSetup).to(UcpGamepediaPrebidConfigSetup);
	container.bind(A9ConfigSetup).to(GamepediaA9ConfigSetup);

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
