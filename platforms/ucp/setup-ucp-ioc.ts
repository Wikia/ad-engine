import {
	A9ConfigSetup,
	AdsMode,
	BaseContextSetup,
	BiddersStateSetup,
	BillTheLizardSetup,
	CommonBiddersStateSetup,
	DynamicSlotsSetup,
	NoAdsMode,
	PrebidConfigSetup,
	SlotsContextSetup,
	SlotsStateSetup,
	TargetingSetup,
	TemplatesSetup,
	TrackingSetup,
	UcpBaseContextSetup,
	UcpNoAdsMode,
	UcpTargetingSetup,
	UcpWikiContextSetup,
	WikiContextSetup,
} from '@platforms/shared';
import {
	bidderTrackingMiddleware,
	context,
	InstantConfigService,
	slotBiddersTrackingMiddleware,
	slotBillTheLizardStatusTrackingMiddleware,
	slotPropertiesTrackingMiddleware,
	slotTrackingMiddleware,
} from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { set } from 'lodash';
import * as fallbackInstantConfig from './fallback-config.json';
import { UcpAdsMode } from './modes/ucp-ads.mode';
import { UcpA9ConfigSetup } from './setup/context/a9/a9';
import { UcpBillTheLizardSetup } from './setup/context/bill-the-lizard/bill-the-lizard.setup';
import { UcpPrebidConfigSetup } from './setup/context/prebid/ucp-prebid-config.setup';
import { UcpSlotsContextSetup } from './setup/context/slots/ucp-slots-context.setup';
import { UcpDynamicSlotsSetup } from './setup/dynamic-slots/ucp-dynamic-slots.setup';
import { UcpSlotsStateSetup } from './setup/state/slots/ucp-slots-state-setup';
import { UcpTemplatesSetup } from './templates/ucp-templates.setup';

export async function setupUcpIoc(): Promise<Container> {
	const container = new Container();

	set(window, context.get('services.instantConfig.fallbackConfigKey'), fallbackInstantConfig);
	container.bind(InstantConfigService).value(await InstantConfigService.init());
	container.bind(BaseContextSetup).to(UcpBaseContextSetup);
	container.bind(WikiContextSetup).to(UcpWikiContextSetup);
	container.bind(TargetingSetup).to(UcpTargetingSetup);
	container.bind(UcpTargetingSetup.skin('oasis'));
	container.bind(AdsMode).to(UcpAdsMode);
	container.bind(NoAdsMode).to(UcpNoAdsMode);
	container.bind(SlotsStateSetup).to(UcpSlotsStateSetup);
	container.bind(SlotsContextSetup).to(UcpSlotsContextSetup);
	container.bind(DynamicSlotsSetup).to(UcpDynamicSlotsSetup);
	container.bind(TemplatesSetup).to(UcpTemplatesSetup);
	container.bind(BillTheLizardSetup).to(UcpBillTheLizardSetup);
	container.bind(BiddersStateSetup).to(CommonBiddersStateSetup);
	container.bind(PrebidConfigSetup).to(UcpPrebidConfigSetup);
	container.bind(A9ConfigSetup).to(UcpA9ConfigSetup);

	TrackingSetup.provideMiddlewares({
		slotTrackingMiddlewares: [
			slotPropertiesTrackingMiddleware,
			slotBiddersTrackingMiddleware,
			slotBillTheLizardStatusTrackingMiddleware,
			slotTrackingMiddleware,
		],
		bidderTrackingMiddlewares: [bidderTrackingMiddleware],
	}).forEach((binder) => container.bind(binder));

	return container;
}
