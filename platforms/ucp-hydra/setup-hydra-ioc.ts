import {
	A9ConfigSetup,
	AdsMode,
	BaseContextSetup,
	BiddersStateSetup,
	CommonBiddersStateSetup,
	DynamicSlotsSetup,
	GamepediaA9ConfigSetup,
	NoAdsMode,
	PrebidConfigSetup,
	SlotsContextSetup,
	SlotsStateSetup,
	TargetingSetup,
	TemplatesSetup,
	TrackingSetup,
	UcpBaseContextSetup,
	UcpGamepediaPrebidConfigSetup,
	UcpNoAdsMode,
	UcpTargetingSetup,
	UcpWikiContextSetup,
	WikiContextSetup,
} from '@platforms/shared';
import {
	bidderTrackingMiddleware,
	context,
	FOOTER,
	InstantConfigService,
	NAVBAR,
	PAGE,
	slotBiddersTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotTrackingMiddleware,
} from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from './fallback-config.json';
import { HydraAdsMode } from './modes/hydra-ads-mode';
import { HydraSlotsContextSetup } from './setup/context/slots/hydra-slots-context-setup';
import { HydraDynamicSlotsSetup } from './setup/dynamic-slots/hydra-dynamic-slots-setup';
import { HydraSlotsStateSetup } from './setup/state/slots/hydra-slots-state-setup';
import { UcpHydraTemplatesSetup } from './templates/ucp-hydra-templates.setup';

export async function setupHydraIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(BaseContextSetup).to(UcpBaseContextSetup);
	container.bind(WikiContextSetup).to(UcpWikiContextSetup);
	container.bind(TargetingSetup).to(UcpTargetingSetup);
	container.bind(UcpTargetingSetup.skin('hydra'));
	container.bind(AdsMode).to(HydraAdsMode);
	container.bind(NoAdsMode).to(UcpNoAdsMode);
	container.bind(SlotsStateSetup).to(HydraSlotsStateSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(SlotsContextSetup).to(HydraSlotsContextSetup);
	container.bind(DynamicSlotsSetup).to(HydraDynamicSlotsSetup);
	container.bind(TemplatesSetup).to(UcpHydraTemplatesSetup);
	container.bind(NAVBAR).value(document.querySelector('#netbar'));
	container.bind(FOOTER).value(document.querySelector('#gamepedia-footer'));
	container.bind(PAGE).value(document.querySelector('#global-wrapper'));
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
