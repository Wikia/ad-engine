import {
	AdsMode,
	BaseContextSetup,
	DynamicSlotsSetup,
	SlotsContextSetup,
	TargetingSetup,
	TemplatesSetup,
	TrackingSetup,
} from '@platforms/shared';
import {
	InstantConfigCacheStorage,
	InstantConfigService,
	slotPropertiesTrackingMiddleware,
	slotTrackingMiddleware,
} from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { F2AdsMode } from './modes/f2-ads.mode';
import { F2_ENV, F2Environment } from './setup-f2';
import { F2SlotsContextSetup } from './setup/context/slots/f2-slots-context.setup';
import { F2TargetingSetup } from './setup/context/targeting/f2-targeting.setup';
import { F2DynamicSlotsSetup } from './setup/dynamic-slots/f2-dynamic-slots.setup';
import { F2BaseContextSetup } from './setup/f2-base-context.setup';
import { F2TemplateSetup } from './templates/f2-template.setup';
import { getF2StateBinder } from './utils/f2-state-binder';

export async function setupF2Ioc(f2Env: F2Environment): Promise<Container> {
	const container = new Container();

	container.bind(InstantConfigService).value(await InstantConfigService.init());
	container.bind(InstantConfigCacheStorage).value(InstantConfigCacheStorage.make());
	container.bind(BaseContextSetup).to(F2BaseContextSetup);
	container.bind(SlotsContextSetup).to(F2SlotsContextSetup);
	container.bind(TargetingSetup).to(F2TargetingSetup);
	container.bind(DynamicSlotsSetup).to(F2DynamicSlotsSetup);
	container.bind(TemplatesSetup).to(F2TemplateSetup);
	container.bind(AdsMode).to(F2AdsMode);
	container.bind(F2_ENV).value(f2Env);
	container.bind(getF2StateBinder());

	TrackingSetup.provideMiddlewares({
		slotTrackingMiddlewares: [slotPropertiesTrackingMiddleware, slotTrackingMiddleware],
	}).forEach((binder) => container.bind(binder));

	return container;
}
