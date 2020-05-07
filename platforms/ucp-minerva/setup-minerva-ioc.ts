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
	context,
	FOOTER,
	InstantConfigService,
	NAVBAR,
	PAGE,
	slotBiddersTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
} from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from './fallback-config.json';
import { MinervaAdsMode } from './modes/minerva-ads-mode';
import { MinervaSlotsContextSetup } from './setup/context/slots/minerva-slots-context-setup';
import { MinervaDynamicSlotsSetup } from './setup/dynamic-slots/minerva-dynamic-slots-setup';
import { MinervaSlotsStateSetup } from './setup/state/slots/minerva-slots-state-setup';
import { UcpMinervaTemplatesSetup } from './templates/ucp-minerva-templates.setup';

export async function setupMinervaIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService as any).value(await InstantConfigService.init());
	container.bind(BaseContextSetup).to(UcpBaseContextSetup);
	container.bind(WikiContextSetup).to(UcpWikiContextSetup);
	container.bind(TargetingSetup).to(UcpTargetingSetup);
	container.bind(UcpTargetingSetup.skin('minerva'));
	container.bind(AdsMode).to(MinervaAdsMode);
	container.bind(NoAdsMode).to(UcpNoAdsMode);
	container.bind(SlotsStateSetup).to(MinervaSlotsStateSetup);
	container.bind(SlotsContextSetup).to(MinervaSlotsContextSetup);
	container.bind(DynamicSlotsSetup).to(MinervaDynamicSlotsSetup);
	container.bind(TemplatesSetup).to(UcpMinervaTemplatesSetup);
	container.bind(NAVBAR).value(document.querySelector('.header-container'));
	container.bind(FOOTER).value(document.querySelector('.minerva-footer'));
	container.bind(PAGE).value(document.querySelector('#content'));
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(PrebidConfigSetup).to(UcpGamepediaPrebidConfigSetup);
	container.bind(A9ConfigSetup).to(GamepediaA9ConfigSetup);

	TrackingSetup.provideMiddlewares({
		slotTrackingMiddlewares: [slotPropertiesTrackingMiddleware, slotBiddersTrackingMiddleware],
	}).forEach((binder) => container.bind(binder));

	return container;
}
